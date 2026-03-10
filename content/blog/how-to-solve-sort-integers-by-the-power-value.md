---
title: "How to Solve Sort Integers by The Power Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort Integers by The Power Value. Medium difficulty, 71.6% acceptance rate. Topics: Dynamic Programming, Memoization, Sorting."
date: "2027-02-10"
category: "dsa-patterns"
tags:
  ["sort-integers-by-the-power-value", "dynamic-programming", "memoization", "sorting", "medium"]
---

# How to Solve Sort Integers by The Power Value

This problem asks us to find the k-th integer (1-indexed) when sorting numbers in a range [lo, hi] by their "power value" — the number of steps required to reduce a number to 1 using the Collatz sequence rules (even numbers divide by 2, odd numbers multiply by 3 and add 1). The challenge lies in efficiently computing these power values, as the Collatz sequence can be surprisingly long even for moderate numbers, and we need to compute them for every number in a potentially large range.

## Visual Walkthrough

Let's trace through a small example: `lo = 12, hi = 15, k = 2`

First, we need to compute the power value for each number:

**Number 12**:  
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1  
That's 9 steps (12→6 is step 1, 6→3 is step 2, ..., 2→1 is step 9)

**Number 13**:  
13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1  
That's 9 steps

**Number 14**:  
14 → 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1  
That's 17 steps

**Number 15**:  
15 → 46 → 23 → 70 → 35 → 106 → 53 → 160 → 80 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1  
That's 17 steps

Now we have:  
12: power 9  
13: power 9  
14: power 17  
15: power 17

When sorted by power value (and by the number itself for ties):

1. 12 (power 9)
2. 13 (power 9) ← k=2 gives us this
3. 14 (power 17)
4. 15 (power 17)

So the answer is 13.

## Brute Force Approach

The most straightforward approach is:

1. For each number in [lo, hi], compute its power value by following the Collatz rules until reaching 1
2. Store (number, power) pairs
3. Sort by power value (and by number for ties)
4. Return the k-th element

The problem with this approach is efficiency. Computing power values from scratch for each number is wasteful because:

- Many numbers share subsequences (e.g., 12 and 13 both go through 10→5→16→8→4→2→1)
- The Collatz sequence can be surprisingly long (e.g., 27 takes 111 steps)
- We're recomputing the same subsequences over and over

For the worst-case range size (1000 numbers) and worst-case numbers (which can have sequences hundreds of steps long), this could approach O(n²) time complexity, which is too slow.

## Optimized Approach

The key insight is that we can use **memoization** (a form of dynamic programming) to avoid recomputing power values. When computing the power for a number `n`:

- If we've already computed it before, return the cached value
- Otherwise, compute it recursively:  
  `power(n) = 1 + power(next)` where `next = n/2` if n is even, `3*n+1` if n is odd
- Cache the result before returning

This turns what could be exponential recomputation into linear time for each number in the range.

We also need to handle sorting efficiently. Since the range size is at most 1000, we can:

1. Compute power for all numbers using memoization
2. Sort the (number, power) pairs
3. Return the k-th number

The memoization ensures that even if sequences are long, we compute each step at most once.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n = hi - lo + 1 (due to sorting)
# Space: O(n) for memoization cache and result array
class Solution:
    def getKth(self, lo: int, hi: int, k: int) -> int:
        # Memoization cache: maps number -> its power value
        memo = {}

        def compute_power(x: int) -> int:
            """Recursively compute power value for x with memoization."""
            # Base case: 1 has power 0 (no steps needed)
            if x == 1:
                return 0

            # Return cached result if available
            if x in memo:
                return memo[x]

            # Compute next value based on Collatz rules
            if x % 2 == 0:
                next_x = x // 2
            else:
                next_x = 3 * x + 1

            # Power of x is 1 + power of next value
            result = 1 + compute_power(next_x)

            # Cache the result before returning
            memo[x] = result
            return result

        # List to store (power, number) pairs for sorting
        numbers_with_power = []

        # Compute power for each number in the range
        for num in range(lo, hi + 1):
            power = compute_power(num)
            # Store as (power, num) so sorting works correctly
            numbers_with_power.append((power, num))

        # Sort by power (first element), then by number (second element) for ties
        numbers_with_power.sort()

        # Return the k-th number (1-indexed, so subtract 1)
        return numbers_with_power[k - 1][1]
```

```javascript
// Time: O(n log n) where n = hi - lo + 1 (due to sorting)
// Space: O(n) for memoization cache and result array
/**
 * @param {number} lo
 * @param {number} hi
 * @param {number} k
 * @return {number}
 */
