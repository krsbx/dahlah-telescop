const _ = require('lodash');
const { asyncMw } = require('express-asyncmw');
const { Sequelize, Op } = require('sequelize');
const { User } = require('../models');
const {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
} = require('../schemas/user');
const { hashText } = require('../utils/hashing');
const { USER_ROLE } = require('../utils/constant');

class UserController {
  constructor() {}

  create = asyncMw(async (req, res) => {
    const body = createUserSchema.parse(req.body);
    body.password = await hashText(body.password);

    const user = await User.create(body);

    return res.status(200).json({
      code: 200,
      data: _.omit(user.dataValues, ['password']),
    });
  });

  find = asyncMw(async (req, res) => {
    const user = await User.findOne({
      where: {
        userId: +req.params.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      code: 200,
      data: _.omit(user.dataValues, ['password']),
    });
  });

  list = asyncMw(async (req, res) => {
    const limit = +(req.query.limit === 'all'
      ? 0
      : _.get(req.query, 'limit', 10));
    const page =
      req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0
        ? +req.query.page
        : 1;
    const offset = page > 0 ? limit * (page - 1) : 0;
    const where = {};

    if (req.query.fullName) {
      if (!where[Op.and]) where[Op.and] = [];

      where[Op.and].push(
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fullName')), {
          [Op.like]: `%${req.query.fullName.toLowerCase()}%`,
        })
      );
    }

    const users = await User.findAndCountAll({
      limit: limit === 0 ? undefined : limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      code: 200,
      data: users.rows.map((user) => _.omit(user.dataValues, ['password'])),
      total: users.count,
    });
  });

  update = asyncMw(async (req, res) => {
    const body = updateUserSchema.parse(req.body);

    const user = await User.findOne({
      where: {
        userId: +req.params.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    if (req.auth.role === USER_ROLE.USER && body.role) {
      delete body.role;
    }

    await user.update(body);

    return res.status(200).json({
      code: 200,
      data: _.omit(user.dataValues, ['password']),
    });
  });

  updatePassword = asyncMw(async (req, res) => {
    const body = updateUserPasswordSchema.parse(req.body);
    const newPassword = await hashText(body.password);

    const [, [user]] = await User.update(
      { password: newPassword },
      {
        where: {
          userId: +req.params.userId,
        },
        returning: true,
      }
    );

    return res.status(200).json({
      code: 200,
      data: _.omit(user.dataValues, ['password']),
    });
  });

  delete = asyncMw(async (req, res) => {
    await User.destroy({
      where: {
        userId: +req.params.userId,
      },
    });

    return res.status(204).send(null);
  });
}

module.exports = UserController;
