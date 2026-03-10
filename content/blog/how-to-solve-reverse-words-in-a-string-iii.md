---
title: "How to Solve Reverse Words in a String III — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Words in a String III. Easy difficulty, 83.9% acceptance rate. Topics: Two Pointers, String."
date: "2026-09-20"
category: "dsa-patterns"
tags: ["reverse-words-in-a-string-iii", "two-pointers", "string", "easy"]
---

# How to Solve Reverse Words in a String III

This problem asks us to reverse the characters within each word of a string while preserving the original word order and whitespace. While conceptually straightforward, it's an excellent exercise in string manipulation and two-pointer techniques. The tricky part is efficiently identifying word boundaries and performing in-place or near-in-place reversals without creating excessive intermediate strings.

## Visual Walkthrough

Let's trace through the example `s = "Let's take LeetCode contest"`:

**Step 1:** Identify the first word: `"Let's"` (from index 0 to 4)

- Reverse it: `"s'teL"`
- Result so far: `"s'teL "`

**Step 2:** Identify the second word: `"take"` (from index 6 to 9)

- Reverse it: `"ekat"`
- Result so far: `"s'teL ekat "`

**Step 3:** Identify the third word: `"LeetCode"` (from index 11 to 18)

- Reverse it: `"edoCteeL"`
- Result so far: `"s'teL ekat edoCteeL "`

**Step 4:** Identify the fourth word: `"contest"` (from index 20 to 26)

- Reverse it: `"tsetnoc"`
- Final result: `"s'teL ekat edoCteeL tsetnoc"`

The key insight is that we need to:

1. Identify word boundaries (where spaces occur)
2. Reverse each word segment independently
3. Preserve the original spacing between words

## Brute Force Approach

A naive approach would be to:

1. Split the string into words using `split()`
2. Reverse each word individually
3. Join them back together with spaces

While this approach works and is actually quite readable, it's worth understanding why we might want a more manual approach:

- Some interviewers want to see you handle the string traversal manually
- The split-join approach creates multiple intermediate strings
- It doesn't demonstrate understanding of two-pointer techniques

However, for this "Easy" problem, the split-join approach is often acceptable. Let's see what it looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def reverseWordsBrute(s):
    # Split into words
    words = s.split(' ')

    # Reverse each word
    reversed_words = []
    for word in words:
        reversed_words.append(word[::-1])

    # Join back together
    return ' '.join(reversed_words)
