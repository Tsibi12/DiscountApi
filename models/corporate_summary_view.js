'use strict';
module.exports = (sequelize, DataTypes) => {
  const Corporate_Summary_View = sequelize.define(
    "Corporate_Summary_Views",
    {
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      corporateName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receivedinvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receivedinvoicesamount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unavailableinvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unavailableinvoicesamount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      availableinvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      availableinvoicesamount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      requestedinvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requestedinvoicesamount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      confirmedinvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      confirmedinvoicesamount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paidInvoices: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paidInvoicesAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      revenue: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
       corporateid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { freezeTableName: true, timestamps: false }
  );

   Corporate_Summary_View.removeAttribute("id");

  Corporate_Summary_View.associate = function(models) {
    // associations can be defined here
  };
  return Corporate_Summary_View;
};