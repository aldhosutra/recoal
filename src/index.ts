/**
 * recoal - Request Coalescing and Caching Utility
 *
 * This module provides both a global instance and a class for creating custom coalescing instances.
 *
 * Usage (global instance):
 *
 *   import { coalesce, isCoalesced } from 'recoal';
 *   await coalesce(myAsyncFn, arg1, arg2);
 *   const active = isCoalesced(myAsyncFn, arg1, arg2);
 *
 * Usage (custom instance):
 *
 *   import { RecoalInstance } from 'recoal';
 *   const coalescer = new RecoalInstance();
 *   await coalescer.coalesce(myAsyncFn, arg1, arg2);
 *
 * The global instance uses default TTL and prune interval settings.
 * For custom TTL, prune interval, or logging, use your own instance.
 */
import { RecoalInstance } from './instance';

/**
 * Global coalescer instance with default configuration.
 * Use this for simple, application-wide coalescing.
 */
const globalCoalescer = new RecoalInstance();

/**
 * Export the RecoalInstance class for custom coalescer creation.
 */
export { RecoalInstance };

/**
 * Coalesce and cache requests using the global instance.
 * Equivalent to globalCoalescer.coalesce(...).
 * @see RecoalInstance#coalesce
 */
export const coalesce = globalCoalescer.coalesce.bind(globalCoalescer);

/**
 * Check if a request is in-flight or cached using the global instance.
 * Equivalent to globalCoalescer.isCoalesced(...).
 * @see RecoalInstance#isCoalesced
 */
export const isCoalesced = globalCoalescer.isCoalesced.bind(globalCoalescer);
