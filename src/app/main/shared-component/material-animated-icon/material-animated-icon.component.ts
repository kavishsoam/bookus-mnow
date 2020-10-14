import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-material-animated-icon',
  templateUrl: './material-animated-icon.component.html',
  styleUrls: ['./material-animated-icon.component.scss']
})
export class MaterialAnimatedIconComponent implements OnInit {

  constructor() { }

  @Input() start: String;
  @Input() end: String;
  @Input() colorStart: String;
  @Input() colorEnd: String;
  @Input() animate: boolean;
  @Input() animateFromParent?: boolean = false;

  ngOnInit() {
  }

  toggle() {
    if(!this.animateFromParent) this.animate = !this.animate;
  }

}
