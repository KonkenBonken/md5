import md5 from 'md5';
import fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
	const wordLength = 5;
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
	let words = alphabet;

	let threadCount = 10;
	const threads = [];
	const hashes = [];

	console.time('Word generation');
	for (let i = 1; i < wordLength; i++)
		words = words.flatMap(word => Array(alphabet.length).fill().map((_, i) => word + alphabet[i]));
	console.timeEnd('Word generation');

	console.log('Words:', words.length);

	console.time('Hashing');
	const wordsPerWorker = Math.floor(words.length / threadCount);
	for (var i = 1; i < threadCount; i++)
		threads.push(new Worker('./index.mjs', { workerData: { words: words.splice(0, wordsPerWorker), i } }));
	threads.push(new Worker('./index.mjs', { workerData: { words, i } }));

	for (var worker of threads) {
		worker.on('message', hashed => hashes.push(hashed));
		worker.on('exit', () => {
			if (--threadCount == 0) {
				fs.writeFileSync('hashes.txt', hashes.flat().join('\n'))
				console.timeEnd('Hashing');
			}
		})
		worker.on('error', err => { throw err });
	}

} else {
	console.log('Thread', workerData.i, 'initialized');
	console.time(`Thread ${workerData.i} done`);
	parentPort.postMessage(workerData.words.map(md5));
	console.timeEnd(`Thread ${workerData.i} done`);
}