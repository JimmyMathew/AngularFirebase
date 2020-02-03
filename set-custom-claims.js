
var admin = require("firebase-admin");
var uid = process.argv[2];
var serviceAccount = require("./fir-angular-learning-app-firebase-adminsdk-tvgwy-709026430d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-angular-learning-app.firebaseio.com"
});

admin.auth().setCustomUserClaims(uid,{admin: true})
    .then(()=> {
        console.log('Custom claim set for the user', uid);
        process.exit();
})
.catch(error=> {
    console.log('Error: ' +error );
    process.exit(1);
})