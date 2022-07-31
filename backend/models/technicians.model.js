const mongoose = require('mongoose');
var _ = require('lodash');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config/config');

const TechniciansSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    truck_no: Number
}, {
    timestamps: { created_at: 'createdAt', updated_at: 'updatedAt' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

TechniciansSchema.plugin(mongoosePaginate);
TechniciansSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Technicians', TechniciansSchema);