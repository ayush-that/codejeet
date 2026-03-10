---
title: "How to Solve Minimum Domino Rotations For Equal Row — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Domino Rotations For Equal Row. Medium difficulty, 56.5% acceptance rate. Topics: Array, Greedy."
date: "2027-12-03"
category: "dsa-patterns"
tags: ["minimum-domino-rotations-for-equal-row", "array", "greedy", "medium"]
---

# How to Solve Minimum Domino Rotations For Equal Row

You're given two arrays representing domino tiles - `tops` and `bottoms` - where each domino can be rotated to swap its top and bottom values. Your goal is to make all values in either the top row or bottom row equal with the minimum number of rotations. What makes this problem interesting is that you need to consider multiple candidate values and track rotations for both rows simultaneously.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
tops = [2,1,2,4,2,2]
bottoms = [5,2,6,2,3,2]
```

We need to find a value that can appear in every position of either the top or bottom row. Let's think about candidate values:

1. **Check value 2**:
   - Position 0: top=2 ✓ (no rotation needed)
   - Position 1: bottom=2 ✓ (needs rotation)
   - Position 2: top=2 ✓ (no rotation)
   - Position 3: bottom=2 ✓ (needs rotation)
   - Position 4: top=2 ✓ (no rotation)
   - Position 5: top=2 ✓ (no rotation)

   To make all tops = 2: Rotations needed at positions 1 and 3 → 2 rotations
   To make all bottoms = 2: Rotations needed at positions 0, 2, 4, 5 → 4 rotations
   Minimum for value 2 = min(2, 4) = 2

2. **Check value 5**:
   - Position 0: bottom=5 ✓ (needs rotation)
   - Position 1: Neither top nor bottom is 5 ✗

   Value 5 cannot work since it's missing at position 1.

The key insight: We only need to check values from the first domino! If the solution exists, it must use either `tops[0]` or `bottoms[0]` as the target value.

## Brute Force Approach

A naive approach would check all possible values from 1 to 6 (since domino values range from 1-6):

1. For each value v from 1 to 6
2. Count rotations needed to make all tops = v
3. Count rotations needed to make all bottoms = v
4. Track the minimum rotations

This would work but is inefficient. Let's see why:

<div class="code-group">

```python
# Brute Force - Check all values 1-6
# Time: O(6 * n) = O(n) but with unnecessary checks
# Space: O(1)
def minDominoRotations_brute(tops, bottoms):
    n = len(tops)
    min_rotations = float('inf')

    # Check each possible domino value
    for target in range(1, 7):
        top_rotations = 0
        bottom_rotations = 0
        possible = True

        for i in range(n):
            # Check if we can make tops[i] = target
            if tops[i] != target:
                if bottoms[i] == target:
                    top_rotations += 1  # Rotate this domino
                else:
                    possible = False
                    break

            # Check if we can make bottoms[i] = target
            if bottoms[i] != target:
                if tops[i] == target:
                    bottom_rotations += 1  # Rotate this domino
                else:
                    possible = False
                    break

        if possible:
            min_rotations = min(min_rotations, top_rotations, bottom_rotations)

    return -1 if min_rotations == float('inf') else min_rotations
