import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { RoomType } from '../../room.model';
import { RoomService } from '../../services/room.service';

export class CreateRoomFormModel {
  name = '';
  type: RoomType = RoomType.Text;
}

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less'],
})
export class RoomCreateModalComponent implements OnInit {
  @ViewChild('f')
  form: NgForm;

  @Output()
  refresh: EventEmitter<any> = new EventEmitter();

  isVisible = false;
  model = new CreateRoomFormModel();

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {}

  async onOk(): Promise<void> {
    if (this.form.form.valid) {
      await this.roomService.create(this.model.name, this.model.type);
      if (this.refresh) {
        this.refresh.emit();
      }
      this.close();
    }
  }

  onCancel(): void {
    this.close();
  }

  open(): void {
    this.form.resetForm(new CreateRoomFormModel());
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
}
