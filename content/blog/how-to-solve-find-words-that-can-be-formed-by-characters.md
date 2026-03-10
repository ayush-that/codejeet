---
title: "How to Solve Find Words That Can Be Formed by Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Words That Can Be Formed by Characters. Easy difficulty, 71.5% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2027-11-14"
category: "dsa-patterns"
tags: ["find-words-that-can-be-formed-by-characters", "array", "hash-table", "string", "easy"]
---

# How to Solve "Find Words That Can Be Formed by Characters"

This problem asks us to determine which words from a list can be constructed using characters from a given string, where each character can only be used once per word. The challenge lies in efficiently tracking character availability across multiple words without modifying the original character pool for each check. This is essentially a frequency counting problem where we need to compare character requirements against available resources.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
words = ["cat", "bt", "hat", "tree"]
chars = "atach"
```

**Step 1: Count characters available in `chars`**

- 'a': 2, 't': 2, 'c': 1, 'h': 1
- We have 2 'a's, 2 't's, 1 'c', and 1 'h'

**Step 2: Check "cat"**

- Needs: 'c': 1, 'a': 1, 't': 1
- Compare with available: We have 1 'c' (✓), 2 'a's (✓), 2 't's (✓)
- "cat" is good → add length 3 to sum

**Step 3: Check "bt"**

- Needs: 'b': 1, 't': 1
- Compare with available: We have 0 'b's (✗)
- "bt" is not good

**Step 4: Check "hat"**

- Needs: 'h': 1, 'a': 1, 't': 1
- Compare with available: We have 1 'h' (✓), 2 'a's (✓), 2 't's (✓)
- "hat" is good → add length 3 to sum (total now 6)

**Step 5: Check "tree"**

- Needs: 't': 1, 'r': 1, 'e': 2
- Compare with available: We have 0 'r's (✗)
- "tree" is not good

**Result:** Sum = 3 + 3 = 6

The key insight is that we need to count character frequencies once for `chars`, then for each word, count its characters and compare frequencies.

## Brute Force Approach

A naive approach might try to physically remove characters from `chars` as we use them for each word, but this has several problems:

1. **Character reuse**: We need the original `chars` for each word check
2. **Performance**: Creating modified copies of `chars` for each word is O(n × m) where n is number of words and m is average word length
3. **Complexity**: The logic becomes messy with string manipulation

The brute force would involve for each word:

1. Make a copy of `chars`
2. For each character in the word, try to find and remove it from the copy
3. If any character isn't found, the word fails

This approach is O(n × m²) in worst case because searching for characters in a string copy takes O(m) time. With 1000 words of length 1000, this becomes 1 billion operations - far too slow.

## Optimal Solution

The optimal solution uses frequency counting with arrays or hash maps. Since characters are lowercase English letters, we can use a fixed-size array of 26 elements for efficiency. For each word, we count its characters and compare with the available counts from `chars`.

<div class="code-group">

```python
# Time: O(n × k) where n is number of words, k is average word length
# Space: O(1) for the frequency arrays (fixed size 26)
def countCharacters(words, chars):
    # Step 1: Count frequency of each character in chars
    # We use a list of 26 zeros for 26 lowercase letters
    char_counts = [0] * 26

    # Count each character in chars
    for ch in chars:
        # Convert character to index (0-25) by subtracting 'a'
        char_counts[ord(ch) - ord('a')] += 1

    total_length = 0

    # Step 2: Check each word
    for word in words:
        # Count frequency of characters in current word
        word_counts = [0] * 26
        for ch in word:
            word_counts[ord(ch) - ord('a')] += 1

        # Step 3: Check if word can be formed
        can_form = True
        for i in range(26):
            # If word needs more of a character than chars has, it fails
            if word_counts[i] > char_counts[i]:
                can_form = False
                break

        # Step 4: If word can be formed, add its length to total
        if can_form:
            total_length += len(word)

    return total_length
