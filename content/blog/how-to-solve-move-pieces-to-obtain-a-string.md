---
title: "How to Solve Move Pieces to Obtain a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Move Pieces to Obtain a String. Medium difficulty, 56.7% acceptance rate. Topics: Two Pointers, String."
date: "2026-09-23"
category: "dsa-patterns"
tags: ["move-pieces-to-obtain-a-string", "two-pointers", "string", "medium"]
---

# How to Solve "Move Pieces to Obtain a String"

This problem asks whether we can transform string `start` into string `target` by moving pieces `'L'` and `'R'` according to specific rules: `'L'` can only move left through blank spaces (`'_'`), and `'R'` can only move right through blank spaces. The tricky part is that pieces cannot jump over each other, and their relative order must be preserved. This creates constraints that make this more than just a simple string matching problem.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example:** `start = "_L__R__R_"`, `target = "L______RR"`

We need to check if we can transform `start` into `target`:

1. Remove all underscores to focus on the pieces:
   - `start` pieces: `"LRR"` at positions (1, 4, 7) in the original string
   - `target` pieces: `"LRR"` at positions (0, 7, 8) in the original string

2. Compare piece by piece:
   - First piece: `'L'` in both strings
     - In `start`: position 1
     - In `target`: position 0
     - `'L'` can only move left, so position 1 → 0 is valid (moves left 1 space)
   - Second piece: `'R'` in both strings
     - In `start`: position 4
     - In `target`: position 7
     - `'R'` can only move right, so position 4 → 7 is valid (moves right 3 spaces)
   - Third piece: `'R'` in both strings
     - In `start`: position 7
     - In `target`: position 8
     - `'R'` can only move right, so position 7 → 8 is valid (moves right 1 space)

3. Check crossing constraints:
   - The first `'R'` in `start` (position 4) moves to position 7
   - The second `'R'` in `start` (position 7) moves to position 8
   - No `'L'` moves to the right of an `'R'` that started to its left, so no crossing occurs

Since all pieces match type, move in allowed directions, and don't cross illegally, this transformation is possible.

## Brute Force Approach

A naive approach might try to simulate all possible moves. Since each piece can move multiple steps (as long as it moves through blanks), we could try:

1. For each piece in `start`, try moving it to all possible positions in `target`
2. Check if the resulting configuration matches `target`
3. Ensure pieces don't cross illegally

However, this approach has several problems:

- Exponential time complexity: For `n` pieces, each with up to `n` possible positions
- Difficult to implement correctly due to crossing constraints
- Would require backtracking to try different move combinations

The brute force is impractical for constraints where `n` can be up to 10^5.

## Optimized Approach

The key insight is that we don't need to simulate moves. Instead, we can use **two pointers** to compare the sequences of `'L'` and `'R'` pieces in both strings, ignoring underscores. For the transformation to be possible:

1. **Same sequence of pieces**: When we remove underscores, both strings must have identical sequences of `'L'` and `'R'` in the same order.

2. **Movement constraints**:
   - For each `'L'` in `start`, its position must be **≥** its position in `target` (since `'L'` can only move left)
   - For each `'R'` in `start`, its position must be **≤** its position in `target` (since `'R'` can only move right)

3. **No crossing**: This is automatically satisfied if we process pieces in order and enforce the movement constraints, since pieces maintain their relative order.

We can implement this by:

- Using two pointers to traverse both strings
- Skipping underscores until we find the next piece in each string
- Comparing piece types and checking movement constraints

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of the strings
# Space: O(1) - we only use pointers and don't store extra data
def canChange(start: str, target: str) -> bool:
    n = len(start)
    i, j = 0, 0  # Pointers for start and target strings

    while i < n or j < n:
        # Skip underscores in start string
        while i < n and start[i] == '_':
            i += 1

        # Skip underscores in target string
        while j < n and target[j] == '_':
            j += 1

        # If we've reached the end of both strings, transformation is possible
        if i == n and j == n:
            return True

        # If one string has more pieces than the other, transformation is impossible
        if i == n or j == n:
            return False

        # Pieces must match type
        if start[i] != target[j]:
            return False

        # Check movement constraints:
        # - 'L' can only move left (start position >= target position)
        # - 'R' can only move right (start position <= target position)
        if start[i] == 'L' and i < j:
            return False
        if start[i] == 'R' and i > j:
            return False

        # Move to next piece
        i += 1
        j += 1

    return True
