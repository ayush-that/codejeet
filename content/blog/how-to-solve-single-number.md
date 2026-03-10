---
title: "How to Solve Single Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Single Number. Easy difficulty, 77.4% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-03-01"
category: "dsa-patterns"
tags: ["single-number", "array", "bit-manipulation", "easy"]
---

# How to Solve Single Number

You're given an array where every number appears exactly twice except for one number that appears only once. Your task is to find that unique number. The challenge is doing this efficiently: you need O(n) time complexity and O(1) space complexity, which means you can't use extra data structures like hash maps that would require O(n) space.

What makes this problem interesting is that it looks deceptively simple but requires a clever bit manipulation trick to meet the space constraint. If you try to solve it without knowing the XOR pattern, you might struggle to find the optimal solution.

## Visual Walkthrough

Let's trace through the example `[4, 1, 2, 1, 2]` step by step using the XOR operation:

**XOR Properties:**

- `a ^ a = 0` (any number XORed with itself equals 0)
- `a ^ 0 = a` (any number XORed with 0 equals itself)
- XOR is commutative and associative: `a ^ b ^ c = a ^ c ^ b`

**Step-by-step calculation:**

1. Start with `result = 0`
2. Process `4`: `0 ^ 4 = 4`
3. Process `1`: `4 ^ 1 = 5` (binary: 100 ^ 001 = 101)
4. Process `2`: `5 ^ 2 = 7` (binary: 101 ^ 010 = 111)
5. Process `1`: `7 ^ 1 = 6` (binary: 111 ^ 001 = 110)
6. Process `2`: `6 ^ 2 = 4` (binary: 110 ^ 010 = 100)

The final result is `4`, which is our unique number. Notice how the pairs `(1, 1)` and `(2, 2)` canceled each other out, leaving only the single `4`.

## Brute Force Approach

A naive approach would be to check each number and see if it appears elsewhere in the array:

1. For each element in the array
2. Search through the entire array to count how many times it appears
3. Return the element that appears only once

This approach has O(n²) time complexity because for each of n elements, we might search through n elements. The space complexity is O(1), but the time complexity is unacceptable for large arrays.

Another brute force approach would use a hash map to count frequencies:

1. Create a hash map to store frequency counts
2. Iterate through the array, counting each number
3. Find the number with count = 1

This has O(n) time complexity but O(n) space complexity, which violates the constant space requirement.

## Optimal Solution

The optimal solution uses the XOR bitwise operation. Since every number appears twice except one, XORing all numbers together will cancel out the pairs, leaving only the unique number.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def singleNumber(nums):
    """
    Finds the single number in an array where every other number appears twice.

    The key insight is that XOR has these properties:
    1. a ^ a = 0 (a number XORed with itself is 0)
    2. a ^ 0 = a (a number XORed with 0 is itself)
    3. XOR is commutative and associative

    Since all numbers appear in pairs except one, XORing all numbers
    will cancel out the pairs, leaving only the unique number.
    """
    result = 0  # Initialize result to 0 (identity element for XOR)

    # XOR all numbers together
    for num in nums:
        result ^= num  # result = result XOR num

    return result  # The final result is the unique number
```

```javascript
// Time: O(n) | Space: O(1)
function singleNumber(nums) {
  /**
   * Finds the single number in an array where every other number appears twice.
   *
   * XOR properties:
   * 1. a ^ a = 0 (a number XORed with itself is 0)
   * 2. a ^ 0 = a (a number XORed with 0 is itself)
   * 3. XOR is commutative and associative
   *
   * Since all numbers appear in pairs except one, XORing all numbers
   * will cancel out the pairs, leaving only the unique number.
   */
  let result = 0; // Initialize result to 0 (identity element for XOR)

  // XOR all numbers together
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i]; // result = result XOR nums[i]
  }

  return result; // The final result is the unique number
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int singleNumber(int[] nums) {
        /**
         * Finds the single number in an array where every other number appears twice.
         *
         * XOR properties:
         * 1. a ^ a = 0 (a number XORed with itself is 0)
         * 2. a ^ 0 = a (a number XORed with 0 is itself)
         * 3. XOR is commutative and associative
         *
         * Since all numbers appear in pairs except one, XORing all numbers
         * will cancel out the pairs, leaving only the unique number.
         */
        int result = 0;  // Initialize result to 0 (identity element for XOR)

        // XOR all numbers together
        for (int num : nums) {
            result ^= num;  // result = result XOR num
        }

        return result;  // The final result is the unique number
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once
- Each XOR operation takes constant time O(1)
- Total time is proportional to the number of elements n

**Space Complexity: O(1)**

- We only use a single variable `result` to store the XOR result
- No additional data structures are used
- The space used does not grow with the input size

## Common Mistakes

1. **Forgetting to initialize result to 0**: If you initialize result to something else (like the first element), you might get incorrect results. Starting with 0 works because `0 ^ a = a`.

2. **Using addition/subtraction instead of XOR**: Some candidates try to use arithmetic operations, but these don't have the cancellation property that XOR has. For example, `a + a ≠ 0` and `a - a = 0` but subtraction isn't commutative.

3. **Overcomplicating with hash maps**: While a hash map solution works for time complexity, it fails the space constraint (O(n) space). Interviewers specifically ask for constant space.

4. **Not understanding XOR properties**: Some candidates implement XOR correctly but can't explain why it works. Be prepared to explain the three key properties of XOR mentioned in the code comments.

## When You'll See This Pattern

The XOR pattern appears in several other problems:

1. **Single Number II (Medium)**: Similar problem but every element appears three times except one. The XOR trick alone doesn't work here—you need a more advanced bit manipulation approach.

2. **Single Number III (Medium)**: Two elements appear once and all others appear twice. You use XOR to get `a ^ b`, then find a set bit to separate the two numbers.

3. **Missing Number (Easy)**: Find the missing number in an array containing n distinct numbers from 0 to n. XOR all numbers from 0 to n with all numbers in the array—the result is the missing number.

4. **Find the Difference (Easy)**: Given two strings where one string has an extra character, XOR all characters to find the extra one.

The common thread is using XOR's cancellation property (`a ^ a = 0`) to find unique or missing elements in collections where other elements appear in pairs.

## Key Takeaways

1. **XOR is a powerful tool for finding unique elements**: When you need to find an element that appears an odd number of times while others appear an even number of times, XOR should be your first thought.

2. **Look for cancellation patterns**: Problems where elements "cancel out" often have XOR solutions. The key insight is recognizing that XOR of a number with itself equals 0.

3. **Constant space often means bit manipulation**: When a problem requires O(1) space and involves integers, consider whether bitwise operations (AND, OR, XOR, shifts) might provide a solution.

Related problems: [Single Number II](/problem/single-number-ii), [Single Number III](/problem/single-number-iii), [Missing Number](/problem/missing-number)
