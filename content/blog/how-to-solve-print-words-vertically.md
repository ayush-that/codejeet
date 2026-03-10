---
title: "How to Solve Print Words Vertically — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Print Words Vertically. Medium difficulty, 67.4% acceptance rate. Topics: Array, String, Simulation."
date: "2028-07-09"
category: "dsa-patterns"
tags: ["print-words-vertically", "array", "string", "simulation", "medium"]
---

# How to Solve Print Words Vertically

This problem asks us to take a string of words and arrange them vertically, as if reading them top-to-bottom in columns. The tricky part is handling spaces correctly: we need to insert spaces when a word is shorter than the column height, but we must remove trailing spaces from each result string. This requires careful simulation of the vertical arrangement process.

## Visual Walkthrough

Let's trace through an example: `s = "HOW ARE YOU"`

**Step 1: Split the words**

- Word 1: "HOW" (length 3)
- Word 2: "ARE" (length 3)
- Word 3: "YOU" (length 3)

**Step 2: Find maximum word length**
All words have length 3, so our vertical arrangement will have 3 rows.

**Step 3: Build vertical strings row by row**

- Row 1: Take 1st character from each word → "H" + "A" + "Y" = "HAY"
- Row 2: Take 2nd character from each word → "O" + "R" + "O" = "ORO"
- Row 3: Take 3rd character from each word → "W" + "E" + "U" = "WEU"

Result: `["HAY", "ORO", "WEU"]`

Now let's try a more complex example: `s = "TO BE OR NOT TO BE"`

**Step 1: Split the words**

- Word 1: "TO" (length 2)
- Word 2: "BE" (length 2)
- Word 3: "OR" (length 2)
- Word 4: "NOT" (length 3)
- Word 5: "TO" (length 2)
- Word 6: "BE" (length 2)

**Step 2: Find maximum word length**
Maximum length is 3 (from "NOT"), so we need 3 rows.

**Step 3: Build vertical strings row by row**

- Row 1: "T" + "B" + "O" + "N" + "T" + "B" = "TBONTB"
- Row 2: "O" + "E" + "R" + "O" + "O" + "E" = "OEROOE"
- Row 3: "" + "" + "" + "T" + "" + "" = "T" (but we need spaces for shorter words!)

**Step 4: Handle spaces for shorter words**
For Row 3:

- Word 1: "TO" has no 3rd character → add space
- Word 2: "BE" has no 3rd character → add space
- Word 3: "OR" has no 3rd character → add space
- Word 4: "NOT" has "T" as 3rd character → add "T"
- Word 5: "TO" has no 3rd character → add space
- Word 6: "BE" has no 3rd character → add space

So Row 3 becomes: " T " (but trailing spaces must be removed!)

**Step 5: Remove trailing spaces**
" T " with trailing spaces removed becomes " T"

Final result: `["TBONTB", "OEROOE", "   T"]`

## Brute Force Approach

A naive approach might try to build a 2D grid of characters:

1. Split the string into words
2. Create a 2D array with `max_word_length` rows and `num_words` columns
3. Fill the grid with characters from words (or spaces where words are shorter)
4. Convert each row to a string and remove trailing spaces

While this approach would work, it's more complex than necessary. We don't actually need to store the entire grid in memory. We can build each row directly by iterating through the words and taking characters at the current row index (or adding spaces when the word is too short).

The brute force approach would have the same time complexity as the optimal solution (O(N \* M) where N is number of words and M is max word length), but it would use more space by storing the entire grid. The optimal solution builds rows on the fly without storing intermediate grid data.

## Optimized Approach

The key insight is that we can process the output row by row without constructing a full 2D grid:

1. **Split the input string** into individual words
2. **Find the maximum word length** - this tells us how many rows we need in our vertical arrangement
3. **For each row index** from 0 to max_length-1:
   - Build a string by taking the character at the current index from each word
   - If a word is shorter than the current index, add a space instead
4. **Remove trailing spaces** from each row string before adding it to the result

The space optimization comes from not storing the entire grid. We only build one row at a time, process it, and add it to the result list.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N * M) where N = number of words, M = max word length
# Space: O(N * M) for the output list
def printVertically(s: str):
    # Step 1: Split the input string into individual words
    words = s.split()

    # Step 2: Find the maximum length among all words
    # This determines how many rows we'll have in the vertical arrangement
    max_len = 0
    for word in words:
        max_len = max(max_len, len(word))

    # Step 3: Initialize result list to store vertical strings
    result = []

    # Step 4: For each row (character position) in the vertical arrangement
    for i in range(max_len):
        vertical_word = []

        # Step 5: For each original word, get the character at position i
        # If the word is shorter than i, add a space instead
        for word in words:
            if i < len(word):
                vertical_word.append(word[i])
            else:
                vertical_word.append(' ')

        # Step 6: Convert list of characters to string
        # Remove trailing spaces as required by the problem
        vertical_str = ''.join(vertical_word).rstrip()

        # Step 7: Add to result list
        result.append(vertical_str)

    return result
