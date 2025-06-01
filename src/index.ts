/**
 * reqoal - Request Coalescing and Caching Utility
 *
 * This module provides both a global instance and a class for creating custom coalescing instances.
 *
 * Usage (global instance):
 *
 *   import { coalesce, isCoalesced } from 'reqoal';
 *   await coalesce(myAsyncFn, arg1, arg2);
 *   const active = isCoalesced(myAsyncFn, arg1, arg2);
 *
 * Usage (custom instance):
 *
 *   import { ReqoalInstance } from 'reqoal';
 *   const coalescer = new ReqoalInstance();
 *   await coalescer.coalesce(myAsyncFn, arg1, arg2);
 *
 * The global instance uses default TTL and prune interval settings.
 * For custom TTL, prune interval, or logging, use your own instance.
 */
import { ReqoalInstance } from './instance';

/**
 * Global coalescer instance with default configuration.
 * Use this for simple, application-wide coalescing.
 */
const globalCoalescer = new ReqoalInstance();

/**
 * Export the ReqoalInstance class for custom coalescer creation.
 */
export { ReqoalInstance };

/**
 * Coalesce and cache requests using the global instance.
 * Equivalent to globalCoalescer.coalesce(...).
 * @see ReqoalInstance#coalesce
 */
export const coalesce = globalCoalescer.coalesce.bind(globalCoalescer);

/**
 * Check if a request is in-flight or cached using the global instance.
 * Equivalent to globalCoalescer.isCoalesced(...).
 * @see ReqoalInstance#isCoalesced
 */
export const isCoalesced = globalCoalescer.isCoalesced.bind(globalCoalescer);

/**
 * Manually invalidate the cache for a specific function and arguments.
 * @param fn The async function whose cache should be invalidated.
 * @param args Arguments to the function.
 */
export const invalidate = globalCoalescer.invalidate.bind(globalCoalescer);

/**
 * Clear all cached results and in-flight requests in the global instance.
 */
export const clear = globalCoalescer.clear.bind(globalCoalescer);

/**
 * Manually prune expired cache entries in the global instance.
 * Most users do not need to call this, as pruning is automatic.
 */
export const prune = globalCoalescer.prune.bind(globalCoalescer);

/**
 * Set a custom key generator for the global instance.
 * @param keyGen A function that generates a cache key from the function and arguments.
 */
export const setKeyGenerator = globalCoalescer.setKeyGenerator.bind(globalCoalescer);
