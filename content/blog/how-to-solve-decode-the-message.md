---
title: "How to Solve Decode the Message — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Decode the Message. Easy difficulty, 85.8% acceptance rate. Topics: Hash Table, String."
date: "2026-09-05"
category: "dsa-patterns"
tags: ["decode-the-message", "hash-table", "string", "easy"]
---

# How to Solve Decode the Message

This problem asks us to decode a secret message using a substitution cipher. We're given a `key` string that defines the mapping: the first occurrence of each lowercase letter in the key becomes a mapping from that letter to the corresponding letter in the alphabet (a→a, b→b, etc.). The `message` is then decoded by substituting each letter according to this mapping, leaving spaces unchanged.

What makes this problem interesting is that it's a straightforward hash table application, but requires careful attention to:

1. Building the mapping correctly (only first occurrences matter)
2. Preserving spaces in the message
3. Handling the fact that the key might contain duplicates and non-letter characters

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
key = "the quick brown fox jumps over the lazy dog"
message = "vkbs bs t suepuv"
```

**Step 1: Build the substitution table**
We process the key left to right, tracking first occurrences:

- 't' → first letter → maps to 'a'
- 'h' → second unique letter → maps to 'b'
- 'e' → third unique letter → maps to 'c'
- ' ' (space) → skip, not a lowercase letter
- 'q' → fourth unique letter → maps to 'd'
- 'u' → fifth unique letter → maps to 'e'
- 'i' → sixth unique letter → maps to 'f'
- 'c' → seventh unique letter → maps to 'g'
- 'k' → eighth unique letter → maps to 'h'
- ... and so on until we have all 26 letters

The complete mapping becomes:

```
t→a, h→b, e→c, q→d, u→e, i→f, c→g, k→h, b→i, r→j, o→k, w→l, n→m, f→n, x→o, j→p, m→q, p→r, s→s, v→t, l→u, a→v, z→w, y→x, d→y, g→z
```

**Step 2: Decode the message**
Message: "vkbs bs t suepuv"

- 'v' → maps to 't'
- 'k' → maps to 'h'
- 'b' → maps to 'i'
- 's' → maps to 's'
- ' ' → space remains ' '
- 'b' → maps to 'i'
- 's' → maps to 's'
- ' ' → space remains ' '
- 't' → maps to 'a'
- ' ' → space remains ' '
- 's' → maps to 's'
- 'u' → maps to 'e'
- 'e' → maps to 'c'
- 'p' → maps to 'r'
- 'u' → maps to 'e'
- 'v' → maps to 't'

**Result:** "this is a secret"

## Brute Force Approach

A naive approach might try to:

1. Create a list of 26 empty slots for the mapping
2. For each character in the key:
   - If it's a lowercase letter and not already in our mapping
   - Find which letter of the alphabet it should map to by checking how many unique letters we've seen so far
3. For each character in the message:
   - Search through our mapping to find the corresponding decoded character

The problem with this approach is the searching step. For each character in the message (up to length n), we might need to search through up to 26 entries in our mapping. While 26 is constant, this approach is less efficient and more error-prone than using a hash table for O(1) lookups.

More importantly, the brute force approach often leads to off-by-one errors when trying to manually track which alphabet letter corresponds to each key letter. Using a hash table with proper iteration is cleaner and less bug-prone.

## Optimal Solution

The optimal solution uses a hash table (dictionary/map) to store the substitution mapping. We iterate through the key once to build the mapping, then iterate through the message once to decode it. This gives us O(n + m) time complexity where n is the length of the key and m is the length of the message.

<div class="code-group">

```python
# Time: O(n + m) where n = len(key), m = len(message)
# Space: O(1) for the mapping (fixed 26 letters) + O(m) for the result
def decodeMessage(key: str, message: str) -> str:
    # Step 1: Create an empty dictionary to store our substitution mapping
    # This will map each letter in the key to its corresponding decoded letter
    substitution = {}

    # Step 2: We need to track which letter of the alphabet we're assigning next
    # Start with 'a' as the first decoded letter
    next_decoded_char = 'a'

    # Step 3: Build the substitution table from the key
    for char in key:
        # Only process lowercase letters that we haven't seen before
        if char.islower() and char not in substitution:
            # Map this key character to the next available alphabet letter
            substitution[char] = next_decoded_char

            # Move to the next alphabet letter for the next unique character
            # chr(ord('a') + 1) gives 'b', chr(ord('a') + 2) gives 'c', etc.
            next_decoded_char = chr(ord(next_decoded_char) + 1)

            # Optimization: If we've mapped all 26 letters, we can stop early
            if next_decoded_char > 'z':
                break

    # Step 4: Decode the message using our substitution table
    decoded_chars = []

    for char in message:
        if char == ' ':
            # Spaces remain unchanged
            decoded_chars.append(' ')
        else:
            # Look up the character in our substitution table
            # Since the problem guarantees the message only contains valid characters,
            # we don't need to check if char is in substitution
            decoded_chars.append(substitution[char])

    # Step 5: Join all characters to form the final decoded string
    return ''.join(decoded_chars)
