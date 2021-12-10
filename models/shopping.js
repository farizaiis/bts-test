'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shopping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  shopping.init({
    name: DataTypes.STRING,
    createdDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'shopping',
  });
  return shopping;
};