---
title: "How to Solve Maximum Coins From K Consecutive Bags — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Coins From K Consecutive Bags. Medium difficulty, 24.5% acceptance rate. Topics: Array, Binary Search, Greedy, Sliding Window, Sorting."
date: "2026-06-24"
category: "dsa-patterns"
tags: ["maximum-coins-from-k-consecutive-bags", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Maximum Coins From K Consecutive Bags

This problem asks us to find the maximum coins we can collect from exactly `k` consecutive bags on an infinite number line, where coins are distributed in non-overlapping segments. What makes this tricky is that we have an infinite line with sparse coin distributions, and we need to efficiently calculate sums across arbitrary windows of length `k`. The non-overlapping segments constraint is key—it allows us to transform the problem into a manageable form.

## Visual Walkthrough

Let's walk through an example:  
`coins = [[1, 3, 5], [5, 7, 2], [8, 10, 3]]`, `k = 4`

We have three segments:

- Bags 1-3: 5 coins each
- Bags 5-7: 2 coins each
- Bags 8-10: 3 coins each

We need to find the best window of exactly 4 consecutive bags. Let's test some windows:

**Window starting at bag 1**: Covers bags 1, 2, 3, 4

- Bags 1-3: 5 coins each = 15 coins
- Bag 4: 0 coins (not in any segment)  
  Total = 15 coins

**Window starting at bag 2**: Covers bags 2, 3, 4, 5

- Bags 2-3: 5 coins each = 10 coins
- Bag 4: 0 coins
- Bag 5: 2 coins  
  Total = 12 coins

**Window starting at bag 3**: Covers bags 3, 4, 5, 6

- Bag 3: 5 coins
- Bag 4: 0 coins
- Bags 5-6: 2 coins each = 4 coins  
  Total = 9 coins

**Window starting at bag 4**: Covers bags 4, 5, 6, 7

- Bag 4: 0 coins
- Bags 5-7: 2 coins each = 6 coins  
  Total = 6 coins

**Window starting at bag 5**: Covers bags 5, 6, 7, 8

- Bags 5-7: 2 coins each = 6 coins
- Bag 8: 3 coins  
  Total = 9 coins

**Window starting at bag 6**: Covers bags 6, 7, 8, 9

- Bags 6-7: 2 coins each = 4 coins
- Bags 8-9: 3 coins each = 6 coins  
  Total = 10 coins

**Window starting at bag 7**: Covers bags 7, 8, 9, 10

- Bag 7: 2 coins
- Bags 8-10: 3 coins each = 9 coins  
  Total = 11 coins

The maximum is 15 coins from window starting at bag 1. Notice we only need to check windows that start at segment boundaries or near them—windows fully inside empty regions give 0 coins.

## Brute Force Approach

A naive approach would be to check every possible starting position on the number line. Since the line is infinite, we need to bound our search. We only need to check windows that could potentially contain coins, which means windows that start from `min(li)` to `max(ri) - k + 1`.

For each starting position, we would:

1. Calculate the window end = start + k - 1
2. Loop through all coin segments
3. For each segment, calculate the overlap with our window
4. Sum up coins from all overlaps

This gives us O(n × m) time complexity where n is the number of possible starting positions and m is the number of coin segments. With large coordinate values, this becomes infeasible.

The key insight is that we don't need to check every integer position—we only need to check positions where the window boundary aligns with segment boundaries, since moving the window within a continuous region of the same coin value won't change the total.

## Optimized Approach

The optimal solution uses a **prefix sum** approach combined with **binary search**:

1. **Preprocessing**: Since segments are non-overlapping, we can create arrays of:
   - Segment start positions
   - Segment end positions
   - Prefix sums of total coins in segments

2. **Key Insight**: For any window [start, start + k - 1], the total coins = coins from:
   - Full segments completely inside the window
   - Partial overlaps at the left and right edges

3. **Efficient Calculation**: We can find:
   - Leftmost segment that overlaps with the window (using binary search)
   - Rightmost segment that overlaps with the window
   - Sum of full segments between them (using prefix sums)
   - Add partial overlaps at boundaries

4. **Candidate Positions**: We only need to check windows where:
   - Window starts at a segment start position
   - Window ends at a segment end position
   - Window starts right after a segment ends
   - Window ends right before a segment starts

This reduces the number of windows to check from potentially millions to O(m) where m is the number of segments.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m log m) where m = number of segments
# Space: O(m) for storing prefix sums and boundaries
def maximumCoins(coins, k):
    if not coins:
        return 0

    # Sort segments by start position
    coins.sort()
    m = len(coins)

    # Extract start and end positions
    starts = [coins[i][0] for i in range(m)]
    ends = [coins[i][1] for i in range(m)]

    # Calculate prefix sums of total coins in segments
    # prefix[i] = sum of coins in segments 0 to i-1
    prefix = [0] * (m + 1)
    for i in range(m):
        prefix[i + 1] = prefix[i] + (coins[i][1] - coins[i][0] + 1) * coins[i][2]

    # Helper function to calculate coins in window [L, R]
    def getCoinsInWindow(L, R):
        # Find first segment that ends >= L (could overlap)
        left_idx = bisect_left(ends, L)
        # Find last segment that starts <= R (could overlap)
        right_idx = bisect_right(starts, R) - 1

        # If no segments overlap with window
        if left_idx > right_idx or left_idx >= m or right_idx < 0:
            return 0

        total = 0

        # Add coins from full segments between left_idx and right_idx
        if left_idx <= right_idx:
            total += prefix[right_idx + 1] - prefix[left_idx]

        # Subtract partial overlaps that were counted but shouldn't be
        # Left edge: if segment starts before L, subtract the part before L
        if left_idx < m and starts[left_idx] < L:
            overlap = min(ends[left_idx], L - 1) - starts[left_idx] + 1
            total -= overlap * coins[left_idx][2]

        # Right edge: if segment ends after R, subtract the part after R
        if right_idx >= 0 and ends[right_idx] > R:
            overlap = ends[right_idx] - max(starts[right_idx], R + 1) + 1
            total -= overlap * coins[right_idx][2]

        return total

    # Generate candidate window start positions
    candidates = set()
    for l, r, _ in coins:
        # Window could start at segment start
        candidates.add(l)
        # Window could end at segment end (start = end - k + 1)
        candidates.add(r - k + 1)
        # Window could start right after segment ends
        candidates.add(r + 1)
        # Window could end right before segment starts (start = start - k)
        candidates.add(l - k)

    # Also check windows that don't touch any segments
    # Minimum possible start
    min_start = min(starts) - k
    max_start = max(ends) + 1
    candidates.add(min_start)
    candidates.add(max_start)

    # Filter valid candidates (could be negative, that's fine for infinite line)
    candidates = [start for start in candidates if start + k - 1 >= 0]

    # Find maximum coins among all candidate windows
    max_coins = 0
    for start in candidates:
        end = start + k - 1
        coins_in_window = getCoinsInWindow(start, end)
        max_coins = max(max_coins, coins_in_window)

    return max_coins

