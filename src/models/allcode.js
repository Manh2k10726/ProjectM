'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
   
    static associate(models) {
      Allcode.hasMany(models.User,{foreignKey: 'positionId' , as: 'positionData'})
      Allcode.hasMany(models.User,{foreignKey: 'gender' , as: 'genderData'})
      Allcode.hasMany(models.Schedule,{foreignKey: 'timeType' , as: 'timeTypeData'})

      Allcode.hasMany(models.Doctor_info,{foreignKey: 'priceId' , as:'priceTypeData'})
      Allcode.hasMany(models.Doctor_info,{foreignKey: 'paymentId' , as:'paymentTypeData'})
      Allcode.hasMany(models.Doctor_info,{foreignKey: 'provinceId' , as:'provinceTypeData'})

    }
  }
  Allcode.init({
    // id:DataTypes.INTEGER,
    keyMap:DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};