---
title: "How to Solve Climbing Stairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Climbing Stairs. Easy difficulty, 53.9% acceptance rate. Topics: Math, Dynamic Programming, Memoization."
date: "2026-02-21"
category: "dsa-patterns"
tags: ["climbing-stairs", "math", "dynamic-programming", "memoization", "easy"]
---

# How to Solve Climbing Stairs

You need to count the number of distinct ways to climb a staircase of `n` steps, where you can take either 1 or 2 steps at a time. This problem is interesting because it looks like a simple counting problem, but it reveals a fundamental pattern in dynamic programming: the Fibonacci sequence. Many candidates recognize the pattern but struggle to implement it efficiently or explain why it works.

## Visual Walkthrough

Let's trace through a small example with `n = 4` steps. We'll build up from the base cases:

- **0 steps**: There's exactly 1 way to be at the bottom (do nothing). So `ways(0) = 1`
- **1 step**: Only one way to reach step 1: take a single 1-step. So `ways(1) = 1`
- **2 steps**: Two ways to reach step 2:
  1. Take two 1-steps (1+1)
  2. Take one 2-step
     So `ways(2) = 2`

Now for step 3: How can we get to step 3?

- From step 1: Take a 2-step (since 1 + 2 = 3)
- From step 2: Take a 1-step (since 2 + 1 = 3)

So `ways(3) = ways(1) + ways(2) = 1 + 2 = 3`

For step 4: How can we get to step 4?

- From step 2: Take a 2-step (2 + 2 = 4)
- From step 3: Take a 1-step (3 + 1 = 4)

So `ways(4) = ways(2) + ways(3) = 2 + 3 = 5`

This reveals the pattern: `ways(n) = ways(n-1) + ways(n-2)`, which is exactly the Fibonacci sequence (shifted by one position).

## Brute Force Approach