# Python's bisect module
from bisect import bisect_left, bisect_right
```

```javascript
// Time: O(m log m) where m = number of segments
// Space: O(m) for storing prefix sums and boundaries
function maximumCoins(coins, k) {
  if (!coins || coins.length === 0) return 0;

  // Sort segments by start position
  coins.sort((a, b) => a[0] - b[0]);
  const m = coins.length;

  // Extract start and end positions
  const starts = coins.map((seg) => seg[0]);
  const ends = coins.map((seg) => seg[1]);

  // Calculate prefix sums of total coins in segments
  // prefix[i] = sum of coins in segments 0 to i-1
  const prefix = new Array(m + 1).fill(0);
  for (let i = 0; i < m; i++) {
    const [l, r, c] = coins[i];
    prefix[i + 1] = prefix[i] + (r - l + 1) * c;
  }

  // Helper function to calculate coins in window [L, R]
  function getCoinsInWindow(L, R) {
    // Find first segment that ends >= L (could overlap)
    let leftIdx = lowerBound(ends, L);
    // Find last segment that starts <= R (could overlap)
    let rightIdx = upperBound(starts, R) - 1;

    // If no segments overlap with window
    if (leftIdx > rightIdx || leftIdx >= m || rightIdx < 0) {
      return 0;
    }

    let total = 0;

    // Add coins from full segments between leftIdx and rightIdx
    if (leftIdx <= rightIdx) {
      total += prefix[rightIdx + 1] - prefix[leftIdx];
    }

    // Subtract partial overlaps that were counted but shouldn't be
    // Left edge: if segment starts before L, subtract the part before L
    if (leftIdx < m && starts[leftIdx] < L) {
      const overlap = Math.min(ends[leftIdx], L - 1) - starts[leftIdx] + 1;
      total -= overlap * coins[leftIdx][2];
    }

    // Right edge: if segment ends after R, subtract the part after R
    if (rightIdx >= 0 && ends[rightIdx] > R) {
      const overlap = ends[rightIdx] - Math.max(starts[rightIdx], R + 1) + 1;
      total -= overlap * coins[rightIdx][2];
    }

    return total;
  }

  // Generate candidate window start positions
  const candidates = new Set();
  for (const [l, r, _] of coins) {
    // Window could start at segment start
    candidates.add(l);
    // Window could end at segment end (start = end - k + 1)
    candidates.add(r - k + 1);
    // Window could start right after segment ends
    candidates.add(r + 1);
    // Window could end right before segment starts (start = start - k)
    candidates.add(l - k);
  }

  // Also check windows that don't touch any segments
  const minStart = Math.min(...starts) - k;
  const maxStart = Math.max(...ends) + 1;
  candidates.add(minStart);
  candidates.add(maxStart);

  // Filter valid candidates (could be negative, that's fine for infinite line)
  const validCandidates = Array.from(candidates).filter((start) => start + k - 1 >= 0);

  // Find maximum coins among all candidate windows
  let maxCoins = 0;
  for (const start of validCandidates) {
    const end = start + k - 1;
    const coinsInWindow = getCoinsInWindow(start, end);
    maxCoins = Math.max(maxCoins, coinsInWindow);
  }

  return maxCoins;
}

