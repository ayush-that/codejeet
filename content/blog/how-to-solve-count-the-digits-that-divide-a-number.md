---
title: "How to Solve Count the Digits That Divide a Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count the Digits That Divide a Number. Easy difficulty, 85.9% acceptance rate. Topics: Math."
date: "2026-06-20"
category: "dsa-patterns"
tags: ["count-the-digits-that-divide-a-number", "math", "easy"]
---

# How to Solve Count the Digits That Divide a Number

This problem asks us to count how many digits in a given integer `num` evenly divide that same number. A digit `d` divides `num` if `num % d == 0`. While this seems straightforward, the subtle challenge lies in correctly handling the digit 0 (since division by zero is undefined) and understanding that we're checking each digit individually, not the entire number. This problem tests your ability to extract digits from a number and apply basic mathematical constraints.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider `num = 1248`.

**Step 1:** Extract digits from the number

- We need to check each digit: 1, 2, 4, and 8

**Step 2:** Check each digit against the original number

- Digit 1: `1248 % 1 == 0` → True (1 divides 1248)
- Digit 2: `1248 % 2 == 0` → True (2 divides 1248)
- Digit 4: `1248 % 4 == 0` → True (4 divides 1248)
- Digit 8: `1248 % 8 == 0` → True (8 divides 1248)

**Step 3:** Count the valid digits

- All 4 digits divide 1248, so answer = 4

Now let's try a more interesting example: `num = 121`

**Step 1:** Extract digits: 1, 2, 1
**Step 2:** Check each:

- First 1: `121 % 1 == 0` → True
- 2: `121 % 2 == 1` → False (121 ÷ 2 = 60.5, not integer)
- Second 1: `121 % 1 == 0` → True
  **Step 3:** Count: 2 valid digits

The key insight is that we need to:

1. Extract each digit from the number
2. Check if the digit is non-zero (to avoid division by zero)
3. Check if `num % digit == 0`
4. Count how many digits satisfy both conditions

## Brute Force Approach

For this problem, there's essentially only one reasonable approach since we must examine every digit. However, a "brute force" mindset might lead to inefficient digit extraction or incorrect handling of edge cases.

A naive implementation might:

1. Convert the number to a string
2. Iterate through each character
3. Convert back to integer for each digit
4. Check the division condition

While this approach works and has the same time complexity as the optimal solution, it uses extra space for the string conversion. More importantly, candidates might forget to handle:

- The digit 0 (division by zero error)
- Negative numbers (though constraints typically specify positive integers)
- Repeated digits (each should be checked individually)

The real "brute force" thinking error would be to try checking all possible digit combinations or using unnecessary mathematical operations instead of simple digit extraction.

## Optimal Solution

The optimal approach extracts digits mathematically using modulo and division operations. We preserve the original number in a variable since we'll be modifying our working copy during digit extraction.

<div class="code-group">

```python
# Time: O(log₁₀(n)) | Space: O(1)
def countDigits(num: int) -> int:
    """
    Count how many digits in num divide num evenly.

    Approach:
    1. Save original number for division checks
    2. Extract digits one by one using modulo 10
    3. For each digit, ensure it's non-zero and divides original
    4. Count valid digits and return total
    """
    original = num  # Store original for division checks
    count = 0       # Initialize counter for valid digits

    # Process each digit until num becomes 0
    while num > 0:
        # Extract last digit using modulo 10
        digit = num % 10

        # Check two conditions:
        # 1. digit != 0 (avoid division by zero)
        # 2. original % digit == 0 (digit divides original)
        if digit != 0 and original % digit == 0:
            count += 1  # Increment count if both conditions true

        # Remove last digit by integer division by 10
        num //= 10

    return count
```

```javascript
// Time: O(log₁₀(n)) | Space: O(1)
function countDigits(num) {
  /**
   * Count how many digits in num divide num evenly.
   *
   * Approach:
   * 1. Save original number for division checks
   * 2. Extract digits one by one using modulo 10
   * 3. For each digit, ensure it's non-zero and divides original
   * 4. Count valid digits and return total
   */
  const original = num; // Store original for division checks
  let count = 0; // Initialize counter for valid digits

  // Process each digit until num becomes 0
  while (num > 0) {
    // Extract last digit using modulo 10
    const digit = num % 10;

    // Check two conditions:
    // 1. digit !== 0 (avoid division by zero)
    // 2. original % digit === 0 (digit divides original)
    if (digit !== 0 && original % digit === 0) {
      count++; // Increment count if both conditions true
    }

    // Remove last digit by integer division by 10
    num = Math.floor(num / 10);
  }

  return count;
}
```

