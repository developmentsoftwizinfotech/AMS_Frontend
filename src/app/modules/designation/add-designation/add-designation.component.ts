import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { DesignationService } from 'src/app/core/base/services/designation.service';

@Component({
  selector: 'app-add-designation',
  standalone: true,
  imports: [CommonModule,NgxLoadingModule,ReactiveFormsModule,ToastModule],
  templateUrl: './add-designation.component.html',
  styleUrl: './add-designation.component.scss',
  providers:[MessageService]
})
export class AddDesignationComponent implements OnInit{
  isLoading = false;
  formName = 'Add'
  designationDetailsForm:FormGroup;
  isEdit = false;
  desigName: any;
  selectedItem:any;
  serverError: string;
  desigNameValid: boolean = true;

  constructor(private fb:FormBuilder,public ref: DynamicDialogRef,public config: DynamicDialogConfig,private toastr: ToastrService,private designationService:DesignationService){
    this.designationDetailsForm = this.fb.group({
      designationId: [''],
      designationName: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
    });
  }
  ngOnInit(): void {
    this.getDesigName();
    this.selectedItem = this.config.data

    if(this.selectedItem !== undefined){
        this.formName = 'Edit'
      this.designationDetailsForm.patchValue({
        designationId:this.selectedItem.designationId,
        designationName: this.selectedItem.designationName
        ,
      });
    }
  }

  getDesigName(){
    this.designationService.getDesigName().subscribe((res)=>{
            this.desigName = res
        })
     }
     checkDuplicateDesigName(): void {
      const designationName = this.designationDetailsForm.get('designationName').value;
      if (this.formName === 'Edit' && designationName === this.selectedItem?.designationName) {
        this.serverError = ''; 
        this.desigNameValid = true
        return; 
      }
  
        this.designationService.desibNameExist(designationName).subscribe(
          (res) => {
            if (res.checkDesignationNameExist === false) {
              this.serverError = ''; 
              this.desigNameValid = true
            } else {
              this.serverError = 'Designation name already exists'; 
              this.desigNameValid = false
            }
          },
          (error) => {
            console.error('Error checking email existence', error);
          }
        );
    }
    
  Submit(){
    this.isLoading = true
    if(this.designationDetailsForm.valid && this.desigNameValid ){
          
      const formValue = this.designationDetailsForm.value
           if(this.selectedItem !== undefined){
            this.designationService.updateDesigName(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.toastr.success('Designation name updated successfully!');
                // setTimeout(() => {
                  this.ref.close(formValue);
                // }, 1000);
        
              }
             })
           }else{
           
            this.designationService.addDesigName(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.toastr.success('Designation name saved successfully!');
                // setTimeout(() => {
                  this.ref.close(formValue);
                // }, 1000);
              }
             })
          }
        }
          else{
        this.isLoading = false;
        this.designationDetailsForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
        return;
      }
    }

  close(){
    this.ref.close();
  }
}
