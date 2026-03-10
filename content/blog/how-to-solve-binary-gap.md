---
title: "How to Solve Binary Gap — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Gap. Easy difficulty, 74.1% acceptance rate. Topics: Bit Manipulation."
date: "2028-09-03"
category: "dsa-patterns"
tags: ["binary-gap", "bit-manipulation", "easy"]
---

# How to Solve Binary Gap

The Binary Gap problem asks us to find the maximum number of consecutive zeros between two ones in the binary representation of a positive integer. While conceptually simple, this problem tests your ability to work with binary representations and track state while iterating through bits. The tricky part is correctly handling edge cases like numbers with only one '1' bit or numbers where the longest gap might be at the beginning or end.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `n = 1041` (binary: `10000010001`):

```
Binary: 1 0 0 0 0 0 1 0 0 0 1
Index:  0 1 2 3 4 5 6 7 8 9 10
```

We need to find the longest sequence of zeros between any two ones:

1. **First gap** (between index 0 and index 6): `0 0 0 0 0` → 5 zeros
2. **Second gap** (between index 6 and index 10): `0 0 0` → 3 zeros

The longest distance is 5. Notice that we only count zeros _between_ ones - trailing zeros after the last '1' don't count toward any gap.

Another example: `n = 32` (binary: `100000`)

```
Binary: 1 0 0 0 0 0
Index:  0 1 2 3 4 5
```

Here we have only one '1', so there are no two ones to form a gap. The answer should be 0.

## Brute Force Approach

A naive approach would be:

1. Convert the integer to its binary string representation
2. Find all positions of '1's in the string
3. For each pair of consecutive '1's, count the zeros between them
4. Return the maximum count

While this approach works, it's inefficient in terms of space (storing the entire binary string) and requires multiple passes. More importantly, it doesn't teach us the bit manipulation skills that interviewers are looking for in this problem.

A better brute force would iterate through bits one by one, but without the state tracking we'll see in the optimal solution. This might involve storing all '1' positions in an array first, then calculating differences.

## Optimal Solution

The optimal solution uses a single pass through the bits while tracking state. We maintain:

- `max_gap`: the maximum gap found so far
- `current_gap`: the number of zeros in the current gap
- `found_one`: a flag indicating if we've seen at least one '1'

The algorithm:

1. Initialize variables to track the maximum gap and current gap
2. Iterate through bits from LSB to MSB (or vice versa)
3. When we find a '1':
   - If we've already seen a '1', update `max_gap` with `current_gap` if it's larger
   - Reset `current_gap` to 0
   - Mark that we've found a '1'
4. When we find a '0':
   - If we've already seen a '1', increment `current_gap`
5. Return `max_gap`

The key insight is that we only start counting zeros _after_ we've seen our first '1', and we reset the count each time we see another '1'.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def binary_gap(n: int) -> int:
    """
    Find the longest distance between two adjacent 1's in binary representation.

    Args:
        n: Positive integer

    Returns:
        Maximum number of consecutive zeros between two 1's
    """
    max_gap = 0          # Track the maximum gap found
    current_gap = 0      # Track zeros in current gap
    found_one = False    # Flag to indicate we've seen at least one '1'

    # Iterate through bits while n > 0
    while n > 0:
        # Check if the least significant bit is 1
        if n & 1:
            # If we've already found a '1' before, update max_gap
            if found_one:
                max_gap = max(max_gap, current_gap)
            # Reset current gap for the next potential gap
            current_gap = 0
            # Mark that we've found at least one '1'
            found_one = True
        else:
            # Only count zeros if we've already seen a '1'
            # (This ignores leading zeros before the first '1')
            if found_one:
                current_gap += 1

        # Right shift to check the next bit
        n >>= 1

    return max_gap
