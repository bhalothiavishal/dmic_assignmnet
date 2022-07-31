import React, { useEffect, useState } from "react";
import { ThermometerHalf, BatteryHalf, Trash2Fill } from 'react-bootstrap-icons';
const Header = React.lazy(() => import('../DefaultLayout/Header'));
const Nav = React.lazy(() => import('../DefaultLayout/Nav'));



function Home() {

    const [allData, setAllData] = useState([]);
    const [kegIds, setKegIds] = useState([]);
    const [mapData, setMapData] = useState();
    const [currentKegId, setCurrentKegId] = useState("");

    const getkegIdList = () => {
        setKegIds(allData.map((v) => v.kegtrackerId));
    }

    const getKegData = (e) => {
        let kegid = e.target.value;
        setCurrentKegId(kegid);
        setMapData(allData.find((val) => val.kegtrackerId == kegid))
    }
    useEffect(() => {
        getkegIdList();
    }, [])

    return (
        <div className="container-full">
            <Header title="Home Page" />
            <div className="row mt-3 ">
                <Nav />
                <aside className="col-md-9 mt-5">
                   <h1>Welcome On Dminc home page</h1>                      
                </aside>
            </div >

        </div >
    )
}

export default Home;