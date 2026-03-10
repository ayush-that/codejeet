---
title: "How to Solve Text Justification — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Text Justification. Hard difficulty, 50.5% acceptance rate. Topics: Array, String, Simulation."
date: "2027-02-20"
category: "dsa-patterns"
tags: ["text-justification", "array", "string", "simulation", "hard"]
---

# How to Solve Text Justification

Text Justification is a classic simulation problem that tests your ability to carefully implement complex string formatting rules. The challenge isn't algorithmic complexity but rather meticulous attention to detail—handling edge cases, calculating spaces correctly, and managing the greedy line packing approach. Many candidates understand the concept but stumble on the implementation details.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `words = ["This", "is", "an", "example", "of", "text", "justification."]`
- `maxWidth = 16`

**Line 1:** We start with "This" (4 chars). Add "is" (2 chars) plus a space = 4+2+1=7. Add "an" (2 chars) plus a space = 7+2+1=10. Add "example" (7 chars) plus a space would be 10+7+1=18 > 16, so we stop. We have 3 words: "This", "is", "an" with total characters = 4+2+2=8. We need 16 total, so 8 spaces to distribute. With 3 words, we have 2 gaps between them. Each gap gets 8/2=4 spaces. Result: "This is an"

**Line 2:** Start fresh with "example" (7). Add "of" (2) plus space = 7+2+1=10. Add "text" (4) plus space = 10+4+1=15. Add "justification." (13) plus space would be 15+13+1=29 > 16, so stop. We have 3 words: "example", "of", "text" with total characters = 7+2+4=13. Need 16 total, so 3 spaces to distribute across 2 gaps. 3/2=1 remainder 1, so first gap gets 2 spaces, second gets 1. Result: "example of text"

**Line 3:** Only "justification." remains (13 chars). Last line is left-justified with spaces at the end. Need 16 total, so add 3 spaces at the end. Result: "justification. "

This walkthrough reveals the key challenges: calculating spaces per gap, handling remainders, and special treatment for the last line.

## Brute Force Approach

A truly brute force approach might try all possible line breaks and evaluate each configuration, but that's exponential and unnecessary. The more realistic "naive" approach that candidates sometimes attempt is:

1. Process words one by one
2. For each line, keep adding words until you exceed maxWidth
3. Then try to justify by adding spaces between words
4. Repeat until all words are processed

The tricky part isn't the algorithm choice (greedy is specified) but the implementation details. The "brute force" thinking error would be to:

- Try to pre-calculate all line breaks first (overcomplicating)
- Use trial-and-error for space distribution instead of mathematical calculation
- Handle each edge case with special if-statements rather than a systematic approach

The real challenge is that while the greedy approach is straightforward conceptually, the implementation requires careful arithmetic for space distribution and handling of multiple edge cases.

## Optimized Approach

The optimal approach follows the problem's specification directly using a greedy algorithm:

1. **Greedy Line Packing**: Start with the first word, then keep adding words while the total length (sum of word lengths + minimum spaces between them) ≤ maxWidth.

2. **Space Calculation**: For each line (except the last):
   - Calculate total spaces needed: `maxWidth - sum_of_word_lengths`
   - If there's only one word, all spaces go to the right
   - If multiple words, distribute spaces evenly between words:
     - Base spaces per gap: `total_spaces // (word_count - 1)`
     - Extra spaces: `total_spaces % (word_count - 1)`
     - Distribute extra spaces left-to-right (first gaps get one extra)

3. **Last Line Handling**: Left-justify with single spaces between words, then pad with spaces to reach maxWidth.

