---
title: "How to Solve First Letter to Appear Twice — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode First Letter to Appear Twice. Easy difficulty, 74.9% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Counting."
date: "2026-02-17"
category: "dsa-patterns"
tags: ["first-letter-to-appear-twice", "hash-table", "string", "bit-manipulation", "easy"]
---

# How to Solve First Letter to Appear Twice

This problem asks us to find the first letter in a string that appears twice. The tricky part is understanding what "first" means: it's the letter whose second occurrence comes earliest in the string, not necessarily the first letter we see repeated. This subtle distinction makes the problem more interesting than it initially appears.

## Visual Walkthrough

Let's trace through an example: `s = "abccba"`

1. Start with an empty set to track letters we've seen
2. Process `'a'`: haven't seen it before → add to set: `{'a'}`
3. Process `'b'`: haven't seen it before → add to set: `{'a', 'b'}`
4. Process `'c'`: haven't seen it before → add to set: `{'a', 'b', 'c'}`
5. Process `'c'`: already in set! This is the second occurrence of `'c'`
6. Since `'c'` is the first letter to have a second occurrence, return `'c'`

Notice we don't continue checking the rest of the string (`'b'` and `'a'` appear later as repeats, but `'c'` was first to repeat).

Another example: `s = "abcdd"`

1. Process `'a'` → add to set: `{'a'}`
2. Process `'b'` → add to set: `{'a', 'b'}`
3. Process `'c'` → add to set: `{'a', 'b', 'c'}`
4. Process `'d'` → add to set: `{'a', 'b', 'c', 'd'}`
5. Process `'d'` → already in set! Return `'d'`

The key insight: we need to track which letters we've seen before, and the moment we encounter a letter we've already seen, that's our answer.

## Brute Force Approach

A naive approach would be to check each letter against all subsequent letters to find repeats:

1. For each position `i` in the string
2. For each position `j` from `i+1` to the end
3. If `s[i] == s[j]`, check if this is the earliest repeat found so far

This brute force solution has O(n²) time complexity because for each of n characters, we check up to n-1 other characters. The space complexity is O(1) since we only need to track the earliest repeat found.

The problem with this approach is efficiency. For a string of length 1000, we'd need to make about 500,000 comparisons. While this might work for very small inputs, it's inefficient and shows poor algorithmic thinking in an interview.

## Optimal Solution

The optimal solution uses a hash set to track seen characters. As we iterate through the string, we check if the current character is already in our set. If it is, we've found our answer. If not, we add it to the set and continue.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) or O(26) since only lowercase English letters
def repeatedCharacter(s: str) -> str:
    """
    Find the first letter to appear twice in a string.

    Args:
        s: Input string consisting of lowercase English letters

    Returns:
        The first character that appears twice
    """
    # Step 1: Create a set to track characters we've seen
    seen = set()

    # Step 2: Iterate through each character in the string
    for char in s:
        # Step 3: Check if we've seen this character before
        if char in seen:
            # If yes, this is the first repeat - return immediately
            return char

        # Step 4: If not seen before, add to our set
        seen.add(char)

    # Note: The problem guarantees at least one repeat exists,
    # so we'll always return from within the loop
```

```javascript
// Time: O(n) | Space: O(1) or O(26) since only lowercase English letters
/**
 * Find the first letter to appear twice in a string.
 * @param {string} s - Input string consisting of lowercase English letters
 * @return {string} The first character that appears twice
 */
function repeatedCharacter(s) {
  // Step 1: Create a Set to track characters we've seen
  const seen = new Set();

  // Step 2: Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Step 3: Check if we've seen this character before
    if (seen.has(char)) {
      // If yes, this is the first repeat - return immediately
      return char;
    }

    // Step 4: If not seen before, add to our Set
    seen.add(char);
  }

  // Note: The problem guarantees at least one repeat exists,
  // so we'll always return from within the loop
}
```

```java
// Time: O(n) | Space: O(1) or O(26) since only lowercase English letters
class Solution {
    /**
     * Find the first letter to appear twice in a string.
     * @param s Input string consisting of lowercase English letters
     * @return The first character that appears twice
     */
    public char repeatedCharacter(String s) {
        // Step 1: Create a boolean array to track characters we've seen
        // 26 positions for 'a' to 'z'
        boolean[] seen = new boolean[26];

        // Step 2: Iterate through each character in the string
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // Step 3: Calculate index (0-25) for the current character
            int charIndex = currentChar - 'a';

            // Step 4: Check if we've seen this character before
            if (seen[charIndex]) {
                // If yes, this is the first repeat - return immediately
                return currentChar;
            }

            // Step 5: If not seen before, mark it as seen
            seen[charIndex] = true;
        }

        // Note: The problem guarantees at least one repeat exists,
        // so we'll always return from within the loop
        return ' '; // This line won't be reached due to problem constraints
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations (set lookup/insertion or array access) for each character.
- In the worst case, we process all n characters (if the repeat is at the very end).

**Space Complexity: O(1) or O(26)**

- We only store at most 26 characters (lowercase English letters) in our data structure.
- This is considered constant space since it doesn't grow with input size.
- The boolean array approach in Java uses exactly 26 booleans, while the set approaches use at most 26 entries.

## Common Mistakes

1. **Returning the wrong "first" letter**: Some candidates return the first character that has a duplicate anywhere in the string, rather than the character whose second occurrence comes earliest. For example, in `"abac"`, `'a'` repeats at position 2, while `'b'` doesn't repeat at all. The correct answer is `'a'`.

2. **Continuing to search after finding the answer**: Once you find the first repeat, you should return immediately. Continuing to process the rest of the string wastes time and could lead to returning a later repeat instead.

3. **Using inefficient data structures**: Some candidates use a list or array and check membership with linear search (O(n) per check), making the overall solution O(n²). Always use a hash-based structure (set/dictionary) or boolean array for O(1) membership checks.

4. **Forgetting the problem constraints**: The problem states the string contains only lowercase English letters. This allows us to use a fixed-size array of 26 booleans in languages like Java/C++, which is more memory-efficient than a hash set.

## When You'll See This Pattern

This "seen before" pattern with hash sets appears in many coding problems:

1. **Two Sum (LeetCode #1)**: Similar pattern of tracking what we've seen so far to find complements that sum to the target.

2. **Contains Duplicate (LeetCode #217)**: Almost identical pattern - check if any element appears more than once using a hash set.

3. **First Unique Character in a String (LeetCode #387)**: Related inverse problem - find the first character that appears exactly once, often solved by counting occurrences first.

4. **Longest Substring Without Repeating Characters (LeetCode #3)**: Uses a sliding window with a hash set to track characters in the current window.

The core pattern is: when you need to track occurrences or check for duplicates as you process data sequentially, a hash set (or similar structure) is often the right tool.

## Key Takeaways

1. **Hash sets are perfect for duplicate detection**: When you need to check "have I seen this before?" during iteration, a hash set provides O(1) lookup and insertion.

2. **Return early when possible**: Once you find the answer in a search problem, return immediately. This improves best-case performance and simplifies your code.

3. **Pay attention to problem constraints**: The fact that we're only dealing with lowercase English letters allows for optimization (like using a fixed-size array instead of a hash set), which shows attention to detail.

4. **Understand what "first" means**: In sequence problems, carefully read whether "first" refers to position in input order, time of discovery, or some other criterion.

Related problems: [Two Sum](/problem/two-sum), [First Unique Character in a String](/problem/first-unique-character-in-a-string)
