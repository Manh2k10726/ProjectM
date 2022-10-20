import db from "../models/index";
import CRUDservice from '../services/CRUDservices';

let getHomePage = async(req, res) => {
    try{
        let data = await db.User.findAll();
        console.log(data)
        return res.render('homepage.ejs',{
            data:JSON.stringify(data)
        });
    }catch(e) {
        console.log(e)
    }
   

}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req,res) => {
    return res.render('crud.ejs');
}
let postCRUD = async(req,res) =>{
   let message = await CRUDservice.createNewUser(req.body);
   console.log(message)
    return res.send('adsdffff');
}
let displayGetCRUD=async(req,res) =>{
    let data= await CRUDservice.getAllUser();
    console.log(data)
    return res.render('displayCRUD.ejs',{
        dataTable:data
    })
        
}
let getEditCRUD=async(req,res) =>{
    let userId=req.query.id ;
    if(userId){
        
        let userData =await CRUDservice.getUserInfoById(userId);
        console.log(userData)
        return res.render('editCRUD.ejs',{
            user: userData
        });
    }
    else{
        return res.send('user not found');
    }
   
    
}
let putCRUD =async (req,res)=>{
    let data =req.body;
    let allUsers= await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs',{
        dataTable:allUsers
    })
}
let deleteCRUD =async (req,res) =>{
    let id =req.query.id;
    if(id){
        await CRUDservice.deleteUserById(id);
        return res.send('Delete the user succeed!')
    }else{
        return res.send('User not found!')
    }
}
// object: {
//     key: '',
//     value: ''
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD,
}