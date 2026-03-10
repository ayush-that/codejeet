---
title: "How to Solve N-th Tribonacci Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode N-th Tribonacci Number. Easy difficulty, 63.3% acceptance rate. Topics: Math, Dynamic Programming, Memoization."
date: "2026-10-02"
category: "dsa-patterns"
tags: ["n-th-tribonacci-number", "math", "dynamic-programming", "memoization", "easy"]
---

# How to Solve N-th Tribonacci Number

The Tribonacci sequence is a variation of the Fibonacci sequence where each term is the sum of the _three_ preceding terms, rather than two. Given `n`, we need to compute the n-th Tribonacci number. While conceptually simple, this problem tests your ability to implement efficient dynamic programming solutions and handle edge cases properly. The main challenge lies in avoiding exponential time complexity through proper memoization or iterative approaches.

## Visual Walkthrough

Let's trace through the calculation of `T(4)` step by step to build intuition.

We know the base cases:

- `T(0) = 0`
- `T(1) = 1`
- `T(2) = 1`

Now for `T(3)`:

- `T(3) = T(0) + T(1) + T(2) = 0 + 1 + 1 = 2`

For `T(4)`:

- `T(4) = T(1) + T(2) + T(3) = 1 + 1 + 2 = 4`

For `T(5)`:

- `T(5) = T(2) + T(3) + T(4) = 1 + 2 + 4 = 7`

We can visualize this as a sliding window of three numbers that moves forward:

```
n:   0  1  2  3  4  5
T:   0  1  1  2  4  7
     ↑  ↑  ↑
     a  b  c  → sum = 2
        ↑  ↑  ↑
        a  b  c  → sum = 4
           ↑  ↑  ↑
           a  b  c  → sum = 7
```

This sliding window approach gives us an efficient O(n) solution with O(1) space.

## Brute Force Approach

The most straightforward approach is a recursive solution that directly implements the recurrence relation:

```
T(n) = 0 if n == 0
T(n) = 1 if n == 1 or n == 2
T(n) = T(n-1) + T(n-2) + T(n-3) otherwise
```

While this is mathematically correct, it suffers from exponential time complexity (O(3^n)) because we're recomputing the same subproblems repeatedly. For example, to compute `T(5)`, we need `T(4)`, `T(3)`, and `T(2)`. But `T(4)` itself needs `T(3)`, `T(2)`, and `T(1)`, so `T(3)` gets computed multiple times.

This exponential growth makes the brute force approach impractical for even moderately large values of `n` (like `n = 35` would take seconds, and `n = 50` could take hours).

## Optimal Solution

The optimal solution uses dynamic programming with either memoization (top-down) or tabulation (bottom-up). The tabulation approach is particularly elegant because we only need to keep track of the last three values, giving us O(n) time and O(1) space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def tribonacci(n: int) -> int:
    """
    Calculate the n-th Tribonacci number using an iterative approach.

    Args:
        n: The index of the Tribonacci number to compute

    Returns:
        The n-th Tribonacci number
    """
    # Base cases: T(0) = 0, T(1) = 1, T(2) = 1
    if n == 0:
        return 0
    if n <= 2:
        return 1

    # Initialize the first three Tribonacci numbers
    a, b, c = 0, 1, 1  # T(0), T(1), T(2)

    # Iterate from 3 to n, updating the three values
    for i in range(3, n + 1):
        # Calculate the next Tribonacci number
        next_val = a + b + c

        # Slide the window forward: a becomes b, b becomes c, c becomes next_val
        a, b, c = b, c, next_val

    # After the loop, c contains T(n)
    return c
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the n-th Tribonacci number using an iterative approach.
 * @param {number} n - The index of the Tribonacci number to compute
 * @return {number} The n-th Tribonacci number
 */
