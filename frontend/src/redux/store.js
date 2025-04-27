import { combineReducers, createStore } from "redux";
import { persistStore } from "redux-persist";
import authReducer from "./reducer/authReducer";
import { applyMiddleware, compose } from "redux";
import userReducer from "./reducer/userReducer";
import { thunk } from "redux-thunk";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
});
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { store, persistor };
