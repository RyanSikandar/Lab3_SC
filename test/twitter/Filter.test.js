const Filter = require('../../src/twitter/Filter'); 

describe('Filter Class', () => {
    const tweets = [
        { id: '1', author: 'user1', text: 'Hello world!', timestamp: 1234567890 },
        { id: '2', author: 'user2', text: 'Java is awesome!', timestamp: 1234567891 },
        { id: '3', author: 'user1', text: 'Coding is fun!', timestamp: 1234567892 }
    ];

    test('writtenBy() filters tweets by author', () => {
        const result = Filter.writtenBy(tweets, 'user1');
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('Hello world!');
        expect(result[1].text).toBe('Coding is fun!');
    });

    test('inTimespan() filters tweets within the timespan', () => {
        const timespan = { start: 1234567880, end: 1234567900 };
        const result = Filter.inTimespan(tweets, timespan);
        expect(result).toHaveLength(3);
    });

    test('containing() filters tweets containing specific words', () => {
        const words = ['Java', 'world'];
        const result = Filter.containing(tweets, words);
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('Hello world!');
        expect(result[1].text).toBe('Java is awesome!');
    });
});
