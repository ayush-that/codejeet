---
title: "How to Solve Count the Number of Special Characters I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count the Number of Special Characters I. Easy difficulty, 66.7% acceptance rate. Topics: Hash Table, String."
date: "2028-03-22"
category: "dsa-patterns"
tags: ["count-the-number-of-special-characters-i", "hash-table", "string", "easy"]
---

# How to Solve Count the Number of Special Characters I

This problem asks us to count how many letters appear in both lowercase and uppercase forms within a given string. While conceptually straightforward, it's an excellent exercise in character tracking and set operations. The tricky part lies in efficiently determining which letters have both forms present without double-counting or missing edge cases.

## Visual Walkthrough

Let's trace through an example: `word = "aaAbcBC"`

We need to find letters that appear as both lowercase and uppercase. Let's examine each character:

- **a**: lowercase 'a' appears at indices 0, 1. Uppercase 'A' appears at index 2. ✓ Both forms exist.
- **b**: lowercase 'b' appears at index 3. Uppercase 'B' appears at index 5. ✓ Both forms exist.
- **c**: lowercase 'c' appears at index 4. Uppercase 'C' appears at index 6. ✓ Both forms exist.
- Other letters: Only 'd' through 'z' remain, none appear in the string.

So for "aaAbcBC", we have 3 special letters: a, b, and c.

Another example: `word = "abcABC"`

- **a**: lowercase 'a' at index 0, uppercase 'A' at index 3. ✓
- **b**: lowercase 'b' at index 1, uppercase 'B' at index 4. ✓
- **c**: lowercase 'c' at index 2, uppercase 'C' at index 5. ✓

Result: 3 special letters.

Notice that we don't care about:

- How many times each form appears (once each is enough)
- The order of appearance
- Non-letter characters (though the problem guarantees only English letters)

## Brute Force Approach

A naive approach would check each letter of the alphabet (a-z) individually:

For each letter from 'a' to 'z':

1. Check if the lowercase version exists in the string
2. Check if the uppercase version exists in the string
3. If both exist, increment the count

This approach works but is inefficient because:

- We scan the entire string 52 times (26 letters × 2 checks each)
- Each existence check requires O(n) time in the worst case
- Total time complexity becomes O(26 × n) = O(n), but with a large constant factor

While this brute force approach would technically pass for this problem (since constraints are small), it's not the most elegant solution and doesn't prepare you for more complex variations.

## Optimal Solution

The optimal approach uses two sets to track which letters we've seen in lowercase and uppercase forms. We iterate through the string once, categorize each character, then check which letters appear in both sets.

**Key Insight**: A letter is special if and only if we've seen both its lowercase and uppercase forms. By tracking these separately, we can make a single pass through the string.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - sets store at most 26 entries each
def numberOfSpecialChars(word: str) -> int:
    # Step 1: Initialize two sets to track lowercase and uppercase letters
    lowercase_seen = set()
    uppercase_seen = set()

    # Step 2: Iterate through each character in the string
    for char in word:
        # Check if the character is lowercase (ASCII 'a' to 'z')
        if 'a' <= char <= 'z':
            # Add lowercase letter to the lowercase set
            lowercase_seen.add(char)
        else:
            # Character is uppercase, add to uppercase set
            # Convert to lowercase for consistent comparison later
            uppercase_seen.add(char.lower())

    # Step 3: Count letters that appear in both sets
    # The intersection of sets gives us letters with both forms
    special_count = 0
    for letter in lowercase_seen:
        if letter in uppercase_seen:
            special_count += 1

    return special_count
