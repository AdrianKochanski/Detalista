import { animate, AnimationBuilder, AnimationMetadata, style } from '@angular/animations';
import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTextMagnificant]'
})
export class TextMagnificantDirective {
  @Input() appTextMagnificant: boolean = false;

  @HostBinding('style.color') color!: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.increase();
  }

  @HostListener('mouseleave') onClick() {
    this.color = 'orange';
    this.decrease();
  }

  constructor(private builder: AnimationBuilder, private el: ElementRef) {}

  increase() {
    if(this.appTextMagnificant) {
      const metadata : AnimationMetadata[] = [
        style({ fontSize: '1rem' }),
        animate('200ms ease-in', style({ fontSize: '1.1rem', color: 'orange' })),
      ];

      const factory = this.builder.build(metadata);
      const player = factory.create(this.el.nativeElement);

      player.play();
    }
  }

  decrease() {
    if(this.appTextMagnificant) {
      const metadata : AnimationMetadata[] = [
        style({ fontSize: '1.1rem' }),
        animate('200ms ease-in', style({ fontSize: '1.0rem' })),
      ];

      const factory = this.builder.build(metadata);
      const player = factory.create(this.el.nativeElement);

      player.play();
    }
  }
}