The most intuitive approach is to use recursion: at each step, we can either take 1 step or 2 steps, and we recursively count the ways for the remaining steps.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def climbStairs(n):
    # Base cases
    if n == 0:  # No steps left, we've reached the top
        return 1
    if n == 1:  # Only one step left, only one way (take 1 step)
        return 1

    # Recursive case: sum of taking 1 step and taking 2 steps
    return climbStairs(n - 1) + climbStairs(n - 2)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function climbStairs(n) {
  // Base cases
  if (n === 0) return 1; // No steps left
  if (n === 1) return 1; // Only one step left

  // Recursive case
  return climbStairs(n - 1) + climbStairs(n - 2);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public int climbStairs(int n) {
    // Base cases
    if (n == 0) return 1;  // No steps left
    if (n == 1) return 1;  // Only one step left

    // Recursive case
    return climbStairs(n - 1) + climbStairs(n - 2);
}
```

</div>

**Why this is inefficient:** This solution has exponential time complexity O(2^n) because we're recomputing the same subproblems repeatedly. For example, to compute `climbStairs(5)`, we compute `climbStairs(3)` multiple times. The recursion tree grows exponentially with `n`, making this approach impractical for even moderately large values (like n=45).

## Optimal Solution

We can optimize using dynamic programming with memoization (top-down) or tabulation (bottom-up). The bottom-up approach is most efficient since it avoids recursion overhead and uses minimal space.

### Dynamic Programming (Bottom-up)

We build a table where `dp[i]` represents the number of ways to reach step `i`. We only need the last two values, so we can optimize space to O(1).

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def climbStairs(n):
    # Handle base cases
    if n <= 2:
        return n

    # We only need to keep track of the last two values
    # prev2 represents ways to reach step i-2
    # prev1 represents ways to reach step i-1
    prev2, prev1 = 1, 2  # For n=1 and n=2

    # Build up from step 3 to n
    for i in range(3, n + 1):
        # Current ways = sum of ways to reach previous two steps
        current = prev1 + prev2

        # Shift values for next iteration
        prev2, prev1 = prev1, current

    # prev1 now holds the result for n steps
    return prev1
```

```javascript
// Time: O(n) | Space: O(1)
function climbStairs(n) {
  // Handle base cases
  if (n <= 2) return n;

  // Initialize for n=1 and n=2
  let prev2 = 1; // ways for n=1
  let prev1 = 2; // ways for n=2

  // Build up from step 3 to n
  for (let i = 3; i <= n; i++) {
    // Current = sum of previous two
    const current = prev1 + prev2;

    // Shift values for next iteration
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

```java
// Time: O(n) | Space: O(1)
public int climbStairs(int n) {
    // Handle base cases
    if (n <= 2) return n;

    // Initialize for n=1 and n=2
    int prev2 = 1;  // ways for n=1
    int prev1 = 2;  // ways for n=2

    // Build up from step 3 to n
    for (int i = 3; i <= n; i++) {
        // Current = sum of previous two
        int current = prev1 + prev2;

        // Shift values for next iteration
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}
```

</div>

### Alternative: Full DP Table (Easier to Understand)

Here's the more intuitive DP solution that uses an array, which is easier to understand and explain:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def climbStairs(n):
    # Create DP array where dp[i] = ways to reach step i
    dp = [0] * (n + 1)

    # Base cases
    dp[0] = 1  # 1 way to be at step 0 (start)
    dp[1] = 1  # 1 way to reach step 1

    # Fill DP table
    for i in range(2, n + 1):
        # To reach step i, we can come from step i-1 (taking 1 step)
        # or from step i-2 (taking 2 steps)
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
```

```javascript
// Time: O(n) | Space: O(n)
function climbStairs(n) {
  // Create DP array
  const dp = new Array(n + 1).fill(0);

  // Base cases
  dp[0] = 1; // 1 way to be at step 0
  dp[1] = 1; // 1 way to reach step 1

  // Fill DP table
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
```

```java
// Time: O(n) | Space: O(n)
public int climbStairs(int n) {
    // Handle edge case
    if (n <= 1) return 1;

    // Create DP array
    int[] dp = new int[n + 1];

    // Base cases
    dp[0] = 1;  // 1 way to be at step 0
    dp[1] = 1;  // 1 way to reach step 1

    // Fill DP table
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate from step 2 to step `n` exactly once
- Each iteration performs constant-time operations (addition and assignment)
- The loop runs `n-1` times, which is O(n)

**Space Complexity: O(1)** for the optimized version, **O(n)** for the DP table version

- Optimized version: We only store 2 variables (`prev1` and `prev2`), so constant space
- DP table version: We store an array of size `n+1`, so linear space

## Common Mistakes

1. **Off-by-one errors with base cases**: Some candidates start with `dp[1] = 1` and `dp[2] = 2`, but forget that `dp[0] = 1` is needed for the recurrence to work correctly. Always test with small values (n=0,1,2,3).

2. **Incorrect recurrence relation**: Some try `dp[i] = dp[i-1] + dp[i-2] + 1` or other variations. Remember: to reach step `i`, you must come from either step `i-1` or `i-2`, so you inherit ALL the ways to reach those steps.

3. **Using recursion without memoization**: As shown in the brute force section, naive recursion leads to exponential time. Always mention that you'd need memoization to make recursion efficient.

4. **Confusing the problem with permutations**: This is not about permutations of 1s and 2s. The order matters (1+2 is different from 2+1), but we're counting all valid sequences, not just combinations.

## When You'll See This Pattern

This Fibonacci-style recurrence appears in many dynamic programming problems:

1. **Min Cost Climbing Stairs (LeetCode 746)**: Same staircase structure, but now each step has a cost. You need to find the minimum cost to reach the top, using the same "1 or 2 steps" movement.

2. **Fibonacci Number (LeetCode 509)**: This is literally the same recurrence relation, just with different base cases.

3. **Decode Ways (LeetCode 91)**: More complex but uses similar thinking - at each position, you can decode 1 digit or 2 digits, leading to a similar recurrence.

4. **House Robber (LeetCode 198)**: While not identical, it uses the same "take or skip" decision pattern that builds on previous results.

## Key Takeaways

1. **Recognize overlapping subproblems**: If a problem can be broken down into smaller versions of itself where solutions are reused, dynamic programming is likely applicable.

2. **Fibonacci pattern**: Any problem where you make decisions in increments of 1 or 2 (or small constant numbers) often reduces to a Fibonacci-like recurrence.

3. **Space optimization**: When your recurrence only depends on a constant number of previous states, you can reduce space from O(n) to O(1) by only keeping those states.

Related problems: [Min Cost Climbing Stairs](/problem/min-cost-climbing-stairs), [Fibonacci Number](/problem/fibonacci-number), [N-th Tribonacci Number](/problem/n-th-tribonacci-number)
