export class PaginationManager {
    public ADDRESS_OFFICER_BTN_SIZE = 5;

    empty = false;
    first = true;
    last = false;
    number = 0;
    noOfCurrentPageElements = 0;
    pageNumber = 0;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;
    showButtons = [0];

    public setPageData(data: any) {
        this.empty = data.empty;
        this.first = data.first;
        this.last = data.last;
        this.number = data.number;
        this.noOfCurrentPageElements = data.numberOfElements;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;


        this.showButtons = [0];
        // total pages smaller then the default pages
        if (this.totalPages < this.ADDRESS_OFFICER_BTN_SIZE)
            this.fillValues(1, this.totalPages);
        else

            //    when we are on last index and then switch to next 5 pages    --ex.  [1,2...5]  -> [6,7...10] 
            if (this.pageNumber != 0 && (this.pageNumber % this.ADDRESS_OFFICER_BTN_SIZE) == 0) {
                if ((this.totalPages - this.pageNumber) % this.ADDRESS_OFFICER_BTN_SIZE == 0)
                    this.fillValues(this.pageNumber + 1, this.pageNumber + this.ADDRESS_OFFICER_BTN_SIZE);

                else
                    this.fillValues(this.pageNumber + 1, this.totalPages);

            }

            //  for first case if the page refresh
            else if (this.pageNumber == 0 && this.showButtons.length == 1)
                this.fillValues(this.pageNumber + 1, this.pageNumber + this.ADDRESS_OFFICER_BTN_SIZE);

            else if (this.showButtons.length == 1)    // when the page is not zero and we don't want to switch the array it will fill the same value of pages
                this.fillValues(this.pageNumber, this.pageNumber + 1);


    }

    fillValues(st: any, end: any) {
        this.showButtons = [];
        for (let index = st; index <= end; index++) {
            this.showButtons.push(index);
        }
    }
}
