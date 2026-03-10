---
title: "How to Solve Merge Triplets to Form Target Triplet — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Merge Triplets to Form Target Triplet. Medium difficulty, 68.9% acceptance rate. Topics: Array, Greedy."
date: "2027-03-14"
category: "dsa-patterns"
tags: ["merge-triplets-to-form-target-triplet", "array", "greedy", "medium"]
---

# How to Solve Merge Triplets to Form Target Triplet

You're given a list of triplets (arrays of three integers) and a target triplet. You can merge two triplets by taking the maximum of each corresponding position, and you want to know if you can merge some sequence of triplets to exactly form the target. The challenge is that you can't just take any triplet—you need to ensure that no value in any selected triplet exceeds the corresponding target value, while still being able to reach all target values through maximum operations.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `triplets = [[2,5,3], [1,8,4], [1,7,5]]`
- `target = [2,7,5]`

We want to see if we can merge some selection of triplets to get exactly `[2,7,5]`.

**Step 1: Filter out invalid triplets**
Any triplet that has even one value greater than the corresponding target value can't be used, because once we include it, the maximum operation would push that dimension above our target. Let's check each triplet:

- `[2,5,3]`: 2≤2, 5≤7, 3≤5 → valid
- `[1,8,4]`: 1≤2, 8>7 → invalid (8 exceeds target's 7)
- `[1,7,5]`: 1≤2, 7≤7, 5≤5 → valid

So we only consider `[2,5,3]` and `[1,7,5]`.

**Step 2: Track what target values we can achieve**
We start with `[0,0,0]` and merge valid triplets:

- Merge `[2,5,3]`: max([0,0,0], [2,5,3]) = [2,5,3]
- Merge `[1,7,5]`: max([2,5,3], [1,7,5]) = [2,7,5]

We've reached the target! Notice that:

- The first triplet gave us the 2 in the first position
- The second triplet gave us the 7 in the second position and 5 in the third
- Together, they cover all target values

The key insight: we need to find valid triplets that collectively provide each target value in at least one position.

## Brute Force Approach

A naive approach would be to try all possible subsets of triplets. For each subset:

1. Start with `[0,0,0]`
2. Merge all triplets in the subset (take max of each position)
3. Check if the result equals target

This brute force solution has exponential time complexity—O(2ⁿ) where n is the number of triplets. With n up to 1000 in some test cases, this is completely infeasible (2¹⁰⁰⁰ is astronomically large).

Even if we try to be clever by only considering valid triplets (those with all values ≤ corresponding target values), we could still have many valid triplets, making subset exploration impractical.

## Optimized Approach

The key insight is **greedy filtering**:

1. First, eliminate any triplet that has a value greater than the target in any position. These are unusable because they would push us above the target.
2. Then, track which target values we've seen in the remaining valid triplets.
3. If we've seen all three target values across different triplets (possibly in different triplets), we can form the target.

Why does this work? Because:

- The max operation means we only care about the maximum value we can achieve in each position
- Any valid triplet contributes at most its values to the final result
- If we have triplets that individually contain each target value in the correct position, merging them will give us exactly the target
- We don't need to track which specific triplets to use—just whether each target value is achievable

Think of it as: we need to "cover" each position of the target with at least one triplet that has exactly the target value in that position (and values ≤ target in other positions).

## Optimal Solution

The algorithm:

1. Initialize three flags (or a set) to track which target values we've found
2. For each triplet:
   - If any value exceeds the corresponding target value, skip it (it's invalid)
   - Otherwise, check if this triplet has any value that matches the target
   - If it does, mark that position as achievable
3. At the end, check if all three positions are achievable

<div class="code-group">

```python
# Time: O(n) where n = len(triplets) | Space: O(1)
def mergeTriplets(triplets, target):
    """
    Determines if we can merge triplets to form the target triplet.

    Args:
        triplets: List of triplets [ai, bi, ci]
        target: Target triplet [x, y, z]

    Returns:
        bool: True if target can be formed, False otherwise
    """
    # Track which positions of the target we've found matching values for
    found_first = False
    found_second = False
    found_third = False

    # Unpack target for cleaner comparisons
    x_target, y_target, z_target = target

    # Check each triplet
    for a, b, c in triplets:
        # Skip any triplet with a value greater than target in any position
        # Such triplets would make it impossible to reach the exact target
        if a > x_target or b > y_target or c > z_target:
            continue

        # If this triplet has the target value in first position, mark it found
        if a == x_target:
            found_first = True
        # If this triplet has the target value in second position, mark it found
        if b == y_target:
            found_second = True
        # If this triplet has the target value in third position, mark it found
        if c == z_target:
            found_third = True

        # Early exit: if we've found all three, we can return True immediately
        if found_first and found_second and found_third:
            return True

    # We can form the target only if we found matches for all three positions
    return found_first and found_second and found_third
```

```javascript
// Time: O(n) where n = triplets.length | Space: O(1)
function mergeTriplets(triplets, target) {
  /**
   * Determines if we can merge triplets to form the target triplet.
   *
   * @param {number[][]} triplets - Array of triplets [ai, bi, ci]
   * @param {number[]} target - Target triplet [x, y, z]
   * @return {boolean} - True if target can be formed, False otherwise
   */

  // Track which positions of the target we've found matching values for
  let foundFirst = false;
  let foundSecond = false;
  let foundThird = false;

  // Destructure target for cleaner comparisons
  const [xTarget, yTarget, zTarget] = target;

  // Check each triplet
  for (const [a, b, c] of triplets) {
    // Skip any triplet with a value greater than target in any position
    // Such triplets would make it impossible to reach the exact target
    if (a > xTarget || b > yTarget || c > zTarget) {
      continue;
    }

    // If this triplet has the target value in first position, mark it found
    if (a === xTarget) {
      foundFirst = true;
    }
    // If this triplet has the target value in second position, mark it found
    if (b === yTarget) {
      foundSecond = true;
    }
    // If this triplet has the target value in third position, mark it found
    if (c === zTarget) {
      foundThird = true;
    }

    // Early exit: if we've found all three, we can return true immediately
    if (foundFirst && foundSecond && foundThird) {
      return true;
    }
  }

  // We can form the target only if we found matches for all three positions
  return foundFirst && foundSecond && foundThird;
}
```

```java
// Time: O(n) where n = triplets.length | Space: O(1)
class Solution {
    public boolean mergeTriplets(int[][] triplets, int[] target) {
        /**
         * Determines if we can merge triplets to form the target triplet.
         *
         * @param triplets Array of triplets [ai, bi, ci]
         * @param target Target triplet [x, y, z]
         * @return True if target can be formed, False otherwise
         */

        // Track which positions of the target we've found matching values for
        boolean foundFirst = false;
        boolean foundSecond = false;
        boolean foundThird = false;

        // Extract target values for cleaner comparisons
        int xTarget = target[0];
        int yTarget = target[1];
        int zTarget = target[2];

        // Check each triplet
        for (int[] triplet : triplets) {
            int a = triplet[0];
            int b = triplet[1];
            int c = triplet[2];

            // Skip any triplet with a value greater than target in any position
            // Such triplets would make it impossible to reach the exact target
            if (a > xTarget || b > yTarget || c > zTarget) {
                continue;
            }

            // If this triplet has the target value in first position, mark it found
            if (a == xTarget) {
                foundFirst = true;
            }
            // If this triplet has the target value in second position, mark it found
            if (b == yTarget) {
                foundSecond = true;
            }
            // If this triplet has the target value in third position, mark it found
            if (c == zTarget) {
                foundThird = true;
            }

            // Early exit: if we've found all three, we can return true immediately
            if (foundFirst && foundSecond && foundThird) {
                return true;
            }
        }

        // We can form the target only if we found matches for all three positions
        return foundFirst && foundSecond && foundThird;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the list of triplets exactly once
- For each triplet, we perform a constant number of comparisons (checking if values exceed target, checking if values equal target)
- Even with the early exit optimization, worst-case is still O(n) when we need to check all triplets

**Space Complexity: O(1)**

- We only use a few boolean variables to track which target values we've found
- No additional data structures that grow with input size
- The input itself is not counted toward space complexity in standard analysis

## Common Mistakes

1. **Not filtering out triplets with values > target**: This is the most common mistake. Candidates might try to use a triplet like `[1,8,4]` when target is `[2,7,5]`, thinking they can somehow avoid the 8. But once merged, the max operation will include that 8, making it impossible to reach exactly 7 in the second position.

2. **Checking if a single triplet equals the target**: Some candidates look for one perfect triplet that matches the target exactly. While this would work, it's not necessary—the target can be formed from multiple triplets. For example, `[2,5,3]` and `[1,7,5]` together form `[2,7,5]`, even though neither alone matches.

3. **Forgetting that order matters in triplets**: The triplets are arrays where position 0 corresponds to the first target value, position 1 to the second, etc. A common error is to treat them as sets or to compare values in the wrong positions.

4. **Overcomplicating with dynamic programming or backtracking**: Because the problem seems like a combination problem, candidates sometimes try DP or backtracking solutions. These are unnecessary and inefficient. The greedy approach works because of the max operation's properties.

## When You'll See This Pattern

This problem uses a **greedy filtering** pattern combined with **coordinate-wise constraints**. You'll see similar patterns in:

1. **Meeting Rooms II (LeetCode 253)**: You need to track overlapping intervals and find the maximum number of concurrent meetings. Like our triplet problem, it involves comparing values across multiple dimensions (start and end times).

2. **Non-overlapping Intervals (LeetCode 435)**: You need to select a maximum set of non-overlapping intervals. The greedy approach involves sorting and filtering, similar to how we filter invalid triplets.

3. **Video Stitching (LeetCode 1024)**: You need to select clips to cover a time range. The greedy approach involves filtering clips that start within the current covered range and extending coverage, similar to how we accumulate coverage of target values.

The core pattern: when you need to achieve multiple constraints and have operations that combine elements (like max, min, union), often a greedy approach that filters invalid options and tracks what's been achieved works best.

## Key Takeaways

1. **Max/min operations often enable greedy solutions**: When combining elements with max or min, you don't need to track all combinations—just whether you can achieve each required value. The operation's idempotent nature (max(a, max(b, c)) = max(a, b, c)) simplifies the problem.

2. **Filter invalid options first**: Many optimization problems become simpler when you eliminate options that can't possibly be part of a valid solution. Here, any triplet with a value > target in any position is immediately discarded.

3. **Think about coverage rather than exact combinations**: Instead of trying to find the right subset of triplets, think about whether each target value is "covered" by at least one valid triplet. This shift in perspective—from combination to coverage—is key to many greedy algorithms.

[Practice this problem on CodeJeet](/problem/merge-triplets-to-form-target-triplet)
