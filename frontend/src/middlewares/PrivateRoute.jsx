import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../Redux/slices";
import { api } from "../api/api";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });

        if (res.data?.success && res.data.user) {
          const user = res.data.user;

          // Store Redux-friendly structure
          dispatch(
            setUserInfo({
              id: user.id || user._id,
              title: user.title ?? "",
              fullName: user.fullName ?? "",
              specialty: user.specialty ?? "",
              firmName: user.firmName ?? "",
              email: user.email ?? "",
              phone: user.phone ?? "",
            })
          );

          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [location, dispatch]);

  if (loading) {
    return (
      <div
        className="private_route_container"
        style={{
          backgroundColor: "var(--bg-primary)",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          className="loader"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        ></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
