// noinspection SpellCheckingInspection
import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';
const DELAY = 350;
const MAX_PRICE = 1200000;
export default class PropertyFilter extends LightningElement {
    searchKey = '';
    maxPrice = MAX_PRICE;
    minBedrooms = 0;
    minBathrooms = 0;
    @wire(MessageContext)
    messageContext;
    handleReset() {
        this.searchKey = '';
        this.maxPrice = MAX_PRICE;
        this.minBedrooms = 0;
        this.minBathrooms = 0;
        this.fireChangeEvent();
    }
    handleSearchKeyChange(event) {
        this.searchKey = event.detail.value;
        this.fireChangeEvent();
    }
    handleMaxPriceChange(event) {
        this.maxPrice = event.detail.value;
        this.fireChangeEvent();
    }
    handleMinBedroomsChange(event) {
        this.minBedrooms = event.detail.value;
        this.fireChangeEvent();
    }
    handleMinBathroomsChange(event) {
        this.minBathrooms = event.detail.value;
        this.fireChangeEvent();
    }
    fireChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        // @ts-expect-error Not sure where delayTimeout lives
        window.clearTimeout(this.delayTimeout);
        // @ts-expect-error Not sure where delayTimeout lives
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            const filters = {
                searchKey: this.searchKey,
                maxPrice: this.maxPrice,
                minBedrooms: this.minBedrooms,
                minBathrooms: this.minBathrooms
            };
            publish(this.messageContext, FILTERSCHANGEMC, filters);
        }, DELAY);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlGaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9wZXJ0eUZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFFdkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBcUIsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RixPQUFPLGVBQWUsTUFBTSw2Q0FBNkMsQ0FBQztBQUkxRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDbEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBRTFCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sY0FBZSxTQUFRLGdCQUFnQjtJQUN4RCxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ2YsUUFBUSxHQUFHLFNBQVMsQ0FBQztJQUNyQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLFlBQVksR0FBRyxDQUFDLENBQUM7SUFFakIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ3JCLGNBQWMsQ0FBcUI7SUFFbkMsV0FBVztRQUNQLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQscUJBQXFCLENBQUMsS0FBa0M7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQW1DO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxLQUFtQztRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsd0JBQXdCLENBQUMsS0FBbUM7UUFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGVBQWU7UUFDWCxxRkFBcUY7UUFDckYscUZBQXFGO1FBQ3JGLHNEQUFzRDtRQUN0RCxxREFBcUQ7UUFDckQsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkMscURBQXFEO1FBQ3JELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsTUFBTSxPQUFPLEdBQUc7Z0JBQ1osU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQ2xDLENBQUM7WUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2QsQ0FBQztDQUNKIn0=