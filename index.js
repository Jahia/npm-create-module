#!/usr/bin/env node

// Usage: npx @jahia/create-jahia-templateset@latest module-name [namespace]

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import replace from 'replace-in-file';
import camelCase from 'camelcase';
import semver from 'semver';
import {execSync} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The first argument will be the project name.
// The second argument is optional, it will be the namespace of the module.
if (process.argv.length < 3) {
    console.error('Missing module-name parameter. Ex: npx @jahia/create-jahia-templateset@latest module-name [namespace]');
    process.exit(9);
}

const projectName = process.argv[2];
const camelProjectName = camelCase(projectName);

let yarnPackageName = 'package.tgz';

// First let's do some version checks
console.log('Node version detected:', process.versions.node);
const yarnVersion = execSync('yarn --version', {encoding: 'utf8'});
console.log('Yarn version:', yarnVersion);
if (semver.satisfies(yarnVersion, '1.x')) {
    console.log('Yarn classic detected');
    yarnPackageName = '$$$$MODULE_NAME$$$$-v1.0.0.tgz';
}

let namespace;
if (process.argv.length > 3) {
    namespace = process.argv[3];
} else {
    namespace = camelProjectName;
}

// Create a project directory with the project name.
const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, {recursive: true});

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const templateDir = path.resolve(__dirname, 'template');
fs.cpSync(templateDir, projectDir, {recursive: true});

// It is good practice to have dotfiles stored in the
// template without the dot (so they do not get picked
// up by the starter template repository). We can rename
// the dotfiles after we have copied them over to the
// new project directory.
fs.renameSync(
    path.join(projectDir, 'dotgitignore'),
    path.join(projectDir, '.gitignore')
);
fs.renameSync(
    path.join(projectDir, 'dotenv'),
    path.join(projectDir, '.env')
);

// Rename the resource file to use the project name
fs.renameSync(
    path.join(projectDir, 'resources/MODULE_NAME.properties'),
    path.join(projectDir, 'resources/' + projectName + '.properties')
);

// Rename the resource file to use the project name
fs.renameSync(
    path.join(projectDir, 'components/MODULE_NAMESPACE'),
    path.join(projectDir, 'components/' + namespace)
);

// Find and replace all markers with the appropriate substitution values
const targetFiles = [
    path.join(projectDir, 'README.md'),
    path.join(projectDir, 'import.xml'),
    path.join(projectDir, 'package.json'),
    path.join(projectDir, 'definitions.cnd'),
    path.join(projectDir, 'components/' + namespace + '/simple/simple.cnd')
];

try {
    replace.sync({
        files: targetFiles,
        from: /\$\$YARN_PACKAGE_NAME\$\$/g,
        to: yarnPackageName
    });
    replace.sync({
        files: targetFiles,
        from: /\$\$CAMEL_MODULE_NAME\$\$/g,
        to: camelProjectName
    });
    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAME\$\$/g,
        to: projectName
    });
    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAMESPACE\$\$/g,
        to: namespace
    });
} catch (error) {
    console.error('Error occurred:', error);
}

console.log('Success! Your new project is ready.');
console.log(`Created ${projectName} at ${projectDir}`);
console.log('You can now change into your project and launch "yarn" to install everything to get started.');
console.log('You can also check the documentation available here for more details: https://academy.jahia.com/get-started/developers/templating');
