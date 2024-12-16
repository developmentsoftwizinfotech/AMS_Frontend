import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AddAttendanceComponent } from './add-attendance/add-attendance.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { CalendarModule } from 'primeng/calendar';
import { AttendanceService } from 'src/app/core/base/services/attendance.service';
import { CustomStateError } from 'src/app/shared/custom-error';




interface EmployeeLeave {
  employeeName: string;
  timeIn: string;
  timeOut: string;
  halfLeave: boolean;
  shortLeave: boolean;
  fullLeave: boolean;
  approvedLeave: boolean;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,TableModule,CheckboxModule,DropdownModule,FormsModule,ButtonModule,NgxLoadingModule,ConfirmDialogModule,ToastModule,CalendarModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  providers:[DialogService,MessageService,ConfirmationService]
})
export class AttendanceComponent implements OnInit{
  isLoading = false
  leaveTypes = [
    { label: 'Present', value: 'Present' },
    { label: 'Half Day', value: "Half Day" },
    { label: 'Short Leave', value: 'Short leave' },
    { label: 'Full Day', value: 'Full Day' },
  ];
  employeeDetail: any ; 
  employeeAttendance: any;
  yearDate = new Date();
  customDatePicker = new CustomStateError();
  constructor(public dialogService:DialogService,private employeeService:EmployeeService,private attendanceService:AttendanceService){}

  ngOnInit(): void {
    this.getEmployeeDetail()
    this.getFormValue()
  }
  getFormValue() {
    const yearValue: string = this.customDatePicker.changeDateTimeZone(this.yearDate);
    const yearDate: Date = new Date(yearValue);
    this.getEmployeeAttendance(yearDate);
  }
 getEmployeeAttendance(event:Date){
  const formatDate = this.formatDate(event)
    this.attendanceService.getAttendance(formatDate).subscribe((res)=>{
           this.employeeAttendance = res.attendanceDTO
          //  if(this.employeeAttendance.length === 0){
          //       this.getEmployeeDetail()
          //  }
      console.log(res)
    })
 }

getEmployeeDetail(){
  this.employeeService.getEmployee().subscribe((res=>{
     this.employeeDetail = res.employeeDTO
  }))
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
  onAdd() {
    console.log('Add button clicked');
  }

  toggleApproval(row: EmployeeLeave) {
    row.approvedLeave = !row.approvedLeave;
  }
}
