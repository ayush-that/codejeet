---
title: "How to Solve Count Square Sum Triples — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Square Sum Triples. Easy difficulty, 77.1% acceptance rate. Topics: Math, Enumeration."
date: "2026-03-18"
category: "dsa-patterns"
tags: ["count-square-sum-triples", "math", "enumeration", "easy"]
---

# How to Solve Count Square Sum Triples

This problem asks us to count all integer triples `(a, b, c)` where `a² + b² = c²` and all three numbers are between 1 and `n`. While the problem seems straightforward, the interesting part is finding an efficient way to check the Pythagorean condition without unnecessary computations. The challenge lies in avoiding redundant checks while maintaining clean, readable code.

## Visual Walkthrough

Let's trace through a small example with `n = 5` to build intuition:

We need to find all triples `(a, b, c)` where:

- `1 ≤ a, b, c ≤ 5`
- `a² + b² = c²`

Let's enumerate systematically:

**Step 1: Try c = 5**

- Check if any `a² + b² = 25` where `1 ≤ a, b ≤ 5`
- Possible sums: `1+4=5`, `1+9=10`, `1+16=17`, `1+25=26`, `4+9=13`, `4+16=20`, `4+25=29`, `9+16=25` ← Found!
- `3² + 4² = 9 + 16 = 25 = 5²` → Triple: (3, 4, 5)
- Also `4² + 3² = 16 + 9 = 25 = 5²` → Triple: (4, 3, 5)
- These are considered different since `a` and `b` are swapped

**Step 2: Try c = 4**

- Check if any `a² + b² = 16` where `1 ≤ a, b ≤ 5`
- Possible sums: `1+4=5`, `1+9=10`, `1+16=17`, `4+9=13`, `4+16=20`, `9+16=25`
- None equal 16

**Step 3: Try c = 3**

- Check if any `a² + b² = 9` where `1 ≤ a, b ≤ 5`
- Possible sums: `1+4=5`, `1+9=10`, `4+9=13`
- None equal 9

**Step 4: Try c = 2**

- Check if any `a² + b² = 4` where `1 ≤ a, b ≤ 5`
- Possible sums: `1+4=5`
- None equal 4

**Step 5: Try c = 1**

- Check if any `a² + b² = 1` where `1 ≤ a, b ≤ 5`
- Minimum sum is `1+1=2`, so impossible

**Result:** We found 2 valid triples: (3, 4, 5) and (4, 3, 5)

Notice that we can stop checking when `a` or `b` exceeds `c`, since if `a > c`, then `a² > c²`, making the equation impossible. This observation will help us optimize.

## Brute Force Approach

The most straightforward approach is to check all possible combinations of `a`, `b`, and `c`:

1. Loop `a` from 1 to `n`
2. Loop `b` from 1 to `n`
3. Loop `c` from 1 to `n`
4. Check if `a² + b² = c²`

This approach has O(n³) time complexity, which becomes impractical for larger `n`. For example, with `n = 250`, we'd need to check 15,625,000 combinations!

While this brute force solution would technically work for the constraints (n ≤ 250), we can do better by eliminating unnecessary checks. The problem is rated "Easy" because even the brute force solution with some optimizations is acceptable, but we should aim for the most efficient approach.

## Optimal Solution

We can optimize by recognizing that for each pair `(a, b)`, we can compute `c² = a² + b²` and check if `c` is an integer within range. This eliminates the innermost loop. Even better, we can use a hash set to store all perfect squares up to `n²` for O(1) lookup.

Here's the optimal approach:

1. Create a set of all perfect squares from `1²` to `n²`
2. For each `a` from 1 to `n`
3. For each `b` from `a` to `n` (to avoid counting duplicates twice if we double count)
4. Calculate `sumSquares = a² + b²`
5. If `sumSquares` is in the set of perfect squares, we found a valid triple
6. Count it twice if `a ≠ b` (since `(a, b)` and `(b, a)` are different)

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def countTriples(n: int) -> int:
    """
    Counts all square triples (a, b, c) where a² + b² = c² and 1 ≤ a, b, c ≤ n.

    Approach:
    1. Store all perfect squares up to n² in a set for O(1) lookup
    2. Iterate through all possible (a, b) pairs
    3. Check if a² + b² is a perfect square in our set
    4. Count each valid pair, accounting for both (a, b) and (b, a) when a ≠ b
    """
    # Step 1: Create a set of all perfect squares from 1² to n²
    # We use a set for O(1) lookup when checking if a² + b² is a perfect square
    squares = set()
    for i in range(1, n + 1):
        squares.add(i * i)

    count = 0

    # Step 2: Iterate through all possible a values
    for a in range(1, n + 1):
        a_squared = a * a

        # Step 3: Iterate through b values starting from a
        # Starting from a avoids duplicate checks and ensures b ≥ a
        for b in range(a, n + 1):
            # Step 4: Calculate a² + b²
            sum_squares = a_squared + b * b

            # Step 5: Check if the sum is a perfect square
            if sum_squares in squares:
                # Step 6: If a == b, only one ordering (a, b) is valid
                # If a != b, both (a, b) and (b, a) are valid
                if a == b:
                    count += 1
                else:
                    count += 2

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
/**
 * Counts all square triples (a, b, c) where a² + b² = c² and 1 ≤ a, b, c ≤ n.
 *
 * Approach:
 * 1. Store all perfect squares up to n² in a set for O(1) lookup
 * 2. Iterate through all possible (a, b) pairs
 * 3. Check if a² + b² is a perfect square in our set
 * 4. Count each valid pair, accounting for both (a, b) and (b, a) when a ≠ b
 */
