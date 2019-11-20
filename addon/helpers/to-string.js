import { helper } from '@ember/component/helper';

export function toString(context, ...partial) {

  // @update={{to-string (fn (mut this.content))}}
  if (typeof context === 'function') {
    return function toStringClosure(content, ...args) {
      let contentString = (
        content && typeof content.toString === 'function' ?
        content.toString() :
        content
      );
      return context(contentString, ...partial, ...args);
    };

  // {{to-string this.content}}
  } else {
    return (
      context && typeof context.toString === 'function' ?
      context.toString() :
      context
    );
  }

}

export default helper(([context, ...partial]) => toString(context, ...partial));
