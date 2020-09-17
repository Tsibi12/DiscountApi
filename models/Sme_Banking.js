'use strict';
module.exports = (sequelize, DataTypes) => {
  const SmeBanking = sequelize.define('SmeBanking', {
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    smeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  SmeBanking.associate = models => {
    // associations can be defined here

    // SmeBanking belongsTo SME
    SmeBanking.belongsTo(models.Sme, { foreignKey: 'smeId', as: 'sme' })

  };

  return SmeBanking;
};