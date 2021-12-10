window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    {
      handler: 'silence',
      matchMessage:
        'Use of `assign` has been deprecated. Please use `Object.assign` or the spread operator instead.',
    },
  ],
};
