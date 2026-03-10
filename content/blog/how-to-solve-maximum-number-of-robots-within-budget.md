---
title: "How to Solve Maximum Number of Robots Within Budget — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Robots Within Budget. Hard difficulty, 38.0% acceptance rate. Topics: Array, Binary Search, Queue, Sliding Window, Heap (Priority Queue)."
date: "2029-03-01"
category: "dsa-patterns"
tags: ["maximum-number-of-robots-within-budget", "array", "binary-search", "queue", "hard"]
---

# How to Solve Maximum Number of Robots Within Budget

This problem asks us to find the maximum number of consecutive robots we can run without exceeding a given budget. The tricky part is that the total cost has two components: the maximum charge time among selected robots (which dominates) plus the sum of running costs multiplied by the number of robots. This combination of a sliding maximum and a sliding sum makes the problem interesting and challenging.

**Why this is tricky:** You need to track both the maximum value in a window (for charge times) and the sum of values in that window (for running costs), while efficiently adjusting the window size. The naive approach would be too slow, requiring a clever combination of data structures.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `chargeTimes = [3, 6, 1, 3, 4]`
- `runningCosts = [2, 1, 3, 4, 5]`
- `budget = 25`

We want to find the largest `k` where we can select `k` consecutive robots with:
`max(chargeTimes in window) + k * sum(runningCosts in window) ≤ budget`

**Step-by-step reasoning:**

1. Start with window size 1 (single robot):
   - Robot 0: `max(3) + 1 * sum(2) = 3 + 2 = 5 ≤ 25` ✓
   - Robot 1: `6 + 1 = 7 ≤ 25` ✓
   - Robot 2: `1 + 3 = 4 ≤ 25` ✓
   - Robot 3: `3 + 4 = 7 ≤ 25` ✓
   - Robot 4: `4 + 5 = 9 ≤ 25` ✓
     All single robots work.

2. Try window size 2:
   - Robots [0,1]: `max(3,6) + 2 * sum(2,1) = 6 + 2*3 = 6 + 6 = 12 ≤ 25` ✓
   - Robots [1,2]: `max(6,1) + 2 * sum(1,3) = 6 + 2*4 = 6 + 8 = 14 ≤ 25` ✓
   - Robots [2,3]: `max(1,3) + 2 * sum(3,4) = 3 + 2*7 = 3 + 14 = 17 ≤ 25` ✓
   - Robots [3,4]: `max(3,4) + 2 * sum(4,5) = 4 + 2*9 = 4 + 18 = 22 ≤ 25` ✓
     All size-2 windows work.

3. Try window size 3:
   - Robots [0,1,2]: `max(3,6,1) + 3 * sum(2,1,3) = 6 + 3*6 = 6 + 18 = 24 ≤ 25` ✓
   - Robots [1,2,3]: `max(6,1,3) + 3 * sum(1,3,4) = 6 + 3*8 = 6 + 24 = 30 > 25` ✗
   - Robots [2,3,4]: `max(1,3,4) + 3 * sum(3,4,5) = 4 + 3*12 = 4 + 36 = 40 > 25` ✗
     Only one size-3 window works.

4. Try window size 4:
   - Robots [0,1,2,3]: `max(3,6,1,3) + 4 * sum(2,1,3,4) = 6 + 4*10 = 6 + 40 = 46 > 25` ✗
     Already exceeds budget.

The maximum `k` is 3 (from window [0,1,2]).

The challenge is doing this efficiently for large inputs without checking every possible window for every possible size.

## Brute Force Approach

The brute force solution would check every possible subarray (window) of every possible size:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Calculate the window size `k = j - i + 1`
4. Find the maximum `chargeTime` in the window
5. Calculate the sum of `runningCosts` in the window
6. Check if `maxCharge + k * sumRunning ≤ budget`
7. Track the maximum `k` found

**Why this is too slow:**

- Time complexity: O(n³) if we recalculate max and sum naively
- Even with prefix sums for running costs (O(n²)), finding the max in each window would still be O(n) per window
- For n = 10⁵ (typical constraint), O(n²) is 10¹⁰ operations - far too slow

We need to do better than O(n²).

## Optimized Approach

The key insight is that we can use a **sliding window** approach with two special data structures:

1. **A monotonic deque** to track the maximum `chargeTime` in the current window
   - Why a deque? We need to efficiently:
     - Add new elements to the window (right side)
     - Remove old elements leaving the window (left side)
     - Always know the current maximum in O(1) time
   - A monotonic decreasing deque maintains elements in decreasing order, with the maximum always at the front

2. **A running sum** for `runningCosts` in the current window
   - We can maintain this with a simple variable, adding new costs and subtracting costs that leave the window

**Step-by-step reasoning:**

