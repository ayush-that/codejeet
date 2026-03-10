---
title: "How to Solve Fibonacci Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Fibonacci Number. Easy difficulty, 73.9% acceptance rate. Topics: Math, Dynamic Programming, Recursion, Memoization."
date: "2026-04-02"
category: "dsa-patterns"
tags: ["fibonacci-number", "math", "dynamic-programming", "recursion", "easy"]
---

# How to Solve Fibonacci Number

The Fibonacci sequence is a classic programming problem that asks you to compute the nth Fibonacci number given its mathematical definition. While the problem seems straightforward, it's a perfect introduction to recursion, memoization, and dynamic programming — concepts that appear in countless interview problems. The tricky part isn't solving it, but solving it efficiently for larger values of n where naive approaches fail spectacularly.

## Visual Walkthrough

Let's trace through computing F(5) step by step using the recursive definition:

F(0) = 0  
F(1) = 1  
F(n) = F(n-1) + F(n-2) for n > 1

To compute F(5):

- F(5) = F(4) + F(3)
- F(4) = F(3) + F(2)
- F(3) = F(2) + F(1)
- F(2) = F(1) + F(0) = 1 + 0 = 1
- Now back up: F(3) = 1 + 1 = 2
- F(4) = 2 + 1 = 3
- F(5) = 3 + 2 = 5

Notice how we computed F(3) twice — once for F(5) and once for F(4). This redundancy grows exponentially as n increases, which is why we need smarter approaches.

## Brute Force Approach

The most intuitive solution is direct recursion based on the mathematical definition:

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for call stack
def fib_naive(n):
    # Base cases: F(0) = 0, F(1) = 1
    if n <= 1:
        return n

    # Recursive case: F(n) = F(n-1) + F(n-2)
    return fib_naive(n-1) + fib_naive(n-2)
```

```javascript
// Time: O(2^n) | Space: O(n) for call stack
function fibNaive(n) {
  // Base cases: F(0) = 0, F(1) = 1
  if (n <= 1) {
    return n;
  }

  // Recursive case: F(n) = F(n-1) + F(n-2)
  return fibNaive(n - 1) + fibNaive(n - 2);
}
```

```java
// Time: O(2^n) | Space: O(n) for call stack
public int fibNaive(int n) {
    // Base cases: F(0) = 0, F(1) = 1
    if (n <= 1) {
        return n;
    }

    // Recursive case: F(n) = F(n-1) + F(n-2)
    return fibNaive(n-1) + fibNaive(n-2);
}
```

</div>

**Why this fails:** The time complexity is O(2^n) because each call generates two more calls, creating an exponential explosion. For n=40, this requires over 1 billion operations! The problem is we're recomputing the same Fibonacci numbers repeatedly, as we saw in the visual walkthrough.

## Optimal Solution

We have three efficient approaches, each with different trade-offs:

### Approach 1: Dynamic Programming (Bottom-Up)

This is the most straightforward efficient solution. We build up from the base cases:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def fib_dp(n):
    # Handle base cases
    if n <= 1:
        return n

    # Create DP array to store Fibonacci numbers
    dp = [0] * (n + 1)

    # Initialize base cases
    dp[0] = 0
    dp[1] = 1

    # Build up the solution from smaller subproblems
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]

# Optimized version: O(1) space
# Time: O(n) | Space: O(1)
def fib_optimized(n):
    if n <= 1:
        return n

    # We only need to keep track of the last two numbers
    prev2 = 0  # F(i-2)
    prev1 = 1  # F(i-1)

    for i in range(2, n + 1):
        # Compute current Fibonacci number
        current = prev1 + prev2

        # Update for next iteration
        prev2 = prev1
        prev1 = current

    return prev1
```

```javascript
// Time: O(n) | Space: O(n)
function fibDP(n) {
  // Handle base cases
  if (n <= 1) {
    return n;
  }

  // Create DP array to store Fibonacci numbers
  const dp = new Array(n + 1);

  // Initialize base cases
  dp[0] = 0;
  dp[1] = 1;

  // Build up the solution from smaller subproblems
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Optimized version: O(1) space
// Time: O(n) | Space: O(1)
function fibOptimized(n) {
  if (n <= 1) {
    return n;
  }

  // We only need to keep track of the last two numbers
  let prev2 = 0; // F(i-2)
  let prev1 = 1; // F(i-1)

  for (let i = 2; i <= n; i++) {
    // Compute current Fibonacci number
    const current = prev1 + prev2;

    // Update for next iteration
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

```java
// Time: O(n) | Space: O(n)
public int fibDP(int n) {
    // Handle base cases
    if (n <= 1) {
        return n;
    }

    // Create DP array to store Fibonacci numbers
    int[] dp = new int[n + 1];

    // Initialize base cases
    dp[0] = 0;
    dp[1] = 1;

    // Build up the solution from smaller subproblems
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }

    return dp[n];
}

