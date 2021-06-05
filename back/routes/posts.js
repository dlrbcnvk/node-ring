const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();




router.get('/', async (req, res, next) => { // GET /posts
  try {
      const where = {};
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
          attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
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

router.get('/men', async (req, res, next) => { // GET /posts/men
  try {
      const where = {};
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
          where: {...where, sex: '남'},
          attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
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

router.get('/women', async (req, res, next) => { // GET /posts/women
  try {
      const where = {};
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
          where: {...where, sex: '여'},
          attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname', 'MBTI', 'sex', 'age', 'kakaolink'],
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

module.exports = router;