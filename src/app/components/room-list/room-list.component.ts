import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { HttpService } from 'src/app/Services/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnChanges {

  @Output() roomSelection = new EventEmitter<string>();
  @Input() searchKey: any;

  roomDetails: any = [];
  roomList: any = [];
  selectedRoom: any;
  constructor(private http: HttpService) { }


  ngOnInit(): void {
    this.getRooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.search(this.searchKey)
  }

  getRooms() {
    this.http.get("rooms").subscribe((data: any) => {
      this.roomDetails = data;
      this.selectRoom(this.roomDetails[0]);
      this.roomList = data.map((obj: any) => {
        return {
          ...obj,
          tempObj: obj?.tags.length > 0 && `${(obj?.tags[0].isLargerScreen) ? 'largescreen,' : ''} ${obj?.tags[0].isProjector ? 'projector,' : ''} ${obj?.tags[0].isSound ? 'sound, ' : ''} ${obj.name}  `
        }
      });
      this.availabilityStatus();
    })
  }

  selectRoom(roomDetail: any) {
    this.selectedRoom = roomDetail;
    console.log('===================', this.selectedRoom)
    this.roomSelection.emit(roomDetail);
  }


  search(key: any) {
    this.roomDetails = this.roomList.filter((obj: any) => (obj.tempObj.toLowerCase()).includes(key.trim().toLowerCase()));
  }

  availabilityStatus() {
    let currentTime = moment();
    if (Number(moment().format('mm')) > 30) {
        currentTime.add(1, 'hours').set({ minutes: 0 })
    } else {
        currentTime.set({ minutes: 30 })
    }

    
    this.roomDetails.forEach((room: any) => {
        if (room) {
          console.log(room);
          room.availability = 'Currently Available';
          room.bookings.forEach((bookings: any) => {
            if (bookings) {
              if ((bookings.from === currentTime.format('hh:mm A')) && moment().format('YYYY-MM-DD') === bookings.bookingDate) {
                room.availability = 'Currently Unavailable';
              }
            }
          });
        }
    });

    console.log(this.roomList);
}

}
