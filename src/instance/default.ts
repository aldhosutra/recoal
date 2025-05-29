/**
 * The default interval (in milliseconds) for pruning expired cache entries in RecoalInstance.
 * @default 60000
 */
export const DEFAULT_PRUNE_INTERVAL_MS = 60000;

/**
 * The default time-to-live (in milliseconds) for cached results in RecoalInstance.
 * @default 1000
 */
export const DEFAULT_TTL_MS = 1000;

/**
 * The default maximum number of concurrent in-flight requests for RecoalInstance.
 * @default Infinity
 */
export const DEFAULT_CONCURRENCY_LIMIT = Infinity;
