---
title: "How to Solve Single Number III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Single Number III. Medium difficulty, 70.4% acceptance rate. Topics: Array, Bit Manipulation."
date: "2027-03-12"
category: "dsa-patterns"
tags: ["single-number-iii", "array", "bit-manipulation", "medium"]
---

# How to Solve Single Number III

You're given an array where every number appears exactly twice except for two numbers that appear only once. Your task is to find those two unique numbers. The challenge is doing this in O(n) time with O(1) space, which forces us to think beyond simple hash maps and use bit manipulation cleverly.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 1, 3, 2, 5]`

We know that 3 and 5 appear only once. If we could somehow separate the array into two groups where each group contains exactly one of our unique numbers, we could solve this like the original Single Number problem.

**Step 1: XOR all numbers**

```
1 ^ 2 ^ 1 ^ 3 ^ 2 ^ 5 = (1 ^ 1) ^ (2 ^ 2) ^ 3 ^ 5 = 0 ^ 0 ^ 3 ^ 5 = 3 ^ 5 = 6
```

The XOR of all numbers gives us `3 ^ 5 = 6` (binary `110`).

**Step 2: Find a differentiating bit**
The result `6` (binary `110`) tells us that 3 and 5 differ in at least one bit position. Let's find the rightmost set bit:

```
6 = 110 (binary)
~6 = 001 (inverted)
6 & (-6) = 110 & 010 = 010 (binary) = 2 (decimal)
```

We found that the second bit (value 2) is set in our XOR result. This means 3 and 5 have different values at this bit position.

**Step 3: Separate into two groups**
Now we can separate all numbers based on whether they have this bit set:

- Group A (bit is set): [2, 3, 2] (2=010, 3=011)
- Group B (bit is not set): [1, 1, 5] (1=001, 5=101)

Notice that in each group, one unique number appears once and all others appear in pairs.

**Step 4: XOR each group**

- Group A: `2 ^ 3 ^ 2 = (2 ^ 2) ^ 3 = 0 ^ 3 = 3`
- Group B: `1 ^ 1 ^ 5 = (1 ^ 1) ^ 5 = 0 ^ 5 = 5`

We've found our two unique numbers: 3 and 5.

## Brute Force Approach

The most straightforward approach is to use a hash map to count frequencies:

1. Iterate through the array and count occurrences of each number
2. Find all numbers with count = 1
3. Return those two numbers

