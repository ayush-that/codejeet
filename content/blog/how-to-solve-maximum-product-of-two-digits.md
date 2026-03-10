---
title: "How to Solve Maximum Product of Two Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Product of Two Digits. Easy difficulty, 69.3% acceptance rate. Topics: Math, Sorting."
date: "2028-08-30"
category: "dsa-patterns"
tags: ["maximum-product-of-two-digits", "math", "sorting", "easy"]
---

# How to Solve Maximum Product of Two Digits

This problem asks us to find the maximum product we can get by multiplying any two digits from a given positive integer. The twist is that we can use the same digit twice if it appears multiple times in the number. While this seems straightforward, the challenge lies in efficiently extracting and comparing digits without unnecessary complexity.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we're given `n = 2736`.

**Step 1: Extract the digits**

- `n = 2736` has digits: 2, 7, 3, 6

**Step 2: Consider all possible pairs**
We need to check all combinations of two digits (including using the same digit twice):

- 2 × 2 = 4
- 2 × 7 = 14
- 2 × 3 = 6
- 2 × 6 = 12
- 7 × 7 = 49
- 7 × 3 = 21
- 7 × 6 = 42
- 3 × 3 = 9
- 3 × 6 = 18
- 6 × 6 = 36

**Step 3: Find the maximum**
The largest product is 49 (from 7 × 7).

Notice something important: the maximum product will always come from either:

1. The two largest digits multiplied together, OR
2. The largest digit multiplied by itself (if it appears at least twice)

This observation is key to our efficient solution.

## Brute Force Approach

A naive approach would be to:

1. Extract all digits from the number
2. Generate all possible pairs (including same-digit pairs)
3. Calculate all products
4. Return the maximum

While this works, it's inefficient. For a number with `d` digits, there are `d²` possible pairs, giving us O(d²) time complexity. Since `d` is at most 10 (for a 32-bit integer), this isn't terrible, but we can do better with a more elegant solution.

## Optimal Solution

The key insight is that to maximize the product of two digits, we want the largest possible digits. The maximum product will always be either:

- The product of the two largest distinct digits, OR
- The square of the largest digit (if it appears at least twice)

Therefore, we can:

1. Find the largest digit in the number
2. Find the second largest digit (could be equal to the largest if it appears multiple times)
3. Return their product

Here's the efficient implementation:

<div class="code-group">

```python
# Time: O(d) where d is number of digits | Space: O(1)
def maxProduct(n: int) -> int:
    """
    Find the maximum product of any two digits in n.

    Args:
        n: Positive integer whose digits we examine

    Returns:
        Maximum product of any two digits from n
    """
    # Initialize largest and second largest digits
    # Start with -1 to handle edge cases
    largest = -1
    second_largest = -1

    # Process each digit in the number
    while n > 0:
        # Extract the last digit
        digit = n % 10

        # Update largest and second largest
        if digit > largest:
            # Current digit becomes largest, previous largest becomes second largest
            second_largest = largest
            largest = digit
        elif digit > second_largest:
            # Current digit becomes second largest (but not larger than largest)
            second_largest = digit

        # Remove the last digit
        n //= 10

    # The maximum product is the product of the two largest digits
    # If second_largest is still -1, it means we only had one digit
    # In that case, we use the digit with itself (digit × digit)
    if second_largest == -1:
        return largest * largest

    return largest * second_largest
```

