import doctorService from '../services/doctorServices';

let getTopDoctorHome= async(req,res)=>{
   let limit = req.query.limit;
   if(!limit)
    limit = 10;
   
   try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
   } catch (e) {
     console.log(e);
     return res.status(200).json({
        errCode:-1,
        message:"Error from sever..."
     })
   }
}
let getAllDoctors= async (req,res)=>{
   try {
      let doctors =await doctorService.getAllDoctors();
      return res.status(200).json(doctors)
   } catch (e) {
      console.log(e)
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let postInfoDoctors =async (req,res)=>{
   try {
      let response =await doctorService.saveDetailInfoDoctor(req.body);
      return res.status(200).json(response);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let getDetailDoctorById  =async (req,res)=>{
   try {
      let info =await doctorService.getDetailDoctorById(req.query.id);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let bulkCreateSchedule = async(req,res)=>{
   try {
      let info = await doctorService.bulkCreateSchedule(req.body);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let getDetailDoctorByDate=async(req,res)=>{
   try {
      let info = await doctorService.getDetailDoctorByDate(req.query.doctorId,req.query.date);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let getExtraInfoDoctorById=async(req,res)=>{
   try {
      let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let getProfileDoctorById=async(req,res)=>{
   try {
      let info = await doctorService.getProfileDoctorById(req.query.doctorId);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let searchDataHome=async(req,res)=>{
   try {
      let info = await doctorService.searchDataHome(req.query.name);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}

let getListPatientForDoctor=async(req,res)=>{
   try {
      let info = await doctorService.getListPatientForDoctor(req.query.doctorId,req.query.date);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}
let sendRemedy=async(req,res)=>{
   try {
      let info = await doctorService.sendRemedy(req.body);
      return res.status(200).json(info);
   } catch (e) {
      return res.status(200).json({
         errCode:-1,
         errMessage:'Error from the sever'
      })
   }
}

module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    postInfoDoctors:postInfoDoctors,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getDetailDoctorByDate:getDetailDoctorByDate,
    getExtraInfoDoctorById:getExtraInfoDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    searchDataHome:searchDataHome,
    getListPatientForDoctor:getListPatientForDoctor,
    sendRemedy:sendRemedy
}