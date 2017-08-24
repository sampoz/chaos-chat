

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser();

parser.addArgument(['-b', '--buildtype'], {
    required: true,
    choices: ['dev', 'prod']
});

const args = parser.parseArgs();

process.env.NODE_ENV = args.buildtype === 'prod' ? 'production' : 'development';

module.exports = args;