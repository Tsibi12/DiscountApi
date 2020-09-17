'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Corporates_Smes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      smeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Smes",
          key: "id",
        },
      },
      corporateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Corporates",
          key: "id",
        },
      },
      // registrationNo: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      vendorNo: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('Corporates_Smes');
  }
};