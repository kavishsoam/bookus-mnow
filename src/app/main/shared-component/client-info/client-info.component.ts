import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, SimpleChanges, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { getCurrencySymbol } from '@angular/common';
import { HistoryAppointmentComponent } from 'app/main/calendar/history-appointment/history-appointment.component';
import { InvoiceEmailComponent } from '../invoice-email/invoice-email.component';
@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  animations: fuseAnimations,
})
export class ClientInfoComponent implements OnInit, AfterViewInit {
  @Input() isView: boolean;
  @ViewChild("myInput1")
  myInput1: any;
  @ViewChild("myInput2")
  myInput2: any;
  @Input() isInvoice: boolean;
  // for the view appointment
  @Input() type: string;
  @Input() totalAmount: any;
  @Input() status: any;
  @Input() reduceAmount: any;
  @Input() reducePayment: any;
  @Input() apt: any;
  @Input() data: any;
  @Input() clientData: any;
  @Input() invoiceDate: Date;
  @Input() invoiceData: any;
  @Input() profile: boolean;
  @Input() discount: any;
  @Input() appointment: any;
  @Input() clientDetails: any;
  @Input() checkout: any;
  @Input() clientInvoices: any;
  @Input() IsClientInTakeFormExist: boolean;
  @Input() multiAmount: Number;
  @Input() intakeId: any;
  @Input() historyAppointment = false;
  @Output() view_Profile = new EventEmitter();
  @Output() get_Intake_By_IntakeId = new EventEmitter();
  @Output() change_Status = new EventEmitter();
  @Output() on_More_Option_Selected = new EventEmitter();
  @Output() client_invoices = new EventEmitter();
  //xx xx xx xx xx xx xx xx xx
  //for the new appointment
  @Input() grandAmount: number = 0;
  @Input() allData: any;
  @Input() clients: any;
  @Input() searchClient: any;
  @Input() searchClientEmail: any;
  @Input() searchClientPhone: any;
  @Input() intakeFormFilled: any;
  @Input() ifClicked: boolean;
  @Input() select_Client: any;
  @Input() isPayMode: any;
  @Input() clientList: boolean;
  @Input() isVoucher : boolean = true;
  @Input() isViewAppointment : boolean = true;
  @Output() show_Menu = new EventEmitter();
  @Output() client_Option = new EventEmitter();
  @Output() create_New_Client = new EventEmitter()
  @Output() get_IntakeBy_ClientId = new EventEmitter();
  @Output() check_Out = new EventEmitter();
  @Output() view_Invoice = new EventEmitter();
  @Output() select_Clients = new EventEmitter();
  @Output() payment_mode = new EventEmitter();
  @Output() voucher_dialog = new EventEmitter();
  @Output() back_to_payment = new EventEmitter();
  @Output() complete_sale = new EventEmitter();
  @Output() client_List = new EventEmitter();
  @Output() ReDirectSchedular = new EventEmitter();


  //to completesale button 
  @Input() completeSaleClick : boolean;
  list_View: boolean = false;
  currencyCode: string;
  amount: any;
  currCode: string;
  filterClient: any;
  errorPrice: boolean;
  //xx xx xx xx xx xx xx xx
  constructor(
    private cd: ApplicationRef,
    private changeRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }
  ngOnInit() {

    this.currencyCode = localStorage.getItem('currency')
    this.currCode = getCurrencySymbol(this.currencyCode, "narrow")
  }
  ngAfterViewInit(): void {
  }

  getColor(data) {
    switch (data) {
      case null:
        return 'orange';
      case 'new':
        return 'darkgreen';
      case '':
        return 'blue'
      case undefined:
        return 'orange'
      case 'no show':
        return 'red';
      case 'completed':
        return 'grey';
    }
  }



  //kavish -dev_rahul

  appointmentSelected(d){
    let reAllocateCalender = {
       date: d.startTime,
       location:d.location,
       staffId: d.staff.id
    }
  this.ReDirectSchedular.emit(reAllocateCalender);
  }

  truncate(value: string, limit: number = 6, trail: String = '…'): string {
    let result = value || '';
  
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
  
    return result;
  }

