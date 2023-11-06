const addressService = require('../services/addressService');

exports.getAllAddresses = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const addressList = await addressService.getAllAddresses(userId);
    res.json({ status: 200, addressList });
  } catch (err) {
    next(err);
  }
};

exports.getAddressById = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const address = await addressService.getAddressById(userId, id);
    if (!address) {
      res.status(404).json({
        status: 404,
        message: '해당 주소를 찾을 수 없습니다.',
      });
    } else {
      res.status(200).json({
        status: 200,
        address,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  const {
    name,
    userId,
    recipient,
    zipCode,
    detailAddress,
    phone,
    mainAddress,
  } = req.body;
  try {
    const createdAddress = await addressService.createAddress({
      name,
      userId,
      recipient,
      zipCode,
      detailAddress,
      phone,
      mainAddress,
    });
    res.status(200).json({
      status: 200,
      message: '등록 성공',
      createdAddress,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: '서버 오류 입니다.' + err,
    });
  }
};

exports.updateAddress = async (req, res, next) => {
  const { id } = req.params;
  const { name, recipient, zipCode, detailAddress, phone, mainAddress } =
    req.body;

  try {
    const updatedAddressData = {
      name,
      recipient,
      zipCode,
      detailAddress,
      phone,
      mainAddress,
    };

    await addressService.updateAddress(id, updatedAddressData);
    res.json({
      status: 200,
      message: '수정 성공',
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedAddress = await addressService.deleteAddress(id);
    if (deletedAddress) {
      res.json({
        status: 200,
        message: '삭제 성공',
      });
    } else {
      res.status(404).json({
        status: 404,
        message: '해당 주소를 찾을 수 없습니다.',
      });
    }
  } catch (err) {
    next(err);
  }
};
