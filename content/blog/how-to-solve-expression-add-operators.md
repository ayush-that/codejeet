---
title: "How to Solve Expression Add Operators — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Expression Add Operators. Hard difficulty, 42.8% acceptance rate. Topics: Math, String, Backtracking."
date: "2027-12-18"
category: "dsa-patterns"
tags: ["expression-add-operators", "math", "string", "backtracking", "hard"]
---

# How to Solve Expression Add Operators

You're given a string of digits and a target integer. Your task is to insert `+`, `-`, or `*` operators between the digits to create expressions that evaluate to the target. The challenge? You need to generate **all possible valid expressions**, handle operator precedence (especially multiplication), and avoid leading zeros in multi-digit numbers. This problem tests your ability to combine backtracking with expression evaluation while managing state efficiently.

## Visual Walkthrough

Let's trace through `num = "123"`, `target = 6`:

We'll build expressions by inserting operators between digits:

- Start with first digit "1": `current = 1`
- Add second digit "2":
  - Add `+`: `1+2` → evaluate later
  - Add `-`: `1-2` → evaluate later
  - Add `*`: `1*2` → evaluate later
  - Or concatenate: `12` (no operator yet)

Let's follow `1+2` path:

- Add third digit "3":
  - `1+2+3` = 6 ✓ (found!)
  - `1+2-3` = 0 ✗
  - `1+2*3` = 1+6 = 7 ✗
  - `1+23` = 24 ✗

Now try `1*2` path:

- Add third digit "3":
  - `1*2+3` = 2+3 = 5 ✗
  - `1*2-3` = 2-3 = -1 ✗
  - `1*2*3` = 6 ✓ (found!)
  - `1*23` = 23 ✗

Also try `12` path:

- Add third digit "3":
  - `12+3` = 15 ✗
  - `12-3` = 9 ✗
  - `12*3` = 36 ✗
  - `123` = 123 ✗

Final results: `["1+2+3", "1*2*3"]`

The tricky part? When we see `1+2*3`, multiplication has higher precedence. We can't just evaluate left-to-right. We need to track the last operand to handle multiplication correctly.

## Brute Force Approach

A naive approach would be:

1. Generate all possible operator placements (between each pair of digits, choose from 4 options: `+`, `-`, `*`, or concatenate)
2. For each generated expression, evaluate it respecting operator precedence
3. Keep expressions that equal the target

For a string of length `n`, there are `n-1` gaps between digits. Each gap has 4 choices, giving us `4^(n-1)` possible expressions. Evaluating each expression takes `O(n)` time, so total time is `O(n * 4^n)`. For `n=10`, that's over 10 million operations - too slow!

The brute force also doesn't handle the evaluation efficiently. We'd need to parse each expression, handle operator precedence, and avoid recomputing partial results.

## Optimized Approach

The key insight is to use **backtracking with state** to build expressions incrementally while evaluating as we go. Instead of generating full expressions then evaluating, we compute the value on-the-fly.

We need to track three values:

1. `current_val`: The value of the current expression so far
2. `last_operand`: The value of the last operand added (needed for multiplication precedence)
3. `expression`: The string representation being built

Why track `last_operand`? Consider `1+2*3`:

- When we see `+2`, we add 2 to `current_val` and set `last_operand = 2`
- When we see `*3`, we need to undo the last addition: `current_val - last_operand + (last_operand * 3)`
- So: `1 + 2*3 = (1 + 2) - 2 + (2*3) = 1 + 6 = 7`

For multiplication: `new_last_operand = last_operand * current_number`
For addition/subtraction: `new_last_operand = current_number` (with appropriate sign)

We also must handle:

- **Leading zeros**: If a number starts with '0', it must be exactly "0", not "01", "012", etc.
- **Large numbers**: The string can be up to 10 digits, so numbers can be up to 10 digits long.
- **All operators**: `+`, `-`, and `*` between any pair of digits.

## Optimal Solution

We use backtracking with these parameters:

- `index`: Current position in `num`
- `path`: Current expression string
- `calculated_val`: Current computed value
- `last_operand`: Last operand added (for multiplication precedence)

