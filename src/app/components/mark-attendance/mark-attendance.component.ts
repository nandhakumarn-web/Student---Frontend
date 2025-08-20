import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AttendanceCreate } from '../../models/attendance-create';
import { AttendanceStatus } from '../../models/attendance-status';
import { AttendanceService } from '../../services/attendance.service';
import { UserService } from '../../services/user.service';
import { AauthService } from '../../services/auth.service';
import { UserRole } from '../../models/user-role';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mark-attendance',
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2><i class="fas fa-calendar-check me-2"></i>Mark Attendance</h2>
            <button class="btn btn-secondary" routerLink="/attendance">
              <i class="fas fa-arrow-left me-2"></i>Back to Attendance
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance Form -->
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Attendance Details</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="attendanceForm" (ngSubmit)="markAttendance()">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="attendanceDate" class="form-label">Date</label>
                    <input
                      type="date"
                      class="form-control"
                      id="attendanceDate"
                      formControlName="attendanceDate"
                      [class.is-invalid]="attendanceForm.get('attendanceDate')?.invalid && attendanceForm.get('attendanceDate')?.touched"
                    >
                    <div class="invalid-feedback">Date is required.</div>
                  </div>
                  
                  <div class="col-md-6">
                    <label for="subject" class="form-label">Subject</label>
                    <input
                      type="text"
                      class="form-control"
                      id="subject"
                      formControlName="subject"
                      placeholder="Enter subject name"
                      [class.is-invalid]="attendanceForm.get('subject')?.invalid && attendanceForm.get('subject')?.touched"
                    >
                    <div class="invalid-feedback">Subject is required.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Attendance Mode</label>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="attendanceMode"
                      id="individual"
                      value="individual"
                      [(ngModel)]="attendanceMode"
                      [ngModelOptions]="{standalone: true}"
                    >
                    <label class="form-check-label" for="individual">
                      Individual Student
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="attendanceMode"
                      id="bulk"
                      value="bulk"
                      [(ngModel)]="attendanceMode"
                      [ngModelOptions]="{standalone: true}"
                    >
                    <label class="form-check-label" for="bulk">
                      Bulk (Multiple Students)
                    </label>
                  </div>
                </div>

                <!-- Individual Mode -->
                <div *ngIf="attendanceMode === 'individual'" class="mb-4">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="studentId" class="form-label">Select Student</label>
                      <select
                        class="form-select"
                        id="studentId"
                        formControlName="studentId"
                        [class.is-invalid]="attendanceForm.get('studentId')?.invalid && attendanceForm.get('studentId')?.touched"
                      >
                        <option value="">Choose student...</option>
                        <option [value]="student.id" *ngFor="let student of students">
                          {{ student.firstName }} {{ student.lastName }} ({{ student.studentId }})
                        </option>
                      </select>
                      <div class="invalid-feedback">Please select a student.</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label for="status" class="form-label">Status</label>
                      <select
                        class="form-select"
                        id="status"
                        formControlName="status"
                        [class.is-invalid]="attendanceForm.get('status')?.invalid && attendanceForm.get('status')?.touched"
                      >
                        <option value="">Select status...</option>
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                      </select>
                      <div class="invalid-feedback">Please select attendance status.</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="remarks" class="form-label">Remarks (Optional)</label>
                    <textarea
                      class="form-control"
                      id="remarks"
                      rows="2"
                      formControlName="remarks"
                      placeholder="Any additional notes..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="attendanceForm.invalid || isSubmitting"
                  >
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Marking...' : 'Mark Attendance' }}
                  </button>
                </div>

                <!-- Bulk Mode -->
                <div *ngIf="attendanceMode === 'bulk'" class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6>Student List</h6>
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-outline-success" (click)="markAllPresent()">
                        All Present
                      </button>
                      <button type="button" class="btn btn-outline-danger" (click)="markAllAbsent()">
                        All Absent
                      </button>
                    </div>
                  </div>

                  <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-hover table-sm">
                      <thead class="table-light sticky-top">
                        <tr>
                          <th>Student ID</th>
                          <th>Student Name</th>
                          <th>Present</th>
                          <th>Absent</th>
                          <th>Late</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let student of students; let i = index">
                          <td>{{ student.studentId }}</td>
                          <td>{{ student.firstName }} {{ student.lastName }}</td>
                          <td>
                            <input
                              type="radio"
                              class="form-check-input"
                              [name]="'status_' + student.id"
                              value="PRESENT"
                              [(ngModel)]="bulkAttendance[student.id]?.status"
                              [ngModelOptions]="{standalone: true}"
                            >
                          </td>
                          <td>
                            <input
                              type="radio"
                              class="form-check-input"
                              [name]="'status_' + student.id"
                              value="ABSENT"
                              [(ngModel)]="bulkAttendance[student.id]?.status"
                              [ngModelOptions]="{standalone: true}"
                            >
                          </td>
                          <td>
                            <input
                              type="radio"
                              class="form-check-input"
                              [name]="'status_' + student.id"
                              value="LATE"
                              [(ngModel)]="bulkAttendance[student.id]?.status"
                              [ngModelOptions]="{standalone: true}"
                            >
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              [(ngModel)]="bulkAttendance[student.id]?.remarks"
                              [ngModelOptions]="{standalone: true}"
                              placeholder="Remarks..."
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="mt-3">
                    <button 
                      type="button" 
                      class="btn btn-primary"
                      (click)="markBulkAttendance()"
                      [disabled]="!canSubmitBulk() || isSubmitting"
                    >
                      <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isSubmitting ? 'Marking...' : 'Mark Bulk Attendance' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Summary</h6>
            </div>
            <div class="card-body">
              <div *ngIf="attendanceMode === 'individual'">
                <div class="text-muted mb-2">
                  <i class="fas fa-user me-2"></i>Individual Mode
                </div>
                <div class="text-muted">
                  Mark attendance for one student at a time
                </div>
              </div>

              <div *ngIf="attendanceMode === 'bulk'">
                <div class="text-muted mb-2">
                  <i class="fas fa-users me-2"></i>Bulk Mode
                </div>
                <div class="row text-center">
                  <div class="col-4">
                    <div class="h5 text-success mb-0">{{ getBulkCount('PRESENT') }}</div>
                    <small class="text-muted">Present</small>
                  </div>
                  <div class="col-4">
                    <div class="h5 text-danger mb-0">{{ getBulkCount('ABSENT') }}</div>
                    <small class="text-muted">Absent</small>
                  </div>
                  <div class="col-4">
                    <div class="h5 text-warning mb-0">{{ getBulkCount('LATE') }}</div>
                    <small class="text-muted">Late</small>
                  </div>
                </div>
                <hr>
                <div class="text-center">
                  <div class="h6 mb-0">{{ students.length }}</div>
                  <small class="text-muted">Total Students</small>
                </div>
              </div>

              <div class="mt-3">
                <div class="alert alert-info">
                  <small>
                    <i class="fas fa-info-circle me-1"></i>
                    Attendance will be marked for {{ getCurrentDate() }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Attendance -->
          <div class="card mt-4" *ngIf="recentAttendance.length > 0">
            <div class="card-header">
              <h6 class="mb-0">Recent Attendance</h6>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item px-0 py-2" *ngFor="let record of recentAttendance.slice(0, 5)">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="fw-medium">{{ record.studentName }}</div>
                      <small class="text-muted">{{ record.subject }}</small>
                    </div>
                    <span class="badge" [ngClass]="{
                      'bg-success': record.status === 'PRESENT',
                      'bg-danger': record.status === 'ABSENT',
                      'bg-warning': record.status === 'LATE'
                    }">
                      {{ record.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sticky-top {
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .table-responsive {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
    .form-check-input:checked {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    .list-group-item {
      border-left: none;
      border-right: none;
    }
    .list-group-item:first-child {
      border-top: none;
    }
    .list-group-item:last-child {
      border-bottom: none;
    }
  `]
})
export class MarkAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  students: User[] = [];
  recentAttendance: any[] = [];
  attendanceMode: 'individual' | 'bulk' = 'individual';
  bulkAttendance: { [key: number]: { status: AttendanceStatus; remarks: string } } = {};
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private authService: AauthService,
    private router: Router
  ) {
    this.attendanceForm = this.fb.group({
      attendanceDate: [this.getCurrentDateString(), Validators.required],
      subject: ['', Validators.required],
      studentId: ['', Validators.required],
      status: ['', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadRecentAttendance();
    this.initializeBulkAttendance();
  }

  loadStudents(): void {
    this.userService.getUsersByRole(UserRole.STUDENT).subscribe(response => {
      if (response.success) {
        this.students = response.data;
        this.initializeBulkAttendance();
      }
    });
  }

  loadRecentAttendance(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.attendanceService.getAttendanceByTeacher(currentUser.id).subscribe(response => {
      if (response.success) {
        this.recentAttendance = response.data;
      }
    });
  }

  initializeBulkAttendance(): void {
    this.bulkAttendance = {};
    this.students.forEach(student => {
      this.bulkAttendance[student.id] = {
        status: AttendanceStatus.PRESENT,
        remarks: ''
      };
    });
  }

  getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  markAllPresent(): void {
    this.students.forEach(student => {
      this.bulkAttendance[student.id].status = AttendanceStatus.PRESENT;
    });
  }

  markAllAbsent(): void {
    this.students.forEach(student => {
      this.bulkAttendance[student.id].status = AttendanceStatus.ABSENT;
    });
  }

  getBulkCount(status: AttendanceStatus): number {
    return Object.values(this.bulkAttendance).filter(att => att.status === status).length;
  }

  canSubmitBulk(): boolean {
    return Object.keys(this.bulkAttendance).length > 0 && 
           this.attendanceForm.get('subject')?.valid && 
           this.attendanceForm.get('attendanceDate')?.valid;
  }

  markAttendance(): void {
    if (this.attendanceForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      this.isSubmitting = true;
      const attendanceData: AttendanceCreate = {
        studentId: this.attendanceForm.value.studentId,
        subject: this.attendanceForm.value.subject,
        attendanceDate: new Date(this.attendanceForm.value.attendanceDate),
        status: this.attendanceForm.value.status,
        remarks: this.attendanceForm.value.remarks
      };

      this.attendanceService.markAttendance(attendanceData, currentUser.id).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.attendanceForm.reset({
              attendanceDate: this.getCurrentDateString(),
              subject: this.attendanceForm.value.subject // Keep subject
            });
            this.loadRecentAttendance();
            alert('Attendance marked successfully!');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error marking attendance:', error);
          alert('Error marking attendance. Please try again.');
        }
      });
    }
  }

  markBulkAttendance(): void {
    if (!this.canSubmitBulk()) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isSubmitting = true;
    
    const attendanceRecords = Object.keys(this.bulkAttendance).map(studentId => ({
      studentId: parseInt(studentId),
      status: this.bulkAttendance[parseInt(studentId)].status,
      remarks: this.bulkAttendance[parseInt(studentId)].remarks
    }));

    const bulkData = {
      attendanceDate: new Date(this.attendanceForm.value.attendanceDate),
      subject: this.attendanceForm.value.subject,
      attendanceRecords
    };

    this.attendanceService.markBulkAttendance(bulkData, currentUser.id).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.initializeBulkAttendance();
          this.loadRecentAttendance();
          alert(`Bulk attendance marked successfully for ${attendanceRecords.length} students!`);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error marking bulk attendance:', error);
        alert('Error marking bulk attendance. Please try again.');
      }
    });
  }
}