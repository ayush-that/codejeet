---
title: "How to Solve Split With Minimum Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Split With Minimum Sum. Easy difficulty, 73.3% acceptance rate. Topics: Math, Greedy, Sorting."
date: "2028-07-13"
category: "dsa-patterns"
tags: ["split-with-minimum-sum", "math", "greedy", "sorting", "easy"]
---

# How to Solve Split With Minimum Sum

We need to split a positive integer into two non-negative integers using all of its digits exactly once, then minimize their sum. The challenge is that we can't just split the number in half — we must rearrange digits between the two numbers to create the smallest possible sum. This problem tests your ability to recognize that minimizing the sum comes from distributing digits evenly between the two numbers, with the smallest digits going to the most significant positions.

## Visual Walkthrough

Let's trace through an example: `num = 4325`

**Step 1: Extract and sort digits**
We get digits: [4, 3, 2, 5]
Sort them: [2, 3, 4, 5]

**Step 2: Distribute digits to minimize sum**
We want to build two numbers from these digits. To minimize their sum, we should:

1. Give the smallest digits the most significant positions
2. Alternate giving digits to each number

Sorted digits: [2, 3, 4, 5]

- Give 2 to first number (num1)
- Give 3 to second number (num2)
- Give 4 to first number (num1 now: 24)
- Give 5 to second number (num2 now: 35)

Result: num1 = 24, num2 = 35, sum = 59

**Step 3: Verify this is minimal**
If we tried other distributions:

- 23 + 45 = 68 (larger)
- 25 + 34 = 59 (same as our result)
- 2 + 345 = 347 (much larger)

The alternating distribution ensures both numbers are as small as possible because smaller digits get more significant positions in both numbers.

## Brute Force Approach

A naive approach would be to:

1. Generate all permutations of the digits
2. For each permutation, try all possible split points
3. Calculate the sum for each split
4. Track the minimum sum found

This approach has factorial time complexity (O(n!)) where n is the number of digits, which is completely impractical for numbers with more than 8-9 digits. Even for a 10-digit number, that's 3.6 million permutations!

The key insight is that we don't need to try all permutations — we just need to sort the digits and alternate assigning them to build two numbers. This reduces the problem from exponential to O(n log n) time.

## Optimal Solution

The optimal solution uses a greedy approach:

1. Convert the number to a list of digits
2. Sort the digits in ascending order
3. Alternate assigning digits to build two numbers
4. The first number gets digits at even indices (0, 2, 4...)
5. The second number gets digits at odd indices (1, 3, 5...)
6. Calculate and return the sum

Why does this work? To minimize the sum of two numbers built from given digits, we want to minimize their values. This means putting the smallest digits in the most significant positions of both numbers. By alternating, we ensure both numbers get roughly equal numbers of digits, and the smallest digits get the most significant positions in each number.

<div class="code-group">

```python
# Time: O(n log n) where n is number of digits | Space: O(n)
def splitNum(num: int) -> int:
    # Step 1: Convert number to list of digits
    # We convert to string to easily access each digit
    digits = [int(d) for d in str(num)]

    # Step 2: Sort digits in ascending order
    # This ensures smallest digits come first
    digits.sort()

    # Step 3: Build two numbers by alternating digits
    num1, num2 = 0, 0

    # Iterate through sorted digits
    for i in range(len(digits)):
        if i % 2 == 0:
            # Even indices go to first number
            # Multiply by 10 to shift digits left, then add new digit
            num1 = num1 * 10 + digits[i]
        else:
            # Odd indices go to second number
            num2 = num2 * 10 + digits[i]

    # Step 4: Return the sum
    return num1 + num2
```

