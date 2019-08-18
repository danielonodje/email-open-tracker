import { Compiler, Stats } from 'webpack';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

export class ZipBundlePlugin {
	apply(compiler: Compiler) {
		compiler.hooks.done.tapPromise('ZipBundlePlugin', (stats: Stats) => {
			return new Promise(async resolve => {
				const fileLocation = compiler.outputPath;
				const filename = compiler.options.output!.filename;

				if (filename === undefined) return;

				const bundledFile = `${fileLocation}/${filename}`;
				const zipOutput = `${fileLocation}/index.js.zip`;

				console.log('Creating Zipped Bundle');
				await execPromise(`zip ${zipOutput} ${bundledFile}`).catch(e => {
					console.warn(`An error occurred zipping the bundle at ${zipOutput}`);
				});

				await execPromise(`rm ${bundledFile}`);

				resolve();
			});
		});
	}
}
