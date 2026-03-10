---
title: "How to Solve Fizz Buzz — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Fizz Buzz. Easy difficulty, 75.3% acceptance rate. Topics: Math, String, Simulation."
date: "2026-06-16"
category: "dsa-patterns"
tags: ["fizz-buzz", "math", "string", "simulation", "easy"]
---

# How to Solve Fizz Buzz

Fizz Buzz is a classic programming problem that asks you to generate a sequence of strings based on divisibility rules. While the logic is straightforward, this problem tests your attention to detail, understanding of modulo operations, and ability to handle edge cases properly. What makes it interesting is that despite its simplicity, many candidates stumble on the order of conditions or the 1-indexed requirement.

## Visual Walkthrough

Let's trace through the problem with `n = 5` to build intuition:

We need to generate an array where index `i` corresponds to the number `i+1` (since arrays are 0-indexed but our output is 1-indexed).

1. **i = 0 (number 1)**: Not divisible by 3 or 5 → output "1"
2. **i = 1 (number 2)**: Not divisible by 3 or 5 → output "2"
3. **i = 2 (number 3)**: Divisible by 3 → output "Fizz"
4. **i = 3 (number 4)**: Not divisible by 3 or 5 → output "4"
5. **i = 4 (number 5)**: Divisible by 5 → output "Buzz"

So for `n = 5`, our output would be: `["1", "2", "Fizz", "4", "Buzz"]`

Notice that we check divisibility by 3 and 5 first, then by 3 alone, then by 5 alone. This ordering matters because if we check divisibility by 3 first, number 15 would incorrectly output "Fizz" instead of "FizzBuzz".

## Brute Force Approach

For Fizz Buzz, there's essentially only one reasonable approach since we must examine every number from 1 to `n`. However, let's consider what a naive implementation might look like and common pitfalls:

A truly naive approach might use nested if-else statements without considering the order of conditions, or might forget to handle the 1-indexing properly. Some candidates might try to pre-compute multiples, but that doesn't provide any benefit since we still need to check every number.

The key insight is that we need to iterate through numbers 1 to `n` and apply conditional logic based on divisibility. The modulo operator (`%`) is essential here—it returns the remainder when dividing two numbers, so `x % y == 0` means `x` is divisible by `y`.

## Optimal Solution

The optimal solution is straightforward: iterate from 1 to `n`, check divisibility conditions in the correct order, and build the result array. We check for divisibility by both 3 and 5 first, then by 3 alone, then by 5 alone, and finally use the number itself as a string.

Here's the complete solution in three languages:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array, O(n) including output
def fizzBuzz(n):
    """
    Generate FizzBuzz sequence from 1 to n.

    Args:
        n: Integer upper bound (inclusive)

    Returns:
        List of strings following FizzBuzz rules
    """
    result = []  # Initialize empty list to store results

    # Iterate from 1 to n (inclusive)
    for i in range(1, n + 1):
        # Check divisibility by both 3 and 5 first (divisible by 15)
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        # Check divisibility by 3 only
        elif i % 3 == 0:
            result.append("Fizz")
        # Check divisibility by 5 only
        elif i % 5 == 0:
            result.append("Buzz")
        # If not divisible by 3 or 5, use the number as string
        else:
            result.append(str(i))

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array, O(n) including output
function fizzBuzz(n) {
  /**
   * Generate FizzBuzz sequence from 1 to n.
   *
   * @param {number} n - Integer upper bound (inclusive)
   * @return {string[]} Array of strings following FizzBuzz rules
   */
  const result = []; // Initialize empty array to store results

  // Iterate from 1 to n (inclusive)
  for (let i = 1; i <= n; i++) {
    // Check divisibility by both 3 and 5 first (divisible by 15)
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    }
    // Check divisibility by 3 only
    else if (i % 3 === 0) {
      result.push("Fizz");
    }
    // Check divisibility by 5 only
    else if (i % 5 === 0) {
      result.push("Buzz");
    }
    // If not divisible by 3 or 5, use the number as string
    else {
      result.push(i.toString());
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array, O(n) including output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> fizzBuzz(int n) {
        /**
         * Generate FizzBuzz sequence from 1 to n.
         *
         * @param n Integer upper bound (inclusive)
         * @return List of strings following FizzBuzz rules
         */
        List<String> result = new ArrayList<>();  // Initialize list to store results

        // Iterate from 1 to n (inclusive)
        for (int i = 1; i <= n; i++) {
            // Check divisibility by both 3 and 5 first (divisible by 15)
            if (i % 3 == 0 && i % 5 == 0) {
                result.add("FizzBuzz");
            }
            // Check divisibility by 3 only
            else if (i % 3 == 0) {
                result.add("Fizz");
            }
            // Check divisibility by 5 only
            else if (i % 5 == 0) {
                result.add("Buzz");
            }
            // If not divisible by 3 or 5, use the number as string
            else {
                result.add(Integer.toString(i));
            }
        }

        return result;
    }
}
```

</div>

**Why this solution works:**

1. **Correct iteration range**: We use `range(1, n+1)` in Python, `i = 1; i <= n` in JavaScript/Java to ensure we include `n` itself.
2. **Proper condition ordering**: Checking for divisibility by both 3 and 5 first ensures numbers like 15 output "FizzBuzz" not "Fizz".
3. **Efficient modulo operations**: The modulo operator gives us the remainder, making divisibility checks straightforward.
4. **String conversion**: We convert numbers to strings only when needed, avoiding unnecessary conversions.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through `n` numbers exactly once
- Each iteration performs a constant number of operations (modulo checks and string operations)
- No nested loops or recursive calls

**Space Complexity: O(n)** for the output array, **O(1)** auxiliary space

- The result array stores `n` strings, so it takes O(n) space
- We only use a few variables (`i`, `result` reference), which is O(1) auxiliary space
- If we don't count the output array (as is common in complexity analysis), the space complexity is O(1)

## Common Mistakes

1. **Off-by-one errors with loop bounds**: Using `i < n` instead of `i <= n` or starting from 0 instead of 1. This causes the sequence to be off by one position or miss the last number.
   - **Fix**: Always double-check your loop conditions. For 1-indexed output, start at 1 and use `<= n`.

2. **Incorrect condition ordering**: Checking divisibility by 3 or 5 before checking divisibility by both.

   ```python
   # WRONG: This would output "Fizz" for 15, not "FizzBuzz"
   if i % 3 == 0:
       result.append("Fizz")
   elif i % 5 == 0:
       result.append("Buzz")
   elif i % 3 == 0 and i % 5 == 0:
       result.append("FizzBuzz")  # This line is never reached!
   ```

   - **Fix**: Always check the most specific condition (divisible by both 3 and 5) first.

3. **Forgetting to convert numbers to strings**: Trying to append the integer directly to a string array.

   ```python
   # WRONG: Type error in some languages, incorrect type in others
   result.append(i)  # Should be str(i)
   ```

   - **Fix**: Use `str(i)` in Python, `i.toString()` in JavaScript, `Integer.toString(i)` in Java.

4. **Using wrong modulo operator or comparison**: Using division (`/`) instead of modulo (`%`) or comparing to the wrong value.
   ```python
   # WRONG: Division gives quotient, not remainder
   if i / 3 == 0:  # Should be i % 3 == 0
   ```

   - **Fix**: Remember that `x % y == 0` checks if `x` is divisible by `y`.

## When You'll See This Pattern

The Fizz Buzz pattern appears in problems that require:

- **Conditional transformation** based on rules
- **Iteration with conditional logic**
- **String building based on numerical properties**

Related problems that use similar patterns:

1. **Fizz Buzz Multithreaded (LeetCode 1195)**: This is a direct extension where you need to coordinate multiple threads to print the Fizz Buzz sequence. It tests the same divisibility logic but adds concurrency challenges.

2. **Categorize Box According to Criteria (LeetCode 2525)**: Requires checking multiple conditions (dimensions, weight) and returning a category based on which conditions are met, similar to Fizz Buzz's conditional logic.

3. **Self Dividing Numbers (LeetCode 728)**: Requires checking divisibility rules for each digit of a number, extending the divisibility checking concept.

4. **Count Primes (LeetCode 204)**: While more complex, it involves iterating through numbers and applying rules about divisibility to identify primes.

## Key Takeaways

1. **Order matters in conditional logic**: Always check the most specific conditions first. In Fizz Buzz, "divisible by both 3 and 5" is more specific than "divisible by 3" or "divisible by 5".

2. **Pay attention to indexing requirements**: Problems may use 0-indexed or 1-indexed output. Read carefully and adjust your loop bounds accordingly.

3. **Modulo operator is key for divisibility checks**: `x % y == 0` is the standard way to check if `x` is divisible by `y` in most programming languages.

4. **Even simple problems test attention to detail**: Fizz Buzz seems trivial, but many candidates fail due to small oversights. Practice writing clean, correct code from the start.

Related problems: [Fizz Buzz Multithreaded](/problem/fizz-buzz-multithreaded), [Categorize Box According to Criteria](/problem/categorize-box-according-to-criteria)
