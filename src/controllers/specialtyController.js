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
// let postVerifyBookAppointment = async (req,res)=>{
//    try {
//       let info = await patientServices.postVerifyBookAppointment(req.body);
//       return res.status(200).json(info);
//    } catch (e) {
//       return res.status(200).json({
//          errCode:-1,
//          errMessage:'Error from the sever'
//       })
//    }
// }
module.exports = {
    createSpecialty:createSpecialty,
    // postVerifyBookAppointment:postVerifyBookAppointment
}