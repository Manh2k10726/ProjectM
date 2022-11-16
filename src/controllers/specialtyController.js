import { Model } from 'sequelize';
import specialtyServices from '../services/specialtyServices';

let createSpecialty = async(req,res)=>{
    try {
        let info = await specialtyServices.createSpecialty(req.body);
        return res.status(200).json(info);
     } catch (e) {
        return res.status(200).json({
           errCode:-1,
           errMessage:'Error from the sever'
        })
     }
}
let getAllSpecialty=async(req,res)=>{
   try {
      let info = await specialtyServices.getAllSpecialty();
        return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let getDetailSpecialty=async(req,res)=>{
   try {
      let info = await specialtyServices.getDetailSpecialty(req.query.id,req.query.location);
        return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
module.exports = {
    createSpecialty:createSpecialty,
    getAllSpecialty:getAllSpecialty,
    getDetailSpecialty:getDetailSpecialty
}