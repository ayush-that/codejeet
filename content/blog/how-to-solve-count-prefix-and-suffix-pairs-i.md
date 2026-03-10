---
title: "How to Solve Count Prefix and Suffix Pairs I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Prefix and Suffix Pairs I. Easy difficulty, 77.8% acceptance rate. Topics: Array, String, Trie, Rolling Hash, String Matching."
date: "2028-08-26"
category: "dsa-patterns"
tags: ["count-prefix-and-suffix-pairs-i", "array", "string", "trie", "easy"]
---

# How to Solve Count Prefix and Suffix Pairs I

This problem asks us to count pairs of indices `(i, j)` where `i < j` and a string is both a prefix AND suffix of another string. While the concept is straightforward, the challenge lies in efficiently checking these conditions for all possible pairs. The interesting part is that we need to verify two string relationships simultaneously, which can be done with simple string operations rather than complex data structures.

## Visual Walkthrough

Let's trace through a small example: `words = ["a", "aba", "ababa", "aa"]`

We need to check all pairs where `i < j`:

**Pair (0, 1):** `"a"` vs `"aba"`

- Is `"a"` a prefix of `"aba"`? Yes (starts with "a")
- Is `"a"` a suffix of `"aba"`? Yes (ends with "a")
- ✅ Count = 1

**Pair (0, 2):** `"a"` vs `"ababa"`

- Prefix check: Yes (starts with "a")
- Suffix check: Yes (ends with "a")
- ✅ Count = 2

**Pair (0, 3):** `"a"` vs `"aa"`

- Prefix check: Yes (starts with "a")
- Suffix check: Yes (ends with "a")
- ✅ Count = 3

**Pair (1, 2):** `"aba"` vs `"ababa"`

- Prefix check: Does `"ababa"` start with `"aba"`? Yes
- Suffix check: Does `"ababa"` end with `"aba"`? Yes
- ✅ Count = 4

**Pair (1, 3):** `"aba"` vs `"aa"`

- Prefix check: Does `"aa"` start with `"aba"`? No (too long)
- ❌ Not a valid pair

**Pair (2, 3):** `"ababa"` vs `"aa"`

- Prefix check: Does `"aa"` start with `"ababa"`? No (too long)
- ❌ Not a valid pair

Final answer: **4**

The key insight is that for `str1` to be both prefix and suffix of `str2`, it must be shorter than or equal to `str2` in length, and `str2` must start AND end with the exact characters of `str1`.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`. For each pair, we need to verify if `words[i]` is both a prefix and suffix of `words[j]`.

A naive implementation would:

1. Iterate through all pairs `(i, j)` with `i < j`
2. For each pair, check if `words[i]` is a prefix of `words[j]`
3. Also check if `words[i]` is a suffix of `words[j]`
4. Count how many pairs satisfy both conditions

The brute force approach is actually optimal for this problem because:

- The constraints are small (n ≤ 100, strings ≤ 50 characters)
- Each string comparison is O(L) where L ≤ 50
- Total operations: O(n² × L) = 100² × 50 = 500,000 operations, which is efficient

However, let's understand why we can't do much better:

- We need to check all n² pairs in the worst case
- Each check requires examining the characters of the shorter string
- Even with preprocessing (like building a trie), we'd still need to check suffix conditions

<div class="code-group">

```python
# Time: O(n² * L) where n = len(words), L = max string length
# Space: O(1) excluding input storage
def countPrefixSuffixPairs(words):
    n = len(words)
    count = 0

    # Check all pairs where i < j
    for i in range(n):
        for j in range(i + 1, n):
            str1 = words[i]
            str2 = words[j]

            # Quick length check: str1 must be shorter or equal to str2
            if len(str1) > len(str2):
                continue

            # Check if str1 is a prefix of str2
            is_prefix = str2.startswith(str1)

            # Check if str1 is a suffix of str2
            is_suffix = str2.endswith(str1)

            # Count if both conditions are true
            if is_prefix and is_suffix:
                count += 1

    return count
```

```javascript
// Time: O(n² * L) where n = words.length, L = max string length
// Space: O(1) excluding input storage
function countPrefixSuffixPairs(words) {
  let count = 0;
  const n = words.length;

  // Check all pairs where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const str1 = words[i];
      const str2 = words[j];

      // Quick length check: str1 must be shorter or equal to str2
      if (str1.length > str2.length) {
        continue;
      }

      // Check if str1 is a prefix of str2
      const isPrefix = str2.startsWith(str1);

      // Check if str1 is a suffix of str2
      const isSuffix = str2.endsWith(str1);

      // Count if both conditions are true
      if (isPrefix && isSuffix) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² * L) where n = words.length, L = max string length
// Space: O(1) excluding input storage
class Solution {
    public int countPrefixSuffixPairs(String[] words) {
        int count = 0;
        int n = words.length;

        // Check all pairs where i < j
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                String str1 = words[i];
                String str2 = words[j];

                // Quick length check: str1 must be shorter or equal to str2
                if (str1.length() > str2.length()) {
                    continue;
                }

                // Check if str1 is a prefix of str2
                boolean isPrefix = str2.startsWith(str1);

                // Check if str1 is a suffix of str2
                boolean isSuffix = str2.endsWith(str1);

                // Count if both conditions are true
                if (isPrefix && isSuffix) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Optimal Solution

The brute force approach is already optimal given the constraints, but we can make it slightly more efficient by avoiding the built-in `startsWith` and `endsWith` functions when they're not needed. However, in practice, the built-in functions are highly optimized.

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n² * L) where n = len(words), L = max string length
# Space: O(1) excluding input storage
def countPrefixSuffixPairs(words):
    """
    Counts pairs (i, j) where i < j and words[i] is both
    a prefix and suffix of words[j].
    """
    n = len(words)
    count = 0

