// noinspection SpellCheckingInspection
import { LightningElement, wire } from 'lwc';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';
import PROPERTYSELECTEDMC from '@salesforce/messageChannel/PropertySelected__c';
import getPagedPropertyList from '@salesforce/apex/PropertyController.getPagedPropertyList';
const PAGE_SIZE = 9;
export default class PropertyTileList extends LightningElement {
    pageNumber = 1;
    pageSize = PAGE_SIZE;
    searchKey = '';
    maxPrice = 9999999;
    minBedrooms = 0;
    minBathrooms = 0;
    @wire(MessageContext)
    messageContext;
    subscription;
    @wire(getPagedPropertyList, {
        searchKey: '$searchKey',
        maxPrice: '$maxPrice',
        minBedrooms: '$minBedrooms',
        minBathrooms: '$minBathrooms',
        pageSize: '$pageSize',
        pageNumber: '$pageNumber'
    })
    properties;
    connectedCallback() {
        this.subscription = subscribe(this.messageContext, FILTERSCHANGEMC, (message) => {
            this.handleFilterChange(message);
        });
    }
    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    handleFilterChange(filters) {
        this.searchKey = filters.searchKey;
        this.maxPrice = filters.maxPrice;
        this.minBedrooms = filters.minBedrooms;
        this.minBathrooms = filters.minBathrooms;
    }
    handlePreviousPage() {
        this.pageNumber -= 1;
    }
    handleNextPage() {
        this.pageNumber += 1;
    }
    handlePropertySelected(event) {
        const message = { propertyId: event.detail };
        publish(this.messageContext, PROPERTYSELECTEDMC, message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlUaWxlTGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3BlcnR5VGlsZUxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdUNBQXVDO0FBRXZDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDN0MsT0FBTyxFQUNILE9BQU8sRUFDUCxTQUFTLEVBQ1QsV0FBVyxFQUNYLGNBQWMsRUFHakIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLGVBQWUsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLGtCQUFrQixNQUFNLGdEQUFnRCxDQUFDO0FBQ2hGLE9BQU8sb0JBQW9CLE1BQU0sMERBQTBELENBQUM7QUFHNUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRXBCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCO0lBQzFELFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDZixRQUFRLEdBQUcsU0FBUyxDQUFDO0lBRXJCLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDZixRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQ25CLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDaEIsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUVqQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDckIsY0FBYyxDQUFxQjtJQUVuQyxZQUFZLENBQTZCO0lBRXpDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1FBQ3hCLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFdBQVcsRUFBRSxjQUFjO1FBQzNCLFlBQVksRUFBRSxlQUFlO1FBQzdCLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFVBQVUsRUFBRSxhQUFhO0tBQzVCLENBQUM7SUFDRixVQUFVLENBQTBCO0lBRXBDLGlCQUFpQjtRQUNiLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUN6QixJQUFJLENBQUMsY0FBYyxFQUNuQixlQUFlLEVBQ2YsQ0FBQyxPQUF5QixFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FDSixDQUFDO0lBQ04sQ0FBQztJQUVELG9CQUFvQjtRQUNoQixXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxPQUF5QjtRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7SUFDN0MsQ0FBQztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELHNCQUFzQixDQUFDLEtBQTRCO1FBQy9DLE1BQU0sT0FBTyxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0NBQ0oifQ==