import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DesignationService } from 'src/app/core/base/services/designation.service';
import { EmployeeService } from 'src/app/core/base/services/employee.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxLoadingModule, DropdownModule, CalendarModule, FileUploadModule, FormsModule, InputTextModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  formName = 'Add'
  employeeForm: FormGroup
  selectedItem: any;
  isLoading = false
  dropdownValue: [{ designationId: 0, designationName: '' }];
  selectedDesignation: any;
  fileName: null;
  base64File: null;
  imageSelected: boolean = false;
  pdfSrc: any;
  imageSrc: any;
  serverError: string;
  numExistError: string;
  minDate: Date;
  maxDate: Date;
  minBirthDate = new Date();
  environment = environment
  selectFile: File;
  isMobileValid :boolean = true;
  isEmailValid: boolean = true;
  isEditing: any;
  editEmailValid: boolean =true;
  imageRemove: boolean;

  constructor(private fb: FormBuilder, public ref: DynamicDialogRef, private employeeService: EmployeeService, private designationService: DesignationService, private config: DynamicDialogConfig, private toastr: ToastrService,) {
    this.employeeForm = this.fb.group({
      employeeId: [0],
      designationId: [null, [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      gender: ['Male', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      doj: [null, [Validators.required]],
      dob: ['', [Validators.required, this.ageValidator(18)]],
      salary: ['', [Validators.required, Validators.maxLength(10)]],
      createdDate: [new Date().toISOString()],
      isActive: [true],
      photoPath: [''],
      base64: ['']
    });
  }

  ngOnInit(): void {

    this.getDropdown()
    this.selectedItem = this.config.data
    if (this.selectedItem !== undefined) {
      this.formName = 'Edit'
      this.isEditing = true
      const formattedSalary = this.selectedItem.salary
      ? this.selectedItem.salary.toFixed(2)  
      : '0.00'; 

      this.employeeForm.setValue({
        employeeId: this.selectedItem.employeeId,
        designationId: this.selectedItem.designationId,
        firstName: this.selectedItem.firstName,
        lastName: this.selectedItem.lastName,
        gender: this.selectedItem.gender,
        email: this.selectedItem.email,
        mobile: this.selectedItem.mobile,
        doj: new Date(this.selectedItem.doj),
        dob: new Date(this.selectedItem.dob),
        salary: formattedSalary,
        createdDate: this.selectedItem.createdDate,
        isActive: true,
        photoPath: this.selectedItem.photoPath,
        base64: this.selectedItem.base64
      });
      if (this.selectedItem.photoPath !== '') {
        this.imageSrc = `${environment.baseApiUrl}images/` + this.selectedItem.photoPath
      }
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

  submit() {
 
      if (this.employeeForm.valid  && this.isEmailValid && this.isMobileValid) {      
        const formValue = { ...this.employeeForm.value, designationId: this.employeeForm.value.designationId, };
        if (formValue.dob) {
          const date = new Date(formValue.dob);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for time zone
          formValue.dob = date.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'
        }
        if (formValue.doj) {
          const date = new Date(formValue.doj);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          formValue.doj = date.toISOString().split('T')[0];
        }
        if (this.selectedItem !== undefined) {
          this.employeeService.updateEmployee(formValue).subscribe((res) => {
            this.editEmailValid = true
            this.serverError = '';
            if (res) {
              this.isLoading = false
              this.toastr.success('Employee updated successfully!');
              this.ref.close(formValue);
            }
          },(error) => {
            // if (error.status === 500) {
            //       this.editEmailValid = false
            //       this.serverError = 'Email already exists';
            //   // this.router.navigate(['/error']);
            // }else{
            //   this.editEmailValid = true
            //   this.serverError = '';
            // }
          })
        
        } else {

          this.employeeService.addEmployee(formValue).subscribe((res) => {
            if (res) {
              this.isLoading = false
              this.toastr.success('Employee saved successfully!');
              this.ref.close(formValue);
            }
          })
        }
      }
    else  {
        this.isLoading = false;
        this.employeeForm.markAllAsTouched();
        return;
      }

  }
  formatSalary(event: any): void {
    let value = event.target.value.replace(/[^\d.]/g, ''); 
    if (value.indexOf('.') === -1) {
      value = value.slice(0, 8);
      value = `${value}.00`;
    } else {
      let [integer, decimal] = value.split('.');
      decimal = decimal ? decimal.slice(0, 2) : '00'; 
      value = `${integer.slice(0, 8)}.${decimal}`;
    }
    event.target.value = value;
    // Calculate the cursor position to keep it before the decimal
    const cursorPosition = value.indexOf('.') !== -1 ? value.indexOf('.') : value.length;
    setTimeout(() => {
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  }
  
  
  checkDuplicateEmail(): void {
    const email = this.employeeForm.get('email')?.value;
    if (this.formName === 'Edit' && email === this.selectedItem?.email) {
      this.serverError = ''; 
      this.isEmailValid = true;
      return; 
    }
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
        this.serverError = 'Error checking email. Try again later.';
        this.isEmailValid = false;
      }
    );
  }
  
  checkDuplicateMobileNumber() {
    const number = this.employeeForm.get('mobile').value;
    if (this.formName === 'Edit' && number === this.selectedItem?.mobile) {
      this.numExistError = ''; 
      this.isMobileValid = true;
      return; 
    }

      this.employeeService.employeeMobileNumberExist(number).subscribe((res) => {
        if (res.phoneNumberExist === false) {
          this.numExistError = ''
          this.isMobileValid = true;
        } else {
          this.numExistError = 'Mobile Number already exit'
          this.isMobileValid = false;
        }
      })
    }
  getDropdown() {
    this.designationService.getDesigName().subscribe((res) => {
      this.dropdownValue = res.designationDTO
    })
  }


  onUpload(event: any): void {
    try {

      const file = event.files[0];;
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
        localStorage.setItem('base64', this.imageSrc)
      }

      const base64Value = base64String.replace("data:application/pdf;base64,", "");
      this.employeeForm.get('base64')?.setValue(base64Value);
      this.employeeForm.get('photoPath')?.setValue(file.name);
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
  removeSelectedFile(): void {
    this.imageRemove = true;
    this.imageSrc = '';
    const attachments = this.employeeForm.get('photoPath').value;
    if (typeof attachments === 'string') {
      this.employeeForm.get('photoPath').setValue('');
    }
    this.employeeForm.get('base64')?.setValue('');
  }
  

  close() {
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
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
