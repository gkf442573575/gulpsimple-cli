#!/usr/bin/env node

const shell = require('shelljs');
const program = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spinner = ora();


program.parse(process.argv);

let dir = program.args[0];

let app = path.join(__dirname, `../${dir}`)

const questions = [{
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
    default: dir,
    validate: (name) => {
        if (/^[a-z]+/.test(name)) {
            return true;
        } else {
            return '项目名称必须以小写字母开头';
        }
    }
}, {
    type: 'input',
    name: 'description',
    message: '请输入项目简介',
}]

inquirer.prompt(questions).then((answers) => {
    //初始化模板文件
    downloadTemplate(answers);
})

function downloadTemplate(params) {
    spinner.start('downloading');
    if (fs.existsSync(dir)) fs.emptyDirSync(dir)
    // 开始下载模板文件
    download('gkf442573575/gulpsimple', app, function(err) {
        spinner.stop();
        if (err) {
            console.log(chalk.red(err));
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
    let DIR_PATH = path.resolve(dir);
    fs.readFile(`${DIR_PATH}/package.json`, (err, buffer) => {
        if (err) {
            console.log(chalk.red(err));
            return false;
        }
        shell.rm('-f', `${DIR_PATH}/.git`);
        shell.rm('-f', `${DIR_PATH}/README.md`);
        let packageJson = JSON.parse(buffer);
        Object.assign(packageJson, params);
        fs.writeFileSync(`${DIR_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
        spinner.succeed('创建完毕');
    });
}