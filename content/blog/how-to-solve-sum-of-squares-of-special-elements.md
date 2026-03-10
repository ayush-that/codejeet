---
title: "How to Solve Sum of Squares of Special Elements  — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Squares of Special Elements . Easy difficulty, 81.9% acceptance rate. Topics: Array, Enumeration."
date: "2027-06-21"
category: "dsa-patterns"
tags: ["sum-of-squares-of-special-elements", "array", "enumeration", "easy"]
---

# How to Solve Sum of Squares of Special Elements

This problem asks us to find all positions in a 1-indexed array where the index divides the array length, then sum the squares of the elements at those positions. While conceptually straightforward, the 1-indexing and the mathematical condition make this an excellent test of attention to detail and basic array traversal skills. The challenge lies in correctly handling the indexing and understanding the mathematical relationship between positions and array length.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [1, 2, 3, 4, 5, 6]` with length `n = 6`.

We need to find all indices `i` (1-indexed) where `6 % i == 0`:

- `i = 1`: `6 % 1 = 0` ✓ (element: 1)
- `i = 2`: `6 % 2 = 0` ✓ (element: 2)
- `i = 3`: `6 % 3 = 0` ✓ (element: 3)
- `i = 4`: `6 % 4 = 2` ✗
- `i = 5`: `6 % 5 = 1` ✗
- `i = 6`: `6 % 6 = 0` ✓ (element: 6)

Special elements are at positions 1, 2, 3, and 6 with values 1, 2, 3, and 6.

Sum of squares = `1² + 2² + 3² + 6² = 1 + 4 + 9 + 36 = 50`

Notice that we're checking divisibility between the index (1-indexed) and the array length, not between the index and the element value. This is a common point of confusion.

## Brute Force Approach

The brute force approach is actually optimal for this problem since we must examine every element to determine if it's special. However, let's consider what a truly naive approach might look like and why certain alternatives don't work.

A naive candidate might:

1. Misunderstand the problem and check if the element value divides `n` instead of the index
2. Try to precompute all divisors of `n` separately (which adds unnecessary complexity)
3. Use 0-indexing incorrectly

The straightforward solution is simply to iterate through the array, check the divisibility condition for each 1-indexed position, and accumulate the squares of qualifying elements. Since we must check every element anyway, this O(n) approach is optimal.

## Optimal Solution

The optimal solution directly implements the problem statement: iterate through the array, convert 0-based indices to 1-based, check if `n % (i+1) == 0`, and if true, add the square of the current element to a running total.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def sumOfSquares(nums):
    """
    Calculate the sum of squares of all special elements.
    A special element is one where its 1-indexed position divides the array length.

    Args:
        nums: List[int] - The input array

    Returns:
        int - Sum of squares of special elements
    """
    n = len(nums)  # Get the length of the array
    total = 0  # Initialize sum of squares

    # Iterate through all elements in the array
    for i in range(n):
        # Convert 0-based index to 1-based by adding 1
        # Check if n is divisible by the 1-based index
        if n % (i + 1) == 0:
            # Add the square of the current element to total
            total += nums[i] * nums[i]

    return total
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the sum of squares of all special elements.
 * A special element is one where its 1-indexed position divides the array length.
 *
 * @param {number[]} nums - The input array
 * @return {number} - Sum of squares of special elements
 */
function sumOfSquares(nums) {
  const n = nums.length; // Get the length of the array
  let total = 0; // Initialize sum of squares

  // Iterate through all elements in the array
  for (let i = 0; i < n; i++) {
    // Convert 0-based index to 1-based by adding 1
    // Check if n is divisible by the 1-based index
    if (n % (i + 1) === 0) {
      // Add the square of the current element to total
      total += nums[i] * nums[i];
    }
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate the sum of squares of all special elements.
     * A special element is one where its 1-indexed position divides the array length.
     *
     * @param nums - The input array
     * @return Sum of squares of special elements
     */
    public int sumOfSquares(int[] nums) {
        int n = nums.length;  // Get the length of the array
        int total = 0;  // Initialize sum of squares

        // Iterate through all elements in the array
        for (int i = 0; i < n; i++) {
            // Convert 0-based index to 1-based by adding 1
            // Check if n is divisible by the 1-based index
            if (n % (i + 1) == 0) {
                // Add the square of the current element to total
                total += nums[i] * nums[i];
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations (modulo check and multiplication) for each of the `n` elements.
- The modulo operation `n % (i+1)` is O(1) for integers within typical bounds.

**Space Complexity: O(1)**

- We only use a constant amount of extra space: variables `n`, `total`, and the loop index.
- The input array is not modified, and no additional data structures are created.

## Common Mistakes

1. **0-indexing vs 1-indexing confusion**: The most common error is forgetting to convert from 0-based indexing (used in programming languages) to 1-based indexing (used in the problem statement). Always remember to add 1 to the loop index when checking the condition.

2. **Checking the wrong condition**: Some candidates check `(i+1) % n == 0` instead of `n % (i+1) == 0`. Remember we want indices that divide `n`, not indices that are divisible by `n`.

3. **Checking element value instead of index**: Another common mistake is checking `n % nums[i] == 0` instead of `n % (i+1) == 0`. The condition applies to the position, not the value at that position.

4. **Integer overflow with large squares**: While not an issue in Python (which handles big integers automatically), in Java and JavaScript, squaring large numbers could cause overflow. However, given typical constraints, this is unlikely to be a problem for this easy-level question.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Array traversal with conditional accumulation**: Similar to problems like "Sum of All Odd Length Subarrays" where you traverse an array and selectively accumulate values based on a condition.

2. **Divisor-based filtering**: The core logic of checking divisibility appears in problems like:
   - "Self Dividing Numbers" - Check if a number is divisible by all its digits
   - "Perfect Number" - Find divisors of a number and sum them
   - "Count Primes" - Use divisibility to identify prime numbers

3. **Mathematical array processing**: Problems that require applying mathematical operations to array elements based on their positions, such as "Product of Array Except Self" or "Find N Unique Integers Sum Up to Zero".

## Key Takeaways

1. **Always clarify indexing conventions**: When a problem uses 1-indexing but your programming language uses 0-indexing, explicitly document the conversion in your code comments and be consistent throughout your solution.

2. **Read conditions carefully**: Distinguish between operations on array indices versus array values. Underline key phrases in the problem statement to avoid confusion.

3. **Simple problems test attention to detail**: Even "easy" problems can trip you up if you don't pay attention to the specifics of the problem statement. Take an extra moment to verify you're implementing exactly what's asked.

Related problems: [Sum of Square Numbers](/problem/sum-of-square-numbers), [Sum of All Odd Length Subarrays](/problem/sum-of-all-odd-length-subarrays)
