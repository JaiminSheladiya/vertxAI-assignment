import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const authenticated = useSelector((state) => state.auth.authenticated);
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
