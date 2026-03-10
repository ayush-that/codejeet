---
title: "How to Solve Maximum Binary String After Change — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Binary String After Change. Medium difficulty, 48.0% acceptance rate. Topics: String, Greedy."
date: "2030-01-04"
category: "dsa-patterns"
tags: ["maximum-binary-string-after-change", "string", "greedy", "medium"]
---

# How to Solve Maximum Binary String After Change

You're given a binary string and can apply two operations: replace "00" with "10" (Operation 1), or replace "10" with "01" (Operation 2). The goal is to maximize the resulting binary string lexicographically. What makes this tricky is that operations can be applied in any order, and Operation 2 allows you to "bubble" 1's to the left, while Operation 1 creates new 1's from pairs of 0's.

## Visual Walkthrough

Let's trace through an example: `binary = "000110"`

**Step 1:** Look for "00" to apply Operation 1

- We have "00" at positions 0-1: `"000110"` → `"100110"`

**Step 2:** Apply Operation 2 to move 1's left

- We have "10" at positions 1-2: `"100110"` → `"010110"`
- Now "10" at positions 2-3: `"010110"` → `"001110"`

**Step 3:** Apply Operation 1 again

- "00" at positions 0-1: `"001110"` → `"101110"`

**Step 4:** Apply Operation 2 to move the new 1 left

- "10" at positions 1-2: `"101110"` → `"011110"`
- "10" at positions 2-3: `"011110"` → `"001111"`

**Step 5:** Apply Operation 1 one last time

- "00" at positions 0-1: `"001111"` → `"101111"`

Final result: `"101111"`

The pattern emerges: we can use Operation 1 to convert "00" → "10", creating a new 1. Then we use Operation 2 to "bubble" that 1 leftward past any 0's. The optimal strategy is to create as many 1's as possible from consecutive 0's, then position them at the leftmost possible positions.

## Brute Force Approach

A naive approach would try all possible sequences of operations. For a string of length n, there are O(2^n) possible operation sequences to consider (at each step, you might have multiple possible operations to apply). Even with memoization, this is exponential and impractical for n up to 10^5.

Another brute force idea: simulate operations greedily from left to right. But this fails because Operation 2 lets you move 1's backward, so the optimal sequence might involve creating 1's in the middle and then moving them left.

The key insight is that we don't need to simulate operations at all. We can determine the final string directly by counting zeros and understanding how they transform.

## Optimized Approach

Let's reason through the operations:

1. **Operation 2 ("10" → "01")**: This allows 1's to move left past 0's. In the final string, all 1's can be moved as far left as possible.

2. **Operation 1 ("00" → "10")**: This converts two consecutive 0's into "10" (a 1 followed by a 0). The new 1 can then be moved left using Operation 2.

**Key observations:**

