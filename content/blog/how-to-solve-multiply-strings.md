---
title: "How to Solve Multiply Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Multiply Strings. Medium difficulty, 43.6% acceptance rate. Topics: Math, String, Simulation."
date: "2026-09-18"
category: "dsa-patterns"
tags: ["multiply-strings", "math", "string", "simulation", "medium"]
---

# How to Solve Multiply Strings

This problem asks us to multiply two non-negative integers represented as strings and return their product as a string, without using any built-in big integer libraries or direct integer conversion. The challenge lies in simulating the multiplication process we learned in elementary school while handling potentially very large numbers that exceed standard integer limits.

## Visual Walkthrough

Let's walk through multiplying "123" by "456" using the grade-school multiplication method:

```
      1   2   3   (num1)
×     4   5   6   (num2)
-----------------
      7   3   8   (6 × 123 = 738)
  6   1   5   0   (5 × 123 = 615, shifted left by 1)
4   9   2   0   0 (4 × 123 = 492, shifted left by 2)
-----------------
5   6   0   8   8 (Sum = 56088)
```

The key insight is that when we multiply digit `num1[i]` by digit `num2[j]`, the product contributes to two positions in the result:

- The ones digit goes to position `i + j + 1`
- The tens digit (carry) goes to position `i + j`

For example, when multiplying the last digits (3 × 6 = 18):

- 8 goes to position (2 + 2 + 1) = 5 (from the right)
- 1 goes to position (2 + 2) = 4 (from the right)

We'll use an array to accumulate these partial products before converting to a string.

## Brute Force Approach

A naive approach would be to convert each string to an integer, multiply them, then convert back to string. However, this violates the problem constraints and would fail for very large numbers that exceed standard integer limits (like 1000-digit numbers).

Even if we tried to simulate multiplication directly without optimization, we might end up with an inefficient approach that handles carries poorly or has incorrect index calculations. The brute force mental model would be to multiply each digit of `num2` by the entire `num1`, store each intermediate result as a string, then add them all together with proper left-shifting. While this works, it's less efficient in both time and space than the optimal approach.

## Optimized Approach

The optimal approach uses a single result array to accumulate all partial products:

1. **Initialize an array** of size `len(num1) + len(num2)` to store the result digits (maximum possible length).
2. **Multiply each pair of digits**: For each digit in `num1` (from right to left) and each digit in `num2` (from right to left):
   - Calculate the product: `(num1[i] - '0') * (num2[j] - '0')`
   - Add this product to the existing value at position `i + j + 1` in the result array
3. **Handle carries**: Process the result array from right to left, moving any value ≥ 10 to the next position as a carry.
4. **Convert to string**: Skip leading zeros and build the final string.

The key optimization is using a single array to accumulate all products, which avoids creating multiple intermediate strings and reduces both time and space complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) where m = len(num1), n = len(num2)
# Space: O(m + n) for the result array
def multiply(num1: str, num2: str) -> str:
    # If either number is "0", the product is "0"
    if num1 == "0" or num2 == "0":
        return "0"

    # Initialize result array with zeros
    # Maximum length of product is len(num1) + len(num2)
    result = [0] * (len(num1) + len(num2))

    # Multiply each digit from right to left
    for i in range(len(num1) - 1, -1, -1):
        for j in range(len(num2) - 1, -1, -1):
            # Convert chars to integers and multiply
            product = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))

            # Position in result array where this product contributes
            pos1 = i + j  # tens/higher digit position
            pos2 = i + j + 1  # ones/lower digit position

            # Add product to current value at pos2
            total = product + result[pos2]

            # Update result array
            result[pos2] = total % 10  # ones digit
            result[pos1] += total // 10  # carry (tens digit)

    # Convert result array to string, skipping leading zeros
    # Find first non-zero digit
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1

    # Convert remaining digits to string
    return ''.join(str(digit) for digit in result[start:])
