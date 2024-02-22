#!/usr/bin/env node

// Usage: npx @jahia/create-jahia-templateset@latest module-name [namespace]

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import replace from 'replace-in-file';
import camelCase from 'camelcase';
import {execSync} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The first argument will be the project name.
// The second argument will be the project type (handlebars or jsx)
// The third argument is optional, it will be the namespace of the module.
if (process.argv.length < 3) {
    console.error('Missing module-name parameter. Ex: npx @jahia/create-jahia-templateset@latest module-name module-type [namespace]');
    process.exit(9);
}

const projectName = process.argv[2];
const camelProjectName = camelCase(projectName);

// First let's do some version checks
console.log('Node version detected:', process.versions.node);
const yarnVersion = execSync('yarn --version', {encoding: 'utf8'});
console.log('Yarn version:', yarnVersion);

let projectType;
if (process.argv[3] === 'handlebars' || process.argv[3] === 'jsx') {
    projectType = process.argv[3];
} else {
    console.error(`Invalid module-type parameter, should be handlebars or jsx, got:${process.argv[3]}. Ex: npx @jahia/create-jahia-templateset@latest module-name module-type [namespace]`);
    process.exit(9);
}

let namespace;
if (process.argv.length > 4) {
    namespace = process.argv[4];
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
const templateDir = path.resolve(__dirname, projectType);
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
    path.join(projectDir, 'dotnpmignore'),
    path.join(projectDir, '.npmignore')
);
fs.renameSync(
    path.join(projectDir, 'dotenv'),
    path.join(projectDir, '.env')
);
fs.renameSync(
    path.join(projectDir, 'doteslintrc.cjs'),
    path.join(projectDir, '.eslintrc.cjs')
);

// Rename the resource file to use the project name
fs.renameSync(
    path.join(projectDir, 'resources/MODULE_NAME.properties'),
    path.join(projectDir, 'resources/' + projectName + '.properties')
);

fs.renameSync(
    path.join(projectDir, 'resources/MODULE_NAME_fr.properties'),
    path.join(projectDir, 'resources/' + projectName + '_fr.properties')
);

// Rename the resource file to use the project name
if (process.argv[3] === 'handlebars') {
    fs.renameSync(
        path.join(projectDir, 'components/MODULE_NAMESPACE'),
        path.join(projectDir, 'components/' + namespace)
    );
}

// Create empty directories for static resources and configurations
fs.mkdirSync(path.join(projectDir, 'css'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'images'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'javascript'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'settings/configurations'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'settings/jahia-content-editor-forms'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'settings/jahia-content-editor-forms/forms'), {recursive: true});
fs.mkdirSync(path.join(projectDir, 'settings/jahia-content-editor-forms/fieldsets'), {recursive: true});

// Find and replace all markers with the appropriate substitution values
const targetFiles = [
    path.join(projectDir, 'README.md'),
    path.join(projectDir, 'import.xml'),
    path.join(projectDir, 'package.json'),
    path.join(projectDir, 'definitions.cnd'),
    path.join(projectDir, 'resources/' + projectName + '.properties'),
    path.join(projectDir, 'resources/' + projectName + '_fr.properties'),
    path.join(projectDir, projectType === 'handlebars' ? 'components/' + namespace + '/hello/hello.cnd' : 'src/server/views/hello/HelloDefault.jsx')
];

if (projectType === 'jsx') {
    targetFiles.push(path.join(projectDir, 'src/server/templates/page/PageHome.jsx'));
    targetFiles.push(path.join(projectDir, 'src/server/views/hello/HelloDefault.jsx'));
}

try {
    replace.sync({
        files: targetFiles,
        from: /\$\$CAMEL_MODULE_NAME\$\$/g,
        to: camelProjectName,
        disableGlobs: true // This is required otherwise the replaces fail under Windows (see https://jira.jahia.org/browse/BACKLOG-21353)
    });

    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAME\$\$/g,
        to: projectName,
        disableGlobs: true // This is required otherwise the replaces fail under Windows (see https://jira.jahia.org/browse/BACKLOG-21353)
    });

    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAMESPACE\$\$/g,
        to: namespace,
        disableGlobs: true // This is required otherwise the replaces fail under Windows (see https://jira.jahia.org/browse/BACKLOG-21353)
    });
} catch (error) {
    console.error('Error occurred:', error);
}

console.log(`Created ${projectName} at ${projectDir}`);
console.log('Success! Your new project is ready.');
console.log('You can now change into your project and launch "yarn" to install everything to get started.');
console.log('---');
console.log('Available project scripts will then be :');
console.log('  - yarn build : build the project');
console.log('  - yarn deploy : deploy the project. Make sure you have updated the .env file to match your setup if needed.');
console.log('  - yarn watch : will build and watch for file modifications, and deploy automatically when changes are detected. Use CTRL+C to stop watching.');
console.log('  - yarn lint : use to check that your code follows the recommended syntax guidelines. Append --fix to automatically fix most problems.');
console.log('  - yarn test : to test your project. By default only performs yarn lint but you are encouraged to add your own testing system here.');
console.log('---');
console.log('You can also check the documentation available here for more details: https://academy.jahia.com/get-started/developers/templating');
