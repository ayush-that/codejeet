---
title: "How to Solve Bulb Switcher — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bulb Switcher. Medium difficulty, 55.5% acceptance rate. Topics: Math, Brainteaser."
date: "2028-01-10"
category: "dsa-patterns"
tags: ["bulb-switcher", "math", "brainteaser", "medium"]
---

# How to Solve Bulb Switcher

This problem presents a deceptively simple scenario: you have `n` light bulbs initially off, and you perform `n` rounds of toggling. In the `i`-th round, you toggle every `i`-th bulb (starting from bulb 1). The question asks: after `n` rounds, how many bulbs are on? What makes this problem interesting is that the obvious simulation approach becomes impossible for large `n`, forcing you to find a mathematical pattern instead of brute force computation.

## Visual Walkthrough

Let's trace through a small example with `n = 6` bulbs:

**Initial state:** All bulbs are off: [0, 0, 0, 0, 0, 0]

**Round 1 (toggle every 1st bulb):** Turn on all bulbs: [1, 1, 1, 1, 1, 1]

**Round 2 (toggle every 2nd bulb):** Toggle bulbs 2, 4, 6: [1, 0, 1, 0, 1, 0]

**Round 3 (toggle every 3rd bulb):** Toggle bulbs 3, 6: [1, 0, 0, 0, 1, 1]

**Round 4 (toggle every 4th bulb):** Toggle bulb 4: [1, 0, 0, 1, 1, 1]

**Round 5 (toggle every 5th bulb):** Toggle bulb 5: [1, 0, 0, 1, 0, 1]

**Round 6 (toggle every 6th bulb):** Toggle bulb 6: [1, 0, 0, 1, 0, 0]

**Final result:** Bulbs 1 and 4 are on → 2 bulbs.

Notice something interesting: bulb 1 is toggled once (round 1), bulb 2 is toggled twice (rounds 1 and 2), bulb 3 is toggled twice (rounds 1 and 3), bulb 4 is toggled three times (rounds 1, 2, and 4), bulb 5 is toggled twice (rounds 1 and 5), and bulb 6 is toggled four times (rounds 1, 2, 3, and 6).

The bulbs that end up ON are those that are toggled an odd number of times: bulb 1 (1 toggle) and bulb 4 (3 toggles).

## Brute Force Approach

The most straightforward approach is to simulate the entire process exactly as described. We could create an array of `n` bulbs (0 for off, 1 for on) and for each round `i` from 1 to `n`, toggle every `i`-th bulb. After all rounds, count how many bulbs are on.

Here's what that might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def bulbSwitchBruteForce(n):
    # Create array to represent bulbs (0 = off, 1 = on)
    bulbs = [0] * n

    # Perform n rounds of toggling
    for i in range(1, n + 1):
        # Toggle every i-th bulb (0-indexed, so we toggle index i-1, 2i-1, 3i-1, ...)
        for j in range(i - 1, n, i):
            bulbs[j] = 1 - bulbs[j]  # Toggle: 0→1, 1→0

    # Count bulbs that are on
    return sum(bulbs)
```

```javascript
// Time: O(n²) | Space: O(n)
function bulbSwitchBruteForce(n) {
  // Create array to represent bulbs (0 = off, 1 = on)
  const bulbs = new Array(n).fill(0);

  // Perform n rounds of toggling
  for (let i = 1; i <= n; i++) {
    // Toggle every i-th bulb (0-indexed, so we toggle index i-1, 2i-1, 3i-1, ...)
    for (let j = i - 1; j < n; j += i) {
      bulbs[j] = 1 - bulbs[j]; // Toggle: 0→1, 1→0
    }
  }

  // Count bulbs that are on
  return bulbs.reduce((sum, bulb) => sum + bulb, 0);
}
```

```java
// Time: O(n²) | Space: O(n)
public int bulbSwitchBruteForce(int n) {
    // Create array to represent bulbs (0 = off, 1 = on)
    int[] bulbs = new int[n];

    // Perform n rounds of toggling
    for (int i = 1; i <= n; i++) {
        // Toggle every i-th bulb (0-indexed, so we toggle index i-1, 2i-1, 3i-1, ...)
        for (int j = i - 1; j < n; j += i) {
            bulbs[j] = 1 - bulbs[j];  // Toggle: 0→1, 1→0
        }
    }

    // Count bulbs that are on
    int count = 0;
    for (int bulb : bulbs) {
        count += bulb;
    }
    return count;
}
```

</div>

**Why this fails:** The time complexity is O(n²) because for each of the `n` rounds, we might toggle up to `n/i` bulbs. For large `n` (like 10⁹), this is computationally impossible. We need a mathematical insight to solve this efficiently.

## Optimized Approach

The key insight comes from understanding **when a bulb gets toggled**. Bulb `k` gets toggled in round `i` if and only if `i` divides `k` evenly. For example, bulb 12 gets toggled in rounds 1, 2, 3, 4, 6, and 12 — all the divisors of 12.

Therefore:

- A bulb ends up ON if it's toggled an **odd** number of times
- A bulb is toggled once for each of its divisors
- So a bulb ends up ON if it has an **odd number of divisors**

Now here's the crucial mathematical fact: **Most numbers have an even number of divisors**. Why? Because divisors usually come in pairs. For example, 12 has divisor pairs: (1,12), (2,6), (3,4) — that's 6 divisors (even).

The only numbers that have an odd number of divisors are **perfect squares**. Why? Because in a perfect square, one divisor pair has the same number twice. For example, 16 has divisor pairs: (1,16), (2,8), (4,4). The (4,4) pair counts as only one distinct divisor, giving us 5 divisors total (odd).

So the bulbs that remain ON are exactly those whose indices (1-based) are perfect squares! Bulb 1 (1²), bulb 4 (2²), bulb 9 (3²), bulb 16 (4²), etc.

Therefore, the answer is simply: **the number of perfect squares ≤ n**, which is **⌊√n⌋** (the integer part of the square root of n).

## Optimal Solution

Now we can implement the optimal solution in O(1) time and O(1) space:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def bulbSwitch(n):
    """
    Returns the number of bulbs that remain on after n rounds.

    Insight: A bulb ends up ON if it's toggled an odd number of times.
    Bulb i is toggled once for each divisor of i.
    Only perfect squares have an odd number of divisors.
    So count = number of perfect squares ≤ n = floor(sqrt(n)).
    """
    # The integer square root gives us the count of perfect squares ≤ n
    return int(n ** 0.5)  # Equivalent to math.isqrt(n) in Python 3.8+
```

