import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { HttpService } from 'src/app/Services/http.service';

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
  constructor(private http: HttpService) { }


  ngOnInit(): void {
    this.getRooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.search(this.searchKey)
  }

  getRooms() {
    this.http.get("rooms").subscribe((data: any) => {
      debugger
      this.roomDetails = data;
      this.selectRoom(this.roomDetails[0]);
      this.roomList = data.map((obj: any) => {
        return {
          ...obj,
          tempObj: obj?.tags.length > 0 && `${(obj?.tags[0].isLargerScreen) ? 'largescreen,' : ''} ${obj?.tags[0].isProjector ? 'projector,' : ''} ${obj?.tags[0].isSound ? 'sound, ' : ''} ${obj.name}  `
        }
      });
    })
  }

  selectRoom(roomDetail: any) {
    this.roomSelection.emit(roomDetail);
  }


  search(key: any) {
    this.roomDetails = this.roomList.filter((obj: any) => (obj.tempObj.toLowerCase()).includes(key.trim().toLowerCase()));
  }

}
