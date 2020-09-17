'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Discount_Quotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      smeId: {
        type: Sequelize.INTEGER
      },
      corporateName: {
        type: Sequelize.STRING
      },
      receivedDate: {
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
      interestAmount: {
        type: Sequelize.FLOAT
      },
      transactionFee: {
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
    return queryInterface.dropTable('Discount_Quotes');
  }
};