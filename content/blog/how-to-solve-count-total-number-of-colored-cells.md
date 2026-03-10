---
title: "How to Solve Count Total Number of Colored Cells — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Total Number of Colored Cells. Medium difficulty, 66.1% acceptance rate. Topics: Math."
date: "2028-09-23"
category: "dsa-patterns"
tags: ["count-total-number-of-colored-cells", "math", "medium"]
---

# How to Solve Count Total Number of Colored Cells

This problem asks us to calculate the total number of colored cells after `n` minutes in a special coloring process that starts with one cell and expands outward each minute. The tricky part is recognizing the mathematical pattern behind the expansion rather than trying to simulate the entire grid, which would be impossible for large `n`.

## Visual Walkthrough

Let's trace through the process for `n = 3` to understand the pattern:

**Minute 1:** We color one arbitrary cell blue.  
Total colored cells: 1

**Minute 2:** Every cell adjacent to any blue cell becomes blue. Since we only have one blue cell, its 4 neighbors (up, down, left, right) become blue.  
Total colored cells: 1 + 4 = 5

**Minute 3:** Now we have 5 blue cells. Every cell adjacent to any of these 5 becomes blue. Looking at the shape, we get a diamond pattern where new cells are added around the perimeter.  
Total colored cells: 5 + 8 = 13

Let's visualize the grid after each minute (B = blue, . = uncolored):

```
Minute 1:    Minute 2:    Minute 3:
    .            .            .
   .B.          .B.          .B.
    .          BBB          BBBBB
              .B.          .BBBB.
                           BBBBBBB
                           .BBBB.
                            BBB
                             .
```

Notice the pattern:

- Minute 1: 1 cell
- Minute 2: 1 + 4 = 5 cells
- Minute 3: 5 + 8 = 13 cells
- Minute 4: 13 + 12 = 25 cells (if we continued)

The number of new cells added each minute follows an arithmetic sequence: 0, 4, 8, 12, 16, ...  
This is 4 × (minute - 1) for minute ≥ 2.

## Brute Force Approach

A naive approach would be to simulate the entire process by maintaining a grid and expanding outward each minute. However, this approach has several critical flaws:

1. **Infinite grid problem:** We can't allocate an infinite grid in memory.
2. **Exponential growth:** The colored area grows quadratically with `n`, so for large `n`, the simulation would be extremely slow.
3. **Complex neighbor tracking:** We'd need to track which cells are newly colored each minute to know where to expand next.

Even if we tried to simulate with a bounding box, we'd still have O(n²) time complexity and O(n²) space complexity, which is impractical for large `n`.

## Optimized Approach

The key insight is recognizing the mathematical pattern. Let's analyze the sequence:

Total cells after `n` minutes = 1 + 4 × (1 + 2 + 3 + ... + (n-1))

Why? Because:

- At minute 1: We start with 1 cell
- At minute 2: We add 4 × 1 = 4 new cells
- At minute 3: We add 4 × 2 = 8 new cells
- At minute 4: We add 4 × 3 = 12 new cells
- ...
- At minute n: We add 4 × (n-1) new cells

The sum 1 + 2 + 3 + ... + (n-1) is the sum of the first (n-1) natural numbers, which equals (n-1) × n / 2.

Therefore, the formula becomes:  
Total = 1 + 4 × [(n-1) × n / 2]  
Total = 1 + 2 × n × (n-1)

We can simplify this to:  
Total = 2n² - 2n + 1

This is a quadratic formula that gives us the answer in O(1) time!

## Optimal Solution

Now let's implement this formula. We need to handle large values of `n` (up to 10⁵ in typical constraints), so we use 64-bit integers to avoid overflow.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def coloredCells(n: int) -> int:
    """
    Calculate total colored cells after n minutes using the formula:
    total = 2n² - 2n + 1

    Derivation:
    - Minute 1: 1 cell
    - Each subsequent minute adds 4 × (minute - 1) cells
    - Sum from minute 1 to n: 1 + 4 × (1 + 2 + ... + (n-1))
    - Sum of first (n-1) natural numbers = (n-1) × n / 2
    - Therefore: total = 1 + 4 × (n-1) × n / 2 = 1 + 2 × n × (n-1)
    - Simplify: total = 2n² - 2n + 1
    """
    # Use 64-bit integer (Python ints are arbitrary precision, but we explicitly
    # use the formula for clarity)
    return 2 * n * n - 2 * n + 1
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate total colored cells after n minutes using the formula:
 * total = 2n² - 2n + 1
 *
 * Derivation:
 * - Minute 1: 1 cell
 * - Each subsequent minute adds 4 × (minute - 1) cells
 * - Sum from minute 1 to n: 1 + 4 × (1 + 2 + ... + (n-1))
 * - Sum of first (n-1) natural numbers = (n-1) × n / 2
 * - Therefore: total = 1 + 4 × (n-1) × n / 2 = 1 + 2 × n × (n-1)
 * - Simplify: total = 2n² - 2n + 1
 */
