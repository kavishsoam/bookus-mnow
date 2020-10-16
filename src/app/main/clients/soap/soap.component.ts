import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ImageMapCoordinate } from 'app/main/image-map/image-map/image-map.component';
import { BodyPointModalComponent } from '../body-point-modal/body-point-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { CLIENT } from 'app/services/url';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-soap',
  templateUrl: './soap.component.html',
  styleUrls: ['./soap.component.scss']
})
export class SoapComponent implements OnInit, AfterViewInit {
@Input() clientData : any;
  image: string = '../../../../assets/images/bodyNum.png'

  painLevels :any = [
    {
      label : '1', value: '1'
    },
    {
      label : '2', value: '2'
    },
    {
      label : '3', value: '3'
    },
    {
      label : '4', value: '4'
    },
    {
      label : '5', value: '5'
    },
    {
      label : '6', value: '6'
    },
    {
      label : '7', value: '7'
    },
    {
      label : '8', value: '8'
    },
    {
      label : '9', value: '9'
    },
    {
      label : '10', value: '10'
    },
  ]

  coordinates: any = [
    {
      muscle: 'Occipitofrontalis Muscle',
      point: 'f1',
      coords: "200,118,238,149"
    },
    {
      muscle: 'Left Deltoid Muscle',
      point: 'f2',
      coords: '111,237,143,272'
    },
    {
      muscle: 'Right Deltoid Muscle',
      point: 'f3',
      coords: '327,272,294,237'
    },
    {
      muscle: 'Left Pectoralis Major Muscle',
      point: 'f4',
      coords: '167,279,200,311'
    },
    {
      muscle: 'Right Pectoralis Major Muscle',
      point: 'f5',
      coords: '241,278,274,311'
    },
    {
      muscle: 'Left Bicep Muscle',
      point: 'f6',
      coords: '100,319,131,352'
    },
    {
      muscle: 'Left Top Rectus Abdominis Muscle',
      point: 'f7',
      coords: '181,335,213,369'
    },
    {
      muscle: 'Right Top Rectus Abdominis Muscle',
      point: 'f8',
      coords: '229,340,259,370'
    },
    {
      muscle: 'Right Bicep Muscle',
      point: 'f9',
      coords: '297,333,333,368'
    },
    {
      muscle: 'Left Arm Brachioradialis Muscle',
      point: 'f10',
      coords: '89,397,121,431'
    },
    {
      muscle: 'Left Bottom Rectus Abdominis Muscle',
      point: 'f11',
      coords: "179,395,212,420"
    },
    {
      muscle: 'Right Bottom Rectus Abdominis Muscle',
      point: 'f12',
      coords: '225,393,258,421'
    },
    {
      muscle: 'Left Arm Brachioradialis Muscle',
      point: 'f13',
      coords: '315,400,340,422'
    },
    {
      muscle: 'Left Hand Front Lubrical Muscle',
      point: 'f14',
      coords: '64,487,96,515'
    },
    {
      muscle: 'Left Leg Rectus Femoris Muscle',
      point: 'f15',
      coords: '163,517,194,548'
    },
    {
      muscle: 'Right Leg Rectus Femoris Muscle',
      point: 'f16',
      coords: '242,516,278,552'
    },
    {
      muscle: 'Right Hand Lubrical Muscle',
      point: 'f17',
      coords: '331,482,371,512'
    },
    {
      muscle: 'Left Knee',
      point: 'f18',
      coords: '159,621,195,658'
    },
    {
      muscle: 'Right Knee',
      point: 'f19',
      coords: '244,628,279,657'
    },
    {
      muscle: 'Left Leg Gastrocnemius Muscle',
      point: 'f20',
      coords: '162,696,193,728'
    },
    {
      muscle: 'Right Leg Gastrocnemius Muscle',
      point: 'f21',
      coords: '248,700,276,733'
    },
    {
      muscle: 'Left Feet Extensor Hallusis Brevis Muscle',
      point: 'f22',
      coords: '164,793,197,830'
    },
    {
      muscle: 'Right Feet Extensor Hallusis Brevis Muscle',
      point: 'f23',
      coords: '238,797,274,829'
    },
    {
      muscle: 'Back Neck Spenius capitis Muscle',
      point: 'b1',
      coords: "556,203,585,231"
    },
    {
      muscle: 'Left Back Supraspinatus Muscle',
      point: 'b2',
      coords: '513,229,545,259'
    },
    {
      muscle: 'Right Back Supraspinatus Muscle',
      point: 'b3',
      coords: '600,227,630,262'
    },
    {
      muscle: 'Left Back Infraspinatus Muscle',
      point: 'b4',
      coords: '523,280,554,312'
    },
    {
      muscle: 'Right Back Infraspinatus Muscle',
      point: 'b5',
      coords: '590,280,620,312'
    },
    {
      muscle: 'Left Tricep Muscle',
      point: 'b6',
      coords: '457,318,486,353'
    },
    {
      muscle: 'Left Back Lattissimuus Dorsi Muscle',
      point: 'b7',
      coords: '527,329,556,357'
    },
    {
      muscle: 'Left Back Lattissimuus Dorsi Muscle',
      point: 'b8',
      coords: '590,329,617,360'
    },
    {
      muscle: 'Right Tricep Muscle',
      point: 'b9',
      coords: '661,321,691,357'
    },
    {
      muscle: 'Right Arm Extension Digitorum Muscle',
      point: 'b10',
      coords: '446,400,479,428'
    },
    {
      muscle: 'Left Back Serratus posterior inferior Muscle',
      point: 'b11',
      coords: "531,388,560,414"
    },
    {
      muscle: 'Left Back Serratus posterior inferior Muscle',
      point: 'b12',
      coords: '579,389,613,415'
    },
    {
      muscle: 'Right Arm Extension Digitorum Muscle',
      point: 'b13',
      coords: '665,400,699,429'
    },
    {
      muscle: 'Left Hand Back Lubrical Muscle',
      point: 'b14',
      coords: '429,482,459,513'
    },
    {
      muscle: 'Left Gluteus Muscle',
      point: 'b15',
      coords: '529,458,558,489'
    },
    {
      muscle: 'Right Gluteus Muscle',
      point: 'b16',
      coords: '590,460,620,491'
    },
    {
      muscle: 'Left Hand Front Lubrical Muscle',
      point: 'b17',
      coords: '688,482,721,516'
    },
    {
      muscle: 'Left Thigh Biceps Femoris Muscle',
      point: 'b18',
      coords: '520,555,549,583'
    },
    {
      muscle: 'Right Thigh Biceps Femoris Muscle',
      point: 'b19',
      coords: '601,551,636,588'
    },
    {
      muscle: 'Left Leg Back Gastrocnemius Muscle ',
      point: 'b20',
      coords: '516,678,547,710'
    },
    {
      muscle: 'Right Leg Back Gastrocnemius Muscle',
      point: 'b21',
      coords: '598,680,630,712'
    },
    {
      muscle: 'Left Feet Tendo Calcaneus Muscle',
      point: 'b22',
      coords: '519,799,554,829'
    },
    {
      muscle: 'Right Feet Tendo Calcaneus Muscle',
      point: 'b23',
      coords: '594,798,626,827'
    }
  ]
  newCoordinates: any = [];
  soapForm: any;
  @Input() clientId : any;
  constructor(
    private dialog : MatDialog,
    private formbuilder : FormBuilder,
    private service : ApiService,
    private toast : MessageService
  ) {

    this.soapForm = this.formbuilder.group({
      painLevel : [''],
      subjective : [''],
      objective : [''],
      assesment : [''],
      plan : [''],
      body : ['']
    })
  }


