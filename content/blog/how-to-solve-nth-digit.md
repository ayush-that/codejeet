---
title: "How to Solve Nth Digit — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Nth Digit. Medium difficulty, 37.3% acceptance rate. Topics: Math, Binary Search."
date: "2026-12-31"
category: "dsa-patterns"
tags: ["nth-digit", "math", "binary-search", "medium"]
---

# How to Solve Nth Digit

You need to find the nth digit in the infinite sequence formed by concatenating all positive integers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... This problem is tricky because you can't actually build the sequence (it's infinite), and the digit you need could be buried deep inside a large number. The challenge is to mathematically determine which number contains the nth digit and which position within that number holds it.

## Visual Walkthrough

Let's trace through an example with n = 15 to build intuition:

The sequence: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16...
Digits: 1 2 3 4 5 6 7 8 9 1 0 1 1 1 2 1 3 1 4 1 5 1 6...

We want the 15th digit. Let's count:

- Digits 1-9 come from numbers 1-9 (9 numbers × 1 digit each = 9 digits)
- Digits 10-? come from numbers 10-99 (90 numbers × 2 digits each = 180 digits)

Since n=15 > 9, we know our digit is in a 2-digit number. We've used 9 digits for the single-digit numbers, so we need the (15-9) = 6th digit in the 2-digit number sequence.

The 2-digit numbers start at 10. The 6th digit in this sequence:

- Number 10: digits '1','0' (positions 1-2 in 2-digit sequence)
- Number 11: digits '1','1' (positions 3-4)
- Number 12: digits '1','2' (positions 5-6)

The 6th digit is the second digit of number 12, which is '2'. So the answer is 2.

The key insight: we need to determine:

1. How many digits the target number has (digit length)
2. Which specific number contains our digit
3. Which digit within that number

## Brute Force Approach

The naive approach would be to actually build the sequence digit by digit until we reach the nth digit:

<div class="code-group">

```python
# Time: O(10^n) - Exponential and impractical
# Space: O(1)
def findNthDigit_brute(n):
    count = 0
    num = 1

    while True:
        # Convert number to string and iterate through its digits
        for digit in str(num):
            count += 1
            if count == n:
                return int(digit)
        num += 1
```

```javascript
// Time: O(10^n) - Exponential and impractical
// Space: O(1)
function findNthDigitBrute(n) {
  let count = 0;
  let num = 1;

  while (true) {
    // Convert number to string and iterate through its digits
    const str = num.toString();
    for (let i = 0; i < str.length; i++) {
      count++;
      if (count === n) {
        return parseInt(str[i]);
      }
    }
    num++;
  }
}
```

```java
// Time: O(10^n) - Exponential and impractical
// Space: O(1)
public int findNthDigitBrute(int n) {
    int count = 0;
    int num = 1;

    while (true) {
        // Convert number to string and iterate through its digits
        String str = Integer.toString(num);
        for (int i = 0; i < str.length(); i++) {
            count++;
            if (count == n) {
                return str.charAt(i) - '0';
            }
        }
        num++;
    }
}
```

</div>

This brute force approach is completely impractical because:

- For n = 10^9, we'd need to iterate through billions of numbers
- The time complexity grows exponentially with n
- We'd run out of time and memory for even moderately large n

## Optimized Approach

The optimal solution uses mathematical reasoning instead of iteration. Here's the step-by-step reasoning:

1. **Group numbers by digit length**:
   - 1-digit numbers: 1-9 (9 numbers × 1 digit = 9 total digits)
   - 2-digit numbers: 10-99 (90 numbers × 2 digits = 180 total digits)
   - 3-digit numbers: 100-999 (900 numbers × 3 digits = 2700 total digits)
   - k-digit numbers: 9 × 10^(k-1) numbers × k digits

2. **Find which group contains the nth digit**:
   - Subtract the total digits of each group from n until n becomes smaller than the next group's total digits
   - This tells us how many digits the target number has

