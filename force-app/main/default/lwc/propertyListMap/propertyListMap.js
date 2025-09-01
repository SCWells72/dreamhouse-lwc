// noinspection JSClassNamingConvention
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
                // TODO: Is there any way to have "L" from this script represented here in a more first-class manner?
                loadScript(this, `${LEAFLET}/leaflet.js`),
                loadStyle(this, `${LEAFLET}/leaflet.css`)
            ]);
            // Configure map
            const mapElement = this.template.querySelector('.map');
            // @ts-expect-error "L" is from OpenStreetMap
            this.map = L.map(mapElement, {
                zoomControl: true,
                tap: false
            });
            this.map.setView([42.356045, -71.08565], 13);
            this.map.scrollWheelZoom.disable();
            // @ts-expect-error "L" is from OpenStreetMap
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
        // @ts-expect-error "L" is from OpenStreetMap
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
            // @ts-expect-error "L" is from OpenStreetMap
            const marker = L.marker(latLng, { icon });
            marker.propertyId = property.Id;
            marker.on('click', markerClickHandler);
            marker.bindTooltip(tooltipMarkup, { offset: [45, -40] });
            return marker;
        });
        // Create a layer with property markers and add it to map
        // @ts-expect-error "L" is from OpenStreetMap
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlMaXN0TWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvcGVydHlMaXN0TWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQUV2QyxjQUFjO0FBQ2QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM3QyxPQUFPLEVBQ0gsT0FBTyxFQUNQLFNBQVMsRUFDVCxXQUFXLEVBQ1gsY0FBYyxFQUdqQixNQUFNLDBCQUEwQixDQUFDO0FBQ2xDLE9BQU8sZUFBZSxNQUFNLDZDQUE2QyxDQUFDO0FBQzFFLE9BQU8saUJBQWlCLE1BQU0sZ0RBQWdELENBQUM7QUFDL0UsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxPQUFPLE1BQU0sbUNBQW1DLENBQUM7QUFDeEQsT0FBTyxvQkFBb0IsTUFBTSwwREFBMEQsQ0FBQztBQUc1RixNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUM3QixNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDMUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBYXhCLDZCQUE2QjtBQUM3QixNQUFNLENBQUMsT0FBTyxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBQ3pELFVBQVUsR0FBRyxFQUFFLENBQUM7SUFFaEIsTUFBTTtJQUNOLFlBQVksR0FBRyxrQkFBa0IsQ0FBQztJQUNsQyxHQUFHLENBQU07SUFDVCxhQUFhLENBQWdCO0lBRTdCLFVBQVU7SUFDVixTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ2YsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQixXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ25CLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDcEIsVUFBVSxHQUFHLElBQUksQ0FBQztJQUNsQixRQUFRLEdBQUcsSUFB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