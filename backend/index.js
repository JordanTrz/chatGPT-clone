import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import Chat from './models/chat.js';
import UserChats from './models/userChats.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    oriign: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY,
});

app.get('/api/upload', (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post('/api/chats', async (req, res) => {
  const { userId, question } = req.body;
  try {
    const newChat = new Chat({
      userId,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: question,
            },
          ],
        },
      ],
    });

    const savedChat = await newChat.save();
    const chatMeta = {
      _id: savedChat._id,
      title: question.substring(0, 40),
      createdAt: savedChat.createdAt,
    };

    await UserChats.updateOne(
      {
        userId,
      },
      {
        $push: {
          chats: chatMeta,
        },
      },
      { upsert: true },
    );
    return res.status(200).send(savedChat._id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating chat');
  }
});

app.listen(port, () => {
  connect();
  console.log(`server is running on ${port}`);
});
