'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Restaurant.init({
    restaurantId: DataTypes.INTEGER,
    restaurantName: DataTypes.STRING,
    countryCode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    locality: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    cuisines: DataTypes.STRING,
    averageCostForTwo: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    hasTableBooking: DataTypes.BOOLEAN,
    hasOnlineDelivery: DataTypes.BOOLEAN,
    isDelivering: DataTypes.BOOLEAN,
    priceRange: DataTypes.INTEGER,
    aggregateRating: DataTypes.FLOAT,
    ratingColor: DataTypes.STRING,
    ratingText: DataTypes.STRING,
    votes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};