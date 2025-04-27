import './chatPage.css';
import NewPrompt from '../../components/newPrompt/NewPrompt';

const ChatPage = () => {
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test Message from ai</div>
          <div className="message user">
            Test Message from user Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. A quo, perspiciatis provident iure sed iusto
            exercitationem ex obcaecati ratione non quasi dolore ipsa maiores.
            Suscipit ad optio nisi nesciunt! Ad?
          </div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
