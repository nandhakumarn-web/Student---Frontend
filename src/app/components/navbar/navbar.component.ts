import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AauthService } from '../../services/auth.service';
import { UserRole } from '../../models/user-role';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  standalone: true,
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-graduation-cap me-2"></i>
          EMS
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/dashboard"
                routerLinkActive="active"
              >
                <i class="fas fa-home me-1"></i>Dashboard
              </a>
            </li>

            <li class="nav-item" *ngIf="isStudent()">
              <a class="nav-link" routerLink="/quiz" routerLinkActive="active">
                <i class="fas fa-question-circle me-1"></i>Quizzes
              </a>
            </li>

            <li class="nav-item" *ngIf="isTeacher() || isAdmin()">
              <a
                class="nav-link"
                routerLink="/quiz-management"
                routerLinkActive="active"
              >
                <i class="fas fa-cogs me-1"></i>Quiz Management
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/attendance"
                routerLinkActive="active"
              >
                <i class="fas fa-calendar-check me-1"></i>Attendance
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/feedback"
                routerLinkActive="active"
              >
                <i class="fas fa-comment me-1"></i>Feedback
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-user me-1"></i>
                {{ currentUser.firstName }} {{ currentUser.lastName }}
                <span class="badge bg-secondary ms-2">{{
                  currentUser.role
                }}</span>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" (click)="logout()">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AauthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  isStudent(): boolean {
    return this.authService.hasRole(UserRole.STUDENT);
  }

  isTeacher(): boolean {
    return this.authService.hasRole(UserRole.TEACHER);
  }

  isAdmin(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  logout(): void {
    this.authService.logout();
  }
}
