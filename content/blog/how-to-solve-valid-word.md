---
title: "How to Solve Valid Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Word. Easy difficulty, 50.9% acceptance rate. Topics: String."
date: "2028-09-12"
category: "dsa-patterns"
tags: ["valid-word", "string", "easy"]
---

# How to Solve Valid Word

This problem asks us to validate a string against four simple rules: minimum length, allowed characters, presence of at least one vowel, and presence of at least one consonant. While each rule is straightforward individually, the challenge lies in implementing them correctly without missing edge cases. The interesting part is that we need to check multiple conditions efficiently while handling character classification (vowel vs. consonant) and character validation.

## Visual Walkthrough

Let's trace through the example `"a3$"`:

1. **Check minimum length**: The string has 3 characters, so it passes the length requirement.
2. **Check allowed characters**: We examine each character:
   - `'a'` is a lowercase letter → valid
   - `'3'` is a digit → valid
   - `'$'` is neither letter nor digit → **INVALID**

Since we found an invalid character, we can immediately return `false` without checking the vowel/consonant conditions.

Now let's trace `"234Adas"`:

1. **Length check**: 7 characters ≥ 3 → passes
2. **Character validation**: All characters are letters or digits → passes
3. **Vowel check**: We need at least one vowel. Scanning the string:
   - `'2'`, `'3'`, `'4'` are digits (not vowels)
   - `'A'` is an uppercase vowel → found a vowel!
4. **Consonant check**: We need at least one consonant. Scanning the string:
   - `'2'`, `'3'`, `'4'` are digits (not consonants)
   - `'A'` is a vowel (not a consonant)
   - `'d'` is a lowercase consonant → found a consonant!

All conditions satisfied, so we return `true`.

## Brute Force Approach

The brute force approach would be to check each condition separately with multiple passes through the string:

1. First pass: Check if length ≥ 3
2. Second pass: Check if all characters are valid (letters or digits)
3. Third pass: Check for at least one vowel
4. Fourth pass: Check for at least one consonant

While this approach is correct, it's inefficient because we're making up to 4 passes through the string. However, since the problem constraints are simple and strings can be processed in O(n) time anyway, the "brute force" approach is actually quite reasonable. The real issue isn't performance but rather implementation correctness.

What makes this problem tricky is that candidates often:

- Forget that digits are allowed characters
- Misclassify 'y' as a vowel (it's not in this problem)
- Don't handle uppercase letters correctly
- Check vowel/consonant conditions even when invalid characters are present

## Optimal Solution

We can solve this efficiently with a single pass through the string. We'll maintain flags for whether we've seen a vowel and a consonant, and immediately return `false` if we encounter any invalid character. This approach is optimal because we must examine each character at least once to validate it.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) as we only use a few boolean variables
def isValid(word):
    # Step 1: Check minimum length requirement
    if len(word) < 3:
        return False

    # Step 2: Initialize flags for vowel and consonant presence
    has_vowel = False
    has_consonant = False

    # Step 3: Define sets for quick character classification
    vowels = set('aeiouAEIOU')
    letters = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

    # Step 4: Single pass through the string
    for char in word:
        # Check if character is a letter
        if char in letters:
            # Check if it's a vowel
            if char in vowels:
                has_vowel = True
            else:
                # It's a consonant (letter but not vowel)
                has_consonant = True
        # Check if character is a digit
        elif char.isdigit():
            # Digits don't affect vowel/consonant checks
            continue
        else:
            # Invalid character found - return false immediately
            return False

    # Step 5: Final check - must have both vowel and consonant
    return has_vowel and has_consonant
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) as we only use a few boolean variables
function isValid(word) {
  // Step 1: Check minimum length requirement
  if (word.length < 3) {
    return false;
  }

  // Step 2: Initialize flags for vowel and consonant presence
  let hasVowel = false;
  let hasConsonant = false;

  // Step 3: Define sets for quick character classification
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Step 4: Single pass through the string
  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    // Check if character is a letter
    if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
      // Check if it's a vowel
      if (vowels.has(char)) {
        hasVowel = true;
      } else {
        // It's a consonant (letter but not vowel)
        hasConsonant = true;
      }
    }
    // Check if character is a digit
    else if (char >= "0" && char <= "9") {
      // Digits don't affect vowel/consonant checks
      continue;
    } else {
      // Invalid character found - return false immediately
      return false;
    }
  }

  // Step 5: Final check - must have both vowel and consonant
  return hasVowel && hasConsonant;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) as we only use a few boolean variables
