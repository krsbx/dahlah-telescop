const { Router } = require('express');
const BorrowingController = require('../controller/borrowings');
const { authMw, optionalAuthMw } = require('../middleware/auth');
const { userOrAdminMw } = require('../middleware/borrowing');

const router = Router();
const borrowingController = new BorrowingController();

router.post('/', authMw, borrowingController.create);
router.patch(
  '/:borrowingId',
  authMw,
  userOrAdminMw,
  borrowingController.update
);
router.get('/:borrowingId', borrowingController.find);
router.get('/', optionalAuthMw, borrowingController.list);
router.delete(
  '/:borrowingId',
  authMw,
  userOrAdminMw,
  borrowingController.delete
);

module.exports = router;
