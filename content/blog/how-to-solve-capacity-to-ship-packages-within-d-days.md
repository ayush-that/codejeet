---
title: "How to Solve Capacity To Ship Packages Within D Days — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Capacity To Ship Packages Within D Days. Medium difficulty, 73.5% acceptance rate. Topics: Array, Binary Search."
date: "2027-01-09"
category: "dsa-patterns"
tags: ["capacity-to-ship-packages-within-d-days", "array", "binary-search", "medium"]
---

# How to Solve Capacity To Ship Packages Within D Days

You're given an array of package weights and a number of days. You need to find the minimum ship capacity that allows all packages to be shipped within the given days, with packages loaded in order each day. The tricky part is that you can't just sum and divide — you need to respect the order constraint while minimizing the maximum daily load.

## Visual Walkthrough

Let's trace through an example: `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, `days = 5`.

If we try capacity = 10:

- Day 1: [1, 2, 3, 4] (sum = 10)
- Day 2: [5] (sum = 5)
- Day 3: [6] (sum = 6)
- Day 4: [7] (sum = 7)
- Day 5: [8] (sum = 8) — Oops, we still have packages 9 and 10 left! This capacity is too small.

If we try capacity = 15:

- Day 1: [1, 2, 3, 4, 5] (sum = 15)
- Day 2: [6, 7] (sum = 13)
- Day 3: [8] (sum = 8)
- Day 4: [9] (sum = 9)
- Day 5: [10] (sum = 10) — Works perfectly!

But is 15 the minimum? Let's check capacity = 14:

- Day 1: [1, 2, 3, 4] (sum = 10, can't add 5 because 10+5=15 > 14)
- Day 2: [5, 6] (sum = 11)
- Day 3: [7] (sum = 7)
- Day 4: [8] (sum = 8)
- Day 5: [9] (sum = 9) — Still have package 10 left! So 14 is too small.

Therefore, the minimum capacity is 15. Notice that the answer must be at least the maximum single package weight (10) and at most the sum of all weights (55). This gives us a search space!

## Brute Force Approach

The brute force approach would be to try every possible capacity from the maximum weight to the total sum, checking each one to see if it works. For each capacity, we simulate loading packages day by day, making sure we never exceed the capacity.

Why this is too slow:

- If weights sum to S and max weight is M, we have S-M+1 possible capacities to check
- For each capacity, we need to iterate through all n packages to simulate loading
- This gives us O((S-M) × n) time complexity, which is O(S × n)
- With weights up to 500 and n up to 10^4, S could be 500 × 10^4 = 5×10^6, making this approach far too slow

## Optimized Approach

The key insight is that we can use **binary search** on the answer space! Here's the reasoning:

1. **Lower bound**: The minimum capacity must be at least the maximum single package weight. If it were less, that package couldn't be shipped at all.
2. **Upper bound**: The maximum capacity needed is the sum of all weights (if we could ship everything in one day).
3. **Monotonic property**: If capacity C works (all packages can be shipped within D days), then any capacity > C will also work. If capacity C doesn't work, then any capacity < C won't work either. This monotonic property is perfect for binary search!

The algorithm:

1. Set `left = max(weights)` and `right = sum(weights)`
2. While `left < right`:
   - Calculate `mid = (left + right) // 2`
   - Check if we can ship all packages within D days using capacity `mid`
   - If yes, try smaller capacities: `right = mid`
   - If no, try larger capacities: `left = mid + 1`
3. Return `left` (or `right`) — they'll be equal

The "can ship" check is straightforward: iterate through packages, accumulating weight. When adding the next package would exceed capacity, start a new day. Count days and return true if we finish within D days.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log S) where n = len(weights), S = sum(weights)
# Space: O(1) - only using constant extra space
def shipWithinDays(weights, days):
    """
    Find the minimum ship capacity to ship all packages within given days.

    Args:
        weights: List of package weights
        days: Maximum number of days allowed

    Returns:
        Minimum ship capacity needed
    """
    # Helper function to check if a given capacity works
    def can_ship(capacity):
        """
        Check if we can ship all packages within 'days' using given capacity.
        """
        current_load = 0  # Weight loaded on current day
        days_needed = 1   # Start with first day (we need at least 1 day)

        for weight in weights:
            # If adding this package would exceed capacity
            if current_load + weight > capacity:
                # Start a new day
                days_needed += 1
                current_load = 0

            # Add package to current day's load
            current_load += weight

            # Early exit: if we already need more days than allowed
            if days_needed > days:
                return False

        return True

    # The minimum capacity must be at least the heaviest package
    left = max(weights)
    # The maximum capacity needed is the sum of all packages
    right = sum(weights)

    # Binary search for the minimum capacity
    while left < right:
        mid = (left + right) // 2

        if can_ship(mid):
            # This capacity works, try smaller ones
            right = mid
        else:
            # This capacity is too small, try larger ones
            left = mid + 1

    # left == right at this point, both are the minimum capacity
    return left
