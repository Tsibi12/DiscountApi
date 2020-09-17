'use strict';
module.exports = (sequelize, DataTypes) => {
  const Corporate = sequelize.define(
    "Corporate",
    {
      corporateName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      margin: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transactionFeerate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Corporate.associate = function(models) {
    // associations can be defined here
    // Corporate hasMany  invoice
    Corporate.hasMany(models.Invoices, { foreignKey: 'corporateId', as: 'invoice' })

    // Corporate hasMany  Corporates_Sme
    Corporate.hasMany(models.Corporates_Sme, { foreignKey: 'corporateId', as: 'corporates_sme' })

     // Corporate hasMany  CorporateInterestRate
    // Corporate.hasMany(models.CorporateInterestRate, { foreignKey: 'corporateId', as: 'corporateInterestRate' })
  };
  return Corporate;
};