---
title: "How to Solve Subtract the Product and Sum of Digits of an Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Subtract the Product and Sum of Digits of an Integer. Easy difficulty, 86.6% acceptance rate. Topics: Math."
date: "2027-02-12"
category: "dsa-patterns"
tags: ["subtract-the-product-and-sum-of-digits-of-an-integer", "math", "easy"]
---

# How to Solve Subtract the Product and Sum of Digits of an Integer

This problem asks us to take an integer, separate it into its individual digits, calculate both the product and sum of those digits, and return the difference between them. While mathematically straightforward, this problem tests your ability to extract digits from a number—a fundamental skill that appears in many number manipulation problems. The key insight is learning how to repeatedly extract the last digit using modulo and division operations.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Suppose we're given `n = 234`.

**Step 1: Initialize variables**
We start with:

- `product = 1` (starting at 1 because multiplication by 0 would give us 0)
- `sum = 0`

**Step 2: Extract first digit**

- Get the last digit: `234 % 10 = 4`
- Update product: `1 × 4 = 4`
- Update sum: `0 + 4 = 4`
- Remove the last digit: `234 // 10 = 23`

**Step 3: Extract second digit**

- Get the last digit: `23 % 10 = 3`
- Update product: `4 × 3 = 12`
- Update sum: `4 + 3 = 7`
- Remove the last digit: `23 // 10 = 2`

**Step 4: Extract third digit**

- Get the last digit: `2 % 10 = 2`
- Update product: `12 × 2 = 24`
- Update sum: `7 + 2 = 9`
- Remove the last digit: `2 // 10 = 0`

**Step 5: Calculate result**

- Difference: `product - sum = 24 - 9 = 15`

The loop stops when `n` becomes 0, and we return 15. This process works for any positive integer.

## Brute Force Approach

For this particular problem, there isn't really a "brute force" versus "optimal" distinction in the traditional sense—the digit extraction approach is both straightforward and optimal. However, a less experienced candidate might try converting the number to a string and then back to integers for each digit:

1. Convert the integer to a string
2. Iterate through each character
3. Convert each character back to an integer
4. Calculate product and sum

While this approach works and has the same time complexity, it uses extra space for the string conversion and is generally less efficient than working directly with the integer mathematically. More importantly, in an interview setting, the mathematical approach demonstrates better understanding of number manipulation fundamentals.

## Optimal Solution

The optimal solution uses mathematical operations to extract digits one by one. We repeatedly:

1. Use `n % 10` to get the last digit
2. Update our product and sum with this digit
3. Use `n // 10` (or integer division) to remove the last digit
4. Continue until `n` becomes 0

This approach works in O(d) time where d is the number of digits, and uses only O(1) extra space.

<div class="code-group">

```python
# Time: O(log₁₀(n)) | Space: O(1)
def subtractProductAndSum(n: int) -> int:
    # Initialize product to 1 (multiplicative identity)
    # and sum to 0 (additive identity)
    product = 1
    sum_digits = 0

    # Continue processing until we've extracted all digits
    while n > 0:
        # Extract the last digit using modulo 10
        digit = n % 10

        # Update product by multiplying with current digit
        product *= digit

        # Update sum by adding current digit
        sum_digits += digit

        # Remove the last digit by integer division by 10
        n //= 10

    # Return the difference between product and sum
    return product - sum_digits
```

```javascript
// Time: O(log₁₀(n)) | Space: O(1)
function subtractProductAndSum(n) {
  // Initialize product to 1 (multiplicative identity)
  // and sum to 0 (additive identity)
  let product = 1;
  let sum = 0;

  // Continue processing until we've extracted all digits
  while (n > 0) {
    // Extract the last digit using modulo 10
    const digit = n % 10;

    // Update product by multiplying with current digit
    product *= digit;

    // Update sum by adding current digit
    sum += digit;

    // Remove the last digit by integer division
    // Math.floor ensures we get integer division in JavaScript
    n = Math.floor(n / 10);
  }

  // Return the difference between product and sum
  return product - sum;
}
```

```java
// Time: O(log₁₀(n)) | Space: O(1)
public int subtractProductAndSum(int n) {
    // Initialize product to 1 (multiplicative identity)
    // and sum to 0 (additive identity)
    int product = 1;
    int sum = 0;

    // Continue processing until we've extracted all digits
    while (n > 0) {
        // Extract the last digit using modulo 10
        int digit = n % 10;

        // Update product by multiplying with current digit
        product *= digit;

        // Update sum by adding current digit
        sum += digit;

        // Remove the last digit by integer division by 10
        n /= 10;
    }

    // Return the difference between product and sum
    return product - sum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log₁₀(n)) or O(d) where d is the number of digits**

- Each iteration of the while loop processes one digit
- The number of iterations equals the number of digits in `n`
- For a number `n`, it has approximately log₁₀(n) digits
- Example: n = 1000 has 4 digits, and log₁₀(1000) = 3 ≈ 4

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- Variables: `product`, `sum`, `digit`, and the loop counter `n`
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle n = 0**: The while loop condition `n > 0` means that if `n = 0`, the loop never executes, and we return `1 - 0 = 1`, which is incorrect since the product of digits of 0 should be 0. The fix is to add a special case for `n = 0`:

   ```python
   if n == 0:
       return 0  # product(0) - sum(0) = 0 - 0 = 0
   ```

2. **Starting product at 0 instead of 1**: If you initialize `product = 0`, then multiplying any digit by 0 will keep it at 0, giving the wrong result. Remember the multiplicative identity is 1, not 0.

3. **Using floating-point division instead of integer division**: In some languages, `/` performs floating-point division. You need integer division to remove the last digit. In Python, use `//`; in JavaScript, use `Math.floor(n / 10)`; in Java, `/` already does integer division for integers.

4. **Not updating n correctly in the loop**: Forgetting to update `n` with `n //= 10` will create an infinite loop since `n` never decreases.

## When You'll See This Pattern

The digit extraction pattern using `% 10` and `/ 10` appears in many number manipulation problems:

1. **Palindrome Number (LeetCode 9)**: Check if a number reads the same backward as forward by reversing its digits using the same extraction method.

2. **Reverse Integer (LeetCode 7)**: Reverse the digits of an integer by repeatedly extracting the last digit and building the reversed number.

3. **Add Digits (LeetCode 258)**: Repeatedly sum the digits of a number until the result has only one digit, using digit extraction in each iteration.

4. **Happy Number (LeetCode 202)**: Sum the squares of digits repeatedly, which requires extracting each digit to square it.

These problems all share the core technique of breaking a number down into its constituent digits through modulo and division operations.

## Key Takeaways

1. **Digit extraction is fundamental**: The pattern `digit = n % 10` followed by `n //= 10` is the standard way to process digits from right to left. This works because our number system is base-10.

2. **Initialize accumulators correctly**: For product operations, start at 1 (the multiplicative identity). For sum operations, start at 0 (the additive identity).

3. **Consider edge cases**: Always check what happens with 0, negative numbers (though this problem specifies positive integers), and single-digit numbers. While this problem states `n` is positive, in similar problems you might need to handle negatives.

4. **Mathematical approach vs string conversion**: While converting to a string and processing characters works, the mathematical approach is more efficient and demonstrates stronger problem-solving skills for number manipulation problems.

[Practice this problem on CodeJeet](/problem/subtract-the-product-and-sum-of-digits-of-an-integer)