```

```javascript
// Time: O(n log S) where n = weights.length, S = sum of weights
// Space: O(1) - only using constant extra space
function shipWithinDays(weights, days) {
  /**
   * Check if we can ship all packages within 'days' using given capacity.
   */
  function canShip(capacity) {
    let currentLoad = 0; // Weight loaded on current day
    let daysNeeded = 1; // Start with first day (we need at least 1 day)

    for (let weight of weights) {
      // If adding this package would exceed capacity
      if (currentLoad + weight > capacity) {
        // Start a new day
        daysNeeded++;
        currentLoad = 0;
      }

      // Add package to current day's load
      currentLoad += weight;

      // Early exit: if we already need more days than allowed
      if (daysNeeded > days) {
        return false;
      }
    }

    return true;
  }

  // The minimum capacity must be at least the heaviest package
  let left = Math.max(...weights);
  // The maximum capacity needed is the sum of all packages
  let right = weights.reduce((sum, weight) => sum + weight, 0);

  // Binary search for the minimum capacity
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canShip(mid)) {
      // This capacity works, try smaller ones
      right = mid;
    } else {
      // This capacity is too small, try larger ones
      left = mid + 1;
    }
  }

  // left == right at this point, both are the minimum capacity
  return left;
}
```

```java
// Time: O(n log S) where n = weights.length, S = sum of weights
// Space: O(1) - only using constant extra space
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        // Helper function to check if a given capacity works
        private boolean canShip(int capacity, int[] weights, int days) {
            int currentLoad = 0;  // Weight loaded on current day
            int daysNeeded = 1;   // Start with first day (we need at least 1 day)

            for (int weight : weights) {
                // If adding this package would exceed capacity
                if (currentLoad + weight > capacity) {
                    // Start a new day
                    daysNeeded++;
                    currentLoad = 0;
                }

                // Add package to current day's load
                currentLoad += weight;

                // Early exit: if we already need more days than allowed
                if (daysNeeded > days) {
                    return false;
                }
            }

            return true;
        }

        // The minimum capacity must be at least the heaviest package
        int left = 0;
        int right = 0;
        for (int weight : weights) {
            left = Math.max(left, weight);
            right += weight;
        }

        // Binary search for the minimum capacity
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canShip(mid, weights, days)) {
                // This capacity works, try smaller ones
                right = mid;
            } else {
                // This capacity is too small, try larger ones
                left = mid + 1;
            }
        }

        // left == right at this point, both are the minimum capacity
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log S)**

- `n` is the number of packages (length of weights array)
- `S` is the sum of all weights
- Binary search runs O(log S) iterations (from max weight to total sum)
- Each iteration calls `can_ship()` which takes O(n) time to simulate loading
- Total: O(n log S)

**Space Complexity: O(1)**

- We only use a few variables for counting and tracking
- No additional data structures proportional to input size
- The input arrays are not modified

## Common Mistakes

1. **Starting binary search from 0 instead of max(weights)**: The capacity must be at least the heaviest package. Starting from 0 wastes iterations and could cause incorrect results if the check function doesn't handle zero capacity properly.

2. **Infinite binary search loop**: Using `while left <= right` with `right = mid - 1` can skip the correct answer. The pattern `while left < right` with `right = mid` and `left = mid + 1` is safer for "minimum valid value" problems.

3. **Incorrect day counting in simulation**: Forgetting to initialize `days_needed = 1` (you need at least one day even if all packages fit). Or not resetting `current_load` properly when starting a new day.

4. **Not using early exit in simulation**: Continuing to simulate even after `days_needed > days` wastes time. Always include the early exit check.

## When You'll See This Pattern

This "binary search on answer" pattern appears in problems where:

1. You're asked to minimize a maximum value (or maximize a minimum value)
2. There's a monotonic relationship: if X works, then anything > X also works (for minimization)
3. Checking if a particular value works is easier than finding the optimal value directly

Related problems:

- **Split Array Largest Sum (Hard)**: Almost identical — minimize the largest sum among m subarrays. Same binary search approach.
- **Divide Chocolate (Hard)**: Maximize the minimum sweetness you get when splitting chocolate among k+1 people.
- **Cutting Ribbons (Medium)**: Find the maximum length to cut k equal-length ribbons from given ribbons.

## Key Takeaways

1. **When you need to minimize a maximum (or maximize a minimum)**, think about binary search on the answer space. The monotonic property is key: if capacity C works, any larger capacity also works.

2. **The check function is often simpler than finding the optimal value directly**. Focus on writing a correct `can_ship(capacity)` function first, then wrap it with binary search.

3. **Know your bounds**: The lower bound is usually obvious from constraints (max package weight). The upper bound is often the sum or another easily calculable maximum.

Related problems: [Split Array Largest Sum](/problem/split-array-largest-sum), [Divide Chocolate](/problem/divide-chocolate), [Cutting Ribbons](/problem/cutting-ribbons)
