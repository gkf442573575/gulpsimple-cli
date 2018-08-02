#!/usr/bin/env node

const shell = require('shelljs');
const program = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const spinner = ora();

program.parse(process.argv);

let dir = program.args[0];

let DIR_PATH = path.resolve(dir);

const questions = [{
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
    default: 'gulp-simple',
    validate: (name) => {
        if (/^[a-z]+/.test(name)) {
            return true;
        } else {
            return '项目名称必须以小写字母开头';
        }
    }
}]

inquirer.prompt(questions).then((answers) => {
    //初始化模板文件
    downloadTemplate(answers);
})

function downloadTemplate(params) {
    spinner.start('loading');
    let isHasDir = fs.existsSync(DIR_PATH);
    if (isHasDir) {
        spinner.fail('当前目录已存在!');
        return false;
    }
    // 开始下载模板文件
    download('https://github.com/gkf442573575/gulpsimple.git', dir, {
        clone: true
    }, function(err) {
        if (err) {
            spinner.fail(err);
            return;
        };
        updateTemplateFile(params);
    })
}

function updateTemplateFile(params) {
    let {
        name,
        description
    } = params;

    fs.readFile(`${DIR_PATH}/package.json`, (err, buffer) => {
        if (err) {
            console.log(colors.red(err));
            return false;
        }
        shell.rm('-f', `${DIR_PATH}/.git`);
        let packageJson = JSON.parse(buffer);
        Object.assign(packageJson, params);
        fs.writeFileSync(`${DIR_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
        spinner.succeed('创建完毕');
    });
}