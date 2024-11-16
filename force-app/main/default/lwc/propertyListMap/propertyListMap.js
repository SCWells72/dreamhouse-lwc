// noinspection JSClassNamingConvention
// TODO: What is "L"?
/* global L */
import { LightningElement, wire } from 'lwc';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import FILTERS_CHANGED from '@salesforce/messageChannel/FiltersChange__c';
import PROPERTY_SELECTED from '@salesforce/messageChannel/PropertySelected__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leafletjs';
import getPagedPropertyList from '@salesforce/apex/PropertyController.getPagedPropertyList';
const LEAFLET_NOT_LOADED = 0;
const LEAFLET_LOADING = 1;
const LEAFLET_READY = 2;
// noinspection MagicNumberJS
export default class PropertyListMap extends LightningElement {
    properties = [];
    // Map
    leafletState = LEAFLET_NOT_LOADED;
    map;
    propertyLayer;
    // Filters
    searchKey = '';
    maxPrice = null;
    minBedrooms = null;
    minBathrooms = null;
    pageNumber = null;
    pageSize = null;
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
    wiredProperties({ error, data }) {
        if (data) {
            this.properties = data.records;
            // Display properties on map
            this.displayProperties();
        }
        else if (error) {
            this.properties = [];
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error loading properties',
                message: error.message,
                variant: 'error'
            }));
        }
    }
    connectedCallback() {
        this.subscription = subscribe(this.messageContext, FILTERS_CHANGED, (message) => {
            this.handleFilterChange(message);
        });
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
        }
        catch (error) {
            const message = error.message || error.body.message;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error while loading Leaflet',
                message,
                variant: 'error'
            }));
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
        const markerClickHandler = (event) => {
            // Send message using the Lightning Message Service
            const message = { propertyId: event.target.propertyId };
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
    handleFilterChange(filters) {
        this.searchKey = filters.searchKey;
        this.maxPrice = filters.maxPrice;
        this.minBedrooms = filters.minBedrooms;
        this.minBathrooms = filters.minBathrooms;
    }
    // noinspection JSMethodCanBeStatic
    getTooltipMarkup(property) {
        return `<div class="tooltip-picture" style="background-image:url(${property.Thumbnail__c});">  
  <div class="lower-third">
    <h1>${property.Name}</h1>
    <p>Beds: ${property.Beds__c} - Baths: ${property.Baths__c}</p>
  </div>
</div>`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlMaXN0TWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvcGVydHlMaXN0TWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQUV2QyxxQkFBcUI7QUFDckIsY0FBYztBQUNkLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDN0MsT0FBTyxFQUNILE9BQU8sRUFDUCxTQUFTLEVBQ1QsV0FBVyxFQUNYLGNBQWMsRUFHakIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLGVBQWUsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLGlCQUFpQixNQUFNLGdEQUFnRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNoRSxPQUFPLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sT0FBTyxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hELE9BQU8sb0JBQW9CLE1BQU0sMERBQTBELENBQUM7QUFHNUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7QUFDN0IsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQWF4Qiw2QkFBNkI7QUFDN0IsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUN6RCxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBRWhCLE1BQU07SUFDTixZQUFZLEdBQUcsa0JBQWtCLENBQUM7SUFDbEMsR0FBRyxDQUFNO0lBQ1QsYUFBYSxDQUFnQjtJQUU3QixVQUFVO0lBQ1YsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNmLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNuQixZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDbEIs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