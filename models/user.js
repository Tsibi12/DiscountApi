'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified:{ 
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires:{ 
      type:DataTypes.DATE,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique:true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }, 
    lastSignedInAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }, 
    changePassword: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 

  }, {});
  User.associate = models => {
    // associations can be defined here
    // user hasMany SME
    User.hasMany(models.Sme, { foreignKey: 'userId', as: 'sme' })

    // User hasOne role
    User.belongsToMany(models.Role, {
      through: "user_roles",
      foreignKey: "userId",
      otherKey: "roleId"
    })

  };
  return User;
};