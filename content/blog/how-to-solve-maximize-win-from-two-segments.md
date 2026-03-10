---
title: "How to Solve Maximize Win From Two Segments — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Win From Two Segments. Medium difficulty, 37.4% acceptance rate. Topics: Array, Binary Search, Sliding Window."
date: "2030-03-02"
category: "dsa-patterns"
tags: ["maximize-win-from-two-segments", "array", "binary-search", "sliding-window", "medium"]
---

# How to Solve "Maximize Win From Two Segments"

You're given a sorted array of prize positions and an integer `k`. You need to choose **two non-overlapping segments** of length `k` each (or less if at boundaries) to maximize the total number of prizes you can collect. The challenge is that prizes at the same position count separately, and segments can't overlap. This problem is tricky because you need to consider all possible pairs of segments efficiently — a brute force approach would be too slow for large inputs.

## Visual Walkthrough

Let's walk through an example: `prizePositions = [1, 1, 2, 2, 3, 3, 5]`, `k = 2`.

We need to pick two segments of length 2. Think of each segment as a window that can cover prizes. For a window starting at position `x`, it covers all prizes from `x` to `x + k` inclusive.

**Step 1: Understand what one segment can collect**

- If we place a segment from position 1 to 3 (since 1+2=3), it covers prizes at positions 1, 2, and 3. That's 6 prizes total (two at each position).
- If we place a segment from position 3 to 5, it covers prizes at positions 3 and 5. That's 3 prizes.

**Step 2: The two-segment challenge**
We need two non-overlapping segments. Let's try a brute force check:

- Segment A: positions 1-3 (6 prizes)
- Segment B: positions 5-7 (only position 5 has prizes, so 1 prize)
  Total: 7 prizes

But is this optimal? What if we choose:

- Segment A: positions 1-3 (6 prizes)
- Segment B: positions 2-4? No, this overlaps with segment A!

**Step 3: The key insight**
We need to systematically check all possible pairs of non-overlapping segments. The optimal solution will:

1. For each possible ending position of the first segment, know the maximum prizes we could have collected up to that point
2. Combine that with the best possible second segment after that position

This suggests we need to precompute the best single segment ending at or before each position, then combine with the best segment starting after that position.

## Brute Force Approach

The most straightforward approach is to try all possible pairs of segments:

1. For each possible start position `i` for the first segment
2. For each possible start position `j` for the second segment where `j > i + k` (to avoid overlap)
3. Count prizes in each segment by scanning the array
4. Track the maximum sum

This would be O(n³) or O(n⁴) depending on implementation, since checking each segment requires scanning. For n up to 10⁵, this is completely infeasible.

Even a slightly better brute force that precomputes segment values would still be O(n²) for checking all pairs, which is too slow.

## Optimized Approach

The optimal solution uses **binary search** and **prefix maximums**:

**Key Insight 1: Fixed-length windows**
Since the array is sorted, for any starting index `i`, we can use binary search to find how many prizes are in `[prizePositions[i], prizePositions[i] + k]`. This gives us the value of a segment starting at position `i`.

**Key Insight 2: Non-overlapping constraint**
If we fix where the first segment ends, the second segment must start after `first_end + 1`. But we need to think in terms of indices, not positions.

**Key Insight 3: Best segment up to each point**
We can precompute, for each index `i`, the maximum prizes we could collect with a single segment ending at or before position `prizePositions[i]`. This is done by maintaining a running maximum as we iterate.

**Algorithm Steps:**

1. For each starting index `i`, use binary search to find the rightmost index `j` where `prizePositions[j] <= prizePositions[i] + k`
2. The number of prizes in this segment is `j - i + 1`
3. As we iterate from left to right, track the maximum segment value seen so far at each point
4. For each possible second segment starting at `i`, combine it with the best first segment that ends before `i`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maximizeWin(prizePositions, k):
    """
    Find maximum prizes from two non-overlapping segments of length k.

    Args:
        prizePositions: sorted list of prize positions
        k: maximum segment length

    Returns:
        Maximum number of prizes collectible with two segments
    """
    n = len(prizePositions)

    # best_until[i] = maximum prizes with one segment ending at or before index i
    best_until = [0] * n

    max_prizes = 0

    # Iterate through each possible starting position for segments
    for i in range(n):
        # Find rightmost index where prizePositions[j] <= prizePositions[i] + k
        # This gives the end of segment starting at i
        left, right = i, n - 1
        while left <= right:
            mid = (left + right) // 2
            if prizePositions[mid] <= prizePositions[i] + k:
                left = mid + 1
            else:
                right = mid - 1

        # right is now the last index within the segment
        segment_prizes = right - i + 1

        # Update answer: current segment + best segment before current start
        if i > 0:
            max_prizes = max(max_prizes, segment_prizes + best_until[i - 1])
        else:
            max_prizes = max(max_prizes, segment_prizes)

        # Update best_until for current ending position
        best_until[right] = max(best_until[right], segment_prizes)

        # Propagate best value forward if needed
        if i > 0:
            best_until[i] = max(best_until[i], best_until[i - 1])

    return max_prizes
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Find maximum prizes from two non-overlapping segments of length k.
 * @param {number[]} prizePositions - sorted array of prize positions
 * @param {number} k - maximum segment length
 * @return {number} maximum prizes collectible with two segments
 */
