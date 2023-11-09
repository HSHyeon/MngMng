const models = require('../models');
const dogService = require('./dogService');

exports.getProductsByRecommend = async (userId) => {
  // 사용자의 견종 받아오기
  const dogs = await dogService.getAllDogs(userId);

  const sizes = dogs.map((dog) => dog.size);
  const ages = dogs.map((dog) => dog.age);

  // 상품 목록 받아오기
  const recommendProducts = await models.Product.find({
    $and: [
      { recommendDogSize: { $in: sizes } },
      {
        $or: [
          { 'recommendDogAge.min': { $lte: Math.max(...ages) } },
          { 'recommendDogAge.max': { $gte: Math.min(...ages) } },
        ],
      },
    ],
  });

  return recommendProducts;
};

exports.getAllCategories = async () => {
  const categories = await models.Category.find({});

  return categories;
};

exports.getCategoryByName = async (name) => {
  try {
    // findOne함수에서 자채적으로 없으면 에러를 throw 한다.
    const category = await models.Category.findOne({ name }).exec();

    // 찾는 이름이 없는 경우
    if (!category) {
      throw new Error(`${name}라는 이름이 존재 하지 않습니다.`);
    }

    return category.name;
  } catch (err) {
    // 디비쪽 문제일때 에러처리는 여기서..
    throw new Error(`Unhandled type: ${name}`);
  }
};

exports.getProductsByCategoryName = async (id) => {
  const products = await models.Product.find({})
    .populate({
      path: 'category',
      match: { id },
    })
    .exec();
  console.log(products);
  const filteredProducts = products.filter((product) => product.category);
  return filteredProducts;
};

exports.createCategory = async ({ name }) => {
  try {
    await models.Category.create({ name });
    return `${name} 카테고리 생성 성공`;
  } catch (err) {
    throw new Error(`${name}라는 이름이 이미 존재합니다.`);
  }
};

exports.updateCategory = async (categoryId, name) => {
  try {
    const updateCategory = await models.Category.findByIdAndUpdate(
      categoryId,
      name,
    );
    if (!updateCategory) {
      throw new Error('해당 카테고리를 찾을 수 없습니다.');
    }
    return updateCategory;
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteCategory = async (_id) => {
  try {
    const result = await models.Category.findOneAndDelete({ _id }).exec();

    return result.name;
  } catch (err) {
    throw new Error('해당 카테고리가 존재하지 않습니다.');
  }
};
