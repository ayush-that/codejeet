---
title: "How to Solve String Without AAA or BBB — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode String Without AAA or BBB. Medium difficulty, 45.0% acceptance rate. Topics: String, Greedy."
date: "2028-04-23"
category: "dsa-patterns"
tags: ["string-without-aaa-or-bbb", "string", "greedy", "medium"]
---

# How to Solve "String Without AAA or BBB"

You're given two integers `a` and `b` representing counts of 'a' and 'b' characters. Your task is to construct a string of length `a + b` containing exactly `a` 'a's and `b` 'b's, with the constraint that it cannot contain "aaa" or "bbb" as substrings. The problem is interesting because it requires careful arrangement of characters to avoid consecutive runs while using all available letters. The greedy approach works beautifully here, but the implementation details matter.

## Visual Walkthrough

Let's trace through an example: `a = 4, b = 1`. We need 4 'a's and 1 'b' without "aaa" or "bbb".

A naive approach might start with all 'a's: "aaaa" then add 'b': "aaaab" - but this contains "aaa"! We need to intersperse the characters.

**Step-by-step greedy construction:**

1. We'll always write the character with more remaining count first (unless we've already written two of it consecutively)
2. Start: a=4, b=1, result = ""
   - Write 'a' (more remaining): result = "a", a=3, b=1
3. a=3, b=1, last two chars = "a"
   - Write 'a' again (still more): result = "aa", a=2, b=1
4. a=2, b=1, last two chars = "aa"
   - Can't write 'a' again (would make "aaa"), so write 'b': result = "aab", a=2, b=0
5. a=2, b=0, last two chars = "ab"
   - Write 'a': result = "aaba", a=1, b=0
6. a=1, b=0, last two chars = "ba"
   - Write 'a': result = "aabaa", a=0, b=0

Final result: "aabaa" - contains 4 'a's, 1 'b', and no "aaa" or "bbb".

## Brute Force Approach

A brute force approach would generate all possible strings of length `a+b` with exactly `a` 'a's and `b` 'b's, then check each one for the "aaa" and "bbb" constraints. We could use backtracking to generate permutations:

1. Start with empty string
2. At each step, add either 'a' or 'b' if we haven't used up all of that character
3. Check if last 3 characters form "aaa" or "bbb"
4. Continue until string length reaches `a+b`

The problem? This generates an exponential number of strings. With `a+b` up to 100 (as per typical constraints), this is completely infeasible. Even with pruning (checking the last 2 characters before adding), the search space is still huge.

## Optimized Approach

The key insight is **greedy construction with priority**. We always want to write the character with more remaining count, but we must be careful not to create three in a row.

**Core strategy:**

1. Track remaining counts of 'a' and 'b'
2. At each step, decide which character to write next
3. If we've written two of the same character consecutively, we MUST write the other character next
4. Otherwise, write the character with higher remaining count
5. If counts are equal, either character works (but be consistent)

**Why this works:**

- By always writing the character with more remaining (when possible), we naturally intersperse characters
- The "two in a row" check prevents "aaa" or "bbb" from forming
- This approach ensures we use all characters while maintaining the constraint

**Edge cases to consider:**

- What if one count is much larger than the other? (e.g., a=10, b=2)
- What happens when counts are equal?
- What if one count is zero?

## Optimal Solution

Here's the greedy implementation with detailed comments:

<div class="code-group">

```python
# Time: O(a + b) | Space: O(a + b) for the result string
def strWithout3a3b(a: int, b: int) -> str:
    """
    Construct a string with exactly a 'a's and b 'b's without "aaa" or "bbb".
    Uses greedy approach: always write the character with more remaining count,
    unless we've already written two of it consecutively.
    """
    result = []

    while a > 0 or b > 0:
        # Get current length to check last characters
        n = len(result)

        # If we've written at least 2 characters and the last two are the same
        if n >= 2 and result[-1] == result[-2]:
            # We must write the other character to avoid three in a row
            if result[-1] == 'a':
                # Last two are 'aa', must write 'b'
                result.append('b')
                b -= 1
            else:
                # Last two are 'bb', must write 'a'
                result.append('a')
                a -= 1
        else:
            # Not at risk of three in a row, write character with more remaining
            if a >= b:
                # More 'a's remaining (or equal), write 'a'
                result.append('a')
                a -= 1
            else:
                # More 'b's remaining, write 'b'
                result.append('b')
                b -= 1

    # Join list into string
    return ''.join(result)
```

