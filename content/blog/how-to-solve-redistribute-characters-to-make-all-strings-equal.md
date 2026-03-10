---
title: "How to Solve Redistribute Characters to Make All Strings Equal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Redistribute Characters to Make All Strings Equal. Easy difficulty, 66.8% acceptance rate. Topics: Hash Table, String, Counting."
date: "2026-08-04"
category: "dsa-patterns"
tags:
  ["redistribute-characters-to-make-all-strings-equal", "hash-table", "string", "counting", "easy"]
---

# How to Solve Redistribute Characters to Make All Strings Equal

This problem asks whether we can redistribute characters among multiple strings so that all strings become equal. The key insight is that we can move characters freely between strings, which means the only constraint is whether we have enough of each character type to distribute evenly across all strings. This makes the problem essentially about character frequency counting and divisibility checking.

What makes this problem interesting is that it appears more complex than it actually is. At first glance, you might think about actually simulating character movements or checking string permutations, but the operation's flexibility (moving any character from any position to any other position) simplifies the problem to a pure counting exercise.

## Visual Walkthrough

Let's trace through an example: `words = ["abc", "aabc", "bc"]`

**Step 1: Understand the operation**
We can pick any character from any string and move it to any position in any other string. This means:

- Characters can be freely redistributed among all strings
- The total count of each character across all strings remains constant
- We're only limited by whether we have enough of each character type

**Step 2: Count total characters**
First, let's count all characters across all strings:

- String 1 "abc": a=1, b=1, c=1
- String 2 "aabc": a=2, b=1, c=1
- String 3 "bc": a=0, b=1, c=1
- Total: a=3, b=3, c=3

**Step 3: Check if distribution is possible**
We have 3 strings, so for all strings to be equal, each string must have the same character counts. This means:

- Each character's total count must be divisible by the number of strings (3)
- a=3 is divisible by 3 → each string gets 1 'a'
- b=3 is divisible by 3 → each string gets 1 'b'
- c=3 is divisible by 3 → each string gets 1 'c'

Since all character counts are divisible by 3, we can redistribute to make all strings "abc". The answer is `true`.

**Another example: `words = ["ab", "a"]`**

