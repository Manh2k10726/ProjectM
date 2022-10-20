import userServices from "../services/userServices"

let handleLogin =async(req,res)=>{
    let email =req.body.email;
    let password =req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode:1,
            message:'Missing inputs parameter !',
        })
    } else {
        
    }
    let userData = await userServices.handleUserLogin(email,password)
    return res.status(200).json({
        errCode:userData.errCode,
        message:userData.errMessage,
        user:userData.user ? userData.user :{}
       
    })
}
let handleGetAllUsers =async(req,res)=>{
    let id = req.query.id;//All,Single
    if (!id) {
        return res.status(200).json({
            errCode:1,
            errMessage:'Missing required parameters',
            users:[]
        })
    }
    let users =await userServices.getAllUsers(id);
    return res.status(200).json({
        errCode:0,
        errMessage:'ok',
        users
    })
}
let handleCreateNewUser =async (req,res) =>{
    let message =await userServices.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}
let handleEditUser=async(req,res) =>{
    let data =req.body;
    let message= await userServices.updateUserData(data);
    return res.status(200).json(message)
}
let handleDeleteUser= async(req,res)=>{
    if(!req.body.id){
        return res.status(200).json({
            errCode:1,
            errMessage:'Missing required parameters !!!'
        })
    }
    let message =await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
}
let handleAllCode=async(req,res)=>{
    try {
        // setTimeout(async() =>{
            let data= await userServices.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        // },2000)
    } catch (e) {
        console.log('get all code error',e)
        return res.status(200).json({
            errCode:-1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleLogin:handleLogin,
    handleGetAllUsers:handleGetAllUsers,
    handleCreateNewUser:handleCreateNewUser,
    handleEditUser:handleEditUser,
    handleDeleteUser:handleDeleteUser,
    handleAllCode:handleAllCode

}