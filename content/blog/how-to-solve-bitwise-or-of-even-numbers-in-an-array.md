---
title: "How to Solve Bitwise OR of Even Numbers in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Bitwise OR of Even Numbers in an Array. Easy difficulty, 84.8% acceptance rate. Topics: Array, Bit Manipulation, Simulation."
date: "2028-01-23"
category: "dsa-patterns"
tags: ["bitwise-or-of-even-numbers-in-an-array", "array", "bit-manipulation", "simulation", "easy"]
---

# How to Solve Bitwise OR of Even Numbers in an Array

This problem asks you to compute the bitwise OR of all even numbers in an array. While conceptually straightforward, it's an excellent exercise in understanding bitwise operations and array filtering. The tricky part isn't the algorithm itself but recognizing that you need to handle edge cases properly and understand how bitwise OR accumulates results.

## Visual Walkthrough

Let's trace through the example `nums = [2, 7, 11, 15, 6, 8]`:

1. **Identify even numbers**:
   - 2 is even (binary: 10)
   - 7 is odd → skip
   - 11 is odd → skip
   - 15 is odd → skip
   - 6 is even (binary: 110)
   - 8 is even (binary: 1000)

2. **Initialize result**: Start with 0 (binary: 0000)

3. **Process first even number (2)**:
   - Current result: 0000
   - 2 in binary: 0010
   - Bitwise OR: 0000 | 0010 = 0010 (decimal: 2)

4. **Process second even number (6)**:
   - Current result: 0010
   - 6 in binary: 0110
   - Bitwise OR: 0010 | 0110 = 0110 (decimal: 6)

5. **Process third even number (8)**:
   - Current result: 0110
   - 8 in binary: 1000
   - Bitwise OR: 0110 | 1000 = 1110 (decimal: 14)

6. **Final result**: 14

The key insight: We only need to process even numbers, and we can accumulate the result using the bitwise OR operator. Each even number contributes its set bits to the final result.

## Brute Force Approach

The most straightforward approach is exactly what we visualized:

1. Initialize a result variable to 0
2. Iterate through each number in the array
3. For each number, check if it's even (using `num % 2 == 0`)
4. If it's even, perform bitwise OR with the current result
5. Return the final result

This is actually the optimal approach for this problem! There's no more efficient way to compute the bitwise OR of selected elements than to examine each element once. The "brute force" here is simply the direct implementation of the problem requirements.

However, a truly naive candidate might try to:

1. First collect all even numbers into a separate array
2. Then compute the OR of that array
3. This uses extra space unnecessarily

Or they might forget to handle the edge case where there are no even numbers (should return 0).

## Optimal Solution

The optimal solution is a single-pass approach that filters even numbers on the fly and accumulates the bitwise OR. We use the modulo operator to check for evenness and the bitwise OR operator to combine results.

<div class="code-group">

```python
# Time: O(n) where n is the length of nums
# Space: O(1) - we only use a constant amount of extra space
def bitwise_or_of_even_numbers(nums):
    """
    Compute the bitwise OR of all even numbers in the array.

    Args:
        nums: List of integers

    Returns:
        Integer representing the bitwise OR of all even numbers,
        or 0 if there are no even numbers.
    """
    # Initialize result to 0. This handles the case where
    # there are no even numbers (OR of nothing is 0)
    result = 0

    # Iterate through each number in the array
    for num in nums:
        # Check if the number is even
        # A number is even if it's divisible by 2 (num % 2 == 0)
        if num % 2 == 0:
            # Perform bitwise OR with current result
            # Each even number contributes its set bits to the result
            result |= num

    # Return the accumulated result
    return result
```

```javascript
// Time: O(n) where n is the length of nums
// Space: O(1) - we only use a constant amount of extra space
function bitwiseOrOfEvenNumbers(nums) {
  /**
   * Compute the bitwise OR of all even numbers in the array.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} - Bitwise OR of all even numbers, or 0 if none exist
   */

  // Initialize result to 0. This handles the case where
  // there are no even numbers (OR of nothing is 0)
  let result = 0;

  // Iterate through each number in the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Check if the number is even
    // A number is even if it's divisible by 2 (num % 2 === 0)
    if (num % 2 === 0) {
      // Perform bitwise OR with current result
      // Each even number contributes its set bits to the result
      result |= num;
    }
  }

  // Return the accumulated result
  return result;
}
```

