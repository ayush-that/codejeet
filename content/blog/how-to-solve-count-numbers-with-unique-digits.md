---
title: "How to Solve Count Numbers with Unique Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Numbers with Unique Digits. Medium difficulty, 55.4% acceptance rate. Topics: Math, Dynamic Programming, Backtracking."
date: "2026-03-19"
category: "dsa-patterns"
tags: ["count-numbers-with-unique-digits", "math", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Count Numbers with Unique Digits

This problem asks us to count all numbers with unique digits in the range `[0, 10^n)`. For example, when `n = 2`, we need to count numbers from 0 to 99 where all digits are distinct. The challenge lies in efficiently counting these numbers without brute-forcing through all possibilities, especially when `n` can be up to 8 (which would involve checking 100 million numbers).

## Visual Walkthrough

Let's trace through `n = 2` to build intuition:

We need to count numbers from 0 to 99 with all unique digits. Let's break this down:

**Single-digit numbers (0-9):** All 10 numbers have unique digits since they only have one digit.

**Two-digit numbers (10-99):** For a number like 23, digits 2 and 3 are unique. But 11 has repeating digits (1 and 1), so it doesn't count.

How many two-digit numbers have unique digits?

- First digit (tens place): Can be 1-9 (9 choices, can't be 0)
- Second digit (ones place): Can be 0-9 except the first digit (10 - 1 = 9 choices)
- Total: 9 × 9 = 81

So for `n = 2`:

- Count for 1-digit numbers: 10
- Count for 2-digit numbers: 81
- Total: 10 + 81 = 91

We can verify: Numbers 0-9 (10 numbers) plus valid two-digit numbers (81 numbers) = 91 total.

## Brute Force Approach

A naive approach would be to iterate through all numbers from 0 to `10^n - 1` and check each one for unique digits:

1. For each number in range `[0, 10^n)`
2. Convert to string or extract digits
3. Check if all digits are unique using a set or frequency array
4. Increment count if valid

The problem with this approach is its time complexity: `O(10^n × n)`. For `n = 8`, that's checking 100 million numbers, each with up to 8 digits - far too slow.

<div class="code-group">

```python
# Time: O(10^n × n) | Space: O(n)
def countNumbersWithUniqueDigits_brute(n):
    count = 0
    max_num = 10 ** n

    for num in range(max_num):
        digits = str(num)
        if len(set(digits)) == len(digits):
            count += 1

    return count
```

```javascript
// Time: O(10^n × n) | Space: O(n)
function countNumbersWithUniqueDigitsBrute(n) {
  let count = 0;
  const maxNum = Math.pow(10, n);

  for (let num = 0; num < maxNum; num++) {
    const digits = num.toString();
    const uniqueDigits = new Set(digits);
    if (uniqueDigits.size === digits.length) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(10^n × n) | Space: O(n)
public int countNumbersWithUniqueDigitsBrute(int n) {
    int count = 0;
    int maxNum = (int)Math.pow(10, n);

    for (int num = 0; num < maxNum; num++) {
        String digits = Integer.toString(num);
        Set<Character> uniqueDigits = new HashSet<>();
        for (char c : digits.toCharArray()) {
            uniqueDigits.add(c);
        }
        if (uniqueDigits.size() == digits.length()) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can count valid numbers **combinatorially** rather than checking each number individually. For numbers with `k` digits (where `1 ≤ k ≤ n`):

1. **First digit**: Can be 1-9 (9 choices, can't be 0)
2. **Second digit**: Can be 0-9 except the first digit (10 - 1 = 9 choices)
3. **Third digit**: Can be 0-9 except the first two digits (10 - 2 = 8 choices)
4. Continue this pattern...

So for `k`-digit numbers:

- If `k = 1`: 10 choices (0-9)
- If `k > 1`: 9 × 9 × 8 × 7 × ... × (10 - k + 1)

The total count for `n` is the sum of counts for all `k` from 1 to `n`, plus 1 for the number 0 (which we handle separately in our formula).

This is a **dynamic programming** approach where we build up the solution incrementally, or we can compute it directly using combinatorial multiplication.

## Optimal Solution

We can implement this efficiently by iterating from `k = 1` to `n`, multiplying choices at each step. Notice that for `k > 10`, there are no valid numbers since we only have 10 digits (0-9) and need all unique - once we try to form an 11-digit number, we must repeat at least one digit.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countNumbersWithUniqueDigits(n):
    # Handle edge case: n > 10 has same result as n = 10
    if n == 0:
        return 1  # Only number 0

    # For 1-digit numbers: 0-9 (10 numbers)
    total = 10
    # For numbers with exactly k digits (k > 1)
    unique_digit_count = 9  # Start with choices for first digit (1-9)
    available_digits = 9    # Remaining digits after choosing first

    # Calculate for k = 2 to min(n, 10)
    for k in range(2, min(n, 10) + 1):
        # Multiply by available digits for current position
        unique_digit_count *= available_digits
        # Add to total count
        total += unique_digit_count
        # Decrease available digits for next position
        available_digits -= 1

    return total
```

```javascript
// Time: O(n) | Space: O(1)
function countNumbersWithUniqueDigits(n) {
  // Handle edge case: n > 10 has same result as n = 10
  if (n === 0) {
    return 1; // Only number 0
  }

  // For 1-digit numbers: 0-9 (10 numbers)
  let total = 10;
  // For numbers with exactly k digits (k > 1)
  let uniqueDigitCount = 9; // Start with choices for first digit (1-9)
  let availableDigits = 9; // Remaining digits after choosing first

  // Calculate for k = 2 to min(n, 10)
  for (let k = 2; k <= Math.min(n, 10); k++) {
    // Multiply by available digits for current position
    uniqueDigitCount *= availableDigits;
    // Add to total count
    total += uniqueDigitCount;
    // Decrease available digits for next position
    availableDigits--;
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
public int countNumbersWithUniqueDigits(int n) {
    // Handle edge case: n > 10 has same result as n = 10
    if (n == 0) {
        return 1;  // Only number 0
    }

    // For 1-digit numbers: 0-9 (10 numbers)
    int total = 10;
    // For numbers with exactly k digits (k > 1)
    int uniqueDigitCount = 9;  // Start with choices for first digit (1-9)
    int availableDigits = 9;   // Remaining digits after choosing first

    // Calculate for k = 2 to min(n, 10)
    for (int k = 2; k <= Math.min(n, 10); k++) {
        // Multiply by available digits for current position
        uniqueDigitCount *= availableDigits;
        // Add to total count
        total += uniqueDigitCount;
        // Decrease available digits for next position
        availableDigits--;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(min(n, 10))` or simply `O(1)` since `n` is bounded by 8 in practice, but theoretically `O(n)` for unbounded `n`.

- We iterate from `k = 2` to `min(n, 10)`, performing constant work in each iteration
- For `n > 10`, we stop at 10 since no numbers with 11+ digits can have all unique digits

**Space Complexity:** `O(1)`

- We only use a few integer variables regardless of input size
- No additional data structures that grow with input

## Common Mistakes

1. **Forgetting the n = 0 case**: When `n = 0`, the range is `[0, 1)`, which only includes 0. This should return 1, not 10.

2. **Not handling n > 10 correctly**: For `n > 10`, the count should be the same as for `n = 10` since you can't have 11-digit numbers with all unique digits (only 10 digits available). Always use `min(n, 10)` in your loop.

3. **Incorrect counting for single-digit numbers**: Remember that single-digit numbers (0-9) all have unique digits, giving us 10 valid numbers. Some candidates mistakenly start counting from two-digit numbers.

4. **Off-by-one errors in the product**: The formula is `9 × 9 × 8 × 7 × ...`. The first 9 is for the first digit (1-9), the second 9 is for the second digit (0-9 except first), then 8, then 7, etc. Double-check that you're multiplying the right numbers.

## When You'll See This Pattern

This combinatorial counting pattern appears in problems where you need to count configurations without brute force:

1. **Count Special Integers (LeetCode 2376)**: A harder version that counts numbers with unique digits up to a given number (not just powers of 10). Uses digit DP with combinatorial counting.

2. **Letter Combinations of a Phone Number (LeetCode 17)**: Similar combinatorial multiplication of choices at each position.

3. **Permutations (LeetCode 46)**: Counting permutations uses similar factorial-like calculations.

4. **Numbers At Most N Given Digit Set (LeetCode 902)**: Another digit DP problem with combinatorial counting for valid numbers.

The core technique is recognizing when you can compute counts mathematically rather than enumerating all possibilities, especially when dealing with permutations or combinations with constraints.

## Key Takeaways

1. **Combinatorial counting beats brute force**: When asked to count configurations, look for mathematical formulas or DP solutions rather than enumerating all possibilities.

2. **Break problems by digit length**: For digit-related problems, often the cleanest approach is to count numbers of each length separately and sum.

3. **Watch for digit constraints**: The "unique digits" constraint creates a factorial-like pattern (9 × 9 × 8 × ...) that's more efficient to compute than to verify for each number.

4. **Handle edge cases early**: Always check `n = 0` and `n > 10` cases before the main logic.

Related problems: [Count Special Integers](/problem/count-special-integers), [Count Numbers With Unique Digits II](/problem/count-numbers-with-unique-digits-ii)