At each step, we try all possible substrings starting at `index` (all valid numbers), and for each, try all three operators.

<div class="code-group">

```python
# Time: O(4^n) - at each of n-1 positions, 4 choices (3 ops + concat)
# Space: O(n) for recursion depth, O(4^n) for output
class Solution:
    def addOperators(self, num: str, target: int) -> List[str]:
        def backtrack(index, path, calculated_val, last_operand):
            # If we've used all digits
            if index == len(num):
                # Check if we've reached the target
                if calculated_val == target:
                    result.append(path)
                return

            # Try all possible substrings starting at index
            for i in range(index, len(num)):
                # Skip numbers with leading zero (except single zero)
                if i > index and num[index] == '0':
                    break

                # Parse current substring as a number
                current_str = num[index:i+1]
                current_num = int(current_str)

                # If this is the first number, just initialize
                if index == 0:
                    backtrack(i+1, current_str, current_num, current_num)
                else:
                    # Try addition: current_val + current_num
                    backtrack(i+1, path + '+' + current_str,
                             calculated_val + current_num, current_num)

                    # Try subtraction: current_val - current_num
                    backtrack(i+1, path + '-' + current_str,
                             calculated_val - current_num, -current_num)

                    # Try multiplication: current_val - last_operand + (last_operand * current_num)
                    # Why? Because multiplication has higher precedence
                    # Example: 1+2*3 = (1+2) - 2 + (2*3) = 1 + 6 = 7
                    backtrack(i+1, path + '*' + current_str,
                             calculated_val - last_operand + (last_operand * current_num),
                             last_operand * current_num)

        result = []
        if not num:
            return result

        backtrack(0, "", 0, 0)
        return result
```

```javascript
// Time: O(4^n) - at each of n-1 positions, 4 choices (3 ops + concat)
// Space: O(n) for recursion depth, O(4^n) for output
function addOperators(num, target) {
  const result = [];

  function backtrack(index, path, calculatedVal, lastOperand) {
    // If we've used all digits
    if (index === num.length) {
      // Check if we've reached the target
      if (calculatedVal === target) {
        result.push(path);
      }
      return;
    }

    // Try all possible substrings starting at index
    for (let i = index; i < num.length; i++) {
      // Skip numbers with leading zero (except single zero)
      if (i > index && num[index] === "0") {
        break;
      }

      // Parse current substring as a number
      const currentStr = num.substring(index, i + 1);
      const currentNum = parseInt(currentStr, 10);

      // If this is the first number, just initialize
      if (index === 0) {
        backtrack(i + 1, currentStr, currentNum, currentNum);
      } else {
        // Try addition: currentVal + currentNum
        backtrack(i + 1, path + "+" + currentStr, calculatedVal + currentNum, currentNum);

        // Try subtraction: currentVal - currentNum
        backtrack(i + 1, path + "-" + currentStr, calculatedVal - currentNum, -currentNum);

        // Try multiplication: currentVal - lastOperand + (lastOperand * currentNum)
        backtrack(
          i + 1,
          path + "*" + currentStr,
          calculatedVal - lastOperand + lastOperand * currentNum,
          lastOperand * currentNum
        );
      }
    }
  }

  if (!num) return result;
  backtrack(0, "", 0, 0);
  return result;
}
```

