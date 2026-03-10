---
title: "How to Solve Construct the Lexicographically Largest Valid Sequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct the Lexicographically Largest Valid Sequence. Medium difficulty, 72.8% acceptance rate. Topics: Array, Backtracking."
date: "2027-03-28"
category: "dsa-patterns"
tags: ["construct-the-lexicographically-largest-valid-sequence", "array", "backtracking", "medium"]
---

# How to Solve Construct the Lexicographically Largest Valid Sequence

This problem asks us to construct a sequence of length `2n - 1` where the integer `1` appears once, integers `2` through `n` appear twice each, and for each integer `i` from `2` to `n`, the distance between its two occurrences must be exactly `i`. The sequence must be lexicographically largest among all valid sequences. What makes this tricky is that we need to satisfy multiple constraints simultaneously while maximizing lexicographic order, which naturally leads to a backtracking approach with careful pruning.

## Visual Walkthrough

Let's trace through `n = 3` to build intuition. We need a sequence of length `2*3 - 1 = 5` where:

- `1` appears once
- `2` appears twice, with distance 2 between them
- `3` appears twice, with distance 3 between them

We want the lexicographically largest sequence, so we should try placing larger numbers first.

**Step 1:** Create an array of size 5: `[_, _, _, _, _]`

**Step 2:** Try placing `3` first (largest number). The first occurrence goes at index 0. The second occurrence must be at index 0 + 3 = 3:

- `[3, _, _, 3, _]`

**Step 3:** Try placing `2` next. The first available position is index 1. The second occurrence must be at index 1 + 2 = 3, but position 3 is already taken by `3`. So index 1 doesn't work.

**Step 4:** Try `2` at index 2 instead. The second occurrence would be at index 2 + 2 = 4:

- `[3, _, 2, 3, 2]`

**Step 5:** Place `1` in the remaining position (index 1):

- `[3, 1, 2, 3, 2]`

This is a valid sequence! But is it lexicographically largest? Let's check if we could have placed `2` before `3` to get something larger:

If we placed `2` at index 0: `[2, _, _, 2, _]` (second `2` at index 2)
Then `3` at index 1: `[2, 3, _, 2, _]` (second `3` would need index 4: `[2, 3, _, 2, 3]`)
Finally `1` at index 2: `[2, 3, 1, 2, 3]`

Compare `[3, 1, 2, 3, 2]` vs `[2, 3, 1, 2, 3]`: The first sequence starts with `3`, which is larger than `2`, so it's lexicographically larger. Our approach of trying larger numbers first works!

## Brute Force Approach

A naive brute force would generate all permutations of the required numbers (1 once, 2 through n twice each) and check which ones satisfy the distance constraints. For `n = 10`, we'd have `(2n-2)!` permutations to check (18! ≈ 6.4×10¹⁵), which is completely infeasible.

Even a smarter brute force that respects the distance constraints would need to explore all placements. We could try placing numbers in all possible valid positions, but without pruning, the search space grows exponentially. For each number `i`, we need to choose two positions `p1` and `p2` such that `p2 - p1 = i`. With `n` numbers to place, this leads to combinatorial explosion.

The key insight is that we need systematic exploration with backtracking and pruning based on lexicographic ordering.

## Optimized Approach

The optimal approach uses backtracking with these key optimizations:

1. **Try larger numbers first**: Since we want the lexicographically largest sequence, we should place larger numbers in earlier positions. This serves as natural pruning - once we find a valid sequence, it's guaranteed to be the largest.

2. **Place numbers from largest to smallest**: Start with `n`, then `n-1`, down to `2`, and finally `1`. This ensures that if we find a solution, it's the lexicographically largest possible.

3. **Backtrack efficiently**: For each number `i` (except `1`), we need to place two occurrences. We can:
   - Find the first available position for the first occurrence
   - Check if position `first_pos + i` is available for the second occurrence
   - If placing `i` would violate constraints, backtrack

4. **Special handling for 1**: Since `1` appears only once, we just need to find any available position for it.