```

```javascript
// Time: O(n) where n is the length of the strings
// Space: O(1) - we only use pointers and don't store extra data
function canChange(start, target) {
  const n = start.length;
  let i = 0,
    j = 0; // Pointers for start and target strings

  while (i < n || j < n) {
    // Skip underscores in start string
    while (i < n && start[i] === "_") {
      i++;
    }

    // Skip underscores in target string
    while (j < n && target[j] === "_") {
      j++;
    }

    // If we've reached the end of both strings, transformation is possible
    if (i === n && j === n) {
      return true;
    }

    // If one string has more pieces than the other, transformation is impossible
    if (i === n || j === n) {
      return false;
    }

    // Pieces must match type
    if (start[i] !== target[j]) {
      return false;
    }

    // Check movement constraints:
    // - 'L' can only move left (start position >= target position)
    // - 'R' can only move right (start position <= target position)
    if (start[i] === "L" && i < j) {
      return false;
    }
    if (start[i] === "R" && i > j) {
      return false;
    }

    // Move to next piece
    i++;
    j++;
  }

  return true;
}
```

```java
// Time: O(n) where n is the length of the strings
// Space: O(1) - we only use pointers and don't store extra data
class Solution {
    public boolean canChange(String start, String target) {
        int n = start.length();
        int i = 0, j = 0;  // Pointers for start and target strings

        while (i < n || j < n) {
            // Skip underscores in start string
            while (i < n && start.charAt(i) == '_') {
                i++;
            }

            // Skip underscores in target string
            while (j < n && target.charAt(j) == '_') {
                j++;
            }

            // If we've reached the end of both strings, transformation is possible
            if (i == n && j == n) {
                return true;
            }

            // If one string has more pieces than the other, transformation is impossible
            if (i == n || j == n) {
                return false;
            }

            // Pieces must match type
            if (start.charAt(i) != target.charAt(j)) {
                return false;
            }

            // Check movement constraints:
            // - 'L' can only move left (start position >= target position)
            // - 'R' can only move right (start position <= target position)
            if (start.charAt(i) == 'L' && i < j) {
                return false;
            }
            if (start.charAt(i) == 'R' && i > j) {
                return false;
            }

            // Move to next piece
            i++;
            j++;
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the strings. Each pointer traverses the string at most once, and we process each character a constant number of times.

**Space Complexity:** O(1). We only use a few integer variables for pointers, regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Not checking piece type equality**: Some candidates only check movement constraints without verifying that the sequences of `'L'` and `'R'` are identical. Example: `start = "R_L_"`, `target = "_LR_"` has matching movement constraints but different piece sequences.

2. **Incorrect movement direction check**: Mixing up the inequalities for `'L'` and `'R'`. Remember: `'L'` moves left (start position ≥ target), `'R'` moves right (start position ≤ target).

3. **Forgetting to handle different numbers of pieces**: If one string has more pieces than the other after removing underscores, they can't possibly match. Always check if both pointers reach the end simultaneously.

4. **Overcomplicating with simulation**: Some candidates try to actually simulate moves, which leads to complex code and potential performance issues. The two-pointer approach is simpler and more efficient.

## When You'll See This Pattern

The two-pointer technique for comparing sequences while ignoring certain elements appears in several problems:

1. **Valid Parentheses (Easy)**: Use a stack (or counter) to match opening and closing brackets, similar to how we match pieces here.

2. **Swap Adjacent in LR String (Medium)**: Almost identical problem with slightly different movement rules. The solution uses the same two-pointer approach.

3. **Backspace String Compare (Easy)**: Compare two strings with backspace characters by processing from the end, using a similar pointer-based approach.

4. **Merge Sorted Array (Easy)**: Use two pointers to merge arrays in-place, similar to how we traverse both strings simultaneously.

## Key Takeaways

1. **Two-pointer technique is powerful for sequence comparison**: When you need to compare two sequences while ignoring certain elements or transforming them, consider using two pointers to traverse both simultaneously.

2. **Focus on invariants, not simulation**: Instead of simulating all possible moves, identify the essential constraints that must hold for a solution to exist. Here, the key invariants are piece type matching and movement direction constraints.

3. **Test with edge cases**: Always test with cases like empty strings, all underscores, all pieces, and cases where pieces cross paths. These often reveal bugs in the logic.

Related problems: [Valid Parentheses](/problem/valid-parentheses), [Swap Adjacent in LR String](/problem/swap-adjacent-in-lr-string)
