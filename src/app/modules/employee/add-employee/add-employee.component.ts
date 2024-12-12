import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DesignationService } from 'src/app/core/base/services/designation.service';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload'; 

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxLoadingModule,DropdownModule,CalendarModule,FileUploadModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEmployeeComponent),
      multi: true,
    }
  ]
})
export class AddEmployeeComponent implements OnInit{
  formName = 'Add'
  employeeForm:FormGroup
  selectedItem: any;
  isLoading = false
  dropdownValue: [{ designationId: 0 , designationName: '' }];
  selectedDesignation:any;
  fileName: null;
  base64File: null;
  selectFile: File;
  imageSelected: boolean = false; 
  constructor(private fb: FormBuilder,public ref: DynamicDialogRef,private employeeService:EmployeeService,private designationService:DesignationService,private config:DynamicDialogConfig) {
    this.employeeForm = this.fb.group({
      employeeId: [0],
      designationId:[null,[Validators.required]],
      firstName: ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      lastName: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      gender: ['',[ Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      doj: ['', [Validators.required]],
      dol: [''],
      dob: ['', [Validators.required]],
      salary: ['',[ Validators.required]],
      createdDate: [new Date().toISOString()], 
      isActive:[true],
      photoPath:[''],
      base64:[null]
    });
  }

  ngOnInit(): void {

    this.getDropdown()
   this.selectedItem = this.config.data
  if(this.selectedItem !== undefined){
        this.formName = 'Edit'
        this.previewUrl = this.selectedItem.photoPath
        this.employeeForm.setValue({
          employeeId:this.selectedItem.employeeId,
          designationId:this.selectedItem.designationId,
          firstName:this.selectedItem.firstName ,
          lastName:this.selectedItem.lastName ,
          gender:this.selectedItem.gender,
          email:this.selectedItem.email,
          mobile: this.selectedItem.mobile,
          doj: new Date(this.selectedItem.doj),
          dol: this.selectedItem.dol ? new Date( this.selectedItem.dol): '' ,
          dob: new Date(this.selectedItem.dob) ,
          salary: this.selectedItem.salary,
          createdDate:this.selectedItem.createdDate,
          isActive:true,
          photoPath:this.selectedItem.photoPath,
          base64: this.selectedItem.base64
        });
      
    console.log(this.employeeForm.value,'emploee edit')
  }
  console.log(this.selectedItem,'selecte edit')

  }
  submit(){
 
    if(this.employeeForm.valid){         
      const formValue =   { ...this.employeeForm.value, designationId: this.employeeForm.value.designationId};
           if(this.selectedItem !== undefined){
            this.employeeService.updateEmployee(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.ref.close(formValue);
              }
             })
           }else{
           
            this.employeeService.addEmployee(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.ref.close(formValue);
              }
             })
          }
        }
          else{
        this.isLoading = false;
        this.employeeForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
        return;
      }

  }

  getDropdown(){
    this.designationService.getDesigName().subscribe((res)=>{
          this.dropdownValue = res.designationDTO
          console.log(this.dropdownValue,'dropdownvalue')
    })
  }
  previewUrl: string | ArrayBuffer | null = null;

  // onUpload(event: FileSelectEvent): void {
  //   if (event.files && event.files.length > 0) {
  //     this.selectFile = event.files[0]; 
  //     this.convertToBase64(this.selectFile);
   
  //     // if (this.selectFile.type.startsWith('image/')) {
  //     //   console.log(this.selectFile.type,'type name image')
  //     //   const reader = new FileReader();
  //     //   reader.onload = (e) => {
  //     //     this.previewUrl = reader.result; 
  //     //     this.imageSelected = true; 
  //     //   };
  //     //   reader.readAsDataURL(this.selectFile); 
  //     } else {
  //       this.previewUrl = null; 
  //       this.imageSelected = false; 
  //     }
  //   }
  
  onUpload(event: FileSelectEvent) {
    try {
      const file = event.files[0]
      this.selectFile = file;
      this.convertToBase64(file);
    } catch (error) {
      this.fileName = null;
      this.base64File = null;
    }
  }
  removeSelectedFile(event: any) {

    const fileName = event.file.name;
    const attachments = this.employeeForm.get('PhotoPath').value;
    const updatedAttachments = attachments.filter(attachment => attachment.OrigionalFileName !== fileName);
     this.employeeForm.get('PhotoPath').setValue(updatedAttachments);
  }

  pdfSrc: string;
  convertToBase64(file: File) {
    console.log(file)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Value = base64String.replace("data:application/pdf;base64,", "")

      this.employeeForm.get('base64')?.setValue(base64Value);
      this.employeeForm.get('photoPath')?.setValue(file.name);

      // const attachments = [{
      //   PhotoPath: file.name,
      //   base64: base64Value,
      //   IsActive: true  // Set the file as active by default
      // }];
      // this.employeeForm.get('PhotoPath')?.setValue(attachments);
    };
    reader.readAsDataURL(file);
  }

  close(){
    this.ref.close();
  }
}
