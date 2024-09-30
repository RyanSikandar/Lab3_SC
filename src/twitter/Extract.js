// Extract.js
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

        const timestamps = tweets.map(tweet => new Date(tweet.timestamp).getTime());
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
        const usernameRegex = /(?:^|[^a-zA-Z0-9_])@([a-zA-Z0-9_]+)(?![a-zA-Z0-9_])/g;

        tweets.forEach(tweet => {
            let match;
            while ((match = usernameRegex.exec(tweet.text)) !== null) {
                mentionedUsers.add(match[1].toLowerCase());
            }
        });

        return mentionedUsers;
    }
}

module.exports = Extract;
