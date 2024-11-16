/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param errors
 * @return Error messages
 */
export function reduceErrors(errors: any): string[] {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }

    return (
        errors
            // Remove null/undefined items
            .filter((error: any) => !!error)
            // Extract an error message
            .map((error: any) => {
                // UI API read errors
                if (Array.isArray(error.body)) {
                    return error.body.map((e: any) => e.message);
                }
                // UI API DML, Apex and network errors
                else if (error.body && typeof error.body.message === 'string') {
                    return error.body.message;
                }
                // JS errors
                else if (typeof error.message === 'string') {
                    return error.message;
                }
                // Unknown error shape so try HTTP status text
                return error.statusText;
            })
            // Flatten
            .reduce((prev: string | any[], curr: any) => prev.concat(curr), [])
            // Remove empty strings
            .filter((message: string) => !!message)
    );
}