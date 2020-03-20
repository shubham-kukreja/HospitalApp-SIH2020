const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

let db = admin.firestore();
const fcm = admin.messaging();
exports.sendToDevice = functions.firestore
  .document("accident/{accidentID}")
  .onUpdate(async item => {
    const payload = {
      notification: {
        title: "SOS",
        body: "EMERGENCY!",
        color: "#ff0000",
        icon: "https://img.icons8.com/bubbles/2x/appointment-reminders.png"
      }
    };
    return fcm.sendToDevice(
      "d6nAd_CZ3-I:APA91bHmURY9ZQbMv0vPUTJwAneSM2xjQtmNBZ43cnmhGqdU5qgD1_eJqCdUDmQhqxFv1ICwjqwosdcf2E-ZABoTw2vJFSrVjOmOXVl8C5CHS4FNfjoE8wg1KSoI1ydC-pqdMKy19LbR",
      payload
    );
  });
// let hospital = "";
// function dist(lat1, lon1, lat2, lon2, unit) {
//   if (lat1 == lat2 && lon1 == lon2) {
//     return 0;
//   } else {
//     var radlat1 = (Math.PI * lat1) / 180;
//     var radlat2 = (Math.PI * lat2) / 180;
//     var theta = lon1 - lon2;
//     var radtheta = (Math.PI * theta) / 180;
//     var dist =
//       Math.sin(radlat1) * Math.sin(radlat2) +
//       Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     if (dist > 1) {
//       dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515;
//     if (unit == "K") {
//       dist = dist * 1.609344;
//     }
//     if (unit == "N") {
//       dist = dist * 0.8684;
//     }
//     return dist;
//   }
// }
// exports.myFunctionName = functions.firestore
//   .document("accident/{id}")
//   .onCreate((snap, context) => {
//     var id = context.params.id;
//     const data = snap.data();
//     var lat = data.Latitude;
//     var long = data.Longitude;
//     let minDist = 1000000,
//       currDist = 0,
//       minLat = 0,
//       minLong = 0,
//       hospitaluid = "s";
//     db.collection("Hospitals")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           for (var i = 0; i < 6; i++) {
//             currDist = dist(lat, long, doc.data().lati, doc.data().longi, "K");
//             if (currDist < minDist) {
//               minDist = currDist;
//               hospitaluid = doc.id;
//               this.hospital = doc.id;
//               minLat = parseFloat(doc.data().lati);
//               minLong = parseFloat(doc.data().longi);
//             }
//           }
//         });
//       });
//     return db
//       .collection("accident")
//       .doc(id)
//       .update({
//         name: "Shubham by Cloud Functions",
//         hospitalDeploy: this.hospital
//       });
//   });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
