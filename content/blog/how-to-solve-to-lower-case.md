---
title: "How to Solve To Lower Case — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode To Lower Case. Easy difficulty, 84.7% acceptance rate. Topics: String."
date: "2027-01-13"
category: "dsa-patterns"
tags: ["to-lower-case", "string", "easy"]
---

# How to Solve To Lower Case

At first glance, this problem seems trivial—just convert uppercase letters to lowercase. However, it's an excellent opportunity to understand character encoding, ASCII values, and how programming languages handle string manipulation under the hood. The "tricky" part isn't the implementation itself, but understanding why the character arithmetic approach works and recognizing when to use built-in methods versus manual conversion in an interview setting.

## Visual Walkthrough

Let's trace through the input `"Hello World!"` step by step:

1. **Character 'H'** (ASCII 72): This is uppercase (ASCII 65-90). To convert to lowercase, we add 32 (difference between 'A' and 'a'), getting ASCII 104, which is 'h'.

2. **Character 'e'** (ASCII 101): Already lowercase (ASCII 97-122), so we leave it unchanged.

3. **Character 'l'** (ASCII 108): Already lowercase, unchanged.

4. **Character 'l'** (ASCII 108): Already lowercase, unchanged.

5. **Character 'o'** (ASCII 111): Already lowercase, unchanged.

6. **Character ' '** (space, ASCII 32): Not a letter, unchanged.

7. **Character 'W'** (ASCII 87): Uppercase, add 32 to get 119 → 'w'.

8. **Character 'o'** (ASCII 111): Already lowercase, unchanged.

9. **Character 'r'** (ASCII 114): Already lowercase, unchanged.

10. **Character 'l'** (ASCII 108): Already lowercase, unchanged.

11. **Character 'd'** (ASCII 100): Already lowercase, unchanged.

12. **Character '!'** (ASCII 33): Not a letter, unchanged.

Final result: `"hello world!"`

The key insight is that we only modify characters in the ASCII range 65-90 (A-Z), converting them to 97-122 (a-z) by adding 32.

## Brute Force Approach

For this problem, there isn't really a "brute force" versus "optimal" distinction in terms of time complexity—any reasonable solution will be O(n). However, we can think about what a naive candidate might try:

A truly brute force approach might involve creating a lookup table for every possible character, or using a series of `if` statements for each uppercase letter. For example:

```python
def toLowerCase(s):
    result = ""
    for char in s:
        if char == 'A':
            result += 'a'
        elif char == 'B':
            result += 'b'
        # ... and so on for all 26 letters
        else:
            result += char
    return result
```

This approach is problematic because:

1. It's verbose and error-prone (26 conditions to write)
2. It doesn't handle non-English characters that might be in the input
3. It's not extensible or maintainable

The better approach is to use character arithmetic based on ASCII values, which handles all uppercase letters uniformly.

## Optimal Solution

