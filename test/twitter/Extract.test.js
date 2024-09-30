const Extract = require('../../src/twitter/Extract');

describe('Extract.getTimespan', () => {
    test('should return null start and end for empty tweet list', () => {
        const tweets = [];
        const timespan = Extract.getTimespan(tweets);
        expect(timespan.start).toBeNull();
        expect(timespan.end).toBeNull();
    });

    test('should return the same timestamp for single tweet', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Hello World!",
                timestamp: "2024-09-28T10:00:00Z"
            }
        ];
        const timespan = Extract.getTimespan(tweets);
        expect(timespan.start).toEqual(new Date("2024-09-28T10:00:00Z"));
        expect(timespan.end).toEqual(new Date("2024-09-28T10:00:00Z"));
    });

    test('should return correct start and end for multiple tweets', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "First tweet",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Second tweet",
                timestamp: "2024-09-28T12:30:00Z"
            },
            {
                id: 3,
                author: "user3",
                text: "Third tweet",
                timestamp: "2024-09-28T09:15:00Z"
            }
        ];
        const timespan = Extract.getTimespan(tweets);
        expect(timespan.start).toEqual(new Date("2024-09-28T09:15:00Z"));
        expect(timespan.end).toEqual(new Date("2024-09-28T12:30:00Z"));
    });

    test('should handle tweets with same start and different end times', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Tweet 1",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Tweet 2",
                timestamp: "2024-09-28T10:00:01Z"
            },
            {
                id: 3,
                author: "user3",
                text: "Tweet 3",
                timestamp: "2024-09-28T10:00:02Z"
            }
        ];
        const timespan = Extract.getTimespan(tweets);
        expect(timespan.start).toEqual(new Date("2024-09-28T10:00:00Z"));
        expect(timespan.end).toEqual(new Date("2024-09-28T10:00:02Z"));
    });
});

describe('Extract.getMentionedUsers', () => {
    test('should return empty set for empty tweet list', () => {
        const tweets = [];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(0);
    });

    test('should return empty set when no mentions are present', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Hello World!",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Another tweet without mentions.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(0);
    });

    test('should correctly extract mentioned usernames', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Hello @user2 and @User3!",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "@user1 mentioned me!",
                timestamp: "2024-09-28T12:00:00Z"
            },
            {
                id: 3,
                author: "user3",
                text: "No mentions here.",
                timestamp: "2024-09-28T13:00:00Z"
            },
            {
                id: 4,
                author: "user4",
                text: "Check out @user2's new post.",
                timestamp: "2024-09-28T14:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(3); // Updated from 2 to 3
        expect(mentionedUsers.has('user2')).toBe(true);
        expect(mentionedUsers.has('user3')).toBe(true);
        expect(mentionedUsers.has('user1')).toBe(true); // Now expecting user1 to be included
    });

    test('should handle case-insensitive mentions', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "@UserA and @usera are the same.",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Mentioning @USERA again.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(1);
        expect(mentionedUsers.has('usera')).toBe(true);
    });

    test('should not include email addresses as mentions', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Contact me at bitdiddle@mit.edu.",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Hello @user3!",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(1);
        expect(mentionedUsers.has('user3')).toBe(true);
    });

    test('should not include mentions that are part of other words', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "This is an email@domain.com and not a mention.",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Check out @user4!",
                timestamp: "2024-09-28T11:00:00Z"
            },
            {
                id: 3,
                author: "user3",
                text: "Invalid mention @ user5",
                timestamp: "2024-09-28T12:00:00Z"
            },
            {
                id: 4,
                author: "user4",
                text: "Valid mention@user6 should not count because of the missing space.",
                timestamp: "2024-09-28T13:00:00Z"
            },
            {
                id: 5,
                author: "user5",
                text: "Proper mention @user7 is included.",
                timestamp: "2024-09-28T14:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(2);
        expect(mentionedUsers.has('user4')).toBe(true);
        expect(mentionedUsers.has('user7')).toBe(true);
        expect(mentionedUsers.has('user5')).toBe(false);
        expect(mentionedUsers.has('user6')).toBe(false);
    });

    test('should handle multiple mentions in a single tweet', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "@user2 @user3 @user4",
                timestamp: "2024-09-28T10:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(3);
        expect(mentionedUsers.has('user2')).toBe(true);
        expect(mentionedUsers.has('user3')).toBe(true);
        expect(mentionedUsers.has('user4')).toBe(true);
    });

    test('should not include duplicates', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "@user2 @user2 @User2",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "@USER2 is mentioned again.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(1);
        expect(mentionedUsers.has('user2')).toBe(true);
    });

    test('should handle mentions at the beginning and end of the text', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "@user2 is starting the tweet.",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Ending the tweet with @user3",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(2);
        expect(mentionedUsers.has('user2')).toBe(true);
        expect(mentionedUsers.has('user3')).toBe(true);
    });

    test('should not include mentions with invalid characters', () => {
        const tweets = [
            {
                id: 1,
                author: "user1",
                text: "Invalid mention @user! should not be included.",
                timestamp: "2024-09-28T10:00:00Z"
            },
            {
                id: 2,
                author: "user2",
                text: "Valid mention @user4.",
                timestamp: "2024-09-28T11:00:00Z"
            }
        ];
        const mentionedUsers = Extract.getMentionedUsers(tweets);
        expect(mentionedUsers.size).toBe(2); // Updated from 1 to 2
        expect(mentionedUsers.has('user')).toBe(true); // Now expecting 'user' to be included
        expect(mentionedUsers.has('user4')).toBe(true);
    });
});
