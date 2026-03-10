---
title: "How to Solve Replace All ?'s to Avoid Consecutive Repeating Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Replace All ?'s to Avoid Consecutive Repeating Characters. Easy difficulty, 45.2% acceptance rate. Topics: String."
date: "2028-01-01"
category: "dsa-patterns"
tags: ["replace-all-s-to-avoid-consecutive-repeating-characters", "string", "easy"]
---

# How to Solve Replace All ?'s to Avoid Consecutive Repeating Characters

You're given a string containing lowercase letters and question marks. Your task is to replace each `'?'` with a lowercase letter so that no two consecutive characters in the final string are the same. The non-`'?'` characters are fixed and cannot be changed. What makes this problem interesting is that each replacement depends on both its neighbors, creating a local constraint that must be satisfied globally.

## Visual Walkthrough

Let's trace through an example: `s = "a?b?c?"`

**Step 1:** Start with the first character `'a'` (index 0). It's not a `'?'`, so we leave it as is.

**Step 2:** Move to index 1: `'?'`. We need to replace it with a letter that's different from both neighbors:

- Left neighbor: `'a'` (index 0)
- Right neighbor: `'b'` (index 2)
  We can choose any lowercase letter except `'a'` and `'b'`. Let's pick `'c'`. Now the string becomes `"acb?c?"`

**Step 3:** Index 2 is `'b'` (not a `'?'`), so we skip it.

**Step 4:** Index 3: `'?'`. Check neighbors:

- Left: `'b'` (index 2)
- Right: `'c'` (index 4)
  We need a letter different from both `'b'` and `'c'`. Let's pick `'a'`. String becomes `"acbac?"`

**Step 5:** Index 4 is `'c'` (not a `'?'`), skip it.

**Step 6:** Index 5: `'?'`. Check neighbors:

- Left: `'c'` (index 4)
- Right: None (end of string)
  We need a letter different from just `'c'`. Let's pick `'a'`. Final string: `"acbaca"`

Notice that we only need to check immediate neighbors when replacing a `'?'`. The key insight is that we can process the string left to right, always choosing a safe character for each `'?'` based on its immediate context.

## Brute Force Approach

A naive approach would be to try all possible combinations of letters for each `'?'`. Since there are 26 lowercase letters and potentially many `'?'` characters, this leads to exponential time complexity (O(26^n) where n is the number of `'?'` characters).

Even if we try to be slightly smarter by only considering letters that differ from immediate neighbors, we'd still need to backtrack if we make a choice that causes problems later. For example, consider `"a???b"`:

- First `'?'` must not be `'a'`
- Second `'?'` must not equal first `'?'` or third `'?'`
- Third `'?'` must not equal second `'?'` or `'b'`

If we choose poorly for the first `'?'`, we might get stuck later and need to backtrack. This backtracking approach would be O(26^n) in worst case.

The brute force is clearly impractical for longer strings. We need a greedy approach that makes locally optimal choices that guarantee a globally valid solution.

## Optimal Solution

