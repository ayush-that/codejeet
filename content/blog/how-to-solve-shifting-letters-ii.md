---
title: "How to Solve Shifting Letters II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shifting Letters II. Medium difficulty, 53.5% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2026-07-23"
category: "dsa-patterns"
tags: ["shifting-letters-ii", "array", "string", "prefix-sum", "medium"]
---

# How to Solve Shifting Letters II

You're given a string `s` and a list of shift operations, where each operation tells you to shift characters within a specific range forward or backward. The challenge is applying all these range updates efficiently without repeatedly modifying the string for each operation. What makes this problem interesting is that a brute force approach would be too slow, but we can optimize it using a clever technique that transforms multiple range operations into a single pass.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
s = "abc"
shifts = [[0,1,1], [1,2,0]]
```

We need to apply two shift operations:

1. Shift indices 0-1 forward by 1
2. Shift indices 1-2 backward by 1

**Step-by-step visualization:**

Initial string: `"abc"` (a=0, b=1, c=2)

**Operation 1:** Shift indices 0-1 forward

- Index 0: 'a' → 'b' (a + 1 = b)
- Index 1: 'b' → 'c' (b + 1 = c)
- Index 2: unchanged
  After op1: `"bcc"`

**Operation 2:** Shift indices 1-2 backward

- Index 0: unchanged
- Index 1: 'c' → 'b' (c - 1 = b)
- Index 2: 'c' → 'b' (c - 1 = b)
  Final: `"bbb"`

But here's the problem: if we had 100,000 operations on a 100,000-character string, doing this naively would take O(n × k) operations, which is far too slow. We need a smarter approach.

## Brute Force Approach

The most straightforward solution is to apply each shift operation directly to the string:

1. Convert string to a list of characters (strings are immutable)
2. For each shift operation `[start, end, direction]`:
   - For each index `i` from `start` to `end`:
     - If `direction == 1`, increment the character
     - If `direction == 0`, decrement the character
     - Handle wrap-around (z → a or a → z)
3. Convert the list back to a string

<div class="code-group">

```python
# Time: O(n × k) where n = len(s), k = len(shifts)
# Space: O(n) for the character list
def shiftingLetters_brute(s, shifts):
    chars = list(s)

    for start, end, direction in shifts:
        for i in range(start, end + 1):
            if direction == 1:  # forward
                # 'a' = 97, 'z' = 122
                if chars[i] == 'z':
                    chars[i] = 'a'
                else:
                    chars[i] = chr(ord(chars[i]) + 1)
            else:  # backward
                if chars[i] == 'a':
                    chars[i] = 'z'
                else:
                    chars[i] = chr(ord(chars[i]) - 1)

    return ''.join(chars)
