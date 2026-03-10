---
title: "How to Solve Integer Break — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Integer Break. Medium difficulty, 61.9% acceptance rate. Topics: Math, Dynamic Programming."
date: "2027-07-04"
category: "dsa-patterns"
tags: ["integer-break", "math", "dynamic-programming", "medium"]
---

# How to Solve Integer Break

You're given an integer `n` and must break it into at least two positive integers that sum to `n`, maximizing their product. What makes this problem interesting is that breaking numbers into smaller parts can yield larger products than keeping them whole—for example, 3×3=9 is better than 2×4=8 for n=6. The challenge is finding the optimal breaking strategy efficiently.

## Visual Walkthrough

Let's trace through n=10 to build intuition. We want to split 10 into positive integers that sum to 10:

- 5+5 → 5×5=25
- 3+3+4 → 3×3×4=36
- 3+3+2+2 → 3×3×2×2=36
- 2+2+2+2+2 → 2×2×2×2×2=32
- 3+3+3+1 → 3×3×3×1=27

Notice patterns emerging: 1s are wasteful (they don't increase product), and 3s seem particularly powerful. Let's check smaller numbers systematically:

- n=2: Only 1+1 → 1×1=1
- n=3: 1+2=3, 1+1+1=1, but 2+1 is same as 1+2 → best is 2
- n=4: 2+2=4, 3+1=3, 1+1+1+1=1 → best is 4
- n=5: 2+3=6, 2+2+1=4, 3+1+1=3 → best is 6
- n=6: 3+3=9, 2+2+2=8, 4+2=8 → best is 9
- n=7: 3+4=12, 3+2+2=12, 2+2+2+1=8 → best is 12
- n=8: 3+3+2=18, 2+2+2+2=16, 4+4=16 → best is 18
- n=9: 3+3+3=27, 2+2+2+3=24, 4+5=20 → best is 27

A clear pattern emerges: 3 is the magic number. Once n>4, breaking into 3s gives the largest product, with possibly a 2 or 4 at the end.

## Brute Force Approach

A naive approach would try all possible ways to break n into positive integers. For n=10, we could have:

- 2 parts: 1+9, 2+8, 3+7, 4+6, 5+5
- 3 parts: 1+1+8, 1+2+7, etc.
- Up to 10 parts: 1+1+...+1

For each breakdown, we'd calculate the product and track the maximum. This is essentially generating all integer partitions of n, which grows exponentially with n. The number of partitions p(n) follows: p(10)=42, p(20)=627, p(30)=5604—clearly too slow for larger n.

Even a recursive approach checking all splits would have exponential time complexity O(2^n), which fails for n beyond 30-40.

## Optimized Approach

The key insight comes from mathematical observation: **For maximum product, use as many 3s as possible, with special handling for remainders.**

Why 3? Let's analyze:

- Breaking a factor x into 2 and (x-2): Product is 2(x-2)=2x-4, which is > x when x>4
- Breaking into 3 and (x-3): Product is 3(x-3)=3x-9, which is > x when x>4.5
- Breaking into 4 gives 4(x-4)=4x-16 > x when x>16/3≈5.33
- Breaking into 5 gives 5(x-5)=5x-25 > x when x>6.25

So for x>4, breaking helps. But why prefer 3 over 2? Compare breaking 6:

- Using 3s: 3×3=9
- Using 2s: 2×2×2=8

For larger numbers, 3s give better "density" since 3^1/3 ≈ 1.442 > 2^1/2 ≈ 1.414.

Special cases:

- When remainder is 1 after using 3s: Convert a 3+1 into 2+2 (since 3×1=3 < 2×2=4)
- When remainder is 2: Keep it as 2
- n=2 and n=3: Handle separately (return 1 and 2 respectively)

This leads to an O(1) mathematical solution or an O(n) dynamic programming approach.

## Optimal Solution

Here's the O(1) mathematical solution based on the 3s pattern:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def integerBreak(n: int) -> int:
    """
    Break n into positive integers maximizing their product.
    Key insight: Use as many 3s as possible, with special handling
    for remainders 1 and 2.
    """
    # Base cases
    if n == 2:
        return 1  # 1×1
    if n == 3:
        return 2  # 2×1 or 1×2

    # Count how many 3s we can use
    count_3 = n // 3
    remainder = n % 3

    if remainder == 0:
        # Perfectly divisible by 3: all 3s
        return 3 ** count_3
    elif remainder == 1:
        # Convert last 3+1 into 2+2 (since 3×1 < 2×2)
        return 3 ** (count_3 - 1) * 4
    else:  # remainder == 2
        # Keep the 2 at the end
        return 3 ** count_3 * 2
```

```javascript
// Time: O(1) | Space: O(1)
function integerBreak(n) {
  /**
   * Break n into positive integers maximizing their product.
   * Key insight: Use as many 3s as possible, with special handling
   * for remainders 1 and 2.
   */
  // Base cases
  if (n === 2) return 1; // 1×1
  if (n === 3) return 2; // 2×1 or 1×2

  // Count how many 3s we can use
  const count3 = Math.floor(n / 3);
  const remainder = n % 3;

  if (remainder === 0) {
    // Perfectly divisible by 3: all 3s
    return Math.pow(3, count3);
  } else if (remainder === 1) {
    // Convert last 3+1 into 2+2 (since 3×1 < 2×2)
    return Math.pow(3, count3 - 1) * 4;
  } else {
    // remainder === 2
    // Keep the 2 at the end
    return Math.pow(3, count3) * 2;
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int integerBreak(int n) {
        /**
         * Break n into positive integers maximizing their product.
         * Key insight: Use as many 3s as possible, with special handling
         * for remainders 1 and 2.
         */
        // Base cases
        if (n == 2) return 1;  // 1×1
        if (n == 3) return 2;  // 2×1 or 1×2

        // Count how many 3s we can use
        int count3 = n / 3;
        int remainder = n % 3;

        if (remainder == 0) {
            // Perfectly divisible by 3: all 3s
            return (int)Math.pow(3, count3);
        } else if (remainder == 1) {
            // Convert last 3+1 into 2+2 (since 3×1 < 2×2)
            return (int)Math.pow(3, count3 - 1) * 4;
        } else {  // remainder == 2
            // Keep the 2 at the end
            return (int)Math.pow(3, count3) * 2;
        }
    }
}
```

</div>

For completeness, here's the dynamic programming approach that's easier to derive during an interview:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def integerBreakDP(n: int) -> int:
    """
    DP solution: dp[i] = maximum product for integer i.
    For each i, try all possible breaks j + (i-j).
    """
    if n <= 3:
        return n - 1  # Handles base cases: 2→1, 3→2

    dp = [0] * (n + 1)

    # Base cases for smaller numbers
    dp[1] = 1
    dp[2] = 2
    dp[3] = 3

    # Build up solutions
    for i in range(4, n + 1):
        max_product = 0
        # Try breaking i into j and i-j
        for j in range(1, i // 2 + 1):
            # Either break both parts or keep them whole
            product = dp[j] * dp[i - j]
            max_product = max(max_product, product)
        dp[i] = max_product

    return dp[n]
```

```javascript
// Time: O(n²) | Space: O(n)
function integerBreakDP(n) {
  /**
   * DP solution: dp[i] = maximum product for integer i.
   * For each i, try all possible breaks j + (i-j).
   */
  if (n <= 3) return n - 1; // Handles base cases: 2→1, 3→2

  const dp = new Array(n + 1).fill(0);

  // Base cases for smaller numbers
  dp[1] = 1;
  dp[2] = 2;
  dp[3] = 3;

  // Build up solutions
  for (let i = 4; i <= n; i++) {
    let maxProduct = 0;
    // Try breaking i into j and i-j
    for (let j = 1; j <= Math.floor(i / 2); j++) {
      // Either break both parts or keep them whole
      const product = dp[j] * dp[i - j];
      maxProduct = Math.max(maxProduct, product);
    }
    dp[i] = maxProduct;
  }

  return dp[n];
}
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    public int integerBreakDP(int n) {
        /**
         * DP solution: dp[i] = maximum product for integer i.
         * For each i, try all possible breaks j + (i-j).
         */
        if (n <= 3) return n - 1;  // Handles base cases: 2→1, 3→2

        int[] dp = new int[n + 1];

        // Base cases for smaller numbers
        dp[1] = 1;
        dp[2] = 2;
        dp[3] = 3;

        // Build up solutions
        for (int i = 4; i <= n; i++) {
            int maxProduct = 0;
            // Try breaking i into j and i-j
            for (int j = 1; j <= i / 2; j++) {
                // Either break both parts or keep them whole
                int product = dp[j] * dp[i - j];
                maxProduct = Math.max(maxProduct, product);
            }
            dp[i] = maxProduct;
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Mathematical solution (O(1) approach):**

- Time: O(1) - Just a few arithmetic operations
- Space: O(1) - Constant extra space

**Dynamic Programming solution:**

- Time: O(n²) - Outer loop runs n times, inner loop runs up to n/2 times
- Space: O(n) - DP array of size n+1

The mathematical solution is optimal, but the DP approach is more intuitive and acceptable in interviews if you explain you know it can be optimized to O(1) with the 3s pattern.

## Common Mistakes

1. **Forgetting the k≥2 constraint**: Some candidates return n for n=2 or n=3, but we must break into at least two parts. For n=2, 1×1=1, not 2.

2. **Incorrect handling of remainder 1**: When n%3==1, you can't just add a 1 at the end (3×1=3). You need to convert a 3+1 into 2+2 (4>3).

3. **Overcomplicating with unnecessary splits**: Trying to use factors other than 2 and 3. Mathematical analysis shows 3 is optimal, with 2 as the only other needed factor.

4. **Edge case mishandling**: n=1 isn't valid per problem constraints (n≥2), but candidates sometimes include it. Always check problem constraints first.

## When You'll See This Pattern

This "break into optimal pieces" pattern appears in problems where:

1. You need to maximize/minimize a product or sum of partitions
2. There's a mathematical optimal factor (like 3 here)
3. Dynamic programming with overlapping subproblems

Related problems:

- **Maximize Number of Nice Divisors**: Essentially the same problem but with modulo arithmetic. Uses the same 3s principle.
- **Perfect Squares**: Break n into sum of perfect squares minimizing count. Similar DP structure.
- **Coin Change**: Break amount into coins minimizing count. Similar "break into parts" thinking.

## Key Takeaways

1. **Look for mathematical patterns**: When optimizing products, small numbers (2, 3, e) often appear as optimal building blocks. Test small cases to find patterns.

2. **DP to math optimization**: Many DP problems have mathematical closed-form solutions. If you see a clear pattern (like "use as many 3s as possible"), derive the formula.

3. **Special case handling**: Optimal solutions often need careful handling of remainders (like converting 3+1 to 2+2 here).

Related problems: [Maximize Number of Nice Divisors](/problem/maximize-number-of-nice-divisors)
