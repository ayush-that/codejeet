---
title: "How to Solve Increasing Decreasing String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Increasing Decreasing String. Easy difficulty, 77.2% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-07-04"
category: "dsa-patterns"
tags: ["increasing-decreasing-string", "hash-table", "string", "counting", "easy"]
---

# How to Solve Increasing Decreasing String

This problem asks you to reorder a string using a specific algorithm: repeatedly pick the smallest available character, then the smallest character greater than the last picked one, and so on, alternating between increasing and decreasing sequences until all characters are used. What makes this interesting is that it's not a simple sort—you need to repeatedly scan through available characters in alternating directions, which requires careful tracking of character counts.

## Visual Walkthrough

Let's trace through the algorithm with a concrete example: `s = "aaaabbbbcccc"`.

**Step 1:** Start with an empty result string. All characters are available: a:4, b:4, c:4.

**First increasing pass (smallest to largest):**

- Pick smallest available: 'a' → result = "a", counts: a:3, b:4, c:4
- Pick smallest > 'a': 'b' → result = "ab", counts: a:3, b:3, c:4
- Pick smallest > 'b': 'c' → result = "abc", counts: a:3, b:3, c:3

**First decreasing pass (largest to smallest):**

- Pick largest available: 'c' → result = "abcc", counts: a:3, b:3, c:2
- Pick largest < 'c': 'b' → result = "abccb", counts: a:3, b:2, c:2
- Pick largest < 'b': 'a' → result = "abccba", counts: a:2, b:2, c:2

**Second increasing pass:**

- Pick smallest available: 'a' → result = "abccbaa", counts: a:1, b:2, c:2
- Pick smallest > 'a': 'b' → result = "abccbaab", counts: a:1, b:1, c:2
- Pick smallest > 'b': 'c' → result = "abccbaabc", counts: a:1, b:1, c:1

**Second decreasing pass:**

- Pick largest available: 'c' → result = "abccbaabcc", counts: a:1, b:1, c:0
- Pick largest < 'c': 'b' → result = "abccbaabccb", counts: a:1, b:0, c:0
- Pick largest < 'b': 'a' → result = "abccbaabccba", counts: a:0, b:0, c:0

All characters used! Final result: `"abccbaabccba"`.

The key insight: we need to repeatedly scan through all possible characters (a-z) in alternating directions, picking available ones as we go.

## Brute Force Approach

A naive approach would be to simulate the algorithm literally: repeatedly scan the string to find the next character to pick, remove it from the string, and continue. This would involve:

1. Start with the original string as a list of characters
2. For each step, scan through remaining characters to find the appropriate one
3. Remove that character and append it to result
4. Repeat until no characters remain

The problem with this approach is efficiency. Each character removal from a string/list is O(n), and we need to do this n times, resulting in O(n²) time complexity. For strings up to length 500 (as per constraints), this could be up to 250,000 operations—technically acceptable but inefficient. More importantly, it doesn't demonstrate good algorithmic thinking.

## Optimal Solution

The optimal solution uses character counting. Since we only have lowercase English letters (26 possibilities), we can:

1. Count frequency of each character
2. Repeatedly scan a-z then z-a, appending available characters and decrementing their counts
3. Stop when all counts reach zero

This approach is O(26 × n) which simplifies to O(n) since 26 is constant.

<div class="code-group">

```python
# Time: O(n) - We process each character exactly once
# Space: O(1) - Fixed-size array of 26 integers
def sortString(s: str) -> str:
    # Step 1: Count frequency of each character
    # We'll use an array of size 26 for 'a' to 'z'
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    result = []
    total_chars = len(s)

    # Step 2: Continue until we've used all characters
    while total_chars > 0:
        # Forward pass: smallest to largest
        for i in range(26):
            if freq[i] > 0:
                # Append the character and decrement count
                result.append(chr(i + ord('a')))
                freq[i] -= 1
                total_chars -= 1

        # Backward pass: largest to smallest
        for i in range(25, -1, -1):
            if freq[i] > 0:
                # Append the character and decrement count
                result.append(chr(i + ord('a')))
                freq[i] -= 1
                total_chars -= 1

    # Step 3: Convert list to string
    return ''.join(result)
```

