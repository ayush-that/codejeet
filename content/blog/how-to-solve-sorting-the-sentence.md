---
title: "How to Solve Sorting the Sentence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sorting the Sentence. Easy difficulty, 84.1% acceptance rate. Topics: String, Sorting."
date: "2028-06-26"
category: "dsa-patterns"
tags: ["sorting-the-sentence", "string", "sorting", "easy"]
---

# How to Solve Sorting the Sentence

This problem asks us to reconstruct a sentence that has been shuffled. Each word originally had a number appended to it indicating its 1-indexed position in the sentence. After shuffling, we need to sort the words back into their original order by extracting these position numbers. What makes this interesting is that we need to parse each word to separate the text from its position marker, then use that position to reconstruct the sentence efficiently.

## Visual Walkthrough

Let's trace through an example step by step. Suppose we're given:

```
s = "is2 sentence4 This1 a3"
```

**Step 1: Split the sentence into words**
We split by spaces to get individual words:

```
["is2", "sentence4", "This1", "a3"]
```

**Step 2: Extract position from each word**
For each word, we need to:

1. Get the last character (which is a digit)
2. Convert it to an integer (this is the 1-indexed position)
3. Store the word without the digit in that position

Let's process each word:

- "is2" → position = 2, text = "is"
- "sentence4" → position = 4, text = "sentence"
- "This1" → position = 1, text = "This"
- "a3" → position = 3, text = "a"

**Step 3: Place words in correct positions**
We create an array to hold words in their correct order:

```
position 1: "This"
position 2: "is"
position 3: "a"
position 4: "sentence"
```

**Step 4: Join words back into a sentence**
Join with spaces: "This is a sentence"

This gives us the reconstructed sentence!

## Brute Force Approach

A naive approach might involve:

1. Splitting the sentence into words
2. Creating pairs of (position, word_text) for each word
3. Sorting these pairs by position
4. Joining the word_text values

While this approach would work, it's not the most efficient because sorting takes O(n log n) time. We can do better by noticing that the positions are 1-indexed and consecutive, which allows us to place each word directly into its correct position without sorting.

However, let's consider what a truly brute force approach might look like: someone might try to manually find the word with position 1, then position 2, etc., by scanning the entire list repeatedly. This would take O(n²) time and is clearly inefficient.

## Optimal Solution

The optimal approach uses the fact that positions are 1-indexed and consecutive. We can:

1. Split the sentence into words
2. Create an array to hold words in their correct positions
3. For each word, extract the position from the last character and the text from all but the last character
4. Place the text at the correct index in our array
5. Join the array back into a sentence

Here's the complete solution:

<div class="code-group">

```python
# Time: O(n) where n is the number of characters in the sentence
# Space: O(n) for storing the words array and result array
def sortSentence(s: str) -> str:
    # Step 1: Split the sentence into individual words
    words = s.split()

    # Step 2: Create an array to hold words in correct order
    # We use len(words) + 1 because positions are 1-indexed
    # Index 0 will remain empty for simplicity
    result = [""] * (len(words) + 1)

    # Step 3: Process each word
    for word in words:
        # The position is the last character converted to integer
        position = int(word[-1])

        # The text is everything except the last character
        text = word[:-1]

        # Place the text at its correct position (1-indexed)
        result[position] = text

    # Step 4: Join words from index 1 onward (skip index 0)
    # We use join() with space as separator
    return " ".join(result[1:])
```

```javascript
// Time: O(n) where n is the number of characters in the sentence
// Space: O(n) for storing the words array and result array
function sortSentence(s) {
  // Step 1: Split the sentence into individual words
  const words = s.split(" ");

  // Step 2: Create an array to hold words in correct order
  // We use words.length + 1 because positions are 1-indexed
  // Index 0 will remain empty for simplicity
  const result = new Array(words.length + 1);

  // Step 3: Process each word
  for (const word of words) {
    // The position is the last character converted to integer
    const position = parseInt(word[word.length - 1]);

    // The text is everything except the last character
    const text = word.slice(0, -1);

    // Place the text at its correct position (1-indexed)
    result[position] = text;
  }

  // Step 4: Join words from index 1 onward (skip index 0)
  // We use join() with space as separator
  return result.slice(1).join(" ");
}
```

