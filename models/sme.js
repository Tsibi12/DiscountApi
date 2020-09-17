'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sme = sequelize.define(
    "Sme",
    {
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyRegNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      officeNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vatNo: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      numberOfDirectors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "New",
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {}
  );
  Sme.associate = models => {
    // associations can be defined here

    // SME belongsTo user
    Sme.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    // SME hasMany SME_Banking 
    Sme.hasMany(models.SmeBanking, { foreignKey: 'smeId', as: 'sme_banking' });

    // Sme hasMany Corporates_Sme
    Sme.hasMany(models.Corporates_Sme,{  foreignKey: 'smeId', as:'corporate_sme'});

    // Sme hasMany invoice
    Sme.hasMany(models.Invoices, { foreignKey: 'smeId', as: 'invoice' });

    // documents
    Sme.hasMany(models.Sme_documents, { foreignKey: 'smeId', as: 'documents' });

  };

  return Sme;
};