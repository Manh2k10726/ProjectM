require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail =async (dataSend) =>{

// async..await is not allowed in global scope, must use a wrapper

   
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORDS, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Test send email 👻👻👻" <nguyenmanh26072k1@gmail.com>', // sender address
      to: dataSend.receiverEmail, // list of receivers
      subject: "Thông báo xác nhận đặt lịch khám bệnh", // Subject line
    //   text: "Hello world?", // plain text body
      html: getBodyHtml(dataSend), // html body
    });
  
 
  }
  let getBodyHtml =(dataSend)=>{
    let result ='';
    if (dataSend.language  === 'en') {
        result =
        `
      <h3> Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked an appointment on the Bk care website</p>
      <p>Information to book a medical appointment: </p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor: ${dataSend.doctorName}</b></div>
      <p>If the other information is true, please click on the link below to verify and complete the procedure</p>
      <div>
        <a href=${dataSend.redirectLink} target="_blank"> Click here </a>
      </div>
    <div>Sincerely thank !!!</div>
      `
    }
    if (dataSend.language === 'vi') {
        result =
        `
        <h3> Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên website Bk care</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin kia là đúng sự thật , vùi lòng nhấn vào đường link bên dưới để xác thực và hoàn tất thủ tục</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank"> Click here </a>
        </div>
      <div>Xin chân thành cảm ơn !!!</div>
        `  
    }
    return result;
  }

module.exports= {
    sendSimpleEmail:sendSimpleEmail
}