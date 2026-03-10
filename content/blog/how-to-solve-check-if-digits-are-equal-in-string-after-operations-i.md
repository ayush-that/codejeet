---
title: "How to Solve Check If Digits Are Equal in String After Operations I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If Digits Are Equal in String After Operations I. Easy difficulty, 82.5% acceptance rate. Topics: Math, String, Simulation, Combinatorics, Number Theory."
date: "2026-05-18"
category: "dsa-patterns"
tags:
  ["check-if-digits-are-equal-in-string-after-operations-i", "math", "string", "simulation", "easy"]
---

# How to Solve "Check If Digits Are Equal in String After Operations I"

This problem asks us to repeatedly transform a string of digits by replacing each pair of consecutive digits with their sum modulo 10, until only two digits remain. We then check if those two digits are equal. What makes this interesting is that while the operation seems straightforward, there's a mathematical insight that can optimize the solution—though a direct simulation approach works fine for the constraints.

## Visual Walkthrough

Let's trace through an example step-by-step to understand the process. Consider `s = "12345"`:

**Step 1:** Original string has 5 digits → need to reduce to exactly 2 digits

- Pairs: (1,2), (2,3), (3,4), (4,5)
- Calculate sums modulo 10:
  - (1+2) % 10 = 3
  - (2+3) % 10 = 5
  - (3+4) % 10 = 7
  - (4+5) % 10 = 9
- New string: "3579" (4 digits)

**Step 2:** String has 4 digits → still need to reduce further

- Pairs: (3,5), (5,7), (7,9)
- Calculate:
  - (3+5) % 10 = 8
  - (5+7) % 10 = 2
  - (7+9) % 10 = 6
- New string: "826" (3 digits)

**Step 3:** String has 3 digits → still need to reduce further

- Pairs: (8,2), (2,6)
- Calculate:
  - (8+2) % 10 = 0
  - (2+6) % 10 = 8
- New string: "08" (2 digits) ← We stop here

**Final check:** Are the two digits equal? "0" ≠ "8", so return `false`.

The process continues until we have exactly 2 digits, then we compare them.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described:

1. While the string length is greater than 2:
   - Create a new empty string
   - For each pair of consecutive digits (i from 0 to length-2):
     - Convert both characters to integers
     - Calculate (digit1 + digit2) % 10
     - Append the result to the new string
   - Replace the original string with the new string
2. When the string has exactly 2 digits, check if they're equal

This approach is correct but can be inefficient for long strings. Each iteration reduces the string length by 1, so for a string of length n, we need n-2 iterations. In each iteration, we process nearly all characters, giving us O(n²) time complexity in the worst case.

While this might be acceptable for the problem's constraints (since n ≤ 100), it's worth understanding the pattern and potential optimizations.

## Optimal Solution

The optimal solution follows the brute force simulation but implements it efficiently. We'll use a while loop to continue until we have exactly 2 digits, building a new string in each iteration.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
# For string length n, we perform n-2 iterations, each processing O(n) characters
def hasSameDigits(self, s: str) -> bool:
    """
    Repeatedly reduce the string by replacing consecutive digit pairs
    with their sum modulo 10 until only 2 digits remain.
    Return True if the final two digits are equal, False otherwise.
    """
    # Continue until we have exactly 2 digits
    while len(s) > 2:
        # Build the next string from pairwise sums
        next_s = []

        # Process each consecutive pair
        for i in range(len(s) - 1):
            # Convert characters to integers
            digit1 = int(s[i])
            digit2 = int(s[i + 1])

            # Calculate sum modulo 10
            new_digit = (digit1 + digit2) % 10

            # Append to next string (as character)
            next_s.append(str(new_digit))

        # Update s for next iteration
        s = ''.join(next_s)

    # Now s has exactly 2 digits
    # Check if they are equal
    return s[0] == s[1]
