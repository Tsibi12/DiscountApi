'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Invoices_Received', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      corporateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Corporates",
          key: "id",
        },
      },
      smeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Smes",
          key: "id",
        },
      },
      smeVendorNo: {
        type: Sequelize.STRING,
         allowNull: false,
      },
      invoiceNumber: {
        type: Sequelize.INTEGER,
         allowNull: false,
      },
      invoiceDate: {
        type: Sequelize.DATE,
         allowNull: false,
      },
      invoicePaymentDate: {
        type: Sequelize.DATE,
         allowNull: false,
      },
      invoiceAmount: {
        type: Sequelize.FLOAT,
         allowNull: false,
      },
      invoiceStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Available'
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
    return queryInterface.dropTable('Invoices_Received');
  }
};