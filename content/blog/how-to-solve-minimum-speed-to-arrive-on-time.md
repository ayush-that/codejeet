---
title: "How to Solve Minimum Speed to Arrive on Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Speed to Arrive on Time. Medium difficulty, 47.7% acceptance rate. Topics: Array, Binary Search."
date: "2027-01-17"
category: "dsa-patterns"
tags: ["minimum-speed-to-arrive-on-time", "array", "binary-search", "medium"]
---

# How to Solve Minimum Speed to Arrive on Time

You need to determine the minimum integer speed (in km/h) to travel through a series of train rides such that you arrive at the office within a given `hour` time limit. The tricky part is that you must take trains in sequence, and for each ride, the travel time is calculated as the distance divided by speed, but rounded up to the next integer for all rides except the last one, which can be fractional. This problem is interesting because it combines mathematical precision with an optimization search, making binary search the natural fit.

## Visual Walkthrough

Let's walk through an example: `dist = [1, 3, 2]`, `hour = 2.7`.

We need to find the minimum integer speed `s` such that the total travel time ≤ 2.7.

**Understanding the time calculation:**

- For each train ride `i` (except the last), time = `ceil(dist[i] / s)` because trains depart at integer hours.
- For the last ride, time = `dist[n-1] / s` (exact, can be fractional).

Let's test some speeds:

**Speed = 1 km/h:**

- Ride 1: ceil(1/1) = 1 hour
- Ride 2: ceil(3/1) = 3 hours
- Ride 3: 2/1 = 2 hours
- Total = 1 + 3 + 2 = 6 hours → Too slow (exceeds 2.7)

**Speed = 2 km/h:**

- Ride 1: ceil(1/2) = 1 hour
- Ride 2: ceil(3/2) = 2 hours
- Ride 3: 2/2 = 1 hour
- Total = 1 + 2 + 1 = 4 hours → Still too slow

**Speed = 3 km/h:**

- Ride 1: ceil(1/3) = 1 hour
- Ride 2: ceil(3/3) = 1 hour
- Ride 3: 2/3 ≈ 0.6667 hours
- Total = 1 + 1 + 0.6667 = 2.6667 hours → Within 2.7! But is there a smaller speed?

**Speed = 4 km/h:**

- Ride 1: ceil(1/4) = 1 hour
- Ride 2: ceil(3/4) = 1 hour
- Ride 3: 2/4 = 0.5 hours
- Total = 2.5 hours → Also works, but 3 is smaller.

Thus, the minimum speed is 3 km/h.

Notice that as speed increases, total time decreases (monotonic relationship). This monotonicity is what allows us to use binary search.

## Brute Force Approach

A brute force solution would try every possible speed from 1 up to some maximum value until we find one that gets us to work on time. But what's the maximum speed we need to check?

If we travel at an extremely high speed, the time approaches the number of trains (since each non-last ride takes at least 1 hour due to ceiling). Actually, the worst-case time at infinite speed would be `n-1` hours (for the first n-1 rides) plus a tiny fraction for the last ride. So if `hour < n-1`, it's impossible to arrive on time regardless of speed.

For the maximum speed to check: in the worst case, we might need to travel very fast. A safe upper bound is `10^7` (from constraints: `dist[i] ≤ 10^5`, `hour ≤ 10^9`), but we can be smarter: if we travel at speed `max(dist) * 10^7`? Actually, a better bound is the maximum distance times 10^7 divided by something... but simpler: since hour can be as small as 1e-9 in practice, we might need extremely high speeds. However, constraints say answer won't exceed 10^7.

Brute force pseudocode:

1. Check if `hour < len(dist)-1` → return -1 (impossible)
2. For speed from 1 to 10^7:
   - Calculate total time
   - If total time ≤ hour, return speed

**Why it's too slow:** Checking up to 10^7 speeds, each requiring O(n) time calculation, gives O(10^7 \* n) which is far too slow for n up to 10^5.

## Optimized Approach

The key insight is the **monotonic relationship** between speed and total travel time:

- As speed increases, the time for each ride decreases or stays the same.
- Therefore, if a certain speed `s` gets us to work on time, any speed greater than `s` will also work.
- Conversely, if speed `s` is too slow, any smaller speed is also too slow.

This property allows us to use **binary search** on the answer (speed). We search the range [1, max_speed] where max_speed is a sufficiently large number (like 10^7, or better, the maximum distance times 10^7 to handle fractional hours).

**Binary search process:**

1. Set left = 1, right = upper_bound (e.g., 10^7)
2. While left < right:
   - mid = (left + right) // 2
   - Calculate total time at speed = mid
   - If total time ≤ hour: right = mid (try for smaller speed)
   - Else: left = mid + 1 (need faster speed)
3. After loop, check if speed = left works. If yes, return left; else return -1.

**Why binary search works:** The "feasibility" function (can we arrive on time with speed s?) is monotonic: false for small s, true for large s. Binary search finds the transition point.

**Upper bound choice:** We need an upper bound that's guaranteed to work if a solution exists. Since distances ≤ 10^5 and hour can be as small as 1e-9, we might need speed up to 10^5 _ 10^9 = 10^14, but constraints say answer ≤ 10^7. Actually, from problem: "If you cannot arrive on time, return -1." And speed is integer. A safe upper bound is 10^7 (per constraints), but to be thorough, we can use max(dist) _ 10^7 or simply 10^7.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log M) where M is the search space size (up to 10^7)
# Space: O(1)
def minSpeedOnTime(dist, hour):
    n = len(dist)

    # If hour is less than n-1, impossible because each of the first n-1 trains
    # takes at least 1 hour (due to ceiling), so total time >= n-1
    if hour <= n - 1:
        return -1

    # Helper function to calculate total travel time given a speed
    def total_time(speed):
        time = 0.0
        # For first n-1 rides, time is ceil(dist[i] / speed)
        for i in range(n - 1):
            # Integer division with ceiling: (dist[i] + speed - 1) // speed
            time += (dist[i] + speed - 1) // speed
        # For the last ride, use exact division (can be fractional)
        time += dist[-1] / speed
        return time

    # Binary search for minimum speed
    left, right = 1, 10**7  # Upper bound from constraints

    while left < right:
        mid = (left + right) // 2

        if total_time(mid) <= hour:
            # This speed works, try smaller
            right = mid
        else:
            # Too slow, need faster
            left = mid + 1

    # After loop, left is the minimum speed that might work
    # Verify it actually works (should always work if solution exists)
    return left if total_time(left) <= hour else -1
```

```javascript
// Time: O(n log M) where M is the search space size (up to 10^7)
// Space: O(1)
function minSpeedOnTime(dist, hour) {
  const n = dist.length;

  // If hour is less than n-1, impossible because each of the first n-1 trains
  // takes at least 1 hour (due to ceiling)
  if (hour <= n - 1) {
    return -1;
  }

  // Helper function to calculate total travel time given a speed
  const totalTime = (speed) => {
    let time = 0;
    // For first n-1 rides, time is ceil(dist[i] / speed)
    for (let i = 0; i < n - 1; i++) {
      // Integer division with ceiling: Math.ceil(dist[i] / speed)
      time += Math.ceil(dist[i] / speed);
    }
    // For the last ride, use exact division (can be fractional)
    time += dist[n - 1] / speed;
    return time;
  };

  // Binary search for minimum speed
  let left = 1;
  let right = 10 ** 7; // Upper bound from constraints

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (totalTime(mid) <= hour) {
      // This speed works, try smaller
      right = mid;
    } else {
      // Too slow, need faster
      left = mid + 1;
    }
  }

  // After loop, left is the minimum speed that might work
  // Verify it actually works (should always work if solution exists)
  return totalTime(left) <= hour ? left : -1;
}
```

```java
// Time: O(n log M) where M is the search space size (up to 10^7)
// Space: O(1)
class Solution {
    public int minSpeedOnTime(int[] dist, double hour) {
        int n = dist.length;

        // If hour is less than n-1, impossible because each of the first n-1 trains
        // takes at least 1 hour (due to ceiling)
        if (hour <= n - 1) {
            return -1;
        }

        // Helper function to calculate total travel time given a speed
        // Using a separate function for clarity
        java.util.function.DoubleUnaryOperator totalTime = (speed) -> {
            double time = 0.0;
            // For first n-1 rides, time is ceil(dist[i] / speed)
            for (int i = 0; i < n - 1; i++) {
                // Integer division with ceiling: (dist[i] + speed - 1) / speed
                time += Math.ceil(dist[i] / speed);
            }
            // For the last ride, use exact division (can be fractional)
            time += dist[n - 1] / speed;
            return time;
        };

        // Binary search for minimum speed
        int left = 1;
        int right = (int) 1e7;  // Upper bound from constraints

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (totalTime.applyAsDouble(mid) <= hour) {
                // This speed works, try smaller
                right = mid;
            } else {
                // Too slow, need faster
                left = mid + 1;
            }
        }

