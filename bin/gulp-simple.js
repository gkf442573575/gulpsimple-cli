#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs-extra');
const cliPath = path.resolve(__dirname, '..');
let packageJson = JSON.parse(fs.readFileSync(`${cliPath}/package.json`));
let version = packageJson.version;


program
    .version(version, '-v, --version')
    .command('init <dir>', '创建一个gulp简易的构建项目')
    .parse(process.argv);