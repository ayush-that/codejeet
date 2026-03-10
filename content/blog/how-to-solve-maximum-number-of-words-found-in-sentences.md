---
title: "How to Solve Maximum Number of Words Found in Sentences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Number of Words Found in Sentences. Easy difficulty, 86.7% acceptance rate. Topics: Array, String."
date: "2027-07-28"
category: "dsa-patterns"
tags: ["maximum-number-of-words-found-in-sentences", "array", "string", "easy"]
---

# How to Solve Maximum Number of Words Found in Sentences

This problem asks us to find the sentence with the most words in an array of sentences. While it's straightforward, it's an excellent warm-up for string processing and array iteration that tests attention to detail. The key challenge is correctly counting words in each sentence while handling edge cases efficiently.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `sentences = ["hello world", "this is a test", "single"]`

**Step 1:** Process first sentence `"hello world"`

- Words are separated by single spaces
- Count spaces: 1 space → 2 words (spaces + 1)
- Current maximum: 2

**Step 2:** Process second sentence `"this is a test"`

- Count spaces: 3 spaces → 4 words
- Update maximum: 4 (since 4 > 2)

**Step 3:** Process third sentence `"single"`

- Count spaces: 0 spaces → 1 word
- Maximum remains: 4

**Output:** 4

The pattern is clear: **number of words = number of spaces + 1** for any non-empty sentence.

## Brute Force Approach

The most straightforward approach is to split each sentence into words and count them:

1. Initialize `max_words = 0`
2. For each sentence in the array:
   - Split the sentence by spaces using `split()` method
   - Count the resulting array length
   - Update `max_words` if this count is larger
3. Return `max_words`

While this works perfectly fine for this problem (and is actually optimal), let's consider what makes it "brute force" in the context of interview thinking:

- **Splitting creates new arrays** for each sentence, which uses extra memory
- **String splitting has overhead** - it needs to scan the entire string and allocate memory
- A more memory-efficient approach would count spaces directly without creating word arrays

However, for this specific problem, the split approach is clean, readable, and acceptable since the constraints are small. The "optimization" would be counting spaces manually, which we'll show in the optimal solution.

## Optimal Solution

The optimal solution counts spaces in each sentence instead of splitting, which saves memory by avoiding creating word arrays. We iterate through each character and count spaces, then calculate words as `spaces + 1`.

<div class="code-group">

```python
# Time: O(n * m) where n = number of sentences, m = average sentence length
# Space: O(1) - we only use a few variables
def mostWordsFound(sentences):
    """
    Find the maximum number of words in any sentence.

    Args:
        sentences: List of strings where each string is a sentence

    Returns:
        Maximum word count found in any sentence
    """
    max_words = 0  # Track the maximum words found so far

    # Iterate through each sentence in the array
    for sentence in sentences:
        space_count = 0  # Count spaces in current sentence

        # Count spaces by iterating through each character
        for char in sentence:
            if char == ' ':  # Found a space between words
                space_count += 1

        # Words = spaces + 1 (e.g., "a b" has 1 space, 2 words)
        current_words = space_count + 1

        # Update maximum if current sentence has more words
        if current_words > max_words:
            max_words = current_words

    return max_words
```

```javascript
// Time: O(n * m) where n = number of sentences, m = average sentence length
// Space: O(1) - constant extra space used
function mostWordsFound(sentences) {
  /**
   * Find the maximum number of words in any sentence.
   *
   * @param {string[]} sentences - Array of sentences
   * @return {number} Maximum word count found in any sentence
   */
  let maxWords = 0; // Track the maximum words found so far

  // Iterate through each sentence in the array
  for (let sentence of sentences) {
    let spaceCount = 0; // Count spaces in current sentence

    // Count spaces by iterating through each character
    for (let char of sentence) {
      if (char === " ") {
        // Found a space between words
        spaceCount++;
      }
    }

    // Words = spaces + 1 (e.g., "a b" has 1 space, 2 words)
    const currentWords = spaceCount + 1;

    // Update maximum if current sentence has more words
    if (currentWords > maxWords) {
      maxWords = currentWords;
    }
  }

  return maxWords;
}
```

