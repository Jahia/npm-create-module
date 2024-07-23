const fs = require('fs');
const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

const deps = require('./package.json').dependencies;

// Read all files in the client components directory in order to expose them with webpack module federation more easily
// Those components are exposed in order to be hydrate/rendered client side
const componentsDir = './src/client';
const exposes = {};
fs.readdirSync(componentsDir).forEach(file => {
    if (file !== 'index.js') {
        const componentName = path.basename(file, path.extname(file));
        exposes[componentName] = path.resolve(componentsDir, file);
    }
});
const moduleName = '$$MODULE_NAME$$';

module.exports = env => {
    let configs = [
        // Config for jahia's client-side components (HydrateInBrowser or RenderInBrowser)
        // This config can be removed if the module doesn't contain client-side components
        // More info here : https://academy.jahia.com/documentation/jahia/jahia-8/developer/javascript-module-development/client-side-javascript
        {
            entry: {
                [moduleName]: path.resolve(__dirname, './src/client/index')
            },
            output: {
                path: path.resolve(__dirname, 'javascript/client')
            },
            resolve: {
                mainFields: ['module', 'main'],
                extensions: ['.mjs', '.js', '.jsx']
            },
            module: {
                rules: [
                    {
                        test: /\.jsx$/,
                        include: [path.join(__dirname, 'src/client')],
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {modules: false, targets: {safari: '7', ie: '10'}}],
                                    '@babel/preset-react'
                                ],
                                plugins: [
                                    'styled-jsx/babel'
                                ]
                            }
                        }
                    }
                ]
            },
            plugins: [
                // This plugin allows a build to provide or consume modules with other independent builds at runtime.
                new ModuleFederationPlugin({
                    name: moduleName,
                    library: {type: 'assign', name: `window.appShell = (typeof appShell === "undefined" ? {} : appShell); window.appShell['${moduleName}']`},
                    filename: '../client/remote.js',
                    exposes: exposes,
                    shared: {
                        react: {
                            requiredVersion: deps.react,
                            singleton: true
                        },
                        'react-i18next': {},
                        i18next: {}
                    }
                })
            ],
            devtool: 'inline-source-map',
            mode: 'development'
        },
        // Config for jahia's server-side components (using SSR) and source code
        // Those components have access to jahia's custom types and functions (https://academy.jahia.com/documentation/jahia/jahia-8/developer/javascript-module-development/javascript-modules-reference-documentation)
        {
            entry: {
                main: path.resolve(__dirname, 'src/server')
            },
            output: {
                path: path.resolve(__dirname, 'dist')
            },
            externals: {
                // Those libraries are supplied to webpack at runtime (by the npm-module-engine project), and are not packaged in the output bundle
                '@jahia/js-server-core': 'jsServerCoreLibraryBuilder.getLibrary()',
                react: 'jsServerCoreLibraryBuilder.getSharedLibrary(\'react\')',
                'react-i18next': 'jsServerCoreLibraryBuilder.getSharedLibrary(\'react-i18next\')',
                i18next: 'jsServerCoreLibraryBuilder.getSharedLibrary(\'i18next\')',
                'styled-jsx/style': 'jsServerCoreLibraryBuilder.getSharedLibrary(\'styled-jsx\')'
            },
            resolve: {
                mainFields: ['module', 'main'],
                extensions: ['.mjs', '.js', '.jsx']
            },
            module: {
                rules: [
                    {
                        test: /\.jsx$/,
                        include: [
                            path.join(__dirname, 'src/server'),
                            path.join(__dirname, 'src/client')
                        ],
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {modules: false, targets: {safari: '7', ie: '10'}}],
                                    '@babel/preset-react'
                                ],
                                plugins: [
                                    'styled-jsx/babel'
                                ]
                            }
                        }
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true
                                }
                            },
                            'sass-loader'
                        ]
                    }
                ]
            },
            plugins: [
                // This plugin help you to attach extra files or dirs to webpack's watch system
                new ExtraWatchWebpackPlugin({
                    files: [
                        'src/server/**/*',
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
            devtool: 'inline-source-map',
            mode: 'development'
        }
    ];

    // Get the last config of the array :
    let config = configs[configs.length - 1];
    if (!config.plugins) {
        config.plugins = [];
    }

    // 'jahia-pack' is a custom jahia script that makes a tgz package of the module's bundle
    if (env.pack) {
        // This plugin allows you to run any shell commands before or after webpack builds.
        const webpackShellPlugin = new WebpackShellPluginNext({
            onAfterDone: {
                scripts: ['yarn jahia-pack']
            }
        });
        config.plugins.push(webpackShellPlugin);
    }

    // 'jahia-deploy' is a custom jahia script that makes a tgz package of the module's bundle and deploy it to jahia via curl.
    if (env.deploy) {
        // This plugin allows you to run any shell commands before or after webpack builds.
        const webpackShellPlugin = new WebpackShellPluginNext({
            onAfterDone: {
                scripts: ['yarn jahia-deploy']
            }
        });
        config.plugins.push(webpackShellPlugin);
    }

    return configs;
};