```javascript
// Time: O(a + b) | Space: O(a + b) for the result string
function strWithout3a3b(a, b) {
  /**
   * Construct a string with exactly a 'a's and b 'b's without "aaa" or "bbb".
   * Uses greedy approach: always write the character with more remaining count,
   * unless we've already written two of it consecutively.
   */
  let result = [];

  while (a > 0 || b > 0) {
    const n = result.length;

    // If we've written at least 2 characters and the last two are the same
    if (n >= 2 && result[n - 1] === result[n - 2]) {
      // We must write the other character to avoid three in a row
      if (result[n - 1] === "a") {
        // Last two are 'aa', must write 'b'
        result.push("b");
        b--;
      } else {
        // Last two are 'bb', must write 'a'
        result.push("a");
        a--;
      }
    } else {
      // Not at risk of three in a row, write character with more remaining
      if (a >= b) {
        // More 'a's remaining (or equal), write 'a'
        result.push("a");
        a--;
      } else {
        // More 'b's remaining, write 'b'
        result.push("b");
        b--;
      }
    }
  }

  // Join array into string
  return result.join("");
}
```

```java
// Time: O(a + b) | Space: O(a + b) for the result string
class Solution {
    public String strWithout3a3b(int a, int b) {
        /**
         * Construct a string with exactly a 'a's and b 'b's without "aaa" or "bbb".
         * Uses greedy approach: always write the character with more remaining count,
         * unless we've already written two of it consecutively.
         */
        StringBuilder result = new StringBuilder();

        while (a > 0 || b > 0) {
            int n = result.length();

            // If we've written at least 2 characters and the last two are the same
            if (n >= 2 && result.charAt(n - 1) == result.charAt(n - 2)) {
                // We must write the other character to avoid three in a row
                if (result.charAt(n - 1) == 'a') {
                    // Last two are 'aa', must write 'b'
                    result.append('b');
                    b--;
                } else {
                    // Last two are 'bb', must write 'a'
                    result.append('a');
                    a--;
                }
            } else {
                // Not at risk of three in a row, write character with more remaining
                if (a >= b) {
                    // More 'a's remaining (or equal), write 'a'
                    result.append('a');
                    a--;
                } else {
                    // More 'b's remaining, write 'b'
                    result.append('b');
                    b--;
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(a + b)**

- We perform exactly `a + b` iterations (one for each character we write)
- Each iteration does constant work: checking last characters and appending
- Even in the worst case where counts are very different, we still write all characters

**Space Complexity: O(a + b)**

- We store the result string of length `a + b`
- The auxiliary space (counters, indices) is O(1)
- Using a list/array builder (like Python's list or Java's StringBuilder) is more efficient than string concatenation in loops

## Common Mistakes

1. **Forgetting to check if we've written two consecutive characters**: This is the most common error. Candidates often only compare remaining counts without checking what was just written. Always check the last 2 characters before deciding what to write next.

2. **Incorrect handling of edge cases**:
   - When `a = 0` or `b = 0`: The algorithm should still work (though constraints guarantee at least one character of each in practice)
   - When `a` and `b` are very different (e.g., `a=100, b=1`): Need to intersperse carefully
   - When counts are equal: Should produce alternating pattern like "abab..."

3. **Using string concatenation in loops**: In many languages, string concatenation in loops creates new strings each time (O(n²) time). Always use StringBuilder (Java), list join (Python), or array join (JavaScript).

4. **Off-by-one errors in index checking**: When checking `result[-1]` and `result[-2]`, ensure the string has at least 2 characters first. The condition `n >= 2` is crucial.

## When You'll See This Pattern

This greedy construction pattern appears in several scheduling and arrangement problems:

1. **Task Scheduler (LeetCode 621)**: Schedule tasks with cooldown periods. Similar concept of spacing out identical items to meet constraints.

2. **Reorganize String (LeetCode 767)**: Rearrange string so no two adjacent characters are the same. Uses priority queue to always pick the most frequent character that wasn't just used.

3. **Distant Barcodes (LeetCode 1054)**: Rearrange barcodes so no two adjacent barcodes are equal. Same core idea of alternating most frequent elements.

The pattern: **When you need to arrange items with constraints on consecutive appearances, use a greedy approach that prioritizes the most frequent remaining item while respecting adjacency rules.**

## Key Takeaways

1. **Greedy works for arrangement problems**: When constraints involve consecutive elements, a greedy approach that always makes the locally optimal choice (write the character with most remaining, avoid three in a row) often yields a globally valid solution.

2. **Check recent history**: In arrangement problems, your next choice often depends on recent choices. Always check the last few elements when making decisions.

3. **Use appropriate data structures**: For string building, use StringBuilder/list/array instead of concatenation. For more complex versions with many character types, a priority queue/heap helps track frequencies.

[Practice this problem on CodeJeet](/problem/string-without-aaa-or-bbb)
