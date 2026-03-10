---
title: "How to Solve Number of Times Binary String Is Prefix-Aligned — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Times Binary String Is Prefix-Aligned. Medium difficulty, 66.0% acceptance rate. Topics: Array."
date: "2028-04-25"
category: "dsa-patterns"
tags: ["number-of-times-binary-string-is-prefix-aligned", "array", "medium"]
---

# How to Solve Number of Times Binary String Is Prefix-Aligned

This problem asks us to track how many times a binary string becomes "prefix-aligned" as we flip bits from 0 to 1 according to a given sequence. A binary string is prefix-aligned when all bits from index 1 up to some index `k` are 1, and all bits beyond `k` are 0. The challenge lies in efficiently determining when this condition holds without actually maintaining the full binary string and checking all prefixes at each step.

## Visual Walkthrough

Let's trace through a concrete example: `n = 5`, `flips = [3,2,4,1,5]`

We start with: `[0, 0, 0, 0, 0]`

**Step 1:** Flip bit at index 3 → `[0, 0, 1, 0, 0]`

- Check prefix-alignment: Bits 1-1 are `[0]` ❌, Bits 1-2 are `[0,0]` ❌, Bits 1-3 are `[0,0,1]` ❌
- No prefix is all 1's → Count = 0

**Step 2:** Flip bit at index 2 → `[0, 1, 1, 0, 0]`

- Check: Bits 1-1 `[0]` ❌, Bits 1-2 `[0,1]` ❌, Bits 1-3 `[0,1,1]` ❌
- Count = 0

**Step 3:** Flip bit at index 4 → `[0, 1, 1, 1, 0]`

- Check: Bits 1-1 `[0]` ❌, Bits 1-2 `[0,1]` ❌, Bits 1-3 `[0,1,1]` ❌, Bits 1-4 `[0,1,1,1]` ❌
- Count = 0

**Step 4:** Flip bit at index 1 → `[1, 1, 1, 1, 0]`

- Check: Bits 1-1 `[1]` ✓, Bits 1-2 `[1,1]` ✓, Bits 1-3 `[1,1,1]` ✓, Bits 1-4 `[1,1,1,1]` ✓
- The largest prefix that's all 1's is 1-4, and bit 5 is still 0 → The ENTIRE string up to index 4 is prefix-aligned!
- Count = 1

**Step 5:** Flip bit at index 5 → `[1, 1, 1, 1, 1]`

- Check: All prefixes 1-1 through 1-5 are all 1's
- The largest prefix is 1-5, and there are no bits beyond it → Count = 2

**Final answer:** 2

The key insight: A string is prefix-aligned at index `i` if the largest flipped index so far equals the number of flips performed. When we flip the `i`-th bit (1-indexed), if the maximum flipped index equals `i`, then all bits from 1 to `i` must be 1.

## Brute Force Approach

A naive approach would simulate the entire process:

1. Create an array of size `n` initialized with all 0's
2. For each flip in sequence:
   - Set the corresponding bit to 1
   - Check every prefix from 1 to current maximum index
   - If any prefix is all 1's, increment count

The checking step is inefficient: for the `i`-th flip, we might check up to `i` prefixes, each requiring scanning up to `i` elements. This leads to O(n³) time complexity in worst case.

<div class="code-group">

```python
# Time: O(n³) | Space: O(n)
def numTimesAllBlue_brute(flips):
    n = len(flips)
    bits = [0] * n  # 0-indexed but we'll use 1-indexed logic
    count = 0

    for step in range(1, n + 1):
        # Flip the bit (convert from 1-indexed to 0-indexed)
        idx = flips[step - 1] - 1
        bits[idx] = 1

        # Check all prefixes
        for prefix_end in range(1, step + 1):
            # Check if bits[0:prefix_end] are all 1
            all_ones = True
            for j in range(prefix_end):
                if bits[j] == 0:
                    all_ones = False
                    break

            if all_ones:
                count += 1
                break  # Only count once per step

    return count
```

