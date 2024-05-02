import React, { useState } from "react";
import { connect } from "react-redux";
import './BusinessInterface.css';
import Subcategory from "./Subcategory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';


function Form({
  cat,
  subCat,
  handleFormSubmit,
  setIsFormVisible,
  SetSuccessText,
  handleSelectedSub,
  selectedSub,
  setStep,
  user,
}) {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productAvailability, setProductAvailability] = useState(false);
  const [productBudget, setProductBudget] = useState(null);
  const [productDiscount, setProductDiscount] = useState(null);
  const [productImage, setProductImage] = useState('');
  const [productQuantity, setProductQuantity] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // To store image preview URL

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('cat', cat);
    formData.append('subCat', subCat);
    formData.append('productName', productName);
    formData.append('productDescription', productDescription);
    formData.append('productAvailability', productAvailability);
    formData.append('productBudget', Number(productBudget) );
    formData.append('productDiscount', Number(productDiscount));
    formData.append('productImage', productImage);
    if (productQuantity !== null) {
      formData.append('productQuantity',Number(productQuantity));
    }

    try {
      const response = await fetch('https://projectfym-1.onrender.com/api/businessinsertProduct_post', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();

        if (response.status===200) {
          setIsFormVisible(false);
          SetSuccessText('Successfully Inserted');
          handleSelectedSub(`${cat},${subCat}`);

          if (selectedSub.length > 1) {
            // Handle multiple selections
          } else {
            setStep(1);
            SetSuccessText('');
          }
        } else if (response.status === 500) {
          throw new Error(`Internal Server Error: ${result.message}`);
        } else {
          throw new Error(`Request failed: ${result.message}`);
        }
      } else {
        throw new Error(`Internal Server Error`);
      }
    } catch (error) {
      console.error('Error sending request:', error.message);
      SetSuccessText(`Error sending request: ${error.message}`);
    }
    // Rest of the code remains the same
  };

  return (
    <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data" style={{display:'flex',gap:'5%'}}>
      <div className="image-container">
  {/* Image preview */}
  {imagePreview && <img src={imagePreview} alt="Product Preview" className="image-preview" />}
  {/* File input for image */}
  <label htmlFor="productImage" className="image-label">
    <span className="upload-icon">
      <FontAwesomeIcon icon={faArrowAltCircleUp} />
    </span>
    Upload Image
    <input type="file" accept="image/*" onChange={handleImageChange} id="productImage" className="image-input" style={{ display: 'none' }} />
  </label>
  <div>Category: {cat}</div>
  <div>Sub Category: {subCat}</div>
</div>


      <div className="form-fields">
        <label className="businesslabel">
        <div>Product Name:</div>
        <div><input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          name="productName"
        /></div>
      </label>
      <label className="businesslabel">
        <div>Product Description:</div>
        <div><textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          name="productDescription"
        /></div>
      </label>
      <label className="businesslabel">
        <div>Product Budget:</div>
        <div><input
          type="number"
          value={productBudget}
          onChange={(e) => setProductBudget(e.target.value)}
          name="productBudget"
        /></div>
      </label>
      <label className="businesslabel">
        <div>Product Discount:</div>
        <div><input
          type="number"
          value={productDiscount}
          onChange={(e) => setProductDiscount(e.target.value)}
          name="productDiscount"
        /></div>
      </label>
      {cat.toLowerCase() === 'food' && (
        <label className="businesslabel">
          <div>Quantity:</div>
          <div><input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            name="productQuantity"
          /></div>
        </label>
      )}
      <label>
        Available:
        <input
          type="checkbox"
          checked={productAvailability}
          onChange={(e) => setProductAvailability(e.target.checked)}
          name="productAvailability"
        />
      </label>
      <button style={{width:'60%'}}type="submit">Submit</button>
      </div>

      
    </form>
  );
}

