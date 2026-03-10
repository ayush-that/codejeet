---
title: "Math Questions at Accenture: What to Expect"
description: "Prepare for Math interview questions at Accenture — patterns, difficulty breakdown, and study tips."
date: "2028-01-13"
category: "dsa-patterns"
tags: ["accenture", "math", "interview prep"]
---

## Why Math Matters at Accenture

If you're preparing for an Accenture technical interview, you might be surprised by the emphasis on math. With 30 out of 144 total questions in their assessment process dedicated to it, math isn't a secondary topic—it's a core screening mechanism. This isn't about calculus or advanced linear algebra; it's about **computational thinking, numerical reasoning, and algorithmic efficiency with numbers**. In real interviews, especially for roles in data engineering, cloud architecture, and digital transformation, you'll face problems that test your ability to model real-world constraints (budgets, timelines, resource allocation) mathematically and translate them into clean code. They want engineers who don't just write functions, but who can quantify solutions.

## Specific Patterns Accenture Favors

Accenture's math problems tend to cluster around a few practical, business-relevant patterns. You won't find many abstract number theory puzzles here. Instead, expect:

1.  **Modular Arithmetic and Cycle Detection:** Problems involving sequences, repeating patterns, or operations on large numbers where direct computation is impossible. Think "find the last digit of a massive exponent" or "determine the state after N steps when operations repeat every K steps." This tests efficient computation under constraints.
2.  **Combinatorics and Counting Principles:** Not the complex "n choose k" proofs, but applied counting. For example, "count ways to climb stairs" (LeetCode #70 - Climbing Stairs) or "count unique paths in a grid" (LeetCode #62 - Unique Paths). These problems assess your ability to break down a process into countable states.
3.  **Basic Number Properties and Digit Manipulation:** Reversing digits, checking palindromes, summing digits of a number, or finding the greatest common divisor (GCD). These are foundational for data validation and transformation tasks common in enterprise systems.
4.  **Simulation of Mathematical Processes:** Less about deriving a formula and more about accurately simulating a defined numerical process. This checks your attention to detail and loop control.

They lean heavily on **iterative approaches and closed-form mathematical solutions** over recursive depth-first search (DFS) for math problems. The goal is often O(1) or O(log n) time complexity, not just a brute-force working answer.

## How to Prepare

Your preparation should focus on recognizing the underlying numerical pattern to avoid unnecessary computation. Let's look at the most common pattern: **Modular Arithmetic for Cycle Detection**.

Many Accenture-style problems present a process that repeats. A naive simulation might take O(n) time for huge `n`, but if the process repeats every `k` steps, you can compute the result in O(1) time using the modulo operator `%`.

**Problem Example:** "A system toggles between 3 states (A, B, C) every second. Determine the state after N seconds, where N can be up to 10^9."

The brute-force simulation is impossible for large N. The efficient solution finds the cycle length (3 states) and uses `N % 3`.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def find_state_after_n_seconds(N: int) -> str:
    # States cycle every 3 seconds
    states = ['A', 'B', 'C']
    # N % 3 gives the position in the cycle (0-based).
    # We subtract 1 because if N=1, we want index 0 (state A).
    # The modulo handles the wrap-around.
    index_in_cycle = (N - 1) % 3
    return states[index_in_cycle]

# Example: N = 10^9
# (1000000000 - 1) % 3 = 999999999 % 3 = 0
# Returns 'A'
```

```javascript
// Time: O(1) | Space: O(1)
function findStateAfterNSeconds(N) {
  const states = ["A", "B", "C"];
  // Handle the 1-based step counting.
  const indexInCycle = (N - 1) % 3;
  return states[indexInCycle];
}
```

```java
// Time: O(1) | Space: O(1)
public class StateFinder {
    public static String findStateAfterNSeconds(int N) {
        String[] states = {"A", "B", "C"};
        // Use modulo to find position in the repeating cycle.
        int indexInCycle = (N - 1) % 3;
        return states[indexInCycle];
    }
}
```

</div>

Another key pattern is **Dynamic Programming for Counting Problems**. Take LeetCode #70 - Climbing Stairs. The recursive solution is exponential time. The iterative DP solution is linear time and constant space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    # dp[i] = ways to reach step i.
    # We only need the last two values.
    prev, curr = 1, 2  # ways for step 1 and step 2
    for i in range(3, n + 1):
        # To reach step i, you come from step i-1 or i-2.
        prev, curr = curr, prev + curr
    return curr
```

```javascript
// Time: O(n) | Space: O(1)
function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1,
    curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
```

```java
// Time: O(n) | Space: O(1)
public class ClimbingStairs {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev = 1, curr = 2;
        for (int i = 3; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }
}
```

</div>

## How Accenture Tests Math vs Other Companies

Compared to FAANG companies, Accenture's math questions are less about clever "aha!" moments and more about **applied, business-logic mathematics**. At Google, a math problem might involve a novel insight about prime numbers or an optimization requiring deep number theory. At Accenture, the math is a tool to solve a clear, constrained system problem.

The difficulty is often **medium, but with a twist of scale or edge-case handling**. They might give you a problem that seems straightforward (like simulating a process) but with an input size (`n = 10^18`) that forces you to find the mathematical shortcut. The unique aspect is this **bridge between brute-force logic and mathematical optimization**—they want to see if you can identify when a simulation is insufficient and pivot to a formula-based solution.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Arithmetic and Number Properties:** Start with digit manipulation (reverse integer, palindrome number) and the modulo operator. This is the absolute bedrock.
2.  **Sequences and Series:** Practice problems involving arithmetic or geometric progressions. This trains you to look for formulas instead of loops.
3.  **Simple Combinatorics (Counting):** Learn the "climbing stairs" and "unique paths" patterns. This introduces you to the fundamental DP thought process for counting.
4.  **Modular Arithmetic and Cycle Detection:** Now combine your modulo skills with sequence problems. This is where you solve the large-scale simulation problems efficiently.
5.  **Greatest Common Divisor (GCD) / Least Common Multiple (LCM):** These concepts appear in problems about scheduling, repeating events, or dividing resources evenly.
6.  **Prime Numbers (Basic):** Focus on efficient checking (up to sqrt(n)) and generation (Sieve of Eratosthenes). This is often enough for Accenture's scope.

This order works because each topic uses skills from the previous one. You can't optimize a cycle detection problem without being comfortable with modulo arithmetic, which itself relies on basic integer operations.

## Recommended Practice Order

Solve these specific problems in sequence to build competency:

1.  **LeetCode #7 - Reverse Integer:** Master digit extraction and bounds checking.
2.  **LeetCode #9 - Palindrome Number:** Apply digit manipulation without converting to a string.
3.  **LeetCode #70 - Climbing Stairs:** Your first introduction to DP for counting. Write both recursive (with memo) and iterative solutions.
4.  **LeetCode #62 - Unique Paths:** Expand the counting DP concept to two dimensions.
5.  **LeetCode #268 - Missing Number:** Practice using the mathematical sum formula vs. a hash set.
6.  **LeetCode #507 - Perfect Number:** Good practice for efficient divisor enumeration (up to sqrt(n)).
7.  **LeetCode #367 - Valid Perfect Square:** Practice binary search on a numerical property.
8.  **Custom Problem:** "Find the last digit of a^b for very large b." This forces you to use modular exponentiation and cycle detection.
9.  **LeetCode #204 - Count Primes:** Implement the Sieve of Eratosthenes. Understand time/space trade-offs.

This sequence starts with fundamentals, introduces core patterns (DP counting), and then moves into efficiency concerns (primes, large exponents) that mirror Accenture's focus on scalable solutions.

[Practice Math at Accenture](/company/accenture/math)