```

```javascript
// Time: O(n²) | Space: O(n)
// For string length n, we perform n-2 iterations, each processing O(n) characters
function hasSameDigits(s) {
  /**
   * Repeatedly reduce the string by replacing consecutive digit pairs
   * with their sum modulo 10 until only 2 digits remain.
   * Return true if the final two digits are equal, false otherwise.
   */

  // Continue until we have exactly 2 digits
  while (s.length > 2) {
    // Build the next string from pairwise sums
    let nextS = "";

    // Process each consecutive pair
    for (let i = 0; i < s.length - 1; i++) {
      // Convert characters to integers
      const digit1 = parseInt(s[i], 10);
      const digit2 = parseInt(s[i + 1], 10);

      // Calculate sum modulo 10
      const newDigit = (digit1 + digit2) % 10;

      // Append to next string
      nextS += newDigit.toString();
    }

    // Update s for next iteration
    s = nextS;
  }

  // Now s has exactly 2 digits
  // Check if they are equal
  return s[0] === s[1];
}
```

```java
// Time: O(n²) | Space: O(n)
// For string length n, we perform n-2 iterations, each processing O(n) characters
public boolean hasSameDigits(String s) {
    /**
     * Repeatedly reduce the string by replacing consecutive digit pairs
     * with their sum modulo 10 until only 2 digits remain.
     * Return true if the final two digits are equal, false otherwise.
     */

    // Continue until we have exactly 2 digits
    while (s.length() > 2) {
        // StringBuilder is more efficient than string concatenation in loops
        StringBuilder nextS = new StringBuilder();

        // Process each consecutive pair
        for (int i = 0; i < s.length() - 1; i++) {
            // Convert characters to integers
            int digit1 = s.charAt(i) - '0';  // Efficient conversion
            int digit2 = s.charAt(i + 1) - '0';

            // Calculate sum modulo 10
            int newDigit = (digit1 + digit2) % 10;

            // Append to next string
            nextS.append(newDigit);
        }

        // Update s for next iteration
        s = nextS.toString();
    }

    // Now s has exactly 2 digits
    // Check if they are equal
    return s.charAt(0) == s.charAt(1);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the length of the input string. Here's why:

- Each iteration reduces the string length by 1
- We start with n digits and stop when we have 2 digits, so we perform n-2 iterations
- In the k-th iteration, we process (n-k) pairs, each taking constant time
- The total work is approximately n + (n-1) + (n-2) + ... + 3 = O(n²)

**Space Complexity:** O(n) for storing the intermediate strings. At any point, we're storing at most one string of length up to n, plus potentially building a new string of slightly shorter length.

For n ≤ 100 (typical constraint), O(n²) = 10,000 operations is perfectly acceptable. There's actually a mathematical approach using combinatorial coefficients that could solve this in O(n) time, but the simulation is simpler and sufficient for the constraints.

## Common Mistakes

1. **Off-by-one errors in the pair iteration:** The loop should go from `i = 0` to `i < len(s) - 1` (not `len(s)`). Accessing `s[i+1]` when `i = len(s)-1` would cause an index out of bounds error.

2. **Forgetting to convert characters to integers:** If you try `s[i] + s[i+1]` without conversion, you're concatenating strings or adding character codes, not performing arithmetic addition.

3. **Incorrect termination condition:** The problem says to continue until the string has **exactly** two digits. Some candidates might stop when length ≤ 2, which would incorrectly handle the edge case where the input already has 2 digits.

4. **Inefficient string building:** In Java, using `String` concatenation in a loop creates many intermediate objects. Using `StringBuilder` is more efficient. Similarly in Python, building a list and joining once is better than repeated string concatenation.

## When You'll See This Pattern

This problem uses **iterative reduction** or **pairwise transformation**, a pattern seen in several other problems:

1. **LeetCode 119: Pascal's Triangle II** - Each row is built from the previous row by summing adjacent elements, similar to our pairwise operation.

2. **LeetCode 1047: Remove All Adjacent Duplicates In String** - While not identical, it also involves processing adjacent elements and building a new string iteratively.

3. **LeetCode 682: Baseball Game** - Operations build upon previous results in a sequential manner, though the operations are more varied.

The key insight is recognizing when a problem involves transforming data through repeated application of a simple rule to adjacent elements. These often have straightforward simulation solutions that are efficient enough for the given constraints.

## Key Takeaways

1. **Simulation is often sufficient:** When constraints are small (n ≤ 100), O(n²) solutions are acceptable. Don't overcomplicate problems looking for optimal solutions when a straightforward approach works.

2. **Pay attention to index boundaries:** When processing adjacent elements, carefully check loop conditions to avoid off-by-one errors. Test with small examples.

3. **Understand the reduction pattern:** Each iteration reduces problem size by a constant amount (here by 1). The number of iterations is predictable based on the input size.

4. **Character-to-integer conversion matters:** Remember that digit characters '0'-'9' have ASCII values 48-57. Always convert to integers before arithmetic operations.

[Practice this problem on CodeJeet](/problem/check-if-digits-are-equal-in-string-after-operations-i)
