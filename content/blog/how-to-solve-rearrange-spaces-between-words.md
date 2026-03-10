---
title: "How to Solve Rearrange Spaces Between Words — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rearrange Spaces Between Words. Easy difficulty, 44.1% acceptance rate. Topics: String."
date: "2028-01-15"
category: "dsa-patterns"
tags: ["rearrange-spaces-between-words", "string", "easy"]
---

# How to Solve Rearrange Spaces Between Words

This problem asks us to redistribute spaces in a string so they're evenly distributed between words, with any extra spaces placed at the end. While conceptually simple, it requires careful string parsing and counting to handle edge cases correctly. The challenge lies in accurately counting spaces and words, then distributing spaces evenly without losing track of the original text structure.

## Visual Walkthrough

Let's trace through an example: `text = "  hello   world  "`

**Step 1: Count total spaces**

- Scan the string: positions 0-1 (2 spaces), positions 6-8 (3 spaces), positions 14-15 (2 spaces)
- Total spaces = 2 + 3 + 2 = 7 spaces

**Step 2: Extract words**

- Words are substrings between spaces: "hello" and "world"
- Number of words = 2

**Step 3: Calculate space distribution**

- If we have 2 words, there's 1 gap between them
- Spaces per gap = total spaces // (number of words - 1) = 7 // 1 = 7
- Extra spaces = total spaces % (number of words - 1) = 7 % 1 = 0
- Since extra spaces = 0, all 7 spaces go between the words

**Step 4: Build result**

- Start with "hello"
- Add 7 spaces
- Add "world"
- Result: "hello world"

Let's try another example: `text = "practice makes perfect"`

**Step 1: Count total spaces**

- There are 2 single spaces between words
- Total spaces = 2

**Step 2: Extract words**

- Words: "practice", "makes", "perfect"
- Number of words = 3

**Step 3: Calculate space distribution**

- With 3 words, there are 2 gaps between them
- Spaces per gap = 2 // 2 = 1
- Extra spaces = 2 % 2 = 0

**Step 4: Build result**

- "practice" + 1 space + "makes" + 1 space + "perfect"
- Result: "practice makes perfect" (same as input)

## Brute Force Approach

A naive approach might try to manipulate the string character by character, tracking positions and moving spaces around. However, this quickly becomes complex with index management and edge cases. The brute force would involve:

1. Finding all word boundaries
2. Creating a list of words
3. Counting spaces
4. Trying to redistribute spaces by inserting/deleting characters in the original string

This approach is inefficient because:

- Direct string manipulation in many languages creates new strings (O(n) operations)
- Tracking indices while modifying the string is error-prone
- The logic for distributing spaces gets tangled with string modification

Instead, we'll use a cleaner approach that separates concerns: extract words, count spaces, then build a new string with proper spacing.

## Optimal Solution

The optimal solution follows these steps:

1. Count total spaces in the string
2. Extract all words (non-space sequences)
3. Calculate how many spaces go between each word
4. Calculate any extra spaces that go at the end
5. Build the result string by joining words with appropriate spaces

<div class="code-group">

```python
# Time: O(n) where n is length of text
# Space: O(n) for storing words and result
def reorderSpaces(text: str) -> str:
    # Step 1: Count total spaces in the string
    total_spaces = text.count(' ')

    # Step 2: Extract all words (split on any whitespace)
    # Using split() without arguments handles multiple spaces correctly
    words = text.split()
    num_words = len(words)

    # Edge case: only one word, all spaces go to the end
    if num_words == 1:
        return words[0] + ' ' * total_spaces

    # Step 3: Calculate spaces between words
    # There are (num_words - 1) gaps between words
    spaces_between = total_spaces // (num_words - 1)
    extra_spaces = total_spaces % (num_words - 1)

    # Step 4: Build the result
    # Create the string with spaces between words
    result = (' ' * spaces_between).join(words)

    # Add any extra spaces at the end
    result += ' ' * extra_spaces

    return result
```

