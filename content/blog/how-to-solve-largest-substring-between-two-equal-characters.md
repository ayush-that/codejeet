---
title: "How to Solve Largest Substring Between Two Equal Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Substring Between Two Equal Characters. Easy difficulty, 68.3% acceptance rate. Topics: Hash Table, String."
date: "2026-04-15"
category: "dsa-patterns"
tags: ["largest-substring-between-two-equal-characters", "hash-table", "string", "easy"]
---

# How to Solve Largest Substring Between Two Equal Characters

This problem asks us to find the maximum distance between two identical characters in a string, where the distance is measured as the number of characters between them (excluding the endpoints). What makes this problem interesting is that while it appears to be about substrings, the optimal solution doesn't actually need to examine substrings directly—it's really about tracking the first and last occurrence of each character.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "abca"`:

1. Character 'a' appears at indices 0 and 3
   - Distance between them = 3 - 0 - 1 = 2 (characters 'b' and 'c')
2. Character 'b' appears only at index 1
   - No pair exists, so distance is irrelevant
3. Character 'c' appears only at index 2
   - No pair exists
4. The maximum distance is 2

Now let's try `s = "aa"`:

- Character 'a' appears at indices 0 and 1
- Distance = 1 - 0 - 1 = 0 (no characters between them)
- Maximum distance is 0

For `s = "abc"`:

- No character repeats, so we return -1

The key insight: For each character, we only need to know its **first** and **last** occurrence. The substring between these positions will be the longest possible substring for that character, since any other occurrences must be between these endpoints.

## Brute Force Approach

A naive approach would be to check all possible pairs of indices `(i, j)` where `i < j` and `s[i] == s[j]`, then calculate the distance between them and track the maximum.

```python
def maxLengthBetweenEqualCharacters_brute(s):
    max_len = -1
    n = len(s)

    for i in range(n):
        for j in range(i + 1, n):
            if s[i] == s[j]:
                # Distance between i and j, excluding endpoints
                distance = j - i - 1
                max_len = max(max_len, distance)

    return max_len
```

**Why this is inefficient:**

- Time complexity: O(n²) where n is the length of the string
- Space complexity: O(1)
- For strings up to 300 characters (typical LeetCode constraints), this might pass, but it's not optimal
- The main issue: We're doing redundant work by checking all pairs when we only need the first and last occurrence of each character

## Optimal Solution

The optimal solution uses a hash map (dictionary) to store the **first occurrence** of each character. As we iterate through the string, if we encounter a character we've seen before, we calculate the distance between the current position and its first occurrence. We track the maximum such distance.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - because there are at most 26 lowercase letters
def maxLengthBetweenEqualCharacters(s: str) -> int:
    # Dictionary to store the first occurrence index of each character
    first_occurrence = {}
    max_distance = -1

    for i, char in enumerate(s):
        if char in first_occurrence:
            # Calculate distance between current position and first occurrence
            # Subtract 1 because we exclude both endpoints
            distance = i - first_occurrence[char] - 1
            # Update maximum distance if current distance is larger
            max_distance = max(max_distance, distance)
        else:
            # Store the first occurrence of this character
            first_occurrence[char] = i

    return max_distance
```

```javascript
// Time: O(n) | Space: O(1) - because there are at most 26 lowercase letters
function maxLengthBetweenEqualCharacters(s) {
  // Map to store the first occurrence index of each character
  const firstOccurrence = new Map();
  let maxDistance = -1;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (firstOccurrence.has(char)) {
      // Calculate distance between current position and first occurrence
      // Subtract 1 because we exclude both endpoints
      const distance = i - firstOccurrence.get(char) - 1;
      // Update maximum distance if current distance is larger
      maxDistance = Math.max(maxDistance, distance);
    } else {
      // Store the first occurrence of this character
      firstOccurrence.set(char, i);
    }
  }

  return maxDistance;
}
```

