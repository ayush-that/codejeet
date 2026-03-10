---
title: "How to Solve Find the Minimum Cost Array Permutation — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Minimum Cost Array Permutation. Hard difficulty, 25.4% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2026-07-24"
category: "dsa-patterns"
tags:
  [
    "find-the-minimum-cost-array-permutation",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Find the Minimum Cost Array Permutation

This problem asks us to find the permutation of `[0, 1, 2, ..., n-1]` that minimizes a special "score" function. The score is calculated by chaining values through the given `nums` array: each term is `|perm[i] - nums[perm[(i+1) % n]]|`. What makes this tricky is that the score depends on the cyclic relationship between consecutive elements in our permutation, and we need to find the optimal arrangement among all `n!` possibilities.

## Visual Walkthrough

Let's trace through a small example with `nums = [1, 0, 3, 2]` (n=4). We need to find a permutation `perm` of `[0, 1, 2, 3]` that minimizes:

```
score = |perm[0] - nums[perm[1]]| + |perm[1] - nums[perm[2]]| +
        |perm[2] - nums[perm[3]]| + |perm[3] - nums[perm[0]]|
```

Consider `perm = [0, 1, 2, 3]`:

- Term 1: `|0 - nums[1]| = |0 - 0| = 0`
- Term 2: `|1 - nums[2]| = |1 - 3| = 2`
- Term 3: `|2 - nums[3]| = |2 - 2| = 0`
- Term 4: `|3 - nums[0]| = |3 - 1| = 2`
- Total score = 0 + 2 + 0 + 2 = 4

Now consider `perm = [0, 3, 2, 1]`:

- Term 1: `|0 - nums[3]| = |0 - 2| = 2`
- Term 2: `|3 - nums[2]| = |3 - 3| = 0`
- Term 3: `|2 - nums[1]| = |2 - 0| = 2`
- Term 4: `|1 - nums[0]| = |1 - 1| = 0`
- Total score = 2 + 0 + 2 + 0 = 4

The challenge is finding the absolute minimum among all 24 possible permutations. Notice that each term connects two consecutive positions in a cycle: position `i` contributes `perm[i]`, and position `(i+1) % n` contributes `nums[perm[(i+1) % n]]`. This cyclic dependency makes brute force evaluation of all permutations computationally infeasible for larger n.

## Brute Force Approach

The most straightforward approach is to generate all permutations of `[0, 1, 2, ..., n-1]`, calculate the score for each, and keep track of the permutation with the minimum score.

**Why this fails:** For n=14 (the maximum constraint in the problem), there are 14! ≈ 87 billion permutations. Even if we could process 1 million permutations per second, it would take over 24 hours to check them all. The time complexity is O(n! × n), which grows astronomically fast.

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(n! * n) | Space: O(n) for recursion depth
def brute_force(nums):
    n = len(nums)
    min_score = float('inf')
    best_perm = None

    def dfs(path, used):
        nonlocal min_score, best_perm

        if len(path) == n:
            # Calculate score for this complete permutation
            score = 0
            for i in range(n):
                j = (i + 1) % n
                score += abs(path[i] - nums[path[j]])

            if score < min_score:
                min_score = score
                best_perm = path.copy()
            return

        for num in range(n):
            if not used[num]:
                used[num] = True
                path.append(num)
                dfs(path, used)
                path.pop()
                used[num] = False

    dfs([], [False] * n)
    return best_perm
```

```javascript
// Time: O(n! * n) | Space: O(n) for recursion depth
function bruteForce(nums) {
  const n = nums.length;
  let minScore = Infinity;
  let bestPerm = null;

  function dfs(path, used) {
    if (path.length === n) {
      // Calculate score for this complete permutation
      let score = 0;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        score += Math.abs(path[i] - nums[path[j]]);
      }

      if (score < minScore) {
        minScore = score;
        bestPerm = [...path];
      }
      return;
    }

    for (let num = 0; num < n; num++) {
      if (!used[num]) {
        used[num] = true;
        path.push(num);
        dfs(path, used);
        path.pop();
        used[num] = false;
      }
    }
  }

  dfs([], new Array(n).fill(false));
  return bestPerm;
}
```

```java
// Time: O(n! * n) | Space: O(n) for recursion depth
import java.util.*;

