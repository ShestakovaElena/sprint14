const express = require('express');
const mongoose = require('mongoose');

const cardsRouter = require('./routes/cards');

const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const app = express();

/* app.use((req, res, next) => {
  req.user = {
    _id: '5f046738b13ba00ccc37b926',
  };
  next();
}); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);

app.use('/', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
