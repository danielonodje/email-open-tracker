import { Compiler, Stats } from 'webpack';
import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { createGzip } from 'zlib';

export class ZipBundlePlugin {
	apply(compiler: Compiler) {
		compiler.hooks.done.tapPromise('ZipBundlePlugin', (stats: Stats) => {
			return new Promise(resolve => {
				const fileLocation = compiler.outputPath;
				const filename = compiler.options.output!.filename;

				if (filename === undefined) return;

				const fileContents = createReadStream(`${fileLocation}/${filename}`);
				const writeStream = createWriteStream(`${fileLocation}/index.js.zip`);

				const zip = createGzip();

				console.log('Creating zipped bundle');

				fileContents
					.pipe(zip)
					.pipe(writeStream)
					.on('finish', function(err) {
						if (err !== undefined) {
							console.warn(
								`An error occured creating zipped bundle at: ${fileLocation}/indez.zip`
							);
						} else {
							console.log(
								`Zipped bundle created successfully at: ${fileLocation}/index.js.zip`
							);
							// delete the index.js bundle after creating the zipped bundle
							unlinkSync(`${fileLocation}/${filename}`);
						}
						resolve();
					});
			});
		});
	}
}
