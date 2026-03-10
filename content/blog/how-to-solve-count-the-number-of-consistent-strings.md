---
title: "How to Solve Count the Number of Consistent Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count the Number of Consistent Strings. Easy difficulty, 88.5% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Counting."
date: "2027-06-24"
category: "dsa-patterns"
tags: ["count-the-number-of-consistent-strings", "array", "hash-table", "string", "easy"]
---

# How to Solve Count the Number of Consistent Strings

This problem asks us to count how many strings in an array contain only characters from a given `allowed` string. While conceptually simple, it's an excellent exercise in choosing the right data structure for fast lookups and understanding how to efficiently validate character sets. The tricky part isn't the algorithm itself but recognizing that checking each character against `allowed` needs to be O(1) to avoid O(n²) complexity.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
allowed = "ab"
words = ["ad", "bd", "aaab", "baa", "badab"]
```

**Step 1: Create a lookup set from `allowed`**
We convert `"ab"` to a set: `{'a', 'b'}`. This gives us O(1) membership checks.

**Step 2: Check each word**

- `"ad"`: Check 'a' → in set ✓, check 'd' → NOT in set ✗ → inconsistent
- `"bd"`: Check 'b' → in set ✓, check 'd' → NOT in set ✗ → inconsistent
- `"aaab"`: Check 'a' ✓, 'a' ✓, 'a' ✓, 'b' ✓ → all characters allowed → consistent
- `"baa"`: Check 'b' ✓, 'a' ✓, 'a' ✓ → consistent
- `"badab"`: Check 'b' ✓, 'a' ✓, 'd' → NOT in set ✗ → inconsistent

**Step 3: Count consistent strings**
We found 2 consistent strings: `"aaab"` and `"baa"`.

The key insight: by converting `allowed` to a set, we can check each character in constant time, making the overall solution efficient.

## Brute Force Approach

A naive approach would be to check each character in each word by scanning through the `allowed` string:

```
For each word in words:
    For each character in word:
        found = False
        For each allowed_char in allowed:
            If character == allowed_char:
                found = True
                break
        If not found:
            mark word as inconsistent
            break
```

This brute force solution has O(n × m × k) time complexity, where:

- n = number of words
- m = average word length
- k = length of allowed string

Since `allowed` can have up to 26 characters (all lowercase letters), and words can have up to 10 characters each, this could mean up to 26 × 10 = 260 operations per character check. With 10⁴ words, this becomes 2.6 million operations, which might pass but is inefficient.

The main problem: checking if a character is in `allowed` takes O(k) time instead of O(1). We need constant-time lookups.

## Optimal Solution

The optimal solution uses a hash set (or boolean array) to store allowed characters for O(1) lookups. We iterate through each word and check if all its characters exist in our allowed set.

<div class="code-group">

```python
# Time: O(n × m) where n = len(words), m = avg word length
# Space: O(1) for the set (max 26 characters) or O(k) where k = len(allowed)
def countConsistentStrings(allowed: str, words: List[str]) -> int:
    # Step 1: Create a set of allowed characters for O(1) lookups
    # Using a set is optimal because membership checking is O(1) on average
    allowed_set = set(allowed)

    # Step 2: Initialize counter for consistent strings
    consistent_count = 0

    # Step 3: Check each word in the array
    for word in words:
        # Assume the word is consistent until proven otherwise
        is_consistent = True

        # Step 4: Check every character in the current word
        for char in word:
            # If any character is not in the allowed set,
            # mark the word as inconsistent and break early
            if char not in allowed_set:
                is_consistent = False
                break  # No need to check remaining characters

        # Step 5: If all characters were in allowed_set, increment counter
        if is_consistent:
            consistent_count += 1

    return consistent_count
