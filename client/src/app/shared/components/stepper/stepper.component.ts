import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{provide: CdkStepper, useExisting: StepperComponent}]
})
export class StepperComponent extends CdkStepper implements OnInit {
  @Input() linearModeSelected: boolean = true;
  @Input() clickHeaderFunction: Function;
  maxIndex: number = 0;

  ngOnInit(): void {
    this.linear = this.linearModeSelected;
  }

  onClick(index: number) {
    if(this.maxIndex + 1 >= index) {
      this.selectedIndex = index;
      this.maxIndex = index > this.maxIndex ? index : this.maxIndex;

      if(this.clickHeaderFunction != null) {
        this.clickHeaderFunction(index);
      }
    }
  }
}
