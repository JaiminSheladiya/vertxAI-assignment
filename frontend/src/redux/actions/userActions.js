import api from "../../utils/api";

export const SET_USER_INFO = "SET_USER_INFO";
export const CLEAR_USER_INFO = "CLEAR_USER_INFO";

export const setUserInfo = (user) => ({
  type: SET_USER_INFO,
  payload: user,
});

export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
});

export const fetchUserInfo = () => async (dispatch) => {
  try {
    const res = await api.get("/auth/me");
    dispatch(setUserInfo(res.data));
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
};
