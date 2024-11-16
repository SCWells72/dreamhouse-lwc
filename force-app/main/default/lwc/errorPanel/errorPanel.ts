import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
// @ts-expect-error Still issues with template imports
import noDataIllustration from './templates/noDataIllustration.html';
// @ts-expect-error Still issues with template imports
import inlineMessage from './templates/inlineMessage.html';

export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors: FetchResponse | FetchResponse[];
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api type: string;

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    render() {
        // noinspection NonBlockStatementBodyJS
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }
}
