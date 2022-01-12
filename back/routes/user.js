const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 200: 성공
// 300: 리다이렉트
// 400: 클라이언트 에러
// 500: 서버 에러

// GET /user
// 로그인 상태 유지
router.get('/', async (req, res, next) => {
  try {
    // 서버에 로그인 되어 있다면
    if(req.user) {
      const fullUserWithoutPassword = await User.findOne({ 
        where: { id: req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id']
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id']
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }]
      });
      res.status(200).json(fullUserWithoutPassword)
    } else {
      res.status(200).json(null)  
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로우 취소 : DELETE /user/1/follow
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    // 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.params.userId } });

    if(!user) {
      res.status(403).send('해당 사용자는 존재하지 않습니다.')
    }

    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로워 삭제 : DELETE /user/follower/2
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    // 먼저 팔로워가 있는지 확인
    const user = await User.findOne({ where: { id: req.params.userId } });

    if(!user) {
      res.status(403).send('해당 사용자는 존재하지 않습니다.')
    }

    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 닉네임 수정 : PATCH /user/nickname
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      // 바꿀 내용
      { nickname: req.body.nickname },
      // 조건
      { where: { id: req.user.id } }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로워 목록 : GET /user/followers
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    // 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.user.id } });

    if(!user) {
      res.status(403).send('없는 사람을 찾으려고 하시네요?');
    }

    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 팔로잉 목록 : GET /user/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    // 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.user.id } });

    if(!user) {
      res.status(403).send('해당 사용자는 존재하지 않습니다.')
    }

    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });

    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user/login
// 로그인 : POST /user/login
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      console.error(err);
      return next(err);
    }
    // client 에러
    if(info) {
      return res.status(401).send(info.reason);
    }
    // passport 로그인 처리 -> passport.serializeUser 실행
    return req.login(user, async (loginErr) => {
      if(loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({ 
        where: { id: user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id']
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id']
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }]
      });
      // 쿠키와 사용자 정보(User)를 사용자 정보로 보내줌
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// 로그아웃 : POST /user/logout
// login을 한 뒤부터는 req.user에 항상 정보가 있음 -> passport.deserializeUser에서 처리
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

// GET /user/10
router.get('/:id', async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    })

    // console.log("req.params.userId :: ", req.params.id);
    // console.log('fullUserWithoutPassword :: ', fullUserWithoutPassword);

    if(fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      
      data.Posts = data.Posts.length
      data.Followings = data.Followings.length
      data.Followers = data.Followers.length

      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자 입니다.');
    }
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/3/posts
router.get('/:userId/posts', async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };
    // 초기 로딩이 아닐 때
    if(parseInt(req.query.lastId, 10)) {
      // Op = Operator(연산자)
      // id가 lastId 보다 작은 것들
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 회원가입 : POST /user/
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    // 두번째 인자인 숫자가 커질수록 해쉬화되는 강도가 쎄짐 (10~13)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // email 중복 체크: 없다면 null
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    if(exUser) {
      // 403: 금지의 의미
      return res.status(403).send('이미 사용 중인 아이디입니다.')
    }
    
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // 200: 성공
    // 201: 잘 생성됨
    res.status(201).send('ok');
  } catch (err) {
    console.error(err);
    // next를 통해서 err를 전달하면 express가 err를 처리함
    return next(err); // status 500
  }
});

// 팔로우 : PATCH /user/1/follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    // 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.params.userId } })

    if(!user) {
      res.status(403).send('없는 사람을 팔로우하려고 하시네요?');
    }

    await user.addFollowers(req.user.id);

    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


 
// commonJS
module.exports = router;
