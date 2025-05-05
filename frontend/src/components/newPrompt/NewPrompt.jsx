import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { useRef, useEffect, useState } from 'react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';

const NewPrompt = () => {
  const endRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [img, setImg] = useState({
    isLoading: false,
    error: '',
    dbData: {},
    aiData: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (!question) return;
    await handleModelResponse(question);
  };

  const handleModelResponse = async (text) => {
    setQuestion(text);
    const question = Object.entries(img.aiData).length
      ? [img.aiData, { text }]
      : text;
    console.log(question);
    const response = await model(question);
    setAnswer(response);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answer, question, img.dbData]);

  return (
    <>
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width={380}
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input type="text" name="question" placeholder="ask anything..." />
        <button type="submit">
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
