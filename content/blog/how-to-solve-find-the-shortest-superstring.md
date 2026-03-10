---
title: "How to Solve Find the Shortest Superstring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Shortest Superstring. Hard difficulty, 45.1% acceptance rate. Topics: Array, String, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2029-02-10"
category: "dsa-patterns"
tags: ["find-the-shortest-superstring", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Find the Shortest Superstring

This problem asks us to find the shortest string that contains every given word as a substring. What makes this problem tricky is that the words can overlap in various ways, and we need to find the optimal ordering that maximizes these overlaps to minimize the final string length. This is essentially a variation of the Traveling Salesman Problem (TSP), where cities are words and the distance between them is how many characters we save by overlapping them.

## Visual Walkthrough

Let's trace through a small example: `words = ["catg","atgcatc"]`

1. First, we need to understand overlaps. The word "catg" ends with "atg", and "atgcatc" starts with "atg". So we can overlap them by 3 characters: "catg" + "catc" = "catgcatc" (8 chars) instead of "catgatgcatc" (11 chars).

2. But we also need to check the reverse: "atgcatc" ends with "atc", and "catg" starts with "cat" - no overlap possible here.

3. For two words, we simply pick the ordering that gives maximum overlap. Here, "catg" → "atgcatc" saves 3 characters, while the reverse saves 0. So the shortest superstring is "catgcatc".

Now let's try a more complex example with 3 words: `words = ["alex","loves","leetcode"]`

1. Calculate all pairwise overlaps:
   - "alex" → "loves": "alex" ends with "le", "loves" starts with "lo" - no overlap
   - "alex" → "leetcode": "alex" ends with "ex", "leetcode" starts with "le" - no overlap
   - "loves" → "alex": "loves" ends with "es", "alex" starts with "al" - no overlap
   - "loves" → "leetcode": "loves" ends with "es", "leetcode" starts with "le" - no overlap
   - "leetcode" → "alex": "leetcode" ends with "de", "alex" starts with "al" - no overlap
   - "leetcode" → "loves": "leetcode" ends with "de", "loves" starts with "lo" - no overlap

2. With no overlaps, the shortest superstring is simply concatenation in some order. We need to try all permutations to find the shortest concatenation.

This shows why brute force checking all permutations becomes infeasible for larger inputs - with n words, there are n! permutations to check.

## Brute Force Approach

The most straightforward approach is to generate all permutations of the words and for each permutation, merge the words sequentially while maximizing overlaps. We then pick the shortest resulting string.

Why this is too slow:

- With n words, there are n! permutations
- For each permutation, we need to merge n words, which takes O(L) time where L is the total length
- Total time complexity: O(n! × n × L) - completely impractical for n > 10

Even though we could optimize the merging process, the factorial growth makes this approach unusable for the typical constraints (n up to 12-20 in interview settings).

## Optimized Approach

The key insight is that this problem is equivalent to finding the shortest Hamiltonian path in a directed graph where:

- Nodes are words
- Edge weight from word i to word j = number of characters saved by putting j after i (i.e., overlap length)

This is exactly the Traveling Salesman Problem (TSP), which can be solved using dynamic programming with bitmasking.

Here's the step-by-step reasoning:

1. **Precompute overlaps**: For every pair of words (i, j), compute how many characters we save if word j comes immediately after word i. This is the maximum k such that the last k characters of i equal the first k characters of j.

2. **DP state definition**: Let `dp[mask][i]` = the maximum total overlap (savings) we can get when we've used the set of words represented by `mask` (bitmask where bit k = 1 if word k is used), and the last word used is word i.

3. **DP transition**: To compute `dp[mask][i]`, we look at all words j that are not in the mask. The new state would be `dp[mask | (1 << j)][j] = max(dp[mask | (1 << j)][j], dp[mask][i] + overlap[i][j])`.

4. **Reconstruct the path**: Once we find the maximum total overlap, we trace back through the DP table to reconstruct the actual string.

5. **Handle the starting point**: We need to try each word as the starting point since TSP finds cycles but we need a path.

The time complexity is O(n² × 2ⁿ), which is much better than O(n!) for n ≤ 20.

## Optimal Solution

Here's the complete implementation using dynamic programming with bitmasking:

<div class="code-group">

```python
# Time: O(n^2 * 2^n) where n = len(words)
# Space: O(n * 2^n) for the DP table
def shortestSuperstring(words):
    n = len(words)

    # Step 1: Precompute the overlap between every pair of words
    # overlap[i][j] = k means last k chars of words[i] match first k chars of words[j]
    overlap = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            # Try all possible overlap lengths, from min to 1
            min_len = min(len(words[i]), len(words[j]))
            for k in range(min_len, 0, -1):
                if words[i][-k:] == words[j][:k]:
                    overlap[i][j] = k
                    break

    # Step 2: DP with bitmask
    # dp[mask][i] = maximum overlap achieved with set of words represented by mask,
    # ending with word i
    dp = [[0] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]

    # Initialize DP: starting with each word alone
    for i in range(n):
        dp[1 << i][i] = 0  # No overlap with just one word

    # Fill DP table
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue  # last word not in current mask

            # Try to add a new word 'nxt' to the current set
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue  # nxt already used

                new_mask = mask | (1 << nxt)
                # New overlap = current overlap + overlap from last to nxt
                new_overlap = dp[mask][last] + overlap[last][nxt]

                if new_overlap > dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_overlap
                    parent[new_mask][nxt] = last

    # Step 3: Find the maximum overlap path (ending with any word)
    full_mask = (1 << n) - 1
    last_word = max(range(n), key=lambda i: dp[full_mask][i])
    max_overlap = dp[full_mask][last_word]

    # Step 4: Reconstruct the path
    path = []
    mask = full_mask
    while last_word != -1:
        path.append(last_word)
        prev_last = parent[mask][last_word]
        mask ^= (1 << last_word)  # Remove current word from mask
        last_word = prev_last
    path.reverse()

    # Step 5: Build the result string
    result = words[path[0]]
    for i in range(1, len(path)):
        prev, curr = path[i-1], path[i]
        # Append only the non-overlapping part of current word
        overlap_len = overlap[prev][curr]
        result += words[curr][overlap_len:]

    return result
```

```javascript
// Time: O(n^2 * 2^n) where n = words.length
// Space: O(n * 2^n) for the DP table
function shortestSuperstring(words) {
  const n = words.length;

  // Step 1: Precompute overlaps between all pairs of words
  const overlap = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // Try all possible overlap lengths from largest to smallest
      const minLen = Math.min(words[i].length, words[j].length);
      for (let k = minLen; k > 0; k--) {
        if (words[i].slice(-k) === words[j].slice(0, k)) {
          overlap[i][j] = k;
          break;
        }
      }
    }
  }

  // Step 2: DP with bitmask
  // dp[mask][i] = max overlap with mask set ending at word i
  const dp = Array(1 << n)
    .fill()
    .map(() => Array(n).fill(0));
  const parent = Array(1 << n)
    .fill()
    .map(() => Array(n).fill(-1));

  // Initialize: each word by itself has 0 overlap
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = 0;
  }

  // Fill DP table
  for (let mask = 0; mask < 1 << n; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;

      for (let nxt = 0; nxt < n; nxt++) {
        if (mask & (1 << nxt)) continue;

        const newMask = mask | (1 << nxt);
        const newOverlap = dp[mask][last] + overlap[last][nxt];

        if (newOverlap > dp[newMask][nxt]) {
          dp[newMask][nxt] = newOverlap;
          parent[newMask][nxt] = last;
        }
      }
    }
  }

  // Step 3: Find the ending word with maximum overlap
  const fullMask = (1 << n) - 1;
  let lastWord = 0;
  let maxOverlap = dp[fullMask][0];
  for (let i = 1; i < n; i++) {
    if (dp[fullMask][i] > maxOverlap) {
      maxOverlap = dp[fullMask][i];
      lastWord = i;
    }
  }

  // Step 4: Reconstruct the path
  const path = [];
  let mask = fullMask;
  let current = lastWord;
  while (current !== -1) {
    path.push(current);
    const prev = parent[mask][current];
    mask ^= 1 << current; // Remove current from mask
    current = prev;
  }
  path.reverse();

  // Step 5: Build the result string
  let result = words[path[0]];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const overlapLen = overlap[prev][curr];
    result += words[curr].slice(overlapLen);
  }

  return result;
}
```

```java
// Time: O(n^2 * 2^n) where n = words.length
// Space: O(n * 2^n) for the DP table
class Solution {
    public String shortestSuperstring(String[] words) {
        int n = words.length;

        // Step 1: Precompute overlaps
        int[][] overlap = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                // Try all possible overlap lengths
                int minLen = Math.min(words[i].length(), words[j].length());
                for (int k = minLen; k > 0; k--) {
                    if (words[i].substring(words[i].length() - k).equals(
                        words[j].substring(0, k))) {
                        overlap[i][j] = k;
                        break;
                    }
                }
            }
        }

        // Step 2: DP with bitmask
        // dp[mask][i] = max overlap with mask ending at i
        int[][] dp = new int[1 << n][n];
        int[][] parent = new int[1 << n][n];
        for (int i = 0; i < (1 << n); i++) {
            Arrays.fill(parent[i], -1);
        }

        // Initialize
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = 0;
        }

        // Fill DP table
        for (int mask = 0; mask < (1 << n); mask++) {
            for (int last = 0; last < n; last++) {
                if ((mask & (1 << last)) == 0) continue;

                for (int nxt = 0; nxt < n; nxt++) {
                    if ((mask & (1 << nxt)) != 0) continue;

                    int newMask = mask | (1 << nxt);
                    int newOverlap = dp[mask][last] + overlap[last][nxt];

                    if (newOverlap > dp[newMask][nxt]) {
                        dp[newMask][nxt] = newOverlap;
                        parent[newMask][nxt] = last;
                    }
                }
            }
        }

        // Step 3: Find the ending with maximum overlap
        int fullMask = (1 << n) - 1;
        int lastWord = 0;
        for (int i = 1; i < n; i++) {
            if (dp[fullMask][i] > dp[fullMask][lastWord]) {
                lastWord = i;
            }
        }

        // Step 4: Reconstruct path
        List<Integer> path = new ArrayList<>();
        int mask = fullMask;
        int current = lastWord;
        while (current != -1) {
            path.add(current);
            int prev = parent[mask][current];
            mask ^= (1 << current);  // Remove current from mask
            current = prev;
        }
        Collections.reverse(path);

        // Step 5: Build result
        StringBuilder result = new StringBuilder(words[path.get(0)]);
        for (int i = 1; i < path.size(); i++) {
            int prev = path.get(i-1);
            int curr = path.get(i);
            int overlapLen = overlap[prev][curr];
            result.append(words[curr].substring(overlapLen));
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × 2ⁿ)

- Precomputing overlaps: O(n² × L) where L is average word length
- DP table has 2ⁿ × n states
- For each state, we try n possible next words
- Total: O(n² × 2ⁿ) dominates for reasonable n

**Space Complexity:** O(n × 2ⁿ)

- DP table: 2ⁿ × n integers
- Parent table: 2ⁿ × n integers
- Overlap matrix: n × n integers
- Total: O(n × 2ⁿ) dominates

For n ≤ 20, this is feasible (2²⁰ ≈ 1 million states). Beyond that, we'd need heuristic approaches.

## Common Mistakes

1. **Forgetting to handle the case where words can fully contain each other**: The problem states no word is a substring of another, but candidates sometimes write overlap code that doesn't handle edge cases properly. Always check the problem constraints.

2. **Incorrect overlap calculation**: The naive approach of checking if one word ends with another's beginning is O(L²) per pair if done inefficiently. The optimal way is to try overlap lengths from min(len(i), len(j)) down to 1.

3. **Wrong DP state definition**: Some candidates define dp[mask] without tracking the last word, which doesn't provide enough information to compute transitions correctly. You need both the set of used words AND the last word used.

4. **Off-by-one errors in bitmask operations**: Common mistakes include using 1 << n instead of 1 << n - 1 for the full mask, or incorrect bit manipulation when reconstructing the path.

## When You'll See This Pattern

This DP + bitmask pattern appears in problems where you need to:

1. Choose an optimal ordering/permutation of items
2. The cost/benefit depends on adjacent items
3. The number of items is small enough for exponential solutions (typically n ≤ 20)

Related LeetCode problems:

1. **Maximum Rows Covered by Columns** - Uses bitmask to represent column choices
2. **Find the Minimum Cost Array Permutation** - Similar TSP-style DP with bitmask
3. **Campus Bikes II** - Assignment problem solved with DP + bitmask
4. **Number of Ways to Wear Different Hats to Each Other** - Bitmask DP on hat assignments

## Key Takeaways

1. **Recognize TSP in disguise**: When you need an optimal ordering where "distance" depends on adjacent pairs, think of TSP and DP with bitmasking.

2. **Bitmask DP pattern**: Use an integer mask to represent subsets, dp[mask][last] to store best solution for subset ending with specific element.

3. **Constraint-based approach selection**: For n ≤ 20, O(n² × 2ⁿ) is often acceptable. For larger n, you'd need approximation algorithms or different approaches.

Related problems: [Maximum Rows Covered by Columns](/problem/maximum-rows-covered-by-columns), [Find the Minimum Cost Array Permutation](/problem/find-the-minimum-cost-array-permutation), [Find the Shortest Superstring II](/problem/find-the-shortest-superstring-ii)