```

```javascript
// Time: O(n) | Space: O(n)
function reverseWordsBrute(s) {
  // Split into words
  const words = s.split(" ");

  // Reverse each word
  const reversedWords = [];
  for (let word of words) {
    reversedWords.push(word.split("").reverse().join(""));
  }

  // Join back together
  return reversedWords.join(" ");
}
```

```java
// Time: O(n) | Space: O(n)
public String reverseWordsBrute(String s) {
    // Split into words
    String[] words = s.split(" ");

    // Reverse each word
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < words.length; i++) {
        StringBuilder reversed = new StringBuilder(words[i]);
        result.append(reversed.reverse());
        if (i < words.length - 1) {
            result.append(" ");
        }
    }

    return result.toString();
}
```

</div>

This approach works, but it creates multiple intermediate arrays/strings and doesn't demonstrate the two-pointer pattern that many interviewers want to see for string manipulation problems.

## Optimal Solution

The optimal solution uses a two-pointer approach to identify word boundaries and reverse each word in-place (or in a new string). We'll traverse the string, and whenever we find a space or reach the end, we'll reverse the characters between our two pointers.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string (O(1) if done in-place on mutable string)
def reverseWords(s):
    # Convert string to list since Python strings are immutable
    chars = list(s)
    n = len(chars)

    # Initialize start pointer for the beginning of a word
    start = 0

    # Iterate through the string
    for i in range(n + 1):  # Go to n+1 to handle the last word
        # If we've reached a space or the end of the string
        if i == n or chars[i] == ' ':
            # Set end pointer to the character before the space
            end = i - 1

            # Reverse the characters between start and end
            while start < end:
                # Swap characters at start and end positions
                chars[start], chars[end] = chars[end], chars[start]
                start += 1
                end -= 1

            # Move start pointer to the beginning of the next word
            start = i + 1

    # Convert list back to string
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function reverseWords(s) {
  // Convert string to array since strings are immutable in JavaScript
  const chars = s.split("");
  const n = chars.length;

  // Initialize start pointer for the beginning of a word
  let start = 0;

  // Iterate through the string
  for (let i = 0; i <= n; i++) {
    // Go to n+1 to handle the last word
    // If we've reached a space or the end of the string
    if (i === n || chars[i] === " ") {
      // Set end pointer to the character before the space
      let end = i - 1;

      // Reverse the characters between start and end
      while (start < end) {
        // Swap characters at start and end positions
        [chars[start], chars[end]] = [chars[end], chars[start]];
        start++;
        end--;
      }

      // Move start pointer to the beginning of the next word
      start = i + 1;
    }
  }

  // Convert array back to string
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the result string
public String reverseWords(String s) {
    // Convert string to char array for in-place modification
    char[] chars = s.toCharArray();
    int n = chars.length;

    // Initialize start pointer for the beginning of a word
    int start = 0;

    // Iterate through the string
    for (int i = 0; i <= n; i++) {  // Go to n+1 to handle the last word
        // If we've reached a space or the end of the string
        if (i == n || chars[i] == ' ') {
            // Set end pointer to the character before the space
            int end = i - 1;

            // Reverse the characters between start and end
            while (start < end) {
                // Swap characters at start and end positions
                char temp = chars[start];
                chars[start] = chars[end];
                chars[end] = temp;
                start++;
                end--;
            }

            // Move start pointer to the beginning of the next word
            start = i + 1;
        }
    }

    // Convert char array back to string
    return new String(chars);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the entire string once with our `i` pointer: O(n)
- Each character is swapped at most once during reversal: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity:** O(n)

- In Python and JavaScript, we create a list/array from the string: O(n)
- In Java, we create a char array: O(n)
- If the language supported mutable strings, we could achieve O(1) space by modifying in-place
- The algorithm itself uses only O(1) extra space for pointers

## Common Mistakes

1. **Forgetting to handle the last word:** Many candidates stop their loop at `n` instead of `n+1`, which means they miss reversing the last word unless it's followed by a space. Always test with a sentence that doesn't end with a space.

2. **Incorrect pointer updates after reversal:** After reversing a word from `start` to `end`, you need to set `start = i + 1` (where `i` is the space position), not `start = end + 1`. The latter would skip characters if the word had odd length.

3. **Not accounting for multiple spaces:** While the problem guarantees single spaces between words, a robust solution should handle multiple spaces. The current solution handles this correctly because it reverses each "word" segment (which could be empty between multiple spaces).

4. **Mutable vs immutable strings confusion:** In Python and JavaScript, strings are immutable, so attempting to modify them directly with indexing will fail. Always convert to a list/array first, then join back to a string.

## When You'll See This Pattern

The two-pointer reversal pattern appears in many string and array problems:

1. **Reverse String (LeetCode 344)** - The simplest form of this pattern, reversing an entire string/array using two pointers.

2. **Reverse Words in a String (LeetCode 151)** - A harder version where you need to reverse the entire sentence word order, not just individual words.

3. **Reverse String II (LeetCode 541)** - A variation where you reverse the first k characters for every 2k characters.

4. **Rotate Array (LeetCode 189)** - Can be solved using three reversals: reverse entire array, reverse first k elements, reverse remaining elements.

The core insight is that reversal operations can often be done in-place with O(1) extra space using two pointers, making them memory-efficient solutions.

## Key Takeaways

1. **Two-pointer reversal is a fundamental pattern:** When you need to reverse sequences, think about using two pointers starting at opposite ends and moving toward the center.

2. **Word boundary detection is key for string problems:** Many string manipulation problems require identifying where words start and end. Look for spaces or changes in character type as boundary markers.

3. **Consider language-specific constraints:** Remember that strings are immutable in some languages (Python, JavaScript, Java) and mutable in others. Choose the right approach for your language.

4. **Edge cases matter:** Always test with empty strings, single words, trailing/leading spaces, and multiple spaces between words to ensure your solution is robust.

Related problems: [Reverse String II](/problem/reverse-string-ii)
