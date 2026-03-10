---
title: "How to Solve Goat Latin — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Goat Latin. Easy difficulty, 69.9% acceptance rate. Topics: String."
date: "2028-05-30"
category: "dsa-patterns"
tags: ["goat-latin", "string", "easy"]
---

# How to Solve Goat Latin

This problem asks us to transform a sentence according to specific rules about word beginnings and endings. While conceptually straightforward, it's interesting because it tests your ability to carefully manipulate strings while tracking multiple pieces of state (word boundaries, vowel checks, and suffix construction). The main challenge is handling all the edge cases correctly while keeping the code clean and readable.

## Visual Walkthrough

Let's trace through the example: `"I speak Goat Latin"`

**Step 1:** Split into words: `["I", "speak", "Goat", "Latin"]`

**Step 2:** Process each word with its index (starting from 1):

- Word 1: `"I"` (index 1)
  - Begins with vowel? Yes (case-insensitive: 'I' is a vowel)
  - Apply vowel rule: keep word as-is → `"I"`
  - Add `"ma"` → `"Ima"`
  - Add `"a"` repeated 1 time → `"Imaa"`

- Word 2: `"speak"` (index 2)
  - Begins with vowel? No (first letter 's' is consonant)
  - Apply consonant rule: move first letter to end → `"peaks"`
  - Add `"ma"` → `"peaksma"`
  - Add `"a"` repeated 2 times → `"peaksmaa"`

- Word 3: `"Goat"` (index 3)
  - Begins with vowel? No (first letter 'G' is consonant)
  - Apply consonant rule: move first letter to end → `"oatG"`
  - Add `"ma"` → `"oatGma"`
  - Add `"a"` repeated 3 times → `"oatGmaa"`

- Word 4: `"Latin"` (index 4)
  - Begins with vowel? No (first letter 'L' is consonant)
  - Apply consonant rule: move first letter to end → `"atinL"`
  - Add `"ma"` → `"atinLma"`
  - Add `"a"` repeated 4 times → `"atinLmaa"`

**Step 3:** Join words with spaces: `"Imaa peaksmaaa oatGmaaaa atinLmaaaaa"`

This gives us the final result. Notice how the number of 'a's at the end grows with each word's position.

## Brute Force Approach

For this problem, there's really only one reasonable approach since we must process each word exactly once. However, a "brute force" version might involve:

1. Splitting the string into words
2. For each word, checking if it starts with a vowel
3. Applying the appropriate transformation
4. Adding the suffix with the correct number of 'a's
5. Joining everything back together

The challenge isn't algorithmic complexity (we can't do better than O(n) where n is the length of the string), but rather writing clean, correct code that handles all cases properly. A naive implementation might make mistakes with:

- Case sensitivity when checking vowels
- Properly handling single-letter words
- Correctly counting word positions for the suffix
- Preserving spaces between words

## Optimal Solution

The optimal solution follows the visual walkthrough directly. We process each word sequentially, applying the rules based on whether it starts with a vowel, then adding the appropriate suffix.

<div class="code-group">

```python
# Time: O(n) where n is the length of the sentence
# Space: O(n) for storing the result
def toGoatLatin(sentence: str) -> str:
    # Step 1: Split the sentence into individual words
    words = sentence.split()

    # Define vowels for case-insensitive checking
    vowels = set('aeiouAEIOU')

    # Step 2: Process each word with its index (1-based)
    result_words = []
    for i, word in enumerate(words, 1):
        # Check if word starts with a vowel
        if word[0] in vowels:
            # Rule 1: If starts with vowel, keep word as-is
            transformed = word
        else:
            # Rule 2: If starts with consonant, move first letter to end
            transformed = word[1:] + word[0]

        # Add "ma" suffix to all words
        transformed += "ma"

        # Add 'a' repeated i times (i is the word's position)
        transformed += "a" * i

        # Add to result list
        result_words.append(transformed)

    # Step 3: Join all transformed words with spaces
    return " ".join(result_words)
```

