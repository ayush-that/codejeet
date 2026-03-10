---
title: "How to Solve Swap Adjacent in LR String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Swap Adjacent in LR String. Medium difficulty, 37.9% acceptance rate. Topics: Two Pointers, String."
date: "2027-07-21"
category: "dsa-patterns"
tags: ["swap-adjacent-in-lr-string", "two-pointers", "string", "medium"]
---

# How to Solve Swap Adjacent in LR String

This problem asks whether we can transform a starting string containing `'L'`, `'R'`, and `'X'` characters into a target string using only two operations: replacing `"XL"` with `"LX"` or replacing `"RX"` with `"XR"`. What makes this tricky is that the operations look simple but have subtle constraints: `'L'` characters can only move left through `'X'` characters, while `'R'` characters can only move right through `'X'` characters, and they cannot pass through each other.

## Visual Walkthrough

Let's trace through an example: `start = "RXXLRXRXL"` and `result = "XRLXXRRLX"`.

**Key insight:** Remove all `'X'` characters from both strings and compare. If the resulting sequences of `'L'` and `'R'` don't match exactly, transformation is impossible.

For our example:

- `start` without X's: `"RLRRLL"` → `"R L R R L L"`
- `result` without X's: `"RLRRLL"` → `"R L R R L L"`

They match! But this isn't enough. We also need to check movement constraints:

1. **Position constraints:** Each `'L'` in `result` must be at the same or earlier position than its corresponding `'L'` in `start` (since `'L'` can only move left).
2. **Position constraints:** Each `'R'` in `result` must be at the same or later position than its corresponding `'R'` in `start` (since `'R'` can only move right).

Let's verify by comparing indices of corresponding characters (ignoring X's):

```
start:  R  X  X  L  R  X  R  X  L
        0  1  2  3  4  5  6  7  8
        R        L  R     R     L

result: X  R  L  X  X  R  R  L  X
        0  1  2  3  4  5  6  7  8
           R  L        R  R  L
```

Corresponding pairs:

- First `'R'`: start index 0, result index 1 → result index ≥ start index ✓
- First `'L'`: start index 3, result index 2 → result index ≤ start index ✓
- Second `'R'`: start index 4, result index 5 → result index ≥ start index ✓
- Third `'R'`: start index 6, result index 6 → result index ≥ start index ✓
- Second `'L'`: start index 8, result index 7 → result index ≤ start index ✓

All constraints satisfied, so transformation is possible.

## Brute Force Approach

A naive approach might try to simulate all possible sequences of moves using BFS/DFS. We could:

1. Generate all possible next states from the current string
2. Check if we reach the target
3. Use memoization to avoid cycles

However, this approach is exponential in time complexity. For a string of length `n`, there could be up to `n-1` possible moves at each step (checking every adjacent pair). The state space grows factorially, making this impractical for typical constraints where `n` can be up to 10,000.

Even with optimization, BFS would have `O(n!)` worst-case time complexity and `O(n!)` space complexity, which is completely infeasible.

## Optimized Approach

The key insight is that `'X'` characters are essentially empty spaces that allow `'L'` and `'R'` to move, but with important restrictions:

1. **Relative order must be preserved:** If we remove all `'X'` from both strings, the remaining sequences of `'L'` and `'R'` must be identical. This is because `'L'` and `'R'` cannot cross each other (an `'L'` cannot move past an `'R'` and vice versa).

2. **Movement constraints:**
   - `'L'` can only move left (decrease its index) by swapping with `'X'` to its left
   - `'R'` can only move right (increase its index) by swapping with `'X'` to its right
   - Therefore, for each corresponding `'L'` in `start` and `result`, the `'L'` in `result` must be at the same or earlier position
   - For each corresponding `'R'`, the `'R'` in `result` must be at the same or later position

We can implement this efficiently using a two-pointer approach:

- Use pointer `i` for `start` and `j` for `result`
- Skip all `'X'` characters in both strings
- When we find non-`'X'` characters, they must match
- Additionally, check the position constraints based on whether it's `'L'` or `'R'`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the strings
# Space: O(1) as we only use pointers and don't store extra data
def canTransform(start: str, result: str) -> bool:
    # If lengths differ, transformation is impossible
    if len(start) != len(result):
        return False

    n = len(start)
    i, j = 0, 0

    # Use two pointers to traverse both strings
    while i < n and j < n:
        # Skip all 'X' characters in start
        while i < n and start[i] == 'X':
            i += 1

        # Skip all 'X' characters in result
        while j < n and result[j] == 'X':
            j += 1

        # If both pointers reached the end, we're done
        if i == n and j == n:
            return True

        # If only one pointer reached the end, sequences don't match
        if i == n or j == n:
            return False

        # Characters must match after removing X's
        if start[i] != result[j]:
            return False

        # Check movement constraints:
        # - 'L' can only move left, so result index must be <= start index
        # - 'R' can only move right, so result index must be >= start index
        if start[i] == 'L' and i < j:
            return False
        if start[i] == 'R' and i > j:
            return False

        # Move both pointers to continue checking
        i += 1
        j += 1

    # Handle trailing X's in both strings
    while i < n and start[i] == 'X':
        i += 1
    while j < n and result[j] == 'X':
        j += 1

    # Both should reach the end simultaneously
    return i == n and j == n
