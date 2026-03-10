---
title: "How to Solve Find Numbers with Even Number of Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Numbers with Even Number of Digits. Easy difficulty, 79.7% acceptance rate. Topics: Array, Math."
date: "2026-10-06"
category: "dsa-patterns"
tags: ["find-numbers-with-even-number-of-digits", "array", "math", "easy"]
---

# How to Solve Find Numbers with Even Number of Digits

This problem asks us to count how many integers in an array have an even number of digits. While it seems straightforward, the challenge lies in efficiently determining the digit count of each number without converting to strings or using expensive operations. The key insight is that we can use mathematical properties to find digit counts in constant time.

## Visual Walkthrough

Let's trace through the example `nums = [12, 345, 2, 6, 7896]`:

1. **12**: Has 2 digits → even → count becomes 1
2. **345**: Has 3 digits → odd → count stays 1
3. **2**: Has 1 digit → odd → count stays 1
4. **6**: Has 1 digit → odd → count stays 1
5. **7896**: Has 4 digits → even → count becomes 2

Final answer: 2

The question is: how do we efficiently determine that 12 has 2 digits, 345 has 3 digits, etc.? We could convert each number to a string and check its length, but there's a more mathematical approach using logarithms or repeated division.

## Brute Force Approach

The most intuitive approach is to convert each number to a string and check if the string length is even:

1. Initialize a counter to 0
2. For each number in the array:
   - Convert the number to a string
   - Check if the string length is even
   - If yes, increment the counter
3. Return the counter

While this works, it's not the most efficient approach because:

- String conversion creates new objects for each number
- The time complexity is O(n × d) where d is the average number of digits
- It uses extra memory for all the string representations

However, for an interview, mentioning this approach shows you can think of multiple solutions, even if you then optimize it.

## Optimal Solution

The optimal solution uses mathematical properties to determine digit count without string conversion. We can use one of two approaches:

**Approach 1: Repeated division by 10**
Count how many times we can divide the number by 10 before reaching 0. For negative numbers, we need to handle the sign.

**Approach 2: Using logarithms**
The number of digits in a positive integer `n` is `floor(log10(n)) + 1`. This gives us a constant-time way to find digit count.

Here's the complete solution using both approaches:

<div class="code-group">

```python
# Time: O(n × d) where d is average number of digits | Space: O(1)
def findNumbers(nums):
    """
    Count numbers with even number of digits using repeated division.
    """
    count = 0

    for num in nums:
        # Handle negative numbers by taking absolute value
        num = abs(num)

        # Count digits by repeated division
        digit_count = 0
        if num == 0:
            digit_count = 1  # Special case: 0 has 1 digit
        else:
            while num > 0:
                digit_count += 1
                num //= 10  # Integer division by 10

        # Check if digit count is even
        if digit_count % 2 == 0:
            count += 1

    return count

# Time: O(n) | Space: O(1) - More efficient using logarithms
def findNumbers_log(nums):
    """
    Count numbers with even number of digits using logarithms.
    This is more efficient for numbers with many digits.
    """
    import math

    count = 0

    for num in nums:
        # Handle negative numbers
        num = abs(num)

        # Special case for 0 (log10(0) is undefined)
        if num == 0:
            digit_count = 1
        else:
            # Number of digits = floor(log10(n)) + 1
            digit_count = math.floor(math.log10(num)) + 1

        # Check if digit count is even
        if digit_count % 2 == 0:
            count += 1

    return count
```

