import './dashboardPage.css';
import { useAuth } from '@clerk/clerk-react';

const DashboardPage = () => {
  const { userId } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (!question) return;
    await fetch('http://localhost:3000/api/chats', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>Chat AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Crete new chat</span>
          </div>
          <div className="option">
            <img src="/analyze.png" alt="" />
            <span>Analyze images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form action="" onSubmit={handleSubmit}>
          <input type="text" name="question" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png " alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
