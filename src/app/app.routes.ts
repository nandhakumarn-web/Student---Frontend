import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { QuizListComponent } from './components/quiz/quiz.component';
import { QuizTakeComponent } from './components/quiz-take/quiz-take.component';
import { QuizManagementComponent } from './components/quiz-management/quiz-management.component';
import { MarkAttendanceComponent } from './components/mark-attendance/mark-attendance.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role-guard.service';
import { UserRole } from './models/user-role';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected routes
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Student routes
  { 
    path: 'quiz', 
    component: QuizListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.STUDENT }
  },
  { 
    path: 'quiz/:id/take', 
    component: QuizTakeComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.STUDENT }
  },
  
  // Teacher/Admin routes
  { 
    path: 'quiz-management', 
    component: QuizManagementComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.TEACHER }
  },
  { 
    path: 'attendance/mark', 
    component: MarkAttendanceComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.TEACHER }
  },
  
  // Common routes (all authenticated users)
  { 
    path: 'attendance', 
    component: AttendanceComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'feedback', 
    component: FeedbackComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/dashboard' }
];