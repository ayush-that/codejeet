---
title: "How to Solve Count Unhappy Friends — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Unhappy Friends. Medium difficulty, 62.5% acceptance rate. Topics: Array, Simulation."
date: "2029-02-24"
category: "dsa-patterns"
tags: ["count-unhappy-friends", "array", "simulation", "medium"]
---

# How to Solve Count Unhappy Friends

You're given `n` friends (always even) with preference lists ranking all other friends. After pairing them up, a friend is "unhappy" if they prefer someone else over their current partner, AND that other person also prefers them over their own partner. The challenge is efficiently checking these mutual preference conditions without comparing every possible pair.

## Visual Walkthrough

Let's trace through a concrete example with 4 friends (0, 1, 2, 3):

```
Preferences:
0: [2, 1, 3]
1: [3, 0, 2]
2: [0, 3, 1]
3: [2, 1, 0]

Pairs: (0, 1) and (2, 3)
```

**Step 1: Check friend 0**

- Current partner: 1
- Preference list: [2, 1, 3] (2 is most preferred, then 1, then 3)
- Friends preferred over partner 1: just friend 2 (since 2 comes before 1 in the list)
- Check if friend 2 prefers 0 over their current partner 3:
  - Friend 2's preferences: [0, 3, 1] (0 comes first, then 3, then 1)
  - Since 0 comes before 3, friend 2 DOES prefer 0 over their partner
- Therefore, friend 0 is unhappy

**Step 2: Check friend 1**

- Current partner: 0
- Preference list: [3, 0, 2]
- Friends preferred over partner 0: just friend 3
- Check if friend 3 prefers 1 over their current partner 2:
  - Friend 3's preferences: [2, 1, 0] (2 comes first, then 1, then 0)
  - Since 2 comes before 1, friend 3 does NOT prefer 1 over their partner
- Therefore, friend 1 is not unhappy

**Step 3: Check friend 2**

- Current partner: 3
- Preference list: [0, 3, 1]
- Friends preferred over partner 3: just friend 0
- Check if friend 0 prefers 2 over their current partner 1:
  - Friend 0's preferences: [2, 1, 3] (2 comes first, then 1, then 3)
  - Since 2 comes before 1, friend 0 DOES prefer 2 over their partner
- Therefore, friend 2 is unhappy

**Step 4: Check friend 3**

- Current partner: 2
- Preference list: [2, 1, 0]
- Friends preferred over partner 2: none (2 is first in their list)
- Therefore, friend 3 is not unhappy

**Result:** 2 unhappy friends (0 and 2)

## Brute Force Approach

A naive approach would check every friend against every other friend:

1. For each friend `x`, check each other friend `u` they prefer over their current partner
2. For each such `u`, check if `u` prefers `x` over their current partner
3. Count all such `x` where this condition holds

The problem with this approach is efficiency. With `n` friends, each preference list has `n-1` entries. For each friend, we might check up to `n-2` other friends they prefer over their partner (worst case), and for each of those, we need to scan `u`'s preference list to check their ranking. This leads to O(n³) time complexity, which is too slow for n up to 500.

Even with some optimizations, the brute force approach requires repeatedly scanning preference lists to find rankings, which is inefficient.

## Optimized Approach

The key insight is that we need **fast lookups** to answer: "Does person A prefer person B over person C?"

We can achieve this by preprocessing the preference lists into **rank maps**:

1. For each person `i`, create a dictionary/map that stores the position/index of each other person in their preference list
2. This allows O(1) time to compare preferences: `rank[i][u] < rank[i][v]` means `i` prefers `u` over `v`

With this preprocessing:

- We can quickly find all friends a person prefers over their current partner
- We can quickly check if another person prefers them back over their own partner

The algorithm becomes:

