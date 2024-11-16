import { LightningElement } from 'lwc';
import { getContactsService } from 'lightning/mobileCapabilities';
export default class ListContactsFromDevice extends LightningElement {
    contactsService;
    deviceContacts;
    error;
    async connectedCallback() {
        this.contactsService = getContactsService();
        if (this.contactsService.isAvailable()) {
            await this.retrieveDeviceContacts();
        }
        else {
            this.error = { message: 'Contact service not available' };
        }
    }
    async retrieveDeviceContacts() {
        const options = {
            permissionRationaleText: 'Allow access to your contacts to enable contacts processing.'
        };
        try {
            this.deviceContacts =
                await this.contactsService.getContacts(options);
        }
        catch (error) {
            this.error = error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdENvbnRhY3RzRnJvbURldmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3RDb250YWN0c0Zyb21EZXZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ3ZDLE9BQU8sRUFBNEIsa0JBQWtCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUUzRixNQUFNLENBQUMsT0FBTyxPQUFPLHNCQUF1QixTQUFRLGdCQUFnQjtJQUNoRSxlQUFlLENBQWtCO0lBQ2pDLGNBQWMsQ0FBWTtJQUMxQixLQUFLLENBQXVCO0lBRTVCLEtBQUssQ0FBQyxpQkFBaUI7UUFDbkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDeEMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUM7UUFDOUQsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsc0JBQXNCO1FBQ3hCLE1BQU0sT0FBTyxHQUFHO1lBQ1osdUJBQXVCLEVBQ25CLDhEQUE4RDtTQUNyRSxDQUFDO1FBRUYsSUFBSSxDQUFDO1lBQ0QsSUFBSSxDQUFDLGNBQWM7Z0JBQ2YsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7SUFDTCxDQUFDO0NBQ0oifQ==