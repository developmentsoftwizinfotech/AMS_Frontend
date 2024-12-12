import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.scss'
})
export class ViewEmployeeComponent implements OnInit{
  viewEmployeeDetail: any;
  dialogVisible: boolean = false;
 
  constructor(private config:DynamicDialogConfig,public ref: DynamicDialogRef){}

  ngOnInit(): void {
    this.viewEmployeeDetail = this.config.data
  }
  close(){
    this.ref.close();
  }
}
