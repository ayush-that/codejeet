---
title: "How to Solve Smallest Divisible Digit Product I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Divisible Digit Product I. Easy difficulty, 64.4% acceptance rate. Topics: Math, Enumeration."
date: "2028-12-12"
category: "dsa-patterns"
tags: ["smallest-divisible-digit-product-i", "math", "enumeration", "easy"]
---

# How to Solve Smallest Divisible Digit Product I

You need to find the smallest number greater than or equal to `n` where the product of its digits is divisible by `t`. While this sounds straightforward, the challenge lies in efficiently checking numbers without getting stuck in brute force enumeration that could be too slow for large inputs. The interesting part is that we need to work with digit products, which can change unpredictably as we increment numbers.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 20` and `t = 6`.

We need to find the smallest number ≥ 20 where the product of its digits is divisible by 6.

**Step-by-step check:**

- Check 20: digits are 2 and 0. Product = 2 × 0 = 0. Is 0 divisible by 6? Yes, 0 ÷ 6 = 0 remainder 0. So 20 works! We return 20.

Wait, that was too easy. Let's try a more interesting example: `n = 15` and `t = 6`.

- Check 15: digits 1 and 5. Product = 1 × 5 = 5. 5 ÷ 6 = 0 remainder 5 ❌ Not divisible
- Check 16: digits 1 and 6. Product = 1 × 6 = 6. 6 ÷ 6 = 1 remainder 0 ✅ Divisible! Return 16

One more: `n = 100` and `t = 7`

- Check 100: digits 1, 0, 0. Product = 1 × 0 × 0 = 0. 0 ÷ 7 = 0 remainder 0 ✅ Divisible! Return 100

Notice a pattern: Any number containing digit 0 automatically has product 0, which is divisible by any `t` (except maybe t=0, but constraints say t ≥ 1). So if we encounter a number with a 0 digit, we can immediately return it.

What about when there's no 0? Let's try `n = 23` and `t = 12`

- Check 23: digits 2, 3. Product = 6. 6 ÷ 12 = 0 remainder 6 ❌
- Check 24: digits 2, 4. Product = 8. 8 ÷ 12 = 0 remainder 8 ❌
- Check 25: digits 2, 5. Product = 10. 10 ÷ 12 = 0 remainder 10 ❌
- Check 26: digits 2, 6. Product = 12. 12 ÷ 12 = 1 remainder 0 ✅ Return 26

The key insight: We simply need to check numbers starting from `n` and going upward until we find one that satisfies the condition. Since numbers can be up to 10⁶, and we might need to check many numbers, we need an efficient way to compute digit products.

## Brute Force Approach

The most straightforward approach is to start from `n` and check each consecutive number:

1. For each candidate number starting from `n`
2. Compute the product of its digits
3. Check if this product is divisible by `t`
4. Return the first number that satisfies the condition

While this is conceptually simple, the concern is efficiency. In the worst case, we might need to check many numbers before finding a valid one. For example, if `n = 999,999` and `t = 1,000,000`, we'd need to check many numbers (though t ≤ 1000 in constraints).

However, let's analyze: The constraints say `n ≤ 10⁶`. In the absolute worst case, we might need to check about 10⁶ numbers. For each number, we need to compute the digit product, which takes O(d) time where d is the number of digits (at most 7 for n ≤ 10⁶). So worst-case time is O(10⁶ × 7) ≈ 7 million operations, which is actually fine for modern computers.

So the "brute force" approach is actually the optimal solution here! The problem is intentionally designed to be solvable with simple enumeration due to the constraints.

## Optimal Solution

Since the brute force approach is already efficient enough given the constraints, we'll implement it directly. The key optimization is to stop early if we encounter a digit 0, since that makes the product 0 (divisible by any t).

<div class="code-group">

```python
# Time: O(n * d) where d is number of digits (at most 7) - but in practice much faster
# Space: O(1) - we only use a few variables
def smallestNumber(n: int, t: int) -> int:
    # Start checking from n and go upwards
    current = n
    while True:
        # Compute product of digits for current number
        product = 1
        num = current

        # Extract digits one by one
        while num > 0:
            digit = num % 10  # Get last digit
            product *= digit

            # Early exit: if we encounter digit 0, product becomes 0
            # 0 is divisible by any t (t ≥ 1), so we can return immediately
            if digit == 0:
                return current

            num //= 10  # Remove last digit

        # Special case: if current is 0 (though n ≥ 1 per constraints)
        if current == 0:
            product = 0

        # Check if product is divisible by t
        if product % t == 0:
            return current

        # Move to next number
        current += 1
