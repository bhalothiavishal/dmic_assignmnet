const mongoose = require('mongoose');
var _ = require('lodash');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config/config');

const OrdersSchema = mongoose.Schema({
    order_no: Number,
    key_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Keys' },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles' },
    technician_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Technicians'},
    order_desc: String,
    status: { type: String, enum: config.status },
}, {
    timestamps: { created_at: 'createdAt', updated_at: 'updatedAt' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

OrdersSchema.plugin(mongoosePaginate);
OrdersSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Orders', OrdersSchema);