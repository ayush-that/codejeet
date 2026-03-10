---
title: "How to Solve Maximum Number of Groups Getting Fresh Donuts — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Groups Getting Fresh Donuts. Hard difficulty, 41.5% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Memoization, Bitmask."
date: "2026-07-01"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-groups-getting-fresh-donuts",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Maximum Number of Groups Getting Fresh Donuts

This problem asks us to arrange customer groups to maximize how many get "fresh donuts"—meaning they're served from the start of a new batch. The tricky part is that groups must be served in full, and we can only start a new batch when the current one is completely used. This creates a dependency between groups based on their remainders when divided by `batchSize`, making it a complex combinatorial optimization problem.

## Visual Walkthrough

Let's walk through a small example: `batchSize = 4`, `groups = [1, 3, 2, 5, 2, 7]`.

First, we calculate each group's remainder when divided by 4:

- 1 → 1
- 3 → 3
- 2 → 2
- 5 → 1 (since 5 ÷ 4 = 1 remainder 1)
- 2 → 2
- 7 → 3

The key insight: only the remainder matters for whether a group gets fresh donuts! A group gets fresh donuts if the running total of donuts served so far is a multiple of `batchSize`. Since we're adding group sizes, we're effectively tracking the cumulative sum modulo `batchSize`.

Let's try an arrangement: [1, 3, 2, 5, 2, 7]

- Start: 0 donuts served (multiple of 4) → group 1 gets fresh donuts
- After group 1: 1 donut served (1 mod 4 = 1)
- Add group 3: 1 + 3 = 4 (4 mod 4 = 0) → group 3 gets fresh donuts
- Add group 2: 4 + 2 = 6 (6 mod 4 = 2)
- Add group 5: 6 + 5 = 11 (11 mod 4 = 3)
- Add group 2: 11 + 2 = 13 (13 mod 4 = 1)
- Add group 7: 13 + 7 = 20 (20 mod 4 = 0) → group 7 gets fresh donuts

Total fresh groups: 3 (groups 1, 3, and 7)

But can we do better? Let's try: [3, 1, 2, 2, 5, 7]

- 0 → group 3 fresh
- 3 → add 1 = 4 → group 1 fresh
- 4 → add 2 = 6
- 6 → add 2 = 8 → group 2 fresh
- 8 → add 5 = 13
- 13 → add 7 = 20 → group 7 fresh

Now we have 4 fresh groups! This shows arrangement matters, and we need to find the optimal ordering.

## Brute Force Approach

The brute force solution would try all permutations of the groups and count how many get fresh donuts in each arrangement. For each permutation:

1. Keep a running total of donuts served
2. For each group, check if running total % batchSize == 0 (fresh donuts)
3. Update running total by adding the group size
4. Track the maximum fresh groups across all permutations

The problem? With n groups, there are n! permutations. Even for modest n=10, that's 3.6 million permutations. For n=15, it's 1.3 trillion—completely infeasible.

What makes this problem hard is that the state space is huge, but we can compress it. Notice that groups with the same remainder modulo `batchSize` are interchangeable! A group of size 1 behaves the same as a group of size 5 when batchSize=4 (both have remainder 1).

## Optimized Approach

The key insight is **state compression through remainder counting**. Instead of tracking which specific groups we've used, we track:

1. How many groups we've used from each remainder class (0 to batchSize-1)
2. The current running total modulo batchSize

This reduces our state space dramatically. For batchSize ≤ 9 (as given in constraints), there are at most 9 remainder classes. If we have up to 30 groups per remainder (from constraints), that's still manageable.

We can use **DP with memoization**:

- State: (remainder_counts_tuple, current_remainder)
- remainder_counts_tuple: tuple of length batchSize, where each element is count of unused groups with that remainder
- current_remainder: running total modulo batchSize

At each step, we try using a group from any non-zero remainder count. If current_remainder == 0 before adding the group, that group gets fresh donuts (+1 to our count).

The recurrence relation:

```
dp(state, curr_rem) = max(
    for each remainder r where count[r] > 0:
        fresh = 1 if curr_rem == 0 else 0
        fresh + dp(new_state, (curr_rem + r) % batchSize)
)
where new_state = state with count[r] decreased by 1
```

