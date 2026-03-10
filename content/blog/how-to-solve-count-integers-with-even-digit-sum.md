---
title: "How to Solve Count Integers With Even Digit Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Integers With Even Digit Sum. Easy difficulty, 69.8% acceptance rate. Topics: Math, Simulation."
date: "2027-07-27"
category: "dsa-patterns"
tags: ["count-integers-with-even-digit-sum", "math", "simulation", "easy"]
---

# How to Solve Count Integers With Even Digit Sum

Given a positive integer `num`, we need to count how many positive integers from 1 to `num` (inclusive) have an even digit sum. While this problem seems straightforward, it's interesting because it reveals how a simple simulation can be optimized with mathematical insight. The challenge lies in recognizing the pattern that emerges when we analyze digit sums systematically.

## Visual Walkthrough

Let's trace through an example with `num = 12` to build intuition:

We need to check numbers 1 through 12:

- 1 → digit sum = 1 (odd)
- 2 → digit sum = 2 (even) ✓
- 3 → digit sum = 3 (odd)
- 4 → digit sum = 4 (even) ✓
- 5 → digit sum = 5 (odd)
- 6 → digit sum = 6 (even) ✓
- 7 → digit sum = 7 (odd)
- 8 → digit sum = 8 (even) ✓
- 9 → digit sum = 9 (odd)
- 10 → digit sum = 1+0 = 1 (odd)
- 11 → digit sum = 1+1 = 2 (even) ✓
- 12 → digit sum = 1+2 = 3 (odd)

Counting the checkmarks: 2, 4, 6, 8, 11 → that's 5 numbers with even digit sums.

Notice a pattern? Every other number seems to have an even digit sum. Let's verify:

- 1 (odd), 2 (even), 3 (odd), 4 (even)...
- But wait, 10 breaks the pattern: 9 (odd), 10 (odd), 11 (even)

The pattern isn't simply "every other number" because when we cross a tens boundary (like from 9 to 10), the digit sum changes unpredictably. However, there's still a mathematical relationship we can exploit.

## Brute Force Approach

The most straightforward approach is to iterate through all numbers from 1 to `num`, calculate each number's digit sum, and count those with even sums.

**Algorithm:**

1. Initialize `count = 0`
2. For each `i` from 1 to `num`:
   - Calculate digit sum of `i` by repeatedly extracting digits
   - If digit sum is even, increment `count`
3. Return `count`

**Why this works:** It directly implements the problem statement by checking every number.

**Why it's inefficient:** For `num = 10^6`, we need to process 1 million numbers, and for each number, we need to extract its digits. The digit extraction takes O(log₁₀ n) time per number, so the total time is O(n log n). While this might be acceptable for small inputs, we can do better with a mathematical observation.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1)
def countEven(num: int) -> int:
    count = 0

    # Check each number from 1 to num
    for i in range(1, num + 1):
        digit_sum = 0
        n = i

        # Calculate digit sum
        while n > 0:
            digit_sum += n % 10  # Add last digit
            n //= 10  # Remove last digit

        # Check if digit sum is even
        if digit_sum % 2 == 0:
            count += 1

    return count
