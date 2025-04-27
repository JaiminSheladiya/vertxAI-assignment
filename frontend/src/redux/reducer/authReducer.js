import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import Cookies from "js-cookie";
import { notification } from "antd";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

export const login = (token) => {
  Cookies.set("token", token, { sameSite: "Strict" });
  return { type: LOGIN, payload: token };
};

export const logout = () => {
  Cookies.remove("token");
  notification.error({
    message: "User Logged out.",
  });
  return { type: LOGOUT };
};

const initialState = {
  authenticated: false,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { authenticated: true, token: action.payload };
    case LOGOUT:
      return { authenticated: false, token: null };
    default:
      return state;
  }
};

const persistConfig = {
  key: "auth",
  storage,
};

export default persistReducer(persistConfig, authReducer);
