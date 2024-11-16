import { createElement } from 'lwc';
import PropertyLocation from 'c/propertyLocation';
import { getRecord } from 'lightning/uiRecordApi';
// @ts-expect-error This doesn't seem to be a legitimate part of the API
import { setDeviceLocationServiceAvailable } from 'lightning/mobileCapabilities';
import { mockGeolocation } from '../../../../../test/jest-mocks/global/navigator';
import {LdsTestWireAdapter} from "@salesforce/wire-service-jest-util";

// Realistic property record
import mockPropertyRecord from "./data/getRecord.json";
import LightningFormattedNumber from "lightning/formattedNumber";

const checkDistanceCalculation = (element: PropertyLocation) => {
    const latitudeEl = element.shadowRoot.querySelector<HTMLDivElement>(
        'div.location .latitude'
    );
    expect(latitudeEl).not.toBe(null);
    const longitudeEl = element.shadowRoot.querySelector<HTMLDivElement>(
        'div.location .longitude'
    );
    expect(longitudeEl).not.toBe(null);
    const formattedNumberEl = element.shadowRoot.querySelector<LightningFormattedNumber>(
        'div.location lightning-formatted-number'
    );
    expect(formattedNumberEl).not.toBe(null);

    // Compare with coordinates in mobileCapabilities.js mock
    expect(latitudeEl.textContent.trim()).toBe('42.361145');
    expect(longitudeEl.textContent.trim()).toBe('-71.057083');
    // Distance between mocked property and mocked location
    expect(formattedNumberEl.value).toBe(1444.43371701009);
};

describe('c-property-location', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty.
    // Used when having to wait for asynchronous DOM updates.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders an error panel when no location services are available', async () => {
        const element = createElement('c-property-location', {
            is: PropertyLocation
        });

        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const panelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(panelEl).not.toBeNull();
    });

    it('renders an error panel when getRecord returns an error', async () => {
        const element = createElement('c-property-location', {
            is: PropertyLocation
        });

        document.body.appendChild(element);

        // Simulate error
        (<LdsTestWireAdapter><unknown>getRecord).error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        const panelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(panelEl).not.toBeNull();
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders coordinates and distance when browser location is available', async () => {
        // Simulate browser location
        // @ts-expect-error Assignment to const
        // noinspection JSConstantReassignment
        global.navigator.geolocation = mockGeolocation;

        const element = createElement<PropertyLocation>('c-property-location', {
            is: PropertyLocation
        });
        element.recordId = mockPropertyRecord.id;
        document.body.appendChild(element);

        // Simulate property selection
        (<LdsTestWireAdapter><unknown>getRecord).emit(mockPropertyRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        checkDistanceCalculation(element);
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders coordinates and distance when device location is available', async () => {
        // Simulate device location is available
        setDeviceLocationServiceAvailable(true);

        const element = createElement<PropertyLocation>('c-property-location', {
            is: PropertyLocation
        });
        element.recordId = mockPropertyRecord.id;
        document.body.appendChild(element);

        // Simulate property selection
        (<LdsTestWireAdapter><unknown>getRecord).emit(mockPropertyRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        checkDistanceCalculation(element);
    });

    it('is accessible when panel is shown', async () => {
        // Simulate device location is available
        setDeviceLocationServiceAvailable(true);

        const element = createElement<PropertyLocation>('c-property-location', {
            is: PropertyLocation
        });
        element.recordId = mockPropertyRecord.id;
        document.body.appendChild(element);

        // Simulate property selection
        (<LdsTestWireAdapter><unknown>getRecord).emit(mockPropertyRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
