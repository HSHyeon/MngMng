const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { isAdmin } = require('../middleware/isAdmin');
const validator = require('../middleware/validator');
const { category } = require('../middleware/validators');
const { isAuth } = require('../middleware/isAuth');

const router = Router();

// 추천 상품 조회
router.get(
  '/categories/recommends',
  isAuth,
  categoryController.getProductsByRecommend,
);

// 전체 카테고리 조회
router.get('/categories', categoryController.getAllCategories);

// 특정 카테고리 상품 조회
router.get('/categories/:id', categoryController.getProductsByCategoryName);

// 카테고리 생성
router.post(
  '/categories',
  isAdmin,
  validator(category.create),
  categoryController.createCategory,
);

// 카테고리 수정
router.put(
  '/categories/:id',
  isAdmin,
  validator(category.update),
  categoryController.updateCategory,
);

// 카테고리 삭제
router.delete('/categories/:id', isAdmin, categoryController.deleteCategory);

module.exports = router;
