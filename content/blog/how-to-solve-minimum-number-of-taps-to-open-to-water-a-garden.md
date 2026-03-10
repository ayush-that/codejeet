---
title: "How to Solve Minimum Number of Taps to Open to Water a Garden — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Taps to Open to Water a Garden. Hard difficulty, 51.0% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2026-08-01"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-taps-to-open-to-water-a-garden",
    "array",
    "dynamic-programming",
    "greedy",
    "hard",
  ]
---

# How to Solve Minimum Number of Taps to Open to Water a Garden

You have a garden from position 0 to n, with taps at positions 0 through n. Each tap at position i can water the range [i - ranges[i], i + ranges[i]]. Your task is to find the minimum number of taps needed to water the entire garden. What makes this problem tricky is that the taps have different coverage ranges, and they can overlap in complex ways. It's essentially an interval covering problem disguised as a garden watering scenario.

## Visual Walkthrough

Let's trace through a concrete example: n = 5, ranges = [3,4,1,1,0,0]

First, let's understand what each tap covers:

- Tap 0 at position 0 covers [0-3, 0+3] = [0, 3]
- Tap 1 at position 1 covers [1-4, 1+4] = [-3, 5] → but clipped to garden bounds: [0, 5]
- Tap 2 at position 2 covers [2-1, 2+1] = [1, 3]
- Tap 3 at position 3 covers [3-1, 3+1] = [2, 4]
- Tap 4 at position 4 covers [4-0, 4+0] = [4, 4]
- Tap 5 at position 5 covers [5-0, 5+0] = [5, 5]

Now let's think about covering the garden from 0 to 5:

1. Start at position 0. Which tap gives us the furthest reach from 0? Tap 0 reaches to 3, Tap 1 reaches to 5. Tap 1 is better.
2. If we choose Tap 1, we've covered [0, 5] in one tap! So answer is 1.

Let's try a more interesting example: n = 7, ranges = [1,2,1,0,2,1,0,0]

Tap coverage:

- Tap 0: [0, 1]
- Tap 1: [0, 3] (clipped from [-1, 3])
- Tap 2: [1, 3]
- Tap 3: [3, 3]
- Tap 4: [2, 6]
- Tap 5: [4, 6]
- Tap 6: [6, 6]
- Tap 7: [7, 7]

Covering step-by-step:

1. Start at 0. Best reach from 0: Tap 1 reaches to 3.
2. Now we need to cover from 3 onward. From positions ≤ 3, Tap 4 reaches furthest to 6.
3. From positions ≤ 6, Tap 7 reaches to 7.
   We used Taps 1, 4, and 7 → 3 taps total.

## Brute Force Approach

A naive approach would be to try all possible combinations of taps. For each tap, we have two choices: open it or don't. That's 2^(n+1) possibilities. For each combination, we'd need to check if it covers the entire garden, which takes O(n) time. This gives us O(n \* 2^n) time complexity, which is completely impractical for n up to 10^4.

Even a slightly better brute force would be to try all subsets in increasing size order, but that's still exponential. The key insight is that we don't need to consider all combinations - we can make greedy choices based on maximum reach.

## Optimized Approach

This problem is essentially an interval covering problem. Here's the key insight: **For each position in the garden, we want to know the furthest point we can reach from that position or earlier positions.**

The optimal approach transforms the problem:

1. Convert each tap's coverage into an interval [start, end], clipped to [0, n]
2. Sort these intervals by their starting position
3. Use a greedy algorithm: at each step, choose the interval that starts at or before our current position and extends the furthest

However, there's an even more efficient O(n) approach:

1. Create an array `maxReach` where `maxReach[i]` = the furthest point we can reach starting from position i
2. For each tap i, update `maxReach[left] = max(maxReach[left], right)` where left = max(0, i - ranges[i]) and right = min(n, i + ranges[i])
3. Use a greedy algorithm similar to "jump game" to find the minimum number of "jumps" needed

## Optimal Solution

The optimal solution uses a greedy approach with O(n) time and O(n) space. We transform the problem into finding the minimum number of intervals needed to cover [0, n].

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minTaps(n, ranges):
    """
    Find minimum number of taps to water entire garden [0, n]

    Approach:
    1. Create maxReach array to track furthest point reachable from each position
    2. For each tap, update the reach for its starting position
    3. Use greedy algorithm to cover the garden with minimum intervals
    """
    # Step 1: Create array to track maximum reach from each position
    # maxReach[i] = furthest point we can reach starting from position i
    maxReach = [0] * (n + 1)

    # Step 2: For each tap, update the maximum reach from its starting position
    for i in range(n + 1):
        # Calculate the interval this tap can cover
        left = max(0, i - ranges[i])
        right = min(n, i + ranges[i])

        # Update the maximum reach from the left position
        # We store the furthest right endpoint for each starting position
        maxReach[left] = max(maxReach[left], right)

    # Step 3: Greedy algorithm to cover the garden
    taps = 0          # Number of taps used
    currEnd = 0       # Current furthest point we can reach
    nextEnd = 0       # Next furthest point we can reach

    # We iterate through each position in the garden
    for i in range(n + 1):
        if i > nextEnd:
            # We found a gap that cannot be covered
            return -1

        # Update nextEnd to be the maximum reach from positions up to i
        nextEnd = max(nextEnd, maxReach[i])

        # If we've reached the end of current interval, we need a new tap
        if i == currEnd and i < n:
            taps += 1
            currEnd = nextEnd

    return taps
