const crypto = require('crypto');
const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const orderModel = require("../model/razorpayPayment")
const assetModel = require("../model/asset")


exports.CreateOrder = catchAsync(async (req, res, next) => {
	const assetId = req.body.assetId;
	const instance = new Razorpay({
		key_id: process.env.key_id,
		key_secret: process.env.key_secret,
	});
	const options = {
		amount: req.body.amount,
		currency: req.body.currency ? req.body.currency : 'INR',
		receipt: crypto.randomBytes(10).toString('hex'),
	};
	options.amount = Math.round(options.amount);
	instance.orders.create(options, async (error, order) => {
		if (error) {
			return res.status(500).json(error);
		}
		let findAsset = await assetModel.findById(assetId)
		order.assetId = assetId
		order.userId = findAsset.userId
		order.order_id=order.id
		await orderModel.create(order)
		res.status(200).json({ data: order });
	});
});


exports.VerifyOrder = catchAsync(async (req, res, next) => {
	const { order_id, payment_id, signature, assetId } = req.body;
	const sign = `${order_id}|${payment_id}`;
	const expectedSign = crypto
		.createHmac('sha256', process.env.key_secret)
		.update(sign.toString())
		.digest('hex');
	if (signature === expectedSign) {
		await orderModel.findOneAndUpdate({ order_id: req.body.order_id }, [
			{
				$set: {
					amount_paid: '$amount',
					status: 'Paid',
					payment_date: Date(),
					razorpay_payment_id: payment_id,
				},
			},
		]);
		if (req.body.assetId) {
			await orderModel.findByIdAndUpdate(assetId, {
				'payment.lastPayDone': Date(),
			});
		}
		res.json({ success: true, message: 'Payment has been verified' });
	} else {
		await orderModel.findOneAndUpdate({ order_id: req.body.order_id }, [
			{
				$set: { status: 'Attempted' },
			},
		]);
		res.json({ success: false, message: 'Payment verification failed' });
	}
});