1. Build rank maps for O(1) preference comparisons
2. Create a partner map for O(1) lookup of each person's partner
3. For each person `x`:
   - Get their current partner `y`
   - Check each person `u` that `x` prefers over `y`
   - For each such `u`, check if `u` prefers `x` over their own partner
   - If any such `u` exists, `x` is unhappy

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def unhappyFriends(n, preferences, pairs):
    """
    Count unhappy friends based on preferences and pairings.

    Args:
        n: Number of friends (always even)
        preferences: List of preference lists for each friend
        pairs: List of paired friends

    Returns:
        Number of unhappy friends
    """
    # Step 1: Build rank maps for O(1) preference comparisons
    # rank[i][j] stores the position of friend j in i's preference list
    rank = [{} for _ in range(n)]
    for i in range(n):
        # Store the index/position of each friend in i's preference list
        for pos, friend in enumerate(preferences[i]):
            rank[i][friend] = pos

    # Step 2: Build partner map for O(1) partner lookup
    partner = [0] * n
    for x, y in pairs:
        partner[x] = y
        partner[y] = x

    # Step 3: Count unhappy friends
    unhappy_count = 0

    # Check each person x
    for x in range(n):
        y = partner[x]  # x's current partner
        x_pref = preferences[x]  # x's preference list

        # Check each person u that x prefers over y
        # We only need to check friends that come before y in x's preference list
        for u in x_pref:
            # If we reach y in the preference list, stop checking
            # (friends after y are less preferred than y)
            if u == y:
                break

            # Check if u prefers x over their own partner
            v = partner[u]  # u's current partner

            # Using rank maps for O(1) comparison:
            # rank[u][x] < rank[u][v] means u prefers x over v
            if rank[u][x] < rank[u][v]:
                # x is unhappy with current pairing
                unhappy_count += 1
                break  # No need to check other u's for this x

    return unhappy_count
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function unhappyFriends(n, preferences, pairs) {
  /**
   * Count unhappy friends based on preferences and pairings.
   *
   * @param {number} n - Number of friends (always even)
   * @param {number[][]} preferences - Preference lists for each friend
   * @param {number[][]} pairs - Paired friends
   * @return {number} Number of unhappy friends
   */

  // Step 1: Build rank maps for O(1) preference comparisons
  // rank[i][j] stores the position of friend j in i's preference list
  const rank = new Array(n);
  for (let i = 0; i < n; i++) {
    rank[i] = {};
    // Store the index/position of each friend in i's preference list
    for (let pos = 0; pos < preferences[i].length; pos++) {
      const friend = preferences[i][pos];
      rank[i][friend] = pos;
    }
  }

  // Step 2: Build partner map for O(1) partner lookup
  const partner = new Array(n);
  for (const [x, y] of pairs) {
    partner[x] = y;
    partner[y] = x;
  }

  // Step 3: Count unhappy friends
  let unhappyCount = 0;

  // Check each person x
  for (let x = 0; x < n; x++) {
    const y = partner[x]; // x's current partner
    const xPref = preferences[x]; // x's preference list

    // Check each person u that x prefers over y
    // We only need to check friends that come before y in x's preference list
    for (const u of xPref) {
      // If we reach y in the preference list, stop checking
      // (friends after y are less preferred than y)
      if (u === y) {
        break;
      }

      // Check if u prefers x over their own partner
      const v = partner[u]; // u's current partner

      // Using rank maps for O(1) comparison:
      // rank[u][x] < rank[u][v] means u prefers x over v
      if (rank[u][x] < rank[u][v]) {
        // x is unhappy with current pairing
        unhappyCount++;
        break; // No need to check other u's for this x
      }
    }
  }

  return unhappyCount;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int unhappyFriends(int n, int[][] preferences, int[][] pairs) {
        /**
         * Count unhappy friends based on preferences and pairings.
         *
         * @param n Number of friends (always even)
         * @param preferences Preference lists for each friend
         * @param pairs Paired friends
         * @return Number of unhappy friends
         */

        // Step 1: Build rank maps for O(1) preference comparisons
        // rank[i][j] stores the position of friend j in i's preference list
        int[][] rank = new int[n][n];
        for (int i = 0; i < n; i++) {
            // Store the index/position of each friend in i's preference list
            for (int pos = 0; pos < preferences[i].length; pos++) {
                int friend = preferences[i][pos];
                rank[i][friend] = pos;
            }
        }

        // Step 2: Build partner map for O(1) partner lookup
        int[] partner = new int[n];
        for (int[] pair : pairs) {
            int x = pair[0];
            int y = pair[1];
            partner[x] = y;
            partner[y] = x;
        }

        // Step 3: Count unhappy friends
        int unhappyCount = 0;

        // Check each person x
        for (int x = 0; x < n; x++) {
            int y = partner[x];  // x's current partner
            int[] xPref = preferences[x];  // x's preference list

            // Check each person u that x prefers over y
            // We only need to check friends that come before y in x's preference list
            for (int u : xPref) {
                // If we reach y in the preference list, stop checking
                // (friends after y are less preferred than y)
                if (u == y) {
                    break;
                }

                // Check if u prefers x over their own partner
                int v = partner[u];  // u's current partner

                // Using rank maps for O(1) comparison:
                // rank[u][x] < rank[u][v] means u prefers x over v
                if (rank[u][x] < rank[u][v]) {
                    // x is unhappy with current pairing
                    unhappyCount++;
                    break;  // No need to check other u's for this x
                }
            }
        }

        return unhappyCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Building rank maps: O(n²) — for each of n friends, we process their n-1 preferences
- Building partner map: O(n) — we process n/2 pairs
- Counting unhappy friends: O(n²) worst case — for each friend x, we might check up to n-2 other friends u, with O(1) comparisons for each
- Total: O(n²) + O(n) + O(n²) = O(n²)

**Space Complexity: O(n²)**

- Rank maps: O(n²) — n friends × (n-1) entries each
- Partner array: O(n)
- Total: O(n²)

The O(n²) space for rank maps is acceptable since the input preferences already take O(n²) space.

## Common Mistakes

1. **Not preprocessing rank maps**: Trying to find positions in preference lists by scanning each time leads to O(n³) time. Always preprocess for O(1) comparisons when you need to repeatedly check rankings.

2. **Continuing to check after finding one unhappy condition**: Once you find a single `u` that makes `x` unhappy, you should `break` and count `x` as unhappy. Continuing to check other `u` values is unnecessary and could lead to double-counting if not careful.

3. **Incorrect partner lookup**: Forgetting to build a proper partner map and instead trying to find partners by scanning the pairs list each time adds O(n) overhead per lookup, making the overall solution O(n³).

4. **Not handling the "break when reaching current partner" condition**: When checking friends `u` in `x`'s preference list, you must stop when you reach `x`'s current partner `y`. Friends after `y` in the preference list are less preferred than `y`, so they can't make `x` unhappy.

## When You'll See This Pattern

This problem uses **preprocessing for fast lookups** and **simulation with O(1) comparisons**, patterns common in:

1. **Two Sum** (LeetCode 1) - Uses hash maps for O(1) lookups instead of scanning
2. **Contains Duplicate** (LeetCode 217) - Uses sets for O(1) membership checks
3. **Course Schedule** (LeetCode 207) - Builds adjacency lists for efficient graph traversal
4. **Design Underground System** (LeetCode 1396) - Preprocesses data for O(1) average time calculations

The core pattern: when you need to repeatedly answer the same type of query (like "does A prefer B over C?"), preprocess the data into a structure that answers that query in O(1) time.

## Key Takeaways

1. **Preprocess for O(1) queries**: When you need to repeatedly check conditions that involve searching through lists (like finding positions in preference lists), build lookup tables/maps first.

2. **Simulation problems often need efficient data structures**: Many "simulation" or "game rule" problems (like this one) become tractable only when you use the right data structures for fast state queries.

3. **Break early when possible**: Once you determine a friend is unhappy, stop checking other conditions for that friend. This optimization is simple but important for efficiency.

[Practice this problem on CodeJeet](/problem/count-unhappy-friends)
