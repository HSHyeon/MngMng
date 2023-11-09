const models = require('../models');

exports.getAllProduct = async (page, perPage) => {
  try {
    const totalProducts = await models.Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);
    const products = await models.Product.find({})
      .populate('category')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return {
      products,
      page,
      totalPages,
    };
  } catch (error) {
    throw new Error('상품을 가져올 수 없습니다.');
  }
};

exports.getProductById = async (_id) => {
  return await models.Product.findOne({ _id }).exec();
};

exports.createProduct = async (productProps) => {
  const product = await models.Product.create({
    ...productProps,
  });
  return product;
};

exports.updateProduct = async (_id, productData) => {
  try {
    const data = await models.Product.updateOne({ _id }, productData).exec();

    if (!data.acknowledged) {
      return { state: 200, message: '수정 실패' };
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteProduct = async (_id) => {
  return await models.Product.deleteOne({ _id }).exec();
};
