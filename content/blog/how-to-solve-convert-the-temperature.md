---
title: "How to Solve Convert the Temperature — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert the Temperature. Easy difficulty, 90.3% acceptance rate. Topics: Math."
date: "2028-01-20"
category: "dsa-patterns"
tags: ["convert-the-temperature", "math", "easy"]
---

# How to Solve Convert the Temperature

This problem asks you to convert a Celsius temperature to both Kelvin and Fahrenheit, returning both values in an array. While mathematically straightforward, it's a great warm-up problem that tests attention to detail with floating-point arithmetic and formula implementation. The "tricky" part isn't the math itself, but ensuring you handle the conversion formulas correctly and understand the precision requirements.

## Visual Walkthrough

Let's trace through an example: `celsius = 36.50`

**Step 1: Convert to Kelvin**
The formula is: `Kelvin = Celsius + 273.15`

- `36.50 + 273.15 = 309.65`

**Step 2: Convert to Fahrenheit**
The formula is: `Fahrenheit = Celsius × 1.8 + 32`

- `36.50 × 1.8 = 65.70`
- `65.70 + 32 = 97.70`

**Step 3: Return the array**
We create an array with both values: `[309.65, 97.70]`

The problem states that answers within `10^-5` of the actual answer are accepted, which means we don't need to worry about floating-point precision issues beyond normal double-precision arithmetic.

## Brute Force Approach

For this particular problem, there's no "brute force" in the traditional sense since we're just applying mathematical formulas. However, a naive approach might involve:

1. Incorrectly memorizing the formulas
2. Using integer division instead of floating-point division
3. Not handling the precision requirement properly

The only reasonable approach is to directly apply the conversion formulas, which is already optimal. What makes this problem interesting is that it tests whether you can:

- Recall or derive the correct conversion formulas
- Handle floating-point arithmetic correctly
- Follow the exact output format specified

## Optimal Solution

The optimal solution directly applies the conversion formulas. We'll implement both conversions in a single function that returns the results as an array.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def convertTemperature(celsius):
    """
    Convert Celsius to Kelvin and Fahrenheit.

    Args:
    celsius (float): Temperature in Celsius

    Returns:
    list[float]: [kelvin, fahrenheit]
    """
    # Step 1: Convert to Kelvin using the formula K = C + 273.15
    kelvin = celsius + 273.15

    # Step 2: Convert to Fahrenheit using the formula F = C × 1.8 + 32
    # Using 1.8 instead of 9/5 to avoid potential floating-point issues
    fahrenheit = celsius * 1.8 + 32

    # Step 3: Return both values as an array
    return [kelvin, fahrenheit]
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Convert Celsius to Kelvin and Fahrenheit.
 * @param {number} celsius - Temperature in Celsius
 * @return {number[]} [kelvin, fahrenheit]
 */
function convertTemperature(celsius) {
  // Step 1: Convert to Kelvin using the formula K = C + 273.15
  const kelvin = celsius + 273.15;

  // Step 2: Convert to Fahrenheit using the formula F = C × 1.8 + 32
  // Using 1.8 instead of 9/5 for consistency and to avoid potential
  // floating-point precision issues with division
  const fahrenheit = celsius * 1.8 + 32;

  // Step 3: Return both values as an array
  return [kelvin, fahrenheit];
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Convert Celsius to Kelvin and Fahrenheit.
     * @param celsius Temperature in Celsius
     * @return Array containing [kelvin, fahrenheit]
     */
    public double[] convertTemperature(double celsius) {
        // Step 1: Convert to Kelvin using the formula K = C + 273.15
        double kelvin = celsius + 273.15;

        // Step 2: Convert to Fahrenheit using the formula F = C × 1.8 + 32
        // Using 1.8 instead of 9/5 for consistency across languages
        double fahrenheit = celsius * 1.8 + 32;

        // Step 3: Create and return the result array
        return new double[]{kelvin, fahrenheit};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of arithmetic operations (addition and multiplication)
- The time doesn't depend on the input size

**Space Complexity: O(1)**

- We use a constant amount of extra space (just the return array with 2 elements)
- No additional data structures that grow with input size

The operations are simple arithmetic, so the solution is as efficient as possible.

## Common Mistakes

1. **Using integer division instead of floating-point division**
   - Mistake: Using `9/5` in languages where integer division truncates (like Java with integers)
   - Solution: Use `1.8` or `9.0/5.0` to ensure floating-point arithmetic

2. **Incorrect Fahrenheit formula**
   - Mistake: Using `C × 9/5 + 32` but forgetting parentheses: `celsius * 9/5 + 32` evaluates as `(celsius * 9)/5 + 32` which is correct, but `celsius * (9/5) + 32` might cause issues if `9/5` is integer division
   - Solution: Use `celsius * 1.8 + 32` for clarity and to avoid operator precedence confusion

3. **Not handling floating-point precision**
   - Mistake: Worrying too much about the `10^-5` tolerance and overcomplicating the solution
   - Solution: Standard double-precision floating-point arithmetic is sufficient; the tolerance is generous

4. **Returning wrong order or wrong data type**
   - Mistake: Returning `[fahrenheit, kelvin]` instead of `[kelvin, fahrenheit]`
   - Solution: Double-check the problem statement and test with the example

## When You'll See This Pattern

This problem uses **direct formula application**, a pattern you'll see in many mathematical and physics-based problems:

1. **Basic Calculator Problems** - Like "Add Two Numbers" or "Multiply Strings" where you implement arithmetic operations
2. **Unit Conversion Problems** - Similar to "Convert Binary Number in a Linked List to Integer" or Roman numeral conversion
3. **Geometry Problems** - Calculating areas, distances, or angles using known formulas

Specific related problems:

- **Smallest Even Multiple** - Also requires applying a simple mathematical formula
- **Add Two Integers** - Basic arithmetic operation implementation
- **Roman to Integer** - Converting between different representation systems using rules/formulas

## Key Takeaways

1. **Read formulas carefully** - The difference between `9/5` and `1.8` matters in some languages due to integer division
2. **Know your language's arithmetic rules** - Different languages handle division differently (integer vs. floating-point)
3. **Simple problems test attention to detail** - Even when the solution seems obvious, small mistakes in implementation can cost you

The core skill here isn't complex algorithm design, but precise implementation of known formulas—a common requirement in interview problems that appear deceptively simple.

Related problems: [Smallest Even Multiple](/problem/smallest-even-multiple)
