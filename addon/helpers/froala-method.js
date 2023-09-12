import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { get } from '@ember/object';

export function froalaMethod(methodName, helperHash = {}, ...helperParams) {
  assert(
    '{{froala-method}} helper needs a string method path as the first argument',
    typeof methodName === 'string' && methodName.length > 0,
  );

  // Create a closure to pass back as the "action" to be triggered
  return function froalaMethodClosure(...closureParams) {
    // Editor might be passed in as the first arg if also wrapped with {{froala-arg}}
    let editor =
      typeof closureParams[0] === 'object' && closureParams[0].component
        ? closureParams[0]
        : this;

    assert(
      '{{froala-method}} helper cannot determine the editor instance',
      typeof editor === 'object' && editor.component,
    );

    // Get the actual method using ember.get() so that nested paths work here
    let method = get(editor, methodName);

    assert(
      '{{froala-method}} helper needs a valid method path as the first argument',
      typeof method === 'function',
    );

    // Copy helperParams to pass into the method
    let methodParams = [...helperParams];

    // The helper hash can be used to "replace" the param
    // values with params received from the event...
    for (let propName in helperHash) {
      // Determine the positions within each params arrays
      // which should be used for replacing. parseInt() in
      // case the value is a string integer, ex: "2".
      let helperPos = helperParams.indexOf(propName);
      let eventPos = parseInt(helperHash[propName]);

      // If the parameter "name" was found in the helperParams,
      // and the relative arguments contains something at that position,
      // then go ahead and replace the param value...
      if (helperPos !== -1 && closureParams.length >= eventPos) {
        methodParams[helperPos] = closureParams[eventPos - 1];
      }
    }

    // Trigger the Froala Editor method
    return method(...methodParams);
  };
}

export default helper(([methodName, ...partial], hash) =>
  froalaMethod(methodName, hash, ...partial),
);
