import './dashboardLayout.css';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ChatList from '../../components/chatList/ChatList';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in');
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
