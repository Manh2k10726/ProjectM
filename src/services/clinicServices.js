import db from "../models/index";
import _ from 'lodash';

require('dotenv').config();


let createClinic=(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name||!data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown ){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else{
                await db.clinic.create({
                    name:data.name,
                    address:data.address,
                    image:data.imageBase64,
                    descriptionHTML:data.descriptionHTML,
                    descriptionMarkdown:data.descriptionMarkdown
                })
                resolve({
                    errCode:0,
                    errMessage:'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
} 
let getAllClinic =()=>{
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.clinic.findAll({});
            if (data && data.length >0) {
                data.map(item =>{
                    item.image = new Buffer(item.image,'base64').toString('binary');
                    return item;
                })

            }
        resolve({
            errCode:0,
            errMessage:"ok",
            data:data
        })
        } catch (e) {
            reject(e)
        }
    })
}
// let getDetailClinic = (inputId,location)=>{
//     return new Promise(async(resolve, reject) => {
//         try {
//             if(!inputId || !location ){
//                 resolve({
//                     errCode:1,
//                     errMessage:'Missing parameter'
//                 })
//             }else{
//                 let data =await db.clinic.findOne({
//                         where:{id:inputId},
//                         attributes:['descriptionHTML','descriptionMarkdown','name'],
//                     })
//                     if (data) {
//                         let doctorClinic =[];
//                         if(location === 'ALL'){
//                             doctorClinic = await db.Doctor_info.findAll({
//                                 where:{ClinicId:inputId},
//                                 attributes:['doctorId','provinceId',],
//                             })
//                         }else{
//                             doctorClinic = await db.Doctor_info.findAll({
//                                 where:{ClinicId:inputId,
//                                         provinceId:location},
//                                 attributes:['doctorId','provinceId',],
//                             })
//                         }
                         
//                         data.doctorClinic =doctorClinic
//                     }else data={}
//                     resolve({
//                         errMessage:'Ok',
//                         errCode:0,
//                         data
//                     })
                
              
//             }
//         } catch (e) {
//             reject(e)
//         }
//     })
// }
module.exports={
    createClinic:createClinic,
    getAllClinic:getAllClinic,
//     getDetailClinic:getDetailClinic
}