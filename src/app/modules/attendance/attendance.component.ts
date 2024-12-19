import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { CalendarModule } from 'primeng/calendar';
import { AttendanceService } from 'src/app/core/base/services/attendance.service';
import { CustomStateError } from 'src/app/shared/custom-error';
import { AttendanceSheet } from '../common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, TableModule, CheckboxModule, CalendarModule, FormsModule, ButtonModule, NgxLoadingModule, ConfirmDialogModule, ToastModule, CalendarModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  providers: [DialogService, MessageService, ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AttendanceComponent implements OnInit {
  isLoading = false
  leaveTypes = [
    { label: 'Present', value: 'Present' },
    { label: 'Half Day', value: "Half Day" },
    { label: 'Short Leave', value: 'Short leave' },
    { label: 'Full Day', value: 'Full Day' },
  ];
  employeeDetails: any;
  employeeAttendance: any;
  yearDate = new Date();
  customDatePicker = new CustomStateError();
  minTimeIn= "08:00" ;
  maxTimeOut: "10:00";
  maxTimeIn = "10:00";
  employeeName: any;
  constructor(public dialogService: DialogService, private attendanceService: AttendanceService, private fb: FormBuilder) {
   }

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
      this.employeeAttendance = res.attendanceSheetDTO
    })
  }

  saveAttendance(attendance: any): void {
    this.attendanceService.createAttendance(attendance).subscribe((res) => {
      console.log(res, 'attendane data')
      this.getFormValue()
    })
  }
  isValidTimeOut(attendance: any): boolean {

    if (attendance.timeIn && attendance.timeOut) {
      const [timeInHour, timeInMinute] = attendance.timeIn.split(':').map(Number);
      const [timeOutHour, timeOutMinute] = attendance.timeOut.split(':').map(Number);
      // Convert both timeIn and timeOut to total minutes
      const timeInTotalMinutes = timeInHour * 60 + timeInMinute;
      const timeOutTotalMinutes = timeOutHour * 60 + timeOutMinute;
  
      console.log('[timeInTotalMinutes, timeOutTotalMinutes]', [timeInTotalMinutes, timeOutTotalMinutes]);

      if (timeOutTotalMinutes <= timeInTotalMinutes) {
        console.log('timeOut is earlier than timeIn or equal to timeIn, invalid');
        return false;  
      }
    }
    return true; 
  }
  
  
  onAttendanceChange(attendance: AttendanceSheet, type: any): void {

    if (type === 'timeIn') {
      if (attendance.timeIn < this.minTimeIn) {
        attendance.timeIn = this.minTimeIn + ':00';
      }
      if (attendance.timeIn && !attendance.timeIn.endsWith(':00')) {
        attendance.timeIn = attendance.timeIn + ':00';
      }
      if (attendance.timeIn && !attendance.timeIn.includes(':00')) {
        attendance.timeIn = attendance.timeIn + ':00'; 
      }
    }

   if (type === 'timeOut') {
    if (attendance.timeOut && !attendance.timeOut.endsWith(':00')) {
      console.log('Ensuring timeOut ends with :00');
      attendance.timeOut = attendance.timeOut + ':00';
    }
    if (this.isValidTimeOut( attendance)) {
      if (attendance.timeOut > this.maxTimeOut) {
        console.log(`timeOut exceeds maxTimeOut, setting timeOut to ${this.maxTimeOut}`);
        attendance.timeOut = this.maxTimeOut;
      }

    } else {
      console.log('Invalid timeOut, resetting to null');
         attendance.timeOut = null; 
    }
  }
    if (type === 'leave') {
      attendance.isLeaveApproved = !attendance.isLeaveApproved;
      if (attendance.isLeaveApproved) {
        attendance.isAbsent = false;
        attendance.timeIn = null;
        attendance.timeOut = null;
      }
    }
    if (type === 'absent') {
      attendance.isAbsent = !attendance.isAbsent;
      if (attendance.isAbsent) {
        attendance.isLeaveApproved = false;
        attendance.timeIn = null;
        attendance.timeOut = null;
      }
    }
    
    const attendanceData = {
      attendanceSheetId: attendance.attendanceSheetId ?attendance.attendanceSheetId: 0,
      employeeId: attendance.employeeId,
      attendanceDate: this.yearDate,
      timeIn:attendance.timeIn  ,
      timeOut:attendance.timeOut,
      isLeaveApproved: attendance.isLeaveApproved,
      isAbsent: attendance.isAbsent 
    };

  
    console.log('Formatted attendance data:', attendanceData);
    this.saveAttendance(attendanceData);
  }
  changeDateTimeZone(changeDate) {
    const selectedDate: Date = new Date(changeDate);
    const timeZoneOffset = selectedDate.getTimezoneOffset();
    selectedDate.setMinutes(selectedDate.getMinutes() - timeZoneOffset);
    const updatedDate = selectedDate.toISOString().split('T')[0];
    return updatedDate
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
