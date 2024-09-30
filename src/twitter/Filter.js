class Filter {
    /**
     * Find tweets written by a particular user.
     * @param {Array} tweets - a list of tweets.
     * @param {string} username - Twitter username.
     * @returns {Array} - filtered tweets by the username.
     */
    static writtenBy(tweets, username) {
        return tweets.filter(tweet => tweet.author === username);
    }

    /**
     * Find tweets that were sent during a particular timespan.
     * @param {Array} tweets - a list of tweets.
     * @param {Object} timespan - an object with `start` and `end` properties.
     * @returns {Array} - filtered tweets within the timespan.
     */
    static inTimespan(tweets, timespan) {
        return tweets.filter(tweet => {
            return tweet.timestamp >= timespan.start && tweet.timestamp <= timespan.end;
        });
    }

    /**
     * Find tweets that contain certain words.
     * @param {Array} tweets - a list of tweets.
     * @param {Array} words - a list of words to search for.
     * @returns {Array} - filtered tweets containing at least one of the words.
     */
    static containing(tweets, words) {
        const lowerCaseWords = words.map(word => word.toLowerCase());
        return tweets.filter(tweet => {
            const tweetText = tweet.text.toLowerCase();
            return lowerCaseWords.some(word => tweetText.includes(word));
        });
    }
}

module.exports = Filter;