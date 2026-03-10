---
title: "How to Solve Find the Number of Copy Arrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Number of Copy Arrays. Medium difficulty, 46.8% acceptance rate. Topics: Array, Math."
date: "2029-10-22"
category: "dsa-patterns"
tags: ["find-the-number-of-copy-arrays", "array", "math", "medium"]
---

# How to Solve Find the Number of Copy Arrays

This problem asks us to count how many arrays `copy` can be created from an `original` array while maintaining the same difference pattern between consecutive elements, with each element constrained within specific bounds. What makes this tricky is that the constraints interact—changing one element affects what values are possible for subsequent elements due to the fixed difference requirement.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
original = [3, 5, 7]
bounds = [[1, 4], [2, 6], [4, 8]]
```

We need to find all `copy` arrays where:

1. `copy[i] - copy[i-1] = original[i] - original[i-1]` for i ≥ 1
2. `bounds[i][0] ≤ copy[i] ≤ bounds[i][1]` for all i

**Step 1: Understand the difference constraint**

- `original[1] - original[0] = 5 - 3 = 2`
- `original[2] - original[1] = 7 - 5 = 2`

So for any valid `copy`:

- `copy[1] - copy[0] = 2` → `copy[1] = copy[0] + 2`
- `copy[2] - copy[1] = 2` → `copy[2] = copy[1] + 2 = copy[0] + 4`

**Step 2: Express all elements in terms of `copy[0]`**

- `copy[0] = x` (some value)
- `copy[1] = x + 2`
- `copy[2] = x + 4`

**Step 3: Apply bounds constraints**
For each element, we have:

1. `bounds[0][0] ≤ x ≤ bounds[0][1]` → `1 ≤ x ≤ 4`
2. `bounds[1][0] ≤ x + 2 ≤ bounds[1][1]` → `2 ≤ x + 2 ≤ 6` → `0 ≤ x ≤ 4`
3. `bounds[2][0] ≤ x + 4 ≤ bounds[2][1]` → `4 ≤ x + 4 ≤ 8` → `0 ≤ x ≤ 4`

**Step 4: Find intersection of all constraints**
We need `x` that satisfies ALL inequalities:

- From (1): `1 ≤ x ≤ 4`
- From (2): `0 ≤ x ≤ 4`
- From (3): `0 ≤ x ≤ 4`

The intersection is `1 ≤ x ≤ 4`, so `x` can be 1, 2, 3, or 4.

**Step 5: Count valid arrays**
Each valid `x` gives one valid `copy` array:

- `x = 1`: `copy = [1, 3, 5]`
- `x = 2`: `copy = [2, 4, 6]`
- `x = 3`: `copy = [3, 5, 7]`
- `x = 4`: `copy = [4, 6, 8]`

**Answer: 4**

The key insight: All elements are linear functions of `copy[0]`, so we just need to find how many integer values of `copy[0]` satisfy all the transformed bounds constraints.

## Brute Force Approach

A naive approach would try all possible values for each position within its bounds, then check if the difference constraints are satisfied. For each position `i`, if the bounds allow `k` possible values, we'd have to check up to `k^n` combinations.

**Why this fails:**

- With bounds like `[1, 10^9]`, each position could have up to 10^9 possible values
- For `n = 10^5`, checking all combinations is impossible (10^(9×10^5) possibilities)
- Even with smaller bounds, the exponential growth makes this infeasible

The brute force doesn't leverage the linear relationship between elements—it treats each position independently when they're actually dependent.

## Optimized Approach

The optimal solution comes from recognizing that all elements can be expressed as:

```
copy[i] = copy[0] + (original[i] - original[0])
```

Let's verify this:

- For i=0: `copy[0] = copy[0] + (original[0] - original[0]) = copy[0]` ✓
- For i=1: `copy[1] = copy[0] + (original[1] - original[0])`
  But we know `copy[1] - copy[0] = original[1] - original[0]`, so this holds ✓
- By induction, it works for all i

Now each constraint `bounds[i][0] ≤ copy[i] ≤ bounds[i][1]` becomes:

```
bounds[i][0] ≤ copy[0] + (original[i] - original[0]) ≤ bounds[i][1]
```

Which rearranges to:

```
bounds[i][0] - (original[i] - original[0]) ≤ copy[0] ≤ bounds[i][1] - (original[i] - original[0])
```

So for each i, we get an interval constraint on `copy[0]`. The number of valid `copy` arrays equals the number of integer values in the intersection of all these intervals.

**Algorithm:**

1. Initialize `low = -∞` and `high = ∞` for `copy[0]` range
2. For each index i from 0 to n-1:
   - Calculate `diff = original[i] - original[0]`
   - Transform bounds: `new_low = bounds[i][0] - diff`
   - Transform bounds: `new_high = bounds[i][1] - diff`
   - Update: `low = max(low, new_low)`
   - Update: `high = min(high, new_high)`
3. If `low > high`, return 0 (no solutions)
4. Otherwise, return `high - low + 1` (count of integers in [low, high])

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfCopyArrays(original, bounds):
    """
    Counts the number of valid copy arrays.

    Args:
        original: List[int] - original array of length n
        bounds: List[List[int]] - 2D array of bounds for each position

    Returns:
        int - number of valid copy arrays
    """
    n = len(original)

    # Initialize the possible range for copy[0]
    # We start with the widest possible range
    low = float('-inf')
    high = float('inf')

    # Process each position to constrain copy[0]
    for i in range(n):
        # Calculate how much original[i] differs from original[0]
        diff = original[i] - original[0]

        # Transform the bounds for position i into bounds for copy[0]
        # Since copy[i] = copy[0] + diff, we have:
        # bounds[i][0] ≤ copy[0] + diff ≤ bounds[i][1]
        # Which rearranges to:
        new_low = bounds[i][0] - diff
        new_high = bounds[i][1] - diff

        # Intersect with current range
        low = max(low, new_low)
        high = min(high, new_high)

        # Early exit if range becomes empty
        if low > high:
            return 0

    # Count integer values in [low, high]
    # Note: low and high are integers since bounds and original contain integers
    return high - low + 1
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfCopyArrays(original, bounds) {
  /**
   * Counts the number of valid copy arrays.
   *
   * @param {number[]} original - original array of length n
   * @param {number[][]} bounds - 2D array of bounds for each position
   * @return {number} - number of valid copy arrays
   */
  const n = original.length;

  // Initialize the possible range for copy[0]
  // Use very large/small numbers to represent infinity
  let low = -Infinity;
  let high = Infinity;

  // Process each position to constrain copy[0]
  for (let i = 0; i < n; i++) {
    // Calculate how much original[i] differs from original[0]
    const diff = original[i] - original[0];

    // Transform the bounds for position i into bounds for copy[0]
    // Since copy[i] = copy[0] + diff, we have:
    // bounds[i][0] ≤ copy[0] + diff ≤ bounds[i][1]
    // Which rearranges to:
    const newLow = bounds[i][0] - diff;
    const newHigh = bounds[i][1] - diff;

    // Intersect with current range
    low = Math.max(low, newLow);
    high = Math.min(high, newHigh);

    // Early exit if range becomes empty
    if (low > high) {
      return 0;
    }
  }

  // Count integer values in [low, high]
  // Note: low and high are integers since bounds and original contain integers
  return high - low + 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int numberOfCopyArrays(int[] original, int[][] bounds) {
        /**
         * Counts the number of valid copy arrays.
         *
         * @param original - original array of length n
         * @param bounds - 2D array of bounds for each position
         * @return number of valid copy arrays
         */
        int n = original.length;

        // Initialize the possible range for copy[0]
        // Use very large/small numbers to represent infinity
        // Using long to avoid integer overflow
        long low = Long.MIN_VALUE;
        long high = Long.MAX_VALUE;

        // Process each position to constrain copy[0]
        for (int i = 0; i < n; i++) {
            // Calculate how much original[i] differs from original[0]
            // Use long to avoid overflow with large numbers
            long diff = (long) original[i] - original[0];

            // Transform the bounds for position i into bounds for copy[0]
            // Since copy[i] = copy[0] + diff, we have:
            // bounds[i][0] ≤ copy[0] + diff ≤ bounds[i][1]
            // Which rearranges to:
            long newLow = (long) bounds[i][0] - diff;
            long newHigh = (long) bounds[i][1] - diff;

            // Intersect with current range
            low = Math.max(low, newLow);
            high = Math.min(high, newHigh);

            // Early exit if range becomes empty
            if (low > high) {
                return 0;
            }
        }

        // Count integer values in [low, high]
        // Cast back to int since result fits in int (n ≤ 10^5, bounds up to 10^9)
        return (int) (high - low + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations at each step
- Each iteration involves: calculating diff, transforming bounds, updating low/high
- Early exit when low > high doesn't change worst-case complexity but improves average case

**Space Complexity: O(1)**

- We only use a constant amount of extra space (low, high, diff, loop variable)
- No additional data structures that scale with input size
- The input arrays are not counted toward space complexity

## Common Mistakes

1. **Forgetting about integer overflow**: When bounds values are up to 10^9 and n up to 10^5, intermediate calculations can overflow 32-bit integers. Always use 64-bit integers (long in Java, no issue in Python).

2. **Incorrect transformation formula**: Some candidates mistakenly use `original[i] - original[i-1]` instead of `original[i] - original[0]`. Remember: `copy[i] = copy[0] + (original[i] - original[0])`, not `copy[0] + sum of differences`.

3. **Off-by-one in counting**: When returning `high - low + 1`, forgetting the `+1` will undercount by 1. The number of integers in [a, b] is `b - a + 1`, not `b - a`.

4. **Not handling empty intersection early**: Continuing to process after low > high is wasted computation. Always check and return 0 immediately when the range becomes empty.

## When You'll See This Pattern

This problem uses **linear constraint propagation** and **interval intersection**, which appear in:

1. **Count of Range Sum (Hard)**: While more complex, it also involves transforming constraints and counting solutions that satisfy them. The key similarity is expressing elements in terms of prefix sums and then applying constraints.

2. **Meeting Rooms II (Medium)**: The "minimum meeting rooms" problem involves finding the maximum overlap of intervals, which requires similar interval manipulation skills.

3. **Car Pooling (Medium)**: This involves tracking capacity constraints over a journey, similar to how we track bounds on copy[0] across all positions.

The core pattern: When you have dependent variables with linear relationships, express everything in terms of one variable and find the intersection of all constraints.

## Key Takeaways

1. **Linear relationships simplify constraints**: When variables have fixed differences, they're all linear functions of one reference variable. This reduces an n-dimensional problem to a 1-dimensional interval intersection problem.

2. **Think in terms of feasible ranges**: Instead of enumerating possibilities, maintain the feasible range and narrow it down constraint by constraint. This is often more efficient than brute force search.

3. **Watch for integer overflow in bounds problems**: When dealing with large bounds and many elements, always consider whether 32-bit integers are sufficient or if you need 64-bit.

Related problems: [Count of Range Sum](/problem/count-of-range-sum)
