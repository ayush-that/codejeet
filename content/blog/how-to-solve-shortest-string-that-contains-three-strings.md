---
title: "How to Solve Shortest String That Contains Three Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest String That Contains Three Strings. Medium difficulty, 31.5% acceptance rate. Topics: String, Greedy, Enumeration."
date: "2029-12-01"
category: "dsa-patterns"
tags: ["shortest-string-that-contains-three-strings", "string", "greedy", "enumeration", "medium"]
---

# How to Solve "Shortest String That Contains Three Strings"

This problem asks us to find the shortest possible string that contains three given strings as substrings, and if there are multiple strings with the same minimum length, return the lexicographically smallest one. What makes this problem interesting is that the optimal solution isn't simply concatenating the strings—we need to find overlaps between them to minimize the total length while maintaining all three as substrings.

## Visual Walkthrough

Let's trace through an example with `a = "abc"`, `b = "bcd"`, and `c = "cde"`.

**Step 1: Understanding the goal**
We need a string that contains all three strings. The naive concatenation would be `"abc" + "bcd" + "cde" = "abcbcdcde"` (9 characters). But we can do better by finding overlaps.

**Step 2: Finding overlaps**

- `a` ends with `"bc"`, `b` starts with `"bc"` → overlap of 2 characters
- `b` ends with `"cd"`, `c` starts with `"cd"` → overlap of 2 characters
- `a` ends with `"c"`, `c` starts with `"c"` → overlap of 1 character

**Step 3: Trying different orderings**
We need to try all permutations of the three strings (6 possibilities) because the optimal order isn't necessarily alphabetical:

1. `a + b + c`: `"abc" + "bcd" + "cde"` → `"abcbcdcde"` (9 chars)
   - But we can merge `a` and `b`: `"abc"` already contains `"bcd"`? No, but `"abc"` ends with `"bc"` and `"bcd"` starts with `"bc"`, so merged = `"abcd"`
   - Then merge with `c`: `"abcd"` ends with `"cd"`, `"cde"` starts with `"cd"`, so final = `"abcde"` (5 chars)

2. `a + c + b`: `"abc" + "cde" + "bcd"`
   - Merge `a` and `c`: `"abc"` ends with `"c"`, `"cde"` starts with `"c"`, so merged = `"abcde"`
   - Merge with `b`: `"abcde"` already contains `"bcd"`? Yes, as substring, so final = `"abcde"` (5 chars)

3. `b + a + c`: `"bcd" + "abc" + "cde"`
   - Merge `b` and `a`: `"bcd"` doesn't end with anything `"abc"` starts with, so concatenate = `"bcdabc"`
   - Merge with `c`: `"bcdabc"` ends with `"c"`, `"cde"` starts with `"c"`, so final = `"bcdabcde"` (8 chars)

We continue checking all permutations, and we find that `"abcde"` (5 characters) is the shortest possible result.

**Key insight**: We need to check all permutations and for each pair, find the maximum overlap when merging them.

## Brute Force Approach

A naive approach would be to generate all possible strings that contain the three substrings and find the shortest lexicographically smallest one. This is clearly infeasible because there are infinitely many possible strings.

What a candidate might try first is simply concatenating the strings in all possible orders (6 permutations) without trying to find overlaps. This would give us strings like `"abcbcdcde"` (9 chars) in our example, which isn't optimal because we found `"abcde"` (5 chars).

The problem with this naive concatenation is that it doesn't account for overlaps between strings. One string might already be contained within another, or two strings might share a common prefix/suffix that can be merged.

## Optimized Approach

The key insight is that we need to consider two things:

1. **All permutations** of the three strings (6 possibilities)
2. For each permutation, we need to **merge strings with maximum overlap**

**Step-by-step reasoning:**

1. **Overlap calculation**: Given two strings `s1` and `s2`, we want to find the maximum `k` such that the last `k` characters of `s1` equal the first `k` characters of `s2`. This `k` tells us how many characters we can save when merging.

2. **Merging two strings**: When merging `s1` and `s2`, if `s2` is already a substring of `s1`, we just keep `s1`. Otherwise, we append `s2` without the overlapping prefix.

3. **Trying all permutations**: We need to check all 6 orderings because the optimal result depends on the order. For example, with `["ab", "bc", "abc"]`, the optimal order is `["abc", "ab", "bc"]` since `"abc"` already contains the other two.

