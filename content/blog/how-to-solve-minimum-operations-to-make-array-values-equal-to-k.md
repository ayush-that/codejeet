---
title: "How to Solve Minimum Operations to Make Array Values Equal to K — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Array Values Equal to K. Easy difficulty, 73.3% acceptance rate. Topics: Array, Hash Table."
date: "2026-06-07"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-array-values-equal-to-k", "array", "hash-table", "easy"]
---

# How to Solve Minimum Operations to Make Array Values Equal to K

This problem asks us to find the minimum number of operations to make all values in an array equal to a target value `k`, where each operation can decrease any element by 1. The tricky part is understanding that we can only decrease values, not increase them, and that we need to handle elements that are already below `k` differently.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 1, 5, 3]` and `k = 2`.

**Step 1:** Identify which elements need operations

- Elements greater than `k`: 3, 5, and 3 (three elements)
- Elements less than `k`: 1 (one element)
- Elements equal to `k`: none

**Step 2:** Understand the operation constraints
We can only decrease elements, not increase them. This means:

- Elements greater than `k`: We can decrease them to `k` (each requires `nums[i] - k` operations)
- Elements less than `k`: We cannot increase them to `k`, so these make the goal impossible
- Elements equal to `k`: Already correct, need 0 operations

**Step 3:** Calculate for our example

- Element 3 → 2: needs 1 operation (3 - 2 = 1)
- Element 1 → 2: impossible (1 < 2, can't increase)
- Element 5 → 2: needs 3 operations (5 - 2 = 3)
- Element 3 → 2: needs 1 operation (3 - 2 = 1)

Since we have element 1 which is less than `k`, the entire task is impossible. The answer should be -1.

**Step 4:** Try a valid example: `nums = [4, 3, 5, 3]`, `k = 2`

- All elements are ≥ k: 4, 3, 5, 3
- Operations needed: (4-2) + (3-2) + (5-2) + (3-2) = 2 + 1 + 3 + 1 = 7

The minimum operations is simply the sum of differences for all elements ≥ k.

## Brute Force Approach

A naive approach would be to:

1. Check each element to see if it's less than `k` (if yes, return -1)
2. Otherwise, sum up `nums[i] - k` for all elements

This is actually already optimal! The "brute force" here is just doing exactly what the problem asks without any unnecessary steps. However, let's consider what a less experienced candidate might try:

**Inefficient approach:** Some might try to simulate each operation one by one, repeatedly finding the maximum element and decreasing it until all elements equal `k`. This would be O(max(nums) \* n) time, which is extremely inefficient for large values.

**Why the simple approach works:** Since we can only decrease values and each decrease operation affects exactly one element, the minimum operations is simply the sum of how much we need to decrease each element that's above `k`. If any element is below `k`, we can't fix it, so the answer is -1.

## Optimal Solution

The optimal solution is straightforward:

1. Initialize a counter for total operations
2. Iterate through each number in the array
3. If any number is less than `k`, return -1 immediately
4. Otherwise, add `num - k` to the operations counter
5. Return the total operations

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums, k):
    """
    Calculate minimum operations to make all array values equal to k.

    Args:
        nums: List of integers
        k: Target value

    Returns:
        Minimum operations needed, or -1 if impossible
    """
    total_operations = 0

    # Step 1: Iterate through all numbers in the array
    for num in nums:
        # Step 2: Check if any number is less than k
        # If yes, we cannot increase it (only decrease operations allowed)
        if num < k:
            return -1

        # Step 3: Add the difference between current number and k
        # This represents how many decrease operations we need for this element
        total_operations += num - k

    # Step 4: Return the total operations needed
    return total_operations
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum operations to make all array values equal to k.
 *
 * @param {number[]} nums - Array of integers
 * @param {number} k - Target value
 * @return {number} Minimum operations needed, or -1 if impossible
 */
function minOperations(nums, k) {
  let totalOperations = 0;

  // Step 1: Iterate through all numbers in the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Step 2: Check if any number is less than k
    // If yes, we cannot increase it (only decrease operations allowed)
    if (num < k) {
      return -1;
    }

    // Step 3: Add the difference between current number and k
    // This represents how many decrease operations we need for this element
    totalOperations += num - k;
  }

  // Step 4: Return the total operations needed
  return totalOperations;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate minimum operations to make all array values equal to k.
     *
     * @param nums Array of integers
     * @param k Target value
     * @return Minimum operations needed, or -1 if impossible
     */
    public int minOperations(int[] nums, int k) {
        int totalOperations = 0;

        // Step 1: Iterate through all numbers in the array
        for (int num : nums) {
            // Step 2: Check if any number is less than k
            // If yes, we cannot increase it (only decrease operations allowed)
            if (num < k) {
                return -1;
            }

            // Step 3: Add the difference between current number and k
            // This represents how many decrease operations we need for this element
            totalOperations += num - k;
        }

        // Step 4: Return the total operations needed
        return totalOperations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element
- The loop runs exactly n times, where n is the length of the input array
- Even in the worst case where we return -1 early, we still have O(n) complexity

**Space Complexity:** O(1)

- We only use a few integer variables (`totalOperations`)
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Forgetting to check for elements less than k:** This is the most common mistake. Candidates might simply sum up differences without checking if any element is below k. Remember: we can only decrease values, not increase them.

2. **Using the wrong operation direction:** Some candidates might try to calculate absolute differences `abs(num - k)` instead of just `num - k`. This would incorrectly count operations for elements below k as positive when they're actually impossible to fix.

3. **Integer overflow with large values:** While not common in this problem, if the array contains very large numbers and k is very small, the sum `num - k` could overflow. In practice, LeetCode constraints usually prevent this, but it's good to be aware.

4. **Early return optimization oversight:** The most efficient implementation returns -1 as soon as it finds any element less than k. Some candidates continue processing the entire array before checking, which is less efficient (though still O(n)).

## When You'll See This Pattern

This problem uses a **linear scan with conditional accumulation** pattern, which appears in many array processing problems:

1. **Minimum Moves to Equal Array Elements (LeetCode 453):** Similar concept but with increment operations instead of decrement operations. The solution involves finding the minimum element and calculating differences.

2. **Minimum Moves to Equal Array Elements II (LeetCode 462):** Uses median finding to minimize moves where you can increment or decrement elements. More complex but uses similar difference calculation.

3. **Minimum Operations to Reduce X to Zero (LeetCode 1658):** Different constraints but similar in requiring careful operation counting with specific rules.

The core pattern is: when operations have a specific direction (only increase or only decrease), you often need to check if the target is reachable given the constraints, then calculate the sum of directed differences.

## Key Takeaways

1. **Direction matters in operation problems:** When you can only perform operations in one direction (increase or decrease), check early if the target is reachable. Elements on the "wrong side" of the target make the problem impossible.

2. **Simple problems often have simple solutions:** Don't overcomplicate! This problem looks like it might need complex algorithms, but the optimal solution is just a single pass with basic arithmetic.

3. **Read constraints carefully:** The key insight comes from understanding that operations can only decrease values. This immediately tells us that any element below k makes the task impossible.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-make-array-values-equal-to-k)
