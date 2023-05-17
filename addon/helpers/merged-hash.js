import { helper } from '@ember/component/helper';

export function mergedHash(...objects) {
  // Assumes all params are objects
  return Object.assign({}, ...objects);
}

export default helper((params, hash) => mergedHash(...params, hash));