5. **Early termination**: Once we find a valid sequence, we can stop searching since we're trying numbers in descending order.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n!) in worst case, but heavily pruned | Space: O(n) for recursion depth and arrays
class Solution:
    def constructDistancedSequence(self, n: int) -> List[int]:
        # Result array of size 2n - 1 initialized with 0s (0 means empty position)
        size = 2 * n - 1
        result = [0] * size

        # Track which numbers have been placed
        used = [False] * (n + 1)  # Index 0 unused, indices 1..n

        def backtrack(pos):
            # If we've filled all positions, we found a solution
            if pos == size:
                return True

            # If current position is already filled, move to next
            if result[pos] != 0:
                return backtrack(pos + 1)

            # Try placing numbers from largest to smallest for lexicographically largest result
            for num in range(n, 0, -1):
                if used[num]:
                    continue

                # Special case for 1 (appears once)
                if num == 1:
                    result[pos] = 1
                    used[1] = True

                    # Continue with next position
                    if backtrack(pos + 1):
                        return True

                    # Backtrack
                    result[pos] = 0
                    used[1] = False
                else:
                    # For numbers 2..n, need two positions: pos and pos + num
                    second_pos = pos + num

                    # Check if second position is valid and both positions are empty
                    if second_pos < size and result[pos] == 0 and result[second_pos] == 0:
                        # Place the number
                        result[pos] = num
                        result[second_pos] = num
                        used[num] = True

                        # Move to next empty position
                        next_pos = pos + 1
                        while next_pos < size and result[next_pos] != 0:
                            next_pos += 1

                        if backtrack(next_pos):
                            return True

                        # Backtrack
                        result[pos] = 0
                        result[second_pos] = 0
                        used[num] = False

            # No valid number found for this position
            return False

        # Start backtracking from position 0
        backtrack(0)
        return result
```

```javascript
// Time: O(n!) in worst case, but heavily pruned | Space: O(n) for recursion depth and arrays
/**
 * @param {number} n
 * @return {number[]}
 */
var constructDistancedSequence = function (n) {
  // Result array of size 2n - 1 initialized with 0s (0 means empty position)
  const size = 2 * n - 1;
  const result = new Array(size).fill(0);

  // Track which numbers have been placed
  const used = new Array(n + 1).fill(false); // Index 0 unused, indices 1..n

  const backtrack = (pos) => {
    // If we've filled all positions, we found a solution
    if (pos === size) {
      return true;
    }

    // If current position is already filled, move to next
    if (result[pos] !== 0) {
      return backtrack(pos + 1);
    }

    // Try placing numbers from largest to smallest for lexicographically largest result
    for (let num = n; num >= 1; num--) {
      if (used[num]) {
        continue;
      }

      // Special case for 1 (appears once)
      if (num === 1) {
        result[pos] = 1;
        used[1] = true;

        // Continue with next position
        if (backtrack(pos + 1)) {
          return true;
        }

        // Backtrack
        result[pos] = 0;
        used[1] = false;
      } else {
        // For numbers 2..n, need two positions: pos and pos + num
        const secondPos = pos + num;

        // Check if second position is valid and both positions are empty
        if (secondPos < size && result[pos] === 0 && result[secondPos] === 0) {
          // Place the number
          result[pos] = num;
          result[secondPos] = num;
          used[num] = true;

          // Move to next empty position
          let nextPos = pos + 1;
          while (nextPos < size && result[nextPos] !== 0) {
            nextPos++;
          }

          if (backtrack(nextPos)) {
            return true;
          }

          // Backtrack
          result[pos] = 0;
          result[secondPos] = 0;
          used[num] = false;
        }
      }
    }

    // No valid number found for this position
    return false;
  };

  // Start backtracking from position 0
  backtrack(0);
  return result;
};
```

```java
// Time: O(n!) in worst case, but heavily pruned | Space: O(n) for recursion depth and arrays
class Solution {
    public int[] constructDistancedSequence(int n) {
        // Result array of size 2n - 1 initialized with 0s (0 means empty position)
        int size = 2 * n - 1;
        int[] result = new int[size];

        // Track which numbers have been placed
        boolean[] used = new boolean[n + 1];  // Index 0 unused, indices 1..n

        backtrack(0, result, used, n);
        return result;
    }

