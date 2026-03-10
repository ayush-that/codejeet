---
title: "How to Solve The k-th Lexicographical String of All Happy Strings of Length n — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The k-th Lexicographical String of All Happy Strings of Length n. Medium difficulty, 85.3% acceptance rate. Topics: String, Backtracking."
date: "2026-03-15"
category: "dsa-patterns"
tags:
  [
    "the-k-th-lexicographical-string-of-all-happy-strings-of-length-n",
    "string",
    "backtracking",
    "medium",
  ]
---

# How to Solve The k-th Lexicographical String of All Happy Strings of Length n

This problem asks us to find the k-th lexicographically smallest "happy string" of length n. A happy string uses only characters 'a', 'b', 'c' and never has two identical consecutive characters. The challenge is that we need to efficiently navigate through the combinatorial space without generating all possible strings, which would be too slow for larger n.

## Visual Walkthrough

Let's trace through an example: `n = 3, k = 9`

First, let's list all happy strings of length 3 in lexicographic order:

1. "aba" (starts with 'a', then 'b', then 'a' - can't use 'a' after 'b')
2. "abc" (starts with 'a', then 'b', then 'c')
3. "aca" (starts with 'a', then 'c', then 'a')
4. "acb" (starts with 'a', then 'c', then 'b')
5. "bab" (starts with 'b', then 'a', then 'b')
6. "bac" (starts with 'b', then 'a', then 'c')
7. "bca" (starts with 'b', then 'c', then 'a')
8. "bcb" (starts with 'b', then 'c', then 'b')
9. "cab" (starts with 'c', then 'a', then 'b')
10. "cac" (starts with 'c', then 'a', then 'c')
11. "cba" (starts with 'c', then 'b', then 'a')
12. "cbc" (starts with 'c', then 'b', then 'c')

For k = 9, we need "cab". Notice the pattern: each starting character has a certain number of valid continuations. Starting with 'a' gives us 4 strings, 'b' gives us 4 strings, and 'c' gives us 4 strings. So to find the 9th string, we skip the first 8 strings (4 from 'a' + 4 from 'b') and look at the 1st string starting with 'c'.

## Brute Force Approach

The brute force approach would generate ALL happy strings of length n, sort them lexicographically, and return the k-th one. We could use backtracking to generate all valid strings:

1. Start with an empty string
2. At each position, try adding 'a', 'b', or 'c' if it's different from the last character
3. When we reach length n, add the string to our collection
4. After generating all strings, sort them and return the k-th one

The problem with this approach is the exponential growth. For each position, we have at most 2 choices (can't repeat the previous character), so we have roughly 2^n strings. For n=10, that's about 1000 strings, but for n=20, it's over 1 million strings. The problem constraints don't specify n, but in interviews, we need to handle larger values efficiently.

## Optimized Approach

The key insight is that we don't need to generate all strings. We can use **backtracking with pruning** based on the count of strings in each subtree. Here's the step-by-step reasoning:

1. **Counting subtrees**: For a given prefix, we can calculate how many happy strings start with that prefix. If the prefix ends with character `ch`, the next character has 2 choices (any of the 3 letters except `ch`). So each level adds a factor of 2 to the count.

2. **Navigating the tree**: Think of all happy strings as a tree where:
   - Root is empty string
   - First level: 'a', 'b', 'c'
   - Second level: For 'a': 'ab', 'ac'; For 'b': 'ba', 'bc'; For 'c': 'ca', 'cb'
   - And so on...

3. **Finding the k-th string**: We traverse this tree:
   - At each level, we check how many strings are in each subtree
   - If k is greater than the subtree size, we skip that subtree and subtract its size from k
   - Otherwise, we enter that subtree and continue to the next level

4. **Early termination**: If k is larger than the total number of happy strings (which is 3 × 2^(n-1)), we return an empty string.

This approach builds the answer character by character without generating all strings, making it efficient even for large n.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we build the string character by character
# Space: O(n) - for the result string
def getHappyString(n: int, k: int) -> str:
    # Total number of happy strings of length n
    # First character: 3 choices, each subsequent: 2 choices
    total_strings = 3 * (2 ** (n - 1))

    # If k is larger than total possible strings, return empty string
    if k > total_strings:
        return ""

    # List of available characters
    chars = ['a', 'b', 'c']
    result = []

    # We'll build the string character by character
    for i in range(n):
        # For the first character, we have 3 equal-sized subtrees
        # For subsequent characters, we have 2 choices (can't repeat previous)
        if i == 0:
            # Size of each subtree starting with 'a', 'b', or 'c'
            subtree_size = total_strings // 3
        else:
            # After first character, each subtree has half the strings
            # of its parent subtree (2 choices at each level)
            subtree_size //= 2

        # Determine which character to choose at this position
        for ch in chars:
            # Skip if this character is the same as the previous one
            if result and ch == result[-1]:
                continue

            # If k is within this subtree, choose this character
            if k <= subtree_size:
                result.append(ch)
                break
            else:
                # Otherwise, skip this entire subtree
                k -= subtree_size

    return ''.join(result)
```

```javascript
// Time: O(n) - we build the string character by character
// Space: O(n) - for the result string
function getHappyString(n, k) {
  // Total number of happy strings of length n
  // First character: 3 choices, each subsequent: 2 choices
  let totalStrings = 3 * Math.pow(2, n - 1);

  // If k is larger than total possible strings, return empty string
  if (k > totalStrings) {
    return "";
  }

  // Available characters
  const chars = ["a", "b", "c"];
  const result = [];

  // Build the string character by character
  for (let i = 0; i < n; i++) {
    // For the first character, we have 3 equal-sized subtrees
    // For subsequent characters, we have 2 choices (can't repeat previous)
    let subtreeSize;
    if (i === 0) {
      // Size of each subtree starting with 'a', 'b', or 'c'
      subtreeSize = Math.floor(totalStrings / 3);
    } else {
      // After first character, each subtree has half the strings
      // of its parent subtree (2 choices at each level)
      subtreeSize = Math.floor(subtreeSize / 2);
    }

    // Determine which character to choose at this position
    for (const ch of chars) {
      // Skip if this character is the same as the previous one
      if (result.length > 0 && ch === result[result.length - 1]) {
        continue;
      }

      // If k is within this subtree, choose this character
      if (k <= subtreeSize) {
        result.push(ch);
        break;
      } else {
        // Otherwise, skip this entire subtree
        k -= subtreeSize;
      }
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) - we build the string character by character
// Space: O(n) - for the result string
class Solution {
    public String getHappyString(int n, int k) {
        // Total number of happy strings of length n
        // First character: 3 choices, each subsequent: 2 choices
        int totalStrings = 3 * (1 << (n - 1));  // 1 << (n-1) is 2^(n-1)

        // If k is larger than total possible strings, return empty string
        if (k > totalStrings) {
            return "";
        }

        // Available characters
        char[] chars = {'a', 'b', 'c'};
        StringBuilder result = new StringBuilder();

        // Build the string character by character
        int subtreeSize = 0;
        for (int i = 0; i < n; i++) {
            // For the first character, we have 3 equal-sized subtrees
            // For subsequent characters, we have 2 choices (can't repeat previous)
            if (i == 0) {
                // Size of each subtree starting with 'a', 'b', or 'c'
                subtreeSize = totalStrings / 3;
            } else {
                // After first character, each subtree has half the strings
                // of its parent subtree (2 choices at each level)
                subtreeSize /= 2;
            }

            // Determine which character to choose at this position
            for (char ch : chars) {
                // Skip if this character is the same as the previous one
                if (result.length() > 0 && ch == result.charAt(result.length() - 1)) {
                    continue;
                }

                // If k is within this subtree, choose this character
                if (k <= subtreeSize) {
                    result.append(ch);
                    break;
                } else {
                    // Otherwise, skip this entire subtree
                    k -= subtreeSize;
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate n times to build the string character by character
- In each iteration, we check at most 3 characters (but usually find the right one quickly)
- The operations inside the loop are constant time

**Space Complexity: O(n)**

- We store the result string of length n
- We use a few extra variables, but they're constant space
- The recursion stack if using recursive backtracking would also be O(n), but our iterative approach avoids this

The key efficiency gain comes from not generating all strings. We only explore the path to the k-th string, which takes linear time.

## Common Mistakes

1. **Generating all strings**: The most common mistake is to generate all happy strings and then pick the k-th one. This works for small n but fails for larger values due to exponential growth. Always check constraints and think about efficiency.

2. **Off-by-one errors with k**: When navigating the tree, candidates often confuse whether to use `k < subtreeSize` or `k <= subtreeSize`. Remember: if k=1, we want the first string in the subtree. Test with small examples to verify.

3. **Forgetting the base case**: When n=1, we have 3 happy strings: "a", "b", "c". Some implementations fail here because they try to access `result[-1]` or calculate `2^(n-1)` when n=0. Always handle edge cases.

4. **Incorrect subtree size calculation**: The formula `3 × 2^(n-1)` only works for n≥1. For n=0 (empty string), there's exactly 1 happy string. Also, when dividing, ensure integer division is handled correctly.

## When You'll See This Pattern

This problem uses **backtracking with pruning based on subtree counts**, which appears in several other problems:

1. **K-th Symbol in Grammar (LeetCode 779)**: Similar idea of navigating a binary tree without constructing it fully. Each level halves the search space.

2. **Permutation Sequence (LeetCode 60)**: Find the k-th permutation of numbers 1..n without generating all permutations. Uses factorial counts to skip groups of permutations.

3. **Letter Combinations of a Phone Number (LeetCode 17)**: While this generates all combinations, a variant asking for the k-th combination would use similar subtree counting.

The pattern is: when you need the k-th element in a combinatorial sequence, count how many elements are in each subtree/branch and navigate directly to the desired element.

## Key Takeaways

1. **Think in terms of tree navigation**: Many combinatorial problems can be visualized as a tree. Instead of traversing the entire tree, count subtree sizes to jump directly to the desired branch.

2. **Use mathematical counting to avoid enumeration**: When possible, calculate how many solutions exist in each branch rather than generating them. This is especially important for "k-th" problems.

3. **Test with small examples**: Always verify your logic with n=1, n=2, and small k values. This helps catch off-by-one errors and ensures you understand the lexicographic ordering.

[Practice this problem on CodeJeet](/problem/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n)
