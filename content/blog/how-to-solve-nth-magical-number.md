---
title: "How to Solve Nth Magical Number — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Nth Magical Number. Hard difficulty, 36.4% acceptance rate. Topics: Math, Binary Search."
date: "2028-08-02"
category: "dsa-patterns"
tags: ["nth-magical-number", "math", "binary-search", "hard"]
---

# How to Solve Nth Magical Number

Finding the nth magical number is a classic "search space" problem disguised as a math puzzle. The challenge is that magical numbers grow quickly, and we need to efficiently locate the nth one without generating them all. The key insight is that we can count how many magical numbers exist up to a certain value, then use binary search to find the exact nth one.

## Visual Walkthrough

Let's trace through a small example: `n = 4, a = 2, b = 3`

**Step 1: Understanding magical numbers**

- Numbers divisible by 2: 2, 4, 6, 8, 10, 12, ...
- Numbers divisible by 3: 3, 6, 9, 12, 15, ...
- Magical numbers (union, sorted): 2, 3, 4, 6, 8, 9, 10, 12, ...

**Step 2: The counting function**
For any number `x`, we can count how many magical numbers are ≤ `x`:

- Count of numbers divisible by `a`: `x // a`
- Count of numbers divisible by `b`: `x // b`
- Numbers divisible by both (counted twice): `x // lcm(a, b)`
- Total magical numbers ≤ `x`: `(x // a) + (x // b) - (x // lcm(a, b))`

For `x = 6`:

- `6 // 2 = 3` (2, 4, 6)
- `6 // 3 = 2` (3, 6)
- `lcm(2, 3) = 6`, so `6 // 6 = 1` (6)
- Total: `3 + 2 - 1 = 4` magical numbers ≤ 6

**Step 3: Binary search approach**
We need the 4th magical number. Let's search between 1 and `n * min(a, b)` = 8:

- Mid = (1 + 8) // 2 = 4
- Count magical numbers ≤ 4: `(4//2)+(4//3)-(4//6) = 2+1-0 = 3`
- 3 < 4, so answer must be > 4. Search right half.

- New range: 5 to 8, mid = 6
- Count magical numbers ≤ 6: `(6//2)+(6//3)-(6//6) = 3+2-1 = 4`
- 4 ≥ 4, so answer ≤ 6. Search left half.

- New range: 5 to 6, mid = 5
- Count magical numbers ≤ 5: `(5//2)+(5//3)-(5//6) = 2+1-0 = 3`
- 3 < 4, so answer > 5. The answer is 6.

## Brute Force Approach

The most straightforward approach is to generate magical numbers in order until we find the nth one:

1. Start from 1 and check each number
2. If divisible by `a` or `b`, count it as magical
3. Stop when we've found `n` magical numbers

The problem? This is far too slow. Since magical numbers can be very sparse (especially when `a` and `b` are large), we might need to check up to `n * min(a, b)` numbers. For `n = 10^9` and `a = 2`, that's 2 billion checks! Even with optimizations, this approach has O(n \* min(a, b)) time complexity, which is impractical for the constraints.

## Optimized Approach

The key insight is that we don't need to generate magical numbers—we just need to find the nth one. We can use **binary search** on the answer space:

1. **Search space**: The nth magical number must be between 1 and `n * min(a, b)` (worst case where only one divisor contributes).
2. **Counting function**: For any candidate `x`, we can compute how many magical numbers exist ≤ `x` using the inclusion-exclusion principle.
3. **Binary search**: We look for the smallest `x` where `count(x) ≥ n`. This `x` is our nth magical number.
4. **LCM calculation**: We need the least common multiple of `a` and `b` to avoid double-counting numbers divisible by both.

The counting formula is the heart of this solution:

```
count(x) = floor(x/a) + floor(x/b) - floor(x/lcm(a,b))
```

This approach reduces the problem from linear search to logarithmic search over the answer space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(n * min(a, b))) | Space: O(1)
def nthMagicalNumber(n: int, a: int, b: int) -> int:
    MOD = 10**9 + 7

    # Helper function to compute greatest common divisor
    def gcd(x, y):
        while y:
            x, y = y, x % y
        return x

    # Compute least common multiple
    lcm_ab = a * b // gcd(a, b)

    # Binary search boundaries
    left, right = 1, n * min(a, b)

    while left < right:
        mid = (left + right) // 2

        # Count how many magical numbers are <= mid
        # Using inclusion-exclusion principle
        count = mid // a + mid // b - mid // lcm_ab

        if count < n:
            # Need more magical numbers, search right half
            left = mid + 1
        else:
            # We have enough or more, search left half (including mid)
            right = mid

    # left is now the nth magical number
    return left % MOD