```java
// Time: O(n) | Space: O(1) - because there are at most 26 lowercase letters
public int maxLengthBetweenEqualCharacters(String s) {
    // Array to store the first occurrence index of each character
    // We use -1 to indicate the character hasn't been seen yet
    int[] firstOccurrence = new int[26];
    Arrays.fill(firstOccurrence, -1);
    int maxDistance = -1;

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        int index = c - 'a';  // Convert character to array index (0-25)

        if (firstOccurrence[index] != -1) {
            // Calculate distance between current position and first occurrence
            // Subtract 1 because we exclude both endpoints
            int distance = i - firstOccurrence[index] - 1;
            // Update maximum distance if current distance is larger
            maxDistance = Math.max(maxDistance, distance);
        } else {
            // Store the first occurrence of this character
            firstOccurrence[index] = i;
        }
    }

    return maxDistance;
}
```

</div>

**Step-by-step explanation:**

1. **Initialize data structures**: We create a map/array to track the first occurrence of each character. In Java, we use an array of size 26 since the problem states the string contains only lowercase English letters.

2. **Iterate through the string**: For each character at index `i`:
   - If we've seen this character before (it exists in our map/array), calculate the distance between the current position and its first occurrence.
   - The distance formula is `i - first_occurrence[char] - 1`. We subtract 1 because we exclude both endpoints (the two equal characters).
   - Update `max_distance` if this distance is larger than our current maximum.
   - If we haven't seen this character before, store its index as the first occurrence.

3. **Return the result**: After processing all characters, return `max_distance`. If no character repeats, it will remain -1.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations for each character
- Dictionary/Map operations (lookup and insertion) are O(1) on average
- Array access in the Java solution is O(1)

**Space Complexity: O(1)**

- Although we use additional data structures, their size is bounded
- The dictionary/map stores at most 26 entries (one for each lowercase English letter)
- The Java array has fixed size 26
- Therefore, the space complexity is constant, not dependent on input size n

## Common Mistakes

1. **Off-by-one errors in distance calculation**: The most common mistake is forgetting to subtract 1 when calculating the distance. Remember: if characters are at indices 0 and 3, the characters between them are at indices 1 and 2, which is `3 - 0 - 1 = 2` characters.

2. **Using the wrong data structure**: Some candidates try to use a set instead of a map. A set can tell you if you've seen a character before, but it doesn't store _where_ you first saw it, which is essential for calculating distances.

3. **Not handling the "no repeats" case**: The problem specifies to return -1 if no character repeats. Some solutions initialize `max_distance` to 0 instead of -1, which would return 0 for strings like "abc" instead of -1.

4. **Checking all pairs instead of just first and last**: While checking all pairs gives the correct answer, it's inefficient (O(n²)). The optimal solution recognizes that for any character, the longest possible substring between two equal occurrences will be between the first and last occurrence of that character.

## When You'll See This Pattern

This "first and last occurrence" pattern appears in several other problems:

1. **Two Sum (LeetCode #1)**: While different in implementation, both problems use a hash map to store information about elements we've seen before (indices in Two Sum, first occurrence in this problem).

2. **First Unique Character in a String (LeetCode #387)**: This also tracks character occurrences, though it typically requires counting all occurrences rather than just the first.

3. **Longest Substring Without Repeating Characters (LeetCode #3)**: This uses a similar "track last seen position" approach but with a sliding window to ensure no repeats within the window.

The core pattern is: **When you need to find relationships between occurrences of the same value, store the first (or last) occurrence in a hash map and update as you encounter more occurrences.**

## Key Takeaways

1. **Don't overcomplicate substring problems**: Many substring problems can be solved without actually examining every substring. Look for patterns in what makes a substring valid or interesting.

2. **First and last occurrence is often sufficient**: When looking for maximum distance between equal elements, you only need to track the extremes. Any other occurrences will be between them.

3. **Hash maps are your friend for tracking occurrences**: When you need to remember where you've seen something before (characters, numbers, etc.), a hash map with the element as key and its position as value is often the right tool.

[Practice this problem on CodeJeet](/problem/largest-substring-between-two-equal-characters)
