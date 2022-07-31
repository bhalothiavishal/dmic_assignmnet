const mongoose = require('mongoose');
var _ = require('lodash');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config/config');

const VehicleSchema = mongoose.Schema({
    year: Number,
    make: String,
    model: String,
    vin: Number,
    key_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Keys' },
}, {
    timestamps: { created_at: 'createdAt', updated_at: 'updatedAt' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

VehicleSchema.plugin(mongoosePaginate);
VehicleSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Vehicles', VehicleSchema);