```

```javascript
// Brute Force - Check all values 1-6
// Time: O(6 * n) = O(n) but with unnecessary checks
// Space: O(1)
function minDominoRotationsBrute(tops, bottoms) {
  const n = tops.length;
  let minRotations = Infinity;

  // Check each possible domino value
  for (let target = 1; target <= 6; target++) {
    let topRotations = 0;
    let bottomRotations = 0;
    let possible = true;

    for (let i = 0; i < n; i++) {
      // Check if we can make tops[i] = target
      if (tops[i] !== target) {
        if (bottoms[i] === target) {
          topRotations++; // Rotate this domino
        } else {
          possible = false;
          break;
        }
      }

      // Check if we can make bottoms[i] = target
      if (bottoms[i] !== target) {
        if (tops[i] === target) {
          bottomRotations++; // Rotate this domino
        } else {
          possible = false;
          break;
        }
      }
    }

    if (possible) {
      minRotations = Math.min(minRotations, topRotations, bottomRotations);
    }
  }

  return minRotations === Infinity ? -1 : minRotations;
}
```

```java
// Brute Force - Check all values 1-6
// Time: O(6 * n) = O(n) but with unnecessary checks
// Space: O(1)
public int minDominoRotationsBrute(int[] tops, int[] bottoms) {
    int n = tops.length;
    int minRotations = Integer.MAX_VALUE;

    // Check each possible domino value
    for (int target = 1; target <= 6; target++) {
        int topRotations = 0;
        int bottomRotations = 0;
        boolean possible = true;

        for (int i = 0; i < n; i++) {
            // Check if we can make tops[i] = target
            if (tops[i] != target) {
                if (bottoms[i] == target) {
                    topRotations++;  // Rotate this domino
                } else {
                    possible = false;
                    break;
                }
            }

            // Check if we can make bottoms[i] = target
            if (bottoms[i] != target) {
                if (tops[i] == target) {
                    bottomRotations++;  // Rotate this domino
                } else {
                    possible = false;
                    break;
                }
            }
        }

        if (possible) {
            minRotations = Math.min(minRotations, Math.min(topRotations, bottomRotations));
        }
    }

    return minRotations == Integer.MAX_VALUE ? -1 : minRotations;
}
```

</div>

While this brute force is technically O(n), it's inefficient because we check all 6 values even when most won't work. The real insight is that we only need to check 2 specific values.

## Optimized Approach

The key optimization comes from this observation: **If a solution exists, the target value must be either `tops[0]` or `bottoms[0]`.**

Why? Consider the first domino with values (a, b). If we want all tops to be value X:

- If X ≠ a and X ≠ b, then the first domino can't have X at all
- Therefore X must be either a or b

So we only need to check two candidates! For each candidate:

1. Count rotations needed to make all tops = candidate
2. Count rotations needed to make all bottoms = candidate
3. Take the minimum of these two for this candidate
4. Return the overall minimum

We need to be careful: A candidate might work for tops but not bottoms, or vice versa. We should check both possibilities independently.

## Optimal Solution

Here's the optimal solution that checks only the two relevant candidates:

<div class="code-group">

```python
# Optimal Solution - Check only tops[0] and bottoms[0]
# Time: O(n) | Space: O(1)
def minDominoRotations(tops, bottoms):
    """
    Find minimum rotations to make all values in either row equal.
    Only need to check two candidate values: tops[0] and bottoms[0].
    """
    n = len(tops)

    # Helper function to count rotations for a target value
    def check(target):
        """
        Returns minimum rotations needed for given target,
        or float('inf') if impossible.
        """
        rotations_top = 0  # Rotations to make all tops = target
        rotations_bottom = 0  # Rotations to make all bottoms = target

        for i in range(n):
            # If neither domino half has target, impossible
            if tops[i] != target and bottoms[i] != target:
                return float('inf')

            # Count rotations needed for top row
            if tops[i] != target:
                # We need to rotate since top doesn't have target
                rotations_top += 1

            # Count rotations needed for bottom row
            if bottoms[i] != target:
                # We need to rotate since bottom doesn't have target
                rotations_bottom += 1

        # Return minimum rotations for this target
        return min(rotations_top, rotations_bottom)

    # Check both candidate values from first domino
    result = min(check(tops[0]), check(bottoms[0]))

    # Return -1 if both candidates fail, otherwise return result
    return -1 if result == float('inf') else result
