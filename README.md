﻿# Watcher Plugin

To many watchers may have a negative impact for the performance of an AngularJS application. In particular
if you don't use one-time-bindings (new with AngularJS 1.3) in cobination with ng-repeat or ng-grid.
This [Protractor plugin](https://github.com/angular/protractor/blob/master/plugins/README.md) will help you, 
to keep the number of watchers used by your AngularJS application in sight. 

It simply counts all the watchers of the page which is being tested and compares it with a predefined value (maxAllowedWatchers). 
If the number of watchers exceeds the allowed limit, the test fails. You can define a general limit or limits with url patterns.

## It's BETA

Keep in mind, the Protractor Plugin API is BETA and may change without a major version bump.

## Getting Started

The plugin runs with Protractor 1.8.0 and AngularJS 1.3. Once you're familiar with that process, you may install this plugin with the node package manager:

```
npm install protractor-watcher-plugin
```

## Plugin configuration

You can enable the plugin in the protractor configuration file. The maxAllowedWatchers attribute is used as default limit.
The usage of urlPatterns is optional. If defined, the plugin will override the default limit with the limit, configured by
the url pattern.

If the plugin is used as a node module, you may use it with the *package* instead of the *path* option.

### Example configuration

```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['*-spec.js'],
  capabilities: {
    browserName: 'chrome'
  },
  plugins: [{
    path: 'path/to/the/plugin',
    maxAllowedWatchers: 15,
    urlPatterns: [{
      urlPattern: '#/mysite',
      maxAllowedWatchers: 12
    }]
  }]
}
```

### Example spec

To run the example spec do these steps:

- Start the Selenium server (webdriver-manager start)
- Start Protractor (node node_modules/protractor/bin/protractor example/example-conf.js)

If you run the example spec together with the example configuration, the test should fail and logs following message:

```
The maximum number of watchers [12] has been exceeded. Number of watchers found [13]
```
