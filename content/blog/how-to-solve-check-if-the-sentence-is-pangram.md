---
title: "How to Solve Check if the Sentence Is Pangram — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if the Sentence Is Pangram. Easy difficulty, 84.1% acceptance rate. Topics: Hash Table, String."
date: "2027-04-22"
category: "dsa-patterns"
tags: ["check-if-the-sentence-is-pangram", "hash-table", "string", "easy"]
---

# How to Solve "Check if the Sentence Is Pangram"

A pangram is a sentence that uses every letter of the alphabet at least once. This problem asks you to verify whether a given lowercase string contains all 26 letters. While conceptually simple, it's an excellent exercise in thinking about completeness checks and efficient data structures. The tricky part isn't complexity—it's ensuring you handle all edge cases cleanly while demonstrating your understanding of set operations and character tracking.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the sentence: `"thequickbrownfoxjumpsoverthelazydog"`

This is actually a famous pangram! Let's see how we'd verify it:

1. We need to track which letters we've seen. Start with an empty tracking system.
2. Process 't' → mark 't' as seen
3. Process 'h' → mark 'h' as seen
4. Process 'e' → mark 'e' as seen
5. Continue through the entire string...
6. After processing all characters, check: have we seen all 26 letters?
7. In this case, yes! We've seen a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z.

Now consider a non-pangram: `"leetcode"`

1. Process 'l' → seen
2. Process 'e' → seen
3. Process 'e' → already seen
4. Process 't' → seen
5. Process 'c' → seen
6. Process 'o' → seen
7. Process 'd' → seen
8. Process 'e' → already seen
9. After processing: we've only seen 6 distinct letters (l, e, t, c, o, d)
10. Missing many letters like a, b, f, g, h, i, j, k, m, n, p, q, r, s, u, v, w, x, y, z
11. Result: false

The key insight is that we don't need to count how many times each letter appears—we just need to know if it appears at least once.

## Brute Force Approach

A naive approach might be to check for each letter individually. For each of the 26 letters, scan through the entire string to see if that letter exists. This is straightforward but inefficient.

**Why it's insufficient:**

- Time complexity: O(26 × n) = O(n), which is actually okay asymptotically
- However, it's still 26 full passes through the string
- More importantly, it doesn't demonstrate optimal use of data structures
- Interviewers expect you to recognize that a single pass with proper tracking is cleaner

While this brute force approach would technically work (and might even pass LeetCode tests given the constraints), it's not the approach that shows strong problem-solving skills. The optimal solution uses just one pass through the string.

## Optimal Solution

The optimal approach uses a set to track unique letters. As we iterate through the string, we add each character to a set. Sets automatically handle duplicates, so we only store each letter once. After processing the entire string, we check if the set size equals 26.

**Why this works:**

- Sets provide O(1) insertion and lookup
- We only need one pass through the string
- The set automatically handles duplicate letters
- Checking if size equals 26 is constant time

<div class="code-group">

```python
# Time: O(n) where n is the length of the sentence
# Space: O(1) because the set can only contain at most 26 characters
def checkIfPangram(sentence: str) -> bool:
    # Create a set to store unique letters we encounter
    # Sets automatically handle duplicates, so each letter appears only once
    seen_letters = set()

    # Iterate through each character in the sentence
    for char in sentence:
        # Add the character to our set
        # If it's already in the set, this operation does nothing (no duplicate entries)
        seen_letters.add(char)

    # Check if we've seen all 26 letters of the alphabet
    # The set will contain exactly 26 elements if and only if we've seen every letter
    return len(seen_letters) == 26
```

```javascript
// Time: O(n) where n is the length of the sentence
// Space: O(1) because the set can only contain at most 26 characters
function checkIfPangram(sentence) {
  // Create a Set to store unique letters we encounter
  // Sets automatically handle duplicates in JavaScript
  const seenLetters = new Set();

  // Iterate through each character in the sentence
  for (let i = 0; i < sentence.length; i++) {
    // Add the current character to our set
    // Duplicates are automatically ignored
    seenLetters.add(sentence[i]);
  }

  // Check if we've seen all 26 letters of the alphabet
  // The set size will be 26 if and only if we've seen every letter
  return seenLetters.size === 26;
}
```

```java
// Time: O(n) where n is the length of the sentence
// Space: O(1) because the set can only contain at most 26 characters
public boolean checkIfPangram(String sentence) {
    // Create a HashSet to store unique letters we encounter
    // HashSet provides O(1) average time complexity for add and contains operations
    Set<Character> seenLetters = new HashSet<>();

    // Iterate through each character in the sentence
    for (int i = 0; i < sentence.length(); i++) {
        // Add the current character to our set
        // The set automatically handles duplicates
        seenLetters.add(sentence.charAt(i));
    }

    // Check if we've seen all 26 letters of the alphabet
    // The set will contain exactly 26 elements if we've seen every letter
    return seenLetters.size() == 26;
}
```

</div>

