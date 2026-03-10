---
title: "How to Solve Gray Code — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Gray Code. Medium difficulty, 64.1% acceptance rate. Topics: Math, Backtracking, Bit Manipulation."
date: "2027-07-22"
category: "dsa-patterns"
tags: ["gray-code", "math", "backtracking", "bit-manipulation", "medium"]
---

# How to Solve Gray Code

The Gray Code problem asks us to generate a sequence of numbers from 0 to 2ⁿ - 1 where consecutive numbers differ by exactly one bit. What makes this problem interesting is that it's not about finding a single answer—there are multiple valid Gray code sequences—but about constructing one systematically. The challenge lies in understanding the pattern that allows us to generate these sequences efficiently without backtracking through all permutations.

## Visual Walkthrough

Let's trace through what a Gray code sequence looks like for n = 3:

We need to generate all 8 numbers (0 through 7) where consecutive numbers differ by exactly one bit.

One valid 3-bit Gray code sequence is:

```
0: 000
1: 001  (changed rightmost bit)
3: 011  (changed middle bit)
2: 010  (changed rightmost bit)
6: 110  (changed leftmost bit)
7: 111  (changed rightmost bit)
5: 101  (changed middle bit)
4: 100  (changed rightmost bit)
```

Notice the pattern: Starting with [0], we can generate the sequence by:

1. Taking the existing sequence
2. Reflecting it (reading it backwards)
3. Adding a 1 to the front of each reflected number
4. Appending this new list to the original

For n = 1: [0, 1]
For n = 2: Take [0, 1], reflect to get [1, 0], add 1<<1 (2) to each: [3, 2]
Result: [0, 1, 3, 2] (which in binary is 00, 01, 11, 10)

For n = 3: Take [0, 1, 3, 2], reflect to get [2, 3, 1, 0], add 1<<2 (4) to each: [6, 7, 5, 4]
Result: [0, 1, 3, 2, 6, 7, 5, 4]

This is exactly the sequence we traced above!

## Brute Force Approach

A naive approach would be to generate all permutations of numbers 0 through 2ⁿ - 1 and check which ones satisfy the Gray code property. However, this is completely impractical:

1. There are (2ⁿ)! permutations to check
2. For n = 3, that's 8! = 40,320 permutations
3. For n = 4, that's 16! ≈ 2.09 × 10¹³ permutations
4. Checking each permutation requires O(2ⁿ) time to verify the single-bit difference property

Even for small n, this approach is computationally infeasible. A candidate might also try backtracking—building the sequence incrementally and backtracking when stuck—but this still explores many invalid paths and becomes slow for larger n.

## Optimized Approach

The key insight is that Gray codes follow a recursive pattern known as "reflected binary Gray code." Here's the step-by-step reasoning:

1. **Base case**: For n = 1, the Gray code is simply [0, 1]
2. **Recursive step**: To get the Gray code for n bits:
   - Take the Gray code for (n-1) bits
   - Create a reflected copy (reverse the sequence)
   - Prefix each number in the reflected copy with a 1 (which means adding 2ⁿ⁻¹ to each number)
   - Append the reflected, prefixed sequence to the original

Why does this work? Because:

