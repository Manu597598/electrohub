import nodemailer from 'nodemailer';

const sendOTPMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'manu996205@gmail.com',
        pass: 'euxuggcekygruneg', // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: 'manu996205@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    });

    console.log('OTP sent successfully to', email);
    return true;
  } catch (err) {
    console.error('Error sending OTP:', err);
    return false;
  }
};







