---
title: "How to Solve Longest Uncommon Subsequence II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Uncommon Subsequence II. Medium difficulty, 44.5% acceptance rate. Topics: Array, Hash Table, Two Pointers, String, Sorting."
date: "2028-02-26"
category: "dsa-patterns"
tags: ["longest-uncommon-subsequence-ii", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Longest Uncommon Subsequence II

This problem asks us to find the longest string in an array that is **not a subsequence** of any other string in the array. What makes this tricky is that we're dealing with subsequences (not substrings), which means characters don't need to be contiguous, and we need to compare each string against all others to determine if it's "uncommon."

## Visual Walkthrough

Let's trace through an example: `strs = ["aba", "cdc", "eae"]`

We need to check each string to see if it's a subsequence of any other string:

1. **Check "aba"**:
   - Is "aba" a subsequence of "cdc"? No (different characters)
   - Is "aba" a subsequence of "eae"? Let's check: "eae" has 'a' at position 1, 'b' is missing, so no
   - "aba" is NOT a subsequence of any other string → candidate with length 3

2. **Check "cdc"**:
   - Is "cdc" a subsequence of "aba"? No
   - Is "cdc" a subsequence of "eae"? No
   - "cdc" is NOT a subsequence of any other string → candidate with length 3

3. **Check "eae"**:
   - Is "eae" a subsequence of "aba"? No
   - Is "eae" a subsequence of "cdc"? No
   - "eae" is NOT a subsequence of any other string → candidate with length 3

All three strings are uncommon, so the longest has length 3.

Now consider: `strs = ["aaa", "aaa", "aa"]`

1. **Check "aaa"**:
   - Is "aaa" a subsequence of another "aaa"? Yes (identical strings are subsequences of each other)
   - So "aaa" is NOT uncommon

2. **Check the other "aaa"**: Same result

3. **Check "aa"**:
   - Is "aa" a subsequence of "aaa"? Yes (we can take the first two 'a's)
   - So "aa" is NOT uncommon

No string is uncommon → return -1

The key insight: **A string can only be the longest uncommon subsequence if it's not a subsequence of any longer or equal-length string.**

## Brute Force Approach

A naive approach would be:

1. Generate all possible subsequences of all strings
2. For each subsequence, check if it appears in exactly one string
3. Track the longest such subsequence

Why this fails:

- Generating all subsequences of a string of length n takes O(2ⁿ) time
- With m strings, this becomes O(m × 2ⁿ) where n is the maximum string length
- For n=10, that's 1024 subsequences per string; for n=100, it's 1.3×10³⁰ - completely infeasible

Even a slightly better brute force would be: for each string, check if it's a subsequence of every other string. This is O(m² × L) where L is the total length of strings being compared. For m=50 strings of length 100, that's 2500 × 100 = 250,000 operations - manageable but we can optimize.

## Optimized Approach

The key observation: **If a string is uncommon, then the entire string itself is the longest possible uncommon subsequence starting from that string.**

Why? Because:

1. Any shorter subsequence of an uncommon string would also be uncommon (if the whole string isn't a subsequence of others, neither are its parts)
2. But we want the LONGEST uncommon subsequence, so we should check the full strings first

This leads to our strategy:

1. Sort strings by length (longest first) so we check potential candidates in descending order
2. For each string, check if it's a subsequence of any other string that's **longer or equal in length**
3. The first string that's not a subsequence of any other (except duplicates of itself) is our answer
4. If all strings are subsequences of others, return -1

We need to handle duplicates carefully: if a string appears multiple times, it's automatically a subsequence of its duplicates, so it can't be uncommon.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m² * n) where m = number of strings, n = average string length
# Space: O(1) excluding input storage
def findLUSlength(strs):
    """
    Find the longest uncommon subsequence in an array of strings.

    Strategy:
    1. Sort strings by length in descending order to check longest candidates first
    2. For each string, check if it's a subsequence of any other string
       that's longer or equal in length (and not the same string at a different index)
    3. The first string that's not a subsequence of any other is our answer
    4. If no such string exists, return -1
    """

    # Helper function to check if s1 is a subsequence of s2
    def is_subsequence(s1, s2):
        """Return True if s1 is a subsequence of s2."""
        i = 0  # Pointer for s1
        # Try to match each character of s1 in s2
        for char in s2:
            if i < len(s1) and s1[i] == char:
                i += 1
        # If we matched all characters of s1, it's a subsequence
        return i == len(s1)

    # Sort by length descending so we check longest strings first
    strs.sort(key=len, reverse=True)

    # Check each string
    for i in range(len(strs)):
        current = strs[i]
        is_uncommon = True

        # Compare against all other strings
        for j in range(len(strs)):
            # Skip comparing with itself
            if i == j:
                continue

            # If we find a longer or equal length string that contains current as subsequence
            if len(strs[j]) >= len(current) and is_subsequence(current, strs[j]):
                is_uncommon = False
                break  # No need to check further

        # If current string is not a subsequence of any other, it's our answer
        if is_uncommon:
            return len(current)

    # No uncommon subsequence found
    return -1
```

```javascript
// Time: O(m² * n) where m = number of strings, n = average string length
// Space: O(1) excluding input storage
function findLUSlength(strs) {
  /**
   * Find the longest uncommon subsequence in an array of strings.
   *
   * Strategy:
   * 1. Sort strings by length in descending order to check longest candidates first
   * 2. For each string, check if it's a subsequence of any other string
   *    that's longer or equal in length (and not the same string at a different index)
   * 3. The first string that's not a subsequence of any other is our answer
   * 4. If no such string exists, return -1
   */

  // Helper function to check if s1 is a subsequence of s2
  const isSubsequence = (s1, s2) => {
    // Pointer for s1
    let i = 0;
    // Try to match each character of s1 in s2
    for (const char of s2) {
      if (i < s1.length && s1[i] === char) {
        i++;
      }
    }
    // If we matched all characters of s1, it's a subsequence
    return i === s1.length;
  };

  // Sort by length descending so we check longest strings first
  strs.sort((a, b) => b.length - a.length);

  // Check each string
  for (let i = 0; i < strs.length; i++) {
    const current = strs[i];
    let isUncommon = true;

    // Compare against all other strings
    for (let j = 0; j < strs.length; j++) {
      // Skip comparing with itself
      if (i === j) continue;

      // If we find a longer or equal length string that contains current as subsequence
      if (strs[j].length >= current.length && isSubsequence(current, strs[j])) {
        isUncommon = false;
        break; // No need to check further
      }
    }

    // If current string is not a subsequence of any other, it's our answer
    if (isUncommon) {
      return current.length;
    }
  }

  // No uncommon subsequence found
  return -1;
}
```

```java
// Time: O(m² * n) where m = number of strings, n = average string length
// Space: O(1) excluding input storage
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    public int findLUSlength(String[] strs) {
        /**
         * Find the longest uncommon subsequence in an array of strings.
         *
         * Strategy:
         * 1. Sort strings by length in descending order to check longest candidates first
         * 2. For each string, check if it's a subsequence of any other string
         *    that's longer or equal in length (and not the same string at a different index)
         * 3. The first string that's not a subsequence of any other is our answer
         * 4. If no such string exists, return -1
         */

        // Sort by length descending so we check longest strings first
        Arrays.sort(strs, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return b.length() - a.length();
            }
        });

        // Check each string
        for (int i = 0; i < strs.length; i++) {
            String current = strs[i];
            boolean isUncommon = true;

            // Compare against all other strings
            for (int j = 0; j < strs.length; j++) {
                // Skip comparing with itself
                if (i == j) continue;

                // If we find a longer or equal length string that contains current as subsequence
                if (strs[j].length() >= current.length() && isSubsequence(current, strs[j])) {
                    isUncommon = false;
                    break; // No need to check further
                }
            }

            // If current string is not a subsequence of any other, it's our answer
            if (isUncommon) {
                return current.length();
            }
        }

        // No uncommon subsequence found
        return -1;
    }

    // Helper method to check if s1 is a subsequence of s2
    private boolean isSubsequence(String s1, String s2) {
        // Pointer for s1
        int i = 0;
        // Try to match each character of s1 in s2
        for (char c : s2.toCharArray()) {
            if (i < s1.length() && s1.charAt(i) == c) {
                i++;
            }
        }
        // If we matched all characters of s1, it's a subsequence
        return i == s1.length();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m² × n)**

