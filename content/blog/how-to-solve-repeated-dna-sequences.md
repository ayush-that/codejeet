---
title: "How to Solve Repeated DNA Sequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Repeated DNA Sequences. Medium difficulty, 52.9% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Sliding Window, Rolling Hash."
date: "2027-04-27"
category: "dsa-patterns"
tags: ["repeated-dna-sequences", "hash-table", "string", "bit-manipulation", "medium"]
---

# How to Solve Repeated DNA Sequences

This problem asks us to find all 10-letter-long sequences (substrings) that occur more than once in a DNA string. What makes this interesting is that while the problem seems straightforward, the optimal solution requires clever use of hashing techniques to handle the constraints efficiently. The DNA string can be up to 100,000 characters long, so we need to be careful about our approach.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the DNA sequence: `s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"`

We're looking for 10-character sequences that repeat:

**Step 1:** Start at index 0: `"AAAAACCCCC"` (positions 0-9)
**Step 2:** Move to index 1: `"AAAACCCCCA"` (positions 1-10)
**Step 3:** Move to index 2: `"AAACCCCCAA"` (positions 2-11)
**Step 4:** Continue this sliding window...
**Step 5:** At index 0: `"AAAAACCCCC"` appears
**Step 6:** At index 9: `"CCCCCAAAAA"` appears
**Step 7:** At index 10: `"CCCCAAAAAC"` appears
**Step 8:** At index 13: `"AAAAAGGGTT"` appears

Now let's track what we've seen:

- `"AAAAACCCCC"` appears at index 0 and index 9 → repeated
- `"CCCCCAAAAA"` appears at index 9 and index 10 → repeated
- `"CCCCAAAAAC"` appears at index 10 and index 11 → repeated
- `"AAAAAGGGTT"` appears only once → not repeated

So our output would be: `["AAAAACCCCC","CCCCCAAAAA","CCCCAAAAAC"]`

Notice that we need to track sequences efficiently without storing every substring directly (which would use too much memory).

## Brute Force Approach

The most straightforward approach is to:

1. Generate every possible 10-character substring
2. Count how many times each appears
3. Return those that appear more than once

<div class="code-group">

```python
# Time: O(10 * n^2) = O(n^2) | Space: O(n)
def findRepeatedDnaSequences_brute(s):
    result = []
    n = len(s)

    # Check every possible starting position
    for i in range(n - 9):
        current_seq = s[i:i+10]
        count = 0

        # Count occurrences of this sequence
        for j in range(n - 9):
            if s[j:j+10] == current_seq:
                count += 1
                if count > 1:
                    # Found a repeat, add to result and break
                    if current_seq not in result:
                        result.append(current_seq)
                    break

    return result
```