4. **Key Insight**: The greedy approach works because we're told to use it, and it's optimal for this formatting problem. The mathematical distribution of spaces ensures even spacing as much as possible.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n * maxWidth) where n is total characters | Space: O(n * maxWidth) for output
def fullJustify(words, maxWidth):
    """
    Format text with full justification using greedy line packing.

    Args:
        words: List of strings to format
        maxWidth: Maximum characters per line

    Returns:
        List of justified strings
    """
    result = []
    current_line = []  # Words in current line
    current_length = 0  # Total characters of words in current line (without spaces)

    for word in words:
        # Check if adding this word would exceed maxWidth
        # Minimum spaces needed: len(current_line) spaces between existing words
        # If we add new word, we need additional space before it
        if current_length + len(word) + len(current_line) > maxWidth:
            # Time to justify current line (not the last line)
            # Calculate total spaces to distribute
            total_spaces = maxWidth - current_length

            # Handle case with only one word (all spaces go to the right)
            if len(current_line) == 1:
                result.append(current_line[0] + ' ' * total_spaces)
            else:
                # Distribute spaces between words
                # Base spaces between each word
                space_between = total_spaces // (len(current_line) - 1)
                # Extra spaces to distribute from left to right
                extra_spaces = total_spaces % (len(current_line) - 1)

                # Build the justified line
                line = current_line[0]
                for i in range(1, len(current_line)):
                    # Add base spaces plus one extra if available
                    spaces_to_add = space_between + (1 if i <= extra_spaces else 0)
                    line += ' ' * spaces_to_add + current_line[i]

                result.append(line)

            # Reset for next line
            current_line = []
            current_length = 0

        # Add word to current line
        current_line.append(word)
        current_length += len(word)

    # Handle last line (left-justified)
    last_line = ' '.join(current_line)
    # Pad with spaces to reach maxWidth
    last_line += ' ' * (maxWidth - len(last_line))
    result.append(last_line)

    return result
```

```javascript
// Time: O(n * maxWidth) where n is total characters | Space: O(n * maxWidth) for output
function fullJustify(words, maxWidth) {
  const result = [];
  let currentLine = []; // Words in current line
  let currentLength = 0; // Total characters of words in current line (without spaces)

  for (const word of words) {
    // Check if adding this word would exceed maxWidth
    // Minimum spaces needed: currentLine.length spaces between existing words
    // If we add new word, we need additional space before it
    if (currentLength + word.length + currentLine.length > maxWidth) {
      // Time to justify current line (not the last line)
      // Calculate total spaces to distribute
      const totalSpaces = maxWidth - currentLength;

      // Handle case with only one word (all spaces go to the right)
      if (currentLine.length === 1) {
        result.push(currentLine[0] + " ".repeat(totalSpaces));
      } else {
        // Distribute spaces between words
        // Base spaces between each word
        const spaceBetween = Math.floor(totalSpaces / (currentLine.length - 1));
        // Extra spaces to distribute from left to right
        const extraSpaces = totalSpaces % (currentLine.length - 1);

        // Build the justified line
        let line = currentLine[0];
        for (let i = 1; i < currentLine.length; i++) {
          // Add base spaces plus one extra if available
          const spacesToAdd = spaceBetween + (i <= extraSpaces ? 1 : 0);
          line += " ".repeat(spacesToAdd) + currentLine[i];
        }

        result.push(line);
      }

      // Reset for next line
      currentLine = [];
      currentLength = 0;
    }

    // Add word to current line
    currentLine.push(word);
    currentLength += word.length;
  }

  // Handle last line (left-justified)
  let lastLine = currentLine.join(" ");
  // Pad with spaces to reach maxWidth
  lastLine += " ".repeat(maxWidth - lastLine.length);
  result.push(lastLine);

  return result;
}
```

```java
// Time: O(n * maxWidth) where n is total characters | Space: O(n * maxWidth) for output
import java.util.*;

class Solution {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> result = new ArrayList<>();
        List<String> currentLine = new ArrayList<>();  // Words in current line
        int currentLength = 0;  // Total characters of words in current line (without spaces)

