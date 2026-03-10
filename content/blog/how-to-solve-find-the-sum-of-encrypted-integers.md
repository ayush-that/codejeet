---
title: "How to Solve Find the Sum of Encrypted Integers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Sum of Encrypted Integers. Easy difficulty, 74.8% acceptance rate. Topics: Array, Math."
date: "2028-04-11"
category: "dsa-patterns"
tags: ["find-the-sum-of-encrypted-integers", "array", "math", "easy"]
---

# How to Solve Find the Sum of Encrypted Integers

This problem asks us to transform each integer in an array by replacing all its digits with its largest digit, then sum the transformed values. While conceptually straightforward, it tests your ability to decompose numbers into digits and reconstruct them—a fundamental skill for number manipulation problems. The interesting part is efficiently extracting the maximum digit without converting to strings, which some interviewers prefer.

## Visual Walkthrough

Let's walk through an example: `nums = [523, 213, 4]`

**Step 1: Process 523**

- Digits: 5, 2, 3
- Largest digit: 5
- Replace all digits with 5: 555
- So `encrypt(523) = 555`

**Step 2: Process 213**

- Digits: 2, 1, 3
- Largest digit: 3
- Replace all digits with 3: 333
- So `encrypt(213) = 333`

**Step 3: Process 4**

- Only one digit: 4
- Largest digit: 4
- Replace all digits with 4: 4
- So `encrypt(4) = 4`

**Step 4: Sum the results**

- 555 + 333 + 4 = 892

The key insight is that for a number with `d` digits and maximum digit `m`, the encrypted value is `m` repeated `d` times, which equals `m × (111...1)` with `d` ones. For example, 555 = 5 × 111, and 333 = 3 × 111.

## Brute Force Approach

A naive approach would convert each number to a string, find the maximum character, create a new string by repeating that character, then convert back to integer. While this works, it's inefficient in terms of string operations and memory allocation.

However, since this is an Easy problem with constraints that make even the "brute force" approach efficient enough (numbers up to 10^4, array length up to 50), there's no truly "too slow" solution. The main distinction is between approaches that use string conversion versus pure mathematical operations.

Some candidates might try to:

1. Store all possible encrypted values in a lookup table (inefficient for large numbers)
2. Use complex regex operations (overly complicated)
3. Forget to handle single-digit numbers as a special case

The cleanest approach uses mathematical operations to avoid string conversions entirely.

## Optimal Solution

The optimal solution processes each number by:

1. Finding the maximum digit (by repeatedly taking `num % 10` and `num //= 10`)
2. Counting the number of digits
3. Calculating the encrypted value as `max_digit × (10^digit_count - 1) / 9`
   - This works because `111...1` with `d` ones equals `(10^d - 1) / 9`
4. Summing all encrypted values

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = avg digits per number
# Space: O(1) - only using constant extra space
def sumOfEncryptedInt(nums):
    total = 0

    for num in nums:
        # Step 1: Find the maximum digit and count digits
        max_digit = 0
        digit_count = 0
        temp = num

        # Extract digits one by one from the right
        while temp > 0:
            current_digit = temp % 10  # Get rightmost digit
            max_digit = max(max_digit, current_digit)
            digit_count += 1
            temp //= 10  # Remove rightmost digit

        # Handle the case when num is 0 (though problem says positive integers)
        if digit_count == 0:
            digit_count = 1

        # Step 2: Calculate encrypted value
        # For d digits, we need max_digit repeated d times
        # This equals max_digit * (111...1) with d ones
        # And (111...1) = (10^d - 1) / 9
        ones = (10 ** digit_count - 1) // 9
        encrypted_value = max_digit * ones

        # Step 3: Add to total sum
        total += encrypted_value

    return total
