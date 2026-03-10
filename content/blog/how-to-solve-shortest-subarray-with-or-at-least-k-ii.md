---
title: "How to Solve Shortest Subarray With OR at Least K II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Subarray With OR at Least K II. Medium difficulty, 50.2% acceptance rate. Topics: Array, Bit Manipulation, Sliding Window."
date: "2027-06-24"
category: "dsa-patterns"
tags:
  [
    "shortest-subarray-with-or-at-least-k-ii",
    "array",
    "bit-manipulation",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Shortest Subarray With OR at Least K II

This problem asks us to find the shortest non-empty subarray where the bitwise OR of all elements is at least `k`. The challenge comes from the fact that OR is not monotonic like sum—adding more elements can increase the OR value, but removing elements can also increase it in some cases. This makes sliding window approaches tricky, as we can't simply shrink the window when the condition is met.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 4, 8]`, `k = 7`.

We need to find the shortest subarray where OR ≥ 7. Let's examine some subarrays:

- `[1]`: OR = 1 (not enough)
- `[2]`: OR = 2 (not enough)
- `[4]`: OR = 4 (not enough)
- `[8]`: OR = 8 (enough, length = 1)
- `[1, 2]`: OR = 1 | 2 = 3 (not enough)
- `[2, 4]`: OR = 2 | 4 = 6 (not enough)
- `[4, 8]`: OR = 4 | 8 = 12 (enough, length = 2)
- `[1, 2, 4]`: OR = 1 | 2 | 4 = 7 (enough, length = 3)
- `[2, 4, 8]`: OR = 2 | 4 | 8 = 14 (enough, length = 3)

The shortest special subarray is `[8]` with length 1.

Now let's try `nums = [1, 2, 3]`, `k = 4`:

- `[1]`: OR = 1
- `[2]`: OR = 2
- `[3]`: OR = 3
- `[1, 2]`: OR = 1 | 2 = 3
- `[2, 3]`: OR = 2 | 3 = 3
- `[1, 2, 3]`: OR = 1 | 2 | 3 = 3

No subarray has OR ≥ 4, so we return -1.

The key insight: For each position `i`, we want to find the nearest `j ≤ i` such that the OR from `j` to `i` is ≥ `k`. But OR isn't monotonic, so we need a smarter approach.

## Brute Force Approach

The brute force solution checks every possible subarray:

1. Generate all possible subarrays (start index `i`, end index `j` where `i ≤ j`)
2. For each subarray, compute the OR of all elements
3. If OR ≥ `k`, track the minimum length
4. Return the minimum length found, or -1 if none

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def shortestSubarray(nums, k):
    n = len(nums)
    min_len = float('inf')

    # Try all possible starting points
    for i in range(n):
        # Try all possible ending points
        for j in range(i, n):
            # Compute OR for subarray nums[i:j+1]
            current_or = 0
            for idx in range(i, j + 1):
                current_or |= nums[idx]

            # Check if this subarray meets the condition
            if current_or >= k:
                min_len = min(min_len, j - i + 1)

    return -1 if min_len == float('inf') else min_len
```

```javascript
// Time: O(n³) | Space: O(1)
function shortestSubarray(nums, k) {
  const n = nums.length;
  let minLen = Infinity;

  // Try all possible starting points
  for (let i = 0; i < n; i++) {
    // Try all possible ending points
    for (let j = i; j < n; j++) {
      // Compute OR for subarray nums[i..j]
      let currentOr = 0;
      for (let idx = i; idx <= j; idx++) {
        currentOr |= nums[idx];
      }

      // Check if this subarray meets the condition
      if (currentOr >= k) {
        minLen = Math.min(minLen, j - i + 1);
      }
    }
  }

  return minLen === Infinity ? -1 : minLen;
}
```

```java
// Time: O(n³) | Space: O(1)
public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    int minLen = Integer.MAX_VALUE;

    // Try all possible starting points
    for (int i = 0; i < n; i++) {
        // Try all possible ending points
        for (int j = i; j < n; j++) {
            // Compute OR for subarray nums[i..j]
            int currentOr = 0;
            for (int idx = i; idx <= j; idx++) {
                currentOr |= nums[idx];
            }

            // Check if this subarray meets the condition
            if (currentOr >= k) {
                minLen = Math.min(minLen, j - i + 1);
            }
        }
    }

    return minLen == Integer.MAX_VALUE ? -1 : minLen;
}
```

</div>

**Why this is too slow:** With O(n³) time complexity, this fails for even moderately sized arrays (n > 100). We need to optimize.

## Optimized Approach

The key insight is that for each ending position `i`, we want to find the nearest starting position `j` such that OR(nums[j..i]) ≥ k. However, OR is not monotonic like sum, so we can't use a simple sliding window.

Here's the optimized approach:

1. **Track contributions by bit position**: Since numbers are non-negative integers, we can track which indices contribute each bit (0-31 for 32-bit integers).
2. **Use sliding window with bit tracking**: As we expand the window to the right, we add the current number's bits to our current OR. When the OR becomes ≥ k, we try to shrink the window from the left while maintaining OR ≥ k.
3. **The tricky part**: When removing an element from the left, we need to know if its bits are still present in the remaining window. We maintain a count of how many elements in the current window have each bit set.
4. **Efficient OR updates**: When we remove an element, we check each bit it has. If the count for that bit becomes 0, we clear that bit from our current OR.

This gives us O(n \* B) time where B is the number of bits (max 32), which is effectively O(n).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * B) where B = 32 bits | Space: O(B)
def shortestSubarray(nums, k):
    n = len(nums)
    min_len = float('inf')

    # Current OR value of the window
    current_or = 0

    # Count of how many numbers in current window have each bit set
    # Since numbers are non-negative and up to 10^9, we need 31 bits (0-30)
    bit_count = [0] * 31

    # Left pointer of sliding window
    left = 0

    # Expand window to the right
    for right in range(n):
        # Add nums[right] to the window
        num = nums[right]
        current_or |= num

        # Update bit counts for the new number
        for bit in range(31):
            if num >> bit & 1:
                bit_count[bit] += 1

        # Try to shrink window from left while maintaining OR >= k
        while left <= right and current_or >= k:
            # Update minimum length
            min_len = min(min_len, right - left + 1)

            # Remove nums[left] from window
            left_num = nums[left]

            # Update bit counts for the removed number
            for bit in range(31):
                if left_num >> bit & 1:
                    bit_count[bit] -= 1

                    # If no numbers in window have this bit set, clear it from current_or
                    if bit_count[bit] == 0:
                        current_or &= ~(1 << bit)

            left += 1

    return -1 if min_len == float('inf') else min_len
```

