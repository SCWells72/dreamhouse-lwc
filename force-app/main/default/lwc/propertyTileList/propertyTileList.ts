// noinspection SpellCheckingInspection

import { LightningElement, wire } from 'lwc';
import {
    publish,
    subscribe,
    unsubscribe,
    MessageContext,
    MessageContextType,
    MessageChannelSubscription
} from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';
import PROPERTYSELECTEDMC from '@salesforce/messageChannel/PropertySelected__c';
import getPagedPropertyList from '@salesforce/apex/PropertyController.getPagedPropertyList';
import {PropertySelectedEvent} from "c/propertyTile";

const PAGE_SIZE = 9;

export default class PropertyTileList extends LightningElement {
    pageNumber = 1;
    pageSize = PAGE_SIZE;

    searchKey = '';
    maxPrice = 9999999;
    minBedrooms = 0;
    minBathrooms = 0;

    @wire(MessageContext)
    messageContext: MessageContextType;

    subscription: MessageChannelSubscription;

    @wire(getPagedPropertyList, {
        searchKey: '$searchKey',
        maxPrice: '$maxPrice',
        minBedrooms: '$minBedrooms',
        minBathrooms: '$minBathrooms',
        pageSize: '$pageSize',
        pageNumber: '$pageNumber'
    })
    properties: WireResult<PagedResult>;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            FILTERSCHANGEMC,
            (message: FiltersChange__c) => {
                this.handleFilterChange(message);
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleFilterChange(filters: FiltersChange__c) {
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

    handlePropertySelected(event: PropertySelectedEvent) {
        const message = { propertyId: event.detail };
        publish(this.messageContext, PROPERTYSELECTEDMC, message);
    }
}