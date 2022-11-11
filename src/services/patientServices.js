import db from "../models/index";
import _ from 'lodash';
import user from "../models/user";
import emailServices from './emailServices'
require('dotenv').config();

let postBookAppointment =(data) =>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else{
                await emailServices.sendSimpleEmail({
                    receiverEmail:data.email,
                    patientName:data.fullName,
                    time:data.timeString,
                    doctorName:data.doctorName,
                    language:data.language,
                    redirectLink:"https://youtu.be/qEWFxJlmqlg"
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where :{ email : data.email},
                    defaults:{
                        email: data.email,
                        roleId:'R3'
                    }
                });
                console.log('check user :',user[0])
                //create a booking record
                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where:{patientId:user[0].id},
                        defaults:{
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId:user[0].id,
                            date:data.date,
                            timeType:data.timeType
                        }
                    })
                }
                resolve({
                    // data:user,
                    errCode: 0,
                    errMessage:'add user patient succeed'
                })
            }
            
        } catch (error) {
            
        }
    })
}

module.exports={
    postBookAppointment:postBookAppointment
}