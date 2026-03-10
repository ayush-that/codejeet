---
title: "How to Solve Unique Morse Code Words — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Unique Morse Code Words. Easy difficulty, 83.6% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-07-24"
category: "dsa-patterns"
tags: ["unique-morse-code-words", "array", "hash-table", "string", "easy"]
---

## How to Solve Unique Morse Code Words

This problem asks us to count how many unique Morse code representations exist for a given list of words. Each letter has a fixed Morse code mapping, and we need to convert each word to its Morse sequence, then count distinct results. While conceptually straightforward, it's an excellent exercise in using hash sets for deduplication and string building efficiency.

**What makes this interesting:** The challenge isn't about complex algorithms but about clean implementation. You need to efficiently map characters, build strings, and track uniqueness—all while handling edge cases like empty words or duplicate results.

## Visual Walkthrough

Let's trace through a concrete example: `words = ["gin", "zen", "gig"]`

**Step 1: Recall Morse mappings (first few letters)**

- a → ".-"
- b → "-..."
- c → "-.-."
- d → "-.."
- e → "."
- f → "..-."
- g → "--."
- h → "...."
- i → ".."
- n → "-."
- z → "--.."

**Step 2: Convert each word**

- "gin" → g("--.") + i("..") + n("-.") → "--...-."
- "zen" → z("--..") + e(".") + n("-.") → "--..-."
- "gig" → g("--.") + i("..") + g("--.") → "--...--."

**Step 3: Collect unique representations**
We have three Morse strings: `"--...-."`, `"--..-."`, `"--...--."`
All three are different, so the answer is **3**.

Notice that if we had `["gin", "gin"]`, both would produce `"--...-."`, counting as only one unique representation.

## Brute Force Approach

A truly brute force approach might try to compare every pair of words by converting them each time we compare, but that's clearly inefficient. However, let's consider what a naive implementation might look like:

1. For each word, convert it to Morse code by looking up each character
2. Store the Morse string in an array
3. Compare every pair of Morse strings to count unique ones

The problem with this approach is the duplicate checking. If we store all Morse strings then manually compare them, we'd need O(n²) comparisons where n is the number of words. For 100 words, that's 10,000 comparisons—not terrible but unnecessary when better tools exist.

The real issue isn't the time complexity (which would still be O(n×L) for conversion plus O(n²) for comparison), but that we're reinventing deduplication logic instead of using the right data structure.

## Optimal Solution

The optimal approach uses a hash set to automatically handle uniqueness. Here's the step-by-step reasoning:

1. **Store Morse mappings**: We need quick access to each letter's Morse code. An array works perfectly since letters are consecutive in ASCII.
2. **Convert each word**: For each character in a word, append its Morse code to a string builder.
3. **Use a set for uniqueness**: After converting a word, add the Morse string to a hash set. Sets automatically ignore duplicates.
4. **Return set size**: The number of unique Morse representations equals the set's size.

The key insight: Hash sets give us O(1) insertion and automatic deduplication, making the entire process O(n×L) where n is word count and L is average word length.

<div class="code-group">

```python
# Time: O(n * L) where n = len(words), L = avg word length
# Space: O(n * L) for storing unique Morse strings
def uniqueMorseRepresentations(words):
    # Morse code mappings for each letter a-z
    morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]

    # Set to store unique Morse code representations
    unique_transformations = set()

    for word in words:
        # Build Morse code for current word
        transformation = []
        for char in word:
            # Convert character to index (a=0, b=1, etc.)
            index = ord(char) - ord('a')
            # Append corresponding Morse code
            transformation.append(morse[index])

        # Join list into string and add to set
        # Sets automatically handle duplicates
        unique_transformations.add(''.join(transformation))

    # Number of unique transformations = set size
    return len(unique_transformations)
```

