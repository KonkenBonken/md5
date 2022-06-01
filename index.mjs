console.time('All');
import md5 from 'md5';
import fs from 'fs';

const wordLength = 5;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
let words = alphabet;

for (let i = 1; i < wordLength; i++)
	words = words.flatMap(word => Array(alphabet.length).fill().map((_, i) => word + alphabet[i]));

console.log('Words:', words.length);

console.time('Hashing');
for (const i in words)
	words[i] = md5(words[i]);
console.timeEnd('Hashing');


console.time('Save');
fs.writeFileSync('hashes.txt', words.join('\n'))
console.timeEnd('Save');
console.timeEnd('All');