---
title: "Medium Flipkart Interview Questions: Strategy Guide"
description: "How to tackle 73 medium difficulty questions from Flipkart — patterns, time targets, and practice tips."
date: "2032-04-23"
category: "tips"
tags: ["flipkart", "medium", "interview prep"]
---

# Medium Flipkart Interview Questions: Strategy Guide

Flipkart's interview process is known for its practical, data-heavy problems that mirror real-world e-commerce scenarios. With 73 Medium questions out of their 117 total, this difficulty level represents the core of their technical screening. Unlike Easy questions which test basic syntax and simple logic, Medium problems at Flipkart typically involve multi-step reasoning, optimization trade-offs, and handling complex constraints—often modeling actual problems like inventory management, recommendation systems, or transaction processing.

What separates Medium from Hard at Flipkart is usually the number of moving parts. Hard problems might combine multiple advanced algorithms or require non-obvious insights, while Medium problems focus on cleanly applying one or two established patterns to non-trivial scenarios. The jump from Easy to Medium is about moving from "can you solve it?" to "can you solve it efficiently and robustly?"

## Common Patterns and Templates

Flipkart's Medium questions heavily favor three categories: dynamic programming (especially for optimization), graph traversal (for relationship modeling), and sliding window/prefix sum (for sequence analysis). The most common pattern I've seen across their problems is **memoized recursion transitioning to bottom-up DP**—they love problems where you need to recognize overlapping subproblems in what initially appears to be a combinatorial challenge.

Here's the template pattern for their classic DP problems:

<div class="code-group">

```python
# Template for Flipkart-style DP problems
# Time: O(n*k) where k is state transitions | Space: O(n) for memoization
def solve_dp_flipkart_style(n, constraints):
    # Step 1: Define memoization structure
    memo = {}

    def dfs(state, remaining):
        # Step 2: Base cases
        if remaining == 0:
            return 1  # or 0, depending on problem
        if state in memo:
            return memo[state]

        # Step 3: Recurrence relation
        total = 0
        for option in get_options(state, constraints):
            total += dfs(next_state(option), remaining - 1)

        # Step 4: Memoize and return
        memo[state] = total
        return total

    return dfs(initial_state, n)

# Example application: Count ways to reach score (similar to Coin Change #322)
def count_ways_to_score(score, plays):
    memo = {}

    def dfs(current_score):
        if current_score == 0:
            return 1
        if current_score < 0:
            return 0
        if current_score in memo:
            return memo[current_score]

        ways = 0
        for play in plays:
            ways += dfs(current_score - play)

        memo[current_score] = ways
        return ways

    return dfs(score)
```

```javascript
// Template for Flipkart-style DP problems
// Time: O(n*k) where k is state transitions | Space: O(n) for memoization
function solveDPFlipkartStyle(n, constraints) {
  // Step 1: Define memoization structure
  const memo = new Map();

  function dfs(state, remaining) {
    // Step 2: Base cases
    if (remaining === 0) return 1;
    if (memo.has(state)) return memo.get(state);

    // Step 3: Recurrence relation
    let total = 0;
    const options = getOptions(state, constraints);
    for (const option of options) {
      total += dfs(nextState(option), remaining - 1);
    }

    // Step 4: Memoize and return
    memo.set(state, total);
    return total;
  }

  return dfs(initialState, n);
}

// Example application: Count ways to reach score
function countWaysToScore(score, plays) {
  const memo = new Map();

  function dfs(currentScore) {
    if (currentScore === 0) return 1;
    if (currentScore < 0) return 0;
    if (memo.has(currentScore)) return memo.get(currentScore);

    let ways = 0;
    for (const play of plays) {
      ways += dfs(currentScore - play);
    }

    memo.set(currentScore, ways);
    return ways;
  }

  return dfs(score);
}
```

