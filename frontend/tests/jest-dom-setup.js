/**
 * Setup file to add jest-dom matchers to Jest
 */

// Import the matchers from jest-dom
import '@testing-library/jest-dom';

// Explicitly add matchers to Jest's expect
import { expect } from '@jest/globals';
import * as matchers from '@testing-library/jest-dom/matchers';

// Important: Use the spread operator to include all the matchers
expect.extend(matchers);

// Log confirmation that matchers are loaded
console.log('Jest DOM matchers have been extended to global expect');
