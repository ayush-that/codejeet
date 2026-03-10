---
title: "How to Solve Keyboard Row — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Keyboard Row. Easy difficulty, 73.6% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-11-26"
category: "dsa-patterns"
tags: ["keyboard-row", "array", "hash-table", "string", "easy"]
---

# How to Solve Keyboard Row

You're given an array of words and need to return only those words that can be typed using letters from a single row of the American keyboard. The challenge is that letters can be uppercase or lowercase, but both represent the same physical key. While this seems straightforward, the trick lies in efficiently checking each word's letters against the three keyboard rows without getting bogged down in case conversions and row lookups.

## Visual Walkthrough

Let's trace through a small example: `words = ["Hello", "Alaska", "Dad", "Peace"]`

We know the keyboard rows are:

- Row 1: "qwertyuiop"
- Row 2: "asdfghjkl"
- Row 3: "zxcvbnm"

For each word, we need to check if all its letters come from the same row:

1. **"Hello"**:
   - Lowercase: "hello"
   - First letter 'h' is in row 2
   - Second letter 'e' is in row 1
   - Already we have letters from different rows, so "Hello" fails

2. **"Alaska"**:
   - Lowercase: "alaska"
   - First letter 'a' is in row 2
   - Check remaining letters: 'l', 'a', 's', 'k', 'a' are all in row 2
   - All letters from same row, so "Alaska" passes

3. **"Dad"**:
   - Lowercase: "dad"
   - First letter 'd' is in row 2
   - Second letter 'a' is in row 2
   - Third letter 'd' is in row 2
   - All letters from same row, so "Dad" passes

4. **"Peace"**:
   - Lowercase: "peace"
   - First letter 'p' is in row 1
   - Second letter 'e' is in row 1
   - Third letter 'a' is in row 2
   - Already we have letters from different rows, so "Peace" fails

Final result: `["Alaska", "Dad"]`

## Brute Force Approach

A naive approach would be to check each word letter by letter against all three rows. For each word, for each letter, we could:

1. Convert the letter to lowercase
2. Check if it exists in row 1
3. If not, check row 2
4. If not, check row 3
5. Track which row the first letter belongs to
6. For subsequent letters, if they don't belong to the same row as the first letter, reject the word

While this works, it's inefficient because we're doing multiple string searches (`in` operations) for each letter. Each `in` operation on a string is O(n) where n is the length of the row string. For a word of length L, we're doing up to 3L string searches, each of which scans up to 10 characters.

The bigger issue is conceptual: we're not leveraging the fact that we can precompute which row each letter belongs to. This leads to repeated work that we can avoid with a smarter approach.

## Optimal Solution

The key insight is that we can create a mapping from each letter to its row number. Once we have this mapping, checking if a word belongs to a single row becomes trivial: get the row number of the first letter, then verify all other letters have the same row number.

We'll use a dictionary/hash map where keys are lowercase letters and values are their row numbers (1, 2, or 3). This gives us O(1) lookup time for each letter.

<div class="code-group">

```python
# Time: O(n * L) where n = number of words, L = average word length
# Space: O(1) for the row mapping (fixed 26 letters) + O(k) for result
def findWords(words):
    # Create mapping of each letter to its keyboard row
    # Row 1: qwertyuiop
    # Row 2: asdfghjkl
    # Row 3: zxcvbnm
    row_map = {}

    # Map row 1 letters
    for char in "qwertyuiop":
        row_map[char] = 1

    # Map row 2 letters
    for char in "asdfghjkl":
        row_map[char] = 2

    # Map row 3 letters
    for char in "zxcvbnm":
        row_map[char] = 3

    result = []

    # Check each word
    for word in words:
        # Skip empty words (edge case)
        if not word:
            continue

        # Convert first character to lowercase and get its row
        first_char = word[0].lower()
        target_row = row_map[first_char]

        # Flag to track if all letters are in the same row
        valid = True

        # Check remaining characters
        for i in range(1, len(word)):
            current_char = word[i].lower()
            # If any character is not in the target row, mark as invalid
            if row_map[current_char] != target_row:
                valid = False
                break

        # If all characters were in the same row, add to result
        if valid:
            result.append(word)

    return result
```

```javascript
// Time: O(n * L) where n = number of words, L = average word length
// Space: O(1) for the row mapping (fixed 26 letters) + O(k) for result
function findWords(words) {
  // Create mapping of each letter to its keyboard row
  // Row 1: qwertyuiop
  // Row 2: asdfghjkl
  // Row 3: zxcvbnm
  const rowMap = {};

  // Map row 1 letters
  "qwertyuiop".split("").forEach((char) => {
    rowMap[char] = 1;
  });

  // Map row 2 letters
  "asdfghjkl".split("").forEach((char) => {
    rowMap[char] = 2;
  });

  // Map row 3 letters
  "zxcvbnm".split("").forEach((char) => {
    rowMap[char] = 3;
  });

  const result = [];

  // Check each word
  for (const word of words) {
    // Skip empty words (edge case)
    if (!word) continue;

    // Convert first character to lowercase and get its row
    const firstChar = word[0].toLowerCase();
    const targetRow = rowMap[firstChar];

    // Flag to track if all letters are in the same row
    let valid = true;

    // Check remaining characters
    for (let i = 1; i < word.length; i++) {
      const currentChar = word[i].toLowerCase();
      // If any character is not in the target row, mark as invalid
      if (rowMap[currentChar] !== targetRow) {
        valid = false;
        break;
      }
    }

    // If all characters were in the same row, add to result
    if (valid) {
      result.push(word);
    }
  }

  return result;
}
```

