import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import Chat from './models/chat.js';
import UserChats from './models/userChats.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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

app.post('/api/chats', requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question } = req.body;
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

app.get('/api/userchats', requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChat = await UserChats.findOne({ userId });
    res.status(200).send(userChat.chats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching userchats');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated');
});

app.listen(port, () => {
  connect();
  console.log(`server is running on ${port}`);
});