```

```javascript
// Time: O(n * d) where n = nums.length, d = avg digits per number
// Space: O(1) - only using constant extra space
function sumOfEncryptedInt(nums) {
  let total = 0;

  for (let num of nums) {
    // Step 1: Find the maximum digit and count digits
    let maxDigit = 0;
    let digitCount = 0;
    let temp = num;

    // Extract digits one by one from the right
    while (temp > 0) {
      const currentDigit = temp % 10; // Get rightmost digit
      maxDigit = Math.max(maxDigit, currentDigit);
      digitCount++;
      temp = Math.floor(temp / 10); // Remove rightmost digit
    }

    // Handle the case when num is 0 (though problem says positive integers)
    if (digitCount === 0) {
      digitCount = 1;
    }

    // Step 2: Calculate encrypted value
    // For d digits, we need maxDigit repeated d times
    // This equals maxDigit * (111...1) with d ones
    // And (111...1) = (10^d - 1) / 9
    const ones = (Math.pow(10, digitCount) - 1) / 9;
    const encryptedValue = maxDigit * ones;

    // Step 3: Add to total sum
    total += encryptedValue;
  }

  return total;
}
```

```java
// Time: O(n * d) where n = nums.length, d = avg digits per number
// Space: O(1) - only using constant extra space
class Solution {
    public int sumOfEncryptedInt(int[] nums) {
        int total = 0;

        for (int num : nums) {
            // Step 1: Find the maximum digit and count digits
            int maxDigit = 0;
            int digitCount = 0;
            int temp = num;

            // Extract digits one by one from the right
            while (temp > 0) {
                int currentDigit = temp % 10;  // Get rightmost digit
                maxDigit = Math.max(maxDigit, currentDigit);
                digitCount++;
                temp /= 10;  // Remove rightmost digit
            }

            // Handle the case when num is 0 (though problem says positive integers)
            if (digitCount == 0) {
                digitCount = 1;
            }

            // Step 2: Calculate encrypted value
            // For d digits, we need maxDigit repeated d times
            // This equals maxDigit * (111...1) with d ones
            // And (111...1) = (10^d - 1) / 9
            int ones = (int)((Math.pow(10, digitCount) - 1) / 9);
            int encryptedValue = maxDigit * ones;

            // Step 3: Add to total sum
            total += encryptedValue;
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d), where n is the length of the input array and d is the average number of digits per number. For each number, we process each digit once to find the maximum digit and count digits. In the worst case, if all numbers have D digits, the complexity is O(n × D).

**Space Complexity:** O(1), as we only use a constant amount of extra space regardless of input size. The variables `max_digit`, `digit_count`, `temp`, and `total` use constant space.

The mathematical formula `(10^d - 1) / 9` is more efficient than building the number digit by digit, as it avoids additional loops or string concatenation.

## Common Mistakes

1. **Forgetting to handle single-digit numbers**: When `num < 10`, the while loop `while (temp > 0)` might not execute at all, leaving `digit_count = 0`. Always check for this edge case or initialize `digit_count = 1` when `num > 0`.

2. **Integer overflow with large digit counts**: When calculating `10^digit_count`, be mindful that for very large numbers (beyond problem constraints), this could overflow. In this problem, constraints are small enough that this isn't an issue.

3. **Using string conversion unnecessarily**: While converting to string, finding max character, and repeating it works, interviewers often prefer mathematical solutions for number manipulation problems. They demonstrate better understanding of numerical operations.

4. **Incorrect digit extraction order**: When using `num % 10` to get digits, remember you're getting digits from right to left. For finding the maximum digit, order doesn't matter, but if you needed to preserve digit order for other operations, you'd need to be careful.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Digit extraction and manipulation**: Problems that require examining or transforming individual digits of numbers. Similar problems include:
   - [Reverse Integer](https://leetcode.com/problems/reverse-integer/) - Extract digits and reconstruct in reverse order
   - [Palindrome Number](https://leetcode.com/problems/palindrome-number/) - Compare digits from both ends
   - [Add Digits](https://leetcode.com/problems/add-digits/) - Repeatedly sum digits until single digit

2. **Mathematical formula optimization**: Using mathematical insights to avoid explicit construction. Similar problems include:
   - [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits/) - Uses combinatorial formulas
   - [Nth Digit](https://leetcode.com/problems/nth-digit/) - Finds digits using mathematical ranges rather than iteration

The core technique of extracting digits with `% 10` and `//= 10` appears in many number-related problems and is worth memorizing.

## Key Takeaways

1. **Digit extraction pattern**: Use `while (num > 0)` with `digit = num % 10` and `num //= 10` (or `/=` with floor in JavaScript) to process digits from right to left. This works in any base by changing the divisor.

2. **Mathematical insight beats brute construction**: Instead of building the encrypted number digit by digit, recognize that `m` repeated `d` times equals `m × (10^d - 1)/9`. This kind of pattern recognition separates good candidates from great ones.

3. **Edge cases matter**: Always test with single-digit numbers, zero (even if not in constraints), and the minimum/maximum possible values. These catch off-by-one errors in digit counting.

Related problems: [Encrypt and Decrypt Strings](/problem/encrypt-and-decrypt-strings)
