import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltipDirective]'
})
export class TooltipDirective {
  @Input('tooltipDirective') tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: string;
  tooltipDirective: HTMLElement;
  // 호스트 요소와 tooltip 요소 간의 거리
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipDirective) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipDirective) { this.hide(); }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltipDirective, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltipDirective, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltipDirective);
      this.tooltipDirective = null;
    }, 500);
  }

  create() {
    this.tooltipDirective = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltipDirective,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.tooltipDirective);
    // this.renderer.appendChild(this.el.nativeElement, this.tooltipDirective);

    this.renderer.addClass(this.tooltipDirective, 'ng-tooltip');
    this.renderer.addClass(this.tooltipDirective, `ng-tooltip-${this.placement}`);

    // delay 설정
    this.renderer.setStyle(this.tooltipDirective, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltipDirective, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltipDirective, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltipDirective, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition() {
    // 호스트 요소의 사이즈와 위치 정보
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // tooltip 요소의 사이즈와 위치 정보
    const tooltipPos = this.tooltipDirective.getBoundingClientRect();

    // window의 scroll top
    // getBoundingClientRect 메소드는 viewport에서의 상대적인 위치를 반환한다.
    // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    this.renderer.setStyle(this.tooltipDirective, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltipDirective, 'left', `${left}px`);
  }
}