function countTriples(n) {
  // Step 1: Create a set of all perfect squares from 1² to n²
  const squares = new Set();
  for (let i = 1; i <= n; i++) {
    squares.add(i * i);
  }

  let count = 0;

  // Step 2: Iterate through all possible a values
  for (let a = 1; a <= n; a++) {
    const aSquared = a * a;

    // Step 3: Iterate through b values starting from a
    // Starting from a avoids duplicate checks and ensures b ≥ a
    for (let b = a; b <= n; b++) {
      // Step 4: Calculate a² + b²
      const sumSquares = aSquared + b * b;

      // Step 5: Check if the sum is a perfect square
      if (squares.has(sumSquares)) {
        // Step 6: If a == b, only one ordering (a, b) is valid
        // If a != b, both (a, b) and (b, a) are valid
        if (a === b) {
          count += 1;
        } else {
          count += 2;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Counts all square triples (a, b, c) where a² + b² = c² and 1 ≤ a, b, c ≤ n.
     *
     * Approach:
     * 1. Store all perfect squares up to n² in a set for O(1) lookup
     * 2. Iterate through all possible (a, b) pairs
     * 3. Check if a² + b² is a perfect square in our set
     * 4. Count each valid pair, accounting for both (a, b) and (b, a) when a ≠ b
     */
    public int countTriples(int n) {
        // Step 1: Create a set of all perfect squares from 1² to n²
        Set<Integer> squares = new HashSet<>();
        for (int i = 1; i <= n; i++) {
            squares.add(i * i);
        }

        int count = 0;

        // Step 2: Iterate through all possible a values
        for (int a = 1; a <= n; a++) {
            int aSquared = a * a;

            // Step 3: Iterate through b values starting from a
            // Starting from a avoids duplicate checks and ensures b ≥ a
            for (int b = a; b <= n; b++) {
                // Step 4: Calculate a² + b²
                int sumSquares = aSquared + b * b;

                // Step 5: Check if the sum is a perfect square
                if (squares.contains(sumSquares)) {
                    // Step 6: If a == b, only one ordering (a, b) is valid
                    // If a != b, both (a, b) and (b, a) are valid
                    if (a == b) {
                        count += 1;
                    } else {
                        count += 2;
                    }
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Building the set of squares takes O(n) time
- The nested loops iterate through all pairs `(a, b)` where `a ≤ b ≤ n`
- The number of such pairs is `n(n+1)/2`, which is O(n²)
- Each iteration does O(1) work (multiplication and set lookup)

**Space Complexity: O(n)**

- We store a set of `n` perfect squares
- No other data structures scale with input size
- The space for the set dominates, giving us O(n) space

This is optimal for this problem since we need to check all possible `(a, b)` pairs in the worst case.

## Common Mistakes

1. **Double counting or missing symmetric pairs**: When `a ≠ b`, both `(a, b)` and `(b, a)` are valid triples. A common mistake is to count only one of them or to count both when `a = b`. The correct approach is to count 1 when `a = b` and 2 when `a ≠ b`.

2. **Incorrect loop boundaries**: Starting `b` from 1 instead of `a` leads to duplicate checks and requires careful handling of the count. Starting from `a` simplifies the logic and improves performance slightly.

3. **Forgetting that c must be ≤ n**: When checking if `a² + b²` is a perfect square, we must ensure the square root is ≤ n. Our approach handles this by only storing squares up to `n²` in the set.

4. **Using integer square root check inefficiently**: Some candidates compute `c = sqrt(a² + b²)` and check if `c` is integer and ≤ n. This involves floating-point operations which can have precision issues. Using a set of perfect squares is cleaner and avoids precision problems.

## When You'll See This Pattern

This problem uses the **precomputation + lookup** pattern, which appears in many problems where you need to check if values satisfy certain conditions:

1. **Two Sum** (LeetCode #1): Store values in a hash map as you iterate, checking if `target - current` exists in the map.

2. **Count Number of Pairs With Absolute Difference K** (LeetCode #2006): Store counts in a hash map and look for `num + k` or `num - k`.

3. **Number of Unequal Triplets in Array** (LeetCode #2475): Similar triple-counting problem where you need to count distinct triples satisfying certain conditions.

The key insight is that by precomputing and storing information (like perfect squares in this case), we can transform what seems like an O(n³) problem into an O(n²) solution.

## Key Takeaways

1. **Precomputation can eliminate inner loops**: By storing all perfect squares in a set, we avoid having to loop through `c` values or compute square roots repeatedly.

2. **Symmetry matters in counting problems**: When order matters (as it does here since `(a, b, c)` and `(b, a, c)` are distinct), carefully handle the counting logic to avoid duplicates or omissions.

3. **Constraints guide optimization**: With `n ≤ 250`, even O(n²) solutions are efficient (max ~62,500 operations). Understanding problem constraints helps determine what level of optimization is necessary.

Related problems: [Number of Unequal Triplets in Array](/problem/number-of-unequal-triplets-in-array)
