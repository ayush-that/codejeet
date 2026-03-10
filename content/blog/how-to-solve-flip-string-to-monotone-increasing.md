---
title: "How to Solve Flip String to Monotone Increasing — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flip String to Monotone Increasing. Medium difficulty, 61.9% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-08-13"
category: "dsa-patterns"
tags: ["flip-string-to-monotone-increasing", "string", "dynamic-programming", "medium"]
---

# How to Solve Flip String to Monotone Increasing

A binary string needs to become monotone increasing (all 0's followed by all 1's) with the minimum number of flips. The challenge is that we need to find the optimal split point where everything left becomes 0 and everything right becomes 1, but we can't simply count all 1's on the left and 0's on the right because we can flip characters in either direction. This problem is interesting because it looks like it requires checking every possible split point, but we can optimize it with a single pass using prefix sums.

## Visual Walkthrough

Let's trace through an example: `s = "00110"`

We need to find the best split point where everything left of (and including) the split becomes 0, and everything right becomes 1. We'll consider split points from before the first character to after the last character.

**Split point 0** (all characters become 1's):

- Flips needed: 0's to 1's = 3 zeros → 3 flips
- Total: 3

**Split point 1** (first char becomes 0, rest become 1's):

- Left side (index 0): 0's to 0's = 0 flips
- Right side (indices 1-4): 0's to 1's = 2 zeros → 2 flips
- Total: 2

**Split point 2** (first 2 chars become 0, rest become 1's):

- Left side: 1's to 0's = 1 one → 1 flip
- Right side: 0's to 1's = 1 zero → 1 flip
- Total: 2

**Split point 3** (first 3 chars become 0, rest become 1's):

- Left side: 1's to 0's = 2 ones → 2 flips
- Right side: 0's to 1's = 0 zeros → 0 flips
- Total: 2

**Split point 4** (first 4 chars become 0, rest become 1's):

- Left side: 1's to 0's = 2 ones → 2 flips
- Right side: 0's to 1's = 0 zeros → 0 flips
- Total: 2

**Split point 5** (all characters become 0's):

- Flips needed: 1's to 0's = 2 ones → 2 flips
- Total: 2

The minimum is 2 flips. Notice that for each split point, we need:

- Number of 1's on the left (need to flip to 0)
- Number of 0's on the right (need to flip to 1)

## Brute Force Approach

The brute force approach would check every possible split point (n+1 positions) and for each split, count:

1. How many 1's are in the left partition (these need to become 0)
2. How many 0's are in the right partition (these need to become 1)

For each split point i (where i means first i characters become 0, rest become 1):

- Count 1's in s[0:i] (left side)
- Count 0's in s[i:n] (right side)
- Sum these two counts

This requires O(n) work for each of O(n) split points, giving O(n²) time complexity. While this is correct, it's too slow for n up to 10⁵.

## Optimized Approach

The key insight is that we can precompute prefix sums to answer "how many 1's are in the left side" and "how many 0's are in the right side" in O(1) time for each split point.

Let `prefixOnes[i]` = number of 1's in s[0:i] (first i characters)
Let `suffixZeros[i]` = number of 0's in s[i:n] (from position i to end)

Then for split point i:

- Flips needed = `prefixOnes[i]` (1's in left that need to become 0) + `suffixZeros[i]` (0's in right that need to become 1)

We can compute both arrays in O(n) time:

- `prefixOnes[i]` = `prefixOnes[i-1] + (1 if s[i-1] == '1' else 0)`
- `suffixZeros[i]` = `suffixZeros[i+1] + (1 if s[i] == '0' else 0)` (computed backwards)

Then we check all n+1 split points in O(n) time to find the minimum.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minFlipsMonoIncr(s: str) -> int:
    """
    Returns minimum flips to make binary string monotone increasing.
    Approach: For each split point i, we need to flip all 1's on left
    and all 0's on right. Use prefix sums to compute these in O(1).
    """
    n = len(s)

    # prefixOnes[i] = number of 1's in first i characters (s[0:i])
    prefixOnes = [0] * (n + 1)
    for i in range(1, n + 1):
        # Add 1 if previous character was '1', else add 0
        prefixOnes[i] = prefixOnes[i - 1] + (1 if s[i - 1] == '1' else 0)

    # suffixZeros[i] = number of 0's from position i to end (s[i:n])
    suffixZeros = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        # Add 1 if current character is '0', else add 0
        # suffixZeros[i] uses s[i] because we're counting from position i
        suffixZeros[i] = suffixZeros[i + 1] + (1 if s[i] == '0' else 0)

    # Check all possible split points (0 to n inclusive)
    # Split at i means first i chars become 0, rest become 1
    minFlips = float('inf')
    for i in range(n + 1):
        # For split point i:
        # - prefixOnes[i] = 1's in left partition that need to become 0
        # - suffixZeros[i] = 0's in right partition that need to become 1
        flips = prefixOnes[i] + suffixZeros[i]
        minFlips = min(minFlips, flips)

    return minFlips
```

```javascript
// Time: O(n) | Space: O(n)
function minFlipsMonoIncr(s) {
  /**
   * Returns minimum flips to make binary string monotone increasing.
   * Approach: For each split point i, we need to flip all 1's on left
   * and all 0's on right. Use prefix sums to compute these in O(1).
   */
  const n = s.length;

  // prefixOnes[i] = number of 1's in first i characters (s[0:i])
  const prefixOnes = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // Add 1 if previous character was '1', else add 0
    prefixOnes[i] = prefixOnes[i - 1] + (s[i - 1] === "1" ? 1 : 0);
  }

  // suffixZeros[i] = number of 0's from position i to end (s[i:n])
  const suffixZeros = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    // Add 1 if current character is '0', else add 0
    // suffixZeros[i] uses s[i] because we're counting from position i
    suffixZeros[i] = suffixZeros[i + 1] + (s[i] === "0" ? 1 : 0);
  }

  // Check all possible split points (0 to n inclusive)
  // Split at i means first i chars become 0, rest become 1
  let minFlips = Infinity;
  for (let i = 0; i <= n; i++) {
    // For split point i:
    // - prefixOnes[i] = 1's in left partition that need to become 0
    // - suffixZeros[i] = 0's in right partition that need to become 1
    const flips = prefixOnes[i] + suffixZeros[i];
    minFlips = Math.min(minFlips, flips);
  }

  return minFlips;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minFlipsMonoIncr(String s) {
        /**
         * Returns minimum flips to make binary string monotone increasing.
         * Approach: For each split point i, we need to flip all 1's on left
         * and all 0's on right. Use prefix sums to compute these in O(1).
         */
        int n = s.length();

        // prefixOnes[i] = number of 1's in first i characters (s[0:i])
        int[] prefixOnes = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            // Add 1 if previous character was '1', else add 0
            prefixOnes[i] = prefixOnes[i - 1] + (s.charAt(i - 1) == '1' ? 1 : 0);
        }

        // suffixZeros[i] = number of 0's from position i to end (s[i:n])
        int[] suffixZeros = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            // Add 1 if current character is '0', else add 0
            // suffixZeros[i] uses s[i] because we're counting from position i
            suffixZeros[i] = suffixZeros[i + 1] + (s.charAt(i) == '0' ? 1 : 0);
        }

        // Check all possible split points (0 to n inclusive)
        // Split at i means first i chars become 0, rest become 1
        int minFlips = Integer.MAX_VALUE;
        for (int i = 0; i <= n; i++) {
            // For split point i:
            // - prefixOnes[i] = 1's in left partition that need to become 0
            // - suffixZeros[i] = 0's in right partition that need to become 1
            int flips = prefixOnes[i] + suffixZeros[i];
            minFlips = Math.min(minFlips, flips);
        }

        return minFlips;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make three passes through the string: one for `prefixOnes`, one for `suffixZeros`, and one to find the minimum. Each pass is O(n).
- Total: O(3n) = O(n)

**Space Complexity:** O(n)

- We store two arrays of size n+1: `prefixOnes` and `suffixZeros`.
- Total: O(2n) = O(n)

We could optimize space to O(1) by computing the answer in a single pass, but the O(n) space solution is clearer and easier to explain in an interview.

## Common Mistakes

1. **Off-by-one errors with indices:** When computing `prefixOnes[i]`, remember it counts 1's in `s[0:i]` (first i characters), so we use `s[i-1]`. For `suffixZeros[i]`, it counts from position i, so we use `s[i]`. Mixing these up gives wrong counts.

2. **Forgetting edge cases:** The split point can be at position 0 (all characters become 1) or position n (all characters become 0). These must be included in the check. Some candidates only check split points between characters.

3. **Incorrect initialization of arrays:** Both arrays need size `n+1` to accommodate split points from 0 to n inclusive. Using size `n` would miss the last split point.

4. **Not considering both types of flips:** Some candidates only count flips needed to make all 0's or all 1's, forgetting that the optimal solution might involve flipping both 0's and 1's at different positions.

## When You'll See This Pattern

This prefix/suffix sum pattern appears in problems where you need to evaluate all possible partition points and compute something based on both sides of the partition:

1. **Product of Array Except Self (LeetCode 238):** Uses prefix and suffix products to compute result without division.
2. **Maximum Sum Circular Subarray (LeetCode 918):** Uses prefix sums to find maximum subarray in circular array.
3. **Trapping Rain Water (LeetCode 42):** Uses prefix and suffix maximums to compute water at each position.
4. **Minimum Cost to Make All Characters Equal (LeetCode 2712):** Similar concept of finding optimal split point with prefix/suffix computations.

## Key Takeaways

1. **When you need to evaluate all split/partition points**, consider precomputing prefix and suffix information to answer queries in O(1) time instead of O(n).

2. **The "monotone increasing" constraint** often translates to finding an optimal split point where everything left meets one condition and everything right meets another.

3. **Always test edge cases** including split at the very beginning and very end of the array/string.

Related problems: [Minimum Cost to Make All Characters Equal](/problem/minimum-cost-to-make-all-characters-equal)
