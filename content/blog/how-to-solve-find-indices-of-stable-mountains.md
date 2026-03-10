---
title: "How to Solve Find Indices of Stable Mountains — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Indices of Stable Mountains. Easy difficulty, 86.8% acceptance rate. Topics: Array."
date: "2028-02-15"
category: "dsa-patterns"
tags: ["find-indices-of-stable-mountains", "array", "easy"]
---

# How to Solve Find Indices of Stable Mountains

This problem asks us to identify "stable" mountains based on a simple condition: a mountain is stable if the mountain immediately before it exists and has a height strictly greater than the current mountain's height plus a given threshold. While the problem is straightforward, it's a great exercise in careful array traversal and boundary condition handling. The tricky part isn't algorithmic complexity—it's avoiding off-by-one errors and correctly interpreting the "strictly greater than height[i] + threshold" condition.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `height = [5, 8, 3, 6, 2]`
- `threshold = 2`

We need to check each mountain (except the first one, since it has no previous mountain) against this condition:
`height[i-1] > height[i] + threshold`

**Step-by-step check:**

- **Mountain 0 (height 5)**: No previous mountain → skip (not eligible)
- **Mountain 1 (height 8)**: Previous height = 5, check: `5 > 8 + 2` → `5 > 10` → **false**
- **Mountain 2 (height 3)**: Previous height = 8, check: `8 > 3 + 2` → `8 > 5` → **true** ✓ (add index 2)
- **Mountain 3 (height 6)**: Previous height = 3, check: `3 > 6 + 2` → `3 > 8` → **false**
- **Mountain 4 (height 2)**: Previous height = 6, check: `6 > 2 + 2` → `6 > 4` → **true** ✓ (add index 4)

**Result:** `[2, 4]`

Notice that we start checking from index 1, not index 0, because index 0 has no previous mountain to compare with.

## Brute Force Approach

The brute force approach is exactly what we did in the visual walkthrough: iterate through each mountain (starting from the second one) and check the condition against its immediate predecessor. This is actually the optimal solution for this problem since we must examine each eligible mountain at least once.

However, let's consider what a naive candidate might get wrong:

1. Starting from index 0 instead of index 1 (trying to check a non-existent previous mountain)
2. Using `>=` instead of `>` (not respecting "strictly greater")
3. Forgetting to add the threshold to the current height before comparing

The brute force approach is already optimal because we need to check n-1 comparisons, and we can't do better than O(n) time complexity.

## Optimal Solution

The optimal solution is a simple linear scan through the array. We start from index 1 (the second mountain) and compare each mountain with its immediate predecessor. For each mountain at index `i`, we check if `height[i-1] > height[i] + threshold`. If true, we add `i` to our result list.

<div class="code-group">

```python
# Time: O(n) | Space: O(k) where k is number of stable mountains (worst case O(n))
def stableMountains(height, threshold):
    """
    Find indices of stable mountains.
    A mountain is stable if the previous mountain's height
    is strictly greater than current height + threshold.

    Args:
        height: List of mountain heights
        threshold: Integer threshold value

    Returns:
        List of indices of stable mountains
    """
    result = []

    # Start from index 1 because index 0 has no previous mountain
    for i in range(1, len(height)):
        # Check if previous mountain's height is strictly greater
        # than current height plus threshold
        if height[i - 1] > height[i] + threshold:
            result.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(k) where k is number of stable mountains (worst case O(n))
function stableMountains(height, threshold) {
  /**
   * Find indices of stable mountains.
   * A mountain is stable if the previous mountain's height
   * is strictly greater than current height + threshold.
   *
   * @param {number[]} height - Array of mountain heights
   * @param {number} threshold - Threshold value
   * @return {number[]} - Indices of stable mountains
   */
  const result = [];

  // Start from index 1 because index 0 has no previous mountain
  for (let i = 1; i < height.length; i++) {
    // Check if previous mountain's height is strictly greater
    // than current height plus threshold
    if (height[i - 1] > height[i] + threshold) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(k) where k is number of stable mountains (worst case O(n))
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> stableMountains(int[] height, int threshold) {
        /**
         * Find indices of stable mountains.
         * A mountain is stable if the previous mountain's height
         * is strictly greater than current height + threshold.
         *
         * @param height - Array of mountain heights
         * @param threshold - Threshold value
         * @return List of indices of stable mountains
         */
        List<Integer> result = new ArrayList<>();

        // Start from index 1 because index 0 has no previous mountain
        for (int i = 1; i < height.length; i++) {
            // Check if previous mountain's height is strictly greater
            // than current height plus threshold
            if (height[i - 1] > height[i] + threshold) {
                result.add(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing a constant-time check for each element (except the first one).
- The loop runs n-1 times, which simplifies to O(n).

**Space Complexity:** O(k) where k is the number of stable mountains

- We need to store the indices of stable mountains in the result list.
- In the worst case (when all mountains except the first are stable), k = n-1, so worst-case space complexity is O(n).
- The algorithm itself uses only a constant amount of extra space beyond the output.

## Common Mistakes

1. **Starting from index 0 instead of index 1**: The first mountain has no previous mountain to compare with, so checking it will either cause an index error (if you try to access `height[-1]`) or incorrect logic. Always start from index 1.

2. **Using >= instead of >**: The problem specifies "strictly greater than," so `height[i-1] > height[i] + threshold` is correct. Using `>=` would include cases where they're equal, which violates the problem statement.

3. **Adding threshold to the wrong side**: The condition is `height[i-1] > height[i] + threshold`, not `height[i-1] + threshold > height[i]`. The threshold is added to the current mountain's height, not the previous mountain's height.

4. **Forgetting to handle edge cases**:
   - Empty array: Should return empty list
   - Single element array: Should return empty list (no previous mountain)
   - All mountains have same height: Likely returns empty list unless threshold is negative

## When You'll See This Pattern

This problem uses a simple linear scan pattern that appears in many array problems:

1. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Similar linear scan to identify missing elements based on index-value relationships.

2. **Find All Duplicates in an Array (LeetCode 442)**: Another linear scan problem where you compare elements with their expected positions.

3. **Monotonic Array (LeetCode 896)**: Checking array elements against their neighbors to determine if the array is entirely non-increasing or non-decreasing.

The core pattern is: **traverse an array while comparing each element with its neighbors or with computed values**. This pattern is fundamental to many "easy" array problems and serves as a building block for more complex algorithms.

## Key Takeaways

1. **Always check boundary conditions first**: For array traversal problems, determine if you need to start from index 0 or 1, and if you need to stop before the last element. Drawing a small example helps clarify this.

2. **Pay attention to comparison operators**: "Strictly greater than" (`>`) vs "greater than or equal to" (`>=`) can be the difference between a correct and incorrect solution. Read the problem statement carefully.

3. **Simple problems test attention to detail**: Even when the algorithm is straightforward, interviewers look for clean code, proper variable naming, and correct handling of edge cases. Don't rush through "easy" problems.

Related problems: [Find in Mountain Array](/problem/find-in-mountain-array)
