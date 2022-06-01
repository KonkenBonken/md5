import md5 from 'md5';
import fs from 'fs';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
let words = alphabet;

for (let i = 1; i < 5; i++)
	words = words.flatMap(word => Array(alphabet.length).fill().map((_, i) => word + alphabet[i]));

console.log(words.length);

for (const i in words)
	words[i] = md5(words[i]);


fs.writeFileSync('hashes.txt', words.join('\n'))