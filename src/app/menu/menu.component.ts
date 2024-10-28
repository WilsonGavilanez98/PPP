import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  isActive = false;
  isCollapsed = false; // Nueva variable para controlar el estado colapsado
  userPhotoUrl: string | null = null;
  userName: string | null = '';
  userEmail: string | null = '';

  constructor(private authService: AuthService) {}

  @Output() ActiveChanged = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.authService.getUserData().subscribe((userData) => {
      if (userData) {
        this.userName = userData.displayName;
        this.userEmail = userData.email;
        this.userPhotoUrl = userData.photoURL;
      } else {
        this.userName = null;
        this.userEmail = null;
        this.userPhotoUrl = null;
      }
    });
  }

  toggleSidebar() {
    this.isActive = !this.isActive;
    this.isCollapsed = this.isActive ? !this.isCollapsed : false; // Alterna entre colapsado y expandido
    this.ActiveChanged.emit(this.isActive);
  }
}
