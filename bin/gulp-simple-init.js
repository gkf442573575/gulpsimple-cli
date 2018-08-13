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

let app = path.resolve(dir)

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
    if (fs.existsSync(app)) fs.emptyDirSync(app)
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
    fs.readFile(`${app}/package.json`, (err, buffer) => {
        if (err) {
            console.log(chalk.red(err));
            return false;
        }
        shell.rm('-f', `${app}/.git`);
        shell.rm('-f', `${app}/README.md`);
        let packageJson = JSON.parse(buffer);
        Object.assign(packageJson, params);
        fs.writeFileSync(`${app}/package.json`, JSON.stringify(packageJson, null, 2));

        inquirer.prompt([{
            type: 'list',
            name: 'installtype',
            message: '请选择升级方式',
            choices: [{
                    name: 'Use npm',
                    value: 'npm'
                },
                {
                    name: 'Use cnpm',
                    value: 'cnpm'
                }, {
                    name: 'Use yarn',
                    value: 'yarn'
                }, {
                    name: 'Install by Myself',
                    value: 'myself'
                }
            ]
        }]).then(answers => {
            if (answers.installtype == 'myself') {
                spinner.succeed('创建完毕');
            } else {
                installProject(answers.installtype);
            }
        })

    });
}


function installProject(type) {
    shell.cd(dir);
    spinner.start('installing');
    let shellType;
    switch (type) {
        case 'npm':
            shellType = 'npm install'
            break;
        case 'cnpm':
            shellType = 'cnpm install'
            break;
        case 'yarn':
            shellType = 'yarn'
            break;
        default:
            shellType = 'npm install'
            break;
    }
    shell.exec(shellType, () => {
        spinner.succeed('创建完毕');
    })
}