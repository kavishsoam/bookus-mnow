import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { LOC_LIS, POST_BLOG, UPDATE_BLOG } from 'app/services/url';

@Component({
  selector: 'app-blog-add-edit',
  templateUrl: './blog-add-edit.component.html',
  styleUrls: ['./blog-add-edit.component.scss']
})
export class BlogAddEditComponent implements OnInit {
  Modaldata: any = {};
  categoryData: any = [];
  locationList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private _service : ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef<BlogAddEditComponent>,
    private dialog: MatDialog,
  ) {
    (this.data.edit) ? this.Modaldata.header = 'New Blog' : this.Modaldata.header = 'Edit Blog';
  }

  resource: any;

  ngOnInit() {

    
    this.getCategoryList();
    this.getLocationList();
    this.resource = this.formBuilder.group({
      categoryId: ['',[Validators.required]],
      locationId : ['',[Validators.required]],
      heading : ['',[Validators.required]],
      content: ['']
    })

    if(this.data.header = 'Edit Blog'){
    this.blogDataPatch();
    }
  }

  blogDataPatch() {
    this.resource.patchValue({
      categoryId : this.data.blogData.categoryId,
      locationId : this.data.blogData.location,
      heading : (this.data && this.data.blogData && this.data.blogData.heading) ? this.data.blogData.heading : '',
      content : (this.data && this.data.blogData && this.data.blogData.content) ? this.data.blogData.content : ''
    })
  }

  onSubmit(form) {
    if(this.data.header == 'Edit Blog') {
       this.updateBlog(form.value);   
    }
    if(this.data.header == 'Post Blog') {
      this._service.post(POST_BLOG,form.value).subscribe(res=>{
        console.log(res);
      },err=>{
        console.log(err);
      })
    }
    this.dialogRef.close();
  }

  updateBlog(data) {
    this._service.put(UPDATE_BLOG + this.data.blogData._id,data).subscribe(res=>{
      console.log(res);
    },err=>{
      console.log(err);
    })
  }

  submitted: any;

  delete() {
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

getLocationList() {
  this._service.get(LOC_LIS).subscribe(
    res => {
      this.locationList = res;
    },
    err => {
     console.log(err);
    }
  );
}

catSelectedListener(e){
  console.log(e)
}

}
