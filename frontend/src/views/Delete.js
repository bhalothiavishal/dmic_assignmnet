import React, { useState, useEffect } from 'react';
import Helper from '../constants/helper';
import apiUrl from '../constants/apiPath';
import Swal from "sweetalert2";

const Delete = (props) => {
    const [item, setItem] = useState({});

    const deleteItem = async () => {
        let SwalConfig = Helper.SwalConfig("You want to delete order");
        const result = await Swal.fire(SwalConfig);
        if (result.value) {
            let postJson = { id: item.id };
            let path = apiUrl.delete_order+"/"+item._id;
            const fr = await Helper.delete(path);
            const res = await fr.response.json();
            if (fr.status === 200) {
                if (res.success) {
                    props.refreshData();
                    alert(res.msg);
                } else {
                    alert(res.msg);
                }
            } else {
                alert(res.error);
            }
        }
    };
    useEffect(() => {
        setItem(props.item);
    }, [props.item]);

    return (
        <button onClick={(e) => { deleteItem() }} className="btn btn-warning btn-sm mr-2" type="button" title="Delete">
            Delete
        </button>
    );
}

export default Delete;





