/**
 * Simple test runner that starts the selenium server and an http-server before running the tests.
 * 
 */
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}

process.on('exit', function () {
    webdriver.kill();
    webserver.kill();
});

var webdriver = exec("node node_modules/protractor/bin/webdriver-manager start", puts);
var webserver = exec("node node_modules/http-server/bin/http-server spec/ -p 9000", puts);
var protractor = exec("node node_modules/protractor/bin/protractor spec/test-conf.js", function (error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
    console.log(stdout);
    console.log(stderr);
    process.exit();
});
