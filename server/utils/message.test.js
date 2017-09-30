var expect = require('expect');

var { generateMessage } = require('./message');

describe('generate message', () => {
  it('should generate the correct message object', () => {
    let from = 'FromMan';
    let text = 'Text me again and again and again';
    let message = generateMessage(from, text);
    expect(message).toExist().toInclude({
      from, text
    });
    expect(message.createdAt).toBeA('number');
  });
});
