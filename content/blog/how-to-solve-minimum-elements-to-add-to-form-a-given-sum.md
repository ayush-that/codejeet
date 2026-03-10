---
title: "How to Solve Minimum Elements to Add to Form a Given Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Elements to Add to Form a Given Sum. Medium difficulty, 45.0% acceptance rate. Topics: Array, Greedy."
date: "2029-06-29"
category: "dsa-patterns"
tags: ["minimum-elements-to-add-to-form-a-given-sum", "array", "greedy", "medium"]
---

# How to Solve Minimum Elements to Add to Form a Given Sum

You need to add elements to an array so its sum equals a target `goal`, with each added element's absolute value bounded by `limit`. The challenge is determining the minimum number of elements to add—this isn't about finding specific elements, but calculating how many bounded-value increments are needed to close the gap between the current sum and the goal.

## Visual Walkthrough

Let's walk through an example:  
`nums = [1, -2, 3]`, `limit = 4`, `goal = 10`

**Step 1: Calculate current sum**  
Sum = 1 + (-2) + 3 = 2

**Step 2: Find the difference needed**  
Difference = goal - current_sum = 10 - 2 = 8  
We need to add a total of 8 to the array.

**Step 3: Determine maximum contribution per element**  
Each added element can have absolute value ≤ limit = 4.  
The maximum positive contribution per element is +4.  
The maximum negative contribution per element is -4.

**Step 4: Calculate minimum elements needed**  
Since we need to add +8 total, and each element can contribute at most +4:  
Minimum elements = ceil(8 / 4) = ceil(2) = 2

**Why ceil?**  
If we needed 9 instead of 8: ceil(9 / 4) = ceil(2.25) = 3 elements  
We can't add fractional elements, so we always round up.

**Step 5: Verify with possible additions**  
We could add [4, 4] → total added = 8 → new sum = 2 + 8 = 10 ✓  
Or [3, 5] isn't allowed (5 > limit)  
Or [4, 3, 1] uses 3 elements (not minimal)

The key insight: This is essentially dividing the difference by the maximum step size and rounding up.

## Brute Force Approach

A naive approach might try to simulate adding elements one by one:

1. Calculate current sum
2. While sum ≠ goal:
   - Determine how much to add (difference between sum and goal)
   - Add the maximum possible value (limit) if difference > 0, or -limit if difference < 0
   - Count each addition
3. Return the count

This approach would work but is inefficient for large differences. For example, if difference = 10^9 and limit = 1, we'd need 10^9 iterations. The time complexity would be O(difference/limit), which can be enormous.

More importantly, we don't actually need to simulate—we can compute the answer directly with arithmetic.

## Optimized Approach

The optimal solution uses simple mathematical reasoning:

1. **Calculate the current sum** of the array
2. **Find the absolute difference** between the current sum and the goal  
   `diff = abs(goal - current_sum)`
3. **Divide by the limit** to find how many maximum-sized steps we need  
   `steps = diff / limit`
4. **Round up** because we can't add fractional elements  
   Use integer math: `(diff + limit - 1) // limit`

**Why this works:**

- Each added element can change the sum by at most `limit` (positive or negative)
- To minimize the number of elements, we should use the maximum possible value each time
- The last element might be smaller than limit if the difference isn't a multiple of limit
- The absolute value ensures we handle both positive and negative differences correctly

**Edge cases:**

- If diff = 0, we need 0 elements
- If limit = 0 (only possible if all nums are 0), we can't add any elements unless goal equals current sum
- Large numbers that could cause integer overflow (use 64-bit integers)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(nums) to calculate sum
# Space: O(1) - only using constant extra space
def minElements(nums, limit, goal):
    """
    Calculate minimum elements to add to reach goal.

    Args:
        nums: List of integers with |nums[i]| <= limit
        limit: Maximum absolute value for added elements
        goal: Target sum to achieve

    Returns:
        Minimum number of elements to add
    """
    # Step 1: Calculate current sum of the array
    # We use Python's built-in sum() which handles large integers
    current_sum = sum(nums)

    # Step 2: Calculate absolute difference needed
    # Use abs() because we can add positive or negative elements
    diff = abs(goal - current_sum)

    # Step 3: Calculate minimum elements needed
    # (diff + limit - 1) // limit gives ceil(diff / limit)
    # This handles the case where diff is not divisible by limit
    # If diff == 0, this formula gives 0 as expected
    min_elements = (diff + limit - 1) // limit

    return min_elements
