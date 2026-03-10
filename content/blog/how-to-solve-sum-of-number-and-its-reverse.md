---
title: "How to Solve Sum of Number and Its Reverse — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Number and Its Reverse. Medium difficulty, 49.3% acceptance rate. Topics: Math, Enumeration."
date: "2028-09-10"
category: "dsa-patterns"
tags: ["sum-of-number-and-its-reverse", "math", "enumeration", "medium"]
---

# How to Solve Sum of Number and Its Reverse

This problem asks whether a given non-negative integer can be expressed as the sum of some integer and its reverse. For example, 121 can be expressed as 92 + 29 (92 reversed is 29). What makes this problem interesting is that while it appears to be a mathematical puzzle, the most practical solution involves a straightforward enumeration approach with careful bounds optimization.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we're given `num = 121`. We need to check if there exists some integer `x` such that `x + reverse(x) = 121`.

We'll try different values of `x`:

- `x = 0`: 0 + 0 = 0 ≠ 121
- `x = 1`: 1 + 1 = 2 ≠ 121
- `x = 2`: 2 + 2 = 4 ≠ 121
- ...
- `x = 92`: 92 + 29 = 121 ✓ Found a match!

But do we need to check all numbers from 0 to 121? Let's think about the relationship between `x` and its reverse. When we add `x` and `reverse(x)`, the maximum value we can get is limited by the number of digits. For example, if `x` has 3 digits, the maximum sum is `999 + 999 = 1998`, but we're only interested in sums up to `num`.

More importantly, we can bound our search: if `x` is significantly larger than `num`, then `x + reverse(x)` will definitely exceed `num`. In fact, we only need to check `x` values up to `num` itself, since if `x > num`, then `x + reverse(x) > num`.

But we can do even better. Notice that for any `x`, the reverse operation doesn't change the number of digits. So if `x` has more digits than `num`, their sum will have more digits than `num`. This gives us a natural stopping point.

## Brute Force Approach

The most straightforward approach is to check every possible integer `x` from 0 up to `num`:

1. For each `x` from 0 to `num`:
   - Compute `reverse(x)`
   - Check if `x + reverse(x) == num`
   - If yes, return `true`
2. If no match found, return `false`

This approach is simple but inefficient. For `num = 10^5`, we'd need to check 100,001 numbers, and for each we need to compute the reverse, which takes O(d) time where d is the number of digits. This gives us O(n log n) time complexity, which is acceptable for the constraints but not optimal.

However, there's an even more naive approach some candidates might try: checking all pairs of numbers. That would be O(n²), which is clearly too slow.

## Optimized Approach

The key insight is that we can bound our search much more tightly. Let's analyze the relationship between `x` and `reverse(x)`:

1. **Digit count constraint**: If `x` has more digits than `num`, then `x + reverse(x)` will definitely be larger than `num`. So we only need to check `x` values with the same number of digits as `num` or fewer.

2. **Symmetry observation**: Notice that if `x + reverse(x) = num`, then `reverse(x) + x = num` as well. This means we're checking each pair twice. We could optimize by only checking up to `num/2`, but we need to be careful with odd numbers.

3. **Practical bound**: In practice, we can simply check all `x` from 0 to `num`. For the given constraints (`num ≤ 10^5`), this is efficient enough. The reverse operation is cheap (O(log x) time), and 100,000 iterations is trivial for modern computers.

The real optimization comes from implementing an efficient reverse function and early termination when possible.

## Optimal Solution

The optimal solution checks every number from 0 to `num` and returns `true` if we find any `x` such that `x + reverse(x) = num`. We implement a helper function to reverse numbers efficiently.

<div class="code-group">

```python
# Time: O(n log n) where n is the input number
# Space: O(1) - we only use constant extra space
def sumOfNumberAndReverse(num: int) -> bool:
    # Helper function to reverse an integer
    def reverse_number(n: int) -> int:
        reversed_num = 0
        # Process each digit from right to left
        while n > 0:
            # Get the last digit and add it to the reversed number
            reversed_num = reversed_num * 10 + (n % 10)
            # Remove the last digit from n
            n //= 10
        return reversed_num

    # Check all possible x values from 0 to num
    for x in range(num + 1):
        # If x + reverse(x) equals num, we found a valid pair
        if x + reverse_number(x) == num:
            return True

    # If we checked all possibilities and found nothing
    return False
```

