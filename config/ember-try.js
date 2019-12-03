'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = async function() {
  return {
    scenarios: [
      {
        name: 'ember-2.18',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~2.18.0'
          }
        }
      },
      {
        name: 'ember-3.0',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.0.0'
          }
        }
      },
      {
        name: 'ember-3.1',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.1.0'
          }
        }
      },
      {
        name: 'ember-3.2',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.2.0'
          }
        }
      },
      {
        name: 'ember-3.3',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.3.0'
          }
        }
      },
      {
        name: 'ember-3.4',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.4.0'
          }
        }
      },
      {
        name: 'ember-3.5',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.5.0'
          }
        }
      },
      {
        name: 'ember-3.6',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-source': '~3.6.0'
          }
        }
      },
      {
        name: 'ember-3.7',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-modifier-manager-polyfill': '^1.2.0',
            'ember-source': '~3.7.0'
          }
        }
      },
      {
        name: 'ember-3.8',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-source': '~3.8.0'
          }
        }
      },
      {
        name: 'ember-3.9',
        npm: {
          devDependencies: {
            'ember-angle-bracket-invocation-polyfill': '^2.0.2',
            'ember-decorators-polyfill': '^1.1.1',
            'ember-source': '~3.9.0'
          }
        }
      },
      {
        name: 'ember-3.10',
        npm: {
          devDependencies: {
            'ember-source': '~3.10.0'
          }
        }
      },
      {
        name: 'ember-3.11',
        npm: {
          devDependencies: {
            'ember-source': '~3.11.0'
          }
        }
      },
      {
        name: 'ember-3.12',
        npm: {
          devDependencies: {
            'ember-source': '~3.12.0'
          }
        }
      },
      {
        name: 'ember-3.13',
        npm: {
          devDependencies: {
            'ember-source': '~3.13.0'
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary')
          }
        }
      },
      // The default `.travis.yml` runs this scenario via `npm test`,
      // not via `ember try`. It's still included here so that running
      // `ember try:each` manually or from a customized CI config will run it
      // along with all the other scenarios.
      {
        name: 'ember-default',
        npm: {
          devDependencies: {}
        }
      }
    ]
  };
};
