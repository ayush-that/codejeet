---
title: "How to Solve Alternating Digit Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Alternating Digit Sum. Easy difficulty, 69.0% acceptance rate. Topics: Math."
date: "2027-06-22"
category: "dsa-patterns"
tags: ["alternating-digit-sum", "math", "easy"]
---

# How to Solve Alternating Digit Sum

You're given a positive integer `n` and need to sum its digits with alternating signs, starting with a positive sign on the most significant digit. While this problem seems straightforward, it tests your ability to extract digits from a number and handle alternating patterns correctly—skills that come up frequently in coding interviews.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 521`. We need to assign signs to each digit:

1. Most significant digit (5) gets a **positive** sign: **+5**
2. Next digit (2) gets the opposite sign: **-2**
3. Last digit (1) gets the opposite sign again: **+1**

The calculation becomes: +5 - 2 + 1 = 4

Another way to think about it: digits at even positions (0-indexed from the left) get positive signs, while digits at odd positions get negative signs. For `521`:

- Position 0 (5): positive → +5
- Position 1 (2): negative → -2
- Position 2 (1): positive → +1

This pattern holds regardless of the number of digits. Let's verify with `n = 12345`:

- +1 - 2 + 3 - 4 + 5 = 3

## Brute Force Approach

A naive approach might convert the number to a string, iterate through characters, and track the sign manually. While this isn't actually "brute force" in the sense of being inefficient (it's actually optimal), let's consider what a less experienced candidate might try:

Some candidates might try to extract digits using division/modulo operations but forget to handle the alternating sign correctly. They might start from the least significant digit and get confused about which sign to assign. Or they might create an array of digits first, then sum them—which uses extra space unnecessarily.

The key insight is that we need to process digits from most significant to least significant to assign signs correctly. If we process from least significant, we'd need to reverse the order or calculate positions differently.

## Optimal Solution

The optimal solution extracts digits while maintaining the correct alternating sign. We can approach this in two ways:

1. **Convert to string**: Process each character, converting to integer and applying the appropriate sign based on position.
2. **Mathematical approach**: Extract digits using division/modulo while tracking position.

The string approach is often clearer for interviews. Here's the step-by-step reasoning:

1. Convert the number to a string to easily access each digit
2. Initialize a result variable and a sign flag (starting positive)
3. Iterate through each character in the string
4. Convert character to integer, multiply by current sign, add to result
5. Flip the sign for the next digit
6. Return the result

<div class="code-group">

```python
# Time: O(d) where d is number of digits | Space: O(d) for the string
def alternateDigitSum(n: int) -> int:
    # Convert the number to string to easily access each digit
    n_str = str(n)

    # Initialize result and starting sign (positive for most significant digit)
    result = 0
    sign = 1  # 1 represents positive, -1 represents negative

    # Iterate through each character in the string
    for char in n_str:
        # Convert character to integer and multiply by current sign
        digit = int(char)
        result += sign * digit

        # Flip the sign for the next digit
        sign *= -1

    return result
```

```javascript
// Time: O(d) where d is number of digits | Space: O(d) for the string
function alternateDigitSum(n) {
  // Convert the number to string to easily access each digit
  const nStr = n.toString();

  // Initialize result and starting sign (positive for most significant digit)
  let result = 0;
  let sign = 1; // 1 represents positive, -1 represents negative

  // Iterate through each character in the string
  for (let i = 0; i < nStr.length; i++) {
    // Convert character to integer and multiply by current sign
    const digit = parseInt(nStr[i]);
    result += sign * digit;

    // Flip the sign for the next digit
    sign *= -1;
  }

  return result;
}
```

```java
// Time: O(d) where d is number of digits | Space: O(d) for the string
public int alternateDigitSum(int n) {
    // Convert the number to string to easily access each digit
    String nStr = Integer.toString(n);

    // Initialize result and starting sign (positive for most significant digit)
    int result = 0;
    int sign = 1;  // 1 represents positive, -1 represents negative

    // Iterate through each character in the string
    for (int i = 0; i < nStr.length(); i++) {
        // Convert character to integer and multiply by current sign
        int digit = Character.getNumericValue(nStr.charAt(i));
        result += sign * digit;

        // Flip the sign for the next digit
        sign *= -1;
    }

    return result;
}
```

</div>

For those who prefer a mathematical approach without string conversion:

<div class="code-group">

