import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ImageStreamFormComponent} from "./components/image-stream-form/image-stream-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ImageStreamFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
