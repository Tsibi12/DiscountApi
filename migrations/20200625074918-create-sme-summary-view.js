'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sme_Summary_Views', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      registrationDate: {
        type: Sequelize.DATE
      },
      smeName: {
        type: Sequelize.STRING
      },
      paidInvoices: {
        type: Sequelize.FLOAT
      },
      oustandingInvoices: {
        type: Sequelize.FLOAT
      },
      paidInvoicesAmount: {
        type: Sequelize.FLOAT
      },
      revenue: {
        type: Sequelize.FLOAT
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sme_Summary_Views');
  }
};