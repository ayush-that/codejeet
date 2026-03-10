---
title: "How to Solve Rearrange Words in a Sentence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rearrange Words in a Sentence. Medium difficulty, 66.9% acceptance rate. Topics: String, Sorting."
date: "2028-03-23"
category: "dsa-patterns"
tags: ["rearrange-words-in-a-sentence", "string", "sorting", "medium"]
---

# How to Solve Rearrange Words in a Sentence

This problem asks us to rearrange the words in a sentence based on their lengths, from shortest to longest. If multiple words have the same length, they must maintain their original relative order. The tricky part is handling case sensitivity: the first word in the output must be capitalized, and all other words must be lowercase, while preserving the original word casing within the rearrangement logic.

## Visual Walkthrough

Let's trace through an example: `"Keep calm and code on"`

**Step 1: Split the sentence into words**

- Words: `["Keep", "calm", "and", "code", "on"]`

**Step 2: Sort words by length while preserving order for ties**

- Lengths: `[4, 4, 3, 4, 2]`
- Sort by length: `["on", "and", "Keep", "calm", "code"]`
- Note: "Keep", "calm", and "code" all have length 4. They maintain their original relative order.

**Step 3: Capitalize the first word and lowercase the rest**

- First word: "on" → "On"
- Rest: "and", "Keep", "calm", "code" → "and", "keep", "calm", "code"

**Step 4: Join with spaces**

- Result: `"On and keep calm code"`

The key insight is that we need a **stable sort** by word length, not a simple alphabetical sort.

## Brute Force Approach

A naive approach might try to manually find the shortest word, add it to the result, remove it from the list, and repeat. This would work but is inefficient:

1. Find the shortest word in the list (O(n))
2. Add it to the result list
3. Remove it from the original list (O(n) for shifting elements)
4. Repeat for all words

This results in O(n²) time complexity because for each of n words, we scan the remaining list and potentially shift elements when removing.

Another brute force approach would be to use a standard sort with a custom comparator that compares lengths. However, we must ensure the sort is stable for words of equal length. While many sorting algorithms can be made stable, the real challenge is implementing the case transformation correctly.

## Optimized Approach

The optimal approach uses these key steps:

1. **Split the sentence into words** using space as delimiter
2. **Convert all words to lowercase** to handle case-insensitive length comparison
3. **Sort words by length** using a stable sort algorithm
4. **Capitalize the first word** of the result
5. **Join the words back** with spaces

The critical insight is that we need to:

- Track the original words (with their casing) to sort by length
- Use a stable sort to preserve order for words with equal length
- Handle the capitalization requirement separately from the sorting logic

Most programming languages provide stable sorting algorithms for their built-in sort functions, so we can rely on that property.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) - sorting n words
# Space: O(n) - storing words in a list
def arrangeWords(text: str) -> str:
    # Step 1: Split the sentence into individual words
    words = text.split()

    # Step 2: Convert all words to lowercase for consistent comparison
    # We need to preserve the original words for output, but lowercase
    # versions for length-based sorting
    lower_words = [word.lower() for word in words]

    # Step 3: Create a list of indices to track original positions
    # This helps maintain stability when words have equal length
    indices = list(range(len(words)))

    # Step 4: Sort indices based on word length, then original position
    # This ensures stable sorting: if lengths are equal, original order is preserved
    indices.sort(key=lambda i: (len(lower_words[i]), i))

    # Step 5: Build the result using sorted indices
    # Use the original words (not lowercased) to preserve any internal casing
    result_words = [words[i] for i in indices]

    # Step 6: Capitalize the first word
    if result_words:
        result_words[0] = result_words[0].capitalize()

    # Step 7: Join words with spaces and return
    return ' '.join(result_words)
