const Extract = require('../../src/twitter/Extract');
const Tweet = require('../../src/twitter/Tweet');

describe('Extract', () => {
    const d1 = new Date('2016-02-17T10:00:00Z');
    const d2 = new Date('2016-02-17T11:00:00Z');

    const tweet1 = new Tweet(1, 'alyssa', 'is it reasonable to talk about rivest so much?', d1);
    const tweet2 = new Tweet(2, 'bbitdiddle', 'rivest talk in 30 minutes #hype', d2);

    test('Assertions should be enabled', () => {
        expect(() => {
            if (!false) throw new Error();
        }).toThrow();
    });

    test('testGetTimespanTwoTweets', () => {
        const timespan = Extract.getTimespan([tweet1, tweet2]);

        expect(timespan.getStart()).toEqual(d1);
        expect(timespan.getEnd()).toEqual(d2);
    });

    test('testGetMentionedUsersNoMention', () => {
        const mentionedUsers = Extract.getMentionedUsers([tweet1]);

        expect(mentionedUsers.size).toBe(0);
    });
});
