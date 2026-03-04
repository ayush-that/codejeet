---
title: "Bitmask Interview Questions: Patterns and Strategies"
description: "Master Bitmask problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-02-18"
category: "dsa-patterns"
tags: ["bitmask", "dsa", "interview prep"]
---

# Bitmask Interview Questions: Patterns and Strategies

Bitmask questions are a specialized but critical domain in technical interviews, particularly for roles requiring optimization, systems programming, or competitive algorithm design. While the topic appears in only about 41 questions in common coding platforms, its distribution is telling: 0% Easy, 29% Medium, and a staggering 71% Hard. This skew toward high difficulty means that when a bitmask problem appears, it's often a key differentiator. Mastering bitmask techniques allows you to solve complex state representation problems with elegant, efficient code—a skill that immediately signals strong low-level and algorithmic proficiency to interviewers.

## Common Patterns

Bitmask problems typically involve representing a set of items or states as bits in an integer. This compact representation enables fast operations and is central to several algorithmic patterns.

**1. Subset Enumeration**
A fundamental pattern is generating all subsets of a set of size `n`. A bitmask of length `n` can represent any subset, where the `i-th` bit being 1 means element `i` is included.

<div class="code-group">

```python
def list_all_subsets(nums):
    n = len(nums)
    subsets = []
    for mask in range(1 << n):  # 2^n possibilities
        current = []
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                current.append(nums[i])
        subsets.append(current)
    return subsets
```

```javascript
function listAllSubsets(nums) {
  const n = nums.length;
  const subsets = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    const current = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        current.push(nums[i]);
      }
    }
    subsets.push(current);
  }
  return subsets;
}
```

```java
public List<List<Integer>> listAllSubsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> subsets = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> current = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                current.add(nums[i]);
            }
        }
        subsets.add(current);
    }
    return subsets;
}
```

</div>

**2. Dynamic Programming with State Compression (DP on Bitmask)**
This is the most frequent pattern in hard problems. It's often used for problems like the "Traveling Salesman Problem" (TSP), assignment problems, or game states where you need to track a visited set. The bitmask represents the visited nodes or used resources, and DP stores the optimal result for that state.

<div class="code-group">

```python
def shortest_path_tsp(dist):
    n = len(dist)
    dp = [[float('inf')] * n for _ in range(1 << n)]
    dp[1][0] = 0  # Start at node 0, only node 0 visited (mask 1)

    for mask in range(1 << n):
        for u in range(n):
            if dp[mask][u] == float('inf'):
                continue
            for v in range(n):
                if not (mask & (1 << v)):  # If v not visited
                    new_mask = mask | (1 << v)
                    dp[new_mask][v] = min(dp[new_mask][v], dp[mask][u] + dist[u][v])

    # Return to start (node 0) from all nodes visited
    final_mask = (1 << n) - 1
    return min(dp[final_mask][u] + dist[u][0] for u in range(n))
```

```javascript
function shortestPathTSP(dist) {
  const n = dist.length;
  const dp = Array(1 << n)
    .fill()
    .map(() => Array(n).fill(Infinity));
  dp[1][0] = 0;

  for (let mask = 0; mask < 1 << n; mask++) {
    for (let u = 0; u < n; u++) {
      if (dp[mask][u] === Infinity) continue;
      for (let v = 0; v < n; v++) {
        if (!(mask & (1 << v))) {
          const newMask = mask | (1 << v);
          dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
        }
      }
    }
  }

  const finalMask = (1 << n) - 1;
  let result = Infinity;
  for (let u = 0; u < n; u++) {
    result = Math.min(result, dp[finalMask][u] + dist[u][0]);
  }
  return result;
}
```

```java
public int shortestPathTSP(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0;

    for (int mask = 0; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] == Integer.MAX_VALUE) continue;
            for (int v = 0; v < n; v++) {
                if ((mask & (1 << v)) == 0) {
                    int newMask = mask | (1 << v);
                    dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
                }
            }
        }
    }

    int finalMask = (1 << n) - 1;
    int result = Integer.MAX_VALUE;
    for (int u = 0; u < n; u++) {
        if (dp[finalMask][u] != Integer.MAX_VALUE) {
            result = Math.min(result, dp[finalMask][u] + dist[u][0]);
        }
    }
    return result;
}
```

</div>

**3. Bitmask for Boolean Flags**
Use a single integer to replace multiple boolean arrays or hash sets, especially for tracking character presence, node visitation in small graphs, or feature toggles. Common operations include:

- Set bit: `mask |= (1 << i)`
- Clear bit: `mask &= ~(1 << i)`
- Toggle bit: `mask ^= (1 << i)`
- Check bit: `(mask & (1 << i)) != 0`

## Difficulty Breakdown

The data shows a complete absence of Easy problems (0%), a moderate number of Medium problems (12 questions, 29%), and a dominant number of Hard problems (29 questions, 71%). This distribution is significant.

Medium problems usually involve applying a single bitmask pattern directly, like subset generation or a straightforward DP state. Hard problems almost always combine bitmask state compression with other advanced techniques like DP optimization, BFS over state space, or min-max game theory. The high percentage of Hard problems indicates that interviewers use bitmask questions to filter for top candidates who can handle complex state management and optimization. If you encounter a bitmask problem, expect it to be a substantial part of the interview.

## Which Companies Ask Bitmask

Bitmask questions are favored by companies that design complex systems, optimize resource allocation, or work on low-level performance-critical code. The top askers include:

- [Google](/company/google) - For optimization and systems roles.
- [Amazon](/company/amazon) - In problems related to resource scheduling and logistics.
- [Meta](/company/meta) - Occasionally in puzzles and system design interviews.
- [Microsoft](/company/microsoft) - For roles involving OS or performance engineering.
- [Infosys](/company/infosys) - Sometimes in their advanced technical interviews.

## Study Tips

1. **Master the Basic Operations First.** Be fluent in setting, clearing, toggling, and checking bits without hesitation. Practice converting between bit representations and set logic.
2. **Start with Subset Problems.** Before tackling DP, solve several subset enumeration and generation problems to build intuition for representing combinations as integers.
3. **Map the State Carefully.** For DP problems, write down exactly what each bit in your mask represents before coding. A clear state definition prevents logical errors in complex transitions.
4. **Practice Space-Time Trade-off Recognition.** Bitmask solutions often trade increased memory (storing `2^n` states) for reduced time complexity. Recognize when `n` is small enough (typically ≤ 20) for this to be feasible.

Bitmask problems test your ability to think about state compactly and manipulate it efficiently. While the topic is niche, its appearance is a strong signal of a challenging interview.

[Practice all Bitmask questions on CodeJeet](/topic/bitmask)
