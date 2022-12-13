import { ProfanityBuilder, ProfanityJSON } from './profanityBuilder'
import fs from 'fs';

const string: string = 'apple';
const array: string[] = ['apple', 'banana', 'kiwi'];

describe('Constructor.', () => {
  test('Load default profanity list.', () => {
    const profanity = new ProfanityBuilder({
      defaultProfanityList: 'include',
      doubleRating: 'skip',
    });
    expect(profanity.list.length).toBeGreaterThan(0);
  });

  test('Define default doubleRate option.', () => {
    const profanity = new ProfanityBuilder({
      defaultProfanityList: 'exclude',
      doubleRating: 'overwrite',
    }).add(string, 2)
      .add(string, 3);
    expect(profanity.list[0].rate).toBe(3);
  });

  test('Overwrite default doubleRate option.', () => {
    const profanity = new ProfanityBuilder({
      defaultProfanityList: 'exclude',
      doubleRating: 'overwrite',
    }).add(string, 2)
      .add(string, 3, 'skip');
    expect(profanity.list[0].rate).toBe(2);
  });

  test('Default doubleRate option should be to throw.', () => {
    expect(() => {
      new ProfanityBuilder()
        .add(string, 2)
        .add(string, 3)
    }).toThrow();
  });
});

describe('Blacklist string manipulations.', () => {
  test('Add string.', () => {
    const profanity = new ProfanityBuilder()
      .add(string);
    expect(profanity.list[0].string).toBe(string);
  });

  test('Add multiple string.', () => {
    const profanity = new ProfanityBuilder()
      .add(array);
    expect(profanity.list).toHaveLength(array.length);
  });
  
  test('Remove string.', () => {
    const string: string = 'apple';
    const profanity = new ProfanityBuilder()
      .add(string)
      .remove(string)
    expect(profanity.list).toHaveLength(0);
  });

  test('Remove multiple string.', () => {
    const profanity = new ProfanityBuilder()
      .add(array)
      .remove(...array);
    expect(profanity.list).toHaveLength(0);
  });

  test('Add empty string.', () => {
    expect(() => {
      new ProfanityBuilder().add('')
    }).toThrow();
  });

  test('Remove empty string.', () => {
    expect(() => {
      new ProfanityBuilder()
        .add(string)
        .remove('')
    }).toThrow();
  });
});

describe('Blacklist rate manipulations.', () => {
  test('Add string with rateOption overwrite', () => {
    const profanity = new ProfanityBuilder()
      .add(string, 2)
      .add(string, 3, 'overwrite');
    expect(profanity.list[0].rate).toBe(3);
  });

  test('Add string with rateOption skip', () => {
    const profanity = new ProfanityBuilder()
      .add(string, 2)
      .add(string, 3, 'skip');
    expect(profanity.list[0].rate).toBe(2);
  });

  test('Add string with rateOption overwrite', () => {
    expect(() => {
      new ProfanityBuilder()
        .add(string, 2)
        .add(string, 3, 'throwError')
    }).toThrow();
  });

  test('Add string with rateOption useHighest', () => {
    const profanity = new ProfanityBuilder()
      .add(string, 2)
      .add(string, 3, 'useHighest');
    expect(profanity.list[0].rate).toBe(3);
  });

  test('Add string with rateOption useLowest', () => {
    const profanity = new ProfanityBuilder()
      .add(string, 2)
      .add(string, 3, 'useLowest');
    expect(profanity.list[0].rate).toBe(2);
  });
});

test('Load default profanity', () => {
  const profanity = new ProfanityBuilder({
    defaultProfanityList: 'include',
    doubleRating: 'throwError'
  });
  const defaultProfanityListLength = (() => {
    const list: ProfanityJSON = JSON.parse(fs.readFileSync(new URL('../../../lists/profanity.json', import.meta.url), 'utf-8'));
    let length = list.words.flatMap((v) => v.strings).length;

    // Build and count the variation strings.
    for (let i = 0, len = list.sentences.length; i < len; i++) {
      const obj = list.sentences[i];
      let sentences: string[] = obj.variations[0];
      for (let j = 1, len = obj.variations.length; j < len; j++) {
        sentences = sentences.flatMap((str1) => {
          return obj.variations[j].map((str2) => {
            return (str1 + obj.separator + str2);
          });
        });
      }
      length += sentences.length;
    }
    return length;
  })();
  expect(profanity.list.length === defaultProfanityListLength);
});