```

```javascript
// Optimal Solution - Check only tops[0] and bottoms[0]
// Time: O(n) | Space: O(1)
function minDominoRotations(tops, bottoms) {
  const n = tops.length;

  // Helper function to count rotations for a target value
  const check = (target) => {
    let rotationsTop = 0; // Rotations to make all tops = target
    let rotationsBottom = 0; // Rotations to make all bottoms = target

    for (let i = 0; i < n; i++) {
      // If neither domino half has target, impossible
      if (tops[i] !== target && bottoms[i] !== target) {
        return Infinity;
      }

      // Count rotations needed for top row
      if (tops[i] !== target) {
        // We need to rotate since top doesn't have target
        rotationsTop++;
      }

      // Count rotations needed for bottom row
      if (bottoms[i] !== target) {
        // We need to rotate since bottom doesn't have target
        rotationsBottom++;
      }
    }

    // Return minimum rotations for this target
    return Math.min(rotationsTop, rotationsBottom);
  };

  // Check both candidate values from first domino
  const result = Math.min(check(tops[0]), check(bottoms[0]));

  // Return -1 if both candidates fail, otherwise return result
  return result === Infinity ? -1 : result;
}
```

```java
// Optimal Solution - Check only tops[0] and bottoms[0]
// Time: O(n) | Space: O(1)
public int minDominoRotations(int[] tops, int[] bottoms) {
    int n = tops.length;

    // Helper function to count rotations for a target value
    int check(int target) {
        int rotationsTop = 0;  // Rotations to make all tops = target
        int rotationsBottom = 0;  // Rotations to make all bottoms = target

        for (int i = 0; i < n; i++) {
            // If neither domino half has target, impossible
            if (tops[i] != target && bottoms[i] != target) {
                return Integer.MAX_VALUE;
            }

            // Count rotations needed for top row
            if (tops[i] != target) {
                // We need to rotate since top doesn't have target
                rotationsTop++;
            }

            // Count rotations needed for bottom row
            if (bottoms[i] != target) {
                // We need to rotate since bottom doesn't have target
                rotationsBottom++;
            }
        }

        // Return minimum rotations for this target
        return Math.min(rotationsTop, rotationsBottom);
    }

    // Check both candidate values from first domino
    int result = Math.min(check(tops[0]), check(bottoms[0]));

    // Return -1 if both candidates fail, otherwise return result
    return result == Integer.MAX_VALUE ? -1 : result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We check at most 2 candidate values (tops[0] and bottoms[0])
- For each candidate, we make a single pass through the n dominoes
- Total operations: 2 \* n = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for counters
- No additional data structures that scale with input size

## Common Mistakes

1. **Checking all values 1-6 unnecessarily**: While this is technically O(n), it shows you didn't find the key insight about only needing to check two values. Interviewers want to see you recognize this optimization.

2. **Forgetting to check both rows for each candidate**: Some candidates try to make only the top row equal, forgetting they could also make the bottom row equal with potentially fewer rotations.

3. **Incorrect rotation counting**: When a domino has the target value on both sides, no rotation is needed. Some candidates mistakenly count this as needing a rotation.

4. **Not handling the "impossible" case**: If neither candidate works, you must return -1. Forgetting this edge case is a common oversight.

## When You'll See This Pattern

This problem uses the **"candidate reduction"** pattern where you narrow down possibilities based on constraints:

1. **Majority Element (LeetCode 169)**: Similar idea - if an element appears more than n/2 times, it must be the middle element when sorted, leading to Boyer-Moore algorithm.

2. **Find the Celebrity (LeetCode 277)**: You eliminate candidates based on relationships until only one remains.

3. **Gas Station (LeetCode 134)**: If total gas >= total cost, a solution exists, and you only need to check starting points where you have a net gain.

The core pattern: When a problem has many potential solutions, look for constraints that dramatically reduce the search space.

## Key Takeaways

1. **Look for constraints that reduce possibilities**: The insight that the solution must use `tops[0]` or `bottoms[0]` reduces the problem from checking 6 values to checking just 2.

2. **Check both directions when minimizing operations**: For domino rotations, we need to consider making either all tops equal OR all bottoms equal - whichever requires fewer rotations.

3. **Validate candidates completely**: Just because a value works for the first domino doesn't guarantee it works for all. You must verify it appears in every position (either top or bottom).

[Practice this problem on CodeJeet](/problem/minimum-domino-rotations-for-equal-row)
