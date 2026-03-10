---
title: "How to Solve Minimize the Maximum Adjacent Element Difference — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimize the Maximum Adjacent Element Difference. Hard difficulty, 19.4% acceptance rate. Topics: Array, Binary Search, Greedy."
date: "2026-09-22"
category: "dsa-patterns"
tags:
  ["minimize-the-maximum-adjacent-element-difference", "array", "binary-search", "greedy", "hard"]
---

# How to Solve Minimize the Maximum Adjacent Element Difference

You're given an array where some values are missing (marked as -1), and you need to replace all missing values with one of two positive integers `(x, y)` to minimize the maximum absolute difference between adjacent elements. The challenge is that you must choose exactly one pair `(x, y)` that applies to all missing values—you can't pick different replacements for different positions. This constraint makes the problem tricky because you need to find two values that work well across the entire array, not just locally.

## Visual Walkthrough

Let's walk through an example: `nums = [1, -1, 3, -1, 2]`

We need to choose `(x, y)` and replace each `-1` with either `x` or `y`. Let's think about what happens:

1. The array has missing values at indices 1 and 3
2. We need to minimize the maximum adjacent difference
3. The adjacent pairs we care about are:
   - Between index 0 and 1: `|1 - replacement|`
   - Between index 1 and 2: `|replacement - 3|`
   - Between index 2 and 3: `|3 - replacement|`
   - Between index 3 and 4: `|replacement - 2|`

Let's try a brute force approach in our heads: If we try `x = 2, y = 2` (both equal), we get `[1, 2, 3, 2, 2]`:

- Differences: `|1-2|=1`, `|2-3|=1`, `|3-2|=1`, `|2-2|=0`
- Maximum difference = 1

But can we do better? What if we try `x = 2, y = 2.5`? Actually, `x` and `y` must be positive integers, so let's think systematically.

The key insight: The maximum adjacent difference is determined by the "worst" gap in our array. We need to find `(x, y)` that minimizes this worst gap. Since we can choose which missing value gets `x` vs `y`, we have some flexibility.

## Brute Force Approach

A naive approach would be:

1. Identify all missing positions
2. Try all possible pairs `(x, y)` within some reasonable range
3. For each pair, try all assignments of `x` and `y` to missing positions
4. Calculate the maximum adjacent difference for each assignment
5. Track the minimum of these maximums

Why this fails:

- The search space is enormous: `x` and `y` could be any positive integers
- Even if we bound them (say between min and max of known values), there are O(n²) possible pairs
- For each pair, we have 2^m assignments where m is the number of missing values
- This gives us O(n² \* 2^m) time complexity, which is exponential and impractical

Even a smarter brute force that only considers known values as candidates for `x` and `y` would still be O(k² \* 2^m) where k is the number of known values, which is still exponential in m.

## Optimized Approach

The key insight is that we can **binary search on the answer**. Instead of trying to find the optimal `(x, y)` directly, we ask: "Can we achieve a maximum adjacent difference of at most `d`?"

If we can answer this "feasibility check" efficiently, we can binary search for the smallest `d` that's feasible.

**Feasibility check for a given `d`:**
We need to determine if there exist positive integers `(x, y)` such that when we replace missing values with either `x` or `y`, all adjacent differences are ≤ `d`.

Think about constraints on each missing value:

1. If a missing value is between two known values `a` and `b`, it must satisfy:
   - `|value - a| ≤ d` AND `|value - b| ≤ d`
   - This gives us an interval `[max(1, a-d), a+d] ∩ [max(1, b-d), b+d]`
   - The value must be in the intersection of these intervals

2. If a missing value is at the start or end, it only has one constraint

The tricky part: All missing values must be assigned either `x` or `y`. So we need to find if there exist two integers `(x, y)` such that every missing value's allowed interval contains at least one of `{x, y}`.

This is essentially a **2-point coverage problem**: Given m intervals (one for each missing value), can we choose 2 points that hit all intervals?

We can solve this greedily:

1. For each missing value, compute its allowed interval of values
2. Sort intervals by their right endpoint
3. Greedily select points: Choose the first point as the right endpoint of the first interval, then skip all intervals covered by this point, choose the next point as the right endpoint of the next uncovered interval
4. If we need more than 2 points, `d` is not feasible

## Optimal Solution

Now let's implement the complete solution:

<div class="code-group">

