#!/usr/bin/env node
var GitFreshness = require('../lib/GitFreshness')
var Formatters = require('../lib/Formatter')

var argv = require('yargs')
           .usage('Usage: $0 [path_to_repo] [options]')
           .example('$0 -f json', 'Process the current directory and output as json')
           .example('$0 /path/to/repo', 'Process the repo at the given path and output as text')
           .alias('f', 'format')
           .default('f', 'text')
           .describe('f', 'the output format to use, valid options are "text" and "json"')
           .argv


var pathToProcess = argv._[0] || process.cwd()
var formatter

if (argv.format === "json") {
  formatter = Formatters.JSONFormatter
} else if (argv.format === "text") {
  formatter = Formatters.StringFormatter
}
var freshner = new GitFreshness(pathToProcess)
freshner.run(function(err, data) {
  console.log(err)
  if (err) throw err
  console.log(new formatter(data).format())
})
