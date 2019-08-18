import { resolve } from 'path';
import { Configuration } from 'webpack';
import { ZipBundlePlugin } from './zipBundlePlugin';
import { readdirSync } from 'fs';

/**
 * during the build webpack replaces calls to require with global variables
 * this works well in a web context. for a node js context we'd like to preserve
 * the require calls. Webpack allows you to specify a list of modules to be treated
 *  as external(it assumes they are already in the environment). For some reasons I'm not entirely sure about,
 *  If you prepend 'common js' to the module name and add it to the list of externals,
 * it will be available in the bundle but require calls still work.
 *
 * see here for for some more information
 * https://jlongster.com/Backend-Apps-with-Webpack--Part-I
 * https://webpack.js.org/configuration/externals/#function
 */
function getExternalModules() {
	return (
		readdirSync('node_modules')
			// skip the .bin folder
			.filter(name => name !== '.bin')
			// convince webpack they are common js
			.map(name => 'commonjs ' + name)
	);
}

const config: Configuration = {
	entry: './src/index.ts',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js',
		libraryTarget: 'umd'
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
	externals: getExternalModules()
};

export default config;