public class BruteForceSolution {
    private int minScore = Integer.MAX_VALUE;
    private List<Integer> bestPerm = null;

    public List<Integer> bruteForce(int[] nums) {
        int n = nums.length;
        dfs(new ArrayList<>(), new boolean[n], nums);
        return bestPerm;
    }

    private void dfs(List<Integer> path, boolean[] used, int[] nums) {
        int n = nums.length;
        if (path.size() == n) {
            // Calculate score for this complete permutation
            int score = 0;
            for (int i = 0; i < n; i++) {
                int j = (i + 1) % n;
                score += Math.abs(path.get(i) - nums[path.get(j)]);
            }

            if (score < minScore) {
                minScore = score;
                bestPerm = new ArrayList<>(path);
            }
            return;
        }

        for (int num = 0; num < n; num++) {
            if (!used[num]) {
                used[num] = true;
                path.add(num);
                dfs(path, used, nums);
                path.remove(path.size() - 1);
                used[num] = false;
            }
        }
    }
}
```

</div>

## Optimized Approach

The key insight is recognizing this as a **Hamiltonian path problem in a complete weighted graph**, which can be solved with **dynamic programming with bitmask**.

**Graph interpretation:** Create a graph where:

- Nodes are the numbers 0 through n-1
- Edge weight from node `u` to node `v` is `|u - nums[v]|` (this represents the cost when `u` is followed by `v` in the permutation)

We need to find a Hamiltonian cycle (visiting all nodes exactly once, returning to start) with minimum total weight. The score formula shows this is exactly a Hamiltonian cycle problem.

**DP state definition:** Let `dp[mask][last]` represent the minimum score to:

- Visit all nodes in `mask` (bitmask where bit i is 1 if node i has been visited)
- End at node `last`

**Transition:** To add a new node `next` to the path:

```
dp[mask | (1 << next)][next] = min(
    dp[mask | (1 << next)][next],
    dp[mask][last] + |last - nums[next]|
)
```

**Why this works:** We're building permutations incrementally, tracking which nodes we've used (via bitmask) and where we ended. This avoids recomputing overlapping subproblems. The time complexity reduces from O(n!) to O(n² × 2ⁿ), which for n=14 is about 14² × 2¹⁴ ≈ 3.1 million operations - completely feasible.

**Path reconstruction:** We need to track not just the minimum score but also the actual permutation. We can store predecessor information to reconstruct the optimal path.

## Optimal Solution

Here's the complete DP with bitmask solution:

<div class="code-group">

```python
# Time: O(n^2 * 2^n) | Space: O(n * 2^n)
def findPermutation(nums):
    n = len(nums)
    # dp[mask][last] = (min_score, prev_node)
    # Initialize with large values
    INF = float('inf')
    dp = [[(INF, -1) for _ in range(n)] for _ in range(1 << n)]

    # Base case: starting from each node
    for i in range(n):
        dp[1 << i][i] = (0, -1)  # Starting cost is 0, no previous node

    # Fill DP table
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue  # last not in mask

            current_score, _ = dp[mask][last]
            if current_score == INF:
                continue  # Invalid state

            # Try adding each unvisited node as next
            for next_node in range(n):
                if mask & (1 << next_node):
                    continue  # Already visited

                new_mask = mask | (1 << next_node)
                new_score = current_score + abs(last - nums[next_node])

                # Update if we found a better path to (new_mask, next_node)
                if new_score < dp[new_mask][next_node][0]:
                    dp[new_mask][next_node] = (new_score, last)

    # Find the minimum complete cycle (mask with all bits set)
    full_mask = (1 << n) - 1
    min_score = INF
    last_node = -1

    for i in range(n):
        # Complete the cycle: add cost from last node back to first
        cycle_score = dp[full_mask][i][0] + abs(i - nums[0])
        if cycle_score < min_score:
            min_score = cycle_score
            last_node = i

    # Reconstruct the permutation
    permutation = []
    mask = full_mask
    current = last_node

    # Backtrack to build the permutation in reverse order
    while current != -1:
        permutation.append(current)
        prev_mask = mask ^ (1 << current)  # Remove current from mask
        _, prev_node = dp[mask][current]
        mask = prev_mask
        current = prev_node

    # Reverse to get correct order (we built it backwards)
    return permutation[::-1]
