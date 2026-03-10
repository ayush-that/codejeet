---
title: "How to Solve Find the Lexicographically Smallest Valid Sequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Lexicographically Smallest Valid Sequence. Medium difficulty, 21.6% acceptance rate. Topics: Two Pointers, String, Dynamic Programming, Greedy."
date: "2026-07-13"
category: "dsa-patterns"
tags:
  [
    "find-the-lexicographically-smallest-valid-sequence",
    "two-pointers",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Find the Lexicographically Smallest Valid Sequence

This problem asks us to find the lexicographically smallest valid sequence of indices where we can extract a subsequence from `word1` that is "almost equal" to `word2`. The "almost equal" condition means we can change at most one character in the extracted subsequence to make it identical to `word2`. What makes this problem tricky is balancing two competing goals: we need the lexicographically smallest sequence (which favors picking the earliest possible characters), but we also need to ensure we can actually match `word2` with at most one mismatch.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `word1 = "abca"`
- `word2 = "ac"`

We need to find indices `[i, j]` from `word1` such that:

1. `i < j` (ascending order)
2. The characters at these indices in `word1` form a string that can become `"ac"` by changing at most one character

Let's think about possible sequences:

- `[0, 2]` gives `"ab"` → needs to change 'b' to 'c' (1 change, valid)
- `[0, 3]` gives `"ac"` → already matches (0 changes, valid)
- `[1, 3]` gives `"bc"` → needs to change 'b' to 'a' (1 change, valid)

The lexicographically smallest valid sequence is `[0, 2]` because `[0, 2]` comes before `[0, 3]` when comparing sequences (first element 0 vs 0, second element 2 vs 3).

But wait — we need to be careful! The problem says we need a sequence of indices where concatenating characters at those indices forms a string almost equal to `word2`. Since `word2` has length 2, our sequence must have exactly 2 indices.

Now let's consider a more complex example:

- `word1 = "abcde"`
- `word2 = "bd"`

Possible valid sequences:

- `[1, 3]` gives `"bd"` → matches exactly (best case)
- `[0, 3]` gives `"ad"` → change 'a' to 'b' (1 change, valid)
- `[1, 4]` gives `"be"` → change 'e' to 'd' (1 change, valid)

The lexicographically smallest is `[0, 3]` because `[0, 3]` < `[1, 3]` < `[1, 4]` when comparing sequences lexicographically.

The key insight: For each possible mismatch position in `word2`, we can try to find the earliest indices in `word1` that allow us to match `word2` with that specific character being the potential mismatch.

## Brute Force Approach

A naive approach would be to try all possible pairs of indices `(i, j)` from `word1` where `i < j` and `j-i+1 >= len(word2)`. For each pair, we'd extract the subsequence and check if it's almost equal to `word2`.

The brute force algorithm:

1. Generate all possible starting indices `i` in `word1`
2. For each `i`, generate all possible ending indices `j > i`
3. For each pair `(i, j)`, extract the substring and check if it matches `word2` with at most one mismatch
4. Keep track of the lexicographically smallest valid pair

This approach has several problems:

- Time complexity is O(n³) where n is length of `word1` (O(n²) pairs × O(k) to check each, where k = len(word2))
- It doesn't efficiently handle the "lexicographically smallest" requirement
- It doesn't leverage the fact that we only need exactly `len(word2)` characters

The brute force would be too slow for the constraints (strings up to length 10⁵).

## Optimized Approach

The key insight is that we need exactly `len(word2)` characters from `word1`, and we can have at most one mismatch. This means we can think about it as: we need to find the earliest occurrence of a subsequence in `word1` that matches `word2` with either:

1. Zero mismatches (perfect match)
2. Exactly one mismatch at some position

For the lexicographically smallest sequence, we want the smallest possible first index, then the smallest possible second index given that first index, and so on.

We can use a greedy approach with preprocessing:

1. Precompute for each position in `word1`, the next occurrence of each character after that position
2. Try to match `word2` character by character from `word1`
3. If we encounter a mismatch, we have two options:
   - Skip this mismatch and continue matching
   - Use this as our one allowed mismatch
4. We need to track the earliest indices where we can achieve a valid match

The optimal solution uses dynamic programming with greedy selection:

- Let `dp[i][j]` represent the earliest index in `word1` where we can match the first `j` characters of `word2` with exactly `i` mismatches
- We fill this table greedily, always taking the earliest possible next character
- At the end, if `dp[0][m]` or `dp[1][m]` exists (where m = len(word2)), we have a valid sequence

## Optimal Solution

The most efficient solution uses next occurrence preprocessing and greedy matching:

<div class="code-group">

```python
# Time: O(n * 26 + m) where n = len(word1), m = len(word2)
# Space: O(n * 26) for the next occurrence table
def smallestValidSequence(word1: str, word2: str):
    n, m = len(word1), len(word2)

    # Precompute next occurrence of each character after each position
    # next_pos[i][c] = next index >= i where word1[index] == chr(c + 'a')
    next_pos = [[-1] * 26 for _ in range(n + 2)]

    # Initialize last row with -1 (no characters after the end)
    for c in range(26):
        next_pos[n][c] = -1

    # Fill the table from right to left
    for i in range(n - 1, -1, -1):
        # Copy next row's values
        for c in range(26):
            next_pos[i][c] = next_pos[i + 1][c]
        # Update current character's position
        next_pos[i][ord(word1[i]) - ord('a')] = i

    # Try to find valid sequence with 0 mismatches first (lexicographically smallest)
    result = []
    current_pos = 0  # Current position in word1
    mismatches = 0   # Number of mismatches used

    for j in range(m):
        needed_char = ord(word2[j]) - ord('a')

        # Find next occurrence of needed character
        next_idx = next_pos[current_pos][needed_char]

        if next_idx == -1:
            # Character not found, need to use a mismatch
            if mismatches >= 1:
                return []  # Already used our one mismatch

            # Use a mismatch: find the smallest possible next character
            mismatches = 1
            smallest_next = n + 1
            chosen_char = -1

            # Try all possible characters for the mismatch
            for c in range(26):
                idx = next_pos[current_pos][c]
                if idx != -1 and idx < smallest_next:
                    smallest_next = idx
                    chosen_char = c

            if smallest_next > n:
                return []  # No valid character found

            result.append(smallest_next)
            current_pos = smallest_next + 1
        else:
            # Found matching character
            result.append(next_idx)
            current_pos = next_idx + 1

    # Check if we have a valid sequence
    if mismatches <= 1 and len(result) == m:
        return result

    # If 0 mismatches didn't work, try with exactly 1 mismatch
    # We need to try placing the mismatch at each position
    best_result = None

    for mismatch_pos in range(m):
        result = []
        current_pos = 0
        mismatches = 0

        for j in range(m):
            if j == mismatch_pos:
                # This is our allowed mismatch position
                # Find the smallest possible character that's NOT word2[j]
                needed_char = ord(word2[j]) - ord('a')
                smallest_next = n + 1
                chosen_char = -1

                for c in range(26):
                    if c == needed_char:
                        continue  # Skip the matching character
                    idx = next_pos[current_pos][c]
                    if idx != -1 and idx < smallest_next:
                        smallest_next = idx
                        chosen_char = c

                if smallest_next > n:
                    break  # No valid mismatch at this position

                result.append(smallest_next)
                current_pos = smallest_next + 1
                mismatches = 1
            else:
                # Normal matching
                needed_char = ord(word2[j]) - ord('a')
                next_idx = next_pos[current_pos][needed_char]

                if next_idx == -1:
                    break  # Cannot match

                result.append(next_idx)
                current_pos = next_idx + 1

        # Check if this is a valid complete sequence
        if len(result) == m and mismatches == 1:
            if best_result is None or result < best_result:
                best_result = result.copy()

    return best_result if best_result is not None else []
```

```javascript
// Time: O(n * 26 + m) where n = word1.length, m = word2.length
// Space: O(n * 26) for the next occurrence table
function smallestValidSequence(word1, word2) {
  const n = word1.length,
    m = word2.length;

  // Precompute next occurrence of each character after each position
  // nextPos[i][c] = next index >= i where word1[index] == String.fromCharCode(c + 97)
  const nextPos = Array(n + 2)
    .fill()
    .map(() => Array(26).fill(-1));

  // Initialize last row with -1
  for (let c = 0; c < 26; c++) {
    nextPos[n][c] = -1;
  }

  // Fill the table from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Copy next row's values
    for (let c = 0; c < 26; c++) {
      nextPos[i][c] = nextPos[i + 1][c];
    }
    // Update current character's position
    const charCode = word1.charCodeAt(i) - 97;
    nextPos[i][charCode] = i;
  }

  // Try to find valid sequence with 0 mismatches first
  let result = [];
  let currentPos = 0;
  let mismatches = 0;

  for (let j = 0; j < m; j++) {
    const neededChar = word2.charCodeAt(j) - 97;
    let nextIdx = nextPos[currentPos][neededChar];

    if (nextIdx === -1) {
      // Character not found, need to use a mismatch
      if (mismatches >= 1) {
        return []; // Already used our one mismatch
      }

      // Use a mismatch: find the smallest possible next character
      mismatches = 1;
      let smallestNext = n + 1;
      let chosenChar = -1;

      // Try all possible characters for the mismatch
      for (let c = 0; c < 26; c++) {
        const idx = nextPos[currentPos][c];
        if (idx !== -1 && idx < smallestNext) {
          smallestNext = idx;
          chosenChar = c;
        }
      }

      if (smallestNext > n) {
        return []; // No valid character found
      }

      result.push(smallestNext);
      currentPos = smallestNext + 1;
    } else {
      // Found matching character
      result.push(nextIdx);
      currentPos = nextIdx + 1;
    }
  }

  // Check if we have a valid sequence
  if (mismatches <= 1 && result.length === m) {
    return result;
  }

  // If 0 mismatches didn't work, try with exactly 1 mismatch
  let bestResult = null;

  for (let mismatchPos = 0; mismatchPos < m; mismatchPos++) {
    result = [];
    currentPos = 0;
    mismatches = 0;
    let valid = true;

    for (let j = 0; j < m; j++) {
      if (j === mismatchPos) {
        // This is our allowed mismatch position
        const neededChar = word2.charCodeAt(j) - 97;
        let smallestNext = n + 1;
        let chosenChar = -1;

        for (let c = 0; c < 26; c++) {
          if (c === neededChar) continue; // Skip the matching character
          const idx = nextPos[currentPos][c];
          if (idx !== -1 && idx < smallestNext) {
            smallestNext = idx;
            chosenChar = c;
          }
        }

        if (smallestNext > n) {
          valid = false;
          break;
        }

        result.push(smallestNext);
        currentPos = smallestNext + 1;
        mismatches = 1;
      } else {
        // Normal matching
        const neededChar = word2.charCodeAt(j) - 97;
        const nextIdx = nextPos[currentPos][neededChar];

        if (nextIdx === -1) {
          valid = false;
          break;
        }

        result.push(nextIdx);
        currentPos = nextIdx + 1;
      }
    }

    // Check if this is a valid complete sequence
    if (valid && result.length === m && mismatches === 1) {
      if (
        bestResult === null ||
        result[0] < bestResult[0] ||
        (result[0] === bestResult[0] && result[1] < bestResult[1])
      ) {
        bestResult = [...result];
      }
    }
  }

  return bestResult !== null ? bestResult : [];
}
```

```java
// Time: O(n * 26 + m) where n = word1.length(), m = word2.length()
// Space: O(n * 26) for the next occurrence table
import java.util.*;

public class Solution {
    public List<Integer> smallestValidSequence(String word1, String word2) {
        int n = word1.length(), m = word2.length();

        // Precompute next occurrence of each character after each position
        // nextPos[i][c] = next index >= i where word1.charAt(index) == (char)(c + 'a')
        int[][] nextPos = new int[n + 2][26];

        // Initialize with -1
        for (int i = 0; i <= n + 1; i++) {
            Arrays.fill(nextPos[i], -1);
        }

        // Fill the table from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Copy next row's values
            System.arraycopy(nextPos[i + 1], 0, nextPos[i], 0, 26);
            // Update current character's position
            int charIdx = word1.charAt(i) - 'a';
            nextPos[i][charIdx] = i;
        }

        // Try to find valid sequence with 0 mismatches first
        List<Integer> result = new ArrayList<>();
        int currentPos = 0;
        int mismatches = 0;

        for (int j = 0; j < m; j++) {
            int neededChar = word2.charAt(j) - 'a';
            int nextIdx = nextPos[currentPos][neededChar];

            if (nextIdx == -1) {
                // Character not found, need to use a mismatch
                if (mismatches >= 1) {
                    return new ArrayList<>();  // Already used our one mismatch
                }

                // Use a mismatch: find the smallest possible next character
                mismatches = 1;
                int smallestNext = n + 1;
                int chosenChar = -1;

                // Try all possible characters for the mismatch
                for (int c = 0; c < 26; c++) {
                    int idx = nextPos[currentPos][c];
                    if (idx != -1 && idx < smallestNext) {
                        smallestNext = idx;
                        chosenChar = c;
                    }
                }

                if (smallestNext > n) {
                    return new ArrayList<>();  // No valid character found
                }

                result.add(smallestNext);
                currentPos = smallestNext + 1;
            } else {
                // Found matching character
                result.add(nextIdx);
                currentPos = nextIdx + 1;
            }
        }

        // Check if we have a valid sequence
        if (mismatches <= 1 && result.size() == m) {
            return result;
        }

        // If 0 mismatches didn't work, try with exactly 1 mismatch
        List<Integer> bestResult = null;

        for (int mismatchPos = 0; mismatchPos < m; mismatchPos++) {
            result = new ArrayList<>();
            currentPos = 0;
            mismatches = 0;
            boolean valid = true;

            for (int j = 0; j < m; j++) {
                if (j == mismatchPos) {
                    // This is our allowed mismatch position
                    int neededChar = word2.charAt(j) - 'a';
                    int smallestNext = n + 1;
                    int chosenChar = -1;

                    for (int c = 0; c < 26; c++) {
                        if (c == neededChar) continue;  // Skip the matching character
                        int idx = nextPos[currentPos][c];
                        if (idx != -1 && idx < smallestNext) {
                            smallestNext = idx;
                            chosenChar = c;
                        }
                    }

                    if (smallestNext > n) {
                        valid = false;
                        break;
                    }

                    result.add(smallestNext);
                    currentPos = smallestNext + 1;
                    mismatches = 1;
                } else {
                    // Normal matching
                    int neededChar = word2.charAt(j) - 'a';
                    int nextIdx = nextPos[currentPos][neededChar];

                    if (nextIdx == -1) {
                        valid = false;
                        break;
                    }

                    result.add(nextIdx);
                    currentPos = nextIdx + 1;
                }
            }

            // Check if this is a valid complete sequence
            if (valid && result.size() == m && mismatches == 1) {
                if (bestResult == null || isLexicographicallySmaller(result, bestResult)) {
                    bestResult = new ArrayList<>(result);
                }
            }
        }

        return bestResult != null ? bestResult : new ArrayList<>();
    }

    private boolean isLexicographicallySmaller(List<Integer> a, List<Integer> b) {
        for (int i = 0; i < a.size(); i++) {
            if (a.get(i) < b.get(i)) return true;
            if (a.get(i) > b.get(i)) return false;
        }
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 26 + m × 26) = O(n + m)

- Building the next occurrence table takes O(n × 26) time
- Trying 0 mismatches case takes O(m) time
- Trying each possible mismatch position takes O(m × 26) time
- Overall linear in input size with a constant factor of 26 (alphabet size)

**Space Complexity:** O(n × 26)

- The next occurrence table stores 26 integers for each position in `word1`
- Additional O(m) space for storing results

The constant factor 26 comes from the lowercase English alphabet. If the alphabet were larger, we could use a hash map instead, giving O(n + m) expected time.

## Common Mistakes

1. **Not handling the "at most one mismatch" correctly**: Candidates often try to find exact matches only, forgetting that a single character can be different. Remember to try both 0 and 1 mismatch cases.

2. **Incorrect lexicographical comparison of index sequences**: When comparing `[i1, j1]` vs `[i2, j2]`, we compare `i1` with `i2` first, then `j1` with `j2`. Some candidates compare the concatenated strings instead of the indices themselves.

3. **Off-by-one errors in next occurrence table**: The preprocessing step is tricky. Remember that `next_pos[i][c]` should give the next occurrence starting at or after position `i`. The initialization and update logic must be correct.

4. **Not considering all possible mismatch positions**: When we have exactly one mismatch, it could be at any position in `word2`. We need to try all possibilities to find the lexicographically smallest result.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Next occurrence preprocessing**: Similar to problems like [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences/), where we precompute where each character appears next to efficiently check subsequences.

2. **Greedy with limited mismatches**: Like [Edit Distance](https://leetcode.com/problems/edit-distance/) but with a constraint (only one substitution allowed). The "at most one change" constraint simplifies what would otherwise be a DP problem.

3. **Lexicographically smallest sequence**: Common in problems like [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/) and [Smallest Subsequence of Distinct Characters](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/), where we need the smallest possible result according to dictionary order.

## Key Takeaways

1. **Preprocessing character positions** is a powerful technique for subsequence problems. By knowing where each character appears next, we can efficiently check if a string is a subsequence.

2. **When allowed limited errors**, try the perfect case first, then systematically try each possible error position. This is more efficient than trying all possible error combinations.

3. **Lexicographical comparison of sequences** compares elements from left to right. For the smallest sequence, prioritize making the first element as small as possible, then the second, and so on.

Related problems: [Smallest K-Length Subsequence With Occurrences of a Letter](/problem/smallest-k-length-subsequence-with-occurrences-of-a-letter)
