---
title: "How to Solve Faulty Keyboard — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Faulty Keyboard. Easy difficulty, 80.0% acceptance rate. Topics: String, Simulation."
date: "2027-02-28"
category: "dsa-patterns"
tags: ["faulty-keyboard", "string", "simulation", "easy"]
---

# How to Solve Faulty Keyboard

You have a faulty keyboard where typing the character `'i'` reverses the entire string typed so far, while other characters are appended normally. Given a string `s` representing the sequence of keys you intend to type, you need to determine the final string that appears on screen. The tricky part is that each reversal affects all previously typed characters, making a naive character-by-character simulation potentially inefficient if implemented poorly.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider `s = "string"`.

**Step-by-step simulation:**

1. Type `'s'` → Current string: `"s"`
2. Type `'t'` → Append: `"st"`
3. Type `'r'` → Append: `"str"`
4. Type `'i'` → Reverse entire string: `"rts"`
5. Type `'n'` → Append: `"rtsn"`
6. Type `'g'` → Append: `"rtsng"`

Final result: `"rtsng"`

Now let's try a more complex example: `s = "poiinter"`

1. `'p'` → `"p"`
2. `'o'` → `"po"`
3. `'i'` → Reverse `"po"` → `"op"`
4. `'i'` → Reverse `"op"` → `"po"`
5. `'n'` → Append → `"pon"`
6. `'t'` → Append → `"pont"`
7. `'e'` → Append → `"ponte"`
8. `'r'` → Append → `"ponter"`

Notice that consecutive `'i'` characters effectively toggle the string direction - two reversals cancel out. This observation is key to an efficient solution.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem describes:

1. Start with an empty result string
2. For each character in the input:
   - If it's not `'i'`, append it to the result
   - If it is `'i'`, reverse the entire result string

Here's what that looks like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def finalString_brute(s: str) -> str:
    result = ""
    for char in s:
        if char != 'i':
            result += char  # O(1) amortized
        else:
            result = result[::-1]  # O(n) operation
    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function finalStringBrute(s) {
  let result = "";
  for (let char of s) {
    if (char !== "i") {
      result += char; // O(1) amortized in JS
    } else {
      // Reverse the string - O(n) operation
      result = result.split("").reverse().join("");
    }
  }
  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public String finalStringBrute(String s) {
    StringBuilder result = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (c != 'i') {
            result.append(c);  // O(1)
        } else {
            result.reverse();  // O(n) operation
        }
    }
    return result.toString();
}
```

</div>

**Why this is inefficient:**
The problem is the `reverse()` operation, which takes O(n) time where n is the current length of the string. In the worst case (like `s = "iiiiii..."`), we'd reverse the string n times, resulting in O(n²) total time complexity. For large inputs (up to 100 characters in typical test cases), this might still pass, but it's not optimal and shows poor algorithmic thinking.

## Optimal Solution

The key insight is that we don't need to actually reverse the string every time we encounter an `'i'`. Instead, we can maintain the result in a deque (double-ended queue) and keep track of whether we're currently building the string in forward or reverse direction.

**Algorithm:**

1. Use a deque to efficiently add characters to both ends
2. Maintain a boolean flag `reverse` that indicates current direction
3. For each character:
   - If it's `'i'`, toggle the `reverse` flag (no actual reversal needed)
   - If it's not `'i'`:
     - If `reverse` is false, append to the right (normal order)
     - If `reverse` is true, append to the left (reverse order)
4. After processing all characters:
   - If `reverse` is true, we need to reverse the final result
   - Convert deque to string

This approach avoids all actual reversal operations until the very end if needed.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def finalString(s: str) -> str:
    from collections import deque

    # Use deque for efficient appends to both ends
    result = deque()
    # Flag to track if we're in reverse mode
    reverse = False

    for char in s:
        if char == 'i':
            # Toggle reverse mode instead of actually reversing
            reverse = not reverse
        else:
            if reverse:
                # In reverse mode, new characters go to the front
                result.appendleft(char)
            else:
                # In normal mode, new characters go to the back
                result.append(char)

    # Convert deque to string
    final_str = ''.join(result)

    # If we ended in reverse mode, we need to reverse the final string
    if reverse:
        final_str = final_str[::-1]

    return final_str
```

