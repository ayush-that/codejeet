---
title: "How to Solve Largest Combination With Bitwise AND Greater Than Zero — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Combination With Bitwise AND Greater Than Zero. Medium difficulty, 80.8% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Counting."
date: "2026-08-14"
category: "dsa-patterns"
tags:
  [
    "largest-combination-with-bitwise-and-greater-than-zero",
    "array",
    "hash-table",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Largest Combination With Bitwise AND Greater Than Zero

This problem asks us to find the size of the largest combination of elements from an array where the bitwise AND of all elements in that combination is greater than zero. The key insight is that for a bitwise AND to be positive, at least one bit position must have a 1 in every number of the combination. This transforms the problem from checking all possible combinations (which would be exponential) to a counting problem we can solve efficiently.

## Visual Walkthrough

Let's trace through an example: `candidates = [16, 17, 71, 62, 12, 24, 14]`

**Step 1: Understanding the requirement**
For a combination to have AND > 0, there must be at least one bit position where every number in the combination has a 1. For example:

- Numbers 17 (10001₂), 71 (1000111₂), and 62 (111110₂) all have the 1-bit position (2⁰ = 1) set to 1
- Their AND would be > 0 because 17 & 71 & 62 = 1

**Step 2: Counting bits by position**
Instead of checking combinations, we count how many numbers have each bit position set to 1:

| Number | Binary  | Bit positions with 1 |
| ------ | ------- | -------------------- |
| 16     | 10000   | 4                    |
| 17     | 10001   | 4, 0                 |
| 71     | 1000111 | 6, 2, 1, 0           |
| 62     | 111110  | 5, 4, 3, 2, 1        |
| 12     | 1100    | 3, 2                 |
| 24     | 11000   | 4, 3                 |
| 14     | 1110    | 3, 2, 1              |

**Step 3: Counting occurrences per bit position**

- Bit 0: 17, 71 → 2 numbers
- Bit 1: 71, 62, 14 → 3 numbers
- Bit 2: 71, 62, 12, 14 → 4 numbers
- Bit 3: 62, 12, 24, 14 → 4 numbers
- Bit 4: 16, 17, 62, 24 → 4 numbers
- Bit 5: 62 → 1 number
- Bit 6: 71 → 1 number

**Step 4: Finding the maximum**
The largest count is 4 (for bits 2, 3, and 4). This means the largest combination with AND > 0 has size 4. For example, all numbers with bit 2 set: [71, 62, 12, 14] have AND = 2 (000010₂) > 0.

## Brute Force Approach

A naive approach would be to generate all possible combinations (subsets) of the array, compute their bitwise AND, and track the largest combination with AND > 0. For an array of size n, there are 2ⁿ possible subsets.

**Why this fails:**

- Time complexity: O(2ⁿ × n) - exponential time
- For n = 30, that's over 1 billion combinations
- The problem constraints (up to 10⁵ elements) make this completely infeasible

Even with optimization (stopping early, pruning), the exponential nature makes brute force impractical for realistic inputs.

## Optimized Approach

The key insight comes from understanding bitwise AND properties:

1. **Bit independence**: AND operates on each bit position independently
2. **AND > 0 condition**: For AND to be positive, at least one bit position must have all 1's in the combination
3. **Maximum combination**: The largest combination will be formed by taking all numbers that share a 1 in the same bit position

**Reasoning step-by-step:**

1. Instead of checking combinations, check each bit position (0 to 31 for 32-bit integers)
2. For each bit position, count how many numbers have that bit set to 1
3. The maximum count across all bit positions gives us the size of the largest valid combination
4. Why does this work? Any combination where all numbers share a 1 in the same bit position will have AND > 0 for that bit, making the overall AND > 0

**Why we don't need to check combinations:**

- If we pick all numbers with bit i set, their AND will have bit i = 1, so AND > 0
- This is the largest possible combination for that bit
- No combination can be larger than the count of numbers sharing any particular bit

## Optimal Solution

<div class="code-group">

```python
# Time: O(32 * n) = O(n) | Space: O(1)
def largestCombination(candidates):
    """
    Finds the size of the largest combination where bitwise AND > 0.

    The key insight: For AND to be > 0, at least one bit position must have
    a 1 in every number of the combination. So we find the bit position
    where the most numbers have that bit set.
    """
    max_size = 0

    # Check each bit position from 0 to 31 (for 32-bit integers)
    # We only need to check up to 24 because max candidate value is 10^7 < 2^24
    for bit in range(24):  # 2^24 ≈ 16.7 million > 10^7
        count = 0

        # Count how many numbers have this bit set
        for num in candidates:
            # Check if the bit at position 'bit' is 1
            # (num >> bit) & 1 shifts the number right by 'bit' positions
            # then checks if the least significant bit is 1
            if (num >> bit) & 1:
                count += 1

        # Update max_size if this bit position has more numbers
        max_size = max(max_size, count)

    return max_size
```

```javascript
// Time: O(32 * n) = O(n) | Space: O(1)
function largestCombination(candidates) {
  /**
   * Finds the size of the largest combination where bitwise AND > 0.
   *
   * The key insight: For AND to be > 0, at least one bit position must have
   * a 1 in every number of the combination. So we find the bit position
   * where the most numbers have that bit set.
   */
  let maxSize = 0;

  // Check each bit position from 0 to 31 (for 32-bit integers)
  // We only need to check up to 24 because max candidate value is 10^7 < 2^24
  for (let bit = 0; bit < 24; bit++) {
    let count = 0;

    // Count how many numbers have this bit set
    for (const num of candidates) {
      // Check if the bit at position 'bit' is 1
      // (num >> bit) & 1 shifts the number right by 'bit' positions
      // then checks if the least significant bit is 1
      if ((num >> bit) & 1) {
        count++;
      }
    }

    // Update maxSize if this bit position has more numbers
    maxSize = Math.max(maxSize, count);
  }

  return maxSize;
}
```

```java
// Time: O(32 * n) = O(n) | Space: O(1)
class Solution {
    public int largestCombination(int[] candidates) {
        /**
         * Finds the size of the largest combination where bitwise AND > 0.
         *
         * The key insight: For AND to be > 0, at least one bit position must have
         * a 1 in every number of the combination. So we find the bit position
         * where the most numbers have that bit set.
         */
        int maxSize = 0;

        // Check each bit position from 0 to 31 (for 32-bit integers)
        // We only need to check up to 24 because max candidate value is 10^7 < 2^24
        for (int bit = 0; bit < 24; bit++) {
            int count = 0;

            // Count how many numbers have this bit set
            for (int num : candidates) {
                // Check if the bit at position 'bit' is 1
                // (num >> bit) & 1 shifts the number right by 'bit' positions
                // then checks if the least significant bit is 1
                if (((num >> bit) & 1) == 1) {
                    count++;
                }
            }

            // Update maxSize if this bit position has more numbers
            maxSize = Math.max(maxSize, count);
        }

        return maxSize;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through 24 bit positions (constant)
- For each bit position, we iterate through all n numbers
- Total operations: 24 × n = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (max_size, count, bit)
- No additional data structures that scale with input size
- The input array is given, not counted in our space usage

**Why 24 bits?**

- The problem states candidates[i] ≤ 10⁷
- 2²³ = 8,388,608 < 10⁷
- 2²⁴ = 16,777,216 > 10⁷
- So we need to check bits 0-23 (24 bits total)

## Common Mistakes

1. **Checking all 32 bits unnecessarily**: Some candidates check all 32 bits for 32-bit integers, which works but is slightly less efficient. The optimal approach checks only up to bit 23 since max value is 10⁷.

2. **Misunderstanding the AND condition**: Thinking the combination must have ALL bits in common rather than just ONE bit in common. Remember: AND > 0 means at least one bit position has 1 in all numbers.

3. **Off-by-one in bit shifting**: Using `(1 << bit) & num` instead of `(num >> bit) & 1`. Both work, but the latter is more common. The key is consistency.

4. **Forgetting to handle empty input**: While the problem guarantees at least one element, in interviews you might mention that for empty input, the answer would be 0.

5. **Trying to find the actual combination**: The problem only asks for the size, not the elements. Some candidates waste time trying to track which numbers form the combination.

## When You'll See This Pattern

This "bit counting" pattern appears in several bit manipulation problems:

1. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Uses a similar approach of examining bits from most significant to least significant, building the maximum XOR bit by bit.

2. **Counting Bits (LeetCode 338)**: While simpler, it teaches the fundamental pattern of examining numbers bit by bit.

3. **Total Hamming Distance (LeetCode 477)**: Counts how many numbers have each bit set, similar to our approach, then uses those counts to compute distances.

4. **Single Number II (LeetCode 137)**: Uses bit counting with modulo 3 to find the number that appears once while others appear three times.

The core pattern: When a bitwise operation (AND, OR, XOR) has a property that can be checked per bit position independently, you can often solve the problem by counting bits per position.

## Key Takeaways

1. **Bit independence is powerful**: When dealing with bitwise operations, remember that each bit position operates independently. This often lets you break problems into 32 (or 64) smaller, parallel problems.

2. **Transform combination problems into counting problems**: Instead of exponential combination checking, look for properties that let you count valid elements. Here, "AND > 0" becomes "count numbers with bit i set" for each i.

3. **Know your bit operations cold**: `(num >> k) & 1` checks if the k-th bit is set. `(1 << k) & num` does the same. `num & (num-1)` clears the lowest set bit. These idioms come up repeatedly.

4. **Consider constraints for optimization**: The 10⁷ maximum value told us we only need 24 bits, not 32. Always check constraints for potential optimizations.

Related problems: [Count Number of Maximum Bitwise-OR Subsets](/problem/count-number-of-maximum-bitwise-or-subsets)