```java
// Time: O(n) where n is the length of nums
// Space: O(1) - we only use a constant amount of extra space
class Solution {
    public int bitwiseOrOfEvenNumbers(int[] nums) {
        /**
         * Compute the bitwise OR of all even numbers in the array.
         *
         * @param nums - Array of integers
         * @return - Bitwise OR of all even numbers, or 0 if none exist
         */

        // Initialize result to 0. This handles the case where
        // there are no even numbers (OR of nothing is 0)
        int result = 0;

        // Iterate through each number in the array
        for (int num : nums) {
            // Check if the number is even
            // A number is even if it's divisible by 2 (num % 2 == 0)
            if (num % 2 == 0) {
                // Perform bitwise OR with current result
                // Each even number contributes its set bits to the result
                result |= num;
            }
        }

        // Return the accumulated result
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, examining each element exactly once
- For each element, we perform a constant-time check (modulo 2) and potentially a constant-time bitwise OR operation
- The time grows linearly with the size of the input array

**Space Complexity: O(1)**

- We only use a fixed amount of extra space: the `result` variable
- No additional data structures are created that scale with input size
- Even if we had many even numbers, we don't store them separately

## Common Mistakes

1. **Forgetting to initialize result to 0**: If you forget to initialize `result`, you'll get undefined behavior. Starting with 0 is correct because:
   - The bitwise OR of nothing is 0
   - 0 OR x = x for any x
   - This automatically handles the "no even numbers" case

2. **Using logical OR (`||`) instead of bitwise OR (`|`)**:
   - Logical OR returns a boolean (true/false)
   - Bitwise OR performs the operation on each bit position
   - Example: `5 || 3` returns `true` (or `1` in some languages), but `5 | 3` returns `7` (binary 101 | 011 = 111)

3. **Incorrect evenness check**:
   - Using `num % 2 == 1` checks for odd numbers (you want even)
   - For negative numbers: `-2 % 2 == 0` is true in most languages, which is correct
   - Alternative: `(num & 1) == 0` uses bitwise AND to check the least significant bit

4. **Creating unnecessary intermediate arrays**:
   - Some candidates first filter all even numbers into a new array
   - This uses O(k) extra space where k is the number of even numbers
   - It's more efficient to process on the fly

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Array filtering with accumulation**: Similar problems include:
   - **Sum of Even Numbers After Queries (LeetCode 985)**: Filter and accumulate based on conditions
   - **Find Numbers with Even Number of Digits (LeetCode 1295)**: Filter based on digit count
   - **Count Negative Numbers in a Sorted Matrix (LeetCode 1351)**: Filter based on value

2. **Bitwise operations with filtering**: Related problems include:
   - **Hamming Distance (LeetCode 461)**: Uses XOR and bit counting
   - **Number of 1 Bits (LeetCode 191)**: Counts set bits using bitwise operations
   - **Single Number (LeetCode 136)**: Uses XOR to find unique elements

The core pattern is: "Process each element, apply a condition, and accumulate results using a specific operation." This appears in many array processing problems.

## Key Takeaways

1. **Bitwise OR properties are useful**: Remember that 0 is the identity element for OR (0 | x = x), and OR accumulates set bits. Once a bit is set to 1, it stays 1 regardless of future operations.

2. **Filter and process in one pass**: When you need to both filter elements and perform an operation on them, you can often do it in a single iteration without creating intermediate collections.

3. **Edge cases matter**: Always consider what happens when there are no elements that meet your condition (empty result). Initializing to the identity element of your operation (0 for OR, 0 for sum, 1 for product) often handles this automatically.

[Practice this problem on CodeJeet](/problem/bitwise-or-of-even-numbers-in-an-array)