```

```javascript
// Time: O(n × k) where n = s.length, k = shifts.length
// Space: O(n) for the character array
function shiftingLettersBrute(s, shifts) {
  const chars = s.split("");

  for (const [start, end, direction] of shifts) {
    for (let i = start; i <= end; i++) {
      if (direction === 1) {
        // forward
        if (chars[i] === "z") {
          chars[i] = "a";
        } else {
          chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        }
      } else {
        // backward
        if (chars[i] === "a") {
          chars[i] = "z";
        } else {
          chars[i] = String.fromCharCode(chars[i].charCodeAt(0) - 1);
        }
      }
    }
  }

  return chars.join("");
}
```

```java
// Time: O(n × k) where n = s.length(), k = shifts.length
// Space: O(n) for the character array
public String shiftingLettersBrute(String s, int[][] shifts) {
    char[] chars = s.toCharArray();

    for (int[] shift : shifts) {
        int start = shift[0];
        int end = shift[1];
        int direction = shift[2];

        for (int i = start; i <= end; i++) {
            if (direction == 1) {  // forward
                if (chars[i] == 'z') {
                    chars[i] = 'a';
                } else {
                    chars[i] = (char)(chars[i] + 1);
                }
            } else {  // backward
                if (chars[i] == 'a') {
                    chars[i] = 'z';
                } else {
                    chars[i] = (char)(chars[i] - 1);
                }
            }
        }
    }

    return new String(chars);
}
```

</div>

**Why this is too slow:** If `s` has length `n` and there are `k` shift operations, and each operation affects up to `n` characters, the time complexity is O(n × k). For the maximum constraints (n = 10⁵, k = 10⁵), this would be 10¹⁰ operations, which is far too slow.

## Optimized Approach

The key insight is that we don't need to apply each shift operation individually. Instead, we can use a **difference array** or **prefix sum** technique:

1. Create an array `shiftCount` of length `n+1` initialized to 0
2. For each shift operation `[start, end, direction]`:
   - If `direction == 1`, add 1 to `shiftCount[start]` and subtract 1 from `shiftCount[end+1]`
   - If `direction == 0`, add -1 to `shiftCount[start]` and subtract -1 from `shiftCount[end+1]` (which means add 1)
3. Compute the prefix sum of `shiftCount` to get the net shift for each position
4. Apply the net shift to each character in the string

**Why this works:** The difference array technique allows us to mark where shifts start and end. When we compute the prefix sum, each position gets the cumulative effect of all shifts that apply to it. This transforms O(n × k) operations into O(n + k) operations.

Let's revisit our example with this technique:

`s = "abc"`, `shifts = [[0,1,1], [1,2,0]]`

1. Initialize `shiftCount = [0, 0, 0, 0]` (length n+1 = 4)
2. Apply first shift `[0,1,1]`:
   - Add 1 to `shiftCount[0]`: `[1, 0, 0, 0]`
   - Subtract 1 from `shiftCount[2]`: `[1, 0, -1, 0]`
3. Apply second shift `[1,2,0]`:
   - Add -1 to `shiftCount[1]`: `[1, -1, -1, 0]`
   - Subtract -1 from `shiftCount[3]`: `[1, -1, -1, 1]`
4. Compute prefix sums:
   - Index 0: 1
   - Index 1: 1 + (-1) = 0
   - Index 2: 0 + (-1) = -1
5. Apply shifts:
   - Index 0: 'a' + 1 = 'b'
   - Index 1: 'b' + 0 = 'b'
   - Index 2: 'c' + (-1) = 'b'
     Result: `"bbb"` (matches our brute force result)

## Optimal Solution

Here's the complete implementation using the difference array technique:

<div class="code-group">

```python
# Time: O(n + k) where n = len(s), k = len(shifts)
# Space: O(n) for the difference array
def shiftingLetters(s, shifts):
    n = len(s)
    # Create difference array of size n+1 to handle end+1 safely
    diff = [0] * (n + 1)

    # Step 1: Mark the start and end of each shift operation
    for start, end, direction in shifts:
        # direction = 1 means forward (+1), direction = 0 means backward (-1)
        shift_value = 1 if direction == 1 else -1

        # Mark the start of the shift range
        diff[start] += shift_value
        # Mark the end+1 to cancel the effect after the range
        # We use n as the boundary check to avoid index out of bounds
        if end + 1 < n:
            diff[end + 1] -= shift_value

    # Step 2: Compute prefix sum to get net shift for each position
    net_shifts = [0] * n
    current_shift = 0
    for i in range(n):
        current_shift += diff[i]
        net_shifts[i] = current_shift

    # Step 3: Apply shifts to each character
    result_chars = []
    for i in range(n):
        # Convert character to its position in alphabet (0-25)
        char_pos = ord(s[i]) - ord('a')
        # Apply the shift, handling wrap-around with modulo 26
        # The modulo handles both positive and negative shifts correctly
        new_pos = (char_pos + net_shifts[i]) % 26
        # Ensure positive result for negative modulo in Python
        if new_pos < 0:
            new_pos += 26
        # Convert back to character
        result_chars.append(chr(ord('a') + new_pos))

    return ''.join(result_chars)
