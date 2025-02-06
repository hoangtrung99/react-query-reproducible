import { useDeferredValue } from "react";
import dequal from "fast-deep-equal";
import React, { useMemo } from "react";
import {
  type DefaultError,
  type QueryKey,
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useDeepCompareMemoize(dependencies: React.DependencyList) {
  const dependenciesRef = React.useRef<React.DependencyList>(dependencies);
  const signalRef = React.useRef<number>(0);

  if (!dequal(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
    signalRef.current += 1;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(() => dependenciesRef.current, [signalRef.current]);
}

/**
 * `useDeepCompareMemo` will only recompute the memoized value when one of the
 * `dependencies` has changed.
 *
 * Warning: `useDeepCompareMemo` should not be used with dependencies that
 * are all primitive values. Use `React.useMemo` instead.
 *
 * @see {@link https://react.dev/reference/react/useMemo}
 */
export function useDeepCompareMemo<T>(
  factory: () => T,
  dependencies: React.DependencyList
) {
  return React.useMemo(factory, useDeepCompareMemoize(dependencies));
}

export function useSuspenseQueryDeferred<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryKey = useDeepCompareMemo(
    () => options.queryKey,
    [options.queryKey]
  );

  const deferredQueryKey = useDeferredValue(queryKey);

  const query = useSuspenseQuery({
    ...options,
    queryKey: deferredQueryKey,
  });

  const isSuspending = queryKey !== deferredQueryKey;

  // // add property without creating a new object
  // Object.defineProperty(query, 'isSuspending', {
  //   value: queryKey !== deferredQueryKey,
  //   enumerable: true
  // })

  // return query

  return { ...query, isSuspending };
}