```

```javascript
// Time: O(n^2 * 2^n) | Space: O(n * 2^n)
function findPermutation(nums) {
  const n = nums.length;
  const INF = Number.MAX_SAFE_INTEGER;

  // dp[mask][last] = {score: min_score, prev: prev_node}
  const dp = new Array(1 << n);
  for (let i = 0; i < 1 << n; i++) {
    dp[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      dp[i][j] = { score: INF, prev: -1 };
    }
  }

  // Base case: starting from each node
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = { score: 0, prev: -1 };
  }

  // Fill DP table
  for (let mask = 0; mask < 1 << n; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;

      const current = dp[mask][last];
      if (current.score === INF) continue;

      // Try adding each unvisited node as next
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue;

        const newMask = mask | (1 << next);
        const newScore = current.score + Math.abs(last - nums[next]);

        if (newScore < dp[newMask][next].score) {
          dp[newMask][next] = { score: newScore, prev: last };
        }
      }
    }
  }

  // Find the minimum complete cycle
  const fullMask = (1 << n) - 1;
  let minScore = INF;
  let lastNode = -1;

  for (let i = 0; i < n; i++) {
    // Complete the cycle: add cost from last node back to first
    const cycleScore = dp[fullMask][i].score + Math.abs(i - nums[0]);
    if (cycleScore < minScore) {
      minScore = cycleScore;
      lastNode = i;
    }
  }

  // Reconstruct the permutation
  const permutation = [];
  let mask = fullMask;
  let current = lastNode;

  // Backtrack to build the permutation in reverse order
  while (current !== -1) {
    permutation.push(current);
    const prevMask = mask ^ (1 << current); // Remove current from mask
    const prevNode = dp[mask][current].prev;
    mask = prevMask;
    current = prevNode;
  }

  // Reverse to get correct order (we built it backwards)
  return permutation.reverse();
}
```

```java
// Time: O(n^2 * 2^n) | Space: O(n * 2^n)
import java.util.*;

public class Solution {
    static class State {
        int score;
        int prev;
        State(int score, int prev) {
            this.score = score;
            this.prev = prev;
        }
    }

    public int[] findPermutation(int[] nums) {
        int n = nums.length;
        int INF = Integer.MAX_VALUE / 2;  // Avoid overflow

        // dp[mask][last] = State(min_score, prev_node)
        State[][] dp = new State[1 << n][n];
        for (int i = 0; i < (1 << n); i++) {
            for (int j = 0; j < n; j++) {
                dp[i][j] = new State(INF, -1);
            }
        }

        // Base case: starting from each node
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = new State(0, -1);
        }

        // Fill DP table
        for (int mask = 0; mask < (1 << n); mask++) {
            for (int last = 0; last < n; last++) {
                if ((mask & (1 << last)) == 0) continue;

                State current = dp[mask][last];
                if (current.score == INF) continue;

                // Try adding each unvisited node as next
                for (int next = 0; next < n; next++) {
                    if ((mask & (1 << next)) != 0) continue;

                    int newMask = mask | (1 << next);
                    int newScore = current.score + Math.abs(last - nums[next]);

                    if (newScore < dp[newMask][next].score) {
                        dp[newMask][next] = new State(newScore, last);
                    }
                }
            }
        }

        // Find the minimum complete cycle
        int fullMask = (1 << n) - 1;
        int minScore = INF;
        int lastNode = -1;

