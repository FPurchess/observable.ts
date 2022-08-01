/**
 * `debounce` creates a debounced wrapper for the given function
 * @param fn function to wrap
 * @param ms milliseconds
 * @returns debounced wrapper function
 */
export const debounce = (fn: Function, ms: number): Function => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout((): any => fn.apply(this, args), ms);
  };
};

interface PatchableArray extends Array<any> {
  __ob__?: Observable<Array<any>>;
}

const isPatchableArray = (object: any): object is PatchableArray => Array.isArray(object);

/**
 * `patchArrayWithObservable` patches the array's methods with the given observerable
 * @param arr array to patch
 * @param observable Observable to patch the array with
 * @returns
 */
const patchArrayWithObservable = (arr: PatchableArray, observable: Observable<PatchableArray>): PatchableArray => {
  if (arr.__ob__ === undefined) {
    arr.__ob__ = observable;
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((methodName) => {
      const method: Function = arr[methodName];
      arr[methodName] = (...args: any[]) => {
        const result = method.call(arr, ...args);
        observable.notify(arr);
        return result;
      };
    });
  }
  return arr;
};

/**
 * Observable is an implementation of a reactive value store.
 *
 * ```ts
 * // create the observerable with an initial value
 * const color = new Observerable("blue");
 *
 * // subscribe an observer to listen for changes of `color.value`
 * color.subscribe((newColor: string) => console.log(newColor));
 *
 * // changes to the value of color will be propagate onto all registered observers
 * color.value = "yellow";
 *
 * // OUTPUT: "yellow"
 * ```
 */
export class Observable<T> {
  protected observers: Array<(state: T) => any> = [];
  protected state: T;

  /**
   * @param state the initial state
   */
  public constructor(state: T) {
    if (isPatchableArray(state)) {
      // @ts-ignore
      this.state = patchArrayWithObservable(state, this);
    } else {
      this.state = state;
    }
  }

  public get value() {
    return this.state;
  }

  public set value(state: T) {
    if (isPatchableArray(state)) {
      // @ts-ignore
      this.state = patchArrayWithObservable(state, this);
    } else {
      this.state = state;
    }
    this.notify(state);
  }

  public notify(state: T) {
    for (const observer of this.observers) {
      observer(state);
    }
  }

  /**
   * `subscribe` an observer to value changes
   * @param observer the observer function to call upon value changes
   * @param options use with `{ immediate: true }` to call the observer with the current state immediately
   * @returns `unsubscribe` function for the given observer
   */
  public subscribe(observer: (state: T) => any, options = { immediate: false }): () => void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      if (options.immediate) {
        observer(this.value);
      }
    }
    return () => this.unsubscribe(observer);
  }

  /**
   * `unsubscribe` the given observer from the observerable
   * @param observer the observer to unsubscribe
   */
  public unsubscribe(observer: (state: T) => any) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    }
  }
}

/**
 * DebouncedObservable implements an Observerable that notifies in a debounced manner
 */
export class DebouncedObservable<T> extends Observable<T> {
  /**
   * @param state the initial state
   * @param milliseconds the milliseconds to debounce
   */
  public constructor(state: T, milliseconds: number) {
    super(state);
    this.notify = debounce(this.notify, milliseconds) as (state: T) => any;
  }
}