4. **Handling ties**: When two results have the same length, we need to return the lexicographically smallest one.

5. **Optimization**: We can precompute overlap values between all pairs of strings to avoid recalculating.

## Optimal Solution

The solution involves:

1. Generating all permutations of the three strings
2. For each permutation, merging them with maximum overlap
3. Keeping track of the best result (shortest, then lexicographically smallest)

<div class="code-group">

```python
# Time: O(1) - fixed 6 permutations, each merge is O(L) where L is string length
# Space: O(1) - storing permutations and results
def minimumString(a: str, b: str, c: str) -> str:
    # Helper function to merge two strings with maximum overlap
    def merge(s1: str, s2: str) -> str:
        # If s2 is already a substring of s1, return s1
        if s2 in s1:
            return s1

        # Try all possible overlap lengths from min(len(s1), len(s2)) down to 0
        overlap = 0
        # We check if the end of s1 matches the start of s2
        for k in range(min(len(s1), len(s2)), -1, -1):
            if s1[-k:] == s2[:k]:
                overlap = k
                break

        # Merge by taking s1 and appending the non-overlapping part of s2
        return s1 + s2[overlap:]

    # List of input strings
    strings = [a, b, c]
    best_result = None

    # Try all permutations of the three strings
    from itertools import permutations
    for perm in permutations(strings):
        # Start with first string
        current = perm[0]

        # Merge with the remaining two strings
        for i in range(1, 3):
            current = merge(current, perm[i])

        # Update best result
        if best_result is None:
            best_result = current
        else:
            # Compare by length first, then lexicographically
            if len(current) < len(best_result):
                best_result = current
            elif len(current) == len(best_result) and current < best_result:
                best_result = current

    return best_result
```

```javascript
// Time: O(1) - fixed 6 permutations, each merge is O(L) where L is string length
// Space: O(1) - storing permutations and results
function minimumString(a, b, c) {
  // Helper function to merge two strings with maximum overlap
  function merge(s1, s2) {
    // If s2 is already a substring of s1, return s1
    if (s1.includes(s2)) {
      return s1;
    }

    // Try all possible overlap lengths from min(len(s1), len(s2)) down to 0
    let overlap = 0;
    // We check if the end of s1 matches the start of s2
    const maxOverlap = Math.min(s1.length, s2.length);
    for (let k = maxOverlap; k >= 0; k--) {
      if (s1.slice(-k) === s2.slice(0, k)) {
        overlap = k;
        break;
      }
    }

    // Merge by taking s1 and appending the non-overlapping part of s2
    return s1 + s2.slice(overlap);
  }

  // Array of input strings
  const strings = [a, b, c];
  let bestResult = null;

  // Helper function to generate all permutations
  function generatePermutations(arr) {
    const result = [];

    function backtrack(start) {
      if (start === arr.length) {
        result.push([...arr]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        // Swap
        [arr[start], arr[i]] = [arr[i], arr[start]];
        backtrack(start + 1);
        // Backtrack
        [arr[start], arr[i]] = [arr[i], arr[start]];
      }
    }

    backtrack(0);
    return result;
  }

  // Try all permutations of the three strings
  const permutations = generatePermutations(strings);
  for (const perm of permutations) {
    // Start with first string
    let current = perm[0];

    // Merge with the remaining two strings
    for (let i = 1; i < 3; i++) {
      current = merge(current, perm[i]);
    }

    // Update best result
    if (bestResult === null) {
      bestResult = current;
    } else {
      // Compare by length first, then lexicographically
      if (current.length < bestResult.length) {
        bestResult = current;
      } else if (current.length === bestResult.length && current < bestResult) {
        bestResult = current;
      }
    }
  }

  return bestResult;
}
```

