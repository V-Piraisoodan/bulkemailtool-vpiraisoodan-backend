import nodemailer from 'nodemailer';

const Email = (options) => {
  let transpoter = nodemailer.createTransport({
    service: 'gmail', //i use outlook
    auth: {
      user: process.env.USER, // email
      pass: process.env.PASSWORD, //password
    },
  });
  transpoter.sendMail(options, (err, info) => {
    if (err) {
      // console.log(err);
      return;
    }
  });
};

// send email
const EmailSender = ({ fullName, email, to, url,subject,bcc, message }) => {
  // const ans = bcc.split(",");

const options = {
    from: `${fullName} <${email}>`,
    to: `${to}`,
    subject: `${subject}`,
    bcc : `${bcc}`,
    // bcc : `${ans || "piraisoodanv1996@gmail.com"}`,
    envelope : {
      from: `V.Piraisoodan <${process.env.USER}>`,
      to: `${to}`,
      bcc: `${bcc}`
    },
    html: `
    <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
      <div style="max-width: 700px; background-color: white; margin: 0 auto">
        <div style="width: 100%;">
         <img
           src=${url}
           style="width: 70%; height: 10%; object-fit:contain ; padding: 10px 30px;"/>  
        </div>
        <div style="width: 100%; gap: 10px; padding: 10px 0;">
          <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
           ${subject}
          </p>
          <div style="font-size: .8rem; margin: 0 30px">
            <p>FullName: <b>${fullName}</b></p>
            <p>Email: <b>${email}</b></p>
            <p>Message: <i>${message}</i></p>
          </div>
        </div>
      </div>
    </div>
        `
  };

  Email(options)
};

export default EmailSender