        for (int i = 0; i < n; i++) {
            // Complete the cycle: add cost from last node back to first
            int cycleScore = dp[fullMask][i].score + Math.abs(i - nums[0]);
            if (cycleScore < minScore) {
                minScore = cycleScore;
                lastNode = i;
            }
        }

        // Reconstruct the permutation
        List<Integer> permutation = new ArrayList<>();
        int mask = fullMask;
        int current = lastNode;

        // Backtrack to build the permutation in reverse order
        while (current != -1) {
            permutation.add(current);
            int prevMask = mask ^ (1 << current);  // Remove current from mask
            int prevNode = dp[mask][current].prev;
            mask = prevMask;
            current = prevNode;
        }

        // Reverse to get correct order (we built it backwards)
        Collections.reverse(permutation);

        // Convert to array
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[i] = permutation.get(i);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × 2ⁿ)

- We have 2ⁿ possible masks (subsets of visited nodes)
- For each mask, we iterate through n possible last nodes
- For each (mask, last) state, we try adding each of up to n next nodes
- Total: O(2ⁿ × n × n) = O(n² × 2ⁿ)
- For n=14: 14² × 2¹⁴ ≈ 196 × 16,384 ≈ 3.2 million operations

**Space Complexity:** O(n × 2ⁿ)

- We store a DP table of size (2ⁿ × n)
- Each entry stores a score and predecessor
- Additional O(n) space for path reconstruction

## Common Mistakes

1. **Forgetting to complete the cycle:** The score formula includes the term from the last element back to the first. Candidates often calculate the Hamiltonian path cost but forget to add the final edge to close the cycle. Always check if your solution accounts for all n terms in the score.

2. **Incorrect bitmask handling:** Off-by-one errors with bit shifting are common. Remember: `(1 << i)` sets the i-th bit (0-indexed). When checking if all bits are set, use `mask == (1 << n) - 1`, not `mask == (1 << n)`.

3. **Not tracking path for reconstruction:** Storing only the minimum score isn't enough - we need the actual permutation. You must store predecessor information or reconstruct the path differently. A common workaround is to store the entire path at each state, but this increases space complexity to O(n × 2ⁿ × n).

4. **Integer overflow with large scores:** When n=14 and values can be up to 13, the maximum score per term is 13, and with 14 terms, the maximum total score is 182. Use `Integer.MAX_VALUE / 2` in Java to avoid overflow when adding, or use `float('inf')` in Python.

## When You'll See This Pattern

The DP with bitmask technique appears in problems where you need to:

1. Visit each element exactly once (permutations, Hamiltonian paths)
2. The cost depends on the order/sequence
3. The search space would be factorial without optimization

**Related problems:**

- **Shortest Path Visiting All Nodes (LeetCode 847):** Find the shortest path that visits every node in a graph. Uses the same DP[mask][node] state to track visited nodes and current position.
- **Find the Shortest Superstring (LeetCode 943):** Given an array of strings, find the shortest string that contains each string as a substring. Uses DP[mask][last] where last is the index of the last string included.
- **Maximum Product of the Length of Two Palindromic Subsequences (LeetCode 2002):** Uses bitmask to represent which characters are included in each subsequence.

## Key Takeaways

1. **Recognize Hamiltonian path/cycle problems:** When you need to find an ordering or permutation that visits each element exactly once with sequence-dependent costs, think of DP with bitmask. The state `dp[mask][last]` is the standard approach.

2. **Bitmask represents subsets efficiently:** For n ≤ 20, bitmask DP is often the optimal solution. Each bit represents whether an element is included (1) or not (0) in the current subset.

3. **Path reconstruction requires extra bookkeeping:** To recover the actual solution (not just the optimal score), you need to store predecessor information or reconstruct the path by working backwards from the final state.

Related problems: [Shortest Path Visiting All Nodes](/problem/shortest-path-visiting-all-nodes), [Find the Shortest Superstring](/problem/find-the-shortest-superstring)
