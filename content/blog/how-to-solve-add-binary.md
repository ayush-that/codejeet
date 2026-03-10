---
title: "How to Solve Add Binary — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Add Binary. Easy difficulty, 57.7% acceptance rate. Topics: Math, String, Bit Manipulation, Simulation."
date: "2026-05-12"
category: "dsa-patterns"
tags: ["add-binary", "math", "string", "bit-manipulation", "easy"]
---

# How to Solve Add Binary

The problem asks us to add two binary strings and return their sum as a binary string. While the concept is straightforward, the challenge lies in handling the binary addition correctly—especially the carry—and working with strings of potentially different lengths. This problem is interesting because it tests your ability to simulate a fundamental computer operation while managing string manipulation and edge cases.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Suppose we have `a = "1011"` (decimal 11) and `b = "1101"` (decimal 13).

We'll process from right to left (least significant bit to most significant bit), just like manual addition:

1. **Start with rightmost digits**: `1` (from `a`) + `1` (from `b`) = `2` in decimal, which is `10` in binary.
   - Result digit: `0`
   - Carry: `1`

2. **Next digits**: `1` (from `a`) + `0` (from `b`) + carry `1` = `2` in decimal
   - Result digit: `0`
   - Carry: `1`

3. **Next digits**: `0` (from `a`) + `1` (from `b`) + carry `1` = `2` in decimal
   - Result digit: `0`
   - Carry: `1`

4. **Next digits**: `1` (from `a`) + `1` (from `b`) + carry `1` = `3` in decimal
   - Result digit: `1`
   - Carry: `1`

5. **After processing all digits**: We still have a carry of `1`
   - Add it to the result

Final result: `"11000"` (decimal 24, which is indeed 11 + 13)

## Brute Force Approach

A naive approach might try to convert both binary strings to integers, add them, then convert back to binary:

```python
def addBinary(a, b):
    # Convert to integers
    num1 = int(a, 2)
    num2 = int(b, 2)
    # Add and convert back
    return bin(num1 + num2)[2:]
```

While this works for small inputs, it has serious limitations:

1. **Large number issues**: Binary strings can be up to 10^4 characters long, which represents numbers far beyond typical integer limits in most languages.
2. **Missing the point**: Interviewers want to see you simulate the addition process, not use built-in conversions.
3. **Language limitations**: In some languages, converting very long binary strings to integers may cause overflow or precision loss.

The optimal solution simulates the addition manually, handling carries and different string lengths explicitly.

## Optimal Solution

The optimal approach simulates binary addition digit by digit, working from right to left. We maintain a carry variable that tracks whether we need to add 1 to the next column. For each position, we sum:

- The current digit from `a` (or 0 if we've exhausted `a`)
- The current digit from `b` (or 0 if we've exhausted `b`)
- The current carry

The sum determines the result digit and the new carry:

- Sum = 0 → result digit = 0, carry = 0
- Sum = 1 → result digit = 1, carry = 0
- Sum = 2 → result digit = 0, carry = 1
- Sum = 3 → result digit = 1, carry = 1

After processing all digits, if we still have a carry, we add it to the result.

<div class="code-group">

```python
# Time: O(max(n, m)) where n = len(a), m = len(b)
# Space: O(max(n, m)) for the result string
def addBinary(a: str, b: str) -> str:
    # Initialize pointers to the end of each string (least significant bit)
    i = len(a) - 1
    j = len(b) - 1

    carry = 0
    result = []

    # Process digits from right to left until we've handled all digits and carry
    while i >= 0 or j >= 0 or carry:
        # Get current digit from a (0 if we've passed all digits)
        digit_a = int(a[i]) if i >= 0 else 0
        # Get current digit from b (0 if we've passed all digits)
        digit_b = int(b[j]) if j >= 0 else 0

        # Calculate sum of current digits and carry
        current_sum = digit_a + digit_b + carry

        # Determine result digit and new carry
        # current_sum % 2 gives us the result digit (0, 1, or 1 when sum is 3)
        result_digit = current_sum % 2
        # current_sum // 2 gives us the carry (0, 1, or 1 when sum is 3)
        carry = current_sum // 2

        # Append result digit to result list
        result.append(str(result_digit))

        # Move pointers left
        i -= 1
        j -= 1

    # Reverse result since we processed from right to left
    # Join into a string
    return ''.join(reversed(result))
```

```javascript
// Time: O(max(n, m)) where n = a.length, m = b.length
// Space: O(max(n, m)) for the result string
function addBinary(a, b) {
  // Initialize pointers to the end of each string (least significant bit)
  let i = a.length - 1;
  let j = b.length - 1;

  let carry = 0;
  const result = [];

  // Process digits from right to left until we've handled all digits and carry
  while (i >= 0 || j >= 0 || carry) {
    // Get current digit from a (0 if we've passed all digits)
    const digitA = i >= 0 ? parseInt(a[i]) : 0;
    // Get current digit from b (0 if we've passed all digits)
    const digitB = j >= 0 ? parseInt(b[j]) : 0;

    // Calculate sum of current digits and carry
    const currentSum = digitA + digitB + carry;

    // Determine result digit and new carry
    // currentSum % 2 gives us the result digit (0, 1, or 1 when sum is 3)
    const resultDigit = currentSum % 2;
    // Math.floor(currentSum / 2) gives us the carry (0, 1, or 1 when sum is 3)
    carry = Math.floor(currentSum / 2);

    // Add result digit to beginning of result array
    result.unshift(resultDigit.toString());

    // Move pointers left
    i--;
    j--;
  }

  // Join array into string
  return result.join("");
}
```

```java
// Time: O(max(n, m)) where n = a.length(), m = b.length()
// Space: O(max(n, m)) for the result string
public String addBinary(String a, String b) {
    // Initialize pointers to the end of each string (least significant bit)
    int i = a.length() - 1;
    int j = b.length() - 1;

    int carry = 0;
    StringBuilder result = new StringBuilder();

    // Process digits from right to left until we've handled all digits and carry
    while (i >= 0 || j >= 0 || carry > 0) {
        // Get current digit from a (0 if we've passed all digits)
        int digitA = (i >= 0) ? a.charAt(i) - '0' : 0;
        // Get current digit from b (0 if we've passed all digits)
        int digitB = (j >= 0) ? b.charAt(j) - '0' : 0;

        // Calculate sum of current digits and carry
        int currentSum = digitA + digitB + carry;

        // Determine result digit and new carry
        // currentSum % 2 gives us the result digit (0, 1, or 1 when sum is 3)
        int resultDigit = currentSum % 2;
        // currentSum / 2 gives us the carry (0, 1, or 1 when sum is 3)
        carry = currentSum / 2;

        // Append result digit to result
        result.append(resultDigit);

        // Move pointers left
        i--;
        j--;
    }

    // Reverse result since we appended digits in reverse order
    // Convert to string
    return result.reverse().toString();
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(max(n, m)) where n is the length of string `a` and m is the length of string `b`. We process each digit exactly once, and the loop runs until we've processed all digits from both strings and any remaining carry.

**Space Complexity**: O(max(n, m)) for the result string. In the worst case (e.g., adding `"111"` and `"1"`), the result will have max(n, m) + 1 digits when there's a final carry. We store this result in a list/array before converting to string.

The space is dominated by the output, which we must return anyway, so some might consider this O(1) auxiliary space if we don't count the output. However, technically we're using O(max(n, m)) space to build the result before returning it.

## Common Mistakes

1. **Forgetting the final carry**: After processing all digits, if there's still a carry (like when adding `"11"` and `"1"`), you must add it to the result. The loop condition `while i >= 0 or j >= 0 or carry` handles this automatically.

2. **Incorrect digit conversion**: When accessing characters from strings, remember they're characters, not integers. You need to convert `'0'` or `'1'` to integers 0 or 1. In Java, use `charAt(i) - '0'`. In Python/JavaScript, use `int(a[i])` or `parseInt(a[i])`.

3. **Wrong processing order**: Binary addition processes from right to left (least significant to most significant). Starting from the left will give incorrect results. Always initialize pointers to the end of strings.

4. **Not handling different lengths correctly**: When one string is longer than the other, you need to continue processing the longer string. Use conditional checks `if i >= 0` and `if j >= 0` to handle this gracefully.

## When You'll See This Pattern

This digit-by-digit addition with carry is a fundamental pattern that appears in many problems:

1. **Add Two Numbers (Medium)**: Instead of binary strings, you have linked lists representing digits in reverse order. The same carry logic applies, but you work with linked list nodes instead of string indices.

2. **Multiply Strings (Medium)**: This extends the concept to multiplication, where you multiply each digit pair and manage carries across multiple positions. The digit-by-digit processing is similar but more complex.

3. **Plus One (Easy)**: A simplified version where you only add 1 to a number represented as an array of digits. You still need to handle the carry, but only for adding 1.

These problems all involve simulating arithmetic operations on numbers represented in non-standard forms (strings, linked lists, arrays) where you can't use built-in arithmetic directly.

## Key Takeaways

1. **Simulate the manual process**: When asked to perform arithmetic on numbers represented as strings or other data structures, think about how you would do it manually on paper, then code that process.

2. **Carry management is key**: In any addition problem, carefully track the carry between digit positions. The carry can propagate through multiple digits (e.g., adding `"999"` and `"1"` in decimal).

3. **Handle different lengths gracefully**: When processing two sequences of potentially different lengths, use conditional checks to handle when you've exhausted one sequence but not the other.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Multiply Strings](/problem/multiply-strings), [Plus One](/problem/plus-one)