**Alternative approach using a boolean array:**
Some candidates prefer using a boolean array of size 26 instead of a set. This is also O(1) space and can be slightly faster in practice:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkIfPangram(sentence: str) -> bool:
    # Create a boolean array of 26 elements, all initialized to False
    # Each index corresponds to a letter: 0 = 'a', 1 = 'b', ..., 25 = 'z'
    seen = [False] * 26

    for char in sentence:
        # Convert character to its index (0-25)
        # ord('a') gives the ASCII value of 'a', which is 97
        # Subtracting ord('a') from ord(char) gives us 0 for 'a', 1 for 'b', etc.
        index = ord(char) - ord('a')
        seen[index] = True

    # Check if all 26 positions are True
    # all() returns True if every element in the iterable is truthy
    return all(seen)
```

```javascript
// Time: O(n) | Space: O(1)
function checkIfPangram(sentence) {
  // Create a boolean array of 26 elements, all initialized to false
  // Each index corresponds to a letter: 0 = 'a', 1 = 'b', ..., 25 = 'z'
  const seen = new Array(26).fill(false);

  for (let i = 0; i < sentence.length; i++) {
    // Convert character to its index (0-25)
    // 'a'.charCodeAt(0) gives the ASCII value of 'a', which is 97
    // Subtracting 'a'.charCodeAt(0) gives us 0 for 'a', 1 for 'b', etc.
    const index = sentence.charCodeAt(i) - "a".charCodeAt(0);
    seen[index] = true;
  }

  // Check if all 26 positions are true
  // every() returns true if every element passes the test
  return seen.every((value) => value === true);
}
```

```java
// Time: O(n) | Space: O(1)
public boolean checkIfPangram(String sentence) {
    // Create a boolean array of 26 elements, all initialized to false
    // Each index corresponds to a letter: 0 = 'a', 1 = 'b', ..., 25 = 'z'
    boolean[] seen = new boolean[26];

    for (int i = 0; i < sentence.length(); i++) {
        // Convert character to its index (0-25)
        // 'a' has ASCII value 97, so subtracting 'a' gives us 0 for 'a', 1 for 'b', etc.
        int index = sentence.charAt(i) - 'a';
        seen[index] = true;
    }

    // Check if all 26 positions are true
    for (boolean letterSeen : seen) {
        if (!letterSeen) {
            return false;
        }
    }
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations for each character
- For the set approach: each `add` operation is O(1) on average
- For the boolean array approach: each index calculation and assignment is O(1)
- The final check (set size or array scan) is O(26) = O(1)

**Space Complexity: O(1)**

- This might seem surprising since we're using a set or array
- However, both the set and array have a fixed maximum size of 26
- Regardless of input size, we never use more than 26 slots
- In Big O notation, constant space is O(1)

## Common Mistakes

1. **Forgetting that the input is guaranteed to be lowercase**
   - Some candidates write extra code to handle uppercase or convert to lowercase
   - The problem states "only lowercase English letters," so this is unnecessary
   - Adding unnecessary code wastes time and introduces potential bugs

2. **Using a dictionary/hashmap to count frequencies instead of tracking presence**
   - While a frequency count works, it's overkill for this problem
   - We only need to know if a letter appears at least once, not how many times
   - Sets or boolean arrays are more appropriate and space-efficient

3. **Incorrect index calculation in the array approach**
   - Using `ord(char) - 97` instead of `ord(char) - ord('a')` works but is less readable
   - Forgetting that characters are zero-indexed (a=0, b=1, etc.)
   - Not handling the conversion correctly in languages with different character encoding

4. **Early termination optimization gone wrong**
   - Some candidates try to return early when the set reaches size 26
   - This seems smart but can fail if there are duplicate letters at the end
   - Example: if you have 25 unique letters early but the 26th appears later with duplicates
   - Safer to just process the entire string unless you're certain about the input distribution

## When You'll See This Pattern

The "track presence/absence" pattern appears in many problems where you need to verify completeness or check for missing elements:

1. **First Unique Character in a String (LeetCode 387)**
   - Uses frequency counting (similar to our boolean array but with counts)
   - Tracks which characters appear and how many times

2. **Find All Numbers Disappeared in an Array (LeetCode 448)**
   - Uses a similar "mark as seen" technique with array indices
   - Instead of letters, you're tracking numbers 1 through n

3. **Jewels and Stones (LeetCode 771)**
   - Uses a set to track which characters are jewels
   - Then counts how many stones are jewels

4. **Valid Anagram (LeetCode 242)**
   - Uses frequency arrays to track character counts
   - Similar indexing technique (char - 'a') to map characters to array positions

The core idea is using a fixed-size data structure (set, array, or bitset) to track which elements from a known universe you've encountered.

## Key Takeaways

1. **When checking for completeness of a fixed set, consider using a tracking data structure with constant size**
   - For the English alphabet (26 letters), use a set or boolean array of size 26
   - This gives you O(1) space complexity despite using auxiliary storage

2. **Choose the right data structure for the job**
   - If you only need to know presence/absence, use a set or boolean array
   - If you need frequency counts, use an integer array or dictionary
   - Sets automatically handle duplicates, making them ideal for uniqueness checks

3. **Pay attention to problem constraints**
   - The "lowercase only" constraint simplifies the solution
   - Always read constraints carefully—they often hint at the optimal approach
   - Constraints about input size help you determine if a brute force solution might work

[Practice this problem on CodeJeet](/problem/check-if-the-sentence-is-pangram)
