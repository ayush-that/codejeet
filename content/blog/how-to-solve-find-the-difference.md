---
title: "How to Solve Find the Difference — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Difference. Easy difficulty, 60.1% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Sorting."
date: "2026-10-04"
category: "dsa-patterns"
tags: ["find-the-difference", "hash-table", "string", "bit-manipulation", "easy"]
---

# How to Solve Find the Difference

You're given two strings: `s` and `t`. String `t` is created by randomly shuffling `s` and then adding exactly one extra character at a random position. Your task is to identify and return that extra character. What makes this problem interesting is that it appears in several variations across coding interviews and teaches fundamental techniques for finding differences between collections.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `s = "abcd"`
- `t = "abcde"`

String `t` is just `s` shuffled with one extra letter added. In this case, `t` contains all letters from `s` plus the letter `'e'`.

**Step-by-step thinking:**

1. Both strings contain characters, but `t` has exactly one more character than `s`
2. If we could somehow "cancel out" all the characters that appear in both strings, we'd be left with the extra character
3. One approach: sort both strings and compare character by character
   - Sorted `s`: `"abcd"`
   - Sorted `t`: `"abcde"`
   - Compare: `'a'` vs `'a'` ✓, `'b'` vs `'b'` ✓, `'c'` vs `'c'` ✓, `'d'` vs `'d'` ✓
   - At position 4: `s` has no character, `t` has `'e'` → found the difference!

4. Another approach: count occurrences of each character
   - Count in `s`: a:1, b:1, c:1, d:1
   - Count in `t`: a:1, b:1, c:1, d:1, e:1
   - Compare counts: `'e'` appears once in `t` but not in `s`

5. Yet another approach: use XOR (bit manipulation)
   - XOR of same values cancels out: `a ^ a = 0`
   - XOR all characters from both strings: `a ^ b ^ c ^ d ^ a ^ b ^ c ^ d ^ e = e`
   - All matching pairs cancel, leaving only the extra character

## Brute Force Approach

A naive approach would be to sort both strings and compare them character by character. While this works, it's not the most efficient solution.

**Why it's suboptimal:**

- Sorting takes O(n log n) time where n is the length of the strings
- We can solve this in O(n) time with better approaches
- The sorting approach requires O(n) extra space (or O(1) if we sort in-place, but strings are immutable in most languages)

However, let's see what the brute force might look like:

```python
def findTheDifference_brute(s: str, t: str) -> str:
    # Sort both strings
    sorted_s = sorted(s)
    sorted_t = sorted(t)

    # Compare character by character
    for i in range(len(s)):
        if sorted_s[i] != sorted_t[i]:
            return sorted_t[i]

    # If all characters match up to len(s), the extra is at the end
    return sorted_t[-1]
```

This approach works but has O(n log n) time complexity due to sorting. We can do better.

## Optimal Solution

There are actually three optimal O(n) approaches, each with different space trade-offs:

### Approach 1: Character Counting (Hash Table)

Count occurrences of each character in both strings and find which character has a different count.

### Approach 2: Sum Difference

Sum the ASCII values of all characters in `t` and subtract the sum of ASCII values in `s`. The result is the ASCII value of the extra character.

### Approach 3: XOR (Bit Manipulation)

Use the XOR operation which has the property that `a ^ a = 0` and `a ^ 0 = a`. XOR all characters from both strings; matching pairs cancel out, leaving only the extra character.

The XOR approach is particularly elegant as it uses O(1) space and is very fast. Here's the complete solution:

<div class="code-group">

```python
# Time: O(n) where n is the length of t
# Space: O(1) - we only use a single integer variable
def findTheDifference(s: str, t: str) -> str:
    """
    Finds the extra character in t using XOR.
    XOR properties:
    - a ^ a = 0 (same values cancel)
    - a ^ 0 = a (anything XOR 0 is itself)
    - XOR is commutative and associative (order doesn't matter)
    """
    result = 0

    # XOR all characters in s
    for char in s:
        result ^= ord(char)  # Convert char to ASCII value

    # XOR all characters in t
    for char in t:
        result ^= ord(char)  # Convert char to ASCII value

    # After XORing all characters, matching pairs cancel out
    # Only the extra character remains
    return chr(result)  # Convert ASCII value back to character

# Alternative one-liner using Python's reduce function
from functools import reduce
def findTheDifference_oneliner(s: str, t: str) -> str:
    return chr(reduce(lambda x, y: x ^ ord(y), s + t, 0))
```

