import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string;

  constructor(private fb: FormBuilder,
              private authService: AuthServiceService,
              private router: Router
              ) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    console.log(val.email);
    console.log(val.password);
    if (val.email && val.password) {
      console.log('call auth');
      this.authService.login(val.email, val.password)
        .subscribe(
          (result) =>  {

            // Unsuccessful messages
            this.error = result['error'];

            // Successful case
            if (this.authService.isLoggedIn()){
              let redirect = this.authService.redirectUrl ?
                              this.authService.redirectUrl : '/dashboard';
              this.router.navigate([redirect])
            }
            
          }
        )
    }
  }

  ngOnInit() {
  }

}
