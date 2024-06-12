import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageRequest } from 'src/app/payload/page-request';
import { PaginationManager } from 'src/app/payload/pagination-manager';



@Component({
  selector: 'app-dynamic-pagination',
  templateUrl: './dynamic-pagination.component.html',
  styleUrls: ['./dynamic-pagination.component.scss']
})
export class DynamicPaginationComponent implements OnInit {

  ngOnInit(): void {

  }

  @Input() paginationManager !: PaginationManager
  @Input() pageRequest!: PageRequest
  @Input() data: any
  @Input() type !: string
  @Output() eventEmit = new EventEmitter<any>();

  public ManageNextPrev(isNext: any) {
    let i = 0;
    if (isNext) i = this.pageRequest.pageNumber + 1;
    else i = this.pageRequest.pageNumber - 1;
    if (i >= 0 && i < this.paginationManager.totalPages)
      this.getData(i);
  }

  getData(pageNumber: any) {
    if (pageNumber !== this.pageRequest.pageNumber) {
      this.pageRequest.pageNumber = pageNumber;
      this.getAllData()
    }
  }

  getAllData() {
    this.eventEmit.emit({ 'method': 'getAllData', 'type': this.type })
  }

  setPageSize(size: number) {
    this.pageRequest.pageSize = size;
    this.getAllData();
  }

}
