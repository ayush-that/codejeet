---
title: "How to Solve Minimum Distance to the Target Element — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Distance to the Target Element. Easy difficulty, 54.2% acceptance rate. Topics: Array."
date: "2028-04-22"
category: "dsa-patterns"
tags: ["minimum-distance-to-the-target-element", "array", "easy"]
---

# How to Solve Minimum Distance to the Target Element

This problem asks us to find the minimum absolute distance between a given starting index and any occurrence of a target value in an array. While straightforward, it tests your ability to efficiently scan an array and handle simple distance calculations. The key insight is recognizing that we don't need to check every index—we can stop early in certain cases, though a simple linear scan works perfectly fine.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `nums = [1, 2, 3, 4, 5, 3, 6, 3]`
- `target = 3`
- `start = 4`

We need to find all indices where `nums[i] == 3` and calculate `abs(i - start)` for each:

1. **Index 0**: nums[0] = 1 ≠ 3 → skip
2. **Index 1**: nums[1] = 2 ≠ 3 → skip
3. **Index 2**: nums[2] = 3 ✓ → distance = abs(2 - 4) = 2
4. **Index 3**: nums[3] = 4 ≠ 3 → skip
5. **Index 4**: nums[4] = 5 ≠ 3 → skip
6. **Index 5**: nums[5] = 3 ✓ → distance = abs(5 - 4) = 1 (new minimum!)
7. **Index 6**: nums[6] = 6 ≠ 3 → skip
8. **Index 7**: nums[7] = 3 ✓ → distance = abs(7 - 4) = 3

The minimum distance is 1 (from index 5). Notice we could potentially stop early if we find a distance of 0, but otherwise need to check all elements since a target could appear anywhere.

## Brute Force Approach

The most straightforward solution is to iterate through the entire array, check each element against the target, and track the minimum distance found. This approach is actually optimal for this problem since we must examine each element in the worst case to guarantee we find all target occurrences.

However, a truly naive approach might try to:

1. Find all indices where target appears (requires full scan)
2. Calculate distances for each (requires another pass)
3. Return the minimum

This would be O(n) time with O(k) extra space for storing indices, which is unnecessary since we can compute and compare distances on the fly.

The "brute force" thinking here would be: "I must check every element because target could be anywhere." That's correct, and it leads directly to the optimal solution.

## Optimal Solution

We can solve this with a single pass through the array. For each element equal to the target, we calculate `abs(i - start)` and update our minimum if this distance is smaller than what we've seen before. Since the problem guarantees the target exists, we don't need to handle the "not found" case.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def getMinDistance(nums, target, start):
    """
    Find minimum distance between start index and any occurrence of target.

    Args:
        nums: List of integers to search
        target: Value to find in nums
        start: Reference index for distance calculation

    Returns:
        Minimum absolute distance |i - start| where nums[i] == target
    """
    # Initialize min_distance with a large value
    # Using float('inf') ensures any valid distance will be smaller
    min_distance = float('inf')

    # Iterate through all indices in the array
    for i in range(len(nums)):
        # Check if current element matches target
        if nums[i] == target:
            # Calculate absolute distance from start index
            distance = abs(i - start)
            # Update minimum if current distance is smaller
            if distance < min_distance:
                min_distance = distance
            # Early exit: if distance is 0, we can't do better
            if min_distance == 0:
                break

    return min_distance