const BusinessInterface1 = (props) => {
  const [selectedSub, setSelectedSub] = useState([]);
  const [cat, setCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [successText, SetSuccessText] = useState(null);

  const subcategories = {
    'event': [
      'Conference', 'Workshop', 'Seminar', 'Webinar', 'Networking Event',
      'Product Launch', 'Trade Show', 'Exhibition', 'Meetup', 'Panel Discussion',
      'Hackathon', 'Symposium', 'Summit', 'Training Session', 'TEDx Event',
      'Award Ceremony', 'Charity Event', 'Music Concert', 'Art Exhibition', 'Book Launch',
      'Cultural Festival', 'Film Premiere', 'Science Fair', 'Comedy Show', 'Sporting Event',
    ],
    'food': [
      'Italian Cuisine', 'Asian Fusion', 'Vegetarian', 'Vegan', 'Fast Food',
      'Seafood', 'Fine Dining', 'Desserts', 'Coffee Shops', 'Food Trucks',
      'Buffet', 'Barbecue', 'Street Food', 'Farm-to-Table', 'Local Cuisine',
      'Mexican Cuisine', 'Mediterranean Cuisine', 'Sushi', 'Fusion Desserts', 'Gourmet Burgers',
      'Smoothies and Juices', 'Patisserie', 'Ice Cream and Gelato', 'Breakfast Specialties', 'International Street Food',
    ],
    'photography': [
      'Portrait Photography',
      'Landscape Photography',
      'Macro Photography',
      'Street Photography',
      'Architectural Photography',
      'Wildlife Photography',
      'Fashion Photography',
      'Event Photography',
      'Product Photography',
      'Food Photography',
      'Travel Photography',
      'Black and White Photography',
      'Abstract Photography',
      'Documentary Photography',
      'Astrophotography',
      'Sports Photography',
      'Pet Photography',
      'Still Life Photography',
      'Underwater Photography',
      'Drone Photography',
      'Wedding Photography',
      'Family Photography',
      'Fine Art Photography',
      'Experimental Photography',
      'Night Photography',
      'Mobile Photography',
      'Digital Art',
      'Photojournalism',
      'Archaeological Photography',
      'Aerial Photography',
      'Time-Lapse Photography',
      'Composite Photography',
      'Infrared Photography',
    ]
  };

  const handleSelectedSub = (element) => {
    setSelectedSub((prevSelectedSub) => {
      if (prevSelectedSub.includes(element)) {
        return prevSelectedSub.filter((item) => item !== element);
      } else {
        return [...prevSelectedSub, element];
      }
    });
  };

  const handleClick = (id) => {
    setCat(id);
  };

  const handleSpanClick = (cat, subCat) => {
    setCat(cat);
    setSubCat(subCat);
    setIsFormVisible(true);
    SetSuccessText(null);
  };

  let content;

  switch (cat) {
    case "food":
      content = <Subcategory subcategories={subcategories["food"]} category={"food"} handleSelectedSub={handleSelectedSub} />;
      break;
    default:
      content = <Subcategory subcategories={subcategories["event"]} category={"event"} handleSelectedSub={handleSelectedSub} />;
      break;
    case "photography":
      content = <Subcategory subcategories={subcategories["photography"]} category={"photography"} handleSelectedSub={handleSelectedSub} />;
      break;
  }

  return (
    <div className="maincon">
      {step === 1 && (
        <>
          <div className="selected-sub">
            {selectedSub.map((subCat, index) => (
              <span key={index} className="subcategory-span">
                {subCat.split(",")[1]}
              </span>
            ))}
          </div>

          <div className="cat-con">
            {Object.keys(subcategories).map((category, index) => (
              <button key={index} data-id={index} onClick={() => handleClick(category)} className="cat">
                {category}
              </button>
            ))}
          </div>

          <div className="sub-con">{content}</div>
          <button disabled={!(selectedSub.length > 0)} onClick={() => setStep(2)}>
            next
          </button>
        </>
      )}

      {step === 2 && (
        <div className="selected-sub">
          {selectedSub.map((subCat, index) => (
            <span
              key={index}
              onClick={() => handleSpanClick(subCat.split(",")[0], subCat.split(",")[1])}
              className="subcategory-span"
            >
              {subCat.split(",")[1]}
            </span>
          ))}
        </div>
      )}

      {isFormVisible && (
        <Form
          cat={cat}
          subCat={subCat}
          // handleFormSubmit={/* pass the function you want to handle form submit */}
          setIsFormVisible={setIsFormVisible}
          SetSuccessText={SetSuccessText}
          handleSelectedSub={handleSelectedSub}
          selectedSub={selectedSub}
          setStep={setStep}
          user={props.user}
        />
      )}

      {successText && <div className="SuccessText">{successText}</div>}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(BusinessInterface1);
