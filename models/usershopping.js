'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userShopping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userShopping.init({
    userId: DataTypes.NUMBER,
    shoppingId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'userShopping',
  });
  return userShopping;
};