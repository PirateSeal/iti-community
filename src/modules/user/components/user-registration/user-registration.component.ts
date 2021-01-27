import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

class UserRegistrationFormModel {
  username = '';
  password = '';
  confirmPassword = '';
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less'],
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild('f')
  form: NgForm;

  public registerForm: FormGroup;
  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.areEquals('password', 'confirmPassword', 'mismatch'),
      }
    );
  }

  ngOnInit(): void {}

  async submit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }
    await this.userService.register(
      this.registerForm.value.username,
      this.registerForm.value.password
    );
    await this.goToLogin();
  }

  async goToLogin(): Promise<void> {
    await this.router.navigate(['/splash/login']);
  }

  private areEquals = (
    pathA: string,
    pathB: string,
    errorKey: string = 'mismatch'
  ) => {
    return (abstractControl: AbstractControl): null | void => {
      const abstractControlA = abstractControl.get(pathA);
      const abstractControlB = abstractControl.get(pathB);

      if (abstractControlA && abstractControlB) {
        const valueA = abstractControlA.value;
        const valueB = abstractControlB.value;

        if (valueA !== null && valueA !== undefined && valueA === valueB) {
          return null;
        }

        abstractControlB.setErrors({ [errorKey]: true });
      }
    };
  };
}
