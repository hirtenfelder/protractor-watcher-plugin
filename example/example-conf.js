﻿/**
 * Example Protractor configuration file. Note: The example should fail.
 * 
 */
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
                    urlPattern: '/protractor-demo',
                    maxAllowedWatchers: 12
                }
            ]
        }]
}