---
title: "How to Solve Minimum Addition to Make Integer Beautiful — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Addition to Make Integer Beautiful. Medium difficulty, 38.6% acceptance rate. Topics: Math, Greedy."
date: "2029-08-12"
category: "dsa-patterns"
tags: ["minimum-addition-to-make-integer-beautiful", "math", "greedy", "medium"]
---

# How to Solve Minimum Addition to Make Integer Beautiful

This problem asks us to find the smallest non-negative integer `x` such that when added to a given positive integer `n`, the digit sum of the result becomes less than or equal to a `target` value. The challenge lies in efficiently determining where and how to modify the number to reduce its digit sum without overshooting the minimum required addition.

What makes this problem interesting is that it requires thinking about numbers in terms of their decimal representation and place values. The optimal solution involves a greedy approach that works from the least significant digit to the most significant, which isn't immediately obvious to many candidates.

## Visual Walkthrough

Let's trace through an example: `n = 467`, `target = 6`

**Step 1: Check current digit sum**

- Digits: 4 + 6 + 7 = 17
- 17 > 6, so we need to add something to make the digit sum ≤ 6

**Step 2: Start from the least significant digit**

- Current number: 467
- Look at the units digit (7): If we add 3, it becomes 470 (7 → 0 with carry)
- But wait, let's think systematically...

**Better approach: Process digits from right to left**

1. Check digit sum of 467 = 17 > 6
2. Look at rightmost digit (7): To make this 0, we need to add 3 (since 7 + 3 = 10)
   - Result would be 470, digit sum = 4 + 7 + 0 = 11 (still > 6)
3. Move to next digit (6 in tens place): Actually, after adding 3 to make units 0, we got a carry, so 6 becomes 7
   - Now we have 470, digit sum = 11 > 6
4. To make the tens digit 0, we need to add 30 (since 70 + 30 = 100)
   - Result would be 500, digit sum = 5 + 0 + 0 = 5 (≤ 6 ✓)

**Step 3: Calculate the addition needed**

- We added 3 to make units 0 → 467 + 3 = 470
- Then added 30 to make tens 0 → 470 + 30 = 500
- Total addition: 3 + 30 = 33
- Check: 467 + 33 = 500, digit sum = 5 ≤ 6 ✓

This shows the pattern: we work from right to left, making digits 0 one by one until the digit sum becomes acceptable.

## Brute Force Approach

A naive approach would be to simply try adding numbers starting from 0 and checking the digit sum each time:

1. Start with x = 0
2. While digit_sum(n + x) > target:
   - Increment x by 1
3. Return x

The problem with this approach is efficiency. Consider `n = 999999999` and `target = 1`. We might need to add a very large number (like 1) to get to 1000000000, which has digit sum 1. In the worst case, we could be incrementing through millions of numbers.

**Why this fails:**

- Time complexity: Could be O(10^k) where k is the number of digits
- For large n (up to 10^12), this is completely infeasible
- We need to leverage the structure of the decimal system

## Optimized Approach

The key insight is that to minimize the addition, we should work from the least significant digit to the most significant, making digits zero one by one. Here's the reasoning:

1. **Why start from the right?** Because changing a less significant digit affects fewer digits. If we need to reduce the digit sum, making a digit 0 is the most effective change for that position.

2. **How much to add?** To make a digit at position i (0-indexed from right) become 0, we need to add `(10 - digit) × 10^i`. For example, to make a units digit of 7 become 0, add 3.

3. **What about carries?** When we make a digit 0 by adding enough to reach the next multiple of 10, we create a carry to the next digit. This might actually help reduce the digit sum further.

4. **When to stop?** We continue this process until the digit sum of the current number (with our accumulated additions) is ≤ target.

The algorithm:

1. Make a copy of n to work with
2. Initialize addition = 0 and multiplier = 1 (for place value)
3. While digit_sum(n) > target:
   - Get the last digit: digit = n % 10
   - If digit != 0:
     - Add (10 - digit) × multiplier to our total addition
     - Add (10 - digit) × multiplier to n (which creates a carry)
   - Remove the last digit (now 0) by doing n //= 10
   - Multiply multiplier by 10 for the next digit position
4. Return the total addition

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(n)^2) - digit sum is O(log n) and we call it O(log n) times
# Space: O(1) - only using constant extra space
def makeIntegerBeautiful(n: int, target: int) -> int:
    # Helper function to calculate digit sum
    def digit_sum(num: int) -> int:
        total = 0
        while num > 0:
            total += num % 10  # Add last digit
            num //= 10         # Remove last digit
        return total

    original_n = n  # Keep original for reference
    addition = 0    # Total amount we need to add
    multiplier = 1  # Tracks place value (1, 10, 100, ...)

    # Continue until digit sum is within target
    while digit_sum(n) > target:
        # Get the last digit of current n
        last_digit = n % 10

        if last_digit != 0:
            # Calculate how much to add to make this digit 0
            # Example: digit 7 needs 3 to become 10
            to_add = (10 - last_digit) * multiplier
            addition += to_add
            n += to_add  # This will create a carry to next digit

        # Remove the last digit (now 0) and move to next position
        n //= 10
        multiplier *= 10  # Next digit is 10x more significant

    return addition