```

```javascript
// Time: O(log n) | Space: O(1)
function binaryGap(n) {
  /**
   * Find the longest distance between two adjacent 1's in binary representation.
   *
   * @param {number} n - Positive integer
   * @return {number} Maximum number of consecutive zeros between two 1's
   */
  let maxGap = 0; // Track the maximum gap found
  let currentGap = 0; // Track zeros in current gap
  let foundOne = false; // Flag to indicate we've seen at least one '1'

  // Iterate through bits while n > 0
  while (n > 0) {
    // Check if the least significant bit is 1
    if (n & 1) {
      // If we've already found a '1' before, update maxGap
      if (foundOne) {
        maxGap = Math.max(maxGap, currentGap);
      }
      // Reset current gap for the next potential gap
      currentGap = 0;
      // Mark that we've found at least one '1'
      foundOne = true;
    } else {
      // Only count zeros if we've already seen a '1'
      // (This ignores leading zeros before the first '1')
      if (foundOne) {
        currentGap++;
      }
    }

    // Right shift to check the next bit
    n >>= 1;
  }

  return maxGap;
}
```

```java
// Time: O(log n) | Space: O(1)
public int binaryGap(int n) {
    /**
     * Find the longest distance between two adjacent 1's in binary representation.
     *
     * @param n Positive integer
     * @return Maximum number of consecutive zeros between two 1's
     */
    int maxGap = 0;      // Track the maximum gap found
    int currentGap = 0;  // Track zeros in current gap
    boolean foundOne = false; // Flag to indicate we've seen at least one '1'

    // Iterate through bits while n > 0
    while (n > 0) {
        // Check if the least significant bit is 1
        if ((n & 1) == 1) {
            // If we've already found a '1' before, update maxGap
            if (foundOne) {
                maxGap = Math.max(maxGap, currentGap);
            }
            // Reset current gap for the next potential gap
            currentGap = 0;
            // Mark that we've found at least one '1'
            foundOne = true;
        } else {
            // Only count zeros if we've already seen a '1'
            // (This ignores leading zeros before the first '1')
            if (foundOne) {
                currentGap++;
            }
        }

        // Right shift to check the next bit
        n >>= 1;
    }

    return maxGap;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We iterate through each bit of the number
- A positive integer `n` has approximately log₂(n) bits
- Each iteration performs constant-time operations (bitwise AND, comparison, increment)

**Space Complexity:** O(1)

- We use only a fixed number of integer variables (`max_gap`, `current_gap`, `found_one`)
- No additional data structures that grow with input size

## Common Mistakes

1. **Counting leading zeros:** Forgetting to use the `found_one` flag and counting zeros before the first '1'. Example: `n = 32` (100000) should return 0, not 5.

2. **Not resetting current_gap properly:** When finding a '1', you must reset `current_gap` to 0 to start counting the next gap fresh.

3. **Off-by-one in gap calculation:** Remember that if you have `k` zeros between two ones, the distance is `k`, not `k+1`. For example, binary `101` has 1 zero between the ones, not 2.

4. **Infinite loop with negative numbers:** The problem states `n` is positive, but if you accidentally handle negative numbers, right-shifting in some languages (like Java) preserves the sign bit, causing infinite loops. Always check `n > 0`.

## When You'll See This Pattern

This pattern of iterating through bits while tracking state appears in many bit manipulation problems:

1. **Number of 1 Bits (LeetCode 191):** Count the number of '1' bits in an integer using similar bit iteration.

2. **Counting Bits (LeetCode 338):** Count bits for all numbers from 0 to n, often using the relationship `bits[n] = bits[n >> 1] + (n & 1)`.

3. **Reverse Bits (LeetCode 190):** Reverse the bits of a given integer, requiring similar bit extraction and reconstruction.

4. **Single Number (LeetCode 136):** Find the number that appears once in an array where all others appear twice, using XOR operations on bits.

The core technique is extracting bits one by one using `n & 1` and `n >>= 1`, then making decisions based on the bit values while maintaining some state.

## Key Takeaways

1. **Bit extraction pattern:** Use `n & 1` to check the LSB and `n >>= 1` to shift bits right. This is more efficient than converting to string for bit analysis.

2. **State tracking in single pass:** Many problems can be solved in one pass by tracking relevant state (like `found_one` and `current_gap`) rather than storing intermediate results.

3. **Edge case awareness:** Always consider numbers with 0 or 1 '1' bits, as well as numbers where the binary gap might be at the beginning or end.

[Practice this problem on CodeJeet](/problem/binary-gap)