```

```javascript
// Time: O(n log n) | Space: O(1)
function countEven(num) {
  let count = 0;

  // Check each number from 1 to num
  for (let i = 1; i <= num; i++) {
    let digitSum = 0;
    let n = i;

    // Calculate digit sum
    while (n > 0) {
      digitSum += n % 10; // Add last digit
      n = Math.floor(n / 10); // Remove last digit
    }

    // Check if digit sum is even
    if (digitSum % 2 === 0) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(1)
class Solution {
    public int countEven(int num) {
        int count = 0;

        // Check each number from 1 to num
        for (int i = 1; i <= num; i++) {
            int digitSum = 0;
            int n = i;

            // Calculate digit sum
            while (n > 0) {
                digitSum += n % 10;  // Add last digit
                n /= 10;  // Remove last digit
            }

            // Check if digit sum is even
            if (digitSum % 2 == 0) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Optimal Solution

The key insight is that digit sums alternate between even and odd in a predictable pattern. Let's analyze:

Consider numbers 1 through 10:

- Even digit sums: 2, 4, 6, 8 → 4 numbers
- That's exactly half of the first 10 numbers

What about 11 through 20?

- 11 (even), 12 (odd), 13 (even), 14 (odd), 15 (even), 16 (odd), 17 (even), 18 (odd), 19 (even), 20 (odd)
- Even digit sums: 11, 13, 15, 17, 19 → 5 numbers

Notice the pattern: In each block of 10 numbers, exactly half (5) have even digit sums. Why? Because when we add 1 to a number:

- If the last digit is not 9, the digit sum changes by +1 (parity flips)
- If the last digit is 9, the digit sum decreases by 8 (9→0) then +1 for the next digit, net change of -7 (parity flips)

So parity flips with each increment! This means numbers alternate between odd and even digit sums. Therefore, in any complete set of consecutive numbers, exactly half have even digit sums.

The only complication is when `num` is not a multiple of 10. We can calculate:

1. Count for complete tens: `(num // 10) * 5`
2. For the remaining numbers (1 through `num % 10`), we need to check if the first number in this partial set has an even digit sum

**Why this works mathematically:**

- Numbers 1-10: Pattern is O,E,O,E,O,E,O,E,O,E (O=odd digit sum, E=even)
- Numbers 11-20: The pattern continues because digit sum parity flips each time
- So every group of 10 has exactly 5 even-digit-sum numbers
- For the partial group at the end, we check the starting parity

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def countEven(num: int) -> int:
    # Count complete groups of 10 numbers
    # Each complete group has exactly 5 numbers with even digit sum
    count = (num // 10) * 5

    # Get the last digit and the remaining number after removing last digit
    last_digit = num % 10

    # Calculate digit sum of the tens part (num without last digit)
    tens_part = num // 10
    tens_digit_sum = 0
    while tens_part > 0:
        tens_digit_sum += tens_part % 10
        tens_part //= 10

    # Determine if the first number in our partial set has even digit sum
    # The first number is (num - last_digit) + 1
    # Its digit sum = tens_digit_sum + 1
    first_digit_sum = tens_digit_sum + 1

    # Count numbers in the partial set (1 to last_digit)
    # If first number has even digit sum, then in the sequence:
    # Even, Odd, Even, Odd... (alternating)
    # So count = ceil(last_digit / 2)
    # If first number has odd digit sum, then:
    # Odd, Even, Odd, Even... so count = floor(last_digit / 2)

    if first_digit_sum % 2 == 0:
        # First has even digit sum, pattern: E,O,E,O...
        # For last_digit numbers: E,O,E,O... (even at odd positions)
        # Count of evens = ceil(last_digit / 2)
        count += (last_digit + 1) // 2
    else:
        # First has odd digit sum, pattern: O,E,O,E...
        # Count of evens = floor(last_digit / 2)
        count += last_digit // 2

    # Subtract 1 if we counted 0 (since we start from 1, not 0)
    # When num ends with 0, we might have counted the 0
    if num % 10 == 0:
        count -= 1

    return count
```

```javascript
// Time: O(log n) | Space: O(1)
function countEven(num) {
  // Count complete groups of 10 numbers
  // Each complete group has exactly 5 numbers with even digit sum
  let count = Math.floor(num / 10) * 5;

  // Get the last digit
  const lastDigit = num % 10;

  // Calculate digit sum of the tens part
  let tensPart = Math.floor(num / 10);
  let tensDigitSum = 0;
  while (tensPart > 0) {
    tensDigitSum += tensPart % 10;
    tensPart = Math.floor(tensPart / 10);
  }

  // Determine parity of first number in partial set
  const firstDigitSum = tensDigitSum + 1;

  // Count numbers in partial set based on starting parity
  if (firstDigitSum % 2 === 0) {
    // First has even digit sum: E,O,E,O...
    count += Math.floor((lastDigit + 1) / 2);
  } else {
    // First has odd digit sum: O,E,O,E...
    count += Math.floor(lastDigit / 2);
  }

  // Adjust for case when num ends with 0
  if (num % 10 === 0) {
    count--;
  }

  return count;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    public int countEven(int num) {
        // Count complete groups of 10 numbers
        // Each complete group has exactly 5 numbers with even digit sum
        int count = (num / 10) * 5;

        // Get the last digit
        int lastDigit = num % 10;

        // Calculate digit sum of the tens part
        int tensPart = num / 10;
        int tensDigitSum = 0;
        while (tensPart > 0) {
            tensDigitSum += tensPart % 10;
            tensPart /= 10;
        }

        // Determine parity of first number in partial set
        int firstDigitSum = tensDigitSum + 1;

        // Count numbers in partial set based on starting parity
        if (firstDigitSum % 2 == 0) {
            // First has even digit sum: E,O,E,O...
            count += (lastDigit + 1) / 2;
        } else {
            // First has odd digit sum: O,E,O,E...
            count += lastDigit / 2;
        }

        // Adjust for case when num ends with 0
        if (num % 10 == 0) {
            count--;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We only need to calculate the digit sum of `num // 10`, which has O(log₁₀ n) digits
- All other operations are constant time
- This is significantly faster than the brute force O(n log n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors with inclusive range:** Forgetting that we need to include `num` itself in the count. Always test with `num = 1` (should return 0) and `num = 2` (should return 1).

2. **Incorrect handling of the 0 case:** When `num` ends with 0, we might accidentally count 0 as a positive integer. Remember: positive integers start from 1, not 0.

3. **Misunderstanding the alternating pattern:** Assuming the pattern resets at every power of 10. Actually, the parity continues across tens boundaries because when we go from 9 to 10, the digit sum changes from 9 to 1 (both odd), so the pattern continues: 9 (odd), 10 (odd), 11 (even).

4. **Forgetting to calculate tens digit sum:** When determining the starting parity for the partial set, we need the digit sum of the tens part, not just the last digit. For example, with `num = 123`, the tens part is 12 with digit sum 3, so the first number in the partial set (121) has digit sum 3+1=4 (even).

## When You'll See This Pattern

This problem teaches pattern recognition in digit manipulation problems. Similar patterns appear in:

1. **Sum of Digits in Base K** (LeetCode 1837): Instead of base 10, you work in arbitrary bases, but the concept of digit sums and their properties remains similar.

2. **Number of 1 Bits** (LeetCode 191): While about binary instead of decimal, it also involves analyzing digit/bit patterns and finding mathematical shortcuts instead of brute force.

3. **Add Digits** (LeetCode 258): The "digital root" problem where you repeatedly sum digits until getting a single digit. The optimal solution uses modulo 9 arithmetic instead of simulation.

The core technique is recognizing that operations on digits often have mathematical properties (like alternating parity) that allow O(1) or O(log n) solutions instead of O(n).

## Key Takeaways

1. **Look for mathematical patterns before coding:** When dealing with digit problems, always check if there's a mathematical property or pattern. Try small examples (1-20) to spot trends.

2. **Digit sum parity alternates:** Adding 1 to a number flips the parity of its digit sum (except in rare cases that still maintain the alternating pattern). This means in any consecutive sequence, even and odd digit sums alternate.

3. **Break problems into complete and partial sets:** When dealing with ranges, handle complete blocks (like groups of 10) with a formula, then handle the remainder separately. This is a common optimization technique.

Related problems: [Sum of Numbers With Units Digit K](/problem/sum-of-numbers-with-units-digit-k), [Sum of Digits of String After Convert](/problem/sum-of-digits-of-string-after-convert), [Number of Ways to Buy Pens and Pencils](/problem/number-of-ways-to-buy-pens-and-pencils)