```java
// Time: O(4^n) - at each of n-1 positions, 4 choices (3 ops + concat)
// Space: O(n) for recursion depth, O(4^n) for output
import java.util.*;

class Solution {
    public List<String> addOperators(String num, int target) {
        List<String> result = new ArrayList<>();
        if (num == null || num.length() == 0) {
            return result;
        }

        backtrack(result, num, target, 0, "", 0, 0);
        return result;
    }

    private void backtrack(List<String> result, String num, int target, int index,
                          String path, long calculatedVal, long lastOperand) {
        // If we've used all digits
        if (index == num.length()) {
            // Check if we've reached the target
            if (calculatedVal == target) {
                result.add(path);
            }
            return;
        }

        // Try all possible substrings starting at index
        for (int i = index; i < num.length(); i++) {
            // Skip numbers with leading zero (except single zero)
            if (i > index && num.charAt(index) == '0') {
                break;
            }

            // Parse current substring as a number
            String currentStr = num.substring(index, i + 1);
            long currentNum = Long.parseLong(currentStr);

            // If this is the first number, just initialize
            if (index == 0) {
                backtrack(result, num, target, i + 1,
                         currentStr, currentNum, currentNum);
            } else {
                // Try addition: currentVal + currentNum
                backtrack(result, num, target, i + 1,
                         path + "+" + currentStr,
                         calculatedVal + currentNum,
                         currentNum);

                // Try subtraction: currentVal - currentNum
                backtrack(result, num, target, i + 1,
                         path + "-" + currentStr,
                         calculatedVal - currentNum,
                         -currentNum);

                // Try multiplication: currentVal - lastOperand + (lastOperand * currentNum)
                backtrack(result, num, target, i + 1,
                         path + "*" + currentStr,
                         calculatedVal - lastOperand + (lastOperand * currentNum),
                         lastOperand * currentNum);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(4^n)**

- At each of the `n-1` gaps between digits, we have 4 choices: `+`, `-`, `*`, or concatenate (no operator)
- This gives us `4^(n-1)` possible expressions to explore
- For each expression, we perform O(1) work at each step (arithmetic operations)
- Total: O(4^n) in the worst case

**Space Complexity: O(n) for recursion + O(4^n) for output**

- Recursion depth: O(n) - we go at most n levels deep
- Output storage: In worst case, we store all `4^(n-1)` expressions, each of length O(n)
- Total output space: O(n \* 4^n)

The exponential complexity is unavoidable since we need to generate all possible expressions. The backtracking approach is optimal because it prunes invalid paths early (like numbers with leading zeros) and evaluates as it goes.

## Common Mistakes

1. **Not handling multiplication precedence correctly**: The most common error is evaluating left-to-right without considering that `*` has higher precedence than `+` and `-`. Always track the last operand to properly handle `a + b * c = a + (b * c)`.

2. **Allowing leading zeros in multi-digit numbers**: When you see "012", it should be invalid. The rule: if a number starts with '0', it must be exactly "0", not "01", "012", etc. Check `i > index && num[index] == '0'` to break.

3. **Forgetting about integer overflow**: With 10-digit numbers, intermediate results can exceed 32-bit integer limits. Use 64-bit integers (long in Java/JavaScript, Python handles big integers automatically).

4. **Not considering concatenation as an option**: Between any two digits, you can either place an operator or concatenate them into a larger number. This is the "fourth operator" that many candidates miss.

## When You'll See This Pattern

This backtracking-with-state pattern appears in problems where you need to:

1. Generate all combinations/permutations with constraints
2. Evaluate expressions or compute values incrementally
3. Maintain additional state to handle precedence or constraints

Related problems:

- **Generate Parentheses (Medium)**: Similar backtracking to generate all valid combinations
- **Target Sum (Medium)**: Place `+` or `-` before numbers to reach target
- **Different Ways to Add Parentheses (Medium)**: Different approach to expression evaluation
- **Basic Calculator series**: Evaluating expressions with operators and precedence

## Key Takeaways

1. **Backtracking with state is powerful**: When you need to generate combinations while computing values, pass state through recursion parameters. This avoids recomputation and handles precedence.

2. **Handle operator precedence incrementally**: For expressions with `+`, `-`, and `*`, track the last operand. When you see `*`, undo the last operation and apply multiplication to that operand.

3. **Watch for edge cases with numbers**: Leading zeros and integer overflow are common pitfalls. Always validate numbers as you build them.

4. **Think about the search space**: With `n` digits, you have `n-1` gaps and 4 choices each, giving `4^(n-1)` possibilities. Backtracking explores this space efficiently by pruning invalid paths early.

Related problems: [Evaluate Reverse Polish Notation](/problem/evaluate-reverse-polish-notation), [Basic Calculator](/problem/basic-calculator), [Basic Calculator II](/problem/basic-calculator-ii)
