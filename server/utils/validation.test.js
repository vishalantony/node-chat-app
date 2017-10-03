const expect = require('expect');

const { isRealString } = require('./validation');

describe('validation tests', () => {
  it('should reject non string values', () => {
    expect(isRealString(64824545)).toBe(false);
    expect(isRealString({name: 'Vishal', age: 22})).toBe(false);
  });

  it('should reject strings with only non printable characters', () => {
    expect(isRealString('     ')).toBeA('boolean').toBe(false);
    expect(isRealString("\t\t  ")).toBeA('boolean').toBe(false);
  })

  it('should accept strings with printable characters', () => {
    expect(isRealString('some string')).toBe(true);
    expect(isRealString('   some string   ')).toBe(true);
    expect(isRealString('chunkybacon')).toBe(true);
  });
});
