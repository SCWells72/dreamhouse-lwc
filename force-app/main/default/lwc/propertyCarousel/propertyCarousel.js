import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { processImage } from 'lightning/mediaUtils';
import { refreshApex } from '@salesforce/apex';
import getPictures from '@salesforce/apex/PropertyController.getPictures';
import createFile from '@salesforce/apex/FileUtilities.createFile';
import ADDRESS_FIELD from '@salesforce/schema/Property__c.Address__c';
import CITY_FIELD from '@salesforce/schema/Property__c.City__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Property__c.Description__c';
const FIELDS = [ADDRESS_FIELD, CITY_FIELD, DESCRIPTION_FIELD];
// noinspection JSUnusedGlobalSymbols,LocalVariableNamingConventionJS
export default class PropertyCarousel extends LightningElement {
    @api
    recordId;
    carouselItems;
    pictures;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    property;
    @wire(getPictures, { propertyId: '$recordId' })
    wiredPictures(pictures) {
        this.pictures = pictures;
        if (pictures.data) {
            const files = pictures.data;
            if (Array.isArray(files) && files.length) {
                this.carouselItems = files.map((file) => {
                    return {
                        title: file.Title,
                        url: `/sfc/servlet.shepherd/version/download/${file.Id}`
                    };
                });
            }
            else {
                this.carouselItems = null;
            }
        }
    }
    get address() {
        return getFieldValue(this.property.data, ADDRESS_FIELD);
    }
    get city() {
        return getFieldValue(this.property.data, CITY_FIELD);
    }
    get description() {
        return getFieldValue(this.property.data, DESCRIPTION_FIELD);
    }
    get errors() {
        const errors = [this.property.error, this.pictures.error].filter((error) => error);
        return errors.length ? errors : null;
    }
    // As this app is accessible on mobile, let's resize/compress the images for a better UX
    // If you don't need compression, use lightning-file-upload instead
    async handleFilesSelected(event) {
        try {
            const options = {
                resizeMode: 'fill',
                resizeStrategy: 'reduce',
                targetWidth: 500,
                targetHeight: 500,
                compressionQuality: 0.75,
                imageSmoothingEnabled: true,
                preserveTransparency: false,
                backgroundColor: 'white'
            };
            // Process each file individually to allow partial uploads succeed
            /* eslint-disable no-await-in-loop */
            for (const file of event.target.files) {
                // Compress and resize image
                const blob = await processImage(file, options);
                // Convert to base64
                const base64data = await this.blobToBase64(blob);
                // Create file attached to record
                await createFile({
                    base64data: base64data,
                    filename: file.name,
                    recordId: this.recordId
                });
                // Refresh pictures to incorporate uploaded file
                await refreshApex(this.pictures);
            }
        }
        catch (error) {
            console.error('Error compressing and creating file: ', error);
        }
    }
    async blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Remove Data-URL declaration
            reader.readAsDataURL(blob);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlDYXJvdXNlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3BlcnR5Q2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQXdCLE1BQU0sdUJBQXVCLENBQUM7QUFDdkYsT0FBTyxFQUFzQixZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDL0MsT0FBTyxXQUFXLE1BQU0saURBQWlELENBQUM7QUFDMUUsT0FBTyxVQUFVLE1BQU0sMkNBQTJDLENBQUM7QUFFbkUsT0FBTyxhQUFhLE1BQU0sMkNBQTJDLENBQUM7QUFDdEUsT0FBTyxVQUFVLE1BQU0sd0NBQXdDLENBQUM7QUFDaEUsT0FBTyxpQkFBaUIsTUFBTSwrQ0FBK0MsQ0FBQztBQUc5RSxNQUFNLE1BQU0sR0FBRyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQU85RCxxRUFBcUU7QUFDckUsTUFBTSxDQUFDLE9BQU8sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7SUFDMUQsQ0FBQyxHQUFHO0lBQUMsUUFBUSxDQUFTO0lBQ3RCLGFBQWEsQ0FBaUI7SUFDOUIsUUFBUSxDQUFrQjtJQUUxQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUMzRCxRQUFRLENBQW1DO0lBRTNDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUMvQyxhQUFhLENBQUMsUUFBc0M7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxR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