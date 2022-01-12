const express = require('express');
// 라우터마다 장착
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Comment, Post, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  // uploads란 이름의 폴더가 있는지 검사
  fs.accessSync('uploads');
} catch (err) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 파일 업로드시 동일한 이름일 경우 덮어쓰이게 됨 -> 업로드 시간을 파일명에 붙여줌
      // ex) zerocho.png
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname); // zerocho
      
      done(null, basename + '_' + new Date().getTime() + ext); // zerocho76512984.png
    },
    limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
  })
});

// 포스트 생성
// POST /post/
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      // login을 한번 하게되면 deserializeUser가 req에 login을 추가해줌
      UserId: req.user.id,
    });

    if(hashtags) {
      // await Promise.all(hashtags.map((tag) => Hashtag.create({ name: tag.slice(1).toLowerCase() })));
      // findOrCreate: 찾아보고 없으면 생성
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // 결과 예시: [[#노트, true], [#리액트, true]]
     
      await post.addHashtags(result.map(v => v[0]));
    }

    if(req.body.image) {
      // 이미지를 여러개 올리면, image: [젤초.png, 불초.png]
      if(Array.isArray(req.body.image)) {
        // DB에는 이미지 파일이 업로드된 '주소'만 가지고 있음 (업로드는 미리보기 과정에서 처리)
        const images = await Promise.all(req.body.image.map(img => Image.create({ src: img })));
        await post.addImages(images)
      } else { // image: '젤초.png'
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image)
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        }, {
          model: User, // 좋아요 누른 사람
          as: 'Likers', 
          attributes: ['id'],
        }, {
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User, // 댓글 작성자
            attributes: ['id', 'nickname'],
          }]
        }
      ]
    });
    res.status(201).json(fullPost);
  } catch (err) {
      console.error(err);
      next(err);
  }
});



// 댓글 추가
// 주소 부분에서 동적으로 바뀌는 부분을 <파라미터> 라고 함
// POST /post/:postId/comment
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    // 대상 post가 존재하는지
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });

    if(!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      // login을 한번 하게되면 deserializeUser가 req에 login을 추가해줌
      UserId: req.user.id
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /post
// 포스트 하나 가져오기
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    
    if(!post) {
      return res.status(404).send('존재하지 않는 게시글 입니다.');
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }, {
        model: Image
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }]
    });

    res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 좋아요
// PATCH /post/3/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    // 게시글이 있나 검사
    const post = await Post.findOne({ where: { id: req.params.postId } });

    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.')
    }

    await post.addLikers(req.user.id);
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 좋아요 취소
// DELETE /post/3/unlike
router.delete('/:postId/unlike', isLoggedIn, async (req, res, next) => {
  try {
    // 게시글이 있나 검사
    const post = await Post.findOne({ where: { id: req.params.postId } });

    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.')
    }
    
    post.removeLikers(req.user.id);
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시물 삭제
// DELETE /post/4
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { 
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(201).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 리트윗
// POST /post/4/retweet
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    // 대상 post가 존재하는지
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    });

    if(!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    // [자신의 글을 리트윗하는 경우] || [리트윗 된 자신의 글을 다시 리트윗 하는 경우]
    if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    // 이미 리트윗한 걸 또 리트윗하는 경우
    const exPost = await Post.findOne({
      where: { 
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      }
    });

    if(exPost) {
      return res.status(403).send('이미 리트윗 했습니다.');
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    })
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      },{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      },],
    })
    // model: Comment,
    // include: [{
    //   model: User,
    //   as: 'Likers',
    //   attributes: ['id'],
    // }]
    res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 이미지 업로드
// POST /post/images
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  res.json(req.files.map(v => v.filename));
});
 
module.exports = router;
