const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

module.exports = env => {
    // Config for jahia's client-side components (HydrateInBrowser or RenderInBrowser), can be removed if no client side components
    // More info here : https://academy.jahia.com/documentation/jahia/jahia-8/developer/javascript-module-development/client-side-javascript
    const config = {
        entry: {
            main: path.resolve(__dirname, 'src/index')
        },
        output: {
            path: path.resolve(__dirname, 'dist')
        },
        externals: {
            '@jahia/js-server-core': 'jsServerCoreLibraryBuilder.getLibrary()',
            handlebars: 'jsServerCoreLibraryBuilder.getSharedLibrary(\'handlebars\')'
        },
        plugins: [
            // This plugin help you to attach extra files or dirs to webpack's watch system
            new ExtraWatchWebpackPlugin({
                files: [
                    'src/**/*',
                    'components/**/*',
                    'views/**/*',
                    'images/**/*',
                    'css/**/*',
                    'javascript/**/*',
                    'locales/**/*.json',
                    'resources/**/*.properties',
                    'settings/**/*',
                    'definitions.cnd',
                    'import.xml',
                    'package.json'
                ]
            })
        ],
        devtool: 'inline-source-map'
    };

    // 'jahia-pack' is a custom jahia script that makes a tgz package of the module's bundle
    if (env.pack) {
        config.plugins.push(
            // This plugin allows you to run any shell commands before or after webpack builds.
            new WebpackShellPluginNext({
                onAfterDone: {
                    scripts: ['yarn jahia-pack']
                }
            })
        );
    }

    // 'jahia-deploy' is a custom jahia script that makes a tgz package of the module's bundle and deploy it to jahia via curl.
    if (env.deploy) {
        config.plugins.push(
            // This plugin allows you to run any shell commands before or after webpack builds.
            new WebpackShellPluginNext({
                onAfterDone: {
                    scripts: ['yarn jahia-deploy']
                }
            })
        );
    }

    return config;
};
