---
title: "How to Solve Delete Characters to Make Fancy String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Delete Characters to Make Fancy String. Easy difficulty, 74.1% acceptance rate. Topics: String."
date: "2027-10-23"
category: "dsa-patterns"
tags: ["delete-characters-to-make-fancy-string", "string", "easy"]
---

# How to Solve Delete Characters to Make Fancy String

A fancy string is defined as having no three consecutive identical characters. Given a string, we need to remove the minimum number of characters to achieve this property while preserving the original order. The challenge lies in doing this efficiently in a single pass without actually deleting characters (which would be expensive), and handling the string construction correctly.

## Visual Walkthrough

Let's trace through an example: `s = "aaabaaaa"`

We want to build our result string character by character while ensuring we never have three identical characters in a row.

**Step-by-step process:**

1. Start with empty result `""`
2. Add first 'a' → `"a"` (count of consecutive 'a's = 1)
3. Add second 'a' → `"aa"` (count = 2)
4. Third 'a' would make `"aaa"` → we skip this character
5. Add 'b' → `"aab"` (count resets to 1 for 'b')
6. Add 'a' → `"aaba"` (count = 1 for 'a')
7. Add 'a' → `"aabaa"` (count = 2 for 'a')
8. Next 'a' would make three consecutive → skip
9. Next 'a' would also make three consecutive → skip
10. Final result: `"aabaa"`

Notice that after skipping the third 'a', we still need to check subsequent 'a's against the last two characters in our result. This is why we need to track the count of consecutive identical characters.

## Brute Force Approach

A naive approach might try to actually delete characters from the string when we find three in a row, then restart checking from the beginning:

1. Scan the string looking for three consecutive identical characters
2. When found, remove one character at that position
3. Restart scanning from the beginning (since removal might create new triplets)
4. Repeat until no triplets remain

This approach is problematic because:

- Removing from a string is O(n) in most languages
- Restarting from the beginning each time gives O(n²) worst-case time
- For strings like `"aaaaaaaa"`, we'd repeatedly scan and remove

While this would produce the correct result, it's highly inefficient for larger inputs. The key insight is that we don't need to actually modify the original string or restart scanning—we can build the result incrementally while tracking how many consecutive identical characters we've added.

## Optimal Solution

The optimal solution uses a single pass through the string while building the result. We maintain a count of how many consecutive identical characters we've added to our result. When we encounter a character that would make three in a row, we skip it.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n is the length of the input string
def makeFancyString(s: str) -> str:
    """
    Builds a fancy string by removing characters that would create
    three consecutive identical characters.

    Args:
        s: Input string to process

    Returns:
        Fancy version of the input string
    """
    # If the string has less than 3 characters, it's already fancy
    if len(s) < 3:
        return s

    # Initialize result with the first character
    result = [s[0]]
    # Count of consecutive identical characters (we have 1 so far)
    count = 1

    # Iterate through the rest of the string starting from index 1
    for i in range(1, len(s)):
        # Check if current character matches the last character in result
        if s[i] == result[-1]:
            # If we already have 2 consecutive, skip this character
            if count == 2:
                continue
            # Otherwise, increment count and add the character
            count += 1
            result.append(s[i])
        else:
            # Different character found, reset count to 1
            count = 1
            result.append(s[i])

    # Convert list back to string
    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n) where n is the length of the input string
/**
 * Builds a fancy string by removing characters that would create
 * three consecutive identical characters.
 *
 * @param {string} s - Input string to process
 * @return {string} Fancy version of the input string
 */
function makeFancyString(s) {
  // If the string has less than 3 characters, it's already fancy
  if (s.length < 3) {
    return s;
  }

  // Initialize result with the first character
  const result = [s[0]];
  // Count of consecutive identical characters (we have 1 so far)
  let count = 1;

  // Iterate through the rest of the string starting from index 1
  for (let i = 1; i < s.length; i++) {
    // Check if current character matches the last character in result
    if (s[i] === result[result.length - 1]) {
      // If we already have 2 consecutive, skip this character
      if (count === 2) {
        continue;
      }
      // Otherwise, increment count and add the character
      count++;
      result.push(s[i]);
    } else {
      // Different character found, reset count to 1
      count = 1;
      result.push(s[i]);
    }
  }

  // Convert array back to string
  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n) where n is the length of the input string
class Solution {
    /**
     * Builds a fancy string by removing characters that would create
     * three consecutive identical characters.
     *
     * @param s Input string to process
     * @return Fancy version of the input string
     */
    public String makeFancyString(String s) {
        // If the string has less than 3 characters, it's already fancy
        if (s.length() < 3) {
            return s;
        }

        // Use StringBuilder for efficient string building
        StringBuilder result = new StringBuilder();
        // Add first character
        result.append(s.charAt(0));
        // Count of consecutive identical characters (we have 1 so far)
        int count = 1;

        // Iterate through the rest of the string starting from index 1
        for (int i = 1; i < s.length(); i++) {
            char currentChar = s.charAt(i);
            // Check if current character matches the last character in result
            if (currentChar == result.charAt(result.length() - 1)) {
                // If we already have 2 consecutive, skip this character
                if (count == 2) {
                    continue;
                }
                // Otherwise, increment count and add the character
                count++;
                result.append(currentChar);
            } else {
                // Different character found, reset count to 1
                count = 1;
                result.append(currentChar);
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string exactly once, performing O(1) operations for each character
- The join/toString operation at the end is also O(n) in total
- Overall linear time complexity

**Space Complexity:** O(n)

- We store the result in a list/array/StringBuilder which in the worst case could be the same size as the input (when no characters need removal)
- The auxiliary variables (count, loop index) use O(1) space
- Overall linear space complexity for the output

## Common Mistakes

1. **Forgetting to handle short strings:** When the input has less than 3 characters, we can return it immediately. Without this check, we might get index errors when trying to access `result[-1]` on an empty result.

2. **Incorrect count reset logic:** The count should reset to 1 (not 0) when we encounter a different character, because we're about to add that new character to our result.

3. **Using string concatenation instead of list/array:** In Python and JavaScript, string concatenation creates a new string each time (O(n) operation), making the overall algorithm O(n²). Always use list/array and join at the end.

4. **Checking against original string instead of result:** Some candidates compare `s[i]` with `s[i-1]` and `s[i-2]`, but this doesn't account for characters that were already skipped. We must compare against what's actually in our result.

## When You'll See This Pattern

This "consecutive element filtering" pattern appears in several string and array problems:

1. **Remove All Adjacent Duplicates In String (LeetCode 1047)** - Similar logic but removes ALL consecutive duplicates instead of limiting to 2.

2. **Candy Crush (LeetCode 723)** - A more complex version where you remove groups of 3 or more identical elements, and the board collapses after removals.

3. **String Compression (LeetCode 443)** - While not about removal, it uses similar consecutive character counting to compress strings.

The core technique is maintaining state (count of consecutive elements) while iterating through a sequence and making decisions based on that state.

## Key Takeaways

1. **When filtering based on local properties**, you often don't need to look back at the original data—just track what you've added to the result so far.

2. **Use the right data structures for building strings**: Lists/arrays in Python/JavaScript, StringBuilder in Java. Never use repeated string concatenation in loops.

3. **State tracking is key**: A simple counter (like `count` in this problem) can often replace complex lookback logic and make the solution cleaner and more efficient.

Related problems: [Find Maximum Removals From Source String](/problem/find-maximum-removals-from-source-string)
