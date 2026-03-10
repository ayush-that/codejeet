---
title: "How to Solve Find Most Frequent Vowel and Consonant — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Most Frequent Vowel and Consonant. Easy difficulty, 89.3% acceptance rate. Topics: Hash Table, String, Counting."
date: "2028-09-21"
category: "dsa-patterns"
tags: ["find-most-frequent-vowel-and-consonant", "hash-table", "string", "counting", "easy"]
---

# How to Solve "Find Most Frequent Vowel and Consonant"

This problem asks us to find the most frequent vowel and the most frequent consonant in a given string. While it sounds straightforward, the challenge lies in correctly handling edge cases like ties, empty strings, and strings with no vowels or consonants. You need to maintain separate counts for vowels and consonants while tracking maximums efficiently.

## Visual Walkthrough

Let's trace through an example: `s = "hello world"`

**Step 1: Identify vowels and consonants**

- Vowels: a, e, i, o, u
- Consonants: all other lowercase letters (b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z)

**Step 2: Process each character**

- 'h': consonant → count['h'] = 1
- 'e': vowel → count['e'] = 1
- 'l': consonant → count['l'] = 1
- 'l': consonant → count['l'] = 2
- 'o': vowel → count['o'] = 1
- ' ': skip (not a letter)
- 'w': consonant → count['w'] = 1
- 'o': vowel → count['o'] = 2
- 'r': consonant → count['r'] = 1
- 'l': consonant → count['l'] = 3
- 'd': consonant → count['d'] = 1

**Step 3: Find maximums**

- Vowels: 'e' (1), 'o' (2) → max vowel = 'o' with count 2
- Consonants: 'h' (1), 'l' (3), 'w' (1), 'r' (1), 'd' (1) → max consonant = 'l' with count 3

**Step 4: Handle ties**
If multiple vowels have the same maximum frequency, we need to return the one that appears first in the string. Same for consonants.

## Brute Force Approach

A naive approach might involve:

1. First pass: Count all letters
2. Second pass: Filter vowels and find max
3. Third pass: Filter consonants and find max
4. Handle ties by scanning the string again

This approach works but is inefficient in terms of code complexity (though not time complexity, which remains O(n)). The main issue is the multiple passes and complex tie-breaking logic. A cleaner solution processes everything in a single pass.

Here's what the brute force might look like:

```python
def brute_force(s):
    # Count all characters
    counts = {}
    for char in s:
        if char.isalpha():
            counts[char] = counts.get(char, 0) + 1

    # Find max vowel
    max_vowel = None
    max_vowel_count = 0
    vowels = set('aeiou')

    for char in counts:
        if char in vowels:
            if counts[char] > max_vowel_count:
                max_vowel = char
                max_vowel_count = counts[char]

    # Find max consonant
    max_consonant = None
    max_consonant_count = 0

    for char in counts:
        if char not in vowels:
            if counts[char] > max_consonant_count:
                max_consonant = char
                max_consonant_count = counts[char]

    return max_vowel, max_consonant
```

The problem with this approach is that it doesn't handle ties correctly according to the problem requirements (first occurrence in the string). To fix that, we'd need additional passes through the string.

## Optimal Solution

The optimal solution uses a single pass through the string while maintaining:

1. Frequency counts for vowels and consonants separately
2. Current maximum frequencies
3. Current best vowel and consonant
4. A way to handle ties by checking first occurrence

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) since we store at most 26 letters
def findMostFrequentVowelAndConsonant(s):
    # Define vowel set for quick lookup
    vowels = set('aeiou')

    # Initialize frequency dictionaries
    vowel_count = {}
    consonant_count = {}

    # Track current maximums
    max_vowel = None
    max_vowel_freq = 0
    max_consonant = None
    max_consonant_freq = 0

    # Process each character in the string
    for i, char in enumerate(s):
        # Skip non-lowercase letters
        if not ('a' <= char <= 'z'):
            continue

        if char in vowels:
            # Update vowel frequency
            vowel_count[char] = vowel_count.get(char, 0) + 1
            current_count = vowel_count[char]

            # Check if this vowel has higher frequency than current max
            # OR same frequency but appears earlier in the string
            if (current_count > max_vowel_freq or
                (current_count == max_vowel_freq and
                 s.find(char) < s.find(max_vowel))):
                max_vowel = char
                max_vowel_freq = current_count
        else:
            # Update consonant frequency
            consonant_count[char] = consonant_count.get(char, 0) + 1
            current_count = consonant_count[char]

            # Check if this consonant has higher frequency than current max
            # OR same frequency but appears earlier in the string
            if (current_count > max_consonant_freq or
                (current_count == max_consonant_freq and
                 s.find(char) < s.find(max_consonant))):
                max_consonant = char
                max_consonant_freq = current_count

    return max_vowel, max_consonant
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) since we store at most 26 letters
function findMostFrequentVowelAndConsonant(s) {
  // Define vowel set for quick lookup
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  // Initialize frequency maps
  const vowelCount = new Map();
  const consonantCount = new Map();

  // Track current maximums
  let maxVowel = null;
  let maxVowelFreq = 0;
  let maxConsonant = null;
  let maxConsonantFreq = 0;

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Skip non-lowercase letters
    if (char < "a" || char > "z") {
      continue;
    }

    if (vowels.has(char)) {
      // Update vowel frequency
      const currentCount = (vowelCount.get(char) || 0) + 1;
      vowelCount.set(char, currentCount);

      // Check if this vowel has higher frequency than current max
      // OR same frequency but appears earlier in the string
      if (
        currentCount > maxVowelFreq ||
        (currentCount === maxVowelFreq && s.indexOf(char) < s.indexOf(maxVowel))
      ) {
        maxVowel = char;
        maxVowelFreq = currentCount;
      }
    } else {
      // Update consonant frequency
      const currentCount = (consonantCount.get(char) || 0) + 1;
      consonantCount.set(char, currentCount);

      // Check if this consonant has higher frequency than current max
      // OR same frequency but appears earlier in the string
      if (
        currentCount > maxConsonantFreq ||
        (currentCount === maxConsonantFreq &&
          (maxConsonant === null || s.indexOf(char) < s.indexOf(maxConsonant)))
      ) {
        maxConsonant = char;
        maxConsonantFreq = currentCount;
      }
    }
  }

  return [maxVowel, maxConsonant];
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) since we store at most 26 letters
import java.util.*;

