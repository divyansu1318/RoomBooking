import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/Services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private http: HttpService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
   // const { username, password } = this.loginForm.getRawValue();
   
   this.http.post('users/login', { userName: this.loginForm.value.username, password: this.loginForm.value.password }).subscribe((data: any) => {
    if (data) {
      console.log('data', data)
      localStorage.setItem('token', data.token);
      this.router.navigate(['/dashboard']);
    }
   })
  }
}
