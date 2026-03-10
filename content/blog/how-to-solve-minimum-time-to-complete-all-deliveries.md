---
title: "How to Solve Minimum Time to Complete All Deliveries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Complete All Deliveries. Medium difficulty, 34.5% acceptance rate. Topics: Math, Binary Search."
date: "2026-02-21"
category: "dsa-patterns"
tags: ["minimum-time-to-complete-all-deliveries", "math", "binary-search", "medium"]
---

# How to Solve Minimum Time to Complete All Deliveries

This problem asks us to find the minimum time required for two drones to complete their deliveries, where each delivery takes exactly one hour and only one drone can deliver at a time. The tricky part is that we need to schedule deliveries optimally between two drones with different workloads, which isn't as simple as just adding their delivery counts together.

## Visual Walkthrough

Let's walk through an example with `d = [3, 5]` (drone 1 needs 3 deliveries, drone 2 needs 5 deliveries).

**Hour-by-hour scheduling:**

- Hour 1: Drone 2 delivers (most remaining deliveries)
- Hour 2: Drone 1 delivers (drone 2 just delivered, so we pick drone 1)
- Hour 3: Drone 2 delivers (both have 1 delivery made, but drone 2 has more remaining)
- Hour 4: Drone 1 delivers
- Hour 5: Drone 2 delivers
- Hour 6: Drone 1 delivers (drone 1 completes its 3rd delivery)
- Hour 7: Drone 2 delivers
- Hour 8: Drone 2 delivers (completes its 5th delivery)

Total time: 8 hours.

Notice the pattern: We always want the drone with more remaining deliveries to go next, but we can't use the same drone twice in a row. This creates an alternating pattern where the busier drone gets slightly more slots.

## Brute Force Approach

A naive approach would be to simulate the process hour by hour:

1. Track remaining deliveries for each drone
2. At each hour, choose the drone with the most remaining deliveries that didn't deliver in the previous hour
3. Continue until both drones have 0 deliveries

The problem with this approach is that it runs in O(T) time where T is the total time needed. For large delivery counts (up to 10^9 in some constraints), this is far too slow. We need a mathematical solution rather than simulation.

## Optimized Approach

The key insight is that we can think of this as a **binary search problem** on the answer (minimum time).

**Why binary search works:**

- If we can check whether it's possible to complete all deliveries in `t` hours, we can search for the minimum `t`
- The checking function needs to determine if two drones with delivery counts `d1` and `d2` can finish in `t` hours given the constraint that no drone can deliver twice in a row

**The feasibility check:**
For a given time `t`, we need to check if we can schedule deliveries such that:

1. Each drone `i` gets at least `d[i]` delivery slots
2. No drone gets two consecutive slots (except through gaps)
3. The total slots used ≤ `t`

The mathematical condition is:

- Let `maxDeliveries = max(d[0], d[1])`
- Let `minDeliveries = min(d[0], d[1])`
- In `t` hours, the maximum possible deliveries for the busier drone is `(t + 1) // 2` (every other hour starting from hour 1)
- The maximum possible deliveries for the less busy drone is `t // 2` (every other hour starting from hour 2)
- We need: `maxDeliveries ≤ (t + 1) // 2` AND `minDeliveries ≤ t // 2` AND `d[0] + d[1] ≤ t`

Actually, there's a simpler and more correct way to think about it: In `t` hours, we have `t` delivery slots total. The busier drone can take at most `ceil(t/2)` slots, and the other drone can take at most `floor(t/2)` slots. But we also need to ensure the sum doesn't exceed `t`, which is automatically true if individual constraints are met.

The correct feasibility condition is: `max(d[0], d[1]) ≤ (t + 1) // 2` and `d[0] + d[1] ≤ t`

## Optimal Solution

We use binary search to find the minimum time. The search space is from 0 to `2 * max(d[0], d[1])` (a conservative upper bound).

<div class="code-group">

```python
# Time: O(log(max(d))) | Space: O(1)
def min_time_to_complete_deliveries(d):
    """
    Find minimum time for two drones to complete deliveries.

    Args:
        d: List of two integers [d1, d2] representing deliveries needed

    Returns:
        Minimum hours required
    """
    # Extract delivery counts
    d1, d2 = d[0], d[1]

    # Binary search bounds
    left, right = 0, 2 * max(d1, d2)

    # Helper function to check if deliveries can be completed in 'time' hours
    def can_complete(time):
        """
        Check if both drones can finish their deliveries within 'time' hours.

        The key constraints:
        1. No drone can deliver twice in a row
        2. Each delivery takes 1 hour
        3. Only one drone can deliver at a time

        In 'time' hours:
        - Maximum slots for busier drone: ceil(time/2) = (time + 1) // 2
        - Maximum slots for other drone: floor(time/2) = time // 2
        - Total slots available: time
        """
        # Busier drone needs at most (time + 1) // 2 slots
        if max(d1, d2) > (time + 1) // 2:
            return False

        # Total deliveries must fit in available time slots
        if d1 + d2 > time:
            return False

        return True

    # Binary search for minimum time
    while left < right:
        mid = (left + right) // 2

        if can_complete(mid):
            # Try for smaller time
            right = mid
        else:
            # Need more time
            left = mid + 1

    return left
```

