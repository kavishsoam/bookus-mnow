import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ExportService } from 'app/services/export.service';

@Component({
  selector: 'app-iou-list',
  templateUrl: './iou-list.component.html',
  styleUrls: ['./iou-list.component.scss']
})
export class IouListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private exportFile: ExportService
  ) { }

  foods: any = [
    {value: 'steak-0', viewValue: 'Edit'},
    {value: 'pizza-1', viewValue: 'Void'},
    {value: 'tacos-2', viewValue: 'Pay'}
  ];

  ngOnInit() {
  }
  selectedValue : any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  iouList : any = [
    {
  'a1' : 'May 21,2018',
  'a2' : '--',
  'a3' : 'Charles angels',
  'a4' : '--',
  'a5' : 'Abby Anderela',
  'a6' : 'no cash',
  'a7' : 'Outstanding',
  'a8' : '20$',
  'a9': '--'
    },
    {
      'a1' : 'May 21,2018',
      'a2' : '--',
      'a3' : 'Charles angels',
      'a4' : '--',
      'a5' : 'Abby Anderela',
      'a6' : 'no cash',
      'a7' : 'Outstanding',
      'a8' : '20$',
      'a9': '--'
        },
        {
          'a1' : 'May 21,2018',
          'a2' : '--',
          'a3' : 'Charles angels',
          'a4' : '--',
          'a5' : 'Abby Anderela',
          'a6' : 'no cash',
          'a7' : 'Outstanding',
          'a8' : '20$',
          'a9': '--'
            },
            {
              'a1' : 'May 21,2018',
              'a2' : '--',
              'a3' : 'Charles angels',
              'a4' : '--',
              'a5' : 'Abby Anderela',
              'a6' : 'no cash',
              'a7' : 'Outstanding',
              'a8' : '20$',
              'a9': '--'
                },
                {
                  'a1' : 'May 21,2018',
                  'a2' : '--',
                  'a3' : 'Charles angels',
                  'a4' : '--',
                  'a5' : 'Abby Anderela',
                  'a6' : 'no cash',
                  'a7' : 'Outstanding',
                  'a8' : '20$',
                  'a9': '--'
                    }

  ]
  iouListColumn: string[] = ['Action','CreateDate', 'CloseDate', 'NotedBy',
    'ClosedBy', 'Customer','Comment','Status','Amount','VoidReason'];
    dataSource = new MatTableDataSource(this.iouList);


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
        this.iouList,
        "client",
        "Client List",
        "Auto-generated client data")
    }
}
