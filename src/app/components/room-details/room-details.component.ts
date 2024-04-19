import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HttpService } from 'src/app/Services/http.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
})
export class RoomDetailsComponent implements OnInit, OnChanges {

  @Input() roomDetails!: any;

  selected: any = new Date().setHours(0, 0, 0, 0);
  timeArray: any = [];
  fromTimeSelect: any;
  toTimeSelect:any;
  timeSlots: any = [];
  constructor(private http: HttpService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.roomDetails = this.roomDetails;
    console.log('curr Room', this.roomDetails)
    if (this.roomDetails) {
      this.setTime();
    }
  }

  setTime() {
    const start = new Date();
    start.setHours(10, 0, 0); //8 AM
    const end = new Date();
    end.setHours(18, 30, 0); //5 PM
    this.timeArray = [];

    while (start <= end) {
      let time: any = {};
      time.start = start.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit'});
      start.setMinutes(start.getMinutes() + 30);
      time.end = start.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit'});

      let index = this.roomDetails?.bookings.findIndex((data: any) => ((time.start === data.from) && moment(this.selected).isSame(data.bookingDate)));
      console.log('index', index, time.start, this.selected)
      if (index != undefined && (index > -1)) {
        time.isSelected = true;
      }

      this.timeArray.push(time);
    }
  }

  slctTime(time:any) {
    if (!time.isSelected) {
      time.isSelectionStart = true;
      this.timeSlots.push({ from: time.start, to: time.end });
    }
  }


  bookRoom() {
    console.log("selected", this.selected);
    let payload: any = [];
    let isError: boolean = false

    if (this.timeSlots.length === 0) isError = true;
    this.timeSlots.forEach((element: any) => {
      if (element) {
        if (!this.roomDetails.id || !this.selected || !element.from || !element.to) isError = true;
        payload.push({
          "roomId": this.roomDetails.id,
          "from": element.from,
          "to": element.to,
          "bookingDate": new Date(this.selected).setHours(0, 0, 0, 0),
          "isCanceled": false
        })
      }
    });

    if (isError) {
      this._snackBar.open('Please select all details', 'Close', { duration: 3000 }); 
      return;
    }
    console.log('payload', payload);
    this.http.post('bookings/add',payload).subscribe((data) => {
      if (data) {
        this.timeSlots = [];
        this.getRooms();
      }
    })
  }

  getRooms() {
    this.http.get("rooms").subscribe((data: any) => {
      if (data) {
        this.roomDetails = data.filter((roomData: any) => roomData.id === this.roomDetails.id)[0];
        this.setTime();
      }
    })
  }

}
