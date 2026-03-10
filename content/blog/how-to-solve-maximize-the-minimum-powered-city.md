---
title: "How to Solve Maximize the Minimum Powered City — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize the Minimum Powered City. Hard difficulty, 61.8% acceptance rate. Topics: Array, Binary Search, Greedy, Queue, Sliding Window."
date: "2028-02-18"
category: "dsa-patterns"
tags: ["maximize-the-minimum-powered-city", "array", "binary-search", "greedy", "hard"]
---

# How to Solve Maximize the Minimum Powered City

You’re given an array `stations` where each element represents the number of power stations in a city, and you can build up to `k` new power stations. Each power station provides power to all cities within a fixed range `r`. Your goal is to distribute the `k` new stations to **maximize the minimum total power** across all cities after distribution. This problem is tricky because you need to simultaneously consider:

1. The existing power distribution
2. How adding stations affects multiple cities due to the range `r`
3. The limited resource `k`
4. Maximizing a minimum value (which suggests binary search)

## Visual Walkthrough

Let’s walk through a small example to build intuition.

**Example:**  
`stations = [1, 2, 4, 5, 0]`, `r = 1`, `k = 2`

**Step 1 – Understanding the initial power coverage**  
With `r = 1`, each power station covers:

- City i: covers cities [i-r, i+r] = [i-1, i+1] (clamped to array bounds)
- Initially, total power at each city = sum of stations within range r

Let’s calculate initial power for each city:

- City 0: stations[0-1..0+1] = stations[0..1] = 1 + 2 = 3
- City 1: stations[0..2] = 1 + 2 + 4 = 7
- City 2: stations[1..3] = 2 + 4 + 5 = 11
- City 3: stations[2..4] = 4 + 5 + 0 = 9
- City 4: stations[3..4] = 5 + 0 = 5

So initial powers: [3, 7, 11, 9, 5]  
Minimum initial power = 3 (at city 0)

**Step 2 – The effect of adding a station**  
If we add 1 station at city i, it increases power for all cities from i-r to i+r by 1.

For example, adding a station at city 2 (with r=1):

- Increases power at cities 1, 2, 3 by 1 each

**Step 3 – Thinking about maximizing the minimum**  
We want to make the smallest value in our final power array as large as possible. If we target a minimum power of `target = 6`:

- City 0 needs +3 more power (from 3 to 6)
- City 4 needs +1 more power (from 5 to 6)
- Other cities already have ≥6

**Step 4 – Efficiently checking if a target is achievable**  
We can check if we can achieve minimum power `target` with ≤k stations using a greedy approach:

1. Scan cities left to right
2. When a city is below target, add stations at the farthest right position that still helps this city
3. Keep track of stations added using a sliding window

For target=6:

- City 0 (power=3, needs +3): Add 3 stations at city min(0+r, n-1)=city 1
- City 1: Now has power 7 + 3 (from stations at city 1) = 10 ≥ 6 ✓
- City 2: Power 11 + 3 = 14 ≥ 6 ✓
- City 3: Power 9 + 3 = 12 ≥ 6 ✓
- City 4: Power 5 + 3 = 8 ≥ 6 ✓

We used 3 stations, but k=2, so target=6 is NOT achievable.

**Step 5 – Finding the maximum achievable minimum**  
We need to find the highest target where we can achieve it with ≤k stations. This is a perfect scenario for binary search!

## Brute Force Approach

A naive approach would be to try every possible distribution of k stations among n cities. For each distribution, calculate the final power at each city and find the minimum. Then take the maximum of these minimums.

**Why this fails:**

- Number of ways to distribute k identical stations among n cities = C(n+k-1, k)
- For n=10^5 and k=10^9, this is astronomically large
- Even for small n and k, it's exponential time

Even a smarter brute force that tries all possible minimum values from 0 to some upper bound would be O(n \* U) where U is the upper bound, which is still too slow when U can be up to ~10^14.

## Optimized Approach

The key insights are:

1. **Binary Search on Answer**: Since we're maximizing a minimum value and checking feasibility is easier than finding the optimal directly, we can binary search on the minimum power value. If we can achieve power ≥ X with ≤k stations, we can try higher X.

