---
title: "How to Solve Minimum Suffix Flips — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Suffix Flips. Medium difficulty, 73.9% acceptance rate. Topics: String, Greedy."
date: "2028-02-28"
category: "dsa-patterns"
tags: ["minimum-suffix-flips", "string", "greedy", "medium"]
---

# How to Solve Minimum Suffix Flips

You're given a binary string `target` and need to transform an all-zeros string `s` into `target` by flipping all bits from some index `i` to the end. The challenge is finding the minimum number of such operations needed. What makes this problem interesting is that each operation affects multiple positions, creating dependencies that require careful tracking of the current state.

## Visual Walkthrough

Let's trace through `target = "001011"` step by step:

**Initial state:** `s = "000000"`, flips = 0

**Step 1:** Compare `s[0]` with `target[0]`

- `s[0] = '0'`, `target[0] = '0'` → match ✓
- No flip needed

**Step 2:** Compare `s[1]` with `target[1]`

- `s[1] = '0'`, `target[1] = '0'` → match ✓
- No flip needed

**Step 3:** Compare `s[2]` with `target[2]`

- `s[2] = '0'`, `target[2] = '1'` → mismatch ✗
- Need to flip from index 2 to end
- After flip: `s = "001111"`, flips = 1

**Step 4:** Compare `s[3]` with `target[3]`

- `s[3] = '1'`, `target[3] = '0'` → mismatch ✗
- Need to flip from index 3 to end
- After flip: `s = "001000"`, flips = 2

**Step 5:** Compare `s[4]` with `target[4]`

- `s[4] = '0'`, `target[4] = '1'` → mismatch ✗
- Need to flip from index 4 to end
- After flip: `s = "001011"`, flips = 3

**Step 6:** Compare `s[5]` with `target[5]`

- `s[5] = '1'`, `target[5] = '1'` → match ✓
- Done!

**Result:** 3 flips needed

The key insight: We only need to flip when the current bit doesn't match the target, and each flip affects all subsequent bits, so we need to track whether we're in a "flipped" state.

## Brute Force Approach

A naive approach would try all possible sequences of flips. For each position `i`, we could decide whether to flip from `i` to the end. With `n` positions, there are 2ⁿ possible flip sequences to check. We'd need to:

1. Generate all possible flip sequences
2. Apply each sequence to the initial string
3. Check if the result matches the target
4. Track the minimum length of successful sequences

This is clearly exponential time (O(2ⁿ)), which is impractical for even moderately sized inputs (n = 20 would mean checking over 1 million sequences).

Even a slightly better brute force would try flipping at each mismatch position, but without tracking the current state properly, it would fail. For example, if you just flip whenever `s[i] != target[i]` without considering previous flips, you'll get wrong results.

## Optimized Approach

The optimal solution uses a **greedy approach with state tracking**:

**Key Insight:** We process the string from left to right. At each position, we compare what the current bit _should be_ (considering all previous flips) with the target bit. If they don't match, we perform a flip operation starting at this position.

**Why greedy works:** Once we fix position `i`, we never need to consider flipping at positions before `i` again. Each flip operation affects all bits from `i` to the end, so by processing left to right, we ensure that once we've matched a prefix of the string, we never need to change it again.

**State tracking:** We need to know whether the current position is in a "flipped" state due to previous operations. Instead of actually modifying the string (which would be O(n²) if we flip the entire suffix each time), we maintain a `flipped` boolean that tells us whether an odd number of flips have affected the current position.

**Algorithm:**

1. Initialize `flips = 0` and `flipped = False`
2. For each position `i` from 0 to n-1:
   - Determine current bit value: `0` if not flipped, `1` if flipped
   - If current bit ≠ target[i]:
     - Increment `flips`
     - Toggle `flipped` (True → False, False → True)
3. Return `flips`

**Why this works:** Each time we flip, we're essentially saying "from this position onward, all bits should be the opposite of what they currently are." By toggling the `flipped` state, we propagate this information forward without actually modifying the string.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minFlips(target: str) -> int:
    """
    Calculate minimum suffix flips to transform all zeros to target.

    Args:
        target: Binary string to achieve

    Returns:
        Minimum number of flip operations needed
    """
    flips = 0          # Count of flip operations performed
    flipped = False    # Whether current position is in flipped state

    # Process each character from left to right
    for bit in target:
        # Determine what the current bit would be in our simulated string
        # If flipped is True, current bit is '1' (since we started with all '0's)
        # If flipped is False, current bit is '0'
        current_bit = '1' if flipped else '0'

        # If current bit doesn't match target, we need to flip
        if current_bit != bit:
            flips += 1          # Perform a flip operation
            flipped = not flipped  # Toggle the flipped state for all future bits

    return flips
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum suffix flips to transform all zeros to target.
 * @param {string} target - Binary string to achieve
 * @return {number} Minimum number of flip operations needed
 */
