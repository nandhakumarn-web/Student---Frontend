import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AauthService } from '../services/auth.service';
import { UserRole } from '../models/user-role';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AauthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'] as UserRole;

    if (this.authService.hasRole(requiredRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
