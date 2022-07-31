const mongoose = require('mongoose');
var _ = require('lodash');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config/config');

const KeysSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number
}, {
    timestamps: { created_at: 'createdAt', updated_at: 'updatedAt' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

KeysSchema.plugin(mongoosePaginate);
KeysSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Keys', KeysSchema);