- Sorting the strings takes O(m log m) time
- We have nested loops: for each of m strings, we compare against m-1 other strings → O(m²) comparisons
- Each comparison uses the `is_subsequence` function which takes O(n) time where n is the average string length
- Total: O(m log m + m² × n) = O(m² × n) since m² × n dominates

**Space Complexity: O(1)**

- We only use a few variables for iteration and the subsequence check
- The sorting may use O(log m) stack space for the sort algorithm, but this is typically considered O(1) auxiliary space

## Common Mistakes

1. **Not handling duplicates correctly**: If a string appears multiple times, it's automatically a subsequence of its duplicates. Some candidates check `if i != j` but forget that identical strings at different indices still make each other not uncommon.

2. **Checking against shorter strings**: A string can be a subsequence of a longer string but not of a shorter one. We only need to check against strings that are **longer or equal in length**. Checking against shorter strings is unnecessary and inefficient.

3. **Forgetting to sort by length**: Without sorting, you might return a shorter uncommon string when a longer one exists. For example, if "abcd" is uncommon and "abc" is also uncommon, we should return 4, not 3.

4. **Incorrect subsequence check**: The two-pointer approach for checking subsequences is straightforward but easy to implement wrong. Common errors include:
   - Not resetting the pointer for each comparison
   - Using the wrong comparison order
   - Not handling empty strings correctly

## When You'll See This Pattern

This problem combines several important patterns:

1. **Subsequence checking**: The two-pointer technique for checking if one string is a subsequence of another appears in:
   - [Is Subsequence](https://leetcode.com/problems/is-subsequence/) (Easy) - direct application
   - [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences/) (Medium) - multiple subsequence checks

2. **Sorting for optimization**: Sorting by a property (here, length) to prioritize checking certain candidates first appears in:
   - [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) (Medium) - sort by end time
   - [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) (Medium) - sort by start time

3. **Pairwise comparisons**: The O(m²) pairwise comparison pattern appears when relationships between all pairs matter:
   - [Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/) (Medium) - check character overlap between all pairs
   - [Sentence Similarity](https://leetcode.com/problems/sentence-similarity/) (Easy) - check word relationships between sentences

## Key Takeaways

1. **Think about the problem structure**: For "longest X" problems, consider if sorting by the relevant metric (length, size, etc.) lets you find the answer more efficiently by checking candidates in order.

2. **Understand subsequence vs substring**: Subsequences don't require contiguous characters, which makes the two-pointer checking algorithm different from substring search algorithms like KMP.

3. **Handle duplicates explicitly**: When comparing elements in an array, always consider what happens when duplicate values exist. They often require special handling.

4. **Optimize comparisons**: When doing pairwise comparisons, look for ways to reduce unnecessary checks. Here, we only compare against longer or equal-length strings.

Related problems: [Longest Uncommon Subsequence I](/problem/longest-uncommon-subsequence-i)
