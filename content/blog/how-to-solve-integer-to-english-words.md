---
title: "How to Solve Integer to English Words — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Integer to English Words. Hard difficulty, 34.8% acceptance rate. Topics: Math, String, Recursion."
date: "2027-03-21"
category: "dsa-patterns"
tags: ["integer-to-english-words", "math", "string", "recursion", "hard"]
---

# How to Solve Integer to English Words

Converting a non-negative integer to its English words representation is a classic hard problem that tests your ability to handle edge cases, recursion, and careful string manipulation. What makes this problem tricky is the irregular naming conventions in English numbers—especially with teens (11-19) and the need to handle thousands, millions, and billions correctly. You can't just convert digit by digit; you need to process the number in chunks of three digits (hundreds, thousands, millions, billions).

## Visual Walkthrough

Let's trace through the number `12,345,678` step by step:

1. **Split into chunks of three digits** (from right to left):
   - 678 (hundreds chunk)
   - 345 (thousands chunk)
   - 12 (millions chunk)

2. **Process each chunk independently**:
   - Chunk 1 (678):
     - 6 → "Six Hundred"
     - 78 → "Seventy Eight"
     - Combined: "Six Hundred Seventy Eight"
   - Chunk 2 (345):
     - 3 → "Three Hundred"
     - 45 → "Forty Five"
     - Combined: "Three Hundred Forty Five"
     - Since this is the thousands chunk, append "Thousand"
   - Chunk 3 (12):
     - 12 → "Twelve"
     - Since this is the millions chunk, append "Million"

3. **Combine with proper spacing**:
   - "Twelve Million Three Hundred Forty Five Thousand Six Hundred Seventy Eight"

Notice how we process from left to right (highest chunk to lowest) but build the chunks from right to left. Each chunk follows the same pattern: handle hundreds digit, then tens and ones (with special handling for 11-19).

## Brute Force Approach

A naive approach might try to process the number digit by digit from left to right, but this quickly becomes messy because:

