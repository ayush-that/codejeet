---
title: "How to Solve Add Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Add Strings. Easy difficulty, 52.1% acceptance rate. Topics: Math, String, Simulation."
date: "2026-11-02"
category: "dsa-patterns"
tags: ["add-strings", "math", "string", "simulation", "easy"]
---

# How to Solve Add Strings

This problem asks you to add two numbers represented as strings without converting them to integers directly or using big integer libraries. The challenge is simulating manual addition digit-by-digit while handling carries, different string lengths, and edge cases like leading zeros. It's a fundamental simulation problem that tests your ability to work with strings and implement basic arithmetic.

## Visual Walkthrough

Let's trace through adding `"456"` and `"77"` step-by-step:

```
Step 1: Align numbers from right (least significant digit)
num1: 4 5 6
num2:   7 7
        ↑ ↑

Step 2: Start from rightmost digits (i=2, j=1)
digit1 = '6' → 6
digit2 = '7' → 7
sum = 6 + 7 + carry(0) = 13
current_digit = 13 % 10 = 3
carry = 13 // 10 = 1
result: "3"

Step 3: Move left (i=1, j=0)
digit1 = '5' → 5
digit2 = '7' → 7
sum = 5 + 7 + carry(1) = 13
current_digit = 13 % 10 = 3
carry = 13 // 10 = 1
result: "33"

Step 4: Move left (i=0, j=-1, num2 exhausted)
digit1 = '4' → 4
digit2 = None → 0
sum = 4 + 0 + carry(1) = 5
current_digit = 5 % 10 = 5
carry = 5 // 10 = 0
result: "533"

Step 5: Reverse and return
"533" reversed is "533" (same)
Final answer: "533"
```

The key insight is processing digits from right to left, handling carries, and managing when one string is longer than the other.

## Brute Force Approach

The most obvious "brute force" would be to convert both strings to integers, add them, then convert back to string. However, this violates the problem constraints which explicitly forbid direct integer conversion. More importantly, for extremely large numbers (beyond 64-bit integer range), this approach would fail due to overflow.

Even if we ignore the constraints, here's what that invalid approach would look like:

```python
# INVALID - violates problem constraints
def addStrings(num1, num2):
    return str(int(num1) + int(num2))
```

This fails because:

1. It violates the explicit problem constraints
2. For numbers with hundreds of digits, Python can handle them but languages like Java/JavaScript would overflow
3. It doesn't demonstrate the algorithmic thinking interviewers want to see

The problem forces us to implement digit-by-digit addition, which is the only valid approach.

## Optimal Solution

We simulate manual addition by processing digits from right to left. We maintain:

- Two pointers starting at the ends of both strings
- A carry value (initially 0)
- A result list to build our answer

At each step:

1. Get the current digits (or 0 if pointer is out of bounds)
2. Calculate sum = digit1 + digit2 + carry
3. Append sum % 10 to result
4. Update carry = sum // 10
5. Move pointers left

After processing all digits, if carry > 0, append it. Finally, reverse the result since we built it from least to most significant digit.

<div class="code-group">

```python
# Time: O(max(n, m)) where n = len(num1), m = len(num2)
# Space: O(max(n, m)) for the result string
def addStrings(num1: str, num2: str) -> str:
    # Initialize pointers at the end of both strings
    i = len(num1) - 1
    j = len(num2) - 1

    carry = 0  # Track carry from previous digit addition
    result = []  # Build result as list of characters

    # Process digits from right to left until both strings exhausted
    while i >= 0 or j >= 0:
        # Get current digit from num1 (0 if pointer out of bounds)
        digit1 = int(num1[i]) if i >= 0 else 0

        # Get current digit from num2 (0 if pointer out of bounds)
        digit2 = int(num2[j]) if j >= 0 else 0

        # Calculate sum of current digits plus any carry
        current_sum = digit1 + digit2 + carry

        # Current digit is sum modulo 10 (gets us the ones place)
        current_digit = current_sum % 10

        # Update carry for next iteration (integer division by 10)
        carry = current_sum // 10

        # Append current digit to result (as string)
        result.append(str(current_digit))

        # Move pointers left
        i -= 1
        j -= 1

    # After processing all digits, check if there's a remaining carry
    if carry > 0:
        result.append(str(carry))

    # Reverse result since we built it from least to most significant digit
    # Join into final string
    return ''.join(result[::-1])
```

```javascript
// Time: O(max(n, m)) where n = num1.length, m = num2.length
// Space: O(max(n, m)) for the result string
function addStrings(num1, num2) {
  // Initialize pointers at the end of both strings
  let i = num1.length - 1;
  let j = num2.length - 1;

  let carry = 0; // Track carry from previous digit addition
  const result = []; // Build result as array of characters

  // Process digits from right to left until both strings exhausted
  while (i >= 0 || j >= 0) {
    // Get current digit from num1 (0 if pointer out of bounds)
    const digit1 = i >= 0 ? parseInt(num1[i]) : 0;

    // Get current digit from num2 (0 if pointer out of bounds)
    const digit2 = j >= 0 ? parseInt(num2[j]) : 0;

    // Calculate sum of current digits plus any carry
    const currentSum = digit1 + digit2 + carry;

    // Current digit is sum modulo 10 (gets us the ones place)
    const currentDigit = currentSum % 10;

    // Update carry for next iteration (integer division by 10)
    carry = Math.floor(currentSum / 10);

    // Append current digit to result (as string)
    result.push(currentDigit.toString());

    // Move pointers left
    i--;
    j--;
  }

  // After processing all digits, check if there's a remaining carry
  if (carry > 0) {
    result.push(carry.toString());
  }

  // Reverse result since we built it from least to most significant digit
  // Join into final string
  return result.reverse().join("");
}
```