```

```javascript
// Time: O(n × k) where n is number of words, k is average word length
// Space: O(1) for the frequency arrays (fixed size 26)
function countCharacters(words, chars) {
  // Step 1: Count frequency of each character in chars
  // Array of 26 zeros for 26 lowercase letters
  const charCounts = new Array(26).fill(0);

  // Count each character in chars
  for (let i = 0; i < chars.length; i++) {
    // Convert character to index (0-25)
    const index = chars.charCodeAt(i) - "a".charCodeAt(0);
    charCounts[index]++;
  }

  let totalLength = 0;

  // Step 2: Check each word
  for (const word of words) {
    // Count frequency of characters in current word
    const wordCounts = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) {
      const index = word.charCodeAt(i) - "a".charCodeAt(0);
      wordCounts[index]++;
    }

    // Step 3: Check if word can be formed
    let canForm = true;
    for (let i = 0; i < 26; i++) {
      // If word needs more of a character than chars has, it fails
      if (wordCounts[i] > charCounts[i]) {
        canForm = false;
        break;
      }
    }

    // Step 4: If word can be formed, add its length to total
    if (canForm) {
      totalLength += word.length;
    }
  }

  return totalLength;
}
```

```java
// Time: O(n × k) where n is number of words, k is average word length
// Space: O(1) for the frequency arrays (fixed size 26)
class Solution {
    public int countCharacters(String[] words, String chars) {
        // Step 1: Count frequency of each character in chars
        // Array of 26 zeros for 26 lowercase letters
        int[] charCounts = new int[26];

        // Count each character in chars
        for (int i = 0; i < chars.length(); i++) {
            // Convert character to index (0-25)
            int index = chars.charAt(i) - 'a';
            charCounts[index]++;
        }

        int totalLength = 0;

        // Step 2: Check each word
        for (String word : words) {
            // Count frequency of characters in current word
            int[] wordCounts = new int[26];
            for (int i = 0; i < word.length(); i++) {
                int index = word.charAt(i) - 'a';
                wordCounts[index]++;
            }

            // Step 3: Check if word can be formed
            boolean canForm = true;
            for (int i = 0; i < 26; i++) {
                // If word needs more of a character than chars has, it fails
                if (wordCounts[i] > charCounts[i]) {
                    canForm = false;
                    break;
                }
            }

            // Step 4: If word can be formed, add its length to total
            if (canForm) {
                totalLength += word.length();
            }
        }

        return totalLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × k)**

- `n` = number of words in the input array
- `k` = average length of words
- We iterate through `chars` once: O(m) where m = length of chars
- For each word, we count its characters: O(k) per word
- For each word, we compare 26 frequency counts: O(26) = O(1) per word
- Total: O(m + n × k). Since m is typically similar to k, we simplify to O(n × k)

**Space Complexity: O(1)**

- We use fixed-size arrays of 26 integers regardless of input size
- The space doesn't grow with input size, so it's constant
- Even with multiple arrays, 26 × 4 bytes × 2 arrays = 208 bytes (negligible)

## Common Mistakes

1. **Modifying the original character counts**: Some candidates try to subtract used characters from `char_counts`, forgetting that each word check needs the original counts. Always create a fresh word count array for each word.

2. **Not handling character case**: The problem states characters are lowercase English letters, but in interviews, always clarify assumptions. If case matters, you'd need 52 slots or a hash map.

3. **Using inefficient data structures**: While hash maps work, arrays are faster for this constrained problem (26 letters). Candidates who use hash maps without justification may lose points for not optimizing.

4. **Early termination without checking all characters**: Some candidates return as soon as they find one character shortage, which is correct, but they might forget to break out of loops properly, causing unnecessary comparisons.

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Ransom Note (LeetCode 383)**: Almost identical - check if magazine letters can form ransom note. The same frequency comparison technique applies directly.

2. **Valid Anagram (LeetCode 242)**: Check if two strings have the same character frequencies. You compare two frequency arrays for equality instead of "less than or equal to".

3. **Find All Anagrams in a String (LeetCode 438)**: Extended version where you slide a window through a string, maintaining character frequencies to find anagrams.

4. **Rearrange Characters to Make Target String (LeetCode 2287)**: Another variation where you check if one string's characters can form another, with the same frequency comparison logic.

The core pattern is: when you need to compare character availability or distribution between strings, frequency counting with arrays (for constrained alphabets) or hash maps (for larger character sets) is the go-to approach.

## Key Takeaways

1. **Frequency counting is your friend for character comparison problems**: When you see "can form", "anagram", or "character availability" in a problem description, think frequency counts first.

2. **Use arrays for constrained alphabets**: When characters are limited (like 26 lowercase letters), arrays are faster and simpler than hash maps. The index calculation `char - 'a'` is a standard trick.

3. **Don't modify your reference data**: When checking multiple items against a fixed resource pool, keep the original counts intact and compare against them for each check.

This problem teaches the fundamental skill of resource allocation checking - a pattern that extends beyond strings to any problem where you need to verify if requirements can be met with available resources.

Related problems: [Ransom Note](/problem/ransom-note), [Rearrange Characters to Make Target String](/problem/rearrange-characters-to-make-target-string)
