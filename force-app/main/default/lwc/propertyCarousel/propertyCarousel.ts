import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue, RecordRepresentation } from 'lightning/uiRecordApi';
import {ProcessImageOptions, processImage } from 'lightning/mediaUtils';
import { refreshApex } from '@salesforce/apex';
import getPictures from '@salesforce/apex/PropertyController.getPictures';
import createFile from '@salesforce/apex/FileUtilities.createFile';

import ADDRESS_FIELD from '@salesforce/schema/Property__c.Address__c';
import CITY_FIELD from '@salesforce/schema/Property__c.City__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Property__c.Description__c';
import LightningInput from 'lightning/input';

const FIELDS = [ADDRESS_FIELD, CITY_FIELD, DESCRIPTION_FIELD];

interface CarouselItem {
    title?: string;
    url?: string;
}

// noinspection JSUnusedGlobalSymbols,LocalVariableNamingConventionJS
export default class PropertyCarousel extends LightningElement {
    @api recordId: string;
    carouselItems: CarouselItem[];
    pictures: { error: any; };

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    property: WireResult<RecordRepresentation>;

    @wire(getPictures, { propertyId: '$recordId' })
    wiredPictures(pictures: WireResult<ContentVersion[]>) {
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
            } else {
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
        const errors = [this.property.error, this.pictures.error].filter(
            (error) => error
        );
        return errors.length ? errors : null;
    }

    // As this app is accessible on mobile, let's resize/compress the images for a better UX
    // If you don't need compression, use lightning-file-upload instead
    async handleFilesSelected(event: CustomEvent<LightningInput>) {
        try {
            const options: ProcessImageOptions = {
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
            for (const file of (<LightningInput>event.target).files) {
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
        } catch (error) {
            console.error('Error compressing and creating file: ', error);
        }
    }

    async blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((<string>reader.result).split(',')[1]); // Remove Data-URL declaration
            reader.readAsDataURL(blob);
        });
    }
}
