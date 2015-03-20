/**
 * Plugin Tests. The testApp.html should have 36 watchers.
 * 
 */
var plugin = require('../index.js');

describe('protractor-watcher-plugin test', function () {
    
    beforeEach(function () {
        browser.driver.get('http://localhost:9000/testApp.html');
        expect(element(by.binding('friends.length')).getText()).toEqual('10');
    });
    
    afterEach(function () { 
        var name = require.resolve('../index.js');
        delete require.cache[name];
        plugin = require('../index.js');
    });
    
    it('should stop plugin execution if test is already failed', function () {
        plugin.postTest({ maxAllowedWatchers: 50 }, false).then(function (result) {
            expect(result).toBeUndefined();
        });
    });
    
    it('should use the default value for maxAllowedWatchers if no value is set in the configuration', function () {
        plugin.postTest({}, true).then(function (result) {
            expect(0).toBe(result.failedCount);
        });
    });

    it('should success if maxAllowedWatchers is lower than number of watchers', function () {
        plugin.postTest({ maxAllowedWatchers: 50 }, true).then(function (result) {
            expect(0).toBe(result.failedCount);
        });
    });
    
    it('should success if maxAllowedWatchers is equal to number of watchers', function () {
        plugin.postTest({ maxAllowedWatchers: 36 }, true).then(function (result) {
            expect(0).toBe(result.failedCount);
        });
    });
    
    it('should success if url pattern is lower than number of watchers', function () {
        var config = {
            maxAllowedWatchers: 15,
            urlPatterns: [{
                    urlPattern: '/testApp.html',
                    maxAllowedWatchers: 50
                }]
        };
        
        plugin.postTest(config, true).then(function (result) {
            expect(0).toBe(result.failedCount);
        });
    });
    
    it('should use the default value for maxAllowedWatchers if no value is set for this url pattern', function () {
        var config = {
            maxAllowedWatchers: 15,
            urlPatterns: [{
                    urlPattern: '/testApp.html'
                }]
        };
        
        plugin.postTest(config, true).then(function (result) {
            expect(0).toBe(result.failedCount);
        });
    });
    
    it('should fail if maxAllowedWatchers is exceeded', function () {
        plugin.postTest({ maxAllowedWatchers: 15 }, true).then(function (result) {
            expect(1).toBe(result.failedCount);
        });
    });
    
    it('should prompt an error message if maxAllowedWatchers is exceeded', function () {
        var message = 'The maximum number of watchers [15] has been exceeded. ' + 
            'Number of watchers found: [36] ';

        plugin.postTest({ maxAllowedWatchers: 15 }, true).then(function (result) {
            expect(message).toBe(result.assertions.errorMsg);
        });
    });

    it('should fail if url pattern exceeds number of watchers', function () {
        var config = {
            maxAllowedWatchers: 50,
            urlPatterns: [{
                    urlPattern: '/testApp.html',
                    maxAllowedWatchers: 34
                }]
        };

        plugin.postTest(config, true).then(function (result) {
            expect(1).toBe(result.failedCount);
        });
    });

});