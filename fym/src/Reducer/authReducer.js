const initalState={
    user:null
}

const authReducer=(state=initalState,action)=>{
    switch (action.type) {
        case "SIGN_UP":
            return {
                ...state,
                user:action.user
            }
        default:
            return state;
    }
}

export default authReducer;