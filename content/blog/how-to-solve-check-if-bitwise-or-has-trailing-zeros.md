---
title: "How to Solve Check if Bitwise OR Has Trailing Zeros — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Bitwise OR Has Trailing Zeros. Easy difficulty, 71.1% acceptance rate. Topics: Array, Bit Manipulation."
date: "2028-08-10"
category: "dsa-patterns"
tags: ["check-if-bitwise-or-has-trailing-zeros", "array", "bit-manipulation", "easy"]
---

# How to Solve "Check if Bitwise OR Has Trailing Zeros"

This problem asks us to determine if we can select **two or more** elements from a given array of positive integers such that the bitwise OR of those selected numbers has at least one trailing zero in its binary representation. While the problem is categorized as "Easy," it requires careful understanding of bitwise operations and binary representation. The tricky part is recognizing that we don't actually need to compute OR combinations—we just need to check a simple property of the numbers.

**Why this problem is interesting**: At first glance, it seems like we might need to check all possible combinations of elements, which would be computationally expensive. However, with bit manipulation insight, we can solve it in linear time with constant space. This is a classic example of how understanding binary properties can turn an apparently complex problem into a simple one.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [2, 7, 11, 15]`.

**Step 1: Understanding what "trailing zero" means**
A trailing zero in binary means the least significant bit (rightmost bit) is 0. In decimal terms, this means the number is **even** (divisible by 2).

**Step 2: Understanding bitwise OR properties**
For the OR of multiple numbers to be even, the least significant bit of the OR result must be 0. The OR operation works bit-by-bit:

- 0 OR 0 = 0
- 0 OR 1 = 1
- 1 OR 0 = 1
- 1 OR 1 = 1

For the result's LSB to be 0, **all** numbers being OR'd must have LSB = 0. If even one number has LSB = 1, the result's LSB will be 1.

**Step 3: Check our example**
Let's look at the binary representation of each number:

- 2 = 10₂ (LSB = 0, even)
- 7 = 111₂ (LSB = 1, odd)
- 11 = 1011₂ (LSB = 1, odd)
- 15 = 1111₂ (LSB = 1, odd)

We need at least two numbers with LSB = 0. Looking at the array, only `2` has LSB = 0. We need **two or more** even numbers, but we only have one. Therefore, the answer is `false`.

**Step 4: Try another example**
Consider `nums = [1, 2, 3, 4]`:

- 1 = 1₂ (LSB = 1, odd)
- 2 = 10₂ (LSB = 0, even)
- 3 = 11₂ (LSB = 1, odd)
- 4 = 100₂ (LSB = 0, even)

We have two even numbers (2 and 4). If we select these two, their OR is:
2 OR 4 = 10₂ OR 100₂ = 110₂ = 6 (even, has trailing zero)
So the answer is `true`.

**Key insight**: We just need to count how many even numbers are in the array. If we have at least 2, we can select them and their OR will be even (have a trailing zero).

## Brute Force Approach

A naive approach would be to check all possible combinations of two or more elements from the array, compute their bitwise OR, and check if the result is even. For an array of size `n`, there are 2ⁿ - n - 1 such combinations (all subsets except empty set and single-element subsets).

**Why this fails**:

- Time complexity: O(2ⁿ × m) where m is the maximum number of elements in a subset
- Space complexity: O(1) for computation, but generating combinations requires additional space
- For n = 1000, we'd need to check ~2¹⁰⁰⁰ combinations, which is computationally impossible

Even checking only pairs of elements (which is O(n²)) would be too slow for large arrays, though it would work for the problem constraints (n ≤ 100). However, we can do much better with insight.

## Optimal Solution

The optimal solution relies on this key observation: **The bitwise OR of numbers will be even if and only if ALL numbers being OR'd are even**. This is because:

1. An even number has LSB = 0
2. OR operation: 0 OR 0 = 0 (keeps LSB as 0)
3. If ANY number has LSB = 1, the result's LSB becomes 1

Therefore, we just need to check if there are **at least two even numbers** in the array. We can do this with a simple count.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def hasTrailingZeros(nums):
    """
    Check if we can select two or more elements such that their OR has trailing zeros.

    Args:
        nums: List of positive integers

    Returns:
        True if possible, False otherwise
    """
    # Count how many even numbers are in the array
    even_count = 0

    # Iterate through each number in the array
    for num in nums:
        # Check if the number is even by examining the least significant bit
        # num & 1 == 0 means the LSB is 0, which means the number is even
        if (num & 1) == 0:
            even_count += 1

    # We need at least 2 even numbers to form a valid selection
    return even_count >= 2
```

