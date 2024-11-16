import { LightningElement, api } from 'lwc';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { NavigationMixin } from 'lightning/navigation';
// noinspection JSUnusedGlobalSymbols
export default class PropertyTile extends NavigationMixin(LightningElement) {
    @api
    property;
    formFactor = FORM_FACTOR;
    handlePropertySelected() {
        if (FORM_FACTOR === 'Small') {
            // In Phones, navigate to property record page directly
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.property.Id,
                    objectApiName: 'Property__c',
                    actionName: 'view'
                }
            });
        }
        else {
            // In other devices, send message to other comps on the page
            const selectedEvent = new CustomEvent('selected', {
                detail: this.property.Id
            });
            this.dispatchEvent(selectedEvent);
        }
    }
    get backgroundImageStyle() {
        return `background-image:url(${this.property.Thumbnail__c})`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlUaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvcGVydHlUaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDNUMsT0FBTyxXQUFXLE1BQU0sK0JBQStCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBSXZELHFDQUFxQztBQUNyQyxNQUFNLENBQUMsT0FBTyxPQUFPLFlBQWEsU0FBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUM7SUFDdkUsQ0FBQyxHQUFHO0lBQUMsUUFBUSxDQUFjO0lBQzNCLFVBQVUsR0FBRyxXQUFXLENBQUM7SUFFekIsc0JBQXNCO1FBQ2xCLElBQUksV0FBVyxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQzFCLHVEQUF1RDtZQUN2RCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixVQUFVLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDMUIsYUFBYSxFQUFFLGFBQWE7b0JBQzVCLFVBQVUsRUFBRSxNQUFNO2lCQUNyQjthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxDQUFDO1lBQ0osNERBQTREO1lBQzVELE1BQU0sYUFBYSxHQUFHLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBeUI7Z0JBQ3JFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3BCLE9BQU8sd0JBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLENBQUM7SUFDakUsQ0FBQztDQUNKIn0=