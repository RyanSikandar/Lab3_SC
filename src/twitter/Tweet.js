// Tweet.js

class Tweet {
    /**
     * Create a Tweet with a known unique id.
     * 
     * @param {number} id - unique identifier for the tweet, as assigned by Twitter.
     * @param {string} author - Twitter username who wrote this tweet.
     *                          Required to be a
 *                          Twitter username as defined by the getAuthor() method below.
     * @param {string} text - text of the tweet, at most 140 characters.
     * @param {Date} timestamp - date/time when the tweet was sent.
     */
    constructor(id, author, text, timestamp) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.timestamp = timestamp;

        this._checkRep();
    }

    /**
     * Ensures that the representation invariant is maintained.
     */
    _checkRep() {
        // Check that the author is non-empty and only contains valid characters
        const validAuthor = /^[A-Za-z0-9_-]+$/;
        if (!this.author || !validAuthor.test(this.author)) {
            throw new Error('Invalid author');
        }

        // Check that the text length is at most 140 characters
        if (this.text.length > 140) {
            throw new Error('Text exceeds 140 characters');
        }
    }

    /**
     * @return {number} unique identifier of this tweet
     */
    getId() {
        return this.id;
    }

    /**
     * @return {string} Twitter username who wrote this tweet.
     *         A Twitter username is a nonempty sequence of letters (A-Z or
     *         a-z), digits, underscore ("_"), or hyphen ("-").
     *         Twitter usernames are case-insensitive, so "jbieber" and "JBieBer"
     *         are equivalent.
     */
    getAuthor() {
        return this.author;
    }

    /**
     * @return {string} text of this tweet, at most 140 characters
     */
    getText() {
        return this.text;
    }

    /**
     * @return {Date} date/time when this tweet was sent
     */
    getTimestamp() {
        return this.timestamp;
    }

    /**
     * @return {string} A string representation of this Tweet
     */
    toString() {
        return `(${this.getId()} ${this.getTimestamp().toISOString()} ${this.getAuthor()}) ${this.getText()}`;
    }

    /**
     * Checks if this tweet is equal to another tweet based on their unique ID.
     * 
     * @param {Tweet} that - another tweet object to compare with
     * @return {boolean} true if both tweets have the same ID, false otherwise
     */
    equals(that) {
        if (!(that instanceof Tweet)) {
            return false;
        }
        return this.id === that.id;
    }

    /**
     * Generates a hash code for this tweet.
     * 
     * @return {number} a hash code based on the tweet's ID
     */
    hashCode() {
        const bitsInInt = 32;
        const lower32bits = this.id & 0xffffffff;
        const upper32bits = (this.id >> bitsInInt) & 0xffffffff;
        return lower32bits ^ upper32bits;
    }
}

// Export the Tweet class for use in other files
module.exports = Tweet;
