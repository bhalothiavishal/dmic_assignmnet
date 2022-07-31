const bcrypt = require('bcryptjs');
const saltRounds = 10;
const fs = require('fs');
const { Validator } = require('node-input-validator');
const { ObjectId } = require('mongodb');
var util = require('util');
const moment = require("moment");
const Helper = require("../helpers/helpers")

// Models
const Users = require('../models/users.model');
const Orders = require('../models/orders.model');
const Keys = require('../models/keys.model');
const Vehicles = require('../models/vehicles.model');
const Technicians = require('../models/technicians.model');


var privateKEY = fs.readFileSync('./config/private.key', 'utf8');
const config = require('../config/config');
const Messages = require('../helpers/messages');
var jwt = require('jsonwebtoken');
var _ = require('lodash');


exports.get_keys_vehicle_technicians = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    try {
        const masterData = Promise.all([
            await Technicians.find({}).sort({ first_name: 1 }),
            await Vehicles.find({}),
            await Keys.find({})
        ])
        masterData.then(async (result) => {
            response.success = true;
            response.msg = Messages.ALL_MASTREDATA_SUCCESS;
            response.techniciansList = result[0];
            response.vehiclesList = result[1];
            response.keysList = result[2];
            return res.json(response);

        });
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.get_vehicle_byId = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    try {
        console.log(req.params.id)
        const vehiclesList = await Vehicles.find({ key_id: req.params.id });
        console.log(vehiclesList)

        response.success = true;
        response.msg = Messages.ALL_MASTREDATA_SUCCESS;
        response.results = vehiclesList;
        return res.json(response);
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.login = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], "isDeactivate": 0, 'result': {} };
    let params = req.body;
    let constraints = { email: "required", password: 'required', user_type: 'required', };

    try {
        let v = new Validator(params, constraints);
        let matched = await v.check();
        if (!matched) {
            response['msg'] = 'Required fields missing';
            response['errors'] = v.errors;
            return res.json(response);
        }

        // let  condition = { $or: [{ email: params.email }, { country_code: params.country_code, phone: params.email }] }
        let condition = (params.user_type === 'admin')
            ? { $or: [{ email: params.email.toLowerCase() }, { country_code: params.country_code, phone: params.email }], user_type: { $nin: ["user"] } }
            : { $or: [{ email: params.email.toLowerCase() }, { phone: params.email }], user_type: params.user_type, status: { "$ne": "deleted" } }
        console.log("params", params);
        console.log("condition", condition);
        let user = await Users.findOne(condition);

        if (user) {
            let passwordHashed = user.password.replace('$2y$', '$2a$');
            let isValid = await bcrypt.compare(params.password, passwordHashed);
            if (isValid) {
                if (user.status == 'inactive') {
                    response['msg'] = 'Your account is inactive.Please contact to admin.';
                    response['isDeactivate'] = 1;
                    return res.json(response);
                }
                response['msg'] = Messages.LOGIN_SUCCESS;
                var { _id, username, user_type, permissions } = user;
                const token = jwt.sign({ _id, user_type, username, permissions }, privateKEY, config.signOptions);
                let updateUser = {
                    token: token,
                    device_id: params.device_id,
                    device_type: params.device_type,
                    permissions: user.permissions
                }

                await Users.findOneAndUpdate({ _id: _id, user_type: user_type }, updateUser);
                response['success'] = true;
                response['result'] = user;
                response['token'] = token;
                return res.json(response);

            } else {
                response['msg'] = 'Sorry!! Email password combination mismatched';
                return res.json(response);
            }
        } else {
            response['msg'] = 'Sorry!! No account found with provided email';
            return res.json(response);
        }
    } catch (err) {
        response['msg'] = err.message;
        return res.json(response);
    }
}

