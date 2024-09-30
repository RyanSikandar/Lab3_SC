// Extract.js
// Extract consists of methods that extract information from a list of tweets.
// You may add new public or private methods or classes if you like.

class Extract {
    /**
     * Get the time period spanned by tweets.
     * 
     * @param {Array} tweets - list of tweets with distinct ids, not modified by this method.
     * @return {Object} a minimum-length time interval that contains the timestamp of
     *                  every tweet in the list in the form { start: Date, end: Date }.
     */
    static getTimespan(tweets) {
        if (tweets.length === 0) return { start: null, end: null };

        const timestamps = tweets.map(tweet => new Date(tweet.timestamp));
        const start = new Date(Math.min(...timestamps));
        const end = new Date(Math.max(...timestamps));

        return { start, end };
    }

    /**
     * Get usernames mentioned in a list of tweets.
     * 
     * @param {Array} tweets - list of tweets with distinct ids, not modified by this method.
     * @return {Set} the set of usernames who are mentioned in the text of the tweets.
     *               A username-mention is "@" followed by a Twitter username.
     *               The username-mention cannot be immediately preceded or followed by any
     *               character valid in a Twitter username.
     *               Twitter usernames are case-insensitive, and the returned set may
     *               include a username at most once.
     */
    static getMentionedUsers(tweets) {
        const mentionedUsers = new Set();
        const usernameRegex = /(^|[^a-zA-Z0-9_])@([a-zA-Z0-9_]+)/g;

        tweets.forEach(tweet => {
            let match;
            while ((match = usernameRegex.exec(tweet.text)) !== null) {
                mentionedUsers.add(match[2].toLowerCase());
            }
        });

        return mentionedUsers;
    }
}

// Example usage
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
    }
];

console.log(Extract.getTimespan(tweets));
console.log(Extract.getMentionedUsers(tweets)); 

module.exports = Extract;