```javascript
// Time: O(n * B) where B = 32 bits | Space: O(B)
function shortestSubarray(nums, k) {
  const n = nums.length;
  let minLen = Infinity;

  // Current OR value of the window
  let currentOr = 0;

  // Count of how many numbers in current window have each bit set
  // Since numbers are non-negative and up to 10^9, we need 31 bits (0-30)
  const bitCount = new Array(31).fill(0);

  // Left pointer of sliding window
  let left = 0;

  // Expand window to the right
  for (let right = 0; right < n; right++) {
    // Add nums[right] to the window
    const num = nums[right];
    currentOr |= num;

    // Update bit counts for the new number
    for (let bit = 0; bit < 31; bit++) {
      if ((num >> bit) & 1) {
        bitCount[bit]++;
      }
    }

    // Try to shrink window from left while maintaining OR >= k
    while (left <= right && currentOr >= k) {
      // Update minimum length
      minLen = Math.min(minLen, right - left + 1);

      // Remove nums[left] from window
      const leftNum = nums[left];

      // Update bit counts for the removed number
      for (let bit = 0; bit < 31; bit++) {
        if ((leftNum >> bit) & 1) {
          bitCount[bit]--;

          // If no numbers in window have this bit set, clear it from currentOr
          if (bitCount[bit] === 0) {
            currentOr &= ~(1 << bit);
          }
        }
      }

      left++;
    }
  }

  return minLen === Infinity ? -1 : minLen;
}
```

