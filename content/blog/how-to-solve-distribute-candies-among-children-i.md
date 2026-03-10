---
title: "How to Solve Distribute Candies Among Children I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distribute Candies Among Children I. Easy difficulty, 76.2% acceptance rate. Topics: Math, Combinatorics, Enumeration."
date: "2028-10-31"
category: "dsa-patterns"
tags: ["distribute-candies-among-children-i", "math", "combinatorics", "enumeration", "easy"]
---

# How to Solve Distribute Candies Among Children I

This problem asks us to count the number of ways to distribute `n` candies among 3 children, with the constraint that no child receives more than `limit` candies. While it seems straightforward, the challenge lies in efficiently counting valid distributions without brute-forcing through all possibilities, especially when `n` and `limit` can be large. The key insight is recognizing this as a combinatorial problem with constraints that can be handled using inclusion-exclusion principles.

## Visual Walkthrough

Let's walk through an example with `n = 5` and `limit = 3`. We need to find all non-negative integer solutions to:

```
x + y + z = 5
where 0 ≤ x, y, z ≤ 3
```

**Step 1: First, count all distributions without the limit constraint**
Without any upper limit, the number of ways to distribute 5 candies among 3 children is given by the stars-and-bars formula: C(5+3-1, 3-1) = C(7, 2) = 21.

**Step 2: Subtract invalid cases where at least one child gets > limit**
We need to subtract cases where at least one child gets 4 or more candies (since limit = 3).

Let's define A = "child 1 gets ≥ 4", B = "child 2 gets ≥ 4", C = "child 3 gets ≥ 4".

For A: Let x' = x - 4 (so x' ≥ 0). Then x' + y + z = 5 - 4 = 1. Number of solutions: C(1+3-1, 2) = C(3, 2) = 3.

Similarly, for B and C: each also has 3 solutions.

**Step 3: Add back cases where two children exceed limit**
We subtracted these twice, so we need to add them back.

For A∩B: Let x' = x - 4, y' = y - 4. Then x' + y' + z = 5 - 8 = -3. No solutions (negative).

Similarly, all other pairs have no solutions since 5 < 8.

**Step 4: Final count**
Total valid ways = 21 - 3 - 3 - 3 + 0 + 0 + 0 - 0 = 12.

Let's verify by listing some valid distributions: (2,2,1), (3,1,1), (1,3,1), (1,1,3), (2,1,2), (1,2,2), (3,2,0), (2,3,0), (0,3,2), (0,2,3), (3,0,2), (2,0,3). That's 12 ways!

## Brute Force Approach