    private boolean backtrack(int pos, int[] result, boolean[] used, int n) {
        // If we've filled all positions, we found a solution
        if (pos == result.length) {
            return true;
        }

        // If current position is already filled, move to next
        if (result[pos] != 0) {
            return backtrack(pos + 1, result, used, n);
        }

        // Try placing numbers from largest to smallest for lexicographically largest result
        for (int num = n; num >= 1; num--) {
            if (used[num]) {
                continue;
            }

            // Special case for 1 (appears once)
            if (num == 1) {
                result[pos] = 1;
                used[1] = true;

                // Continue with next position
                if (backtrack(pos + 1, result, used, n)) {
                    return true;
                }

                // Backtrack
                result[pos] = 0;
                used[1] = false;
            } else {
                // For numbers 2..n, need two positions: pos and pos + num
                int secondPos = pos + num;

                // Check if second position is valid and both positions are empty
                if (secondPos < result.length && result[pos] == 0 && result[secondPos] == 0) {
                    // Place the number
                    result[pos] = num;
                    result[secondPos] = num;
                    used[num] = true;

                    // Move to next empty position
                    int nextPos = pos + 1;
                    while (nextPos < result.length && result[nextPos] != 0) {
                        nextPos++;
                    }

                    if (backtrack(nextPos, result, used, n)) {
                        return true;
                    }

                    // Backtrack
                    result[pos] = 0;
                    result[secondPos] = 0;
                    used[num] = false;
                }
            }
        }

        // No valid number found for this position
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** In the worst case, the algorithm explores all possible placements, which is O(n!). However, the pruning is extremely effective:

- We try numbers in descending order, so we find the lexicographically largest solution quickly
- We skip placements where the second position would be out of bounds or already occupied
- In practice, for n ≤ 20 (the problem constraints), this runs efficiently

**Space Complexity:** O(n) for:

- The result array of size 2n - 1
- The `used` array of size n + 1
- Recursion depth up to n (one level per number placed)

## Common Mistakes

1. **Not trying numbers in descending order**: If you try numbers in ascending order, you'll find a valid sequence but not necessarily the lexicographically largest one. The problem specifically asks for the largest.

2. **Forgetting that 1 appears only once**: Many candidates treat 1 like other numbers and try to place it twice. Remember the constraint: "The integer 1 occurs once in the sequence."

3. **Incorrect bounds checking for second position**: When placing number `i` at position `pos`, the second position is `pos + i`. You must check that `pos + i < 2n - 1` before attempting to place it there.

4. **Not skipping already filled positions efficiently**: In the backtracking function, if `result[pos] != 0`, you should immediately move to `pos + 1` instead of trying to place a number there.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in many constraint satisfaction problems:

1. **N-Queens (LeetCode 51)**: Place queens on a chessboard so none attack each other. Similar backtracking with pruning based on row, column, and diagonal constraints.

2. **Sudoku Solver (LeetCode 37)**: Fill a 9×9 grid with digits following Sudoku rules. Backtracking with pruning based on row, column, and sub-box constraints.

3. **Permutations II (LeetCode 47)**: Generate all unique permutations when input contains duplicates. Uses backtracking with pruning to avoid duplicate sequences.

The common theme is exploring a solution space systematically while pruning branches that can't lead to a valid solution.

## Key Takeaways

1. **Backtracking with intelligent ordering**: When asked for the lexicographically largest solution, try candidates in descending order. This serves as effective pruning.

2. **Constraint propagation**: Check constraints as early as possible. If placing a number would immediately violate a constraint, don't explore that branch further.

3. **Special case handling**: Pay attention to edge cases (like `1` appearing once while others appear twice). These often require separate logic in the implementation.

Related problems: [The Number of Beautiful Subsets](/problem/the-number-of-beautiful-subsets), [Find the Lexicographically Largest String From the Box I](/problem/find-the-lexicographically-largest-string-from-the-box-i)
