// <= IMPORTS =>
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  // GETTING USER FROM THE AUTH SLICE
  const { user, isLoggedIn } = useSelector((store) => store.auth);
  // CHECKING IF THE USER IS AUTHENTICATED && NOT LOGGING OUT
  if (!user && !isLoggedIn) {
    return <Navigate to="/redirect" replace />;
  } else if (user && user.role !== "RECRUITER") {
    return <Navigate to="/unauthorized" replace />;
  } else if (!user && isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  // IF THE USER IS AUTHENTICATED, RETURN THE CHILDREN COMPONENTS
  return children;
};

export default AdminProtectedRoute;
