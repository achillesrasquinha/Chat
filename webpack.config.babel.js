import path from 'path'

const PATH = {
    'BASE': path.resolve(__dirname),
}
PATH['SOURCE'] = path.join(PATH.BASE, 'js')
PATH['TARGET'] = path.join(PATH.BASE, 'dist')

const DEVELOPMENT = process.env.NODE_ENV === 'development';

export default {
    mode: DEVELOPMENT ? 'development' : 'production',
    entry: path.join(PATH.SOURCE, 'index.jsx'),
    output: {
        path: PATH.TARGET,
        filename: 'becca-chat.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        static: {
            directory: PATH.TARGET,
        }
    },
    performance: {
        hints: false
    }
}