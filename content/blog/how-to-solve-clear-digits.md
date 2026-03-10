---
title: "How to Solve Clear Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Clear Digits. Easy difficulty, 82.7% acceptance rate. Topics: String, Stack, Simulation."
date: "2028-03-03"
category: "dsa-patterns"
tags: ["clear-digits", "string", "stack", "simulation", "easy"]
---

# How to Solve Clear Digits

This problem asks us to repeatedly remove digits from a string by deleting each digit along with the closest non-digit character to its left. What makes this interesting is that deletions change the string structure, which affects which character is "closest to the left" for subsequent digits. The challenge is finding an efficient way to simulate this process without repeatedly scanning and modifying the string.

## Visual Walkthrough

Let's trace through an example: `s = "abc34"`

**Step 1:** Find the first digit → `'3'` at index 3

- Closest non-digit to its left → `'c'` at index 2
- Delete both → string becomes `"ab4"`

**Step 2:** Find the first digit in new string → `'4'` at index 2

- Closest non-digit to its left → `'b'` at index 1
- Delete both → string becomes `"a"`

**Step 3:** No more digits remain → result is `"a"`

Another example: `s = "cb34"`

**Step 1:** First digit `'3'` at index 2

- Closest non-digit left → `'b'` at index 1
- Delete both → `"c4"`

**Step 2:** First digit `'4'` at index 1

- Closest non-digit left → `'c'` at index 0
- Delete both → `""` (empty string)

Notice how each deletion removes a digit and the nearest non-digit character to its left, which might not be immediately adjacent if there are other digits between them.

## Brute Force Approach

A naive approach would literally simulate the process as described:

1. Find the first digit in the string
2. Find the closest non-digit character to its left
3. Remove both characters
4. Repeat until no digits remain

The problem with this approach is efficiency. Each deletion requires:

- Scanning from the start to find the first digit: O(n)
- Scanning leftward to find the closest non-digit: O(n)
- Removing characters from the string: O(n) due to shifting

With k digits, this becomes O(k × n) = O(n²) in the worst case (when all characters are digits except one at the end).

Here's what the brute force might look like:

<div class="code-group">

```python
def clearDigitsBruteForce(s: str) -> str:
    # Convert to list for mutability
    chars = list(s)

    while True:
        # Find first digit
        digit_index = -1
        for i in range(len(chars)):
            if chars[i].isdigit():
                digit_index = i
                break

        # If no digit found, we're done
        if digit_index == -1:
            break

        # Find closest non-digit to the left
        non_digit_index = -1
        for i in range(digit_index - 1, -1, -1):
            if not chars[i].isdigit():
                non_digit_index = i
                break

        # Remove both characters
        # Remove the non-digit first since it has smaller index
        if non_digit_index != -1:
            del chars[non_digit_index]
            # After deleting non-digit, digit index shifts left by 1
            digit_index -= 1

        # Remove the digit
        del chars[digit_index]

    return ''.join(chars)
```

```javascript
function clearDigitsBruteForce(s) {
  // Convert to array for mutability
  let chars = s.split("");

  while (true) {
    // Find first digit
    let digitIndex = -1;
    for (let i = 0; i < chars.length; i++) {
      if (/\d/.test(chars[i])) {
        digitIndex = i;
        break;
      }
    }

    // If no digit found, we're done
    if (digitIndex === -1) break;

    // Find closest non-digit to the left
    let nonDigitIndex = -1;
    for (let i = digitIndex - 1; i >= 0; i--) {
      if (!/\d/.test(chars[i])) {
        nonDigitIndex = i;
        break;
      }
    }

    // Remove both characters
    // Remove non-digit first since it has smaller index
    if (nonDigitIndex !== -1) {
      chars.splice(nonDigitIndex, 1);
      // After deleting non-digit, digit index shifts left by 1
      digitIndex--;
    }

    // Remove the digit
    chars.splice(digitIndex, 1);
  }

  return chars.join("");
}
```

```java
public String clearDigitsBruteForce(String s) {
    // Use StringBuilder for mutability
    StringBuilder sb = new StringBuilder(s);

    while (true) {
        // Find first digit
        int digitIndex = -1;
        for (int i = 0; i < sb.length(); i++) {
            if (Character.isDigit(sb.charAt(i))) {
                digitIndex = i;
                break;
            }
        }

        // If no digit found, we're done
        if (digitIndex == -1) break;

        // Find closest non-digit to the left
        int nonDigitIndex = -1;
        for (int i = digitIndex - 1; i >= 0; i--) {
            if (!Character.isDigit(sb.charAt(i))) {
                nonDigitIndex = i;
                break;
            }
        }

        // Remove both characters
        // Remove non-digit first since it has smaller index
        if (nonDigitIndex != -1) {
            sb.deleteCharAt(nonDigitIndex);
            // After deleting non-digit, digit index shifts left by 1
            digitIndex--;
        }

        // Remove the digit
        sb.deleteCharAt(digitIndex);
    }

    return sb.toString();
}
```

</div>

This brute force approach works but is inefficient. We need a better way.

## Optimal Solution

The key insight is that we can process the string from left to right using a stack:

- When we encounter a non-digit, we push it onto the stack
- When we encounter a digit, we pop the top element from the stack (which is the closest non-digit to its left)

This works because:

