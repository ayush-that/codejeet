---
title: "How to Solve Number of Squareful Arrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Squareful Arrays. Hard difficulty, 51.2% acceptance rate. Topics: Array, Hash Table, Math, Dynamic Programming, Backtracking."
date: "2028-08-09"
category: "dsa-patterns"
tags: ["number-of-squareful-arrays", "array", "hash-table", "math", "hard"]
---

# How to Solve Number of Squareful Arrays

This problem asks us to count all permutations of an array where every adjacent pair sums to a perfect square. What makes this problem tricky is that we need to count _distinct_ permutations (handling duplicates carefully) while also enforcing a mathematical constraint on adjacent elements. It's essentially a constrained permutation problem with graph theory undertones.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 17, 8]`

**Step 1: Check which pairs can be adjacent**
We need to check all possible pairs to see if their sum is a perfect square:

- 1 + 17 = 18 ❌ (not a perfect square)
- 1 + 8 = 9 ✅ (3²)
- 17 + 8 = 25 ✅ (5²)

So 1 can only be next to 8, and 8 can be next to both 1 and 17.

**Step 2: Build valid permutations**
We need to find all permutations where adjacent pairs are valid:

1. Start with 1: must be followed by 8 → [1, 8]
   - Next element after 8 can be 17 (8+17=25 is square) → [1, 8, 17] ✓
