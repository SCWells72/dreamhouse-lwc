import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
// NOTE: Had to rename this type since we're importing BarcodeScanner from lightning/mobileCapabilities
// noinspection JSDeprecatedSymbols
export default class MyBarcodeScanner extends NavigationMixin(LightningElement) {
    myScanner;
    scanButtonEnabled = false;
    scannedQrCode = '';
    // When the component is initialized, determine whether to enable the Scan button
    connectedCallback() {
        this.myScanner = getBarcodeScanner();
        if (this.myScanner?.isAvailable()) {
            this.scanButtonEnabled = true;
        }
    }
    async handleBeginScanClick() {
        // Reset scannedQrCode to empty string before starting a new scan
        this.scannedQrCode = '';
        // Make sure BarcodeScanner is available before trying to use it
        // Scan QR Code button also disabled when scanner unavailable
        if (this.myScanner?.isAvailable()) {
            const scanningOptions = {
                barcodeTypes: [this.myScanner.barcodeTypes.QR],
                instructionText: 'Scan a QR Code',
                successText: 'Scanning complete.'
            };
            // Try starting the scanning process, then using the result to navigate to a property record
            try {
                const captureResult = await this.myScanner.beginCapture(scanningOptions);
                // Extract QR code data
                this.scannedQrCode = captureResult.value;
                // Navigate to the records page of the property with extracted ID
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.scannedQrCode,
                        objectApiName: 'Property__c',
                        actionName: 'view'
                    }
                });
            }
            catch (error) {
                // There was an error while scanning
                // We chose to handle errors with toasts to stay in line with the mobile experience
                // The user canceled the scan
                if (error.code === 'userDismissedScanner') {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Scanning Canceled',
                        message: 'Scanning session canceled.',
                        mode: 'sticky'
                    }));
                }
                // There was some other kind of error
                else {
                    // Inform the user we ran into something unexpected
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Barcode Scanner Error',
                        message: 'There was a problem scanning the QR code: ' +
                            error.message,
                        variant: 'error',
                        mode: 'sticky'
                    }));
                }
            }
            finally {
                // Close capture process regardless of whether we completed successfully or had an error
                this.myScanner.endCapture();
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyY29kZVNjYW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXJjb2RlU2Nhbm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDdkMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQWtCLGlCQUFpQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFFaEYsdUdBQXVHO0FBQ3ZHLG1DQUFtQztBQUNuQyxNQUFNLENBQUMsT0FBTyxPQUFPLGdCQUFpQixTQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMzRSxTQUFTLENBQWlCO0lBQzFCLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUMxQixhQUFhLEdBQUcsRUFBRSxDQUFDO0lBRW5CLGlGQUFpRjtJQUNqRixpQkFBaUI7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0I7UUFDdEIsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBRXhCLGdFQUFnRTtRQUNoRSw2REFBNkQ7UUFDN0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDaEMsTUFBTSxlQUFlLEdBQUc7Z0JBQ3BCLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztnQkFDOUMsZUFBZSxFQUFFLGdCQUFnQjtnQkFDakMsV0FBVyxFQUFFLG9CQUFvQjthQUNwQyxDQUFDO1lBRUYsNEZBQTRGO1lBQzVGLElBQUksQ0FBQztnQkFDRCxNQUFNLGFBQWEsR0FDZixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUV2RCx1QkFBdUI7Z0JBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztnQkFFekMsaUVBQWlFO2dCQUNqRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMzQixJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixVQUFVLEVBQUU7d0JBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUM1QixhQUFhLEVBQUUsYUFBYTt3QkFDNUIsVUFBVSxFQUFFLE1BQU07cUJBQ3JCO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLG9DQUFvQztnQkFDcEMsbUZBQW1GO2dCQUNuRiw2QkFBNkI7Z0JBQzdCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxzQkFBc0IsRUFBRSxDQUFDO29CQUN4QyxJQUFJLENBQUMsYUFBYSxDQUNkLElBQUksY0FBYyxDQUFDO3dCQUNmLEtBQUssRUFBRSxtQkFBbUI7d0JBQzFCLE9BQU8sRUFBRSw0QkFBNEI7d0JBQ3JDLElBQUksRUFBRSxRQUFRO3FCQUNqQixDQUFDLENBQ0wsQ0FBQztnQkFDTixDQUFDO2dCQUVELHFDQUFxQztxQkFDaEMsQ0FBQztvQkFDRixtREFBbUQ7b0JBQ25ELElBQUksQ0FBQyxhQUFhLENBQ2QsSUFBSSxjQUFjLENBQUM7d0JBQ2YsS0FBSyxFQUFFLHVCQUF1Qjt3QkFDOUIsT0FBTyxFQUNILDRDQUE0Qzs0QkFDNUMsS0FBSyxDQUFDLE9BQU87d0JBQ2pCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixJQUFJLEVBQUUsUUFBUTtxQkFDakIsQ0FBQyxDQUNMLENBQUM7Z0JBQ04sQ0FBQztZQUNMLENBQUM7b0JBQVMsQ0FBQztnQkFDUCx3RkFBd0Y7Z0JBQ3hGLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0NBQ0oifQ==