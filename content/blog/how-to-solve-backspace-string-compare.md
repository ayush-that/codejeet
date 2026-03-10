---
title: "How to Solve Backspace String Compare — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Backspace String Compare. Easy difficulty, 49.8% acceptance rate. Topics: Two Pointers, String, Stack, Simulation."
date: "2026-10-13"
category: "dsa-patterns"
tags: ["backspace-string-compare", "two-pointers", "string", "stack", "easy"]
---

# How to Solve Backspace String Compare

This problem asks us to compare two strings after processing backspace characters (`'#'`). Each `'#'` removes the character immediately before it (or does nothing if there's no character to remove). The challenge is that backspaces affect characters that came earlier in the string, so we can't simply process the strings from left to right without tracking what gets deleted.

## Visual Walkthrough

Let's trace through an example: `s = "ab#c"` and `t = "ad#c"`.

For string `s = "ab#c"`:

1. Read `'a'` → current result: `"a"`
2. Read `'b'` → current result: `"ab"`
3. Read `'#'` → backspace removes `'b'` → current result: `"a"`
4. Read `'c'` → current result: `"ac"`

For string `t = "ad#c"`:

1. Read `'a'` → current result: `"a"`
2. Read `'d'` → current result: `"ad"`
3. Read `'#'` → backspace removes `'d'` → current result: `"a"`
4. Read `'c'` → current result: `"ac"`

Both strings evaluate to `"ac"`, so they're equal. Notice how the `'#'` affects the character immediately before it, not just any random character. Also, multiple consecutive backspaces can remove multiple characters.

## Brute Force Approach

The most straightforward approach is to simulate the typing process using a stack or by building a new string:

1. Process each string separately
2. For each character:
   - If it's not `'#'`, add it to the result
   - If it's `'#'`, remove the last character from the result (if any exists)
3. Compare the two processed strings

This approach is intuitive and works correctly, but it requires O(n) extra space to store the processed strings. While this is acceptable for many interview scenarios (and is actually one of the optimal approaches), we can do even better with a two-pointer approach that uses only O(1) extra space.

However, let's first look at the stack-based solution since it's easier to understand and implement:

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(t)
# Space: O(n + m) for the processed strings
def backspaceCompare(s: str, t: str) -> bool:
    def process_string(string: str) -> str:
        """Process a string with backspaces and return the result."""
        result = []
        for char in string:
            if char != '#':
                result.append(char)
            elif result:  # Only pop if there's something to remove
                result.pop()
        return ''.join(result)

    return process_string(s) == process_string(t)
```

```javascript
// Time: O(n + m) where n = s.length, m = t.length
// Space: O(n + m) for the processed strings
function backspaceCompare(s, t) {
  function processString(str) {
    // Process a string with backspaces and return the result
    const result = [];
    for (const char of str) {
      if (char !== "#") {
        result.push(char);
      } else if (result.length > 0) {
        result.pop();
      }
    }
    return result.join("");
  }

  return processString(s) === processString(t);
}
```

```java
// Time: O(n + m) where n = s.length(), m = t.length()
// Space: O(n + m) for the processed strings
public boolean backspaceCompare(String s, String t) {
    // Helper function to process a string with backspaces
    String processString(String str) {
        StringBuilder result = new StringBuilder();
        for (char c : str.toCharArray()) {
            if (c != '#') {
                result.append(c);
            } else if (result.length() > 0) {
                result.deleteCharAt(result.length() - 1);
            }
        }
        return result.toString();
    }

    return processString(s).equals(processString(t));
}
```

</div>

This solution is clear and correct, but we can optimize the space usage. The stack approach uses O(n + m) space to store the processed strings. For very large inputs or memory-constrained environments, we might want to use O(1) extra space.

## Optimal Solution

The optimal solution uses a two-pointer approach that processes both strings from right to left. This allows us to skip characters that will be deleted by backspaces without actually building new strings.

The key insight: When we process from right to left:

- We can count how many backspaces we've seen
- For each non-backspace character, if we have backspaces pending, we skip it
- Otherwise, we compare it with the current character from the other string

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(t)
# Space: O(1) - we only use a few variables
def backspaceCompare(s: str, t: str) -> bool:
    # Start from the end of both strings
    i, j = len(s) - 1, len(t) - 1

    while i >= 0 or j >= 0:
        # Find the next valid character in s
        skip = 0
        while i >= 0:
            if s[i] == '#':
                skip += 1  # Found a backspace
                i -= 1
            elif skip > 0:
                skip -= 1  # This character gets deleted
                i -= 1
            else:
                break  # Found a valid character

        # Find the next valid character in t
        skip = 0
        while j >= 0:
            if t[j] == '#':
                skip += 1  # Found a backspace
                j -= 1
            elif skip > 0:
                skip -= 1  # This character gets deleted
                j -= 1
            else:
                break  # Found a valid character

        # Compare the valid characters
        # If both strings are exhausted, they match
        if i >= 0 and j >= 0:
            if s[i] != t[j]:
                return False
        # If one string is exhausted but the other isn't, they don't match
        elif (i >= 0) != (j >= 0):
            return False

        # Move to the next character
        i -= 1
        j -= 1

    return True
```

```javascript
// Time: O(n + m) where n = s.length, m = t.length
// Space: O(1) - we only use a few variables
function backspaceCompare(s, t) {
  // Start from the end of both strings
  let i = s.length - 1,
    j = t.length - 1;

  while (i >= 0 || j >= 0) {
    // Find the next valid character in s
    let skip = 0;
    while (i >= 0) {
      if (s[i] === "#") {
        skip++; // Found a backspace
        i--;
      } else if (skip > 0) {
        skip--; // This character gets deleted
        i--;
      } else {
        break; // Found a valid character
      }
    }

    // Find the next valid character in t
    skip = 0;
    while (j >= 0) {
      if (t[j] === "#") {
        skip++; // Found a backspace
        j--;
      } else if (skip > 0) {
        skip--; // This character gets deleted
        j--;
      } else {
        break; // Found a valid character
      }
    }

    // Compare the valid characters
    // If both strings are exhausted, they match
    if (i >= 0 && j >= 0) {
      if (s[i] !== t[j]) return false;
    }
    // If one string is exhausted but the other isn't, they don't match
    else if (i >= 0 !== j >= 0) {
      return false;
    }

    // Move to the next character
    i--;
    j--;
  }

  return true;
}
```

```java
// Time: O(n + m) where n = s.length(), m = t.length()
// Space: O(1) - we only use a few variables
public boolean backspaceCompare(String s, String t) {
    // Start from the end of both strings
    int i = s.length() - 1, j = t.length() - 1;

    while (i >= 0 || j >= 0) {
        // Find the next valid character in s
        int skip = 0;
        while (i >= 0) {
            if (s.charAt(i) == '#') {
                skip++;  // Found a backspace
                i--;
            } else if (skip > 0) {
                skip--;  // This character gets deleted
                i--;
            } else {
                break;  // Found a valid character
            }
        }

        // Find the next valid character in t
        skip = 0;
        while (j >= 0) {
            if (t.charAt(j) == '#') {
                skip++;  // Found a backspace
                j--;
            } else if (skip > 0) {
                skip--;  // This character gets deleted
                j--;
            } else {
                break;  // Found a valid character
            }
        }

        // Compare the valid characters
        // If both strings are exhausted, they match
        if (i >= 0 && j >= 0) {
            if (s.charAt(i) != t.charAt(j)) return false;
        }
        // If one string is exhausted but the other isn't, they don't match
        else if ((i >= 0) != (j >= 0)) {
            return false;
        }

        // Move to the next character
        i--;
        j--;
    }

    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n is the length of string s and m is the length of string t. In the worst case, we process each character exactly once (though some characters might be processed multiple times when we skip them due to backspaces, each character is still visited a constant number of times).

**Space Complexity:** O(1) for the two-pointer approach. We only use a few integer variables (i, j, skip). The stack-based approach uses O(n + m) space to store the processed strings.

## Common Mistakes

1. **Processing from left to right without proper tracking:** Candidates often try to process strings left to right but struggle to handle cases where backspaces delete characters that haven't been "seen" yet. The key is to either use a stack or process from right to left.

2. **Forgetting that multiple consecutive backspaces can delete multiple characters:** For example, in `"a##b"`, both `'a'` and the first `'#'` get deleted by the second `'#'`. The correct result is `"b"`, not `"ab"`.

3. **Not handling the case where backspace occurs at the beginning:** When `'#'` is the first character, it should do nothing (delete nothing). Some implementations might try to pop from an empty stack or access invalid indices.

4. **In the two-pointer solution, forgetting to reset the skip counter:** The skip counter needs to be reset for each string when finding the next valid character. Using the same skip variable for both strings without resetting is a common error.

## When You'll See This Pattern

The two-pointer technique from the end of strings/arrays is useful in many problems:

1. **Valid Palindrome (Easy):** Check if a string is a palindrome by using two pointers from both ends, skipping non-alphanumeric characters.

2. **Trapping Rain Water (Hard):** Uses two pointers from both ends to calculate how much water can be trapped between bars.

3. **Merge Sorted Array (Easy):** When merging sorted arrays, it's often optimal to start from the end to avoid shifting elements.

The stack-based approach for processing strings with cancellation operations appears in:

1. **Removing Stars From a String (Medium):** Exactly the same pattern but with stars (`'*'`) instead of backspaces.

2. **Crawler Log Folder (Easy):** Processing a log of folder operations where `"../"` means go up one level (similar to backspace).

## Key Takeaways

1. **When operations affect previous elements, consider processing from right to left or using a stack.** This pattern helps when you need to "undo" or cancel previous operations.

2. **Two pointers from the end can often save space** when you don't need to store the entire processed result, just compare as you go.

3. **For string manipulation problems, always test edge cases:** empty strings, all backspaces, backspaces at the beginning, and multiple consecutive backspaces.

Related problems: [Crawler Log Folder](/problem/crawler-log-folder), [Removing Stars From a String](/problem/removing-stars-from-a-string)