2. **Greedy Feasibility Check**: To check if minimum power ≥ target is achievable:
   - Scan cities left to right
   - When city i needs more power, add stations at position min(i+r, n-1) (the farthest right that still helps city i)
   - Use a sliding window to track how many stations added affect current city i
   - This greedy approach works because adding stations farther right helps more cities

3. **Sliding Window for Efficiency**: Instead of recalculating power for each city from scratch, maintain:
   - `window` = number of stations currently affecting the city
   - `add[]` = stations to add at each position
   - When we move to next city, remove stations that are now out of range

**Why this works:**

- Adding stations as far right as possible maximizes their coverage
- The sliding window ensures O(n) time for each feasibility check
- Binary search reduces total checks to O(log(max_answer))

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max_answer)) where max_answer ~ 10^14
# Space: O(n) for the add array
def maxPower(stations, r, k):
    n = len(stations)

    # Step 1: Calculate initial power for each city using prefix sums
    # power[i] = sum of stations in [i-r, i+r]
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stations[i]

    initial_power = [0] * n
    for i in range(n):
        left = max(0, i - r)
        right = min(n - 1, i + r)
        # Sum from left to right inclusive using prefix sums
        initial_power[i] = prefix[right + 1] - prefix[left]

    # Step 2: Binary search for maximum achievable minimum power
    # Lower bound: minimum initial power
    # Upper bound: minimum initial power + k (adding all k to one city's range)
    left, right = min(initial_power), min(initial_power) + k
    answer = 0

    def can_achieve(target):
        """Check if we can make all cities have at least target power using ≤k stations"""
        # add[i] = stations to build at city i
        add = [0] * n
        total_added = 0  # Total stations built so far
        window = 0  # Stations affecting current city

        for i in range(n):
            # Add stations scheduled for this city
            window += add[i]
            current_power = initial_power[i] + window

            if current_power < target:
                # Need to add more stations to reach target
                need = target - current_power
                total_added += need
                if total_added > k:
                    return False

                # Add stations at the farthest position that still helps city i
                pos = min(i + r, n - 1)
                window += need  # These stations affect current city immediately
                # Schedule removal when stations go out of range
                if pos + r + 1 < n:
                    add[pos + r + 1] -= need

        return total_added <= k

    # Binary search
    while left <= right:
        mid = (left + right) // 2
        if can_achieve(mid):
            answer = mid
            left = mid + 1  # Try for higher minimum
        else:
            right = mid - 1  # Too high, try lower

    return answer
```

```javascript
// Time: O(n * log(max_answer)) where max_answer ~ 10^14
// Space: O(n) for the add array
function maxPower(stations, r, k) {
  const n = stations.length;

  // Step 1: Calculate initial power for each city using prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + stations[i];
  }

  const initialPower = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const left = Math.max(0, i - r);
    const right = Math.min(n - 1, i + r);
    // Sum from left to right inclusive using prefix sums
    initialPower[i] = prefix[right + 1] - prefix[left];
  }

  // Step 2: Binary search for maximum achievable minimum power
  let left = Math.min(...initialPower);
  let right = left + k;
  let answer = 0;

  const canAchieve = (target) => {
    // Check if we can make all cities have at least target power using ≤k stations
    const add = new Array(n).fill(0);
    let totalAdded = 0; // Total stations built so far
    let window = 0; // Stations affecting current city

    for (let i = 0; i < n; i++) {
      // Add stations scheduled for this city
      window += add[i];
      const currentPower = initialPower[i] + window;

      if (currentPower < target) {
        // Need to add more stations to reach target
        const need = target - currentPower;
        totalAdded += need;
        if (totalAdded > k) {
          return false;
        }

        // Add stations at the farthest position that still helps city i
        const pos = Math.min(i + r, n - 1);
        window += need; // These stations affect current city immediately
        // Schedule removal when stations go out of range
        if (pos + r + 1 < n) {
          add[pos + r + 1] -= need;
        }
      }
    }

    return totalAdded <= k;
  };

  // Binary search
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canAchieve(mid)) {
      answer = mid;
      left = mid + 1; // Try for higher minimum
    } else {
      right = mid - 1; // Too high, try lower
    }
  }

  return answer;
}
```

```java
// Time: O(n * log(max_answer)) where max_answer ~ 10^14
// Space: O(n) for the add array
class Solution {
    public long maxPower(int[] stations, int r, int k) {
        int n = stations.length;

        // Step 1: Calculate initial power for each city using prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + stations[i];
        }

