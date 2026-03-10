---
title: "How to Solve Self Dividing Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Self Dividing Numbers. Easy difficulty, 80.6% acceptance rate. Topics: Math."
date: "2027-11-18"
category: "dsa-patterns"
tags: ["self-dividing-numbers", "math", "easy"]
---

# How to Solve Self Dividing Numbers

A self-dividing number is divisible by every digit it contains, and cannot contain the digit zero. Given a range `[left, right]`, we need to return all self-dividing numbers in that range. While this problem is mathematically straightforward, it's interesting because it tests your ability to break down numbers into digits and handle edge cases like zero digits and negative numbers (though inputs are non-negative here).

## Visual Walkthrough

Let's trace through an example with `left = 1` and `right = 22`:

**Step 1:** Start with number 1

- Digits: [1]
- Check: 1 % 1 = 0 ✓
- Result: [1]

**Step 2:** Number 2

- Digits: [2]
- Check: 2 % 2 = 0 ✓
- Result: [1, 2]

**Step 3:** Number 10

- Digits: [1, 0]
- Contains 0 → immediately reject
- Result: [1, 2] (no change)

**Step 4:** Number 11

- Digits: [1, 1]
- Check: 11 % 1 = 0 ✓
- Result: [1, 2, 11]

**Step 5:** Number 12

- Digits: [1, 2]
- Check: 12 % 1 = 0 ✓, 12 % 2 = 0 ✓
- Result: [1, 2, 11, 12]

**Step 6:** Number 13

- Digits: [1, 3]
- Check: 13 % 1 = 0 ✓, 13 % 3 = 1 ✗ (not divisible)
- Result: [1, 2, 11, 12] (no change)

Continuing this process up to 22, we get the final result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 22]

## Brute Force Approach

The brute force approach is actually optimal for this problem since we must check every number in the range. However, let's think about what a truly naive approach might look like:

A candidate might try to convert each number to a string, then to a list of characters, then to integers, and check divisibility. This works but is slightly less efficient than working directly with the number. Another naive approach might forget to handle the zero-digit case properly.

The key insight is that for each number `n` in `[left, right]`, we need to:

1. Extract each digit of `n`
2. Check if any digit is 0 (immediate disqualification)
3. Check if `n` is divisible by each digit

Since we must check every number in the range, and for each number we must check all its digits, there's no way to avoid O(n × d) time complexity where n is the range size and d is the average number of digits.

## Optimal Solution

The optimal solution iterates through each number in the range and checks if it's self-dividing. For each number, we extract digits using modulo operations and check divisibility. We can optimize slightly by breaking early when we find a disqualifying digit.

<div class="code-group">

```python
# Time: O(n * d) where n = right-left+1, d = average number of digits
# Space: O(1) excluding output array
def selfDividingNumbers(left, right):
    """
    Returns all self-dividing numbers in the range [left, right].

    A self-dividing number is divisible by every digit it contains
    and does not contain the digit zero.
    """
    result = []

    # Iterate through each number in the range
    for num in range(left, right + 1):
        temp = num  # Work with a copy so we don't modify the original

        # Check each digit of the number
        while temp > 0:
            digit = temp % 10  # Extract the last digit

            # If digit is 0 or num is not divisible by digit, break
            if digit == 0 or num % digit != 0:
                break

            temp //= 10  # Remove the last digit

        # If temp becomes 0, we successfully checked all digits
        if temp == 0:
            result.append(num)

    return result
```

```javascript
// Time: O(n * d) where n = right-left+1, d = average number of digits
// Space: O(1) excluding output array
function selfDividingNumbers(left, right) {
  const result = [];

  // Iterate through each number in the range
  for (let num = left; num <= right; num++) {
    let temp = num; // Work with a copy

    // Check each digit of the number
    while (temp > 0) {
      const digit = temp % 10; // Extract the last digit

      // If digit is 0 or num is not divisible by digit, break
      if (digit === 0 || num % digit !== 0) {
        break;
      }

      temp = Math.floor(temp / 10); // Remove the last digit
    }

    // If temp becomes 0, we successfully checked all digits
    if (temp === 0) {
      result.push(num);
    }
  }

  return result;
}
```

```java
// Time: O(n * d) where n = right-left+1, d = average number of digits
// Space: O(1) excluding output array
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> selfDividingNumbers(int left, int right) {
        List<Integer> result = new ArrayList<>();

        // Iterate through each number in the range
        for (int num = left; num <= right; num++) {
            int temp = num;  // Work with a copy

            // Check each digit of the number
            while (temp > 0) {
                int digit = temp % 10;  // Extract the last digit

                // If digit is 0 or num is not divisible by digit, break
                if (digit == 0 || num % digit != 0) {
                    break;
                }

                temp /= 10;  // Remove the last digit
            }

            // If temp becomes 0, we successfully checked all digits
            if (temp == 0) {
                result.add(num);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d) where n = right - left + 1 (the number of integers in the range) and d is the average number of digits per number. In the worst case, for numbers up to 10,000, d is at most 5, so this is effectively O(n).

**Space Complexity:** O(1) excluding the output array. We only use a few integer variables regardless of input size. The output array stores the result, but this is required by the problem specification and doesn't count toward auxiliary space complexity in most interview contexts.

## Common Mistakes

1. **Forgetting to handle zero digits:** This is the most common mistake. Numbers containing 0 should be immediately rejected since division by zero is undefined. Candidates might check `num % digit == 0` without first checking if `digit == 0`, which would cause a runtime error in some languages or incorrect logic.

2. **Modifying the original number while checking digits:** If you modify `num` instead of using a temporary variable, you'll lose the original value needed for the divisibility check. Always work with a copy.

3. **Incorrect loop termination condition:** Some candidates check `while num > 0` instead of `while temp > 0`, which modifies the loop variable incorrectly. Others might use `for` loops with string conversion, which is less efficient.

4. **Off-by-one errors in range:** The problem says "inclusive range [left, right]", so you need to include `right` in your iteration. Using `<` instead of `<=` is a common oversight.

## When You'll See This Pattern

This problem uses digit extraction and modular arithmetic, which appear in many number theory and digit manipulation problems:

1. **Palindrome Number (LeetCode 9):** Similar digit extraction using `% 10` and `// 10` to reverse a number or compare digits.

2. **Armstrong Number (LeetCode 1134):** Also requires extracting digits and performing mathematical operations on them.

3. **Happy Number (LeetCode 202):** Uses digit extraction in a loop to compute the sum of squares of digits.

4. **Add Digits (LeetCode 258):** Another digit manipulation problem that can be solved with mathematical insight or brute force digit extraction.

The pattern of `while (n > 0) { digit = n % 10; n //= 10; }` is a standard idiom for iterating through digits from right to left.

## Key Takeaways

1. **Digit extraction pattern:** The `digit = n % 10; n = n // 10` pattern in a while loop is fundamental for many number manipulation problems. Remember to work with a copy if you need the original value later.

2. **Early termination optimization:** When checking conditions across multiple elements (digits in this case), break early as soon as you find a disqualifying condition. This doesn't change worst-case complexity but improves average-case performance.

3. **Edge case awareness:** Always consider zero digits in divisibility problems. Division by zero is mathematically undefined and often causes runtime errors.

4. **Range inclusivity:** Pay close attention to whether ranges are inclusive or exclusive. The notation `[left, right]` means both endpoints are included.

Related problems: [Perfect Number](/problem/perfect-number), [Check if Number Has Equal Digit Count and Digit Value](/problem/check-if-number-has-equal-digit-count-and-digit-value), [Count the Digits That Divide a Number](/problem/count-the-digits-that-divide-a-number)
