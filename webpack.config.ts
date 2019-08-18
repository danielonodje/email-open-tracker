import { resolve } from 'path';
import { Configuration } from 'webpack';
import { ZipBundlePlugin } from './zipBundlePlugin';
import * as WebpackNodeExternals from 'webpack-node-externals';

const config: Configuration = {
	entry: './src/index.ts',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
	},
	mode: 'production',
	target: 'node',
	plugins: [new ZipBundlePlugin()],
	externals: [WebpackNodeExternals()]
};

export default config;