- Total counts: a=2, b=1
- Number of strings: 2
- a=2 is divisible by 2 ✓
- b=1 is NOT divisible by 2 ✗
- Answer: `false` (we can't give each string the same number of 'b's)

## Brute Force Approach

A naive approach might try to actually simulate the redistribution process or check all possible permutations. For example:

1. Try to make all strings equal to each possible target string
2. For each target, check if we can transform all strings to it by moving characters
3. This would involve complex backtracking or graph search

However, this approach is unnecessarily complex. The brute force would have exponential time complexity because:

- There are n! possible target strings (where n is number of strings)
- For each target, checking feasibility requires comparing character counts
- The actual movement simulation would be even more complex

The key realization is that we don't need to simulate movements at all. Since we can move any character to any position in any string, the only constraint is whether we have enough of each character type to distribute evenly.

## Optimal Solution

The optimal solution is simple but requires understanding the problem's constraints:

1. Count the frequency of each character across all strings
2. Check if each character's total count is divisible by the number of strings
3. If all characters pass this check, return `true`; otherwise `false`

Why does this work?

- We can move characters freely between strings
- The total count of each character is fixed
- For all strings to be equal, each must have the same character composition
- Therefore, each character must be evenly divisible among all strings

<div class="code-group">

```python
# Time: O(N * L) where N = number of strings, L = average length
# Space: O(1) since we only store counts for 26 letters
def makeEqual(words):
    """
    Check if we can redistribute characters to make all strings equal.

    Args:
        words: List of strings to check

    Returns:
        bool: True if redistribution is possible, False otherwise
    """
    n = len(words)

    # Edge case: if there's only 0 or 1 string, they're already equal
    if n <= 1:
        return True

    # Initialize character count array for 26 lowercase letters
    char_count = [0] * 26

    # Count all characters across all strings
    for word in words:
        for char in word:
            # Convert character to index (0-25) and increment count
            char_count[ord(char) - ord('a')] += 1

    # Check if each character count is divisible by number of strings
    for count in char_count:
        # If any character count is not divisible by n, redistribution fails
        if count % n != 0:
            return False

    # All character counts are divisible by n
    return True
```

```javascript
// Time: O(N * L) where N = number of strings, L = average length
// Space: O(1) since we only store counts for 26 letters
function makeEqual(words) {
  /**
   * Check if we can redistribute characters to make all strings equal.
   *
   * @param {string[]} words - Array of strings to check
   * @return {boolean} True if redistribution is possible, False otherwise
   */
  const n = words.length;

  // Edge case: if there's only 0 or 1 string, they're already equal
  if (n <= 1) {
    return true;
  }

  // Initialize character count array for 26 lowercase letters
  const charCount = new Array(26).fill(0);

  // Count all characters across all strings
  for (const word of words) {
    for (const char of word) {
      // Convert character to index (0-25) and increment count
      const index = char.charCodeAt(0) - "a".charCodeAt(0);
      charCount[index]++;
    }
  }

  // Check if each character count is divisible by number of strings
  for (const count of charCount) {
    // If any character count is not divisible by n, redistribution fails
    if (count % n !== 0) {
      return false;
    }
  }

  // All character counts are divisible by n
  return true;
}
```

```java
// Time: O(N * L) where N = number of strings, L = average length
// Space: O(1) since we only store counts for 26 letters
class Solution {
    public boolean makeEqual(String[] words) {
        /**
         * Check if we can redistribute characters to make all strings equal.
         *
         * @param words Array of strings to check
         * @return True if redistribution is possible, False otherwise
         */
        int n = words.length;

        // Edge case: if there's only 0 or 1 string, they're already equal
        if (n <= 1) {
            return true;
        }

        // Initialize character count array for 26 lowercase letters
        int[] charCount = new int[26];

        // Count all characters across all strings
        for (String word : words) {
            for (char c : word.toCharArray()) {
                // Convert character to index (0-25) and increment count
                charCount[c - 'a']++;
            }
        }

        // Check if each character count is divisible by number of strings
        for (int count : charCount) {
            // If any character count is not divisible by n, redistribution fails
            if (count % n != 0) {
                return false;
            }
        }

        // All character counts are divisible by n
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × L)**

- N is the number of strings in the input array
- L is the average length of each string
- We iterate through every character in every string once to count frequencies: O(N × L)
- We then iterate through 26 character counts to check divisibility: O(26) = O(1)
- Total: O(N × L) + O(1) = O(N × L)

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers to store character counts
- This is constant space regardless of input size
- No additional data structures scale with input size

## Common Mistakes

1. **Forgetting the edge case of 0 or 1 string**: When there are 0 or 1 strings, they're trivially equal. Some candidates return false for empty array, but `[]` means all strings (none) are equal.

2. **Overcomplicating with string manipulation**: Candidates sometimes try to actually build the target string or simulate movements. Remember: the problem only asks if it's _possible_, not to actually do it. Counting is sufficient.

3. **Incorrect character indexing**: When using an array for counts, forgetting to subtract 'a' (or equivalent) to get 0-based index. This causes array index out of bounds or incorrect counts.

4. **Not checking all characters**: Some candidates only check characters that appear in the first string or assume only lowercase letters. Always check all 26 possible lowercase letters or use a hash map for general cases.

## When You'll See This Pattern

This problem uses **frequency counting with divisibility checking**, a pattern that appears in many problems:

1. **LeetCode 383: Ransom Note** - Check if magazine has enough of each character to form ransom note (similar counting logic).
2. **LeetCode 242: Valid Anagram** - Check if two strings have identical character counts.
3. **LeetCode 409: Longest Palindrome** - Build longest palindrome from character counts, checking for even/odd distributions.
4. **LeetCode 451: Sort Characters By Frequency** - Sort characters based on their frequency counts.

The core pattern is: when operations allow free redistribution or rearrangement, the problem often reduces to checking frequency counts and divisibility conditions rather than simulating the actual process.

## Key Takeaways

1. **Look for simplification opportunities**: When operations are very flexible (like moving any character anywhere), the problem often reduces to simple counting rather than complex simulation.

2. **Divisibility is key for equal distribution**: When you need to distribute items evenly among multiple groups, check if the total count of each item type is divisible by the number of groups.

3. **Constant space with fixed alphabet**: For problems with lowercase English letters, a 26-element array is more efficient than a hash map. Know when to use each: array for fixed known alphabet, hash map for arbitrary characters.

[Practice this problem on CodeJeet](/problem/redistribute-characters-to-make-all-strings-equal)
