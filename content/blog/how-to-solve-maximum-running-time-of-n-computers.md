---
title: "How to Solve Maximum Running Time of N Computers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Running Time of N Computers. Hard difficulty, 56.4% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting."
date: "2026-11-10"
category: "dsa-patterns"
tags: ["maximum-running-time-of-n-computers", "array", "binary-search", "greedy", "hard"]
---

# How to Solve Maximum Running Time of N Computers

You have `n` computers and an array of batteries with different capacities. Your goal is to determine the maximum number of minutes you can run all `n` computers simultaneously by optimally distributing battery power. The tricky part is that batteries can be swapped between computers at any time, meaning a single battery's power can be split across multiple computers over time, but each computer needs continuous power throughout the entire runtime.

## Visual Walkthrough

Let's walk through a concrete example: `n = 3`, `batteries = [10, 10, 3, 5]`.

We want to find the maximum time `t` where we can run all 3 computers simultaneously. Let's test if `t = 8` is possible:

**Key insight**: For a given time `t`, a battery can contribute at most `min(battery, t)` minutes of power to the system. This is because:

- If a battery has capacity ≥ t, it can power one computer for the full t minutes
- If a battery has capacity < t, it can only contribute its full capacity (but can be split across computers)

For `t = 8`:

- Battery 1: min(10, 8) = 8
- Battery 2: min(10, 8) = 8
- Battery 3: min(3, 8) = 3
- Battery 4: min(5, 8) = 5
  Total available power = 8 + 8 + 3 + 5 = 24 minutes

We need to power 3 computers for 8 minutes each: 3 × 8 = 24 minutes
Total needed = 24 minutes

Since available (24) ≥ needed (24), `t = 8` is possible!

Now test `t = 9`:

- Battery 1: min(10, 9) = 9
- Battery 2: min(10, 9) = 9
- Battery 3: min(3, 9) = 3
- Battery 4: min(5, 9) = 5
  Total available = 9 + 9 + 3 + 5 = 26 minutes

Needed: 3 × 9 = 27 minutes
Available (26) < needed (27), so `t = 9` is NOT possible.

The maximum possible `t` is 8. This example shows the core check: for a candidate time `t`, sum(min(battery, t)) must be ≥ n × t.

## Brute Force Approach

A naive approach would be to try every possible time from 1 up to some maximum. The maximum possible time would be when we use all battery power: `sum(batteries) / n`. We could check each integer time value:

1. For t = 1, 2, 3, ... up to sum(batteries)//n
2. For each t, calculate total available power = sum(min(battery, t))
3. Check if total available ≥ n × t
4. Return the largest t that satisfies this

The problem with this approach is efficiency. If batteries sum to a large value (up to 10¹⁴ in constraints), we could be checking billions of values. Even with optimizations, this is O(S × m) where S is the total sum and m is the number of batteries, which is far too slow.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space. Since the condition "can run for t minutes" is monotonic:

- If we can run for t minutes, we can definitely run for any time < t
- If we cannot run for t minutes, we cannot run for any time > t

This monotonic property allows binary search! We search between:

- Lower bound: 0 (minimum possible time)
- Upper bound: sum(batteries) // n (maximum possible if we could perfectly distribute all power)

For each candidate time `mid` in our binary search, we need to efficiently check if it's possible. The check function needs to calculate:

```
total_available = sum(min(battery, mid)) for all batteries
return total_available >= n × mid
```

We can optimize this check by **sorting the batteries**. Once sorted, we can find the point where batteries[i] >= mid. All batteries before this point contribute their full value, and all batteries after contribute exactly `mid` each.

Even better: we can use a greedy approach. Sort batteries in descending order. The largest batteries can each power a computer for the full time `t`. Once we have enough large batteries to cover all computers, the remaining batteries just need to sum to enough to cover any gaps.

Actually, the most efficient check is: sort batteries descending, then check if the sum of the first n batteries (after capping each at t) plus the sum of remaining batteries is ≥ n × t.

## Optimal Solution

We'll use binary search on the answer with a greedy validation function. The validation checks if we can run all n computers for time t by:

1. Calculating the total power needed: n × t
2. Calculating total available power from batteries, but with a twist: any battery with capacity ≥ t can only contribute t minutes (since it can only power one computer at a time)
3. Checking if total available ≥ total needed

The efficient implementation sorts batteries and uses prefix sums or a running total to avoid recalculating everything each time.

<div class="code-group">

```python
# Time: O(m log S) where m = len(batteries), S = sum(batteries)
# Space: O(1) excluding input storage
def maxRunTime(n, batteries):
    # Binary search for the maximum possible time
    left, right = 0, sum(batteries) // n + 1

    while left < right:
        # mid is our candidate time
        mid = (left + right + 1) // 2  # +1 to avoid infinite loop

        # Check if we can run all n computers for 'mid' minutes
        total_power = 0
        for battery in batteries:
            # Each battery can contribute at most 'mid' minutes
            # because it can only power one computer at a time
            total_power += min(battery, mid)

        # If total available power >= required power (n * mid),
        # then 'mid' is possible, try larger time
        if total_power >= n * mid:
            left = mid  # mid is possible, search right half
        else:
            right = mid - 1  # mid not possible, search left half

    return left
```

