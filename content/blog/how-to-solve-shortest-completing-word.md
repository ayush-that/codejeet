---
title: "How to Solve Shortest Completing Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shortest Completing Word. Easy difficulty, 62.8% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-04-30"
category: "dsa-patterns"
tags: ["shortest-completing-word", "array", "hash-table", "string", "easy"]
---

# How to Solve Shortest Completing Word

This problem asks us to find the shortest word in a list that contains all the letters from a license plate string. The challenge comes from handling case insensitivity, ignoring non-letter characters, and efficiently checking letter frequencies while tracking the shortest valid word.

**What makes this interesting:** While conceptually straightforward, this problem tests attention to detail with character filtering, frequency counting, and optimization for finding the minimum-length valid word. The optimal solution uses frequency counting, but candidates often stumble on edge cases like duplicate letters or case sensitivity.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `licensePlate = "1s3 PSt"`
- `words = ["step", "steps", "stripe", "stepple"]`

**Step 1: Process the license plate**

- Remove non-letters: "1s3 PSt" → "sPSt"
- Convert to lowercase: "spst"
- Count letter frequencies: `{'s': 2, 'p': 1, 't': 1}`

**Step 2: Check each word**

1. **"step"** → frequencies: `{'s': 1, 't': 1, 'e': 1, 'p': 1}`
   - Compare with license: needs 2 's', but only has 1 ❌
2. **"steps"** → frequencies: `{'s': 2, 't': 1, 'e': 1, 'p': 1}`
   - Has 2 's' ✓, 1 't' ✓, 1 'p' ✓
   - Length = 5, current shortest = 5 ✓
3. **"stripe"** → frequencies: `{'s': 1, 't': 1, 'r': 1, 'i': 1, 'p': 1, 'e': 1}`
   - Only has 1 's', needs 2 ❌
4. **"stepple"** → frequencies: `{'s': 1, 't': 1, 'e': 2, 'p': 2, 'l': 1}`
   - Only has 1 's', needs 2 ❌

**Result:** "steps" (length 5) is the shortest completing word.

## Brute Force Approach

A naive approach would be to check each word by scanning the license plate for each character:

1. For each word in `words`:
   - Create a mutable copy of the word
   - For each character in `licensePlate`:
     - If it's a letter, search for it in the word copy (case insensitive)
     - If found, remove it from the copy
     - If not found, this word fails
   - If all letters found, track if it's the shortest so far

**Why this is inefficient:**

- Time complexity: O(n × m × k) where n = number of words, m = length of license plate, k = average word length
- Each character search in the word copy could be O(k) if we use linear search
- We're repeatedly processing the same license plate for each word

**What candidates might try:**

- Forgetting to handle case insensitivity
- Not properly counting duplicate letters (e.g., "ss" needs two 's' characters)
- Using string replacement which modifies the original word incorrectly

## Optimal Solution

The optimal approach uses frequency counting. We count letters in the license plate once, then for each word, count its letters and compare frequencies. We track the shortest valid word.

<div class="code-group">

```python
# Time: O(N * L) where N = number of words, L = average word length
# Space: O(1) for fixed-size frequency arrays (26 letters)
def shortestCompletingWord(licensePlate, words):
    # Step 1: Count letters in license plate (case insensitive, letters only)
    license_count = [0] * 26  # 26 letters in alphabet

    for char in licensePlate:
        if char.isalpha():  # Check if character is a letter
            # Convert to lowercase and get index (0-25)
            license_count[ord(char.lower()) - ord('a')] += 1

    # Step 2: Initialize variables to track the shortest valid word
    shortest_word = None
    shortest_length = float('inf')

    # Step 3: Check each word in the list
    for word in words:
        # Count letters in current word
        word_count = [0] * 26
        for char in word:
            # All characters in words are guaranteed to be lowercase letters
            word_count[ord(char) - ord('a')] += 1

        # Step 4: Check if word contains all required letters
        valid = True
        for i in range(26):
            # Word must have at least as many of each letter as license plate
            if word_count[i] < license_count[i]:
                valid = False
                break

        # Step 5: If valid and shorter than current shortest, update
        if valid and len(word) < shortest_length:
            shortest_word = word
            shortest_length = len(word)

    return shortest_word
```

