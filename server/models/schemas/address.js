const { Schema } = require('mongoose');

const addressSchema = new Schema(
  {
    // 유저데이터
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // 주소지 라벨
    name: {
      type: String,
      required: true,
    },
    // 수령인
    recipient: {
      type: String,
    },
    // 우편번호
    zipCode: {
      type: Number,
      min: [1000, '유효하지 않은 우편번호입니다.'],
      max: 99999,
      required: true,
    },
    // 주소
    detailAddress: {
      type: String,
      required: true,
    },
    // 전화번호
    phone: {
      type: Number,
      match: /^\d{3}-\d{3,4}-\d{4}$/,
    },
    // 기본배송지인지, 아닌지
    mainAddress: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'address',
    timestamps: true,
  },
);

module.exports = addressSchema;
