// noinspection JSClassNamingConvention

// TODO: What is "L"?
/* global L */
import { LightningElement, wire } from 'lwc';
import {
    publish,
    subscribe,
    unsubscribe,
    MessageContext,
    MessageChannelSubscription,
    MessageContextType
} from 'lightning/messageService';
import FILTERS_CHANGED from '@salesforce/messageChannel/FiltersChange__c';
import PROPERTY_SELECTED from '@salesforce/messageChannel/PropertySelected__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {loadScript, loadStyle} from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leafletjs';
import getPagedPropertyList from '@salesforce/apex/PropertyController.getPagedPropertyList';
import PropertyMap from "c/propertyMap";

const LEAFLET_NOT_LOADED = 0;
const LEAFLET_LOADING = 1;
const LEAFLET_READY = 2;

// TODO: These types are inferred from usages
interface Map {
    setView: (arg0: number[], arg1: number) => void;
    scrollWheelZoom: { disable: () => void; };
    removeLayer: (arg0: any) => void;
}

interface PropertyLayer {
    addTo: (arg0: Map) => void;
}

// noinspection MagicNumberJS
export default class PropertyListMap extends LightningElement {
    properties = [];

    // Map
    leafletState = LEAFLET_NOT_LOADED;
    map: Map;
    propertyLayer: PropertyLayer;

    // Filters
    searchKey = '';
    maxPrice = null;
    minBedrooms = null;
    minBathrooms = null;
    pageNumber = null;
    pageSize = null;

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
    wiredProperties({ error, data }) {
        if (data) {
            this.properties = data.records;
            // Display properties on map
            this.displayProperties();
        } else if (error) {
            this.properties = [];
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading properties',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            FILTERS_CHANGED,
            (message: FiltersChange__c) => {
                this.handleFilterChange(message);
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async renderedCallback() {
        if (this.leafletState === LEAFLET_NOT_LOADED) {
            await this.initializeLeaflet();
        }
    }

    async initializeLeaflet() {
        try {
            // Leaflet is loading
            this.leafletState = LEAFLET_LOADING;

            // Load resource files
            await Promise.all([
                loadScript(this, `${LEAFLET}/leaflet.js`),
                loadStyle(this, `${LEAFLET}/leaflet.css`)
            ]);

            // Configure map
            const mapElement = this.template.querySelector('.map');
            // @ts-expect-error What is "L"?
            this.map = L.map(mapElement, {
                zoomControl: true,
                tap: false
                // eslint-disable-next-line no-magic-numbers
            });
            this.map.setView([42.356045, -71.08565], 13);
            this.map.scrollWheelZoom.disable();
            // @ts-expect-error What is "L"?
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(this.map);

            // Leaflet is ready
            this.leafletState = LEAFLET_READY;

            // Display properties
            this.displayProperties();
        } catch (error) {
            const message = error.message || error.body.message;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while loading Leaflet',
                    message,
                    variant: 'error'
                })
            );
        }
    }

    displayProperties() {
        // Stop if leaflet isn't ready yet
        if (this.leafletState !== LEAFLET_READY) {
            return;
        }

        // Remove previous property layer form map if it exits
        if (this.propertyLayer) {
            this.map.removeLayer(this.propertyLayer);
        }

        // Prepare property icon
        // @ts-expect-error What is "L"?
        // noinspection JSVoidFunctionReturnValueUsed
        const icon = L.divIcon({
            className: 'my-div-icon',
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 52 52"><path fill="#DB4437" d="m26 2c-10.5 0-19 8.5-19 19.1 0 13.2 13.6 25.3 17.8 28.5 0.7 0.6 1.7 0.6 2.5 0 4.2-3.3 17.7-15.3 17.7-28.5 0-10.6-8.5-19.1-19-19.1z m0 27c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path></svg>'
        });

        // Prepare click handler for property marker
        const markerClickHandler = (event: CustomEvent<PropertyMap>) => {
            // Send message using the Lightning Message Service
            const message = { propertyId: (<PropertyMap>event.target).propertyId };
            publish(this.messageContext, PROPERTY_SELECTED, message);
        };

        // Prepare property markers
        const markers = this.properties.map((property) => {
            const latLng = [
                property.Location__Latitude__s,
                property.Location__Longitude__s
            ];
            const tooltipMarkup = this.getTooltipMarkup(property);
            // @ts-expect-error What is "L"?
            const marker = L.marker(latLng, { icon });
            marker.propertyId = property.Id;
            marker.on('click', markerClickHandler);
            marker.bindTooltip(tooltipMarkup, { offset: [45, -40] });
            return marker;
        });

        // Create a layer with property markers and add it to map
        // @ts-expect-error What is "L"?
        this.propertyLayer = L.layerGroup(markers);
        this.propertyLayer.addTo(this.map);
    }

    handleFilterChange(filters: FiltersChange__c) {
        this.searchKey = filters.searchKey;
        this.maxPrice = filters.maxPrice;
        this.minBedrooms = filters.minBedrooms;
        this.minBathrooms = filters.minBathrooms;
    }

    // noinspection JSMethodCanBeStatic
    getTooltipMarkup(property: Property__c) {
        return `<div class="tooltip-picture" style="background-image:url(${property.Thumbnail__c});">  
  <div class="lower-third">
    <h1>${property.Name}</h1>
    <p>Beds: ${property.Beds__c} - Baths: ${property.Baths__c}</p>
  </div>
</div>`;
    }
}