```

```javascript
// Time: O(n) where n = nums.length to calculate sum
// Space: O(1) - only using constant extra space
function minElements(nums, limit, goal) {
  /**
   * Calculate minimum elements to add to reach goal.
   *
   * @param {number[]} nums - Array of integers with |nums[i]| <= limit
   * @param {number} limit - Maximum absolute value for added elements
   * @param {number} goal - Target sum to achieve
   * @return {number} Minimum number of elements to add
   */

  // Step 1: Calculate current sum of the array
  // Use reduce to sum all elements, starting from 0
  const currentSum = nums.reduce((sum, num) => sum + num, 0);

  // Step 2: Calculate absolute difference needed
  // Math.abs handles both positive and negative differences
  const diff = Math.abs(goal - currentSum);

  // Step 3: Calculate minimum elements needed
  // Math.ceil gives us the ceiling of diff / limit
  // Handle diff = 0 case: Math.ceil(0) = 0
  const minElements = Math.ceil(diff / limit);

  return minElements;
}
```

```java
// Time: O(n) where n = nums.length to calculate sum
// Space: O(1) - only using constant extra space
class Solution {
    public int minElements(int[] nums, int limit, int goal) {
        /**
         * Calculate minimum elements to add to reach goal.
         *
         * @param nums Array of integers with |nums[i]| <= limit
         * @param limit Maximum absolute value for added elements
         * @param goal Target sum to achieve
         * @return Minimum number of elements to add
         */

        // Step 1: Calculate current sum of the array
        // Use long to prevent integer overflow during summation
        long currentSum = 0;
        for (int num : nums) {
            currentSum += num;
        }

        // Step 2: Calculate absolute difference needed
        // Use Math.abs and long to handle large values
        long diff = Math.abs(goal - currentSum);

        // Step 3: Calculate minimum elements needed
        // (diff + limit - 1) / limit gives ceil(diff / limit) for integers
        // Cast to int at the end since result fits in int constraints
        long minElements = (diff + limit - 1) / limit;

        return (int) minElements;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to calculate the sum of all elements in `nums`, which requires iterating through the entire array once
- The arithmetic operations (absolute value, division, ceiling) are O(1)
- Total: O(n) where n is the length of the input array

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (`current_sum`, `diff`, `min_elements`)
- No additional data structures are created
- The input array is not modified

## Common Mistakes

1. **Forgetting to use absolute value for the difference**  
   If current sum is 5 and goal is 3, we need to add -2 total. The number of elements needed is ceil(|-2|/limit), not ceil(-2/limit). Always take the absolute value first.

2. **Integer overflow when summing large arrays**  
   In Java, using `int` for the sum can overflow if nums has many large values. Always use `long` for intermediate calculations when dealing with potentially large sums.

3. **Incorrect ceiling calculation**  
   Using `diff / limit` with integer division truncates downward. You need `Math.ceil(diff / limit)` in languages with floating-point, or `(diff + limit - 1) / limit` for integer-only math.

4. **Not handling limit = 0 edge case**  
   If limit = 0, division by zero occurs. However, the problem guarantees `abs(nums[i]) <= limit`, so if limit = 0, all nums[i] must be 0. In this case, you can only reach the goal if goal = 0, needing 0 elements. Most solutions handle this since `(diff + 0 - 1) / 0` would throw an error, but the problem constraints likely prevent limit = 0.

## When You'll See This Pattern

This "divide and round up" pattern appears in many optimization problems:

1. **Coin Change (LeetCode 322)** - Similar to finding minimum coins, but here each "coin" has the same maximum value. The greedy approach works here because all "coins" (added elements) have the same "denomination" in terms of maximum contribution.

2. **Minimum Number of Refueling Stops (LeetCode 871)** - While more complex, it also involves making incremental progress toward a goal with bounded steps.

3. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Uses binary search with a similar "can we achieve this with X steps?" verification, though the constraints are different.

The core pattern: When you need to reach a target with uniform maximum step sizes, the minimum steps is simply the ceiling of (distance / step_size).

## Key Takeaways

1. **Recognize when greedy math works** - When all steps have the same maximum size and order doesn't matter, the optimal solution is to take the biggest steps possible.

2. **Convert problems to arithmetic** - Many "minimum elements" problems can be solved by calculating a difference and dividing by a constraint, rather than simulating or searching.

3. **Watch for overflow and edge cases** - Always consider: What if the difference is 0? What if limit is very small? What if numbers are very large? Use appropriate data types (long instead of int) for intermediate calculations.

[Practice this problem on CodeJeet](/problem/minimum-elements-to-add-to-form-a-given-sum)
