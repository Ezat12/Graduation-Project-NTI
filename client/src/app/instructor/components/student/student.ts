import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Instructor } from '../../services/instructor';

@Component({
  selector: 'app-student',
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class Student implements OnInit {
  students: any[] = [];
  courses: any[] = [];
  filteredStudents: any[] = [];
  selectedCourseId: string = '';
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(private instructorService: Instructor) {}

  ngOnInit() {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents() {
    this.isLoading = true;
    this.instructorService.getStudentToInstructor().subscribe({
      next: (response: any) => {
        this.students = response?.data || [];
        this.filteredStudents = [...this.students];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.isLoading = false;
      }
    });
  }

  loadCourses() {
    this.instructorService.getInstructorCourses().subscribe({
      next: (response: any) => {
        this.courses = response?.data || [];
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  filterByCourse() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.students];

    // Filter by course
    if (this.selectedCourseId) {
      filtered = filtered.filter(student => 
        student.courses.some((course: any) => course._id === this.selectedCourseId)
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.userId.name.toLowerCase().includes(searchLower) ||
        student.userId.email.toLowerCase().includes(searchLower) ||
        student.courses.some((course: any) => 
          course.title.toLowerCase().includes(searchLower)
        )
      );
    }

    this.filteredStudents = filtered;
  }

  clearFilters() {
    this.selectedCourseId = '';
    this.searchTerm = '';
    this.filteredStudents = [...this.students];
  }

  getStudentInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getCourseNames(student: any): string {
    return student.courses.map((course: any) => course.title).join(', ');
  }

  getJoinedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
