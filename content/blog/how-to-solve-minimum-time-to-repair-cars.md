---
title: "How to Solve Minimum Time to Repair Cars — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Repair Cars. Medium difficulty, 59.6% acceptance rate. Topics: Array, Binary Search."
date: "2026-08-27"
category: "dsa-patterns"
tags: ["minimum-time-to-repair-cars", "array", "binary-search", "medium"]
---

# How to Solve Minimum Time to Repair Cars

You’re given an array of mechanic ranks and a number of cars to repair. Each mechanic with rank `r` can repair `n` cars in `r * n²` minutes. The goal is to find the **minimum time** needed for all mechanics working in parallel to repair all cars. The tricky part is that mechanics can work simultaneously, and you can assign any number of cars to each mechanic, but the time for each mechanic grows quadratically with the number of cars they handle.

This problem is interesting because it looks like a scheduling/assignment problem, but it’s actually a **binary search on time** problem. You need to determine if a given time is enough to repair all cars, then find the minimum sufficient time.

## Visual Walkthrough

Let’s walk through a small example: `ranks = [4, 2, 3]`, `cars = 10`.

We need to find the minimum time `T` such that all mechanics working together can repair 10 cars.

**How do we check if a specific time works?**
For a given time `T`, each mechanic with rank `r` can repair at most `n` cars where `r * n² ≤ T`. Solving for `n`: `n ≤ sqrt(T / r)`.

Let’s test `T = 20`:

- Mechanic with rank 4: `sqrt(20/4) = sqrt(5) ≈ 2.23` → floor to 2 cars
- Mechanic with rank 2: `sqrt(20/2) = sqrt(10) ≈ 3.16` → 3 cars
- Mechanic with rank 3: `sqrt(20/3) ≈ sqrt(6.67) ≈ 2.58` → 2 cars
  Total cars repaired = 2 + 3 + 2 = 7 cars. Not enough for 10 cars.

Now test `T = 30`:

- Rank 4: `sqrt(30/4) = sqrt(7.5) ≈ 2.74` → 2 cars
- Rank 2: `sqrt(30/2) = sqrt(15) ≈ 3.87` → 3 cars
- Rank 3: `sqrt(30/3) = sqrt(10) ≈ 3.16` → 3 cars
  Total = 2 + 3 + 3 = 8 cars. Still not enough.

Test `T = 40`:

- Rank 4: `sqrt(40/4) = sqrt(10) ≈ 3.16` → 3 cars
- Rank 2: `sqrt(40/2) = sqrt(20) ≈ 4.47` → 4 cars
- Rank 3: `sqrt(40/3) ≈ sqrt(13.33) ≈ 3.65` → 3 cars
  Total = 3 + 4 + 3 = 10 cars. Perfect!

So the minimum time is somewhere between 30 and 40. We can use binary search to find it efficiently.

## Brute Force Approach

A naive approach would be to try every possible time from 1 upwards until we find one that works. For each time `T`, we calculate how many cars each mechanic can repair and sum them up. If the sum ≥ cars, we return `T`.

**Why this fails:**
The time could be very large (up to `max(ranks) * cars²`), which could be enormous. For example, if `ranks = [1]` and `cars = 10^6`, the maximum time would be `1 * (10^6)² = 10^12`. Checking each time linearly would require checking up to 10^12 possibilities, which is completely infeasible.

Even though the check for a single time is O(n) where n is the number of mechanics, the linear search over time makes the overall complexity O(maxTime \* n), which is far too slow.

## Optimized Approach

The key insight is that **if time `T` is enough to repair all cars, then any time greater than `T` is also enough**. This monotonic property allows us to use binary search.

Think of it this way: as time increases, each mechanic can repair more cars (since `sqrt(T/r)` increases with `T`). So the total cars repaired is a non-decreasing function of time. This is perfect for binary search.

**Binary search setup:**

- **Left boundary (low):** The smallest possible time, which is 1 minute.
- **Right boundary (high):** The maximum possible time, which occurs when one mechanic repairs all cars. Since the slowest mechanic has the highest rank, we use `max(ranks) * cars²`.
- **Check function:** For a given time `T`, calculate total cars repaired = sum over all mechanics of `floor(sqrt(T / r))`. If total ≥ cars, `T` is sufficient.