```javascript
// Time: O(m log S) where m = batteries.length, S = sum(batteries)
// Space: O(1)
function maxRunTime(n, batteries) {
  // Calculate total battery power
  let total = 0;
  for (const battery of batteries) {
    total += battery;
  }

  // Binary search bounds
  let left = 0;
  let right = Math.floor(total / n) + 1;

  while (left < right) {
    // Calculate mid with ceiling to avoid infinite loop
    const mid = Math.floor((left + right + 1) / 2);

    // Check if mid minutes is possible
    let totalPower = 0;
    for (const battery of batteries) {
      // Each battery contributes at most mid minutes
      totalPower += Math.min(battery, mid);
    }

    // Compare available power with required power
    if (totalPower >= n * mid) {
      left = mid; // mid is possible, try larger
    } else {
      right = mid - 1; // mid not possible, try smaller
    }
  }

  return left;
}
```

```java
// Time: O(m log S) where m = batteries.length, S = sum(batteries)
// Space: O(1)
public long maxRunTime(int n, int[] batteries) {
    // Calculate total battery power
    long total = 0;
    for (int battery : batteries) {
        total += battery;
    }

    // Binary search bounds
    long left = 0;
    long right = total / n + 1;

    while (left < right) {
        // Calculate mid with ceiling to avoid infinite loop
        long mid = (left + right + 1) / 2;

        // Check if mid minutes is possible
        long totalPower = 0;
        for (int battery : batteries) {
            // Each battery contributes at most mid minutes
            totalPower += Math.min(battery, mid);
        }

        // Compare available power with required power
        if (totalPower >= n * mid) {
            left = mid;  // mid is possible, try larger
        } else {
            right = mid - 1;  // mid not possible, try smaller
        }
    }

    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m log S) where m is the number of batteries and S is the sum of all battery capacities.

- Binary search runs O(log S) iterations (since we search from 0 to sum/n)
- Each iteration processes all m batteries to calculate total power
- The check is O(m), so total is O(m log S)

**Space Complexity**: O(1) excluding the input storage. We only use a few variables for the binary search and power calculation.

**Why this is efficient**: Even with the worst-case S = 10¹⁴, log₂(10¹⁴) ≈ 47 iterations. With m ≤ 10⁵, total operations ≈ 4.7 million, which is efficient.

## Common Mistakes

1. **Not understanding battery swapping**: The most common mistake is thinking each battery must power a single computer continuously. Remember: batteries can be swapped! A battery with capacity 10 can power computer A for 3 minutes, then computer B for 7 minutes.

2. **Incorrect binary search bounds**:
   - Setting upper bound too low (like max(batteries)) instead of sum(batteries)//n
   - Forgetting the +1 when calculating mid with integer division
   - Using `while (left <= right)` instead of `while (left < right)` with the proper mid calculation

3. **Inefficient validation check**: Recalculating sum(min(battery, t)) from scratch each time is O(m). Some candidates try to optimize with sorting and prefix sums, which adds O(m log m) preprocessing but makes each check O(log m). However, with binary search's O(log S) iterations, O(m log S) is already efficient enough.

4. **Integer overflow**: With constraints up to 10⁹ per battery and 10⁵ batteries, the sum can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, int is fine in Python).

## When You'll See This Pattern

This "binary search on answer with greedy validation" pattern appears in many optimization problems where:

1. You need to find the maximum/minimum value satisfying some condition
2. The condition is monotonic (if X works, anything less/greater also works)
3. Checking the condition for a given value is easier than finding the optimal value directly

Similar LeetCode problems:

1. **Minimum Moves to Equal Array Elements (Medium)**: Find minimum moves to make all elements equal, where each move increments n-1 elements by 1. The insight is that it's equivalent to decreasing one element by 1, which leads to a similar mathematical formulation.

2. **Sell Diminishing-Valued Colored Balls (Medium)**: Maximize profit by selling balls with diminishing values. Uses binary search to find the cutoff price where selling more balls reduces profit.

3. **Maximum Number of Tasks You Can Assign (Hard)**: Similar structure with workers and tasks, using binary search to find maximum tasks with validation through greedy matching.

4. **Koko Eating Bananas (Medium)**: Binary search for minimum eating speed to finish bananas in h hours.

## Key Takeaways

1. **When to use binary search on answer**: If you're asked "find the maximum X such that condition holds" and the condition is monotonic with respect to X, binary search is likely the solution. The validation function should be efficient (often O(n) or O(n log n)).

2. **Battery swapping insight**: In distribution problems, understand what can be shared/swapped. Here, battery power can be distributed across computers over time, but each computer needs continuous power. This leads to the `min(battery, t)` contribution limit.

3. **Mathematical formulation is key**: Before coding, write down the exact condition that must be satisfied. For this problem: `sum(min(battery, t)) >= n × t`. Getting this formula right is 80% of the solution.

Related problems: [Minimum Moves to Equal Array Elements](/problem/minimum-moves-to-equal-array-elements), [Sell Diminishing-Valued Colored Balls](/problem/sell-diminishing-valued-colored-balls), [Maximum Number of Tasks You Can Assign](/problem/maximum-number-of-tasks-you-can-assign)
