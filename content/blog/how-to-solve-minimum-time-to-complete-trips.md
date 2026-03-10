---
title: "How to Solve Minimum Time to Complete Trips — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Complete Trips. Medium difficulty, 39.6% acceptance rate. Topics: Array, Binary Search."
date: "2026-09-06"
category: "dsa-patterns"
tags: ["minimum-time-to-complete-trips", "array", "binary-search", "medium"]
---

# How to Solve Minimum Time to Complete Trips

This problem asks us to find the **minimum time** required for all buses to complete a given total number of trips. Each bus has its own fixed time per trip, can make multiple trips consecutively, and operates independently. The tricky part is that we need to find the smallest time `T` such that the total trips completed by all buses within time `T` is at least the required total.

## Visual Walkthrough

Let's walk through an example: `time = [1, 2, 3]`, `totalTrips = 5`.

We need to find the smallest time `T` where:

- Bus 1 (time = 1) completes `T/1` trips (floor division)
- Bus 2 (time = 2) completes `T/2` trips
- Bus 3 (time = 3) completes `T/3` trips
- Sum of all trips ≥ 5

Let's test some values:

**T = 1**: Trips = 1/1 + 1/2 + 1/3 = 1 + 0 + 0 = 1 (too low)
**T = 2**: Trips = 2/1 + 2/2 + 2/3 = 2 + 1 + 0 = 3 (too low)
**T = 3**: Trips = 3/1 + 3/2 + 3/3 = 3 + 1 + 1 = 5 ✓

But wait — is 3 the minimum? Let's check T = 2.5 (if we could use fractional time):
Trips = 2.5/1 + 2.5/2 + 2.5/3 = 2.5 + 1.25 + 0.83 ≈ 4.58 (too low)

So T = 3 is indeed the minimum integer time. This shows we're looking for the smallest integer `T` where the sum of floor(T/time[i]) ≥ totalTrips.

## Brute Force Approach

The brute force approach would be to start from T = 1 and increment until we find the first T where the total trips completed is at least totalTrips:

1. Initialize T = 1
2. For each T, calculate total trips = sum(floor(T / time[i])) for all buses
3. If total trips ≥ totalTrips, return T
4. Otherwise, increment T and repeat

<div class="code-group">

```python
# Time: O(T * n) where T is the answer (potentially huge) | Space: O(1)
def minimumTimeBrute(time, totalTrips):
    T = 1
    while True:
        trips = 0
        for t in time:
            trips += T // t
        if trips >= totalTrips:
            return T
        T += 1
```

```javascript
// Time: O(T * n) where T is the answer (potentially huge) | Space: O(1)
function minimumTimeBrute(time, totalTrips) {
  let T = 1;
  while (true) {
    let trips = 0;
    for (let t of time) {
      trips += Math.floor(T / t);
    }
    if (trips >= totalTrips) return T;
    T++;
  }
}
```

```java
// Time: O(T * n) where T is the answer (potentially huge) | Space: O(1)
public long minimumTimeBrute(int[] time, int totalTrips) {
    long T = 1;
    while (true) {
        long trips = 0;
        for (int t : time) {
            trips += T / t;
        }
        if (trips >= totalTrips) return T;
        T++;
    }
}
```

</div>

**Why this fails:** The answer T could be very large (up to 10^7 \* 10^7 = 10^14 in worst case), and we're checking each value one by one. This is far too slow for the constraints.

## Optimized Approach

The key insight is that the relationship between time `T` and total trips is **monotonic**:

- If time T is sufficient (total trips ≥ required), then any larger time T' > T is also sufficient
- If time T is insufficient, then any smaller time T' < T is also insufficient

This monotonic property allows us to use **binary search** instead of linear search. We search for the minimum sufficient time in the range [1, max_time * totalTrips], where max_time is the slowest bus time.

**Why max_time \* totalTrips as upper bound?**
In the worst case, we might have only the slowest bus making all trips. If the slowest bus takes `max_time` per trip and we need `totalTrips` trips, the maximum time needed is `max_time * totalTrips`.

**Binary search approach:**

1. Set left = 1, right = max_time \* totalTrips
2. While left < right:
   - Calculate mid = (left + right) // 2
   - Calculate total trips possible in time `mid`
   - If sufficient (trips ≥ totalTrips), search left half (right = mid)
   - If insufficient, search right half (left = mid + 1)
3. Return left (the minimum sufficient time)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max_time * totalTrips)) | Space: O(1)
def minimumTime(time, totalTrips):
    # Helper function to check if a given time is sufficient
    def can_complete(given_time):
        total = 0
        for t in time:
            # Each bus can make floor(given_time / t) trips
            total += given_time // t
            # Early exit: if we already have enough trips, stop counting
            if total >= totalTrips:
                return True
        return total >= totalTrips

    # Set binary search boundaries
    # Minimum possible time is 1
    left = 1
    # Maximum possible time: if only the slowest bus works
    # We need to use min(time) * totalTrips as upper bound to handle very large values
    # Using Python's integer which can handle arbitrarily large numbers
    right = min(time) * totalTrips

    # Binary search for the minimum sufficient time
    while left < right:
        mid = (left + right) // 2

        if can_complete(mid):
            # mid is sufficient, try smaller times
            right = mid
        else:
            # mid is insufficient, need more time
            left = mid + 1

    return left
