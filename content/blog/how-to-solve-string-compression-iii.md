---
title: "How to Solve String Compression III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode String Compression III. Medium difficulty, 67.0% acceptance rate. Topics: String."
date: "2028-10-04"
category: "dsa-patterns"
tags: ["string-compression-iii", "string", "medium"]
---

# How to Solve String Compression III

String Compression III asks us to compress a string by repeatedly removing the longest possible prefix of repeating characters (up to 9 at a time) and appending the character and count to our result. The tricky part is that we can't just compress the entire string at once — we must process it in chunks of up to 9 repeating characters, which requires careful iteration and counting.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `word = "aaabbaaac"`:

1. **First chunk**: The longest prefix of repeating characters is "aaa" (3 'a's, which is ≤ 9). We remove "aaa" from `word` and append "a3" to `comp`.
   - `word` becomes "bbaaac"
   - `comp` becomes "a3"

2. **Second chunk**: The longest prefix is "bb" (2 'b's). We remove "bb" and append "b2".
   - `word` becomes "aaac"
   - `comp` becomes "a3b2"

3. **Third chunk**: The longest prefix is "aaa" (3 'a's). We remove "aaa" and append "a3".
   - `word` becomes "c"
   - `comp` becomes "a3b2a3"

4. **Fourth chunk**: The longest prefix is "c" (1 'c'). We remove "c" and append "c1".
   - `word` becomes ""
   - `comp` becomes "a3b2a3c1"

The final compressed string is "a3b2a3c1". Notice that even though there were 4 total 'a's in the original string, they were separated by 'b's, so we couldn't compress all 'a's together. Also note we always append the count even when it's 1.

## Brute Force Approach

A naive approach might try to compress the entire string at once by counting all consecutive characters, but that would violate the "at most 9 times" rule. Another brute force method would be to repeatedly:

1. Take the first character of `word`
2. Count how many times it repeats consecutively (up to 9)
3. Remove that many characters from the front
4. Append to result

While this approach is actually correct for this problem, we need to think about implementation efficiency. The truly brute approach would be to actually modify the string by removing prefixes, which in most languages creates a new string copy each time (O(n) per operation, leading to O(n²) total).

However, the problem constraints (word length ≤ 250) make even this approach acceptable, but we should still aim for the optimal O(n) single-pass solution.

## Optimized Approach

The key insight is that we don't need to actually modify the original string. We can traverse it once with two pointers or a simple counter:

1. Use an index `i` to traverse the string
2. For each new character, count how many times it repeats (up to 9)
3. Append the character and count to our result
4. Advance `i` by the count

The challenge is handling the "at most 9" rule correctly. When we encounter a run of repeating characters longer than 9, we need to split it into multiple chunks of size 9 (or less for the final chunk).

For example, with 12 consecutive 'a's: "aaaaaaaaaaaa", we would output:

- First 9: "a9"
- Remaining 3: "a3"

## Optimal Solution

Here's the optimal single-pass solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of word
# Space: O(n) for the output string
def compressedString(word: str) -> str:
    # Initialize result list (using list for efficient appends)
    comp = []
    n = len(word)
    i = 0

    while i < n:
        # Get the current character
        current_char = word[i]
        count = 0

        # Count consecutive occurrences of current_char, up to 9
        # We need to check i + count < n to avoid index out of bounds
        while i + count < n and word[i + count] == current_char and count < 9:
            count += 1

        # Append the character and count to result
        comp.append(current_char)
        comp.append(str(count))

        # Move i forward by the count we processed
        i += count

    # Join the list into a string
    return ''.join(comp)
```

```javascript
// Time: O(n) where n is the length of word
// Space: O(n) for the output string
function compressedString(word) {
  // Initialize result string
  let comp = "";
  const n = word.length;
  let i = 0;

  while (i < n) {
    // Get the current character
    const currentChar = word[i];
    let count = 0;

    // Count consecutive occurrences of currentChar, up to 9
    // We need to check i + count < n to avoid index out of bounds
    while (i + count < n && word[i + count] === currentChar && count < 9) {
      count++;
    }

    // Append the character and count to result
    comp += currentChar + count.toString();

    // Move i forward by the count we processed
    i += count;
  }

  return comp;
}
```

```java
// Time: O(n) where n is the length of word
// Space: O(n) for the output string
public String compressedString(String word) {
    // Use StringBuilder for efficient string concatenation
    StringBuilder comp = new StringBuilder();
    int n = word.length();
    int i = 0;

    while (i < n) {
        // Get the current character
        char currentChar = word.charAt(i);
        int count = 0;

        // Count consecutive occurrences of currentChar, up to 9
        // We need to check i + count < n to avoid index out of bounds
        while (i + count < n && word.charAt(i + count) == currentChar && count < 9) {
            count++;
        }

        // Append the character and count to result
        comp.append(currentChar);
        comp.append(count);

        // Move i forward by the count we processed
        i += count;
    }

    return comp.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. We traverse the string exactly once, and each character is examined exactly once (in the inner while loop condition). Even though we have nested loops, the inner loop doesn't cause O(n²) because the outer loop's `i` jumps forward by `count`, and the inner loop only examines characters that haven't been processed yet.

**Space Complexity: O(n)** for the output string. In the worst case (when every character is different from its neighbor), the compressed string will be twice as long as the input (character + "1" for each character), but that's still O(n). We use O(1) additional space for pointers and counters.

## Common Mistakes

1. **Forgetting the "at most 9" limit**: Some candidates count all consecutive characters without the `count < 9` check. For "aaaaaaaaaaaa" (12 'a's), this would incorrectly output "a12" instead of "a9a3".

2. **Off-by-one errors in the inner loop**: The condition `i + count < n` must come before accessing `word[i + count]` to avoid index out of bounds. Also, note that we increment `count` in the loop, so the check happens with the current value before incrementing.

3. **Inefficient string concatenation**: In Python, using `+=` on strings in a loop creates a new string each time (O(n²) total). We should use a list and `join()`. In Java, we should use `StringBuilder` instead of `String` concatenation.

4. **Not handling single-character runs correctly**: Remember to always append the count, even when it's 1. "ab" should become "a1b1", not "ab".

## When You'll See This Pattern

This problem uses the **two-pointer/sliding window** pattern for counting consecutive elements, which appears in many string and array problems:

1. **String Compression (LeetCode 443)**: Very similar but compresses in-place in a character array and uses actual digit characters for counts ≥ 10.

2. **Count and Say (LeetCode 38)**: Generates sequences by describing consecutive digits, using the same consecutive counting technique.

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses a similar sliding window approach to track character occurrences.

The core pattern is: when you need to process consecutive identical elements, use a while loop that advances while the condition holds, counting as you go.

## Key Takeaways

1. **Consecutive element counting**: When a problem asks you to process runs of identical elements, use a while loop with a counter that advances while the current element matches some criterion.

2. **Efficient string building**: Always use the language's efficient string builder (list + join in Python, StringBuilder in Java, array + join in JavaScript) when building strings in loops.

3. **Constraint-aware processing**: Pay close attention to constraints like "at most 9" — they're not arbitrary but crucial to the algorithm. Always test edge cases that hit these limits.

Related problems: [String Compression](/problem/string-compression), [String Compression II](/problem/string-compression-ii)
