const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

module.exports = env => {
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

    if (env.deploy) {
        config.plugins.push(
            // This plugin allows you to run any shell commands before or after webpack builds.
            new WebpackShellPluginNext({
                onAfterDone: {
                    scripts: ['yarn jahia-deploy pack']
                }
            })
        );
    }

    return config;
};
