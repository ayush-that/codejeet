---
title: "How to Solve Circular Sentence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Circular Sentence. Easy difficulty, 70.2% acceptance rate. Topics: String."
date: "2026-02-28"
category: "dsa-patterns"
tags: ["circular-sentence", "string", "easy"]
---

# How to Solve Circular Sentence

A circular sentence is one where the last character of each word matches the first character of the next word, and the last character of the final word matches the first character of the first word. The challenge lies in handling the circular nature while efficiently checking character matches between words. What makes this problem interesting is that it appears simple but requires careful attention to boundary conditions and string manipulation.

## Visual Walkthrough

Let's trace through the example `"leetcode exercises sound delightful"`:

1. **Split into words**: `["leetcode", "exercises", "sound", "delightful"]`
2. **Check adjacent words**:
   - `"leetcode"` ends with `'e'`, `"exercises"` starts with `'e'` → ✅
   - `"exercises"` ends with `'s'`, `"sound"` starts with `'s'` → ✅
   - `"sound"` ends with `'d'`, `"delightful"` starts with `'d'` → ✅
3. **Check circular condition**:
   - Last word `"delightful"` ends with `'l'`
   - First word `"leetcode"` starts with `'l'` → ✅

Since all checks pass, this is a circular sentence.

Now let's examine a failing example `"Leetcode is cool"`:

1. **Split into words**: `["Leetcode", "is", "cool"]`
2. **Check adjacent words**:
   - `"Leetcode"` ends with `'e'`, `"is"` starts with `'i'` → ❌ (already fails here)
3. No need to check further - this is not a circular sentence.

## Brute Force Approach

The most straightforward approach would be to:

1. Split the sentence into words
2. For each word, compare its last character with the first character of the next word
3. Also compare the last character of the last word with the first character of the first word

While this approach is actually optimal for this problem (O(n) time), let's consider what a truly naive approach might look like:

A candidate might try to avoid splitting the string and instead iterate through characters, looking for spaces to identify word boundaries. This approach is error-prone because:

- It requires careful tracking of word boundaries
- It's easy to make off-by-one errors
- It doesn't simplify the problem compared to splitting

The string splitting approach is cleaner and less error-prone, so we'll use that as our solution.

## Optimal Solution

The optimal solution splits the sentence into words, then checks two conditions:

1. For each adjacent pair of words, the last character of the first word equals the first character of the second word
2. The last character of the final word equals the first character of the first word

We can combine these checks in a single loop by using modulo arithmetic to handle the circular nature.

<div class="code-group">

```python
# Time: O(n) where n is the length of the sentence
# Space: O(m) where m is the number of words (for the words list)
def isCircularSentence(sentence: str) -> bool:
    # Step 1: Split the sentence into individual words
    # The split() method divides the string at spaces, giving us a list of words
    words = sentence.split()

    # Step 2: Get the number of words for easy reference
    n = len(words)

    # Step 3: Check each word against the next word in circular fashion
    for i in range(n):
        # Current word
        current_word = words[i]
        # Next word (wrapping around using modulo for the last word)
        next_word = words[(i + 1) % n]

        # Step 4: Compare last character of current word with first character of next word
        # We need to ensure the sentence flows smoothly from word to word
        if current_word[-1] != next_word[0]:
            return False

    # Step 5: If all checks pass, the sentence is circular
    return True
```

```javascript
// Time: O(n) where n is the length of the sentence
// Space: O(m) where m is the number of words (for the words array)
function isCircularSentence(sentence) {
  // Step 1: Split the sentence into individual words
  // The split(' ') method divides the string at spaces, giving us an array of words
  const words = sentence.split(" ");

  // Step 2: Get the number of words for easy reference
  const n = words.length;

  // Step 3: Check each word against the next word in circular fashion
  for (let i = 0; i < n; i++) {
    // Current word
    const currentWord = words[i];
    // Next word (wrapping around using modulo for the last word)
    const nextWord = words[(i + 1) % n];

    // Step 4: Compare last character of current word with first character of next word
    // We need to ensure the sentence flows smoothly from word to word
    if (currentWord[currentWord.length - 1] !== nextWord[0]) {
      return false;
    }
  }

  // Step 5: If all checks pass, the sentence is circular
  return true;
}
```

```java
// Time: O(n) where n is the length of the sentence
// Space: O(m) where m is the number of words (for the words array)
public boolean isCircularSentence(String sentence) {
    // Step 1: Split the sentence into individual words
    // The split(" ") method divides the string at spaces, giving us an array of words
    String[] words = sentence.split(" ");

    // Step 2: Get the number of words for easy reference
    int n = words.length;

    // Step 3: Check each word against the next word in circular fashion
    for (int i = 0; i < n; i++) {
        // Current word
        String currentWord = words[i];
        // Next word (wrapping around using modulo for the last word)
        String nextWord = words[(i + 1) % n];

        // Step 4: Compare last character of current word with first character of next word
        // We need to ensure the sentence flows smoothly from word to word
        if (currentWord.charAt(currentWord.length() - 1) != nextWord.charAt(0)) {
            return false;
        }
    }

    // Step 5: If all checks pass, the sentence is circular
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the sentence takes O(n) time where n is the length of the sentence
- The loop runs through all words once, performing constant-time operations for each word
- Total time is linear with respect to the input size

**Space Complexity: O(m)**

- We store the list of words, which takes O(m) space where m is the number of words
- In the worst case, if each word is a single character, m ≈ n/2, so space is O(n)
- We could optimize to O(1) extra space by not storing all words, but the current approach is more readable

## Common Mistakes

1. **Forgetting the circular check**: Only checking adjacent words without checking that the last word connects back to the first word. The modulo operation `(i + 1) % n` elegantly handles this.

2. **Off-by-one errors with string indices**: Using `word.length()` instead of `word.length() - 1` to get the last character. Remember that string indices are zero-based.

3. **Not handling single-word sentences**: A single word like `"hello"` should return `True` if the first and last characters match. Our solution handles this correctly because when `n = 1`, `(i + 1) % n = 0`, so we compare the word with itself.

4. **Case sensitivity issues**: The problem states that uppercase and lowercase letters are different. `'A' != 'a'`, so we must do exact character comparisons without case conversion.

## When You'll See This Pattern

The circular checking pattern with modulo arithmetic appears in several types of problems:

1. **Circular array problems**: Problems like [Defuse the Bomb](/problem/defuse-the-bomb) where you need to traverse an array circularly. The modulo operation helps wrap around to the beginning.

2. **Rotation problems**: Checking if one string is a rotation of another often involves concatenating the string with itself and searching.

3. **Circular linked lists**: When you need to traverse a circular structure, the "current = next" with a termination condition pattern is similar.

4. **Game simulation problems**: Many board games or circular elimination games use similar modulo arithmetic to handle wrap-around.

## Key Takeaways

1. **Modulo arithmetic is powerful for circular structures**: When you need to handle wrap-around conditions, `(i + 1) % n` gives you the next index in a circular fashion.

2. **Split complex strings into components**: When working with sentences or structured text, splitting into words or tokens often simplifies the logic.

3. **Check edge cases systematically**: Single-element cases, empty inputs, and boundary conditions often reveal bugs in circular logic.

4. **The problem difficulty can be misleading**: Even "Easy" problems require careful attention to detail, especially with boundary conditions and circular logic.

Related problems: [Defuse the Bomb](/problem/defuse-the-bomb)
