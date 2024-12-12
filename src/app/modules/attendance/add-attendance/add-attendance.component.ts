import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-attendance',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-attendance.component.html',
  styleUrl: './add-attendance.component.scss'
})
export class AddAttendanceComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      timeIn: ['', Validators.required],
      timeOut: ['', Validators.required],
      leaveType: ['', Validators.required],
      approvedLeave: [false]  
    });
  }

  // Submit form
  onSubmit(): void {
    if (this.employeeForm.valid) {
      console.log('Form Data:', this.employeeForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