We also handle remainder 0 groups specially: they always get fresh donuts since curr_rem + 0 = curr_rem, so if curr_rem == 0, they're fresh. Actually, simpler: groups with remainder 0 always get fresh donuts regardless of ordering, so we can count them separately upfront!

## Optimal Solution

Here's the complete solution using DP with memoization:

<div class="code-group">

```python
# Time: O(batchSize * (n/batchSize)^batchSize) - but practical due to constraints
# Space: O(batchSize * (n/batchSize)^batchSize) for memoization
class Solution:
    def maxHappyGroups(self, batchSize: int, groups: List[int]) -> int:
        # Count groups by their remainder when divided by batchSize
        remainder_count = [0] * batchSize
        for group in groups:
            remainder_count[group % batchSize] += 1

        # Groups with remainder 0 always get fresh donuts
        # because adding 0 doesn't change the running remainder
        # So if curr_rem == 0 before adding them, they're fresh
        # Actually, they're always fresh if served when curr_rem == 0
        # We'll count them separately to simplify DP
        result = remainder_count[0]
        remainder_count[0] = 0

        # Memoization dictionary: (tuple_of_counts, current_remainder) -> max_happy
        memo = {}

        def dfs(counts_tuple, curr_rem):
            # Base case: all groups used
            if sum(counts_tuple) == 0:
                return 0

            # Check memo
            key = (counts_tuple, curr_rem)
            if key in memo:
                return memo[key]

            max_happy = 0
            counts = list(counts_tuple)

            # Try using a group from each remainder class
            for rem in range(batchSize):
                if counts[rem] > 0:
                    # Use one group with this remainder
                    counts[rem] -= 1

                    # Calculate if this group would be happy
                    # Group is happy if current remainder is 0 before adding it
                    happy = 1 if curr_rem == 0 else 0

                    # New remainder after adding this group
                    new_rem = (curr_rem + rem) % batchSize

                    # Recursively find maximum from remaining groups
                    total_happy = happy + dfs(tuple(counts), new_rem)
                    max_happy = max(max_happy, total_happy)

                    # Backtrack
                    counts[rem] += 1

            memo[key] = max_happy
            return max_happy

        # Start DFS with initial counts and remainder 0
        return result + dfs(tuple(remainder_count), 0)
```

```javascript
// Time: O(batchSize * (n/batchSize)^batchSize)
// Space: O(batchSize * (n/batchSize)^batchSize) for memoization
/**
 * @param {number} batchSize
 * @param {number[]} groups
 * @return {number}
 */
var maxHappyGroups = function (batchSize, groups) {
  // Count groups by their remainder when divided by batchSize
  const remainderCount = new Array(batchSize).fill(0);
  for (const group of groups) {
    remainderCount[group % batchSize]++;
  }

  // Groups with remainder 0 always get fresh donuts
  let result = remainderCount[0];
  remainderCount[0] = 0;

  // Memoization map: key -> max_happy
  const memo = new Map();

  // Helper function to create memo key
  const getKey = (counts, currRem) => {
    return counts.join(",") + "|" + currRem;
  };

  const dfs = (counts, currRem) => {
    // Base case: all groups used
    let total = 0;
    for (let i = 0; i < batchSize; i++) {
      total += counts[i];
    }
    if (total === 0) return 0;

    // Check memo
    const key = getKey(counts, currRem);
    if (memo.has(key)) {
      return memo.get(key);
    }

    let maxHappy = 0;

    // Try using a group from each remainder class
    for (let rem = 0; rem < batchSize; rem++) {
      if (counts[rem] > 0) {
        // Use one group with this remainder
        counts[rem]--;

        // Calculate if this group would be happy
        const happy = currRem === 0 ? 1 : 0;

        // New remainder after adding this group
        const newRem = (currRem + rem) % batchSize;

        // Recursively find maximum from remaining groups
        const totalHappy = happy + dfs([...counts], newRem);
        maxHappy = Math.max(maxHappy, totalHappy);

        // Backtrack (restore counts)
        counts[rem]++;
      }
    }

    memo.set(key, maxHappy);
    return maxHappy;
  };

  return result + dfs(remainderCount, 0);
};
```

