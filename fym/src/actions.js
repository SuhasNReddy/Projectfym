// actions.js
export const addQuery = (query) => ({
    type: 'ADD_QUERY',
    payload: query,
  });
  
  export const deleteQuery = (index) => ({
    type: 'DELETE_QUERY',
    payload: index,
  });