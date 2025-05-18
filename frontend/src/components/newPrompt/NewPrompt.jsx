import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { useRef, useEffect, useState } from 'react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

const NewPrompt = ({ data }) => {
  const endRef = useRef(null);
  const formRef = useRef(null);
  const hasRun = useRef(false);
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [img, setImg] = useState({
    isLoading: false,
    error: '',
    dbData: {},
    aiData: {},
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return fetch(`${API_URL}/chats/${data._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['chat', data._id] })
        .then(() => {
          setQuestion('');
          setAnswer('');
          setImg({ isLoading: false, error: '', dbData: {}, aiData: {} });
        });
    },
    onError: (error) => {
      console.error('Error updating chat:', error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (!question) return;
    formRef.current.reset();
    await handleModelResponse(question);
  };

  const handleModelResponse = async (text, isInitial = false) => {
    if (!isInitial) setQuestion(text);

    try {
      const question = Object.entries(img.aiData).length
        ? { message: [{ text }, img.aiData] }
        : { message: text };
      const history = [
        data?.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }],
        })),
      ];
      const result = await model(question, history);
      let response = '';

      for await (const chunk of result) {
        response += chunk.text;
        setAnswer(response);
      }
      mutation.mutate();
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data, answer, question, img.dbData]);

  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      handleModelResponse(data.history[0].parts[0].text, true);
    }
    hasRun.current = true;
  }, []);

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
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
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