```javascript
// Time: O(n) where n is the length of t
// Space: O(1) - we only use a single integer variable
function findTheDifference(s, t) {
  /**
   * Finds the extra character in t using XOR.
   * XOR properties:
   * - a ^ a = 0 (same values cancel)
   * - a ^ 0 = a (anything XOR 0 is itself)
   * - XOR is commutative and associative (order doesn't matter)
   */
  let result = 0;

  // XOR all characters in s
  for (let i = 0; i < s.length; i++) {
    result ^= s.charCodeAt(i); // Get ASCII value of character
  }

  // XOR all characters in t
  for (let i = 0; i < t.length; i++) {
    result ^= t.charCodeAt(i); // Get ASCII value of character
  }

  // After XORing all characters, matching pairs cancel out
  // Only the extra character remains
  return String.fromCharCode(result); // Convert ASCII value back to character
}

// Alternative using reduce (ES6)
function findTheDifferenceReduce(s, t) {
  const combined = s + t;
  const xorResult = [...combined].reduce((acc, char) => acc ^ char.charCodeAt(0), 0);
  return String.fromCharCode(xorResult);
}
```

```java
// Time: O(n) where n is the length of t
// Space: O(1) - we only use a single integer variable
class Solution {
    public char findTheDifference(String s, String t) {
        /**
         * Finds the extra character in t using XOR.
         * XOR properties:
         * - a ^ a = 0 (same values cancel)
         * - a ^ 0 = a (anything XOR 0 is itself)
         * - XOR is commutative and associative (order doesn't matter)
         */
        int result = 0;

        // XOR all characters in s
        for (int i = 0; i < s.length(); i++) {
            result ^= s.charAt(i);  // char is automatically promoted to int (ASCII value)
        }

        // XOR all characters in t
        for (int i = 0; i < t.length(); i++) {
            result ^= t.charAt(i);  // char is automatically promoted to int (ASCII value)
        }

        // After XORing all characters, matching pairs cancel out
        // Only the extra character remains
        return (char) result;  // Cast int back to char
    }
}

// Alternative using single loop
class SolutionAlt {
    public char findTheDifference(String s, String t) {
        int result = 0;

        // XOR all characters from both strings in one loop
        // Note: t is always one character longer than s
        for (int i = 0; i < s.length(); i++) {
            result ^= s.charAt(i);
            result ^= t.charAt(i);
        }

        // Don't forget the last character of t
        result ^= t.charAt(t.length() - 1);

        return (char) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all characters of `s` (length n-1) and `t` (length n)
- Total iterations: (n-1) + n = 2n - 1, which simplifies to O(n)
- Each iteration performs a constant-time XOR operation

**Space Complexity: O(1)**

- We only use a single integer variable (`result`) to store the XOR value
- No additional data structures that grow with input size
- Even the character counting approach would be O(1) space since there are only 26 possible lowercase letters (or 256 for extended ASCII)

## Common Mistakes

1. **Forgetting that strings can be empty**: When `s` is empty, `t` contains exactly one character. Some implementations might fail with index errors if they assume both strings have content.
   - Fix: Handle the edge case or write code that works for empty `s`

2. **Incorrect XOR initialization**: Starting with `result = 1` instead of `result = 0` will give wrong results because `a ^ 1 ≠ a`.
   - Fix: Always initialize XOR accumulator to 0

3. **Assuming only lowercase letters**: The problem statement doesn't specify character set. Your solution should handle any character (including uppercase, digits, symbols).
   - Fix: Use general character encoding (ASCII/Unicode) methods

4. **Off-by-one errors in single-loop implementations**: When processing both strings together, it's easy to forget the last character of `t` since it's longer than `s`.
   - Fix: Either use two separate loops or carefully handle the extra character

5. **Using subtraction instead of XOR for sum approach**: While the sum difference approach works, it can overflow with very long strings. XOR doesn't have this issue.
   - Fix: Use XOR or handle potential overflow

## When You'll See This Pattern

The XOR pattern for finding a single different element appears in several important problems:

1. **Single Number (LeetCode 136)**: Find the number that appears exactly once in an array where every other number appears twice. This is essentially the same problem but with numbers instead of characters.

2. **Missing Number (LeetCode 268)**: Find the missing number in a range. You can XOR all numbers from 0 to n with all numbers in the array to find the missing one.

3. **Find the Duplicate Number (LeetCode 287)**: While not solved with XOR alone, it uses similar "find the odd one out" logic.

The core insight is that when you need to find an element that doesn't have a matching pair, XOR is a powerful tool because:

- It's commutative: `a ^ b = b ^ a`
- It's associative: `(a ^ b) ^ c = a ^ (b ^ c)`
- Same elements cancel: `a ^ a = 0`
- Identity element: `a ^ 0 = a`

## Key Takeaways

1. **XOR is your friend for "find the odd one out" problems**: When you need to identify an element that appears an odd number of times or doesn't have a pair, consider XOR first.

2. **Multiple approaches exist for the same problem**: Character counting, sum difference, and XOR all solve this problem in O(n) time. Knowing multiple approaches shows depth of understanding.

3. **Understand the properties of your operations**: XOR's properties (commutative, associative, self-canceling) make it perfect for this problem. Similarly, understanding when sum might overflow helps you choose the right approach.

4. **Edge cases matter**: Always test with empty strings, single characters, and repeated characters. The best solutions handle all cases gracefully.

Related problems: [Single Number](/problem/single-number), [Permutation Difference between Two Strings](/problem/permutation-difference-between-two-strings)
