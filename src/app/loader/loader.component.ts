import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'custom-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  dArray:number[]=[0,1,2,3,4]
  constructor() { }
  @Input() loader:boolean=false

  ngOnInit() {
  }

}
