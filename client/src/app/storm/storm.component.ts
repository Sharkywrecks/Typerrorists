import { Component, Input } from '@angular/core';
import { BrainStormSessionService } from '../home/brain-storm-session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-storm',
  standalone: true,
  imports: [],
  templateUrl: './storm.component.html',
  styleUrl: './storm.component.scss'
})
export class StormComponent {
  @Input() text!: string;
  storms: any[] | undefined;

  imageUrl = 'assets/images/cloud-' + Math.floor(Math.random() * 4) + '.png';
  brainStormSessionSubscription!: Subscription;

  constructor(private brainStormSessionService: BrainStormSessionService) {
  }

  onSearch() {
    var query = this.text;
    this.brainStormSessionSubscription = this.brainStormSessionService.createStorm(query).subscribe(storms => {
      this.storms = storms;
    });
  }
}