// Optimized version: O(1) space
// Time: O(n) | Space: O(1)
public int fibOptimized(int n) {
    if (n <= 1) {
        return n;
    }

    // We only need to keep track of the last two numbers
    int prev2 = 0;  // F(i-2)
    int prev1 = 1;  // F(i-1)

    for (int i = 2; i <= n; i++) {
        // Compute current Fibonacci number
        int current = prev1 + prev2;

        // Update for next iteration
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}
```

</div>

### Approach 2: Memoization (Top-Down with Caching)

This approach is recursive but avoids recomputation by caching results:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def fib_memo(n, memo=None):
    # Initialize memo dictionary on first call
    if memo is None:
        memo = {}

    # Check if we've already computed this value
    if n in memo:
        return memo[n]

    # Base cases
    if n <= 1:
        return n

    # Compute and store result before returning
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
```

```javascript
// Time: O(n) | Space: O(n)
function fibMemo(n, memo = {}) {
  // Check if we've already computed this value
  if (n in memo) {
    return memo[n];
  }

  // Base cases
  if (n <= 1) {
    return n;
  }

  // Compute and store result before returning
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;

public int fibMemo(int n) {
    HashMap<Integer, Integer> memo = new HashMap<>();
    return fibMemoHelper(n, memo);
}

private int fibMemoHelper(int n, HashMap<Integer, Integer> memo) {
    // Check if we've already computed this value
    if (memo.containsKey(n)) {
        return memo.get(n);
    }

    // Base cases
    if (n <= 1) {
        return n;
    }

    // Compute and store result before returning
    int result = fibMemoHelper(n-1, memo) + fibMemoHelper(n-2, memo);
    memo.put(n, result);
    return result;
}
```

</div>

## Complexity Analysis

**Brute Force Recursion:**

- **Time:** O(2^n) — Each call generates two more calls, creating a binary tree of calls
- **Space:** O(n) — Maximum depth of the recursion stack

**Dynamic Programming (Bottom-Up):**

- **Time:** O(n) — We compute each Fibonacci number exactly once
- **Space:** O(n) for the array version, O(1) for the optimized version

**Memoization (Top-Down):**

- **Time:** O(n) — Each Fibonacci number is computed once and cached
- **Space:** O(n) — For the memo dictionary and recursion stack

The optimized DP solution with O(1) space is usually preferred in interviews because it's simple, efficient, and demonstrates understanding of space optimization.

## Common Mistakes

1. **Forgetting base cases for n=0 and n=1:** Many candidates start the loop at i=2 without handling n=0 and n=1 separately, causing index errors or incorrect results.

2. **Off-by-one errors in loop ranges:** Writing `range(2, n)` instead of `range(2, n+1)` in Python, or `i < n` instead of `i <= n` in Java/JavaScript. Remember: we want to compute F(n), not F(n-1).

3. **Integer overflow for large n:** While not an issue in Python (which has arbitrary precision integers), in Java and JavaScript, Fibonacci numbers grow quickly and can overflow. For interview purposes, we usually assume n is small enough, but it's good to mention this limitation.

4. **Using recursion without memoization:** This is the most common mistake. Always mention that naive recursion is exponential and propose memoization or DP as improvements.

## When You'll See This Pattern

The Fibonacci pattern appears in many problems where the solution depends on solutions to smaller subproblems:

1. **Climbing Stairs (LeetCode 70):** Identical to Fibonacci — the number of ways to reach step n is the sum of ways to reach steps n-1 and n-2.

2. **Decode Ways (LeetCode 91):** Similar structure where dp[i] depends on dp[i-1] and dp[i-2] based on whether the last one or two digits form valid letters.

3. **House Robber (LeetCode 198):** While not exactly Fibonacci, it uses the same DP approach where the optimal solution at house i depends on solutions at houses i-1 and i-2.

4. **Min Cost Climbing Stairs (LeetCode 746):** Another variation where you find the minimum cost, but the recurrence relation has the same structure.

## Key Takeaways

1. **Recognize overlapping subproblems:** When a problem can be broken down into smaller versions of itself and those smaller problems are solved repeatedly, dynamic programming or memoization is likely the right approach.

2. **Start with the recurrence relation:** Always write down the mathematical relationship first (like F(n) = F(n-1) + F(n-2)), then implement it efficiently.

3. **Optimize space when possible:** The Fibonacci sequence teaches that you often don't need to store all intermediate results — just the last two are sufficient. This pattern appears in many DP problems.

The Fibonacci problem is more than just a math exercise; it's a gateway to understanding dynamic programming. Mastering it means you've taken the first step toward solving much more complex problems efficiently.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Split Array into Fibonacci Sequence](/problem/split-array-into-fibonacci-sequence), [Length of Longest Fibonacci Subsequence](/problem/length-of-longest-fibonacci-subsequence)
