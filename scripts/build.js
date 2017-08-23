'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

build().then(({ warnings }) => {
    if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
            '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
            'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
    } else {
        console.log(chalk.green('Compiled successfully.\n'));
    }
});

function build() {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    
    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
            const messages = formatWebpackMessages(stats.toJson({}, true));
            if (messages.errors.length) {
                return reject(new Error(messages.errors.join('\n\n')));
            }
            if (process.env.CI && messages.warnings.length) {
                console.log(
                    chalk.yellow(
                        '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
                    )
                );
                return reject(new Error(messages.warnings.join('\n\n')));
            }
            return resolve({
                warnings: messages.warnings,
            });
        });
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml,
    });
}