```javascript
// Time: O(n) where n is length of text
// Space: O(n) for storing words and result
function reorderSpaces(text) {
  // Step 1: Count total spaces in the string
  let totalSpaces = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      totalSpaces++;
    }
  }

  // Step 2: Extract all words
  // trim() removes leading/trailing spaces, split(/\s+/) splits on any whitespace
  const words = text.trim().split(/\s+/);
  const numWords = words.length;

  // Edge case: only one word, all spaces go to the end
  if (numWords === 1) {
    return words[0] + " ".repeat(totalSpaces);
  }

  // Step 3: Calculate spaces between words
  // There are (numWords - 1) gaps between words
  const spacesBetween = Math.floor(totalSpaces / (numWords - 1));
  const extraSpaces = totalSpaces % (numWords - 1);

  // Step 4: Build the result
  // Join words with the calculated number of spaces
  const result = words.join(" ".repeat(spacesBetween));

  // Add any extra spaces at the end
  return result + " ".repeat(extraSpaces);
}
```

```java
// Time: O(n) where n is length of text
// Space: O(n) for storing words and result
public String reorderSpaces(String text) {
    // Step 1: Count total spaces in the string
    int totalSpaces = 0;
    for (int i = 0; i < text.length(); i++) {
        if (text.charAt(i) == ' ') {
            totalSpaces++;
        }
    }

    // Step 2: Extract all words
    // trim() removes leading/trailing spaces, split("\\s+") splits on any whitespace
    String[] words = text.trim().split("\\s+");
    int numWords = words.length;

    // Edge case: only one word, all spaces go to the end
    if (numWords == 1) {
        return words[0] + " ".repeat(totalSpaces);
    }

    // Step 3: Calculate spaces between words
    // There are (numWords - 1) gaps between words
    int spacesBetween = totalSpaces / (numWords - 1);
    int extraSpaces = totalSpaces % (numWords - 1);

    // Step 4: Build the result
    StringBuilder result = new StringBuilder();

    // Add first word
    result.append(words[0]);

    // Add remaining words with spaces between
    for (int i = 1; i < numWords; i++) {
        // Add spaces before each word (except first)
        result.append(" ".repeat(spacesBetween));
        result.append(words[i]);
    }

    // Add any extra spaces at the end
    result.append(" ".repeat(extraSpaces));

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting spaces: O(n) where n is the length of the input string
- Extracting words: O(n) to split the string
- Building the result: O(n) to create the final string
- All operations are linear with respect to input size

**Space Complexity: O(n)**

- Storing the list of words: O(n) in worst case (each character is a separate word)
- Building the result string: O(n) for the output
- Auxiliary space for intermediate calculations: O(1) or O(n) depending on implementation

## Common Mistakes

1. **Forgetting the single-word edge case**: When there's only one word, there are no gaps between words, so all spaces must go at the end. Without handling this, you'll get division by zero when calculating `spaces_between = total_spaces // (num_words - 1)`.

2. **Incorrect word extraction**: Using `split(' ')` instead of `split()` (in Python) or equivalent in other languages. `split(' ')` treats consecutive spaces as creating empty strings, while `split()` without arguments handles multiple spaces correctly.

3. **Miscalculating spaces distribution**: Confusing integer division with regular division, or forgetting to handle the remainder. Remember: `spaces_between = total_spaces // (num_words - 1)` and `extra_spaces = total_spaces % (num_words - 1)`.

4. **Adding extra spaces in wrong place**: The problem specifies extra spaces should go at the END of the string, not distributed somehow between words. Some candidates try to distribute extra spaces evenly or add them at the beginning.

## When You'll See This Pattern

This problem uses **string parsing and reconstruction** patterns common in many coding problems:

1. **Text Justification (LeetCode 68)**: A harder version where you need to justify text to fit exactly within a line width, dealing with more complex space distribution rules.

2. **Reverse Words in a String (LeetCode 151)**: Similar string parsing challenge where you need to extract words and rearrange them, though with different transformation rules.

3. **String Compression (LeetCode 443)**: Another problem requiring careful scanning of strings and building new strings based on counts of characters.

The core pattern is: scan to gather statistics (counts, positions), calculate transformations, then rebuild the string according to new rules.

## Key Takeaways

1. **Separate analysis from construction**: First gather all necessary information (word count, space count), then build the result. Don't try to do both simultaneously.

2. **Handle edge cases early**: The single-word case requires special handling. Identify such cases before doing calculations that might fail (like division by zero).

3. **Use language features wisely**: Know your language's string methods. Python's `split()` without arguments, JavaScript's `trim().split(/\s+/)`, and Java's `trim().split("\\s+")` all handle multiple spaces correctly.

Related problems: [Text Justification](/problem/text-justification)