```javascript
// Time: O(N * L) where N = number of words, L = average word length
// Space: O(1) for fixed-size frequency arrays (26 letters)
function shortestCompletingWord(licensePlate, words) {
  // Step 1: Count letters in license plate (case insensitive, letters only)
  const licenseCount = new Array(26).fill(0);

  for (let char of licensePlate) {
    if (/[a-zA-Z]/.test(char)) {
      // Check if character is a letter
      // Convert to lowercase and get index (0-25)
      const index = char.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
      licenseCount[index]++;
    }
  }

  // Step 2: Initialize variables to track the shortest valid word
  let shortestWord = null;
  let shortestLength = Infinity;

  // Step 3: Check each word in the list
  for (let word of words) {
    // Count letters in current word
    const wordCount = new Array(26).fill(0);
    for (let char of word) {
      // All characters in words are guaranteed to be lowercase letters
      const index = char.charCodeAt(0) - "a".charCodeAt(0);
      wordCount[index]++;
    }

    // Step 4: Check if word contains all required letters
    let valid = true;
    for (let i = 0; i < 26; i++) {
      // Word must have at least as many of each letter as license plate
      if (wordCount[i] < licenseCount[i]) {
        valid = false;
        break;
      }
    }

    // Step 5: If valid and shorter than current shortest, update
    if (valid && word.length < shortestLength) {
      shortestWord = word;
      shortestLength = word.length;
    }
  }

  return shortestWord;
}
```

```java
// Time: O(N * L) where N = number of words, L = average word length
// Space: O(1) for fixed-size frequency arrays (26 letters)
class Solution {
    public String shortestCompletingWord(String licensePlate, String[] words) {
        // Step 1: Count letters in license plate (case insensitive, letters only)
        int[] licenseCount = new int[26];

        for (char c : licensePlate.toCharArray()) {
            if (Character.isLetter(c)) {  // Check if character is a letter
                // Convert to lowercase and get index (0-25)
                licenseCount[Character.toLowerCase(c) - 'a']++;
            }
        }

        // Step 2: Initialize variables to track the shortest valid word
        String shortestWord = null;
        int shortestLength = Integer.MAX_VALUE;

        // Step 3: Check each word in the array
        for (String word : words) {
            // Count letters in current word
            int[] wordCount = new int[26];
            for (char c : word.toCharArray()) {
                // All characters in words are guaranteed to be lowercase letters
                wordCount[c - 'a']++;
            }

            // Step 4: Check if word contains all required letters
            boolean valid = true;
            for (int i = 0; i < 26; i++) {
                // Word must have at least as many of each letter as license plate
                if (wordCount[i] < licenseCount[i]) {
                    valid = false;
                    break;
                }
            }

            // Step 5: If valid and shorter than current shortest, update
            if (valid && word.length() < shortestLength) {
                shortestWord = word;
                shortestLength = word.length();
            }
        }

        return shortestWord;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × L)**

- `N` = number of words in the input array
- `L` = average length of each word
- We process each character in the license plate once: O(P) where P = license plate length
- For each word, we count its characters: O(L) per word
- Total: O(P + N × L) = O(N × L) since P is typically smaller than N × L

**Space Complexity: O(1)**

- We use fixed-size arrays of length 26 for counting letters
- This is constant space regardless of input size
- No additional data structures grow with input size

## Common Mistakes

1. **Forgetting case insensitivity:** Candidates often compare characters directly without converting to lowercase first. Remember: 'A' and 'a' should be treated as the same letter.

2. **Not handling duplicate letters properly:** The license plate "aab" requires a word with at least two 'a's and one 'b'. Simply checking if letters exist (using sets) isn't enough—you must check frequencies.

3. **Incorrectly filtering non-letter characters:** Using `isalpha()` or regex properly is crucial. Some candidates try to manually check ASCII ranges and miss edge cases.

4. **Not tracking the shortest word correctly:** When two words have the same length, we need the first one in the list. The comparison `len(word) < shortest_length` ensures we only update when we find a strictly shorter word.

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Valid Anagram (LeetCode 242)** - Similar frequency comparison but requires exact match rather than "at least" match.

2. **Ransom Note (LeetCode 383)** - Almost identical pattern: check if magazine has enough of each letter to form ransom note.

3. **Find All Anagrams in a String (LeetCode 438)** - Uses sliding window with frequency counting to find all anagram occurrences.

4. **Custom Sort String (LeetCode 791)** - Uses frequency counting to rearrange characters according to a custom order.

The core technique is: **Convert comparison problems into frequency distributions, then compare the distributions.**

## Key Takeaways

1. **Frequency counting transforms character matching problems into simple array comparisons.** Instead of complex string operations, we work with numbers.

2. **Fixed-size arrays (size 26 for English letters) are often more efficient than hash maps** for letter frequency problems when we know the character set is limited.

3. **Always clarify case sensitivity and character filtering requirements** before coding. These details are common trip points in interview problems.

[Practice this problem on CodeJeet](/problem/shortest-completing-word)
