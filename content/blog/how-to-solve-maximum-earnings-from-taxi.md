---
title: "How to Solve Maximum Earnings From Taxi — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Earnings From Taxi. Medium difficulty, 46.2% acceptance rate. Topics: Array, Hash Table, Binary Search, Dynamic Programming, Sorting."
date: "2028-08-19"
category: "dsa-patterns"
tags: ["maximum-earnings-from-taxi", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Maximum Earnings From Taxi

This problem asks us to maximize earnings as a taxi driver traveling from point 1 to point n, picking up passengers along the way. Each passenger request has a start point, end point, and tip amount. The tricky part is that we can only move forward, and we need to choose which rides to accept to maximize total earnings (ride value + tip). This is essentially a weighted interval scheduling problem with a twist - we're moving along a line and can only accept non-overlapping rides that fit our forward direction.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- n = 5 (points 1 through 5)
- rides = [[1,3,2], [2,5,4], [3,4,1], [1,2,3]]

**Step-by-step reasoning:**

1. First, let's understand what each ride means:
   - [1,3,2]: Start at point 1, end at point 3, tip = 2. Total value = (3-1) + 2 = 4
   - [2,5,4]: Start at 2, end at 5, tip = 4. Total = (5-2) + 4 = 7
   - [3,4,1]: Start at 3, end at 4, tip = 1. Total = (4-3) + 1 = 2
   - [1,2,3]: Start at 1, end at 2, tip = 3. Total = (2-1) + 3 = 4

2. We need to choose rides that don't overlap and maximize total earnings:
   - Option 1: Take [1,3,2] (earn 4), then [3,4,1] (earn 2) → total 6
   - Option 2: Take [1,2,3] (earn 4), then [2,5,4] (earn 7) → total 11
   - Option 3: Take [2,5,4] alone → earn 7
   - Option 4: Take [1,3,2] (earn 4), skip to point 3, then nothing → total 4

3. The optimal solution is Option 2: Take [1,2,3] then [2,5,4] for total 11.

The key insight: When we're at point i, we need to decide whether to take a ride starting at i or skip to i+1. But we can't just look at immediate next rides - we need to consider future opportunities.

## Brute Force Approach

A naive approach would be to try all possible combinations of rides:

1. Generate all subsets of rides
2. For each subset, check if rides are non-overlapping (end ≤ start of next ride)
3. Calculate total earnings for valid subsets
4. Return the maximum

This brute force solution has exponential time complexity O(2^m) where m is the number of rides. Even for moderate m (like 20), this becomes infeasible (over 1 million combinations).

The problem with brute force is that it doesn't leverage the structure of the problem. We're repeatedly solving the same subproblems: "What's the maximum earnings I can get starting from point i?"

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with a **binary search** optimization. Here's the step-by-step reasoning:

1. **Sort rides by start point**: This allows us to process rides in order of when they become available.

2. **Define DP state**: Let dp[i] = maximum earnings starting from point i (or from the i-th ride, depending on implementation). We'll use dp[i] = max earnings from point i to n.

3. **Recurrence relation**: At each point i, we have two choices:
   - Skip point i (don't take any ride starting at i): earnings = dp[i+1]
   - Take a ride starting at i: earnings = ride_value + dp[end_point]

   So dp[i] = max(dp[i+1], max_ride_value_starting_at_i + dp[end_point])

4. **The optimization challenge**: We need to quickly find the "next" dp value after a ride ends. If we process from right to left (n down to 1), we can use binary search to find the next ride we can take after the current one ends.

5. **Alternative approach (more efficient)**: Process rides sorted by start time, and use binary search to find the next compatible ride. This gives us O(m log m) time complexity.

## Optimal Solution

The optimal solution uses dynamic programming with binary search. We sort rides by start point, then process from the last ride backward, using binary search to find the next compatible ride.

<div class="code-group">

```python
# Time: O(m log m) where m = len(rides)
# Space: O(m) for dp array and sorted rides
def maxTaxiEarnings(self, n: int, rides: List[List[int]]) -> int:
    # Sort rides by start point
    rides.sort()

    m = len(rides)
    # dp[i] = maximum earnings starting from ride i
    dp = [0] * (m + 1)

    # Process rides from last to first
    for i in range(m - 1, -1, -1):
        start, end, tip = rides[i]
        # Calculate total earnings for this ride
        earnings = (end - start) + tip

        # Binary search to find the next ride we can take after this one
        # We need the first ride with start >= current end
        left, right = i + 1, m
        while left < right:
            mid = (left + right) // 2
            if rides[mid][0] >= end:
                right = mid
            else:
                left = mid + 1

        next_ride_idx = left

        # Two choices:
        # 1. Don't take this ride: dp[i+1]
        # 2. Take this ride: earnings + dp[next_ride_idx]
        dp[i] = max(dp[i + 1], earnings + dp[next_ride_idx])

    return dp[0]
```

```javascript
// Time: O(m log m) where m = rides.length
// Space: O(m) for dp array
var maxTaxiEarnings = function (n, rides) {
  // Sort rides by start point
  rides.sort((a, b) => a[0] - b[0]);

  const m = rides.length;
  // dp[i] = maximum earnings starting from ride i
  const dp = new Array(m + 1).fill(0);

  // Process rides from last to first
  for (let i = m - 1; i >= 0; i--) {
    const [start, end, tip] = rides[i];
    // Calculate total earnings for this ride
    const earnings = end - start + tip;

    // Binary search to find next ride with start >= current end
    let left = i + 1,
      right = m;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (rides[mid][0] >= end) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    const nextRideIdx = left;

    // Two choices: skip this ride or take it
    dp[i] = Math.max(dp[i + 1], earnings + dp[nextRideIdx]);
  }

  return dp[0];
};
```

```java
// Time: O(m log m) where m = rides.length
// Space: O(m) for dp array
public long maxTaxiEarnings(int n, int[][] rides) {
    // Sort rides by start point
    Arrays.sort(rides, (a, b) -> Integer.compare(a[0], b[0]));

    int m = rides.length;
    // dp[i] = maximum earnings starting from ride i
    long[] dp = new long[m + 1];

    // Process rides from last to first
    for (int i = m - 1; i >= 0; i--) {
        int start = rides[i][0];
        int end = rides[i][1];
        int tip = rides[i][2];
        // Calculate total earnings for this ride
        long earnings = (end - start) + tip;

        // Binary search to find next ride with start >= current end
        int left = i + 1, right = m;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (rides[mid][0] >= end) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        int nextRideIdx = left;

        // Two choices: skip this ride or take it
        dp[i] = Math.max(dp[i + 1], earnings + dp[nextRideIdx]);
    }

    return dp[0];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m log m)**

- Sorting the rides takes O(m log m) time
- For each of the m rides, we perform a binary search taking O(log m) time
- Total: O(m log m) + O(m log m) = O(m log m)

**Space Complexity: O(m)**

- We store the sorted rides array: O(m)
- We use a dp array of size m+1: O(m)
- Total: O(m)

The O(m log m) time complexity is efficient even for large inputs (m up to 10^5).

## Common Mistakes

1. **Forgetting to sort rides**: Without sorting, the binary search won't work correctly. The rides need to be in increasing order of start time for binary search to find the next compatible ride.

2. **Incorrect binary search bounds**: A common error is using `left <= right` instead of `left < right`, or not handling the case where no compatible ride exists (when `nextRideIdx == m`). Our solution handles this correctly because `dp[m] = 0`.

3. **Not using long type for earnings (Java)**: The earnings can be large (up to 10^5 \* 10^5 = 10^10), which exceeds int range. In Java, we must use `long` for the dp array and earnings calculation.

4. **Missing the "skip" option**: Some candidates only consider taking rides but forget that sometimes it's better to skip a ride to take a more profitable one later. The recurrence `dp[i] = max(dp[i+1], earnings + dp[nextRideIdx])` captures both options.

## When You'll See This Pattern

This weighted interval scheduling pattern appears in several LeetCode problems:

1. **Maximum Profit in Job Scheduling (Hard)**: Almost identical problem - jobs have start time, end time, and profit. You need to schedule non-overlapping jobs to maximize profit. The solution uses the same DP + binary search approach.

2. **Maximum Number of Events That Can Be Attended II (Hard)**: Similar structure but with an additional constraint (at most k events). It builds on the same interval scheduling foundation.

3. **Non-overlapping Intervals (Medium)**: A simpler version where you just need to find the minimum number of intervals to remove rather than maximizing profit.

The pattern to recognize: When you have intervals/events with weights/profits and need to choose a subset that doesn't overlap while maximizing total weight, think DP + binary search.

## Key Takeaways

1. **Weighted interval scheduling problems** often have optimal solutions using dynamic programming with binary search. Sort by start time, process from end to beginning, and use binary search to find the next compatible interval.

2. **The recurrence relation** typically has two choices at each step: take the current interval (add its value plus optimal solution from its end point) or skip it (take optimal solution from next interval).

3. **Binary search optimization** is crucial for efficiency. Without it, finding the next compatible interval would be O(m), making the overall solution O(m²). With binary search, it becomes O(log m).

Related problems: [Maximum Profit in Job Scheduling](/problem/maximum-profit-in-job-scheduling), [Maximum Number of Events That Can Be Attended](/problem/maximum-number-of-events-that-can-be-attended), [Maximum Number of Events That Can Be Attended II](/problem/maximum-number-of-events-that-can-be-attended-ii)
