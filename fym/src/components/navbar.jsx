import React from "react";
import './navbar.css'
import {Link} from "react-router-dom";
import {ShoppingCart,Heart,User} from 'phosphor-react'
import { LuLogOut } from "react-icons/lu";

export const Navbar = () =>{
    return (
        <div className="navbar links">
            
                <div>
                <Link to="/">Frame Your Memories</Link>
                </div>
                <div className="linkys">
                <Link to="/customer/shop" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>Shop</Link>
                <Link to='/customer/cart'> <ShoppingCart size={30}/></Link>
                <Link to='/customer/wishlist'> <Heart size={28}/></Link>
                <Link to='/customer/User'> <User size={28}/></Link>
                <Link className="last" to='/customer/orders'> Orders</Link>
                <Link to='/customer/logout'> <LuLogOut /></Link>

                </div>
            
        </div>
    );
}