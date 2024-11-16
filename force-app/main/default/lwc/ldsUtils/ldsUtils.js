/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param errors
 * @return Error messages
 */
export function reduceErrors(errors) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
    return (errors
        // Remove null/undefined items
        .filter((error) => !!error)
        // Extract an error message
        .map((error) => {
        // UI API read errors
        if (Array.isArray(error.body)) {
            return error.body.map((e) => e.message);
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
        .reduce((prev, curr) => prev.concat(curr), [])
        // Remove empty strings
        .filter((message) => !!message));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGRzVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsZHNVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxNQUFXO0lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDekIsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELE9BQU8sQ0FDSCxNQUFNO1FBQ0YsOEJBQThCO1NBQzdCLE1BQU0sQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoQywyQkFBMkI7U0FDMUIsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7UUFDaEIscUJBQXFCO1FBQ3JCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM1QixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUNELHNDQUFzQzthQUNqQyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM1RCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzlCLENBQUM7UUFDRCxZQUFZO2FBQ1AsSUFBSSxPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUM7UUFDRCw4Q0FBOEM7UUFDOUMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO0lBQzVCLENBQUMsQ0FBQztRQUNGLFVBQVU7U0FDVCxNQUFNLENBQUMsQ0FBQyxJQUFvQixFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbkUsdUJBQXVCO1NBQ3RCLE1BQU0sQ0FBQyxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUM5QyxDQUFDO0FBQ04sQ0FBQyJ9