```python
# Time: O(n log M) where M is the range of values, Space: O(n)
def minimizeMaxAdjacentDifference(nums):
    """
    Returns the minimum possible maximum absolute difference between
    adjacent elements after replacing all -1 values with one of two
    positive integers (x, y).
    """
    n = len(nums)

    def can_achieve(max_diff):
        """
        Check if we can achieve maximum adjacent difference <= max_diff
        by choosing two values (x, y) for all missing elements.
        """
        intervals = []

        # Build allowed intervals for each missing value
        for i in range(n):
            if nums[i] == -1:
                # Calculate allowed range for this position
                left_bound = 1  # Positive integer constraint
                right_bound = float('inf')

                # Constraint from left neighbor (if exists)
                if i > 0 and nums[i-1] != -1:
                    left_bound = max(left_bound, nums[i-1] - max_diff)
                    right_bound = min(right_bound, nums[i-1] + max_diff)

                # Constraint from right neighbor (if exists)
                if i < n-1 and nums[i+1] != -1:
                    left_bound = max(left_bound, nums[i+1] - max_diff)
                    right_bound = min(right_bound, nums[i+1] + max_diff)

                # If no constraints from neighbors (array of all -1 or single -1)
                if left_bound > right_bound:
                    return False  # Impossible to satisfy constraints

                intervals.append((left_bound, right_bound))

        # If no missing values, check if known values satisfy max_diff
        if not intervals:
            for i in range(n-1):
                if abs(nums[i] - nums[i+1]) > max_diff:
                    return False
            return True

        # Sort intervals by right endpoint for greedy coverage
        intervals.sort(key=lambda x: x[1])

        # Greedy algorithm to cover intervals with 2 points
        points = []
        for left, right in intervals:
            if not points or points[-1] < left:
                # Current point doesn't cover this interval
                points.append(right)
                if len(points) > 2:
                    return False

        return True

    # Binary search for the minimum feasible max_diff
    # The answer is between 0 and max possible difference
    left, right = 0, 10**9  # Upper bound based on constraints

    while left < right:
        mid = (left + right) // 2
        if can_achieve(mid):
            right = mid  # Try for smaller difference
        else:
            left = mid + 1  # Need larger difference

    return left
```

```javascript
// Time: O(n log M) where M is the range of values, Space: O(n)
function minimizeMaxAdjacentDifference(nums) {
  const n = nums.length;

  /**
   * Check if we can achieve maximum adjacent difference <= maxDiff
   * by choosing two values (x, y) for all missing elements.
   */
  function canAchieve(maxDiff) {
    const intervals = [];

    // Build allowed intervals for each missing value
    for (let i = 0; i < n; i++) {
      if (nums[i] === -1) {
        // Calculate allowed range for this position
        let leftBound = 1; // Positive integer constraint
        let rightBound = Infinity;

        // Constraint from left neighbor (if exists)
        if (i > 0 && nums[i - 1] !== -1) {
          leftBound = Math.max(leftBound, nums[i - 1] - maxDiff);
          rightBound = Math.min(rightBound, nums[i - 1] + maxDiff);
        }

        // Constraint from right neighbor (if exists)
        if (i < n - 1 && nums[i + 1] !== -1) {
          leftBound = Math.max(leftBound, nums[i + 1] - maxDiff);
          rightBound = Math.min(rightBound, nums[i + 1] + maxDiff);
        }

        // If no constraints from neighbors (array of all -1 or single -1)
        if (leftBound > rightBound) {
          return false; // Impossible to satisfy constraints
        }

        intervals.push([leftBound, rightBound]);
      }
    }

    // If no missing values, check if known values satisfy maxDiff
    if (intervals.length === 0) {
      for (let i = 0; i < n - 1; i++) {
        if (Math.abs(nums[i] - nums[i + 1]) > maxDiff) {
          return false;
        }
      }
      return true;
    }

    // Sort intervals by right endpoint for greedy coverage
    intervals.sort((a, b) => a[1] - b[1]);

    // Greedy algorithm to cover intervals with 2 points
    const points = [];
    for (const [left, right] of intervals) {
      if (points.length === 0 || points[points.length - 1] < left) {
        // Current point doesn't cover this interval
        points.push(right);
        if (points.length > 2) {
          return false;
        }
      }
    }

    return true;
  }

  // Binary search for the minimum feasible maxDiff
  let left = 0;
  let right = 1e9; // Upper bound based on constraints

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canAchieve(mid)) {
      right = mid; // Try for smaller difference
    } else {
      left = mid + 1; // Need larger difference
    }
  }

  return left;
}
```

