import { resolve } from 'path';
import { Configuration } from 'webpack';
import { ZipBundlePlugin } from './zipBundlePlugin';

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
	optimization: {
		usedExports: true,
		sideEffects: false,
		minimize: true,
		mergeDuplicateChunks: true,
		removeAvailableModules: true,
		removeEmptyChunks: true,
		nodeEnv: 'production'
	},
	plugins: [new ZipBundlePlugin()]
};

export default config;