```javascript
// Time: O(n) - We process each character exactly once
// Space: O(1) - Fixed-size array of 26 integers
function sortString(s) {
  // Step 1: Count frequency of each character
  const freq = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++; // 'a' has code 97
  }

  const result = [];
  let totalChars = s.length;

  // Step 2: Continue until we've used all characters
  while (totalChars > 0) {
    // Forward pass: smallest to largest
    for (let i = 0; i < 26; i++) {
      if (freq[i] > 0) {
        // Append the character and decrement count
        result.push(String.fromCharCode(i + 97));
        freq[i]--;
        totalChars--;
      }
    }

    // Backward pass: largest to smallest
    for (let i = 25; i >= 0; i--) {
      if (freq[i] > 0) {
        // Append the character and decrement count
        result.push(String.fromCharCode(i + 97));
        freq[i]--;
        totalChars--;
      }
    }
  }

  // Step 3: Convert array to string
  return result.join("");
}
```

```java
// Time: O(n) - We process each character exactly once
// Space: O(1) - Fixed-size array of 26 integers
public String sortString(String s) {
    // Step 1: Count frequency of each character
    int[] freq = new int[26];
    for (char ch : s.toCharArray()) {
        freq[ch - 'a']++;
    }

    StringBuilder result = new StringBuilder();
    int totalChars = s.length();

    // Step 2: Continue until we've used all characters
    while (totalChars > 0) {
        // Forward pass: smallest to largest
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                // Append the character and decrement count
                result.append((char) (i + 'a'));
                freq[i]--;
                totalChars--;
            }
        }

        // Backward pass: largest to smallest
        for (int i = 25; i >= 0; i--) {
            if (freq[i] > 0) {
                // Append the character and decrement count
                result.append((char) (i + 'a'));
                freq[i]--;
                totalChars--;
            }
        }
    }

    // Step 3: Return the built string
    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting characters: O(n) to iterate through the string once
- Building result: We process each character exactly once when appending it
- The while loop runs until all characters are used, and each iteration processes at least one character
- The inner loops iterate 26 times each, which is constant O(1)

**Space Complexity: O(1)**

- Frequency array: Fixed size of 26 integers, regardless of input size
- Result string: O(n) for the output, but this is not counted as extra space in most interview contexts (it's the required output)
- If we count the output, it's O(n); otherwise, it's O(1) extra space

## Common Mistakes

1. **Forgetting to alternate directions properly**: Some candidates only do the increasing pass and forget that after reaching 'z', they need to go from 'z' back to 'a'. Remember the algorithm alternates between increasing and decreasing sequences.

2. **Incorrect character indexing**: When converting between characters and array indices, off-by-one errors are common. Remember: `'a' - 'a' = 0`, `'b' - 'a' = 1`, etc. Test with edge cases like "a" and "z".

3. **Not handling multiple occurrences of the same character**: The frequency counting approach naturally handles this, but candidates who try to modify the original string might struggle. Always think about how to handle duplicates efficiently.

4. **Inefficient scanning**: Some candidates scan the entire frequency array looking for the next character on each step. While this still gives O(26 × n) complexity, it's cleaner to scan the entire range each pass as shown in the solution.

## When You'll See This Pattern

This problem uses **frequency counting with directional scanning**, a pattern useful for:

1. **Custom sorting problems**: Where the sorting criteria isn't simple ascending/descending but follows a specific pattern. Similar to "Sort Characters By Frequency" (LeetCode 451) but with alternating directions.

2. **String reconstruction problems**: Where you need to build a string following specific rules, like "Reorganize String" (LeetCode 767) or "Rearrange String k Distance Apart" (LeetCode 358).

3. **Problems with limited character sets**: Whenever you're told the input consists of lowercase English letters (26 possibilities), think about using a fixed-size frequency array instead of a hash map for better performance and simpler code.

## Key Takeaways

1. **When dealing with a limited alphabet (like a-z), frequency arrays beat hash maps** for simplicity and performance. The 26-element array is a powerful tool for string manipulation problems.

2. **Alternating scans can be implemented as simple for-loops** in opposite directions. Don't overcomplicate the logic—sometimes the straightforward implementation is both correct and efficient.

3. **The while loop condition should check if any characters remain**, not if we've completed a certain number of passes. This handles cases where the last pass might be incomplete.

[Practice this problem on CodeJeet](/problem/increasing-decreasing-string)