        long[] initialPower = new long[n];
        long minInitial = Long.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int left = Math.max(0, i - r);
            int right = Math.min(n - 1, i + r);
            // Sum from left to right inclusive using prefix sums
            initialPower[i] = prefix[right + 1] - prefix[left];
            minInitial = Math.min(minInitial, initialPower[i]);
        }

        // Step 2: Binary search for maximum achievable minimum power
        long left = minInitial;
        long right = minInitial + k;  // Upper bound: add all k to help minimum city
        long answer = 0;

        while (left <= right) {
            long mid = left + (right - left) / 2;
            if (canAchieve(initialPower, n, r, k, mid)) {
                answer = mid;
                left = mid + 1;  // Try for higher minimum
            } else {
                right = mid - 1;  // Too high, try lower
            }
        }

        return answer;
    }

    private boolean canAchieve(long[] initialPower, int n, int r, long k, long target) {
        // Check if we can make all cities have at least target power using ≤k stations
        long[] add = new long[n];
        long totalAdded = 0;  // Total stations built so far
        long window = 0;      // Stations affecting current city

        for (int i = 0; i < n; i++) {
            // Add stations scheduled for this city
            window += add[i];
            long currentPower = initialPower[i] + window;

            if (currentPower < target) {
                // Need to add more stations to reach target
                long need = target - currentPower;
                totalAdded += need;
                if (totalAdded > k) {
                    return false;
                }

                // Add stations at the farthest position that still helps city i
                int pos = Math.min(i + r, n - 1);
                window += need;  // These stations affect current city immediately
                // Schedule removal when stations go out of range
                if (pos + r + 1 < n) {
                    add[pos + r + 1] -= need;
                }
            }
        }

        return totalAdded <= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M) where:

- n = number of cities (length of stations array)
- M = maximum possible answer ≈ min(initial_power) + k ≤ 10^10 + 10^9 ≈ 10^14
- Binary search runs O(log M) iterations
- Each feasibility check is O(n) using the sliding window approach

**Space Complexity:** O(n) for:

- The prefix sum array (O(n))
- The initial_power array (O(n))
- The add array for tracking scheduled stations (O(n))

## Common Mistakes

1. **Not using prefix sums for initial power calculation**: Recalculating sum for each city naively would be O(n²). Prefix sums reduce this to O(n).

2. **Incorrect sliding window management in feasibility check**: Forgetting to remove stations when they go out of range (beyond i+r from where they were added) leads to overcounting.

3. **Binary search bounds errors**:
   - Starting with left=0 instead of min(initial_power) wastes iterations
   - Not using long integers for large values (k up to 10^9, answer up to ~10^14)

4. **Adding stations at wrong position in greedy approach**: The optimal is to add at min(i+r, n-1) (farthest right that still helps current city i), not at city i itself.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary Search on Answer**: When you need to maximize/minimize a value and checking feasibility is easier than finding the optimum directly.
   - Related: [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
   - Related: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)

2. **Greedy with Sliding Window**: When you need to efficiently apply operations that affect a range of elements.
   - Related: [Minimum Number of K Consecutive Bit Flips](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/)

3. **Range Addition Problems**: Where an operation affects multiple positions.
   - Related: [Range Addition](https://leetcode.com/problems/range-addition/) (premium)

## Key Takeaways

1. **"Maximize the minimum" often suggests binary search on the answer**. If you can check whether a certain minimum is achievable in reasonable time, binary search can find the maximum achievable minimum efficiently.

2. **When operations affect ranges, think about prefix sums or sliding windows** to avoid O(n²) calculations. The add array with scheduled removals is a powerful technique.

3. **Greedy placement strategies often work when maximizing coverage**: Adding resources at the farthest position that still helps the current need maximizes future benefit.

Related problems: [Maximum Number of Tasks You Can Assign](/problem/maximum-number-of-tasks-you-can-assign)
