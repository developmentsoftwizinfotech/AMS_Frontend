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
  constructor(public dialogService:DialogService,private employeeService:EmployeeService){

  }
  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  getEmployeeDetail(){
    this.employeeService.getEmployee().subscribe((res)=>{
      if(res){
        this.employeeData = res.employeeDTO
        this.designationName =  this.employeeData.designation
          console.log(res)
      }
    })
  }
  show() {
      this.ref = this.dialogService.open(AddEmployeeComponent, {
          closable: false,
          width: '55vw',
          // height:'100%',
          contentStyle: { overflow: 'auto' },
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
      contentStyle: { overflow: 'auto' },
  });
  this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.getEmployeeDetail()
      } 
    })
  })
}
viewEmployee(data) {
  this.ref = this.dialogService.open(ViewEmployeeComponent, {
      closable: false,
      width: '55vw',
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
      console.log(res)
      this.getEmployeeDetail()
    }
  })
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
