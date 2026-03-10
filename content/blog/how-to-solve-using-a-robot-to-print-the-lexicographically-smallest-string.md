---
title: "How to Solve Using a Robot to Print the Lexicographically Smallest String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Using a Robot to Print the Lexicographically Smallest String. Medium difficulty, 62.5% acceptance rate. Topics: Hash Table, String, Stack, Greedy."
date: "2027-04-27"
category: "dsa-patterns"
tags:
  [
    "using-a-robot-to-print-the-lexicographically-smallest-string",
    "hash-table",
    "string",
    "stack",
    "medium",
  ]
---

# How to Solve "Using a Robot to Print the Lexicographically Smallest String"

You're given a string `s` and a robot that holds a temporary string `t`. You can either move the first character from `s` to the end of `t`, or move the last character from `t` to the result string. Your goal is to produce the lexicographically smallest possible result string by the time both `s` and `t` are empty. The tricky part is deciding when to move characters from `s` to `t` versus when to pop from `t` to the result—making the wrong choice can lead to a larger final string.

## Visual Walkthrough

Let's trace through `s = "bacd"` step by step. We'll track `s`, `t` (as a stack), and the result string.

**Step 1:** `s = "bacd"`, `t = []`, result = `""`

- We need to decide: push from `s` or pop from `t`? Since `t` is empty, we must push.
- Push 'b' from `s` to `t`: `s = "acd"`, `t = ["b"]`

**Step 2:** `s = "acd"`, `t = ["b"]`, result = `""`

- Compare next available characters: next in `s` is 'a', top of `t` is 'b'.
- We want the smallest possible next character. 'a' < 'b', so we should push 'a' to `t` first.
- Push 'a' from `s` to `t`: `s = "cd"`, `t = ["b", "a"]` (top is 'a')

**Step 3:** `s = "cd"`, `t = ["b", "a"]`, result = `""`

- Next in `s` is 'c', top of `t` is 'a'.
- 'a' < 'c', so we should pop from `t`.
- Pop 'a' from `t` to result: `s = "cd"`, `t = ["b"]`, result = `"a"`

**Step 4:** `s = "cd"`, `t = ["b"]`, result = `"a"`

- Next in `s` is 'c', top of `t` is 'b'.
- 'b' < 'c', so pop from `t`.
- Pop 'b' from `t` to result: `s = "cd"`, `t = []`, result = `"ab"`

**Step 5:** `s = "cd"`, `t = []`, result = `"ab"`

- `t` is empty, so we must push.
- Push 'c' from `s` to `t`: `s = "d"`, `t = ["c"]`

**Step 6:** `s = "d"`, `t = ["c"]`, result = `"ab"`

- Next in `s` is 'd', top of `t` is 'c'.
- 'c' < 'd', so pop from `t`.
- Pop 'c' from `t` to result: `s = "d"`, `t = []`, result = `"abc"`

**Step 7:** `s = "d"`, `t = []`, result = `"abc"`

- `t` is empty, so push.
- Push 'd' from `s` to `t`: `s = ""`, `t = ["d"]`

**Step 8:** `s = ""`, `t = ["d"]`, result = `"abc"`

- `s` is empty, so we must pop from `t`.
- Pop 'd' from `t` to result: `s = ""`, `t = []`, result = `"abcd"`

Final result: `"abcd"` (lexicographically smallest possible).

The key insight: we should pop from `t` when the character at the top of `t` is ≤ the smallest remaining character in `s`. Otherwise, we push from `s` to `t`.

## Brute Force Approach

A naive approach would be to explore all possible sequences of operations using recursion or backtracking. At each step, you have two choices: push from `s` (if `s` is not empty) or pop from `t` (if `t` is not empty). You would need to try all possible sequences until both strings are empty, then compare all resulting strings to find the lexicographically smallest.

This brute force approach has exponential time complexity—O(2^(n)) where n is the length of `s`—since for each character, you essentially have two choices. For a string of length 20, that's over 1 million possibilities. For length 100, it's completely infeasible.