The most straightforward approach is to try all possible distributions using nested loops:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def brute_force(n, limit):
    count = 0
    # Try all possible values for each child
    for i in range(min(n, limit) + 1):  # First child gets i candies
        for j in range(min(n - i, limit) + 1):  # Second child gets j candies
            k = n - i - j  # Third child gets the rest
            if k <= limit and k >= 0:  # Check if third child's amount is valid
                count += 1
    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function bruteForce(n, limit) {
  let count = 0;
  // Try all possible values for each child
  for (let i = 0; i <= Math.min(n, limit); i++) {
    // First child gets i candies
    for (let j = 0; j <= Math.min(n - i, limit); j++) {
      // Second child gets j candies
      const k = n - i - j; // Third child gets the rest
      if (k <= limit && k >= 0) {
        // Check if third child's amount is valid
        count++;
      }
    }
  }
  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int bruteForce(int n, int limit) {
    int count = 0;
    // Try all possible values for each child
    for (int i = 0; i <= Math.min(n, limit); i++) {  // First child gets i candies
        for (int j = 0; j <= Math.min(n - i, limit); j++) {  // Second child gets j candies
            int k = n - i - j;  // Third child gets the rest
            if (k <= limit && k >= 0) {  // Check if third child's amount is valid
                count++;
            }
        }
    }
    return count;
}
```

</div>

**Why this is insufficient:** This approach has O(n²) time complexity. While it works for small inputs, it becomes too slow when `n` is large (up to 50 in this problem). We need a mathematical solution that runs in O(1) time.

## Optimal Solution

The optimal solution uses combinatorial mathematics with the inclusion-exclusion principle. Here's the step-by-step reasoning:

1. **Total distributions without limits**: Using stars-and-bars, the number of non-negative integer solutions to x + y + z = n is C(n+2, 2).

2. **Subtract cases where one child exceeds limit**: For each child i, if they get ≥ (limit+1) candies, let x_i' = x_i - (limit+1). Then we're counting solutions to x' + y + z = n - (limit+1). There are C(n - (limit+1) + 2, 2) ways for each child, multiplied by 3 children.

3. **Add back cases where two children exceed limit**: For each pair of children (i,j), if both get ≥ (limit+1), we're counting solutions to x' + y' + z = n - 2(limit+1). There are C(n - 2(limit+1) + 2, 2) ways for each pair, multiplied by C(3,2) = 3 pairs.

4. **Subtract cases where all three exceed limit**: If all get ≥ (limit+1), count solutions to x' + y' + z' = n - 3(limit+1). There are C(n - 3(limit+1) + 2, 2) ways.

We use the combination formula C(n, k) = n!/(k!(n-k)!) = n\*(n-1)/2 when k=2.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def distributeCandies(n, limit):
    # Helper function to calculate C(m, 2) safely
    def comb2(m):
        if m < 2:
            return 0
        return m * (m - 1) // 2

    # Step 1: Total ways without any limits
    total = comb2(n + 2)

    # Step 2: Subtract cases where at least one child gets > limit
    # For each child, if they get (limit+1) or more candies
    for i in range(1, 4):  # i = 1, 2, 3 children
        m = n - (limit + 1) * i
        if m >= 0:
            # Inclusion-exclusion: add for odd i, subtract for even i
            if i % 2 == 1:
                total -= comb2(m + 2) * (3 if i == 1 else (3 if i == 3 else 1))
            else:
                total += comb2(m + 2) * 3  # i == 2, 3 choose 2 = 3 pairs
        else:
            # If m < 0, no more valid combinations to consider
            break

    return total
```

```javascript
// Time: O(1) | Space: O(1)
function distributeCandies(n, limit) {
  // Helper function to calculate C(m, 2) safely
  const comb2 = (m) => {
    if (m < 2) return 0;
    return (m * (m - 1)) / 2;
  };

  // Step 1: Total ways without any limits
  let total = comb2(n + 2);

  // Step 2: Apply inclusion-exclusion principle
  // Subtract cases where 1 child exceeds limit, add back where 2 exceed, etc.
  for (let i = 1; i <= 3; i++) {
    const m = n - (limit + 1) * i;
    if (m >= 0) {
      const ways = comb2(m + 2);
      // Inclusion-exclusion: (-1)^(i+1) * C(3, i) * ways
      if (i % 2 === 1) {
        // Odd i: subtract for i=1, add for i=3
        total -= ways * (i === 1 ? 3 : 1);
      } else {
        // Even i: i=2, add back
        total += ways * 3;
      }
    } else {
      // If m < 0, no more valid combinations
      break;
    }
  }

  return total;
}
```

```java
// Time: O(1) | Space: O(1)
public int distributeCandies(int n, int limit) {
    // Helper function to calculate C(m, 2) safely
    // Using long to avoid integer overflow
    long comb2(long m) {
        if (m < 2) return 0;
        return m * (m - 1) / 2;
    }

    // Step 1: Total ways without any limits
    long total = comb2(n + 2);

    // Step 2: Apply inclusion-exclusion principle
    for (int i = 1; i <= 3; i++) {
        long m = n - (long)(limit + 1) * i;
        if (m >= 0) {
            long ways = comb2(m + 2);
            // Inclusion-exclusion: (-1)^(i+1) * C(3, i) * ways
            if (i % 2 == 1) {
                // Odd i: subtract for i=1, add for i=3
                total -= ways * (i == 1 ? 3 : 1);
            } else {
                // Even i: i=2, add back
                total += ways * 3;
            }
        } else {
            // If m < 0, no more valid combinations
            break;
        }
    }

    return (int)total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of operations regardless of input size
- The loop runs at most 3 times (for i = 1, 2, 3)
- Each iteration involves simple arithmetic operations

**Space Complexity:** O(1)

- We use only a constant amount of extra space for variables
- No data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors with the limit**: The constraint is "no child gets more than `limit` candies", which means each child can get 0 to `limit` candies inclusive. A common mistake is using `limit` instead of `limit + 1` when checking for violations in the inclusion-exclusion step.

2. **Forgetting to handle negative values in combination function**: When `n - (limit+1)*i` becomes negative, `comb2(m+2)` should return 0, not a negative number or an error. Always include a check for `m < 2` in your combination helper.

3. **Integer overflow**: When `n` is large (up to 50), intermediate calculations like `(n+2)*(n+1)` can exceed 32-bit integer limits. Use 64-bit integers (long in Java, int is usually fine in Python).

4. **Incorrect application of inclusion-exclusion**: The pattern is: total - (1 child violations) + (2 child violations) - (3 child violations). Getting the signs wrong is a common error. Remember: subtract singles, add pairs, subtract triples.

## When You'll See This Pattern

The inclusion-exclusion principle appears in many combinatorial counting problems with constraints:

1. **Count the Number of Ways to Place Houses (LeetCode 2320)**: Similar constraint-based counting using inclusion-exclusion.

2. **Number of Ways to Wear Different Hats to Each Other (LeetCode 1434)**: More complex but uses similar inclusion-exclusion ideas.

3. **Count Ways to Distribute Candies (LeetCode Hard version)**: This is literally the harder version of the same problem with more children and different constraints.

The pattern to recognize: When you need to count combinations with upper bounds, and the bounds make direct counting difficult, inclusion-exclusion can transform the problem into counting combinations without bounds (which is easier).

## Key Takeaways

1. **Inclusion-exclusion transforms constrained problems into unconstrained ones**: Instead of directly counting valid distributions, count all distributions and subtract invalid ones, carefully adjusting for over-subtraction.

2. **Stars-and-bars formula is fundamental**: The number of non-negative integer solutions to x₁ + x₂ + ... + xₖ = n is C(n+k-1, k-1). This is the building block for many distribution problems.

3. **Combinatorial problems often have O(1) mathematical solutions**: Before writing loops, check if there's a mathematical formula. For distribution problems with small constraints (like 3 children), inclusion-exclusion often provides an efficient solution.

Related problems: [Count Ways to Distribute Candies](/problem/count-ways-to-distribute-candies)
