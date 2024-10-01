const Filter = require('../../src/twitter/Filter');

describe('Filter Class', () => {
    const sampleTweets = [
        { id: '1', author: 'user1', text: 'Hello world!', timestamp: 1234567890 },
        { id: '2', author: 'user2', text: 'Java is awesome!', timestamp: 1234567891 },
        { id: '3', author: 'user1', text: 'Coding is fun!', timestamp: 1234567892 }
    ];

    test('should filter tweets by a specific author', () => {
        const filteredTweets = Filter.writtenBy(sampleTweets, 'user1');
        expect(filteredTweets).toHaveLength(2);
        expect(filteredTweets[0].text).toBe('Hello world!');
        expect(filteredTweets[1].text).toBe('Coding is fun!');
    });

    test('should filter tweets within the specified timespan', () => {
        const timeRange = { start: 1234567880, end: 1234567900 };
        const filteredTweets = Filter.inTimespan(sampleTweets, timeRange);
        expect(filteredTweets).toHaveLength(3);
    });

    test('should filter tweets containing specific keywords', () => {
        const keywords = ['Java', 'world'];
        const filteredTweets = Filter.containing(sampleTweets, keywords);
        expect(filteredTweets).toHaveLength(2);
        expect(filteredTweets[0].text).toBe('Hello world!');
        expect(filteredTweets[1].text).toBe('Java is awesome!');
    });
});
