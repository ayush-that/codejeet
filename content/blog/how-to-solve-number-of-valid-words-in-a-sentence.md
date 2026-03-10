---
title: "How to Solve Number of Valid Words in a Sentence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Valid Words in a Sentence. Easy difficulty, 31.0% acceptance rate. Topics: String."
date: "2028-10-27"
category: "dsa-patterns"
tags: ["number-of-valid-words-in-a-sentence", "string", "easy"]
---

# How to Solve Number of Valid Words in a Sentence

This problem asks us to count how many tokens in a sentence are valid words according to specific rules. While the rules are straightforward, implementing them correctly requires careful attention to edge cases and string validation logic. The challenge lies in handling all the validation conditions simultaneously without missing any edge cases.

## Visual Walkthrough

Let's trace through an example: `"cat and  dog!"`

**Step 1: Split into tokens**
We split by spaces: `["cat", "and", "", "dog!"]`
Notice the empty string from consecutive spaces - we'll need to handle this.

**Step 2: Check each token**

- `"cat"`: Contains only lowercase letters ✓, no digits ✓, at most one hyphen ✓ (none), at most one punctuation ✓ (none), punctuation only at end ✓ (none). **VALID**
- `"and"`: Same as above. **VALID**
- `""`: Empty string - immediately **INVALID**
- `"dog!"`: Contains only lowercase letters before punctuation ✓, no digits ✓, at most one hyphen ✓ (none), at most one punctuation ✓ (1), punctuation only at end ✓ (! at end). **VALID**

**Result:** 3 valid words

## Brute Force Approach

The brute force approach would be to:

1. Split the sentence by spaces
2. For each token, check all validation rules sequentially
3. Count tokens that pass all checks

This is actually the optimal approach for this problem since we must examine every character of every token. The "brute force" here isn't about time complexity but about implementation correctness. A naive implementation might try to use complex regex or skip proper validation of each rule, leading to incorrect results.

The key insight is that we need to validate each token character-by-character, tracking counts of hyphens and punctuation marks, and checking their positions.

## Optimal Solution

We'll implement a solution that:

1. Splits the sentence into tokens
2. For each non-empty token, validates all conditions
3. Returns the count of valid tokens

<div class="code-group">

```python
# Time: O(n) where n is total characters in sentence | Space: O(m) where m is number of tokens
def countValidWords(sentence: str) -> int:
    # Step 1: Split the sentence into tokens
    # We use split() without arguments to handle multiple spaces
    tokens = sentence.split()

    valid_count = 0

    # Step 2: Check each token
    for token in tokens:
        if is_valid_token(token):
            valid_count += 1

    return valid_count

def is_valid_token(token: str) -> bool:
    """
    Validates a single token according to all given rules:
    1. Only lowercase letters, digits, hyphens, punctuation
    2. At most one hyphen, must be between two letters
    3. At most one punctuation, must be at the end
    4. No digits
    """
    n = len(token)
    hyphen_count = 0

    # Step 3: Check each character in the token
    for i, char in enumerate(token):
        # Rule 4: No digits allowed
        if char.isdigit():
            return False

        # Rule 2: Check hyphen
        if char == '-':
            hyphen_count += 1
            # More than one hyphen makes token invalid
            if hyphen_count > 1:
                return False
            # Hyphen must be between two letters
            # Check left neighbor exists and is letter
            if i == 0 or not token[i-1].isalpha():
                return False
            # Check right neighbor exists and is letter
            if i == n-1 or not token[i+1].isalpha():
                return False

        # Rule 3: Check punctuation
        if char in "!.,":
            # Punctuation must be at the end
            if i != n-1:
                return False
            # Only one punctuation allowed (implicitly checked since we return if not at end)

    # All checks passed
    return True
```

```javascript
// Time: O(n) where n is total characters in sentence | Space: O(m) where m is number of tokens
function countValidWords(sentence) {
  // Step 1: Split the sentence into tokens
  // Trim and split by one or more spaces
  const tokens = sentence.trim().split(/\s+/);

  let validCount = 0;

  // Step 2: Check each token
  for (const token of tokens) {
    if (isValidToken(token)) {
      validCount++;
    }
  }

  return validCount;
}

function isValidToken(token) {
  /**
   * Validates a single token according to all given rules:
   * 1. Only lowercase letters, digits, hyphens, punctuation
   * 2. At most one hyphen, must be between two letters
   * 3. At most one punctuation, must be at the end
   * 4. No digits
   */
  const n = token.length;
  let hyphenCount = 0;

  // Step 3: Check each character in the token
  for (let i = 0; i < n; i++) {
    const char = token[i];

    // Rule 4: No digits allowed
    if (char >= "0" && char <= "9") {
      return false;
    }

    // Rule 2: Check hyphen
    if (char === "-") {
      hyphenCount++;
      // More than one hyphen makes token invalid
      if (hyphenCount > 1) {
        return false;
      }
      // Hyphen must be between two letters
      // Check left neighbor exists and is letter
      if (i === 0 || !isLetter(token[i - 1])) {
        return false;
      }
      // Check right neighbor exists and is letter
      if (i === n - 1 || !isLetter(token[i + 1])) {
        return false;
      }
    }

    // Rule 3: Check punctuation
    if (char === "!" || char === "." || char === ",") {
      // Punctuation must be at the end
      if (i !== n - 1) {
        return false;
      }
    }
  }

  // All checks passed
  return true;
}

function isLetter(char) {
  // Helper function to check if character is lowercase letter
  return char >= "a" && char <= "z";
}
```

