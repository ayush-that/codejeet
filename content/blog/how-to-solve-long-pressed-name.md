---
title: "How to Solve Long Pressed Name — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Long Pressed Name. Easy difficulty, 32.8% acceptance rate. Topics: Two Pointers, String."
date: "2026-02-24"
category: "dsa-patterns"
tags: ["long-pressed-name", "two-pointers", "string", "easy"]
---

# How to Solve Long Pressed Name

This problem asks us to determine if a typed string could be the result of typing a name where some keys might have been "long pressed" (typed multiple times). The tricky part is that while extra repetitions are allowed, the order of characters must be preserved, and we can't skip any characters from the original name.

## Visual Walkthrough

Let's trace through an example: `name = "alex"`, `typed = "aaleex"`

We need to check if `typed` could be `name` with possible long presses. Let's think character by character:

1. **First character 'a' in name**:
   - In typed, we see 'a' (good)
   - Next typed character is also 'a' (long press allowed)
   - We consume both 'a's from typed for the single 'a' in name

2. **Second character 'l' in name**:
   - Next in typed is 'l' (good)
   - Next typed character is 'e' (different, so we move on)
   - We consumed one 'l' from typed

3. **Third character 'e' in name**:
   - Next in typed is 'e' (good)
   - Next typed character is also 'e' (long press allowed)
   - We consume both 'e's from typed

4. **Fourth character 'x' in name**:
   - Next in typed is 'x' (good)
   - We're at the end of typed, so we're done

Since we matched all characters in name and consumed all characters in typed, this is valid.

Now consider a counterexample: `name = "saeed"`, `typed = "ssaaedd"`

1. **First character 's' in name**:
   - In typed, we see 's' (good)
   - Next typed is also 's' (long press allowed)
   - We consume both 's's

2. **Second character 'a' in name**:
   - Next in typed is 'a' (good)
   - Next typed is also 'a' (long press allowed)
   - We consume both 'a's

3. **Third character 'e' in name**:
   - Next in typed is 'e' (good)
   - We consume one 'e'

4. **Fourth character 'e' in name**:
   - Next in typed is 'd' (WRONG - should be 'e')
   - This fails immediately

The typed string has the wrong character at this position, so it can't be a long-pressed version of the name.

## Brute Force Approach

A naive approach might try to generate all possible long-pressed versions of the name and check if typed matches any of them. For each character in name, we could repeat it 1 to k times (where k is limited by the remaining length of typed). This leads to exponential time complexity - O(k^n) where n is the length of name and k could be up to the length of typed.

Another naive approach might be to compress both strings by counting consecutive identical characters, then compare. For example:

- Compress "alex" to [('a',1), ('l',1), ('e',1), ('x',1)]
- Compress "aaleex" to [('a',2), ('l',1), ('e',2), ('x',1)]
- Then check that characters match and typed count ≥ name count for each group

While this approach works, it requires O(n) extra space for the compressed representations, and we can do better with a two-pointer approach that uses O(1) space.

## Optimal Solution

The optimal solution uses two pointers to traverse both strings simultaneously. We compare characters at each position, allowing the typed pointer to advance through repeated characters while ensuring we don't skip any characters from the name.

<div class="code-group">

```python
# Time: O(n + m) where n = len(name), m = len(typed)
# Space: O(1) - we only use pointers and counters
def isLongPressedName(name: str, typed: str) -> bool:
    # Initialize pointers for both strings
    i, j = 0, 0

    # Traverse both strings
    while j < len(typed):
        # Case 1: Characters match, move both pointers
        if i < len(name) and name[i] == typed[j]:
            i += 1
            j += 1
        # Case 2: Characters don't match, but typed[j] matches previous name character
        # This handles long presses of the previous character
        elif i > 0 and name[i-1] == typed[j]:
            j += 1
        # Case 3: Characters don't match and it's not a long press of previous character
        else:
            return False

    # After processing all typed characters, check if we've also processed all name characters
    return i == len(name)
```

```javascript
// Time: O(n + m) where n = name.length, m = typed.length
// Space: O(1) - we only use pointers and counters
function isLongPressedName(name, typed) {
  // Initialize pointers for both strings
  let i = 0,
    j = 0;

  // Traverse both strings
  while (j < typed.length) {
    // Case 1: Characters match, move both pointers
    if (i < name.length && name[i] === typed[j]) {
      i++;
      j++;
    }
    // Case 2: Characters don't match, but typed[j] matches previous name character
    // This handles long presses of the previous character
    else if (i > 0 && name[i - 1] === typed[j]) {
      j++;
    }
    // Case 3: Characters don't match and it's not a long press of previous character
    else {
      return false;
    }
  }

  // After processing all typed characters, check if we've also processed all name characters
  return i === name.length;
}
```

