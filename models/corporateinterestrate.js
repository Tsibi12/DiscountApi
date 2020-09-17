'use strict';
module.exports = (sequelize, DataTypes) => {
  const CorporateInterestRate = sequelize.define('Global_Interest_Rates', {
    interestRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    effectiveDate: {
      type:DataTypes.DATE,
      allowNull: false,
    },
    // corporateId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // }
  }, { freezeTableName: true});
  CorporateInterestRate.associate = function(models) {
    // associations can be defined here

    // Belongs to Corporate
    // CorporateInterestRate.belongsTo(models.Corporate, { foreignKey: 'corporateId', as: 'corporate' })
  };
  return CorporateInterestRate;
};