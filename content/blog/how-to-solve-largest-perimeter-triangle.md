---
title: "How to Solve Largest Perimeter Triangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Perimeter Triangle. Easy difficulty, 62.0% acceptance rate. Topics: Array, Math, Greedy, Sorting."
date: "2027-07-14"
category: "dsa-patterns"
tags: ["largest-perimeter-triangle", "array", "math", "greedy", "easy"]
---

# How to Solve Largest Perimeter Triangle

You're given an array of integers representing side lengths, and you need to find the maximum perimeter of a triangle that can be formed using three of these lengths. The triangle must have non-zero area, which means it must satisfy the triangle inequality: for sides a ≤ b ≤ c, we need a + b > c. This problem is interesting because it looks like it requires checking all combinations, but a simple sorting trick makes it efficient.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 6, 2, 3]`

**Step 1: Sort the array**
Sorted: `[2, 3, 3, 6]` (ascending order)

**Step 2: Check from the largest elements**
We want the largest perimeter, so we should try the largest numbers first. Starting from the end:

- Check indices 1, 2, 3 (values 3, 3, 6): 3 + 3 = 6, which is NOT > 6. Invalid triangle.
- Move left: Check indices 0, 2, 3 (values 2, 3, 6): 2 + 3 = 5, which is NOT > 6. Invalid triangle.
- Move left: Check indices 0, 1, 2 (values 2, 3, 3): 2 + 3 = 5, which IS > 3. Valid triangle!

**Step 3: Calculate perimeter**
Perimeter = 2 + 3 + 3 = 8

The key insight: Once we sort, we only need to check consecutive triplets from the end. If `nums[i] + nums[i+1] > nums[i+2]` for sorted array, we've found a valid triangle. We check from largest to smallest because we want the maximum perimeter.

## Brute Force Approach

A naive approach would check all possible combinations of three sides. For each combination, we would:

1. Check if they satisfy the triangle inequality
2. Calculate the perimeter if valid
3. Track the maximum perimeter found

This requires checking C(n, 3) = n(n-1)(n-2)/6 combinations, which is O(n³) time complexity. For an array of size 1000, that's about 166 million checks - far too slow.

Even if we sort first and then check all combinations, we're still looking at O(n³) in the worst case. The brute force approach doesn't leverage the mathematical property that allows us to find the solution more efficiently.

## Optimal Solution

The optimal solution uses sorting and a greedy approach. After sorting the array in ascending order, we iterate from the end, checking if three consecutive elements can form a triangle. The reasoning: if we have sorted sides a ≤ b ≤ c, the triangle inequality reduces to checking if a + b > c. Since we want the largest perimeter, we check from the largest elements downward.