1. We'll use two pointers: `left` and `right` to represent our window
2. As we expand the window to the right:
   - Add `chargeTimes[right]` to the deque (removing smaller elements from the back to maintain decreasing order)
   - Add `runningCosts[right]` to our running sum
3. Check if the current window is valid:
   - Cost = `deque[0]` (current max) + `windowSize * runningSum`
   - If cost > budget, shrink from the left until valid
4. Track the maximum window size we achieve

**Why this works:**

- We efficiently maintain the maximum charge time in O(1) amortized time
- We efficiently maintain the running sum in O(1) time
- We explore all valid windows in O(n) time
- This is essentially finding the longest subarray satisfying a condition, which is a classic sliding window problem

## Optimal Solution

Here's the complete solution using a sliding window with a monotonic deque:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumRobots(chargeTimes, runningCosts, budget):
    """
    Finds the maximum number of consecutive robots that can be run within budget.

    Args:
        chargeTimes: List of charge times for each robot
        runningCosts: List of running costs for each robot
        budget: Maximum allowed total cost

    Returns:
        Maximum number of consecutive robots that fit within budget
    """
    n = len(chargeTimes)
    left = 0  # Left pointer of sliding window
    max_len = 0  # Track maximum window length found
    running_sum = 0  # Sum of running costs in current window
    deque = collections.deque()  # Monotonic decreasing deque for max charge times

    for right in range(n):
        # Step 1: Add current robot to window
        # Maintain decreasing order in deque by removing smaller elements from back
        while deque and chargeTimes[deque[-1]] <= chargeTimes[right]:
            deque.pop()
        deque.append(right)

        # Add current running cost to running sum
        running_sum += runningCosts[right]

        # Step 2: Check if current window exceeds budget
        # Calculate current cost: max charge time + window size * sum of running costs
        window_size = right - left + 1
        current_cost = chargeTimes[deque[0]] + window_size * running_sum

        # Step 3: Shrink window from left if exceeds budget
        while left <= right and current_cost > budget:
            # Remove leftmost robot from window
            if deque[0] == left:
                deque.popleft()  # Remove max if it's the leftmost element
            running_sum -= runningCosts[left]
            left += 1

            # Recalculate cost if window still exists
            if left <= right:
                window_size = right - left + 1
                current_cost = chargeTimes[deque[0]] + window_size * running_sum

        # Step 4: Update maximum window length
        # Only update if window is valid (current_cost <= budget)
        if left <= right:
            max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function maximumRobots(chargeTimes, runningCosts, budget) {
  /**
   * Finds the maximum number of consecutive robots that can be run within budget.
   *
   * @param {number[]} chargeTimes - Charge times for each robot
   * @param {number[]} runningCosts - Running costs for each robot
   * @param {number} budget - Maximum allowed total cost
   * @return {number} Maximum number of consecutive robots that fit within budget
   */
  const n = chargeTimes.length;
  let left = 0; // Left pointer of sliding window
  let maxLen = 0; // Track maximum window length found
  let runningSum = 0; // Sum of running costs in current window
  const deque = []; // Monotonic decreasing deque for max charge times

  for (let right = 0; right < n; right++) {
    // Step 1: Add current robot to window
    // Maintain decreasing order in deque by removing smaller elements from back
    while (deque.length > 0 && chargeTimes[deque[deque.length - 1]] <= chargeTimes[right]) {
      deque.pop();
    }
    deque.push(right);

    // Add current running cost to running sum
    runningSum += runningCosts[right];

    // Step 2: Check if current window exceeds budget
    // Calculate current cost: max charge time + window size * sum of running costs
    const windowSize = right - left + 1;
    let currentCost = chargeTimes[deque[0]] + windowSize * runningSum;

    // Step 3: Shrink window from left if exceeds budget
    while (left <= right && currentCost > budget) {
      // Remove leftmost robot from window
      if (deque[0] === left) {
        deque.shift(); // Remove max if it's the leftmost element
      }
      runningSum -= runningCosts[left];
      left++;

      // Recalculate cost if window still exists
      if (left <= right) {
        const newWindowSize = right - left + 1;
        currentCost = chargeTimes[deque[0]] + newWindowSize * runningSum;
      }
    }

    // Step 4: Update maximum window length
    // Only update if window is valid (currentCost <= budget)
    if (left <= right) {
      maxLen = Math.max(maxLen, right - left + 1);
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int maximumRobots(int[] chargeTimes, int[] runningCosts, long budget) {
        /**
         * Finds the maximum number of consecutive robots that can be run within budget.
         *
         * @param chargeTimes Charge times for each robot
         * @param runningCosts Running costs for each robot
         * @param budget Maximum allowed total cost
         * @return Maximum number of consecutive robots that fit within budget
         */
        int n = chargeTimes.length;
        int left = 0;  // Left pointer of sliding window
        int maxLen = 0;  // Track maximum window length found
        long runningSum = 0;  // Sum of running costs in current window
        Deque<Integer> deque = new ArrayDeque<>();  // Monotonic decreasing deque for max charge times

        for (int right = 0; right < n; right++) {
            // Step 1: Add current robot to window
            // Maintain decreasing order in deque by removing smaller elements from back
            while (!deque.isEmpty() && chargeTimes[deque.peekLast()] <= chargeTimes[right]) {
                deque.pollLast();
            }
            deque.offerLast(right);

            // Add current running cost to running sum
            runningSum += runningCosts[right];

            // Step 2: Check if current window exceeds budget
            // Calculate current cost: max charge time + window size * sum of running costs
            int windowSize = right - left + 1;
            long currentCost = (long) chargeTimes[deque.peekFirst()] + windowSize * runningSum;

            // Step 3: Shrink window from left if exceeds budget
            while (left <= right && currentCost > budget) {
                // Remove leftmost robot from window
                if (deque.peekFirst() == left) {
                    deque.pollFirst();  // Remove max if it's the leftmost element
                }
                runningSum -= runningCosts[left];
                left++;

                // Recalculate cost if window still exists
                if (left <= right) {
                    windowSize = right - left + 1;
                    currentCost = (long) chargeTimes[deque.peekFirst()] + windowSize * runningSum;
                }
            }

            // Step 4: Update maximum window length
            // Only update if window is valid (currentCost <= budget)
            if (left <= right) {
                maxLen = Math.max(maxLen, right - left + 1);
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each robot is added to the deque exactly once and removed at most once → O(n) for deque operations
- Each robot is added to the running sum once and subtracted at most once → O(n) for sum operations
- The `while` loops for shrinking the window and maintaining the deque are amortized O(1) per element
- Overall: O(n) where n is the number of robots

**Space Complexity: O(n)**

- The deque can hold up to n elements in the worst case (when chargeTimes are strictly decreasing)
- Other variables use O(1) space
- Overall: O(n) for the deque storage

## Common Mistakes

1. **Forgetting to handle large numbers in multiplications**: When calculating `windowSize * runningSum`, this can easily overflow 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C).

2. **Incorrect deque maintenance**: The deque should store indices (not values) to know when to remove elements from the front when the window slides. Storing values makes it impossible to know which element is leaving the window.

3. **Not updating the max after shrinking the window**: After removing elements from the left, you must recalculate the current cost. Some candidates forget this and use stale values.

4. **Off-by-one errors in window size calculation**: Remember `windowSize = right - left + 1`, not `right - left`. The `+1` is easy to forget but crucial for correct calculations.

5. **Assuming the answer is always at least 1**: It's possible that no single robot fits within budget (if all `chargeTimes[i] + runningCosts[i] > budget`). The algorithm correctly handles this by returning 0.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Sliding Window Maximum** (LeetCode 239): Uses a monotonic deque to track the maximum in a sliding window. Our problem adds the twist of also tracking a running sum.

2. **Longest Subarray With Sum Constraint** (variations of LeetCode 209, 325): Finding the longest subarray where some function of the elements satisfies a constraint. Here the function is `max(chargeTimes) + k * sum(runningCosts)`.

3. **Problems requiring tracking both max and sum in a window**: Similar to "Maximum Performance of a Team" (LeetCode 1383) which combines sorting with heap usage to track top k elements.

**Related problems to practice:**

- [Sliding Window Maximum](/problem/sliding-window-maximum) - Direct practice with monotonic deques
- [Longest Subarray with Absolute Diff Less Than or Equal to Limit](/problem/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) - Tracks both max and min in window
- [Maximum Sum of Distinct Subarrays With Length K](/problem/maximum-sum-of-distinct-subarrays-with-length-k) - Combines window constraints with uniqueness

## Key Takeaways

1. **When you need to track both max/min and sum in a sliding window**, consider a monotonic deque for the extremum and a running variable for the sum.

2. **The formula `maxCharge + k * sumRunning`** has an important property: as the window grows, both terms increase, making it monotonic. This allows binary search as an alternative approach (check if a window size k is possible).

3. **Always consider integer overflow** when dealing with products of potentially large numbers, especially in constraints where n ≤ 10⁵ and values can be up to 10⁵.

4. **Sliding window problems often follow this template**: two pointers, maintain invariants as you expand right, shrink left when constraints are violated, track the answer.

**Related problems:** [Sliding Window Maximum](/problem/sliding-window-maximum), [Kth Smallest Product of Two Sorted Arrays](/problem/kth-smallest-product-of-two-sorted-arrays), [Maximum Number of Tasks You Can Assign](/problem/maximum-number-of-tasks-you-can-assign)