public boolean isValid(String word) {
    // Step 1: Check minimum length requirement
    if (word.length() < 3) {
        return false;
    }

    // Step 2: Initialize flags for vowel and consonant presence
    boolean hasVowel = false;
    boolean hasConsonant = false;

    // Step 3: Define string of vowels for quick checking
    String vowels = "aeiouAEIOU";

    // Step 4: Single pass through the string
    for (int i = 0; i < word.length(); i++) {
        char c = word.charAt(i);

        // Check if character is a letter
        if (Character.isLetter(c)) {
            // Check if it's a vowel
            if (vowels.indexOf(c) != -1) {
                hasVowel = true;
            } else {
                // It's a consonant (letter but not vowel)
                hasConsonant = true;
            }
        }
        // Check if character is a digit
        else if (Character.isDigit(c)) {
            // Digits don't affect vowel/consonant checks
            continue;
        } else {
            // Invalid character found - return false immediately
            return false;
        }
    }

    // Step 5: Final check - must have both vowel and consonant
    return hasVowel && hasConsonant;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. We make a single pass through the string, performing constant-time operations for each character (checking if it's a letter, digit, vowel, etc.). Even if we used multiple passes, the time complexity would still be O(n), but the single-pass approach has better constant factors.

**Space Complexity: O(1)** for all implementations. We only use a few boolean variables and, in some implementations, a small fixed-size set or string for vowel checking. The space used does not grow with the input size.

## Common Mistakes

1. **Forgetting that digits are allowed characters**: Some candidates only check for letters and reject digits. Remember the problem states "only digits (0-9), and English letters" - digits are explicitly allowed.

2. **Incorrect vowel classification**:
   - Including 'y' or 'Y' as vowels (they're not in standard English vowel classification for this problem)
   - Not handling both uppercase and lowercase vowels
   - Using incomplete vowel sets (forgetting some vowels)

3. **Checking vowel/consonant conditions when invalid characters are present**: The optimal approach is to return `false` immediately when encountering any invalid character, rather than continuing to check other conditions.

4. **Not handling edge cases properly**:
   - Empty string or string with length < 3
   - Strings with only digits (will fail vowel check)
   - Strings with only vowels (will fail consonant check)
   - Strings with only consonants (will fail vowel check)

## When You'll See This Pattern

This problem uses **character classification and validation**, a common pattern in string processing problems. You'll see similar patterns in:

1. **Valid Palindrome (LeetCode 125)** - Validates if a string is a palindrome, requiring character classification (letters/digits) and case normalization.
2. **Strong Password Checker (LeetCode 420)** - Validates password strength with multiple conditions similar to this problem.
3. **Valid Number (LeetCode 65)** - Validates if a string represents a valid number, requiring careful character-by-character validation with state tracking.

The core technique is **iterating through a string while tracking multiple conditions**, which appears in many string validation problems.

## Key Takeaways

1. **Single-pass validation is optimal**: When checking multiple conditions on a string, you can often do it in one pass by maintaining state variables (like `hasVowel` and `hasConsonant`).

2. **Early termination improves efficiency**: If you encounter an invalid character, return `false` immediately rather than continuing to process the rest of the string.

3. **Character classification requires careful implementation**: Always double-check your character sets (vowels, letters, digits) and ensure you're handling both uppercase and lowercase correctly.

[Practice this problem on CodeJeet](/problem/valid-word)