```javascript
// Time: O(n log n) where n is number of digits | Space: O(n)
function splitNum(num) {
  // Step 1: Convert number to array of digits
  // Convert to string, split into characters, then map to numbers
  const digits = num.toString().split("").map(Number);

  // Step 2: Sort digits in ascending order
  // Default sort is lexicographic, so we need compare function
  digits.sort((a, b) => a - b);

  // Step 3: Build two numbers by alternating digits
  let num1 = 0,
    num2 = 0;

  // Iterate through sorted digits
  for (let i = 0; i < digits.length; i++) {
    if (i % 2 === 0) {
      // Even indices go to first number
      // Multiply by 10 to shift digits left, then add new digit
      num1 = num1 * 10 + digits[i];
    } else {
      // Odd indices go to second number
      num2 = num2 * 10 + digits[i];
    }
  }

  // Step 4: Return the sum
  return num1 + num2;
}
```

```java
// Time: O(n log n) where n is number of digits | Space: O(n)
class Solution {
    public int splitNum(int num) {
        // Step 1: Convert number to array of digits
        // Convert to string, then to character array
        char[] digits = Integer.toString(num).toCharArray();

        // Step 2: Sort digits in ascending order
        // Sorting characters works because '0' < '1' < ... < '9'
        Arrays.sort(digits);

        // Step 3: Build two numbers by alternating digits
        int num1 = 0, num2 = 0;

        // Iterate through sorted digits
        for (int i = 0; i < digits.length; i++) {
            // Convert char digit to integer value
            int digit = digits[i] - '0';

            if (i % 2 == 0) {
                // Even indices go to first number
                // Multiply by 10 to shift digits left, then add new digit
                num1 = num1 * 10 + digit;
            } else {
                // Odd indices go to second number
                num2 = num2 * 10 + digit;
            }
        }

        // Step 4: Return the sum
        return num1 + num2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Converting the number to digits takes O(n) where n is the number of digits
- Sorting the digits takes O(n log n) — this is the dominant operation
- Building the two numbers takes O(n)

**Space Complexity: O(n)**

- We need to store the list/array of digits
- The sorting algorithm may use additional O(log n) space for recursion (in some implementations), but the digits array dominates

## Common Mistakes

1. **Not sorting digits**: Some candidates try to split the original number without rearranging digits. This fails because the optimal solution requires redistributing digits between the two numbers.

2. **Incorrect digit extraction**: Forgetting to convert characters back to integers (especially in Java/JavaScript) leads to string concatenation instead of numerical addition. For example, `'1' + '2' = '12'` instead of `3`.

3. **Handling zeros incorrectly**: The problem allows non-negative integers, which means numbers can have leading zeros. Our solution handles this correctly because when we build numbers digit by digit, a leading zero just means the number starts with 0 (which is allowed).

4. **Alternating assignment wrong**: Some candidates try to give all small digits to one number and all large digits to the other. This creates one very small number and one very large number, but their sum is larger than when digits are distributed evenly.

## When You'll See This Pattern

This greedy alternating pattern appears in several optimization problems:

1. **Minimum Sum of Two Numbers Formed from Digits** (this problem) - The core pattern of sorting and alternating to minimize sum.

2. **Array Partition I** (LeetCode 561) - To maximize the sum of min(a,b) pairs, you sort and take every other element, which is essentially the same alternating pattern.

3. **Assign Cookies** (LeetCode 455) - Another greedy problem where sorting and matching smallest to smallest yields optimal results.

4. **Task Scheduler** (LeetCode 621) - While more complex, it uses similar reasoning about distributing items evenly to optimize an outcome.

The key insight across these problems is that when you need to distribute items to optimize a sum or minimize a maximum, sorting and alternating often provides the optimal solution.

## Key Takeaways

1. **Greedy with sorting**: When a problem involves distributing items to optimize a sum, try sorting first. The optimal distribution often involves giving the smallest items the most "valuable" positions.

2. **Alternating distribution**: To minimize the sum of two numbers built from a set of digits, alternate assigning sorted digits to each number. This ensures both numbers are as small as possible.

3. **Digit manipulation**: Practice converting between numbers, strings, and digit arrays. These conversions are common in digit-based problems and getting them wrong can waste valuable interview time.

Related problems: [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Minimum Cost to Move Chips to The Same Position](/problem/minimum-cost-to-move-chips-to-the-same-position), [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference)
