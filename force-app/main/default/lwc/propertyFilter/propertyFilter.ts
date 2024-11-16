// noinspection SpellCheckingInspection

import { LightningElement, wire } from 'lwc';
import { publish, MessageContext, MessageContextType} from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';
import LightningInput from "lightning/input";
import LightningSlider from "lightning/slider";

const DELAY = 350;
const MAX_PRICE = 1200000;

export default class PropertyFilter extends LightningElement {
    searchKey = '';
    maxPrice = MAX_PRICE;
    minBedrooms = 0;
    minBathrooms = 0;

    @wire(MessageContext)
    messageContext: MessageContextType;

    handleReset() {
        this.searchKey = '';
        this.maxPrice = MAX_PRICE;
        this.minBedrooms = 0;
        this.minBathrooms = 0;
        this.fireChangeEvent();
    }

    handleSearchKeyChange(event: CustomEvent<LightningInput>) {
        this.searchKey = event.detail.value;
        this.fireChangeEvent();
    }

    handleMaxPriceChange(event: CustomEvent<LightningSlider>) {
        this.maxPrice = event.detail.value;
        this.fireChangeEvent();
    }

    handleMinBedroomsChange(event: CustomEvent<LightningSlider>) {
        this.minBedrooms = event.detail.value;
        this.fireChangeEvent();
    }

    handleMinBathroomsChange(event: CustomEvent<LightningSlider>) {
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