The problem constraints (up to 10^5 characters) make this approach impossible. We need a greedy approach that makes the optimal decision at each step without exploring all possibilities.

## Optimized Approach

The optimal solution uses a **greedy algorithm** with a **stack** for `t` and a **frequency array** to track remaining characters in `s`.

Here's the step-by-step reasoning:

1. **Preprocessing**: First, count the frequency of each character in `s`. This gives us the "remaining" characters as we process the string.

2. **Main loop**: While there are characters left in either `s` or `t`:
   - If `t` is not empty and the top character of `t` is ≤ the smallest remaining character in `s`, then pop from `t` to the result. This ensures we output the smallest possible character at each step.
   - Otherwise, push the next character from `s` to `t`.

3. **Finding the smallest remaining character**: We need an efficient way to find the smallest character still in `s`. Since we're processing `s` sequentially, we can maintain a pointer that scans through all 26 lowercase letters to find the smallest one that still has a count > 0 in our frequency array.

4. **Data structures**:
   - A stack for `t` (last-in, first-out)
   - A frequency array of size 26 to track remaining characters in `s`
   - A result list to build the output string

The key insight is that we should only pop from `t` when we're sure that the character at the top is the smallest possible character we can output at that moment. We determine this by comparing it to the smallest character remaining in `s`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of s
# Space: O(n) for the stack and result
def robotWithString(s: str) -> str:
    # Count frequency of each character in s
    # We'll use an array of size 26 for lowercase letters
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    # Stack to simulate the robot's string t
    stack = []
    # List to build the result string
    result = []

    # Helper function to find the smallest character still in s
    def get_min_char():
        # Scan through all 26 letters to find the smallest with count > 0
        for i in range(26):
            if freq[i] > 0:
                return chr(i + ord('a'))
        return ''  # Should never reach here if s is not empty

    # Process each character in s
    for ch in s:
        # Push current character to stack
        stack.append(ch)
        # Decrease frequency since we're moving it from s to t
        freq[ord(ch) - ord('a')] -= 1

        # While stack is not empty and top of stack is <= smallest remaining in s
        while stack and stack[-1] <= get_min_char():
            # Pop from stack to result (optimal move)
            result.append(stack.pop())

    # After processing all characters in s, pop any remaining characters from stack
    while stack:
        result.append(stack.pop())

    # Convert result list to string
    return ''.join(result)
```

```javascript
// Time: O(n) where n is the length of s
// Space: O(n) for the stack and result
function robotWithString(s) {
  // Count frequency of each character in s
  // Array of size 26 for lowercase letters
  const freq = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++; // 'a' has code 97
  }

  // Stack to simulate the robot's string t
  const stack = [];
  // Array to build the result string
  const result = [];

  // Helper function to find the smallest character still in s
  const getMinChar = () => {
    // Scan through all 26 letters to find the smallest with count > 0
    for (let i = 0; i < 26; i++) {
      if (freq[i] > 0) {
        return String.fromCharCode(i + 97);
      }
    }
    return ""; // Should never reach here if s is not empty
  };

  // Process each character in s
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    // Push current character to stack
    stack.push(ch);
    // Decrease frequency since we're moving it from s to t
    freq[ch.charCodeAt(0) - 97]--;

    // While stack is not empty and top of stack is <= smallest remaining in s
    while (stack.length > 0 && stack[stack.length - 1] <= getMinChar()) {
      // Pop from stack to result (optimal move)
      result.push(stack.pop());
    }
  }

  // After processing all characters in s, pop any remaining characters from stack
  while (stack.length > 0) {
    result.push(stack.pop());
  }

  // Convert result array to string
  return result.join("");
}
```

```java
// Time: O(n) where n is the length of s
// Space: O(n) for the stack and result
class Solution {
    public String robotWithString(String s) {
        // Count frequency of each character in s
        // Array of size 26 for lowercase letters
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }

        // Stack to simulate the robot's string t
        Stack<Character> stack = new Stack<>();
        // StringBuilder to build the result string
        StringBuilder result = new StringBuilder();

        // Helper function to find the smallest character still in s
        // Using a method to avoid recomputing unnecessarily
        char getMinChar() {
            // Scan through all 26 letters to find the smallest with count > 0
            for (int i = 0; i < 26; i++) {
                if (freq[i] > 0) {
                    return (char) (i + 'a');
                }
            }
            return ' '; // Should never reach here if s is not empty
        }

        // Process each character in s
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            // Push current character to stack
            stack.push(ch);
            // Decrease frequency since we're moving it from s to t
            freq[ch - 'a']--;

            // While stack is not empty and top of stack is <= smallest remaining in s
            while (!stack.isEmpty() && stack.peek() <= getMinChar()) {
                // Pop from stack to result (optimal move)
                result.append(stack.pop());
            }
        }

        // After processing all characters in s, pop any remaining characters from stack
        while (!stack.isEmpty()) {
            result.append(stack.pop());
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26n) = O(n)**

- Building the frequency array takes O(n)
- The main loop processes each character once: O(n)
- Inside the loop, `getMinChar()` scans up to 26 characters each time it's called
- In the worst case, `getMinChar()` could be called O(n) times, giving O(26n) = O(n)
- The while loop inside the for loop ensures each character is pushed and popped at most once

**Space Complexity: O(n)**

- Frequency array uses O(26) = O(1) space
- Stack can hold up to n characters in the worst case
- Result string requires O(n) space
- Total: O(n)

## Common Mistakes

1. **Not handling the case when `t` is empty**: Some candidates forget that when `t` is empty, they must push from `s`. The condition should check if `t` is not empty before comparing top of `t` with smallest in `s`.

2. **Incorrect comparison for when to pop**: The condition should be `stack[-1] <= get_min_char()` not `<`. If the top of stack equals the smallest remaining character, we should still pop it to get the lexicographically smallest result.

3. **Forgetting to update frequency when moving from `s` to `t`**: When we push a character from `s` to `t`, we must decrement its frequency in the `freq` array. Otherwise, `getMinChar()` will include characters that are no longer in `s`.

4. **Using the wrong data structure for `t`**: `t` needs to support adding to the end and removing from the end (LIFO). A stack is perfect. Using a deque or list with append/pop operations works, but the conceptual model should be a stack.

## When You'll See This Pattern

This problem combines **greedy decision-making** with **stack-based simulation** and **frequency tracking**—a pattern that appears in several other problems:

1. **Remove Duplicate Letters (LeetCode 316)**: Similar concept of creating the lexicographically smallest string by making greedy decisions about when to include characters, using a stack and frequency counter.

2. **Smallest Subsequence of Distinct Characters (LeetCode 1081)**: Essentially the same as Remove Duplicate Letters, using the same stack and frequency approach.

3. **Find Permutation (LeetCode 484)**: While not identical, it also involves constructing a specific sequence based on constraints, often using a stack or similar structure to make optimal choices.

The core pattern is: when you need to construct a sequence with specific properties (like lexicographically smallest), and you have constraints on when you can use elements, consider using a stack to defer decisions and a frequency counter to know what's still available.

## Key Takeaways

1. **Greedy with stack**: When you need to make a series of decisions to optimize an outcome (like lexicographically smallest string), and later decisions depend on earlier ones, a stack can help you "undo" or defer decisions when you find a better option.

2. **Know what's left**: Maintaining a frequency count of remaining elements helps make optimal greedy decisions. You can't know if now is the best time to use an element unless you know what other elements are still available.

3. **Lexicographic comparisons**: For strings, remember that 'a' < 'b', and when characters are equal, the decision often depends on what comes next. The stack helps ensure we output characters in the right order.

Related problems: [Find Permutation](/problem/find-permutation)
