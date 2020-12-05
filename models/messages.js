'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  messages.init({
    sender: DataTypes.STRING,
    receiver: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'messages',
  });
  return messages;
};