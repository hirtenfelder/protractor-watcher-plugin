'use strict';
var q = require('q');

/**
 * This plugin for Protractor will help you, to keep the number of watchers used by your AngularJS application 
 * in sight.
 *
 * It simply counts all the watchers of the page which is being tested and compares it with a predefined value 
 * (maxAllowedWatchers). If the number of watchers exceeds the allowed limit, the test fails. You can define a 
 * general limit or limits with url patterns.
 *
 * Plugin Configuration:
 * 
 * The plugin has to be added to the protractor configuration file.
 * 
 * plugins: [{
 *   path: "path/to/the/plugin",
 *   maxAllowedWatchers: 15,
 *     urlPatterns: [{
 *       urlPattern: "#/mysite",
 *       maxAllowedWatchers: 12
 *     }]
 *   }]
 */

var assertions = [];
var testResult = {
    failedCount: 0, 
    specResults: [{
            description: 'Protractor Watcher Line Plugin',
            assertions: assertions,
            duration: 1
        }]
};

/**
 * Called after each test block (in Jasmine, this means an `it` block) completes.
 *
 * @param {Object} Configuration object with general maxAllowedWatchers and url patterns
 * @param {boolean} passed True if the test passed.
 *
 * @return Object Returns a promise with the test result which will be merged with the Protractor result object.
 */
function postTest(config, passed) {
    var deffered = q.defer();
    if (!passed) {
        deffered.resolve();
    }
    
    browser.driver.getCurrentUrl().then(function (url) {
        return getMaxAllowedWatchers(config, url);
    }).then(function (maxAllowedWatchers) {
        browser.driver.executeScript(countNumberOfWatchers).then(function (numberOfWatchers) {
            checkMaxAllowedWatchers(numberOfWatchers, maxAllowedWatchers);
            deffered.resolve(testResult);
        }, function (error) {
            deffered.reject(new Error(error));
        });
    });
    
    return deffered.promise;
}

/**
 * Reads the plugin configuration and returns the maximum allowed number of watchers for the page which is being tested.
 * If more than one pattern is valid, it will return the last matched in the configuration object.
 * 
 * @param {Object} config Configuration object with general maxAllowedWatchers and url patterns
 * @param {string} url The url of the page which is being tested
 */
function getMaxAllowedWatchers(config, url) {
    var defferedUrl = q.defer();
    var maxAllowedWatchers = config.maxAllowedWatchers;
    if (config.urlPatterns) {
        config.urlPatterns.forEach(function (conf) {
            if (url.match(conf.urlPattern)) {
                maxAllowedWatchers = conf.maxAllowedWatchers;
            }
        });
    }
    defferedUrl.resolve(maxAllowedWatchers);
    return defferedUrl.promise;
}

/**
 * Checks if the number of watchers has been exceeded the maxium configured in the plugin configuration
 * 
 * @param {number} numberOfWatchers
 * @param {number} maxAllowedWatchers
 */
function checkMaxAllowedWatchers(numberOfWatchers, maxAllowedWatchers) {
    if (maxAllowedWatchers < numberOfWatchers) {
        testResult.failedCount++;
        assertions.push({
            passed: false,
            errorMsg: 'The maximum number of watchers [' + maxAllowedWatchers + '] has been exceeded. ' + 
                      'Number of watchers found: [' + numberOfWatchers + '] ',
            stackTrace: ''
        });
    }
}

/**
 * Function that is used to find out the number of watchers.
 * 
 * @returns {number} Returns the number of watchers of the page which is being tested
 */
function countNumberOfWatchers() {
    var root = angular.element(document.getElementsByTagName('html'));
    var watchers = [];
    
    var f = function (element) {
        angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
            if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
                    watchers.push(watcher);
                });
            }
        });
        
        angular.forEach(element.children(), function (childElement) {
            f(angular.element(childElement));
        });
    };
    
    f(root);
    
    var watchersWithoutDuplicates = [];
    angular.forEach(watchers, function (item) {
        if (watchersWithoutDuplicates.indexOf(item) < 0) {
            watchersWithoutDuplicates.push(item);
        }
    });
    
    return watchersWithoutDuplicates.length;
}

exports.postTest = postTest;