const mongoose = require('mongoose');
var _ = require('lodash');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config/config');

const UsersSchema = mongoose.Schema({
    user_type: { type: String },
    first_name: String,
    last_name: String,
    username: { type: String },
    email: { type: String, unique: true },
    country_code: String,
    phone: { type: String, unique: true },
    dob: String,
    gender: String,
    address: String,
    city: String,
    pin_code: String,
    state: String,
    country: String,
    password: String,
    image: { type: String },
    otpverified: { type: Boolean, default: 0 },
    emailverified: { type: Boolean, default: 0 },
    device_type: String,
    device_id: String,
    token: String,
    status: { type: String, enum: config.status },
}, {
    timestamps: { created_at: 'createdAt', updated_at: 'updatedAt' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

UsersSchema.plugin(mongoosePaginate);
UsersSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Users', UsersSchema);