```java
// Time: O(n) where n is the number of characters in the sentence
// Space: O(n) for storing the words array and result array
public String sortSentence(String s) {
    // Step 1: Split the sentence into individual words
    String[] words = s.split(" ");

    // Step 2: Create an array to hold words in correct order
    // We use words.length + 1 because positions are 1-indexed
    // Index 0 will remain empty for simplicity
    String[] result = new String[words.length + 1];

    // Step 3: Process each word
    for (String word : words) {
        // The position is the last character converted to integer
        int position = Character.getNumericValue(word.charAt(word.length() - 1));

        // The text is everything except the last character
        String text = word.substring(0, word.length() - 1);

        // Place the text at its correct position (1-indexed)
        result[position] = text;
    }

    // Step 4: Build the final sentence
    StringBuilder sb = new StringBuilder();

    // Start from index 1 since positions are 1-indexed
    for (int i = 1; i < result.length; i++) {
        sb.append(result[i]);

        // Add space after each word except the last one
        if (i < result.length - 1) {
            sb.append(" ");
        }
    }

    return sb.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the string takes O(n) where n is the length of the input string
- Processing each word takes O(m) where m is the number of words, and since each word is processed once with constant-time operations (extracting position and text), this is O(m)
- Joining the words back together takes O(n)
- Overall, we have O(n + m) which simplifies to O(n) since n ≥ m

**Space Complexity: O(n)**

- We store the split words array: O(n)
- We store the result array: O(m) where m is the number of words
- The output string itself takes O(n)
- Overall, we use O(n) additional space

## Common Mistakes

1. **Forgetting that positions are 1-indexed**: Some candidates might try to use 0-indexed positions, which would place words in the wrong order. Remember: the problem states "1-indexed word position."

2. **Not handling multi-digit positions**: While the problem constraints guarantee single-digit positions (since there are at most 9 words), in a real interview, you should ask about this. If positions could be multi-digit (e.g., "word12"), you'd need to extract all trailing digits.

3. **Incorrect string slicing**: Using `word[-1]` in Python or similar operations in other languages requires careful boundary checking. Forgetting that the position is at the end and slicing incorrectly could lead to including the digit in the final text.

4. **Not skipping index 0 in the result array**: Since we're using 1-indexed positions, index 0 of our result array should remain empty. Forgetting to start from index 1 when joining would result in an error (null/undefined) or incorrect output.

## When You'll See This Pattern

This problem uses a **position-based reconstruction** pattern, which appears in several other coding problems:

1. **Check if Numbers Are Ascending in a Sentence (LeetCode 2042)**: Similar string parsing and position checking, though focused on validation rather than reconstruction.

2. **Sort Array By Parity (LeetCode 905)**: While not exactly the same, it uses a similar "place elements in specific positions" approach based on some property (even/odd vs. position number).

3. **Reorder Data in Log Files (LeetCode 937)**: Involves parsing strings and sorting/reordering based on extracted information, though with more complex comparison logic.

The core pattern is: **extract a key from each element, then use that key to determine the element's position in the final output**.

## Key Takeaways

1. **Look for positional clues in the data**: When elements contain information about where they should go (like position numbers), you can often achieve O(n) time by placing each element directly rather than sorting.

2. **Pay attention to indexing conventions**: Problems often use 1-indexing for human readability, but programming languages use 0-indexing. You need to convert between these systems correctly.

3. **String parsing is a fundamental skill**: Many interview problems involve extracting information from strings. Practice splitting, slicing, and converting between string and numeric representations.

Related problems: [Check if Numbers Are Ascending in a Sentence](/problem/check-if-numbers-are-ascending-in-a-sentence)
