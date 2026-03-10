---
title: "How to Solve Reverse Words in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Words in a String. Medium difficulty, 55.6% acceptance rate. Topics: Two Pointers, String."
date: "2026-04-08"
category: "dsa-patterns"
tags: ["reverse-words-in-a-string", "two-pointers", "string", "medium"]
---

# How to Solve Reverse Words in a String

At first glance, reversing words in a string seems straightforward—just split the string and reverse the words. However, the challenge lies in handling edge cases efficiently: leading/trailing spaces, multiple spaces between words, and doing it in-place when required (though not in this version). This problem tests your string manipulation skills and attention to detail, which is why it's a favorite in coding interviews despite its apparent simplicity.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input string: `"  hello world  "`

**Step-by-step reasoning:**

1. We need to identify individual words: "hello" and "world"
2. Notice the extra spaces: two leading spaces, two trailing spaces, and one space between words
3. Our goal is to reverse the word order: "world hello"
4. We must also normalize spaces: only single spaces between words, no leading/trailing spaces

**Manual process:**

- Start from the end of the string: position 13 (0-indexed)
- Skip trailing spaces until we find 'd' at position 11
- Extract "world" (positions 6-11)
- Move backward, skip the space between words
- Extract "hello" (positions 2-7)
- Combine in reverse order: "world" + " " + "hello" = "world hello"

This backward traversal approach is key to solving the problem efficiently.

## Brute Force Approach

The most intuitive approach is to:

1. Split the string by spaces
2. Filter out empty strings (from multiple spaces)
3. Reverse the list of words
4. Join with single spaces

While this works, it's worth understanding why it's considered "brute force" in an interview context:

- It creates multiple intermediate data structures
- The split operation traverses the entire string
- It doesn't demonstrate low-level string manipulation skills
- In languages like Java, it creates many temporary String objects

Here's what the brute force looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def reverseWords(s: str) -> str:
    # Step 1: Split by spaces (handles multiple spaces)
    words = s.split()

    # Step 2: Reverse the list of words
    words.reverse()

    # Step 3: Join with single spaces
    return ' '.join(words)
```

```javascript
// Time: O(n) | Space: O(n)
function reverseWords(s) {
  // Step 1: Split by spaces, filter out empty strings
  const words = s.trim().split(/\s+/);

  // Step 2: Reverse the array
  words.reverse();

  // Step 3: Join with single spaces
  return words.join(" ");
}
```

```java
// Time: O(n) | Space: O(n)
public String reverseWords(String s) {
    // Step 1: Trim and split by one or more spaces
    String[] words = s.trim().split("\\s+");

    // Step 2: Reverse the array
    Collections.reverse(Arrays.asList(words));

    // Step 3: Join with single spaces
    return String.join(" ", words);
}
```

</div>

While this solution is actually optimal in terms of time complexity (O(n)), interviewers often want to see you handle the string manipulation manually to demonstrate deeper understanding.

## Optimized Approach

The optimized approach uses two pointers to manually extract words without relying on built-in split functions. The key insight is to **traverse the string backward**:

1. **Initialize pointers**: `i` starts at the end of the string
2. **Skip trailing spaces**: Move `i` backward while it points to spaces
3. **Find word boundaries**:
   - `j` starts at `i` and moves backward until it finds a space or reaches the beginning
   - The substring from `j+1` to `i+1` is a complete word
4. **Extract and append**: Add the word to the result
5. **Repeat**: Set `i = j` and continue until we've processed the entire string

This approach is more efficient in terms of space when you consider that built-in split functions often create more intermediate objects than necessary. It also demonstrates your ability to work with indices and boundaries—a crucial skill for string manipulation problems.

## Optimal Solution

Here's the manual two-pointer solution that interviewers love to see:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def reverseWords(s: str) -> str:
    result = []  # We'll build the result as a list of words
    i = len(s) - 1  # Start from the end of the string

    while i >= 0:
        # Skip trailing and between-word spaces
        while i >= 0 and s[i] == ' ':
            i -= 1

        # If we've reached the beginning, break
        if i < 0:
            break

        # j will mark the start of the current word
        j = i

        # Move j backward until we hit a space or beginning
        while j >= 0 and s[j] != ' ':
            j -= 1

        # Extract word from j+1 to i+1
        # j+1 because j is either at a space or -1
        # i+1 because Python slicing is exclusive at the end
        word = s[j+1:i+1]
        result.append(word)

        # Move i to j to continue processing
        i = j

    # Join all words with single spaces
    return ' '.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function reverseWords(s) {
  const result = [];
  let i = s.length - 1;

  while (i >= 0) {
    // Skip trailing and between-word spaces
    while (i >= 0 && s[i] === " ") {
      i--;
    }

    // If we've reached the beginning, break
    if (i < 0) break;

    // j will mark the start of the current word
    let j = i;

    // Move j backward until we hit a space or beginning
    while (j >= 0 && s[j] !== " ") {
      j--;
    }

    // Extract word from j+1 to i+1
    // j+1 because j is at the space before the word
    const word = s.substring(j + 1, i + 1);
    result.push(word);

    // Move i to j to continue processing
    i = j;
  }

  // Join all words with single spaces
  return result.join(" ");
}
```