var getKth = function (lo, hi, k) {
  // Memoization cache: maps number -> its power value
  const memo = new Map();

  /**
   * Recursively compute power value for x with memoization
   * @param {number} x - The number to compute power for
   * @return {number} - The power value
   */
  function computePower(x) {
    // Base case: 1 has power 0 (no steps needed)
    if (x === 1) {
      return 0;
    }

    // Return cached result if available
    if (memo.has(x)) {
      return memo.get(x);
    }

    // Compute next value based on Collatz rules
    let nextX;
    if (x % 2 === 0) {
      nextX = x / 2;
    } else {
      nextX = 3 * x + 1;
    }

    // Power of x is 1 + power of next value
    const result = 1 + computePower(nextX);

    // Cache the result before returning
    memo.set(x, result);
    return result;
  }

  // Array to store objects with number and power for sorting
  const numbersWithPower = [];

  // Compute power for each number in the range
  for (let num = lo; num <= hi; num++) {
    const power = computePower(num);
    numbersWithPower.push({ num, power });
  }

  // Sort by power, then by number for ties
  numbersWithPower.sort((a, b) => {
    if (a.power !== b.power) {
      return a.power - b.power;
    }
    return a.num - b.num;
  });

  // Return the k-th number (1-indexed, so subtract 1)
  return numbersWithPower[k - 1].num;
};
```

```java
// Time: O(n log n) where n = hi - lo + 1 (due to sorting)
// Space: O(n) for memoization cache and result array
class Solution {
    // Memoization cache: maps number -> its power value
    private HashMap<Integer, Integer> memo = new HashMap<>();

    public int getKth(int lo, int hi, int k) {
        // List to store number-power pairs
        List<int[]> numbersWithPower = new ArrayList<>();

        // Compute power for each number in the range
        for (int num = lo; num <= hi; num++) {
            int power = computePower(num);
            numbersWithPower.add(new int[]{num, power});
        }

        // Sort by power, then by number for ties
        Collections.sort(numbersWithPower, (a, b) -> {
            if (a[1] != b[1]) {
                return a[1] - b[1];
            }
            return a[0] - b[0];
        });

        // Return the k-th number (1-indexed, so subtract 1)
        return numbersWithPower.get(k - 1)[0];
    }

    /**
     * Recursively compute power value for x with memoization
     * @param x - The number to compute power for
     * @return The power value
     */
    private int computePower(int x) {
        // Base case: 1 has power 0 (no steps needed)
        if (x == 1) {
            return 0;
        }

        // Return cached result if available
        if (memo.containsKey(x)) {
            return memo.get(x);
        }

        // Compute next value based on Collatz rules
        int nextX;
        if (x % 2 == 0) {
            nextX = x / 2;
        } else {
            nextX = 3 * x + 1;
        }

        // Power of x is 1 + power of next value
        int result = 1 + computePower(nextX);

        // Cache the result before returning
        memo.put(x, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)** where n = hi - lo + 1

- Computing power for each number: O(n) with memoization (each number's power is computed once)
- Sorting n elements: O(n log n)
- The O(n log n) sorting dominates, making the overall complexity O(n log n)

**Space Complexity: O(n)**

- Memoization cache: O(n) in worst case (stores power for all numbers in range and intermediate values)
- Array/list to store (number, power) pairs: O(n)
- Recursion stack: O(log m) where m is the maximum sequence length, but this is negligible compared to O(n)

## Common Mistakes

1. **Forgetting to handle the base case correctly**: The power of 1 is 0 (no steps needed), not 1. This off-by-one error propagates through all computations.

2. **Not using memoization**: Computing power values from scratch for each number leads to exponential recomputation. Even with a range of just 1000 numbers, this can be extremely slow.

3. **Incorrect tie-breaking**: When two numbers have the same power value, we must sort by the number itself in ascending order. Forgetting this leads to wrong answers on test cases with ties.

4. **1-indexed vs 0-indexed confusion**: The problem states k is 1-indexed, so we need to access element k-1 after sorting. Using k directly is a common off-by-one error.

5. **Integer overflow**: For odd numbers, computing 3\*x+1 can overflow 32-bit integers for large x. However, the problem constraints (x ≤ 1000) prevent this, but it's good practice to use long integers in languages with fixed-width integers.

## When You'll See This Pattern

This problem combines **memoization** (top-down dynamic programming) with **custom sorting** — two patterns that appear frequently in coding interviews:

1. **Memoization/Dynamic Programming**: Problems where you compute values that depend on previously computed values, especially when there's overlapping subproblems.
   - Similar problems:
     - **Climbing Stairs** (computing ways to reach step n)
     - **Fibonacci Number** (computing F(n) = F(n-1) + F(n-2))
     - **Minimum Path Sum** (finding minimum path in a grid)

2. **Custom Sorting with Multiple Criteria**: Problems where you need to sort objects based on multiple attributes with specific tie-breaking rules.
   - Similar problems:
     - **Sort Characters By Frequency** (sort by frequency, then alphabetically)
     - **Reorder Data in Log Files** (complex sorting rules for log entries)
     - **Largest Number** (custom comparator for string concatenation)

## Key Takeaways

1. **Memoization turns exponential problems into linear ones**: When you see a computation that involves recursively computing values that will be needed multiple times, memoization is often the key to optimization.

2. **Understand the problem constraints**: The range size (1000) tells us O(n²) is acceptable but O(2ⁿ) is not. This guides our choice of algorithm.

3. **Pay attention to sorting requirements**: Many problems require sorting by primary criteria with secondary tie-breakers. Always check if ties need special handling.

4. **The Collatz sequence is unpredictable**: Even though it's a simple mathematical rule, the sequence length doesn't correlate simply with the starting number's size. This unpredictability is why memoization is essential.

Related problems: [Find Score of an Array After Marking All Elements](/problem/find-score-of-an-array-after-marking-all-elements)
