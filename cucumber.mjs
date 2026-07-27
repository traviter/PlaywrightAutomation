export default {
    paths: [
        "tests/cucumber/features/**/*.feature"
    ],
    import: [
        "tests/cucumber/steps/**/*.js",
        "tests/cucumber/hooks/**/*.js",
        "tests/cucumber/support/**/*.js"
    ],
    format: [
        "progress",
        "html:reports/cucumber-report.html"
    ],
    publishQuiet: true
};