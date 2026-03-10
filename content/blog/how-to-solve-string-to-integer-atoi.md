---
title: "How to Solve String to Integer (atoi) — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode String to Integer (atoi). Medium difficulty, 20.6% acceptance rate. Topics: String."
date: "2026-05-02"
category: "dsa-patterns"
tags: ["string-to-integer-atoi", "string", "medium"]
---

# How to Solve String to Integer (atoi)

Implementing `atoi` (ASCII to integer) is a classic interview problem that tests your ability to handle edge cases and follow detailed specifications. What makes this problem tricky isn't the core logic—it's the numerous edge cases you must handle: leading whitespace, optional signs, non-digit characters, integer overflow, and empty strings. The challenge lies in implementing a state machine that processes characters in exactly the right order while maintaining clean, readable code.

## Visual Walkthrough

Let's trace through the input `"   -42 with words"` step by step:

1. **Step 1: Skip whitespace**  
   We start at index 0: `' '` → skip  
   Index 1: `' '` → skip  
   Index 2: `' '` → skip  
   Index 3: `'-'` → not whitespace, stop skipping

2. **Step 2: Check sign**  
   Character at index 3 is `'-'`, so we set `sign = -1` and move to index 4

3. **Step 3: Process digits**  
   Index 4: `'4'` is a digit → `result = 0 × 10 + 4 = 4`  
   Index 5: `'2'` is a digit → `result = 4 × 10 + 2 = 42`  
   Index 6: `' '` is not a digit → stop processing

4. **Step 4: Apply sign and clamp**  
   `result = 42 × sign = 42 × (-1) = -42`  
   Check bounds: -42 is within [-2³¹, 2³¹-1] → return -42

The key insight is that we process characters in a strict order: whitespace → sign → digits → stop at first non-digit.

## Brute Force Approach

A naive approach might try to use built-in functions like `int()` or `parseInt()` after cleaning the string, but this violates the problem's constraints. The brute force approach that follows the algorithm literally would:

1. Strip leading whitespace manually
2. Check for sign
3. Read characters until a non-digit appears
4. Convert the collected string to integer
5. Handle overflow by checking bounds

While this approach conceptually works, the "brute force" aspect here isn't about time complexity (it's already O(n)), but about handling all edge cases correctly. Many candidates fail by not considering all the edge cases simultaneously. The challenge is implementing the state transitions correctly without missing any cases.

## Optimized Approach

The optimal approach uses a **state machine** pattern with careful integer overflow prevention. Here's the step-by-step reasoning:

1. **Pointer initialization**: Start at index 0 to traverse the string
2. **Whitespace skipping**: Use a while loop to skip all leading whitespace characters
3. **Sign detection**: Check if the current character is '+' or '-'. If so, set the sign accordingly and advance the pointer
4. **Digit processing**: While the current character is a digit:
   - Convert char to integer: `digit = ord(char) - ord('0')`
   - Check for overflow **before** adding the new digit
   - Build the result: `result = result × 10 + digit`
5. **Overflow handling**: Since we're building the integer digit by digit, we check at each step if adding another digit would cause overflow
6. **Sign application**: Multiply by sign at the end (or handle sign during processing)

The critical optimization is in the overflow checking. Instead of waiting until we have the complete number, we check at each step:

- If `result > INT_MAX // 10`, adding another digit will overflow
- If `result == INT_MAX // 10` and the next digit > `INT_MAX % 10`, it will overflow

This prevents actual overflow from occurring in languages with fixed-size integers.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def myAtoi(s: str) -> int:
    # Constants for 32-bit integer bounds
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31

    i = 0  # Pointer to traverse the string
    n = len(s)

    # Step 1: Skip leading whitespace
    while i < n and s[i] == ' ':
        i += 1

    # Edge case: empty string or all whitespace
    if i == n:
        return 0

    # Step 2: Determine sign
    sign = 1  # Default positive
    if s[i] == '-':
        sign = -1
        i += 1
    elif s[i] == '+':
        i += 1

    # Step 3: Convert digits to integer with overflow checking
    result = 0
    while i < n and s[i].isdigit():
        digit = ord(s[i]) - ord('0')  # Convert char to int

        # Check for overflow before adding the digit
        # If result > INT_MAX // 10, adding any digit will overflow
        # If result == INT_MAX // 10, check if digit exceeds the last digit of INT_MAX
        if result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > INT_MAX % 10):
            # Return clamped value based on sign
            return INT_MAX if sign == 1 else INT_MIN

        # Safe to add the digit
        result = result * 10 + digit
        i += 1

    # Step 4: Apply sign and return
    return sign * result