```javascript
// Time: O(n) where n is the length of the sentence
// Space: O(n) for storing the result
function toGoatLatin(sentence) {
  // Step 1: Split the sentence into individual words
  const words = sentence.split(" ");

  // Define vowels for case-insensitive checking
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Step 2: Process each word with its index (1-based)
  const resultWords = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const position = i + 1; // 1-based index for suffix

    let transformed;

    // Check if word starts with a vowel
    if (vowels.has(word[0])) {
      // Rule 1: If starts with vowel, keep word as-is
      transformed = word;
    } else {
      // Rule 2: If starts with consonant, move first letter to end
      transformed = word.substring(1) + word[0];
    }

    // Add "ma" suffix to all words
    transformed += "ma";

    // Add 'a' repeated position times
    transformed += "a".repeat(position);

    // Add to result array
    resultWords.push(transformed);
  }

  // Step 3: Join all transformed words with spaces
  return resultWords.join(" ");
}
```

```java
// Time: O(n) where n is the length of the sentence
// Space: O(n) for storing the result
class Solution {
    public String toGoatLatin(String sentence) {
        // Step 1: Split the sentence into individual words
        String[] words = sentence.split(" ");

        // Define vowels for case-insensitive checking
        Set<Character> vowels = new HashSet<>();
        String vowelStr = "aeiouAEIOU";
        for (char c : vowelStr.toCharArray()) {
            vowels.add(c);
        }

        // Step 2: Process each word with its index (1-based)
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int position = i + 1; // 1-based index for suffix

            StringBuilder transformed = new StringBuilder();

            // Check if word starts with a vowel
            if (vowels.contains(word.charAt(0))) {
                // Rule 1: If starts with vowel, keep word as-is
                transformed.append(word);
            } else {
                // Rule 2: If starts with consonant, move first letter to end
                transformed.append(word.substring(1));
                transformed.append(word.charAt(0));
            }

            // Add "ma" suffix to all words
            transformed.append("ma");

            // Add 'a' repeated position times
            for (int j = 0; j < position; j++) {
                transformed.append('a');
            }

            // Add to result with space separator (except for first word)
            if (i > 0) {
                result.append(" ");
            }
            result.append(transformed);
        }

        // Step 3: Return the final string
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input string. Here's why:

- Splitting the string takes O(n) to traverse the entire string
- Processing each word involves operations proportional to the word's length
- Building the suffix with 'a's adds O(k²) in total across all words, but since the total length of all suffixes is O(n²) in worst case, some might argue it's O(n²). However, in practice with typical inputs, it's effectively O(n).

**Space Complexity:** O(n) for storing the result. We need space for:

- The list of words (O(n))
- The transformed result (O(n) plus extra for suffixes)
- In Python/JavaScript, intermediate strings during concatenation

## Common Mistakes

1. **Forgetting case-insensitive vowel checking:** The problem says "lowercase and uppercase letters only" but doesn't specify case for vowel checking. A common mistake is only checking lowercase vowels. Always check both cases.

2. **Incorrect word position tracking:** Using 0-based indexing for the suffix count instead of 1-based. The first word should get 1 'a', not 0.

3. **Not handling single-letter words properly:** When a word has only one letter and starts with a consonant, moving the first letter to the end should result in the same word. Make sure your substring operations handle this correctly.

4. **Inefficient string concatenation:** In languages like Java, using `+` operator in a loop creates many intermediate strings. Use `StringBuilder` instead. In Python, building a list and joining at the end is more efficient than repeated `+` operations.

## When You'll See This Pattern

This problem uses **string manipulation with conditional transformation** - a common pattern in interview problems. You'll see similar patterns in:

1. **Reverse Words in a String (LeetCode 151)** - Also involves splitting, processing, and joining words with transformations.

2. **Robot Return to Origin (LeetCode 657)** - Similar in that you process a sequence of characters with simple rules, though the transformation is different.

3. **To Lower Case (LeetCode 709)** - Simple character-by-character transformation based on rules, though without word splitting.

4. **Ransom Note (LeetCode 383)** - While different in goal, it shares the pattern of processing characters/words with specific rules.

The core pattern is: split input into units (words, characters), apply rules to each unit based on its properties, then combine results.

## Key Takeaways

1. **Break complex transformations into steps:** When faced with multiple rules, implement them one at a time. First handle the vowel/consonant rule, then add "ma", then add the 'a' suffix.

2. **Use appropriate data structures for lookups:** The vowel set gives us O(1) lookup time and makes the code cleaner than checking against a string of vowels.

3. **Track indices carefully:** When position matters (like for the suffix), make sure you're using the right indexing (1-based vs 0-based) and document it clearly in your code.

[Practice this problem on CodeJeet](/problem/goat-latin)
