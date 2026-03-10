---
title: "How to Solve Add Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Add Digits. Easy difficulty, 68.6% acceptance rate. Topics: Math, Simulation, Number Theory."
date: "2026-09-06"
category: "dsa-patterns"
tags: ["add-digits", "math", "simulation", "number-theory", "easy"]
---

# How to Solve Add Digits

This problem asks us to repeatedly sum the digits of a number until we're left with a single digit. While it appears simple, the interesting part is that there's both an intuitive simulation approach and a clever mathematical formula that solves it instantly. The challenge lies in recognizing when to use each approach and understanding why the mathematical solution works.

## Visual Walkthrough

Let's trace through the process with `num = 9876`:

**Step 1:** Start with 9876

- Sum its digits: 9 + 8 + 7 + 6 = 30
- Result: 30 (still has 2 digits)

**Step 2:** Take 30

- Sum its digits: 3 + 0 = 3
- Result: 3 (single digit, we're done!)

So for input 9876, the output is 3.

Another example with `num = 38`:

- Step 1: 3 + 8 = 11 (2 digits)
- Step 2: 1 + 1 = 2 (single digit, done)

The process continues until we reach a single digit. This is called finding the **digital root** of a number.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem describes:

1. While the number has more than one digit
2. Sum all its digits
3. Replace the number with this sum
4. Repeat until you get a single digit

This approach works correctly but can be inefficient for very large numbers because we might need multiple passes through the digits. However, since the number of digits decreases quickly (a number with n digits becomes at most 9n, which is much smaller), this approach is actually quite efficient in practice.

Still, there's an even better mathematical solution that gives us the answer in constant time.

## Optimal Solution

There are actually two optimal approaches here:

### Approach 1: Simulation (Simple and Efficient)

This approach directly implements the problem description using a loop. It's easy to understand and implement correctly.

### Approach 2: Mathematical Formula (Digital Root)

The digital root of a number can be calculated using the formula:

- If num is 0, return 0
- If num is divisible by 9, return 9
- Otherwise, return num % 9

This works because the digital root follows a repeating pattern of 1-9. For example:

- 1 → 1, 10 → 1, 19 → 1
- 2 → 2, 11 → 2, 20 → 2
- 9 → 9, 18 → 9, 27 → 9

The mathematical formula gives us O(1) time complexity!

Here are both implementations:

<div class="code-group">

```python
# Time: O(log n) for simulation, O(1) for formula | Space: O(1)
def addDigits(num: int) -> int:
    """
    Solution 1: Simulation approach
    Keep summing digits until we get a single digit.
    """
    # Handle the edge case of 0
    if num == 0:
        return 0

    # Continue until we have a single digit
    while num >= 10:
        digit_sum = 0

        # Sum all digits of the current number
        while num > 0:
            # Get the last digit and add it to sum
            digit_sum += num % 10
            # Remove the last digit
            num //= 10

        # Update num with the sum of its digits
        num = digit_sum

    return num

def addDigitsMath(num: int) -> int:
    """
    Solution 2: Mathematical formula (Digital Root)
    Uses the property that digital root cycles 1-9.
    """
    if num == 0:
        return 0
    elif num % 9 == 0:
        return 9
    else:
        return num % 9
```

```javascript
// Time: O(log n) for simulation, O(1) for formula | Space: O(1)
/**
 * Solution 1: Simulation approach
 * Keep summing digits until we get a single digit.
 */
function addDigits(num) {
  // Handle the edge case of 0
  if (num === 0) return 0;

  // Continue until we have a single digit
  while (num >= 10) {
    let digitSum = 0;

    // Sum all digits of the current number
    while (num > 0) {
      // Get the last digit and add it to sum
      digitSum += num % 10;
      // Remove the last digit
      num = Math.floor(num / 10);
    }

    // Update num with the sum of its digits
    num = digitSum;
  }

  return num;
}

/**
 * Solution 2: Mathematical formula (Digital Root)
 * Uses the property that digital root cycles 1-9.
 */
function addDigitsMath(num) {
  if (num === 0) return 0;
  if (num % 9 === 0) return 9;
  return num % 9;
}
```

```java
// Time: O(log n) for simulation, O(1) for formula | Space: O(1)
class Solution {
    /**
     * Solution 1: Simulation approach
     * Keep summing digits until we get a single digit.
     */
    public int addDigits(int num) {
        // Handle the edge case of 0
        if (num == 0) return 0;

        // Continue until we have a single digit
        while (num >= 10) {
            int digitSum = 0;

            // Sum all digits of the current number
            while (num > 0) {
                // Get the last digit and add it to sum
                digitSum += num % 10;
                // Remove the last digit
                num /= 10;
            }

            // Update num with the sum of its digits
            num = digitSum;
        }

        return num;
    }

    /**
     * Solution 2: Mathematical formula (Digital Root)
     * Uses the property that digital root cycles 1-9.
     */
    public int addDigitsMath(int num) {
        if (num == 0) return 0;
        if (num % 9 == 0) return 9;
        return num % 9;
    }
}
```

</div>

## Complexity Analysis

### Simulation Approach:

- **Time Complexity:** O(log n) where n is the input number
  - Each iteration reduces the number significantly (from n to at most 9 × number of digits)
  - The number of iterations is proportional to the number of digits, which is O(log n)
  - Within each iteration, we process all digits of the current number
- **Space Complexity:** O(1) - we only use a few integer variables

### Mathematical Formula Approach:

- **Time Complexity:** O(1) - just a few arithmetic operations
- **Space Complexity:** O(1) - constant extra space

The mathematical approach is clearly superior in terms of time complexity, but both are acceptable solutions. The simulation approach is often preferred in interviews because it's easier to explain and demonstrates your ability to translate problem requirements into code.

## Common Mistakes

1. **Forgetting the base case of 0**: Many candidates return 0 for the formula approach without checking if the input is 0. With the formula `num % 9`, 0 % 9 = 0, which is correct, but it's good practice to handle it explicitly.

2. **Infinite loops with negative numbers**: The problem states the input is non-negative, but some candidates might write code that doesn't handle 0 properly and gets stuck. Always check your loop conditions carefully.

3. **Incorrect digit extraction**: When using the simulation approach, forgetting to update the number after extracting digits (using `num //= 10` or `num /= 10`) can cause infinite loops.

4. **Overcomplicating the solution**: Some candidates try to convert the number to a string, split it, convert back to integers, sum, and repeat. While this works, it's less efficient than the mathematical approach and more error-prone due to type conversions.

5. **Misunderstanding the mathematical formula**: The formula has a special case when num is divisible by 9. Forgetting this and just returning `num % 9` would give 0 for numbers like 9, 18, 27, etc., when the correct answer is 9.

## When You'll See This Pattern

The digital root pattern appears in several types of problems:

1. **Number theory problems**: Any problem involving repeated operations on digits often has a mathematical shortcut. For example, [Happy Number](/problem/happy-number) also involves repeated digit operations, though it has a different termination condition (cycles instead of single digit).

2. **Problems with cyclical patterns**: When you notice results following a repeating pattern (like 1-9 in this case), there's often a mathematical formula that can give the answer directly without simulation.

3. **Optimization problems**: When a brute force solution involves repeated operations that converge quickly, look for mathematical properties that can eliminate the loop entirely.

Specific related problems:

- **Happy Number**: Also involves summing squares of digits repeatedly, but checks for cycles instead of single digit results.
- **Sum of Digits in the Minimum Number**: Requires understanding digit sums but in a different context.
- **Sum of Digits of String After Convert**: Applies digit sum operations to character conversions.

## Key Takeaways

1. **Always consider mathematical properties**: When a problem involves repeated operations on numbers, there's often a mathematical pattern or formula that provides a more efficient solution. Look for cycles, remainders, or other numerical properties.

2. **Simulation vs. formula trade-off**: The simulation approach is often easier to implement and explain in interviews, even if a mathematical formula exists. Knowing both shows depth of understanding.

3. **Digital root concept is useful**: The digital root (sum of digits until single digit) has the property that `digital_root(n) = 1 + ((n - 1) % 9)` for n > 0. This pattern of results modulo 9 appears in various number theory problems.

4. **Edge cases matter**: Always test with 0, single-digit numbers, and numbers that are multiples of 9 to ensure your solution handles all cases correctly.

Related problems: [Happy Number](/problem/happy-number), [Sum of Digits in the Minimum Number](/problem/sum-of-digits-in-the-minimum-number), [Sum of Digits of String After Convert](/problem/sum-of-digits-of-string-after-convert)