```

```javascript
// Time: O(n) | Space: O(1)
function getMinDistance(nums, target, start) {
  /**
   * Find minimum distance between start index and any occurrence of target.
   *
   * @param {number[]} nums - Array of integers to search
   * @param {number} target - Value to find in nums
   * @param {number} start - Reference index for distance calculation
   * @return {number} Minimum absolute distance |i - start| where nums[i] == target
   */
  // Initialize minDistance with a large value
  // Using Infinity ensures any valid distance will be smaller
  let minDistance = Infinity;

  // Iterate through all indices in the array
  for (let i = 0; i < nums.length; i++) {
    // Check if current element matches target
    if (nums[i] === target) {
      // Calculate absolute distance from start index
      const distance = Math.abs(i - start);
      // Update minimum if current distance is smaller
      if (distance < minDistance) {
        minDistance = distance;
      }
      // Early exit: if distance is 0, we can't do better
      if (minDistance === 0) {
        break;
      }
    }
  }

  return minDistance;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int getMinDistance(int[] nums, int target, int start) {
        /**
         * Find minimum distance between start index and any occurrence of target.
         *
         * @param nums Array of integers to search
         * @param target Value to find in nums
         * @param start Reference index for distance calculation
         * @return Minimum absolute distance |i - start| where nums[i] == target
         */
        // Initialize minDistance with a large value
        // Using Integer.MAX_VALUE ensures any valid distance will be smaller
        int minDistance = Integer.MAX_VALUE;

        // Iterate through all indices in the array
        for (int i = 0; i < nums.length; i++) {
            // Check if current element matches target
            if (nums[i] == target) {
                // Calculate absolute distance from start index
                int distance = Math.abs(i - start);
                // Update minimum if current distance is smaller
                if (distance < minDistance) {
                    minDistance = distance;
                }
                // Early exit: if distance is 0, we can't do better
                if (minDistance == 0) {
                    break;
                }
            }
        }

        return minDistance;
    }
}
```

</div>

**Key implementation details:**

1. **Initialization**: We start with `min_distance` set to infinity (or a very large number) so the first valid distance will always update it.
2. **Early termination**: If we find a target at exactly the `start` index (distance = 0), we can immediately return since this is the best possible result.
3. **Absolute value**: Using `abs()` ensures distance is always positive, regardless of whether `i` is before or after `start`.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once in the worst case (when target is at the last index or not found early).
- In the best case (target at `start` index), we exit immediately: O(1).
- The early exit when finding distance 0 doesn't change the worst-case asymptotic complexity but improves practical performance.

**Space Complexity: O(1)**

- We only use a constant amount of extra space: variables for `min_distance`, loop index, and temporary distance calculation.
- No additional data structures are needed.

## Common Mistakes

1. **Forgetting absolute value**: Calculating `i - start` without `abs()` would give negative distances for indices before `start`, leading to incorrect minimum calculations. Always remember distance is non-negative.

2. **Incorrect initialization**: Starting with `min_distance = 0` would never update since all distances are ≥ 0. Use a large initial value like `float('inf')`, `Integer.MAX_VALUE`, or initialize with the first valid distance found.

3. **Unnecessary optimization attempts**: Some candidates try to search outward from `start` in both directions, thinking it's more efficient. While this could find a closer target faster in some cases, it requires careful boundary checking and doesn't improve worst-case complexity. The simple linear scan is cleaner and less error-prone.

4. **Assuming sorted array**: The problem doesn't state the array is sorted, so binary search or other sorted-array techniques don't apply. Always check array properties before choosing an approach.

## When You'll See This Pattern

This problem exemplifies the **linear scan with condition checking** pattern, which appears in many array problems:

1. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Scan array marking seen numbers, similar to checking each element against a condition.
2. **Find the Duplicate Number (LeetCode 287)**: While more complex, it involves scanning and comparing array elements.
3. **Find All Duplicates in an Array (LeetCode 442)**: Scan and track occurrences, similar to our target matching logic.

The core pattern is: iterate through collection, apply condition to each element, track some metric (minimum, count, etc.). Recognizing this allows you to quickly implement solutions for many "easy" array problems.

## Key Takeaways

1. **Simple problems often have simple solutions**: Don't overcomplicate. A linear scan is perfectly acceptable for O(n) problems with no additional constraints.

2. **Early exit optimization**: When you find an optimal result (like distance = 0), you can break early. This doesn't change big-O but shows good algorithmic thinking.

3. **Absolute distance is fundamental**: Many problems involve distance calculations between indices or positions. Remember that `abs(a - b)` gives the non-negative distance regardless of order.

[Practice this problem on CodeJeet](/problem/minimum-distance-to-the-target-element)
