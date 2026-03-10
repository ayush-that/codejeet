---
title: "How to Solve Kth Smallest Instructions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Kth Smallest Instructions. Hard difficulty, 44.7% acceptance rate. Topics: Array, Math, Dynamic Programming, Combinatorics."
date: "2030-01-02"
category: "dsa-patterns"
tags: ["kth-smallest-instructions", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Kth Smallest Instructions

Bob needs to reach destination `(row, column)` starting from `(0, 0)` using only right (`'H'`) and down (`'V'`) moves. We must find the **k-th lexicographically smallest instruction string** among all valid paths. The challenge is that we can't generate all paths (there are too many), so we need to compute the k-th path directly using combinatorial counting.

## Visual Walkthrough

Let's trace through a concrete example: `destination = (2, 3)` and `k = 1`. Bob needs 2 down moves and 3 right moves (total 5 moves).

**Step 1: Understanding the problem space**

- Total moves needed: `row + column = 2 + 3 = 5` moves
- We need exactly 2 `'V'` (down) and 3 `'H'` (right) in any order
- Total possible paths: C(5, 2) = 10 (choose positions for the 2 down moves)
- All paths sorted lexicographically (where `'H'` < `'V'` since `'H'` comes first alphabetically)

**Step 2: Building the k-th path step by step**
We start with an empty string and decide each character from left to right:

1. **First position decision**: How many paths start with `'H'`?
   - If we choose `'H'`, we have 4 moves left: 2 `'V'` and 2 `'H'`
   - Paths starting with `'H'`: C(4, 2) = 6
   - Since k = 1 ≤ 6, first character must be `'H'`
   - Current string: `"H"`, remaining: 2 `'V'`, 2 `'H'`, k = 1

2. **Second position decision**: How many paths start with `"HH"`?
   - If we choose `'H'`, we have 3 moves left: 2 `'V'` and 1 `'H'`
   - Paths starting with `"HH"`: C(3, 2) = 3
   - Since k = 1 ≤ 3, second character is `'H'`
   - Current string: `"HH"`, remaining: 2 `'V'`, 1 `'H'`, k = 1

3. **Third position decision**: How many paths start with `"HHH"`?
   - If we choose `'H'`, we have 2 moves left: 2 `'V'` and 0 `'H'`
   - Paths starting with `"HHH"`: C(2, 2) = 1
   - Since k = 1 ≤ 1, third character is `'H'`
   - Current string: `"HHH"`, remaining: 2 `'V'`, 0 `'H'`, k = 1

4. **Fourth position decision**: Only `'V'` moves remain (no `'H'` left)
   - Must choose `'V'`
   - Current string: `"HHHV"`, remaining: 1 `'V'`, 0 `'H'`, k = 1

5. **Fifth position decision**: Only `'V'` moves remain
   - Must choose `'V'`
   - Final string: `"HHHVV"`

This is the 1st lexicographically smallest instruction for reaching (2, 3).

## Brute Force Approach

A naive approach would generate all possible instruction strings, sort them lexicographically, and return the k-th one.

**Why this fails:**

- Number of paths grows combinatorially: C(row+column, row)
- For destination (15, 15), that's C(30, 15) ≈ 155 million paths
- Generating and sorting all paths is impossible within time limits
- Even storing all paths would require enormous memory

The brute force approach helps us understand the problem structure but is completely impractical for the constraints.

## Optimized Approach

The key insight is that we can **construct the k-th path directly** without generating all paths, using combinatorial counting to make decisions at each step.

**Step-by-step reasoning:**

1. **Initial setup**: We need `v = row` down moves and `h = column` right moves.
2. **At each position**: Decide whether to place `'H'` or `'V'`
3. **Counting paths starting with `'H'`**:
   - If we choose `'H'`, we have `h-1` right moves and `v` down moves left
   - Number of remaining paths: C(h+v-1, v) (choose positions for v down moves)
4. **Decision rule**:
   - If `k ≤ C(h+v-1, v)`, we must choose `'H'` (k-th path is among those starting with `'H'`)
   - Otherwise, choose `'V'` and subtract C(h+v-1, v) from k (skip all paths starting with `'H'`)
5. **Repeat** until all moves are placed

**Why this works:**

- We're effectively doing a "lexicographic search" where we count how many paths begin with each prefix
- By comparing k with these counts, we can determine each character
- This is similar to finding the k-th permutation of a multiset

**Precomputing combinations:**
We need to compute binomial coefficients efficiently. We can:

- Use Pascal's triangle to precompute C(n, k) for all needed values
- Handle large numbers carefully (results can be huge but k fits in 32-bit integer)

## Optimal Solution

<div class="code-group">

```python
# Time: O((row+column)^2) | Space: O((row+column)^2)
def kthSmallestPath(destination, k):
    """
    Returns the k-th lexicographically smallest instruction string
    to reach destination (row, column) from (0, 0) using only
    right ('H') and down ('V') moves.
    """
    row, col = destination
    v = row  # number of down moves needed
    h = col  # number of right moves needed
    total_moves = v + h

    # Precompute binomial coefficients using Pascal's triangle
    # comb[n][k] = C(n, k) = number of ways to choose k from n
    comb = [[0] * (total_moves + 1) for _ in range(total_moves + 1)]

    # Base cases: C(n, 0) = C(n, n) = 1
    for n in range(total_moves + 1):
        comb[n][0] = 1
        comb[n][n] = 1

    # Fill Pascal's triangle
    for n in range(2, total_moves + 1):
        for k in range(1, n):
            comb[n][k] = comb[n-1][k-1] + comb[n-1][k]

    result = []

    # Construct the path character by character
    while h > 0 or v > 0:
        if h == 0:
            # No more 'H' moves available, must use 'V'
            result.append('V')
            v -= 1
        elif v == 0:
            # No more 'V' moves available, must use 'H'
            result.append('H')
            h -= 1
        else:
            # We have both moves available
            # Count how many paths start with 'H'
            # C(h+v-1, v) = choose positions for v down moves in remaining h+v-1 spots
            count_start_with_H = comb[h+v-1][v]

            if k <= count_start_with_H:
                # k-th path is among those starting with 'H'
                result.append('H')
                h -= 1
            else:
                # k-th path starts with 'V', skip all paths starting with 'H'
                result.append('V')
                k -= count_start_with_H  # Adjust k to skip 'H' paths
                v -= 1

    return ''.join(result)
```

```javascript
// Time: O((row+column)^2) | Space: O((row+column)^2)
function kthSmallestPath(destination, k) {
  /**
   * Returns the k-th lexicographically smallest instruction string
   * to reach destination (row, column) from (0, 0) using only
   * right ('H') and down ('V') moves.
   */
  const [row, col] = destination;
  let v = row; // number of down moves needed
  let h = col; // number of right moves needed
  const totalMoves = v + h;

  // Precompute binomial coefficients using Pascal's triangle
  // comb[n][k] = C(n, k) = number of ways to choose k from n
  const comb = Array(totalMoves + 1)
    .fill()
    .map(() => Array(totalMoves + 1).fill(0));

  // Base cases: C(n, 0) = C(n, n) = 1
  for (let n = 0; n <= totalMoves; n++) {
    comb[n][0] = 1;
    comb[n][n] = 1;
  }

  // Fill Pascal's triangle
  for (let n = 2; n <= totalMoves; n++) {
    for (let k = 1; k < n; k++) {
      comb[n][k] = comb[n - 1][k - 1] + comb[n - 1][k];
    }
  }

  const result = [];

  // Construct the path character by character
  while (h > 0 || v > 0) {
    if (h === 0) {
      // No more 'H' moves available, must use 'V'
      result.push("V");
      v--;
    } else if (v === 0) {
      // No more 'V' moves available, must use 'H'
      result.push("H");
      h--;
    } else {
      // We have both moves available
      // Count how many paths start with 'H'
      // C(h+v-1, v) = choose positions for v down moves in remaining h+v-1 spots
      const countStartWithH = comb[h + v - 1][v];

      if (k <= countStartWithH) {
        // k-th path is among those starting with 'H'
        result.push("H");
        h--;
      } else {
        // k-th path starts with 'V', skip all paths starting with 'H'
        result.push("V");
        k -= countStartWithH; // Adjust k to skip 'H' paths
        v--;
      }
    }
  }

  return result.join("");
}
```

```java
// Time: O((row+column)^2) | Space: O((row+column)^2)
class Solution {
    public String kthSmallestPath(int[] destination, int k) {
        /**
         * Returns the k-th lexicographically smallest instruction string
         * to reach destination (row, column) from (0, 0) using only
         * right ('H') and down ('V') moves.
         */
        int row = destination[0];
        int col = destination[1];
        int v = row;  // number of down moves needed
        int h = col;  // number of right moves needed
        int totalMoves = v + h;

        // Precompute binomial coefficients using Pascal's triangle
        // comb[n][k] = C(n, k) = number of ways to choose k from n
        int[][] comb = new int[totalMoves + 1][totalMoves + 1];

        // Base cases: C(n, 0) = C(n, n) = 1
        for (int n = 0; n <= totalMoves; n++) {
            comb[n][0] = 1;
            comb[n][n] = 1;
        }

        // Fill Pascal's triangle
        for (int n = 2; n <= totalMoves; n++) {
            for (int kVal = 1; kVal < n; kVal++) {
                comb[n][kVal] = comb[n-1][kVal-1] + comb[n-1][kVal];
            }
        }

        StringBuilder result = new StringBuilder();

        // Construct the path character by character
        while (h > 0 || v > 0) {
            if (h == 0) {
                // No more 'H' moves available, must use 'V'
                result.append('V');
                v--;
            } else if (v == 0) {
                // No more 'V' moves available, must use 'H'
                result.append('H');
                h--;
            } else {
                // We have both moves available
                // Count how many paths start with 'H'
                // C(h+v-1, v) = choose positions for v down moves in remaining h+v-1 spots
                int countStartWithH = comb[h+v-1][v];

                if (k <= countStartWithH) {
                    // k-th path is among those starting with 'H'
                    result.append('H');
                    h--;
                } else {
                    // k-th path starts with 'V', skip all paths starting with 'H'
                    result.append('V');
                    k -= countStartWithH;  // Adjust k to skip 'H' paths
                    v--;
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((row+column)²)**

- Precomputing Pascal's triangle: O((row+column)²) to fill the combination table
- Constructing the path: O(row+column) to build the string character by character
- Dominated by the O((row+column)²) precomputation

**Space Complexity: O((row+column)²)**

- Storing Pascal's triangle requires a (row+column+1) × (row+column+1) matrix
- This is necessary for O(1) lookup of binomial coefficients during construction
- Could be optimized to O(row+column) by computing combinations on the fly, but would increase time complexity

## Common Mistakes

1. **Generating all paths**: Attempting to generate and sort all possible instruction strings. This fails for moderate inputs due to combinatorial explosion.

2. **Incorrect combination formula**: Using C(h+v, h) instead of C(h+v-1, v) when counting paths starting with 'H'. Remember: after placing 'H', we have h+v-1 moves left, and we need to choose positions for v down moves.

3. **Forgetting to adjust k**: When choosing 'V', failing to subtract the count of paths starting with 'H'. This causes selecting the wrong path in the remaining set.

4. **Off-by-one with k**: Treating k as 0-indexed instead of 1-indexed. The problem states k is 1-indexed, so k=1 means the first (smallest) path.

5. **Integer overflow**: Not realizing binomial coefficients can be huge (beyond 32-bit). However, since k ≤ C(row+column, row) and fits in 32-bit integer, we don't need to compute exact values beyond what's comparable with k.

## When You'll See This Pattern

This "k-th lexicographic combination" pattern appears in several combinatorial problems:

1. **Permutation Sequence (LeetCode 60)**: Find the k-th permutation of numbers 1..n. Similar idea: at each position, count how many permutations start with each possible digit.

2. **Combination Sum III (LeetCode 216)**: Finding specific combinations, though usually not by lexicographic order.

3. **Restore IP Addresses (LeetCode 93)**: While not exactly the same, it involves constructing valid sequences with constraints.

The core technique is using combinatorial counting to navigate a search space without explicit enumeration, which is valuable for problems with exponential search spaces.

## Key Takeaways

1. **Combinatorial counting beats enumeration**: When dealing with combinatorial objects (paths, permutations, combinations), often you can compute the k-th one directly by counting how many begin with each possible prefix.

2. **Lexicographic order implies greedy construction**: To find the k-th lexicographically smallest item, build it left to right, at each step counting how many items would start with each possible character at that position.

3. **Pascal's triangle is your friend**: Many combinatorial problems require binomial coefficients. Precomputing them with dynamic programming (Pascal's triangle) is often more efficient than computing them on the fly.

[Practice this problem on CodeJeet](/problem/kth-smallest-instructions)