```javascript
// Time: O(n * L) where n = words.length, L = avg word length
// Space: O(n * L) for storing unique Morse strings
function uniqueMorseRepresentations(words) {
  // Morse code mappings for each letter a-z
  const morse = [
    ".-",
    "-...",
    "-.-.",
    "-..",
    ".",
    "..-.",
    "--.",
    "....",
    "..",
    ".---",
    "-.-",
    ".-..",
    "--",
    "-.",
    "---",
    ".--.",
    "--.-",
    ".-.",
    "...",
    "-",
    "..-",
    "...-",
    ".--",
    "-..-",
    "-.--",
    "--..",
  ];

  // Set to store unique Morse code representations
  const uniqueTransformations = new Set();

  for (const word of words) {
    // Build Morse code for current word
    let transformation = "";
    for (const char of word) {
      // Convert character to index (a=0, b=1, etc.)
      const index = char.charCodeAt(0) - "a".charCodeAt(0);
      // Append corresponding Morse code
      transformation += morse[index];
    }

    // Add to set (automatically handles duplicates)
    uniqueTransformations.add(transformation);
  }

  // Number of unique transformations = set size
  return uniqueTransformations.size;
}
```

```java
// Time: O(n * L) where n = words.length, L = avg word length
// Space: O(n * L) for storing unique Morse strings
public int uniqueMorseRepresentations(String[] words) {
    // Morse code mappings for each letter a-z
    String[] morse = {".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."};

    // Set to store unique Morse code representations
    Set<String> uniqueTransformations = new HashSet<>();

    for (String word : words) {
        // StringBuilder for efficient string concatenation
        StringBuilder transformation = new StringBuilder();

        for (char c : word.toCharArray()) {
            // Convert character to index (a=0, b=1, etc.)
            int index = c - 'a';
            // Append corresponding Morse code
            transformation.append(morse[index]);
        }

        // Add to set (automatically handles duplicates)
        uniqueTransformations.add(transformation.toString());
    }

    // Number of unique transformations = set size
    return uniqueTransformations.size();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × L)**

- `n` = number of words
- `L` = average length of each word
- We process each character exactly once: for each of `n` words, we iterate through `L` characters on average
- Set operations (add, contains) are O(1) on average

**Space Complexity: O(n × L)**

- In the worst case, all words produce unique Morse representations
- Each Morse string has length up to 4×L (since each letter maps to 1-4 Morse symbols)
- The set stores all unique Morse strings
- Additional O(1) space for the Morse mapping array and loop variables

## Common Mistakes

1. **Forgetting character-to-index conversion**: Some candidates try `morse[char]` instead of `morse[ord(char) - ord('a')]`. Remember: arrays use integer indices, not characters.

2. **Inefficient string concatenation**: Using `+=` in a loop in Java or Python without StringBuilder/join creates new strings each time. This makes the solution O(n × L²) instead of O(n × L). Always use StringBuilder (Java), list joining (Python), or array joining (JavaScript).

3. **Not handling empty input**: While the problem guarantees at least one word, in interviews you should mention that `words = []` would return 0. Always check edge cases.

4. **Using a list instead of a set**: Some candidates store all transformations in a list, then try to manually check for duplicates. This leads to O(n²) comparisons. Sets exist precisely for this purpose—use them!

## When You'll See This Pattern

This problem teaches **hashing for uniqueness counting**, a pattern that appears in many problems:

1. **Two Sum (LeetCode #1)**: Uses a hash map to track seen numbers and their indices for O(1) lookups.
2. **Contains Duplicate (LeetCode #217)**: Uses a hash set to detect duplicates in O(n) time.
3. **Group Anagrams (LeetCode #49)**: Uses hash maps with sorted strings or character counts as keys to group similar items.
4. **Jewels and Stones (LeetCode #771)**: Uses a hash set for O(1) jewel lookups while iterating through stones.

The core idea: When you need to track uniqueness, check existence, or group by some transformation, think "hash set" or "hash map."

## Key Takeaways

1. **Hash sets are perfect for uniqueness problems**: If the question asks "how many unique...", immediately consider using a Set data structure for automatic deduplication.

2. **Precompute mappings when possible**: Storing the Morse array once is better than computing mappings on the fly. This applies to any fixed mapping scenario.

3. **Watch string building efficiency**: In languages with immutable strings (Java, Python), use StringBuilder or list joining when building strings in loops to avoid quadratic time complexity.

[Practice this problem on CodeJeet](/problem/unique-morse-code-words)
