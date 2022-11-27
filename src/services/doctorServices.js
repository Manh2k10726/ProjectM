import db from "../models/index";
import _ from 'lodash';
import {Op} from 'sequelize';
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
// check isValid date
let checkRequiredFields = (inputData)=>{
    let arrFields =['doctorId','contentHTML','contentMarkdown','action','selectedPrice',
        'selectedPayment','selectedProvince','nameClinic','addressClinic','note','specialtyId'
    ]
    let isValid = true
    let element =''
    for( let i = 0;i < arrFields.length;i++){
        if(!inputData[arrFields[i]]){
            isValid=false;
            element=arrFields[i];
            break;
        }
    }
    return{
        isValid:isValid,
        element:element
    }
}
let saveDetailInfoDoctor =(inputData) =>{
    console.log('inputData',inputData)
    return new Promise(async(resolve, reject) => {
        try {
            
            // if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action || !inputData.selectedPrice
            //     || !inputData.selectedPayment|| !inputData.selectedProvince || !inputData.nameClinic || !inputData.addressClinic || !inputData.note || !inputData.specialtyId){
            //     resolve({
            //         errCode:1,
            //         errMessage:'Missing parameter'
            //     })
            // }
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                            errCode:1,
                            errMessage:`Missing parameter: ${checkObj.element}`
                        })
            }
            else {
                if (inputData.action === 'ADD') {
                    //upsert table markdown
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
                    //upsert table doctor_info
                    let doctorInfo = await db.Doctor_info.findOne({
                        where:{
                            doctorId: inputData.doctorId
                        },
                        raw : false
                    })
                    if(doctorInfo){
                        doctorInfo.doctorId=inputData.doctorId;
                        doctorInfo.priceId= inputData.selectedPrice;
                        doctorInfo.paymentId= inputData.selectedPayment;
                        doctorInfo.provinceId= inputData.selectedProvince;
                        doctorInfo.nameClinic= inputData.nameClinic;
                        doctorInfo.addressClinic= inputData.addressClinic;
                        doctorInfo.note= inputData.note;
                        doctorInfo.specialtyId= inputData.specialtyId;
                        doctorInfo.clinicId= inputData.clinicId;
                        await doctorInfo.save()
                    }else{
                        await db.Doctor_info.create({
                            doctorId:inputData.doctorId,
                            priceId: inputData.selectedPrice,
                            paymentId:inputData.selectedPayment,
                            provinceId: inputData.selectedProvince,
                            nameClinic:inputData.nameClinic,
                            addressClinic: inputData.addressClinic,
                            note: inputData.note,
                            specialtyId: inputData.specialtyId,
                            clinicId: inputData.clinicId
                        })  
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
                        { model: db.Doctor_info,attributes:{exclude: ['id','doctorId']},
                        include:[
                            { model: db.Allcode, as:'priceTypeData',attributes: ['valueEn','valueVi']},
                            { model: db.Allcode, as:'paymentTypeData',attributes: ['valueEn','valueVi']},
                            { model: db.Allcode, as:'provinceTypeData',attributes: ['valueEn','valueVi']},   
                        ]},
                            
                    ],
                    
                    raw: false,
                    nest:true
                })
                if(data && data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
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
                    { model: db.User, as:'doctorData',attributes: ['firstName','lastName']},    
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
let getExtraInfoDoctorById = (doctorId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameter !!!'
                }) 
            }else{
                let data =await db.Doctor_info.findOne({
                    where:{
                        doctorId:doctorId
                    },
                    attributes:{exclude:['id','doctorId']},
                    include:[
                        { model: db.Allcode, as:'priceTypeData',attributes: ['valueEn','valueVi']},
                        { model: db.Allcode, as:'paymentTypeData',attributes: ['valueEn','valueVi']},
                        { model: db.Allcode, as:'provinceTypeData',attributes: ['valueEn','valueVi']},   
                    ],
                    raw: false, 
                    nest:true
                })
                console.log('check data',data)
                if (!data) {
                    data={};
                }else{ 
                    resolve({
                    errCode:0,
                    data:data
                })
                }
            }
            
        } catch (e) {
            reject(e);
        }
    })
}
let getProfileDoctorById = (inputId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameter !!!'
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
                        { model: db.Doctor_info,attributes:{exclude: ['id','doctorId']},
                        include:[
                            { model: db.Allcode, as:'priceTypeData',attributes: ['valueEn','valueVi']},
                            { model: db.Allcode, as:'paymentTypeData',attributes: ['valueEn','valueVi']},
                            { model: db.Allcode, as:'provinceTypeData',attributes: ['valueEn','valueVi']},   
                        ]},
                            
                    ],
                    
                    raw: false,
                    nest:true
                })

                if(data && data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                }
                if (!data) {
                    data={};
                }else{ 
                    resolve({
                    errCode:0,
                    data:data
                })
                }
            }
            
        } catch (e) {
            reject(e);
        }
    })
}
let searchDataHome = (name)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if (!name) {
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameter !!!'
                })}
            let doctors =await db.Specialty.findAll({
                where: { name: { [Op.like]: '%'+name.toLowerCase()+'%' },
                         },
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
let getListPatientForDoctor = (doctorId,date)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameter !!!'
                })}
            let data =await db.Booking.findAll({
                where: { statusId:'S2',
                         doctorId:doctorId,
                         date:date
                         },
                    include:[{
                         model:db.User, as: 'patientData',
                         attributes:['email','firstName','address','gender'],
                         include:[{
                            model:db.Allcode , as: 'genderData', attributes: ['valueVi','valueEn'] }
                        ],
                    },],
                    raw: false,
                    nest:true
            })

            if (!data) {
                data={};
            }else{ 
                resolve({
                errCode:0,
                data:data
            })}
            
        } catch (e) {
            reject(e);
        }
    })
}
module.exports ={
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,bulkCreateSchedule:bulkCreateSchedule,
    saveDetailInfoDoctor:saveDetailInfoDoctor,getDetailDoctorById:getDetailDoctorById,
    getDetailDoctorByDate:getDetailDoctorByDate,
    getExtraInfoDoctorById:getExtraInfoDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    searchDataHome:searchDataHome,
    getListPatientForDoctor:getListPatientForDoctor
}