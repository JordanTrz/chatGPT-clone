import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';

const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    oriign: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY,
});

app.get('/api/upload', (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
