import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { useRef, useEffect, useState } from 'react';
import model from '../../lib/gemini';

const NewPrompt = () => {
  const endRef = useRef(null);
  const [img, setImg] = useState({
    isLoading: false,
    error: '',
    dbData: {},
  });

  const add = async () => {
    await model('What is the capital of france?');
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" action="">
        <Upload setImg={setImg} />
        <button type="button" onClick={add}>
          Test
        </button>
        <input type="text" placeholder="ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
