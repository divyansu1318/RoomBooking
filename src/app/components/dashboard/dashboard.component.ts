import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/Services/http.service';
import { RoomListComponent } from '../room-list/room-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  roomForm!: FormGroup;
  // @ViewChild('addRoomModel') addRoomModel: any;
  @ViewChild(RoomListComponent) roomListRef!: RoomListComponent;
  
  constructor(private http: HttpService, private router: Router) { }

  roomDetails:any;
  searchKey:any = '';

  ngOnInit(): void {
  this.roomForm = new FormGroup({
    name: new FormControl(	'',	[Validators.required]),
    capacity: new FormControl(	'',	[Validators.required]),
    isProjector: new FormControl(false),
    isSound: new FormControl(false),
    isLargerScreen: new FormControl(false)
  })

  }

  roomDeatils(roomDeatils:any){
    this.roomDetails = roomDeatils;
  }

  addRoom()  {
    console.log(this.roomForm.getRawValue()); 
      if (this.roomForm.valid) {
        this.http.post('rooms/add',this.roomForm.value).subscribe((data: any) => {
          document.getElementById("modelClose")?.click();
          this.roomListRef.getRooms();
        })
      }
  }
    
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
