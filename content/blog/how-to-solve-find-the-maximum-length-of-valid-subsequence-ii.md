---
title: "How to Solve Find the Maximum Length of Valid Subsequence II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Maximum Length of Valid Subsequence II. Medium difficulty, 57.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-06-09"
category: "dsa-patterns"
tags: ["find-the-maximum-length-of-valid-subsequence-ii", "array", "dynamic-programming", "medium"]
---

# How to Solve Find the Maximum Length of Valid Subsequence II

We need to find the longest subsequence where every consecutive pair sum has the same remainder when divided by `k`. This is tricky because subsequences aren't contiguous, and the condition involves relationships between _pairs_ of elements rather than individual elements. The challenge is efficiently tracking how each new element can extend valid subsequences ending with different values.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 4, 5]` with `k = 3`.

A valid subsequence requires: `(a + b) % k == (b + c) % k == (c + d) % k ...`

Let's build step by step:

- Start with element `1`: We have subsequence `[1]` of length 1
- Add `2`: Check if we can extend any existing subsequences:
  - Extend `[1]` to `[1, 2]`: `(1 + 2) % 3 = 0`. This gives us a subsequence ending with `2` and last pair remainder `0`
- Add `3`:
  - Extend `[1]` to `[1, 3]`: `(1 + 3) % 3 = 1`
  - Extend `[1, 2]` to `[1, 2, 3]`: Need `(2 + 3) % 3` to equal previous remainder `0`. `(2 + 3) % 3 = 2 ≠ 0`, so not valid
- Add `4`:
  - Extend `[1]` to `[1, 4]`: `(1 + 4) % 3 = 2`
  - Extend `[1, 2]` to `[1, 2, 4]`: Need `(2 + 4) % 3 = 0` to equal previous remainder `0`. Yes! Now `[1, 2, 4]` has length 3, last element `4`, last remainder `0`
  - Extend `[1, 3]` to `[1, 3, 4]`: Need `(3 + 4) % 3 = 1` to equal previous remainder `1`. Yes! `[1, 3, 4]` has length 3, last element `4`, last remainder `1`

The key insight: For each element, we need to know the longest subsequences ending with each possible last element value, and for each possible last pair remainder.

## Brute Force Approach

A naive approach would generate all subsequences (2^n possibilities) and check each one. For each subsequence of length m, we'd need to check m-1 pairs. This is O(2^n \* n), which is impossibly slow for n up to 1000.

Even a smarter brute force using backtracking would still be exponential. The problem requires a more efficient approach that avoids exploring all possibilities.

## Optimized Approach

The key insight is dynamic programming. Let's define what we need to track:

For a valid subsequence ending with element `x`, the condition requires that all consecutive pair sums have the same remainder `r`. This means:

- For the last pair `(y, x)`, we have `(y + x) % k = r`
- For the previous pair `(z, y)`, we have `(z + y) % k = r`

From these two equations, we can derive: `(y + x) % k = (z + y) % k`
This simplifies to: `(x - z) % k = 0`, or `x % k = z % k`

This is the crucial observation: In a valid subsequence, all elements at even positions (0-based) have the same remainder modulo k, and all elements at odd positions have the same remainder modulo k (though possibly different from the even positions).

Wait, let's verify with an example: `[1, 2, 4]` with `k = 3`

- Positions: 0 (1), 1 (2), 2 (4)
- 1 % 3 = 1, 4 % 3 = 1 ✓ (even positions same)
- 2 % 3 = 2 (odd position)

Another: `[1, 3, 4]` with `k = 3`

- Positions: 0 (1), 1 (3), 2 (4)
- 1 % 3 = 1, 4 % 3 = 1 ✓ (even positions same)
- 3 % 3 = 0 (odd position)

So the problem reduces to: We need to find the longest subsequence where:

1. All elements at even indices have the same remainder `r_even`
2. All elements at odd indices have the same remainder `r_odd`
3. And `(r_even + r_odd) % k` gives us the consistent pair remainder

We can solve this by trying all possible pairs `(r_even, r_odd)` where `r_even, r_odd ∈ [0, k-1]`. For each pair, we build the longest possible alternating subsequence.

## Optimal Solution

We try all possible remainder pairs. For each pair `(a, b)`:

- We alternate taking elements with remainder `a` (even positions) and `b` (odd positions)
- We count how many we can take
- The maximum across all pairs is our answer

Special cases:

- If `a == b`, then `(a + a) % k` must equal `(a + a) % k` (trivially true), so we can take all elements with remainder `a`
- We need to handle starting with remainder `a` or starting with remainder `b` (whichever gives longer sequence)

<div class="code-group">

```python
# Time: O(n * k^2) | Space: O(1)
def maximumLength(self, nums, k):
    """
    Find the longest valid subsequence where all consecutive pair sums
    have the same remainder modulo k.

    The key insight: In a valid subsequence, all elements at even positions
    have the same remainder (r_even), and all elements at odd positions have
    the same remainder (r_odd).
    """
    max_len = 0

    # Try all possible remainder pairs (r_even, r_odd)
    for a in range(k):
        for b in range(k):
            # Try starting with remainder a
            length_a_start = 0
            # next_remainder tracks what remainder we expect next
            next_remainder = a

            for num in nums:
                if num % k == next_remainder:
                    length_a_start += 1
                    # Alternate between a and b
                    next_remainder = b if next_remainder == a else a

            # Try starting with remainder b
            length_b_start = 0
            next_remainder = b

            for num in nums:
                if num % k == next_remainder:
                    length_b_start += 1
                    # Alternate between b and a
                    next_remainder = a if next_remainder == b else b

            # Take the better of the two starting points
            max_len = max(max_len, length_a_start, length_b_start)

    return max_len
```