```

```javascript
// Time: O(n) where n is the length of the strings
// Space: O(1) as we only use pointers and don't store extra data
function canTransform(start, result) {
  // If lengths differ, transformation is impossible
  if (start.length !== result.length) {
    return false;
  }

  const n = start.length;
  let i = 0,
    j = 0;

  // Use two pointers to traverse both strings
  while (i < n && j < n) {
    // Skip all 'X' characters in start
    while (i < n && start[i] === "X") {
      i++;
    }

    // Skip all 'X' characters in result
    while (j < n && result[j] === "X") {
      j++;
    }

    // If both pointers reached the end, we're done
    if (i === n && j === n) {
      return true;
    }

    // If only one pointer reached the end, sequences don't match
    if (i === n || j === n) {
      return false;
    }

    // Characters must match after removing X's
    if (start[i] !== result[j]) {
      return false;
    }

    // Check movement constraints:
    // - 'L' can only move left, so result index must be <= start index
    // - 'R' can only move right, so result index must be >= start index
    if (start[i] === "L" && i < j) {
      return false;
    }
    if (start[i] === "R" && i > j) {
      return false;
    }

    // Move both pointers to continue checking
    i++;
    j++;
  }

  // Handle trailing X's in both strings
  while (i < n && start[i] === "X") {
    i++;
  }
  while (j < n && result[j] === "X") {
    j++;
  }

  // Both should reach the end simultaneously
  return i === n && j === n;
}
```

```java
// Time: O(n) where n is the length of the strings
// Space: O(1) as we only use pointers and don't store extra data
class Solution {
    public boolean canTransform(String start, String result) {
        // If lengths differ, transformation is impossible
        if (start.length() != result.length()) {
            return false;
        }

        int n = start.length();
        int i = 0, j = 0;

        // Use two pointers to traverse both strings
        while (i < n && j < n) {
            // Skip all 'X' characters in start
            while (i < n && start.charAt(i) == 'X') {
                i++;
            }

            // Skip all 'X' characters in result
            while (j < n && result.charAt(j) == 'X') {
                j++;
            }

            // If both pointers reached the end, we're done
            if (i == n && j == n) {
                return true;
            }

            // If only one pointer reached the end, sequences don't match
            if (i == n || j == n) {
                return false;
            }

            // Characters must match after removing X's
            if (start.charAt(i) != result.charAt(j)) {
                return false;
            }

            // Check movement constraints:
            // - 'L' can only move left, so result index must be <= start index
            // - 'R' can only move right, so result index must be >= start index
            if (start.charAt(i) == 'L' && i < j) {
                return false;
            }
            if (start.charAt(i) == 'R' && i > j) {
                return false;
            }

            // Move both pointers to continue checking
            i++;
            j++;
        }

        // Handle trailing X's in both strings
        while (i < n && start.charAt(i) == 'X') {
            i++;
        }
        while (j < n && result.charAt(j) == 'X') {
            j++;
        }

        // Both should reach the end simultaneously
        return i == n && j == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the strings. We traverse each string at most once with our two pointers. Each character is examined a constant number of times.

**Space Complexity:** O(1) for all implementations. We only use a few integer variables for pointers and don't allocate any data structures proportional to the input size.

The linear time complexity comes from the fact that we process each character once (or skip it in constant time). The constant space complexity is achieved by using the two-pointer technique instead of creating new strings or arrays.

## Common Mistakes

1. **Forgetting to check length equality first:** If the strings have different lengths, transformation is immediately impossible. This should be the first check.

2. **Incorrect movement direction check:** The most common error is mixing up the direction constraints. Remember:
   - `'L'` moves left → result index ≤ start index
   - `'R'` moves right → result index ≥ start index
     Getting these reversed will cause false negatives.

3. **Not handling trailing X's properly:** After the main loop, there might be remaining X's at the end of one string but not the other. We need to skip these and ensure both pointers reach the end.

4. **Assuming identical strings after removing X's is sufficient:** This misses the movement constraints. For example, `start = "XL"` and `result = "LX"` have the same sequence after removing X's (`"L"`), but the transformation is valid. However, `start = "RX"` and `result = "XR"` also have the same sequence (`"R"`), but here the `'R'` would need to move left, which is not allowed.

## When You'll See This Pattern

The two-pointer technique with constraint checking appears in several string transformation problems:

1. **Move Pieces to Obtain a String (LeetCode 2337):** Almost identical problem with `'L'` and `'R'` pieces moving through empty spaces. The same two-pointer approach works.

2. **Valid Parentheses (LeetCode 20):** While different in domain, it also uses sequential scanning with constraint checking (ensuring closing brackets match opening ones).

3. **Backspace String Compare (LeetCode 844):** Uses two pointers scanning from the end to compare strings with backspace characters, similar to our approach of skipping certain characters.

The pattern is: when you need to compare two sequences with some characters that can be "ignored" or "skipped" under certain rules, and the remaining characters must match with additional constraints, consider a two-pointer approach.

## Key Takeaways

1. **Two-pointer technique is powerful for string comparison:** When comparing two strings with ignorable characters (`'X'` in this case), use two pointers to skip to the next significant character in each string.

2. **Understand the physics of the problem:** The movement constraints (`'L'` moves left, `'R'` moves right, they can't cross) are the core of the problem. Visualizing this helps derive the correct index comparisons.

3. **Check multiple conditions independently:** The solution requires checking: (1) length equality, (2) identical sequences after removing X's, and (3) position constraints for each character type. Missing any one leads to incorrect results.

Related problems: [Move Pieces to Obtain a String](/problem/move-pieces-to-obtain-a-string)
