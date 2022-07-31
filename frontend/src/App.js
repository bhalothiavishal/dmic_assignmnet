import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';

const Home = React.lazy(() => import('./views/Home'));
const Orders = React.lazy(() => import('./views/Orders'));
const AddOrder = React.lazy(() => import('./views/AddOrder'));
const EditOrder = React.lazy(() => import('./views/EditOrder'));

function App() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route exact path="/" name="Home Page" element={<Home />} />
          <Route exact path="/orders" name="Orders List" element={<Orders />} />     
          <Route exact path="/create-order" name="Create Order" element={<AddOrder />} />     
          <Route exact path="/edit-order/:id" name="Edit order" element={<EditOrder />} />               
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