```java
// Time: O(n * L) where n = number of words, L = average word length
// Space: O(1) for the row mapping (fixed 26 letters) + O(k) for result
import java.util.*;

public class Solution {
    public String[] findWords(String[] words) {
        // Create mapping of each letter to its keyboard row
        // Row 1: qwertyuiop
        // Row 2: asdfghjkl
        // Row 3: zxcvbnm
        Map<Character, Integer> rowMap = new HashMap<>();

        // Map row 1 letters
        String row1 = "qwertyuiop";
        for (char c : row1.toCharArray()) {
            rowMap.put(c, 1);
        }

        // Map row 2 letters
        String row2 = "asdfghjkl";
        for (char c : row2.toCharArray()) {
            rowMap.put(c, 2);
        }

        // Map row 3 letters
        String row3 = "zxcvbnm";
        for (char c : row3.toCharArray()) {
            rowMap.put(c, 3);
        }

        List<String> resultList = new ArrayList<>();

        // Check each word
        for (String word : words) {
            // Skip empty words (edge case)
            if (word.isEmpty()) continue;

            // Convert first character to lowercase and get its row
            char firstChar = Character.toLowerCase(word.charAt(0));
            int targetRow = rowMap.get(firstChar);

            // Flag to track if all letters are in the same row
            boolean valid = true;

            // Check remaining characters
            for (int i = 1; i < word.length(); i++) {
                char currentChar = Character.toLowerCase(word.charAt(i));
                // If any character is not in the target row, mark as invalid
                if (rowMap.get(currentChar) != targetRow) {
                    valid = false;
                    break;
                }
            }

            // If all characters were in the same row, add to result
            if (valid) {
                resultList.add(word);
            }
        }

        // Convert List to array for return
        return resultList.toArray(new String[0]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × L)**

- `n` is the number of words in the input array
- `L` is the average length of the words
- We process each character of each word exactly once
- The row map lookup is O(1) for each character
- Building the row map is O(1) since it always contains exactly 26 letters

**Space Complexity: O(1) for the mapping + O(k) for the result**

- The row map uses constant space (26 entries)
- The result array uses O(k) space where k is the number of valid words
- In the worst case where all words are valid, k = n, so O(n) space
- Some implementations might use O(L) space for lowercase conversions, but we can avoid this by processing characters directly

## Common Mistakes

1. **Forgetting case-insensitivity**: The most common mistake is not converting letters to lowercase before checking the row map. Remember that 'A' and 'a' are on the same physical key, so they should be treated as the same letter.

2. **Not handling empty strings**: If an empty string appears in the input, trying to access `word[0]` will cause an index error. Always check for empty strings at the beginning of your word processing loop.

3. **Inefficient row checking**: Some candidates check each letter against all three rows using string `contains()` or `indexOf()` methods. This is O(L × R × M) where R is number of rows and M is row length, which is much slower than the O(L) approach with a precomputed map.

4. **Early termination logic error**: When you find a letter that doesn't match the target row, make sure to use `break` to exit the inner loop immediately. Continuing to check the rest of the word wastes time and could cause logic errors if you're not careful with your flag variables.

## When You'll See This Pattern

The core pattern here is **precomputation for fast lookup**. By building a dictionary/map of letter-to-row mappings once, we avoid repeated searches. This pattern appears whenever:

1. **Grouping or categorization problems**: Like "Group Anagrams" (LeetCode 49) where you precompute a signature for each word to group them efficiently.

2. **Character mapping problems**: Like "Isomorphic Strings" (LeetCode 205) where you build bidirectional character mappings to check if two strings have the same structure.

3. **Set membership checking**: Any problem where you need to repeatedly check if elements belong to certain categories, like "Jewels and Stones" (LeetCode 771) where you use a hash set for O(1) jewel lookups.

## Key Takeaways

1. **Precomputation beats repeated computation**: When you need to check properties of elements repeatedly, build a lookup structure once. The upfront cost is amortized over many lookups.

2. **Normalize your data early**: Convert to a standard case (lowercase) at the beginning of processing to simplify comparisons and avoid case-related bugs.

3. **Think about the data structure**: For character/letter problems, remember that there are only 26 letters in the English alphabet, so any mapping will be O(1) space. This often makes hash maps or even simple arrays viable solutions.

Related problems: [Find the Sequence of Strings Appeared on the Screen](/problem/find-the-sequence-of-strings-appeared-on-the-screen), [Find the Original Typed String I](/problem/find-the-original-typed-string-i), [Find the Original Typed String II](/problem/find-the-original-typed-string-ii)
