#!/usr/bin/env node

const program = require('commander');

program
    .version('1.0.0', '-v, --version')
    .command('init <dir>', '创建一个gulp简易的构建项目')
    .parse(process.argv);