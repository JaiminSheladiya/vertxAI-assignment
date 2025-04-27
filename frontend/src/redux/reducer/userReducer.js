import { SET_USER_INFO, CLEAR_USER_INFO } from "../actions/userActions";

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_USER_INFO:
      return {};
    default:
      return state;
  }
};

export default userReducer;
