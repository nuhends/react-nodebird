// node require
// node에서는 es module(import, export) 를 쓰지 않는다

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');

const db = require('./models');
const passportConfig = require('./passport');

// process.env에 세팅됨
dotenv.config();

const app = express();

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

// 배포모드일 때
if(process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// app.use()의 인자로 들어가는 것들은 "미들웨어" 
// 주의: 라우터 설정 전에 선언해줘야 함
// express 서버에 설정 추가(미들웨어)
// 프론트에서 보낸 req.body 안에 넣어주는 역할


app.use(cors({
  // access-controll-allow-origin: 허용
  // 예외: 
  // access-control-allow-credentials: true 일 경우에는, 
  // access-controll-allow-origin가 '*' 이면 안됨(보안 정책)
  origin: ['http://localhost:3060', 'nodebird.com'],
  // origin: true,
  // 로그인 데이터, 쿠키가 필요함, 
  // 도메인이 다르면 cookie가 전달이 안됨 
  // -> backend서버는 누가 요청을 보냈는지 알 방법이 없게 됨
  // true를 주게되면, access-control-allow-credentials: true 로 설정
  // front에서도 요청을 보내는 axios의 3번째 인자로 { withCredentials: true } 옵션을 추가해야 함
  credentials: true,
}));
// __dirname + 'uploads' 와 같음
// 하지만 window와 맥, 리누스의 경로 부분자가 다름(/ vs \)
// '/' : localhost:3065
app.use('/', express.static(path.join(__dirname, 'uploads')));
// 프론트에서 json형식으로 데이터를 보냈을 때, json 형식의 데이터를 req.body 안에 넣어줌
app.use(express.json());
// 프론트에서 form submit을 통해 데이터를 보냈을 때, urlencoded 형식의 테이터를 req.body 안에 넣어줌
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  // 쿠키에 랜덤한 secret을 보내줌
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

// router에 두번째로 들어가는 것들도 미들웨어
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

// 에러처리 미들웨어(내부적으로 존재)
// app.use((err, req, res, next) => {

// });

app.get('/', (req, res) => {
  res.send('Hello express');
});

app.listen(3065, () => {
  console.log('서버 실행 중');
});
