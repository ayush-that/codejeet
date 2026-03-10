---
title: "How to Solve Detect Capital — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Detect Capital. Easy difficulty, 56.5% acceptance rate. Topics: String."
date: "2027-04-11"
category: "dsa-patterns"
tags: ["detect-capital", "string", "easy"]
---

# How to Solve Detect Capital

This problem asks us to determine if a word uses capital letters correctly according to three specific rules: all uppercase, all lowercase, or only first letter uppercase. While conceptually simple, this problem tests your ability to handle string validation with clear logical conditions and edge cases. The challenge lies in implementing the logic cleanly without overcomplicating it.

## Visual Walkthrough

Let's trace through some examples to build intuition:

**Example 1: "USA"**

- Check all letters: 'U', 'S', 'A' are all uppercase
- This matches rule 1 (all capitals)
- ✅ Valid

**Example 2: "leetcode"**

- Check all letters: 'l', 'e', 'e', 't', 'c', 'o', 'd', 'e' are all lowercase
- This matches rule 2 (all lowercase)
- ✅ Valid

**Example 3: "Google"**

- Check first letter: 'G' is uppercase
- Check remaining letters: 'o', 'o', 'g', 'l', 'e' are all lowercase
- This matches rule 3 (only first letter capital)
- ✅ Valid

**Example 4: "FlaG"**

- Check first letter: 'F' is uppercase
- Check remaining letters: 'l', 'a' are lowercase, but 'G' is uppercase
- This doesn't match rule 3 (not all remaining letters lowercase)
- Check if all letters uppercase? No ('l', 'a' are lowercase)
- Check if all letters lowercase? No ('F', 'G' are uppercase)
- ❌ Invalid

**Example 5: "aBC"**

- Check first letter: 'a' is lowercase
- Check if all letters lowercase? No ('B', 'C' are uppercase)
- Check if all letters uppercase? No ('a' is lowercase)
- ❌ Invalid

The pattern emerges: we need to check three specific conditions and return true if any one of them is satisfied.

## Brute Force Approach

A naive approach might check each condition separately by scanning the string multiple times:

1. Check if all characters are uppercase (scan once)
2. Check if all characters are lowercase (scan once)
3. Check if first character is uppercase and rest are lowercase (scan twice)

While this would work, it's inefficient with up to 4 passes through the string. More importantly, it's not the cleanest solution. A better approach counts the capital letters and uses that count to determine validity with a single pass.

## Optimal Solution

The optimal solution counts how many capital letters are in the word, then uses logic based on the count and position to determine validity:

- If count == 0: all lowercase (valid)
- If count == len(word): all uppercase (valid)
- If count == 1 and first character is uppercase: only first letter capital (valid)
- Otherwise: invalid

This approach requires only one pass through the string and uses simple integer comparison.

<div class="code-group">

```python
# Time: O(n) where n is length of word | Space: O(1)
def detectCapitalUse(word: str) -> bool:
    """
    Determines if a word uses capital letters correctly.

    Rules:
    1. All letters uppercase (e.g., "USA")
    2. All letters lowercase (e.g., "leetcode")
    3. Only first letter uppercase (e.g., "Google")

    Approach: Count capital letters and check conditions.
    """
    # Count how many capital letters are in the word
    capital_count = 0
    for char in word:
        if char.isupper():
            capital_count += 1

    # Case 1: All letters are capital (count equals length)
    # Case 2: No capital letters (count equals 0)
    # Case 3: Only first letter is capital (count equals 1 AND first char is uppercase)
    return (capital_count == len(word) or
            capital_count == 0 or
            (capital_count == 1 and word[0].isupper()))
```

