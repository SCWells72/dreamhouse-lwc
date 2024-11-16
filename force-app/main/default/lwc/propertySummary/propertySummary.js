// noinspection SpellCheckingInspection
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import PROPERTYSELECTEDMC from '@salesforce/messageChannel/PropertySelected__c';
import NAME_FIELD from '@salesforce/schema/Property__c.Name';
import BED_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BATH_FIELD from '@salesforce/schema/Property__c.Baths__c';
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';
import PICTURE_FIELD from '@salesforce/schema/Property__c.Picture__c';
export default class PropertySummary extends NavigationMixin(LightningElement) {
    propertyId;
    propertyFields = [BED_FIELD, BATH_FIELD, PRICE_FIELD, BROKER_FIELD];
    subscription = null;
    @wire(MessageContext)
    messageContext;
    @wire(getRecord, {
        recordId: '$propertyId',
        fields: [NAME_FIELD, PICTURE_FIELD]
    })
    property;
    @api
    get recordId() {
        return this.propertyId;
    }
    set recordId(propertyId) {
        this.propertyId = propertyId;
    }
    get hasNoPropertyId() {
        return this.propertyId === undefined;
    }
    get propertyName() {
        return getFieldValue(this.property.data, NAME_FIELD);
    }
    get pictureURL() {
        return getFieldValue(this.property.data, PICTURE_FIELD);
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
    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.propertyId,
                objectApiName: 'Property__c',
                actionName: 'view'
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlTdW1tYXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvcGVydHlTdW1tYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQUV2QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBd0IsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUNILFNBQVMsRUFDVCxXQUFXLEVBQ1gsY0FBYyxFQUVqQixNQUFNLDBCQUEwQixDQUFDO0FBQ2xDLE9BQU8sa0JBQWtCLE1BQU0sZ0RBQWdELENBQUM7QUFDaEYsT0FBTyxVQUFVLE1BQU0scUNBQXFDLENBQUM7QUFDN0QsT0FBTyxTQUFTLE1BQU0sd0NBQXdDLENBQUM7QUFDL0QsT0FBTyxVQUFVLE1BQU0seUNBQXlDLENBQUM7QUFDakUsT0FBTyxXQUFXLE1BQU0seUNBQXlDLENBQUM7QUFDbEUsT0FBTyxZQUFZLE1BQU0sMENBQTBDLENBQUM7QUFDcEUsT0FBTyxhQUFhLE1BQU0sMkNBQTJDLENBQUM7QUFFdEUsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxRSxVQUFVLENBQVM7SUFDbkIsY0FBYyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEUsWUFBWSxHQUFHLElBQUksQ0FBQztJQUVwQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDckIsY0FBYyxDQUFxQjtJQUVuQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDYixRQUFRLEVBQUUsYUFBYTtRQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQW1DO0lBRTNDLENBQUMsR0FBRztRQUNBLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLFVBQVU7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNmLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNaLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQ25CLGtCQUFrQixFQUNsQixDQUFDLE9BQTRCLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFzQixDQUFDLE9BQTRCO1FBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsc0JBQXNCO1FBQ2xCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUU7Z0JBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN6QixhQUFhLEVBQUUsYUFBYTtnQkFDNUIsVUFBVSxFQUFFLE1BQU07YUFDckI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oifQ==