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
  let sendAttachment = async (dataSend)=>{
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
      to: dataSend.email, // list of receivers
      subject: "Thông báo xác nhận đặt lịch khám bệnh", // Subject line
    //   text: "Hello world?", // plain text body
      html: getBodyHtmlEmailRemedy(dataSend), // html body
      attachments:[
        {
          filename:`remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
          content:dataSend.imageBase64.split("base64,")[1],
          encoding:'base64'
        }
      ],
    });
  }
  let getBodyHtmlEmailRemedy=(dataSend)=>{
    let result ='';
    if (dataSend.language  === 'en') {
        result =
        `
        <h3> Dear  ${dataSend.patientName} !</h3>
        <p>This email is the result and accompanied by a prescription (if any) of the examination: ${dataSend.timeTypeDataPt.valueEn} </p>
        <p> All details are sent in the attached file: </p>
          
        <div> If anything has problems please contact the customer room <div/>
        <div>Address: No. 201- ABC- Ha Dong- Hanoi</div>
        <div>Hotline : 012329437</div>
        <div>BK Care is pleased to serve you !!!</div>
      `
    }
    if (dataSend.language === 'vi') {
        result =
        `
        <h3> Xin chào ${dataSend.patientName}!</h3>
        <p>Email này là kết quả và kèm theo đơn thuốc (nếu có) của buổi khám : ${dataSend.timeTypeDataPt.valueVi} </p>
        <p>Mọi thông tin chi tiết được gửi trong file đính kèm : </p>
          
        <div>Nếu có điều gì vướng mắc vui lòng liên hệ phòng châm sóc khách hàng </div>
        <div>Địa chỉ : số 201- đường abc- Hà Đông - Hà Nội</div>
        <div>Hotline : 012329437</div>
        <div>Bk care hân hạnh được phục vụ quý khách !!!</div>
        `  
    }
    return result;
  }
module.exports= {
    sendSimpleEmail:sendSimpleEmail,
    sendAttachment:sendAttachment
}