---
title: "How to Solve Circular Permutation in Binary Representation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Circular Permutation in Binary Representation. Medium difficulty, 72.6% acceptance rate. Topics: Math, Backtracking, Bit Manipulation."
date: "2029-08-26"
category: "dsa-patterns"
tags:
  [
    "circular-permutation-in-binary-representation",
    "math",
    "backtracking",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Circular Permutation in Binary Representation

This problem asks us to generate a circular permutation of numbers from 0 to 2ⁿ-1 where consecutive numbers differ by exactly one bit (Gray code sequence), starting at a specific number `start`, and wrapping around so the first and last numbers also differ by one bit. The challenge is constructing such a sequence efficiently without backtracking through all possible permutations.

## Visual Walkthrough

Let's trace through an example with n=2 and start=3:

**Step 1: Understanding the requirements**

- n=2 means we need numbers from 0 to 3 (2²-1 = 3)
- We need a sequence where: p[0]=3, p[1] differs from 3 by 1 bit, p[2] differs from p[1] by 1 bit, p[3] differs from p[2] by 1 bit, and p[3] differs from p[0] by 1 bit
- Binary representations: 0=00, 1=01, 2=10, 3=11

**Step 2: Finding a valid sequence**
One possible Gray code sequence for n=2 is: 0→1→3→2

- 0 (00) → 1 (01): changes rightmost bit
- 1 (01) → 3 (11): changes leftmost bit
- 3 (11) → 2 (10): changes rightmost bit
- 2 (10) → 0 (00): changes leftmost bit (circular)

**Step 3: Starting at 3**
We need p[0]=3, so let's rotate the sequence to start at 3:
Original: 0→1→3→2→0
Starting at 3: 3→2→0→1→3

Check each transition:

- 3 (11) → 2 (10): changes rightmost bit ✓
- 2 (10) → 0 (00): changes leftmost bit ✓
- 0 (00) → 1 (01): changes rightmost bit ✓
- 1 (01) → 3 (11): changes leftmost bit ✓

This gives us the valid sequence [3, 2, 0, 1].

**Key insight**: We can generate a standard Gray code sequence starting from 0, then rotate it to start at our desired value.

## Brute Force Approach

A naive approach would be to try all permutations of numbers 0 to 2ⁿ-1 and check if they satisfy the conditions:

1. Generate all permutations (2ⁿ! possibilities - enormous even for small n)
2. For each permutation, check if p[0]=start
3. Check if consecutive numbers differ by exactly one bit
4. Check if first and last numbers differ by exactly one bit

This approach is completely impractical because:

- For n=3, we have 8! = 40,320 permutations
- For n=4, we have 16! ≈ 2×10¹³ permutations
- The time complexity is O((2ⁿ)!), which grows astronomically fast

Even with pruning (backtracking when we find an invalid transition), the search space is still exponential and would time out for n≥16 (65,536 numbers to arrange).

## Optimized Approach

The key insight comes from recognizing this as a **Gray code** problem. Gray codes are sequences where consecutive numbers differ by exactly one bit. The standard binary-reflected Gray code gives us exactly what we need, except it starts at 0.

**Step-by-step reasoning:**

1. **Generate standard Gray code**: We can generate Gray code sequence using the formula `i ^ (i >> 1)` for i from 0 to 2ⁿ-1
   - This gives us a sequence starting at 0 where consecutive numbers differ by 1 bit
   - The sequence naturally wraps around (first and last differ by 1 bit)

2. **Find the starting position**: We need to find where `start` appears in our Gray code sequence
   - Since Gray code is a permutation of all numbers 0 to 2ⁿ-1, `start` will appear exactly once

3. **Rotate the sequence**: Once we find the index of `start`, we can rotate the array so it starts at that position
   - This preserves all the Gray code properties (1-bit differences between consecutive elements)
   - The circular property is maintained because rotating a circular sequence keeps it circular

4. **Why this works**:
   - Gray code guarantees 1-bit differences between consecutive numbers
   - Rotating the sequence doesn't change the relative positions or the 1-bit difference property
   - The sequence remains circular because we're just changing the starting point of the same cycle

**Mathematical insight**: The operation `i ^ (i >> 1)` generates Gray code because:

- Right shifting by 1 divides by 2 (drops the least significant bit)
- XOR-ing with the shifted value creates a pattern where only one bit changes at a time
- This is a well-known property used in digital electronics and error correction

## Optimal Solution

Here's the complete implementation using the Gray code generation and rotation approach:

<div class="code-group">

```python
# Time: O(2^n) - we generate all 2^n numbers
# Space: O(2^n) - we store the entire sequence
def circularPermutation(n, start):
    """
    Generate a circular Gray code permutation starting at 'start'.

    Args:
        n: The number of bits (sequence length is 2^n)
        start: The starting value of the permutation

    Returns:
        List of integers forming a circular Gray code starting at 'start'
    """
    # Step 1: Generate standard Gray code sequence
    # Gray code formula: i XOR (i >> 1)
    gray_code = []
    for i in range(1 << n):  # 1 << n = 2^n
        gray_code.append(i ^ (i >> 1))

    # Step 2: Find the index of 'start' in the Gray code
    # We need to rotate the sequence to start at this position
    start_index = 0
    for i in range(len(gray_code)):
        if gray_code[i] == start:
            start_index = i
            break

    # Step 3: Rotate the sequence to start at 'start_index'
    # Using list slicing for clarity
    result = gray_code[start_index:] + gray_code[:start_index]

    return result
```

```javascript
// Time: O(2^n) - we generate all 2^n numbers
// Space: O(2^n) - we store the entire sequence
function circularPermutation(n, start) {
  /**
   * Generate a circular Gray code permutation starting at 'start'.
   *
   * @param {number} n - The number of bits (sequence length is 2^n)
   * @param {number} start - The starting value of the permutation
   * @return {number[]} - Array forming a circular Gray code starting at 'start'
   */

  // Step 1: Generate standard Gray code sequence
  // Gray code formula: i XOR (i >> 1)
  const grayCode = [];
  const totalNumbers = 1 << n; // 1 << n = 2^n

  for (let i = 0; i < totalNumbers; i++) {
    grayCode.push(i ^ (i >> 1));
  }

  // Step 2: Find the index of 'start' in the Gray code
  // We need to rotate the sequence to start at this position
  let startIndex = 0;
  for (let i = 0; i < grayCode.length; i++) {
    if (grayCode[i] === start) {
      startIndex = i;
      break;
    }
  }

  // Step 3: Rotate the sequence to start at 'startIndex'
  // Using slice for clarity
  const result = grayCode.slice(startIndex).concat(grayCode.slice(0, startIndex));

  return result;
}
```

```java
// Time: O(2^n) - we generate all 2^n numbers
// Space: O(2^n) - we store the entire sequence
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> circularPermutation(int n, int start) {
        /**
         * Generate a circular Gray code permutation starting at 'start'.
         *
         * @param n - The number of bits (sequence length is 2^n)
         * @param start - The starting value of the permutation
         * @return List of integers forming a circular Gray code starting at 'start'
         */

        // Step 1: Generate standard Gray code sequence
        // Gray code formula: i XOR (i >> 1)
        List<Integer> grayCode = new ArrayList<>();
        int totalNumbers = 1 << n;  // 1 << n = 2^n

        for (int i = 0; i < totalNumbers; i++) {
            grayCode.add(i ^ (i >> 1));
        }

        // Step 2: Find the index of 'start' in the Gray code
        // We need to rotate the sequence to start at this position
        int startIndex = 0;
        for (int i = 0; i < grayCode.size(); i++) {
            if (grayCode.get(i) == start) {
                startIndex = i;
                break;
            }
        }

        // Step 3: Rotate the sequence to start at 'startIndex'
        List<Integer> result = new ArrayList<>();

        // Add elements from startIndex to end
        for (int i = startIndex; i < grayCode.size(); i++) {
            result.add(grayCode.get(i));
        }

        // Add elements from beginning to startIndex-1
        for (int i = 0; i < startIndex; i++) {
            result.add(grayCode.get(i));
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2ⁿ)**

- We generate 2ⁿ numbers using the Gray code formula: O(2ⁿ)
- We find the index of `start` in the sequence: O(2ⁿ) in worst case
- We rotate the sequence: O(2ⁿ) for creating the new list
- Total: O(2ⁿ) which is optimal since we must output 2ⁿ numbers

**Space Complexity: O(2ⁿ)**

- We store the entire Gray code sequence: O(2ⁿ)
- We store the result sequence: O(2ⁿ)
- Total: O(2ⁿ) which is optimal for storing the output

**Why this is optimal:**

- Any solution must output 2ⁿ numbers, so Ω(2ⁿ) time is required
- We use O(2ⁿ) space to store the output, which is necessary
- The algorithm is simple, efficient, and easy to understand

## Common Mistakes

1. **Forgetting the circular requirement**: Some candidates generate a valid Gray code but forget that the last element must also differ by 1 bit from the first. The standard Gray code already satisfies this, but if you try to build your own sequence from scratch, you might miss this requirement.

2. **Inefficient Gray code generation**: Some candidates try to generate Gray code recursively or using complex bit manipulation when the simple formula `i ^ (i >> 1)` works perfectly. Remember this formula for any Gray code problems.

3. **Wrong rotation logic**: When rotating the sequence to start at `start`, candidates might try to modify the sequence in-place or use complex index arithmetic. The simplest approach is to create a new list with the rotated elements.

4. **Not handling large n**: For n=16, we need to generate 65,536 numbers. Some candidates try recursive approaches that might cause stack overflow or use too much memory with intermediate data structures.

## When You'll See This Pattern

The Gray code pattern appears in several types of problems:

1. **Gray Code (LeetCode 89)**: Directly asks for Gray code sequence generation. The solution uses the same `i ^ (i >> 1)` formula.

2. **Minimum One Bit Operations to Make Integers Zero (LeetCode 1611)**: This problem involves transforming numbers using operations that flip bits, which relates to Gray code sequences.

3. **Circular Permutation in Binary Representation (this problem)**: Combines Gray code with sequence rotation.

4. **Problems involving Hamiltonian cycles in hypercubes**: Gray codes represent Hamiltonian paths in n-dimensional hypercubes, where vertices are bit strings and edges connect vertices differing by 1 bit.

**Why recognize this pattern**: When you see "differ by one bit" or "adjacent elements have Hamming distance 1", think Gray code. The formula `i ^ (i >> 1)` is a standard tool you should have in your toolkit.

## Key Takeaways

1. **Gray code is your friend**: When consecutive numbers must differ by exactly one bit, Gray code is almost always the solution. Remember the formula `i ^ (i >> 1)` generates the standard binary-reflected Gray code.

2. **Rotation preserves Gray code properties**: If you have a valid Gray code sequence, rotating it (changing the starting point) maintains all the 1-bit difference properties, including the circular property.

3. **Think about mathematical properties first**: Before diving into complex backtracking or graph algorithms, check if there's a known mathematical sequence or formula that solves the problem. Many "medium" bit manipulation problems have elegant mathematical solutions.

[Practice this problem on CodeJeet](/problem/circular-permutation-in-binary-representation)
