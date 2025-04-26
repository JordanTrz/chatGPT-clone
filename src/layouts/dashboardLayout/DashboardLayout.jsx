import "./dashboardLayout.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const { userId, isLoaded } = useAuth();
  console.log(userId, isLoaded);

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div className="menu">MENU</div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
