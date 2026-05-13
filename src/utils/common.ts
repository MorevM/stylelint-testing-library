import { isString, isUndefined, toNumber, tsObject } from '@morev/utils';
import type { PlainObject } from '@morev/utils';

/**
 * Clears the object of keys that have the value `undefined`.
 *
 * @param   source   The source object.
 *
 * @returns          A new object without keys that was declared as `undefined` in the source object.
 */
export const omitUndefinedValues = (source: PlainObject<unknown>) => {
	return tsObject.fromEntries(
		tsObject.entries(source)
			.filter(([key, value]) => !isUndefined(value)),
	);
};

/**
 * Retrieves (from a stack trace) the line number of the call
 * that follows the call with the specified function.
 *
 * @param   previousCallFunctionName   The name of the function that precedes the desired output.
 *
 * @returns                            Number of the line or `null` in case it could not be determined.
 */
export const fetchErrorLine = (previousCallFunctionName: string) => {
	try {
		throw new Error('error-to-catch-the-line');
	} catch (error: any) {
		if (!error.stack || !isString(error.stack)) return null;
		const stack = error.stack.split('\n');
		const errorFileLineIndex = stack
			.findIndex((item: string) => item.includes(previousCallFunctionName)) + 1;

		return toNumber(stack[errorFileLineIndex]?.match(/(\d+):\d+$/)?.[1], null);
	}
};
