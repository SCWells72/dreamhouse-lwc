// noinspection SpellCheckingInspection
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import PROPERTYSELECTEDMC from '@salesforce/messageChannel/PropertySelected__c';
const fields = [
    'Property__c.Name',
    'Property__c.Address__c',
    'Property__c.City__c',
    'Property__c.Location__Latitude__s',
    'Property__c.Location__Longitude__s'
];
// noinspection CssConvertColorToRgbInspection
export default class PropertyMap extends LightningElement {
    address;
    error;
    markers;
    propertyId;
    subscription = null;
    zoomLevel = 14;
    @wire(MessageContext)
    messageContext;
    @wire(getRecord, { recordId: '$propertyId', fields })
    wiredRecord({ error, data }) {
        if (data) {
            this.error = undefined;
            const property = data.fields;
            this.address = `${property.Address__c.value}, ${property.City__c.value}`;
            this.markers = [
                {
                    location: {
                        Latitude: property.Location__Latitude__s.value,
                        Longitude: property.Location__Longitude__s.value
                    },
                    title: `${property.Name.value}`,
                    description: `<b>Address</b>: ${property.Address__c.value}`,
                    mapIcon: {
                        path: 'M1472 992v480q0 26-19 45t-45 19h-384v-384h-256v384h-384q-26 0-45-19t-19-45v-480q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7l-692-577-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204v-195q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z',
                        fillColor: '#f28b00',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        scale: 0.02
                    }
                }
            ];
        }
        else if (error) {
            this.error = error;
            this.address = undefined;
            this.markers = [];
        }
    }
    @api
    get recordId() {
        return this.propertyId;
    }
    set recordId(propertyId) {
        this.propertyId = propertyId;
    }
    connectedCallback() {
        this.subscription = subscribe(this.messageContext, PROPERTYSELECTEDMC, (message) => {
            this.handlePropertySelected(message);
        });
    }
    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    handlePropertySelected(message) {
        this.propertyId = message.propertyId;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlNYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9wZXJ0eU1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFFdkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFDSCxTQUFTLEVBQ1QsV0FBVyxFQUNYLGNBQWMsRUFFakIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLGtCQUFrQixNQUFNLGdEQUFnRCxDQUFDO0FBR2hGLE1BQU0sTUFBTSxHQUFHO0lBQ1gsa0JBQWtCO0lBQ2xCLHdCQUF3QjtJQUN4QixxQkFBcUI7SUFDckIsbUNBQW1DO0lBQ25DLG9DQUFvQztDQUN2QyxDQUFDO0FBRUYsOENBQThDO0FBQzlDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLGdCQUFnQjtJQUNyRCxPQUFPLENBQVM7SUFDaEIsS0FBSyxDQUFNO0lBQ1gsT0FBTyxDQUF1QjtJQUM5QixVQUFVLENBQVM7SUFDbkIsWUFBWSxHQUFHLElBQUksQ0FBQztJQUNwQixTQUFTLEdBQUcsRUFBRSxDQUFDO0lBRWYsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ3JCLGNBQWMsQ0FBcUI7SUFFbkMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNyRCxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ3ZCLElBQUksSUFBSSxFQUFFLENBQUM7WUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3pFLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ1g7b0JBQ0ksUUFBUSxFQUFFO3dCQUNOLFFBQVEsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSzt3QkFDOUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLO3FCQUNuRDtvQkFDRCxLQUFLLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDL0IsV0FBVyxFQUFFLG1CQUFtQixRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTtvQkFDM0QsT0FBTyxFQUFFO3dCQUNMLElBQUksRUFBRSw2VUFBNlU7d0JBQ25WLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixXQUFXLEVBQUUsQ0FBQzt3QkFDZCxZQUFZLEVBQUUsQ0FBQzt3QkFDZixLQUFLLEVBQUUsSUFBSTtxQkFDZDtpQkFDSjthQUNKLENBQUM7UUFDTixDQUFDO2FBQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBRUQsQ0FBQyxHQUFHO1FBQ0EsUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsVUFBVTtRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQ25CLGtCQUFrQixFQUNsQixDQUFDLE9BQTRCLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFzQixDQUFDLE9BQTRCO1FBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0NBQ0oifQ==