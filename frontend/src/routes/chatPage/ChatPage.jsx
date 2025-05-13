import './chatPage.css';
import NewPrompt from '../../components/newPrompt/NewPrompt';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_KIT_ENDPOINT = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;

const ChatPage = () => {
  const { chatId } = useParams();

  const { data, error, isPending } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () =>
      fetch(`${API_URL}/chats/${chatId}`, {
        credentials: 'include',
      }).then((res) => res.json()),
  });

  console.log(data);

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? 'Loading...'
            : error
            ? 'Something went wrong'
            : data?.history?.map((message) => (
                <>
                  {message.img && (
                    <IKImage
                      urlEndpoint={IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height={300}
                      width={300}
                      transformation={[{ height: 300, width: 300 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    key={message._id}
                    className={
                      message.role === 'user' ? 'message user' : 'message'
                    }
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
