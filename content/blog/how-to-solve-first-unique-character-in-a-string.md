---
title: "How to Solve First Unique Character in a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode First Unique Character in a String. Easy difficulty, 65.1% acceptance rate. Topics: Hash Table, String, Queue, Counting."
date: "2026-05-08"
category: "dsa-patterns"
tags: ["first-unique-character-in-a-string", "hash-table", "string", "queue", "easy"]
---

# How to Solve First Unique Character in a String

This problem asks us to find the index of the first character in a string that appears exactly once. While it sounds straightforward, the challenge lies in efficiently tracking both frequency and order. A naive approach might check each character against all others, but that becomes inefficient for longer strings. The interesting part is balancing the need to count occurrences while preserving the original order to identify the "first" unique character.

## Visual Walkthrough

Let's trace through the example `s = "leetcode"` step by step.

**Step 1: Count frequencies**
We need to know how many times each character appears:

- l: 1 time
- e: 3 times
- t: 1 time
- c: 1 time
- o: 1 time
- d: 1 time

**Step 2: Find first character with count = 1**
Now we scan the string from left to right, checking each character's frequency:

- Index 0: 'l' → count = 1 ✓ This is our first unique character!
- We could continue checking, but we've already found our answer.

The result is index 0.

Let's try another example: `s = "loveleetcode"`

- Counts: l:2, o:2, v:1, e:4, t:1, c:1, d:1
- Scan left to right:
  - Index 0: 'l' → count = 2 ✗
  - Index 1: 'o' → count = 2 ✗
  - Index 2: 'v' → count = 1 ✓ Found it!
    Result: index 2.

## Brute Force Approach

The most straightforward approach is to check each character one by one: for each character at index `i`, scan the entire string to see if it appears anywhere else.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def firstUniqChar(s: str) -> int:
    n = len(s)

    # Check each character
    for i in range(n):
        is_unique = True

        # Compare with all other characters
        for j in range(n):
            # Skip comparing with itself
            if i != j and s[i] == s[j]:
                is_unique = False
                break

        # If we found a unique character, return its index
        if is_unique:
            return i

    # No unique character found
    return -1
```

```javascript
// Time: O(n²) | Space: O(1)
function firstUniqChar(s) {
  const n = s.length;

  // Check each character
  for (let i = 0; i < n; i++) {
    let isUnique = true;

    // Compare with all other characters
    for (let j = 0; j < n; j++) {
      // Skip comparing with itself
      if (i !== j && s[i] === s[j]) {
        isUnique = false;
        break;
      }
    }

    // If we found a unique character, return its index
    if (isUnique) {
      return i;
    }
  }

  // No unique character found
  return -1;
}
```

```java
// Time: O(n²) | Space: O(1)
public int firstUniqChar(String s) {
    int n = s.length();

    // Check each character
    for (int i = 0; i < n; i++) {
        boolean isUnique = true;

        // Compare with all other characters
        for (int j = 0; j < n; j++) {
            // Skip comparing with itself
            if (i != j && s.charAt(i) == s.charAt(j)) {
                isUnique = false;
                break;
            }
        }

        // If we found a unique character, return its index
        if (isUnique) {
            return i;
        }
    }

    // No unique character found
    return -1;
}
```

</div>

**Why this is insufficient:** This approach has O(n²) time complexity because for each of n characters, we potentially scan all n characters. For a string of length 100,000, this would require up to 10 billion operations, which is far too slow. We need a solution that processes the string in linear time.

## Optimal Solution

The optimal approach uses two passes through the string with a hash map (or array) to count frequencies:

1. **First pass:** Count how many times each character appears
2. **Second pass:** Find the first character with count = 1

We can use an array of size 26 for lowercase English letters (as specified in many LeetCode test cases) or a hash map for Unicode characters.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) or O(k) where k is the character set size
def firstUniqChar(s: str) -> int:
    # Dictionary to store character frequencies
    # We'll use a dictionary to handle any Unicode character
    freq = {}

    # First pass: count frequencies of all characters
    for char in s:
        # Increment count for this character
        # Using get() with default value of 0
        freq[char] = freq.get(char, 0) + 1

    # Second pass: find first character with frequency 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i

    # No unique character found
    return -1
```

```javascript
// Time: O(n) | Space: O(1) or O(k) where k is the character set size
function firstUniqChar(s) {
  // Map to store character frequencies
  // Using Map to handle any Unicode character
  const freq = new Map();

  // First pass: count frequencies of all characters
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Increment count for this character
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Second pass: find first character with frequency 1
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (freq.get(char) === 1) {
      return i;
    }
  }

  // No unique character found
  return -1;
}
```

