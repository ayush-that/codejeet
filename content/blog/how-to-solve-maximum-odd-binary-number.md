---
title: "How to Solve Maximum Odd Binary Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Odd Binary Number. Easy difficulty, 82.9% acceptance rate. Topics: Math, String, Greedy."
date: "2028-06-23"
category: "dsa-patterns"
tags: ["maximum-odd-binary-number", "math", "string", "greedy", "easy"]
---

# How to Solve Maximum Odd Binary Number

You're given a binary string containing at least one '1', and you need to rearrange its bits to create the largest possible odd binary number. The challenge is understanding what makes a binary number both large and odd, then implementing an efficient rearrangement strategy.

**What makes this interesting:** While the problem seems simple, it tests your understanding of binary number properties. A binary number is odd when its last digit is '1', and it's maximized when we place the largest digits (1s) in the most significant positions. The trick is balancing these two requirements.

## Visual Walkthrough

Let's trace through an example: `s = "010110"`

**Step 1: Understand the goal**

- Odd binary number: Must end with '1'
- Maximum value: Want as many leading '1's as possible

**Step 2: Count the bits**

- Total bits: 6
- Number of '1's: 3 (positions 1, 3, 4 if 0-indexed)
- Number of '0's: 3

**Step 3: Construct the maximum odd number**

1. We need one '1' at the end to make it odd
2. We have 2 '1's left to place at the beginning for maximum value
3. The remaining positions get '0's

So we need: `[1, 1, 0, 0, 0, 1]`

**Step 4: Verify**

- Binary: `110001`
- Decimal: 49
- Check if odd: Last digit is '1' ✓
- Check if maximum: Any other arrangement with same bits would be smaller (like `101001` = 41)

## Brute Force Approach

A naive approach would be to generate all permutations of the string, filter for odd numbers (ending with '1'), convert to decimal, and find the maximum. However, this is extremely inefficient:

- For a string of length n, there are n! permutations
- Even for n=10, that's 3.6 million permutations
- We'd need to convert each valid permutation to decimal for comparison

This approach has O(n! × n) time complexity, which is completely impractical for any reasonable input size.

## Optimal Solution

The key insight is that we don't need to try all permutations. We can construct the answer directly:

1. **Count the 1s** - we need to know how many we have
2. **Reserve one '1' for the last position** - to ensure the number is odd
3. **Place all remaining '1's at the beginning** - to maximize the value
4. **Fill the middle with '0's** - whatever positions are left

This greedy approach works because:

- Binary numbers are compared left-to-right (most significant bit first)
- '1' > '0', so we want as many leading '1's as possible
- The last bit must be '1' for the number to be odd

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def maximumOddBinaryNumber(s: str) -> str:
    # Step 1: Count the number of '1's in the string
    count_ones = s.count('1')

    # Step 2: The number of '0's is total length minus ones
    count_zeros = len(s) - count_ones

    # Step 3: Build the result string
    # All '1's except one go at the beginning
    # The reserved '1' goes at the end to make it odd
    # '0's fill the middle positions
    result = '1' * (count_ones - 1) + '0' * count_zeros + '1'

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function maximumOddBinaryNumber(s) {
  // Step 1: Count the number of '1's in the string
  let countOnes = 0;
  for (let char of s) {
    if (char === "1") countOnes++;
  }

  // Step 2: The number of '0's is total length minus ones
  const countZeros = s.length - countOnes;

  // Step 3: Build the result string
  // All '1's except one go at the beginning
  // The reserved '1' goes at the end to make it odd
  // '0's fill the middle positions
  const leadingOnes = "1".repeat(countOnes - 1);
  const middleZeros = "0".repeat(countZeros);

  return leadingOnes + middleZeros + "1";
}
```

```java
// Time: O(n) | Space: O(n) for the result string
public String maximumOddBinaryNumber(String s) {
    // Step 1: Count the number of '1's in the string
    int countOnes = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '1') {
            countOnes++;
        }
    }

    // Step 2: The number of '0's is total length minus ones
    int countZeros = s.length() - countOnes;

    // Step 3: Build the result string
    // All '1's except one go at the beginning
    // The reserved '1' goes at the end to make it odd
    // '0's fill the middle positions
    StringBuilder result = new StringBuilder();

    // Add leading ones (all except one)
    for (int i = 0; i < countOnes - 1; i++) {
        result.append('1');
    }

    // Add zeros in the middle
    for (int i = 0; i < countZeros; i++) {
        result.append('0');
    }

    // Add the final '1' at the end to ensure oddness
    result.append('1');

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to traverse the string once to count the '1's (O(n))
- Building the result string takes O(n) time
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We need to store the result string of length n
- The counting variables use O(1) extra space
- Total: O(n) for the output (which is required by the problem)

## Common Mistakes

1. **Forgetting to reserve a '1' for the end**: Some candidates place all '1's at the beginning, creating an even number when there's only one '1'. Always remember you need one '1' at the end.

2. **Incorrect handling of the single '1' case**: When there's only one '1', `count_ones - 1 = 0`, so we should have no leading '1's, all '0's in the middle, and a '1' at the end. The formula handles this correctly.

3. **Using sorting instead of counting**: Some candidates sort the string in descending order and then move a '1' to the end. While this works, it's O(n log n) instead of O(n). Counting is more efficient.

4. **Not reading the problem constraints carefully**: The problem guarantees at least one '1', so we don't need to handle the "no '1's" case. Always check constraints before writing defensive code.

## When You'll See This Pattern

This problem uses **greedy construction with counting**, a pattern that appears in many string manipulation and optimization problems:

1. **Largest Number (LeetCode 179)**: Arrange numbers to form the largest number. Similar greedy thinking about digit placement.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Use counting and greedy placement to ensure characters are spaced apart.

3. **Task Scheduler (LeetCode 621)**: Count task frequencies and arrange them optimally with cooling periods.

The core pattern is: **Count elements → Determine optimal arrangement rules → Construct result greedily**. When you need to rearrange elements to optimize some property (maximum value, minimum spacing, etc.), think about what rules govern the optimal arrangement and whether you can construct it directly.

## Key Takeaways

1. **Binary oddness is determined solely by the last bit**: A binary number is odd if and only if its least significant bit (rightmost) is '1'. This simple property is key to many binary manipulation problems.

2. **Greedy construction beats brute force**: When the optimal arrangement follows simple rules (like "all 1s first, except one at the end"), you can construct it directly in O(n) time instead of trying all permutations.

3. **Counting is often more efficient than sorting**: If you only need to know how many of each element you have (not their original order), counting with O(n) time is better than sorting with O(n log n) time.

[Practice this problem on CodeJeet](/problem/maximum-odd-binary-number)