```java
// Time: O(n) | Space: O(n)
public String reverseWords(String s) {
    StringBuilder result = new StringBuilder();
    int i = s.length() - 1;

    while (i >= 0) {
        // Skip trailing and between-word spaces
        while (i >= 0 && s.charAt(i) == ' ') {
            i--;
        }

        // If we've reached the beginning, break
        if (i < 0) break;

        // j will mark the start of the current word
        int j = i;

        // Move j backward until we hit a space or beginning
        while (j >= 0 && s.charAt(j) != ' ') {
            j--;
        }

        // Extract word from j+1 to i+1
        // j+1 because j is at the space before the word
        if (result.length() > 0) {
            result.append(" ");  // Add space between words
        }
        result.append(s.substring(j + 1, i + 1));

        // Move i to j to continue processing
        i = j;
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse each character at most twice: once when skipping spaces, once when extracting words
- The while loops ensure we visit each character a constant number of times
- The join operation at the end is also O(n)

**Space Complexity: O(n)**

- We store the result string, which in the worst case (no extra spaces) is the same size as input
- The list/array of words stores references to substrings, not copies (in most languages)
- Additional O(1) space for pointers i and j

## Common Mistakes

1. **Forgetting to handle multiple spaces**: Candidates often split by single space only, resulting in empty strings in their word list. Always account for multiple consecutive spaces.

2. **Off-by-one errors in substring extraction**: The most common error is getting the indices wrong when extracting words. Remember:
   - When j stops at a space or -1, the word starts at j+1
   - The word ends at i (inclusive), so use i+1 for exclusive slicing

3. **Not handling leading/trailing spaces properly**: If you don't skip spaces at the beginning and end, you might get empty words or incorrect results. Always trim or skip spaces before processing words.

4. **Using string concatenation in a loop**: In Java and JavaScript, string concatenation in loops creates new string objects each time, making it O(n²). Use StringBuilder (Java) or array join (JavaScript) instead.

## When You'll See This Pattern

The two-pointer backward traversal pattern appears in several string manipulation problems:

1. **Reverse Words in a String II** (LeetCode 186): The same problem but requires in-place modification for character arrays. The backward traversal technique is essential here.

2. **Reverse String** (LeetCode 344): While simpler (reverse the entire string), it uses the two-pointer technique from both ends.

3. **Valid Palindrome** (LeetCode 125): Uses two pointers to compare characters while skipping non-alphanumeric characters.

4. **String Compression** (LeetCode 443): Uses read and write pointers to modify arrays in-place.

The core pattern is using two indices to traverse and manipulate data without extra space or with minimal extra space.

## Key Takeaways

1. **Backward traversal simplifies word reversal**: When reversing word order, processing from the end to the beginning often makes the logic cleaner than trying to reverse in place from the front.

2. **Two-pointer technique is versatile**: One pointer finds word boundaries while the other tracks extraction points. This pattern works for many array/string manipulation problems.

3. **Always test edge cases**: Empty strings, all spaces, single word, multiple spaces between words—these edge cases break naive implementations. The two-pointer approach handles them elegantly.

4. **Understand your language's string operations**: While built-in functions (split, trim, join) often provide cleaner code, knowing how to implement them manually demonstrates deeper understanding to interviewers.

Related problems: [Reverse Words in a String II](/problem/reverse-words-in-a-string-ii)
