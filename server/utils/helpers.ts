/**
 * Safely parses a string into an integer.
 * @param value - The string value to parse.
 * @param defaultValue - The default value to return if parsing fails.
 * @returns - The parsed integer or the default value.
 */
function parseInteger(value: string | undefined | null, defaultValue: number): number {
    if (!value) {
      return defaultValue;
    }
  
    const parsed = parseInt(value, 10);
    
    // Check if the parsed value is a NaN
    if (isNaN(parsed)) {
      return defaultValue;
    }
  
    return parsed;
  }
  
  export { parseInteger };
  