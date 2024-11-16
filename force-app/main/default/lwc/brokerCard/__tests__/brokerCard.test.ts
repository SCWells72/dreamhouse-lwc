// noinspection LocalVariableNamingConventionJS

import { createElement } from 'lwc';
import BrokerCard from 'c/brokerCard';
import { getNavigateCalledWith } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Mock realistic data
import mockGetPropertyRecord from "./data/getPropertyRecord.json";
import {LdsTestWireAdapter} from "@salesforce/wire-service-jest-util";
import LightningRecordForm from "lightning/recordForm";
import LightningButtonIcon from "lightning/buttonIcon";
import ErrorPanel from "c/errorPanel";

const BROKER_ID = 'a003h000003xlBiAAI';

const BROKER_FIELDS_INPUT = [
    {
        fieldApiName: 'Name',
        objectApiName: 'Broker__c'
    },
    {
        fieldApiName: 'Phone__c',
        objectApiName: 'Broker__c'
    },
    {
        fieldApiName: 'Mobile_Phone__c',
        objectApiName: 'Broker__c'
    },
    {
        fieldApiName: 'Email__c',
        objectApiName: 'Broker__c'
    }
];

describe('c-broker-card', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing.
    async function flushPromises() {
        return Promise.resolve();
    }

    describe('broker record form', () => {
        it('gets property data from wire service', async () => {
            // Create element
            const element = createElement('c-broker-card', {
                is: BrokerCard
            });
            document.body.appendChild(element);

            // Emit data from @wire
            (<LdsTestWireAdapter><unknown>getRecord).emit(mockGetPropertyRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const propertyEl = element.shadowRoot.querySelector<LightningRecordForm>(
                'lightning-record-form'
            );
            expect(getFieldValue).toHaveBeenCalled();
            expect(propertyEl.recordId).toBe(BROKER_ID);
        });

        it('renders lightning-record-form with given input values', async () => {
            // Create element
            const element = createElement('c-broker-card', {
                is: BrokerCard
            });
            document.body.appendChild(element);

            // Emit data from @wire
            (<LdsTestWireAdapter><unknown>getRecord).emit(mockGetPropertyRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const propertyEl = element.shadowRoot.querySelector<LightningRecordForm>(
                'lightning-record-form'
            );
            expect(propertyEl.fields).toEqual(BROKER_FIELDS_INPUT);
            expect(propertyEl.recordId).toBe(BROKER_ID);
        });
    });

    describe('navigate to broker record', () => {
        it('navigates to record view', async () => {
            // Nav param values to test later
            const NAV_TYPE = 'standard__recordPage';
            const NAV_OBJECT_API_NAME = 'Property__c';
            const NAV_ACTION_NAME = 'view';
            const NAV_RECORD_ID = BROKER_ID;

            // Create initial lwc element and attach to virtual DOM
            const element = createElement('c-broker-card', {
                is: BrokerCard
            });
            document.body.appendChild(element);

            // Simulate the data sent over wire adapter to hydrate the wired property
            (<LdsTestWireAdapter><unknown>getRecord).emit(mockGetPropertyRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Get handle to view button and fire click event
            const buttonEl = element.shadowRoot.querySelector<LightningButtonIcon>(
                'lightning-button-icon'
            );
            buttonEl.click();

            const { pageReference } = getNavigateCalledWith();
            // Verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });

    describe('error panel', () => {
        it('renders error if data is not retrieved successfully', async () => {
            const WIRE_ERROR = 'Something bad happened';

            // Create element and attach to virtual DOM
            const element = createElement('c-broker-card', {
                is: BrokerCard
            });
            document.body.appendChild(element);

            (<LdsTestWireAdapter><unknown>getRecord).error(WIRE_ERROR);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            const errorPanelEl =
                element.shadowRoot.querySelector<ErrorPanel>('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            // @ts-expect-error Not sure what type "errors" is expected to be below
            expect(errorPanelEl.errors.body).toBe(WIRE_ERROR);
            expect(errorPanelEl.friendlyMessage).toBe('Error retrieving data');
        });
    });

    it('is accessible when property returned', async () => {
        const element = createElement('c-broker-card', {
            is: BrokerCard
        });

        document.body.appendChild(element);

        // Emit data from @wire
        (<LdsTestWireAdapter><unknown>getRecord).emit(mockGetPropertyRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const WIRE_ERROR = 'Something bad happened';

        // Create element and attach to virtual DOM
        const element = createElement('c-broker-card', {
            is: BrokerCard
        });
        document.body.appendChild(element);

        (<LdsTestWireAdapter><unknown>getRecord).error(WIRE_ERROR);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
