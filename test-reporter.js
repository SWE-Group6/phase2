// custom-test-reporter.js
class CustomTestReporter {
  onRunComplete(_, results) {
    const total = results.numTotalTests;
    const passed = results.numPassedTests;

    // Look into the coverage/coverage-summary.json file
    const coverageSummaryJson = require('./coverage/coverage-summary.json');

    // Initialize variables to hold the total and covered functions for .ts files
    let totalFunctions = 0;
    let coveredFunctions = 0;

    // Loop through the keys in the coverage summary
    for (const file in coverageSummaryJson) {
      // Only include .ts files
      if (file.endsWith('.ts')) {
        const fileCoverage = coverageSummaryJson[file];
        
        // Add the total and covered functions to the running sums
        if (fileCoverage.functions) {
          totalFunctions += fileCoverage.functions.total;
          coveredFunctions += fileCoverage.functions.covered;
        }
      }
    }

    // Calculate the function coverage percentage
    const functionCoveragePercentage = totalFunctions === 0
      ? 0
      : parseFloat(((coveredFunctions / totalFunctions) * 100).toFixed(2));

    // Output the test results and coverage
    console.log(`Total: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Function Coverage: ${functionCoveragePercentage}%`);
    console.log(`${passed}/${total} test cases passed. ${functionCoveragePercentage}% function coverage achieved.`);
  }
}

module.exports = CustomTestReporter;
