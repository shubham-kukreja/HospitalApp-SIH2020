import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
import { Accident } from "../shared/accident";
import { Router } from "@angular/router";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  accident: Observable<Accident[]>;
  accidents: Observable<Accident[]>;
  itemDoc: AngularFirestoreDocument;
  private eventAuthError = new BehaviorSubject<string>("");
  user: any = [];
  userState;
  currentUser;
  uid: string;
  hospital;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {}

  getAccidentsFromFirestore2() {
    this.accidents = this.afs
      .collection("accident", ref => ref.where("flag", "==", true))
      .valueChanges();
    return this.accidents;
  }
  getAccidentsFromFirestore() {
    var accident = this.afs
      .collection("accident", ref => ref.where("flag", "==", true))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Accident;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
    return accident;
  }
  getUser(userInfo: any) {
    if (userInfo[0].Trip) {
      this.uid = userInfo[0].Trip.forEach(u => {
        this.user.push(this.afs.doc("Users/" + u).valueChanges());
      });
    }
    // this.itemDoc = this.afs.doc("Users/" + this.uid);
    // this.user = this.itemDoc.valueChanges();
    return of(this.user);
  }
  playAudio() {
    var audio = new Audio("./assets/music/alarm-clock-beeps_GJ_3w3Vd_WM.mp3");
    var playPromise = audio.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        audio.play();
      });
    }
  }
  login(email, password) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(async error => {
        this.eventAuthError.next(error);
        window.alert(error);
      });
    this.afAuth.authState.subscribe(item => (this.userState = item));
    if (this.userState) {
      this.router.navigate(["/home"]);
    }
  }

  logout() {
    this.router.navigate(["/login"]);
    console.log("Fuck You");
    return this.afAuth.auth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser.uid;
  }

  acceptHospital() {
    var hospital, accident;
    this.getAccidentsFromFirestore().subscribe(item => {
      accident = item[0].id;
      hospital = this.getCurrentUser();
      this.afs.doc(`accident/${accident}`).update({
        flag: false,
        hospitalDeploy: hospital
      });
    });
  }

  getNearestHospital(accident) {
    accident = accident[0];
    var hospitaluid;
    var lat1 = parseFloat(accident.Latitude);
    var long1 = parseFloat(accident.Longitude);
    let minDist = 1000000,
      currDist = 0,
      minLat = 0,
      minLong = 0;
    this.hospital = this.afs
      .collection("Hospitals")
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Accident;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      )
      .subscribe(items => {
        items.forEach((item: Accident) => {
          for (var i = 0; i < 6; i++) {
            currDist = this.distance(lat1, long1, item.lati, item.longi, "K");
            if (currDist < minDist) {
              minDist = currDist;
              hospitaluid = item.id;
              minLat = parseFloat(item.lati);
              minLong = parseFloat(item.longi);
            }
          }
        });
        console.log(hospitaluid);
        console.log(lat1, long1);
        console.log(minLat, minLong, minDist);
        return hospitaluid;
      });
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
}