```

```javascript
// Time: O(n × m) where n = words.length, m = avg word length
// Space: O(1) for the set (max 26 characters) or O(k) where k = allowed.length
function countConsistentStrings(allowed, words) {
  // Step 1: Create a Set from allowed characters for O(1) lookups
  // JavaScript Set provides average O(1) time for has() operation
  const allowedSet = new Set(allowed);

  // Step 2: Initialize counter for consistent strings
  let consistentCount = 0;

  // Step 3: Iterate through each word in the array
  for (const word of words) {
    // Assume the word is consistent until proven otherwise
    let isConsistent = true;

    // Step 4: Check every character in the current word
    for (const char of word) {
      // If any character is not in the allowed set,
      // mark as inconsistent and break early
      if (!allowedSet.has(char)) {
        isConsistent = false;
        break; // Early exit - no need to check remaining chars
      }
    }

    // Step 5: If all characters were in allowedSet, increment counter
    if (isConsistent) {
      consistentCount++;
    }
  }

  return consistentCount;
}
```

```java
// Time: O(n × m) where n = words.length, m = avg word length
// Space: O(1) for the set (max 26 characters) or O(k) where k = allowed.length()
class Solution {
    public int countConsistentStrings(String allowed, String[] words) {
        // Step 1: Create a boolean array for O(1) lookups
        // Since input is lowercase English letters, we can use array[26]
        boolean[] allowedChars = new boolean[26];

        // Mark each allowed character as true
        for (int i = 0; i < allowed.length(); i++) {
            char c = allowed.charAt(i);
            allowedChars[c - 'a'] = true;  // Convert char to index 0-25
        }

        // Step 2: Initialize counter for consistent strings
        int consistentCount = 0;

        // Step 3: Check each word in the array
        for (String word : words) {
            // Assume the word is consistent until proven otherwise
            boolean isConsistent = true;

            // Step 4: Check every character in the current word
            for (int i = 0; i < word.length(); i++) {
                char c = word.charAt(i);
                // If character is not marked as allowed, word is inconsistent
                if (!allowedChars[c - 'a']) {
                    isConsistent = false;
                    break;  // Early exit - no need to check remaining chars
                }
            }

            // Step 5: If all characters were allowed, increment counter
            if (isConsistent) {
                consistentCount++;
            }
        }

        return consistentCount;
    }
}
```

</div>

**Alternative Bitmask Solution:** Since we're only dealing with lowercase English letters (26 possibilities), we can use a 32-bit integer as a bitmask:

```python
def countConsistentStrings(allowed: str, words: List[str]) -> int:
    # Create bitmask where each bit represents whether a character is allowed
    mask = 0
    for char in allowed:
        mask |= 1 << (ord(char) - ord('a'))

    count = 0
    for word in words:
        # Check if all characters in word are in the mask
        valid = True
        for char in word:
            if not (mask >> (ord(char) - ord('a')) & 1):
                valid = False
                break
        if valid:
            count += 1

    return count
```

The bitmask approach has the same time complexity but uses even less space (just one integer).

## Complexity Analysis

**Time Complexity:** O(n × m)

- n = number of words in the array
- m = average length of each word
- We iterate through each word (n iterations) and check each character in that word (m iterations per word)
- The lookup operation (checking if a character is in the set) is O(1) on average

**Space Complexity:** O(1) or O(k)

- The set/array stores at most 26 characters (all lowercase English letters)
- In asymptotic notation, this is O(1) since it's bounded by a constant (26)
- More precisely, it's O(k) where k = length of allowed string, but k ≤ 26

The space for the output (just an integer counter) is O(1).

## Common Mistakes

1. **Not using a set for O(1) lookups:** Some candidates check each character by scanning through the `allowed` string, resulting in O(n × m × k) time instead of O(n × m). This might still pass given constraints but is inefficient.

2. **Forgetting to break early:** When you find an invalid character in a word, you should immediately break out of the inner loop. Continuing to check the rest of the characters wastes time.

3. **Incorrect character indexing in Java array solution:** When using a boolean array of size 26, candidates might incorrectly calculate `c - 'a'` or use `c - 97` without explanation. Always use `c - 'a'` for clarity.

4. **Not handling empty `allowed` or empty `words`:** While the problem guarantees `allowed` contains at least 1 character and `words` has at least 1 element, it's good practice to mention edge cases. If `allowed` were empty, no words could be consistent.

5. **Assuming `allowed` has unique characters:** The problem states `allowed` consists of **distinct** characters, so we don't need to deduplicate. But if this weren't specified, we should still use a set to avoid duplicates.

## When You'll See This Pattern

This problem uses the **character validation with lookup set** pattern, which appears in many string processing problems:

1. **Valid Anagram (LeetCode 242):** Check if two strings have the same character counts using frequency arrays.
2. **First Unique Character in a String (LeetCode 387):** Use frequency counting to find the first non-repeating character.
3. **Jewels and Stones (LeetCode 771):** Count how many characters in one string appear in another string's set.
4. **Ransom Note (LeetCode 383):** Check if magazine has enough of each character to form ransom note using frequency counting.

The core pattern: when you need to check membership or count occurrences of characters, use a hash set or frequency array for O(1) lookups instead of O(n) linear searches.

## Key Takeaways

1. **Use the right data structure for lookups:** When checking if elements belong to a set, convert the set to a hash-based structure (Python set, JavaScript Set, Java HashSet or boolean array) for O(1) membership tests.

2. **Early exit improves efficiency:** Once you find a character that makes a word inconsistent, stop checking the rest of that word. This optimization is especially valuable when words are long.

3. **Consider bit manipulation for bounded character sets:** When dealing with only lowercase/uppercase English letters (26 possibilities each), a 32-bit integer can serve as an efficient bitmask to track character presence.

4. **Understand problem constraints:** The fact that `allowed` has distinct characters and contains only lowercase English letters informs our solution choices. Always read constraints carefully.

**Related problems:** [Count Pairs Of Similar Strings](/problem/count-pairs-of-similar-strings)
