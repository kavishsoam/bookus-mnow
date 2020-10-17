import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Component, QueryList, ElementRef, ViewChildren, OnInit, AfterViewChecked, Renderer2, Inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignatureFieldComponent } from './signature-field/signature-field.component';

import { CLIENT, INTAKE, CUSTOMER } from '../../services/url';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router";
import { EMAIL_PAT } from 'app/services/pattern'
import { ClientIntakeListComponent } from './client-intake-list/client-intake-list.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSourceService } from 'app/services/data-source.service';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { ExportService } from 'app/services/export.service';
import { FamilyandfriendComponent } from './familyandfriend/familyandfriend.component';
import { Translator } from 'app/services/translator';
import { ImportClientsComponent } from './import-clients/import-clients.components';

declare var $: any;
interface Pokemon {
  value: string;
  viewValue: string;
}

interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit {

  clientList: any = [];
  intakeArr: any = [];
  yearsValues : FormControl;
  //kavish
  saleDateTimeRange : any;
  noline = [
    {
      value : 'All Status',
    },
    {
      value : 'Accepted',
    },
    {
      value : 'Show',
    },
    {
      value : 'No Show',
    },
    {
      value : 'Service in Progress',
    },
    {
      value : 'Service Completed',
    },
    {
      value : 'Cancelled',
    },
    {
      value : 'Need Acceptance',
    },
    {
      value : 'Denied',
    },
    {
      value : 'Awaiting Confirmation',
    },
    {
      value : 'Confirmed',
    },
    {
      value : 'Deleted',
    }
  ];


  serviceValues = [
    {
      value : 'Tengh',
    },
    {
      value : 'yan',
    },
    {
      value : 'Lindan',
    },
    {
      value : 'Leechown',
    },
    {
      value : 'Weeng',
    }
  ];
  

  pokemonControl = new FormControl();
  pokemonGroups: PokemonGroup[] = [
    {
      name: 'Grass',
      pokemon: [
        {value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
        {value: 'oddish-1', viewValue: 'Oddish'},
        {value: 'bellsprout-2', viewValue: 'Bellsprout'}
      ]
    },
    {
      name: 'Water',
      pokemon: [
        {value: 'squirtle-3', viewValue: 'Squirtle'},
        {value: 'psyduck-4', viewValue: 'Psyduck'},
        {value: 'horsea-5', viewValue: 'Horsea'}
      ]
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        {value: 'charmander-6', viewValue: 'Charmander'},
        {value: 'vulpix-7', viewValue: 'Vulpix'},
        {value: 'flareon-8', viewValue: 'Flareon'}
      ]
    },
    {
      name: 'Psychic',
      pokemon: [
        {value: 'mew-9', viewValue: 'Mew'},
        {value: 'mewtwo-10', viewValue: 'Mewtwo'},
      ]
    }
  ];
  intakeList: any;
  clientListColumn: string[] = ['profile','firstName', 'phone1', 'email',
    'gender', 'intake', 'soapCount'];
  dataSource = new MatTableDataSource(this.clientList);
  constructor(private _fuseConfigService: FuseConfigService,
    public router: Router,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService,
    private exportFile: ExportService
  ) {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageHeader: Object = { header: "Clients", navigate: false }
  ngOnInit() {
    this.getAllClients();
    this.setPageHeader();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  intakeForm(id): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      width: '100vw',
      height: '100vh',
      autoFocus: false,
      data: { type: "new", id: id, secBtn: false, }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  addClient() {
    var data = { header: 'New Client', intakeBtn: 'Next', deleteBtn: false }
    const dialogRef = this.dialog.open(AddNewClient, {
      width: '100vw',
      height: '100vh',
      data: data,
      autoFocus: false,
      panelClass: 'pad-Mnow321',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getAllClients();
        }
      }
    });
  }
  importClientPopup(intakedata): void {
    const dialogRef = this.dialog.open(ImportClientsComponent, {
      disableClose: false,
      width: '60%',
      autoFocus: false,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  intakeFormLists(id) {
    const dialogRef = this.dialog.open(ClientIntakeListComponent, {
      width: '55vw',
      height: '75vh',
      autoFocus: false,
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  editClient(value) {
    this.router.navigate([`/main/clients/${value._id}`]);
  }
  getAllClients() {
    this.spinner.show();
    this._service.get(CLIENT).subscribe(res => {
      if (!res) this.clientList = [];
      else this.clientList = res;
    this.ngAfterViewInit();
      this.dataSource = new MatTableDataSource(this.clientList);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  applyFilter(filterValue: string) {
    // 
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onOptionSelected(e) {
    if (e == "CSV") this.csvDownload("csv");
    if (e == "Excel") this.csvDownload("xlsx");
    if (e == "Pdf") this.csvDownload("Pdf");
  }
  csvDownload(type) {
    this.exportFile.print(type,
      [{ label: "First Name", value: "firstName" },
      { label: "Last Name", value: "lastName" },
      { label: "Phone No.", value: "phone1" },
      { label: "Email", value: "email" },
      { label: "DOB", value: "dob" },
      { label: "Gender", value: "gender" }
      ],
      ["First Name", "Last Name", "Phone No.", "Email", "DOB", "Gender"],
      this.clientList,
      "client",
      "Client List",
      "Auto-generated client data")
  }

}
@Component({
  selector: 'addNewClient',
  templateUrl: 'addNewClient.html',
  styleUrls: ['./addNewClient.scss']
})
export class AddNewClient implements OnInit, AfterViewChecked {
  clientRegisterForm: FormGroup;
  submittedError: boolean;
  referredBy: any;
  loader: boolean = false;
  _id: any;
  selectedNotification: any;
  selectedGender: any;
  countryStr: string = "au";
  countryCode: string = "61";
  phoneNumber: any;
  phone_invalid: boolean = true;
  isDeleteClient: boolean = false;
  @ViewChild('telInput')
  telInput: any;
  message: string;
  imagePath: any;
  maxDate : any = new Date();
  // imgURL: string | ArrayBuffer;

  public file;
  public imgURL;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  constructor(
    public dialogRef: MatDialogRef<AddNewClient>,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private translator : Translator,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) { }
  ngOnInit() {


    this.telInput
    this.countryStr = localStorage.getItem("CountryCode") ? localStorage.getItem("CountryCode") : "au";
    this.countryCode = localStorage.getItem("countrycode");

    this.selectedNotification = "Email & SMS"

    this.clientRegisterForm = this._formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: [''],
      phone1: [''],
      phone2: [''],
      email: ['', Validators.compose([Validators.required,Validators.pattern(EMAIL_PAT)])],
      notifyBy: [''],
      notify: [true],
      gender: ['',Validators.required],
      referral_source: [''],
      dob: [''],
      text: [''],
      image : [''],
      globalDisplay: [true],
      area: [''],
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zip: ['']
    });
    if (this.data.header == "Edit Client") {
      this.setClientData(this.data.data);
    }
    if(this.data.header == 'Delete Client') {
      this._id = this.data.data._id;
      this.isDelete();
    }
  }

  ngAfterViewInit(): void {
    if (this.telInput && this.telInput.nativeElement) {
      this.telInput.nativeElement.value = `+${this.countryCode} `
    }
  }
  ngAfterViewChecked() {
    if (!this.telInput.nativeElement.value) this.telInput.nativeElement.value = `+${this.countryCode} `
    this.cdRef.detectChanges();
  }
  telInputChange(e) {
    if (this.telInput.nativeElement.value == `+${this.countryCode} ` && e.keyCode === 8) return false
  }
  setClientData(value) {
    let address = {
      area: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: ""
    }
    if (value.address) {
      address = value.address
    }
    this._id = value._id;
    if (value && value.countryCode) {
      this.countryCode = value.countryCode;
    }
    if (value && value.countryStr) {
      this.countryStr = value.countryStr;
    }
    this.clientRegisterForm.patchValue({
      firstName: value.firstName,
      lastName: value.lastName,
      phone1: `+${this.countryCode} ${value.phone1 ? value.phone1 : ""}`,
      phone2: value.phone2,
      email: value.email,
      notifyBy: value.notifyBy,
      notify: value.notify,
      gender: value.gender,
      image : value.image,
      referral_source: (value.referral_source ? value.referral_source : ""),
      dob: value.dob,
      text: (value && value.notes && value.notes.text) ? value.notes.text : '',
      globalDisplay: (value && value.notes && value.notes.gloabalDisplay) ? value.notes.globalDisplay : '',
      area: address.area,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.zip
    })
    setTimeout(() => {
      this.phoneNumber = this.clientRegisterForm.controls["phone1"].value      
    }, 100);
  }

  
  clientRegister(form) {
    if(form.invalid) {
      return;
    }
    form.invalid && !this.phone_invalid ? this.loader = false : this.loader = true;
    
    if (!this.phone_invalid) {
      return;
    }

    let phone = this.phoneNumber && this.phoneNumber.split(this.countryCode)
    var address = {
      area: form.value.area,
      street: form.value.street,
      city: form.value.city,
      state: form.value.state,
      country: form.value.country,
      zip: form.value.zip
    }
    delete form.value.area;
    delete form.value.street;
    delete form.value.city;
    delete form.value.state;
    delete form.value.country;
    delete form.value.zip;
    form.value.address = address;
    var notes = {
      text: form.value.text,
      globalDisplay: form.value.globalDisplay || false,
    }
    delete form.value.globalDisplay;
    delete form.value.text;
    form.value.phone1 = phone && phone[1].replace(/\s/g, "");
    form.value.countryStr = this.countryStr;
    form.value.countryCode = this.countryCode
    form.value.notes = notes;
    form.value.notify = form.value.notify || false
    form.value.email = form.value.email || undefined
    form.value.phone2 = form.value.phone2 || undefined
    form.value.owner = localStorage.getItem('client_id');
    form.value.referral_source = form.value.referral_source || null



    if (this._id) {

      if (this.imagePath) {
        const formData: any = new FormData();
      formData.append('photos', this.imagePath[0]);
      this._service.postImage('assets/uploadImages',formData).subscribe(res => {
        if (!form.value.image) {
          form.value.image = "";
        }
        form.value.image= form.value.image = this.translator.imageProductTranslator(res['result'][0])
        this.updateClient(form.value);
      }, rej => {
        console.log("rej", rej);
      });
    } else {
      form.value.image=this.imgURL;
      this.updateClient(form.value);
    }

      
    }
    else {

      if (this.imagePath) {
        const formData: any = new FormData();
      formData.append('photos', this.imagePath[0]);
      this._service.postImage('assets/uploadImages',formData).subscribe(res => {
        if (!form.value.image) {
          form.value.image = "";
        }
        form.value.image= form.value.image = this.translator.imageProductTranslator(res['result'][0])
        this.createClientWithImage(form.value);

      }, rej => {
        console.log("rej", rej);
      });
    } else {
      form.value.image=this.imgURL;
      this.createClientWithImage(form.value);
    }


    }
  }


  createClientWithImage(data) {
    this._service.post(CLIENT, data).subscribe(res => {
      if(res.status == 200)
      this.createCustomerWithImage(data);
      res.clientFromCalendar = this.data.type;
      this.intakeForm2(res);
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      setTimeout(() => {
        this.loader = false;
        this.dialogRef.close({
          type: "refresh"
        })
      }, 1500)
    }, err => {
      this.loader = false;
      if((err.body == "Client validation failed: phone1: Path `phone1` is required.")){
        this.clientRegisterForm.controls.phone1.setErrors({ 'invalid': false });
      }
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: (err.body == "Client validation failed: phone1: Path `phone1` is required.") ? 'client Phone number is required ' : err.error });
    })
  }

  createCustomerWithImage(data) {
    data['mobile'] = data.phone1
    this._service.post(CUSTOMER, data).subscribe(res => {
      // res.clientFromCalendar = this.data.type;
      // this.intakeForm2(res);
      // this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      // setTimeout(() => {
      //   this.loader = false;
      //   this.dialogRef.close({
      //     type: "refresh"
      //   })
      // }, 1500)
    }, err => {
      console.log(err)
      // this.loader = false;
    //   if((err.body == "Client validation failed: phone1: Path `phone1` is required.")){
    //     this.clientRegisterForm.controls.phone1.setErrors({ 'invalid': false });
    //   }
    //   this._toast.add({ severity: 'error', summary: 'Service Message', detail: (err.body == "Client validation failed: phone1: Path `phone1` is required.") ? 'client Phone number is required ' : err.error });
    })
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
  
    };
  }
  
  isDelete() {
    this.dialogRef.updateSize('45vw', '30vh');
    this.isDeleteClient = true;
  }
  cancelDelete() {
    this.isDeleteClient = false;
    this.dialogRef.updateSize('100vw', '100vh');
  }
  deleteClient() {
    if (this._id != undefined) {
      this._service.delete(`${CLIENT}/${this._id}`).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        this.dialogRef.close({
          type: 'refresh'
        })
        this._router.navigate([`/main/clients`]);
      }, err => {
        this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      })
    }
  }
  intakeForm2(intakedata): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      disableClose: true,
      width: '100vw',
      height: '100vh',
      autoFocus: false,
      data: { type: "get", intakedata: intakedata, secBtn: true }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  updateClient(data) {
    this._service.put(`${CLIENT}/${this._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this._id = undefined;
      this.loader = false;
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
    })
  }
  onCountryChange(e) {
    this.countryStr = e.iso2;
    this.countryCode = e.dialCode;
  }
  telInputObject(e) {
  }
  getNumber(e) {
  }
  hasError(e) {
    this.phone_invalid = e;
    if (!e) this.clientRegisterForm.controls.phone1.setErrors({ 'invalid': true });
    else this.clientRegisterForm.controls.phone1.setErrors(null);
    // when it return fasle => thats mean it has error.
  }


  changeImage(event) {
    this.file = event.target.files[0];
    console.log("file--", this.file);
    // this.preview(event.target.files);
    this.imageChangedEvent = event;
  }

  scaleZoom(input) {

    this.scale = input.value;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.file = new File([base64ToFile(event.base64)], this.file.name, { type: this.file.type });
    console.log("file-------", this.file);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  deletePhoto() {
    this.imgURL = null;
    this.imageChangedEvent = undefined;
  }

  upProfile() {
    console.log(this.file);
  }
}
@Component({
  selector: 'clientIntakeForm',
  templateUrl: 'clientIntakeForm.html',
  styleUrls: ['./clientIntakeForm.scss']
})
export class ClientIntakeForm implements OnInit {
  @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
  @ViewChildren('sigContainer1') public sigContainer1: QueryList<ElementRef>;
  @ViewChildren('sigContainer2') public sigContainer2: QueryList<ElementRef>;
  @ViewChildren('sigContainer3') public sigContainer3: QueryList<ElementRef>;
  public form: FormGroup;
  public dialog: MatDialog;
  selected_diseases: any = [];
  message: any;
  loader: boolean = false;
  diseases: any = [
    { name: 'Cancer', selected: false },
    { name: 'Headaches/Migraines', selected: false },
    { name: 'Arthritis', selected: false },
    { name: 'Diabetes', selected: false },
    { name: 'Joint Replacement', selected: false },
    { name: 'High/Low Blood Pressure', selected: false },
    { name: 'Neuropathy', selected: false },
    { name: 'Fibromyalgia', selected: false },
    { name: 'Stroke', selected: false },
    { name: 'Heart Attack', selected: false },
    { name: 'Kidney Dysfunction', selected: false },
    { name: 'Blood Clots', selected: false },
    { name: 'Numbness', selected: false },
    { name: 'Sprains or Strains', selected: false }
  ];
  id: any;
  intakeId: any;
  public secondSig: SignatureFieldComponent;
  disableCheckbox: boolean = false;
  clientFirstName: any;
  intakeFormId: any;
  businessName: any = '';
  businessLogo: any;
  drawStart() {
  }
  clientIntakeForm: FormGroup;
  constructor(
    private data2: DataSourceService,
    private renderer: Renderer2,
    fb: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    public dialogRef: MatDialogRef<ClientIntakeForm>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private spinner : NgxSpinnerService
  ) {
    let el = document.getElementsByClassName('mat-dialog-container').item(0);
    renderer.setStyle(el, 'overflow-y', 'scroll');
    this.form = fb.group({
      signatureField1: [''],
      signatureField2: [''],
      signatureField3: ['']
    });
  }
  public ngAfterViewInit() {
    this.secondSig = this.sigs.find((sig, index) => index === 1
    );
    this.beResponsive();
  }
  public beResponsive() {
    this.size(this.sigContainer1.first, this.sigs.first);
    this.size(this.sigContainer2.first, this.secondSig);
    this.size(this.sigContainer3.first, this.sigs.last);
  }
  public size(container: ElementRef, sig: SignatureFieldComponent) {
    this.sigs.last.signaturePad.set('canvasWidth', 300);
    this.sigs.last.signaturePad.set('canvasHeight', 50);
    this.secondSig.signaturePad.set('canvasWidth', 300);
    this.secondSig.signaturePad.set('canvasHeight', 50);
    this.sigs.first.signaturePad.set('canvasWidth', 500);
    this.sigs.first.signaturePad.set('canvasHeight', 270);
  }
  public clear() {
    this.sigs.first.clear();
    this.secondSig.clear();
    this.sigs.last.clear();
  }
  ngOnInit() {
    this.clientIntakeForm = this._formBuilder.group({
      medical_info: this._formBuilder.group({
        medicationStatus: [''],
        medicationDetails: [''],
        pregnancyStatus: [''],
        pregnancyDuration: [''],
        pregnancyRiskFactor: [''],
        chronicPainStatus: [''],
        chronicPainDetails: [''],
        chronicPainMakesBetter: [''],
        chronicPainMakesWorse: [''],
        orthoInjuriesStatus: [''],
        orthoInjuriesDetails: [''],
        diseasesDescription: [''],
      }),
      massage_info: this._formBuilder.group({
        therapist: [''],
        therapistGender: [''],
        priorMassage: [''],
        pressure: [''],
        allergiesStatus: [''],
        allergiesDetails: [''],
        avoidingAreasStatus: [''],
        avoidingAreasDetails: [''],
        discomfortArea: [''],
        client_sign: [''],
        therapist_sign: ['']
      }),
      client_info: this._formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        phone1: [''],
        gender: [''],
        dob: [''],
        city: [''],
        area: [''],
        emergencyContactName: [''],
        emergencyContactRelation: [''],
        emergencyContactNo: [''],
        state: ['']
      })
    })
    if (this.data && this.data.type == "get") {

      if (this.data.intakedata) {
        this.fillPersonalInfo(this.data.intakedata.result)
      }
    }
    else if (this.data && this.data.type == "new") {

      this.getIntakeForm(this.data.intakedata.result._id, 'intake')
      this.clientIntakeForm.disable()
      this.disableCheckbox = true;
    }
    else if (this.data && this.data.type == 'bookingRefer') {

      this.getIntakeForm(this.data.intakedata, "bookingRefer")
      this.clientIntakeForm.disable()
      this.disableCheckbox = true;
    }
    else {

      this.data.secBtn = true;
      if (this.data && this.data.type == "viewIntake") {
        this.getIntakeForm(this.data.intakedata, 'intake')
        this.disableCheckbox = true;
        this.data.secBtn = false;
        this.clientIntakeForm.disable()
      }
      else {

        this.getIntakeForm(this.data.intakedata, 'client')
      }
    }
  }
  clientId: any;
  fillPersonalInfo(data) {
    this.clientId = data._id
    this.clientIntakeForm.patchValue({
      client_info: {
        firstName: data && data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone1: data.phone1,
        gender: data.gender,
        dob: data.dob,
        city: data && data.address && data.address.city,
        state: data && data.address && data.address.state,
        area: data && data.area && data.address.area
      }
    })
  }
  autoselected(value) {
    if (this.data.type == "appointment") {
      this.disableCheckbox == false;
    }
    if (this.data.type == "new") {
      this.disableCheckbox == true;
    }
    value.forEach(ele => {
      this.diseases.forEach(item => {
        if (ele == item.name) {
          item.selected = true;
        }
      });
    });
  }
  getIntakeForm(id, getAll) {
    this.loader = true;
    this.spinner.show();
    let url;
    if (getAll == 'intake') {
      url = `intake=${id}`
    }
    else if (getAll == 'bookingRefer') {

      url = `booking=${id}`
    }
    else {
      url = `client=${id}&latest=true`
    }
    this._service.get(`${INTAKE}?${url}`).subscribe(res => {
      this.setClientIntakeData(res.result);
      // this.businessLogo = res.result.location[0].company.logo.data;
      this.businessName =res.result.location[0].company.businessName;
      this.spinner.hide();
      this.loader = false;
    }, err => {
      
      setTimeout(() => {
        this._toast.add({ severity: 'info', summary: 'Service Message', detail: 'Intake form is not available for this client Appointment' });
        this.spinner.hide();
        this.loader = false;
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      }, 1000);

    })
  }
  editIntakeForm() {
    this.clientIntakeForm.enable();
    this.disableCheckbox = false;
    this.data.secBtn = true;
  }
  diseaseChange(item) {
    item.selected = (!item.selected)
  }
  setClientIntakeData(value) {
    this.autoselected(value.medical_info.diseases);
    let info = value.client_info.personal
    this.clientIntakeForm.patchValue({
      medical_info: {
        medicationStatus: value.medical_info.medicationStatus,
        medicationDetails: value.medical_info.medicationDetails,
        pregnancyStatus: value.medical_info.pregnancyStatus,
        pregnancyDuration: value.medical_info.pregnancyDuration,
        pregnancyRiskFactor: value.medical_info.pregnancyRiskFactor,
        chronicPainStatus: value.medical_info.chronicPainStatus,
        chronicPainDetails: value.medical_info.chronicPainDetails,
        chronicPainMakesBetter: value.medical_info.chronicPainMakesBetter,
        chronicPainMakesWorse: value.medical_info.chronicPainMakesWorse,
        orthoInjuriesStatus: value.medical_info.orthoInjuriesStatus,
        orthoInjuriesDetails: value.medical_info.orthoInjuriesDetails,
        diseasesDescription: value.medical_info.diseasesDescription
      },
      massage_info: {
        therapist: value.massage_info.therapist,
        therapistGender: value.massage_info.therapistGender,
        priorMassage: value.massage_info.priorMassage,
        pressure: value.massage_info.pressure,
        allergiesStatus: value.massage_info.allergiesStatus,
        allergiesDetails: value.massage_info.allergiesDetails,
        avoidingAreasStatus: value.massage_info.avoidingAreasStatus,
        avoidingAreasDetails: value.massage_info.avoidingAreasDetails,
        discomfortArea: value.massage_info.discomfortArea,
        client_sign: value.massage_info.client_sign,
        therapist_sign: value.massage_info.therapist_sign
      },
      client_info: {
        firstName: info.firstName,
        lastName: info.lastName,
        phone1: info.phone1,
        email: info.email,
        dob: info.dob,
        gender: info.gender,
        city: info && info.address && info.address.city,
        state: info && info.address && info.address.state,
        area: info && info.address && info.address.area,
        emergencyContactRelation: value.client_info.emergencyContactRelation,
        emergencyContactNo: value.client_info.emergencyContactNo,
        emergencyContactName: value.client_info.emergencyContactName,
      }
    })
  }
  clientIntake(form) {
    form.invalid ? this.loader = false : this.loader = true;
    var a = this.diseases.filter(item => item.selected)
    var b = a.map(item => {
      return item.name
    })
    this.selected_diseases = b;
    form.value.medical_info.diseases = this.selected_diseases;
    form.value.client_info.personal = this.clientId
    if (form.value.massage_info.client_sign && form.value.massage_info.therapist_sign) {
      this._service.post(INTAKE, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        var client_id = this.data.intakedata.result._id;
        this.newMessage(client_id,
          this.data.intakedata.result.firstName,
          this.data.intakedata.result.lastName,
          res.result._id);
        setTimeout(() => {
          this.loader = false
          if (this.data.intakedata.clientFromCalendar == 'fromCalendar') {
            this.dialogRef.close({
            })
            return;
          }
          this.dialogRef.close({
            type: "refresh",
            intakeId: res.result._id
          })
        }, 1500)
      },
        err => {
          this.loader = false
          this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
        })
    }
    else {
      this.loader = false
      this._toast.add({ severity: 'warn', summary: 'Please sign to save the Intake Form' });
    }
  }
  newMessage(clientId, firstName, lastName, intakeFormId) {
    this.data2.changeMessage({ "clientId": clientId, "firstName": firstName, "lastName": lastName, "intakeFormId": intakeFormId });
  }
  intakeAppointmentForm() {
    var clientId = this.data.intakedata
    var data = this.clientIntakeForm.value;
    data.client_info.personal = clientId;
    var a = this.diseases.filter(item => item.selected)
    var b = a.map(item => {
      return item.name
    })
    this.selected_diseases = b;
    data.medical_info.diseases = this.selected_diseases;
    delete data.client_info.area;
    delete data.client_info.city;
    delete data.client_info.dob;
    delete data.client_info.email;
    delete data.client_info.gender;
    delete data.client_info.phone1;
    delete data.client_info.firstName;
    delete data.client_info.lastName;
    delete data.client_info.state;
    if (data.massage_info.client_sign && data.massage_info.therapist_sign) {
      this._service.post(INTAKE, data).subscribe(res => {
        this.dialogRef.close({
          type: 'close',
          intakeId: res.result._id
        })
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      }, err => {
      })
    }
    else {
      this._toast.add({ severity: 'warn', summary: 'Please sign to save the Intake Form' });
    }
  }

  inputChange(e) {
    console.log(e);
  }

  stepperChange(e) {
    console.log(e);
    // if(e.selectedIndex) {
      
    // }
  }
}
