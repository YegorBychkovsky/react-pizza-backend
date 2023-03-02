import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation } from './validations/validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController } from './controllers/index.js';

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

mongoose.set('strictQuery', false);

mongoose
  .connect(
    'mongodb+srv://Yegor:wwwwww@cluster0.ynznpi0.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads${req.file.originalname}`,
  });
});

app.listen(1234, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK!');
});