```

```javascript
// Time: O(n) | Space: O(n)
function minTaps(n, ranges) {
  /**
   * Find minimum number of taps to water entire garden [0, n]
   *
   * Approach:
   * 1. Create maxReach array to track furthest point reachable from each position
   * 2. For each tap, update the reach for its starting position
   * 3. Use greedy algorithm to cover the garden with minimum intervals
   */

  // Step 1: Create array to track maximum reach from each position
  // maxReach[i] = furthest point we can reach starting from position i
  const maxReach = new Array(n + 1).fill(0);

  // Step 2: For each tap, update the maximum reach from its starting position
  for (let i = 0; i <= n; i++) {
    // Calculate the interval this tap can cover
    const left = Math.max(0, i - ranges[i]);
    const right = Math.min(n, i + ranges[i]);

    // Update the maximum reach from the left position
    // We store the furthest right endpoint for each starting position
    maxReach[left] = Math.max(maxReach[left], right);
  }

  // Step 3: Greedy algorithm to cover the garden
  let taps = 0; // Number of taps used
  let currEnd = 0; // Current furthest point we can reach
  let nextEnd = 0; // Next furthest point we can reach

  // We iterate through each position in the garden
  for (let i = 0; i <= n; i++) {
    if (i > nextEnd) {
      // We found a gap that cannot be covered
      return -1;
    }

    // Update nextEnd to be the maximum reach from positions up to i
    nextEnd = Math.max(nextEnd, maxReach[i]);

    // If we've reached the end of current interval, we need a new tap
    if (i === currEnd && i < n) {
      taps++;
      currEnd = nextEnd;
    }
  }

  return taps;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minTaps(int n, int[] ranges) {
        /**
         * Find minimum number of taps to water entire garden [0, n]
         *
         * Approach:
         * 1. Create maxReach array to track furthest point reachable from each position
         * 2. For each tap, update the reach for its starting position
         * 3. Use greedy algorithm to cover the garden with minimum intervals
         */

        // Step 1: Create array to track maximum reach from each position
        // maxReach[i] = furthest point we can reach starting from position i
        int[] maxReach = new int[n + 1];

        // Step 2: For each tap, update the maximum reach from its starting position
        for (int i = 0; i <= n; i++) {
            // Calculate the interval this tap can cover
            int left = Math.max(0, i - ranges[i]);
            int right = Math.min(n, i + ranges[i]);

            // Update the maximum reach from the left position
            // We store the furthest right endpoint for each starting position
            maxReach[left] = Math.max(maxReach[left], right);
        }

        // Step 3: Greedy algorithm to cover the garden
        int taps = 0;          // Number of taps used
        int currEnd = 0;       // Current furthest point we can reach
        int nextEnd = 0;       // Next furthest point we can reach

        // We iterate through each position in the garden
        for (int i = 0; i <= n; i++) {
            if (i > nextEnd) {
                // We found a gap that cannot be covered
                return -1;
            }

            // Update nextEnd to be the maximum reach from positions up to i
            nextEnd = Math.max(nextEnd, maxReach[i]);

            // If we've reached the end of current interval, we need a new tap
            if (i == currEnd && i < n) {
                taps++;
                currEnd = nextEnd;
            }
        }

        return taps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the ranges array to build the maxReach array: O(n)
- We make another pass through the garden positions: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create a maxReach array of size n+1: O(n)
- We use a few integer variables: O(1)
- Total: O(n)

The linear time complexity makes this solution efficient even for the maximum constraints (n = 10^4).

## Common Mistakes

1. **Forgetting to clip intervals to garden bounds**: When a tap's range extends beyond 0 or n, you must clip it. For example, tap at position 1 with range 4 covers [-3, 5], but the garden only goes from 0 to n. Solution: Always use `max(0, i - ranges[i])` and `min(n, i + ranges[i])`.

2. **Incorrect greedy algorithm logic**: The condition `if (i == currEnd && i < n)` is subtle but crucial. We only increment taps when we've exhausted our current reach AND we haven't reached the end. Forgetting `i < n` would cause an extra tap when we've already covered the garden.

3. **Not handling unreachable positions**: If `i > nextEnd` at any point, it means there's a gap that cannot be covered. Some candidates miss this check and get stuck in infinite loops or return incorrect results.

4. **Confusing this with standard interval scheduling**: This is an interval covering problem (cover [0, n] with minimum intervals), not interval scheduling (maximize non-overlapping intervals). The greedy strategy is different: here we want intervals that start early and extend far, not intervals that end early.

## When You'll See This Pattern

This problem uses the **interval covering** pattern with a greedy approach. You'll see similar patterns in:

1. **Jump Game II (LeetCode 45)**: Minimum number of jumps to reach the end of an array. The transformation is almost identical - instead of maxReach from taps, you have max jump from each position.

2. **Video Stitching (LeetCode 1024)**: Minimum number of clips to cover a time interval [0, time]. Exactly the same pattern - clips are intervals that need to cover [0, time].

3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**: While this is about finding non-overlapping intervals, it uses similar interval manipulation techniques.

The core pattern: When you need to cover a range with minimum intervals, transform the problem into tracking maximum reach from each position and use a greedy algorithm.

## Key Takeaways

1. **Interval covering problems can often be solved with greedy algorithms**: Sort by start position (or preprocess into a maxReach array) and always choose the interval that extends your coverage the furthest.

2. **Transform the problem**: The tap positions and ranges can be transformed into intervals. Once in interval form, the problem becomes more familiar and easier to solve.

3. **Watch for edge cases**: Always clip intervals to valid bounds, check for unreachable gaps, and handle the end condition carefully (don't add an extra tap when you've already reached the end).

[Practice this problem on CodeJeet](/problem/minimum-number-of-taps-to-open-to-water-a-garden)