```javascript
// Time: O(n) | Space: O(1)
function hasTrailingZeros(nums) {
  /**
   * Check if we can select two or more elements such that their OR has trailing zeros.
   *
   * @param {number[]} nums - Array of positive integers
   * @return {boolean} True if possible, False otherwise
   */
  let evenCount = 0;

  // Iterate through each number in the array
  for (let i = 0; i < nums.length; i++) {
    // Check if the number is even by examining the least significant bit
    // nums[i] & 1 === 0 means the LSB is 0, which means the number is even
    if ((nums[i] & 1) === 0) {
      evenCount++;
    }
  }

  // We need at least 2 even numbers to form a valid selection
  return evenCount >= 2;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean hasTrailingZeros(int[] nums) {
        /**
         * Check if we can select two or more elements such that their OR has trailing zeros.
         *
         * @param nums Array of positive integers
         * @return True if possible, False otherwise
         */
        int evenCount = 0;

        // Iterate through each number in the array
        for (int num : nums) {
            // Check if the number is even by examining the least significant bit
            // (num & 1) == 0 means the LSB is 0, which means the number is even
            if ((num & 1) == 0) {
                evenCount++;
            }
        }

        // We need at least 2 even numbers to form a valid selection
        return evenCount >= 2;
    }
}
```

</div>

**Alternative implementation using modulo operator**:
Instead of `(num & 1) == 0`, we could use `num % 2 == 0`. Both work correctly, but the bitwise AND is slightly more efficient and directly expresses the binary nature of the problem.

## Complexity Analysis

**Time Complexity**: O(n)

- We iterate through the array once, performing constant-time operations on each element
- The operation `num & 1` takes O(1) time
- Incrementing the counter takes O(1) time
- Total: O(n) where n is the length of the input array

**Space Complexity**: O(1)

- We only use a single integer variable (`even_count`) to track the count
- No additional data structures that scale with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Checking if individual numbers have trailing zeros instead of the OR result**
   - Mistake: Checking if any single number is even and returning true
   - Why it's wrong: We need the OR of **two or more** numbers to be even
   - How to avoid: Remember we need at least two even numbers

2. **Using the wrong bitwise operator**
   - Mistake: Using AND (`&`) instead of OR (`|`) in reasoning, or checking `(num | 1) == 0`
   - Why it's wrong: `num | 1` will always have LSB = 1 for any number
   - How to avoid: Remember we're checking if numbers are even using `(num & 1) == 0`

3. **Forgetting the "two or more" requirement**
   - Mistake: Returning true if `even_count >= 1` instead of `even_count >= 2`
   - Why it's wrong: The problem explicitly states we must select **two or more** elements
   - How to avoid: Carefully read the problem statement and test with single even number cases

4. **Overcomplicating with actual OR computations**
   - Mistake: Actually computing OR combinations instead of just counting even numbers
   - Why it's wrong: Unnecessarily complex and potentially slower
   - How to avoid: Recognize the mathematical property that OR of numbers is even iff all are even

## When You'll See This Pattern

This problem uses **bitwise property analysis**—a common pattern in coding interviews. Instead of brute force computation, we derive a mathematical property that simplifies the problem.

**Related problems**:

1. **Count Odd Numbers in an Interval Range (Easy)**
   - Similarity: Both involve analyzing parity (even/odd) properties
   - Difference: That problem uses arithmetic progression, while this uses bitwise properties

2. **Number of 1 Bits (Easy)**
   - Similarity: Both examine binary representation properties
   - Difference: That problem counts set bits, while this examines the LSB

3. **Missing Number (Easy)**
   - Similarity: Both can use XOR properties for efficient solutions
   - Difference: That problem uses XOR to find missing element, while this uses AND to check parity

4. **Single Number (Easy)**
   - Similarity: Both leverage bitwise operation properties (XOR in that case)
   - Difference: That problem finds the unique element, while this checks a collective property

## Key Takeaways

1. **Bitwise operations often have mathematical properties that simplify problems**
   - Instead of computing all combinations, look for properties like "OR is even iff all operands are even"
   - This transforms O(2ⁿ) problems into O(n) ones

2. **The least significant bit (LSB) determines parity**
   - `num & 1 == 0` checks if a number is even (LSB = 0)
   - `num & 1 == 1` checks if a number is odd (LSB = 1)
   - This is more efficient than `num % 2` for parity checks

3. **Always verify problem constraints**
   - The "two or more" requirement changes `even_count >= 1` to `even_count >= 2`
   - Small details in problem statements significantly affect the solution

**Related problems**: [Count Odd Numbers in an Interval Range](/problem/count-odd-numbers-in-an-interval-range), [Remove Trailing Zeros From a String](/problem/remove-trailing-zeros-from-a-string)