// Helper binary search functions
function lowerBound(arr, target) {
  let left = 0,
    right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

function upperBound(arr, target) {
  let left = 0,
    right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}
```

```java
// Time: O(m log m) where m = number of segments
// Space: O(m) for storing prefix sums and boundaries
import java.util.*;

class Solution {
    public long maximumCoins(int[][] coins, int k) {
        if (coins == null || coins.length == 0) return 0;

        // Sort segments by start position
        Arrays.sort(coins, (a, b) -> Integer.compare(a[0], b[0]));
        int m = coins.length;

        // Extract start and end positions
        int[] starts = new int[m];
        int[] ends = new int[m];
        for (int i = 0; i < m; i++) {
            starts[i] = coins[i][0];
            ends[i] = coins[i][1];
        }

        // Calculate prefix sums of total coins in segments
        // prefix[i] = sum of coins in segments 0 to i-1
        long[] prefix = new long[m + 1];
        for (int i = 0; i < m; i++) {
            int l = coins[i][0], r = coins[i][1], c = coins[i][2];
            prefix[i + 1] = prefix[i] + (long)(r - l + 1) * c;
        }

        // Helper function to calculate coins in window [L, R]
        // Using inner class to organize the logic
        WindowCalculator calculator = new WindowCalculator(coins, starts, ends, prefix);

        // Generate candidate window start positions
        Set<Integer> candidateSet = new HashSet<>();
        for (int[] seg : coins) {
            int l = seg[0], r = seg[1];
            // Window could start at segment start
            candidateSet.add(l);
            // Window could end at segment end (start = end - k + 1)
            candidateSet.add(r - k + 1);
            // Window could start right after segment ends
            candidateSet.add(r + 1);
            // Window could end right before segment starts (start = start - k)
            candidateSet.add(l - k);
        }

        // Also check windows that don't touch any segments
        int minStart = Arrays.stream(starts).min().getAsInt() - k;
        int maxStart = Arrays.stream(ends).max().getAsInt() + 1;
        candidateSet.add(minStart);
        candidateSet.add(maxStart);

        // Filter valid candidates (could be negative, that's fine for infinite line)
        List<Integer> candidates = new ArrayList<>();
        for (int start : candidateSet) {
            if (start + k - 1 >= 0) {
                candidates.add(start);
            }
        }

        // Find maximum coins among all candidate windows
        long maxCoins = 0;
        for (int start : candidates) {
            int end = start + k - 1;
            long coinsInWindow = calculator.getCoinsInWindow(start, end);
            maxCoins = Math.max(maxCoins, coinsInWindow);
        }

        return maxCoins;
    }

    // Helper class to encapsulate window calculation logic
    private class WindowCalculator {
        private int[][] coins;
        private int[] starts, ends;
        private long[] prefix;

        public WindowCalculator(int[][] coins, int[] starts, int[] ends, long[] prefix) {
            this.coins = coins;
            this.starts = starts;
            this.ends = ends;
            this.prefix = prefix;
        }

        public long getCoinsInWindow(int L, int R) {
            // Find first segment that ends >= L (could overlap)
            int leftIdx = lowerBound(ends, L);
            // Find last segment that starts <= R (could overlap)
            int rightIdx = upperBound(starts, R) - 1;

            // If no segments overlap with window
            if (leftIdx > rightIdx || leftIdx >= coins.length || rightIdx < 0) {
                return 0;
            }

            long total = 0;

            // Add coins from full segments between leftIdx and rightIdx
            if (leftIdx <= rightIdx) {
                total += prefix[rightIdx + 1] - prefix[leftIdx];
            }

            // Subtract partial overlaps that were counted but shouldn't be
            // Left edge: if segment starts before L, subtract the part before L
            if (leftIdx < coins.length && starts[leftIdx] < L) {
                int overlap = Math.min(ends[leftIdx], L - 1) - starts[leftIdx] + 1;
                total -= (long)overlap * coins[leftIdx][2];
            }

            // Right edge: if segment ends after R, subtract the part after R
            if (rightIdx >= 0 && ends[rightIdx] > R) {
                int overlap = ends[rightIdx] - Math.max(starts[rightIdx], R + 1) + 1;
                total -= (long)overlap * coins[rightIdx][2];
            }

            return total;
        }

        private int lowerBound(int[] arr, int target) {
            int left = 0, right = arr.length;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (arr[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        }

        private int upperBound(int[] arr, int target) {
            int left = 0, right = arr.length;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (arr[mid] <= target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m log m) where m is the number of coin segments

- Sorting the segments: O(m log m)
- Building prefix sums: O(m)
- Generating candidates: O(m)
- For each candidate (O(m) candidates), we perform binary search: O(log m) per candidate
- Total: O(m log m) + O(m) + O(m log m) = O(m log m)

**Space Complexity**: O(m)

- We store arrays for starts, ends, and prefix sums: O(m)
- We store the set of candidates: O(m)
- Total: O(m)

## Common Mistakes

1. **Checking every integer position**: The infinite number line might tempt candidates to check every possible window start. This is O(n × m) which is infeasible for large coordinates. Remember: optimal window boundaries will align with segment boundaries.

2. **Incorrect overlap calculation**: When a window partially overlaps a segment, it's easy to make off-by-one errors. The formula `min(end, R) - max(start, L) + 1` gives the correct overlap length when there is overlap, but you must first check if `start <= R && end >= L`.

3. **Forgetting about windows with no coins**: Candidates might only check windows that touch segments, but the maximum could be 0 if all windows have no coins. Always include windows in empty regions.

4. **Integer overflow**: With large k values and coin counts, the total coins can exceed 32-bit integer limits. Use 64-bit integers (long in Java/JavaScript, int in Python handles big integers).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sums with Binary Search**: Similar to problems where you need to query sums over ranges efficiently. Related problems:
   - LeetCode 327: Count of Range Sum - uses prefix sums and binary search
   - LeetCode 493: Reverse Pairs - similar divide-and-conquer approach

2. **Interval/Window Optimization**: When you need to find optimal windows across intervals:
   - LeetCode 452: Minimum Number of Arrows to Burst Balloons - interval scheduling
   - LeetCode 435: Non-overlapping Intervals - interval manipulation

3. **Sparse Array Queries**: When you have sparse data on a large range:
   - LeetCode 699: Falling Squares - maintaining intervals with updates

## Key Takeaways

1. **When dealing with sparse distributions on large ranges, look for boundary alignment**: Optimal solutions often involve checking only positions where something changes (segment boundaries).

2. **Prefix sums + binary search is powerful for range queries**: When you need to repeatedly calculate sums over ranges, precomputing prefix sums and using binary search to find boundaries gives O(log n) queries.

3. **Non-overlapping intervals simplify problems**: The constraint that segments don't overlap means we can sort them and process linearly without worrying about complex overlap scenarios.

[Practice this problem on CodeJeet](/problem/maximum-coins-from-k-consecutive-bags)