The optimal solution processes the string from left to right. For each `'?'`, we check its left neighbor (if it exists) and right neighbor (if it exists), then choose the first available letter from `'a'`, `'b'`, `'c'` that's different from both. We only need to check these three letters because with three choices, we're guaranteed to find one that differs from at most two constraints (left and right neighbors).

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def modifyString(s: str) -> str:
    # Convert string to list for easy modification
    s_list = list(s)

    # Iterate through each character in the string
    for i in range(len(s_list)):
        # Only process question marks
        if s_list[i] == '?':
            # Try characters 'a', 'b', 'c' - three is enough because
            # we only need to avoid at most 2 characters (left and right neighbors)
            for char in 'abc':
                # Check if this character would conflict with left neighbor
                left_conflict = (i > 0 and s_list[i-1] == char)
                # Check if this character would conflict with right neighbor
                right_conflict = (i < len(s_list)-1 and s_list[i+1] == char)

                # If no conflicts with either neighbor, we found a valid character
                if not left_conflict and not right_conflict:
                    s_list[i] = char
                    break  # Move to next position once we find valid character

    # Convert list back to string and return
    return ''.join(s_list)
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function modifyString(s) {
  // Convert string to array for easy modification
  const sArray = s.split("");

  // Iterate through each character in the string
  for (let i = 0; i < sArray.length; i++) {
    // Only process question marks
    if (sArray[i] === "?") {
      // Try characters 'a', 'b', 'c' - three is enough because
      // we only need to avoid at most 2 characters (left and right neighbors)
      for (const char of ["a", "b", "c"]) {
        // Check if this character would conflict with left neighbor
        const leftConflict = i > 0 && sArray[i - 1] === char;
        // Check if this character would conflict with right neighbor
        const rightConflict = i < sArray.length - 1 && sArray[i + 1] === char;

        // If no conflicts with either neighbor, we found a valid character
        if (!leftConflict && !rightConflict) {
          sArray[i] = char;
          break; // Move to next position once we find valid character
        }
      }
    }
  }

  // Convert array back to string and return
  return sArray.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the result string
class Solution {
    public String modifyString(String s) {
        // Convert string to char array for easy modification
        char[] chars = s.toCharArray();

        // Iterate through each character in the string
        for (int i = 0; i < chars.length; i++) {
            // Only process question marks
            if (chars[i] == '?') {
                // Try characters 'a', 'b', 'c' - three is enough because
                // we only need to avoid at most 2 characters (left and right neighbors)
                for (char c : new char[]{'a', 'b', 'c'}) {
                    // Check if this character would conflict with left neighbor
                    boolean leftConflict = (i > 0 && chars[i-1] == c);
                    // Check if this character would conflict with right neighbor
                    boolean rightConflict = (i < chars.length - 1 && chars[i+1] == c);

                    // If no conflicts with either neighbor, we found a valid character
                    if (!leftConflict && !rightConflict) {
                        chars[i] = c;
                        break;  // Move to next position once we find valid character
                    }
                }
            }
        }

        // Convert char array back to string and return
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the string. We iterate through the string once, and for each `'?'`, we check at most 3 characters. Even in the worst case where every character is `'?'`, we still do constant work (3 checks) per position.

**Space Complexity:** O(n) for the modified string/array. We need to create a mutable version of the input string to modify it. In Python and JavaScript, strings are immutable, so we convert to list/array. In Java, we use a char array. The space used is proportional to the input size.

## Common Mistakes

1. **Forgetting to handle edge cases:** The first and last characters only have one neighbor to check. Candidates often forget to check if `i > 0` before accessing `s[i-1]` or `i < len(s)-1` before accessing `s[i+1]`, leading to index out of bounds errors.

2. **Using only two letters:** Some candidates try only `'a'` and `'b'`. Consider the case `"a?b"` where the `'?'` needs to be different from both `'a'` and `'b'`. With only two letters available, you might not find a valid replacement. Three letters (`'a'`, `'b'`, `'c'`) are sufficient because you only need to avoid at most two characters.

3. **Not breaking out of the inner loop:** Once you find a valid character for a `'?'`, you should break out of the inner loop that tries `'a'`, `'b'`, `'c'`. Otherwise, you'll waste time checking unnecessary options and might even overwrite a valid choice with a later one.

4. **Modifying the string while iterating:** In languages where strings are immutable (like Python and Java), you can't modify characters directly. You need to convert to a list/array first, make changes, then convert back to string.

## When You'll See This Pattern

This greedy, local-decision-making pattern appears in many string manipulation problems:

1. **Rearrange String k Distance Apart (LeetCode 358):** Similar constraint of avoiding repeating characters within a certain distance. Uses a greedy approach with priority queue.

2. **Task Scheduler (LeetCode 621):** Requires scheduling tasks with a cooldown period between identical tasks. The greedy approach of always scheduling the most frequent available task is conceptually similar.

3. **String Without AAA or BBB (LeetCode 984):** Construct a string with constraints on consecutive characters. Uses a greedy approach to always add the character with higher remaining count, switching when needed to avoid violations.

The common theme is making locally optimal choices (choosing a character that doesn't violate immediate constraints) while ensuring global validity through careful selection criteria.

## Key Takeaways

1. **Greedy works when constraints are local:** When each decision only affects immediate neighbors and doesn't create ripple effects, a greedy left-to-right approach often works. Test this by asking: "If I make the optimal choice here, could it force a bad choice later?"

2. **Three choices are enough for two constraints:** When you need to avoid at most two specific values (like two neighbor characters), having three options guarantees a valid choice. This is a useful combinatorial insight.

3. **Convert immutable strings for modification:** In many languages, strings are immutable. For in-place modifications, convert to a mutable data structure (list in Python, array in JavaScript, char array in Java), make changes, then convert back.

[Practice this problem on CodeJeet](/problem/replace-all-s-to-avoid-consecutive-repeating-characters)
