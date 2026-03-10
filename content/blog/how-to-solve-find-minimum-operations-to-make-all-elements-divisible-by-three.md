---
title: "How to Solve Find Minimum Operations to Make All Elements Divisible by Three — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Minimum Operations to Make All Elements Divisible by Three. Easy difficulty, 90.9% acceptance rate. Topics: Array, Math."
date: "2028-03-31"
category: "dsa-patterns"
tags: ["find-minimum-operations-to-make-all-elements-divisible-by-three", "array", "math", "easy"]
---

# How to Solve Find Minimum Operations to Make All Elements Divisible by Three

You're given an array of integers and can increment or decrement any element by 1 in a single operation. Your goal is to make every number divisible by 3 using the minimum total operations. What makes this problem interesting is that while it seems simple, candidates often overcomplicate it by trying to track complex state or use greedy algorithms when a straightforward mathematical observation solves it elegantly.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 2, 5, 8]`.

For each number, we need to find the closest multiple of 3:

- **4**: The multiples of 3 near 4 are 3 and 6. Distance to 3 is 1, distance to 6 is 2. Minimum operations = 1.
- **2**: Multiples are 0 and 3. Distance to 0 is 2, distance to 3 is 1. Minimum operations = 1.
- **5**: Multiples are 3 and 6. Distance to 3 is 2, distance to 6 is 1. Minimum operations = 1.
- **8**: Multiples are 6 and 9. Distance to 6 is 2, distance to 9 is 1. Minimum operations = 1.

Total minimum operations = 1 + 1 + 1 + 1 = 4.

But wait — there's a pattern here. Notice that each number's remainder when divided by 3 determines the operations needed:

- Remainder 0: Already divisible by 3 → 0 operations
- Remainder 1: Can subtract 1 to reach multiple → 1 operation
- Remainder 2: Can add 1 to reach multiple → 1 operation

Let's verify with our example:

- 4 % 3 = 1 → 1 operation
- 2 % 3 = 2 → 1 operation
- 5 % 3 = 2 → 1 operation
- 8 % 3 = 2 → 1 operation

This works perfectly! The key insight is that for any integer `n`, the minimum operations to reach a multiple of 3 is simply `min(n % 3, 3 - (n % 3))`. Since we can only add or subtract 1, we either move backward to the previous multiple (if remainder is 1) or forward to the next multiple (if remainder is 2).

## Brute Force Approach

A naive approach might try to simulate all possible sequences of operations, but that's exponential in the number of elements and clearly infeasible. Another brute force might try to check all possible target multiples for each element, but since each element can independently reach its nearest multiple, there's no need to coordinate targets across elements.

The real "brute force" here would be to manually calculate distances to both neighboring multiples for each element:

1. For each number, find the distance to the floor multiple of 3
2. Find the distance to the ceiling multiple of 3
3. Take the minimum of these two distances
4. Sum across all elements

While this approach would work (O(n) time), it's unnecessarily complex. The remainder-based approach is simpler and more efficient.

## Optimal Solution

The optimal solution uses the mathematical observation we discovered: for any integer `n`, the minimum operations needed is `n % 3` if the remainder is 1 or 2, but wait — that's not quite right. Let's think carefully:

- If `n % 3 == 0`: 0 operations (already divisible)
- If `n % 3 == 1`: 1 operation (subtract 1)
- If `n % 3 == 2`: 1 operation (add 1)

Actually, it's always `n % 3` when remainder is 1, but when remainder is 2, we need `3 - (n % 3)` which equals 1. So we can use `min(remainder, 3 - remainder)`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumOperations(nums):
    """
    Calculate minimum operations to make all elements divisible by 3.

    For each number, we find its remainder when divided by 3.
    - Remainder 0: Already divisible, 0 operations needed
    - Remainder 1: Subtract 1 to reach previous multiple, 1 operation
    - Remainder 2: Add 1 to reach next multiple, 1 operation

    We sum these operations across all elements.
    """
    total_operations = 0

    # Iterate through each number in the array
    for num in nums:
        # Get remainder when divided by 3
        remainder = num % 3

        # If remainder is 0, number is already divisible by 3
        if remainder == 0:
            continue  # No operations needed

        # For remainder 1 or 2, we need exactly 1 operation
        # remainder 1: subtract 1 to reach previous multiple
        # remainder 2: add 1 to reach next multiple
        total_operations += 1

    return total_operations