```java
// Template for Flipkart-style DP problems
// Time: O(n*k) where k is state transitions | Space: O(n) for memoization
import java.util.*;

public class FlipkartDPTemplate {
    public int solveDPFlipkartStyle(int n, Constraints constraints) {
        // Step 1: Define memoization structure
        Map<String, Integer> memo = new HashMap<>();

        // Step 2: DFS with memoization
        return dfs(initialState, n, memo, constraints);
    }

    private int dfs(String state, int remaining, Map<String, Integer> memo, Constraints constraints) {
        // Base cases
        if (remaining == 0) return 1;
        if (memo.containsKey(state)) return memo.get(state);

        // Recurrence relation
        int total = 0;
        List<String> options = getOptions(state, constraints);
        for (String option : options) {
            total += dfs(nextState(option), remaining - 1, memo, constraints);
        }

        // Memoize and return
        memo.put(state, total);
        return total;
    }

    // Example application: Count ways to reach score
    public int countWaysToScore(int score, int[] plays) {
        int[] memo = new int[score + 1];
        Arrays.fill(memo, -1);
        return dfsScore(score, plays, memo);
    }

    private int dfsScore(int currentScore, int[] plays, int[] memo) {
        if (currentScore == 0) return 1;
        if (currentScore < 0) return 0;
        if (memo[currentScore] != -1) return memo[currentScore];

        int ways = 0;
        for (int play : plays) {
            ways += dfsScore(currentScore - play, plays, memo);
        }

        memo[currentScore] = ways;
        return ways;
    }
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Flipkart, you should aim to reach a working solution within 25-30 minutes, leaving 10-15 minutes for discussion, optimization, and edge cases. The clock starts when they finish explaining the problem—not when you start coding.

Beyond correctness, Flipkart interviewers watch for:

1. **Constraint awareness**: Do you ask about input size before choosing an algorithm? Mentioning "For n up to 10^5, we need O(n log n) or better" shows professional thinking.
2. **Test case generation**: Can you articulate edge cases before coding? For e-commerce problems, consider empty carts, duplicate items, boundary prices, and concurrent modifications.
3. **Space-time tradeoff discussion**: When presenting your solution, explicitly state "This uses O(n) extra space to achieve O(n) time—we could save space by doing X, but that would cost Y in time."
4. **Real-world applicability**: Connect your solution to Flipkart's domain. For a caching problem, mention "This LRU approach mirrors how we'd handle frequently viewed products."

The biggest differentiator I've seen between candidates who pass and those who don't is **communication during debugging**. When you hit a bug (and you will), narrate your thought process: "Hmm, my output is off by one—let me check the loop boundaries. Ah, I see, I'm double-counting the last element because my condition should be `<` not `<=`."

## Key Differences from Easy Problems

Easy problems test if you know the tool. Medium problems test if you know when to use which tool. The shift involves:

1. **From single-pass to multi-phase algorithms**: Easy problems often have linear solutions. Medium problems require you to combine steps—like first sort, then process, then aggregate.
2. **From obvious to non-obvious state**: In Easy problems, state is usually explicit in the input. Medium problems require you to identify and track implicit state (like in "Maximum Product Subarray" #152 where you need both min and max due to negative numbers).
3. **From correctness to optimality**: Easy solutions are often brute force. Medium requires you to reject the O(n²) approach and find the O(n log n) or O(n) solution.
4. **From isolated to connected thinking**: Easy problems stand alone. Medium problems often build on patterns—recognizing that "Group Anagrams" (#49) is really about hashing sorted strings, or that "Meeting Rooms II" (#253) is about processing start/end times.

The mindset shift is from "What code solves this?" to "What's the minimal, most efficient abstraction that solves this class of problems?"

## Specific Patterns for Medium

**Pattern 1: Modified Binary Search for Boundary Finding**
Flipkart loves problems where you need to find boundaries in sorted data—think "first bad version" but for pricing tiers or inventory thresholds. The key insight is maintaining `[left, right]` as the search space and adjusting based on `mid`.

```python
# Finding first price above threshold (conceptual)
def first_above(prices, threshold):
    left, right = 0, len(prices) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if prices[mid] > threshold:
            result = mid  # potential answer
            right = mid - 1  # look for earlier one
        else:
            left = mid + 1
    return result  # -1 if none found
```

**Pattern 2: Graph BFS for Level-wise Processing**
Many Flipkart problems involve hierarchical relationships (categories, organizational charts, referral networks). Level-order BFS with queue size tracking is essential.

```python
from collections import deque

def level_order_traversal(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level_nodes = []

        for _ in range(level_size):
            node = queue.popleft()
            level_nodes.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level_nodes)

    return result
```

## Practice Strategy

Don't just solve all 73 Medium problems sequentially. Group them by pattern and difficulty within Medium:

**Week 1-2: Foundation Patterns** (30 problems)

- Start with DP (10 problems like Coin Change #322, House Robber #198)
- Move to Graphs (10 problems like Course Schedule #207)
- Finish with Binary Search (10 problems like Search in Rotated Sorted Array #33)

**Week 3: Integration** (25 problems)

- Mixed pattern problems where you need to combine techniques
- Focus on Flipkart's most frequent: "LRU Cache" (#146), "Merge Intervals" (#56), "Word Break" (#139)

**Week 4: Timed Simulation** (18 problems)

- Set a 35-minute timer per problem
- Practice explaining your approach before coding
- Record yourself and review for clarity and pace

Aim for 3-4 Medium problems daily, with at least one being a Flipkart-specific problem. Spend 30 minutes struggling before looking at solutions—this builds pattern recognition. When you do check solutions, analyze the thought process, not just the code.

Remember: Flipkart's Medium questions are designed to see if you can translate business requirements into efficient algorithms. They're testing your engineering judgment as much as your coding skill.

[Practice Medium Flipkart questions](/company/flipkart/medium)