```javascript
// Time: O(1) | Space: O(1)
function bulbSwitch(n) {
  /**
   * Returns the number of bulbs that remain on after n rounds.
   *
   * Insight: A bulb ends up ON if it's toggled an odd number of times.
   * Bulb i is toggled once for each divisor of i.
   * Only perfect squares have an odd number of divisors.
   * So count = number of perfect squares ≤ n = floor(sqrt(n)).
   */
  // Math.floor(Math.sqrt(n)) gives us the count of perfect squares ≤ n
  return Math.floor(Math.sqrt(n));
}
```

```java
// Time: O(1) | Space: O(1)
public int bulbSwitch(int n) {
    /**
     * Returns the number of bulbs that remain on after n rounds.
     *
     * Insight: A bulb ends up ON if it's toggled an odd number of times.
     * Bulb i is toggled once for each divisor of i.
     * Only perfect squares have an odd number of divisors.
     * So count = number of perfect squares ≤ n = floor(sqrt(n)).
     */
    // (int)Math.sqrt(n) gives us the count of perfect squares ≤ n
    return (int)Math.sqrt(n);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) — We're just computing a square root and truncating to an integer. Even though computing square roots isn't technically constant time, it's considered O(1) for practical interview purposes since it's a single mathematical operation.

**Space Complexity:** O(1) — We're not using any data structures that grow with input size; just a few variables.

## Common Mistakes

1. **Trying to simulate the process for large n:** This is the most common mistake. Candidates see the problem description and immediately think "I need to simulate this." For n = 1,000,000, the simulation would require about 1,000,000 × (1 + 1/2 + 1/3 + ... + 1/1,000,000) ≈ 1,000,000 × ln(1,000,000) ≈ 14 million operations, which might be borderline acceptable. But for n = 10⁹, it's completely impossible.

2. **Off-by-one errors with indexing:** When implementing the brute force solution, it's easy to get confused between 1-based and 0-based indexing. Remember: bulb k corresponds to index k-1 in the array.

3. **Missing the mathematical insight:** Some candidates recognize that bulbs with odd toggle counts stay on but don't make the connection to perfect squares. They might try to count divisors for each number, which is still O(n√n) — better than O(n²) but still too slow for large n.

4. **Forgetting to use integer square root:** Simply computing `sqrt(n)` without taking the floor would give wrong answers for non-perfect squares. For example, for n=10, √10 ≈ 3.162, and we need floor(3.162) = 3, not 3.162.

## When You'll See This Pattern

This problem teaches the important skill of **looking for mathematical patterns instead of brute force simulation**. You'll encounter similar patterns in:

1. **Bulb Switcher II (LeetCode 672):** A more complex version where you have limited toggle operations. The solution still involves mathematical reasoning about bulb states rather than simulation.

2. **Minimum Number of K Consecutive Bit Flips (LeetCode 995):** While this uses a greedy approach with a queue, it also involves toggling bits and requires thinking about the parity of operations.

3. **Number of Times Binary String Is Prefix-Aligned (LeetCode 1375):** This involves tracking when prefixes of an array become sorted, which requires reasoning about the maximum value seen so far rather than checking all elements.

The core pattern is: when a problem involves repeated operations that seem to require simulation, look for mathematical invariants or properties that simplify the computation.

## Key Takeaways

1. **Look for mathematical patterns when simulation is infeasible:** If the input size makes brute force impossible (like n=10⁹), there's almost certainly a mathematical shortcut. Ask yourself: "What property determines the final state?"

2. **Divisors and parity are powerful concepts:** Many problems involving repeated toggling or flipping boil down to counting how many times something happens modulo 2 (parity). The connection between odd divisors and perfect squares is a classic example.

3. **Test small cases to find patterns:** When stuck, work through small examples manually (like we did with n=6). The pattern often reveals itself clearly in the first few cases.

Related problems: [Bulb Switcher II](/problem/bulb-switcher-ii), [Minimum Number of K Consecutive Bit Flips](/problem/minimum-number-of-k-consecutive-bit-flips), [Number of Times Binary String Is Prefix-Aligned](/problem/number-of-times-binary-string-is-prefix-aligned)
