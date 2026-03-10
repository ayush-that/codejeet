---
title: "How to Solve Ransom Note — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Ransom Note. Easy difficulty, 65.7% acceptance rate. Topics: Hash Table, String, Counting."
date: "2026-06-04"
category: "dsa-patterns"
tags: ["ransom-note", "hash-table", "string", "counting", "easy"]
---

# How to Solve Ransom Note

This problem asks whether you can construct the string `ransomNote` using characters from the string `magazine`, with each character in `magazine` usable at most once. While conceptually simple, it's an excellent introduction to frequency counting—a fundamental pattern for problems involving character or element availability checks. The challenge lies in efficiently tracking which characters are available and ensuring we don't reuse characters.

## Visual Walkthrough

Let's trace through an example:  
`ransomNote = "aab"`, `magazine = "baa"`

**Step 1:** We need to check if we have enough of each character in `ransomNote` from `magazine`.

- `ransomNote` needs: 2 'a's, 1 'b'
- `magazine` has: 2 'a's, 1 'b'

**Step 2:** Count characters in `magazine`:

- 'b': 1
- 'a': 2

**Step 3:** Check each character in `ransomNote`:

- First 'a': magazine has 2 'a's → use one, remaining 'a's: 1
- Second 'a': magazine has 1 'a' → use it, remaining 'a's: 0
- 'b': magazine has 1 'b' → use it, remaining 'b's: 0

**Step 4:** All characters satisfied → return `true`.

If `magazine = "ab"` instead:

- `magazine` has: 1 'a', 1 'b'
- We need 2 'a's but only have 1 → return `false`.

This shows we need to count available characters and verify sufficient quantities.

## Brute Force Approach

A naive approach might try to match characters directly: for each character in `ransomNote`, search through `magazine` for a matching character and remove it. This leads to O(n×m) time complexity where n and m are string lengths, which is inefficient for longer strings.

**Why it fails:**

- Repeated linear searches through `magazine`
- String manipulation (removing characters) is expensive
- No quick way to check if a character is available

## Optimal Solution

The optimal solution uses character frequency counting. We count how many times each character appears in `magazine`, then for each character in `ransomNote`, check if we have enough copies. If we ever need more of a character than available, return `false`.

<div class="code-group">

```python
# Time: O(m + n) where m = len(magazine), n = len(ransomNote)
# Space: O(1) because we store at most 26 characters (English lowercase letters)
def canConstruct(ransomNote: str, magazine: str) -> bool:
    # Step 1: Create a frequency counter for magazine characters
    # We use a dictionary to store character counts
    char_count = {}

    # Count each character in magazine
    for char in magazine:
        # If character already in dict, increment count
        # Otherwise, initialize with count 1
        char_count[char] = char_count.get(char, 0) + 1

    # Step 2: Check if ransomNote can be constructed
    for char in ransomNote:
        # If character not in magazine or count is zero, return False
        if char not in char_count or char_count[char] == 0:
            return False

        # Decrement the count since we've used this character
        char_count[char] -= 1

    # Step 3: All characters satisfied
    return True
```

```javascript
// Time: O(m + n) where m = magazine.length, n = ransomNote.length
// Space: O(1) because we store at most 26 characters (English lowercase letters)
function canConstruct(ransomNote, magazine) {
  // Step 1: Create a frequency counter for magazine characters
  const charCount = {};

  // Count each character in magazine
  for (const char of magazine) {
    // If character already in object, increment count
    // Otherwise, initialize with count 1
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Step 2: Check if ransomNote can be constructed
  for (const char of ransomNote) {
    // If character not in magazine or count is zero, return false
    if (!charCount[char] || charCount[char] === 0) {
      return false;
    }

    // Decrement the count since we've used this character
    charCount[char]--;
  }

  // Step 3: All characters satisfied
  return true;
}
```

```java
// Time: O(m + n) where m = magazine.length(), n = ransomNote.length()
// Space: O(1) because we store at most 26 characters (English lowercase letters)
public boolean canConstruct(String ransomNote, String magazine) {
    // Step 1: Create a frequency counter for magazine characters
    // Use an array since we're dealing with lowercase English letters
    int[] charCount = new int[26];

    // Count each character in magazine
    for (char c : magazine.toCharArray()) {
        // 'a' has ASCII value 97, so c - 'a' gives index 0-25
        charCount[c - 'a']++;
    }

    // Step 2: Check if ransomNote can be constructed
    for (char c : ransomNote.toCharArray()) {
        // If count for this character is zero, return false
        if (charCount[c - 'a'] == 0) {
            return false;
        }

        // Decrement the count since we've used this character
        charCount[c - 'a']--;
    }

    // Step 3: All characters satisfied
    return true;
}
```

</div>

**Key implementation details:**

1. **Counting phase:** We first count all characters in `magazine` to know what's available.
2. **Verification phase:** For each character in `ransomNote`, we check availability and decrement the count.
3. **Early exit:** If any character is unavailable, we return `false` immediately.

## Complexity Analysis

**Time Complexity:** O(m + n) where m = length of `magazine`, n = length of `ransomNote`

- We iterate through `magazine` once to build the frequency counter: O(m)
- We iterate through `ransomNote` once to check characters: O(n)
- Total: O(m + n)

**Space Complexity:** O(1) for the Java array solution, O(k) for the dictionary solutions where k is the number of unique characters

- In practice, if we only have lowercase English letters, k ≤ 26
- Even with Unicode, the number of unique characters is bounded by the string lengths

## Common Mistakes

1. **Not checking character existence before decrementing:**

   ```python
   # WRONG: This will create new entries for missing characters
   if char_count.get(char, 0) > 0:
       char_count[char] -= 1
   else:
       return False
   ```

   **Fix:** Always check if the character exists in the dictionary first.

2. **Using the wrong data structure for Java:**  
   Some candidates use HashMap<Character, Integer> when an int[26] array is more efficient for lowercase English letters. The array solution is faster and uses less memory.

3. **Forgetting that magazine characters can only be used once:**  
   A common error is to use sets instead of counts, which fails for duplicate characters. For `ransomNote = "aa"`, `magazine = "ab"`, a set would incorrectly return `true`.

4. **Not handling empty strings correctly:**
   - `ransomNote = ""` should always return `true` (empty note can always be constructed)
   - `magazine = ""`, `ransomNote = "a"` should return `false`
     Our solution handles these correctly because the loop over empty `ransomNote` never executes.

## When You'll See This Pattern

Frequency counting appears in many string and array problems:

1. **Valid Anagram (Easy):** Check if two strings have the same character frequencies.
2. **Find All Anagrams in a String (Medium):** Find substrings with the same character frequencies as a pattern.
3. **First Unique Character in a String (Easy):** Find the first character with frequency 1.
4. **Sort Characters By Frequency (Medium):** Sort characters by their frequency counts.

The pattern extends beyond strings to any problem where you need to track element availability or compare multisets.

## Key Takeaways

1. **Frequency counting is your go-to for "can construct" problems:** When you need to check if you have enough resources (characters, numbers, etc.) to build something, count what's available first.
2. **Choose the right data structure:** For lowercase English letters, use an array of size 26. For general characters, use a dictionary/hashmap.
3. **Two-pass approach is often optimal:** First pass to count resources, second pass to verify requirements. This separates concerns and keeps code clean.

Related problems: [Stickers to Spell Word](/problem/stickers-to-spell-word), [Find Words That Can Be Formed by Characters](/problem/find-words-that-can-be-formed-by-characters)
