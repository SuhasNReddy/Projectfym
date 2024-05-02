import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import locationReducer from './Reducer/locationReducer';
import {ShopContextProvider} from './context/shop-context';

const locationStore = createStore(locationReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<ShopContextProvider>
  <Provider store={locationStore} >
      <React.StrictMode>
        <App />
        
      </React.StrictMode>
  </Provider>
</ShopContextProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

