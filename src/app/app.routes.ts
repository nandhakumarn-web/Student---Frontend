import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { QuizListComponent } from './components/quiz/quiz.component';
import { QuizTakeComponent } from './components/quiz-take/quiz-take.component';
import { QuizManagementComponent } from './components/quiz-management/quiz-management.component';
import { RoleGuard } from './guards/role-guard.service';
import { UserRole } from './models/user-role';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
  // Root redirect
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected dashboard
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // Quiz routes (student + teacher split)
  {
    path: 'quiz',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: QuizListComponent, canActivate: [RoleGuard], data: { role: UserRole.STUDENT } },
      { path: ':id/take', component: QuizTakeComponent, canActivate: [RoleGuard], data: { role: UserRole.STUDENT } },
    ]
  },
  {
    path: 'quiz-management',
    component: QuizManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.TEACHER }
  },

  // Attendance routes (organized as children to avoid duplicate component declarations)
  {
    path: 'attendance',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AttendanceComponent },
      { path: 'mark', component: AttendanceComponent, canActivate: [RoleGuard], data: { role: UserRole.TEACHER } }
    ]
  },

  // Feedback
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },

  // Unauthorized page
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Wildcard fallback
  { path: '**', redirectTo: '/dashboard' }
];