```java
// Time: O(n) where n is total characters in sentence | Space: O(m) where m is number of tokens
class Solution {
    public int countValidWords(String sentence) {
        // Step 1: Split the sentence into tokens
        // Trim and split by one or more spaces
        String[] tokens = sentence.trim().split("\\s+");

        int validCount = 0;

        // Step 2: Check each token
        for (String token : tokens) {
            if (isValidToken(token)) {
                validCount++;
            }
        }

        return validCount;
    }

    private boolean isValidToken(String token) {
        /**
         * Validates a single token according to all given rules:
         * 1. Only lowercase letters, digits, hyphens, punctuation
         * 2. At most one hyphen, must be between two letters
         * 3. At most one punctuation, must be at the end
         * 4. No digits
         */
        int n = token.length();
        int hyphenCount = 0;

        // Step 3: Check each character in the token
        for (int i = 0; i < n; i++) {
            char c = token.charAt(i);

            // Rule 4: No digits allowed
            if (Character.isDigit(c)) {
                return false;
            }

            // Rule 2: Check hyphen
            if (c == '-') {
                hyphenCount++;
                // More than one hyphen makes token invalid
                if (hyphenCount > 1) {
                    return false;
                }
                // Hyphen must be between two letters
                // Check left neighbor exists and is letter
                if (i == 0 || !Character.isLetter(token.charAt(i-1))) {
                    return false;
                }
                // Check right neighbor exists and is letter
                if (i == n-1 || !Character.isLetter(token.charAt(i+1))) {
                    return false;
                }
            }

            // Rule 3: Check punctuation
            if (c == '!' || c == '.' || c == ',') {
                // Punctuation must be at the end
                if (i != n-1) {
                    return false;
                }
            }
        }

        // All checks passed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the total number of characters in the input sentence. We examine each character exactly once when validating tokens.

**Space Complexity:** O(m) where m is the number of tokens, for storing the split tokens array. In practice, we could optimize to O(1) by processing the sentence character-by-character without splitting, but the split approach is more readable and the problem constraints make this acceptable.

## Common Mistakes

1. **Not handling consecutive spaces correctly**: Using `split(' ')` instead of `split()` (Python) or proper regex splitting (JavaScript/Java) will create empty strings for consecutive spaces, which must be handled or avoided.

2. **Incorrect hyphen validation**: Forgetting to check that hyphens have letters on both sides, or not tracking hyphen count. A token like `"-cat"` or `"cat-"` should be invalid.

3. **Punctuation position error**: Allowing punctuation anywhere in the token instead of only at the end. `"cat!dog"` should be invalid.

4. **Early return on valid punctuation**: Some implementations check punctuation first and return true if found at the end, forgetting to validate the rest of the token for other rules like digits or hyphens.

## When You'll See This Pattern

This problem uses **string validation with multiple constraints**, a common pattern in:

- **Valid Palindrome** (Easy): Validating if a string reads the same forwards and backwards with character constraints
- **Valid Parentheses** (Easy): Validating string structure based on matching pairs
- **String to Integer (atoi)** (Medium): Parsing strings with multiple validation rules and edge cases

The core technique is **iterating through strings while tracking state** (like hyphen count) and **checking multiple conditions simultaneously** without early success returns that skip other validations.

## Key Takeaways

1. **Break complex validation into simple checks**: When faced with multiple rules, implement each as a separate check that can return false immediately if violated.

2. **Track state during iteration**: Use counters (like `hyphenCount`) and position checks (like `i != n-1` for punctuation) to validate rules that depend on counts or positions.

3. **Test edge cases systematically**: Create test cases for each rule boundary - empty tokens, tokens starting/ending with hyphens, multiple punctuation, digits in middle, etc.

Related problems: [Maximum Number of Words Found in Sentences](/problem/maximum-number-of-words-found-in-sentences)
