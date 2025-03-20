import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import Loading from "./Loading/Loading"; 

export default function IsPrivate({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}