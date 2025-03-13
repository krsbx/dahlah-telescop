const _ = require('lodash');
const { asyncMw } = require('express-asyncmw');
const dayjs = require('dayjs');
const { Op } = require('sequelize');
const { Borrowing } = require('../models');
const {
  createBorrowingSchema,
  updateBorrowingSchema,
} = require('../schemas/borrowing');
const { USER_ROLE, BORROWING_STATUS } = require('../utils/constant');
const { countPriorityPoint } = require('../utils/counter');

class BorrowingController {
  constructor() {}

  create = asyncMw(async (req, res) => {
    const body = createBorrowingSchema.parse(req.body);
    const priorityPoint = countPriorityPoint(body);

    if (req.auth.role !== USER_ROLE.ADMIN) {
      body.status = BORROWING_STATUS.PENDING;
      body.userId = req.auth.userId;
    }

    const borrowing = await Borrowing.create({
      ...body,
      priorityPoint,
    });

    return res.status(200).json({
      code: 200,
      data: borrowing,
    });
  });

  find = asyncMw(async (req, res) => {
    const borrowing = await Borrowing.findOne({
      where: {
        borrowingId: +req.params.borrowingId,
      },
    });

    if (!borrowing) {
      return res.status(404).json({
        code: 404,
        message: 'Borrowing not found.',
      });
    }

    return res.status(200).json({
      code: 200,
      data: borrowing,
    });
  });

  update = asyncMw(async (req, res) => {
    const borrowing = await Borrowing.findOne({
      where: {
        borrowingId: +req.params.borrowingId,
      },
    });

    if (!borrowing) {
      return res.status(404).json({
        code: 404,
        message: 'Borrowing not found.',
      });
    }

    const body = updateBorrowingSchema.parse(req.body);
    const priorityPoint = countPriorityPoint({
      ...borrowing.dataValues,
      ...body,
    });

    await borrowing.update({
      ...body,
      priorityPoint,
    });

    return res.status(200).json({
      code: 200,
      data: borrowing,
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
    const where = req.query.userId ? { userId: +req.query.userId } : {};

    if (!req.auth || req.auth.role !== USER_ROLE.ADMIN) {
      where.borrowingTime = {
        [Op.gte]: dayjs().startOf('day'),
      };
      where.status = {
        [Op.eq]: BORROWING_STATUS.APPROVED,
      };
    }

    const borrowings = await Borrowing.findAndCountAll({
      where,
      limit: limit === 0 ? undefined : limit,
      offset,
      order: [
        ['priorityPoint', 'DESC'],
        ['borrowingTime', 'ASC'],
      ],
    });

    return res.status(200).json({
      code: 200,
      data: borrowings.rows,
      total: borrowings.count,
    });
  });

  delete = asyncMw(async (req, res) => {
    await Borrowing.destroy({
      where: {
        borrowingId: +req.params.borrowingId,
      },
    });

    return res.status(204).send(null);
  });
}

module.exports = BorrowingController;
