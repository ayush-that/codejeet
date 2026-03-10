---
title: "How to Solve Find the Minimum Number of Fibonacci Numbers Whose Sum Is K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Minimum Number of Fibonacci Numbers Whose Sum Is K. Medium difficulty, 64.8% acceptance rate. Topics: Math, Greedy."
date: "2028-07-08"
category: "dsa-patterns"
tags: ["find-the-minimum-number-of-fibonacci-numbers-whose-sum-is-k", "math", "greedy", "medium"]
---

# How to Solve "Find the Minimum Number of Fibonacci Numbers Whose Sum Is K"

This problem asks us to find the smallest number of Fibonacci numbers needed to sum exactly to a given integer `k`, where we can use the same Fibonacci number multiple times. What makes this problem interesting is that while it seems like a complex optimization problem, it actually has a beautifully simple greedy solution. The key insight is that for any number `k`, we can always take the largest Fibonacci number ≤ `k`, subtract it from `k`, and repeat—and this greedy approach is guaranteed to give us the minimum count.

## Visual Walkthrough

Let's trace through an example with `k = 19` to build intuition:

**Step 1:** Generate Fibonacci numbers up to 19:

- F₁ = 1, F₂ = 1, F₃ = 2, F₄ = 3, F₅ = 5, F₆ = 8, F₇ = 13, F₈ = 21 (but 21 > 19, so we stop at 13)

**Step 2:** Start with k = 19:

- Largest Fibonacci ≤ 19 is 13
- Subtract: 19 - 13 = 6, count = 1

**Step 3:** Now k = 6:

- Largest Fibonacci ≤ 6 is 5
- Subtract: 6 - 5 = 1, count = 2

**Step 4:** Now k = 1:

- Largest Fibonacci ≤ 1 is 1
- Subtract: 1 - 1 = 0, count = 3

We've reached 0 using Fibonacci numbers [13, 5, 1] with count = 3. Let's verify this is minimal:

- Could we use fewer than 3 numbers? The next largest Fibonacci after 13 is 8, but 8 + 8 = 16 < 19, so we'd need at least one more number. 8 + 8 + 3 = 19 uses 3 numbers. 13 + 5 + 1 = 19 also uses 3 numbers. So 3 appears minimal.