```java
// Time: O(n + m) where n = name.length(), m = typed.length()
// Space: O(1) - we only use pointers and counters
class Solution {
    public boolean isLongPressedName(String name, String typed) {
        // Initialize pointers for both strings
        int i = 0, j = 0;

        // Traverse both strings
        while (j < typed.length()) {
            // Case 1: Characters match, move both pointers
            if (i < name.length() && name.charAt(i) == typed.charAt(j)) {
                i++;
                j++;
            }
            // Case 2: Characters don't match, but typed[j] matches previous name character
            // This handles long presses of the previous character
            else if (i > 0 && name.charAt(i-1) == typed.charAt(j)) {
                j++;
            }
            // Case 3: Characters don't match and it's not a long press of previous character
            else {
                return false;
            }
        }

        // After processing all typed characters, check if we've also processed all name characters
        return i == name.length();
    }
}
```

</div>

**Step-by-step explanation of the algorithm:**

1. **Initialize two pointers**: `i` for `name` and `j` for `typed`, both starting at 0.

2. **Traverse the typed string**: We'll process every character in `typed`.

3. **Case 1 - Characters match**: If the current characters in both strings match (`name[i] == typed[j]`), we advance both pointers. This means we've successfully matched a character from the name.

4. **Case 2 - Long press detected**: If characters don't match but `typed[j]` equals the previous character in `name` (`name[i-1]`), this is a valid long press. We only advance the `typed` pointer (`j++`) to consume the repeated character.

5. **Case 3 - Invalid character**: If neither case applies, the typed string has a character that doesn't match the current or previous name character, so we return `false`.

6. **Final check**: After processing all typed characters, we verify that we've also processed all name characters (`i == len(name)`). If not, the typed string is missing some characters from the name.

## Complexity Analysis

**Time Complexity**: O(n + m) where n is the length of `name` and m is the length of `typed`. In the worst case, we traverse each string once. Even though we have a nested while loop, each pointer only moves forward and never backward, so each character is examined at most once.

**Space Complexity**: O(1). We only use a constant amount of extra space for the pointers and loop variables. No additional data structures are created that scale with input size.

## Common Mistakes

1. **Forgetting to check if we've consumed all name characters**: After the loop, you must check `i == len(name)`. Otherwise, cases like `name = "alex"`, `typed = "aalee"` would incorrectly return true (we matched "ale" but missed the final "x").

2. **Not handling the start condition properly**: When `i = 0`, we can't check `name[i-1]` (would cause index error). That's why we check `i > 0` before accessing `name[i-1]`.

3. **Incorrect long press logic**: Some candidates try to count consecutive characters and compare counts, which works but is more complex. The key insight is that we only need to compare with the _previous_ name character for long presses, not keep track of all previous characters.

4. **Assuming typed must be longer than name**: While typically true (due to long presses), edge cases like `name = "a"`, `typed = "a"` are valid. The typed string could be the same length as name if no keys were long pressed.

## When You'll See This Pattern

The two-pointer technique used here appears in many string and array problems where you need to compare or merge two sequences:

1. **Merge Sorted Array (Easy)**: Similar two-pointer approach to merge two sorted arrays.
2. **Valid Palindrome (Easy)**: Use two pointers moving inward to check if a string is a palindrome.
3. **Backspace String Compare (Easy)**: Compare two strings with backspaces by processing from the end.
4. **Interval List Intersections (Medium)**: Find intersections between two lists of intervals using two pointers.

The pattern is recognizable when you need to process two sequences in a coordinated way, often with different advancement rules for each pointer.

## Key Takeaways

1. **Two-pointer technique is ideal for comparing sequences**: When you need to process two arrays or strings in relation to each other, consider if you can use pointers that advance based on different conditions.

2. **Think about what "valid" means in terms of local decisions**: For this problem, at each step we only need to check the current and previous character from the name. We don't need to remember the entire history.

3. **Always check boundary conditions**: After your main logic, verify that you've fully processed both inputs. It's easy to exit a loop early and forget to check if you've consumed all required elements.

Related problems: [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers)