```

```javascript
// Time: O(n) | Space: O(1)
function myAtoi(s) {
  // Constants for 32-bit integer bounds
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  let i = 0; // Pointer to traverse the string
  const n = s.length;

  // Step 1: Skip leading whitespace
  while (i < n && s[i] === " ") {
    i++;
  }

  // Edge case: empty string or all whitespace
  if (i === n) {
    return 0;
  }

  // Step 2: Determine sign
  let sign = 1; // Default positive
  if (s[i] === "-") {
    sign = -1;
    i++;
  } else if (s[i] === "+") {
    i++;
  }

  // Step 3: Convert digits to integer with overflow checking
  let result = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    const digit = s.charCodeAt(i) - "0".charCodeAt(0); // Convert char to int

    // Check for overflow before adding the digit
    // If result > INT_MAX // 10, adding any digit will overflow
    // If result == INT_MAX // 10, check if digit exceeds the last digit of INT_MAX
    if (
      result > Math.floor(INT_MAX / 10) ||
      (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)
    ) {
      // Return clamped value based on sign
      return sign === 1 ? INT_MAX : INT_MIN;
    }

    // Safe to add the digit
    result = result * 10 + digit;
    i++;
  }

  // Step 4: Apply sign and return
  return sign * result;
}
```

```java
// Time: O(n) | Space: O(1)
public int myAtoi(String s) {
    // Constants for 32-bit integer bounds
    final int INT_MAX = Integer.MAX_VALUE;
    final int INT_MIN = Integer.MIN_VALUE;

    int i = 0;  // Pointer to traverse the string
    int n = s.length();

    // Step 1: Skip leading whitespace
    while (i < n && s.charAt(i) == ' ') {
        i++;
    }

    // Edge case: empty string or all whitespace
    if (i == n) {
        return 0;
    }

    // Step 2: Determine sign
    int sign = 1;  // Default positive
    if (s.charAt(i) == '-') {
        sign = -1;
        i++;
    } else if (s.charAt(i) == '+') {
        i++;
    }

    // Step 3: Convert digits to integer with overflow checking
    int result = 0;
    while (i < n && Character.isDigit(s.charAt(i))) {
        int digit = s.charAt(i) - '0';  // Convert char to int

        // Check for overflow before adding the digit
        // If result > INT_MAX / 10, adding any digit will overflow
        // If result == INT_MAX / 10, check if digit exceeds the last digit of INT_MAX
        if (result > Integer.MAX_VALUE / 10 ||
            (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
            // Return clamped value based on sign
            return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
        }

        // Safe to add the digit
        result = result * 10 + digit;
        i++;
    }

    // Step 4: Apply sign and return
    return sign * result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We traverse the string at most once. The worst case is when all characters are processed (e.g., a long string of digits). The while loops for skipping whitespace and processing digits each visit each character at most once.

**Space Complexity: O(1)**  
We use only a constant amount of extra space: variables for the pointer, sign, result, and a few constants. No additional data structures are created that scale with input size.

## Common Mistakes

1. **Not checking overflow during digit accumulation**  
   Many candidates build the entire number first, then check if it exceeds bounds. This can cause actual integer overflow in some languages. Always check overflow **before** adding the next digit.

2. **Incorrect order of operations**  
   The algorithm must process in strict order: whitespace → sign → digits. A common mistake is checking for digits before handling the sign, or not properly skipping all whitespace before checking for sign.

3. **Forgetting to handle the "+" sign**  
   Some candidates only check for "-" and assume positive otherwise. But "+" is explicitly allowed and should be skipped just like "-" (without changing the sign).

4. **Not stopping at first non-digit**  
   After processing digits, we must stop at the first non-digit character. Continuing to process would incorrectly include non-numeric characters in the result.

## When You'll See This Pattern

The state machine pattern used here appears in many string parsing problems:

1. **Valid Number (Hard)** - Similar state transitions but with more states (decimal point, exponent, signs in different positions)
2. **Integer to Roman (Medium)** - While not identical, it requires processing digits in order with specific rules for each position
3. **Decode String (Medium)** - Uses a similar character-by-character parsing approach with different rules for digits, letters, and brackets

The core pattern is: process characters sequentially, maintain state, apply different rules based on current character and context, and handle edge cases at boundaries.

## Key Takeaways

1. **State machines are your friend for parsing problems** - When you need to process characters in a specific order with different rules, think in terms of states and transitions.

2. **Check overflow proactively, not reactively** - When building numbers digit by digit, check if the **next operation** will cause overflow, not if the current value has already overflowed.

3. **Edge cases define string parsing problems** - The main challenge isn't the happy path; it's handling all the weird inputs correctly. Always test: empty string, all whitespace, leading zeros, signs, overflow cases, and mixed characters.

Related problems: [Reverse Integer](/problem/reverse-integer), [Valid Number](/problem/valid-number), [Check if Numbers Are Ascending in a Sentence](/problem/check-if-numbers-are-ascending-in-a-sentence)