exports.order_listing = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    try {
        let sortOptions = {};
        sortOptions["createdAt"] = -1;
        let options = {
            page: Number(req.query.page || process.env.defaultPage),
            limit: Number(req.query.itemsPerPage || process.env.defaultPageSize),
            sort: sortOptions
        };
        let conditions = {};
        conditions = Helper.setSearchParams(conditions, req.query);
        options.populate = [{ path: 'key_id', select: 'name price' }, { path: 'vehicle_id', select: 'make vin' }, { path: 'technician_id', select: 'first_name last_name' }];
        const allOrdersList = await Orders.paginate(conditions, options);
        response.success = true;
        response.msg = Messages.ALL_USERS_SUCCESS;
        response.results = allOrdersList;
        return res.json(response);
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.create_order = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    var { order_no, key_id, vehicle_id, technician_id, order_desc } = req.body;
    let params = { order_no, key_id, vehicle_id, technician_id, order_desc };
    let constraints = { order_no: "required", key_id: 'required', vehicle_id: "required", technician_id: 'required', order_desc: 'required' };

    let v = new Validator(params, constraints);
    let matched = await v.check();
    if (!matched) {
        response['msg'] = 'Required fields missing';
        response['errors'] = v.errors;
        return res.json(response);
    }

    try {
        const isExistsOrder = await Orders.count({ order_no: order_no, status: { $ne: "deleted" } });
        if (isExistsOrder) {
            response['msg'] = 'Order No. already exist';
            response['errors'] = 'Order No. already exist';
            return res.json(response);
        }
        let createObj = {
            order_no: order_no,
            key_id: key_id,
            vehicle_id: vehicle_id,
            technician_id: technician_id,
            order_desc: order_desc,
            status: "active"
        };

        const OrderCreated = await Orders.create(createObj);
        if (!_.isEmpty(OrderCreated)) {
            response.success = true;
            response.msg = Messages.ORDER_CREATED_SUCCESS;
            response.results = OrderCreated;
        } else {
            response.msg = Messages.ORDER_CREATED_ERROR;
        }

        return res.json(response);
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.get_order = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    let order_id = req.params.id;
    try {
        const isExistsOrder = await Orders.findOne({ _id: order_id, status: { $ne: "deleted" } });
        if (!isExistsOrder) {
            response['msg'] = 'Order not exist';
            response['errors'] = 'Order not exist';
            return res.json(response);
        } else {
            response.success = true;
            response.msg = Messages.ORDER_UPDATED_SUCCESS;
            response.results = isExistsOrder;
            return res.json(response);
        }
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.update_order = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    let order_no = req.params.id;
    console.log(order_no, req.body);
    var { key_id, vehicle_id, technician_id, order_desc } = req.body;
    let params = { key_id, vehicle_id, technician_id, order_desc };
    let constraints = { key_id: 'required', vehicle_id: "required", technician_id: 'required', order_desc: 'required' };

    let v = new Validator(params, constraints);
    let matched = await v.check();
    if (!matched) {
        response['msg'] = 'Required fields missing';
        response['errors'] = v.errors;
        return res.json(response);
    }

    try {
        const isExistsOrder = await Orders.findOne({ _id: order_no, status: { $ne: "deleted" } });
        if (!isExistsOrder) {
            response['msg'] = 'Order not exist';
            response['errors'] = 'Order not exist';
            return res.json(response);
        }
        let createObj = {
            key_id: key_id,
            vehicle_id: vehicle_id,
            technician_id: technician_id,
            order_desc: order_desc,
        };

        const OrderUpdated = await Orders.findOneAndUpdate({ _id: order_no }, createObj);
        if (!_.isEmpty(OrderUpdated)) {
            response.success = true;
            response.msg = Messages.ORDER_UPDATED_SUCCESS;
            response.results = OrderUpdated;
        } else {
            response.msg = Messages.ORDER_CREATED_ERROR;
        }

        return res.json(response);
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}

exports.delete_order = async (req, res) => {
    var response = { "success": false, "msg": "Invalid Request", "errors": [], 'results': [] };
    let order_id = req.params.id;
    try {
        const isExists = await Orders.findOne({ _id: order_id });
        if (!_.isEmpty(isExists)) {
            await Orders.findByIdAndUpdate({ _id: order_id, status: { $ne: 'deleted' } }, { status: 'deleted' });
            response.success = true;
            response.msg = Messages.ORDER_DELETED_SUCCESS;
        } else {
            response.msg = Messages.ORDER_DELETED_ERROR;
        }
        return res.json(response);
    } catch (err) {
        response.msg = err.message;
        return res.json(response);
    }
}