```java
// Time: O(batchSize * (n/batchSize)^batchSize)
// Space: O(batchSize * (n/batchSize)^batchSize) for memoization
class Solution {
    private Map<String, Integer> memo = new HashMap<>();

    public int maxHappyGroups(int batchSize, int[] groups) {
        // Count groups by their remainder when divided by batchSize
        int[] remainderCount = new int[batchSize];
        for (int group : groups) {
            remainderCount[group % batchSize]++;
        }

        // Groups with remainder 0 always get fresh donuts
        int result = remainderCount[0];
        remainderCount[0] = 0;

        return result + dfs(remainderCount, 0, batchSize);
    }

    private int dfs(int[] counts, int currRem, int batchSize) {
        // Base case: all groups used
        int total = 0;
        for (int count : counts) {
            total += count;
        }
        if (total == 0) return 0;

        // Create memo key
        StringBuilder keyBuilder = new StringBuilder();
        for (int count : counts) {
            keyBuilder.append(count).append(',');
        }
        keyBuilder.append('|').append(currRem);
        String key = keyBuilder.toString();

        // Check memo
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        int maxHappy = 0;

        // Try using a group from each remainder class
        for (int rem = 0; rem < batchSize; rem++) {
            if (counts[rem] > 0) {
                // Use one group with this remainder
                counts[rem]--;

                // Calculate if this group would be happy
                int happy = currRem == 0 ? 1 : 0;

                // New remainder after adding this group
                int newRem = (currRem + rem) % batchSize;

                // Recursively find maximum from remaining groups
                int totalHappy = happy + dfs(counts.clone(), newRem, batchSize);
                maxHappy = Math.max(maxHappy, totalHappy);

                // Backtrack
                counts[rem]++;
            }
        }

        memo.put(key, maxHappy);
        return maxHappy;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** The complexity is exponential but manageable due to constraints. With batchSize ≤ 9 and at most 30 groups per remainder, the state space is at most the number of ways to distribute groups among remainder classes. In worst case, this is O((n/batchSize)^batchSize), but with memoization and the small batchSize constraint, it's practical.

**Space Complexity:** O(batchSize \* (n/batchSize)^batchSize) for the memoization dictionary. Each state is a tuple of length batchSize plus an integer, and we store results for visited states.

## Common Mistakes

1. **Not handling remainder 0 groups separately:** Groups with remainder 0 always get fresh donuts if served when current remainder is 0. Since we start at remainder 0, we should serve all remainder 0 groups first for maximum happiness. Forgetting this leads to suboptimal solutions.

2. **Incorrect state representation in memoization:** The state must include BOTH the counts of remaining groups AND the current remainder. Forgetting either makes the DP incorrect because the same counts can lead to different results depending on the current remainder.

3. **Not using memoization at all:** Trying to brute force all permutations is exponential in n! which is impossible for n=30. Even with the compressed state representation, without memoization you're re-computing the same states repeatedly.

4. **Off-by-one in remainder calculation:** When calculating `(curr_rem + rem) % batchSize`, remember that rem is already a remainder (0 to batchSize-1), not the original group size. Adding the original group size and then taking modulo would be incorrect.

## When You'll See This Pattern

This type of **DP with state compression and memoization** appears in problems where:

- The search space is too large for brute force
- Many states are equivalent (groups with same remainder are interchangeable)
- The problem has constraints that make the compressed state space manageable

Similar LeetCode problems:

1. **Can I Win (LeetCode 464)** - Uses memoization with bitmask to represent which numbers have been used
2. **Stickers to Spell Word (LeetCode 691)** - Uses memoization with character counts as state
3. **Partition to K Equal Sum Subsets (LeetCode 698)** - Uses bitmask DP to track which elements have been used

The common thread is representing complex combinatorial states in a compressed form (bitmask, tuple of counts, etc.) and using memoization to avoid recomputation.

## Key Takeaways

1. **Look for interchangeable elements:** When elements with certain properties (like same remainder modulo k) behave identically in your problem, you can compress the state by counting them rather than tracking each individually.

2. **DP with memoization on compressed states:** When the state space is large but can be compressed, use memoization to store results for each compressed state. The state should capture all information needed to make future decisions.

3. **Handle special cases separately:** Groups with remainder 0 in this problem always contribute to the happy count when served at the right time. Identifying and handling such special cases upfront simplifies the main DP logic.

[Practice this problem on CodeJeet](/problem/maximum-number-of-groups-getting-fresh-donuts)
