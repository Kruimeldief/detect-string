/**
 * Remove any double values in an array.
 * @param array Any type of array.
 * @returns An array without double values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeDuplicates(array: any[]): any[] {
  return array.sort().filter(((item, pos, self) => {
    return !pos || item !== self[pos - 1];
  }));
}

/**
 * Prevent a string from using functional characters in a regular expression.
 * @param string String formatted for RegExp use without functional characters.
 */
export function regexFormat(string: string): string {
  return String(string).replace(new RegExp('\\\\', 'g'), '\\\\')
      .replace(new RegExp('\\^', 'g'), '\\^')
      .replace(new RegExp('\\[', 'g'), '\\[')
      .replace(new RegExp('\\]', 'g'), '\\]')
      .replace(new RegExp('\\-', 'g'), '\\-')
      .replace(new RegExp('\\$', 'g'), '\\$')
      .replace(new RegExp('\\.', 'g'), '\\.')
      .replace(new RegExp('\\*', 'g'), '\\*')
      .replace(new RegExp('\\(', 'g'), '\\(')
      .replace(new RegExp('\\)', 'g'), '\\)')
      .replace(new RegExp('\\?', 'g'), '\\?')
      .replace(new RegExp('\\:', 'g'), '\\:')
      .replace(new RegExp('\\=', 'g'), '\\=')
      .replace(new RegExp('\\!', 'g'), '\\!')
      .replace(new RegExp('\\+', 'g'), '\\+')
      .replace(new RegExp('\\{', 'g'), '\\{')
      .replace(new RegExp('\\}', 'g'), '\\}')
      .replace(new RegExp('\\,', 'g'), '\\,')
      .replace(new RegExp('\\|', 'g'), '\\|');
}