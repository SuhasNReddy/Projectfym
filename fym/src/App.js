import React, { useState } from 'react';

import './App.css';



import {BrowserRouter,Route,Switch} from 'react-router-dom';

import Admindashboard from './component/Admindashboard';

import LoginSignup from './LoginSignup/LoginSignup';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import {Redirect as Navigate} from 'react-router-dom'


import BusinessApp from './BusinessApp';

import HomeHeader from './component/HomeHeader';
import Home from './component/Home';
import HomeFooter from './component/HomeFooter';
import Adminlogin from './component/Adminlogin';
// import Admindashboard from './component/Admindashboard';
import Contact from './component/ContactUs';
import About from './component/About';



import {Navbar} from './components/navbar';
import {Shop} from './pages/shop/shop';
import {Cart} from './pages/cart/cart';
import Wishlist from './pages/wishlist/wishlist';
import Checkout from './pages/checkout/checkout';
import User from './pages/user/User';
import CustomerOrders from './pages/orders/orders';
import {CustomerLoginSignup} from './components/LoginSignup/LoginSignup';
import { useDispatch, useSelector } from 'react-redux';
// import ProductDesc from './pages/desc/productDesc';
import ProductDesc from './pages/desc/productDesc';


function App(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const customerUser = useSelector((state) => state.customerUser);
  const [totalAmountCustomer,settotalAmountCustomer]=useState(0);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('sotr',storedUser);
    const storedCustomerUser = JSON.parse(localStorage.getItem('customerUser'));

    if (storedUser) {
      props.login(storedUser);
    }

    if (storedCustomerUser) {
      dispatch({ type: "CUSTOMER_LOGIN", customerUser: storedCustomerUser });
    }
  }, []);

  console.log(user, 'user', 'App');
  console.log(customerUser, 'customerUser', 'App');
  
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route exact path="/">
              <HomeHeader></HomeHeader>
              <Home></Home>
              <HomeFooter></HomeFooter>
          </Route>
          <Route path="/admin">
            <Switch>
                <Route exact path="/admin/">
                  {/* <HomeHeader></HomeHeader> */}
                    <Adminlogin></Adminlogin>
                    <HomeFooter></HomeFooter>
                </Route>
                <Route path='/admin/Admindashboard'>
                  <Admindashboard></Admindashboard>
                  <Switch>
                    <Route path='/admin/Admindashboard/dashboard' >
                     <Admindashboard></Admindashboard>
                    </Route>
                  </Switch>
                </Route>              
            </Switch>
          </Route>

          <Route exact path="/businessdashboard">
            {props.user  ? 
            <BusinessApp></BusinessApp>
            : <Navigate to="/business"></Navigate>}
          </Route>

          <Route exact path="/business">
                  {props.user ? <Navigate to="/businessdashboard" /> : <>
                    {/* <HomeHeader ></HomeHeader> */}
                    <LoginSignup></LoginSignup>
                    <HomeFooter></HomeFooter>
                  </>}
          </Route>
              
          <Route exact path="/customer">
            {/* <Navbar></Navbar> */}
          <CustomerLoginSignup></CustomerLoginSignup>
          <HomeFooter></HomeFooter>
          </Route>
          <Route exact path="/customer/shop">
          <Navbar></Navbar>
          <Shop/>
          <HomeFooter></HomeFooter>
          </Route>
          <Route exact path="/customer/product/:id">
          <Navbar></Navbar>
            <ProductDesc />
            
          </Route>
          <Route exact path="/customer/cart">
          <Navbar></Navbar>
          <Cart settotalAmountCustomer={settotalAmountCustomer} ></Cart>
          <HomeFooter></HomeFooter>
          </Route>
          <Route exact path="/customer/wishlist">
          <Navbar></Navbar>
          <Wishlist></Wishlist>
          <HomeFooter></HomeFooter>
          </Route>
          
          <Route exact path="/customer/User">
          <Navbar></Navbar>
          <User></User>
          </Route>

          <Route exact path="/customer/checkout">
          <Navbar></Navbar>
          <Checkout totalAmountCustomer={totalAmountCustomer}></Checkout>
          </Route>
          
          <Route exact path="/customer/orders">
          <Navbar></Navbar>
          <CustomerOrders></CustomerOrders>
          </Route>

          

          <Route path="/contact">
            <HomeHeader></HomeHeader>
              <Contact></Contact>
              <HomeFooter></HomeFooter>
          </Route>
          
          <Route path="/about">
            {/* <HomeHeader></HomeHeader> */}
              <About></About>
              <HomeFooter></HomeFooter>
          </Route>
        </Switch>
        
      </div>
      
     </BrowserRouter>
      
  );
}

const mapStateToProps=(state)=>{
  return state;
}

const mapDispathToProps=(Dispatch)=>{
  return {
    login:(user)=>{Dispatch({type:"SIGN_UP",user})}
  }
}

export default connect(mapStateToProps,mapDispathToProps)(App);