Why does checking consecutive elements work? For sorted array, if `nums[i] + nums[i+1] > nums[i+2]`, then for any j < i, `nums[j] + nums[i+1] ≤ nums[i] + nums[i+1]`, so if the inequality fails at position i, it will also fail for any smaller i. This allows us to find the largest valid triangle efficiently.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def largestPerimeter(nums):
    """
    Find the largest perimeter of a triangle that can be formed from three sides in nums.

    Steps:
    1. Sort the array in ascending order
    2. Iterate from the end, checking three consecutive elements
    3. If a valid triangle is found, return the perimeter
    4. If no valid triangle found, return 0
    """
    # Step 1: Sort the array - O(n log n)
    # Sorting allows us to easily check the triangle inequality
    nums.sort()

    # Step 2: Iterate from the third last element down to the beginning
    # We need at least 3 elements, so we start from len(nums)-3
    for i in range(len(nums) - 3, -1, -1):
        # Step 3: Check triangle inequality for three consecutive elements
        # For sorted sides a, b, c (where a <= b <= c),
        # triangle inequality reduces to: a + b > c
        a, b, c = nums[i], nums[i + 1], nums[i + 2]

        # If a + b > c, we have a valid triangle
        # Since we're iterating from largest to smallest,
        # the first valid triangle we find will have the largest perimeter
        if a + b > c:
            # Step 4: Return the perimeter of this triangle
            return a + b + c

    # Step 5: If no valid triangle found, return 0
    return 0
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function largestPerimeter(nums) {
  /**
   * Find the largest perimeter of a triangle that can be formed from three sides in nums.
   *
   * Steps:
   * 1. Sort the array in ascending order
   * 2. Iterate from the end, checking three consecutive elements
   * 3. If a valid triangle is found, return the perimeter
   * 4. If no valid triangle found, return 0
   */

  // Step 1: Sort the array - O(n log n)
  // Using comparator (a, b) => a - b for numerical sort
  nums.sort((a, b) => a - b);

  // Step 2: Iterate from the third last element down to the beginning
  // We need at least 3 elements, so we start from nums.length - 3
  for (let i = nums.length - 3; i >= 0; i--) {
    // Step 3: Check triangle inequality for three consecutive elements
    // For sorted sides a, b, c (where a <= b <= c),
    // triangle inequality reduces to: a + b > c
    const a = nums[i];
    const b = nums[i + 1];
    const c = nums[i + 2];

    // If a + b > c, we have a valid triangle
    // Since we're iterating from largest to smallest,
    // the first valid triangle we find will have the largest perimeter
    if (a + b > c) {
      // Step 4: Return the perimeter of this triangle
      return a + b + c;
    }
  }

  // Step 5: If no valid triangle found, return 0
  return 0;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int largestPerimeter(int[] nums) {
        /**
         * Find the largest perimeter of a triangle that can be formed from three sides in nums.
         *
         * Steps:
         * 1. Sort the array in ascending order
         * 2. Iterate from the end, checking three consecutive elements
         * 3. If a valid triangle is found, return the perimeter
         * 4. If no valid triangle found, return 0
         */

        // Step 1: Sort the array - O(n log n)
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(nums);

        // Step 2: Iterate from the third last element down to the beginning
        // We need at least 3 elements, so we start from nums.length - 3
        for (int i = nums.length - 3; i >= 0; i--) {
            // Step 3: Check triangle inequality for three consecutive elements
            // For sorted sides a, b, c (where a <= b <= c),
            // triangle inequality reduces to: a + b > c
            int a = nums[i];
            int b = nums[i + 1];
            int c = nums[i + 2];

            // If a + b > c, we have a valid triangle
            // Since we're iterating from largest to smallest,
            // the first valid triangle we find will have the largest perimeter
            if (a + b > c) {
                // Step 4: Return the perimeter of this triangle
                return a + b + c;
            }
        }

        // Step 5: If no valid triangle found, return 0
        return 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array dominates the time complexity at O(n log n)
- The single pass through the array after sorting is O(n)
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- If the sorting algorithm is in-place (like Python's Timsort or Java's Arrays.sort for primitives), space is O(1)
- If the sorting algorithm uses additional space (like merge sort), space is O(n)
- The rest of the algorithm uses only constant extra space for variables

## Common Mistakes

1. **Not sorting the array first**: Some candidates try to find the three largest numbers without sorting, but this doesn't guarantee they can form a triangle. The three largest numbers might not satisfy the triangle inequality (e.g., [10, 2, 1, 100] - 100, 10, 2 cannot form a triangle).

2. **Checking non-consecutive elements after sorting**: After sorting, you only need to check consecutive triplets when searching from the end. Checking non-consecutive elements is unnecessary and inefficient. If `nums[i] + nums[i+1] > nums[i+2]` fails, then for any j < i, `nums[j] + nums[i+1] ≤ nums[i] + nums[i+1]`, so it will also fail.

3. **Incorrect triangle inequality check**: Remember that for sorted sides a ≤ b ≤ c, you only need to check a + b > c. The other two inequalities (a + c > b and b + c > a) are automatically true when the array is sorted.

4. **Forgetting to handle small arrays**: Always consider edge cases. If the array has fewer than 3 elements, you should return 0 immediately. Our solution handles this implicitly since the loop won't execute if length < 3.

## When You'll See This Pattern

This problem uses a **greedy approach with sorting** - a common pattern where:

1. You sort the input to bring order to the problem
2. You make locally optimal choices (checking from largest to smallest)
3. This leads to a globally optimal solution

Similar problems that use this pattern:

1. **Assign Cookies (Easy)**: Sort both the greed factors and cookie sizes, then use a two-pointer approach to maximize matches - similar greedy sorting approach.

2. **Array Partition I (Easy)**: Sort the array and take every other element to maximize the sum of min pairs - uses sorting to create optimal pairings.

3. **Boats to Save People (Medium)**: Sort people by weight and use two pointers from both ends to minimize boats - another greedy sorting solution.

## Key Takeaways

1. **Sorting simplifies inequality checks**: When a problem involves comparing elements to satisfy inequalities (like triangle inequality), sorting often reveals a simpler structure that makes the solution more efficient.

2. **Greedy from the end for maximum values**: When looking for maximum sum/area/perimeter, checking from the largest values downward (after sorting) is often optimal and efficient.

3. **Consecutive checks suffice for sorted arrays**: In sorted order, many problems only require checking adjacent or consecutive elements rather than all combinations, dramatically reducing complexity from O(n³) to O(n log n).

Related problems: [Largest Triangle Area](/problem/largest-triangle-area)