```

```javascript
// Time: O(n * log(max_time * totalTrips)) | Space: O(1)
function minimumTime(time, totalTrips) {
  // Helper function to check if a given time is sufficient
  const canComplete = (givenTime) => {
    let total = 0;
    for (let t of time) {
      // Each bus can make floor(givenTime / t) trips
      total += Math.floor(givenTime / t);
      // Early exit: if we already have enough trips, stop counting
      if (total >= totalTrips) return true;
    }
    return total >= totalTrips;
  };

  // Find the fastest bus time for better upper bound
  const minTime = Math.min(...time);

  // Set binary search boundaries
  // Minimum possible time is 1
  let left = 1;
  // Maximum possible time: if only the fastest bus works
  // Using BigInt to handle potentially very large values
  let right = BigInt(minTime) * BigInt(totalTrips);

  // Binary search for the minimum sufficient time
  while (left < right) {
    // Calculate mid point (convert to Number for division, then back)
    const mid = Number((left + right) / 2n);

    if (canComplete(mid)) {
      // mid is sufficient, try smaller times
      right = BigInt(mid);
    } else {
      // mid is insufficient, need more time
      left = BigInt(mid) + 1n;
    }
  }

  return Number(left);
}
```

```java
// Time: O(n * log(max_time * totalTrips)) | Space: O(1)
public long minimumTime(int[] time, int totalTrips) {
    // Helper function to check if a given time is sufficient
    // Using long to avoid overflow
    long minTime = Long.MAX_VALUE;
    for (int t : time) {
        minTime = Math.min(minTime, t);
    }

    // Set binary search boundaries
    long left = 1;
    // Use long to prevent overflow when multiplying
    long right = (long) minTime * totalTrips;

    // Binary search for the minimum sufficient time
    while (left < right) {
        long mid = left + (right - left) / 2;

        // Calculate total trips possible in time 'mid'
        long trips = 0;
        for (int t : time) {
            trips += mid / t;
            // Early exit to avoid unnecessary calculations
            if (trips >= totalTrips) {
                break;
            }
        }

        if (trips >= totalTrips) {
            // mid is sufficient, try smaller times
            right = mid;
        } else {
            // mid is insufficient, need more time
            left = mid + 1;
        }
    }

    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n _ log(max_time _ totalTrips))

- `n` is the number of buses (length of time array)
- For each binary search iteration (log(max_time \* totalTrips) iterations), we calculate total trips in O(n) time
- The binary search reduces the search space exponentially

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Not using binary search:** Many candidates try to simulate time incrementally, which times out for large inputs. Recognize the monotonic relationship that enables binary search.

2. **Incorrect upper bound:** Using too small an upper bound (like max(time)) can cause binary search to miss the answer. The worst case is when only the slowest bus is working, so we need max(time) \* totalTrips as upper bound.

3. **Integer overflow:** When calculating upper bound as max(time) \* totalTrips, both values can be up to 10^7, resulting in 10^14 which fits in 64-bit integers but not 32-bit. Always use 64-bit integers (long in Java/C++, BigInt in JavaScript).

4. **Off-by-one in binary search:** The classic binary search pitfalls:
   - Using `while (left <= right)` instead of `while (left < right)`
   - Forgetting to update `left = mid + 1` when mid is insufficient
   - Returning `mid` instead of `left` at the end

## When You'll See This Pattern

This "minimum time to complete tasks" pattern with binary search appears in several LeetCode problems:

1. **Maximum Candies Allocated to K Children (Medium):** Similar structure — find the maximum candy per child such that we can allocate to k children. Uses binary search on the possible candy amounts.

2. **Minimum Speed to Arrive on Time (Medium):** Find the minimum train speed to reach on time. Binary search on speed values, with a monotonic relationship between speed and arrival time.

3. **Koko Eating Bananas (Medium):** Find the minimum eating speed to finish all bananas in h hours. Binary search on eating speeds.

The common pattern: When you need to find the minimum/maximum value of a parameter where some condition holds, and the condition is monotonic with respect to the parameter, binary search is often the solution.

## Key Takeaways

1. **Recognize monotonicity:** When increasing a parameter always makes a condition easier to satisfy (or harder), binary search is applicable. Here, more time always means more trips completed.

2. **Estimate bounds carefully:** The upper bound should be a provable worst-case scenario. Don't guess — calculate it based on constraints.

3. **Watch for overflow:** When dealing with products of large numbers (like max_time \* totalTrips), use appropriate data types (long, BigInt) to avoid overflow.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children), [Minimum Speed to Arrive on Time](/problem/minimum-speed-to-arrive-on-time), [Minimized Maximum of Products Distributed to Any Store](/problem/minimized-maximum-of-products-distributed-to-any-store)
