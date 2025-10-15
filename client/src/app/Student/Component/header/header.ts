import { Component } from '@angular/core';
import { InstructorRoutingModule } from "../../../instructor/instructor-routing-module";

@Component({
  selector: 'app-header',
  imports: [InstructorRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