2. Start with 8: can be followed by 1 or 17
   - Follow with 1: [8, 1] → only 8 can follow 1 (1+8=9) → [8, 1, 8] ❌ (can't reuse 8)
   - Follow with 17: [8, 17] → only 8 can follow 17 (17+8=25) → [8, 17, 8] ❌ (can't reuse 8)
3. Start with 17: must be followed by 8 → [17, 8]
   - Next element after 8 can be 1 (8+1=9 is square) → [17, 8, 1] ✓

**Result:** We found 2 valid permutations: [1, 8, 17] and [17, 8, 1]

This example shows we need to:

1. Track which numbers can be adjacent (build a graph)
2. Generate permutations respecting adjacency constraints
3. Handle duplicate numbers carefully

## Brute Force Approach

A naive approach would generate all permutations of the array (n! possibilities), then check each one to see if it's squareful. For each permutation, we'd check n-1 adjacent pairs.

**Why this fails:**

- For n=12, that's 479 million permutations to check
- Even with pruning, the search space is enormous
- We need to handle duplicates efficiently to avoid counting identical permutations multiple times

The brute force approach is O(n! × n) time, which is completely impractical for n > 10.

## Optimized Approach

The key insight is to treat this as a **Hamiltonian path counting problem** on a graph:

1. **Graph Representation**: Each unique number is a node. There's an edge between two nodes if their sum is a perfect square.
2. **Counting Paths**: We need to count all Hamiltonian paths (paths visiting each node exactly once) in this graph.
3. **Handling Duplicates**: When numbers repeat, we need to track counts of each number and decrement as we use them.
4. **Backtracking with Memoization**: We can use backtracking with memoization (DP with bitmask) to avoid recomputing the same states.

**Step-by-step reasoning:**

1. First, count frequencies of each number (to handle duplicates)
2. Build an adjacency list: for each number, list all other numbers it can be adjacent to
3. Use backtracking: at each step, choose a number that:
   - Has remaining count > 0
   - Can be placed next to the previous number (or is the first number)
4. Use memoization with state = (last_number, remaining_counts_tuple) to avoid recomputation
5. Count complete permutations (when we've used all numbers)

## Optimal Solution

Here's the complete solution using backtracking with memoization:

<div class="code-group">

```python
# Time: O(n^2 * 2^n) | Space: O(n * 2^n)
class Solution:
    def numSquarefulPerms(self, nums: List[int]) -> int:
        from collections import Counter
        from math import isqrt

        n = len(nums)
        count = Counter(nums)  # Track frequency of each number

        # Build graph: which numbers can be adjacent?
        graph = {x: [] for x in count}
        for x in count:
            for y in count:
                # Check if x + y is a perfect square
                s = x + y
                sqrt_s = isqrt(s)
                if sqrt_s * sqrt_s == s:
                    graph[x].append(y)

        # Backtracking with memoization
        memo = {}

        def dfs(last, remaining):
            """
            Count permutations starting with 'last' as the most recent number,
            with 'remaining' numbers left to place.

            Args:
                last: The last number placed (None if starting)
                remaining: Total count of numbers left to place
            """
            if remaining == 0:
                return 1  # Found a valid permutation

            # Create memoization key
            key = (last, tuple(sorted(count.items())))
            if key in memo:
                return memo[key]

            total = 0
            for num in list(count.keys()):
                if count[num] > 0:
                    # Check if we can place 'num' next to 'last'
                    if last is None or num in graph[last]:
                        # Place this number
                        count[num] -= 1
                        total += dfs(num, remaining - 1)
                        # Backtrack
                        count[num] += 1

            memo[key] = total
            return total

        return dfs(None, n)
```

```javascript
// Time: O(n^2 * 2^n) | Space: O(n * 2^n)
/**
 * @param {number[]} nums
 * @return {number}
 */
var numSquarefulPerms = function (nums) {
  const n = nums.length;

  // Count frequency of each number
  const count = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // Build adjacency graph
  const graph = new Map();
  const numbers = Array.from(count.keys());

  // Initialize graph for each unique number
  for (const num of numbers) {
    graph.set(num, []);
  }

  // Add edges between numbers whose sum is a perfect square
  for (const x of numbers) {
    for (const y of numbers) {
      const sum = x + y;
      const sqrt = Math.floor(Math.sqrt(sum));
      if (sqrt * sqrt === sum) {
        graph.get(x).push(y);
      }
    }
  }

  // Memoization cache
  const memo = new Map();

  /**
   * Backtracking function to count valid permutations
   * @param {number|null} last - Last number placed (null if starting)
   * @param {number} remaining - Numbers left to place
   * @returns {number} - Number of valid permutations from this state
   */
  function dfs(last, remaining) {
    if (remaining === 0) {
      return 1; // Found a complete permutation
    }

    // Create memoization key
    const countKey = JSON.stringify(Array.from(count.entries()).sort());
    const memoKey = `${last}|${countKey}`;

    if (memo.has(memoKey)) {
      return memo.get(memoKey);
    }

    let total = 0;
    // Try each available number as the next element
    for (const num of numbers) {
      if (count.get(num) > 0) {
        // Check adjacency constraint
        if (last === null || graph.get(last).includes(num)) {
          // Place this number
          count.set(num, count.get(num) - 1);
          total += dfs(num, remaining - 1);
          // Backtrack
          count.set(num, count.get(num) + 1);
        }
      }
    }

    memo.set(memoKey, total);
    return total;
  }

  return dfs(null, n);
};
```

```java
// Time: O(n^2 * 2^n) | Space: O(n * 2^n)
class Solution {
    private Map<Integer, Integer> count;
    private Map<Integer, List<Integer>> graph;
    private Map<String, Integer> memo;

    public int numSquarefulPerms(int[] nums) {
        int n = nums.length;

        // Count frequency of each number
        count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }

        // Build adjacency graph
        graph = new HashMap<>();
        for (int x : count.keySet()) {
            graph.put(x, new ArrayList<>());
        }

        // Add edges for numbers whose sum is a perfect square
        for (int x : count.keySet()) {
            for (int y : count.keySet()) {
                int sum = x + y;
                int sqrt = (int) Math.sqrt(sum);
                if (sqrt * sqrt == sum) {
                    graph.get(x).add(y);
                }
            }
        }

        // Initialize memoization
        memo = new HashMap<>();

        return dfs(null, n);
    }

    private int dfs(Integer last, int remaining) {
        if (remaining == 0) {
            return 1; // Found a complete permutation
        }

        // Create memoization key
        StringBuilder keyBuilder = new StringBuilder();
        keyBuilder.append(last == null ? "null" : last);
        keyBuilder.append("|");

        // Add sorted count entries to the key
        List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(count.entrySet());
        entries.sort((a, b) -> a.getKey() - b.getKey());
        for (Map.Entry<Integer, Integer> entry : entries) {
            keyBuilder.append(entry.getKey()).append(":").append(entry.getValue()).append(",");
        }

        String key = keyBuilder.toString();
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        int total = 0;
        for (int num : count.keySet()) {
            if (count.get(num) > 0) {
                // Check if we can place 'num' next to 'last'
                if (last == null || graph.get(last).contains(num)) {
                    // Place this number
                    count.put(num, count.get(num) - 1);
                    total += dfs(num, remaining - 1);
                    // Backtrack
                    count.put(num, count.get(num) + 1);
                }
            }
        }

        memo.put(key, total);
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² × 2ⁿ)**

- We have 2ⁿ possible states (each number used/not used, though with duplicates it's more complex)
- For each state, we iterate through up to n numbers to try as next element
- Building the graph takes O(n²) time
- The n² factor comes from checking all pairs when building the graph

**Space Complexity: O(n × 2ⁿ)**

- The memoization cache stores results for O(2ⁿ) states
- Each state key has size O(n) to represent the count of each number
- The recursion depth is O(n) for the call stack

In practice, this is much faster than brute force because:

1. We prune invalid branches early (when a number can't be adjacent to the previous one)
2. We memoize states to avoid recomputation
3. We handle duplicates efficiently by tracking counts rather than positions

## Common Mistakes

1. **Not handling duplicates correctly**: Simply generating all permutations and using a set to remove duplicates is too slow. You must track counts during backtracking.
   - _Fix_: Use a frequency map and decrement counts as you use numbers.

2. **Forgetting the adjacency constraint on the first element**: The first element has no previous element, so it should accept any available number.
   - _Fix_: Use `last = None/null` as a special case for the starting position.

3. **Inefficient perfect square check**: Using `sqrt(num) == floor(sqrt(num))` with floating-point arithmetic can have precision issues.
   - _Fix_: Use integer square root: `int(sqrt) * int(sqrt) == num` or `Math.isqrt()` in Python 3.8+.

4. **Not memoizing with the right state**: Memoizing only with `(last, remaining)` isn't enough because different distributions of remaining counts can lead to different results.
   - _Fix_: Include the entire count map (or a canonical representation of it) in the memoization key.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Constrained Permutations**: Similar to [Permutations II](https://leetcode.com/problems/permutations-ii/) but with additional constraints on adjacent elements.

2. **Hamiltonian Path Counting**: Like finding all paths in a graph that visit each node exactly once. Related to [Hamiltonian Path](https://www.geeksforgeeks.org/hamiltonian-path-using-dynamic-programming/) problems.

3. **Backtracking with Memoization (DP on subsets)**: The technique of memoizing based on which elements have been used is common in problems like [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/).

4. **Graph Construction from Constraints**: Building implicit graphs from pairwise constraints appears in problems like [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/).

## Key Takeaways

1. **When you need to count permutations with constraints**, consider building a graph where edges represent valid adjacent pairs, then count Hamiltonian paths.

2. **For permutation problems with duplicates**, track counts of each element rather than tracking positions or using sets to deduplicate.

3. **Backtracking with memoization** is powerful for counting problems where the state can be represented compactly (like which elements have been used and what the last element was).

4. **Always check edge cases**: What if all numbers are the same? What if no valid permutations exist? What if the array has length 1?

Related problems: [Permutations II](/problem/permutations-ii)
