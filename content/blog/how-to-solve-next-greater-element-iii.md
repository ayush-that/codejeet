---
title: "How to Solve Next Greater Element III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Next Greater Element III. Medium difficulty, 35.2% acceptance rate. Topics: Math, Two Pointers, String."
date: "2028-09-13"
category: "dsa-patterns"
tags: ["next-greater-element-iii", "math", "two-pointers", "string", "medium"]
---

# How to Solve Next Greater Element III

This problem asks us to find the smallest integer greater than `n` that uses exactly the same digits. If no such number exists, we return `-1`. The challenge lies in efficiently rearranging digits to find the next lexicographically greater permutation without brute-forcing all possible arrangements.

## Visual Walkthrough

Let's trace through an example: `n = 12443322`

**Step 1: Convert to a mutable format**
We'll work with the digits as a list: `[1, 2, 4, 4, 3, 3, 2, 2]`

**Step 2: Find the first decreasing element from the right**
We scan from right to left looking for the first digit that's smaller than the one to its right:

- Compare 2 and 2: equal, move left
- Compare 3 and 2: 3 > 2, move left
- Compare 4 and 3: 4 > 3, move left
- Compare 2 and 4: 2 < 4 ✓ Found it! Index 1 (value 2)

This "dip" at index 1 means we can create a larger number by swapping the digit at this position with a slightly larger digit from the right.

**Step 3: Find the smallest larger digit to the right**
To the right of index 1, we have `[4, 4, 3, 3, 2, 2]`. We need the smallest digit that's larger than 2:

- Scan from right to left: 2, 2, 3, 3, 4, 4
- First digit > 2 from the right is 3 at index 4

**Step 4: Swap the two digits**
Swap index 1 (2) with index 4 (3):
`[1, 3, 4, 4, 2, 3, 2, 2]`

**Step 5: Reverse the suffix**
The digits to the right of index 1 are currently `[4, 4, 2, 3, 2, 2]`. To get the smallest possible number, we need to sort this suffix in ascending order. Since it's already in descending order except for our swap, we can simply reverse it:
Reverse `[4, 4, 2, 3, 2, 2]` to get `[2, 2, 3, 2, 4, 4]`

Final digits: `[1, 3, 2, 2, 3, 2, 4, 4]` = 13223244

**Verification**: 13223244 > 12443322 and uses the same digits. It's the smallest such number because we made the minimal possible increase at the leftmost position.

## Brute Force Approach

A naive approach would be to:

1. Generate all permutations of the digits
2. Sort them numerically
3. Find the next number greater than `n`
4. Check if it fits in 32-bit integer range

This approach has factorial time complexity O(n!) where n is the number of digits. For a 10-digit number, that's 3.6 million permutations - far too slow. Even with optimizations like early stopping, we'd still need to generate many permutations.

The key insight is that we don't need all permutations - we just need to find the next lexicographic permutation, which follows a predictable pattern.

## Optimized Approach

The optimal solution uses the "next permutation" algorithm, which works in three steps:

1. **Find the pivot**: Starting from the right, find the first digit that's smaller than the digit to its right. This is where we can make the number larger.

2. **Find the successor**: To the right of the pivot, find the smallest digit that's larger than the pivot digit. This will be swapped with the pivot to create a larger number.

3. **Reverse the suffix**: After swapping, the digits to the right of the pivot are in descending order. Reversing them puts them in ascending order, giving us the smallest possible number with the new prefix.

This algorithm is efficient because:

- It processes digits from right to left (O(n) time)
- It only needs to reverse a suffix (O(n) time)
- No sorting or permutation generation needed

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of digits | Space: O(n) for the digit list
def nextGreaterElement(n: int) -> int:
    """
    Find the smallest integer greater than n with the same digits.
    Returns -1 if no such number exists or if it exceeds 32-bit integer range.
    """
    # Step 1: Convert integer to list of characters for easy manipulation
    digits = list(str(n))
    length = len(digits)

    # Step 2: Find the first decreasing element from the right (pivot)
    i = length - 2
    while i >= 0 and digits[i] >= digits[i + 1]:
        i -= 1

    # If no decreasing element found, the digits are in descending order
    # This means n is the largest possible permutation
    if i == -1:
        return -1

    # Step 3: Find the smallest digit to the right that's larger than digits[i]
    j = length - 1
    while j > i and digits[j] <= digits[i]:
        j -= 1

    # Step 4: Swap the pivot with the next larger digit
    digits[i], digits[j] = digits[j], digits[i]

    # Step 5: Reverse the suffix (digits after position i)
    # The suffix is currently in descending order, reversing makes it ascending
    left, right = i + 1, length - 1
    while left < right:
        digits[left], digits[right] = digits[right], digits[left]
        left += 1
        right -= 1

    # Step 6: Convert back to integer and check 32-bit range
    result = int(''.join(digits))

    # Check if result fits in 32-bit signed integer range
    # Also check if result is actually greater than n (should be, but good to verify)
    if result > 2**31 - 1 or result <= n:
        return -1

    return result