```javascript
// Time: O(d) where d is number of digits | Space: O(1)
function maxProduct(n) {
  /**
   * Find the maximum product of any two digits in n.
   *
   * @param {number} n - Positive integer whose digits we examine
   * @return {number} Maximum product of any two digits from n
   */

  // Initialize largest and second largest digits
  // Start with -1 to handle edge cases
  let largest = -1;
  let secondLargest = -1;

  // Process each digit in the number
  while (n > 0) {
    // Extract the last digit
    const digit = n % 10;

    // Update largest and second largest
    if (digit > largest) {
      // Current digit becomes largest, previous largest becomes second largest
      secondLargest = largest;
      largest = digit;
    } else if (digit > secondLargest) {
      // Current digit becomes second largest (but not larger than largest)
      secondLargest = digit;
    }

    // Remove the last digit
    n = Math.floor(n / 10);
  }

  // The maximum product is the product of the two largest digits
  // If secondLargest is still -1, it means we only had one digit
  // In that case, we use the digit with itself (digit × digit)
  if (secondLargest === -1) {
    return largest * largest;
  }

  return largest * secondLargest;
}
```

```java
// Time: O(d) where d is number of digits | Space: O(1)
public class Solution {
    public int maxProduct(int n) {
        /**
         * Find the maximum product of any two digits in n.
         *
         * @param n Positive integer whose digits we examine
         * @return Maximum product of any two digits from n
         */

        // Initialize largest and second largest digits
        // Start with -1 to handle edge cases
        int largest = -1;
        int secondLargest = -1;

        // Process each digit in the number
        while (n > 0) {
            // Extract the last digit
            int digit = n % 10;

            // Update largest and second largest
            if (digit > largest) {
                // Current digit becomes largest, previous largest becomes second largest
                secondLargest = largest;
                largest = digit;
            } else if (digit > secondLargest) {
                // Current digit becomes second largest (but not larger than largest)
                secondLargest = digit;
            }

            // Remove the last digit
            n /= 10;
        }

        // The maximum product is the product of the two largest digits
        // If secondLargest is still -1, it means we only had one digit
        // In that case, we use the digit with itself (digit × digit)
        if (secondLargest == -1) {
            return largest * largest;
        }

        return largest * secondLargest;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)**

- Where `d` is the number of digits in the input number `n`
- We process each digit exactly once in the while loop
- For a 32-bit integer, `d ≤ 10`, so this is effectively O(1) in practice

**Space Complexity: O(1)**

- We only use a constant amount of extra space (two integer variables)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting single-digit numbers**: When `n` has only one digit (e.g., `n = 5`), some implementations might return 0 or an error. Our solution handles this by checking if `second_largest` is still -1 and returning `largest × largest`.

2. **Incorrect digit extraction order**: When extracting digits using `n % 10`, we get digits from right to left (least significant to most significant). This doesn't affect our solution since we only care about digit values, not their positions.

3. **Not considering same-digit pairs**: Some candidates might only look for two distinct digits. Remember the problem allows using the same digit twice if it appears multiple times. Our solution handles this correctly because if the largest digit appears twice, it will be both `largest` and `second_largest`.

4. **Integer overflow**: While not an issue for this problem (digits are 0-9, products are 0-81), in similar problems, be mindful of multiplication potentially exceeding integer limits.

## When You'll See This Pattern

This "find top two elements" pattern appears in many problems:

1. **Maximum Product of Two Elements in an Array** (LeetCode 1464): Similar concept but with array elements instead of digits. The solution involves finding the two largest numbers.

2. **Third Maximum Number** (LeetCode 414): Extends the pattern to finding the top three elements while handling duplicates and edge cases.

3. **Kth Largest Element in an Array** (LeetCode 215): Generalizes the pattern to finding the kth largest element, often solved with heaps or quickselect.

The core technique of tracking the largest (and sometimes second/third largest) elements while iterating once through data is a fundamental optimization pattern for "top K" problems.

## Key Takeaways

1. **Look for mathematical insights**: Before coding, analyze the problem mathematically. Here, realizing that the maximum product must involve the largest digits saved us from checking all pairs.

2. **Single-pass tracking**: When you need the largest/smallest elements, you can often track them in a single pass without sorting or storing all elements.

3. **Handle edge cases early**: Single-digit numbers, duplicate maximum values, and minimum/maximum integer values are common edge cases in digit manipulation problems.

[Practice this problem on CodeJeet](/problem/maximum-product-of-two-digits)