```

```javascript
// Time: O(log(n * min(a, b))) | Space: O(1)
function nthMagicalNumber(n, a, b) {
  const MOD = 1000000007;

  // Helper function to compute greatest common divisor
  function gcd(x, y) {
    while (y !== 0) {
      [x, y] = [y, x % y];
    }
    return x;
  }

  // Compute least common multiple
  const lcmAB = Math.floor((a * b) / gcd(a, b));

  // Binary search boundaries
  let left = 1;
  let right = n * Math.min(a, b);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Count how many magical numbers are <= mid
    // Using inclusion-exclusion principle
    const count = Math.floor(mid / a) + Math.floor(mid / b) - Math.floor(mid / lcmAB);

    if (count < n) {
      // Need more magical numbers, search right half
      left = mid + 1;
    } else {
      // We have enough or more, search left half (including mid)
      right = mid;
    }
  }

  // left is now the nth magical number
  return left % MOD;
}
```

```java
// Time: O(log(n * min(a, b))) | Space: O(1)
class Solution {
    public int nthMagicalNumber(int n, int a, int b) {
        final int MOD = 1000000007;

        // Helper function to compute greatest common divisor
        long gcd(long x, long y) {
            while (y != 0) {
                long temp = y;
                y = x % y;
                x = temp;
            }
            return x;
        }

        // Compute least common multiple
        long lcmAB = a * b / gcd(a, b);

        // Binary search boundaries
        long left = 1;
        long right = (long) n * Math.min(a, b);

        while (left < right) {
            long mid = left + (right - left) / 2;

            // Count how many magical numbers are <= mid
            // Using inclusion-exclusion principle
            long count = mid / a + mid / b - mid / lcmAB;

            if (count < n) {
                // Need more magical numbers, search right half
                left = mid + 1;
            } else {
                // We have enough or more, search left half (including mid)
                right = mid;
            }
        }

        // left is now the nth magical number
        return (int) (left % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log(n \* min(a, b)))**

- The binary search runs O(log(n \* min(a, b))) iterations
- Each iteration performs O(1) operations (divisions and comparisons)
- The GCD calculation is O(log(min(a, b))) but only done once

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No data structures that grow with input size

The logarithmic complexity comes from halving the search space each iteration. Even for the maximum constraints (n = 10^9), we only need about 60 iterations.

## Common Mistakes

1. **Forgetting the modulo operation**: The problem explicitly asks for the result modulo 10^9+7. Some candidates compute the correct number but forget to apply the modulo at the end.

2. **Integer overflow in LCM calculation**: Computing `a * b` before dividing by GCD can overflow 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C) for intermediate calculations.

3. **Incorrect binary search termination**: Using `while (left <= right)` instead of `while (left < right)` can lead to infinite loops. The standard pattern for "find first value where condition is true" uses `<` not `<=`.

4. **Wrong search space boundaries**: Setting `right = n * max(a, b)` instead of `n * min(a, b)` makes the search space unnecessarily large. The nth magical number cannot exceed `n * min(a, b)` because even in the worst case (only one divisor contributes), we'd have at least one magical number every `min(a, b)` numbers.

## When You'll See This Pattern

This "binary search on answer space" pattern appears in many problems where:

1. The answer is monotonic (if x works, then x+1 also works)
2. We can efficiently check if a candidate answer is valid
3. The search space is too large for linear search

Related LeetCode problems:

- **Kth Smallest Number in Multiplication Table** (LeetCode 668): Find the kth smallest number in a multiplication table using similar counting + binary search.
- **Find Kth Smallest Pair Distance** (LeetCode 719): Binary search on the distance value with a counting function.
- **Capacity To Ship Packages Within D Days** (LeetCode 1011): Binary search on the capacity with a validation function.

## Key Takeaways

1. **When you need to find the kth element in a sequence that's too large to generate**, consider binary search on the answer space with a counting function.

2. **The inclusion-exclusion principle** is crucial for counting problems involving unions of sets. Remember: |A ∪ B| = |A| + |B| - |A ∩ B|.

3. **Always validate your binary search boundaries** and termination conditions with small test cases to avoid off-by-one errors.

[Practice this problem on CodeJeet](/problem/nth-magical-number)