```javascript
// Time: O(n) where n is length of word | Space: O(1)
/**
 * Determines if a word uses capital letters correctly.
 *
 * Rules:
 * 1. All letters uppercase (e.g., "USA")
 * 2. All letters lowercase (e.g., "leetcode")
 * 3. Only first letter uppercase (e.g., "Google")
 *
 * Approach: Count capital letters and check conditions.
 */
function detectCapitalUse(word) {
  // Count how many capital letters are in the word
  let capitalCount = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === word[i].toUpperCase()) {
      capitalCount++;
    }
  }

  // Case 1: All letters are capital (count equals length)
  // Case 2: No capital letters (count equals 0)
  // Case 3: Only first letter is capital (count equals 1 AND first char is uppercase)
  return (
    capitalCount === word.length ||
    capitalCount === 0 ||
    (capitalCount === 1 && word[0] === word[0].toUpperCase())
  );
}
```

```java
// Time: O(n) where n is length of word | Space: O(1)
/**
 * Determines if a word uses capital letters correctly.
 *
 * Rules:
 * 1. All letters uppercase (e.g., "USA")
 * 2. All letters lowercase (e.g., "leetcode")
 * 3. Only first letter uppercase (e.g., "Google")
 *
 * Approach: Count capital letters and check conditions.
 */
public boolean detectCapitalUse(String word) {
    // Count how many capital letters are in the word
    int capitalCount = 0;
    for (int i = 0; i < word.length(); i++) {
        if (Character.isUpperCase(word.charAt(i))) {
            capitalCount++;
        }
    }

    // Case 1: All letters are capital (count equals length)
    // Case 2: No capital letters (count equals 0)
    // Case 3: Only first letter is capital (count equals 1 AND first char is uppercase)
    return (capitalCount == word.length() ||
            capitalCount == 0 ||
            (capitalCount == 1 && Character.isUpperCase(word.charAt(0))));
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input word. We make a single pass through the string to count capital letters, then perform constant-time comparisons.

**Space Complexity:** O(1) for all implementations. We only use a few integer variables and don't create any data structures proportional to the input size.

## Common Mistakes

1. **Forgetting to check the first character in case 3:** Some candidates check `capital_count == 1` but forget to verify that the single capital is actually the first character. Words like "aBc" would incorrectly pass without this check.

2. **Overcomplicating with multiple passes:** Beginners might write separate loops for each condition, resulting in O(3n) time instead of O(n). The single-pass counting approach is cleaner and more efficient.

3. **Incorrect handling of empty string:** While the problem constraints guarantee non-empty strings, in interviews you might be asked about edge cases. An empty string should return true (vacuously satisfies all rules).

4. **Using regex without understanding:** Some candidates might try to use regex like `^[A-Z]*$|^[a-z]*$|^[A-Z][a-z]*$` which works but is harder to explain in an interview and doesn't demonstrate algorithmic thinking.

## When You'll See This Pattern

This problem teaches **conditional validation with counting** - a pattern where you count occurrences of something, then use that count to make decisions based on thresholds or specific values.

Similar problems include:

- **Capitalize the Title (LeetCode 2129)**: Requires applying capitalization rules based on word length, similar conditional logic.
- **Valid Palindrome (LeetCode 125)**: Validates strings against specific rules (reads same forward/backward ignoring case/punctuation).
- **Valid Parentheses (LeetCode 20)**: Uses counting/stack to validate string against matching rules.

The core pattern appears whenever you need to validate if data follows specific formatting rules, especially with "all or nothing" or "first element special" conditions.

## Key Takeaways

1. **Count and compare** is a powerful technique for validation problems. Instead of checking multiple conditions separately, count relevant features and use the count to determine validity.

2. **Boolean logic simplification**: The three conditions can be elegantly combined into a single return statement using OR operations, making the code clean and readable.

3. **Edge case awareness**: Always consider what happens with the first character, single-character words, and mixed cases. Testing with examples like "A", "a", "Aa", "aA" helps catch logic errors.

Related problems: [Capitalize the Title](/problem/capitalize-the-title), [Count the Number of Special Characters II](/problem/count-the-number-of-special-characters-ii), [Count the Number of Special Characters I](/problem/count-the-number-of-special-characters-i)