```java
// Time: O(n * m) where n = number of sentences, m = average sentence length
// Space: O(1) - constant extra space used
class Solution {
    public int mostWordsFound(String[] sentences) {
        /**
         * Find the maximum number of words in any sentence.
         *
         * @param sentences Array of sentences
         * @return Maximum word count found in any sentence
         */
        int maxWords = 0;  // Track the maximum words found so far

        // Iterate through each sentence in the array
        for (String sentence : sentences) {
            int spaceCount = 0;  // Count spaces in current sentence

            // Count spaces by iterating through each character
            for (int i = 0; i < sentence.length(); i++) {
                if (sentence.charAt(i) == ' ') {  // Found a space between words
                    spaceCount++;
                }
            }

            // Words = spaces + 1 (e.g., "a b" has 1 space, 2 words)
            int currentWords = spaceCount + 1;

            // Update maximum if current sentence has more words
            if (currentWords > maxWords) {
                maxWords = currentWords;
            }
        }

        return maxWords;
    }
}
```

</div>

**Alternative using split() method (cleaner but uses more memory):**

<div class="code-group">

```python
def mostWordsFound(sentences):
    max_words = 0
    for sentence in sentences:
        # Split by space and count words
        word_count = len(sentence.split())
        max_words = max(max_words, word_count)
    return max_words
```

```javascript
function mostWordsFound(sentences) {
  let maxWords = 0;
  for (let sentence of sentences) {
    // Split by space and count words
    const wordCount = sentence.split(" ").length;
    maxWords = Math.max(maxWords, wordCount);
  }
  return maxWords;
}
```

```java
class Solution {
    public int mostWordsFound(String[] sentences) {
        int maxWords = 0;
        for (String sentence : sentences) {
            // Split by space and count words
            String[] words = sentence.split(" ");
            maxWords = Math.max(maxWords, words.length);
        }
        return maxWords;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- `n` = number of sentences in the array
- `m` = average length of each sentence
- We examine every character in every sentence exactly once
- Even with the split approach, we still process each character during the split operation

**Space Complexity:** O(1) for the space-counting approach

- We only use a few integer variables (`max_words`, `space_count`, `current_words`)
- No additional data structures that grow with input size
- The split approach uses O(m) space temporarily for each sentence's word array

## Common Mistakes

1. **Forgetting the +1 when converting spaces to words**
   - A sentence with 3 spaces has 4 words, not 3
   - Always remember: `words = spaces + 1`
   - **Fix:** Double-check this formula with simple test cases like `"a"` (0 spaces, 1 word)

2. **Assuming sentences can have multiple consecutive spaces**
   - The problem states: "separated by a single space with no leading or trailing spaces"
   - This guarantee simplifies counting - we don't need to handle edge cases like `"hello  world"` (two spaces)
   - **Fix:** Read problem constraints carefully before over-engineering

3. **Using split() without considering empty sentences**
   - While the problem guarantees non-empty sentences, in real interviews you might need to handle `""`
   - `"".split()` returns `[""]` in Python (length 1), but `"".split(" ")` returns `[""]` in JavaScript
   - **Fix:** Consider edge cases even if not explicitly mentioned

4. **Initializing max_words incorrectly**
   - Starting with `max_words = 0` works since all sentences have at least 1 word
   - But if sentences could be empty, you'd need different initialization
   - **Fix:** Consider what happens with the smallest possible valid input

## When You'll See This Pattern

This problem teaches **character-level iteration with counting**, a fundamental pattern for:

1. **String processing problems** - Counting specific characters or patterns
   - _Example:_ [Number of Valid Words in a Sentence](/problem/number-of-valid-words-in-a-sentence) - Similar character-by-character validation
   - _Example:_ [Maximum Repeating Substring](https://leetcode.com/problems/maximum-repeating-substring/) - Pattern matching within strings

2. **Array aggregation problems** - Finding maximum/minimum across elements
   - _Example:_ [Find Numbers with Even Number of Digits](https://leetcode.com/problems/find-numbers-with-even-number-of-digits/) - Counting digits in each number
   - _Example:_ [Richest Customer Wealth](https://leetcode.com/problems/richest-customer-wealth/) - Similar max-finding pattern but with sums

3. **Warm-up problems** - Simple iterations to build confidence
   - Many array/string problems start with this basic iteration + counting pattern before adding complexity

## Key Takeaways

1. **Simple counting problems often have O(n × m) time complexity** when processing nested structures (array of strings). Recognize this pattern when you see "for each element, process its contents."

2. **Character-level iteration is more memory-efficient than splitting** when you only need counts, not the actual substrings. Use splitting when you need the words themselves; count spaces when you only need the count.

3. **Always verify the formula** with edge cases. For word counting: empty string (0 words), single word (0 spaces, 1 word), two words (1 space, 2 words). This prevents off-by-one errors.

Related problems: [Number of Valid Words in a Sentence](/problem/number-of-valid-words-in-a-sentence)