```java
// Time: O(max(n, m)) where n = num1.length(), m = num2.length()
// Space: O(max(n, m)) for the result string
public String addStrings(String num1, String num2) {
    // Initialize pointers at the end of both strings
    int i = num1.length() - 1;
    int j = num2.length() - 1;

    int carry = 0;  // Track carry from previous digit addition
    StringBuilder result = new StringBuilder();  // Build result efficiently

    // Process digits from right to left until both strings exhausted
    while (i >= 0 || j >= 0) {
        // Get current digit from num1 (0 if pointer out of bounds)
        int digit1 = i >= 0 ? num1.charAt(i) - '0' : 0;

        // Get current digit from num2 (0 if pointer out of bounds)
        int digit2 = j >= 0 ? num2.charAt(j) - '0' : 0;

        // Calculate sum of current digits plus any carry
        int currentSum = digit1 + digit2 + carry;

        // Current digit is sum modulo 10 (gets us the ones place)
        int currentDigit = currentSum % 10;

        // Update carry for next iteration (integer division by 10)
        carry = currentSum / 10;

        // Append current digit to result
        result.append(currentDigit);

        // Move pointers left
        i--;
        j--;
    }

    // After processing all digits, check if there's a remaining carry
    if (carry > 0) {
        result.append(carry);
    }

    // Reverse result since we built it from least to most significant digit
    // Convert to string
    return result.reverse().toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max(n, m)) where n and m are the lengths of num1 and num2 respectively. We process each digit exactly once, and the while loop runs until we've processed all digits from the longer string.

**Space Complexity:** O(max(n, m)) for the output string. The result string will have at most max(n, m) + 1 digits (if there's a final carry). We use additional O(1) space for pointers and carry.

The complexity comes from:

- The while loop iterates max(n, m) times (plus possibly one more for final carry)
- Each iteration does constant work: digit extraction, addition, modulo, and division
- The result string grows proportionally to the input sizes

## Common Mistakes

1. **Forgetting to handle the final carry:** After processing all digits, if carry > 0, you need to append it. Example: "9" + "1" should give "10", not "0".

2. **Incorrect digit extraction when pointer is negative:** When one string is shorter, you must check if the pointer is still in bounds before accessing the character. Using `num1[i]` when `i < 0` causes index errors.

3. **Building result in wrong order:** Since we process from right to left, we append digits in reverse order (least significant first). Forgetting to reverse at the end gives the wrong answer. Example: "123" + "456" would give "975" instead of "579".

4. **Not converting characters to integers properly:** Using `int('5')` works in Python, but in Java you need `char - '0'`, and in JavaScript you need `parseInt()` or subtract character codes. Mixing up characters and their integer values leads to incorrect addition.

5. **Overcomplicating with padding:** Some candidates pad the shorter string with zeros to make lengths equal. This works but adds unnecessary space complexity. The "or 0" approach is cleaner.

## When You'll See This Pattern

This digit-by-digit simulation pattern appears whenever you need to perform arithmetic on numbers represented as strings, arrays, or linked lists:

1. **Add Two Numbers (Medium)** - Same concept but with linked lists instead of strings. You traverse two linked lists, add corresponding digits with carry, and build a result list.

2. **Multiply Strings (Medium)** - More complex but uses similar digit-by-digit processing. You multiply each digit of one number with each digit of the other, managing carries at each step.

3. **Add to Array-Form of Integer (Easy)** - Exactly the same pattern but with an array instead of a string. You add a regular integer to an array-form integer digit by digit.

4. **Plus One (Easy)** - A simplified version where you only add 1 to a number represented as an array, but still uses the carry propagation logic.

The core pattern is: process digits from least to most significant, maintain a carry, handle different lengths gracefully, and build the result in reverse order.

## Key Takeaways

1. **Right-to-left processing is key for arithmetic:** When adding or multiplying numbers, always start from the least significant digit (rightmost) and work toward the most significant (leftmost), just like you do manually.

2. **Carry propagation is the core challenge:** The main algorithmic complexity comes from correctly calculating, storing, and propagating the carry to the next digit position.

3. **Handle different lengths with conditional checks:** Use "or 0" logic when one number has more digits than the other, rather than padding or other more complex approaches.

4. **Build result in reverse, then correct:** It's natural to append digits as you compute them, but since you're processing from right to left, you'll need to reverse the result at the end.

This problem teaches fundamental digit manipulation skills that form the basis for more complex string arithmetic problems. Mastering this pattern will help you recognize and solve similar problems efficiently.

Related problems: [Add Two Numbers](/problem/add-two-numbers), [Multiply Strings](/problem/multiply-strings), [Add to Array-Form of Integer](/problem/add-to-array-form-of-integer)
