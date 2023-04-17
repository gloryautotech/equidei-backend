const jwt = require('jsonwebtoken');
const UserModel = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// keep strings in lowercase
const allowedRoutes = [
	'/api/v1/otp', '/api/auth/login', '/api/auth/signup','/api/auth/verifyotp',"/api/auth/sendotp",'/api/auth/checkemail'
];

const protect = catchAsync(async (req, res, next) => {
	if (allowedRoutes.includes(req.path.toLowerCase())) return next();

	const authHeader = req.headers.authorization;

	if (!authHeader) return next(new ErrorResponse('Not authorized', 401));

	const token = authHeader.split(' ')[1];

	if (!token) return next(new ErrorResponse('Not authorized', 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) return next(new ErrorResponse('Invalid token', 401));


	const selOpts = {
		profileStatus: 1,
		role: 1,
		username: 1,
		mobile: 1,
		email: 1,
		name: 1,
	};

	const user =
		(await UserModel.findOne({_id:decoded.id})
			// .select(selOpts)
			.lean());

	if (!user) return next(new ErrorResponse('Invalid token', 401));


	req.user = user;

	next();
});

module.exports = protect;
