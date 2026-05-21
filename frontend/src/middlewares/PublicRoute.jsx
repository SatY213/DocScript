import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { setAuthHeaders } from "../api/api";

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await setAuthHeaders();
        // console.log(response);

        if (response) {
          if (response.isAuthenticated) {
            setIsAuthenticated(response.isAuthenticated);
            setUser(response.user);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error during authentication check", error);
      } finally {
        setLoading(false); // Set loading to false after checking
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div
        className="loader"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      ></div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <Outlet context={{ user }} />
      </>
    );
  }
};

export default PublicRoute;
