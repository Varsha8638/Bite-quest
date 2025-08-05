'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      restaurantId: {
        type: Sequelize.INTEGER
      },
      restaurantName: {
        type: Sequelize.STRING
      },
      countryCode: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      locality: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      cuisines: {
        type: Sequelize.STRING
      },
      averageCostForTwo: {
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING
      },
      hasTableBooking: {
        type: Sequelize.BOOLEAN
      },
      hasOnlineDelivery: {
        type: Sequelize.BOOLEAN
      },
      isDelivering: {
        type: Sequelize.BOOLEAN
      },
      priceRange: {
        type: Sequelize.INTEGER
      },
      aggregateRating: {
        type: Sequelize.FLOAT
      },
      ratingColor: {
        type: Sequelize.STRING
      },
      ratingText: {
        type: Sequelize.STRING
      },
      votes: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants');
  }
};