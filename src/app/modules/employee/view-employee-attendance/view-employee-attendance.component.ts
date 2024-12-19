import { CommonModule, DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { ConfirmationDialogComponent } from 'src/app/core/confirm/confirmation-dialog.component';
import { CustomStateError } from 'src/app/shared/custom-error';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-view-employee-attendance',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, ButtonModule, ConfirmationDialogComponent, FormsModule, CalendarModule],
  templateUrl: './view-employee-attendance.component.html',
  styleUrl: './view-employee-attendance.component.scss',
  providers: [DialogService,DatePipe],
})
export class ViewEmployeeAttendanceComponent implements OnInit {
  isLoading = false;
  employeeData: any
  ref: DynamicDialogRef | undefined;
  designationName: any;
  yearControl = new Date();
  customDatePicker = new CustomStateError();
  employeeId: any;
  attendanceDate: any[]= [];
  employeeDataAttendanceSheet: any;
  employeeName: any;
  year = new Date();
  employeeAttendanceDate:any;
  workTotalHour: any;

    constructor(public dialogService: DialogService, private employeeService: EmployeeService,protected  datePipe:DatePipe, private route: ActivatedRoute,private router:Router) {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.attendanceDate = params['attendanceDate'];

    });

  }
  ngOnInit(): void {
    this.getFormValue()

  }
  getFormValue() {
    const yearValue: string = this.customDatePicker.changeDateTimeZone(this.year);
    const yearDate: Date = new Date(yearValue);

    const yearMonth = `${yearDate.getFullYear()}-${(yearDate.getMonth() + 1).toString().padStart(2, '0')}`;

    this.getEmployeeAttendanceSheet(yearMonth);
  }
  getEmployeeAttendanceSheet(year: string) {
    this.employeeService.EmployeeGetById(this.employeeId, year).subscribe((res) => {
               this.employeeDataAttendanceSheet = res?.employeeAttendanceReportDTO

      if (res?.employeeAttendanceReportDTO?.attendanceSheetViewListDTO) {
        this.attendanceDate = res.employeeAttendanceReportDTO.attendanceSheetViewListDTO.map(item => item.day); // day of the month
        this.workTotalHour = res.employeeAttendanceReportDTO.attendanceSheetViewListDTO.map(item => {
          // Return totalHours, replacing null or undefined with '-'
          return item.totalHours !== null && item.totalHours !== undefined ? item.totalHours : '-';
        });
        
        console.log(this.attendanceDate, 'formatted attendance dates');
        console.log(this.workTotalHour, 'working hours');
      } else {
 
        this.attendanceDate = [];
        this.workTotalHour = [];
        console.log('No attendance data found.');
      }
    });
  }
  
  
  

  
  getFormattedTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }
  
  BackEmployeePage(){
    this.router.navigate(['/employee']);
  }
  getLeaveStatusStyle(leaveStatus: string) {
    if (leaveStatus === 'Leave') {
      return { 'background-color': 'red', 'color': 'white' };
    }
    if (leaveStatus === 'Short Leave') {
      return { 'background-color': 'green', 'color': 'white' };
    }
    return {};
  }
  
}
