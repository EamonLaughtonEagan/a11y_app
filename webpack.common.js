
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const htmlWebpackInjectPlugin = require('html-webpack-inject-plugin').default

module.exports = {
    entry: {
        popup: path.resolve('/src/popup/popup.tsx'),
        options: path.resolve('/src/options/options.tsx'),
        background: path.resolve('/src/background/background.ts'),
        //contentScript: path.resolve('/src/contentScript/index.tsx'),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer],
                        }
                    }
                }],
                
                test: /\.css$/i,
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve('src/static'), 
                    to: path.resolve('dist'),
                },
            ]
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
        ]),
        new htmlWebpackInjectPlugin({
            external: {
                src: 'axe.min.js',
                type: 'text/javascript',
            },
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== 'contentScript'
            }
        }
    },
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}