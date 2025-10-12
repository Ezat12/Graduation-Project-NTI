
export enum UserRole {
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
}
  
export interface DataUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole; 
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}