3. **Find the specific number**:
   - After determining the digit length (let's call it `digits`), we know:
     - First number with `digits` digits: `start = 10^(digits-1)`
     - How many digits we've used before this group: we've subtracted them already
     - The remaining `n` tells us the position within this group
     - The actual number = `start + (n-1) // digits` (integer division)

4. **Find the specific digit within the number**:
   - The position within the number = `(n-1) % digits`
   - Convert the number to string and get the character at that position

This approach runs in O(log₁₀ n) time because we only need to iterate through digit groups (and there are at most ~10 groups for 32-bit integers).

## Optimal Solution

<div class="code-group">

```python
# Time: O(log₁₀ n) - We iterate through digit length groups
# Space: O(log₁₀ n) - For string conversion of the target number
def findNthDigit(n):
    # Step 1: Determine how many digits the target number has
    digits = 1          # Start with 1-digit numbers
    count = 9           # How many numbers with current digit length: 9 for 1-digit
    start = 1           # First number with current digit length

    # Keep subtracting total digits of current group until n falls into current group
    while n > digits * count:
        n -= digits * count  # Remove digits of current group
        digits += 1          # Move to next digit length
        count *= 10          # 9 → 90 → 900 → ...
        start *= 10          # 1 → 10 → 100 → ...

    # Step 2: Find the specific number that contains the nth digit
    # n-1 because we want 0-based indexing for calculations
    # // digits gives us how many complete numbers to skip
    num = start + (n - 1) // digits

    # Step 3: Find the specific digit within that number
    # (n-1) % digits gives us the position within the number (0-based)
    digit_index = (n - 1) % digits

    # Convert to string and get the specific digit
    return int(str(num)[digit_index])
```

```javascript
// Time: O(log₁₀ n) - We iterate through digit length groups
// Space: O(log₁₀ n) - For string conversion of the target number
function findNthDigit(n) {
  // Step 1: Determine how many digits the target number has
  let digits = 1; // Start with 1-digit numbers
  let count = 9; // How many numbers with current digit length: 9 for 1-digit
  let start = 1; // First number with current digit length

  // Keep subtracting total digits of current group until n falls into current group
  while (n > digits * count) {
    n -= digits * count; // Remove digits of current group
    digits += 1; // Move to next digit length
    count *= 10; // 9 → 90 → 900 → ...
    start *= 10; // 1 → 10 → 100 → ...
  }

  // Step 2: Find the specific number that contains the nth digit
  // n-1 because we want 0-based indexing for calculations
  // Math.floor((n-1) / digits) gives us how many complete numbers to skip
  const num = start + Math.floor((n - 1) / digits);

  // Step 3: Find the specific digit within that number
  // (n-1) % digits gives us the position within the number (0-based)
  const digitIndex = (n - 1) % digits;

  // Convert to string and get the specific digit
  return parseInt(num.toString()[digitIndex]);
}
```

```java
// Time: O(log₁₀ n) - We iterate through digit length groups
// Space: O(log₁₀ n) - For string conversion of the target number
public int findNthDigit(int n) {
    // Step 1: Determine how many digits the target number has
    int digits = 1;          // Start with 1-digit numbers
    long count = 9;          // How many numbers with current digit length: 9 for 1-digit
    long start = 1;          // First number with current digit length

    // Keep subtracting total digits of current group until n falls into current group
    while (n > digits * count) {
        n -= digits * count;  // Remove digits of current group
        digits += 1;          // Move to next digit length
        count *= 10;          // 9 → 90 → 900 → ...
        start *= 10;          // 1 → 10 → 100 → ...
    }

    // Step 2: Find the specific number that contains the nth digit
    // n-1 because we want 0-based indexing for calculations
    // (n-1) / digits gives us how many complete numbers to skip
    long num = start + (n - 1) / digits;

    // Step 3: Find the specific digit within that number
    // (n-1) % digits gives us the position within the number (0-based)
    int digitIndex = (n - 1) % digits;

    // Convert to string and get the specific digit
    return Character.getNumericValue(Long.toString(num).charAt(digitIndex));
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log₁₀ n)**

- The while loop runs once for each digit length group
- For a 32-bit integer, n ≤ 2³¹ ≈ 2.1 billion
- The maximum number of digit groups is 10 (1-digit through 10-digit numbers)
- Each iteration does constant work

**Space Complexity: O(log₁₀ n)**

- We need to convert the target number to a string to extract the digit
- The string length equals the number of digits in the target number
- For n up to 2.1 billion, the target number has at most 10 digits

## Common Mistakes

1. **Off-by-one errors with indexing**: The most common mistake is forgetting to subtract 1 when calculating which number contains the digit and which position within that number. Remember: after we determine the digit length group, `n` represents a 1-based position within that group. We need to convert to 0-based for calculations: `(n-1) // digits` and `(n-1) % digits`.

2. **Integer overflow in count calculations**: When n is large (up to 2³¹), the intermediate calculations like `digits * count` can overflow 32-bit integers. Use 64-bit integers (long in Java/C++, long long in C) for these calculations. In the Java solution above, we use `long` for `count` and `start`.

3. **Infinite loop for edge cases**: For n = 1, the while loop condition `n > digits * count` is `1 > 1*9`, which is false, so we skip the loop. This is correct. But some implementations might incorrectly initialize or have wrong loop conditions that cause infinite loops for small n.

4. **Forgetting that n is 1-indexed**: The problem states "nth digit", meaning the first digit is at position 1, not 0. All our calculations need to account for this.

## When You'll See This Pattern

This "digit grouping" pattern appears in problems where you need to find patterns in sequences of numbers or digits:

1. **LeetCode 400 - Nth Digit**: This is the exact problem we just solved.

2. **LeetCode 233 - Number of Digit One**: Counts how many digit '1's appear in all numbers from 0 to n. Uses similar digit-by-digit analysis and grouping by digit positions.

3. **LeetCode 1012 - Numbers With Repeated Digits**: Counts numbers with at least one repeated digit. Uses digit DP (dynamic programming) with similar digit position analysis.

4. **LeetCode 902 - Numbers At Most N Given Digit Set**: Given a set of digits, count how many numbers ≤ n can be formed using only those digits. Uses digit-by-digit comparison.

The common thread is analyzing numbers digit by digit rather than as whole values, often using mathematical grouping based on digit length or position value.

## Key Takeaways

1. **When dealing with digit sequences, group by digit length**: Numbers with k digits occupy a predictable amount of space in the sequence (9 × 10^(k-1) × k digits). This lets you skip entire groups without iterating through them.

2. **Convert 1-based indexing to 0-based for calculations**: Most programming uses 0-based indexing, but problems often use 1-based positions. Remember to subtract 1 when doing division and modulus operations to find which number and which digit position.

3. **Watch for integer overflow in digit counting problems**: When n can be up to 2³¹, intermediate products like `digits × count` can exceed 32-bit limits. Use 64-bit integers for these calculations.

[Practice this problem on CodeJeet](/problem/nth-digit)