- The first 1 in the original string acts as a "blocker" - all 1's to its right can't move past it using Operation 2.
- All consecutive 0's after the first 1 can be transformed into 1's (except possibly one 0).
- The optimal strategy: Find the first '1' in the string. All 0's before it remain 0's (can't create 1's from single 0's). For the zeros after the first 1, we can transform `k` consecutive 0's into `k-1` ones and one 0.

**Algorithm:**

1. Find the index of the first '1' in the string.
2. Count the total number of zeros in the entire string.
3. If there are no zeros or only one zero, return the original string (no transformation possible).
4. Construct the result:
   - All characters before the first '1' remain unchanged.
   - Place `(zero_count - 1)` ones after the first '1'.
   - Place one '0' after those ones.
   - Fill the rest with '1's (the original 1's from the input).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumBinaryString(binary: str) -> str:
    """
    Returns the maximum binary string after applying operations.

    The key insight is that we can transform all but one of the zeros
    after the first '1' into '1's, and then position that remaining zero
    optimally.
    """
    n = len(binary)

    # Find the first occurrence of '1'
    first_one = binary.find('1')

    # If there's no '1' or the string is all 1's
    if first_one == -1:
        # All zeros: we can transform "00" -> "10" repeatedly
        # The result will be all 1's except the last character
        return '1' * (n - 1) + '0' if n > 0 else ''

    # Count total zeros in the string
    zero_count = binary.count('0')

    # If there are 0 or 1 zeros, no transformation is beneficial
    if zero_count <= 1:
        return binary

    # Construct the result:
    # 1. Characters before the first '1' remain unchanged
    # 2. After the first '1', we place (zero_count - 1) ones
    # 3. Then place one zero
    # 4. Fill the rest with ones

    # Calculate positions
    # The zero will be at position: first_one + (zero_count - 1)
    zero_pos = first_one + (zero_count - 1)

    # Build the result character by character
    result = []
    for i in range(n):
        if i == zero_pos:
            result.append('0')
        else:
            result.append('1')

    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Returns the maximum binary string after applying operations.
 *
 * The key insight is that we can transform all but one of the zeros
 * after the first '1' into '1's, and then position that remaining zero
 * optimally.
 */
function maximumBinaryString(binary) {
  const n = binary.length;

  // Find the first occurrence of '1'
  const firstOne = binary.indexOf("1");

  // If there's no '1' or the string is all 1's
  if (firstOne === -1) {
    // All zeros: we can transform "00" -> "10" repeatedly
    // The result will be all 1's except the last character
    return n > 0 ? "1".repeat(n - 1) + "0" : "";
  }

  // Count total zeros in the string
  let zeroCount = 0;
  for (let i = 0; i < n; i++) {
    if (binary[i] === "0") zeroCount++;
  }

  // If there are 0 or 1 zeros, no transformation is beneficial
  if (zeroCount <= 1) {
    return binary;
  }

  // Calculate where the single zero should be
  // It will be at position: firstOne + (zeroCount - 1)
  const zeroPos = firstOne + (zeroCount - 1);

  // Build the result character by character
  const result = [];
  for (let i = 0; i < n; i++) {
    if (i === zeroPos) {
      result.push("0");
    } else {
      result.push("1");
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Returns the maximum binary string after applying operations.
     *
     * The key insight is that we can transform all but one of the zeros
     * after the first '1' into '1's, and then position that remaining zero
     * optimally.
     */
    public String maximumBinaryString(String binary) {
        int n = binary.length();

        // Find the first occurrence of '1'
        int firstOne = binary.indexOf('1');

        // If there's no '1' or the string is all 1's
        if (firstOne == -1) {
            // All zeros: we can transform "00" -> "10" repeatedly
            // The result will be all 1's except the last character
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n - 1; i++) {
                sb.append('1');
            }
            if (n > 0) sb.append('0');
            return sb.toString();
        }

        // Count total zeros in the string
        int zeroCount = 0;
        for (int i = 0; i < n; i++) {
            if (binary.charAt(i) == '0') zeroCount++;
        }

        // If there are 0 or 1 zeros, no transformation is beneficial
        if (zeroCount <= 1) {
            return binary;
        }

        // Calculate where the single zero should be
        // It will be at position: firstOne + (zeroCount - 1)
        int zeroPos = firstOne + (zeroCount - 1);

        // Build the result character by character
        char[] result = new char[n];
        for (int i = 0; i < n; i++) {
            if (i == zeroPos) {
                result[i] = '0';
            } else {
                result[i] = '1';
            }
        }

        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Finding the first '1': O(n) in worst case
- Counting zeros: O(n)
- Building the result: O(n)
- Total: O(n) where n is the length of the input string

**Space Complexity:** O(n)

- We need to store the result string of length n
- In Python/JavaScript, we build a list/array of characters
- In Java, we create a char array
- All implementations use O(n) additional space

## Common Mistakes

1. **Simulating operations directly**: Trying to actually apply the operations in sequence. This is O(n²) in worst case (moving a 1 from the end to the beginning takes O(n) operations, and you might have O(n) such moves).

2. **Forgetting the edge case of all zeros**: When the string contains no '1's, the formula changes. The result should be all '1's except for the last character, which should be '0'.

3. **Incorrect zero positioning**: Placing the single zero at the wrong position. It should be at `first_one + zero_count - 1`, not `zero_count - 1`. The first '1' acts as a pivot point.

4. **Not handling small strings**: For strings with 0 or 1 zeros, no transformation improves the string. Returning a modified version would actually make it worse.

## When You'll See This Pattern

This problem uses **greedy optimization with positional analysis** - a pattern where you determine the final state directly without simulating intermediate steps. Similar problems include:

1. **Maximum Swap (LeetCode 670)**: You can swap two digits once to maximize a number. Like this problem, you don't try all swaps; you analyze digit positions to find the optimal swap.

2. **Next Permutation (LeetCode 31)**: Find the next lexicographically greater permutation. You analyze from the right to find the first decreasing element, then swap with the smallest larger element to its right.

3. **Minimum Number of Swaps to Make the String Balanced (LeetCode 1963)**: Count mismatches and calculate the minimum swaps needed without simulating each swap.

## Key Takeaways

1. **Don't simulate when you can calculate**: Many string transformation problems seem to require step-by-step simulation, but often the final state can be determined directly through analysis of the operations' effects.

2. **Look for invariant properties**: Operation 2 lets 1's move left past 0's, which means in the final optimal string, 1's will be as left as possible. Operation 1 creates new 1's from 00 pairs. Combining these insights gives the direct formula.

3. **Handle edge cases systematically**: All zeros, all ones, single zero, and empty string are all special cases that need explicit handling in this problem.

Related problems: [Longest Binary Subsequence Less Than or Equal to K](/problem/longest-binary-subsequence-less-than-or-equal-to-k)
