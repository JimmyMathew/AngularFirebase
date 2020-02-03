const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const gmailEmail  = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport  = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: gmailEmail,
        pass: gmailPassword
    }
})

const APP_NAME =  'Angular Firebase Learning App';

async function sendWelcomeEmail(email,displayName){
    const mailOptions = {
        from: `${APP_NAME} <jimmy.connect@gmail.com`,
        to: email
    }

    mailOptions.subject = `Welcome to ${APP_NAME}`;
    mailOptions.text = `Hey ${displayName || ''}! Welcome to the team of Firebase learners`;

    await mailTransport.sendMail(mailOptions);
    console.log('New welcome email sent to: ',email);

    return null;
}
 
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) =>{
    const email = user.email;
    const displayName = user.displayName;

    return sendWelcomeEmail(email, displayName);
})