This greedy approach—always taking the largest possible Fibonacci—works because of the mathematical property that every positive integer can be represented as a sum of distinct Fibonacci numbers (Zeckendorf's theorem), and this representation is essentially what our greedy algorithm produces.

## Brute Force Approach

A naive approach might try all combinations of Fibonacci numbers. We could:

1. Generate all Fibonacci numbers ≤ k
2. Try all subsets (or combinations with repetition) of these numbers
3. Check which subsets sum to k
4. Return the smallest subset size

However, this is extremely inefficient. With m Fibonacci numbers ≤ k, there are O(2^m) subsets to check. Since Fibonacci numbers grow exponentially, m ≈ log(φ)k ≈ 1.44 log₂k, making 2^m ≈ k^1.44, which is exponential in the input size.

Even dynamic programming (knapsack-style) would be O(k × m), which for k up to 10^9 (as per constraints) is completely infeasible. We need a more clever approach.

## Optimized Approach

The key insight comes from Zeckendorf's theorem: every positive integer can be uniquely represented as a sum of non-consecutive Fibonacci numbers, and this representation can be found greedily by repeatedly subtracting the largest Fibonacci number ≤ the current remainder.

Why does greedy work here? Consider:

1. **No two consecutive Fibonacci numbers are needed**: If we have Fᵢ and Fᵢ₊₁, we can replace them with Fᵢ₊₂ (since Fᵢ + Fᵢ₊₁ = Fᵢ₊₂), reducing the count.
2. **Taking the largest possible Fibonacci is optimal**: If we don't take the largest Fibonacci ≤ k, say we skip Fⱼ and take a smaller one, we'd need at least two Fibonacci numbers to make up for skipping Fⱼ (since the next Fibonacci is about 0.618 times smaller due to the golden ratio). This would increase our count.

The algorithm becomes:

1. Generate Fibonacci numbers up to k (or slightly beyond)
2. Starting from the largest, subtract from k while k > 0
3. Count how many subtractions we make

## Optimal Solution

<div class="code-group">

```python
# Time: O(log k) | Space: O(log k)
def findMinFibonacciNumbers(k: int) -> int:
    """
    Find minimum Fibonacci numbers needed to sum to k.
    Greedy approach: always subtract the largest Fibonacci ≤ current k.
    """
    # Step 1: Generate Fibonacci numbers up to k
    fib = [1, 1]  # Start with F1 = 1, F2 = 1
    # Generate until we exceed k
    while fib[-1] <= k:
        # Next Fibonacci is sum of last two
        next_fib = fib[-1] + fib[-2]
        fib.append(next_fib)

    # Step 2: Greedy subtraction from largest to smallest
    count = 0
    idx = len(fib) - 1  # Start from the largest Fibonacci

    while k > 0:
        # Skip Fibonacci numbers larger than current k
        # (since we might have generated one slightly larger than original k)
        while fib[idx] > k:
            idx -= 1

        # Subtract the largest Fibonacci ≤ k
        k -= fib[idx]
        count += 1

    return count
```

```javascript
// Time: O(log k) | Space: O(log k)
function findMinFibonacciNumbers(k) {
  /**
   * Find minimum Fibonacci numbers needed to sum to k.
   * Greedy approach: always subtract the largest Fibonacci ≤ current k.
   */
  // Step 1: Generate Fibonacci numbers up to k
  const fib = [1, 1]; // Start with F1 = 1, F2 = 1

  // Generate until we exceed k
  while (fib[fib.length - 1] <= k) {
    // Next Fibonacci is sum of last two
    const nextFib = fib[fib.length - 1] + fib[fib.length - 2];
    fib.push(nextFib);
  }

  // Step 2: Greedy subtraction from largest to smallest
  let count = 0;
  let idx = fib.length - 1; // Start from the largest Fibonacci

  while (k > 0) {
    // Skip Fibonacci numbers larger than current k
    // (since we might have generated one slightly larger than original k)
    while (fib[idx] > k) {
      idx--;
    }

    // Subtract the largest Fibonacci ≤ k
    k -= fib[idx];
    count++;
  }

  return count;
}
```

```java
// Time: O(log k) | Space: O(log k)
class Solution {
    public int findMinFibonacciNumbers(int k) {
        /**
         * Find minimum Fibonacci numbers needed to sum to k.
         * Greedy approach: always subtract the largest Fibonacci ≤ current k.
         */
        // Step 1: Generate Fibonacci numbers up to k
        List<Integer> fib = new ArrayList<>();
        fib.add(1); // F1 = 1
        fib.add(1); // F2 = 1

        // Generate until we exceed k
        while (fib.get(fib.size() - 1) <= k) {
            // Next Fibonacci is sum of last two
            int nextFib = fib.get(fib.size() - 1) + fib.get(fib.size() - 2);
            fib.add(nextFib);
        }

        // Step 2: Greedy subtraction from largest to smallest
        int count = 0;
        int idx = fib.size() - 1; // Start from the largest Fibonacci

        while (k > 0) {
            // Skip Fibonacci numbers larger than current k
            // (since we might have generated one slightly larger than original k)
            while (fib.get(idx) > k) {
                idx--;
            }

            // Subtract the largest Fibonacci ≤ k
            k -= fib.get(idx);
            count++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log k)**

- Generating Fibonacci numbers: Fibonacci sequence grows exponentially, so we need O(log k) numbers to reach k
- Greedy subtraction: In worst case, we might subtract O(log k) times (e.g., when k is a Fibonacci number itself)
- Each operation (generation and subtraction) is O(1), so total is O(log k)

**Space Complexity: O(log k)**

- We store O(log k) Fibonacci numbers in our list/array
- No recursion or additional data structures needed

The logarithmic complexity comes from the exponential growth of Fibonacci numbers. Since Fₙ ≈ φⁿ/√5 where φ ≈ 1.618, to reach k we need n ≈ logᵩ(k) = O(log k).

## Common Mistakes

1. **Generating Fibonacci numbers incorrectly**: Starting with [0, 1] instead of [1, 1] as per problem definition. The problem states F₁ = 1, F₂ = 1, not the more common 0, 1, 1, 2... Always read problem definitions carefully.

2. **Not handling the case where the last generated Fibonacci exceeds k**: When we generate until fib[-1] ≤ k, we might generate one number slightly larger than k. That's why we need the inner while loop to skip numbers > current k during subtraction.

3. **Using recursion instead of iteration**: While recursion might seem elegant, it can cause stack overflow for large k. The iterative approach is safer and more efficient.

4. **Trying to optimize by precomputing Fibonacci numbers globally**: While this seems smart, in an interview setting it's better to generate them fresh for each call unless the problem explicitly allows/prefers global state. It shows you understand the algorithm fully.

## When You'll See This Pattern

This greedy "take the largest possible" pattern appears in several problems:

1. **Coin Change (when coin denominations have certain properties)**: The classic coin change problem is usually solved with DP, but if coin denominations are powers of a number (like 1, 2, 4, 8...), greedy works. This Fibonacci problem is similar because Fibonacci numbers have the property that each is > the sum of all smaller ones.

2. **Maximum Units on a Truck (LeetCode 1710)**: You're given boxes with different unit counts and need to maximize total units. The greedy solution is to take boxes with the highest units first.

3. **Assign Cookies (LeetCode 455)**: Assign cookies to children greedily by giving the smallest adequate cookie to each child.

The pattern to recognize: when you can make a locally optimal choice (largest Fibonacci, highest units, smallest adequate cookie) and prove it leads to a globally optimal solution, greedy is likely applicable.

## Key Takeaways

1. **Greedy works when local optimality implies global optimality**: This problem teaches you to look for mathematical properties (like Zeckendorf's theorem) that guarantee greedy correctness. Always ask: "If I make the best choice now, will it prevent me from getting the optimal solution later?"

2. **Logarithmic complexity often comes from exponential growth**: When you see O(log n) complexity with numerical problems, think about sequences that grow exponentially (like Fibonacci, powers of 2, etc.).

3. **Test with edge cases**: Always test k = 1 (smallest Fibonacci), k that's a Fibonacci number itself, and k that requires many Fibonacci numbers (like k = 10^9). These reveal implementation bugs.

[Practice this problem on CodeJeet](/problem/find-the-minimum-number-of-fibonacci-numbers-whose-sum-is-k)
