import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import Chat from './models/chat.js';
import UserChats from './models/userChats.js';
import { requireAuth } from '@clerk/express';
import path from 'path';
import url, { fileURLToPath } from 'url';

const port = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get('/api/chats/:id', requireAuth(), async (req, res) => {
  const chatId = req.params.id;
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).send('Chat not found');
    return res.status(200).send(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chat');
  }
});

app.put('/api/chats/:id', requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: 'user', parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: 'model', parts: [{ text: answer }] },
  ];

  try {
    const updateChat = await Chat.updateOne(
      { _id: chatId, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      },
    );
    res.status(200).send(updateChat);
  } catch (error) {
    res.status(500).send('Error adding conversation');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated');
});

app.use(express.static(path.join(__dirname, '../frontend')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
// });

app.listen(port, () => {
  connect();
  console.log(`server is running on ${port}`);
});
