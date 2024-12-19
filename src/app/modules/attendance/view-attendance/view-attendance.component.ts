import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/core/base/services/attendance.service';
import { CustomStateError } from 'src/app/shared/custom-error';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';



@Component({
  selector: 'app-view-attendance',
  standalone: true,
  imports: [CommonModule, TableModule, CheckboxModule, CalendarModule, ButtonModule, FormsModule ,NgxLoadingModule, ConfirmDialogModule, ToastModule, CalendarModule],
  templateUrl: './view-attendance.component.html',
  styleUrl: './view-attendance.component.scss',
  providers: [ MessageService, ConfirmationService],
})
export class ViewAttendanceComponent implements OnInit {
  isLoading = false
  customDatePicker = new CustomStateError();
  yearDate = new Date();
  employeeAttendanceSheet: any;
  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.getFormValue()
  }

  getFormValue() {
    const yearValue: string = this.customDatePicker.changeDateTimeZone(this.yearDate);
    const yearDate: Date = new Date(yearValue);
    this.getEmployeeAttendance(yearDate);
  }
  getEmployeeAttendance(event: Date) {
    const formatDate = this.formatDate(event)
    this.attendanceService.getAttendance(formatDate).subscribe((res) => {
      this.employeeAttendanceSheet = res.attendanceSheetDTO
    })
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
