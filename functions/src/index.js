"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
let db = admin.firestore();
admin.initializeApp();
const fcm = admin.messaging();
exports.sendToDevice = functions.firestore
    .document("accident/{accidentID}")
    .onUpdate(async (item) => {
    const payload = {
        notification: {
            title: "SOS",
            body: "EMERGENCY!",
            color: '#ff0000',
            icon: 'https://img.icons8.com/bubbles/2x/appointment-reminders.png'
        }
    };
    return fcm.sendToDevice("colexL5Se_o:APA91bEoJbat45dPGDjcs2jN_o0DgsHKd3GyYj0XRKB9ZfwhKXGe_09KCTwukXihL2ylpuTlireEf9NCAOFTrWvnzqQJEvIm8aNA1Feq67gfdfOACs1v09fjgF00hpQ4udKNfm4eludN", payload);
});
exports.myFunctionName = functions.firestore
    .document('accidents/{id}').onCreate((snap, context) => {
        var id = context.params.id;
        const data = snap.data();
        var lat = data.Latitude;
        var long = data.Longitude;
        return db.collection('accidents').doc(id).update({
            name : 'Shubham by Cloud Functions',
            lat : lat,
            long : long
        })

    });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map