```javascript
// Time: O(n × d) where d is average number of digits | Space: O(1)
function findNumbers(nums) {
  let count = 0;

  for (let num of nums) {
    // Handle negative numbers by taking absolute value
    num = Math.abs(num);

    // Count digits by repeated division
    let digitCount = 0;
    if (num === 0) {
      digitCount = 1; // Special case: 0 has 1 digit
    } else {
      while (num > 0) {
        digitCount++;
        num = Math.floor(num / 10); // Integer division by 10
      }
    }

    // Check if digit count is even
    if (digitCount % 2 === 0) {
      count++;
    }
  }

  return count;
}

// Time: O(n) | Space: O(1) - More efficient using logarithms
function findNumbersLog(nums) {
  let count = 0;

  for (let num of nums) {
    // Handle negative numbers
    num = Math.abs(num);

    // Special case for 0 (Math.log10(0) is -Infinity)
    let digitCount;
    if (num === 0) {
      digitCount = 1;
    } else {
      // Number of digits = floor(log10(n)) + 1
      digitCount = Math.floor(Math.log10(num)) + 1;
    }

    // Check if digit count is even
    if (digitCount % 2 === 0) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n × d) where d is average number of digits | Space: O(1)
class Solution {
    public int findNumbers(int[] nums) {
        int count = 0;

        for (int num : nums) {
            // Handle negative numbers by taking absolute value
            num = Math.abs(num);

            // Count digits by repeated division
            int digitCount = 0;
            if (num == 0) {
                digitCount = 1;  // Special case: 0 has 1 digit
            } else {
                while (num > 0) {
                    digitCount++;
                    num /= 10;  // Integer division by 10
                }
            }

            // Check if digit count is even
            if (digitCount % 2 == 0) {
                count++;
            }
        }

        return count;
    }
}

// Time: O(n) | Space: O(1) - More efficient using logarithms
class SolutionLog {
    public int findNumbers(int[] nums) {
        int count = 0;

        for (int num : nums) {
            // Handle negative numbers
            num = Math.abs(num);

            // Special case for 0 (Math.log10(0) is undefined)
            int digitCount;
            if (num == 0) {
                digitCount = 1;
            } else {
                // Number of digits = floor(log10(n)) + 1
                digitCount = (int)Math.floor(Math.log10(num)) + 1;
            }

            // Check if digit count is even
            if (digitCount % 2 == 0) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Repeated division approach:** O(n × d), where n is the number of elements in the array and d is the average number of digits. In the worst case (when numbers have many digits), this can approach O(n × log₁₀(max_num)).
- **Logarithm approach:** O(n), since each logarithm calculation is O(1). This is more efficient for numbers with many digits.

**Space Complexity:**

- Both approaches use O(1) extra space. We only need a few variables (counter, temporary variables for digit counting), regardless of input size.

## Common Mistakes

1. **Not handling negative numbers:** Forgetting to take the absolute value before counting digits. Negative numbers like -12 also have 2 digits, but if we don't handle the sign, we might get incorrect results or infinite loops.

2. **Edge case with 0:** Forgetting that 0 has 1 digit (not 0). In the repeated division approach, `while (num > 0)` would skip 0 entirely. In the logarithm approach, `log10(0)` is undefined.

3. **Using floating-point precision issues with logarithms:** When using the logarithm approach, very large numbers might have precision issues. The repeated division approach is more reliable for exact digit counting.

4. **Confusing digit count with number value:** Some candidates check if the number itself is even instead of checking if the digit count is even. For example, 12 has 2 digits (even) but 12 itself is also an even number, which can lead to confusion.

## When You'll See This Pattern

This problem teaches digit manipulation techniques that appear in many other problems:

1. **Palindrome Number (LeetCode 9):** Uses similar digit extraction to check if a number reads the same forwards and backwards.

2. **Reverse Integer (LeetCode 7):** Requires extracting digits from a number to reverse them while handling overflow.

3. **Armstrong Number (LeetCode 1134):** Involves counting digits and raising each digit to the power of the digit count.

4. **Add Digits (LeetCode 258):** Uses repeated digit sum operations, which requires digit extraction.

The pattern of extracting digits via division/modulo operations is fundamental to many number manipulation problems.

## Key Takeaways

1. **Digit counting has multiple approaches:** You can use string conversion (simple but less efficient), repeated division (reliable and easy to understand), or logarithms (mathematically elegant and efficient for large numbers).

2. **Always handle edge cases:** Zero and negative numbers require special attention in digit manipulation problems. Test your solution with 0, negative numbers, and the minimum/maximum possible values.

3. **Mathematical properties can optimize solutions:** Knowing that `digit_count = floor(log10(n)) + 1` for positive n gives a constant-time way to find digit count, which is valuable in interviews to show mathematical insight.

4. **The repeated division pattern is versatile:** The technique of `while (n > 0) { n //= 10; count++; }` appears in many problems involving digit manipulation, palindrome checking, and number reversal.

Related problems: [Finding 3-Digit Even Numbers](/problem/finding-3-digit-even-numbers), [Number of Even and Odd Bits](/problem/number-of-even-and-odd-bits), [Find if Digit Game Can Be Won](/problem/find-if-digit-game-can-be-won)
