---
title: "How to Solve Can You Eat Your Favorite Candy on Your Favorite Day? — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Can You Eat Your Favorite Candy on Your Favorite Day?. Medium difficulty, 36.0% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-03-06"
category: "dsa-patterns"
tags: ["can-you-eat-your-favorite-candy-on-your-favorite-day", "array", "prefix-sum", "medium"]
---

# How to Solve "Can You Eat Your Favorite Candy on Your Favorite Day?"

This problem asks whether you can eat a specific type of candy on a specific day given daily consumption limits and a fixed candy order. The tricky part is that candies must be eaten in order (type 0, then type 1, etc.), but you can eat multiple candies per day within a daily cap. This creates a range of possible consumption scenarios we need to check.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
candiesCount = [7, 4, 5, 3, 8]
queries = [[0, 2, 2], [4, 10, 3]]
```

**Query 1:** `[0, 2, 2]` - Can we eat type 0 candy on day 2?

First, calculate prefix sums to know how many candies come before each type:

- Before type 0: 0 candies
- Before type 1: 7 candies
- Before type 2: 7+4 = 11 candies
- Before type 3: 7+4+5 = 16 candies
- Before type 4: 7+4+5+3 = 19 candies

Now think about consumption:

- Earliest day we could reach type 0: We need to eat at least 1 candy total. With daily cap of 2, earliest is day 0 (1 candy eaten).
- Latest day we could reach type 0: We can eat at most 2 candies per day. Type 0 has 7 candies. To finish type 0, we need at least ceil(7/2) = 4 days. So we could still be eating type 0 on day 3.

Day 2 falls between day 0 and day 3, so YES for query 1.

**Query 2:** `[4, 10, 3]` - Can we eat type 4 candy on day 10?

- Candies before type 4: 7+4+5+3 = 19 candies
- Type 4 has 8 candies

Earliest day to reach type 4:
We need to eat at least 20 candies total (19 before + 1 of type 4). With daily cap 3, earliest is ceil(20/3) = 7 days (days 0-6).

Latest day to reach type 4:
We could eat slowly: minimum 1 candy per day. To eat 19 candies before type 4, we need at least 19 days. So we could still be eating candies before type 4 on day 18.

Day 10 falls between day 7 and day 18, so YES for query 2.

The pattern: For each query, we check if favoriteDay falls within the range [minDays, maxDays] where:

- minDays = ceil((prefix[favoriteType] + 1) / dailyCap)
- maxDays = prefix[favoriteType + 1] - 1 (if favoriteType is last type, use total candies - 1)

## Brute Force Approach

A naive approach would simulate eating candies day by day, trying all possible consumption patterns within the daily cap. For each query:

1. Start with day = 0, current candy type = 0, remaining candies = candiesCount[0]
2. For each day until we reach favoriteDay or pass it:
   - Eat between 1 and dailyCap candies
   - Move to next candy type when current type is exhausted
3. Check if we're eating favoriteType on favoriteDay

The problem? This requires exploring up to `dailyCap^favoriteDay` possibilities per query! With constraints up to 10^5 candies and 10^5 queries, this is impossibly slow.

Even a simpler simulation that always eats the maximum possible each day fails because we need to consider both fastest and slowest consumption rates to determine the range of possible days for reaching each candy type.

## Optimized Approach

The key insight is that we don't need to simulate day-by-day eating. Instead, we can calculate the **range of days** when we could possibly be eating a particular candy type.

For candy type `t`:

- **Earliest possible day** to eat type `t`: Eat at maximum rate (dailyCap) to reach it as soon as possible
- **Latest possible day** to eat type `t`: Eat at minimum rate (1 per day) to reach it as late as possible

Mathematically:

- Let `prefix[t]` = total candies before type `t` (sum of candiesCount[0..t-1])
- Let `totalUpToT` = total candies up through type `t` (prefix[t] + candiesCount[t])

Then:

- **minDay** = ceil((prefix[t] + 1) / dailyCap)  
  We need to eat at least `prefix[t] + 1` candies to reach type `t`, eating at most `dailyCap` per day
- **maxDay** = totalUpToT - 1
  If we eat 1 candy per day, we take `totalUpToT - 1` days to finish all candies up through type `t`

If `favoriteDay` falls within `[minDay, maxDay]`, the answer is true.

We need prefix sums to quickly calculate how many candies come before each type. This transforms an O(n²) simulation problem into O(n + q) where n is candiesCount length and q is queries count.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + q) where n = len(candiesCount), q = len(queries)
# Space: O(n) for prefix sums array
def canEat(candiesCount, queries):
    """
    Determines for each query whether you can eat your favorite candy
    on your favorite day given daily consumption limits.
    """
    n = len(candiesCount)

    # Step 1: Build prefix sums array
    # prefix[i] = total candies of types 0 through i-1
    # prefix[0] = 0 (no candies before type 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + candiesCount[i]

    answers = []

    # Step 2: Process each query
    for favoriteType, favoriteDay, dailyCap in queries:
        # Total candies before favoriteType
        candiesBefore = prefix[favoriteType]

        # Total candies up through favoriteType
        candiesUpTo = prefix[favoriteType + 1]

        # Earliest day we could be eating favoriteType:
        # Need to eat at least (candiesBefore + 1) candies total
        # Eating at most dailyCap per day
        # Use integer math for ceil division: (x + y - 1) // y
        minDay = (candiesBefore + dailyCap) // dailyCap

        # Latest day we could be eating favoriteType:
        # If we eat 1 candy per day, we take (candiesUpTo - 1) days
        # to finish all candies up through favoriteType
        maxDay = candiesUpTo - 1

        # Check if favoriteDay falls within the possible range
        # Note: favoriteDay is 0-indexed, so day 0 is the first day
        answers.append(minDay <= favoriteDay + 1 <= maxDay + 1)

    return answers
```

