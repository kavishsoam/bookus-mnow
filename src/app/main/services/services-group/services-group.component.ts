import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { SERVICE_GROUP, SERVICE_GP, SERVICE_GP_UPDATE, SERVICE_GP_DEL } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { EditClient } from '../services.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-services-group',
  templateUrl: './services-group.component.html',
  styleUrls: ['./services-group.component.scss']
})
export class ServicesGroupComponent implements OnInit {
  editServiceGroup: FormGroup;
  service: any = [];
  groupLists: any = [];
  group_id: any;
  colorValue: any = '';
  deletePrompt: boolean;
  categoryData: any = [];
  categoryCollection: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ServicesGroupComponent>
  ) { }
  ngOnInit() {
    this.getCategoryList();
    this.editServiceGroup = this._formBuilder.group({
      appointment_col: [''],
      name: ['', Validators.compose([Validators.required])],
      categoryId : [''],
      description: [''],
    })
    if (this.data.header == 'Select Service Group') {
      this.getAllServiceGroup();
    }
    else if (this.data.header == 'Edit Service Group') {
      this.group_id = (this.data.value._id && this.data.value && this.data.value._id ? this.data.value._id : undefined);
      if (this.group_id) {
        this.data.value.name ? this.editServiceGroup.get('name').setValue(this.data.value.name) : '';
        this.data.value.categoryId ? this.editServiceGroup.get('categoryId').setValue(this.data.value.categoryId) : '';
        this.data.value.description ? this.editServiceGroup.get('description').setValue(this.data.value.description) : '';
        if (this.data.value.appointment_col) {
          this.editServiceGroup.get('appointment_col').setValue(this.data.value.appointment_col);
          this.colorValue = this.data.value.appointment_col;
        }
      }
    }
    else if (this.data.header == '' && this.data.delete) {
      this.group_id = (this.data.value._id && this.data.value && this.data.value._id ? this.data.value._id : undefined);
      this.deletePrompt = this.data.delete;
    }
  }
  addNewService(id,serviceGroupData) {
    // this.dialogRef.close();
    const dialogRef = this.dialog.open(EditClient, {
      width: '100vw',
      height: '100vh',
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { _id: id, header: 'New Service', serviceGroup : serviceGroupData }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        this.dialogRef.close({ type: 'refresh' });
        result.type == 'refresh' ? this.getAllServiceGroup() : ''
      }
    });
  }
  ServiceGroupSubmit(form) {
    if (form.invalid) {
      return;
    }
    if (this.group_id) {
      this.updateService(form.value);
      return;
    }
    form.value.name = _.startCase(_.toLower(form.value.name));
    this._service.post(SERVICE_GROUP, form.value).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      });
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  updateService(data) {
    data.name = _.startCase(_.toLower(data.name));
    this._service.put(`${SERVICE_GP_UPDATE}${this.group_id}`, data).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this.group_id = undefined;
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  deleteGroup() {
    if (this.data.value && this.data.value.services && this.data.value.services.length == 0) {
      this.deletePrompt = true;
    }
    else {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: "Remove existing services first to be able to delete a group" });
    }
  }
  deleteGoupConfirmed() {
    this._service.delete(`${SERVICE_GP_DEL}${this.group_id}`).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this.group_id = undefined;
      this.deletePrompt = false;
    }, err => {
      this.deletePrompt = true;
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  cancelDelete() {
    if (this.data.header == '') {
      this.deletePrompt = false;
      this.dialogRef.close({
        type: 'refresh'
      })
    }
    this.deletePrompt = false;
  }
  colorSetter(color) {
    this.editServiceGroup.get("appointment_col").setValue(color);
  }
  getAllServiceGroup() {
    this._service.get(SERVICE_GP).subscribe(res => {
      this.groupLists = res;
    }, err => {
    })
  }

  getCategoryList() {
    this._service.get('category').subscribe(res=>{
      let categoryList : any = [];
       categoryList = localStorage.getItem('categoryList').split(',');
      let data = [];
        let category = [];
        category = res.result;
        category.forEach(element => {
            element.category.forEach(innerEle => {
              categoryList.forEach(id => {
                if(innerEle.language == 'english' && element._id == id)
                data.push({id: element._id, name: innerEle.name });
              });
            });
        });
        this.categoryData = data;
        console.log('category data ===>>>',this.categoryData);
    },err=>{
        console.log(err);
    })
}

catSelectedListener(data) {
  this.categoryCollection = data;
}

}
