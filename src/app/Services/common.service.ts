import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isShowLoader: boolean = false;

  constructor() { }
}
