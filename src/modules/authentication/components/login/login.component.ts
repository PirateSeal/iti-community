import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../../services/authentication.service';

class LoginFormModel {
  username = '';
  password = '';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  public ngForm: FormGroup;

  model = new LoginFormModel();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private nzMessageService: NzMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ngForm = this.formBuilder.group({
      username: new FormControl(
        this.model.username,
        Validators.compose([Validators.required])
      ),
      password: new FormControl(
        this.model.password,
        Validators.compose([Validators.required])
      ),
    });
  }

  async goToRegistration(): Promise<void> {
    await this.router.navigate(['/splash/register']);
  }

  async submit(login: LoginFormModel): Promise<void> {
    await this.login(login);
  }

  async login(login: LoginFormModel): Promise<void> {
    if (this.ngForm.invalid) {
      return;
    }
    await this.router.navigate(['/']);

    try {
      const authenticate = await this.authService.authenticate(
        login.username,
        login.password
      );
      if (authenticate.success) {
        await this.router.navigate(['/']);
      } else {
        this.nzMessageService.error(authenticate.reason);
      }
    } catch (e) {
      this.nzMessageService.error(
        'Une erreur est survenue. Veuillez réessayer plus tard'
      );
    }
  }
}
