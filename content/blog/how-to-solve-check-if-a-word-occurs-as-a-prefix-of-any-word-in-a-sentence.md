---
title: "How to Solve Check If a Word Occurs As a Prefix of Any Word in a Sentence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If a Word Occurs As a Prefix of Any Word in a Sentence. Easy difficulty, 68.8% acceptance rate. Topics: Two Pointers, String, String Matching."
date: "2028-06-10"
category: "dsa-patterns"
tags:
  [
    "check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence",
    "two-pointers",
    "string",
    "string-matching",
    "easy",
  ]
---

# How to Solve "Check If a Word Occurs As a Prefix of Any Word in a Sentence"

This problem asks us to check if a given `searchWord` appears as a prefix of any word in a sentence, and if so, return the **1-indexed** position of that word. While conceptually straightforward, it tests your ability to handle string operations, boundary conditions, and careful indexing—all common pitfalls in coding interviews.

What makes this problem interesting is the need to correctly parse words from the sentence while efficiently checking prefixes without unnecessary string copying. The single-space separation between words simplifies parsing, but you still need to handle edge cases like the search word being longer than any word in the sentence.

## Visual Walkthrough

Let's trace through an example step by step to build intuition:

**Input:** `sentence = "i love eating burger"`, `searchWord = "burg"`

**Step 1:** Split the sentence into words: `["i", "love", "eating", "burger"]`

