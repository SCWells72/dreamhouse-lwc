import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class NavigateToRecord extends NavigationMixin(LightningElement) {
    @api
    recordId;
    connectedCallback() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view'
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGVUb1JlY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdmlnYXRlVG9SZWNvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFdkQsTUFBTSxDQUFDLE9BQU8sT0FBTyxnQkFBaUIsU0FBUSxlQUFlLENBQ3pELGdCQUFnQixDQUNuQjtJQUNHLENBQUMsR0FBRztJQUFDLFFBQVEsQ0FBUztJQUV0QixpQkFBaUI7UUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsVUFBVSxFQUFFO2dCQUNSLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsVUFBVSxFQUFFLE1BQU07YUFDckI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oifQ==