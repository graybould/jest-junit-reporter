const Testsuites = require('./src/Testsuites');
const Failure = require('./src/Failure');
const xml = require('xml');
const fs = require('fs');
const path = require('path');


module.exports = (results) => {

    const data =
        {
            numFailedTestSuites: results.numFailedTestSuites,
            numFailedTests: results.numFailedTests,
            numPassedTestSuites: results.numPassedTestSuites,
            numPassedTests: results.numPassedTests,
            numPendingTestSuites: results.numPendingTestSuites,
            numPendingTests: results.numPendingTests,
            numRuntimeErrorTestSuites: results.numRuntimeErrorTestSuites,
            numTotalTestSuites: results.numTotalTestSuites,
            numTotalTests: results.numTotalTests,
            startTime: results.startTime,
            success: results.success,
            testResults: []
        };

    data.testResults =
        results.testResults.map((testSuite)=>{
            return {
                filePath : testSuite.testFilePath,
                fileName : testSuite.testFilePath.substring(testSuite.testFilePath.lastIndexOf("\\") + 1),
                fileDirectory : testSuite.testFilePath.substring(testSuite.testFilePath.indexOf("integration")+12,testSuite.testFilePath.lastIndexOf("\\")),
                passed : testSuite.numPassedTests,
                failed : testSuite.numFailingTests,
                time : (testSuite.perfStats.end - testSuite.perfStats.start) / 1000,
                timeStamp : new Date(testSuite.perfStats.start).toISOString().slice(0, -5),
                testCases : testSuite.testResults.map((testCase)=>{

                    return {
                        sequenceNumber: testSuite.testResults.indexOf(testCase),
                        ancestors: testCase.ancestorTitles,
                        failureMessages : testCase.failureMessages.map(message => new Failure(message)),
                        fullName : testCase.fullName,
                        status : testCase.status,
                        testCase : testCase.title
                    };
                })
            };
        });

    const out = process.env.TEST_REPORT_PATH || process.cwd();
    const filename = process.env.TEST_REPORT_FILENAME || 'test-report.json';

    fs.writeFileSync(path.join(out, filename), JSON.stringify(data, null,"\t"));

    return results;
};
