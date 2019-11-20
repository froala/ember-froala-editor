import { helper } from '@ember/component/helper';
import { assign } from '@ember/polyfills';

export function mergedHash(...objects) {
  // Assumes all params are objects
  return assign({}, ...objects);
}

export default helper((params, hash) => mergedHash(...params, hash));
