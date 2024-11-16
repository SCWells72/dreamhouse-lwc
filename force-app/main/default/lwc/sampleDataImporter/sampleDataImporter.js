import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import importSampleData from '@salesforce/apex/SampleDataController.importSampleData';
export default class SampleDataImporter extends LightningElement {
    handleImportSampleData() {
        importSampleData()
            .then(() => {
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Sample data successfully imported',
                variant: 'success'
            });
            this.dispatchEvent(evt);
        })
            .catch((e) => {
            const evt = new ShowToastEvent({
                title: 'Error while importing data',
                message: e.message,
                variant: 'error'
            });
            this.dispatchEvent(evt);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlRGF0YUltcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2FtcGxlRGF0YUltcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxnQkFBZ0IsTUFBTSx3REFBd0QsQ0FBQztBQUV0RixNQUFNLENBQUMsT0FBTyxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjtJQUM1RCxzQkFBc0I7UUFDbEIsZ0JBQWdCLEVBQUU7YUFDYixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUM7Z0JBQzNCLEtBQUssRUFBRSxTQUFTO2dCQUNoQixPQUFPLEVBQUUsbUNBQW1DO2dCQUM1QyxPQUFPLEVBQUUsU0FBUzthQUNyQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUM7Z0JBQzNCLEtBQUssRUFBRSw0QkFBNEI7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDbEIsT0FBTyxFQUFFLE9BQU87YUFDbkIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDSiJ9