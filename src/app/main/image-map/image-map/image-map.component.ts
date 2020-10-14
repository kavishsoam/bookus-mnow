
import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.scss']
})
export class ImageMapComponent implements OnInit {

  @ViewChild('imageMap')
  private imageEl : ElementRef
  @Input()
  src: string

  @Input()
  coordinates: any[]

  @Input()
  canEdit: boolean


  @Output() onClick = new EventEmitter();
  // @Output('onClick')
  // onClick: EventEmitter<ImageMapCoordinate> = new EventEmitter();
  constructor() { }

  ngOnInit() {


  }

  getCoordinateStyle(coordinate: ImageMapCoordinate): any {
    console.log(coordinate)
   
  let data : any;
    data =  {
      top: `${coordinate.y}px`,
      left: `${coordinate.x}px`,
      height: `${coordinate.height}px`,
      width: `${coordinate.width}px`
    };
    this.onClick.emit(coordinate);
  }

  onAreaClick(coordinate) {
    this.onClick.emit(coordinate);
  }

  onAreaContext(e: MouseEvent, coordinate: ImageMapCoordinate) {
    if(this.canEdit)
    {
      if(coordinate) {
        console.log('editing')
      }
      else {
        console.log('creating')
      }
    
      e.stopPropagation();
      return false;
    }
  }

  onAreaCreate(x: number, y: number): ImageMapCoordinate {
    const coordinate = new ImageMapCoordinate({x, y, width: 100, height: 100});
    return coordinate
  }

  onAreaEdit(coordinate: ImageMapCoordinate): ImageMapCoordinate {
    return coordinate;
  }

}

export class ImageMapCoordinate {
  x: number = 0
  y: number = 0
  width: number = 100
  height: number = 100
  name?: string

  constructor(init?: Partial<ImageMapCoordinate>) {
    Object.assign(this, init);
  }
}