**Step 2:** Check each word starting from the first (index 0 in code, but we'll return 1-indexed):

- Word 1: `"i"` → Does `"burg"` start with `"i"`? No.
- Word 2: `"love"` → Does `"burg"` start with `"love"`? No.
- Word 3: `"eating"` → Does `"burg"` start with `"eating"`? No.
- Word 4: `"burger"` → Does `"burger"` start with `"burg"`? Yes!

**Step 3:** Since we found a match at the 4th word (1-indexed), we return `4`.

**Key insight:** We need to check if `searchWord` is a **prefix** of each word, not if it appears anywhere in the word. For example, if `searchWord = "urg"`, it would NOT match `"burger"` because `"burger"` doesn't start with `"urg"`.

## Brute Force Approach

The most straightforward approach is to:

1. Split the sentence into words using the single space as delimiter
2. Iterate through each word with its index
3. For each word, check if it starts with the search word
4. Return the 1-indexed position if found, otherwise return -1

While this is actually the optimal approach for this problem (O(n) time, O(n) space), let's consider what a truly naive approach might look like and why it would fail:

A candidate might try to avoid splitting the sentence by scanning character by character, but this gets messy with word boundaries. Another naive approach would be to create all possible prefixes of each word, which would be O(n²) in the worst case where words are long.

The key insight is that we don't need to generate all prefixes—we just need to check if `searchWord` matches the beginning of each word, which we can do efficiently with built-in string methods or manual character comparison.

## Optimal Solution

The optimal solution splits the sentence into words and checks each word's prefix. Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n) where n is the length of the sentence
# Space: O(n) for storing the split words
def isPrefixOfWord(sentence: str, searchWord: str) -> int:
    # Step 1: Split the sentence into individual words
    # The split() method without arguments splits on whitespace
    words = sentence.split()

    # Step 2: Iterate through each word with its index
    # We use enumerate to get both index and word
    for i, word in enumerate(words):
        # Step 3: Check if searchWord is a prefix of the current word
        # The startswith() method efficiently checks prefixes
        if word.startswith(searchWord):
            # Step 4: Return 1-indexed position if found
            # i is 0-indexed, so add 1 for 1-indexed result
            return i + 1

    # Step 5: If no match found, return -1
    return -1
```

```javascript
// Time: O(n) where n is the length of the sentence
// Space: O(n) for storing the split words
function isPrefixOfWord(sentence, searchWord) {
  // Step 1: Split the sentence into individual words
  // split(' ') splits on single spaces (multiple spaces would need trim)
  const words = sentence.split(" ");

  // Step 2: Iterate through each word with its index
  for (let i = 0; i < words.length; i++) {
    // Step 3: Check if searchWord is a prefix of the current word
    // startsWith() efficiently checks prefixes
    if (words[i].startsWith(searchWord)) {
      // Step 4: Return 1-indexed position if found
      // i is 0-indexed, so add 1 for 1-indexed result
      return i + 1;
    }
  }

  // Step 5: If no match found, return -1
  return -1;
}
```

```java
// Time: O(n) where n is the length of the sentence
// Space: O(n) for storing the split words
class Solution {
    public int isPrefixOfWord(String sentence, String searchWord) {
        // Step 1: Split the sentence into individual words
        // split(" ") splits on single spaces
        String[] words = sentence.split(" ");

        // Step 2: Iterate through each word with its index
        for (int i = 0; i < words.length; i++) {
            // Step 3: Check if searchWord is a prefix of the current word
            // startsWith() efficiently checks prefixes
            if (words[i].startsWith(searchWord)) {
                // Step 4: Return 1-indexed position if found
                // i is 0-indexed, so add 1 for 1-indexed result
                return i + 1;
            }
        }

        // Step 5: If no match found, return -1
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the sentence takes O(n) where n is the length of the sentence
- Iterating through words takes O(m) where m is the number of words
- Each `startsWith()` check takes O(k) where k is the length of `searchWord`
- In the worst case, we check all words, so total is O(n + m*k), which simplifies to O(n) since n ≥ m*k

**Space Complexity: O(n)**

- Storing the split words array requires O(n) space
- We could optimize to O(1) extra space by scanning the sentence without splitting, but the code would be more complex and error-prone

## Common Mistakes

1. **Forgetting 1-indexing**: The problem specifies returning the **1-indexed** position of the word. A common mistake is returning the 0-indexed position directly. Always remember to add 1 to your loop index when returning.

2. **Incorrect prefix checking**: Some candidates might use `in` operator (Python) or `includes()` (JavaScript) instead of `startswith()`/`startsWith()`. This would incorrectly match the search word anywhere in the word, not just as a prefix. For example, `"urg"` would match `"burger"` even though it's not a prefix.

3. **Not handling empty searchWord**: While the problem constraints likely prevent this, in a real interview you might be asked about edge cases. An empty string is technically a prefix of every string, so the first word (position 1) should be returned.

4. **Assuming multiple spaces between words**: The problem states "single space" between words, but in practice, you should clarify this. If there could be multiple spaces, you'd need to use `split()` without arguments in Python or `trim()` in JavaScript/Java before splitting.

## When You'll See This Pattern

This problem demonstrates **string prefix matching**, a common pattern in:

1. **Autocomplete systems**: Checking if user input matches the beginning of dictionary words
2. **Search engines**: Finding documents where query terms appear as prefixes of indexed terms
3. **Trie data structures**: Prefix trees are specifically designed for efficient prefix matching

**Related LeetCode problems:**

- **Counting Words With a Given Prefix**: Direct extension where you count how many words have the given prefix
- **Count Prefixes of a Given String**: Similar but checks if words are prefixes of the given string (reverse of this problem)
- **Implement Trie (Prefix Tree)**: Teaches the underlying data structure for efficient prefix operations

## Key Takeaways

1. **Use the right string method**: For prefix checking, always use `startswith()`/`startsWith()` rather than `in`/`includes()` or manual substring extraction which can be error-prone with index bounds.

2. **Pay attention to indexing requirements**: Interview problems often use 1-indexing for results while programming languages use 0-indexing. Always check the problem statement and add/subtract 1 as needed.

3. **Simple problems test attention to detail**: Even "Easy" problems like this one test your ability to handle edge cases, use appropriate methods, and follow specifications precisely—skills that matter in real-world coding.

**Related problems:** [Counting Words With a Given Prefix](/problem/counting-words-with-a-given-prefix), [Count Prefixes of a Given String](/problem/count-prefixes-of-a-given-string)