```

```javascript
// Time: O(n) | Space: O(1)
function minimumOperations(nums) {
  /**
   * Calculate minimum operations to make all elements divisible by 3.
   *
   * For each number, we find its remainder when divided by 3.
   * - Remainder 0: Already divisible, 0 operations needed
   * - Remainder 1: Subtract 1 to reach previous multiple, 1 operation
   * - Remainder 2: Add 1 to reach next multiple, 1 operation
   *
   * We sum these operations across all elements.
   */
  let totalOperations = 0;

  // Iterate through each number in the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Get remainder when divided by 3
    const remainder = num % 3;

    // If remainder is 0, number is already divisible by 3
    if (remainder === 0) {
      continue; // No operations needed
    }

    // For remainder 1 or 2, we need exactly 1 operation
    // remainder 1: subtract 1 to reach previous multiple
    // remainder 2: add 1 to reach next multiple
    totalOperations += 1;
  }

  return totalOperations;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumOperations(int[] nums) {
        /**
         * Calculate minimum operations to make all elements divisible by 3.
         *
         * For each number, we find its remainder when divided by 3.
         * - Remainder 0: Already divisible, 0 operations needed
         * - Remainder 1: Subtract 1 to reach previous multiple, 1 operation
         * - Remainder 2: Add 1 to reach next multiple, 1 operation
         *
         * We sum these operations across all elements.
         */
        int totalOperations = 0;

        // Iterate through each number in the array
        for (int num : nums) {
            // Get remainder when divided by 3
            int remainder = num % 3;

            // If remainder is 0, number is already divisible by 3
            if (remainder == 0) {
                continue;  // No operations needed
            }

            // For remainder 1 or 2, we need exactly 1 operation
            // remainder 1: subtract 1 to reach previous multiple
            // remainder 2: add 1 to reach next multiple
            totalOperations += 1;
        }

        return totalOperations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element.
- The modulo operation `%` and conditional check are both O(1).
- `n` is the length of the input array.

**Space Complexity: O(1)**

- We only use a single integer variable `totalOperations` to accumulate the result.
- No additional data structures are created that scale with input size.
- The input array is given and not counted toward our space usage.

## Common Mistakes

1. **Overcomplicating with multiple target values**: Some candidates try to find a single target multiple that all elements should reach, like in "Minimum Moves to Equal Array Elements." But here, each element can independently reach its nearest multiple of 3 — there's no need for coordination.

2. **Incorrect handling of negative numbers**: The modulo operator behaves differently in some languages with negative numbers. In Python, `-2 % 3 = 1`, while in Java/JavaScript, `-2 % 3 = -2`. Our solution works correctly because we only check if remainder is 0 or not — we don't need the actual remainder value beyond checking if it's zero.

3. **Forgetting about the absolute value**: When calculating distance to multiples, some candidates forget that operations count absolute changes. But since we're only adding/subtracting 1 and checking remainders, this isn't an issue in our approach.

4. **Trying to use dynamic programming or memoization**: This is unnecessary for such a simple problem. Each element's operations are independent of others, so no DP state is needed.

## When You'll See This Pattern

This problem teaches the **remainder classification** pattern, where you group elements by their remainder modulo some number to determine optimal operations. You'll see this pattern in:

1. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: Find minimum moves to make all array elements equal, where a move is incrementing or decrementing an element by 1. The optimal target is the median, and operations are sums of absolute differences.

2. **Minimum Moves to Equal Array Elements (LeetCode 453)**: Make all array elements equal by incrementing n-1 elements by 1. This uses a different mathematical insight about relative differences.

3. **Check If Array Pairs Are Divisible by k (LeetCode 1497)**: Group numbers by remainder modulo k to find complementary pairs.

The key insight is recognizing when operations on individual elements are independent versus when they need coordination toward a common target.

## Key Takeaways

1. **Modular arithmetic simplifies distance calculations**: When dealing with divisibility by k, consider remainders modulo k. The distance to the nearest multiple is `min(remainder, k - remainder)`.

2. **Check for independence first**: Before designing complex coordination logic, verify if elements can be treated independently. Here, each element's path to a multiple of 3 doesn't affect others.

3. **Simple problems often have simple solutions**: If you find yourself reaching for advanced algorithms (DP, graphs, etc.) on an "Easy" problem, reconsider the problem constraints and look for mathematical properties.

Related problems: [Minimum Moves to Equal Array Elements](/problem/minimum-moves-to-equal-array-elements)
