'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Discount_Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      smeID: {
        type: Sequelize.INTEGER
      },
      corporateName: {
        type: Sequelize.STRING
      },
      received_date: {
        type: Sequelize.DATE
      },
      invoiceNumber: {
        type: Sequelize.INTEGER
      },
      invoiceDate: {
        type: Sequelize.DATE
      },
      invoicePaymentDate: {
        type: Sequelize.DATE
      },
      invoiceAmount: {
        type: Sequelize.FLOAT
      },
      discountAmount: {
        type: Sequelize.FLOAT
      },
      payoutAmount: {
        type: Sequelize.FLOAT
      },
      invoiceStatus: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Discount_Invoices');
  }
};