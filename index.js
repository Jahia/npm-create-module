#!/usr/bin/env node

// Usage: npx @jahia/create-jahia-templateset@latest module-name namespace

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import replace from 'replace-in-file';
import camelCase from 'camelcase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The first argument will be the project name.
// The second argument is optional, it will be the namespace of the module.
if (process.argv.length < 3) {
    console.error('Missing module-name parameter. Ex: npx @jahia/create-jahia-templateset@latest module-name namespace');
    process.exit(9);
}

const projectName = process.argv[2];
const camelProjectName = camelCase(projectName);

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

// rename the resource file to use the project name
fs.renameSync(
    path.join(projectDir, 'resources/MODULE_NAME.properties'),
    path.join(projectDir, 'resources/' + projectName + '.properties')
);

// rename the resource file to use the project name
fs.renameSync(
    path.join(projectDir, 'components/MODULE_NAMESPACE'),
    path.join(projectDir, 'components/' + namespace)
);

// find and replace all the $$MODULE_NAME$$, $$CAMEL_MODULE_NAME$$ and $$MODULE_NAMESPACE$$  markers with the appropriate project name
const targetFiles = [
    path.join(projectDir, 'README.md'),
    path.join(projectDir, 'import.xml'),
    path.join(projectDir, 'package.json'),
    path.join(projectDir, 'definitions.cnd'),
    path.join(projectDir, 'components/' + namespace + "/simple/simple.cnd")
];

try {
    replace.sync({
        files: targetFiles,
        from: /\$\$CAMEL_MODULE_NAME\$\$/g,
        to: camelProjectName,
    });
    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAME\$\$/g,
        to: projectName,
    });
    replace.sync({
        files: targetFiles,
        from: /\$\$MODULE_NAMESPACE\$\$/g,
        to: namespace,
    });
} catch (error) {
    console.error('Error occurred:', error);
}

console.log('Success! Your new project is ready.');
console.log(`Created ${projectName} at ${projectDir}`);
console.log('You can now change into your project and launch "yarn" to install everything to get started.');
console.log('You can also check the documentation available here for more details: https://academy.jahia.com/get-started/developers/templating');
