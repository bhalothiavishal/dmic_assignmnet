import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../constants/helper';
import apiUrl from '../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
const Nav = React.lazy(() => import('../DefaultLayout/Nav'));
const Header = React.lazy(() => import('../DefaultLayout/Header'));

const EditOrder = (props) => {
  let params = useParams();
  let navigate = useNavigate();
  const { register, handleSubmit, errors, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [key_id, setKey_id] = useState("");
  const [vehicle_id, setVehicle_id] = useState("");
  const [tech_id, setTech_id] = useState("");
  const [orderdesc, setorderdesc] = useState("");
  const [keysData, setKeysData] = useState([]);
  const [vechiles, setVechile] = useState([]);
  const [technicians, setTechnician] = useState([]);

  const onSubmit = async data => {
    setLoading(true);
    let postJson = { order_no: orderNo, vehicle_id: vehicle_id, key_id: key_id, technician_id: tech_id, order_desc: orderdesc };
    let path = apiUrl.update_order + "/" + params.id;
    const fr = await Helper.put(postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        navigate('/orders', { replace: true });
        alert(res.msg);
      } else {
        alert(res.msg);
        setLoading(false);
      }
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  const getData = async () => {
    const fr = await Helper.get(apiUrl.get_key_technician);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setKeysData(res.keysList);
        setTechnician(res.techniciansList);
      }
    }
  }

  const getOrderData = async () => {
    const fr = await Helper.get(apiUrl.get_order + '/' + params.id);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setOrderNo(res.results.order_no);
        setKey_id(res.results.key_id);
        handleKeyChange(res.results.key_id);
        setVehicle_id(res.results.vehicle_id)
        setTech_id(res.results.technician_id);
        setorderdesc(res.results.order_desc);
      }
    }
  }

  const handleKeyChange = async (keyid) => {
    setKey_id(keyid);
    const fr = await Helper.get(apiUrl.get_vehicles + "/" + keyid);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setVechile(res.results);
      }
    }
  }

  useEffect(() => {
    getData();
    getOrderData();
  }, []);

  return (
    <div className="container-full">
      <Header title="Orders Page" />
      <div className="row mt-3">
        <Nav />
        <div className="col-md-9">
          <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <Card >
                <CardHeader>
                  <CardTitle className="text-info"><h4>Edit Order</h4></CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label className={'col-md-2 pull-left mt-2'}>Order Number</Label>
                        <input type="text" name="order_no" placeholder="Order Number" autoComplete="off"
                          className="form-control col-md-8" defaultValue={orderNo} onChange={(e) => { setOrderNo(e.target.value) }} />
                        {/* {errors.title && <p className="text-danger marginmessage">Cricket Category Title is required</p>} */}
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label className={'col-md-2 pull-left mt-2'}>Select Key</Label>
                        <select className={"form-control col-md-8"} value={key_id} name="key_id" onChange={(e) => handleKeyChange(e.target.value)}>
                          <option value={""}>Select Key</option>
                          {
                            keysData.map((type, index) => {
                              return <option key={index} value={type._id}>{type.name}</option>
                            })
                          }
                        </select>

                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label className={'col-md-2 pull-left mt-2'}>Select Vechile</Label>
                        <select className={"form-control col-md-8"} value={vehicle_id} name="vehicle_id" onChange={(e) => { setVehicle_id(e.target.value) }}>
                          <option value={""}>Select Vechile</option>
                          {
                            vechiles.map((type, index) => {
                              return <option key={index} value={type._id}>{type.make + "-" + type.model + " ( " + type.vin + " )"}</option>
                            })
                          }
                        </select>

                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label className={'col-md-2 pull-left mt-2'}>Select Technician</Label>
                        <select className={"form-control col-md-8"} value={tech_id} name="tech_id" onChange={(e) => { setTech_id(e.target.value) }}>
                          <option value={""}>Select Technician</option>
                          {
                            technicians.map((type, index) => {
                              return <option key={index} value={type._id}>{type.last_name + " " + type.first_name}</option>
                            })
                          }
                        </select>

                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label className={'col-md-2 pull-left mt-2'}>Order Description</Label>
                        <textarea name="description" placeholder="Small Description..." value={orderdesc} onChange={(e) => { setorderdesc(e.target.value) }} autoComplete="off" className="form-control col-md-8"></textarea>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                </CardFooter>
              </Card>
            </form>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}

export default EditOrder;
