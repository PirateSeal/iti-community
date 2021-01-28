import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomQueries } from '../../services/room.queries';
import { RoomSocketService } from '../../services/room.socket.service';
import * as roomModal from '../room-create-modal/room-create-modal.component';

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less'],
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;

  @ViewChild(roomModal.RoomCreateModalComponent)
  roomModalComponent: roomModal.RoomCreateModalComponent;

  rooms: Room[];

  constructor(
    private feedStore: FeedStore,
    private queries: RoomQueries,
    private roomSocketService: RoomSocketService,
    private router: Router
  ) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit(): Promise<void> {
    this.rooms = await this.queries.getAll();
    const lastRoomId = window.localStorage.getItem('lastRoom');
    if (lastRoomId) {
      await this.goToRoom(this.rooms.find((r) => r.id === lastRoomId));
    } else {
      await this.goToRoom(this.rooms[0]);
    }
  }

  goToLastRoom(): void {
    this.queries.getAll().then(async (all) => {
      this.rooms = all;
      await this.goToRoom(this.rooms[this.rooms.length - 1]);
    });
  }

  async goToRoom(room?: Room): Promise<void> {
    if (!room) {
      room = this.rooms[0];
    }
    if (window.localStorage.getItem('lastRoom')) {
      window.localStorage.removeItem('lastRoom');
    }
    window.localStorage.setItem('lastRoom', room.id);
    await this.router.navigate(['/', room.id]);
  }

  createRoom(): void {
    this.roomModalComponent.open();
  }
}