    # Iterate through all possible starting indices i
    for i in range(n):
        # For each i, check all j > i
        for j in range(i + 1, n):
            str1 = words[i]
            str2 = words[j]
            len1 = len(str1)
            len2 = len(str2)

            # Optimization: str1 cannot be prefix/suffix if it's longer than str2
            if len1 > len2:
                continue

            # Check prefix condition: first len1 characters must match
            # We could use str2.startswith(str1), but let's implement manually
            # for clarity and to show the logic
            is_prefix = True
            for k in range(len1):
                if str1[k] != str2[k]:
                    is_prefix = False
                    break

            # If not a prefix, no need to check suffix
            if not is_prefix:
                continue

            # Check suffix condition: last len1 characters must match
            is_suffix = True
            for k in range(len1):
                # Compare from the end of str2 backwards
                if str1[k] != str2[len2 - len1 + k]:
                    is_suffix = False
                    break

            # If both conditions are satisfied, increment count
            if is_suffix:
                count += 1

    return count
```

```javascript
// Time: O(n² * L) where n = words.length, L = max string length
// Space: O(1) excluding input storage
function countPrefixSuffixPairs(words) {
  let count = 0;
  const n = words.length;

  // Iterate through all possible starting indices i
  for (let i = 0; i < n; i++) {
    const str1 = words[i];
    const len1 = str1.length;

    // For each i, check all j > i
    for (let j = i + 1; j < n; j++) {
      const str2 = words[j];
      const len2 = str2.length;

      // Optimization: str1 cannot be prefix/suffix if it's longer than str2
      if (len1 > len2) {
        continue;
      }

      // Check prefix condition using built-in method
      // This is optimized in JavaScript engines
      if (!str2.startsWith(str1)) {
        continue;
      }

      // Check suffix condition using built-in method
      if (str2.endsWith(str1)) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² * L) where n = words.length, L = max string length
// Space: O(1) excluding input storage
class Solution {
    public int countPrefixSuffixPairs(String[] words) {
        int count = 0;
        int n = words.length;

        // Iterate through all possible starting indices i
        for (int i = 0; i < n; i++) {
            String str1 = words[i];
            int len1 = str1.length();

            // For each i, check all j > i
            for (int j = i + 1; j < n; j++) {
                String str2 = words[j];
                int len2 = str2.length();

                // Optimization: str1 cannot be prefix/suffix if it's longer than str2
                if (len1 > len2) {
                    continue;
                }

                // Check prefix condition
                if (!str2.startsWith(str1)) {
                    continue;
                }

                // Check suffix condition
                if (str2.endsWith(str1)) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² × L)**

- We have a nested loop checking all pairs `(i, j)` where `i < j`, which gives us O(n²) pairs
- For each pair, we perform string comparisons that take O(L) time in the worst case, where L is the maximum string length
- The early exit when strings have incompatible lengths helps in practice but doesn't change the worst-case complexity

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the counter and loop variables
- The input array is not counted toward space complexity (it's given)

## Common Mistakes

1. **Forgetting the length check**: Not checking if `str1.length() > str2.length()` before attempting comparisons. This can lead to index out of bounds errors or incorrect logic.

2. **Confusing prefix with substring**: A prefix must start at the beginning, not just appear anywhere in the string. Similarly, a suffix must end at the end.

3. **Off-by-one errors in manual comparison**: When implementing prefix/suffix checks manually, it's easy to make mistakes with indices, especially for the suffix check where you need to start from `len2 - len1`.

4. **Not using early termination**: Checking both prefix and suffix conditions even when the prefix check fails. Always check prefix first since if it fails, the pair cannot be valid.

5. **Misunderstanding the pair ordering**: Counting pairs where `i > j` or counting `(i, i)` pairs. The problem specifically requires `i < j`.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Nested iteration over pairs**: Common in problems like "Two Sum", "Count Number of Pairs With Absolute Difference K", and "Number of Good Pairs".

2. **String prefix/suffix checking**: The core of problems like "Longest Common Prefix", "Check If a Word Occurs As a Prefix of Any Word", and "Suffix of a String".

3. **Constraint-aware brute force**: When constraints are small (n ≤ 100), O(n²) solutions are acceptable. This pattern appears in many "Easy" LeetCode problems.

Related problems that use similar techniques:

- **Implement Trie (Prefix Tree)**: Teaches efficient prefix checking for multiple queries
- **Design Add and Search Words Data Structure**: Extends prefix checking with wildcard support
- **Longest Common Prefix**: Focuses only on the prefix aspect of strings

## Key Takeaways

1. **Constraint analysis is crucial**: With n ≤ 100 and L ≤ 50, O(n² × L) is perfectly fine (500k operations). Always check constraints before over-engineering.

2. **Built-in string methods are your friends**: `startsWith()` and `endsWith()` are optimized and readable. Use them unless you need custom behavior.

3. **Early exits optimize practical performance**: Check easy conditions first (length compatibility, prefix check) before more expensive operations.

4. **Pair counting problems often require nested loops**: When you need to examine all unordered pairs `(i, j)` with `i < j`, a nested loop with `j` starting from `i+1` is the standard pattern.

The simplicity of this solution demonstrates an important interview principle: sometimes the most straightforward approach is the best one, especially when constraints are favorable.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree), [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure)
