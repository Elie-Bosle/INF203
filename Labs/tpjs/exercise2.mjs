"use strict";

export function wc(inputStr) {
    // Supprimer la ponctuation et ne pas tenir compte des majuscules
    inputStr = inputStr.replace(/[^\w\s]/gi, '').toLowerCase();
    const words = inputStr.split(' ');
    const wordCounts = {};
    for (const word of words) {
        if (wordCounts[word]) {
            wordCounts[word]++;
        } else {
            wordCounts[word] = 1;
        }
    }
    return wordCounts;
}

export class WordList {
    constructor(w) {
        this.w = w;
    }

    getWords() {
        let inputStr = this.w.replace(/[^\w\s]/gi, '').toLowerCase();
        const words = [...new Set(inputStr.split(' '))];
        return words.sort();
    }

    maxCountWord() {
        const words = this.getWords();
        const component = this.w.split(" ");
        const wordCounts = {};
        for (const word of words) {
            wordCounts[word] = 0
            for (let i = 0; i < component.length; i++) {
                if (word == component[i]) {
                    wordCounts[word]++;
                }
            }
        }
        let maxCountWord = words[0];
        let maxCount = 0;
        for (const word of words) {
            if (wordCounts[word] > maxCount) {
                maxCount = wordCounts[word];
                maxCountWord = word;
            }
        }
        return maxCountWord;
    }

    minCountWord() {
        const words = this.getWords();
        const component = this.w.split(" ");
        const wordCounts = {};
        for (const word of words) {
            wordCounts[word] = 0
            for (let i = 0; i < component.length; i++) {
                if (word == component[i]) {
                    wordCounts[word]++;
                }
            }
        }
        let minCountWord = words[0];
        let minCount = component.length;
        for (const word of words) {
            if (wordCounts[word] < minCount) {
                minCount = wordCounts[word];
                minCountWord = word;
            }
        }
        return minCountWord;
    }

    getCount(word) {
        const words = this.getWords();
        let count = 0
        for (const str of words) {
            if (str === word) {
                count += 1;
            }
        }
        return count;
    }

    applyWordFunc(f) {
        const words = this.getWords();
        const results = [];
        for (const word of words) {
            const result = f(word);
            results.push(result);
        }

        return results;
    }
}