```java
// Time: O(n * B) where B = 32 bits | Space: O(B)
public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    int minLen = Integer.MAX_VALUE;

    // Current OR value of the window
    int currentOr = 0;

    // Count of how many numbers in current window have each bit set
    // Since numbers are non-negative and up to 10^9, we need 31 bits (0-30)
    int[] bitCount = new int[31];

    // Left pointer of sliding window
    int left = 0;

    // Expand window to the right
    for (int right = 0; right < n; right++) {
        // Add nums[right] to the window
        int num = nums[right];
        currentOr |= num;

        // Update bit counts for the new number
        for (int bit = 0; bit < 31; bit++) {
            if (((num >> bit) & 1) == 1) {
                bitCount[bit]++;
            }
        }

        // Try to shrink window from left while maintaining OR >= k
        while (left <= right && currentOr >= k) {
            // Update minimum length
            minLen = Math.min(minLen, right - left + 1);

            // Remove nums[left] from window
            int leftNum = nums[left];

            // Update bit counts for the removed number
            for (int bit = 0; bit < 31; bit++) {
                if (((leftNum >> bit) & 1) == 1) {
                    bitCount[bit]--;

                    // If no numbers in window have this bit set, clear it from currentOr
                    if (bitCount[bit] == 0) {
                        currentOr &= ~(1 << bit);
                    }
                }
            }

            left++;
        }
    }

    return minLen == Integer.MAX_VALUE ? -1 : minLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × B) where B is the number of bits (31 in our implementation). Since B is constant (max 32 for 32-bit integers), this simplifies to O(n). For each element, we iterate through up to 31 bits to update the bit counts.

**Space Complexity:** O(B) for the bit count array, which is O(1) since B is constant (31).

## Common Mistakes

1. **Assuming OR is monotonic like sum**: The biggest mistake is trying to use a standard sliding window approach without considering that removing elements can sometimes increase the OR value. For example, in `[1, 2, 4]`, removing 1 increases OR from 7 to 6, but in `[1, 2]`, removing 1 increases OR from 3 to 2.

2. **Not tracking bit contributions properly**: When removing an element from the window, you must check if other elements still have each bit before clearing it from the current OR. The bit count array solves this.

3. **Using too many bits**: Since numbers are non-negative and constraints say `nums[i] <= 10^9`, we only need 30 bits (2^30 ≈ 1.07 billion). Using 32 bits is fine but unnecessary.

4. **Forgetting the empty result case**: Always check if `min_len` was updated before returning. If no subarray meets the condition, return -1.

## When You'll See This Pattern

This problem combines **sliding window** with **bit manipulation tracking**. You'll see similar patterns in:

1. **Maximum Size Subarray Sum Equals k (LeetCode 325)**: Uses prefix sums with hash maps to find subarrays with exact sum k.
2. **Shortest Subarray with Sum at Least K (LeetCode 862)**: Uses monotonic deque to maintain prefix sums for finding minimum length subarrays.
3. **Subarrays with K Different Integers (LeetCode 992)**: Uses sliding window with frequency counts, similar to our bit count tracking.
4. **Bitwise ORs of Subarrays (LeetCode 898)**: Directly deals with OR operations on subarrays.

The key pattern is maintaining additional state (bit counts, character frequencies, etc.) to efficiently update window properties when adding/removing elements.

## Key Takeaways

1. **Non-monotonic operations need careful tracking**: When a window property (like OR) isn't monotonic with respect to adding/removing elements, you need to track the contributions of each element to recompute the property efficiently.

2. **Bit manipulation problems often benefit from per-bit tracking**: When dealing with bitwise operations across subarrays, consider maintaining counts or states for each bit position separately.

3. **Sliding window can work with non-monotonic properties**: With proper auxiliary data structures to track element contributions, sliding window can solve problems where the window property doesn't change predictably.

Related problems: [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k), [Shortest Subarray with Sum at Least K](/problem/shortest-subarray-with-sum-at-least-k)