```

```javascript
// Time: O(n) where n is number of digits | Space: O(n) for the digit array
function nextGreaterElement(n) {
  /**
   * Find the smallest integer greater than n with the same digits.
   * Returns -1 if no such number exists or if it exceeds 32-bit integer range.
   */
  // Step 1: Convert integer to array of characters for easy manipulation
  let digits = n.toString().split("");
  const length = digits.length;

  // Step 2: Find the first decreasing element from the right (pivot)
  let i = length - 2;
  while (i >= 0 && digits[i] >= digits[i + 1]) {
    i--;
  }

  // If no decreasing element found, the digits are in descending order
  // This means n is the largest possible permutation
  if (i === -1) {
    return -1;
  }

  // Step 3: Find the smallest digit to the right that's larger than digits[i]
  let j = length - 1;
  while (j > i && digits[j] <= digits[i]) {
    j--;
  }

  // Step 4: Swap the pivot with the next larger digit
  [digits[i], digits[j]] = [digits[j], digits[i]];

  // Step 5: Reverse the suffix (digits after position i)
  // The suffix is currently in descending order, reversing makes it ascending
  let left = i + 1;
  let right = length - 1;
  while (left < right) {
    [digits[left], digits[right]] = [digits[right], digits[left]];
    left++;
    right--;
  }

  // Step 6: Convert back to integer and check 32-bit range
  const result = parseInt(digits.join(""), 10);

  // Check if result fits in 32-bit signed integer range (2^31 - 1 = 2147483647)
  // Also check if result is actually greater than n (should be, but good to verify)
  if (result > 2147483647 || result <= n) {
    return -1;
  }

  return result;
}
```

```java
// Time: O(n) where n is number of digits | Space: O(n) for the char array
class Solution {
    public int nextGreaterElement(int n) {
        /**
         * Find the smallest integer greater than n with the same digits.
         * Returns -1 if no such number exists or if it exceeds 32-bit integer range.
         */
        // Step 1: Convert integer to char array for easy manipulation
        char[] digits = Integer.toString(n).toCharArray();
        int length = digits.length;

        // Step 2: Find the first decreasing element from the right (pivot)
        int i = length - 2;
        while (i >= 0 && digits[i] >= digits[i + 1]) {
            i--;
        }

        // If no decreasing element found, the digits are in descending order
        // This means n is the largest possible permutation
        if (i == -1) {
            return -1;
        }

        // Step 3: Find the smallest digit to the right that's larger than digits[i]
        int j = length - 1;
        while (j > i && digits[j] <= digits[i]) {
            j--;
        }

        // Step 4: Swap the pivot with the next larger digit
        char temp = digits[i];
        digits[i] = digits[j];
        digits[j] = temp;

        // Step 5: Reverse the suffix (digits after position i)
        // The suffix is currently in descending order, reversing makes it ascending
        int left = i + 1;
        int right = length - 1;
        while (left < right) {
            temp = digits[left];
            digits[left] = digits[right];
            digits[right] = temp;
            left++;
            right--;
        }

        // Step 6: Convert back to long to check 32-bit range
        long result = Long.parseLong(new String(digits));

        // Check if result fits in 32-bit signed integer range
        // Also check if result is actually greater than n (should be, but good to verify)
        if (result > Integer.MAX_VALUE || result <= n) {
            return -1;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes from right to left: one to find the pivot (O(n)), and one to find the successor (O(n))
- Reversing the suffix takes O(n) time in the worst case
- Total: O(n) where n is the number of digits

**Space Complexity: O(n)**

- We need to store the digits as a list/array for manipulation
- In-place modification would be O(1), but converting to string/list adds O(n) space

## Common Mistakes

1. **Forgetting the 32-bit integer constraint**: The problem explicitly states the result must fit in a 32-bit integer. Candidates often calculate the next permutation correctly but forget to check if it exceeds 2^31-1. Always convert to a 64-bit type (long in Java, BigInt in JavaScript) before the range check.

2. **Incorrect comparison operators in the while loops**: Using `>` instead of `>=` or vice versa can cause issues with duplicate digits. For example, when finding the pivot, we need `digits[i] >= digits[i + 1]` (not `>`) to handle equal digits correctly.

3. **Not handling the case where no greater number exists**: When all digits are in descending order (e.g., 4321), there's no greater permutation. The algorithm should return -1. This happens when `i` becomes -1 in the first while loop.

4. **Reversing instead of sorting the suffix**: After swapping, the suffix is in descending order. Some candidates try to sort it, which takes O(n log n) time. Simply reversing it is sufficient and takes O(n) time.

## When You'll See This Pattern

The "next permutation" algorithm appears in several problems:

1. **Next Permutation (LeetCode 31)**: The exact same algorithm - find next lexicographic permutation of an array.

2. **Next Greater Element I (LeetCode 496)**: While this problem uses a monotonic stack, it shares the "next greater" concept.

3. **Next Greater Element II (LeetCode 503)**: Circular version of the next greater element problem.

4. **Next Palindrome Using Same Digits (LeetCode 1842)**: Similar concept but for creating palindromes - you need to find the next permutation of the first half.

The pattern is recognizable when you need to find the "next" something in lexicographic or numeric order without generating all possibilities.

## Key Takeaways

1. **The next permutation algorithm has three steps**: find pivot, find successor, reverse suffix. Memorize this pattern as it's widely applicable.

2. **Work from right to left**: Many array manipulation problems are easier when processed from the end, especially when looking for "next" elements.

3. **Handle duplicates carefully**: Use `>=` and `<=` comparisons (not just `>` and `<`) to correctly handle equal digits.

4. **Always check constraints**: Don't just solve the algorithmic part - verify that your solution meets all problem requirements (like 32-bit range).

Related problems: [Next Greater Element I](/problem/next-greater-element-i), [Next Greater Element II](/problem/next-greater-element-ii), [Next Palindrome Using Same Digits](/problem/next-palindrome-using-same-digits)
