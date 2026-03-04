---
title: "Bit Manipulation Questions at Media.net: What to Expect"
description: "Prepare for Bit Manipulation interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-21"
category: "dsa-patterns"
tags: ["medianet", "bit-manipulation", "interview prep"]
---

Bit Manipulation appears in roughly 18% of Media.net's technical interview questions (6 out of 33 total problems). This high frequency signals that the company values engineers who can write highly optimized, low-level code for performance-critical systems, such as their ad tech platforms. Mastering these concepts demonstrates you can think efficiently about resource constraints and algorithmic elegance—key traits for their infrastructure roles.

## What to Expect — types of problems

Media.net’s bit manipulation questions typically fall into three practical categories:

1.  **Single Number Variations:** The classic "find the element that appears once" problem, often extended. You might need to find two unique numbers in an array where all others appear twice, or handle scenarios where the unique element appears once while others appear _k_ times.
2.  **Bit Counting and Toggling:** Problems that require counting set bits (population count), toggling specific bits, or checking power-of-two status. These test your familiarity with fundamental bitwise operations like AND, OR, XOR, and shifts.
3.  **Real-World Bitmask Applications:** More advanced problems may use bits to represent states or subsets, such as using a bitmask to track visited nodes efficiently or to solve problems related to character sets (e.g., checking if all characters in a string are unique using a single integer as a bitset).

Expect questions that are layered; a problem might start as a simple XOR operation but require additional steps like isolating the rightmost set bit to reach the final solution.

## How to Prepare — study tips with one code example

Focus on internalizing a core set of patterns rather than memorizing problems. Essential tools include:

- `x ^ x = 0` and `x ^ 0 = x` (XOR for cancellation).
- `n & (n-1)` to clear the lowest set bit (useful for counting bits or checking power-of-two).
- `n & -n` to isolate the lowest set bit.
- Using an integer as a bitset with `(1 << bitIndex)`.

Practice applying these patterns to the problem categories above. For example, a fundamental pattern is using XOR to find a unique number. A common follow-up is to find _two_ unique numbers. The solution involves using XOR to partition the numbers into two groups based on a differing bit.

<div class="code-group">

```python
def singleNumberIII(nums):
    # XOR all numbers -> gives xor of the two unique numbers
    xor_all = 0
    for num in nums:
        xor_all ^= num

    # Isolate the rightmost set bit (diff bit between the two numbers)
    diff_bit = xor_all & -xor_all

    # Partition numbers and find one unique number in each group
    num1 = 0
    for num in nums:
        if num & diff_bit:
            num1 ^= num

    num2 = xor_all ^ num1
    return [num1, num2]
```

```javascript
function singleNumberIII(nums) {
  // XOR all numbers -> gives xor of the two unique numbers
  let xorAll = 0;
  for (let num of nums) {
    xorAll ^= num;
  }

  // Isolate the rightmost set bit (diff bit between the two numbers)
  let diffBit = xorAll & -xorAll;

  // Partition numbers and find one unique number in each group
  let num1 = 0;
  for (let num of nums) {
    if (num & diffBit) {
      num1 ^= num;
    }
  }

  let num2 = xorAll ^ num1;
  return [num1, num2];
}
```

```java
public int[] singleNumberIII(int[] nums) {
    // XOR all numbers -> gives xor of the two unique numbers
    int xorAll = 0;
    for (int num : nums) {
        xorAll ^= num;
    }

    // Isolate the rightmost set bit (diff bit between the two numbers)
    int diffBit = xorAll & -xorAll;

    // Partition numbers and find one unique number in each group
    int num1 = 0;
    for (int num : nums) {
        if ((num & diffBit) != 0) {
            num1 ^= num;
        }
    }

    int num2 = xorAll ^ num1;
    return new int[]{num1, num2};
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  Start with fundamentals: practice counting set bits, checking even/odd, toggling/flipping bits.
2.  Master the core "single number" pattern using XOR.
3.  Solve its common variant: finding two single numbers (as shown above).
4.  Move to problems using `n & (n-1)` for tasks like checking power-of-two or counting bits.
5.  Finally, tackle problems that use bitmasking for state representation, like checking a pangram or generating subsets.

This order ensures you build the necessary pattern recognition before combining concepts in more complex scenarios.

[Practice Bit Manipulation at Media.net](/company/medianet/bit-manipulation)