- The original sequence already has the Gray code property
- The reflected sequence also has the Gray code property (reversing doesn't break single-bit differences)
- The last element of the original and first element of the reflected differ by exactly one bit (the newly added leading 1)
- Within the reflected portion, consecutive elements still differ by one bit in the lower (n-1) bits

This gives us an O(2ⁿ) solution, which is optimal since we need to generate 2ⁿ numbers.

## Optimal Solution

Here's the implementation using the reflected binary Gray code approach:

<div class="code-group">

```python
# Time: O(2^n) - We generate 2^n numbers
# Space: O(2^n) - We store 2^n numbers in the result
def grayCode(n):
    """
    Generate an n-bit Gray code sequence.

    The approach uses the reflected binary Gray code method:
    1. Start with base case n=1: [0, 1]
    2. For each additional bit, take the previous sequence,
       reflect it (reverse it), and add 2^(i-1) to each element
       in the reflected sequence.
    3. Append the modified reflected sequence to the original.
    """
    # Base case: 1-bit Gray code
    result = [0, 1]

    # Build up from 2 bits to n bits
    for i in range(2, n + 1):
        # Calculate the value to add for the new most significant bit
        # This is 2^(i-1), which sets the (i-1)th bit to 1
        add_value = 1 << (i - 1)

        # Take the current sequence, reverse it, and add add_value to each element
        # This creates the reflected portion with the new MSB set to 1
        reflected = [x + add_value for x in reversed(result)]

        # Append the reflected portion to complete the i-bit Gray code
        result.extend(reflected)

    # If n=0, we need to return just [0]
    # Our loop doesn't run when n=0 or n=1, so handle n=0 specially
    if n == 0:
        return [0]
    elif n == 1:
        return result
    else:
        return result

# Alternative concise version using the same logic
def grayCode_concise(n):
    """More concise version of the same algorithm."""
    result = [0]

    for i in range(n):
        # For each bit position, reflect and add 2^i
        result += [x + (1 << i) for x in reversed(result)]

    return result
```

```javascript
// Time: O(2^n) - We generate 2^n numbers
// Space: O(2^n) - We store 2^n numbers in the result
function grayCode(n) {
  /**
   * Generate an n-bit Gray code sequence.
   *
   * The approach uses the reflected binary Gray code method:
   * 1. Start with base case [0]
   * 2. For each bit from 0 to n-1, take the current sequence,
   *    reverse it, and add 2^i to each element in the reversed sequence.
   * 3. Append the modified reversed sequence to the original.
   */

  // Start with the 0-bit Gray code (just 0)
  let result = [0];

  // Build up from 1 bit to n bits
  for (let i = 0; i < n; i++) {
    // Calculate the value to add for the current bit position
    // This is 2^i, which sets the ith bit to 1
    const addValue = 1 << i;

    // Get the current length before we modify the array
    const currentLength = result.length;

    // Process the current sequence in reverse order
    for (let j = currentLength - 1; j >= 0; j--) {
      // Take each element from the end to the beginning,
      // add addValue to it, and push it to the result
      result.push(result[j] + addValue);
    }
  }

  return result;
}

// Alternative using map and reverse
function grayCodeAlt(n) {
  let result = [0];

  for (let i = 0; i < n; i++) {
    const addValue = 1 << i;
    // Create the reflected portion by reversing and adding addValue
    const reflected = result
      .slice()
      .reverse()
      .map((x) => x + addValue);
    // Append the reflected portion
    result = result.concat(reflected);
  }

  return result;
}
```

```java
// Time: O(2^n) - We generate 2^n numbers
// Space: O(2^n) - We store 2^n numbers in the result
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> grayCode(int n) {
        /**
         * Generate an n-bit Gray code sequence.
         *
         * The approach uses the reflected binary Gray code method:
         * 1. Start with base case containing only 0
         * 2. For each bit from 0 to n-1, take the current sequence,
         *    process it in reverse order, and add 2^i to each element.
         * 3. Append these new numbers to the sequence.
         */

        List<Integer> result = new ArrayList<>();
        // Start with the 0-bit Gray code (just 0)
        result.add(0);

        // Build up from 1 bit to n bits
        for (int i = 0; i < n; i++) {
            // Calculate the value to add for the current bit position
            // This is 2^i, which sets the ith bit to 1
            int addValue = 1 << i;

            // Process the current sequence in reverse order
            // We need to store the size before the loop because
            // we'll be adding to the list during iteration
            int currentSize = result.size();

            for (int j = currentSize - 1; j >= 0; j--) {
                // Take each element from the end to the beginning,
                // add addValue to it, and add it to the result
                int newValue = result.get(j) + addValue;
                result.add(newValue);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2ⁿ)**

- We generate exactly 2ⁿ numbers in the sequence
- For each bit from 0 to n-1, we double the size of our sequence
- The total number of operations is 1 + 2 + 4 + ... + 2ⁿ⁻¹ = 2ⁿ - 1, which is O(2ⁿ)

**Space Complexity: O(2ⁿ)**

- We need to store all 2ⁿ numbers in the output list
- The algorithm itself uses O(1) additional space (excluding the output)
- If we consider the output as part of the space complexity (which we typically do), it's O(2ⁿ)

This is optimal because any solution must output 2ⁿ numbers, so we can't do better than O(2ⁿ) time and space.

## Common Mistakes

1. **Off-by-one errors with bit shifting**: When calculating `1 << (i-1)` vs `1 << i`, it's easy to get confused. Remember: for the i-th iteration (starting from 0), we're adding the i-th bit, which is `1 << i`. In the Python version with range(2, n+1), we use `1 << (i-1)` because i represents the number of bits, not the iteration index.

2. **Forgetting the n=0 edge case**: When n=0, we should return [0], not an empty list. The problem states the range is [0, 2ⁿ - 1], and when n=0, 2⁰ - 1 = 0, so we only have 0.

3. **Incorrect reflection logic**: Some candidates try to modify the list while iterating over it, which can cause infinite loops or incorrect results. Always store the current size before adding new elements, or create a separate list for the reflected portion.

4. **Misunderstanding the problem requirements**: The problem doesn't require a specific Gray code sequence—any valid sequence is acceptable. Some candidates waste time trying to match a specific sequence they've memorized rather than generating a valid one systematically.

## When You'll See This Pattern

The reflected binary Gray code pattern appears in several contexts:

1. **Combinatorial generation problems**: Similar patterns appear in generating subsets (LeetCode 78 - Subsets), combinations (LeetCode 77 - Combinations), and permutations (LeetCode 46 - Permutations), though those use backtracking rather than the reflection trick.

2. **Bit manipulation problems**: Problems that involve generating all binary numbers or working with binary representations often use similar techniques. For example, counting bits (LeetCode 338 - Counting Bits) uses a related pattern where f(n) = f(n/2) + (n % 2).

3. **Recursive sequence generation**: The "reflect and prefix" pattern is a specific instance of a more general technique for building sequences recursively. You'll see similar patterns in problems like generating parentheses (LeetCode 22 - Generate Parentheses) or different ways to add parentheses (LeetCode 241 - Different Ways to Add Parentheses).

## Key Takeaways

1. **Recognize recursive structure**: Many sequence generation problems have a recursive structure where the solution for n can be built from the solution for n-1. Look for patterns where you can construct larger solutions from smaller ones.

2. **Understand bit manipulation patterns**: The relationship `grayCode(n) = grayCode(n-1) + [reverse(grayCode(n-1)) with MSB set to 1]` is a specific bit manipulation pattern. Recognizing that setting the most significant bit corresponds to adding 2ⁿ⁻¹ is key.

3. **Edge cases matter**: Always test n=0 and n=1. These small cases often reveal flaws in the general algorithm and help ensure correctness.

Related problems: [1-bit and 2-bit Characters](/problem/1-bit-and-2-bit-characters)