```java
// Time: O(log₁₀(n)) | Space: O(1)
class Solution {
    public int countDigits(int num) {
        /**
         * Count how many digits in num divide num evenly.
         *
         * Approach:
         * 1. Save original number for division checks
         * 2. Extract digits one by one using modulo 10
         * 3. For each digit, ensure it's non-zero and divides original
         * 4. Count valid digits and return total
         */
        int original = num;  // Store original for division checks
        int count = 0;       // Initialize counter for valid digits

        // Process each digit until num becomes 0
        while (num > 0) {
            // Extract last digit using modulo 10
            int digit = num % 10;

            // Check two conditions:
            // 1. digit != 0 (avoid division by zero)
            // 2. original % digit == 0 (digit divides original)
            if (digit != 0 && original % digit == 0) {
                count++;  // Increment count if both conditions true
            }

            // Remove last digit by integer division by 10
            num /= 10;
        }

        return count;
    }
}
```

</div>

**Key implementation details:**

1. **Preserving the original**: We store `original = num` because we'll be modifying `num` during digit extraction. We need the original value for the division check.

2. **Digit extraction loop**: `while (num > 0)` continues until we've processed all digits. Each iteration:
   - Gets the last digit: `digit = num % 10`
   - Checks if it's valid
   - Removes the last digit: `num = num // 10` (or `Math.floor(num / 10)` in JS)

3. **Zero handling**: The condition `digit != 0` is crucial. Without it, `original % 0` would cause a division by zero error.

4. **Division check**: We use `original % digit == 0` to check if the digit divides the original number evenly.

## Complexity Analysis

**Time Complexity: O(log₁₀(n))**

- The while loop runs once for each digit in the number
- A number `n` has approximately log₁₀(n) digits (base 10 logarithm)
- Example: 1248 has 4 digits, log₁₀(1248) ≈ 3.1, which rounds to 4
- Each iteration does constant work: modulo, division, comparison

**Space Complexity: O(1)**

- We use only a few integer variables: `original`, `count`, `digit`, and the modified `num`
- No additional data structures that grow with input size
- Even the string conversion approach would be O(log₁₀(n)) space

The logarithmic time complexity makes this solution efficient even for very large numbers (up to the limits of integer representation).

## Common Mistakes

1. **Forgetting to handle digit 0**
   - **Mistake**: Not checking `digit != 0` before `original % digit`
   - **Result**: Division by zero error or runtime exception
   - **Fix**: Always check if digit is non-zero before using it as a divisor

2. **Using the modified num for division check**
   - **Mistake**: Checking `num % digit` instead of `original % digit`
   - **Result**: Wrong answer because `num` changes each iteration as digits are removed
   - **Fix**: Store original number in separate variable before modifying `num`

3. **Incorrect loop condition for negative numbers**
   - **Mistake**: Using `while (num != 0)` without considering negative inputs
   - **Result**: Infinite loop for negative numbers (num never becomes 0 when dividing by 10)
   - **Fix**: Use `while (num > 0)` or handle negatives explicitly if required

4. **Not counting repeated digits separately**
   - **Mistake**: Using a set to track unique digits only
   - **Result**: Under-counting when same digit appears multiple times
   - **Fix**: Process each digit occurrence individually, not just unique digits

## When You'll See This Pattern

This problem uses **digit extraction via modulo and division**, a fundamental technique for number manipulation problems. You'll encounter this pattern in:

1. **Happy Number (LeetCode 202)**
   - Also extracts digits to square and sum them
   - Uses the same `digit = n % 10; n //= 10` pattern
   - Adds the extra complexity of cycle detection

2. **Self Dividing Numbers (LeetCode 728)**
   - Checks if all digits divide the number (not just counts them)
   - Uses identical digit extraction logic
   - Applies the check to a range of numbers

3. **Palindrome Number (LeetCode 9)**
   - Extracts digits to reverse the number
   - Compares original with reversed version
   - Same core digit manipulation technique

4. **Add Digits (LeetCode 258)**
   - Repeatedly sums digits until single digit remains
   - Uses digit extraction in a loop

The pattern is: when you need to examine or manipulate individual digits of a number, think of using `% 10` to get the last digit and `/ 10` (integer division) to remove it.

## Key Takeaways

1. **Digit extraction formula**: To process digits from right to left:
   - Get last digit: `digit = num % 10`
   - Remove last digit: `num = num // 10` (or `Math.floor(num / 10)` in JS)
   - Repeat while `num > 0`

2. **Preserve original values**: When you need the original number for comparisons but are modifying it during digit extraction, store it in a separate variable first.

3. **Watch for edge cases**: Always consider:
   - Digit 0 (division by zero)
   - Single-digit numbers
   - Numbers containing zeros
   - Negative numbers if not explicitly excluded

This problem teaches clean integer manipulation and careful condition checking—skills that transfer to many other number-based coding problems.

Related problems: [Happy Number](/problem/happy-number), [Self Dividing Numbers](/problem/self-dividing-numbers)
