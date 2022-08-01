import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { Card, Button, CardBody, CardHeader, Col, Row, Form, Input, FormGroup } from 'reactstrap';
import Helper from '../constants/helper';
import apiUrl from '../constants/apiPath';
import moment from "moment";
import _ from "lodash";
import Delete from './Delete';

// import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
const Nav = React.lazy(() => import('../DefaultLayout/Nav'));
const Header = React.lazy(() => import('../DefaultLayout/Header'));

function Orders() {
    // const alert = useAlert();
    const [orders, setOrders] = useState([]);
    const [totalitems, setTotalItems] = useState('');
    const [activepage, setActivePage] = useState(1);
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [serachstatus, setSerachStatus] = useState('');
    const [keywords, setKeyWords] = useState('');
    const [isserach, setIsserach] = useState(false);
    const [query, setQuery] = useState({});

    const pageData = async (page = activepage) => {
        const itemsPerPage = 10;
        let path;
        setActivePage(page)
        query["page"] = page
        query["itemsPerPage"] = itemsPerPage
        let queryString = Helper.serialize(query);
        path = apiUrl.get_orders + `?${queryString}`;
        getData(path)
    };
    const handleSearching = async () => {
        setIsserach(true);
        const itemsPerPage = 10;
        let path;
        let page = 1;
        setActivePage(page)

        let queries = {
            page: page,
            itemsPerPage: itemsPerPage,
            keyword: keywords,
            start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
            end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
            status: serachstatus
        }

        setQuery(queries)
        path = apiUrl.get_orders + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
        getData(path)
    };
    const getData = async (path) => {
        const fr = await Helper.get(path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setOrders(res.results.docs || []);
                setTotalItems(res.results.totalDocs);
                setIsserach(false);
            } else {
                // alert.error(res.msg);
                setIsserach(false);
            }
        } else {
            // alert.error(res.error);
            setIsserach(false);
        }
    }
    const resetSearch = async () => {
        let path = apiUrl.get_orders + '?page=1&itemsPerPage=10';
        getData(path)
    }
    const onReset = (e) => {
        setStartDate('');
        setEndDate('');
        setKeyWords('');
        setSerachStatus('');
        resetSearch();
        setActivePage(1);
    };

    useEffect(() => {
        pageData();
    }, [])

    return (
        <div className="container-full">
            <Header title="Orders Page" />
            <div className="row mt-3">
                <Nav />
                <div className="col-md-9">
                    <div className="multipal-searching">
                        <Row>
                            <Col xl={9}>
                                <Form>
                                    <Row>
                                        <Col md={6} sm={6}>
                                            <FormGroup className="mb-xl-0">
                                                <Input type="text" placeholder="Key |vehicle |technician" value={keywords} className="form-control"
                                                    onChange={(e) => { setKeyWords(e.target.value) }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} sm={6}>
                                            <FormGroup className="mb-xl-0">
                                                <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                                                    onChange={(e) => { setSerachStatus(e.target.value) }} >
                                                    <option value="">Select Order Status</option>
                                                    <option value='active'>Active</option>
                                                    <option value='inactive'>Inactive</option>
                                                </select>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col xl={3} className="text-xl-right ">
                                <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                                <button className="btn btn-success ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                            </Col>
                        </Row>
                    </div>
                    <div className="row mt-5">
                        <Link to={{ pathname: `/create-order` }} className="btn-link">
                            <button className="btn btn-warning btn-sm mr-2" type="button" title="Create order">
                                Create Order
                            </button>
                        </Link>
                    </div>
                    <div className="mt-2">
                        <Table striped bordered={true} hover responsive="lg">
                            <thead>
                                <tr>
                                    <th>Order No</th>
                                    <th>Vechile Make </th>
                                    <th>Vechile VIN </th>
                                    <th>Key Name</th>
                                    <th>Key Price</th>
                                    <th>Technician </th>
                                    <th>Created Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item, i) => {
                                    return <tr key={i} >
                                        <td>{item.order_no}</td>
                                        <td>{item.vehicle_id.make}</td>
                                        <td>{item.vehicle_id.vin}</td>
                                        <td>{item.key_id.name}</td>
                                        <td>{item.key_id.price}</td>
                                        <td>{item.technician_id.first_name + " " + item.technician_id.last_name}</td>
                                        <td>{moment(item.created_at).format('LLL')} </td>
                                        <td>{item.status}</td>
                                        <td className="text-align-center">

                                            <div>
                                                <Link to={{ pathname: `/edit-order/${item._id}` }} className="btn-link">
                                                    <button className="btn btn-warning btn-sm mr-2" type="button" title="Delete">
                                                        Edit
                                                    </button>
                                                </Link>

                                                <Delete item={item} refreshData={pageData} />
                                                {/* <View item={item} /> */}

                                            </div>

                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div >
                    {!_.isEmpty(orders) && <div className="show-pagination technician-page">
                        <Pagination
                            activeClass={""}
                            activeLinkClass={"page-link active"}
                            itemClass={"page-item"}
                            linkClass={"page-link"}
                            activePage={activepage}
                            itemsCountPerPage={10}
                            totalItemsCount={totalitems}
                            pageRangeDisplayed={4}
                            prevPageText="Previous"
                            nextPageText="Next"
                            firstPageText="<"
                            lastPageText=">"
                            onChange={pageData}
                        />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Orders;