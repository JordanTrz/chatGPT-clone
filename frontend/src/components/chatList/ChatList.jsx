import { Link } from 'react-router-dom';
import './chatList.css';

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">Dashboard</span>
      <Link to="/dashboard">Chat AI</Link>
      <Link to="/">Explore Chat AI</Link>
      {/* <Link to="/">Contact</Link> */}
      <hr />
      <span className="title">Recent Chats</span>
      <div className="list">
        <Link>My chat title</Link>
        <Link>My chat title</Link>
        <Link>My chat title</Link>
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
