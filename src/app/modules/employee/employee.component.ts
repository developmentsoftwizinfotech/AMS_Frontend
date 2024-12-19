import { Component, OnInit } from '@angular/core';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationDialogComponent } from 'src/app/core/confirm/confirmation-dialog.component';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { Employee } from '../common';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomStateError } from 'src/app/shared/custom-error';
import { ViewEmployeeAttendanceComponent } from './view-employee-attendance/view-employee-attendance.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [TableModule,CommonModule,InputTextModule,ButtonModule,ConfirmationDialogComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers:[DialogService]
})
export class EmployeeComponent implements OnInit{
  isLoading = false;
  employeeData :any
  ref: DynamicDialogRef | undefined;
  designationName: any;
    yearDate = new Date();
    customDatePicker = new CustomStateError();
  constructor(public dialogService:DialogService,private employeeService:EmployeeService,private toastr:ToastrService,private router:Router){

  }
  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  getEmployeeDetail(){
    this.employeeService.getEmployee().subscribe((res)=>{
      if(res){
        this.employeeData = res.employeeDTO
        this.designationName =  this.employeeData.designation

      }
    })
  }
  show() {
      this.ref = this.dialogService.open(AddEmployeeComponent, {
          closable: false,
          width: '55vw',
          contentStyle: { 'overflow-y': 'hidden' }

      });
      this.ref.onClose.subscribe((data: any) => {
          if (data) {
            this.getEmployeeDetail()
          } else {
    
          }
      });

  }
 editEmployee(data) {
      const id = data.employeeId
  this.employeeService.employeeGetById(id).subscribe((res)=>{
    this.ref = this.dialogService.open(AddEmployeeComponent, {
      closable: false,
      width: '55vw',
      data:data,
  });
  this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.getEmployeeDetail()
      } 
    })
  })
}
viewEmployee(data) {
  // const employeeId = data.employeeId;
  // const yearValue: string = this.customDatePicker.changeDateTimeZone(data.createdDate);
  // const employeeDate: Date = new Date(yearValue);
  // const formattedDate = employeeDate.toISOString().split('T')[0]; 
  this.ref = this.dialogService.open(ViewEmployeeAttendanceComponent, {
      closable: false,
      width: '37vw',
      data:data,
      contentStyle: { overflow: 'auto' },
  });
  this.ref.onClose.subscribe((data: any) => {
      if (data) {
        // this.getEmployeeDetail()
      } else {

      }
  });

}
onDelete(data) {
  const ref = this.dialogService.open(ConfirmationDialogComponent, {
    header: 'Confirmation',
    width: '400px',
    data: {
      message: 'Are you sure you want to delete this employee?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptColor: 'danger', 
      acceptClick: () => this.onConfirmDelete(data),
      rejectClick: () => this.onCancelDelete()
    }
  });
}

onConfirmDelete(data) {
  const id = data.employeeId
  this.employeeService.deleteEmployee(id).subscribe((res)=>{
    if(res){
      this.toastr.success('Employee deleted successfully!');
      this.getEmployeeDetail()
    }
  })
}
getFormValue() {
  const yearValue: string = this.customDatePicker.changeDateTimeZone(this.yearDate);
  const yearDate: Date = new Date(yearValue);
  // this.getEmployeeAttendance(yearDate);
}
viewEmployeeAttendanceSheet(data) {
  const employeeId = data.employeeId;
  const yearValue: string = this.customDatePicker.changeDateTimeZone(data.createdDate);
  const employeeDate: Date = new Date(yearValue);
  const formattedDate = employeeDate.toISOString().split('T')[0]; 
  this.router.navigate(['/employee-attendance', employeeId, formattedDate]);
}

onCancelDelete() {
  console.log('Delete action cancelled.');
}
  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }
 
}
