---
title: "How to Solve 3Sum Closest — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 3Sum Closest. Medium difficulty, 48.1% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-06-15"
category: "dsa-patterns"
tags: ["3sum-closest", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve 3Sum Closest

The 3Sum Closest problem asks us to find three numbers in an array whose sum is as close as possible to a given target value. While similar to the classic 3Sum problem, the twist here is that we're not looking for an exact match to zero, but rather the closest possible sum to an arbitrary target. This makes the problem interesting because we need to track the "closest" sum throughout our search, not just find an exact match.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `nums = [-1, 2, 1, -4]` and `target = 1`.

**Step 1: Sort the array**
First, we sort the array: `[-4, -1, 1, 2]`. Sorting is crucial because it allows us to use the two-pointer technique effectively.

**Step 2: Initialize closest sum**
We'll start with the sum of the first three numbers: `-4 + (-1) + 1 = -4`. Since this is our first candidate, it's currently the closest to target 1.

**Step 3: Iterate with fixed pointer**
We'll fix each element as our first number and use two pointers to find the other two:

- **First iteration (i=0, fixed = -4):**
  - Left pointer at index 1 (value -1), right pointer at index 3 (value 2)
  - Current sum = -4 + (-1) + 2 = -3
  - Distance from target: |1 - (-3)| = 4
  - Our current closest sum (-4) has distance |1 - (-4)| = 5
  - Since 4 < 5, we update closest sum to -3

  Now we need to decide whether to move left or right pointer:
  - Since -3 < 1 (target), we need a larger sum, so we move left pointer right
  - New left pointer at index 2 (value 1), right pointer at index 3 (value 2)
  - Current sum = -4 + 1 + 2 = -1
  - Distance: |1 - (-1)| = 2
  - Current closest sum (-3) has distance 4
  - Since 2 < 4, update closest sum to -1
  - Move left pointer right again (would go past right pointer), so we're done with i=0

- **Second iteration (i=1, fixed = -1):**
  - Left pointer at index 2 (value 1), right pointer at index 3 (value 2)
  - Current sum = -1 + 1 + 2 = 2
  - Distance: |1 - 2| = 1
  - Current closest sum (-1) has distance 2
  - Since 1 < 2, update closest sum to 2

  This sum (2) has distance 1 from target 1, which is the best we can do.

The algorithm continues through all elements, but we've already found our answer: 2.

## Brute Force Approach

The most straightforward approach is to try every possible combination of three numbers. We would use three nested loops to iterate through all triples `(i, j, k)` where `i < j < k`, calculate each sum, and track which one is closest to the target.

**Why this fails:**
For an array of length `n`, there are `n choose 3` = `n(n-1)(n-2)/6` possible triples. This gives us a time complexity of O(n³), which is far too slow for typical constraints where `n` can be up to 1000 or more. With n=1000, we'd need to check about 166 million combinations!

## Optimized Approach

The key insight is that after sorting the array, we can use the two-pointer technique to find the optimal pair for each fixed element in O(n) time instead of O(n²).

**Step-by-step reasoning:**

1. **Sort the array** - This allows us to intelligently move pointers based on whether our current sum is too small or too large relative to the target.
2. **Fix one element** - For each element at index `i`, we'll treat it as the first of our three numbers.
3. **Use two pointers** - Initialize `left = i + 1` and `right = n - 1`. These will search for the other two numbers.
4. **Calculate and compare sums** - For each triple `(i, left, right)`, calculate the sum and compare its distance to the target with our current best.
5. **Move pointers intelligently** - If the sum is less than target, we need a larger sum, so move `left` right. If the sum is greater than target, we need a smaller sum, so move `right` left.
6. **Early exit possibility** - If we ever find a sum exactly equal to the target, we can return immediately since we can't get closer than exact equality.

This approach reduces the time complexity from O(n³) to O(n²) - O(n log n) for sorting plus O(n²) for the two-pointer search.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) - O(n log n) for sorting + O(n²) for two-pointer traversal
# Space: O(1) or O(n) depending on sorting implementation (typically O(n) for Timsort)
def threeSumClosest(nums, target):
    """
    Find three integers in nums whose sum is closest to target.

    Args:
        nums: List of integers
        target: Integer target value

    Returns:
        Integer sum closest to target
    """
    # Step 1: Sort the array to enable two-pointer technique
    nums.sort()

    # Step 2: Initialize closest sum with first three elements
    # We need a starting point for comparison
    closest_sum = nums[0] + nums[1] + nums[2]

    # Step 3: Iterate through each element as the fixed first number
    for i in range(len(nums) - 2):
        # Skip duplicate values for the fixed element to avoid redundant work
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Step 4: Initialize two pointers
        left = i + 1
        right = len(nums) - 1

        # Step 5: Use two-pointer technique to find optimal pair
        while left < right:
            # Calculate current sum of three numbers
            current_sum = nums[i] + nums[left] + nums[right]

            # If we find exact match, return immediately (can't get closer)
            if current_sum == target:
                return current_sum

            # Check if current sum is closer to target than our best so far
            # Compare absolute differences from target
            if abs(current_sum - target) < abs(closest_sum - target):
                closest_sum = current_sum

            # Step 6: Move pointers based on comparison with target
            if current_sum < target:
                # Need a larger sum, move left pointer right
                left += 1
                # Skip duplicates to avoid redundant calculations
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
            else:
                # Need a smaller sum, move right pointer left
                right -= 1
                # Skip duplicates
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1

    return closest_sum
```

```javascript
// Time: O(n²) - O(n log n) for sorting + O(n²) for two-pointer traversal
// Space: O(1) or O(n) depending on sorting implementation
/**
 * Find three integers in nums whose sum is closest to target.
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target value
 * @return {number} Sum closest to target
 */