- English has irregular names for 11-19 ("eleven" not "ten one")
- The position matters (hundreds, thousands, millions)
- You need to handle "and" correctly (though the problem doesn't require it)
- Zero requires special handling ("Zero" only for the number 0)

Here's what a naive digit-by-digit approach might look like (and why it fails):

```python
# This doesn't work well - just showing the thought process
def numberToWords_naive(num):
    if num == 0:
        return "Zero"

    digits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
             "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
            "Sixty", "Seventy", "Eighty", "Ninety"]

    # This approach gets messy when trying to handle chunks of three
    # You'd need complex logic to track position and handle irregular cases
```

The brute force fails because it doesn't have a clean way to handle:

1. Chunks of three digits (hundreds, thousands, millions)
2. The irregular 11-19 range
3. Proper spacing between words
4. Skipping empty chunks (like 1,000,001 should be "One Million One", not "One Million Zero Hundred Zero One")

## Optimized Approach

The key insight is to **process the number in chunks of three digits** (hundreds, thousands, millions, billions). Each chunk follows the same pattern:

1. Handle the hundreds place (if present)
2. Handle the tens and ones places (with special logic for 11-19)

We need four main components:

1. **Arrays for small numbers**: 0-19 have unique names
2. **Arrays for tens**: 20, 30, 40, etc.
3. **Array for thousands**: "", "Thousand", "Million", "Billion"
4. **Recursive/iterative function** to process each chunk

The algorithm:

1. Handle the special case of 0
2. Split the number into chunks of 3 digits (from right to left)
3. For each chunk:
   - Convert the 3-digit number to words using helper function
   - If the chunk is not zero, append the appropriate thousand word
4. Combine all chunks with proper spacing

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of digits | Space: O(1) excluding output
class Solution:
    def numberToWords(self, num: int) -> str:
        # Special case: zero
        if num == 0:
            return "Zero"

        # Arrays for number words
        below_20 = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
                    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
                    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
                    "Nineteen"]
        tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
                "Seventy", "Eighty", "Ninety"]
        thousands = ["", "Thousand", "Million", "Billion"]

        def helper(num):
            """Convert a number less than 1000 to words"""
            if num == 0:
                return ""
            elif num < 20:
                # Direct lookup for numbers 1-19
                return below_20[num] + " "
            elif num < 100:
                # For numbers 20-99: tens digit + ones digit
                return tens[num // 10] + " " + helper(num % 10)
            else:
                # For numbers 100-999: hundreds digit + rest
                return below_20[num // 100] + " Hundred " + helper(num % 100)

        result = ""
        i = 0  # Index for thousands array

        # Process number in chunks of 3 digits from right to left
        while num > 0:
            # Get the last 3 digits
            chunk = num % 1000

            if chunk != 0:
                # Convert chunk to words and add thousand word if needed
                chunk_words = helper(chunk).strip()
                if i > 0:
                    chunk_words += " " + thousands[i]
                # Prepend to result (since we're processing from right to left)
                result = chunk_words + " " + result if result else chunk_words

            # Move to next chunk and next thousand word
            num //= 1000
            i += 1

        return result.strip()
```

```javascript
// Time: O(n) where n is number of digits | Space: O(1) excluding output
/**
 * @param {number} num
 * @return {string}
 */
var numberToWords = function (num) {
  // Special case: zero
  if (num === 0) {
    return "Zero";
  }

  // Arrays for number words
  const below20 = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  // Helper function to convert numbers less than 1000
  const helper = (n) => {
    if (n === 0) {
      return "";
    } else if (n < 20) {
      // Direct lookup for numbers 1-19
      return below20[n] + " ";
    } else if (n < 100) {
      // For numbers 20-99: tens digit + ones digit
      return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    } else {
      // For numbers 100-999: hundreds digit + rest
      return below20[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    }
  };

  let result = "";
  let i = 0; // Index for thousands array

  // Process number in chunks of 3 digits from right to left
  while (num > 0) {
    // Get the last 3 digits
    const chunk = num % 1000;

    if (chunk !== 0) {
      // Convert chunk to words and add thousand word if needed
      let chunkWords = helper(chunk).trim();
      if (i > 0) {
        chunkWords += " " + thousands[i];
      }
      // Prepend to result (since we're processing from right to left)
      result = chunkWords + (result ? " " + result : "");
    }

    // Move to next chunk and next thousand word
    num = Math.floor(num / 1000);
    i++;
  }

  return result.trim();
};
```

```java
// Time: O(n) where n is number of digits | Space: O(1) excluding output
class Solution {
    // Arrays for number words
    private final String[] below20 = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
                                      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
                                      "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
                                      "Nineteen"};
    private final String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
                                   "Seventy", "Eighty", "Ninety"};
    private final String[] thousands = {"", "Thousand", "Million", "Billion"};

    public String numberToWords(int num) {
        // Special case: zero
        if (num == 0) {
            return "Zero";
        }

        String result = "";
        int i = 0;  // Index for thousands array

        // Process number in chunks of 3 digits from right to left
        while (num > 0) {
            // Get the last 3 digits
            int chunk = num % 1000;

            if (chunk != 0) {
                // Convert chunk to words and add thousand word if needed
                String chunkWords = helper(chunk).trim();
                if (i > 0) {
                    chunkWords += " " + thousands[i];
                }
                // Prepend to result (since we're processing from right to left)
                result = chunkWords + (result.isEmpty() ? "" : " " + result);
            }

            // Move to next chunk and next thousand word
            num /= 1000;
            i++;
        }

        return result.trim();
    }

    // Helper function to convert numbers less than 1000
    private String helper(int num) {
        if (num == 0) {
            return "";
        } else if (num < 20) {
            // Direct lookup for numbers 1-19
            return below20[num] + " ";
        } else if (num < 100) {
            // For numbers 20-99: tens digit + ones digit
            return tens[num / 10] + " " + helper(num % 10);
        } else {
            // For numbers 100-999: hundreds digit + rest
            return below20[num / 100] + " Hundred " + helper(num % 100);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the number of digits in the input number. We process each chunk of 3 digits exactly once, and each chunk takes constant time to convert. Since there are at most 4 chunks (up to billions), and each chunk has at most 3 digits, the time is linear in the number of digits.

**Space Complexity: O(1)** excluding the output string. We use a constant amount of extra space for the arrays and variables. The recursive calls in the helper function have a maximum depth of 3 (for numbers less than 1000), so the call stack uses O(1) space.

## Common Mistakes

1. **Forgetting the special case for 0**: The number 0 should return "Zero", but many candidates return an empty string or "". Always check for edge cases first.

2. **Incorrect handling of 11-19**: These numbers have unique names ("Eleven", not "Ten One"). Candidates often try to combine tens and ones digits, which fails for this range.

3. **Adding extra spaces or missing spaces**: English words should be separated by single spaces. Common errors include:
   - Multiple spaces between words
   - Leading/trailing spaces
   - No space before thousand words ("OneMillion" instead of "One Million")

4. **Not skipping empty chunks**: For 1,000,001, you should get "One Million One", not "One Million Zero Hundred Zero One". Always check if chunk != 0 before processing.

5. **Wrong order when combining chunks**: Since we process from right to left (least significant to most significant), we need to prepend each chunk's words to the result, not append.

## When You'll See This Pattern

This problem uses **chunk-based processing** and **recursive decomposition**, which appear in several other problems:

1. **Integer to Roman (Medium)**: Similar concept of converting numbers to a different representation using predefined mappings. Instead of chunks of 3, you handle Roman numerals with special cases (IV, IX, XL, etc.).

2. **Basic Calculator (Hard)**: While more complex, it also involves parsing and processing numerical expressions in chunks.

3. **Text Justification (Hard)**: Involves processing text in chunks (lines) with specific formatting rules.

The pattern is: when you need to convert between representations, look for natural boundaries (chunks of 3 digits for numbers, words for text justification) and handle each chunk independently with a helper function.

## Key Takeaways

1. **Break complex problems into smaller, reusable parts**: The helper function that converts 0-999 is used repeatedly for each chunk. This makes the code cleaner and easier to debug.

2. **Look for natural boundaries in the problem**: For numbers, chunks of 3 digits (hundreds, thousands, millions) are the natural boundary. Recognizing this pattern is key to solving the problem efficiently.

3. **Handle edge cases first**: Always check for 0, empty input, or other special cases before diving into the main logic. This prevents bugs and shows interviewers you're thorough.

4. **Use meaningful variable names**: Names like `below_20`, `tens`, and `thousands` make the code self-documenting and easier to follow during an interview.

Related problems: [Integer to Roman](/problem/integer-to-roman)