While this works, it requires O(n) extra space for the hash map, which violates the optimal space requirement. The problem doesn't explicitly forbid it, but interviewers expect the O(1) space solution for this medium-difficulty problem.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def singleNumber_brute(nums):
    count = {}

    # Count occurrences of each number
    for num in nums:
        count[num] = count.get(num, 0) + 1

    # Find numbers that appear only once
    result = []
    for num, freq in count.items():
        if freq == 1:
            result.append(num)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function singleNumberBrute(nums) {
  const count = new Map();

  // Count occurrences of each number
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // Find numbers that appear only once
  const result = [];
  for (const [num, freq] of count) {
    if (freq === 1) {
      result.push(num);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] singleNumberBrute(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();

    // Count occurrences of each number
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }

    // Find numbers that appear only once
    int[] result = new int[2];
    int index = 0;
    for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
        if (entry.getValue() == 1) {
            result[index++] = entry.getKey();
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight comes from understanding XOR properties:

1. `a ^ a = 0` (a number XORed with itself is 0)
2. `a ^ 0 = a` (a number XORed with 0 is itself)
3. XOR is commutative and associative: `a ^ b ^ c = a ^ c ^ b`

If we XOR all numbers, pairs cancel out, leaving us with `x ^ y` where x and y are our unique numbers.

The challenge: we need to extract x and y from `x ^ y`.

The breakthrough: find any bit where x and y differ (this bit will be 1 in `x ^ y`). Use this bit to separate all numbers into two groups:

- Group 1: numbers with that bit set
- Group 2: numbers with that bit not set

Since x and y differ at this bit, they'll end up in different groups. In each group, all other numbers appear in pairs, so XORing each group gives us one unique number.

## Optimal Solution

Here's the complete implementation using bit manipulation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def singleNumber(nums):
    # Step 1: XOR all numbers to get x ^ y
    xor_all = 0
    for num in nums:
        xor_all ^= num

    # Step 2: Find the rightmost set bit in xor_all
    # This bit is different between x and y
    # Using two's complement: rightmost_set_bit = xor_all & -xor_all
    rightmost_set_bit = xor_all & -xor_all

    # Step 3: Initialize results for our two groups
    x = 0
    y = 0

    # Step 4: Separate numbers into two groups and XOR them
    for num in nums:
        # Check if the rightmost_set_bit is set in current number
        if num & rightmost_set_bit:
            # This number goes to group 1 (with x)
            x ^= num
        else:
            # This number goes to group 2 (with y)
            y ^= num

    return [x, y]
```

```javascript
// Time: O(n) | Space: O(1)
function singleNumber(nums) {
  // Step 1: XOR all numbers to get x ^ y
  let xorAll = 0;
  for (const num of nums) {
    xorAll ^= num;
  }

  // Step 2: Find the rightmost set bit in xorAll
  // This bit is different between x and y
  // Using two's complement: rightmostSetBit = xorAll & -xorAll
  // In JavaScript, we need to handle 32-bit signed integers
  const rightmostSetBit = xorAll & -xorAll;

  // Step 3: Initialize results for our two groups
  let x = 0;
  let y = 0;

  // Step 4: Separate numbers into two groups and XOR them
  for (const num of nums) {
    // Check if the rightmostSetBit is set in current number
    if (num & rightmostSetBit) {
      // This number goes to group 1 (with x)
      x ^= num;
    } else {
      // This number goes to group 2 (with y)
      y ^= num;
    }
  }

  return [x, y];
}
```

```java
// Time: O(n) | Space: O(1)
public int[] singleNumber(int[] nums) {
    // Step 1: XOR all numbers to get x ^ y
    int xorAll = 0;
    for (int num : nums) {
        xorAll ^= num;
    }

    // Step 2: Find the rightmost set bit in xorAll
    // This bit is different between x and y
    // Using two's complement: rightmostSetBit = xorAll & -xorAll
    int rightmostSetBit = xorAll & -xorAll;

    // Step 3: Initialize results for our two groups
    int x = 0;
    int y = 0;

    // Step 4: Separate numbers into two groups and XOR them
    for (int num : nums) {
        // Check if the rightmostSetBit is set in current number
        if ((num & rightmostSetBit) != 0) {
            // This number goes to group 1 (with x)
            x ^= num;
        } else {
            // This number goes to group 2 (with y)
            y ^= num;
        }
    }

    return new int[]{x, y};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to compute the XOR of all elements, and another to separate and XOR the groups.
- Each pass processes each element exactly once, so 2n operations → O(n).

**Space Complexity: O(1)**

- We only use a few integer variables (`xor_all`, `rightmost_set_bit`, `x`, `y`).
- No additional data structures that grow with input size.

## Common Mistakes

1. **Forgetting about negative numbers in bit manipulation**: When finding the rightmost set bit using `xor_all & -xor_all`, this works correctly for both positive and negative numbers due to two's complement representation. Some candidates try to manually find the set bit with shifting, which is more error-prone.

2. **Incorrect grouping logic**: The condition `if (num & rightmost_set_bit)` checks if the specific bit is set, not if it's non-zero. Some candidates mistakenly use `if (num & rightmost_set_bit != 0)` in languages where operator precedence matters (like Java), which requires parentheses.

3. **Assuming the array always has exactly two unique numbers**: While the problem guarantees this, in an interview you might want to mention this assumption. A robust implementation could handle edge cases like empty input or verify the result.

4. **Overcomplicating the bit finding**: Some candidates try to find all differing bits or use complex bit operations. The rightmost set bit trick (`x & -x`) is elegant and sufficient.

## When You'll See This Pattern

This XOR + bit masking pattern appears in several bit manipulation problems:

1. **Single Number (Easy)**: The simpler version where only one number appears once. Solution is just XOR all numbers.

2. **Single Number II (Medium)**: Here, every number appears three times except one. The solution uses bit counting across all numbers.

3. **Missing Number (Easy)**: Can be solved by XORing all numbers from 0 to n with all array elements.

4. **Find The Original Array of Prefix XOR (Medium)**: Uses XOR properties to reconstruct an array from its prefix XOR.

The core pattern is using XOR's self-canceling property combined with bit masking to separate elements into groups.

## Key Takeaways

1. **XOR is your friend for "appears twice" problems**: When elements appear in pairs, XOR causes them to cancel out (a ^ a = 0). This leaves you with the XOR of unique elements.

2. **Use differing bits to separate groups**: If you have x ^ y, any set bit represents a position where x and y differ. Use this to partition elements so x and y end up in different groups.

3. **Bit masking with `x & -x` finds the rightmost set bit**: This elegant trick uses two's complement to isolate the rightmost 1-bit, which is perfect for creating a mask to separate numbers.

Related problems: [Single Number](/problem/single-number), [Single Number II](/problem/single-number-ii), [Find The Original Array of Prefix XOR](/problem/find-the-original-array-of-prefix-xor)
