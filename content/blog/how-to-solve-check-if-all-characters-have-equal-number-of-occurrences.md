---
title: "How to Solve Check if All Characters Have Equal Number of Occurrences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if All Characters Have Equal Number of Occurrences. Easy difficulty, 79.4% acceptance rate. Topics: Hash Table, String, Counting."
date: "2026-05-11"
category: "dsa-patterns"
tags:
  [
    "check-if-all-characters-have-equal-number-of-occurrences",
    "hash-table",
    "string",
    "counting",
    "easy",
  ]
---

# How to Solve "Check if All Characters Have Equal Number of Occurrences"

This problem asks us to determine if a string is "good" — meaning every character that appears in the string occurs exactly the same number of times. While this is categorized as an easy problem, it's an excellent exercise in frequency counting, a fundamental technique that appears in countless interview questions. The tricky part isn't the algorithm itself, but ensuring you handle all edge cases correctly and implement the frequency comparison efficiently.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the string `s = "abacbc"`.

**Step 1: Count character frequencies**
We need to know how many times each character appears:

- 'a' appears 2 times (positions 0 and 2)
- 'b' appears 2 times (positions 1 and 4)
- 'c' appears 2 times (positions 3 and 5)

**Step 2: Check if all frequencies are equal**
All three characters (a, b, c) appear exactly 2 times. Since all frequencies are identical, this is a "good" string.

Now let's try a counterexample: `s = "aaabb"`

**Step 1: Count character frequencies**

- 'a' appears 3 times
- 'b' appears 2 times

**Step 2: Check if all frequencies are equal**
The frequencies are 3 and 2, which are different. Therefore, this is NOT a "good" string.

The pattern is clear: we need to count occurrences, then verify that all counts are identical.

## Brute Force Approach

A naive approach might involve nested loops: for each character, count its occurrences by scanning the entire string, then compare all these counts. Here's what that might look like:

1. For each character in the string
2. Count how many times it appears by scanning the entire string
3. Compare this count with the count of the first character
4. If any count differs, return false

This approach has several problems:

- **Redundant counting**: If a character appears multiple times, we'll count it repeatedly
- **Inefficient**: O(n²) time complexity for a string of length n
- **Complex comparison**: We need to track which characters we've already counted to avoid duplicates

While this brute force would technically work for small inputs, it's clearly inefficient. The optimal solution avoids these issues by counting each character exactly once.

## Optimal Solution

The optimal approach uses a hash map (dictionary in Python, object/Map in JavaScript, HashMap in Java) to count frequencies efficiently, then checks if all values in the frequency map are identical.

**Algorithm Steps:**

1. Create a frequency counter to store how many times each character appears
2. Iterate through the string, incrementing the count for each character
3. Get the frequency of the first character (or any character) as the reference
4. Check if all other frequencies match this reference frequency
5. Return true if all match, false otherwise

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(k) where k is the number of distinct characters (at most 26 for lowercase letters)
def areOccurrencesEqual(s: str) -> bool:
    # Step 1: Create a frequency counter
    freq = {}

    # Step 2: Count occurrences of each character
    for char in s:
        # If character exists in dictionary, increment its count
        # Otherwise, initialize it to 1
        freq[char] = freq.get(char, 0) + 1

    # Step 3: Get the frequency of the first character as reference
    # We use s[0] to get any character's frequency as our baseline
    first_char_freq = freq[s[0]]

    # Step 4: Check if all frequencies match the reference
    for count in freq.values():
        if count != first_char_freq:
            return False

    # Step 5: All frequencies are equal
    return True
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(k) where k is the number of distinct characters (at most 26 for lowercase letters)
function areOccurrencesEqual(s) {
  // Step 1: Create a frequency counter
  const freq = {};

  // Step 2: Count occurrences of each character
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // If character exists in object, increment its count
    // Otherwise, initialize it to 1
    freq[char] = (freq[char] || 0) + 1;
  }

  // Step 3: Get the frequency of the first character as reference
  const firstCharFreq = freq[s[0]];

  // Step 4: Check if all frequencies match the reference
  for (const count of Object.values(freq)) {
    if (count !== firstCharFreq) {
      return false;
    }
  }

  // Step 5: All frequencies are equal
  return true;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(k) where k is the number of distinct characters (at most 26 for lowercase letters)
