import { Component, OnInit,  Input } from '@angular/core';

@Component({
  selector: 'app-voucher-checkout-search-client',
  templateUrl: './voucher-checkout-search-client.component.html',
  styleUrls: ['./voucher-checkout-search-client.component.scss']
})
export class VoucherCheckoutSearchClientComponent implements OnInit {


  searchClient:any;
  @Input() sendValue: any;

  constructor() { }

  ngOnInit() {
    //('send value ===>>>> ',this.sendValue);
  }
  // onClientSearch(value) {
  //   var search = value.toLowerCase().trim();
  //   //  this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
  //   var data = this.clients.filter((item) => {
  //     // if (item.firstName.match(value) != null || item.lastName.match(value) != null) {
  //     //   return true;
  //     // }
  //     if (item.firstName.toLowerCase().indexOf(search) > -1 || item.lastName.toLowerCase().indexOf(search) > -1 || (item.phone1 ? item.phone1.indexOf(search) > -1 : false) || (item.phone2 ? (item.phone2.indexOf(search) > -1) : false) || (item && item.email ? (item.email.indexOf(search) > -1) : false)) {
  //       return true;
  //     }
  //   }
  //   )
  //   if (value != "") {
  //     this.filterClient = data;
  //   }
  //   else {
  //     this.filterClient = this.clients;
  //   }
  // }

  // showMenu(value) {
  //   this.show_Menu.emit(value);
  //   this.filterClient = this.clients;
  //   if (!this.list_View) {
  //     this.list_View = true;
  //     this.client_List.emit({ blur: true });
  //   }
  // }


  onClientSearch(e) {
    //('onclient search events value==>>',e);
  }

  showMenu(e) {
    //('show menu event output===>>',e);
  }
}
