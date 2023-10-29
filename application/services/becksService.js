/**  ≈) 
 * Write a function that, given two strings (s and t), returns true IF t is an anagram of s and false otherwise.
 * 
    Definition of Anagram: An Anagram is a word that can be formed by rearranging the letters of a different word.

    Example: Given the input "heart" and "earth", the function should return true because the letters of "earth" can be rearranged to form "heart".
    b) Also, write a couple of unit tests for the function. Note: They don't have to be traditional unit tests in the sense that they use a testing library; any code that tests the behavior of the function will suffice.
    "heart" and "earth" → true
    "anagram" and "nagaram" → true
    "heartt" and "earthh" → false
*/

function generateCharacterMapping(word) {
    const characterToCharacterCount = {};

    for (let i = 0; i < word.length; i++) {
        const character = word[i];
        const haveWeSeenThisCharacterBefore = characterToCharacterCount[character];

        if (!haveWeSeenThisCharacterBefore) {
            characterToCharacterCount[character] = 0
        }

        characterToCharacterCount[character] += 1;
    }

    return characterToCharacterCount;
}

module.exports.practiceProblem = (s, t) => {
    if (s === t) return true;
    
    if (s.length !== t.length) return false;

    const characterToCharacterCount1 = generateCharacterMapping(s);
    const characterToCharacterCount2 = generateCharacterMapping(t);

    return t.split('').every((character) => {
        const sCharacterCount = characterToCharacterCount1[character];
        const tCharacterCount = characterToCharacterCount2[character];
        const doCharacterCountsMatch = sCharacterCount === tCharacterCount;

        return doCharacterCountsMatch;
    })

}