```

```javascript
// Time: O(n) | Space: O(1) - sets store at most 26 entries each
function numberOfSpecialChars(word) {
  // Step 1: Initialize two sets to track lowercase and uppercase letters
  const lowercaseSeen = new Set();
  const uppercaseSeen = new Set();

  // Step 2: Iterate through each character in the string
  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    // Check if the character is lowercase (ASCII 'a' to 'z')
    if (char >= "a" && char <= "z") {
      // Add lowercase letter to the lowercase set
      lowercaseSeen.add(char);
    } else {
      // Character is uppercase, add to uppercase set
      // Convert to lowercase for consistent comparison
      uppercaseSeen.add(char.toLowerCase());
    }
  }

  // Step 3: Count letters that appear in both sets
  let specialCount = 0;
  for (const letter of lowercaseSeen) {
    if (uppercaseSeen.has(letter)) {
      specialCount++;
    }
  }

  return specialCount;
}
```

```java
// Time: O(n) | Space: O(1) - sets store at most 26 entries each
public int numberOfSpecialChars(String word) {
    // Step 1: Initialize two sets to track lowercase and uppercase letters
    Set<Character> lowercaseSeen = new HashSet<>();
    Set<Character> uppercaseSeen = new HashSet<>();

    // Step 2: Iterate through each character in the string
    for (int i = 0; i < word.length(); i++) {
        char ch = word.charAt(i);

        // Check if the character is lowercase (ASCII 'a' to 'z')
        if (ch >= 'a' && ch <= 'z') {
            // Add lowercase letter to the lowercase set
            lowercaseSeen.add(ch);
        } else {
            // Character is uppercase, add to uppercase set
            // Convert to lowercase for consistent comparison
            uppercaseSeen.add(Character.toLowerCase(ch));
        }
    }

    // Step 3: Count letters that appear in both sets
    int specialCount = 0;
    for (char letter : lowercaseSeen) {
        if (uppercaseSeen.contains(letter)) {
            specialCount++;
        }
    }

    return specialCount;
}
```

</div>

**Alternative One-Pass Solution**: We can use a single integer array or map to track letter states more efficiently:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size array of 26
def numberOfSpecialChars(word: str) -> int:
    # Create an array to track letter states:
    # 0 = not seen, 1 = lowercase seen, 2 = uppercase seen, 3 = both seen
    letter_state = [0] * 26

    for char in word:
        if 'a' <= char <= 'z':
            index = ord(char) - ord('a')
            # Update state: if currently 0 or 2, add 1; if 1, keep 1; if 3, keep 3
            if letter_state[index] == 0:
                letter_state[index] = 1
            elif letter_state[index] == 2:
                letter_state[index] = 3
        else:  # uppercase
            index = ord(char.lower()) - ord('a')
            # Update state: if currently 0 or 1, add 2; if 2, keep 2; if 3, keep 3
            if letter_state[index] == 0:
                letter_state[index] = 2
            elif letter_state[index] == 1:
                letter_state[index] = 3

    # Count letters with state 3 (both forms seen)
    return sum(1 for state in letter_state if state == 3)
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n: O(n)
- The final counting step iterates through at most 26 letters: O(26) = O(1)
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- We use two sets, but each can contain at most 26 entries (one for each letter)
- The space used is constant regardless of input size: O(26) = O(1)
- Even with the array-based solution, we use a fixed-size array of 26 elements

## Common Mistakes

1. **Case-sensitive comparison errors**: Forgetting to convert uppercase letters to lowercase before comparison. If you store 'A' and 'a' as different keys, you'll never find matches. Always normalize to one case for comparison.

2. **Double-counting special letters**: If a letter appears multiple times in both forms, it should still count as 1. Using lists instead of sets might lead to counting 'a' multiple times if it appears in various positions.

3. **Incorrect character classification**: Assuming all characters are letters. While the problem states the input contains only English letters, in real interviews you might need to handle edge cases. Always verify character ranges with explicit checks.

4. **Inefficient nested loops**: Some candidates try to check each character against all others, resulting in O(n²) time. Remember that we only need to know if both forms exist, not where or how many times.

## When You'll See This Pattern

This problem uses the **"two-set intersection"** pattern, which appears in many string and counting problems:

1. **Greatest English Letter in Upper and Lower Case (Easy)**: Very similar pattern - find letters with both cases and return the greatest one alphabetically.

2. **Find Common Characters (Easy)**: Find characters that appear in all strings in an array - uses intersection of frequency maps.

3. **Jewels and Stones (Easy)**: Count how many characters from one string appear in another - essentially checking set membership.

4. **Valid Anagram (Easy)**: Compare character frequencies between two strings - similar tracking of character counts.

The core pattern is: when you need to track presence/absence of items and find overlaps, sets are your best friend. They provide O(1) lookups and automatically handle duplicates.

## Key Takeaways

1. **Sets are ideal for existence checking**: When you only care whether something exists (not how many times), use a set. It eliminates duplicates and provides fast O(1) membership testing.

2. **Normalize data for comparison**: When comparing things that are equivalent in some way (like lowercase/uppercase letters), convert them to a common form first. This simplifies logic and prevents errors.

3. **Single-pass solutions often exist**: Many counting problems can be solved in one pass through the data. Think about what information you need to track as you go, rather than revisiting the data multiple times.

Related problems: [Detect Capital](/problem/detect-capital), [Greatest English Letter in Upper and Lower Case](/problem/greatest-english-letter-in-upper-and-lower-case), [Count the Number of Special Characters II](/problem/count-the-number-of-special-characters-ii)
