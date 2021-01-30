import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';

export class UserProfileForm {
  id: string;
  username: string;
  photoUrl?: string;
  photo?: File;
  _file?: File;
  user: User;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.photoUrl = user.photoUrl;
    this.user = user;
  }

  get file(): File | undefined {
    return this._file;
  }

  set file(file: File | undefined) {
    this._file = file;
    if (file) {
      this.toBase64(file).then((s) => {
        this.photoUrl = s;
      });
    }
  }

  toBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  hasChanged(): boolean {
    return !!this.file || this.username !== this.user.username;
  }
}

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.less'],
})
export class UserProfileModalComponent implements OnInit {
  @Input()
  user: User;

  @Output()
  refresh: EventEmitter<any> = new EventEmitter();

  @ViewChild('f')
  form: NgForm;
  supportedTypes = '';
  isVisible = false;
  model: UserProfileForm;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.model = new UserProfileForm(this.user);
  }

  get photoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.model.photoUrl ||
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg'
    );
  }

  async onOk(): Promise<void> {
    if (this.form.valid) {
      if (this.model.hasChanged()) {
        this.model.photo = this.model.file;
        await this.userService.update(this.model);
        this.refresh.emit();
      }
      this.close();
    }
  }

  onFileUpload = (file: File) => {
    this.model.file = file;
    return false;
  };

  onCancel(): void {
    this.close();
  }

  open(): void {
    this.model = new UserProfileForm(this.user);
    this.form.resetForm(this.model);
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
}
