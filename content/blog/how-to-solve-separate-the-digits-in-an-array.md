---
title: "How to Solve Separate the Digits in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Separate the Digits in an Array. Easy difficulty, 80.8% acceptance rate. Topics: Array, Simulation."
date: "2027-06-08"
category: "dsa-patterns"
tags: ["separate-the-digits-in-an-array", "array", "simulation", "easy"]
---

# How to Solve "Separate the Digits in an Array"

This problem asks us to take an array of positive integers and return a new array containing all the digits from each number, preserving the order in which they appear. For example, given `[13, 25, 83]`, we should return `[1, 3, 2, 5, 8, 3]`. While conceptually straightforward, this problem tests your ability to manipulate numbers and arrays efficiently, and it reveals how you handle digit extraction—a fundamental skill that appears in many coding problems.

## Visual Walkthrough

Let's trace through the example `nums = [13, 25, 83, 7]` step by step:

1. **First number: 13**
   - Extract digits from 13: 1 and 3
   - Add them to our result: `[1, 3]`

2. **Second number: 25**
   - Extract digits from 25: 2 and 5
   - Add them to result: `[1, 3, 2, 5]`

3. **Third number: 83**
   - Extract digits from 83: 8 and 3
   - Add them to result: `[1, 3, 2, 5, 8, 3]`

4. **Fourth number: 7**
   - Extract digits from 7: just 7
   - Add it to result: `[1, 3, 2, 5, 8, 3, 7]`

The key insight is that for each number, we need to extract its digits in order. Since we process numbers left to right and extract digits left to right, the overall order is preserved automatically.

## Brute Force Approach

A naive approach might convert each number to a string, split it into characters, then convert each character back to an integer. While this works, it's not the most efficient in terms of memory and processing, though for this Easy problem it's actually acceptable. However, interviewers often prefer the mathematical approach using modulo and division, as it demonstrates deeper understanding of number manipulation.

What would be truly inefficient is pre-allocating a fixed-size array without knowing how many digits total we'll have, or using nested loops without proper digit extraction logic. The main challenge isn't algorithmic complexity (we must process every digit anyway), but writing clean, correct code.

## Optimal Solution

The optimal solution uses mathematical operations to extract digits. For each number:

1. Extract digits from right to left using modulo (`% 10`) and division (`// 10`)
2. Since this gives us digits in reverse order, we need to reverse them before adding to our result
3. Alternatively, we can extract digits and store them temporarily in reverse, then add them in correct order

Here's the implementation in three languages:

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = avg digits per number
# Space: O(n * d) for the output array
def separateDigits(nums):
    """
    Separates digits of each number in nums and returns them in order.

    Steps:
    1. Initialize empty result list
    2. For each number in nums:
        a. Extract digits using modulo and division
        b. Reverse the extracted digits (since we get them in reverse order)
        c. Add them to result
    3. Return result
    """
    result = []

    for num in nums:
        # Temporary list to store digits of current number
        digits = []

        # Extract digits from right to left
        # Special case: handle 0 separately (though problem says positive integers)
        if num == 0:
            digits.append(0)
        else:
            while num > 0:
                # Get last digit
                digit = num % 10
                digits.append(digit)
                # Remove last digit
                num //= 10

        # Reverse digits to get correct order (left to right)
        digits.reverse()

        # Add to final result
        result.extend(digits)

    return result
```

```javascript
// Time: O(n * d) where n = nums.length, d = avg digits per number
// Space: O(n * d) for the output array
function separateDigits(nums) {
  /**
   * Separates digits of each number in nums and returns them in order.
   *
   * Steps:
   * 1. Initialize empty result array
   * 2. For each number in nums:
   *    a. Extract digits using modulo and division
   *    b. Reverse the extracted digits (since we get them in reverse order)
   *    c. Add them to result
   * 3. Return result
   */
  const result = [];

  for (let num of nums) {
    // Temporary array to store digits of current number
    const digits = [];

    // Extract digits from right to left
    // Special case: handle 0 separately (though problem says positive integers)
    if (num === 0) {
      digits.push(0);
    } else {
      while (num > 0) {
        // Get last digit
        const digit = num % 10;
        digits.push(digit);
        // Remove last digit
        num = Math.floor(num / 10);
      }
    }

    // Reverse digits to get correct order (left to right)
    digits.reverse();

    // Add to final result
    result.push(...digits);
  }

  return result;
}
```

```java
// Time: O(n * d) where n = nums.length, d = avg digits per number
// Space: O(n * d) for the output array
import java.util.ArrayList;
import java.util.List;

