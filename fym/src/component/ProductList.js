import '../Css/ProductList.css';
import { FaRegTrashAlt } from "react-icons/fa";
import css from '../BusinessApp.module.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import image from '../../../uploads/';

const ProductList = (props) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!props.user) {
          throw new Error("Not Authorized");
        }
        const response = await fetch('https://projectfym-1.onrender.com/api/businessproducts_get', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "authorization": `Bearer ${props.user.token}`
          },
        });
  
        if (response.statusText === "Internal Server Error") {
          throw new Error(`HTTPs error! Status: ${response.statusText}`);
        }
  
        const data = await response.json();
        if (data.message) {
          throw Error(data.message);
        } else {
          setProducts(data.ProductList);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`https://projectfym-1.onrender.com/api/businessdeleteproduct/${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "authorization": `Bearer ${props.user.token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the state to reflect the changes
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  const handleClick = (product) => {
    props.setSelectedProduct(product);
  };

  
  

  return (
<div className="suhas-product-list">
{!error && products.length === 0 && !props.selectedProduct && <div>No products available</div>}
      {!props.selectedProduct &&
        products.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            handleDelete={handleDelete}
            handleClick={handleClick}
          />
        ))}
      {error && <div>{error}</div>}
      {props.selectedProduct && (
        <ProductDescription
          user={props.user}
          product={props.selectedProduct}
        ></ProductDescription>
      )}
    </div>
  );
};




const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(ProductList);

const ProductItem = ({ product, handleDelete ,handleClick }) => {
  
  const imageUrl = product.productImage.startsWith('productImage-') ? require(`../../../uploads/${product.productImage}`) :product.productImage; 


  return (
    <div className="encapsulated" data-cat={product.cat} data-name={product.productName} style={{ marginTop: '50px'}} data-pname={product.pname}>
      
        <div style={{borderRadius:'0px'}} className="Productcontainer" onClick={()=>handleClick(product)} >
          {product.productImage ? (
            <img style={{padding:'10px'}} src={imageUrl} alt="Not Found" className="image" />
          ) : (
            <img src="./images/cardphoto4.jpg" alt="Not Found" className="image" />
          )}
          <div className="overlay">
            <div className="text">{product.productName}</div>
          </div>
        </div>
      
        <div className="editdelete">
  <button
    // onClick={() => handleEdit(product._id)}
    
  >
    <i className="fa fa-edit" style={{ fontSize: '18px' }}></i>
  </button>
  <button
    onClick={() => handleDelete(product._id)}
    
  >
    <i className="fa fa-trash-o" style={{ fontSize: '18px' }}><FaRegTrashAlt /></i>
  </button>
</div>

    </div>
  );
};

const ProductDescription = ({ product,user }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [cost,setCost] = useState(product.productBudget);
  const [discout,setDiscount] = useState(product.productDiscount);
  const [desc,setDesc] = useState(product.productDescription);
  const [quantity, setQuantity] = useState(product.productQuantity);
  // Inline CSS styles
  const productDetailsStyle = {
    display: 'flex',
    marginTop: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '20px',
    margin: 'auto',
    maxWidth: '500px',
    fontSize:"18px",
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const productImageStyle = {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '20px',
  };

  const detailsStyle = {
    flex: '1',
  };

  const priceStyle = {
    // display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  };

  const descriptionStyle = {
    marginTop: '15px',
    
    lineHeight: '1.4',
    color: '#555',
  };

  const categorySubcategoryStyle = {
    marginTop: '15px',
    
    color: '#777',
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  

  const handleSubmit = async () => {
    try {
      if (!user) {
        throw new Error("Not Authorized");
      }

      const updatedProduct = {
        ...product,
        productBudget: parseFloat(cost),
        productDiscount: parseFloat(discout),
        productDescription: desc,
        productQuantity: parseInt(quantity, 10), // Parse quantity as an integer
      };

      // Make a request to update the product
      const response = await fetch(
        `/api/businessupdateproduct_put/${product._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (e) {
      console.error('Error updating product:', e.message);
    }
    setIsEditing(false);
  };


  const btnStyle={
    padding:'2px',
    lineHeight:'1.4rem',
    marginTop:"0.8rem",
    width:'40px',
    
  }
 
  const imageUrl = product.productImage.startsWith('productImage-') ? require(`../../../uploads/${product.productImage}`) :product.productImage; 

  return (
    <div style={productDetailsStyle}>
      
      <img src={imageUrl} alt={product.productName} style={productImageStyle} />

      <div style={detailsStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{product.productName}</h2>
        <p style={categorySubcategoryStyle}><strong>Category:</strong> {product.cat}</p>
        <p style={categorySubcategoryStyle}><strong>Subcategory:</strong> {product.subCat}</p>
      
        {isEditing ? (
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={descriptionStyle}
          />
        ) : (
          <p style={descriptionStyle}>{desc}</p>
        )}

        <div style={priceStyle}>
          <p><strong>Cost:</strong>
          {
            isEditing ? (
              <input type="number" value={cost} onChange={(e)=>setCost(e.target.value)} />
            ):<>₹{cost}</>
          }
           
           </p>
          <p><strong>Discount:</strong> 
          {
            isEditing ? (
              <input type="number" min={0} max={100} value={discout} onChange={(e)=>setDiscount(e.target.value)} />
            ):<>{discout}%</>
          }
          </p>
          <p>
            
            {isEditing && product.productQuantity ? (
              <>
              <strong>Quantity:</strong>
              <input
                type="number"
                value={quantity}
                min={1}
                max={100}
                onChange={(e) => setQuantity(e.target.value)}
              />
              </>
            ) : (
              <>{quantity && <p><strong>Quantity:</strong>{quantity}</p>}</>
            )}
          </p>
        </div>

        {isEditing ? (
          <>
            <button style={btnStyle} onClick={handleSubmit}>Save</button>
            
          </>
        ) : (
          <button style={btnStyle} onClick={handleEdit}>Edit</button>
        )}

        {/* <p style={categorySubcategoryStyle}><strong>Category:</strong> {product.cat}</p>
        <p style={categorySubcategoryStyle}><strong>Subcategory:</strong> {product.subCat}</p> */}
      </div>
    </div>
  );
};
