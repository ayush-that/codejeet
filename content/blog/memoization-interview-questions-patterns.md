---
title: "Memoization Interview Questions: Patterns and Strategies"
description: "Master Memoization problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-14"
category: "dsa-patterns"
tags: ["memoization", "dsa", "interview prep"]
---

# Memoization Interview Questions: Patterns and Strategies

You're in an interview, feeling good about your solution to a classic dynamic programming problem. You've written a clean recursive solution, but when the interviewer asks you to run it with n=50, your code hangs. You've just fallen into the exponential time trap that memoization exists to solve. This exact scenario plays out constantly in interviews—candidates who understand recursion but haven't internalized when and how to optimize it with memoization.

Memoization isn't just a technique; it's the bridge between naive recursion and efficient dynamic programming. The data tells the story: of 39 memoization questions on major platforms, 64% are rated Hard, with Google, Amazon, and Meta asking them frequently. This skew toward difficult problems means interviewers use memoization questions to separate strong candidates from adequate ones.

## Common Patterns

### Pattern 1: Top-Down Dynamic Programming

This is the classic memoization pattern: take a recursive solution and cache results to avoid redundant computation. The intuition is simple—if you're solving the same subproblem multiple times, store the answer the first time you compute it.

Consider the Fibonacci sequence. The naive recursive solution has exponential time complexity because it recomputes F(n-2), F(n-3), etc., repeatedly.

<div class="code-group">

```python
# Time without memoization: O(2^n) | Time with memoization: O(n)
# Space: O(n) for the call stack and memo dictionary
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
```

```javascript
// Time without memoization: O(2^n) | Time with memoization: O(n)
// Space: O(n) for the call stack and memo object
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
```

```java
// Time without memoization: O(2^n) | Time with memoization: O(n)
// Space: O(n) for the call stack and memo HashMap
import java.util.HashMap;

public int fib(int n) {
    return fibHelper(n, new HashMap<>());
}

private int fibHelper(int n, HashMap<Integer, Integer> memo) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;
    int result = fibHelper(n-1, memo) + fibHelper(n-2, memo);
    memo.put(n, result);
    return result;
}
```

</div>

