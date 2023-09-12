import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

export function froalaArg(callback, ...partial) {
  assert(
    '{{froala-arg}} helper requires a function as the first parameter',
    typeof callback === 'function',
  );
  let wrapper = function froalaArgClosure(...args) {
    return callback(this, ...partial, ...args);
  };
  assert(
    '{{froala-arg}} helper should not be call twice on the same callback',
    wrapper.toString() !== callback.toString(),
  );
  return wrapper;
}

export default helper(([callback, ...partial]) =>
  froalaArg(callback, ...partial),
);
