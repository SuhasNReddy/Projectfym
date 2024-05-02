const initialState = {
    queries: [],
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_QUERY':
        return {
          ...state,
          queries: [...state.queries, action.payload],
        };
      case 'DELETE_QUERY':
        return {
          ...state,
          queries: state.queries.filter((_, index) => index !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default reducer;