```javascript
// Time: O(n * k^2) | Space: O(1)
function maximumLength(nums, k) {
  /**
   * Find the longest valid subsequence where all consecutive pair sums
   * have the same remainder modulo k.
   *
   * The key insight: In a valid subsequence, all elements at even positions
   * have the same remainder (r_even), and all elements at odd positions have
   * the same remainder (r_odd).
   */
  let maxLen = 0;

  // Try all possible remainder pairs (r_even, r_odd)
  for (let a = 0; a < k; a++) {
    for (let b = 0; b < k; b++) {
      // Try starting with remainder a
      let lengthAStart = 0;
      // nextRemainder tracks what remainder we expect next
      let nextRemainder = a;

      for (const num of nums) {
        if (num % k === nextRemainder) {
          lengthAStart++;
          // Alternate between a and b
          nextRemainder = nextRemainder === a ? b : a;
        }
      }

      // Try starting with remainder b
      let lengthBStart = 0;
      nextRemainder = b;

      for (const num of nums) {
        if (num % k === nextRemainder) {
          lengthBStart++;
          // Alternate between b and a
          nextRemainder = nextRemainder === b ? a : b;
        }
      }

      // Take the better of the two starting points
      maxLen = Math.max(maxLen, lengthAStart, lengthBStart);
    }
  }

  return maxLen;
}
```

```java
// Time: O(n * k^2) | Space: O(1)
public int maximumLength(int[] nums, int k) {
    /**
     * Find the longest valid subsequence where all consecutive pair sums
     * have the same remainder modulo k.
     *
     * The key insight: In a valid subsequence, all elements at even positions
     * have the same remainder (r_even), and all elements at odd positions have
     * the same remainder (r_odd).
     */
    int maxLen = 0;

    // Try all possible remainder pairs (r_even, r_odd)
    for (int a = 0; a < k; a++) {
        for (int b = 0; b < k; b++) {
            // Try starting with remainder a
            int lengthAStart = 0;
            // nextRemainder tracks what remainder we expect next
            int nextRemainder = a;

            for (int num : nums) {
                if (num % k == nextRemainder) {
                    lengthAStart++;
                    // Alternate between a and b
                    nextRemainder = nextRemainder == a ? b : a;
                }
            }

            // Try starting with remainder b
            int lengthBStart = 0;
            nextRemainder = b;

            for (int num : nums) {
                if (num % k == nextRemainder) {
                    lengthBStart++;
                    // Alternate between b and a
                    nextRemainder = nextRemainder == b ? a : b;
                }
            }

            // Take the better of the two starting points
            maxLen = Math.max(maxLen, Math.max(lengthAStart, lengthBStart));
        }
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k²)

- We try all k² pairs of remainders (a, b)
- For each pair, we make 2 passes through the array (starting with a and starting with b)
- Each pass is O(n)
- Total: O(2 × n × k²) = O(n × k²)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for counters and loop variables
- No data structures that grow with input size

Given constraints (n ≤ 1000, k ≤ 100), n × k² = 1000 × 10000 = 10⁷ operations, which is acceptable.

## Common Mistakes

1. **Not trying both starting points**: For a given pair (a, b), you need to try starting with a AND starting with b. The longer sequence might begin with b even if a ≠ b.

2. **Forgetting the a == b case**: When a == b, the sequence can take all elements with that remainder. Our code handles this automatically since when a == b, starting with a or b gives the same result.

3. **Misunderstanding subsequence vs. subarray**: Remember we can skip elements! Our solution scans through nums and picks elements matching the current expected remainder, skipping others as needed.

4. **Not considering all remainder pairs**: Some candidates might only try pairs where (a + b) % k equals some value, but we need to try ALL k² pairs because the condition only requires consistency within a subsequence, not a specific remainder value.

## When You'll See This Pattern

This pattern of "alternating constraints" appears in several problems:

1. **Longest Alternating Subsequence** (similar to problem 376): Finding the longest subsequence where elements alternate between increasing and decreasing. The pattern involves tracking two states (last element was peak vs. valley).

2. **Wiggle Subsequence**: Similar alternating pattern constraints.

3. **Problems with modulo arithmetic constraints**: Any problem where elements need to satisfy pairwise modulo conditions often reduces to analyzing remainder patterns.

The core technique is recognizing when a complex pairwise condition simplifies to a pattern on individual elements (like all even positions having one property, all odd positions another).

## Key Takeaways

1. **Pairwise conditions can simplify to individual patterns**: When you see a condition involving pairs of elements, check if it implies something about individual elements, especially in sequences.

2. **Try all possibilities when search space is small**: With k ≤ 100, k² = 10,000 is manageable. When one dimension of the problem is bounded, brute force over that dimension can be optimal.

3. **Alternating sequences need two starting points**: For patterns that alternate between two states, always check starting with state A and starting with state B—they can yield different lengths.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Length of the Longest Subsequence That Sums to Target](/problem/length-of-the-longest-subsequence-that-sums-to-target)
