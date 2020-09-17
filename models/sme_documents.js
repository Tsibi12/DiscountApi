'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sme_documents = sequelize.define(
    "Sme_documents",
    {
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      smeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fileType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      confirmedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {}
  );
  Sme_documents.associate = function(models) {
    // associations can be defined here
    Sme_documents.belongsTo(models.Sme,{ foreignKey: 'smeId', as: 'sme' });
  };
  return Sme_documents;
};