  viewAppointment(appointmentData) {
    //('appointment data history', appointmentData);
    if(!this.historyAppointment){
      const dialogRef = this.dialog.open(HistoryAppointmentComponent, {
        width: "100vw",
        height: "100vh",
        panelClass: 'pad-Mnow321',
        data: appointmentData
      });
      dialogRef.afterClosed().subscribe(result => {
        //('close result', result);
        dialogRef.close();
      });
    }
 
  }
  // for the view appointment
  viewProfile() {
    this.view_Profile.emit();
  }
  backToPayment(apt) {
    this.back_to_payment.emit(apt)
  }
  getIntakeByIntakeId() {
    this.get_Intake_By_IntakeId.emit();
  }
  changeStatus(value) {
    this.change_Status.emit(value);
  }
  onMoreOptionSelected(value) {
    this.on_More_Option_Selected.emit(value);
  }
  checkOut() {
    this.check_Out.emit();
  }
  paymentMode(e) {
    //
    //
    this.grandAmount;
    this.myInput1 ? this.amount = this.myInput1.nativeElement.value : this.amount = this.myInput2.nativeElement.value
    this.payment_mode.emit({ type: e, amount: this.amount })
  }
  voucher() {
    this.voucher_dialog.emit()
  }
  completeSale() {
    
    this.complete_sale.emit()
  }
  viewInvoice(invoiceData) {
    this.view_Invoice.emit(invoiceData);
  }
  //xx xx xx xxx xx xx xxx xxx xxx 
  showMenu(value) {
    this.show_Menu.emit(value);
    this.filterClient = this.clients;
    if (!this.list_View) {
      this.list_View = true;
      this.client_List.emit({ blur: true });
    }
  }
  clientOption(value) {
    this.client_Option.emit(value);
  }
  createNewClient() {
    this.create_New_Client.emit();
  }
  getIntakeByClientId() {
    this.get_IntakeBy_ClientId.emit();
  }
  selectClient(item) {
    this.select_Clients.emit(item);
    this.changeRef.detectChanges()
  }
  restrict(e: Number) {
    if (!e || e == 0) {
      this.errorPrice = true;
      return;
    }
    if (e < 0) {
      this.errorPrice = true;
      return;
    }
    if (e > this.grandAmount) {
      this.errorPrice = true;
      return;
    }
    let num = e.toLocaleString();
    if (num.length > 1) {
      if (num.includes(".")) {
        let dec = num.split(".")[1];
        if (dec.length == 0 || dec.length > 2) {
          this.errorPrice = true;
          return;
        }
      }
    }
    this.errorPrice = false;
  }
  keyPress(e) {
    let width = e.currentTarget.style.width
    width = parseInt(width.replace(/\D/g, ""))
    if (e.keyCode === 46 && e.currentTarget.value.split('.').length === 2) {
      return false;
    }
    if (e.keyCode >= 48 && e.keyCode <= 57 && e.currentTarget.value.length <= 9) {
      if (width < 10) {
        width = width + 1
        e.currentTarget.style.width = `${width}ch`
      }
      else if (e.currentTarget.value.length > 9) return false
    }
    else if (e.keyCode === 8 && width > 2) {
      width = width - 1
      e.currentTarget.style.width = `${width}ch`
    }
  }
  test() {
    let interval = setInterval(() => {
      if (this.myInput1 && this.myInput1.nativeElement.value) {
        this.myInput1.nativeElement.style.width = `${this.myInput1.nativeElement.value.length + 2}ch`
        clearInterval(interval)
      }
      if (this.myInput2 && this.myInput2.nativeElement.value) {
        this.myInput2.nativeElement.style.width = `${this.myInput2.nativeElement.value.length + 2}ch`
        clearInterval(interval)
      }
    }, 500)
  }
  onClientSearch(value) {
    var search = value.toLowerCase().trim();
    //  this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    var data = this.clients.filter((item) => {
      // if (item.firstName.match(value) != null || item.lastName.match(value) != null) {
      //   return true;
      // }
      if (item.firstName.toLowerCase().indexOf(search) > -1 || item.lastName.toLowerCase().indexOf(search) > -1 || (item.phone1 ? item.phone1.indexOf(search) > -1 : false) || (item.phone2 ? (item.phone2.indexOf(search) > -1) : false) || (item && item.email ? (item.email.indexOf(search) > -1) : false)) {
        return true;
      }
    }
    )
    if (value != "") {
      this.filterClient = data;
    }
    else {
      this.filterClient = this.clients;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.clientList) {
      this.list_View = false;
    }
    var a = (this.ifClicked && !this.isView) || this.list_View

  }

  fire() {

  }
}
