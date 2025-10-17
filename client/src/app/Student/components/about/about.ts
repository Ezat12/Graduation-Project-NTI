import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  constructor(private router: Router) {}

  getStarted() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/courses']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
