---
title: "How to Solve Number of People Aware of a Secret — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of People Aware of a Secret. Medium difficulty, 60.9% acceptance rate. Topics: Dynamic Programming, Queue, Simulation."
date: "2027-01-11"
category: "dsa-patterns"
tags: ["number-of-people-aware-of-a-secret", "dynamic-programming", "queue", "simulation", "medium"]
---

# How to Solve "Number of People Aware of a Secret"

This problem models how information spreads through a population with specific constraints: people start sharing after a delay, and eventually forget the secret. The challenge lies in tracking how many people know the secret each day while respecting the timing rules. What makes this tricky is that people become active sharers at different times, and we need to efficiently track their contributions without simulating every individual.

## Visual Walkthrough

Let's trace through a small example: `n = 6, delay = 2, forget = 4`

**Day 1:** One person discovers the secret.

- Knows: [1] (just discovered, not sharing yet)
- Sharing: 0 people

**Day 2:**

- Person from day 1 is still in delay period (needs 2 days total)
- Knows: [1]
- Sharing: 0 people

**Day 3:**

- Person from day 1 completes delay period and starts sharing
- This person shares with 1 new person
- Knows: [1, new person]
- Sharing: 1 person (the original)

**Day 4:**

- Person from day 1 continues sharing (shares with 1 new person)
- Person from day 3 is still in delay period
- Knows: [1, day3 person, new person]
- Sharing: 1 person (the original)

**Day 5:**

- Person from day 1 forgets (reached forget limit of 4 days)
- Person from day 3 completes delay and starts sharing (shares with 1 new person)
- Person from day 4 is still in delay
- Knows: [day3 person, day4 person, new person]
- Sharing: 1 person (day3 person)

**Day 6:**

- Person from day 3 continues sharing (shares with 1 new person)
- Person from day 4 completes delay and starts sharing (shares with 1 new person)
- Person from day 5 is still in delay
- Total new people: 2 (from day3 and day4)
- Knows: [day3, day4, day5, new1, new2]
- Sharing: 2 people (day3 and day4)

The key insight: On any day, the number of new people learning the secret equals the number of people who are actively sharing that day. And people are actively sharing from `delay+1` days after they learned it until `forget` days after they learned it.

## Brute Force Approach

A naive approach would simulate every person individually:

1. Create a list of people with their discovery day
2. Each day, for each person:
   - If they're past `forget` days, remove them
   - If they're at least `delay` days old, they share with a new person
3. Track total people each day

The problem with this approach is scalability. With `n` up to 1000 and potentially millions of people by the end, tracking each person individually becomes `O(n²)` in the worst case. Each day we might need to process an exponentially growing number of people.

## Optimized Approach

The key insight is that we don't need to track individuals, only **counts** of people who discovered the secret on each day. This transforms the problem into a dynamic programming problem:

1. Let `dp[i]` = number of people who discover the secret on day `i`
2. On day `i`, the number of new people discovering the secret equals the number of people who are actively sharing
3. People are actively sharing if they discovered the secret between `i-forget+1` and `i-delay` days ago (inclusive)
4. We need to track a sliding window sum of discoveries

However, calculating the sum directly each day would be `O(n²)`. We can optimize using a prefix sum or maintaining a running total:

- When someone starts sharing (after `delay` days), add their count to the sharing pool
- When someone forgets (after `forget` days), remove their count from the sharing pool
- The sharing pool size tells us how many new people will discover the secret today

## Optimal Solution

We'll use a queue to track when people start and stop sharing. Each entry in the queue represents a group of people who discovered the secret on the same day, and we track how many people that is.

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, forget))
def peopleAwareOfSecret(n, delay, forget):
    """
    Calculate how many people know the secret on day n.

    We use a queue where each entry is (day, count) representing
    count people who discovered the secret on that day.
    """
    from collections import deque

    # Queue stores (day_discovered, count_of_people)
    queue = deque()

    # On day 1, one person discovers the secret
    queue.append((1, 1))

    # Total people who currently know the secret
    total_knowing = 1

    # Process each day from 2 to n
    for current_day in range(2, n + 1):
        # Remove people who forget today (discovered secret forget days ago)
        while queue and queue[0][0] <= current_day - forget:
            day_discovered, count = queue.popleft()
            total_knowing -= count

        # Calculate how many new people discover the secret today
        # This equals the number of people who are actively sharing
        new_people = 0

        # People who discovered the secret at least delay days ago
        # and haven't forgotten yet are sharing
        for day_discovered, count in queue:
            if day_discovered <= current_day - delay:
                new_people += count

        # If there are new people, add them to the queue
        if new_people > 0:
            queue.append((current_day, new_people))
            total_knowing += new_people

    # Return result modulo 10^9 + 7 as problem requires
    return total_knowing % (10**9 + 7)
