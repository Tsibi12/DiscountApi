'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'sme'
    },
  }, { timestamps: false});
  Role.associate = models => {
    // associations can be defined here

    // Role belongsToMay user
    Role.belongsToMany(models.User, {
      through: "user_roles",
      foreignKey: "roleId",
      otherKey: "userId"
    });
  };

  return Role;
};