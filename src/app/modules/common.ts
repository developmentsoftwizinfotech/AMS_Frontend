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
  export interface Attendance {
    attendanceId:number,
    attendanceDate: Date,
    timeIn:string,
    timeOut:string,
    isLeaveApproved: boolean,
    status: string,
    isActive: boolean,
    totalHours: string
  }