The optimal solution iterates through each character, checks if it's an uppercase letter (ASCII 65-90), and if so, converts it to lowercase by adding 32 to its ASCII value. This works because the ASCII values for uppercase and lowercase letters are exactly 32 apart.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(n) for the result string (could be O(1) if modifying in-place)
def toLowerCase(s: str) -> str:
    # Initialize an empty list to build the result
    # Using list is more efficient than string concatenation in Python
    result_chars = []

    # Iterate through each character in the input string
    for char in s:
        # Get the ASCII value of the character
        ascii_val = ord(char)

        # Check if the character is an uppercase letter (ASCII 65-90)
        if 65 <= ascii_val <= 90:
            # Convert to lowercase by adding 32 to ASCII value
            # 32 is the difference between 'A' (65) and 'a' (97)
            lowercase_char = chr(ascii_val + 32)
            result_chars.append(lowercase_char)
        else:
            # Keep non-uppercase characters as they are
            result_chars.append(char)

    # Join all characters back into a string
    return ''.join(result_chars)
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(n) for the result string
function toLowerCase(s) {
  // Initialize an empty string to build the result
  let result = "";

  // Iterate through each character in the input string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Get the ASCII value of the character
    const asciiVal = char.charCodeAt(0);

    // Check if the character is an uppercase letter (ASCII 65-90)
    if (asciiVal >= 65 && asciiVal <= 90) {
      // Convert to lowercase by adding 32 to ASCII value
      // 32 is the difference between 'A' (65) and 'a' (97)
      const lowercaseChar = String.fromCharCode(asciiVal + 32);
      result += lowercaseChar;
    } else {
      // Keep non-uppercase characters as they are
      result += char;
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(n) for the result string
class Solution {
    public String toLowerCase(String s) {
        // Convert string to character array for easier manipulation
        char[] chars = s.toCharArray();

        // Iterate through each character in the array
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];

            // Check if the character is an uppercase letter (ASCII 65-90)
            if (c >= 'A' && c <= 'Z') {
                // Convert to lowercase by adding 32 to ASCII value
                // In Java, char arithmetic automatically uses ASCII values
                // 32 is the difference between 'A' (65) and 'a' (97)
                chars[i] = (char)(c + 32);
            }
            // Non-uppercase characters remain unchanged
        }

        // Convert character array back to string
        return new String(chars);
    }
}
```

</div>

**Note:** In a real interview, you could simply use the built-in `s.lower()` (Python), `s.toLowerCase()` (JavaScript/Java), but interviewers often want to see that you understand how it works internally. The manual approach above demonstrates your understanding of ASCII values and character manipulation.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through each character of the string exactly once
- Each iteration performs constant-time operations: ASCII value check and possibly conversion
- `n` represents the length of the input string

**Space Complexity: O(n)**

- We need to store the result string, which has the same length as the input
- In Python and JavaScript implementations, we build a new string
- In the Java implementation using char array, we modify in-place but still need the array (which is O(n))
- If we could modify the input string directly (not possible in most languages since strings are immutable), space complexity could be O(1)

## Common Mistakes

1. **Forgetting that strings are immutable in many languages**: In Python, JavaScript, and Java, strings are immutable. Candidates sometimes try to modify characters directly (`s[i] = newChar`), which won't work. You need to build a new string or convert to a mutable data structure first.

2. **Incorrect ASCII range checks**: Mixing up the ranges for uppercase (65-90) and lowercase (97-122) letters. A good mnemonic: 'A' is 65, 'Z' is 90, 'a' is 97, 'z' is 122.

3. **Adding 32 to non-letter characters**: Some candidates forget to check if a character is uppercase before converting. Adding 32 to a space (ASCII 32) would give '@' (ASCII 64), which is incorrect.

4. **Using magic numbers without explanation**: In an interview, always explain why you're adding 32. Say: "I'm adding 32 because that's the difference between uppercase 'A' (ASCII 65) and lowercase 'a' (ASCII 97) in the ASCII table."

## When You'll See This Pattern

This character arithmetic pattern appears in many string manipulation problems:

1. **Capitalize the Title (LeetCode 2129)**: Similar logic but with additional rules about word length. You need to check each word and apply case conversion based on length.

2. **Detect Capital Use (LeetCode 520)**: Checking if a word uses capitals correctly involves similar character case checking logic.

3. **Letter Case Permutation (LeetCode 784)**: Generating all permutations by changing letter cases uses the same character conversion logic but in a backtracking context.

4. **Valid Palindrome (LeetCode 125)**: Often requires converting all characters to lowercase (or uppercase) before comparing.

The core pattern is: iterate through characters, check their ASCII values or use character comparison, and apply transformations based on those values.

## Key Takeaways

1. **Understand ASCII encoding**: Knowing that uppercase and lowercase letters are exactly 32 apart in ASCII is fundamental for many string problems. This pattern extends to other character manipulations as well.

2. **Character-by-character processing**: Many string problems require examining or modifying each character individually. This problem teaches the basic pattern of iterating through a string and building a result.

3. **Built-in vs. manual implementation**: While using built-in methods (`toLowerCase()`, `lower()`) is acceptable, understanding how they work internally demonstrates deeper knowledge that interviewers appreciate.

4. **Immutable string handling**: This problem reinforces the need to build new strings or use mutable alternatives (like char arrays in Java) when modifying strings.

Related problems: [Capitalize the Title](/problem/capitalize-the-title)