```javascript
// Time: O(10 * n^2) = O(n^2) | Space: O(n)
function findRepeatedDnaSequencesBrute(s) {
  const result = [];
  const n = s.length;

  // Check every possible starting position
  for (let i = 0; i <= n - 10; i++) {
    const currentSeq = s.substring(i, i + 10);
    let count = 0;

    // Count occurrences of this sequence
    for (let j = 0; j <= n - 10; j++) {
      if (s.substring(j, j + 10) === currentSeq) {
        count++;
        if (count > 1) {
          // Found a repeat, add to result and break
          if (!result.includes(currentSeq)) {
            result.push(currentSeq);
          }
          break;
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(10 * n^2) = O(n^2) | Space: O(n)
public List<String> findRepeatedDnaSequencesBrute(String s) {
    List<String> result = new ArrayList<>();
    int n = s.length();

    // Check every possible starting position
    for (int i = 0; i <= n - 10; i++) {
        String currentSeq = s.substring(i, i + 10);
        int count = 0;

        // Count occurrences of this sequence
        for (int j = 0; j <= n - 10; j++) {
            if (s.substring(j, j + 10).equals(currentSeq)) {
                count++;
                if (count > 1) {
                    // Found a repeat, add to result and break
                    if (!result.contains(currentSeq)) {
                        result.add(currentSeq);
                    }
                    break;
                }
            }
        }
    }

    return result;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n²) because for each of the (n-9) starting positions, we scan through (n-9) positions to count occurrences
- For n = 100,000, this would be approximately 10¹⁰ operations, which is far too slow
- We're also doing string comparisons which are O(10) operations each time

## Optimized Approach

The key insight is that we don't need to compare strings directly. We can use a hash table to track which sequences we've seen:

1. Use a sliding window of size 10 to move through the string
2. For each window, extract the 10-character substring
3. Use a hash map to count occurrences
4. Sequences with count > 1 are repeated

This reduces the time complexity to O(n) because we only pass through the string once. However, there's still an issue: storing all substrings directly would use O(10n) space, which for n=100,000 is about 1MB of just substring data.

**Even better optimization:** We can use bit manipulation to encode the DNA sequences as integers. Since DNA only has 4 characters (A, C, G, T), we can represent each with 2 bits:

- A = 00 (0)
- C = 01 (1)
- G = 10 (2)
- T = 11 (3)

A 10-character sequence then becomes a 20-bit integer, which fits in a standard integer (32 bits). This allows us to:

1. Use integers as keys in our hash map instead of strings
2. Use a rolling hash to efficiently compute the next sequence
3. Save significant memory and improve performance

## Optimal Solution

Here's the optimal solution using bit manipulation and a rolling hash:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n is length of s
def findRepeatedDnaSequences(s):
    """
    Find all 10-letter-long sequences that occur more than once in a DNA molecule.

    Approach:
    1. Map each DNA character to 2 bits: A=00, C=01, G=10, T=11
    2. Use a sliding window to build 20-bit integer representations of 10-char sequences
    3. Track seen sequences in a dictionary
    4. Return sequences that appear more than once

    The rolling hash technique allows us to efficiently compute the next sequence
    by shifting out the leftmost character and adding the new rightmost character.
    """
    if len(s) < 10:
        return []

    # Map characters to their 2-bit representation
    char_map = {'A': 0, 'C': 1, 'G': 2, 'T': 3}

    # Dictionary to store sequence counts
    seen = {}
    result = []

    # Build the first 10-character sequence as a 20-bit integer
    current_hash = 0
    for i in range(10):
        # Shift left by 2 bits to make room for new character
        # Then OR with the new character's 2-bit value
        current_hash = (current_hash << 2) | char_map[s[i]]

    # Store the first sequence
    seen[current_hash] = 1

    # Create a mask to keep only the last 20 bits (10 chars * 2 bits each)
    mask = (1 << 20) - 1  # 20 bits set to 1

    # Slide the window through the rest of the string
    for i in range(10, len(s)):
        # Remove the leftmost character (shift left by 2, then mask)
        # Add the new character at the rightmost position
        current_hash = ((current_hash << 2) & mask) | char_map[s[i]]

        # Check if we've seen this sequence before
        if current_hash in seen:
            seen[current_hash] += 1
            # If this is the second time we see it, add to result
            if seen[current_hash] == 2:
                # Convert the 20-bit hash back to string
                result.append(s[i-9:i+1])
        else:
            seen[current_hash] = 1

    return result
```

