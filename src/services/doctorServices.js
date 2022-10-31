import db from "../models/index";
import _ from 'lodash';
require('dotenv').config();

const MAX_NUMBER_SCHEDULE =process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) =>{
    return new Promise(async(resolve, reject) => {
         try {
            let users = await db.User.findAll({
                where:{roleId:'R2'},
                limit:limitInput,
                order:[['createdAt','DESC']],
                attributes:{
                    exclude:['password']
                },
                include:[
                    { model: db.Allcode, as:'positionData',attributes: ['valueEn','valueVi']},
                    { model: db.Allcode, as:'genderData',attributes: ['valueEn','valueVi']}
                ],
                raw: true,
                nest:true
            })
            resolve({
                errCode:0,
                data: users
            })
         } catch (e) {
            reject(e);
         }
    })
}
let getAllDoctors = ()=>{
    return new Promise(async(resolve, reject) => {
        try {
            let doctors =await db.User.findAll({
                where:{roleId:'R2'},
                attributes:{
                    exclude:['password','image']
                },
            })

            resolve({
                errCode:0,
                data:doctors})
            
        } catch (e) {
            reject(e);
        }
    })
}
let saveDetailInfoDoctor =(inputData) =>{
    console.log('inputData',inputData)
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else {
                if (inputData.action === 'ADD') {
                    await db.markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    }) 
                }else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.markdown.findOne({
                        where:{doctorId : inputData.doctorId},
                        raw : false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML= inputData.contentHTML;
                        doctorMarkdown.contentMarkdown= inputData.contentMarkdown;
                        doctorMarkdown.description= inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }
              
                resolve({
                    errCode:0,
                    errMessage:'Save info doctor succeed !'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailDoctorById =(inputId) =>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }else{
                let data =await db.User.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:{
                        exclude:['password']
                    },
                    include:[
                        { model: db.Allcode, as:'positionData',attributes: ['valueEn','valueVi']},
                        { model: db.markdown,attributes: ['contentMarkdown','contentHTML','description']},
                        
                    ],
                    raw: false,
                    nest:true
                })
                if(data && data.image){
                    data.image = new Buffer.from(data.image,'base64').toString('binary');
                }
                if(!data ) data={};
                
                resolve({
                    errCode:0,
                    data:data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule =async (data) =>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId||!data.date){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter !'
                })
            }else{
                let schedule = data.arrSchedule;
                if (schedule && schedule.length >0) {
                    schedule =schedule.map(item=>{  
                        item.maxNumber=MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // console.log('check data schedule',schedule)
                let existing = await db.Schedule.findAll({
                    where:{doctorId:data.doctorId,date:data.date},
                    attributes:['timeType','date','maxNumber','doctorId']
                });
                // if(existing && existing.length>0){
                //     existing =existing.map(item=>{
                //         item.date=  new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                let toCreate = _.differenceWith(schedule,existing,(a,b)=>{
                    return a.timeType === b.timeType && +a.date=== +b.date;
                });
                if(toCreate && toCreate.length >0){
                    await db.Schedule.bulkCreate(toCreate);
                }
                console.log(toCreate)
                // await db.Schedule.bulkCreate(schedule);
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
let getDetailDoctorByDate = (doctorId,date)=>{
    return new Promise(async(resolve, reject) => {
      try {
        if (!doctorId || !date) {
            resolve({
                errCode:1,
                errMessage:'Missing required parameter !!!'
            })
        }else{
            let dataSchedule = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include:[
                    { model: db.Allcode, as:'timeTypeData',attributes: ['valueEn','valueVi']},    
                ],
                raw: false,
                nest:true
            })
            if(!dataSchedule) dataSchedule= [];

            resolve({
                errCode:0,
                data:dataSchedule
            })
        }
      } catch (e) {
        reject(e);
      }  
    })
}
module.exports ={
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,bulkCreateSchedule:bulkCreateSchedule,
    saveDetailInfoDoctor:saveDetailInfoDoctor,getDetailDoctorById:getDetailDoctorById,
    getDetailDoctorByDate:getDetailDoctorByDate
}