```javascript
// Time: O(n log n) where n is the input number
// Space: O(1) - we only use constant extra space
function sumOfNumberAndReverse(num) {
  // Helper function to reverse an integer
  function reverseNumber(n) {
    let reversed = 0;
    // Process each digit from right to left
    while (n > 0) {
      // Get the last digit and add it to the reversed number
      reversed = reversed * 10 + (n % 10);
      // Remove the last digit from n
      n = Math.floor(n / 10);
    }
    return reversed;
  }

  // Check all possible x values from 0 to num
  for (let x = 0; x <= num; x++) {
    // If x + reverse(x) equals num, we found a valid pair
    if (x + reverseNumber(x) === num) {
      return true;
    }
  }

  // If we checked all possibilities and found nothing
  return false;
}
```

```java
// Time: O(n log n) where n is the input number
// Space: O(1) - we only use constant extra space
class Solution {
    public boolean sumOfNumberAndReverse(int num) {
        // Check all possible x values from 0 to num
        for (int x = 0; x <= num; x++) {
            // If x + reverse(x) equals num, we found a valid pair
            if (x + reverseNumber(x) == num) {
                return true;
            }
        }

        // If we checked all possibilities and found nothing
        return false;
    }

    // Helper method to reverse an integer
    private int reverseNumber(int n) {
        int reversed = 0;
        // Process each digit from right to left
        while (n > 0) {
            // Get the last digit and add it to the reversed number
            reversed = reversed * 10 + (n % 10);
            // Remove the last digit from n
            n /= 10;
        }
        return reversed;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n) where n is the input number `num`.

- We iterate through n+1 possible values of x (from 0 to num)
- For each x, we compute its reverse, which takes O(log x) time (since the number of digits in x is proportional to log x)
- In the worst case, this gives us O(n log n) operations

**Space Complexity**: O(1)

- We only use a constant amount of extra space for variables like the reversed number
- No additional data structures that grow with input size

For the given constraints (num ≤ 10^5), this is efficient enough, with at most 100,000 iterations and each reverse operation taking at most 6 steps (since 10^5 has 6 digits).

## Common Mistakes

1. **Not handling the case when x = 0**: Some implementations might skip 0, but 0 + 0 = 0 is a valid pair when num = 0. Always include 0 in your search range.

2. **Inefficient reverse implementation**: Some candidates convert to string, reverse, then convert back. While this works, it's less efficient than the mathematical approach shown above. The mathematical approach is both faster and demonstrates better algorithmic thinking.

3. **Searching beyond necessary bounds**: While checking up to `num` is correct, some candidates might check up to `10 * num` or use other incorrect bounds. Remember that if `x > num`, then `x + reverse(x) > num`, so we never need to check beyond `num`.

4. **Forgetting that num can be 0**: The problem states non-negative integers, which includes 0. The solution should return `true` for num = 0 because 0 + 0 = 0.

## When You'll See This Pattern

This problem uses a **bounded enumeration** pattern combined with a **mathematical transformation** (reversing digits). You'll see similar patterns in:

1. **Palindrome Number (LeetCode 9)**: Also involves reversing digits to check if a number reads the same forwards and backwards.

2. **Happy Number (LeetCode 202)**: Involves repeatedly applying a mathematical transformation (sum of squares of digits) until reaching a cycle or 1.

3. **Sum of Numbers With Units Digit K (LeetCode 2310)**: Similar mathematical constraint satisfaction problem where you need to find numbers that satisfy a specific digit-related property.

The core technique is recognizing when brute force enumeration is acceptable due to reasonable bounds, and implementing efficient helper functions for digit manipulation.

## Key Takeaways

1. **Bounded enumeration is often sufficient**: When the input size is reasonably constrained (like n ≤ 10^5), a straightforward O(n) or O(n log n) solution is usually acceptable and easier to implement correctly.

2. **Mathematical digit manipulation is efficient**: Reversing digits mathematically (using modulo and division) is more efficient than string conversion and demonstrates stronger algorithmic skills.

3. **Check edge cases systematically**: Always test with 0, with single-digit numbers, and with the maximum allowed input to ensure your solution handles all cases correctly.

Related problems: [Sum of Numbers With Units Digit K](/problem/sum-of-numbers-with-units-digit-k)