import java.util.HashMap;
import java.util.Map;

public boolean areOccurrencesEqual(String s) {
    // Step 1: Create a frequency counter
    Map<Character, Integer> freq = new HashMap<>();

    // Step 2: Count occurrences of each character
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        // If character exists in map, increment its count
        // Otherwise, initialize it to 1
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Step 3: Get the frequency of the first character as reference
    int firstCharFreq = freq.get(s.charAt(0));

    // Step 4: Check if all frequencies match the reference
    for (int count : freq.values()) {
        if (count != firstCharFreq) {
            return false;
        }
    }

    // Step 5: All frequencies are equal
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to count frequencies: O(n)
- We iterate through the frequency map values once to compare them: O(k), where k is the number of distinct characters
- Since k ≤ n (and for lowercase letters, k ≤ 26), the overall time is O(n)

**Space Complexity: O(k)**

- We store a frequency count for each distinct character
- In the worst case (all characters are unique), k = n, so O(n)
- For lowercase English letters specifically, k ≤ 26, so O(1) constant space
- The problem doesn't specify character constraints, so we generally say O(k)

## Common Mistakes

1. **Forgetting to handle empty strings**: While the problem likely provides non-empty strings, a robust solution should handle edge cases. An empty string has no characters, so technically all characters (none) have the same frequency. Most implementations will work correctly since there are no frequencies to compare.

2. **Using the wrong reference frequency**: Some candidates compare against the frequency of the last character instead of consistently using one character's frequency. This works fine unless the string is empty. A cleaner approach is to get the first frequency after counting, then compare all others against it.

3. **Inefficient frequency comparison**: After counting, some candidates might convert the frequency values to a set and check if the set size is 1. While this works, it's less intuitive than the direct comparison approach shown above. The set approach: `len(set(freq.values())) == 1`.

4. **Off-by-one errors in counting**: When manually counting without using `getOrDefault` or similar methods, candidates might forget to initialize counts for new characters or incorrectly increment existing counts.

## When You'll See This Pattern

Frequency counting is one of the most common patterns in coding interviews. You'll see it whenever you need to:

- Compare distributions of elements
- Find anagrams or permutations
- Identify duplicate or unique elements
- Solve problems about character or number frequencies

**Related problems that use similar patterns:**

1. **Rings and Rods (Easy)**: Count which rings are on each rod, similar to counting character frequencies but with additional constraints about ring colors and rod positions.

2. **Make Number of Distinct Characters Equal (Medium)**: A more complex version where you need to manipulate strings to make character frequencies match certain criteria.

3. **Valid Anagram (Easy)**: Check if two strings have the same character frequencies, which is essentially comparing two frequency maps.

4. **First Unique Character in a String (Easy)**: Build a frequency map, then find the first character with frequency 1.

## Key Takeaways

1. **Frequency counting with hash maps** is a fundamental technique for problems involving character or element distributions. The pattern is: iterate once to count, then use the counts for your logic.

2. **The "all equal" check** can be done by comparing each count to a reference count, or by checking if a set of all counts has size 1. Both approaches are valid, but direct comparison is more explicit.

3. **Consider character constraints** when analyzing space complexity. For lowercase English letters, the frequency map has at most 26 entries, making it O(1) space. Without such constraints, it's O(k) where k is the number of distinct characters.

This problem serves as excellent practice for the frequency counting pattern, which appears in countless interview questions. Mastering this simple pattern will help you solve more complex problems that build upon it.

Related problems: [Rings and Rods](/problem/rings-and-rods), [Make Number of Distinct Characters Equal](/problem/make-number-of-distinct-characters-equal)
