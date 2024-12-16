import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DesignationService } from 'src/app/core/base/services/designation.service';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload'; 
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxLoadingModule,DropdownModule,CalendarModule,FileUploadModule,FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit  {
  formName = 'Add'
  employeeForm:FormGroup
  selectedItem: any;
  isLoading = false
  dropdownValue: [{ designationId: 0 , designationName: '' }];
  selectedDesignation:any;
  fileName: null;
  base64File: null;
  imageSelected: boolean = false; 
  pdfSrc: any;
  imageSrc: any;
  serverError: string;
  numExistError: string;
  minDate : Date;
  maxDate:Date;
  minBirthDate = new Date();
  environment = environment
  selectFile: File ;
isMobileValid = false; 
  isEmailValid: boolean;
  constructor(private fb: FormBuilder,public ref: DynamicDialogRef,private employeeService:EmployeeService,private designationService:DesignationService,private config:DynamicDialogConfig,private toastr: ToastrService,) {
    this.employeeForm = this.fb.group({
      employeeId: [0],
      designationId:[null,[Validators.required]],
      firstName: ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      lastName: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      gender: ['',[ Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      doj: ['', [Validators.required]],
      dol: [null],
      dob: ['', [Validators.required,this.ageValidator(18)]],
      salary: ['',[ Validators.required,Validators.maxLength(10)]],
      createdDate: [new Date().toISOString()], 
      isActive:[true],
      photoPath:[''],
      base64:['']
    });
  }

  ngOnInit(): void {

    this.getDropdown()
   this.selectedItem = this.config.data
  if(this.selectedItem !== undefined){
        this.formName = 'Edit'
        this.imageSrc = localStorage.getItem('base64')
  
        this.employeeForm.setValue({
          employeeId:this.selectedItem.employeeId,
          designationId:this.selectedItem.designationId,
          firstName:this.selectedItem.firstName ,
          lastName:this.selectedItem.lastName ,
          gender:this.selectedItem.gender,
          email:this.selectedItem.email,
          mobile: this.selectedItem.mobile,
          doj: new Date(this.selectedItem.doj),
          dol: this.selectedItem.dol ? new Date( this.selectedItem.dol):null ,
          dob: new Date(this.selectedItem.dob) ,
          salary: this.selectedItem.salary,
          createdDate:this.selectedItem.createdDate,
          isActive:true,
          photoPath:this.selectedItem.photoPath,
          base64: this.selectedItem.base64
        });
  }
  this.setDateRestrictions()
  this.minDate = this.calculateMinDate();
  
  }

  setDateRestrictions() {

    const currentYear = new Date().getFullYear();
    if (currentYear === 2024) {
      this.maxDate = new Date(currentYear, 11, 31); 
    }
  }
// only allow 18 plus age 
// get salaryControl() {
//   return this.employeeForm.get('salary');
// }

calculateMinDate(): Date {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minDate;
}
ageValidator(minimumAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dob = control.value;
    if (!dob) {
      return null; 
    }

    const today = new Date();
    const dobDate = new Date(dob);
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;  
    }

    return age >= minimumAge ? null : { ageInvalid: true };
  };
}

  submit(){
    if(this.employeeForm.valid){    
      const formValue =   { ...this.employeeForm.value, designationId: this.employeeForm.value.designationId};
           if(this.selectedItem !== undefined){
            this.employeeService.updateEmployee(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.toastr.success('Employee updated successfully!');
                this.ref.close(formValue);
              }
             })
           }else{
           
            this.employeeService.addEmployee(formValue).subscribe((res)=>{
              if (res) {
                this.isLoading = false
                this.toastr.success('Employee saved successfully!');
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

  checkDuplicateEmail(): void {
    if(this.selectedItem === ''){
    const email = this.employeeForm.get('email').value;
      this.employeeService.employeeEmailExist(email).subscribe(
        (res) => {
          if (res.emailExist === false) {
            this.serverError = ''; 
            this.isEmailValid = true; 
          } else {
            this.serverError = 'Email already exists'; 
              this.isEmailValid = false; 
          }
        },
        (error) => {
          console.error('Error checking email existence', error);
        }
      );
    }
  }
  
  checkDuplicateMobileNumber(){
    if(this.selectedItem === ''){
    const number =  this.employeeForm.get('mobile').value;
 this.employeeService.employeeMobileNumberExist(number).subscribe((res)=>{
    if(res.phoneNumberExist === false){
       this.numExistError = ''
       this.isMobileValid = true; 
    }else{
     this.numExistError = 'Mobile Number already exit'
         this.isMobileValid = false; 
    }
 })
}
}
  getDropdown(){
    this.designationService.getDesigName().subscribe((res)=>{
          this.dropdownValue = res.designationDTO
    })
  }
 

  onUpload(event: any): void {
    try {
  
      const file =  event.target.files[0];;
      if (file) {
        this.selectFile = file;
        this.convertToBase64(file);
       
      }
    } catch (error) {
      console.error('File upload failed:', error);
      this.selectFile = null;
      this.pdfSrc = null;
      this.imageSrc = null;

    }
  }
  
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      if (file.type.includes('image')) {
        this.imageSrc = base64String; // Set image source
        localStorage.setItem('base64',this.imageSrc)
      }
  
      const base64Value = base64String.replace("data:application/pdf;base64,", "");
      this.employeeForm.get('base64')?.setValue(base64Value);
      this.employeeForm.get('photoPath')?.setValue(file.name);
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
  removeSelectedFile(event: any) {

    const fileName = event.file.name;
    const attachments = this.employeeForm.get('PhotoPath').value;
    const updatedAttachments = attachments.filter(attachment => attachment.OrigionalFileName !== fileName);
     this.employeeForm.get('PhotoPath').setValue(updatedAttachments);
  }

  close(){
    this.ref.close();
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);

    // Allow numbers (48-57), period (46), space (32)
    if (
      (charCode < 48 || charCode > 57) && // Not a number
      charCode !== 46 && // Not a period (.)
      charCode !== 32 // Not a space
    ) {
      event.preventDefault();
    }

    // Optional: Ensure only one period allowed
    const input = (event.target as HTMLInputElement).value;
    if (char === '.' && input.includes('.')) {
      event.preventDefault();
    }
  }
}
