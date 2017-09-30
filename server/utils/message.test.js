var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

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

  it('should generate the correct location message', () => {
    let lat = 3;
    let lng = 4;
    let from = 'Mr. X';
    let gmapsURL = 'https://www.google.com/maps?q='+lat+","+lng;
    let message = generateLocationMessage(from, lat, lng);
    expect(message).toExist().toInclude({
      gmapsURL,
      from
    });
    expect(message.gmapsURL).toBeA('string');
    expect(message.createdAt).toBeA('number');
  });
});
