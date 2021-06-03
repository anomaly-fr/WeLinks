const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotification= functions.https.onCall((data,context)=>{
    var {title,body,message,topic} = data;
    var payload ={
        notification:{
            title: title,
            body: body
        },
        data:{
            title: title,
            body: message
        }
    };

    return admin.messaging().sendToTopic(topic,payload);
});

    



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