```

```javascript
// Time: O(n * d) where d is number of digits (at most 7)
// Space: O(1) - constant extra space
function smallestNumber(n, t) {
  let current = n;

  while (true) {
    let product = 1;
    let num = current;

    // Extract digits and compute product
    while (num > 0) {
      const digit = num % 10; // Get last digit
      product *= digit;

      // Early exit if we find a zero digit
      if (digit === 0) {
        return current;
      }

      num = Math.floor(num / 10); // Remove last digit
    }

    // Handle the case when current is 0 (though n ≥ 1 per constraints)
    if (current === 0) {
      product = 0;
    }

    // Check divisibility
    if (product % t === 0) {
      return current;
    }

    // Try next number
    current++;
  }
}
```

```java
// Time: O(n * d) where d is number of digits (at most 7)
// Space: O(1) - constant extra space
class Solution {
    public int smallestNumber(int n, int t) {
        int current = n;

        while (true) {
            int product = 1;
            int num = current;

            // Extract digits and compute their product
            while (num > 0) {
                int digit = num % 10;  // Get last digit
                product *= digit;

                // Early exit if we encounter a zero digit
                if (digit == 0) {
                    return current;
                }

                num /= 10;  // Remove last digit
            }

            // Handle the case when current is 0 (though n ≥ 1 per constraints)
            if (current == 0) {
                product = 0;
            }

            // Check if product is divisible by t
            if (product % t == 0) {
                return current;
            }

            // Try the next number
            current++;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × d), where k is the number of numbers we need to check and d is the average number of digits. In the worst case, k could be as large as n (up to 10⁶), and d is at most 7 (since 10⁶ has 7 digits). This gives us about 7 million operations, which is well within limits for modern programming languages (typically 10⁷ operations per second).

**Space Complexity:** O(1). We only use a few integer variables regardless of input size. No additional data structures are needed.

Why is this efficient enough?

1. The constraints are small enough (n ≤ 10⁶) that linear search is acceptable
2. The early exit when finding a 0 digit significantly reduces checks in practice
3. Each check only involves simple arithmetic operations

## Common Mistakes

1. **Forgetting the early exit for zero digits**: Many candidates compute the full product even when they encounter a 0 digit. Since 0 × anything = 0, and 0 is divisible by any t, we can return immediately. This optimization can save many iterations.

2. **Infinite loop with while(true)**: Some candidates forget to increment the current number, causing an infinite loop. Always double-check that you're moving to the next candidate (current += 1 or current++).

3. **Incorrect digit extraction for number 0**: When current = 0, the while(num > 0) loop won't execute, leaving product = 1 instead of 0. We need to handle this special case, though n ≥ 1 in the problem constraints makes this mostly theoretical.

4. **Integer overflow for product**: The product of digits could theoretically overflow, but with at most 7 digits (each ≤ 9), the maximum product is 9⁷ ≈ 4.78 million, which fits comfortably in 32-bit integers. Still, it's good practice to consider this.

## When You'll See This Pattern

This problem uses **linear search with digit manipulation**, a common pattern in problems involving digit properties:

1. **Self Dividing Numbers (LeetCode 728)**: Find numbers where each digit divides the number itself. Similar digit extraction and checking.

2. **Armstrong Number (LeetCode 1134)**: Check if sum of digits raised to power of digit count equals the number. Requires digit extraction and computation.

3. **Happy Number (LeetCode 202)**: Repeatedly compute sum of squares of digits until reaching 1 or a cycle. Similar digit manipulation pattern.

The core technique is: extract digits using modulo and division operations, perform some computation on them, and check a condition. This pattern appears frequently in "easy" math problems on LeetCode.

## Key Takeaways

1. **Simple enumeration is sometimes optimal**: Don't overcomplicate problems. When constraints are small (like n ≤ 10⁶), a brute force solution might be perfectly acceptable and even optimal.

2. **Digit extraction pattern**: Remember the standard way to extract digits: `while(num > 0) { digit = num % 10; num /= 10; }`. This works right-to-left (least significant digit first).

3. **Look for early exit opportunities**: In this problem, encountering a 0 digit lets us exit immediately. Always look for conditions that can short-circuit your search to improve performance.

Related problems: [Smallest Number With Given Digit Product](/problem/smallest-number-with-given-digit-product)
