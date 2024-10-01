const TwitterExtractor = require('../../src/twitter/TwitterExtractor');

describe('TwitterExtractor.getTimeRange', () => {
    test('should return null for both start and end when no tweets are present', () => {
        const tweetList = [];
        const timeRange = TwitterExtractor.getTimeRange(tweetList);
        expect(timeRange.start).toBeNull();
        expect(timeRange.end).toBeNull();
    });

    test('should return the same timestamp for a single tweet', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "Hello World!",
                timestamp: "2024-09-28T10:00:00Z"
            }
        ];
        const timeRange = TwitterExtractor.getTimeRange(tweetList);
        expect(timeRange.start).toEqual(new Date("2024-09-28T10:00:00Z"));
        expect(timeRange.end).toEqual(new Date("2024-09-28T10:00:00Z"));
    });

    test('should accurately identify the start and end times for multiple tweets', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "First tweet",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "userB",
                text: "Second tweet",
                timestamp: "2024-09-28T12:30:00Z"
            },
            {
                id: 3,
                author: "userC",
                text: "Third tweet",
                timestamp: "2024-09-28T09:15:00Z"
            }
        ];
        const timeRange = TwitterExtractor.getTimeRange(tweetList);
        expect(timeRange.start).toEqual(new Date("2024-09-28T09:15:00Z"));
        expect(timeRange.end).toEqual(new Date("2024-09-28T12:30:00Z"));
    });

    test('should handle tweets with identical start times but different end times', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "Tweet 1",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "userB",
                text: "Tweet 2",
                timestamp: "2024-09-28T10:00:01Z"
            },
            {
                id: 3,
                author: "userC",
                text: "Tweet 3",
                timestamp: "2024-09-28T10:00:02Z"
            }
        ];
        const timeRange = TwitterExtractor.getTimeRange(tweetList);
        expect(timeRange.start).toEqual(new Date("2024-09-28T10:00:00Z"));
        expect(timeRange.end).toEqual(new Date("2024-09-28T10:00:02Z"));
    });
});

describe('TwitterExtractor.getMentionedAccounts', () => {
    test('should return an empty set when tweet list is empty', () => {
        const tweetList = [];
        const mentionedAccounts = TwitterExtractor.getMentionedAccounts(tweetList);
        expect(mentionedAccounts.size).toBe(0);
    });

    test('should return an empty set when no accounts are mentioned', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "Hello World!",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "userB",
                text: "This is a tweet without mentions.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedAccounts = TwitterExtractor.getMentionedAccounts(tweetList);
        expect(mentionedAccounts.size).toBe(0);
    });

    test('should accurately extract mentioned usernames from tweets', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "Hello @userB and @UserC!",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "userB",
                text: "@userA mentioned me!",
                timestamp: "2024-09-28T12:00:00Z"
            },
            {
                id: 3,
                author: "userC",
                text: "No mentions here.",
                timestamp: "2024-09-28T13:00:00Z"
            },
            {
                id: 4,
                author: "userD",
                text: "Check out @userB's new post.",
                timestamp: "2024-09-28T14:00:00Z"
            }
        ];
        const mentionedAccounts = TwitterExtractor.getMentionedAccounts(tweetList);
        expect(mentionedAccounts.size).toBe(3);
        expect(mentionedAccounts.has('userB')).toBe(true);
        expect(mentionedAccounts.has('userC')).toBe(true);
        expect(mentionedAccounts.has('userA')).toBe(true);
    });

    test('should accurately handle multiple mentions in one tweet', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "@userB @userC @userD",
                timestamp: "2024-09-28T10:00:00Z"
            }
        ];
        const mentionedAccounts = TwitterExtractor.getMentionedAccounts(tweetList);
        expect(mentionedAccounts.size).toBe(3);
        expect(mentionedAccounts.has('userB')).toBe(true);
        expect(mentionedAccounts.has('userC')).toBe(true);
        expect(mentionedAccounts.has('userD')).toBe(true);
    });

    test('should not include duplicate mentions', () => {
        const tweetList = [
            {
                id: 1,
                author: "userA",
                text: "@userB @userB @UserB",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "userB",
                text: "@USERB is mentioned again.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedAccounts = TwitterExtractor.getMentionedAccounts(tweetList);
        expect(mentionedAccounts.size).toBe(1);
        expect(mentionedAccounts.has('userB')).toBe(true);
    });
});
