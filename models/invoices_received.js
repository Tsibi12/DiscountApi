'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invoices_Received = sequelize.define('Invoices', {
    corporateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    smeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    smeVendorNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invoicePaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invoiceAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    invoiceStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Available'
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    corporateName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    baseRateId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interestAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    transactionFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payoutAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }, 
  }, { freezeTableName: true});
  Invoices_Received.associate = models => {
    // associations can be defined here
    // Invoice belongsTo sme
    Invoices_Received.belongsTo(models.Sme, { foreignKey: 'smeId', as: 'sme' });

    // Invoice belongsTo corporate
    Invoices_Received.belongsTo(models.Corporate, { foreignKey: 'corporateId', as: 'corporate' });
  };
  return Invoices_Received;
};