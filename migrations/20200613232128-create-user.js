'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      password: {
        type: Sequelize.STRING,
         allowNull: false,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:true
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
    return queryInterface.dropTable('Users');
  }
};