```java
// Time: O(1) - fixed 6 permutations, each merge is O(L) where L is string length
// Space: O(1) - storing permutations and results
import java.util.*;

class Solution {
    public String minimumString(String a, String b, String c) {
        // Helper function to merge two strings with maximum overlap
        String merge(String s1, String s2) {
            // If s2 is already a substring of s1, return s1
            if (s1.contains(s2)) {
                return s1;
            }

            // Try all possible overlap lengths from min(len(s1), len(s2)) down to 0
            int overlap = 0;
            // We check if the end of s1 matches the start of s2
            int maxOverlap = Math.min(s1.length(), s2.length());
            for (int k = maxOverlap; k >= 0; k--) {
                if (s1.substring(s1.length() - k).equals(s2.substring(0, k))) {
                    overlap = k;
                    break;
                }
            }

            // Merge by taking s1 and appending the non-overlapping part of s2
            return s1 + s2.substring(overlap);
        }

        // Array of input strings
        String[] strings = {a, b, c};
        String bestResult = null;

        // Generate all permutations of the three strings
        List<String[]> permutations = new ArrayList<>();
        generatePermutations(strings, 0, permutations);

        // Try all permutations
        for (String[] perm : permutations) {
            // Start with first string
            String current = perm[0];

            // Merge with the remaining two strings
            for (int i = 1; i < 3; i++) {
                current = merge(current, perm[i]);
            }

            // Update best result
            if (bestResult == null) {
                bestResult = current;
            } else {
                // Compare by length first, then lexicographically
                if (current.length() < bestResult.length()) {
                    bestResult = current;
                } else if (current.length() == bestResult.length() &&
                           current.compareTo(bestResult) < 0) {
                    bestResult = current;
                }
            }
        }

        return bestResult;
    }

    // Helper function to generate all permutations
    private void generatePermutations(String[] arr, int start, List<String[]> result) {
        if (start == arr.length) {
            result.add(arr.clone());
            return;
        }

        for (int i = start; i < arr.length; i++) {
            // Swap
            String temp = arr[start];
            arr[start] = arr[i];
            arr[i] = temp;

            generatePermutations(arr, start + 1, result);

            // Backtrack
            temp = arr[start];
            arr[start] = arr[i];
            arr[i] = temp;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1) in terms of permutations, but O(L) where L is the total length of strings for merging operations. Since we only have 3 strings, we have exactly 6 permutations to check. For each permutation, we perform 2 merge operations. Each merge operation takes O(min(len(s1), len(s2))) time to find the maximum overlap. In the worst case, this is O(L) where L is the sum of lengths of all strings.

**Space Complexity**: O(1) extra space beyond the input and output. We store the permutations (6 orderings of 3 strings) and a few temporary strings during merging.

## Common Mistakes

1. **Not checking all permutations**: Some candidates might try to merge strings in a fixed order (like alphabetical). This misses cases where a different order produces a shorter result.

2. **Incorrect overlap calculation**: When finding the overlap between two strings, it's crucial to check from the maximum possible overlap down to 0. Checking from 0 up would find the minimum overlap, not the maximum.

3. **Forgetting substring checks**: Before calculating overlap, we should check if one string is already a substring of the other. If `s2` is contained in `s1`, we can skip `s2` entirely.

4. **Lexicographic comparison errors**: When two results have the same length, we need to return the lexicographically smallest one. Some candidates forget this tie-breaking rule or implement it incorrectly (e.g., comparing before checking length).

## When You'll See This Pattern

This problem uses **permutation enumeration with greedy merging**, a pattern that appears in several optimization problems:

1. **Shortest Common Supersequence (Hard)**: A more general version where you need to find the shortest string containing multiple strings as subsequences (not necessarily contiguous).

2. **Find the Shortest Superstring (Hard)**: The generalization of this problem to N strings, which requires dynamic programming or approximation algorithms.

3. **String compression problems**: Where you need to find optimal ways to represent multiple strings with minimal total length by exploiting overlaps.

The core pattern is: when you need to find an optimal ordering of items where the cost/benefit depends on adjacent pairs, you often need to try all permutations (for small N) or use more sophisticated algorithms like DP for larger N.

## Key Takeaways

1. **Small permutation spaces are tractable**: When you have only a few items (like 3 strings with 6 permutations), brute-forcing all orderings is acceptable and often the simplest solution.

2. **Overlap-based merging is greedy but optimal for fixed order**: Once the order is fixed, merging strings with maximum overlap gives the optimal result for that order.

3. **Always check for containment**: Before calculating complex overlaps, check if one string is already a substring of another—this can simplify the problem significantly.

Related problems: [Shortest Common Supersequence](/problem/shortest-common-supersequence)