```java
// Time: O(n log M) where M is the range of values, Space: O(n)
import java.util.*;

class Solution {
    public int minimizeMaxAdjacentDifference(int[] nums) {
        int n = nums.length;

        // Binary search for the minimum feasible maxDiff
        int left = 0, right = (int)1e9;  // Upper bound based on constraints

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canAchieve(nums, mid)) {
                right = mid;  // Try for smaller difference
            } else {
                left = mid + 1;  // Need larger difference
            }
        }

        return left;
    }

    /**
     * Check if we can achieve maximum adjacent difference <= maxDiff
     * by choosing two values (x, y) for all missing elements.
     */
    private boolean canAchieve(int[] nums, int maxDiff) {
        List<int[]> intervals = new ArrayList<>();
        int n = nums.length;

        // Build allowed intervals for each missing value
        for (int i = 0; i < n; i++) {
            if (nums[i] == -1) {
                // Calculate allowed range for this position
                int leftBound = 1;  // Positive integer constraint
                int rightBound = Integer.MAX_VALUE;

                // Constraint from left neighbor (if exists)
                if (i > 0 && nums[i-1] != -1) {
                    leftBound = Math.max(leftBound, nums[i-1] - maxDiff);
                    rightBound = Math.min(rightBound, nums[i-1] + maxDiff);
                }

                // Constraint from right neighbor (if exists)
                if (i < n-1 && nums[i+1] != -1) {
                    leftBound = Math.max(leftBound, nums[i+1] - maxDiff);
                    rightBound = Math.min(rightBound, nums[i+1] + maxDiff);
                }

                // If no constraints from neighbors (array of all -1 or single -1)
                if (leftBound > rightBound) {
                    return false;  // Impossible to satisfy constraints
                }

                intervals.add(new int[]{leftBound, rightBound});
            }
        }

        // If no missing values, check if known values satisfy maxDiff
        if (intervals.isEmpty()) {
            for (int i = 0; i < n-1; i++) {
                if (Math.abs(nums[i] - nums[i+1]) > maxDiff) {
                    return false;
                }
            }
            return true;
        }

        // Sort intervals by right endpoint for greedy coverage
        intervals.sort((a, b) -> Integer.compare(a[1], b[1]));

        // Greedy algorithm to cover intervals with 2 points
        List<Integer> points = new ArrayList<>();
        for (int[] interval : intervals) {
            int left = interval[0], right = interval[1];
            if (points.isEmpty() || points.get(points.size()-1) < left) {
                // Current point doesn't cover this interval
                points.add(right);
                if (points.size() > 2) {
                    return false;
                }
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log M)**

- `n` is the length of the input array
- `M` is the range of possible answers (0 to 10^9 in this case)
- For each binary search iteration (O(log M)), we run the feasibility check:
  - Building intervals: O(n)
  - Sorting intervals: O(m log m) where m ≤ n
  - Greedy coverage: O(m)
  - Overall: O(n + m log m) = O(n log n) worst case
- Total: O(n log n \* log M), but since log M is constant (≤ 30), we simplify to O(n log n)

**Space Complexity: O(n)**

- We store intervals for missing values, which could be up to n intervals
- The greedy algorithm uses O(1) additional space beyond the intervals

## Common Mistakes

1. **Forgetting the positive integer constraint**: The problem states `x` and `y` must be positive integers. Many candidates forget to enforce `value ≥ 1` when calculating intervals.

2. **Incorrect interval intersection**: When a missing value has constraints from both sides, you need the intersection of both intervals. A common mistake is taking the union or only considering one constraint.

3. **Handling edge cases poorly**:
   - Array with no missing values: Need to check if existing differences exceed the candidate `d`
   - Array with all missing values: Any two positive integers work, so answer should be 0
   - Single element array: Maximum adjacent difference is always 0

4. **Inefficient feasibility check**: Some candidates try to brute force assignments of `x` and `y` to intervals, which is exponential. The greedy approach (sort by right endpoint) is key.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: When you're asked to minimize a maximum or maximize a minimum, binary search on the answer is often the right approach. Similar problems:
   - **Capacity To Ship Packages Within D Days**: Minimize maximum daily weight
   - **Split Array Largest Sum**: Minimize the largest sum among subarrays
   - **Koko Eating Bananas**: Minimize eating speed to finish within hours

2. **Interval coverage with limited points**: The greedy algorithm for covering intervals with minimum points (sort by right endpoint) appears in:
   - **Minimum Number of Arrows to Burst Balloons**: Find minimum arrows to burst all balloons
   - **Video Stitching**: Minimum clips to cover entire time range

3. **Constraint satisfaction with binary search**: The pattern of "can we achieve X?" checked via binary search appears in many optimization problems.

## Key Takeaways

1. **Minimax problems often suggest binary search**: When asked to minimize a maximum (or maximize a minimum), consider binary searching on the answer and checking feasibility.

2. **Greedy interval coverage is optimal**: When you need to cover intervals with points, sorting by right endpoint and greedily placing points at right endpoints gives the minimum number of points needed.

3. **Break complex problems into subproblems**: This problem has three layers: binary search framework, interval construction from constraints, and interval coverage. Solving each layer independently makes the problem manageable.

Related problems: [Minimum Absolute Sum Difference](/problem/minimum-absolute-sum-difference), [Minimize the Maximum Adjacent Element Difference](/problem/minimize-the-maximum-adjacent-element-difference)