```javascript
// Time: O(n³) | Space: O(n)
function numTimesAllBlueBrute(flips) {
  const n = flips.length;
  const bits = new Array(n).fill(0);
  let count = 0;

  for (let step = 1; step <= n; step++) {
    // Flip the bit (convert from 1-indexed to 0-indexed)
    const idx = flips[step - 1] - 1;
    bits[idx] = 1;

    // Check all prefixes
    for (let prefixEnd = 1; prefixEnd <= step; prefixEnd++) {
      // Check if bits[0:prefixEnd] are all 1
      let allOnes = true;
      for (let j = 0; j < prefixEnd; j++) {
        if (bits[j] === 0) {
          allOnes = false;
          break;
        }
      }

      if (allOnes) {
        count++;
        break; // Only count once per step
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(n)
public int numTimesAllBlueBrute(int[] flips) {
    int n = flips.length;
    int[] bits = new int[n];
    int count = 0;

    for (int step = 1; step <= n; step++) {
        // Flip the bit (convert from 1-indexed to 0-indexed)
        int idx = flips[step - 1] - 1;
        bits[idx] = 1;

        // Check all prefixes
        for (int prefixEnd = 1; prefixEnd <= step; prefixEnd++) {
            // Check if bits[0:prefixEnd] are all 1
            boolean allOnes = true;
            for (int j = 0; j < prefixEnd; j++) {
                if (bits[j] == 0) {
                    allOnes = false;
                    break;
                }
            }

            if (allOnes) {
                count++;
                break;  // Only count once per step
            }
        }
    }

    return count;
}
```

</div>

This brute force is too slow for large inputs (n up to 5×10⁴). We need a smarter way to detect prefix-alignment without scanning the array repeatedly.

## Optimized Approach

The key insight is that a binary string is prefix-aligned up to index `k` if and only if:

1. All bits from 1 to `k` are 1
2. All bits beyond `k` are 0

But we don't need to check all bits! Think about what happens when we flip bits:

- At step `i` (1-indexed), we've performed `i` flips
- If the maximum flipped index so far equals `i`, then all indices from 1 to `i` must have been flipped
- Why? Because we've flipped exactly `i` bits, and if the largest index is `i`, there can't be any gaps in 1..i

Let's revisit our example:

- Step 4: We've flipped 4 bits, max flipped index = 4 → All indices 1-4 must be flipped ✓
- Step 5: We've flipped 5 bits, max flipped index = 5 → All indices 1-5 must be flipped ✓

The algorithm becomes simple:

