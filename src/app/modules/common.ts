export interface Employee {
      employeeId: number;
      firstName: string;
      lastName: string,
      gender: string;
      email: string;
      mobile: string,
      designationId:number;
      designation: {
        designationId: number;
        designationName: string;
      },
      dob: Date;
      doj:Date;
      dol: Date;
      salary: number;
      isJoiningLetterIssued: true;
      isRelievingLetterIssued: true;
      isExperienceLetterIssued: true;
      photoPath: string;
      createdDate: Date;
      isActive: true;
  }
  export interface Designation {
      designationId: number;
      designationName: string;
    }
  export interface AttendanceSheet {
    attendanceSheetId:number,
    attendanceDate: Date,
    timeIn:string,
    timeOut:string,
    isLeaveApproved: boolean,
    employeeId: number,
    isAbsent: boolean
  }

  export interface AttendanceSheet{
      employeeId: number,
      firstName: string,
      lastName: string,
      monthlySalary: number,
      attendanceSheetViewListDTO: {
        attendanceSheetId: number,
        employeeId: number,
        employee: null,
        attendanceDate: Date,
        timeIn: string,
        timeOut:string,
        isLeaveApproved: false,
        isAbsent: false,
        leaveStatus: string,
        totalHours: number
      
  }
}