  ngOnInit() {
    // this.getClientData();
    this.newCoordinates = this.coordinates.map(element => ({ ...element, description: '', pain: '' }))
    console.log(this.newCoordinates);
  }
  ngAfterViewInit(): void {
    this.getClientData()
    // throw new Error("Method not implemented.");
   
  }
  getClientData(){
    this.service.get(`${CLIENT}/${this.clientId}`).subscribe(res => {
      console.log(res);
      (res && res[0] && res[0].soap) ? this.patchData(res[0].soap) : '';
      
    }, err => {
      console.log(err);
    })
  }

  patchData(data) {
    this.soapForm.patchValue({
      painLevel : (data && data.painLevel) ? (data.painLevel).toString() : '',
      subjective : (data && data.subjective) ? data.subjective : '',
      objective : (data && data.objective) ? data.objective : '',
      assesment : (data && data.assesment) ? data.assesment : '',
      plan : (data && data.plan) ? data.plan : '',
      body : (data && data.body) ? this.patchNewCoordinates(data.body) : ''
    })
    // (data && data.body) ?  : '';
  }

  patchNewCoordinates(data) {
    data.forEach(element => {
      this.newCoordinates.forEach(ele => {
        if(element.point == ele.point){
          ele.description = element.description
          ele.pain = element.pain
        }
      });
    });
    return this.newCoordinates;
    // this.newCoordinates = this.newCoordinates.map(element=>({description : element.description}))
  }

  getClick(coordinate: ImageMapCoordinate) {
    console.log(`Clicked on ${coordinate.name}`)

    const dialogRef = this.dialog.open(BodyPointModalComponent, {
      minWidth: '40vw',
      minHeight: '40vh',
      autoFocus: false,
      data:coordinate
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('after close Data ==>>>',result);
      this.updateClient(result.closedData);
    });

  }

  updateClient(data) {
    // console.log('After close modal ===>>>',data);
    this.newCoordinates.forEach(element => {
      if(element.point == data.point){
        element.description = data.description
        element.pain = data.pain
      }
    });
    console.log('updated json',this.newCoordinates);
  }

  soapFormSubmit(form) {
    console.log(form);
    form.controls['body'].setValue(this.newCoordinates)
    console.log(form);
    this.getClientDetails(form);
  }

  getClientDetails(soapData) {
        
      this.service.get(`${CLIENT}/${this.clientId}`).subscribe(res => {
        console.log(res);
        res[0].soap = soapData.value;
        this.updateClientDetails(res[0]);
      }, err => {
        console.log(err);
      })
   
  }

  updateClientDetails(data) {
    this.service.put(`${CLIENT}/${this.clientId}`,data).subscribe(res => {
      this.toast.add({ severity: 'Updated', summary: 'SOAP Notes Service Message', detail:'Successfully Updated' });
      console.log(res);
    }, err => {
      console.log(err);
    })
  }
}


/**
 * 
 * @POST
 * @PATCH
 * @initial load
 * 
 */