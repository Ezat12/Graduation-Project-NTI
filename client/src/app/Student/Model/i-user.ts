export interface Iuser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'instructor' | 'admin';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
