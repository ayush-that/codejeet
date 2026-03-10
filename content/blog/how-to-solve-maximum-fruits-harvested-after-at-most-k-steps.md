---
title: "How to Solve Maximum Fruits Harvested After at Most K Steps — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Fruits Harvested After at Most K Steps. Hard difficulty, 61.0% acceptance rate. Topics: Array, Binary Search, Sliding Window, Prefix Sum."
date: "2027-09-19"
category: "dsa-patterns"
tags:
  [
    "maximum-fruits-harvested-after-at-most-k-steps",
    "array",
    "binary-search",
    "sliding-window",
    "hard",
  ]
---

# How to Solve Maximum Fruits Harvested After at Most K Steps

You're given positions of fruit trees on an infinite x-axis with fruit amounts, and you can move at most K steps total (starting from any position) to collect fruits. The challenge is to maximize your harvest. What makes this tricky is that you need to consider both directions of movement while staying within the step limit, and the optimal path might involve moving back and forth between trees rather than just a straight line.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
fruits = [[2,8], [6,3], [8,6]]
startPos = 5
k = 4
```

We need to find the maximum fruits we can collect by moving at most 4 steps total, starting from position 5.

**Step 1: Understanding movement possibilities**

- From start position 5, we can move left to tree at position 2 (3 steps round trip: 5→2→5)
- Or right to tree at position 6 (1 step round trip: 5→6→5)
- Or right to tree at position 8 (3 steps round trip: 5→8→5)

**Step 2: Considering combinations**
We can't just pick individual trees - we need to consider contiguous segments:

1. **Segment [6] only**: Move to position 6 and back = 1 step, collect 3 fruits
2. **Segment [2] only**: Move to position 2 and back = 6 steps (too many!)
3. **Segment [8] only**: Move to position 8 and back = 6 steps (too many!)
4. **Segment [6,8]**: Move 5→6→8→5 = 6 steps (too many!)
5. **Segment [2,6]**: Move 5→2→6→5 = 8 steps (too many!)

Wait, but what if we don't return to the start? The problem doesn't require returning! This is key.

**Step 3: Correct movement patterns**
We can end anywhere after K steps. Three patterns work:

1. **Go right only**: Start at 5, go to 6 (1 step), collect 3 fruits
2. **Go left only**: Start at 5, go to 2 (3 steps), collect 8 fruits
3. **Go left then right**: Start at 5, go to 2 (3 steps), collect 8 fruits, then go to 6 (4 more steps) = 7 total steps (too many!)
4. **Go right then left**: Start at 5, go to 8 (3 steps), collect 6 fruits, then go to 6 (2 more steps) = 5 total steps (too many!)

Actually, pattern 2 gives us 8 fruits with 3 steps - that's our best so far.

**Step 4: The insight about contiguous segments**
The optimal path always involves collecting from a contiguous segment of trees. Why? If you skip a tree in the middle, you could have collected it for free (no extra steps beyond what you're already traveling).

So we need to find the best contiguous segment where the travel distance ≤ K. The travel distance depends on whether we:

- Start left of the segment and move right
- Start right of the segment and move left
- Start inside the segment

For our example, the best is just tree at position 2: distance = |5-2| = 3 ≤ 4, collect 8 fruits.

## Brute Force Approach

A naive solution would try all possible starting positions and all possible movement sequences. Since there are infinite positions, this is impossible. A slightly better brute force would try all subsets of trees:

1. Generate all possible subsets of trees (2^n possibilities)
2. For each subset, check if they can be collected within K steps
3. Calculate the travel distance for each valid subset
4. Track the maximum fruits

The travel distance calculation is tricky: we need to find the minimum steps to visit all trees in the subset starting from our start position. This is essentially a traveling salesman problem on a line, which has a known optimal strategy: visit trees in sorted order.

**Why this fails:**

- 2^n subsets is exponential time (O(2^n))
- Even for n=1000, this is impossible
- We need to exploit the structure of the problem (trees on a line, sorted positions)

## Optimized Approach

The key insight is that **the optimal path always collects fruits from a contiguous segment of trees**. Once we know this, we can use a sliding window approach:

1. Maintain a window [left, right] of trees we're considering
2. Use two pointers to expand/shrink the window
3. For each window, calculate the minimum steps needed to collect all fruits in that window
4. Keep expanding the right pointer, and shrink the left pointer if the window requires more than K steps
5. Track the maximum fruits in any valid window

**Calculating minimum steps for a window:**
Let `l` = position of leftmost tree in window, `r` = position of rightmost tree in window, `s` = start position.

Three cases:

1. **Start position is left of the window**: Go to left end, then to right end: `(r - s)`
2. **Start position is right of the window**: Go to right end, then to left end: `(s - l)`
3. **Start position is inside the window**: Two possibilities:
   - Go to left end first, then to right end: `(s - l) + (r - l) = 2*(s - l) + (r - s)`
   - Go to right end first, then to left end: `(r - s) + (r - l) = 2*(r - s) + (s - l)`
     Take the minimum of these two.

Actually, we can simplify: The minimum distance is `min(2*(s-l) + (r-s), 2*(r-s) + (s-l))` which equals `r - l + min(s-l, r-s)`.

**Sliding window implementation:**

- Expand right pointer to include more trees
- While current window requires > K steps, shrink left pointer
- For each valid window, update maximum fruits
- Use prefix sums to quickly calculate total fruits in window

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxTotalFruits(fruits, startPos, k):
    """
    Calculate maximum fruits that can be collected within k steps.

    Args:
        fruits: List of [position, amount] pairs, sorted by position
        startPos: Starting position
        k: Maximum steps allowed

    Returns:
        Maximum total fruits collectable
    """
    n = len(fruits)
    left = 0  # Left pointer of sliding window
    total_fruits = 0  # Fruits in current window
    max_fruits = 0  # Best result found so far

    # Iterate through all possible right endpoints
    for right in range(n):
        # Add fruits at position fruits[right][0] to our window
        total_fruits += fruits[right][1]

        # Shrink window from left while it's invalid
        # A window is invalid if minimum steps to collect all fruits > k
        while left <= right and not is_window_valid(fruits, left, right, startPos, k):
            # Remove fruits at position fruits[left][0] from window
            total_fruits -= fruits[left][1]
            left += 1

        # Update maximum if current window is valid
        if left <= right:
            max_fruits = max(max_fruits, total_fruits)

    return max_fruits


def is_window_valid(fruits, left, right, startPos, k):
    """
    Check if we can collect all fruits in window [left, right] within k steps.

    The minimum steps to collect fruits in positions [l, r] starting from s is:
    Case 1: s <= l (start left of window): go to l then to r = r - s
    Case 2: s >= r (start right of window): go to r then to l = s - l
    Case 3: l < s < r (start inside window):
        Option A: go left first: (s - l) + (r - l) = 2*(s - l) + (r - s)
        Option B: go right first: (r - s) + (r - l) = 2*(r - s) + (s - l)
        Take minimum: r - l + min(s - l, r - s)
    """
    l_pos = fruits[left][0]  # Leftmost position in window
    r_pos = fruits[right][0]  # Rightmost position in window

    if startPos <= l_pos:
        # Start left of window: go to left end, then to right end
        return (r_pos - startPos) <= k
    elif startPos >= r_pos:
        # Start right of window: go to right end, then to left end
        return (startPos - l_pos) <= k
    else:
        # Start inside window: minimum of two strategies
        # Strategy 1: Go left first, then right
        # Strategy 2: Go right first, then left
        min_steps = min(
            2 * (startPos - l_pos) + (r_pos - startPos),
            2 * (r_pos - startPos) + (startPos - l_pos)
        )
        return min_steps <= k
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate maximum fruits that can be collected within k steps.
 * @param {number[][]} fruits - Array of [position, amount] pairs, sorted by position
 * @param {number} startPos - Starting position
 * @param {number} k - Maximum steps allowed
 * @return {number} Maximum total fruits collectable
 */
function maxTotalFruits(fruits, startPos, k) {
  const n = fruits.length;
  let left = 0; // Left pointer of sliding window
  let totalFruits = 0; // Fruits in current window
  let maxFruits = 0; // Best result found so far

  // Iterate through all possible right endpoints
  for (let right = 0; right < n; right++) {
    // Add fruits at position fruits[right][0] to our window
    totalFruits += fruits[right][1];

    // Shrink window from left while it's invalid
    // A window is invalid if minimum steps to collect all fruits > k
    while (left <= right && !isWindowValid(fruits, left, right, startPos, k)) {
      // Remove fruits at position fruits[left][0] from window
      totalFruits -= fruits[left][1];
      left++;
    }

    // Update maximum if current window is valid
    if (left <= right) {
      maxFruits = Math.max(maxFruits, totalFruits);
    }
  }

  return maxFruits;
}

/**
 * Check if we can collect all fruits in window [left, right] within k steps.
 * @param {number[][]} fruits - Array of [position, amount] pairs
 * @param {number} left - Left index of window
 * @param {number} right - Right index of window
 * @param {number} startPos - Starting position
 * @param {number} k - Maximum steps allowed
 * @return {boolean} True if window is valid
 */
function isWindowValid(fruits, left, right, startPos, k) {
  const lPos = fruits[left][0]; // Leftmost position in window
  const rPos = fruits[right][0]; // Rightmost position in window

  if (startPos <= lPos) {
    // Start left of window: go to left end, then to right end
    return rPos - startPos <= k;
  } else if (startPos >= rPos) {
    // Start right of window: go to right end, then to left end
    return startPos - lPos <= k;
  } else {
    // Start inside window: minimum of two strategies
    // Strategy 1: Go left first, then right
    // Strategy 2: Go right first, then left
    const strategy1 = 2 * (startPos - lPos) + (rPos - startPos);
    const strategy2 = 2 * (rPos - startPos) + (startPos - lPos);
    return Math.min(strategy1, strategy2) <= k;
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate maximum fruits that can be collected within k steps.
     * @param fruits Array of [position, amount] pairs, sorted by position
     * @param startPos Starting position
     * @param k Maximum steps allowed
     * @return Maximum total fruits collectable
     */
    public int maxTotalFruits(int[][] fruits, int startPos, int k) {
        int n = fruits.length;
        int left = 0;  // Left pointer of sliding window
        int totalFruits = 0;  // Fruits in current window
        int maxFruits = 0;  // Best result found so far

        // Iterate through all possible right endpoints
        for (int right = 0; right < n; right++) {
            // Add fruits at position fruits[right][0] to our window
            totalFruits += fruits[right][1];

            // Shrink window from left while it's invalid
            // A window is invalid if minimum steps to collect all fruits > k
            while (left <= right && !isWindowValid(fruits, left, right, startPos, k)) {
                // Remove fruits at position fruits[left][0] from window
                totalFruits -= fruits[left][1];
                left++;
            }

            // Update maximum if current window is valid
            if (left <= right) {
                maxFruits = Math.max(maxFruits, totalFruits);
            }
        }

        return maxFruits;
    }

    /**
     * Check if we can collect all fruits in window [left, right] within k steps.
     * @param fruits Array of [position, amount] pairs
     * @param left Left index of window
     * @param right Right index of window
     * @param startPos Starting position
     * @param k Maximum steps allowed
     * @return True if window is valid
     */
    private boolean isWindowValid(int[][] fruits, int left, int right, int startPos, int k) {
        int lPos = fruits[left][0];  // Leftmost position in window
        int rPos = fruits[right][0];  // Rightmost position in window

        if (startPos <= lPos) {
            // Start left of window: go to left end, then to right end
            return (rPos - startPos) <= k;
        } else if (startPos >= rPos) {
            // Start right of window: go to right end, then to left end
            return (startPos - lPos) <= k;
        } else {
            // Start inside window: minimum of two strategies
            // Strategy 1: Go left first, then right
            // Strategy 2: Go right first, then left
            int strategy1 = 2 * (startPos - lPos) + (rPos - startPos);
            int strategy2 = 2 * (rPos - startPos) + (startPos - lPos);
            return Math.min(strategy1, strategy2) <= k;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once with the right pointer (O(n))
- The left pointer only moves forward, so total left pointer movements are O(n)
- Each position is processed at most twice (once by right, once by left)
- The `isWindowValid` function runs in O(1) time

**Space Complexity: O(1)**

- We only use a few variables (left, right, total_fruits, max_fruits)
- No additional data structures proportional to input size
- The input array is given and not counted in our space usage

## Common Mistakes

1. **Forgetting that you don't need to return to start**: Many candidates assume they must return to the starting position, which adds unnecessary steps. The problem only limits total steps, not where you end.

2. **Incorrect distance calculation for start position inside window**: The formula `r - l + min(s-l, r-s)` is subtle. A common error is using `(s-l) + (r-s) = r-l` which assumes you start at one end, not in the middle.

3. **Not considering all three cases for start position**: Candidates often handle only the case where start is left of the window or right of the window, forgetting the case where start is inside the window.

4. **Using binary search instead of sliding window**: While binary search could work, it's more complex because the validity function isn't monotonic in a simple way. Sliding window is cleaner for this problem.

## When You'll See This Pattern

This problem combines **sliding window** with **distance calculation on a line**, which appears in several other problems:

1. **Minimum Size Subarray Sum (LeetCode 209)**: Find minimal length subarray with sum ≥ target. Similar sliding window technique.

2. **Fruit Into Baskets (LeetCode 904)**: Collect fruits from at most 2 types of trees. Uses sliding window with constraint on distinct values.

3. **Longest Repeating Character Replacement (LeetCode 424)**: Find longest substring with same character after K replacements. Similar window expansion/shrinking logic.

The key pattern is: when you need to find a contiguous segment that optimizes some metric subject to a constraint, sliding window is often the right approach.

## Key Takeaways

1. **Optimal paths on a line often involve contiguous segments**: When movement is along a single dimension, skipping intermediate points rarely makes sense if you're passing by them anyway.

2. **Sliding window works well with sorted arrays and "within limit" constraints**: If the array is sorted and you're looking for a contiguous segment satisfying some condition, consider sliding window.

3. **Break down movement patterns into cases**: For distance calculations, explicitly consider all relative positions (left of, inside, right of) to avoid off-by-one errors.

Related problems: [Maximum Performance of a Team](/problem/maximum-performance-of-a-team)
