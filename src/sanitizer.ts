import fetch from 'node-fetch';
import { removeDuplicates } from './utils.js';

export const characterSet = await (async function fetchCharacters() {
  try {
    var text = await (await fetch('https://www.unicode.org/Public/security/latest/confusables.txt')).text();
  }
  catch {
    throw new Error('Could not fetch unicode confusables summary file.');
  }
  let set: { [key: string]: string[] } = {};
  const cleanSet = () => {
    const keyList = Object.keys(set);
    for (let i = 0, len = keyList.length; i < len; i++) {
      set[keyList[i]] = removeDuplicates(set[keyList[i]]);
    }
  }

  // Add characters to set.
  text.split('\n')
    .filter((item) => item.length !== 0 && !item.startsWith('#'))
    .forEach((item) => {
      const array = item.split(';');
      const hexValue = [...array[0].matchAll(/[0-9a-f]+/gi)]
        .map((item) => String.fromCodePoint(parseInt(item[0], 16)))
        .join('');
      const hexKey = [...array[1].matchAll(/[0-9a-f]+/gi)]
        .map((item) => String.fromCodePoint(parseInt(item[0], 16)))
        .join('');
      if (hexValue.length === 0 || hexKey.length === 0) {
        return;
      }
      if (typeof set[hexKey] === 'undefined') {
        set[hexKey] = []
      }
      set[hexKey].push(hexValue);
    });
  cleanSet();
  
  // Test for keys in the value of other keys.
  const keyList = Object.keys(set);
  for (let iKey = 0, len = keyList.length; iKey < len; iKey++) {
    for (let iSearchKey = 0; iSearchKey < len; iSearchKey++) {
      const key = keyList[iKey];
      const searchKey = keyList[iSearchKey];
      const index = set[key].indexOf(searchKey);
      if (index === -1) {
        continue;
      }
      if (key === searchKey) {
        set[key].splice(index, 1);
      }
      else {
        set[key].concat(set[searchKey]);
        delete set[searchKey];
      }
    }
  }
  cleanSet();

  // Test for values assigned to multiple keys.
  const duplicates = Object.values(set).flat().sort().filter((item, pos, self) => {
    return pos && item === self[pos - 1];
    });
  if (duplicates.length > 0) {
    throw new Error('Character set contains values assigned to multiple keys: [\''
      + duplicates.join("', '")) + '\']';
  }  

  return set;
})();