```javascript
// Time: O(n + q) where n = candiesCount.length, q = queries.length
// Space: O(n) for prefix sums array
function canEat(candiesCount, queries) {
  const n = candiesCount.length;

  // Step 1: Build prefix sums array
  // prefix[i] = total candies of types 0 through i-1
  // prefix[0] = 0 (no candies before type 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + candiesCount[i];
  }

  const answers = [];

  // Step 2: Process each query
  for (const [favoriteType, favoriteDay, dailyCap] of queries) {
    // Total candies before favoriteType
    const candiesBefore = prefix[favoriteType];

    // Total candies up through favoriteType
    const candiesUpTo = prefix[favoriteType + 1];

    // Earliest day we could be eating favoriteType:
    // Need to eat at least (candiesBefore + 1) candies total
    // Eating at most dailyCap per day
    // Use Math.ceil for ceiling division
    const minDay = Math.floor((candiesBefore + dailyCap) / dailyCap);

    // Latest day we could be eating favoriteType:
    // If we eat 1 candy per day, we take (candiesUpTo - 1) days
    // to finish all candies up through favoriteType
    const maxDay = candiesUpTo - 1;

    // Check if favoriteDay falls within the possible range
    // Note: favoriteDay is 0-indexed, so day 0 is the first day
    // We add 1 to favoriteDay because our minDay/maxDay are 1-indexed
    answers.push(minDay <= favoriteDay + 1 && favoriteDay + 1 <= maxDay + 1);
  }

  return answers;
}
```

```java
// Time: O(n + q) where n = candiesCount.length, q = queries.length
// Space: O(n) for prefix sums array
public boolean[] canEat(int[] candiesCount, int[][] queries) {
    int n = candiesCount.length;

    // Step 1: Build prefix sums array
    // prefix[i] = total candies of types 0 through i-1
    // prefix[0] = 0 (no candies before type 0)
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + candiesCount[i];
    }

    boolean[] answers = new boolean[queries.length];

    // Step 2: Process each query
    for (int i = 0; i < queries.length; i++) {
        int favoriteType = queries[i][0];
        int favoriteDay = queries[i][1];
        int dailyCap = queries[i][2];

        // Total candies before favoriteType
        long candiesBefore = prefix[favoriteType];

        // Total candies up through favoriteType
        long candiesUpTo = prefix[favoriteType + 1];

        // Earliest day we could be eating favoriteType:
        // Need to eat at least (candiesBefore + 1) candies total
        // Eating at most dailyCap per day
        // Use long to avoid overflow in multiplication
        long minDay = (candiesBefore + dailyCap) / dailyCap;

        // Latest day we could be eating favoriteType:
        // If we eat 1 candy per day, we take (candiesUpTo - 1) days
        // to finish all candies up through favoriteType
        long maxDay = candiesUpTo - 1;

        // Check if favoriteDay falls within the possible range
        // Note: favoriteDay is 0-indexed, so day 0 is the first day
        // We add 1 to favoriteDay because our minDay/maxDay are 1-indexed
        answers[i] = (minDay <= favoriteDay + 1) && (favoriteDay + 1 <= maxDay + 1);
    }

    return answers;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + q)

- Building prefix sums: O(n) where n is length of candiesCount
- Processing each query: O(1) per query, O(q) total
- Total: O(n + q)

**Space Complexity:** O(n)

- Prefix sums array: O(n)
- Output array: O(q) but this is usually not counted in auxiliary space
- Total auxiliary space: O(n)

The key efficiency gain comes from precomputing prefix sums once, then answering each query in constant time using simple arithmetic.

## Common Mistakes

1. **Off-by-one errors with day counting**: The problem uses 0-indexed days, but our calculations often work better with 1-indexed thinking. Remember that if you need to eat X candies and can eat at most C per day, the earliest day is ceil(X/C), not floor(X/C).

2. **Integer overflow**: With up to 10^5 candies of up to 10^9 each, sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python).

3. **Misunderstanding the range boundaries**:
   - The earliest day calculation uses `candiesBefore + 1` (need at least one candy of the favorite type)
   - The latest day uses `candiesUpTo - 1` (if you finish all candies up through the type on day D, you were eating that type on day D-1)

4. **Forgetting to handle the last candy type**: When `favoriteType` is the last type, `candiesUpTo` should be total candies. Our prefix array handles this correctly with `prefix[n]` where n is length.

## When You'll See This Pattern

This problem combines **prefix sums** with **range checking**, a common pattern in array problems:

1. **Range Sum Queries (LeetCode 303, 304)**: Similar prefix sum concept for answering sum queries quickly.
2. **Corporate Flight Bookings (LeetCode 1109)**: Uses difference arrays, another prefix-related technique.
3. **Product of Array Except Self (LeetCode 238)**: Uses prefix and suffix products, similar cumulative computation pattern.
4. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps for efficient lookup.

The core idea is to precompute cumulative information so you can answer queries about ranges without recalculating from scratch each time.

## Key Takeaways

1. **Prefix sums transform range queries into point queries**: Instead of summing candiesCount[0..t-1] for each query (O(n) per query), compute once and answer in O(1).

2. **Think in terms of feasible ranges**: Many "is it possible" problems become simpler when you calculate the minimum and maximum possible values rather than trying to find one specific valid sequence.

3. **Watch for overflow in cumulative sums**: When numbers can be large, use appropriate data types (long instead of int) to avoid silent overflow bugs.

[Practice this problem on CodeJeet](/problem/can-you-eat-your-favorite-candy-on-your-favorite-day)
