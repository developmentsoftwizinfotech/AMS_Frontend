import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  imports: [CommonModule,TableModule,CheckboxModule,DropdownModule,FormsModule,ButtonModule,NgxLoadingModule,ConfirmDialogModule,ToastModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  providers:[DialogService,MessageService,ConfirmationService]
})
export class AttendanceComponent {
  isLoading = false
  companies = 'jashan';
  names = [ 'jashan', 'jashan', 'jashan', 'jashan']
  ref: DynamicDialogRef | undefined;

  constructor(public dialogService:DialogService){}
  show() {
    this.ref = this.dialogService.open(AddAttendanceComponent, {
        closable: false,
        width: '55vw',
        // height:'100%',
        contentStyle: { overflow: 'auto' },
    });
    this.ref.onClose.subscribe((data: any) => {
        if (data) {
           console.log('hello add component')
        } else {
  
        }
    });

}
  // Function to toggle the approval status
  toggleApproval(row: EmployeeLeave) {
    row.approvedLeave = !row.approvedLeave;
  }
}
