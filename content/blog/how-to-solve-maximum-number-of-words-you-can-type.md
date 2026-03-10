---
title: "How to Solve Maximum Number of Words You Can Type — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Number of Words You Can Type. Easy difficulty, 82.9% acceptance rate. Topics: Hash Table, String."
date: "2028-06-30"
category: "dsa-patterns"
tags: ["maximum-number-of-words-you-can-type", "hash-table", "string", "easy"]
---

# How to Solve Maximum Number of Words You Can Type

This problem asks us to count how many words from a given text can be fully typed when certain letters on the keyboard are broken. The challenge lies in efficiently checking each word against a set of broken letters without repeatedly scanning the broken letters string. While conceptually simple, this problem tests your ability to choose the right data structure for membership checks.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `text = "hello world leetcode"`, `brokenLetters = "e"`

**Step 1:** Split the text into words: `["hello", "world", "leetcode"]`

**Step 2:** Create a set of broken letters for fast lookup: `{'e'}`

**Step 3:** Check each word:

- "hello": Contains 'e' → cannot type this word
- "world": Does NOT contain 'e' → can type this word
- "leetcode": Contains 'e' → cannot type this word

**Result:** Only 1 word ("world") can be typed.

**Key Insight:** We need to check if ANY character in a word exists in the broken letters. Once we find one broken character, we know the word cannot be typed.

## Brute Force Approach

A naive approach would be to check each character of each word against the entire broken letters string:

1. Split the text into words
2. For each word, for each character in the word, check if it exists in brokenLetters by scanning the entire string
3. If no character from brokenLetters is found in the word, count it

This approach has a major inefficiency: for each character check, we're scanning the entire brokenLetters string, which could be up to 26 characters long. While this might be acceptable for small inputs, it's not optimal.

The time complexity would be O(n × m × k) where:

- n = number of words
- m = average word length
- k = length of brokenLetters

This is inefficient because we're repeatedly scanning the broken letters for each character check.

## Optimal Solution

The optimal solution uses a hash set to store the broken letters, allowing O(1) lookup time for each character check. Here's the step-by-step approach:

1. **Convert brokenLetters to a set** - This gives us O(1) membership checks
2. **Split the text into words** - Using space as the delimiter
3. **Initialize a counter** - To track how many words can be typed
4. **For each word**:
   - Check if any character in the word exists in the broken letters set
   - If NO broken letters are found, increment the counter
5. **Return the counter**

The key optimization is using a set for O(1) lookups instead of scanning the brokenLetters string repeatedly.

<div class="code-group">

```python
# Time: O(n + m) where n is total characters in text, m is length of brokenLetters
# Space: O(k) where k is number of broken letters (max 26)
def canBeTypedWords(text: str, brokenLetters: str) -> int:
    # Step 1: Convert broken letters to a set for O(1) lookups
    broken_set = set(brokenLetters)

    # Step 2: Split the text into individual words
    words = text.split()

    # Step 3: Initialize counter for typable words
    typable_count = 0

    # Step 4: Check each word
    for word in words:
        # Assume the word can be typed until proven otherwise
        can_type = True

        # Check each character in the word
        for char in word:
            # If any character is broken, mark as untypable
            if char in broken_set:
                can_type = False
                # No need to check remaining characters
                break

        # If the word passed all checks, count it
        if can_type:
            typable_count += 1

    # Step 5: Return the final count
    return typable_count
```

```javascript
// Time: O(n + m) where n is total characters in text, m is length of brokenLetters
// Space: O(k) where k is number of broken letters (max 26)
function canBeTypedWords(text, brokenLetters) {
  // Step 1: Convert broken letters to a set for O(1) lookups
  const brokenSet = new Set(brokenLetters);

  // Step 2: Split the text into individual words
  const words = text.split(" ");

  // Step 3: Initialize counter for typable words
  let typableCount = 0;

  // Step 4: Check each word
  for (const word of words) {
    // Assume the word can be typed until proven otherwise
    let canType = true;

    // Check each character in the word
    for (const char of word) {
      // If any character is broken, mark as untypable
      if (brokenSet.has(char)) {
        canType = false;
        // No need to check remaining characters
        break;
      }
    }

    // If the word passed all checks, count it
    if (canType) {
      typableCount++;
    }
  }

  // Step 5: Return the final count
  return typableCount;
}
```

