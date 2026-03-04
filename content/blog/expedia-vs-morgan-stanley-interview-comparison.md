---
title: "Expedia vs Morgan Stanley: Interview Question Comparison"
description: "Compare coding interview questions at Expedia and Morgan Stanley — difficulty levels, topic focus, and preparation strategy."
date: "2027-01-10"
category: "tips"
tags: ["expedia", "morgan-stanley", "comparison"]
---

When preparing for technical interviews at major tech and finance companies, understanding the specific patterns and expectations can dramatically increase your odds of success. Expedia and Morgan Stanley, while operating in different industries, present surprisingly similar quantitative challenges in their coding interviews. Both companies ask a nearly identical number of questions—54 for Expedia and 53 for Morgan Stanley—with an almost perfect mirror in difficulty distribution: 13 Easy, ~35 Medium, and 6 Hard problems. This indicates a strong, shared emphasis on assessing a candidate's core problem-solving skills through medium-difficulty algorithmic challenges. The key differentiator lies not in volume or difficulty, but in the specific technical focus required for each.

## Question Volume and Difficulty

The data reveals a near-perfect alignment in the structure of their technical assessments. Both companies heavily weight their question banks toward **Medium** difficulty problems, which comprise roughly 65% of their total questions. This is the industry standard for evaluating a candidate's proficiency with core data structures and algorithms under moderate time constraints. The **Easy** questions (13 each) typically serve as warm-ups or screening checks, while the **Hard** questions (6 each) are likely reserved for more senior roles or particularly challenging on-site rounds.

The takeaway is clear: for both companies, your preparation must be laser-focused on mastering Medium-level problems. You should be able to solve them correctly, explain your reasoning clearly, and discuss trade-offs within a 25-30 minute window.

## Topic Overlap

There is significant, but not complete, overlap in the core topics tested. Both companies prioritize **Array**, **String**, and **Hash Table** manipulation. These are fundamental building blocks for most algorithmic problems.

- **Array/String Problems:** Expect questions involving two-pointers, sliding windows, and string parsing.
- **Hash Table Problems:** Frequently used for efficient lookups to achieve O(1) or O(n) time complexity, often paired with arrays.

The critical divergence is in the fourth major topic. Expedia lists **Greedy** algorithms, while Morgan Stanley lists **Dynamic Programming (DP)**. This is a substantial difference in preparation focus.

- **Expedia's Greedy Focus:** This suggests a preference for problems where a locally optimal choice leads to a globally optimal solution (e.g., scheduling, interval problems, coin change with certain denominations). The thought process is often about sorting and making the "best" immediate decision.

<div class="code-group">

```python
# Example Greedy Pattern: Interval Scheduling (Find max non-overlapping intervals)
def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])  # Sort by end time
    count, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end:
            count += 1
            end = e
    return count
```

```javascript
// Example Greedy Pattern: Interval Scheduling
function maxNonOverlapping(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // Sort by end time
  let count = 0,
    end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) {
      count++;
      end = e;
    }
  }
  return count;
}
```

```java
// Example Greedy Pattern: Interval Scheduling
public int maxNonOverlapping(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0, end = Integer.MIN_VALUE;
    for (int[] interval : intervals) {
        if (interval[0] >= end) {
            count++;
            end = interval[1];
        }
    }
    return count;
}
```

</div>

- **Morgan Stanley's DP Focus:** This points to a need to master problems involving optimization over sequences or states, like longest increasing subsequence, knapsack variations, or pathfinding. DP requires breaking problems into overlapping subproblems and building a solution bottom-up or top-down with memoization.

<div class="code-group">

```python
# Example DP Pattern: 0/1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]
```

```javascript
// Example DP Pattern: 0/1 Knapsack
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}
```

```java
// Example DP Pattern: 0/1 Knapsack
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    return dp[n][capacity];
}
```

</div>

## Which to Prepare for First

Start with the **shared foundation**. Master arrays, strings, hash tables, and the common data structures (linked lists, trees, graphs) that support them. Solve 30-40 Medium problems from these common topics. This core competency will serve you for both companies.

Once the foundation is solid, branch based on your target:

- **For Expedia:** Dedicate significant practice to canonical Greedy problems. Learn to identify when a greedy choice is valid.
- **For Morgan Stanley:** Shift focus to Dynamic Programming. Practice identifying state, defining the recurrence relation, and implementing tabulation or memoization.

If you are preparing for both simultaneously, prioritize the shared topics first. Then, integrate topic-specific problems into your routine, as Greedy and DP require distinct and non-trivial practice to master. The volume of questions is similar, so the deciding factor in your study plan is this topic specialization.

For detailed question lists and patterns, visit the Expedia and Morgan Stanley question banks.

- [Expedia Interview Questions](/company/expedia)
- [Morgan Stanley Interview Questions](/company/morgan-stanley)
