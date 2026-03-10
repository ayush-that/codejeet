---
title: "How to Solve Valid Number — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Valid Number. Hard difficulty, 22.6% acceptance rate. Topics: String."
date: "2027-05-06"
category: "dsa-patterns"
tags: ["valid-number", "string", "hard"]
---

# How to Solve Valid Number

Valid Number is a classic hard string parsing problem that tests your ability to systematically handle complex validation rules. The challenge comes from the many edge cases and the need to track multiple states as you process the string. Unlike simpler validation problems, you can't just use regular expressions or simple checks—you need to understand exactly what makes a number valid according to the given rules.

## Visual Walkthrough

Let's trace through the validation of `"-123.456e789"` step by step:

1. **Start**: We haven't seen any digits, decimal point, or exponent yet
2. **Character '-'**: This is valid as the first character (sign for the whole number)
3. **Characters '1', '2', '3'**: These are digits, so we mark that we've seen digits before the decimal
4. **Character '.'**: Decimal point is valid since we haven't seen one yet
5. **Characters '4', '5', '6'**: More digits after the decimal
6. **Character 'e'**: Exponent marker is valid since we've seen digits before it
7. **Character '7', '8', '9'**: Digits after exponent (exponent can't have decimal point)

At each step, we need to check:

- Is the current character valid given what we've seen so far?
- Does it violate any rules about ordering (like decimal after exponent)?
- Do we have the required components (like digits somewhere)?

The key insight is that we're tracking a state machine: we start in an initial state, and each character transitions us to a new state based on what we've already seen.

## Brute Force Approach

A naive approach might try to use built-in conversion functions or simple checks:

```python
def isNumber(s):
    try:
        float(s)
        return True
    except:
        return False
```

While this technically works in Python, it's not acceptable in an interview because:

1. It doesn't demonstrate your understanding of the validation rules
2. In languages without try-catch for parsing, you'd need to implement the logic anyway
3. Interviewers want to see you handle the state transitions explicitly

Another brute force approach might involve checking many conditions with complex if-else statements:

```python
def isNumber(s):
    s = s.strip()
    if not s:
        return False

    # Check for letters other than e/E
    # Check for multiple decimal points
    # Check for exponent in wrong position
    # ... and many more conditions
```

This becomes messy quickly because you have to consider all possible orderings and combinations of signs, digits, decimals, and exponents. The code becomes hard to read and maintain, and it's easy to miss edge cases.

## Optimized Approach

The cleanest solution uses a **deterministic finite automaton (DFA)** approach. We define states representing what we've seen so far, and transitions based on the next character type.

Think of these states:

- **State 0**: Start or leading whitespace
- **State 1**: Sign before any digits
- **State 2**: Digits before decimal
- **State 3**: Digits after decimal (or no digits before decimal but we saw decimal)
- **State 4**: Decimal point (with digits before it)
- **State 5**: Decimal point (no digits before it)
- **State 6**: Exponent marker 'e' or 'E'
- **State 7**: Sign after exponent
- **State 8**: Digits after exponent
- **State 9**: Trailing whitespace

We accept the string if we end in states 2, 3, 4, or 8 (valid number endings).

The state transitions are:

- From state 0: sign → 1, digit → 2, decimal → 5
- From state 1: digit → 2, decimal → 5
- From state 2: digit → 2, decimal → 4, exponent → 6
- From state 3: digit → 3, exponent → 6
- From state 4: digit → 3, exponent → 6
- From state 5: digit → 3
- From state 6: sign → 7, digit → 8
- From state 7: digit → 8
- From state 8: digit → 8

Any other transition is invalid.

## Optimal Solution

Here's the complete DFA-based solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isNumber(s: str) -> bool:
    """
    Validates if a string represents a valid number using DFA approach.

    States:
    0: start or leading whitespace
    1: sign before integer part
    2: integer part digits
    3: decimal point with digits before it
    4: fractional part digits
    5: decimal point without digits before it
    6: exponent marker 'e' or 'E'
    7: sign after exponent
    8: exponent digits
    9: trailing whitespace

    Valid end states: 2, 3, 4, 8
    """

    # Define state transition table
    # Each row represents current state, columns represent input type:
    # 0: digit, 1: sign, 2: decimal, 3: exponent, 4: space, 5: other
    transitions = [
        [2, 1, 5, -1, 0, -1],  # state 0: start
        [2, -1, 5, -1, -1, -1], # state 1: sign
        [2, -1, 3, 6, 9, -1],  # state 2: integer digits
        [4, -1, -1, 6, 9, -1], # state 3: decimal point with digits before
        [4, -1, -1, 6, 9, -1], # state 4: fractional digits
        [4, -1, -1, -1, -1, -1], # state 5: decimal point without digits before
        [8, 7, -1, -1, -1, -1], # state 6: exponent
        [8, -1, -1, -1, -1, -1], # state 7: exponent sign
        [8, -1, -1, -1, 9, -1], # state 8: exponent digits
        [-1, -1, -1, -1, 9, -1]  # state 9: trailing space
    ]

    current_state = 0

    for char in s:
        # Determine input type for current character
        if char.isdigit():
            input_type = 0
        elif char in '+-':
            input_type = 1
        elif char == '.':
            input_type = 2
        elif char in 'eE':
            input_type = 3
        elif char == ' ':
            input_type = 4
        else:
            input_type = 5

        # Transition to next state
        current_state = transitions[current_state][input_type]

        # If transition leads to invalid state, return False
        if current_state == -1:
            return False

    # Check if we ended in a valid accepting state
    # Valid end states: 2 (integer), 3 (decimal with digits before),
    # 4 (fractional digits), 8 (exponent digits)
    return current_state in {2, 3, 4, 8}
```

```javascript
// Time: O(n) | Space: O(1)
function isNumber(s) {
  /**
   * Validates if a string represents a valid number using DFA approach.
   *
   * States:
   * 0: start or leading whitespace
   * 1: sign before integer part
   * 2: integer part digits
   * 3: decimal point with digits before it
   * 4: fractional part digits
   * 5: decimal point without digits before it
   * 6: exponent marker 'e' or 'E'
   * 7: sign after exponent
   * 8: exponent digits
   * 9: trailing whitespace
   *
   * Valid end states: 2, 3, 4, 8
   */

  // Define state transition table
  // Each row represents current state, columns represent input type:
  // 0: digit, 1: sign, 2: decimal, 3: exponent, 4: space, 5: other
  const transitions = [
    [2, 1, 5, -1, 0, -1], // state 0: start
    [2, -1, 5, -1, -1, -1], // state 1: sign
    [2, -1, 3, 6, 9, -1], // state 2: integer digits
    [4, -1, -1, 6, 9, -1], // state 3: decimal point with digits before
    [4, -1, -1, 6, 9, -1], // state 4: fractional digits
    [4, -1, -1, -1, -1, -1], // state 5: decimal point without digits before
    [8, 7, -1, -1, -1, -1], // state 6: exponent
    [8, -1, -1, -1, -1, -1], // state 7: exponent sign
    [8, -1, -1, -1, 9, -1], // state 8: exponent digits
    [-1, -1, -1, -1, 9, -1], // state 9: trailing space
  ];

  let currentState = 0;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    let inputType;

    // Determine input type for current character
    if (char >= "0" && char <= "9") {
      inputType = 0;
    } else if (char === "+" || char === "-") {
      inputType = 1;
    } else if (char === ".") {
      inputType = 2;
    } else if (char === "e" || char === "E") {
      inputType = 3;
    } else if (char === " ") {
      inputType = 4;
    } else {
      inputType = 5;
    }

    // Transition to next state
    currentState = transitions[currentState][inputType];

    // If transition leads to invalid state, return false
    if (currentState === -1) {
      return false;
    }
  }

  // Check if we ended in a valid accepting state
  // Valid end states: 2 (integer), 3 (decimal with digits before),
  // 4 (fractional digits), 8 (exponent digits)
  return currentState === 2 || currentState === 3 || currentState === 4 || currentState === 8;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean isNumber(String s) {
        /**
         * Validates if a string represents a valid number using DFA approach.
         *
         * States:
         * 0: start or leading whitespace
         * 1: sign before integer part
         * 2: integer part digits
         * 3: decimal point with digits before it
         * 4: fractional part digits
         * 5: decimal point without digits before it
         * 6: exponent marker 'e' or 'E'
         * 7: sign after exponent
         * 8: exponent digits
         * 9: trailing whitespace
         *
         * Valid end states: 2, 3, 4, 8
         */

        // Define state transition table
        // Each row represents current state, columns represent input type:
        // 0: digit, 1: sign, 2: decimal, 3: exponent, 4: space, 5: other
        int[][] transitions = {
            {2, 1, 5, -1, 0, -1},  // state 0: start
            {2, -1, 5, -1, -1, -1}, // state 1: sign
            {2, -1, 3, 6, 9, -1},  // state 2: integer digits
            {4, -1, -1, 6, 9, -1}, // state 3: decimal point with digits before
            {4, -1, -1, 6, 9, -1}, // state 4: fractional digits
            {4, -1, -1, -1, -1, -1}, // state 5: decimal point without digits before
            {8, 7, -1, -1, -1, -1}, // state 6: exponent
            {8, -1, -1, -1, -1, -1}, // state 7: exponent sign
            {8, -1, -1, -1, 9, -1}, // state 8: exponent digits
            {-1, -1, -1, -1, 9, -1}  // state 9: trailing space
        };

        int currentState = 0;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int inputType;

            // Determine input type for current character
            if (Character.isDigit(c)) {
                inputType = 0;
            } else if (c == '+' || c == '-') {
                inputType = 1;
            } else if (c == '.') {
                inputType = 2;
            } else if (c == 'e' || c == 'E') {
                inputType = 3;
            } else if (c == ' ') {
                inputType = 4;
            } else {
                inputType = 5;
            }

            // Transition to next state
            currentState = transitions[currentState][inputType];

            // If transition leads to invalid state, return false
            if (currentState == -1) {
                return false;
            }
        }

        // Check if we ended in a valid accepting state
        // Valid end states: 2 (integer), 3 (decimal with digits before),
        // 4 (fractional digits), 8 (exponent digits)
        return currentState == 2 || currentState == 3 ||
               currentState == 4 || currentState == 8;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once
- For each character, we perform O(1) work to determine its type and transition state
- Total time is linear in the length of the input string

**Space Complexity: O(1)**

- We use a fixed-size transition table (10 states × 6 input types = 60 integers)
- We only store the current state and a few local variables
- The space used does not grow with input size

## Common Mistakes

1. **Forgetting that ".1" and "1." are both valid**: Many candidates require digits on both sides of the decimal point, but the problem allows numbers like ".1" (no integer part) and "1." (no fractional part).

2. **Not handling multiple signs correctly**: Signs can only appear at the beginning of the number or immediately after an exponent. A common mistake is allowing signs in other positions or allowing multiple signs.

3. **Incorrect exponent validation**: The exponent must have at least one digit after it, and cannot have a decimal point in the exponent part. Also, there must be digits before the exponent (either integer or fractional part).

4. **Not considering whitespace correctly**: While the examples don't show it, the problem statement typically allows leading and trailing whitespace. Some implementations fail to handle this or handle it incorrectly.

## When You'll See This Pattern

The DFA/state machine pattern appears in many string parsing and validation problems:

1. **String to Integer (atoi)**: Similar validation of signs, digits, and overflow handling. You need to process characters sequentially and maintain state about what you've seen.

2. **Valid Parentheses**: While simpler, it also involves tracking state (the stack of open parentheses) as you process the string.

3. **Decode String**: Requires tracking nested structures and multipliers, similar to maintaining state through different contexts.

4. **Basic Calculator**: Involves parsing mathematical expressions with operators, parentheses, and numbers, requiring state to handle operator precedence and nesting.

The key insight is that when you need to validate complex sequences with specific ordering rules, a state machine helps organize the logic cleanly.

## Key Takeaways

1. **State machines are perfect for validation problems**: When you have rules about what can appear when, a DFA provides a clean, organized way to implement those rules without nested conditionals.

2. **Define states based on what you've seen**: Each state should represent a meaningful point in the parsing process (e.g., "seen sign but no digits yet", "in fractional part", "expecting exponent digits").

3. **Explicitly list valid transitions**: Creating a transition table forces you to think through all possible cases and makes the logic easier to verify and debug.

Related problems: [String to Integer (atoi)](/problem/string-to-integer-atoi)