1. Track the maximum flipped index seen so far
2. At each step, if `max_index == step_number`, we have a prefix-aligned moment
3. Count these occurrences

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numTimesAllBlue(flips):
    """
    Counts how many times the binary string becomes prefix-aligned.

    The key insight: At step i (1-indexed), if the maximum flipped index
    equals i, then all bits from 1 to i must be 1, making the string
    prefix-aligned up to index i.

    Args:
        flips: List of 1-indexed positions to flip

    Returns:
        Number of prefix-aligned moments
    """
    max_index = 0  # Track the maximum flipped index seen so far
    count = 0      # Count of prefix-aligned moments

    # Iterate through flips (step is 1-indexed, i is 0-indexed)
    for i, flip in enumerate(flips):
        # Update maximum flipped index
        max_index = max(max_index, flip)

        # Check if we have a prefix-aligned moment
        # i + 1 represents the current step number (1-indexed)
        if max_index == i + 1:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numTimesAllBlue(flips) {
  /**
   * Counts how many times the binary string becomes prefix-aligned.
   *
   * The key insight: At step i (1-indexed), if the maximum flipped index
   * equals i, then all bits from 1 to i must be 1, making the string
   * prefix-aligned up to index i.
   *
   * @param {number[]} flips - Array of 1-indexed positions to flip
   * @return {number} Number of prefix-aligned moments
   */
  let maxIndex = 0; // Track the maximum flipped index seen so far
  let count = 0; // Count of prefix-aligned moments

  // Iterate through flips (step is 1-indexed, i is 0-indexed)
  for (let i = 0; i < flips.length; i++) {
    // Update maximum flipped index
    maxIndex = Math.max(maxIndex, flips[i]);

    // Check if we have a prefix-aligned moment
    // i + 1 represents the current step number (1-indexed)
    if (maxIndex === i + 1) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int numTimesAllBlue(int[] flips) {
        /**
         * Counts how many times the binary string becomes prefix-aligned.
         *
         * The key insight: At step i (1-indexed), if the maximum flipped index
         * equals i, then all bits from 1 to i must be 1, making the string
         * prefix-aligned up to index i.
         *
         * @param flips Array of 1-indexed positions to flip
         * @return Number of prefix-aligned moments
         */
        int maxIndex = 0;  // Track the maximum flipped index seen so far
        int count = 0;     // Count of prefix-aligned moments

        // Iterate through flips (step is 1-indexed, i is 0-indexed)
        for (int i = 0; i < flips.length; i++) {
            // Update maximum flipped index
            maxIndex = Math.max(maxIndex, flips[i]);

            // Check if we have a prefix-aligned moment
            // i + 1 represents the current step number (1-indexed)
            if (maxIndex == i + 1) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the `flips` array once, performing constant-time operations (comparison and update) at each step.
- No nested loops, no array scanning beyond the single pass.

**Space Complexity:** O(1)

- We only use a few integer variables (`max_index`, `count`, loop counter).
- No additional data structures that scale with input size.

## Common Mistakes

1. **Off-by-one errors with indexing:** The problem uses 1-indexing for both the binary string and the flips array. Forgetting to convert between 0-indexed and 1-indexed when comparing `max_index` with step number is a common pitfall. Always check: `max_index == i + 1` not `max_index == i`.

2. **Misunderstanding prefix-alignment:** Some candidates think we need to check if ALL prefixes are aligned, rather than if the string is prefix-aligned (which means there exists some `k` such that bits 1..k are all 1 and bits k+1..n are all 0). The condition `max_index == step_number` correctly captures this.

3. **Overcomplicating with data structures:** Attempting to maintain the actual binary string or using sets/arrays to track flipped bits. The beauty of this solution is that we only need the maximum, not the complete history.

4. **Not considering the definition carefully:** A string is prefix-aligned if it's of the form `111...1000...0`. Some candidates mistakenly count when any prefix (like just the first bit) is all 1's, but that's not sufficient—the string must be in the exact form with all 1's up to some point and all 0's after.

## When You'll See This Pattern

This problem exemplifies the **"maximum tracking"** pattern, where instead of maintaining complete state, we track a single aggregate value that captures the essential information. Similar patterns appear in:

1. **Bulb Switcher (LeetCode 319):** Instead of simulating all toggles, you realize only perfect squares remain on. The insight comes from tracking how many times each bulb is toggled.

2. **Maximum Subarray (LeetCode 53):** The Kadane's algorithm tracks the maximum sum ending at each position rather than checking all subarrays.

3. **Best Time to Buy and Sell Stock (LeetCode 121):** Track the minimum price seen so far to compute maximum profit at each step.

4. **Car Fleet (LeetCode 853):** Sort cars by position and track the time to reach target—cars behind that would catch up form a fleet.

The common thread: When a problem seems to require maintaining complete history or checking many conditions, look for an aggregate statistic (max, min, sum, count) that captures what you need.

## Key Takeaways

1. **Look for invariants:** Instead of simulating everything, ask "what condition must be true when the property holds?" Here, the invariant is `max_flipped_index == number_of_flips`.

2. **1-indexing requires careful handling:** Always verify whether your loop counters match the problem's indexing scheme. When in doubt, work through a small example.

3. **Maximum/minimum tracking often simplifies problems:** When order matters but you don't need the full sequence, consider whether tracking extremes gives you enough information.

4. **Prefix problems often have O(n) solutions:** If you find yourself needing to check all prefixes repeatedly, there's usually a way to do it in one pass by maintaining running information.

Related problems: [Bulb Switcher](/problem/bulb-switcher), [Bulb Switcher II](/problem/bulb-switcher-ii)