**Why binary search works:**
We’re looking for the smallest `T` where `canRepair(T) ≥ cars`. This is exactly a "first true" binary search problem. At each step, we check the middle time:

- If it’s sufficient, we search left (including current time, since it might be the minimum)
- If it’s insufficient, we search right (excluding current time)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(maxTime)) where n = len(ranks), maxTime = max(ranks) * cars²
# Space: O(1) - only using constant extra space
def repairCars(ranks, cars):
    # Helper function to check if a given time is enough to repair all cars
    def can_repair_in_time(time):
        total_cars_repaired = 0
        for rank in ranks:
            # For each mechanic with rank r, in 'time' minutes,
            # they can repair floor(sqrt(time / r)) cars
            # Using integer math to avoid floating-point issues
            cars_by_this_mechanic = int((time // rank) ** 0.5)
            total_cars_repaired += cars_by_this_mechanic
            # Early exit: if we already have enough cars, return True
            if total_cars_repaired >= cars:
                return True
        return total_cars_repaired >= cars

    # Binary search boundaries
    # Minimum possible time is 1 (can't have 0 or negative time)
    left = 1
    # Maximum possible time: worst case - one mechanic repairs all cars
    # The mechanic with highest rank takes the longest
    max_rank = max(ranks)
    # r * n² where n = cars, so max time = max_rank * cars²
    right = max_rank * cars * cars

    # Binary search for the minimum sufficient time
    while left < right:
        mid = (left + right) // 2
        if can_repair_in_time(mid):
            # mid is sufficient, try to find smaller sufficient time
            right = mid
        else:
            # mid is insufficient, need more time
            left = mid + 1

    # left == right at this point, which is our answer
    return left
```

```javascript
// Time: O(n * log(maxTime)) where n = ranks.length, maxTime = max(ranks) * cars²
// Space: O(1) - only using constant extra space
function repairCars(ranks, cars) {
  // Helper function to check if a given time is enough to repair all cars
  const canRepairInTime = (time) => {
    let totalCarsRepaired = 0;
    for (const rank of ranks) {
      // For each mechanic with rank r, in 'time' minutes,
      // they can repair floor(sqrt(time / r)) cars
      // Using integer math: Math.floor(Math.sqrt(Math.floor(time / rank)))
      const carsByThisMechanic = Math.floor(Math.sqrt(Math.floor(time / rank)));
      totalCarsRepaired += carsByThisMechanic;
      // Early exit: if we already have enough cars, return true
      if (totalCarsRepaired >= cars) {
        return true;
      }
    }
    return totalCarsRepaired >= cars;
  };

  // Binary search boundaries
  // Minimum possible time is 1 (can't have 0 or negative time)
  let left = 1;
  // Maximum possible time: worst case - one mechanic repairs all cars
  // The mechanic with highest rank takes the longest
  const maxRank = Math.max(...ranks);
  // r * n² where n = cars, so max time = maxRank * cars²
  // Use BigInt for large numbers to avoid overflow
  let right = maxRank * cars * cars;

  // Binary search for the minimum sufficient time
  while (left < right) {
    // Use Math.floor to avoid floating point issues
    const mid = Math.floor((left + right) / 2);
    if (canRepairInTime(mid)) {
      // mid is sufficient, try to find smaller sufficient time
      right = mid;
    } else {
      // mid is insufficient, need more time
      left = mid + 1;
    }
  }

  // left == right at this point, which is our answer
  return left;
}
```

```java
// Time: O(n * log(maxTime)) where n = ranks.length, maxTime = max(ranks) * cars²
// Space: O(1) - only using constant extra space
class Solution {
    public long repairCars(int[] ranks, int cars) {
        // Helper function to check if a given time is enough to repair all cars
        // Using long to avoid integer overflow
        private boolean canRepairInTime(long time, int[] ranks, int cars) {
            long totalCarsRepaired = 0;
            for (int rank : ranks) {
                // For each mechanic with rank r, in 'time' minutes,
                // they can repair floor(sqrt(time / r)) cars
                // Using integer math to avoid floating-point issues
                long carsByThisMechanic = (long) Math.sqrt(time / rank);
                totalCarsRepaired += carsByThisMechanic;
                // Early exit: if we already have enough cars, return true
                if (totalCarsRepaired >= cars) {
                    return true;
                }
            }
            return totalCarsRepaired >= cars;
        }

        // Binary search boundaries
        // Minimum possible time is 1 (can't have 0 or negative time)
        long left = 1;
        // Maximum possible time: worst case - one mechanic repairs all cars
        // The mechanic with highest rank takes the longest
        int maxRank = 0;
        for (int rank : ranks) {
            maxRank = Math.max(maxRank, rank);
        }
        // r * n² where n = cars, so max time = maxRank * cars²
        // Use long to avoid integer overflow
        long right = (long) maxRank * cars * cars;

        // Binary search for the minimum sufficient time
        while (left < right) {
            long mid = left + (right - left) / 2;  // Avoids overflow
            if (canRepairInTime(mid, ranks, cars)) {
                // mid is sufficient, try to find smaller sufficient time
                right = mid;
            } else {
                // mid is insufficient, need more time
                left = mid + 1;
            }
        }

        // left == right at this point, which is our answer
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n \* log(maxTime))**

- `n` is the number of mechanics (length of `ranks` array)
- `maxTime` is `max(ranks) * cars²`, which is our upper bound for binary search
- For each binary search step (O(log(maxTime))), we check all mechanics (O(n)) to calculate total cars repaired
- The early exit in the check function doesn't change worst-case complexity but helps in practice

**Space Complexity: O(1)**

- We only use a few variables for counting and binary search bounds
- No additional data structures that grow with input size

## Common Mistakes

1. **Using floating-point math for sqrt calculations:** Some candidates use `sqrt(time / rank)` directly without integer conversion, which can lead to precision errors for large numbers. Always use integer math: `floor(sqrt(floor(time / rank)))`.

2. **Incorrect binary search boundaries:** Setting `left = 0` instead of `1` (time can't be 0). Or setting `right = max(ranks) * cars` instead of `max(ranks) * cars²` (missing the square term from the formula `r * n²`).

3. **Forgetting early exit in check function:** Without early exit (`if total >= cars: return True`), you always process all mechanics even when you already know the answer. This doesn't change worst-case complexity but is an optimization interviewers appreciate.

4. **Integer overflow:** When `cars` is large (up to 10^6), `cars²` is 10^12, which fits in 64-bit integers but not necessarily in 32-bit. Use `long` in Java, and be careful in Python/JavaScript with large numbers.

## When You'll See This Pattern

This "binary search on answer" pattern appears when:

1. You're looking for a minimum or maximum value
2. You have a way to check if a candidate value works (a predicate function)
3. The predicate is monotonic (if X works, then anything ≥ X also works, or vice versa)

**Related LeetCode problems:**

1. **Koko Eating Bananas (Medium)** - Very similar! Instead of mechanics repairing cars, Koko eats bananas. You binary search on eating speed `k` and check if she can eat all bananas within `h` hours.
2. **Capacity To Ship Packages Within D Days (Medium)** - Binary search on ship capacity, check if all packages can be shipped within D days.
3. **Split Array Largest Sum (Hard)** - Binary search on the maximum subarray sum, check if array can be split into m subarrays with all sums ≤ mid.

## Key Takeaways

1. **Recognize "binary search on answer" problems:** When you need to find a minimum/maximum value and have a monotonic check function, think binary search instead of linear search.

2. **Derive the check function carefully:** For this problem, the key was understanding that in time `T`, a mechanic with rank `r` can repair `floor(sqrt(T/r))` cars. Always validate your formula with small examples.

3. **Pay attention to bounds and overflow:** The upper bound `max(ranks) * cars²` can be huge. Use appropriate data types (long in Java, Python handles big integers automatically).

Related problems: [Sort Transformed Array](/problem/sort-transformed-array), [Koko Eating Bananas](/problem/koko-eating-bananas)