```

```javascript
// Time: O(n + m) where n = key.length, m = message.length
// Space: O(1) for the mapping (fixed 26 letters) + O(m) for the result
function decodeMessage(key, message) {
  // Step 1: Create an empty map to store our substitution mapping
  const substitution = new Map();

  // Step 2: Track which letter of the alphabet we're assigning next
  let nextDecodedChar = "a".charCodeAt(0); // Start with ASCII value of 'a'

  // Step 3: Build the substitution table from the key
  for (let i = 0; i < key.length; i++) {
    const char = key[i];

    // Only process lowercase letters that we haven't seen before
    if (char >= "a" && char <= "z" && !substitution.has(char)) {
      // Map this key character to the next available alphabet letter
      substitution.set(char, String.fromCharCode(nextDecodedChar));

      // Move to the next alphabet letter
      nextDecodedChar++;

      // Optimization: If we've mapped all 26 letters, stop early
      if (nextDecodedChar > "z".charCodeAt(0)) {
        break;
      }
    }
  }

  // Step 4: Decode the message using our substitution table
  let decodedMessage = "";

  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    if (char === " ") {
      // Spaces remain unchanged
      decodedMessage += " ";
    } else {
      // Look up the character in our substitution map
      decodedMessage += substitution.get(char);
    }
  }

  // Step 5: Return the decoded message
  return decodedMessage;
}
```

```java
// Time: O(n + m) where n = key.length(), m = message.length()
// Space: O(1) for the mapping (fixed 26 letters) + O(m) for the result
class Solution {
    public String decodeMessage(String key, String message) {
        // Step 1: Create a hash map to store our substitution mapping
        // Character is the key from the input, Character is the decoded letter
        Map<Character, Character> substitution = new HashMap<>();

        // Step 2: Track which letter of the alphabet we're assigning next
        // Start with 'a' as the first decoded letter
        char nextDecodedChar = 'a';

        // Step 3: Build the substitution table from the key
        for (int i = 0; i < key.length(); i++) {
            char currentChar = key.charAt(i);

            // Only process lowercase letters that we haven't seen before
            if (currentChar != ' ' && !substitution.containsKey(currentChar)) {
                // Map this key character to the next available alphabet letter
                substitution.put(currentChar, nextDecodedChar);

                // Move to the next alphabet letter
                nextDecodedChar++;

                // Optimization: If we've mapped all 26 letters, stop early
                if (nextDecodedChar > 'z') {
                    break;
                }
            }
        }

        // Step 4: Decode the message using our substitution table
        StringBuilder decodedMessage = new StringBuilder();

        for (int i = 0; i < message.length(); i++) {
            char currentChar = message.charAt(i);

            if (currentChar == ' ') {
                // Spaces remain unchanged
                decodedMessage.append(' ');
            } else {
                // Look up the character in our substitution map
                decodedMessage.append(substitution.get(currentChar));
            }
        }

        // Step 5: Return the decoded message as a String
        return decodedMessage.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the substitution table: We iterate through the `key` string once, which takes O(n) time where n is the length of the key. We process each character once, and hash table operations (checking if a character exists and inserting it) are O(1) on average.
- Decoding the message: We iterate through the `message` string once, which takes O(m) time where m is the length of the message. Each lookup in the hash table is O(1) on average.
- Total: O(n + m)

**Space Complexity: O(1) for the mapping + O(m) for the result**

- The substitution table stores at most 26 entries (one for each lowercase letter), which is constant space: O(1).
- The result string requires O(m) space to store the decoded message.
- Total: O(m) (since m could be larger than 26)

## Common Mistakes

1. **Not checking for duplicates in the key**: The problem states we should use only the _first_ appearance of each letter. If you add every occurrence to your mapping, you'll overwrite earlier mappings with later ones, causing incorrect decoding.

2. **Forgetting to handle spaces**: Spaces in the message should remain as spaces. A common mistake is trying to look up spaces in the substitution table, which will cause an error since spaces aren't in the mapping.

3. **Incorrect alphabet assignment**: Some candidates try to use complex modulo arithmetic to assign alphabet letters. The cleanest approach is to start with `'a'` and increment to `'b'`, `'c'`, etc., using character arithmetic.

4. **Not stopping early when all 26 letters are mapped**: While not strictly necessary (iterating through the rest of the key won't change anything), it's a good optimization to break early once you've mapped all 26 letters.

## When You'll See This Pattern

This problem uses a **character mapping pattern** that appears in many string manipulation and cryptography problems:

1. **LeetCode 205: Isomorphic Strings** - Similar concept of character mapping, but here you need to check if two strings have the same character mapping pattern in both directions.

2. **LeetCode 290: Word Pattern** - Extends the character mapping concept to map words to characters, requiring bijective mapping (one-to-one correspondence).

3. **LeetCode 953: Verifying an Alien Dictionary** - Uses a custom alphabet ordering (like our substitution table) to determine if words are sorted according to that ordering.

The core pattern is: when you need to transform or compare strings based on some mapping rules, a hash table/dictionary is usually the right tool. The key insight is recognizing when you need to build the mapping dynamically (like in this problem) versus when you have a fixed mapping.

## Key Takeaways

1. **Hash tables are ideal for character mapping problems**: When you need to create a custom mapping between characters, a hash table (dictionary in Python, Map in JavaScript/Java) provides O(1) lookups and inserts.

2. **Process constraints carefully**: The requirement to use only the _first_ appearance of each letter is crucial. Always re-read problem constraints before implementing.

3. **Character arithmetic simplifies alphabet operations**: Instead of maintaining a separate alphabet string or array, you can use character codes (`ord()` in Python, `charCodeAt()` in JavaScript, implicit casting in Java) to iterate through the alphabet cleanly.

[Practice this problem on CodeJeet](/problem/decode-the-message)
