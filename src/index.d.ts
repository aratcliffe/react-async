import * as React from "react"

export type AsyncChildren<T> = ((state: AsyncState<T>) => React.ReactNode) | React.ReactNode
export type PromiseFn<T> = (props: object, controller: AbortController) => Promise<T>
export type DeferFn<T> = (args: any[], props: object, controller: AbortController) => Promise<T>

export interface AsyncOptions<T> {
  promise?: Promise<T>
  promiseFn?: PromiseFn<T>
  deferFn?: DeferFn<T>
  watch?: any
  watchFn?: (props: object, prevProps: object) => any
  initialValue?: T
  onResolve?: (data: T) => void
  onReject?: (error: Error) => void
  debugLabel?: string
  [prop: string]: any
}

export interface AsyncProps<T> extends AsyncOptions<T> {
  children?: AsyncChildren<T>
}

interface AbstractState<T> {
  initialValue?: T | Error
  counter: number
  cancel: () => void
  run: (...args: any[]) => Promise<T>
  reload: () => void
  setData: (data: T, callback?: () => void) => T
  setError: (error: Error, callback?: () => void) => Error
}

export type AsyncInitial<T> = AbstractState<T> & {
  initialValue?: undefined
  data: undefined
  error: undefined
  value: undefined
  startedAt: undefined
  finishedAt: undefined
  status: "initial"
  isInitial: false
  isPending: false
  isLoading: false
  isFulfilled: false
  isResolved: false
  isRejected: false
  isSettled: false
}
export type AsyncPending<T> = AbstractState<T> & {
  data: T | undefined
  error: Error | undefined
  value: T | Error | undefined
  startedAt: Date
  finishedAt: undefined
  status: "pending"
  isInitial: false
  isPending: true
  isLoading: true
  isFulfilled: false
  isResolved: false
  isRejected: false
  isSettled: false
}
export type AsyncFulfilled<T> = AbstractState<T> & {
  data: T
  error: undefined
  value: T
  startedAt: Date
  finishedAt: Date
  status: "fulfilled"
  isInitial: false
  isPending: false
  isLoading: false
  isFulfilled: true
  isResolved: true
  isRejected: false
  isSettled: true
}
export type AsyncRejected<T> = AbstractState<T> & {
  data: T | undefined
  error: Error
  value: Error
  startedAt: Date
  finishedAt: Date
  status: "rejected"
  isInitial: false
  isPending: false
  isLoading: false
  isFulfilled: false
  isResolved: false
  isRejected: true
  isSettled: true
}
export type AsyncState<T> = AsyncInitial<T> | AsyncPending<T> | AsyncFulfilled<T> | AsyncRejected<T>

declare class Async<T> extends React.Component<AsyncProps<T>, AsyncState<T>> {}

declare namespace Async {
  export function Initial<T>(props: {
    children?: AsyncChildren<T>
    persist?: boolean
  }): React.ReactNode
  export function Pending<T>(props: {
    children?: AsyncChildren<T>
    initial?: boolean
  }): React.ReactNode
  export function Loading<T>(props: {
    children?: AsyncChildren<T>
    initial?: boolean
  }): React.ReactNode
  export function Fulfilled<T>(props: {
    children?: AsyncChildren<T>
    persist?: boolean
  }): React.ReactNode
  export function Resolved<T>(props: {
    children?: AsyncChildren<T>
    persist?: boolean
  }): React.ReactNode
  export function Rejected<T>(props: {
    children?: AsyncChildren<T>
    persist?: boolean
  }): React.ReactNode
  export function Settled<T>(props: {
    children?: AsyncChildren<T>
    persist?: boolean
  }): React.ReactNode
}

declare function createInstance<T>(defaultProps?: AsyncProps<T>): Async<T>

export function useAsync<T>(
  arg1: AsyncOptions<T> | PromiseFn<T>,
  arg2?: AsyncOptions<T>
): AsyncState<T>

export interface FetchOptions<T> extends AsyncOptions<T> {
  defer?: boolean
  json?: boolean
}

export function useFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  options?: FetchOptions<T>
): AsyncState<T>

export default createInstance