```python
# Time: O(d) where d is number of digits | Space: O(1)
def alternateDigitSum(n: int) -> int:
    # First, count the number of digits
    temp = n
    digit_count = 0
    while temp > 0:
        digit_count += 1
        temp //= 10

    # Initialize result
    result = 0
    # Start with positive sign if odd number of digits, negative if even
    # This is because we'll extract from least significant to most
    sign = 1 if digit_count % 2 == 1 else -1

    # Extract digits from least significant to most
    while n > 0:
        digit = n % 10
        result += sign * digit
        sign *= -1  # Flip sign for next digit
        n //= 10

    return result
```

```javascript
// Time: O(d) where d is number of digits | Space: O(1)
function alternateDigitSum(n) {
  // First, count the number of digits
  let temp = n;
  let digitCount = 0;
  while (temp > 0) {
    digitCount++;
    temp = Math.floor(temp / 10);
  }

  // Initialize result
  let result = 0;
  // Start with positive sign if odd number of digits, negative if even
  // This is because we'll extract from least significant to most
  let sign = digitCount % 2 === 1 ? 1 : -1;

  // Extract digits from least significant to most
  while (n > 0) {
    const digit = n % 10;
    result += sign * digit;
    sign *= -1; // Flip sign for next digit
    n = Math.floor(n / 10);
  }

  return result;
}
```

```java
// Time: O(d) where d is number of digits | Space: O(1)
public int alternateDigitSum(int n) {
    // First, count the number of digits
    int temp = n;
    int digitCount = 0;
    while (temp > 0) {
        digitCount++;
        temp /= 10;
    }

    // Initialize result
    int result = 0;
    // Start with positive sign if odd number of digits, negative if even
    // This is because we'll extract from least significant to most
    int sign = digitCount % 2 == 1 ? 1 : -1;

    // Extract digits from least significant to most
    while (n > 0) {
        int digit = n % 10;
        result += sign * digit;
        sign *= -1;  // Flip sign for next digit
        n /= 10;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)** where `d` is the number of digits in `n`. We need to process each digit exactly once. Since the number of digits in `n` is approximately log₁₀(n), we can also say O(log n).

**Space Complexity:**

- String approach: **O(d)** for storing the string representation of the number.
- Mathematical approach: **O(1)** as we only use a few integer variables.

Both approaches have the same time complexity. The string approach is usually preferred in interviews because it's more readable and less error-prone with sign handling.

## Common Mistakes

1. **Starting with the wrong sign**: Some candidates start with a negative sign or flip the sign at the wrong time. Remember: most significant digit is always positive. Test with single-digit numbers (e.g., `n=5` should return `5`, not `-5`).

2. **Processing digits in wrong order**: If using the mathematical approach (division/modulo), you extract digits from least significant to most significant. You must account for this by determining the correct starting sign based on whether you have an odd or even number of digits.

3. **Forgetting to convert characters to integers**: When using the string approach, `'5'` (character) is not the same as `5` (integer). You must convert each character to its integer value before applying the sign.

4. **Overcomplicating with arrays**: Some candidates create an array of digits first, then sum them. While this works, it uses unnecessary extra space. The optimal solution can compute the sum in a single pass.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Digit extraction**: Converting a number to its constituent digits appears in problems like [Add Digits](/problem/add-digits), [Palindrome Number](/problem/palindrome-number), and [Separate the Digits in an Array](/problem/separate-the-digits-in-an-array).

2. **Alternating patterns**: Problems that require applying alternating operations or conditions appear in various forms. For example:
   - [Minimum Sum of Four Digit Number After Splitting Digits](/problem/minimum-sum-of-four-digit-number-after-splitting-digits) requires arranging digits in a specific pattern.
   - [Maximum Alternating Subsequence Sum](/problem/maximum-alternating-subsequence-sum) involves alternating addition and subtraction.
   - Problems with "zigzag" patterns or alternating row/column processing.

The key skill is recognizing when you need to process elements with alternating operations and implementing the sign flip cleanly.

## Key Takeaways

1. **Digit extraction is fundamental**: Know both string and mathematical approaches. The string method is often clearer for interviews, while the mathematical method can be more space-efficient.

2. **Position matters for alternating patterns**: When signs alternate based on position, you need to know whether you're processing from left-to-right or right-to-left. Keep track of your starting position and sign.

3. **Test edge cases**: Always test with single-digit numbers, numbers with an even number of digits, and numbers with an odd number of digits. These catch most sign-related errors.

4. **The sign flip trick**: Using `sign *= -1` is a clean, readable way to alternate between positive and negative values. This pattern appears in many problems beyond just this one.

Related problems: [Add Digits](/problem/add-digits), [Minimum Sum of Four Digit Number After Splitting Digits](/problem/minimum-sum-of-four-digit-number-after-splitting-digits), [Separate the Digits in an Array](/problem/separate-the-digits-in-an-array)