```javascript
// Time: O(n) | Space: O(n) where n is length of s
function findRepeatedDnaSequences(s) {
  /**
   * Find all 10-letter-long sequences that occur more than once in a DNA molecule.
   *
   * Approach:
   * 1. Map each DNA character to 2 bits: A=00, C=01, G=10, T=11
   * 2. Use a sliding window to build 20-bit integer representations of 10-char sequences
   * 3. Track seen sequences in a Map
   * 4. Return sequences that appear more than once
   *
   * The rolling hash technique allows us to efficiently compute the next sequence
   * by shifting out the leftmost character and adding the new rightmost character.
   */
  if (s.length < 10) return [];

  // Map characters to their 2-bit representation
  const charMap = { A: 0, C: 1, G: 2, T: 3 };

  // Map to store sequence counts (key: hash, value: count)
  const seen = new Map();
  const result = [];

  // Build the first 10-character sequence as a 20-bit integer
  let currentHash = 0;
  for (let i = 0; i < 10; i++) {
    // Shift left by 2 bits to make room for new character
    // Then OR with the new character's 2-bit value
    currentHash = (currentHash << 2) | charMap[s[i]];
  }

  // Store the first sequence
  seen.set(currentHash, 1);

  // Create a mask to keep only the last 20 bits (10 chars * 2 bits each)
  const mask = (1 << 20) - 1; // 20 bits set to 1

  // Slide the window through the rest of the string
  for (let i = 10; i < s.length; i++) {
    // Remove the leftmost character (shift left by 2, then mask)
    // Add the new character at the rightmost position
    currentHash = ((currentHash << 2) & mask) | charMap[s[i]];

    // Check if we've seen this sequence before
    const count = seen.get(currentHash) || 0;
    seen.set(currentHash, count + 1);

    // If this is the second time we see it, add to result
    if (count === 1) {
      // Convert back to string by taking substring
      result.push(s.substring(i - 9, i + 1));
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) where n is length of s
public List<String> findRepeatedDnaSequences(String s) {
    /**
     * Find all 10-letter-long sequences that occur more than once in a DNA molecule.
     *
     * Approach:
     * 1. Map each DNA character to 2 bits: A=00, C=01, G=10, T=11
     * 2. Use a sliding window to build 20-bit integer representations of 10-char sequences
     * 3. Track seen sequences in a HashMap
     * 4. Return sequences that appear more than once
     *
     * The rolling hash technique allows us to efficiently compute the next sequence
     * by shifting out the leftmost character and adding the new rightmost character.
     */
    List<String> result = new ArrayList<>();
    if (s.length() < 10) return result;

    // Map characters to their 2-bit representation
    Map<Character, Integer> charMap = new HashMap<>();
    charMap.put('A', 0);
    charMap.put('C', 1);
    charMap.put('G', 2);
    charMap.put('T', 3);

    // HashMap to store sequence counts (key: hash, value: count)
    Map<Integer, Integer> seen = new HashMap<>();

    // Build the first 10-character sequence as a 20-bit integer
    int currentHash = 0;
    for (int i = 0; i < 10; i++) {
        // Shift left by 2 bits to make room for new character
        // Then OR with the new character's 2-bit value
        currentHash = (currentHash << 2) | charMap.get(s.charAt(i));
    }

    // Store the first sequence
    seen.put(currentHash, 1);

    // Create a mask to keep only the last 20 bits (10 chars * 2 bits each)
    int mask = (1 << 20) - 1;  // 20 bits set to 1

    // Slide the window through the rest of the string
    for (int i = 10; i < s.length(); i++) {
        // Remove the leftmost character (shift left by 2, then mask)
        // Add the new character at the rightmost position
        currentHash = ((currentHash << 2) & mask) | charMap.get(s.charAt(i));

        // Check if we've seen this sequence before
        int count = seen.getOrDefault(currentHash, 0);
        seen.put(currentHash, count + 1);

        // If this is the second time we see it, add to result
        if (count == 1) {
            // Convert back to string by taking substring
            result.add(s.substring(i - 9, i + 1));
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once with a sliding window: O(n)
- Each iteration does constant time operations (bit shifts, map lookups)
- Building the first hash takes O(10) = O(1) time

**Space Complexity: O(n)**

- In the worst case, we store every unique 10-character sequence in the hash map
- Each sequence is stored as a 20-bit integer (4 bytes) plus hash map overhead
- The result list stores at most O(n/10) strings
- Total space is proportional to the input size: O(n)

## Common Mistakes

1. **Off-by-one errors with substring indices**: When using `s[i:i+10]` in Python or `substring(i, i+10)` in Java/JavaScript, remember that the end index is exclusive. A common mistake is using `i+9` instead of `i+10`.

2. **Forgetting to handle short strings**: If the input string has fewer than 10 characters, there can't be any 10-character sequences. Always check this edge case early.

3. **Using the wrong data structure for tracking counts**: Using a list or array to track sequences would be inefficient for lookup. A hash map (dictionary) provides O(1) average time for insertions and lookups.

4. **Not handling duplicate results properly**: If a sequence appears 3+ times, it should only be added to the result once. Make sure to check `count == 2` rather than `count > 1` when adding to results to avoid duplicates.

5. **Inefficient string building**: Creating new string objects for each window (like `s.substring(i, i+10)`) in a loop can be memory-intensive. The bit manipulation approach avoids this.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window**: Used to examine contiguous subsequences of fixed length
   - Related problems: Longest Substring Without Repeating Characters, Minimum Window Substring

2. **Rolling Hash**: Using a hash function that can be updated efficiently as the window slides
   - Related problems: Implement strStr(), Longest Duplicate Substring

3. **Bit Manipulation for Encoding**: Representing data compactly using bits
   - Related problems: Single Number, Maximum Product of Word Lengths

4. **Frequency Counting with Hash Maps**: Tracking occurrences of elements
   - Related problems: Two Sum, Group Anagrams

The combination of sliding window with rolling hash is particularly powerful for substring matching problems where you need to compare many fixed-length substrings efficiently.

## Key Takeaways

1. **When dealing with fixed-length substrings, consider a sliding window approach** to avoid redundant computations. Each new window can be computed from the previous one efficiently.

2. **Bit manipulation can dramatically reduce memory usage** when you have a small alphabet. By encoding each character in fewer bits, you can store sequences more compactly and compare them as integers rather than strings.

3. **Rolling hashes are your friend for substring problems**. They allow you to update a hash in O(1) time as you slide a window, making it possible to process very long strings efficiently.

4. **Always consider the constraints**. For n ≤ 100,000, O(n²) solutions won't work. Think about how to reduce the problem to a single pass through the data.

[Practice this problem on CodeJeet](/problem/repeated-dna-sequences)
