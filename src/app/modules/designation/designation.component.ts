import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { DesignationService } from 'src/app/core/base/services/designation.service';
import { NgxLoadingModule, NgxLoadingService } from 'ngx-loading';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmationDialogComponent } from 'src/app/core/confirm/confirmation-dialog.component';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [TableModule,CommonModule,InputTextModule,ButtonModule,NgxLoadingModule,
    ConfirmDialogModule, ToastModule,ConfirmationDialogComponent],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss',
  providers:[DialogService,ConfirmationService,MessageService]
})
export class DesignationComponent implements OnInit {
  isLoading = false;
  desigName :any;
  ref: DynamicDialogRef | undefined;
  desigDetail: any;
  constructor(public dialogService:DialogService,private designationService:DesignationService,private loading:NgxLoadingService,public confirmationService:ConfirmationService,private messageService: MessageService){

  }
  ngOnInit(): void {
    this.getDesigName()
  }

  getDesigName() {
    this.designationService.getDesigName().subscribe((res: any) => {
      if (res) {
        this.desigName = res.designationDTO; 
        console.log(this.desigName);
      } 
    }, (error) => {
      console.error('Error fetching designation names', error);
    });
  }
  

  show() {
      this.ref = this.dialogService.open(AddDesignationComponent, {
          closable: false,
          width: '50vw',
          contentStyle: { overflow: 'auto' },
      });
      this.ref.onClose.subscribe((data: any) => {
          if (data) {
             console.log('hello add component')
             this.getDesigName()
 
          } else {
    
          }
      });

  }
  editName(data: any) {
    const id = data.designationId; 
    this.designationService.desigNameGetById(id).subscribe((response: any) => {
      if (response) {

        this.ref = this.dialogService.open(AddDesignationComponent, {
          closable: false,
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          data: response.designationDTO, 
        });
  
        this.ref.onClose.subscribe((result: any) => {
          if (result) {
            console.log('Edited Data:', result);
            this.getDesigName()
          }
        });
      } else {
        console.error('No data found for the given ID');
      }
    }, (error) => {
      console.error('Error fetching data by ID:', error);
    });
  }
  
onDelete(data) {
  const ref = this.dialogService.open(ConfirmationDialogComponent, {
    header: 'Confirmation',
    width: '400px',
    data: {
      message: 'Are you sure you want to delete this designation?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptColor: 'danger', 
      acceptClick: () => this.onConfirmDelete(data),
      rejectClick: () => this.onCancelDelete()
    }
  });
}
onConfirmDelete(data) {
  const id = data.designationId
  this.designationService.deletedesignName(id).subscribe((res)=>{
    if(res){
      console.log(res)
      this.getDesigName()
    }
  })
}

onCancelDelete() {

}
  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }
}