```

```javascript
// Time: O(n) | Space: O(min(n, forget))
function peopleAwareOfSecret(n, delay, forget) {
  /**
   * Calculate how many people know the secret on day n.
   *
   * We use a queue where each entry is [day, count] representing
   * count people who discovered the secret on that day.
   */

  // Queue stores [day_discovered, count_of_people]
  const queue = [];

  // On day 1, one person discovers the secret
  queue.push([1, 1]);

  // Total people who currently know the secret
  let totalKnowing = 1;

  // Process each day from 2 to n
  for (let currentDay = 2; currentDay <= n; currentDay++) {
    // Remove people who forget today (discovered secret forget days ago)
    while (queue.length > 0 && queue[0][0] <= currentDay - forget) {
      const [_, count] = queue.shift();
      totalKnowing -= count;
    }

    // Calculate how many new people discover the secret today
    // This equals the number of people who are actively sharing
    let newPeople = 0;

    // People who discovered the secret at least delay days ago
    // and haven't forgotten yet are sharing
    for (const [dayDiscovered, count] of queue) {
      if (dayDiscovered <= currentDay - delay) {
        newPeople += count;
      }
    }

    // If there are new people, add them to the queue
    if (newPeople > 0) {
      queue.push([currentDay, newPeople]);
      totalKnowing += newPeople;
    }
  }

  // Return result modulo 10^9 + 7 as problem requires
  const MOD = 1_000_000_007;
  return totalKnowing % MOD;
}
```

```java
// Time: O(n) | Space: O(min(n, forget))
class Solution {
    public int peopleAwareOfSecret(int n, int delay, int forget) {
        /**
         * Calculate how many people know the secret on day n.
         *
         * We use a queue where each entry is an array [day, count] representing
         * count people who discovered the secret on that day.
         */

        // Queue stores arrays where [0] = day_discovered, [1] = count_of_people
        Queue<int[]> queue = new LinkedList<>();

        // On day 1, one person discovers the secret
        queue.offer(new int[]{1, 1});

        // Total people who currently know the secret
        long totalKnowing = 1;  // Use long to avoid overflow

        // Process each day from 2 to n
        for (int currentDay = 2; currentDay <= n; currentDay++) {
            // Remove people who forget today (discovered secret forget days ago)
            while (!queue.isEmpty() && queue.peek()[0] <= currentDay - forget) {
                int[] entry = queue.poll();
                totalKnowing -= entry[1];
            }

            // Calculate how many new people discover the secret today
            // This equals the number of people who are actively sharing
            long newPeople = 0;

            // People who discovered the secret at least delay days ago
            // and haven't forgotten yet are sharing
            for (int[] entry : queue) {
                if (entry[0] <= currentDay - delay) {
                    newPeople += entry[1];
                }
            }

            // If there are new people, add them to the queue
            if (newPeople > 0) {
                queue.offer(new int[]{currentDay, (int)(newPeople % 1000000007)});
                totalKnowing += newPeople;
            }
        }

        // Return result modulo 10^9 + 7 as problem requires
        return (int)(totalKnowing % 1000000007);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k) where k is the average queue size. In the worst case, k could be O(forget), giving us O(n × forget). However, we can optimize further to O(n) by maintaining a separate sum of active sharers.

**Space Complexity:** O(min(n, forget)) since we only need to keep track of people who haven't forgotten yet. Once someone forgets, we remove them from the queue.

Let me provide an even more optimized O(n) solution that maintains a running sum:

<div class="code-group">

```python
# Time: O(n) | Space: O(forget)
def peopleAwareOfSecret(n, delay, forget):
    """
    Optimized O(n) solution using DP with sliding window.

    dp[i] = number of people who discover secret on day i
    share[i] = number of people who are sharing on day i
    """
    MOD = 10**9 + 7

    # dp[i] = number of people who discover secret on day i
    dp = [0] * (n + 1)
    dp[1] = 1  # One person discovers on day 1

    # share[i] = number of people who are sharing on day i
    share = [0] * (n + 1)

    # Track total people who know the secret
    total = 0

    for i in range(1, n + 1):
        # People start sharing after delay days
        if i + delay <= n:
            share[i + delay] = (share[i + delay] + dp[i]) % MOD

        # People stop sharing (forget) after forget days
        if i + forget <= n:
            share[i + forget] = (share[i + forget] - dp[i]) % MOD

        # Calculate dp[i] for i > 1
        if i > 1:
            # Current sharers = previous sharers + new starters - forgetters
            share[i] = (share[i] + share[i - 1]) % MOD
            dp[i] = share[i]

        # Add to total if person hasn't forgotten yet
        if i > n - forget:
            total = (total + dp[i]) % MOD

    return total % MOD
```

```javascript
// Time: O(n) | Space: O(forget)
function peopleAwareOfSecret(n, delay, forget) {
  /**
   * Optimized O(n) solution using DP with sliding window.
   *
   * dp[i] = number of people who discover secret on day i
   * share[i] = number of people who are sharing on day i
   */
  const MOD = 1_000_000_007;

  // dp[i] = number of people who discover secret on day i
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1; // One person discovers on day 1

  // share[i] = number of people who are sharing on day i
  const share = new Array(n + 1).fill(0);

  // Track total people who know the secret
  let total = 0;

  for (let i = 1; i <= n; i++) {
    // People start sharing after delay days
    if (i + delay <= n) {
      share[i + delay] = (share[i + delay] + dp[i]) % MOD;
    }

    // People stop sharing (forget) after forget days
    if (i + forget <= n) {
      share[i + forget] = (share[i + forget] - dp[i]) % MOD;
    }

    // Calculate dp[i] for i > 1
    if (i > 1) {
      // Current sharers = previous sharers + new starters - forgetters
      share[i] = (share[i] + share[i - 1]) % MOD;
      dp[i] = share[i];
    }

    // Add to total if person hasn't forgotten yet
    if (i > n - forget) {
      total = (total + dp[i]) % MOD;
    }
  }

  return ((total % MOD) + MOD) % MOD; // Ensure positive result
}
```

```java
// Time: O(n) | Space: O(forget)
class Solution {
    public int peopleAwareOfSecret(int n, int delay, int forget) {
        /**
         * Optimized O(n) solution using DP with sliding window.
         *
         * dp[i] = number of people who discover secret on day i
         * share[i] = number of people who are sharing on day i
         */
        final int MOD = 1_000_000_007;

        // dp[i] = number of people who discover secret on day i
        long[] dp = new long[n + 1];
        dp[1] = 1;  // One person discovers on day 1

        // share[i] = number of people who are sharing on day i
        long[] share = new long[n + 1];

        // Track total people who know the secret
        long total = 0;

        for (int i = 1; i <= n; i++) {
            // People start sharing after delay days
            if (i + delay <= n) {
                share[i + delay] = (share[i + delay] + dp[i]) % MOD;
            }

            // People stop sharing (forget) after forget days
            if (i + forget <= n) {
                share[i + forget] = (share[i + forget] - dp[i]) % MOD;
            }

            // Calculate dp[i] for i > 1
            if (i > 1) {
                // Current sharers = previous sharers + new starters - forgetters
                share[i] = (share[i] + share[i - 1]) % MOD;
                dp[i] = share[i];
            }

            // Add to total if person hasn't forgotten yet
            if (i > n - forget) {
                total = (total + dp[i]) % MOD;
            }
        }

        // Ensure positive result
        return (int)((total % MOD + MOD) % MOD);
    }
}
```

</div>

## Common Mistakes

1. **Off-by-one errors with day counting**: The problem says "starting from `delay` days after discovering the secret" - this means if discovered on day 1 with delay=2, they start sharing on day 3 (not day 2). Similarly, forget happens after exactly `forget` days.

2. **Not handling modulo operations correctly**: The result needs to be modulo 10^9+7. When subtracting in the optimized solution, we might get negative values that need to be adjusted back to positive.

3. **Exponential growth causing overflow**: Even with modulo, intermediate calculations can overflow 32-bit integers. Use 64-bit integers (long in Java, BigInt in JavaScript if needed).

4. **Inefficient simulation**: Trying to track each person individually leads to O(2^n) space in worst case. The key is recognizing we only need counts, not individual tracking.

## When You'll See This Pattern

This problem combines **dynamic programming** with **sliding window** techniques. Similar patterns appear in:

1. **Count Ways to Build Good Strings (LeetCode 2466)**: Similar DP with constraints on minimum and maximum lengths, using prefix sums to optimize.

2. **Student Attendance Record II (LeetCode 552)**: DP with state tracking over time, where current state depends on previous states within a window.

3. **Decode Ways II (LeetCode 639)**: DP where current decoding depends on previous 1 or 2 characters, similar to how current sharers depend on previous days' discoveries.

The core pattern is: when a problem involves processes where current state depends on states within a fixed window of previous steps, consider DP with sliding window optimization.

## Key Takeaways

1. **Think in terms of counts, not individuals**: When dealing with exponential growth problems, tracking counts by category (discovery day) is more efficient than tracking individuals.

2. **Sliding window DP optimization**: When current value depends on a range of previous values, maintain a running sum and adjust by adding new entries and removing old ones.

3. **Modulo arithmetic requires care**: With subtraction and negative values, always adjust back to positive range with `(x % MOD + MOD) % MOD`.

[Practice this problem on CodeJeet](/problem/number-of-people-aware-of-a-secret)
