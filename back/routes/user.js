const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Comment } = require('../models');

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/', async (req, res, next) => { // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password', 'email']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
   next(error);
  }
});


router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }]
      })
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});


router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout ok');
});


router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user/
  try {
    const exEmail = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exEmail) {
      return res.status(403).send('이미 사용중인 이메일입니다.');
    }
    const exNickname = await User.findOne({
      where: {
        nickname: req.body.nickname,
      }
    });
    if (exNickname) {
      return res.status(403).send('이미 사용중인 닉네임입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 공식 문서 보고 bcrypt.hash 함수가 비동기인지 아닌지 판단
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
      introduce: req.body.introduce,
      sex: req.body.sex,
      age: req.body.age,
      MBTI: req.body.MBTI,
      kakaolink: req.body.kakaolink,
    });
    res.status(200).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});


router.get('/:userId/posts', async (req, res, next) => { // GET /posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'MBTI', 'sex', 'age'],
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'MBTI', 'sex', 'age'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
})


router.get('/:userId', async (req, res, next) => { // GET /user/1
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password', 'email']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
 next(error);
}
});



router.patch('/:userId/profile', isLoggedIn, async (req, res, next) => { // PATCH /user/1/profile
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if (!user) {
      return res.status(403).send('사용자가 존재하지 않습니다.');
    }
    await User.update({
      nickname: req.body.nickname,
      introduce: req.body.introduce,
      MBTI: req.body.MBTI,
      age: req.body.age,
      kakaolink: req.body.kakaolink,
    }, {
      where: { id: req.user.id },
    });
    res.status(200).json({
      id: parseInt(req.params.userId, 10),
      nickname: req.body.nickname,
      introduce: req.body.introduce,
      MBTI: req.body.MBTI,
      age: req.body.age,
      kakaolink: req.body.kakaolink,
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;