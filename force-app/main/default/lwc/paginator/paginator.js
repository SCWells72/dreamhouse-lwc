import { LightningElement, api } from 'lwc';
const MAX_ITEM_OFFSET = 2000;
export default class Paginator extends LightningElement {
    /** The current page number. */
    @api
    pageNumber;
    /** The number of items on a page. */
    @api
    pageSize;
    /** The total number of items in the list. */
    @api
    totalItemCount;
    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }
    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
    get currentPageNumber() {
        return this.totalItemCount === 0 ? 0 : this.pageNumber;
    }
    get isNotFirstPage() {
        return this.pageNumber > 1;
    }
    get isNotLastPage() {
        return (this.pageNumber < this.totalPages &&
            this.pageNumber * this.pageSize < MAX_ITEM_OFFSET);
    }
    get totalPages() {
        return Math.ceil(this.totalItemCount / this.pageSize);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFnaW5hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFFNUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBRTdCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sU0FBVSxTQUFRLGdCQUFnQjtJQUNuRCwrQkFBK0I7SUFDL0IsQ0FBQyxHQUFHO0lBQUMsVUFBVSxDQUFTO0lBRXhCLHFDQUFxQztJQUNyQyxDQUFDLEdBQUc7SUFBQyxRQUFRLENBQVM7SUFFdEIsNkNBQTZDO0lBQzdDLENBQUMsR0FBRztJQUFDLGNBQWMsQ0FBUztJQUU1QixjQUFjO1FBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLGlCQUFpQjtRQUNqQixPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0QsQ0FBQztJQUVELElBQUksY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLE9BQU8sQ0FDSCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO1lBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQ3BELENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDSiJ9