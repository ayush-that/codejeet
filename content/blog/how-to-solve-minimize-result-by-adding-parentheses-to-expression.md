---
title: "How to Solve Minimize Result by Adding Parentheses to Expression — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize Result by Adding Parentheses to Expression. Medium difficulty, 68.2% acceptance rate. Topics: String, Enumeration."
date: "2029-07-06"
category: "dsa-patterns"
tags: ["minimize-result-by-adding-parentheses-to-expression", "string", "enumeration", "medium"]
---

# How to Solve Minimize Result by Adding Parentheses to Expression

You're given a string expression in the format `"num1+num2"` where both numbers are positive integers. Your task is to insert exactly one pair of parentheses anywhere in the expression to create a valid mathematical expression that evaluates to the smallest possible value. The parentheses can split the numbers into parts that get multiplied together. This problem is tricky because you need to understand how parentheses change the order of operations and systematically check all valid placements.

## Visual Walkthrough

Let's trace through the example `"247+38"` step by step to build intuition.

The expression has two numbers: `247` and `38`. When we add parentheses, we're essentially creating an expression of the form:
`(a + b) * c + d` or `a * (b + c) + d` or `a + (b + c) * d` etc., depending on where we place them.

For `"247+38"`, let's try placing parentheses after the first digit of the first number:

- Place parentheses after position 1: `"2(47+38)"`
- This means: `2 * (47 + 38) = 2 * 85 = 170`

Now let's try placing parentheses after the second digit of the first number:

- Place parentheses after position 2: `"24(7+38)"`
- This means: `24 * (7 + 38) = 24 * 45 = 1080`

What if we place parentheses around part of the second number?

- Place parentheses before the `+`: `"(247)+38"` isn't valid since we need to split the numbers
- Place parentheses after the `+` at position 4: `"247+(38)"` means `247 + 38 = 285` (no multiplication)
- Actually, `"247+(38)"` is just `247 + 38` since there's nothing to multiply

The key insight: When we place parentheses, we're splitting both numbers into three parts total:

1. Left part before opening parenthesis (a)
2. Middle part inside parentheses (b + c)
3. Right part after closing parenthesis (d)

So the expression becomes: `a * (b + c) * d`

If `a` or `d` is empty, it's treated as 1 (multiplicative identity). If the parentheses start at the beginning of the first number, `a = 1`. If they end at the end of the second number, `d = 1`.

For `"247+38"`, the minimum value we'll find is 170 from `"2(47+38)"`.

## Brute Force Approach

The brute force approach is straightforward: try every possible valid placement of parentheses and calculate the result for each. A valid placement means:

1. The opening parenthesis `(` can be placed before any digit of the first number or right before the `+`
2. The closing parenthesis `)` can be placed after any digit of the second number or right after the `+`
3. But they must create a valid expression where parentheses contain at least one digit from each side of the `+`

More precisely:

- Opening `(` can be at positions 0 through `len(num1)` (before first digit to after last digit of first number)
- Closing `)` can be at positions from `(` position + 1 through total length
- But we must ensure at least one digit from each number is inside parentheses

This gives us O(n²) possible placements where n is the length of the expression. For each placement, we parse the numbers and calculate the result.

While this brute force would technically work (and is actually the optimal approach for this problem since we need to check all placements), a naive implementation might be inefficient in parsing strings repeatedly or might miss some valid placements.

## Optimized Approach

The key insight is that we need to systematically enumerate all valid parenthesis placements. Since the expression format is fixed (`num1+num2`), we can:

1. Find the `+` sign to separate the two numbers
2. For each possible split point in the first number (including before the first digit):
   - For each possible split point in the second number (including after the last digit):
   - Construct the expression with parentheses at those positions
   - Calculate: `left_part * (middle_left + middle_right) * right_part`
   - Track the minimum result

The optimization comes from careful implementation:

- Pre-parse the numbers to avoid repeated string parsing
- Handle edge cases where left_part or right_part might be empty (treat as 1)
- Use integer arithmetic instead of eval() for safety and clarity

We need to be careful about the indices:

- Opening `(` can be at positions i where 0 ≤ i ≤ len(num1)
- Closing `)` can be at positions j where len(num1)+1 ≤ j ≤ total length
- But j must be after the `+` sign, so j ≥ len(num1)+1

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n²) where n is length of expression - we try all valid parenthesis placements
# Space: O(n) for storing the result string
def minimizeResult(expression: str) -> str:
    # Step 1: Find the plus sign to separate the two numbers
    plus_index = expression.find('+')
    num1 = expression[:plus_index]
    num2 = expression[plus_index + 1:]

    min_value = float('inf')  # Initialize with infinity
    result_expr = ""

    # Step 2: Try all possible positions for opening parenthesis in first number
    # i represents how many digits from num1 are BEFORE the opening parenthesis
    # i can be 0 (parenthesis at start) to len(num1) (parenthesis after all digits)
    for i in range(len(num1) + 1):
        # Step 3: Try all possible positions for closing parenthesis in second number
        # j represents how many digits from num2 are INSIDE the parentheses
        # j can be 1 (at least one digit from num2 inside) to len(num2) (all digits inside)
        for j in range(1, len(num2) + 1):
            # Extract the four parts:
            # left_part: digits of num1 before opening parenthesis
            left_part_str = num1[:i]
            # middle_left: digits of num1 inside parentheses
            middle_left_str = num1[i:]
            # middle_right: digits of num2 inside parentheses
            middle_right_str = num2[:j]
            # right_part: digits of num2 after closing parenthesis
            right_part_str = num2[j:]

            # Convert strings to integers, handling empty strings as 1
            left_part = int(left_part_str) if left_part_str else 1
            middle_left = int(middle_left_str) if middle_left_str else 0
            middle_right = int(middle_right_str) if middle_right_str else 0
            right_part = int(right_part_str) if right_part_str else 1

            # Calculate the value: left_part * (middle_left + middle_right) * right_part
            current_value = left_part * (middle_left + middle_right) * right_part

            # Step 4: Update minimum value and corresponding expression
            if current_value < min_value:
                min_value = current_value
                # Construct the expression with parentheses
                result_expr = f"{num1[:i]}({num1[i:]}+{num2[:j]}){num2[j:]}"

    return result_expr