```java
// Time: O(n + m) where n is total characters in text, m is length of brokenLetters
// Space: O(k) where k is number of broken letters (max 26)
class Solution {
    public int canBeTypedWords(String text, String brokenLetters) {
        // Step 1: Convert broken letters to a set for O(1) lookups
        Set<Character> brokenSet = new HashSet<>();
        for (char c : brokenLetters.toCharArray()) {
            brokenSet.add(c);
        }

        // Step 2: Split the text into individual words
        String[] words = text.split(" ");

        // Step 3: Initialize counter for typable words
        int typableCount = 0;

        // Step 4: Check each word
        for (String word : words) {
            // Assume the word can be typed until proven otherwise
            boolean canType = true;

            // Check each character in the word
            for (char c : word.toCharArray()) {
                // If any character is broken, mark as untypable
                if (brokenSet.contains(c)) {
                    canType = false;
                    // No need to check remaining characters
                    break;
                }
            }

            // If the word passed all checks, count it
            if (canType) {
                typableCount++;
            }
        }

        // Step 5: Return the final count
        return typableCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m)

- `n` is the total number of characters in the text
- `m` is the length of brokenLetters
- We iterate through all characters in text once to check them
- We iterate through brokenLetters once to build the set
- Each character check is O(1) due to the hash set

**Space Complexity:** O(k)

- `k` is the number of broken letters (maximum 26 since there are only 26 lowercase English letters)
- We store the broken letters in a hash set
- The space for splitting words is O(n) but this is input-dependent and not additional space

## Common Mistakes

1. **Not using a set for broken letters**: Some candidates scan the brokenLetters string for each character check, resulting in O(n × m × k) time complexity instead of O(n + m).

2. **Forgetting to break early**: When you find a broken character in a word, you should immediately stop checking that word. Continuing to check is wasteful.

3. **Incorrect splitting**: Using `split()` without specifying space as delimiter, or not handling multiple spaces (though the problem guarantees single spaces).

4. **Case sensitivity issues**: The problem states all letters are lowercase English letters, but some candidates might unnecessarily handle case conversion.

5. **Not handling empty brokenLetters**: When brokenLetters is empty, all words can be typed. The set approach handles this correctly (empty set means no broken letters).

## When You'll See This Pattern

This problem uses the **"hash set for fast membership checks"** pattern, which appears in many string and array problems:

1. **Two Sum** (LeetCode 1) - Uses a hash map to store seen numbers for O(1) lookups
2. **Contains Duplicate** (LeetCode 217) - Uses a hash set to check for duplicates
3. **Jewels and Stones** (LeetCode 771) - Count how many stones are jewels using a set for O(1) jewel checks
4. **Unique Email Addresses** (LeetCode 929) - Uses a set to store unique processed email addresses

The pattern is: when you need to repeatedly check if elements exist in a collection, convert the collection to a hash set for O(1) lookups.

## Key Takeaways

1. **Use sets for membership testing**: When you need to check if elements exist in a collection multiple times, a hash set provides O(1) lookups vs O(n) for linear search.

2. **Break early when possible**: Once you determine a word cannot be typed (contains a broken letter), stop checking the rest of its characters.

3. **Read constraints carefully**: The problem specifies lowercase English letters and single spaces between words. These constraints simplify the solution.

4. **Think about worst-case scenarios**: Even though there are only 26 possible letters, using a set demonstrates you understand algorithmic efficiency principles.

[Practice this problem on CodeJeet](/problem/maximum-number-of-words-you-can-type)
