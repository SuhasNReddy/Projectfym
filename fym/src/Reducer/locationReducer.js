const initalState= {
    Locations:[
      ],
      user:null,
      customerUser: null,
}

const locationreducer=(state=initalState,action)=>{
    
    switch (action.type) {
        case "ADD_LOCATION":
            return {
                ...state,
                Locations:[action.location,...state.Locations]
            }
        case "DELETE_LOCATION":
            return {
                ...state,
                Locations:state.Locations.filter((location)=>location!==action.location)
            } 
        case "SET_LOCATIONS":
            return{
                ...state,
                Locations:action.locations
            }
        case "SIGN_UP":
            return {
                ...state,
                user:action.user
            };
            
            case "LOG_OUT":
                return {
                    ...state,
                    user:null
                };
                case "CUSTOMER_LOGIN":
                    return {
                      ...state,
                      customerUser: action.customerUser,
                    };
              
                  case "CUSTOMER_LOGOUT":
                    return {
                      ...state,
                      customerUser: null,
                    };

            default:
                return state;
    }

    
}

export default locationreducer;