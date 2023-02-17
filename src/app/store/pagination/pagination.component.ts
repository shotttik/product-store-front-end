import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {
  @Input() userProducts: Product[] = [];

  @Output() newIndexesEvent = new EventEmitter<{}>();

  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 4;
  maxPages: number = 10;
  startPage: number = 0;
  endPage: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  pages: number[] = [];

  // paginaciis cvlilebis dros indexebis parentshi gagzavna
  addNewIndexes(currentPage: number) {
    this.currentPage = currentPage
    this.paginate()
    this.newIndexesEvent.emit({ startIndex: this.startIndex, endIndex: this.endIndex })
  }


  ngOnChanges(changes: SimpleChanges) {
    this.userProducts = changes['userProducts'].currentValue;
    this.totalItems = this.userProducts.length;
    setTimeout(() => { this.paginate() }, 100)

  }

  constructor() {
  }

  ngOnInit() {
  }

  paginate(
  ) {

    // calculate total pages
    let totalPages = Math.ceil(this.totalItems / this.pageSize);

    // ensure current page isn't out of range
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= this.maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      let maxPagesBeforeCurrentPage = Math.floor(this.maxPages / 2);
      let maxPagesAfterCurrentPage = Math.ceil(this.maxPages / 2) - 1;
      if (this.currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = this.maxPages;
      } else if (this.currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - this.maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = this.currentPage - maxPagesBeforeCurrentPage;
        endPage = this.currentPage + maxPagesAfterCurrentPage;
      }
    }

    // calculate start and end item indexes
    let startIndex = (this.currentPage - 1) * this.pageSize;
    let endIndex = Math.min(startIndex + this.pageSize, this.totalItems);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    this.startPage = startPage;
    this.endPage = endPage;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.pages = pages;
    return {
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }


}