```

```javascript
// Time: O(n log n) - sorting n words
// Space: O(n) - storing words in an array
function arrangeWords(text) {
  // Step 1: Split the sentence into individual words
  const words = text.split(" ");

  // Step 2: Create an array of objects containing word, lowercase version, and original index
  // This allows us to sort by length while preserving original order for ties
  const wordData = words.map((word, index) => ({
    original: word,
    lower: word.toLowerCase(),
    index: index,
  }));

  // Step 3: Sort by word length first, then by original index to maintain stability
  wordData.sort((a, b) => {
    // Compare lengths first
    if (a.lower.length !== b.lower.length) {
      return a.lower.length - b.lower.length;
    }
    // If lengths are equal, maintain original order
    return a.index - b.index;
  });

  // Step 4: Extract the sorted words (use original casing)
  const resultWords = wordData.map((item) => item.original);

  // Step 5: Capitalize the first word and lowercase the rest
  if (resultWords.length > 0) {
    // Capitalize first word
    resultWords[0] = resultWords[0].charAt(0).toUpperCase() + resultWords[0].slice(1).toLowerCase();

    // Lowercase all other words
    for (let i = 1; i < resultWords.length; i++) {
      resultWords[i] = resultWords[i].toLowerCase();
    }
  }

  // Step 6: Join words with spaces and return
  return resultWords.join(" ");
}
```

```java
// Time: O(n log n) - sorting n words
// Space: O(n) - storing words in lists
class Solution {
    public String arrangeWords(String text) {
        // Step 1: Split the sentence into individual words
        String[] words = text.split(" ");

        // Step 2: Convert all words to lowercase for consistent comparison
        // We'll store both original and lowercase versions
        String[] lowerWords = new String[words.length];
        for (int i = 0; i < words.length; i++) {
            lowerWords[i] = words[i].toLowerCase();
        }

        // Step 3: Create an array of indices to track original positions
        Integer[] indices = new Integer[words.length];
        for (int i = 0; i < words.length; i++) {
            indices[i] = i;
        }

        // Step 4: Sort indices based on word length, then original position
        // Using Arrays.sort with custom comparator ensures stable sorting
        Arrays.sort(indices, new Comparator<Integer>() {
            @Override
            public int compare(Integer i1, Integer i2) {
                // First compare by length
                int lenCompare = Integer.compare(lowerWords[i1].length(),
                                                 lowerWords[i2].length());
                if (lenCompare != 0) {
                    return lenCompare;
                }
                // If lengths are equal, maintain original order
                return Integer.compare(i1, i2);
            }
        });

        // Step 5: Build the result using sorted indices
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < indices.length; i++) {
            String word = words[indices[i]];

            // Step 6: Handle capitalization
            if (i == 0) {
                // Capitalize first word
                result.append(Character.toUpperCase(word.charAt(0)));
                result.append(word.substring(1).toLowerCase());
            } else {
                // Lowercase all other words
                result.append(word.toLowerCase());
            }

            // Add space between words (but not after the last word)
            if (i < indices.length - 1) {
                result.append(" ");
            }
        }

        // Step 7: Return the final string
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Splitting the string: O(n) where n is the length of the text
- Creating lowercase versions: O(n)
- Sorting: O(n log n) for comparison-based sort
- Building the result: O(n)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Storing the words array: O(n)
- Storing lowercase versions: O(n)
- Storing indices for sorting: O(n)
- Result string: O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle case sensitivity in sorting**: Sorting "Apple" and "apple" as different words when comparing lengths. Always convert to lowercase before comparing lengths.

2. **Not preserving order for words of equal length**: Using an unstable sort or not explicitly handling ties. The problem requires maintaining original order for words with the same length.

3. **Incorrect capitalization handling**:
   - Capitalizing every word's first letter
   - Not lowercasing the rest of the letters in non-first words
   - Forgetting that the first word might have been lowercase in the original text

4. **Overcomplicating with custom data structures**: Some candidates create complex classes or tuples when simple arrays with indices suffice. Keep it simple.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Custom Sorting with Multiple Criteria**: Similar to problems like:
   - "Sort Characters By Frequency" (LeetCode 451) - sort by frequency, then alphabetically
   - "Reorder Data in Log Files" (LeetCode 937) - sort with custom comparator for letter vs digit logs

2. **String Manipulation with Case Handling**: Similar to:
   - "To Lower Case" (LeetCode 709) - basic case conversion
   - "Letter Case Permutation" (LeetCode 784) - more complex case manipulation

3. **Stable Sorting Requirements**: Many problems require stable sorts when multiple elements compare equal, especially in interview settings where you need to justify your sorting approach.

## Key Takeaways

1. **When sorting by a derived property** (like word length), create a mapping to that property and sort indices rather than the objects themselves to preserve original data.

2. **For stable sorting with multiple criteria**, implement comparators that check primary criteria first, then secondary criteria to break ties.

3. **String manipulation problems** often require careful handling of edge cases like empty strings, single words, and case sensitivity. Always test with these cases.

[Practice this problem on CodeJeet](/problem/rearrange-words-in-a-sentence)