```

```javascript
// Time: O(m * n) where m = num1.length, n = num2.length
// Space: O(m + n) for the result array
function multiply(num1, num2) {
  // If either number is "0", the product is "0"
  if (num1 === "0" || num2 === "0") {
    return "0";
  }

  // Initialize result array with zeros
  // Maximum length of product is num1.length + num2.length
  const result = new Array(num1.length + num2.length).fill(0);

  // Multiply each digit from right to left
  for (let i = num1.length - 1; i >= 0; i--) {
    for (let j = num2.length - 1; j >= 0; j--) {
      // Convert chars to integers and multiply
      const product =
        (num1.charCodeAt(i) - "0".charCodeAt(0)) * (num2.charCodeAt(j) - "0".charCodeAt(0));

      // Position in result array where this product contributes
      const pos1 = i + j; // tens/higher digit position
      const pos2 = i + j + 1; // ones/lower digit position

      // Add product to current value at pos2
      const total = product + result[pos2];

      // Update result array
      result[pos2] = total % 10; // ones digit
      result[pos1] += Math.floor(total / 10); // carry (tens digit)
    }
  }

  // Convert result array to string, skipping leading zeros
  // Find first non-zero digit
  let start = 0;
  while (start < result.length && result[start] === 0) {
    start++;
  }

  // Convert remaining digits to string
  return result.slice(start).join("");
}
```

```java
// Time: O(m * n) where m = num1.length(), n = num2.length()
// Space: O(m + n) for the result array
public String multiply(String num1, String num2) {
    // If either number is "0", the product is "0"
    if (num1.equals("0") || num2.equals("0")) {
        return "0";
    }

    // Initialize result array with zeros
    // Maximum length of product is num1.length() + num2.length()
    int[] result = new int[num1.length() + num2.length()];

    // Multiply each digit from right to left
    for (int i = num1.length() - 1; i >= 0; i--) {
        for (int j = num2.length() - 1; j >= 0; j--) {
            // Convert chars to integers and multiply
            int product = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');

            // Position in result array where this product contributes
            int pos1 = i + j;      // tens/higher digit position
            int pos2 = i + j + 1;  // ones/lower digit position

            // Add product to current value at pos2
            int total = product + result[pos2];

            // Update result array
            result[pos2] = total % 10;    // ones digit
            result[pos1] += total / 10;   // carry (tens digit)
        }
    }

    // Convert result array to string, skipping leading zeros
    StringBuilder sb = new StringBuilder();

    // Find first non-zero digit
    int start = 0;
    while (start < result.length && result[start] == 0) {
        start++;
    }

    // Append remaining digits to StringBuilder
    for (int i = start; i < result.length; i++) {
        sb.append(result[i]);
    }

    return sb.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the length of `num1` and n is the length of `num2`. We need to multiply each digit of `num1` with each digit of `num2`, resulting in m × n operations. The final pass to handle carries and convert to string takes O(m + n) time, which is dominated by the multiplication step.

**Space Complexity:** O(m + n) for the result array. We allocate an array of size m + n to store the product digits. The output string also requires O(m + n) space, but this is typically considered part of the output and not auxiliary space.

## Common Mistakes

1. **Forgetting the "0" edge case**: When either input is "0", the product should be "0". Without this check, you might return an empty string or a string with leading zeros.

2. **Incorrect index calculation**: The most common error is miscalculating which position in the result array gets which digit. Remember: when multiplying digits at positions i and j (from the right), the ones digit goes to position i + j + 1, and the tens digit (carry) goes to position i + j.

3. **Not handling carries properly**: Some implementations try to handle carries immediately after each multiplication, but it's cleaner to accumulate all products first, then process carries in a separate pass from right to left.

4. **Incorrect leading zero handling**: After building the result array, you need to skip any leading zeros. However, if the entire result is zeros (which only happens when the product is 0), you should return "0", not an empty string.

## When You'll See This Pattern

This digit-by-digit multiplication pattern appears in several string arithmetic problems:

1. **Add Two Numbers (Medium)**: While this uses linked lists instead of strings, the core technique of processing digits from least to most significant and handling carries is identical.

2. **Add Binary (Easy)**: Adds two binary strings using the same digit-by-digit approach with carry propagation.

3. **Plus One (Easy)**: A simpler version where you only need to add 1 to a number represented as an array of digits, but still requires careful carry handling.

The pattern is: when dealing with numbers represented as sequences (strings, arrays, or linked lists), process from the least significant digit to the most significant, use a result container, and handle carries systematically.

## Key Takeaways

1. **Simulate grade-school multiplication**: The optimal approach directly implements the multiplication algorithm we learned as children, using an array to accumulate partial products.

2. **Right-to-left processing is key**: Always process digits from the least significant (rightmost) to most significant (leftmost) when doing arithmetic operations. This makes carry handling much simpler.

3. **Preallocate result space**: For multiplication, the maximum result length is the sum of the input lengths. Preallocating an array of this size avoids dynamic resizing and makes index calculations straightforward.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Plus One](/problem/plus-one), [Add Binary](/problem/add-binary)
