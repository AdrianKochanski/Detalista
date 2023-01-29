import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stepper-control',
  templateUrl: './stepper-control.component.html',
  styleUrls: ['./stepper-control.component.scss']
})
export class StepperControlComponent {
  @Input() nextStepText: string;
  @Input() previousStepText: string;
  @Input() backRouterLink: string;
  @Output() onNextButtonClick: EventEmitter<void> = new EventEmitter<void>();

  nexButtonClicked() {
    this.onNextButtonClick.emit();
  }
}
