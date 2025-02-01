import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-storm',
  standalone: true,
  imports: [],
  templateUrl: './storm.component.html',
  styleUrl: './storm.component.scss'
})
export class StormComponent {
  @Input() text!: string;
}
