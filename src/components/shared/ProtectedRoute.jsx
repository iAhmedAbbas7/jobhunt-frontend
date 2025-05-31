// <= IMPORTS =>
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // GETTING USER FROM THE AUTH SLICE
  const { user, isLoggedIn } = useSelector((store) => store.auth);
  // CHECKING IF THE USER IS PRESENT & NOT LOGGING OUT
  if (!user && !isLoggedIn) {
    return <Navigate to="/redirect" replace />;
  } else if (!user && isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  // IF THE USER IS AUTHENTICATED, RETURN THE CHILDREN COMPONENTS
  return children;
};

export default ProtectedRoute;
