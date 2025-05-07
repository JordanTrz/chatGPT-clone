import { Link } from 'react-router-dom';
import './chatList.css';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

const ChatList = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['userchats'],
    queryFn: () =>
      fetch(`${API_URL}/userchats`, {
        credentials: 'include',
      }).then((res) => res.json()),
  });

  return (
    <div className="chatList">
      <span className="title">Dashboard</span>
      <Link to="/dashboard">Chat AI</Link>
      <Link to="/">Explore Chat AI</Link>
      {/* <Link to="/">Contact</Link> */}
      <hr />
      <span className="title">Recent Chats</span>
      <div className="list">
        {isPending
          ? 'Loading...'
          : error
          ? 'Something went wrong'
          : data?.map((chat) => (
              <Link key={chat._id} to={`/dashboard/chats/${chat._id}`}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade chat AI</span>
          <span>Get unlimited access</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
