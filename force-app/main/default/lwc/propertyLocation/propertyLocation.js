import { LightningElement, wire, api } from 'lwc';
import { getLocationService } from 'lightning/mobileCapabilities';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
// Using hardcoded fields due to LWC bug
const LATITUDE_FIELD = 'Property__c.Location__Latitude__s';
const LONGITUDE_FIELD = 'Property__c.Location__Longitude__s';
const fields = [LATITUDE_FIELD, LONGITUDE_FIELD];
// noinspection FunctionNamingConventionJS,LocalVariableNamingConventionJS,MagicNumberJS
export default class PropertyLocation extends LightningElement {
    error;
    deviceLocationService;
    distance;
    location;
    @api
    recordId;
    property;
    @wire(getRecord, { recordId: '$recordId', fields })
    wiredProperty({ data, error }) {
        if (data) {
            this.property = data;
            this.calculateDistance();
        }
        else if (error) {
            this.error = error;
            this.property = undefined;
        }
    }
    async connectedCallback() {
        this.deviceLocationService = getLocationService();
        if (this.deviceLocationService.isAvailable()) {
            // Running on the Salesforce mobile app on a device
            await this.calculateLocationFromMobileDevice();
        }
        else if (navigator.geolocation) {
            // Running on a browser
            this.calculateLocationFromBrowser();
        }
        else {
            this.error = { message: 'No location services available' };
        }
    }
    async calculateLocationFromMobileDevice() {
        try {
            this.location = await this.deviceLocationService.getCurrentPosition({
                enableHighAccuracy: true
            });
            this.calculateDistance();
        }
        catch (error) {
            this.error = error;
        }
    }
    calculateLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition((result) => {
            this.location = result;
            this.calculateDistance();
        }, (error) => {
            this.error = error;
        });
    }
    calculateDistance() {
        if (this.location && this.property) {
            const latitude1 = this.location.coords.latitude;
            const latitude2 = Number(getFieldValue(this.property, LATITUDE_FIELD));
            const longitude1 = this.location.coords.longitude;
            const longitude2 = Number(getFieldValue(this.property, LONGITUDE_FIELD));
            // Haversine formula
            const deg2rad = (deg) => (deg * Math.PI) / 180.0;
            const earthRadius = 6371; // Radius of the earth in km
            const dLat = deg2rad(latitude2 - latitude1); // deg2rad below
            const dLon = deg2rad(longitude2 - longitude1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(latitude1)) *
                    Math.cos(deg2rad(latitude2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = earthRadius * c;
            this.distance = d / 1.609344;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlMb2NhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3BlcnR5TG9jYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFrQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2xHLE9BQU8sRUFBQyxTQUFTLEVBQUUsYUFBYSxFQUF1QixNQUFNLHVCQUF1QixDQUFDO0FBRXJGLHdDQUF3QztBQUN4QyxNQUFNLGNBQWMsR0FBRyxtQ0FBbUMsQ0FBQztBQUMzRCxNQUFNLGVBQWUsR0FBRyxvQ0FBb0MsQ0FBQztBQUU3RCxNQUFNLE1BQU0sR0FBRyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVqRCx3RkFBd0Y7QUFDeEYsTUFBTSxDQUFDLE9BQU8sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7SUFDMUQsS0FBSyxDQUFNO0lBQ1gscUJBQXFCLENBQWtCO0lBQ3ZDLFFBQVEsQ0FBUztJQUNqQixRQUFRLENBQXVDO0lBQy9DLENBQUMsR0FBRztJQUFDLFFBQVEsQ0FBUztJQUN0QixRQUFRLENBQXVCO0lBRS9CLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbkQsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtRQUN6QixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQzthQUFNLElBQUksS0FBSyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUM5QixD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