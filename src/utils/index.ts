const hasOwn = {}.hasOwnProperty;

export const classNames = (...args: any[]): string => {
  const classes = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) continue

    const argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      const inner: string = classNames.apply(null, arg)
      if (inner) classes.push(inner)
    } else if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(arg.toString())
      } else {
        for (const key in arg) {
          if (hasOwn.call(arg, key) && arg[key])
            classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

export const isFunction = (a: any): a is Function => {
  return typeof a === 'function'
}

export function fillRef<T>(ref: React.Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node)
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as any).current = node
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
}

export const isClient =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement;

/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && isClient;

let uuid = 0;
/** Get unique id for accessibility usage */
export function getUUID(): number | string {
  let retId: string | number;

  // Test never reach
  /* istanbul ignore if */
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }

  return retId;
}