function minFlips(target) {
  let flips = 0; // Count of flip operations performed
  let flipped = false; // Whether current position is in flipped state

  // Process each character from left to right
  for (let i = 0; i < target.length; i++) {
    const bit = target[i];

    // Determine what the current bit would be in our simulated string
    // If flipped is true, current bit is '1' (since we started with all '0's)
    // If flipped is false, current bit is '0'
    const currentBit = flipped ? "1" : "0";

    // If current bit doesn't match target, we need to flip
    if (currentBit !== bit) {
      flips++; // Perform a flip operation
      flipped = !flipped; // Toggle the flipped state for all future bits
    }
  }

  return flips;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate minimum suffix flips to transform all zeros to target.
     * @param target Binary string to achieve
     * @return Minimum number of flip operations needed
     */
    public int minFlips(String target) {
        int flips = 0;           // Count of flip operations performed
        boolean flipped = false; // Whether current position is in flipped state

        // Process each character from left to right
        for (int i = 0; i < target.length(); i++) {
            char bit = target.charAt(i);

            // Determine what the current bit would be in our simulated string
            // If flipped is true, current bit is '1' (since we started with all '0's)
            // If flipped is false, current bit is '0'
            char currentBit = flipped ? '1' : '0';

            // If current bit doesn't match target, we need to flip
            if (currentBit != bit) {
                flips++;           // Perform a flip operation
                flipped = !flipped; // Toggle the flipped state for all future bits
            }
        }

        return flips;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string once, performing O(1) operations at each position
- The loop runs exactly n times, where n is the length of the input string

**Space Complexity:** O(1)

- We use only a constant amount of extra space: two variables (`flips` and `flipped`)
- No additional data structures that scale with input size

## Common Mistakes

1. **Actually modifying the string:** Some candidates try to actually flip the bits in the string during each operation. This would require O(n) time per flip, leading to O(n²) total time. The key optimization is tracking state without modifying the string.

2. **Forgetting to propagate flips:** If you only check `s[i] != target[i]` without considering previous flips, you'll get wrong results. For example, with `target = "1010"`, after the first flip at position 0, position 1 becomes '1' in our simulated string, not '0'.

3. **Wrong direction processing:** Processing from right to left doesn't work because each flip affects all bits to the right. You need to process left to right to ensure once a prefix is correct, it stays correct.

4. **Overcomplicating with DP:** Some candidates try dynamic programming, but this problem has a simpler greedy solution. The greedy approach works because each decision is locally optimal and doesn't affect the optimality of future decisions.

## When You'll See This Pattern

This **greedy with state tracking** pattern appears in problems where operations have cascading effects:

1. **Bulb Switcher (LeetCode 319)** - Similar concept of toggling states, though the operation pattern is different (toggling multiples).

2. **Minimum Operations to Make Binary Array Elements Equal to One II (LeetCode 3232)** - Almost identical problem structure with suffix operations.

3. **Minimum Number of K Consecutive Bit Flips (LeetCode 995)** - Similar state tracking concept but with fixed-size windows instead of suffixes.

The pattern to recognize: When operations affect a suffix or prefix of the array/string, and you need to minimize operations, consider processing in one direction while tracking the cumulative effect of previous operations.

## Key Takeaways

1. **Greedy with state tracking** is powerful for problems where operations have persistent effects on future elements. Instead of actually applying operations, track their cumulative effect.

2. **Left-to-right processing** is natural when operations affect suffixes. Once you fix an element by processing it, you never need to change it again.

3. **Simulate, don't modify** - When operations are expensive to apply (like flipping an entire suffix), simulate their effects with state variables instead of actually performing them.

Related problems: [Minimum Operations to Make Binary Array Elements Equal to One II](/problem/minimum-operations-to-make-binary-array-elements-equal-to-one-ii)