```java
// Time: O(n) | Space: O(1) or O(k) where k is the character set size
public int firstUniqChar(String s) {
    // HashMap to store character frequencies
    // Using HashMap to handle any Unicode character
    Map<Character, Integer> freq = new HashMap<>();

    // First pass: count frequencies of all characters
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        // Increment count for this character
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Second pass: find first character with frequency 1
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (freq.get(c) == 1) {
            return i;
        }
    }

    // No unique character found
    return -1;
}
```

</div>

**Alternative array-based solution (for lowercase English letters only):**

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size array of 26
def firstUniqChar(s: str) -> int:
    # Array of size 26 for lowercase English letters
    freq = [0] * 26

    # First pass: count frequencies
    for char in s:
        # Convert character to index (0-25)
        freq[ord(char) - ord('a')] += 1

    # Second pass: find first unique character
    for i, char in enumerate(s):
        if freq[ord(char) - ord('a')] == 1:
            return i

    return -1
```

```javascript
// Time: O(n) | Space: O(1) - fixed size array of 26
function firstUniqChar(s) {
  // Array of size 26 for lowercase English letters
  const freq = new Array(26).fill(0);

  // First pass: count frequencies
  for (let i = 0; i < s.length; i++) {
    const index = s.charCodeAt(i) - "a".charCodeAt(0);
    freq[index]++;
  }

  // Second pass: find first unique character
  for (let i = 0; i < s.length; i++) {
    const index = s.charCodeAt(i) - "a".charCodeAt(0);
    if (freq[index] === 1) {
      return i;
    }
  }

  return -1;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size array of 26
public int firstUniqChar(String s) {
    // Array of size 26 for lowercase English letters
    int[] freq = new int[26];

    // First pass: count frequencies
    for (int i = 0; i < s.length(); i++) {
        freq[s.charAt(i) - 'a']++;
    }

    // Second pass: find first unique character
    for (int i = 0; i < s.length(); i++) {
        if (freq[s.charAt(i) - 'a'] == 1) {
            return i;
        }
    }

    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string, each taking O(n) time
- The first pass counts frequencies: O(n)
- The second pass finds the first unique character: O(n)
- Total: O(n) + O(n) = O(2n) = O(n)

**Space Complexity: O(1) or O(k)**

- For lowercase English letters only (array solution): O(26) = O(1)
- For Unicode characters (hash map solution): O(k) where k is the number of distinct characters in the string
- In the worst case, if all characters are unique, k = n, so O(n)
- In practice, for many test cases, k is bounded (like 26 for lowercase letters), so we often consider it O(1)

## Common Mistakes

1. **Returning the wrong index:** Some candidates return the index in the frequency map instead of the original string index. Remember: we need the position in the original string, not in our data structure.

2. **Not handling empty strings:** Always check edge cases. An empty string should return -1. Our solution handles this correctly because the second loop won't execute.

3. **Using only one pass:** Some candidates try to track both frequency and first occurrence in one pass, but this can be tricky. The two-pass approach is cleaner and easier to reason about.

4. **Assuming lowercase letters only:** If the problem doesn't specify, use a hash map instead of a fixed-size array to handle any Unicode character. Always clarify constraints with your interviewer.

5. **Off-by-one errors with array indices:** When using the array solution, remember that `ord('a') - ord('a') = 0`, not 1. Double-check your index calculations.

## When You'll See This Pattern

The "count then scan" pattern appears in many string and array problems:

1. **Sort Characters By Frequency (LeetCode 451)** - Similar counting approach, but then you need to sort by frequency instead of finding the first unique.

2. **First Letter to Appear Twice (LeetCode 2351)** - Instead of finding the first unique, you find the first character that repeats. The counting logic is similar but with a different stopping condition.

3. **Find All Anagrams in a String (LeetCode 438)** - Uses frequency counting with a sliding window to compare character distributions.

4. **Valid Anagram (LeetCode 242)** - Compares frequency counts of two strings to check if they're anagrams.

The core pattern is: when you need to track occurrences or distributions of elements, frequency counting with a hash map or array is often the right approach.

## Key Takeaways

1. **Frequency counting is a fundamental technique:** When a problem involves counting occurrences or checking for duplicates, reach for a hash map or fixed-size array first.

2. **Two-pass solutions are often optimal:** Don't try to do everything in one pass if it makes the logic complex. Two linear passes are still O(n) and often lead to cleaner code.

3. **Clarify character set constraints:** Always ask if the input is limited to lowercase English letters (allowing array optimization) or includes Unicode (requiring a hash map).

4. **Order matters for "first" occurrences:** When you need the "first" element meeting a condition, you typically need to scan the original data structure in order after counting.

Related problems: [Sort Characters By Frequency](/problem/sort-characters-by-frequency), [First Letter to Appear Twice](/problem/first-letter-to-appear-twice)