function threeSumClosest(nums, target) {
  // Step 1: Sort the array to enable two-pointer technique
  nums.sort((a, b) => a - b);

  // Step 2: Initialize closest sum with first three elements
  let closestSum = nums[0] + nums[1] + nums[2];

  // Step 3: Iterate through each element as the fixed first number
  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicate values for the fixed element
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    // Step 4: Initialize two pointers
    let left = i + 1;
    let right = nums.length - 1;

    // Step 5: Use two-pointer technique to find optimal pair
    while (left < right) {
      // Calculate current sum of three numbers
      const currentSum = nums[i] + nums[left] + nums[right];

      // If exact match found, return immediately
      if (currentSum === target) {
        return currentSum;
      }

      // Check if current sum is closer to target
      if (Math.abs(currentSum - target) < Math.abs(closestSum - target)) {
        closestSum = currentSum;
      }

      // Step 6: Move pointers based on comparison with target
      if (currentSum < target) {
        // Need larger sum, move left pointer right
        left++;
        // Skip duplicates
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
      } else {
        // Need smaller sum, move right pointer left
        right--;
        // Skip duplicates
        while (left < right && nums[right] === nums[right + 1]) {
          right--;
        }
      }
    }
  }

  return closestSum;
}
```

```java
// Time: O(n²) - O(n log n) for sorting + O(n²) for two-pointer traversal
// Space: O(1) or O(n) depending on sorting implementation
class Solution {
    /**
     * Find three integers in nums whose sum is closest to target.
     * @param nums Array of integers
     * @param target Target value
     * @return Sum closest to target
     */
    public int threeSumClosest(int[] nums, int target) {
        // Step 1: Sort the array to enable two-pointer technique
        Arrays.sort(nums);

        // Step 2: Initialize closest sum with first three elements
        int closestSum = nums[0] + nums[1] + nums[2];

        // Step 3: Iterate through each element as the fixed first number
        for (int i = 0; i < nums.length - 2; i++) {
            // Skip duplicate values for the fixed element
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            // Step 4: Initialize two pointers
            int left = i + 1;
            int right = nums.length - 1;

            // Step 5: Use two-pointer technique to find optimal pair
            while (left < right) {
                // Calculate current sum of three numbers
                int currentSum = nums[i] + nums[left] + nums[right];

                // If exact match found, return immediately
                if (currentSum == target) {
                    return currentSum;
                }

                // Check if current sum is closer to target
                if (Math.abs(currentSum - target) < Math.abs(closestSum - target)) {
                    closestSum = currentSum;
                }

                // Step 6: Move pointers based on comparison with target
                if (currentSum < target) {
                    // Need larger sum, move left pointer right
                    left++;
                    // Skip duplicates
                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                } else {
                    // Need smaller sum, move right pointer left
                    right--;
                    // Skip duplicates
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                }
            }
        }

        return closestSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting takes O(n log n) time
- The main algorithm has an outer loop that runs O(n) times (for each fixed element)
- For each fixed element, the two-pointer inner loop runs O(n) times in the worst case
- Total: O(n log n) + O(n²) = O(n²) since n² dominates n log n for large n

**Space Complexity: O(1) or O(n)**

- If we consider the input array as given and don't count it toward space complexity, then we use only O(1) extra space for pointers and variables
- However, some sorting algorithms (like the Timsort used in Python) require O(n) space
- In practice, we typically say O(1) or O(n) depending on the sorting implementation

## Common Mistakes

1. **Not sorting the array first**: This is the most critical step. Without sorting, the two-pointer technique doesn't work because we can't make intelligent decisions about which pointer to move.

2. **Forgetting to handle duplicates**: While not strictly necessary for correctness, skipping duplicates when the fixed element or pointers have the same value as previous iterations can significantly improve performance and avoid redundant calculations.

3. **Incorrect pointer movement logic**: A common error is moving the wrong pointer based on the comparison with target. Remember: if sum < target, we need a larger sum, so move left pointer right (toward larger values). If sum > target, we need a smaller sum, so move right pointer left (toward smaller values).

4. **Not initializing closest_sum properly**: Some candidates initialize closest_sum to 0 or a very large number. The safest approach is to initialize it with the sum of the first three elements, as this gives us a valid starting point for comparison.

## When You'll See This Pattern

The two-pointer technique on a sorted array is a powerful pattern that appears in many problems:

1. **3Sum (LeetCode 15)**: Almost identical to this problem but looking for exact sum of zero. The same sorting + two-pointer approach works perfectly.

2. **3Sum Smaller (LeetCode 259)**: Counts the number of triplets with sum less than target. Uses the same sorted two-pointer approach with a different counting mechanism.

3. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: The simpler version with two numbers instead of three. Once you understand the pattern here, that problem becomes trivial.

4. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward from both ends, though with different movement criteria based on heights.

## Key Takeaways

1. **Sorting enables two-pointer optimization**: When you need to find combinations that satisfy some condition involving sums or comparisons, sorting the array first often allows O(n²) solutions instead of O(n³).

2. **Fixed element + two pointers pattern**: For "k-sum" problems where k > 2, you can often fix the first k-2 elements and use two pointers for the remaining two, reducing the problem complexity by one dimension.

3. **Absolute difference for "closest" problems**: When finding the "closest" value to a target, track the minimum absolute difference, not the minimum signed difference. The absolute value tells you how far you are from the target regardless of direction.

Related problems: [3Sum](/problem/3sum), [3Sum Smaller](/problem/3sum-smaller)