        // After loop, left is the minimum speed that might work
        // Verify it actually works (should always work if solution exists)
        return totalTime.applyAsDouble(left) <= hour ? left : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M)

- `n` is the length of `dist` array
- `M` is the size of the search space (from 1 to upper bound, which is 10^7 in our implementation)
- For each binary search iteration (log M iterations), we calculate total time in O(n)
- Total: O(n log M) = O(n log 10^7) ≈ O(7n) = O(n) in practice, but formally O(n log M)

**Space Complexity:** O(1)

- We only use a few variables for binary search and time calculation
- No additional data structures that scale with input size

## Common Mistakes

1. **Not checking the impossible case early:** If `hour <= n-1`, it's impossible because each of the first n-1 trains takes at least 1 hour (due to ceiling). Candidates often miss this and get stuck in binary search or return wrong answers.

2. **Incorrect ceiling calculation for non-last rides:** Using `Math.ceil(dist[i] / speed)` is correct in floating-point, but for integers, `(dist[i] + speed - 1) // speed` is more efficient and avoids floating-point precision issues. Some candidates use regular division and get wrong times.

3. **Binary search boundary errors:**
   - Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops if not handled carefully.
   - Forgetting to update `left = mid + 1` when speed is too slow (not `left = mid`).
   - Setting the upper bound too low: if hour is very small, we might need very high speed. The constraints guarantee answer ≤ 10^7, so using 10^7 as upper bound is safe.

4. **Precision issues with floating-point:** When comparing total time with hour, floating-point errors might occur. However, in this problem, using double precision is sufficient. Some candidates try to avoid floats entirely but make the logic overly complex.

## When You'll See This Pattern

This "binary search on answer" pattern appears when:

1. You're asked to find the minimum/maximum value of a parameter
2. There's a monotonic relationship: if value X works, then all values > X (or < X) also work
3. Checking whether a given value works is easier than finding the optimal value directly

**Related LeetCode problems:**

1. **Maximum Candies Allocated to K Children (Medium)** - Find maximum candies per child such that you can allocate to k children. Binary search on the candy amount.
2. **Minimum Time to Complete Trips (Medium)** - Find minimum time to complete totalTrips given buses with different trip times. Binary search on time.
3. **Koko Eating Bananas (Medium)** - Very similar: minimum eating speed to finish bananas in h hours. Binary search on speed.

These all share the same core: define a feasibility function, observe monotonicity, then binary search for the optimal value.

## Key Takeaways

1. **When to use binary search on answer:** Look for problems asking for "minimum" or "maximum" of something where checking feasibility is easier than finding the optimum directly. The feasibility function should be monotonic.

2. **Ceiling vs floor calculations matter:** Pay attention to whether you need to round up (for departure times) or use exact values (for final segment). This subtlety is often the key to the problem.

3. **Establish proper bounds:** Determine a reasonable upper bound for binary search. It can come from constraints, or you can use a very large number if constraints allow. Always check for impossible cases early to avoid unnecessary computation.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children), [Minimum Skips to Arrive at Meeting On Time](/problem/minimum-skips-to-arrive-at-meeting-on-time), [Minimum Time to Complete Trips](/problem/minimum-time-to-complete-trips)