        for (String word : words) {
            // Check if adding this word would exceed maxWidth
            // Minimum spaces needed: currentLine.size() spaces between existing words
            // If we add new word, we need additional space before it
            if (currentLength + word.length() + currentLine.size() > maxWidth) {
                // Time to justify current line (not the last line)
                // Calculate total spaces to distribute
                int totalSpaces = maxWidth - currentLength;

                // Handle case with only one word (all spaces go to the right)
                if (currentLine.size() == 1) {
                    StringBuilder line = new StringBuilder(currentLine.get(0));
                    for (int i = 0; i < totalSpaces; i++) {
                        line.append(' ');
                    }
                    result.add(line.toString());
                } else {
                    // Distribute spaces between words
                    // Base spaces between each word
                    int spaceBetween = totalSpaces / (currentLine.size() - 1);
                    // Extra spaces to distribute from left to right
                    int extraSpaces = totalSpaces % (currentLine.size() - 1);

                    // Build the justified line
                    StringBuilder line = new StringBuilder(currentLine.get(0));
                    for (int i = 1; i < currentLine.size(); i++) {
                        // Add base spaces
                        for (int j = 0; j < spaceBetween; j++) {
                            line.append(' ');
                        }
                        // Add one extra space if available
                        if (i <= extraSpaces) {
                            line.append(' ');
                        }
                        line.append(currentLine.get(i));
                    }

                    result.add(line.toString());
                }

                // Reset for next line
                currentLine.clear();
                currentLength = 0;
            }

            // Add word to current line
            currentLine.add(word);
            currentLength += word.length();
        }

        // Handle last line (left-justified)
        StringBuilder lastLine = new StringBuilder(String.join(" ", currentLine));
        // Pad with spaces to reach maxWidth
        while (lastLine.length() < maxWidth) {
            lastLine.append(' ');
        }
        result.add(lastLine.toString());

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* maxWidth) where n is the total number of characters across all words. We process each word once, and for each line, we build a string of length maxWidth. The space distribution calculation is O(1) per line.

**Space Complexity:** O(n \* maxWidth) for the output. We store each line as a string of length maxWidth, and there are roughly n/maxWidth lines. The auxiliary space for processing is O(maxWidth) for storing the current line's words.

The factor of maxWidth in the time complexity comes from building each output string, which requires creating a string of exactly maxWidth characters.

## Common Mistakes

1. **Incorrect space calculation for single-word lines**: Forgetting that a line with only one word should have all spaces on the right, not distributed (since there are no gaps between words).

2. **Off-by-one errors in space distribution**: When calculating `space_between = total_spaces // (word_count - 1)`, candidates sometimes divide by `word_count` instead of `word_count - 1`. Remember: with N words, there are N-1 gaps between them.

3. **Incorrect last line handling**: The last line must be left-justified with single spaces between words, then padded with spaces to reach maxWidth. Some candidates try to justify the last line like the others.

4. **Forgetting to reset line tracking variables**: After finishing a line, you must reset `current_line` and `current_length` for the next line. This is easy to forget in the complexity of space distribution logic.

## When You'll See This Pattern

This simulation/implementation pattern appears in problems requiring careful rule-following and edge case handling:

1. **Rearrange Spaces Between Words (Easy)**: Similar string manipulation with space distribution, but simpler since it's a single line.

2. **Split Message Based on Limit (Hard)**: Requires similar careful calculation of how to split content with constraints, though the rules are different.

3. **String Compression (Medium)**: While different in goal, it requires similar careful iteration and counting with specific formatting rules.

The core pattern is: iterate through input, accumulate until a constraint is violated, process the accumulated batch according to specific rules, then continue.

## Key Takeaways

1. **Greedy with careful arithmetic works**: When a problem specifies "greedy approach," trust it. The challenge is implementing the greedy accumulation and subsequent processing correctly.

2. **Separate accumulation from processing**: First determine what goes in a line (greedy packing), then handle the justification separately. This separation of concerns simplifies the logic.

3. **Mathematical distribution beats trial-and-error**: Calculate space distribution using division and modulus rather than trying to add spaces incrementally.

4. **Edge cases are the real test**: Single-word lines and the last line require special handling. Always test these cases explicitly.

Related problems: [Rearrange Spaces Between Words](/problem/rearrange-spaces-between-words), [Divide a String Into Groups of Size k](/problem/divide-a-string-into-groups-of-size-k), [Split Message Based on Limit](/problem/split-message-based-on-limit)
