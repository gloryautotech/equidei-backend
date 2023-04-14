const jwt = require('jsonwebtoken');
const UserModel = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// keep strings in lowercase
const allowedRoutes = [
	'/api/v1/otp', '/api/auth/login', '/api/auth/signup','/api/auth/verifyOTP'
];

const protect = catchAsync(async (req, res, next) => {
	if (allowedRoutes.includes(req.path.toLowerCase())) return next();

	const authHeader = req.headers.authorization;

	if (!authHeader) return next(new ErrorResponse('Not authorized', 401));

	const token = authHeader.split(' ')[1];

	if (!token) return next(new ErrorResponse('Not authorized', 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) return next(new ErrorResponse('Invalid token', 401));

	const cacheKey = `auth:user:${decoded.id}`;
	const cachedUser = await redisClient.get(cacheKey);

	if (cachedUser) {
		req.user = JSON.parse(cachedUser);
		return next();
	}

	const selOpts = {
		profileStatus: 1,
		role: 1,
		username: 1,
		mobile: 1,
		email: 1,
		name: 1,
	};

	const user =
		(await UserModel.findById(decoded.id)
			.select(selOpts)
			.populate('role')
			.lean());

	if (!user) return next(new ErrorResponse('Invalid token', 401));

	if (user.profileStatus !== 'APPROVED') {
		return next(new ErrorResponse('Profile is blocked', 403));
	}

	req.user = user;

	await redisClient.set(cacheKey, JSON.stringify(user), {
		EX: 60 * 10, // 10 min of expiration
	});

	next();
});

module.exports = protect;