```

```javascript
// Time: O(log(n)^2) - digit sum is O(log n) and we call it O(log n) times
// Space: O(1) - only using constant extra space
function makeIntegerBeautiful(n, target) {
  // Helper function to calculate digit sum
  const digitSum = (num) => {
    let total = 0;
    while (num > 0) {
      total += num % 10; // Add last digit
      num = Math.floor(num / 10); // Remove last digit
    }
    return total;
  };

  let addition = 0; // Total amount we need to add
  let multiplier = 1; // Tracks place value (1, 10, 100, ...)

  // Continue until digit sum is within target
  while (digitSum(n) > target) {
    // Get the last digit of current n
    const lastDigit = n % 10;

    if (lastDigit !== 0) {
      // Calculate how much to add to make this digit 0
      // Example: digit 7 needs 3 to become 10
      const toAdd = (10 - lastDigit) * multiplier;
      addition += toAdd;
      n += toAdd; // This will create a carry to next digit
    }

    // Remove the last digit (now 0) and move to next position
    n = Math.floor(n / 10);
    multiplier *= 10; // Next digit is 10x more significant
  }

  return addition;
}
```

```java
// Time: O(log(n)^2) - digit sum is O(log n) and we call it O(log n) times
// Space: O(1) - only using constant extra space
class Solution {
    public long makeIntegerBeautiful(long n, int target) {
        // Helper function to calculate digit sum
        long digitSum(long num) {
            long total = 0;
            while (num > 0) {
                total += num % 10;  // Add last digit
                num /= 10;          // Remove last digit
            }
            return total;
        }

        long addition = 0;    // Total amount we need to add
        long multiplier = 1;  // Tracks place value (1, 10, 100, ...)

        // Continue until digit sum is within target
        while (digitSum(n) > target) {
            // Get the last digit of current n
            long lastDigit = n % 10;

            if (lastDigit != 0) {
                // Calculate how much to add to make this digit 0
                // Example: digit 7 needs 3 to become 10
                long toAdd = (10 - lastDigit) * multiplier;
                addition += toAdd;
                n += toAdd;  // This will create a carry to next digit
            }

            // Remove the last digit (now 0) and move to next position
            n /= 10;
            multiplier *= 10;  // Next digit is 10x more significant
        }

        return addition;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log(n)²)**

- The outer loop runs at most O(log n) times (once per digit)
- Each iteration calls `digit_sum()` which is O(log n)
- Therefore total is O(log n × log n) = O(log(n)²)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are needed

**Why this is efficient:**

- For n up to 10^12 (12 digits), log₁₀(n) ≈ 12
- 12² = 144 operations, which is trivial
- Compare this to the brute force which could need millions of operations

## Common Mistakes

1. **Starting from the most significant digit**: Some candidates try to reduce the largest digits first, but this often leads to larger additions than necessary. Remember: to minimize the addition, work from least to most significant.

2. **Forgetting about carries**: When you make a digit 0 by adding (10 - digit), you create a carry to the next digit. This carry might make the next digit larger, which seems counterproductive, but it's necessary for the algorithm to work correctly.

3. **Incorrect loop condition**: The condition should be `digit_sum(n) > target`, not `digit_sum(original_n + addition) > target`. We're modifying n as we go to account for carries.

4. **Not handling digit = 0 case**: If a digit is already 0, we don't need to add anything for that position. Just move to the next digit.

5. **Integer overflow in Java**: Since n can be up to 10^12, use `long` instead of `int` for all variables involved in calculations.

## When You'll See This Pattern

This greedy approach from least significant digit appears in several number manipulation problems:

1. **Next Greater Element III** (LeetCode 556): Similar digit manipulation to find the next permutation of digits.

2. **Add Strings** (LeetCode 415): Working from least significant digit when adding numbers represented as strings.

3. **Multiply Strings** (LeetCode 43): Similar place-value thinking when multiplying large numbers.

4. **Integer to English Words** (LeetCode 273): Breaking down numbers by place values (thousands, millions, etc.).

The common thread is treating numbers not as monolithic values but as collections of digits with place values, and performing operations from right to left to handle carries properly.

## Key Takeaways

1. **When dealing with digit operations, consider working from least significant to most significant**. This naturally handles carries and often leads to optimal solutions.

2. **Think in terms of place values**. Multiplying by 10, 100, etc., corresponds to moving to more significant digits in the decimal system.

3. **Greedy approaches work well for digit manipulation problems** when the optimal local choice (making the current digit as small as possible) leads to a global optimum.

4. **Always test with edge cases**: numbers ending with 0, numbers where all digits are 9, small targets (like 1), and the maximum input size.

Related problems: [Happy Number](/problem/happy-number)
