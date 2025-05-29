import * as stringify from 'json-stable-stringify';
import { DEFAULT_PRUNE_INTERVAL_MS, DEFAULT_TTL_MS } from './default';

type CacheEntry<T> = {
	/** The cached result value. */
	result: T;
	/** The timestamp (ms) when the result was cached. */
	timestamp: number;
};

/**
 * RecoalInstance - Request Coalescing and Caching Class
 *
 * Provides request coalescing and caching for async functions. Deduplicates concurrent requests for the same function and arguments, caches results for a configurable TTL, and periodically prunes expired cache entries.
 *
 * Usage:
 *
 *   import { RecoalInstance } from 'recoal';
 *   const coalescer = new RecoalInstance();
 *   const result = await coalescer.fetch(myAsyncFn, arg1, arg2);
 *   const isActive = coalescer.isCoalesced(myAsyncFn, arg1, arg2);
 *
 * @class RecoalInstance
 * @constructor
 * @param {number} [intervalMs=DEFAULT_PRUNE_INTERVAL_MS] - Interval (ms) for pruning expired cache entries.
 * @param {number} [ttlMs=DEFAULT_TTL_MS] - Time-to-live (ms) for cached results.
 * @param {Console} [consoler=console] - Optional custom console for logging.
 */
export class RecoalInstance {
	private _pruneIntervalMs: number = 0;
	private _interval: NodeJS.Timeout | null = null;
	private _resultCache: Map<string, CacheEntry<unknown>> = new Map();
	private _inFlightRequests: Map<string, Promise<unknown>> = new Map();
	private _console: Console;
	private _ttlMs: number = 0;

	/**
	 * Create a new RecoalInstance.
	 * @param intervalMs Interval (ms) for pruning expired cache entries.
	 * @param ttlMs Time-to-live (ms) for cached results.
	 * @param consoler Optional custom console for logging.
	 */
	constructor(
		intervalMs: number = DEFAULT_PRUNE_INTERVAL_MS,
		ttlMs: number = DEFAULT_TTL_MS,
		consoler: Console = console,
	) {
		this._console = consoler;
		this._pruneIntervalMs = intervalMs;
		this._ttlMs = ttlMs;
	}

	/**
	 * Coalesces concurrent or repeated calls for the same function and arguments.
	 * If an in-flight promise exists, returns it.
	 * If a cached result exists within TTL, returns it.
	 * Otherwise, calls the function, caches the result, and returns it.
	 *
	 * @template T
	 * @template Args
	 * @param fn The async function to call.
	 * @param args Arguments to pass to the function.
	 * @returns The result of the function, possibly from cache or in-flight request.
	 */
	public async coalesce<T, Args extends unknown[]>(
		fn: (...args: Args) => Promise<T>,
		...args: Args
	): Promise<T> {
		const functionName = fn.name || 'anonymous';
		const key = this._createKey(functionName, ...args);

		if (!this._interval) this._interval = setInterval(this._pruneCaches, this._pruneIntervalMs);

		const now = Date.now();

		// 1. If in-flight, return existing promise
		if (this._inFlightRequests.has(key)) {
			this._console.trace(`[requestCoalescing] Reusing in-flight request for key: ${key}`);
			return this._inFlightRequests.get(key) as Promise<T>;
		}

		// 2. If cached result within TTL, return it
		const cacheEntry = this._resultCache.get(key) as CacheEntry<T> | undefined;
		if (cacheEntry && now - cacheEntry.timestamp <= this._ttlMs) {
			this._console.trace(`[requestCoalescing] Returning cached result for key within TTL: ${key}`);
			return Promise.resolve(cacheEntry.result);
		}

		// 3. Otherwise, start a new request
		const promise = (async () => {
			try {
				const result = await fn(...args);
				this._resultCache.set(key, { result, timestamp: Date.now() });
				setTimeout(() => {
					const entry = this._resultCache.get(key);
					if (entry && Date.now() - entry.timestamp >= this._ttlMs) {
						this._resultCache.delete(key);
						this._console.trace(`[requestCoalescing] Cleared cached result for key: ${key}`);
					}
				}, this._ttlMs);
				return result;
			} catch (err) {
				this._console.error(`[requestCoalescing] Error processing request for key: ${key}`, err);
				throw err;
			} finally {
				this._inFlightRequests.delete(key);
				this._console.trace(`[requestCoalescing] Cleared in-flight request for key: ${key}`);
			}
		})();

		this._inFlightRequests.set(key, promise);
		this._console.trace(`[requestCoalescing] Created new in-flight request for key: ${key}`);
		return promise;
	}

	/**
	 * Checks if a request for the given function and arguments is either in-flight or cached (within TTL).
	 *
	 * @template Args
	 * @param fn The async function to check.
	 * @param args Arguments to check.
	 * @returns True if a request is in-flight or cached; otherwise, false.
	 */
	public isCoalesced<Args extends unknown[]>(
		fn: (...args: Args) => Promise<unknown>,
		...args: Args
	): boolean {
		const functionName = fn.name || 'anonymous';
		const key = this._createKey(functionName, ...args);
		const now = Date.now();
		if (this._inFlightRequests.has(key)) {
			return true;
		}
		const entry = this._resultCache.get(key);
		return !!entry && now - entry.timestamp <= this._ttlMs;
	}

	/**
	 * Generates a unique cache key based on function name and arguments.
	 * @param functionName The name of the function.
	 * @param args Arguments to the function.
	 * @returns A string key.
	 * @private
	 */
	private _createKey(functionName: string, ...args: unknown[]): string {
		return `${functionName}|${stringify(args)}`;
	}

	/**
	 * Periodically prunes expired cache entries.
	 * @private
	 */
	private _pruneCaches(): void {
		const now = Date.now();
		// Prune result cache
		for (const [key, { timestamp }] of this._resultCache.entries()) {
			if (now - timestamp > this._ttlMs) {
				this._resultCache.delete(key);
			}
		}
		// Note: in-flight entries are cleaned up on resolution
		this._console.trace('[requestCoalescing] Pruned caches');
	}
}