function tribonacci(n) {
  // Base cases: T(0) = 0, T(1) = 1, T(2) = 1
  if (n === 0) return 0;
  if (n <= 2) return 1;

  // Initialize the first three Tribonacci numbers
  let a = 0,
    b = 1,
    c = 1; // T(0), T(1), T(2)

  // Iterate from 3 to n, updating the three values
  for (let i = 3; i <= n; i++) {
    // Calculate the next Tribonacci number
    const nextVal = a + b + c;

    // Slide the window forward: a becomes b, b becomes c, c becomes nextVal
    a = b;
    b = c;
    c = nextVal;
  }

  // After the loop, c contains T(n)
  return c;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate the n-th Tribonacci number using an iterative approach.
     * @param n The index of the Tribonacci number to compute
     * @return The n-th Tribonacci number
     */
    public int tribonacci(int n) {
        // Base cases: T(0) = 0, T(1) = 1, T(2) = 1
        if (n == 0) return 0;
        if (n <= 2) return 1;

        // Initialize the first three Tribonacci numbers
        int a = 0, b = 1, c = 1;  // T(0), T(1), T(2)

        // Iterate from 3 to n, updating the three values
        for (int i = 3; i <= n; i++) {
            // Calculate the next Tribonacci number
            int nextVal = a + b + c;

            // Slide the window forward: a becomes b, b becomes c, c becomes nextVal
            a = b;
            b = c;
            c = nextVal;
        }

        // After the loop, c contains T(n)
        return c;
    }
}
```

</div>

**Alternative: Memoization Approach**

For completeness, here's a memoization (top-down) approach that's useful when you need to compute multiple Tribonacci numbers:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def tribonacci_memo(n: int) -> int:
    """
    Calculate the n-th Tribonacci number using memoization.

    Args:
        n: The index of the Tribonacci number to compute

    Returns:
        The n-th Tribonacci number
    """
    # Memoization dictionary to store computed values
    memo = {0: 0, 1: 1, 2: 1}

    def helper(k):
        # If we've already computed this value, return it
        if k in memo:
            return memo[k]

        # Otherwise, compute it recursively and store in memo
        memo[k] = helper(k-1) + helper(k-2) + helper(k-3)
        return memo[k]

    return helper(n)
```

```javascript
// Time: O(n) | Space: O(n)
function tribonacciMemo(n) {
  // Memoization object to store computed values
  const memo = { 0: 0, 1: 1, 2: 1 };

  function helper(k) {
    // If we've already computed this value, return it
    if (memo[k] !== undefined) {
      return memo[k];
    }

    // Otherwise, compute it recursively and store in memo
    memo[k] = helper(k - 1) + helper(k - 2) + helper(k - 3);
    return memo[k];
  }

  return helper(n);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class SolutionMemo {
    private Map<Integer, Integer> memo = new HashMap<>();

    public int tribonacci(int n) {
        // Initialize base cases in memo
        memo.put(0, 0);
        memo.put(1, 1);
        memo.put(2, 1);

        return helper(n);
    }

    private int helper(int k) {
        // If we've already computed this value, return it
        if (memo.containsKey(k)) {
            return memo.get(k);
        }

        // Otherwise, compute it recursively and store in memo
        int result = helper(k-1) + helper(k-2) + helper(k-3);
        memo.put(k, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Iterative Solution:**

- **Time Complexity:** O(n) - We perform a constant amount of work for each value from 3 to n.
- **Space Complexity:** O(1) - We only store three variables regardless of input size.

**Memoization Solution:**

- **Time Complexity:** O(n) - Each Tribonacci number is computed exactly once and stored for future use.
- **Space Complexity:** O(n) - We need to store all computed values in the memoization cache, plus O(n) for the recursion stack in the worst case.

The iterative solution is generally preferred because it uses constant space and avoids recursion overhead. However, the memoization approach is valuable to understand as it's a fundamental dynamic programming technique.

## Common Mistakes

1. **Forgetting base cases for n = 0, 1, 2:** Many candidates jump straight to the loop without handling these special cases, leading to incorrect results or index errors.

2. **Off-by-one errors in loop boundaries:** Starting the loop at the wrong index (like 2 instead of 3) or using the wrong comparison (like `i < n` instead of `i <= n`) will give incorrect results.

3. **Using exponential recursion without memoization:** Implementing the naive recursive solution will work for small `n` but will timeout for larger values. Always mention this as a stepping stone to the optimal solution.

4. **Incorrect variable updating in the sliding window:** When updating `a, b, c`, the order matters. Doing `c = next_val` before `a = b` will give wrong results because you lose the original value of `b`.

## When You'll See This Pattern

This problem exemplifies **dynamic programming with state compression**, where we only need to keep a fixed number of previous states (in this case, 3) to compute the next state. You'll see this pattern in:

1. **Fibonacci Number (LeetCode 509)** - The classic version with only 2 previous states instead of 3.
2. **Climbing Stairs (LeetCode 70)** - Essentially the Fibonacci sequence in disguise, where ways(n) = ways(n-1) + ways(n-2).
3. **House Robber (LeetCode 198)** - While more complex, it also involves making decisions based on previous states.
4. **Decode Ways (LeetCode 91)** - Another dynamic programming problem where the current state depends on one or two previous states.

## Key Takeaways

1. **Recognize overlapping subproblems:** When a problem can be broken down into smaller versions of itself (like T(n) depending on T(n-1), T(n-2), T(n-3)), dynamic programming is often the right approach.

2. **Optimize space with sliding window:** When you only need the last k previous states to compute the next state, you can use O(1) space instead of O(n) by maintaining a sliding window of those k values.

3. **Always handle base cases explicitly:** Don't assume your loop or recursion will handle the smallest cases correctly. Explicitly check for and return base case values.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Fibonacci Number](/problem/fibonacci-number)