class Solution {
    public int[] separateDigits(int[] nums) {
        /**
         * Separates digits of each number in nums and returns them in order.
         *
         * Steps:
         * 1. Initialize dynamic list for result
         * 2. For each number in nums:
         *    a. Extract digits using modulo and division
         *    b. Reverse the extracted digits (since we get them in reverse order)
         *    c. Add them to result
         * 3. Convert list to array and return
         */
        List<Integer> result = new ArrayList<>();

        for (int num : nums) {
            // Temporary list to store digits of current number
            List<Integer> digits = new ArrayList<>();

            // Extract digits from right to left
            // Special case: handle 0 separately (though problem says positive integers)
            if (num == 0) {
                digits.add(0);
            } else {
                while (num > 0) {
                    // Get last digit
                    int digit = num % 10;
                    digits.add(digit);
                    // Remove last digit
                    num /= 10;
                }
            }

            // Reverse digits to get correct order (left to right)
            for (int i = digits.size() - 1; i >= 0; i--) {
                result.add(digits.get(i));
            }
        }

        // Convert List<Integer> to int[]
        int[] answer = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            answer[i] = result.get(i);
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d), where n is the number of elements in `nums` and d is the average number of digits per number. We must process every digit of every number exactly once.

**Space Complexity:** O(n × d) for the output array, which stores all the separated digits. The auxiliary space (excluding output) is O(d) for the temporary digit storage, but since d is at most 10 for 32-bit integers, this is effectively O(1).

## Common Mistakes

1. **Forgetting to reverse digits:** When extracting digits using `num % 10`, you get digits from right to left (least significant to most significant). Forgetting to reverse them gives you the number backwards. Always test with a number like 123 to catch this.

2. **Not handling single-digit numbers correctly:** Some implementations might skip the while loop for numbers less than 10. Remember that `while (num > 0)` handles single-digit numbers correctly—it executes once, extracts the digit, then `num` becomes 0.

3. **Infinite loop with negative numbers:** The problem states "positive integers," but if you accidentally write `while (num != 0)` and get a negative number, you'll have an infinite loop. Always use `while (num > 0)` for positive numbers.

4. **Inefficient string conversion:** While converting to string and splitting works, interviewers often prefer the mathematical approach. If you use string conversion, be prepared to explain why it's acceptable (same time complexity, slightly more memory for strings).

## When You'll See This Pattern

Digit extraction is a fundamental technique that appears in many problems:

1. **Palindrome Number (LeetCode #9):** Check if a number is palindrome by reversing its digits using the same modulo/division technique.

2. **Reverse Integer (LeetCode #7):** Reverse the digits of an integer, handling overflow—uses the exact same digit extraction pattern.

3. **Add Digits (LeetCode #258):** Repeatedly sum digits until getting a single digit—requires extracting and summing digits.

4. **Armstrong Number (LeetCode #1134):** Check if sum of cubes of digits equals the number—requires digit extraction and power calculation.

The pattern is: use `% 10` to get the last digit, use `/ 10` (integer division) to remove it, repeat until the number becomes 0.

## Key Takeaways

1. **Digit extraction is a fundamental skill:** The modulo-division pattern (`num % 10` to get last digit, `num // 10` to remove it) is essential for many number manipulation problems.

2. **Order matters:** When extracting digits mathematically, you get them in reverse order (right to left). You'll often need to reverse them or process them differently depending on the problem requirements.

3. **Edge cases matter:** Always test with single-digit numbers, numbers ending with 0, and the largest possible input. For this problem, since numbers are positive, we don't need to handle negatives or zero (unless specified).

Related problems: [Count Integers With Even Digit Sum](/problem/count-integers-with-even-digit-sum), [Alternating Digit Sum](/problem/alternating-digit-sum)