```

```javascript
// Time: O(n + k) where n = s.length, k = shifts.length
// Space: O(n) for the difference array
function shiftingLetters(s, shifts) {
  const n = s.length;
  // Create difference array of size n+1 to handle end+1 safely
  const diff = new Array(n + 1).fill(0);

  // Step 1: Mark the start and end of each shift operation
  for (const [start, end, direction] of shifts) {
    // direction = 1 means forward (+1), direction = 0 means backward (-1)
    const shiftValue = direction === 1 ? 1 : -1;

    // Mark the start of the shift range
    diff[start] += shiftValue;
    // Mark the end+1 to cancel the effect after the range
    if (end + 1 < n) {
      diff[end + 1] -= shiftValue;
    }
  }

  // Step 2: Compute prefix sum to get net shift for each position
  const netShifts = new Array(n).fill(0);
  let currentShift = 0;
  for (let i = 0; i < n; i++) {
    currentShift += diff[i];
    netShifts[i] = currentShift;
  }

  // Step 3: Apply shifts to each character
  const resultChars = [];
  for (let i = 0; i < n; i++) {
    // Convert character to its position in alphabet (0-25)
    const charPos = s.charCodeAt(i) - 97; // 'a' = 97
    // Apply the shift, handling wrap-around with modulo 26
    // JavaScript's % operator gives remainder, not modulo, so we need to handle negatives
    let newPos = (charPos + netShifts[i]) % 26;
    if (newPos < 0) {
      newPos += 26;
    }
    // Convert back to character
    resultChars.push(String.fromCharCode(97 + newPos));
  }

  return resultChars.join("");
}
```

```java
// Time: O(n + k) where n = s.length(), k = shifts.length
// Space: O(n) for the difference array
public String shiftingLetters(String s, int[][] shifts) {
    int n = s.length();
    // Create difference array of size n+1 to handle end+1 safely
    int[] diff = new int[n + 1];

    // Step 1: Mark the start and end of each shift operation
    for (int[] shift : shifts) {
        int start = shift[0];
        int end = shift[1];
        int direction = shift[2];
        // direction = 1 means forward (+1), direction = 0 means backward (-1)
        int shiftValue = direction == 1 ? 1 : -1;

        // Mark the start of the shift range
        diff[start] += shiftValue;
        // Mark the end+1 to cancel the effect after the range
        if (end + 1 < n) {
            diff[end + 1] -= shiftValue;
        }
    }

    // Step 2: Compute prefix sum to get net shift for each position
    int[] netShifts = new int[n];
    int currentShift = 0;
    for (int i = 0; i < n; i++) {
        currentShift += diff[i];
        netShifts[i] = currentShift;
    }

    // Step 3: Apply shifts to each character
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < n; i++) {
        // Convert character to its position in alphabet (0-25)
        int charPos = s.charAt(i) - 'a';
        // Apply the shift, handling wrap-around with modulo 26
        // Java's % operator gives remainder, not modulo, so we need to handle negatives
        int newPos = (charPos + netShifts[i]) % 26;
        if (newPos < 0) {
            newPos += 26;
        }
        // Convert back to character
        result.append((char)('a' + newPos));
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + k)

- Processing `k` shift operations takes O(k) time to update the difference array
- Computing prefix sums takes O(n) time
- Applying shifts to characters takes O(n) time
- Total: O(n + k)

**Space Complexity:** O(n)

- We need O(n) space for the difference array (size n+1)
- We need O(n) space for the net shifts array (optional but convenient)
- The output string takes O(n) space
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle wrap-around correctly:** When shifting 'z' forward, it should become 'a', not go beyond 'z'. Similarly, 'a' shifted backward should become 'z'. The modulo 26 operation handles this, but candidates often forget to make the result positive after modulo with negative numbers.

2. **Off-by-one errors with the difference array:** The difference array needs to be size `n+1` to safely handle `diff[end+1]`. If you make it size `n`, you'll get index out of bounds when `end = n-1`. Always check `if end + 1 < n` before accessing `diff[end+1]`.

3. **Not handling large shift values efficiently:** Each position's net shift can be large (up to ±k). Doing `(charPos + shift) % 26` handles this efficiently. Some candidates try to apply shifts one at a time, which is inefficient.

4. **Confusing remainder with modulo in JavaScript/Java:** In Python, `-1 % 26 = 25`, but in JavaScript and Java, `-1 % 26 = -1`. You need to add 26 if the result is negative to get the proper modulo result.

## When You'll See This Pattern

The difference array/prefix sum technique for range updates appears in several problems:

1. **Range Addition (LeetCode 370):** Exactly the same pattern - you're given length and operations that add values to ranges, and you need the final array.

2. **Corporate Flight Bookings (LeetCode 1109):** You have flight bookings from i to j with k seats, and you need to calculate the final seat count for each flight.

3. **Car Pooling (LeetCode 1094):** Similar pattern where passengers get on and off at different stops, and you need to know if capacity is ever exceeded.

The core insight is always the same: instead of applying each range update individually (O(n) per update), mark the start and end points in a difference array (O(1) per update), then compute prefix sums once (O(n) total).

## Key Takeaways

1. **Difference arrays transform range updates from O(n) to O(1):** When you need to apply the same operation to a range of indices, mark the start with +value and end+1 with -value, then compute prefix sums.

2. **Look for range operation patterns:** If a problem involves applying operations to ranges (add, subtract, shift) and you need the final state, consider if a difference array approach would work.

3. **Handle circular/cyclic behavior with modulo:** When dealing with alphabets, days of the week, or other cyclic systems, modulo arithmetic is your friend. Remember to handle negative results properly in languages where % is remainder, not modulo.

Related problems: [The Skyline Problem](/problem/the-skyline-problem), [Range Sum Query - Mutable](/problem/range-sum-query-mutable), [Range Addition](/problem/range-addition)