function coloredCells(n) {
  // Use BigInt for large n to avoid overflow, though JavaScript numbers
  // can handle up to 2^53-1 safely
  return 2 * n * n - 2 * n + 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate total colored cells after n minutes using the formula:
     * total = 2n² - 2n + 1
     *
     * Derivation:
     * - Minute 1: 1 cell
     * - Each subsequent minute adds 4 × (minute - 1) cells
     * - Sum from minute 1 to n: 1 + 4 × (1 + 2 + ... + (n-1))
     * - Sum of first (n-1) natural numbers = (n-1) × n / 2
     * - Therefore: total = 1 + 4 × (n-1) × n / 2 = 1 + 2 × n × (n-1)
     * - Simplify: total = 2n² - 2n + 1
     */
    public long coloredCells(int n) {
        // Use long to avoid integer overflow for large n
        // Cast n to long before multiplication to prevent intermediate overflow
        long N = n;
        return 2 * N * N - 2 * N + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)  
We simply compute a formula with a few arithmetic operations. The runtime doesn't depend on the input size.

**Space Complexity:** O(1)  
We only use a constant amount of extra space to store the result and intermediate calculations.

## Common Mistakes

1. **Integer overflow:** For large `n` (like 10⁵), n² can exceed 32-bit integer limits (2³¹ - 1 ≈ 2.1 × 10⁹). Always use 64-bit integers (long in Java, BigInt in JavaScript if needed, Python ints handle this automatically).

2. **Off-by-one errors in the formula:** Some candidates derive total = 2n(n-1) + 1 but mistakenly write it as 2n(n+1) + 1 or similar. Always test with small values: for n=1, answer should be 1; for n=2, answer should be 5; for n=3, answer should be 13.

3. **Trying to simulate the grid:** This is the most common mistake. Candidates waste time trying to implement BFS/DFS or maintain a grid representation. The problem is designed to test pattern recognition, not simulation skills.

4. **Misunderstanding the adjacency rule:** The problem states "every cell adjacent to any blue cell" becomes blue. Some candidates think only newly colored cells expand, but actually ALL blue cells cause their neighbors to become blue each minute.

## When You'll See This Pattern

This problem tests **mathematical pattern recognition** and **formula derivation** from a process description. Similar problems include:

1. **Minimum Cuts to Divide a Circle (LeetCode 2481):** Another problem where the answer follows a simple mathematical formula based on parity and geometry.

2. **Bulb Switcher (LeetCode 319):** Requires recognizing that only perfect squares remain on, leading to a sqrt(n) solution.

3. **Count Odd Numbers in an Interval Range (LeetCode 1523):** Looks like it needs iteration but has a simple O(1) formula.

4. **N-th Tribonacci Number (LeetCode 1137):** While this uses DP, it teaches looking for mathematical recurrence relations.

The common thread is identifying that a seemingly iterative process has a closed-form mathematical solution.

## Key Takeaways

1. **Look for mathematical patterns in growth processes:** When a problem describes a process that expands or evolves over time, try to find the mathematical sequence or formula before coding. Write out small cases and look for patterns.

2. **Sum of arithmetic series appears frequently:** The formula for sum of first k natural numbers (k(k+1)/2) appears in many problems. Recognizing when you have an arithmetic progression is crucial.

3. **Test your formula with edge cases:** Always verify your derived formula with the smallest possible input (n=1) and a few other small values before implementing.

4. **Consider integer limits:** When dealing with squares or products of potentially large numbers, use appropriate data types to prevent overflow.

Related problems: [Minimum Cuts to Divide a Circle](/problem/minimum-cuts-to-divide-a-circle)
