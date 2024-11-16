import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';
import NAME_FIELD from '@salesforce/schema/Broker__c.Name';
import PHONE_FIELD from '@salesforce/schema/Broker__c.Phone__c';
import MOBILE_PHONE_FIELD from '@salesforce/schema/Broker__c.Mobile_Phone__c';
import EMAIL_FIELD from '@salesforce/schema/Broker__c.Email__c';
const PROPERTY_FIELDS = [BROKER_FIELD];
const BROKER_FIELDS = [
    NAME_FIELD,
    PHONE_FIELD,
    MOBILE_PHONE_FIELD,
    EMAIL_FIELD
];
export default class BrokerCard extends NavigationMixin(LightningElement) {
    @api
    recordId;
    brokerFields = BROKER_FIELDS;
    @wire(getRecord, { recordId: '$recordId', fields: PROPERTY_FIELDS })
    property;
    get brokerId() {
        return getFieldValue(this.property.data, BROKER_FIELD);
    }
    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.brokerId,
                objectApiName: 'Property__c',
                actionName: 'view'
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJva2VyQ2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJyb2tlckNhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQXdCLE1BQU0sdUJBQXVCLENBQUM7QUFDdkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXZELE9BQU8sWUFBWSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BFLE9BQU8sVUFBVSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNELE9BQU8sV0FBVyxNQUFNLHVDQUF1QyxDQUFDO0FBQ2hFLE9BQU8sa0JBQWtCLE1BQU0sOENBQThDLENBQUM7QUFDOUUsT0FBTyxXQUFXLE1BQU0sdUNBQXVDLENBQUM7QUFFaEUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QyxNQUFNLGFBQWEsR0FBRztJQUNsQixVQUFVO0lBQ1YsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixXQUFXO0NBQ2QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLE9BQU8sVUFBVyxTQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNyRSxDQUFDLEdBQUc7SUFBQyxRQUFRLENBQVM7SUFFdEIsWUFBWSxHQUFHLGFBQWEsQ0FBQztJQUU3QixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsQ0FBQztJQUNwRSxRQUFRLENBQW1DO0lBRTNDLElBQUksUUFBUTtRQUNSLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLFVBQVUsRUFBRTtnQkFDUixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLGFBQWEsRUFBRSxhQUFhO2dCQUM1QixVQUFVLEVBQUUsTUFBTTthQUNyQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSiJ9