---
title: "How to Solve Water and Jug Problem — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Water and Jug Problem. Medium difficulty, 45.0% acceptance rate. Topics: Math, Depth-First Search, Breadth-First Search."
date: "2026-10-11"
category: "dsa-patterns"
tags: ["water-and-jug-problem", "math", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Water and Jug Problem

You have two jugs with capacities `x` and `y` liters, and you need to determine if you can measure exactly `target` liters using only three operations: filling a jug completely, emptying a jug completely, or pouring water from one jug to the other until one is empty or the other is full. What makes this problem interesting is that it appears to be a search problem but actually has a clean mathematical solution involving number theory.

## Visual Walkthrough

Let's trace through an example: `x = 3`, `y = 5`, `target = 4`.

We start with both jugs empty: `(0, 0)`

1. Fill the 5-liter jug: `(0, 5)`
2. Pour from 5-liter to 3-liter jug: `(3, 2)` (3 liters in first jug, 2 liters in second)
3. Empty the 3-liter jug: `(0, 2)`
4. Pour from 5-liter to 3-liter jug: `(2, 0)` (2 liters from second jug to first)
5. Fill the 5-liter jug: `(2, 5)`
6. Pour from 5-liter to 3-liter jug: `(3, 4)` (first jug already has 2 liters, so we add 1 more to fill it)

We've reached 4 liters in the second jug! This shows it's possible. Notice that we never directly measured 4 liters - we achieved it through a sequence of operations. The key insight is that we can only measure amounts that are multiples of the greatest common divisor (GCD) of the jug capacities.

## Brute Force Approach

A naive approach would be to treat this as a state space search problem. Each state is a pair `(a, b)` where `a` is the amount in the first jug (0 ≤ a ≤ x) and `b` is the amount in the second jug (0 ≤ b ≤ y). From any state, we can transition to:

1. Fill first jug: `(x, b)`
2. Fill second jug: `(a, y)`
3. Empty first jug: `(0, b)`
4. Empty second jug: `(a, 0)`
5. Pour from first to second: `(max(0, a - (y - b)), min(y, b + a))`
6. Pour from second to first: `(min(x, a + b), max(0, b - (x - a)))`

We could use BFS or DFS to explore all reachable states until we find a state where `a + b == target` or determine it's impossible. However, this approach has `O(x*y)` possible states, which becomes impractical for large capacities (up to 10^6 in constraints).

## Optimized Approach

The mathematical insight comes from Bézout's identity: for any integers `x` and `y`, there exist integers `a` and `b` such that `a*x + b*y = gcd(x, y)`. In our jug problem:

1. The total water is always changed in increments of `x` or `y` liters (when filling or emptying)
2. When pouring between jugs, the total amount stays the same
3. Therefore, any achievable amount must be expressible as `a*x + b*y` where `a` and `b` are integers
4. By Bézout's identity, the smallest positive amount we can measure is `gcd(x, y)`
5. Thus, we can measure `target` if and only if:
   - `target ≤ x + y` (we can't exceed total capacity)
   - `target` is divisible by `gcd(x, y)`
   - Special case: if `target == 0`, it's always possible (both jugs empty)

This reduces the problem to checking these simple conditions!

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(min(x, y))) for GCD calculation
# Space: O(1)
def canMeasureWater(self, x: int, y: int, target: int) -> bool:
    # Edge case: if target is 0, we can always achieve it by having both jugs empty
    if target == 0:
        return True

    # If target exceeds the combined capacity of both jugs, it's impossible
    # We can never have more water than x + y liters total
    if target > x + y:
        return False

    # The key insight: we can only measure amounts that are multiples
    # of the greatest common divisor (GCD) of x and y
    # This comes from number theory (Bézout's identity)
    def gcd(a: int, b: int) -> int:
        # Euclidean algorithm to find GCD
        # Keep dividing until remainder is 0
        while b != 0:
            a, b = b, a % b
        return a

    # Calculate GCD of x and y
    g = gcd(x, y)

    # Check if target is divisible by the GCD
    # If target % g == 0, then target can be expressed as a*x + b*y
    # for some integers a and b (which correspond to our operations)
    return target % g == 0
```

```javascript
// Time: O(log(min(x, y))) for GCD calculation
// Space: O(1)
function canMeasureWater(x, y, target) {
  // Edge case: if target is 0, we can always achieve it by having both jugs empty
  if (target === 0) {
    return true;
  }

  // If target exceeds the combined capacity of both jugs, it's impossible
  // We can never have more water than x + y liters total
  if (target > x + y) {
    return false;
  }

  // Helper function to calculate GCD using Euclidean algorithm
  function gcd(a, b) {
    // Euclidean algorithm: GCD(a, b) = GCD(b, a % b)
    // Continue until remainder is 0
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Calculate GCD of x and y
  const g = gcd(x, y);

  // Check if target is divisible by the GCD
  // If target % g === 0, then target can be expressed as a*x + b*y
  // for some integers a and b (which correspond to our operations)
  return target % g === 0;
}
```

```java
// Time: O(log(min(x, y))) for GCD calculation
// Space: O(1)
class Solution {
    public boolean canMeasureWater(int x, int y, int target) {
        // Edge case: if target is 0, we can always achieve it by having both jugs empty
        if (target == 0) {
            return true;
        }

        // If target exceeds the combined capacity of both jugs, it's impossible
        // We can never have more water than x + y liters total
        if (target > x + y) {
            return false;
        }

        // Calculate GCD of x and y using Euclidean algorithm
        int g = gcd(x, y);

        // Check if target is divisible by the GCD
        // If target % g == 0, then target can be expressed as a*x + b*y
        // for some integers a and b (which correspond to our operations)
        return target % g == 0;
    }

    // Helper method to calculate GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        // Euclidean algorithm: GCD(a, b) = GCD(b, a % b)
        // Continue until remainder is 0
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(min(x, y)))  
The Euclidean algorithm for calculating GCD has time complexity proportional to the number of digits in the smaller number. In the worst case (consecutive Fibonacci numbers), it takes O(log(min(x, y))) steps.

**Space Complexity:** O(1)  
We only use a constant amount of extra space for variables, regardless of input size. The Euclidean algorithm is implemented iteratively, so no recursion stack is needed.

## Common Mistakes

1. **Forgetting the capacity constraint:** Candidates often check only if `target % gcd(x, y) == 0` but forget that `target` must be ≤ `x + y`. You can't measure more water than the total capacity of both jugs.

2. **Incorrect GCD calculation:** Some candidates try to implement GCD recursively without considering stack overflow for large inputs, or they implement it incorrectly. The iterative Euclidean algorithm shown above is safe and efficient.

3. **Not handling the zero case:** When `target = 0`, the answer should always be `true` (both jugs empty), but some implementations might return `false` if they don't handle this edge case before the GCD check.

4. **Overcomplicating with BFS/DFS:** Many candidates immediately jump to a search solution without recognizing the mathematical pattern. While BFS/DFS would technically work, it's inefficient and misses the elegant number theory insight.

## When You'll See This Pattern

This problem teaches the pattern of reducing a seemingly complex search problem to a number theory problem using GCD:

1. **Minimum Moves to Reach Target with a Die (LeetCode 1191):** Similar GCD-based reasoning for determining reachable values.
2. **Check If It Is a Good Array (LeetCode 1250):** Direct application of Bézout's identity - an array is "good" if the GCD of all elements is 1.
3. **Fraction Addition and Subtraction (LeetCode 592):** Uses GCD for reducing fractions to simplest form.

The key insight is recognizing when operations are linear combinations of values (like `a*x + b*y`) and that the set of achievable values forms a lattice with spacing equal to the GCD.

## Key Takeaways

1. **When you see operations that add/subtract fixed amounts**, consider whether the problem reduces to checking divisibility by GCD. The Water Jug problem is essentially about what multiples of GCD can be formed.

2. **Bézout's identity is powerful**: For integers `x` and `y`, the set `{a*x + b*y | a,b ∈ Z}` equals the set of multiples of `gcd(x, y)`. This transforms search problems into simple divisibility checks.

3. **Always check constraints first**: Before diving into complex algorithms, check if simple mathematical conditions (like `target ≤ x + y`) can quickly eliminate impossible cases.

[Practice this problem on CodeJeet](/problem/water-and-jug-problem)