1. The stack naturally maintains the order of non-digit characters
2. When we see a digit, the top of the stack is guaranteed to be the closest non-digit to its left
3. Popping from the stack simulates deleting that non-digit character
4. We don't need to explicitly delete the digit since we never push digits onto the stack

This approach is O(n) time and O(n) space in the worst case.

<div class="code-group">

```python
def clearDigits(s: str) -> str:
    """
    Remove all digits by deleting each digit and the closest non-digit to its left.

    Approach: Use a stack to process characters left to right.
    - Push non-digits onto stack
    - When encountering a digit, pop from stack (removes closest non-digit to left)
    - Digits are never pushed, effectively removing them

    Time: O(n) where n is length of string
    Space: O(n) for the stack in worst case
    """
    stack = []

    # Process each character in the string
    for char in s:
        if char.isdigit():
            # Current character is a digit
            # Pop the closest non-digit character to its left
            # Note: We only pop if stack is not empty
            # If stack is empty, there's no non-digit to remove
            if stack:
                stack.pop()
            # Digit itself is never pushed to stack
        else:
            # Current character is a non-digit
            # Push it onto the stack
            stack.append(char)

    # Join all characters remaining in the stack
    return ''.join(stack)
```

```javascript
function clearDigits(s) {
  /**
   * Remove all digits by deleting each digit and the closest non-digit to its left.
   *
   * Approach: Use a stack to process characters left to right.
   * - Push non-digits onto stack
   * - When encountering a digit, pop from stack (removes closest non-digit to left)
   * - Digits are never pushed, effectively removing them
   *
   * Time: O(n) where n is length of string
   * Space: O(n) for the stack in worst case
   */
  const stack = [];

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (/\d/.test(char)) {
      // Current character is a digit
      // Pop the closest non-digit character to its left
      // Note: We only pop if stack is not empty
      // If stack is empty, there's no non-digit to remove
      if (stack.length > 0) {
        stack.pop();
      }
      // Digit itself is never pushed to stack
    } else {
      // Current character is a non-digit
      // Push it onto the stack
      stack.push(char);
    }
  }

  // Join all characters remaining in the stack
  return stack.join("");
}
```

```java
public String clearDigits(String s) {
    /**
     * Remove all digits by deleting each digit and the closest non-digit to its left.
     *
     * Approach: Use a stack to process characters left to right.
     * - Push non-digits onto stack
     * - When encountering a digit, pop from stack (removes closest non-digit to left)
     * - Digits are never pushed, effectively removing them
     *
     * Time: O(n) where n is length of string
     * Space: O(n) for the stack in worst case
     */
    Stack<Character> stack = new Stack<>();

    // Process each character in the string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (Character.isDigit(c)) {
            // Current character is a digit
            // Pop the closest non-digit character to its left
            // Note: We only pop if stack is not empty
            // If stack is empty, there's no non-digit to remove
            if (!stack.isEmpty()) {
                stack.pop();
            }
            // Digit itself is never pushed to stack
        } else {
            // Current character is a non-digit
            // Push it onto the stack
            stack.push(c);
        }
    }

    // Build result string from stack
    StringBuilder result = new StringBuilder();
    for (char c : stack) {
        result.append(c);
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each character exactly once
- Stack operations (push/pop) are O(1) amortized
- No nested loops or repeated scanning

**Space Complexity:** O(n)

- In the worst case, when there are no digits, we store all characters in the stack
- In the best case, when all characters are digits, the stack remains empty
- Average case depends on the ratio of digits to non-digits

## Common Mistakes

1. **Not handling empty stack when popping:** When a digit appears before any non-digit (e.g., `"1abc"`), trying to pop from an empty stack causes an error. Always check if the stack is non-empty before popping.

2. **Using string manipulation instead of a stack:** Some candidates try to modify the string in-place with repeated deletions. This leads to O(n²) time complexity due to shifting characters after each deletion.

3. **Misunderstanding "closest non-digit to the left":** The closest non-digit might not be immediately adjacent if there are other digits between them. For example, in `"a12"`, digit `'2'` should remove `'a'`, not `'1'`. The stack approach correctly handles this.

4. **Forgetting that operations are repeated:** The problem says to do the operation "repeatedly" until all digits are removed. Some candidates try to do everything in one pass without considering that deleting characters changes which character is "closest" for subsequent digits.

## When You'll See This Pattern

This "stack for pairing operations" pattern appears in many string processing problems:

1. **Valid Parentheses (LeetCode 20):** Use a stack to match opening and closing brackets. Similar to how we match digits with non-digits here.

2. **Remove All Adjacent Duplicates In String (LeetCode 1047):** Remove adjacent duplicates repeatedly. The stack approach naturally handles the "repeatedly" requirement.

3. **Backspace String Compare (LeetCode 844):** Process strings with backspace characters (#) that remove preceding characters. This is essentially the same pattern but with backspaces instead of digits.

The common theme is using a stack to simulate deletions/removals that affect preceding elements, especially when operations need to be applied repeatedly.

## Key Takeaways

1. **When you see "remove X and the closest Y to its left/right", think stack:** The stack naturally maintains the order of elements and allows efficient access to the most recent element of a certain type.

2. **Repeated operations often simplify to a single pass with a stack:** Even though the problem describes repeated operations, you can usually process the string once from left to right using a stack to simulate the cumulative effect.

3. **Always consider edge cases:** Empty input, all digits, no digits, digits at the beginning, and consecutive digits are all important test cases to consider.

[Practice this problem on CodeJeet](/problem/clear-digits)
