import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { Accident } from "src/app/shared/accident";
import {forkJoin } from 'rxjs';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  accident: Accident[] = null;
  users: any =[];
  latestAccident: Accident[];
  background: string = "white";
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getAccidentsFromFirestore2()
    .subscribe(item => {
      this.accident = item;
      console.log(this.accident);
      if (this.accident.length > 0) {
        this.playAudio();
        this.firebaseService.getUser(this.accident).subscribe(item => {
          //  this.user = item;
          item.forEach(it => {
            it.subscribe(i => {
              this.users.push(i)
            });
          })
        });
      }
      this.firebaseService.getCurrentUser();
    });
  }

  playAudio() {
    this.firebaseService.playAudio();
  }

  logout() {
    this.firebaseService.logout();
  }

  accept() {
    this.firebaseService.acceptHospital();
  }

  getNearestHospital()
  {
    var nHuid = this.firebaseService.getNearestHospital(this.accident);
  }
}