function maximizeWin(prizePositions, k) {
  const n = prizePositions.length;

  // bestUntil[i] = maximum prizes with one segment ending at or before index i
  const bestUntil = new Array(n).fill(0);

  let maxPrizes = 0;

  // Iterate through each possible starting position for segments
  for (let i = 0; i < n; i++) {
    // Binary search to find rightmost index within prizePositions[i] + k
    let left = i,
      right = n - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (prizePositions[mid] <= prizePositions[i] + k) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // right is now the last index within the segment
    const segmentPrizes = right - i + 1;

    // Update answer: current segment + best segment before current start
    if (i > 0) {
      maxPrizes = Math.max(maxPrizes, segmentPrizes + bestUntil[i - 1]);
    } else {
      maxPrizes = Math.max(maxPrizes, segmentPrizes);
    }

    // Update bestUntil for current ending position
    bestUntil[right] = Math.max(bestUntil[right], segmentPrizes);

    // Propagate best value forward if needed
    if (i > 0) {
      bestUntil[i] = Math.max(bestUntil[i], bestUntil[i - 1]);
    }
  }

  return maxPrizes;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int maximizeWin(int[] prizePositions, int k) {
        int n = prizePositions.length;

        // bestUntil[i] = maximum prizes with one segment ending at or before index i
        int[] bestUntil = new int[n];

        int maxPrizes = 0;

        // Iterate through each possible starting position for segments
        for (int i = 0; i < n; i++) {
            // Binary search to find rightmost index within prizePositions[i] + k
            int left = i, right = n - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (prizePositions[mid] <= prizePositions[i] + k) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            // right is now the last index within the segment
            int segmentPrizes = right - i + 1;

            // Update answer: current segment + best segment before current start
            if (i > 0) {
                maxPrizes = Math.max(maxPrizes, segmentPrizes + bestUntil[i - 1]);
            } else {
                maxPrizes = Math.max(maxPrizes, segmentPrizes);
            }

            // Update bestUntil for current ending position
            bestUntil[right] = Math.max(bestUntil[right], segmentPrizes);

            // Propagate best value forward if needed
            if (i > 0) {
                bestUntil[i] = Math.max(bestUntil[i], bestUntil[i - 1]);
            }
        }

        return maxPrizes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We iterate through each starting position `i`: O(n)
- For each `i`, we perform binary search to find the segment end: O(log n)
- Updating arrays and tracking maximums: O(1) per iteration
- Total: O(n log n)

**Space Complexity: O(n)**

- We store the `best_until` array of size n
- Other variables use constant space

## Common Mistakes

1. **Forgetting the array is sorted but has duplicates**: The binary search must use `<=` comparison, not `<`, to include prizes exactly at `prizePositions[i] + k`.

2. **Incorrect overlap checking**: Some candidates try to ensure segments don't overlap by checking `j > i` instead of ensuring the second segment starts after the first segment ends. Remember: segments of length `k` can overlap if their positions are too close.

3. **Not propagating best_until values**: The line `best_until[i] = max(best_until[i], best_until[i - 1])` is crucial. Without it, `best_until[i]` only contains the best segment ending exactly at `i`, not the best up to `i`.

4. **Off-by-one errors in binary search**: The loop condition `left <= right` and updating `left = mid + 1` or `right = mid - 1` must be precise. Test with small examples to verify.

## When You'll See This Pattern

This "two segments" or "two intervals" pattern appears in several optimization problems:

1. **Best Time to Buy and Sell Stock III**: Find two non-overlapping transactions that maximize profit. Similar to finding two segments that maximize sum.

2. **Two Best Non-Overlapping Events**: Choose two non-overlapping events to maximize total value. The dynamic programming approach is very similar.

3. **Maximum Sum of Two Non-Overlapping Subarrays**: Directly analogous but with sums instead of counts.

The core technique is **precomputing best results up to each point** and combining with best results after that point. This breaks an O(n²) problem into O(n log n) or O(n).

## Key Takeaways

1. **When you need to choose two non-overlapping things**, consider computing the best single choice up to each point, then combine with the best choice after that point.

2. **Sorted arrays + range queries often suggest binary search**. If you need to find how many elements fall in a range `[x, x + k]` in a sorted array, binary search is your friend.

3. **The "prefix maximum" technique** (like `best_until` array) is powerful for problems where you need to know the best result achievable up to a certain point.

Related problems: [Best Time to Buy and Sell Stock III](/problem/best-time-to-buy-and-sell-stock-iii), [Two Best Non-Overlapping Events](/problem/two-best-non-overlapping-events)