```javascript
// Time: O(n) | Space: O(n)
function finalString(s) {
  // Use array as deque (push/pop/shift/unshift)
  const result = [];
  let reverse = false;

  for (let char of s) {
    if (char === "i") {
      // Toggle reverse mode
      reverse = !reverse;
    } else {
      if (reverse) {
        // In reverse mode, add to beginning
        result.unshift(char);
      } else {
        // In normal mode, add to end
        result.push(char);
      }
    }
  }

  // Join array into string
  let finalStr = result.join("");

  // If ended in reverse mode, reverse the final string
  if (reverse) {
    finalStr = finalStr.split("").reverse().join("");
  }

  return finalStr;
}
```

```java
// Time: O(n) | Space: O(n)
public String finalString(String s) {
    // Use StringBuilder for efficient string building
    StringBuilder result = new StringBuilder();
    // Track current direction
    boolean reverse = false;

    for (char c : s.toCharArray()) {
        if (c == 'i') {
            // Toggle direction instead of reversing
            reverse = !reverse;
        } else {
            if (reverse) {
                // In reverse mode, insert at beginning
                result.insert(0, c);
            } else {
                // In normal mode, append at end
                result.append(c);
            }
        }
    }

    // If we ended in reverse mode, reverse the entire string
    if (reverse) {
        result.reverse();
    }

    return result.toString();
}
```

</div>

**Alternative two-pointer approach:**
We can also solve this using two pointers and building the result in an array:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def finalString_two_pointers(s: str) -> str:
    # Initialize result array with enough space
    result = [''] * len(s)
    left, right = 0, len(s) - 1
    reverse = False

    # Process characters
    for char in s:
        if char == 'i':
            reverse = not reverse
        else:
            if reverse:
                result[right] = char
                right -= 1
            else:
                result[left] = char
                left += 1

    # Get the actual portion of array that contains characters
    if reverse:
        # In reverse mode, we filled from right to left
        return ''.join(result[right+1:left][::-1])
    else:
        # In normal mode, we filled from left to right
        return ''.join(result[:left])
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once: O(n)
- Each operation (append to deque/array, toggle boolean) is O(1)
- Final string construction is O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store the result in a data structure (deque/array/string builder) that grows up to size n
- Additional variables use O(1) space
- Total: O(n) for the output storage

## Common Mistakes

1. **Actually reversing the string on each 'i'**: This leads to O(n²) time complexity. Candidates might not realize that string reversal is an O(n) operation when done repeatedly.
   - _How to avoid_: Recognize that toggling a direction flag is O(1) vs reversing which is O(n).

2. **Forgetting to handle the final reverse flag**: If we end with `reverse = true`, the string needs one final reversal. Some implementations miss this.
   - _How to avoid_: Always test cases that end with 'i' or have odd numbers of 'i's.

3. **Using inefficient data structures**: Using Python string concatenation in a loop (`result += char`) is actually O(n²) in some languages due to string immutability.
   - _How to avoid_: Use list/deque/StringBuilder which have O(1) amortized append operations.

4. **Off-by-one errors in two-pointer approach**: When filling array from both ends, it's easy to mis-calculate the final bounds.
   - _How to avoid_: Trace through examples carefully and test edge cases like empty string or all 'i's.

## When You'll See This Pattern

This problem uses the **direction toggling** pattern combined with **efficient double-ended insertion**. You'll see similar patterns in:

1. **Buildings With an Ocean View (LeetCode 1762)**: While not identical, it involves processing elements in different directions based on conditions.

2. **Robot Bounded In Circle (LeetCode 1041)**: Uses direction toggling (changing robot's facing direction) to determine if path is cyclic.

3. **Text Editor problems**: Many text editor simulation problems involve maintaining a buffer with efficient insertion at cursor position, similar to our deque approach.

The core technique is avoiding expensive operations (like reversal) by maintaining state (direction flag) and choosing the right data structure (deque for double-ended operations).

## Key Takeaways

1. **Don't simulate literally when you can simulate logically**: Instead of actually reversing strings, maintain a direction flag. This transforms an O(n²) operation into O(n).

2. **Choose data structures based on required operations**: When you need efficient insertion at both ends, use a deque. When building strings incrementally, use StringBuilder (Java) or list (Python).

3. **State machines simplify complex transformations**: The direction flag acts as a simple state machine (normal vs reverse mode), making the logic cleaner than tracking complex indices.

**Related problems:** [Reverse Vowels of a String](/problem/reverse-vowels-of-a-string), [Reverse String II](/problem/reverse-string-ii), [Reverse Only Letters](/problem/reverse-only-letters)
