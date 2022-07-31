var express = require('express');
var router = express.Router();
var VerifyToken = require("../config/VerifyToken");

const orders = require("../controllers/orders.controller.js");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome on Dminc' });

});

router.post("/login", orders.login);


/* GET keys,vehicles,technicians listing. */
router.get('/get_master_data', VerifyToken, orders.get_keys_vehicle_technicians);
router.get('/get_vehicles/:id', VerifyToken, orders.get_vehicle_byId);

/* Orders CURD */
router.post("/create-order", VerifyToken, orders.create_order);
router.get("/get-order/:id", VerifyToken, orders.get_order);
router.get("/list-orders", VerifyToken, orders.order_listing);
router.put("/update-order/:id", VerifyToken, orders.update_order);
router.delete("/delete-order/:id", VerifyToken, orders.delete_order);


module.exports = router;
