import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarMinus, faCameraRetro, faUtensils, faShoppingCart, faPlus } from '@fortawesome/free-solid-svg-icons';
import css from  './BusinessApp.module.css';
import { useState } from 'react';
import LocationComponent from './LocationComponent';
import ProductList from './component/ProductList';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import BusinessInterface1 from './BusinessInterface1';
import BusinessOrders from './component/BusinessOrders';
import BusinessStatus from './component/BusinessStatus';

const BusinessApp = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('products'); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleClick=()=>{
    props.logout();
    localStorage.removeItem('user');
    
  }

  const handleSearch = () => {
    
    filter(searchTerm);
  };

  const filter = (cat) => {
    setCurrentView("products");
    const allProducts = document.querySelectorAll(".suhas-product-list .encapsulated");
  
    if (allProducts) {
      allProducts.forEach(product => {
        const category = product.getAttribute("data-cat");
        const name = product.getAttribute("data-name");
        
        const regex = new RegExp(cat, 'i'); // 'i' makes the match case-insensitive
        console.log(name,"sub",regex.test(cat),cat)
  
        if (cat === "all" || cat===category || regex.test(name)) {
          product.style.display = "flex";
        } else {
          product.style.display = "none";
        }
      });
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'locations':
        return <LocationComponent />;
      case 'products':
        return <ProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />;
      case 'create' : 
      return <BusinessInterface1></BusinessInterface1>;
      case 'orders':
        return <BusinessOrders userToken={props.user}></BusinessOrders>
      case 'status':
        return <BusinessStatus userToken={props.user}></BusinessStatus>
      default:
        return <LocationComponent />;
    }
  }

  

  return (
    
        <div className={css['business-app']}>
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit'}} className={`${css['business-logo']} ${css['fym-header']}`}> Fym</NavLink>
        <div className={`${css['business-searchbar']} ${css['fym-header']}`}>
          <div className={css['search-bar-container']}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div style={{color:'#5C4033'}} className={`${css['business-name']} ${css['business-header']}`}>Welcome {props.user && props.user.email}</div>
        <div style={{color:'#5C4033'}} className={`${css['business-products']} ${css['business-header']}`} onClick={()=>setCurrentView('orders')} >Orders</div>
        <div style={{color:'#5C4033'}} className={`${css['business-locations']} ${css['business-header']}`} onClick={()=>setCurrentView("locations")} >Locations</div>
        <div style={{color:'#5C4033'}} className={`${css['business-status']} ${css['business-header']}`} onClick={()=>setCurrentView("status")} >Status</div>
        <button style={{color:'#5C4033'}} className={`${css['business-logout']} ${css['business-header']}`} onClick={handleClick}>Logout</button>
        <div style={{border:'3px solid #088F8F'}} className={`${css['business-sidebar']} ${css['glass-container']}`}>
          <ul>
            <li className={css['icon-item']} style={{color:'#9A2A2A'}}>
              <FontAwesomeIcon icon={faShoppingCart} className={css['icon']} style={{height:'30px',width:'30px'}} onClick={()=>{
                setSelectedProduct(null);
                filter('all');
                }} />
             
            </li>
            <li className={css['icon-item']} style={{color:'#89CFF0'}}>
              <FontAwesomeIcon icon={faUtensils} style={{height:'30px',width:'30px'}} onClick={()=>{
                setSelectedProduct(null);
                filter("food")
                }} className={css['icon']} />
            </li>
            <li className={css['icon-item']} style={{color:'#800080'}}>
              <FontAwesomeIcon icon={faCalendarMinus} style={{height:'30px',width:'30px'}} onClick={()=>{
                setSelectedProduct(null);
                filter('event')
                }} className={css['icon']} />
            </li>
            <li className={css['icon-item']} style={{color:'#F33A6A'}}>
            <FontAwesomeIcon icon={faCameraRetro} style={{height:'30px',width:'30px'}} onClick={()=>{
                setSelectedProduct(null);
                filter('photography')
              }}
               className={css['icon']} />
            </li>
            <li className={css['icon-item']} style={{color:'#FDDA0D'}}>
              <FontAwesomeIcon icon={faPlus} style={{height:'30px',width:'30px'}} onClick={()=>setCurrentView("create")} className={`${css['icon']} ${css['circle']}`} />
            </li>
          </ul>
        </div>
        <div className={`${css['business-maincontent']} ${css['glass-container']}`}>
        {renderView()}
        
        </div>
      </div>

    
    );
}



const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispathToProps = (Dispatch) => {
  return {
    logout: () => {
      Dispatch({ type: 'LOG_OUT' });
    }
  };
};

export default connect(mapStateToProps,mapDispathToProps)(BusinessApp);
