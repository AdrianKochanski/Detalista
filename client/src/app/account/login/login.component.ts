import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  fields: Array<{controlName: string, label: string, type?: string}>;
  loginForm: FormGroup;
  returnUrl: string

  constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.addFields();
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    this.createLoginForm();
  }

  addFields(): void {
    this.fields = [
      {controlName: 'email', label: 'Email address'},
      {controlName: 'password', label: 'Password', type: 'password'}
    ];
  }

  createLoginForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
      console.log("user logged in");
    }, error => {
      console.log(error);
    });
  }
}