```

```javascript
// Time: O(n²) where n is length of expression - we try all valid parenthesis placements
// Space: O(n) for storing the result string
function minimizeResult(expression) {
  // Step 1: Find the plus sign to separate the two numbers
  const plusIndex = expression.indexOf("+");
  const num1 = expression.substring(0, plusIndex);
  const num2 = expression.substring(plusIndex + 1);

  let minValue = Infinity;
  let resultExpr = "";

  // Step 2: Try all possible positions for opening parenthesis in first number
  // i represents how many digits from num1 are BEFORE the opening parenthesis
  for (let i = 0; i <= num1.length; i++) {
    // Step 3: Try all possible positions for closing parenthesis in second number
    // j represents how many digits from num2 are INSIDE the parentheses
    for (let j = 1; j <= num2.length; j++) {
      // Extract the four parts
      const leftPartStr = num1.substring(0, i);
      const middleLeftStr = num1.substring(i);
      const middleRightStr = num2.substring(0, j);
      const rightPartStr = num2.substring(j);

      // Convert strings to integers, handling empty strings appropriately
      const leftPart = leftPartStr ? parseInt(leftPartStr) : 1;
      const middleLeft = middleLeftStr ? parseInt(middleLeftStr) : 0;
      const middleRight = middleRightStr ? parseInt(middleRightStr) : 0;
      const rightPart = rightPartStr ? parseInt(rightPartStr) : 1;

      // Calculate the value: left_part * (middle_left + middle_right) * right_part
      const currentValue = leftPart * (middleLeft + middleRight) * rightPart;

      // Step 4: Update minimum value and corresponding expression
      if (currentValue < minValue) {
        minValue = currentValue;
        // Construct the expression with parentheses
        resultExpr = `${num1.substring(0, i)}(${num1.substring(i)}+${num2.substring(0, j)})${num2.substring(j)}`;
      }
    }
  }

  return resultExpr;
}
```

```java
// Time: O(n²) where n is length of expression - we try all valid parenthesis placements
// Space: O(n) for storing the result string
class Solution {
    public String minimizeResult(String expression) {
        // Step 1: Find the plus sign to separate the two numbers
        int plusIndex = expression.indexOf('+');
        String num1 = expression.substring(0, plusIndex);
        String num2 = expression.substring(plusIndex + 1);

        long minValue = Long.MAX_VALUE;
        String resultExpr = "";

        // Step 2: Try all possible positions for opening parenthesis in first number
        // i represents how many digits from num1 are BEFORE the opening parenthesis
        for (int i = 0; i <= num1.length(); i++) {
            // Step 3: Try all possible positions for closing parenthesis in second number
            // j represents how many digits from num2 are INSIDE the parentheses
            for (int j = 1; j <= num2.length(); j++) {
                // Extract the four parts
                String leftPartStr = num1.substring(0, i);
                String middleLeftStr = num1.substring(i);
                String middleRightStr = num2.substring(0, j);
                String rightPartStr = num2.substring(j);

                // Convert strings to integers, handling empty strings appropriately
                long leftPart = leftPartStr.isEmpty() ? 1 : Long.parseLong(leftPartStr);
                long middleLeft = middleLeftStr.isEmpty() ? 0 : Long.parseLong(middleLeftStr);
                long middleRight = middleRightStr.isEmpty() ? 0 : Long.parseLong(middleRightStr);
                long rightPart = rightPartStr.isEmpty() ? 1 : Long.parseLong(rightPartStr);

                // Calculate the value: left_part * (middle_left + middle_right) * right_part
                long currentValue = leftPart * (middleLeft + middleRight) * rightPart;

                // Step 4: Update minimum value and corresponding expression
                if (currentValue < minValue) {
                    minValue = currentValue;
                    // Construct the expression with parentheses
                    resultExpr = num1.substring(0, i) + "(" + num1.substring(i) + "+" +
                                 num2.substring(0, j) + ")" + num2.substring(j);
                }
            }
        }

        return resultExpr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the length of the expression. We have nested loops: the outer loop runs O(len(num1)) times and the inner loop runs O(len(num2)) times. In the worst case, when the numbers are roughly equal length, this is O((n/2)²) = O(n²). For each placement, we do constant work (string slicing and arithmetic).

**Space Complexity:** O(n) for storing the result string. We use additional O(1) space for variables during computation. The input string is not modified.

## Common Mistakes

1. **Incorrect parenthesis placement logic:** Candidates often miss valid placements, especially when parentheses can be at the very beginning or end. Remember: opening `(` can be before the first digit (i=0) or after the last digit of first number (i=len(num1)), and closing `)` can be after the last digit (j=len(num2)).

2. **Forgetting to handle empty parts as 1:** When left_part or right_part is empty (parentheses at the very beginning or end), they should be treated as 1, not 0. Multiplication by 0 would give wrong results.

3. **Using eval() or similar unsafe evaluation:** While tempting, using eval() on constructed strings is dangerous and often disallowed in interviews. It's also slower than direct arithmetic.

4. **Integer overflow:** For large numbers, the product might exceed 32-bit integer limits. Use long integers (64-bit) in Java, or Python's arbitrary precision integers handle this automatically.

## When You'll See This Pattern

This problem uses **exhaustive enumeration** of all valid configurations, which is common when:

- The search space is small enough to brute force (O(n²) is acceptable for n ≤ 100)
- You need to find an optimal placement or configuration
- The problem constraints allow checking all possibilities

Similar problems:

1. **Different Ways to Add Parentheses (Medium)** - Also involves placing parentheses in expressions, but returns all possible results rather than the minimum.
2. **Solve the Equation (Medium)** - Involves parsing and evaluating mathematical expressions with variables.
3. **Basic Calculator (Hard)** - More complex expression evaluation with multiple operators and parentheses.

## Key Takeaways

1. **When constraints are small, brute force enumeration is often the optimal solution.** Don't overcomplicate problems that can be solved by checking all possibilities.
2. **Carefully define the search space.** For this problem, understanding exactly where parentheses can be placed (all valid i,j pairs) is crucial.
3. **Handle edge cases explicitly.** Empty string parts should be treated as 1 (for multiplication) or 0 (for addition) based on mathematical identity elements.

Related problems: [Basic Calculator](/problem/basic-calculator), [Different Ways to Add Parentheses](/problem/different-ways-to-add-parentheses), [Solve the Equation](/problem/solve-the-equation)
