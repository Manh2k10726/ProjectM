import { Model } from 'sequelize';
import clinicServices from '../services/clinicServices';

let createClinic = async(req,res)=>{
    try {
        let info = await clinicServices.createClinic(req.body);
        return res.status(200).json(info);
     } catch (e) {
        return res.status(200).json({
           errCode:-1,
           errMessage:'Error from the sever'
        })
     }
}
// let getAllClinic=async(req,res)=>{
//    try {
//       let info = await ClinicServices.getAllClinic();
//         return res.status(200).json(info);
//    } catch (e) {
//       return res.status(200).json({
//          errCode:-1,
//          errMessage:'Error from the sever'
//       })
//    }
// }
// let getDetailClinic=async(req,res)=>{
//    try {
//       let info = await ClinicServices.getDetailClinic(req.query.id,req.query.location);
//         return res.status(200).json(info);
//    } catch (e) {
//       return res.status(200).json({
//          errCode:-1,
//          errMessage:'Error from the sever'
//       })
//    }
// }
module.exports = {
    createClinic:createClinic
}