**Key problems using this pattern:** Climbing Stairs (#70), House Robber (#198), Decode Ways (#91). Notice these all involve making decisions that lead to overlapping subproblems.

### Pattern 2: Grid/Matrix Traversal with Constraints

When you need to count paths or find optimal paths in a grid with constraints, memoization shines. The intuition: from any cell (i, j), the number of ways to reach the destination depends only on your current position, not how you got there.

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def uniquePaths(m, n, memo={}):
    # Create a unique key for the memo dictionary
    key = (m, n)
    if key in memo:
        return memo[key]

    # Base cases
    if m == 1 or n == 1:
        return 1

    # Recursive case with memoization
    memo[key] = uniquePaths(m-1, n, memo) + uniquePaths(m, n-1, memo)
    return memo[key]
```

```javascript
// Time: O(m*n) | Space: O(m*n)
function uniquePaths(m, n, memo = {}) {
  const key = `${m},${n}`;
  if (key in memo) return memo[key];

  if (m === 1 || n === 1) return 1;

  memo[key] = uniquePaths(m - 1, n, memo) + uniquePaths(m, n - 1, memo);
  return memo[key];
}
```

```java
// Time: O(m*n) | Space: O(m*n)
import java.util.HashMap;

public int uniquePaths(int m, int n) {
    return uniquePathsHelper(m, n, new HashMap<>());
}

private int uniquePathsHelper(int m, int n, HashMap<String, Integer> memo) {
    String key = m + "," + n;
    if (memo.containsKey(key)) return memo.get(key);

    if (m == 1 || n == 1) return 1;

    int result = uniquePathsHelper(m-1, n, memo) + uniquePathsHelper(m, n-1, memo);
    memo.put(key, result);
    return result;
}
```

</div>

**Key problems using this pattern:** Unique Paths (#62), Minimum Path Sum (#64), Dungeon Game (#174). The constraint is usually that you can only move right/down, creating the overlapping subproblem structure.

### Pattern 3: Decision Trees with State

Some problems require tracking additional state beyond just position. The intuition: your memoization key must encode all the information that affects future decisions.

Take the classic "Target Sum" problem (#494): you have an array of numbers and need to assign + or - to each to reach a target sum. The state includes both your current index and the current sum.

<div class="code-group">

```python
# Time: O(n*t) where t is the sum range | Space: O(n*t)
def findTargetSumWays(nums, target):
    def dfs(i, current_sum, memo):
        key = (i, current_sum)
        if key in memo:
            return memo[key]

        if i == len(nums):
            return 1 if current_sum == target else 0

        # Try both + and - for current number
        add = dfs(i+1, current_sum + nums[i], memo)
        subtract = dfs(i+1, current_sum - nums[i], memo)

        memo[key] = add + subtract
        return memo[key]

    return dfs(0, 0, {})
```

```javascript
// Time: O(n*t) where t is the sum range | Space: O(n*t)
function findTargetSumWays(nums, target) {
  const dfs = (i, currentSum, memo) => {
    const key = `${i},${currentSum}`;
    if (memo.has(key)) return memo.get(key);

    if (i === nums.length) {
      return currentSum === target ? 1 : 0;
    }

    const add = dfs(i + 1, currentSum + nums[i], memo);
    const subtract = dfs(i + 1, currentSum - nums[i], memo);

    memo.set(key, add + subtract);
    return add + subtract;
  };

  return dfs(0, 0, new Map());
}
```

```java
// Time: O(n*t) where t is the sum range | Space: O(n*t)
import java.util.HashMap;

public int findTargetSumWays(int[] nums, int target) {
    return dfs(0, 0, nums, target, new HashMap<>());
}

private int dfs(int i, int currentSum, int[] nums, int target,
                HashMap<String, Integer> memo) {
    String key = i + "," + currentSum;
    if (memo.containsKey(key)) return memo.get(key);

    if (i == nums.length) {
        return currentSum == target ? 1 : 0;
    }

    int add = dfs(i+1, currentSum + nums[i], nums, target, memo);
    int subtract = dfs(i+1, currentSum - nums[i], nums, target, memo);

    memo.put(key, add + subtract);
    return add + subtract;
}
```

</div>

**Key problems using this pattern:** Target Sum (#494), Partition Equal Subset Sum (#416), Coin Change (#322). The state often includes an index plus some accumulated value.

## When to Use Memoization vs Alternatives

Recognizing when to reach for memoization is a critical interview skill. Here's my decision framework:

1. **Memoization vs Bottom-Up DP**: Use memoization when the state space is irregular or when you want to write the recursive solution first for clarity. Use bottom-up when you need to optimize space (you can often convert memoization to bottom-up with rolling arrays). Example: Fibonacci can be done with O(1) space using bottom-up, while memoization uses O(n) space.

2. **Memoization vs BFS/DFS**: Use memoization for optimization/counting problems ("how many ways", "minimum cost"). Use BFS/DFS for existence problems ("is there a path") or when you need to find any solution, not necessarily optimal.

3. **Memoization vs Greedy**: If the problem has optimal substructure AND greedy choice property (like activity selection), use greedy. If it only has optimal substructure (like most DP problems), use memoization/DP.

4. **Memoization vs Backtracking**: Use memoization when subproblems overlap significantly. Pure backtracking explores all possibilities without reusing computation—acceptable only for small input sizes.

**Decision criteria checklist:**

- Does the problem ask for optimal/minimum/maximum/count?
- Can you define the problem recursively?
- Do recursive calls have overlapping subproblems?
- Is the input size too large for pure recursion (typically n > 20)?

## Edge Cases and Gotchas

Interviewers love testing these subtle points:

1. **Base case initialization**: For counting problems, what does an empty set represent? In "Target Sum", an empty array with target 0 should return 1 (one way: choose nothing), not 0. Always think through the mathematical meaning of your base cases.

2. **State representation in memo key**: In "Longest Increasing Path in a Matrix" (#329), you might think to memoize just the position (i, j). But the longest path from (i, j) depends on the minimum value you can take (you can't go back to a smaller value). Actually, in this case, the path is strictly increasing, so from any cell, you can only go to larger values, making (i, j) sufficient as a key. The gotcha is recognizing when the path direction matters.

3. **Integer overflow in memo keys**: When using sums or products as part of your memo key (like in "Target Sum"), the values can get large. In Python, this isn't an issue, but in Java/C++, consider using strings or custom objects as keys.

4. **Mutable default arguments in Python**: This classic Python gotcha:
   ```python
   def bad_memo_func(n, memo={}):  # WRONG - shared across calls!
   def good_memo_func(n, memo=None):  # RIGHT
       memo = memo or {}
   ```
   The first version shares the memo dictionary across all function calls, which can lead to incorrect results when the function is called multiple times with different inputs.

## Difficulty Breakdown

The distribution—3 Easy (8%), 11 Medium (28%), 25 Hard (64%)—tells you something important: memoization is primarily tested on difficult problems. This makes sense when you consider that memoization transforms exponential solutions to polynomial ones, which is exactly the kind of optimization interviewers want to see.

For study prioritization:

1. **Start with Medium problems** to build intuition without getting bogged down in complexity. Problems like Climbing Stairs (#70) and House Robber (#198) are perfect.
2. **Move to pattern-specific Hard problems** once comfortable. Focus on one pattern at a time.
3. **Save the hardest combinatorial problems** (like "Word Break II" #140) for last—these often combine memoization with other techniques.

## Which Companies Ask Memoization

- **Google** (/company/google): Favors memoization problems that involve string manipulation or grid traversal, often with clever state representation. Expect problems like "Regular Expression Matching" (#10) or "Interleaving String" (#97).

- **Amazon** (/company/amazon): Leans toward practical, real-world scenarios converted to memoization problems. "Coin Change" (#322) and "Shopping Offers" (#638) are typical.

- **Microsoft** (/company/microsoft): Often tests memoization in the context of game theory or optimization problems. "Can I Win" (#464) is a classic Microsoft memoization question.

- **Meta** (/company/meta): Prefers memoization problems related to trees or dynamic user interactions. "Word Break" (#139) variations appear frequently.

- **Bloomberg** (/company/bloomberg): Tends to ask financial or sequence-based memoization problems, like "Best Time to Buy and Sell Stock" variations with cooldowns (#309).

## Study Tips

1. **Implement naive recursion first**: Before reaching for memoization, write the clean recursive solution. This helps you identify the subproblems and recurrence relation. Only then add memoization.

2. **Draw the recursion tree**: For the first few problems, literally draw the tree of recursive calls. Circle the duplicate subproblems. This visual exercise builds intuition for when memoization helps.

3. **Practice converting to bottom-up**: After solving with memoization, try to write the bottom-up iterative version. This dual understanding is what interviewers look for.

4. **Recommended problem order**:
   - Week 1: Climbing Stairs (#70), House Robber (#198) - basic patterns
   - Week 2: Unique Paths (#62), Minimum Path Sum (#64) - grid patterns
   - Week 3: Coin Change (#322), Target Sum (#494) - decision trees with state
   - Week 4: Word Break (#139), Regular Expression Matching (#10) - advanced applications

Memoization is more than a technique—it's a way of thinking about problem decomposition and optimization. The interviewers asking these questions aren't just testing whether you know to cache results; they're testing whether you can recognize overlapping subproblems in complex scenarios and systematically eliminate redundant computation.

[Practice all Memoization questions on CodeJeet](/topic/memoization)