```javascript
// Time: O(log(max(d))) | Space: O(1)
function minTimeToCompleteDeliveries(d) {
  /**
   * Find minimum time for two drones to complete deliveries.
   *
   * @param {number[]} d - Array of two integers [d1, d2] representing deliveries needed
   * @return {number} Minimum hours required
   */
  const [d1, d2] = d;

  // Binary search bounds - from 0 to conservative upper bound
  let left = 0;
  let right = 2 * Math.max(d1, d2);

  /**
   * Check if deliveries can be completed in given time
   * @param {number} time - Hours available
   * @return {boolean} True if possible, false otherwise
   */
  const canComplete = (time) => {
    // Busier drone needs at most ceil(time/2) slots
    if (Math.max(d1, d2) > Math.ceil(time / 2)) {
      return false;
    }

    // Total deliveries must fit in available slots
    if (d1 + d2 > time) {
      return false;
    }

    return true;
  };

  // Binary search for minimum time
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canComplete(mid)) {
      // Try for smaller time
      right = mid;
    } else {
      // Need more time
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(log(max(d))) | Space: O(1)
public class Solution {
    public int minTimeToCompleteDeliveries(int[] d) {
        /**
         * Find minimum time for two drones to complete deliveries.
         *
         * @param d Array of two integers [d1, d2] representing deliveries needed
         * @return Minimum hours required
         */
        int d1 = d[0];
        int d2 = d[1];

        // Binary search bounds
        int left = 0;
        int right = 2 * Math.max(d1, d2); // Conservative upper bound

        // Binary search for minimum time
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canComplete(d1, d2, mid)) {
                // Try for smaller time
                right = mid;
            } else {
                // Need more time
                left = mid + 1;
            }
        }

        return left;
    }

    /**
     * Check if deliveries can be completed in given time
     * @param d1 Deliveries needed by drone 1
     * @param d2 Deliveries needed by drone 2
     * @param time Hours available
     * @return True if possible, false otherwise
     */
    private boolean canComplete(int d1, int d2, int time) {
        // Busier drone needs at most ceil(time/2) slots
        if (Math.max(d1, d2) > (time + 1) / 2) {
            return false;
        }

        // Total deliveries must fit in available slots
        if (d1 + d2 > time) {
            return false;
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(max(d)))

- We perform binary search over a range from 0 to 2×max(d1, d2)
- Each iteration takes O(1) time for the feasibility check
- The number of iterations is logarithmic in the search range

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the total sum constraint:** Some candidates only check `max(d1, d2) ≤ ceil(t/2)` but forget that `d1 + d2 ≤ t` is also necessary. Consider `d = [5, 5]` with t=6: ceil(6/2)=3, so max constraint passes, but 5+5=10 > 6, so it's impossible.

2. **Incorrect binary search bounds:** Using `d1 + d2` as the upper bound is insufficient. For `d = [100, 1]`, we need at least 100 hours for the first drone (can only deliver every other hour), so the upper bound should be at least 2×max(d1, d2).

3. **Off-by-one errors in ceil/floor calculations:** Remember that `ceil(t/2) = (t + 1) // 2` in integer arithmetic. Using `t/2 + 1` or `(t + 2) // 2` would be incorrect.

4. **Trying to simulate hour-by-hour:** For large delivery counts, simulation is too slow. Recognize that this is a scheduling problem that can be solved mathematically.

## When You'll See This Pattern

This binary search on answer pattern appears in many optimization problems:

1. **Koko Eating Bananas (LeetCode 875)** - Find minimum eating speed to finish bananas in h hours. Similar structure: binary search on possible speeds, with a feasibility check.

2. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Find minimum capacity to ship packages in D days. Again, binary search on capacity with a checking function.

3. **Split Array Largest Sum (LeetCode 410)** - Minimize the largest sum among m subarrays. Binary search on the maximum sum with a feasibility check.

The pattern: When you need to find the minimum/maximum of something, and you can easily check if a candidate value works, binary search is often the solution.

## Key Takeaways

1. **Binary search isn't just for sorted arrays:** When you can transform "find minimum X" into "does X work?" and the feasibility check is efficient, binary search on the answer range is powerful.

2. **Scheduling constraints often have mathematical formulations:** Instead of simulating, look for inequalities that capture the constraints. Here, the "no consecutive slots" constraint becomes `max(d) ≤ ceil(t/2)`.

3. **Test with edge cases:** Always check scenarios like one drone having many more deliveries than the other, both drones having equal deliveries, and the case where total deliveries exactly equals available slots.

[Practice this problem on CodeJeet](/problem/minimum-time-to-complete-all-deliveries)
