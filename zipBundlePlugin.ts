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

				const zipFilename = 'index.js.zip';

				console.log('Creating Zipped Bundle');
				await execPromise(`cd ./dist; zip ${zipFilename} ${filename}`).catch(
					e => {
						console.warn(
							`An error occurred zipping the bundle at ${zipFilename}`
						);
					}
				);

				await execPromise(`rm ./dist/${filename}`);

				resolve();
			});
		});
	}
}