```

```javascript
// Time: O(N * M) where N = number of words, M = max word length
// Space: O(N * M) for the output array
function printVertically(s) {
  // Step 1: Split the input string into individual words
  const words = s.split(" ");

  // Step 2: Find the maximum length among all words
  // This determines how many rows we'll have in the vertical arrangement
  let maxLen = 0;
  for (const word of words) {
    maxLen = Math.max(maxLen, word.length);
  }

  // Step 3: Initialize result array to store vertical strings
  const result = [];

  // Step 4: For each row (character position) in the vertical arrangement
  for (let i = 0; i < maxLen; i++) {
    let verticalWord = "";

    // Step 5: For each original word, get the character at position i
    // If the word is shorter than i, add a space instead
    for (const word of words) {
      if (i < word.length) {
        verticalWord += word[i];
      } else {
        verticalWord += " ";
      }
    }

    // Step 6: Remove trailing spaces as required by the problem
    // Using regex to match one or more spaces at the end of the string
    verticalWord = verticalWord.replace(/\s+$/, "");

    // Step 7: Add to result array
    result.push(verticalWord);
  }

  return result;
}
```

```java
// Time: O(N * M) where N = number of words, M = max word length
// Space: O(N * M) for the output list
import java.util.*;

class Solution {
    public List<String> printVertically(String s) {
        // Step 1: Split the input string into individual words
        String[] words = s.split(" ");

        // Step 2: Find the maximum length among all words
        // This determines how many rows we'll have in the vertical arrangement
        int maxLen = 0;
        for (String word : words) {
            maxLen = Math.max(maxLen, word.length());
        }

        // Step 3: Initialize result list to store vertical strings
        List<String> result = new ArrayList<>();

        // Step 4: For each row (character position) in the vertical arrangement
        for (int i = 0; i < maxLen; i++) {
            StringBuilder verticalWord = new StringBuilder();

            // Step 5: For each original word, get the character at position i
            // If the word is shorter than i, add a space instead
            for (String word : words) {
                if (i < word.length()) {
                    verticalWord.append(word.charAt(i));
                } else {
                    verticalWord.append(' ');
                }
            }

            // Step 6: Remove trailing spaces as required by the problem
            // We need to find the last non-space character
            int endIndex = verticalWord.length() - 1;
            while (endIndex >= 0 && verticalWord.charAt(endIndex) == ' ') {
                endIndex--;
            }

            // Step 7: Take substring up to the last non-space character
            // and add to result list (add 1 to endIndex because substring is exclusive)
            result.add(verticalWord.substring(0, endIndex + 1));
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × M)**

- `N` is the number of words in the input string
- `M` is the length of the longest word
- We iterate through each word for each character position (row), resulting in N × M operations
- The trailing space removal adds O(N) per row, but this is dominated by O(N × M)

**Space Complexity: O(N × M)**

- The output itself requires O(N × M) space to store all characters
- We use O(N) additional space for the words array and O(M) for building each row string
- The dominant factor is the output list which contains all characters rearranged vertically

## Common Mistakes

1. **Forgetting to handle trailing spaces**: The problem explicitly states "trailing spaces are not allowed." Many candidates build the vertical strings correctly but forget to strip trailing spaces at the end. Always check the requirements carefully.

2. **Incorrect space insertion logic**: When a word is shorter than the current row index, we need to add a space. Some candidates add spaces at the beginning or in the wrong positions. Remember: spaces should only appear when a word doesn't have a character at the current position.

3. **Off-by-one errors with indices**: When iterating from 0 to max_len-1, it's easy to use `<=` instead of `<` or vice versa. Test with words of different lengths to ensure you're accessing valid indices.

4. **Not handling empty input**: While the problem doesn't specify empty input, it's good practice to handle it. An empty string should return an empty list, not cause an error.

## When You'll See This Pattern

This problem uses a **simulation** pattern where you need to transform data from one format to another according to specific rules. Similar problems include:

1. **Zigzag Conversion (LeetCode 6)**: Like this problem, it involves rearranging characters in a specific pattern (zigzag) and reading them row by row. Both require careful index manipulation and handling of edge cases.

2. **Spiral Matrix (LeetCode 54)**: This also involves traversing a 2D structure in a non-linear way, requiring careful boundary checking and direction changes.

3. **Diagonal Traverse (LeetCode 498)**: Another matrix traversal problem where you need to read elements in a specific diagonal pattern, similar to how we read characters vertically here.

The common thread is transforming or traversing data in a non-standard way, which requires simulating the process step by step with careful attention to boundaries and special cases.

## Key Takeaways

1. **Simulation problems require step-by-step thinking**: Break down the transformation process into clear steps. For this problem: split words → find max length → build each row → clean up spaces.

2. **Pay attention to edge cases and requirements**: The "no trailing spaces" requirement is easy to miss but crucial. Always re-read the problem statement after writing your solution to ensure you've addressed all requirements.

3. **Optimize space by building output incrementally**: Instead of creating a full 2D grid, we built each row on the fly. This is a common optimization in problems where you don't need random access to all elements simultaneously.

[Practice this problem on CodeJeet](/problem/print-words-vertically)
