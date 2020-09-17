'use strict';
module.exports = (sequelize, DataTypes) => {
  const Corporates_Sme = sequelize.define('Corporates_Sme', {
    smeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    corporateId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    // registrationNo: {
    //   allowNull: false,
    //   type: DataTypes.STRING,
    // },
    vendorNo: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {});
  Corporates_Sme.associate = models => {
    // associations can be defined here

    // Corporates_Sme belongsTo sme
    Corporates_Sme.belongsTo(models.Sme, { foreignKey: 'smeId', as: 'sme' });

    // Corporates_Sme belongsTo corporate
    Corporates_Sme.belongsTo(models.Corporate, {foreignKey: 'corporateId', as: 'corporate' });
  };
  return Corporates_Sme;
};