public class Solution {
    public static String[] findMostFrequentVowelAndConsonant(String s) {
        // Define vowel set for quick lookup
        Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u'));

        // Initialize frequency maps
        Map<Character, Integer> vowelCount = new HashMap<>();
        Map<Character, Integer> consonantCount = new HashMap<>();

        // Track current maximums
        Character maxVowel = null;
        int maxVowelFreq = 0;
        Character maxConsonant = null;
        int maxConsonantFreq = 0;

        // Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);

            // Skip non-lowercase letters
            if (ch < 'a' || ch > 'z') {
                continue;
            }

            if (vowels.contains(ch)) {
                // Update vowel frequency
                int currentCount = vowelCount.getOrDefault(ch, 0) + 1;
                vowelCount.put(ch, currentCount);

                // Check if this vowel has higher frequency than current max
                // OR same frequency but appears earlier in the string
                if (currentCount > maxVowelFreq ||
                    (currentCount == maxVowelFreq &&
                     s.indexOf(ch) < s.indexOf(maxVowel))) {
                    maxVowel = ch;
                    maxVowelFreq = currentCount;
                }
            } else {
                // Update consonant frequency
                int currentCount = consonantCount.getOrDefault(ch, 0) + 1;
                consonantCount.put(ch, currentCount);

                // Check if this consonant has higher frequency than current max
                // OR same frequency but appears earlier in the string
                if (currentCount > maxConsonantFreq ||
                    (currentCount == maxConsonantFreq &&
                     (maxConsonant == null || s.indexOf(ch) < s.indexOf(maxConsonant)))) {
                    maxConsonant = ch;
                    maxConsonantFreq = currentCount;
                }
            }
        }

        return new String[] {
            maxVowel == null ? "" : String.valueOf(maxVowel),
            maxConsonant == null ? "" : String.valueOf(maxConsonant)
        };
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n: O(n)
- Each character lookup in the vowel set is O(1)
- Dictionary/map operations (get, put, update) are O(1) on average
- The `find`/`indexOf` operations for tie-breaking could be O(n) in worst case, but we can optimize this by storing first occurrence indices separately if needed

**Space Complexity: O(1)**

- The vowel set has fixed size 5: O(1)
- The frequency dictionaries store at most 26 lowercase letters: O(26) = O(1)
- We use a few extra variables for tracking maximums: O(1)

## Common Mistakes

1. **Forgetting to handle ties correctly**: The problem requires that when there's a tie, return the character that appears first in the string. Many candidates find the maximum frequency correctly but return the last character with that frequency instead of the first.

2. **Not filtering non-letter characters**: The input might contain spaces, punctuation, or other characters. Only lowercase English letters ('a'-'z') should be counted. Forgetting to check this leads to incorrect counts.

3. **Incorrect vowel identification**: Some candidates hardcode vowel checks with multiple OR conditions instead of using a set. This works but is error-prone and less efficient. Worse, some might forget that 'y' is not considered a vowel in this problem.

4. **Edge case handling**:
   - Empty string: Should return null/empty for both vowel and consonant
   - String with no vowels: Should return null/empty for vowel
   - String with no consonants: Should return null/empty for consonant
   - String with only non-letter characters: Should return null/empty for both

## When You'll See This Pattern

This frequency counting pattern appears in many string manipulation problems:

1. **First Unique Character in a String (LeetCode 387)**: Similar frequency counting, but looking for count of 1 instead of maximum.

2. **Sort Characters By Frequency (LeetCode 451)**: Count frequencies then sort by frequency rather than finding maximum.

3. **Majority Element (LeetCode 169)**: Finding the element that appears more than n/2 times uses similar counting logic.

4. **Ransom Note (LeetCode 383)**: Compare frequency counts between two strings.

The core pattern is: when you need to analyze character or element frequencies, use a hash map/dictionary to count occurrences, then process those counts to find what you need (max, min, specific values, etc.).

## Key Takeaways

1. **Frequency counting with hash maps** is a fundamental technique for string analysis problems. When you need to track how many times elements appear, reach for a dictionary/hash map first.

2. **Process and decide in a single pass** when possible. While multiple passes might be simpler to code, single-pass solutions are often more efficient and impressive in interviews.

3. **Always consider tie-breaking rules** and edge cases. Interviewers love to test if you think about all requirements, not just the happy path. Read the problem statement carefully for any ordering requirements.

4. **Use sets for membership testing** when you have a fixed collection of values to check against (like vowels). It's cleaner and more efficient than multiple OR conditions.

[Practice this problem on CodeJeet](/problem/find-most-frequent-vowel-and-consonant)
