---
title: "How to Solve Count Words Obtained After Adding a Letter — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Words Obtained After Adding a Letter. Medium difficulty, 43.9% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Sorting."
date: "2028-11-13"
category: "dsa-patterns"
tags: ["count-words-obtained-after-adding-a-letter", "array", "hash-table", "string", "medium"]
---

# How to Solve Count Words Obtained After Adding a Letter

This problem asks us to determine how many target words can be formed by taking a start word, adding exactly one new letter, and rearranging the letters. The challenge is that we need to check this relationship efficiently for potentially thousands of words, where each word can have up to 26 lowercase letters. The key insight is recognizing that the order of letters doesn't matter—only which letters are present—and that we can use bitmask representations to compare word sets in constant time.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

```
startWords = ["ant", "act", "tack"]
targetWords = ["tack", "act", "anti"]
```

**Step 1: Understanding the operation**
For each target word, we need to check if removing one letter gives us a start word (after sorting). For "tack":

- Remove 't' → "ack" → sort → "ack" (not in start words)
- Remove 'a' → "tck" → sort → "ckt" (not in start words)
- Remove 'c' → "tak" → sort → "akt" (not in start words)
- Remove 'k' → "tac" → sort → "act" → "act" IS in start words ✓

**Step 2: Efficient representation**
Instead of trying all removals for each target, we can represent each start word as a bitmask:

- "ant" → a=1, n=1, t=1 → bits for a,n,t set
- "act" → a=1, c=1, t=1 → bits for a,c,t set
- "tack" → t=1, a=1, c=1, k=1 → bits for t,a,c,k set

**Step 3: Checking efficiently**
For target "tack" (bits: t,a,c,k):

- Try removing each bit: t,a,c,k
- Removing 'k' gives bits t,a,c → this matches "act" ✓

For target "anti" (bits: a,n,t,i):

- Try removing each bit: a,n,t,i
- Removing 'i' gives bits a,n,t → this matches "ant" ✓

So 2 target words can be formed.

## Brute Force Approach

A naive approach would be: for each target word, for each start word, check if the target can be formed by adding one letter to the start word. This requires:

1. Sorting both words to handle rearrangements
2. Checking if the sorted start word is a prefix of the sorted target word (with one extra letter)

**Why this fails:**
With n start words and m target words, each of length up to L, the time complexity would be O(m × n × L log L) for sorting and comparisons. For the constraints (up to 5×10⁴ words each), this is far too slow—potentially 2.5 billion operations.

Even if we pre-sort all words, we still have O(m × n × L) for comparisons, which is still too slow. We need a way to check each target word against all start words in better than O(n) time.

## Optimized Approach

The key insight is that **if target T can be formed from start S by adding one letter, then removing any one letter from T should give us S (after sorting)**.

This leads to our optimized strategy:

1. **Preprocess start words:**
   - Convert each start word to a bitmask (26 bits, one for each letter)
   - Store these bitmasks in a hash set for O(1) lookups

2. **Check each target word:**
   - Convert target word to bitmask
   - For each set bit (each letter present), create a candidate by removing that bit
   - Check if the candidate exists in our start words set

3. **Why this works:**
   - Bitmask representation makes letter presence checks O(1)
   - Removing a bit is O(1) using bit operations
   - Checking existence in hash set is O(1) on average
   - Each target word requires at most 26 checks (one per letter)

The critical realization is that we don't need to check all start words—we just need to check if any start word matches our candidate, which the hash set lets us do in constant time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N + M * L) where N = total chars in startWords, M = # of targetWords, L = avg target word length
# Space: O(N) for storing start word bitmasks
def wordCount(startWords, targetWords):
    # Step 1: Convert all start words to bitmasks and store in a set
    # Each bit represents whether a letter (a-z) is present in the word
    start_masks = set()

    for word in startWords:
        mask = 0
        # Build bitmask for current start word
        for ch in word:
            # Set the bit for this character
            # 'a' -> bit 0, 'b' -> bit 1, ..., 'z' -> bit 25
            bit_position = ord(ch) - ord('a')
            mask |= (1 << bit_position)
        start_masks.add(mask)

    count = 0

    # Step 2: Check each target word
    for word in targetWords:
        # Build bitmask for current target word
        target_mask = 0
        for ch in word:
            bit_position = ord(ch) - ord('a')
            target_mask |= (1 << bit_position)

        # Step 3: Try removing each letter from the target word
        # and check if the resulting mask exists in start_masks
        for ch in word:
            bit_position = ord(ch) - ord('a')
            # Create candidate by removing this letter
            candidate_mask = target_mask ^ (1 << bit_position)  # XOR toggles the bit off

            # Check if candidate exists in our start words
            if candidate_mask in start_masks:
                count += 1
                break  # Found a valid conversion, move to next target word

    return count
```

```javascript
// Time: O(N + M * L) where N = total chars in startWords, M = # of targetWords, L = avg target word length
// Space: O(N) for storing start word bitmasks
function wordCount(startWords, targetWords) {
  // Step 1: Convert all start words to bitmasks and store in a Set
  const startMasks = new Set();

  for (const word of startWords) {
    let mask = 0;
    // Build bitmask for current start word
    for (const ch of word) {
      // Set the bit for this character
      // 'a' -> bit 0, 'b' -> bit 1, ..., 'z' -> bit 25
      const bitPosition = ch.charCodeAt(0) - "a".charCodeAt(0);
      mask |= 1 << bitPosition;
    }
    startMasks.add(mask);
  }

  let count = 0;

  // Step 2: Check each target word
  for (const word of targetWords) {
    // Build bitmask for current target word
    let targetMask = 0;
    for (const ch of word) {
      const bitPosition = ch.charCodeAt(0) - "a".charCodeAt(0);
      targetMask |= 1 << bitPosition;
    }

    // Step 3: Try removing each letter from the target word
    // and check if the resulting mask exists in startMasks
    for (const ch of word) {
      const bitPosition = ch.charCodeAt(0) - "a".charCodeAt(0);
      // Create candidate by removing this letter
      // XOR toggles the bit: if it's 1, it becomes 0 (removes the letter)
      const candidateMask = targetMask ^ (1 << bitPosition);

      // Check if candidate exists in our start words
      if (startMasks.has(candidateMask)) {
        count++;
        break; // Found a valid conversion, move to next target word
      }
    }
  }

  return count;
}
```

```java
// Time: O(N + M * L) where N = total chars in startWords, M = # of targetWords, L = avg target word length
// Space: O(N) for storing start word bitmasks
class Solution {
    public int wordCount(String[] startWords, String[] targetWords) {
        // Step 1: Convert all start words to bitmasks and store in a HashSet
        Set<Integer> startMasks = new HashSet<>();

        for (String word : startWords) {
            int mask = 0;
            // Build bitmask for current start word
            for (char ch : word.toCharArray()) {
                // Set the bit for this character
                // 'a' -> bit 0, 'b' -> bit 1, ..., 'z' -> bit 25
                int bitPosition = ch - 'a';
                mask |= (1 << bitPosition);
            }
            startMasks.add(mask);
        }

        int count = 0;

        // Step 2: Check each target word
        for (String word : targetWords) {
            // Build bitmask for current target word
            int targetMask = 0;
            for (char ch : word.toCharArray()) {
                int bitPosition = ch - 'a';
                targetMask |= (1 << bitPosition);
            }

            // Step 3: Try removing each letter from the target word
            // and check if the resulting mask exists in startMasks
            for (char ch : word.toCharArray()) {
                int bitPosition = ch - 'a';
                // Create candidate by removing this letter
                // XOR toggles the bit: if it's 1, it becomes 0 (removes the letter)
                int candidateMask = targetMask ^ (1 << bitPosition);

                // Check if candidate exists in our start words
                if (startMasks.contains(candidateMask)) {
                    count++;
                    break;  // Found a valid conversion, move to next target word
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N + M × L)**

- **N**: Total characters across all start words. We process each character once to build bitmasks.
- **M**: Number of target words.
- **L**: Average length of target words. For each target word, we:
  1. Build its bitmask (O(L))
  2. Try removing each of its L letters (O(L) checks, each O(1))
- Total: O(N) for processing start words + O(M × L) for processing target words.

**Space Complexity: O(N)**

- We store a bitmask for each start word in a hash set.
- In the worst case, all start words are unique, so we store O(n) bitmasks where n is the number of start words.
- Each bitmask is an integer (32 bits), so constant space per word.

## Common Mistakes

1. **Not breaking early when a match is found**: Once you find that a target word can be formed from some start word, you should immediately move to the next target word. Continuing to check other letters wastes time and could lead to double-counting if you're not careful.

2. **Using sorting instead of bitmasks**: Some candidates try to sort all words and compare. While this conceptually works, it's much slower (O(L log L) per word vs O(L) for bitmasks) and doesn't leverage the constant-time operations that bitmasks provide.

3. **Incorrect bit manipulation for removal**: Using `targetMask - (1 << bitPosition)` instead of XOR or AND with complement. Subtraction works mathematically but is less clear and could have issues. The cleanest approach is `targetMask ^ (1 << bitPosition)` or `targetMask & ~(1 << bitPosition)`.

4. **Forgetting that start words cannot be rearranged before adding a letter**: The problem states you can only add a letter then rearrange. Some candidates mistakenly think you can rearrange the start word first. Our solution correctly handles this because bitmasks are order-agnostic.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Bitmask representation for sets**: Whenever you have a small fixed alphabet (like 26 lowercase letters), bitmasks provide a compact, fast way to represent which elements are in a set. You'll see this in:
   - **Maximum Product of Word Lengths** (LeetCode 318): Uses bitmasks to quickly check if two words share letters.
   - **Find the Longest Substring Containing Vowels in Even Counts** (LeetCode 1371): Uses bitmasks to track parity of vowel counts.

2. **"One edit away" problems**: Problems where you need to check if two strings differ by exactly one operation (add, remove, or change). You'll see this in:
   - **Strings Differ by One Character** (LeetCode 1554): Check if any two strings differ by exactly one character.
   - **One Edit Distance** (LeetCode 161): Check if two strings are one edit apart.

## Key Takeaways

1. **Bitmasks are perfect for small alphabet sets**: When dealing with subsets of a fixed, small set (like 26 letters), bitmask representation gives you O(1) set operations and comparisons.

2. **Transform the problem**: Instead of checking "can we add to start to get target," we transformed to "can we remove from target to get start." This reversal is often useful in string manipulation problems.

3. **Hash sets enable O(1) existence checks**: By storing processed data in a hash set, we can answer "does this exist?" questions in constant time, turning O(n²) problems into O(n) problems.

Related problems: [Strings Differ by One Character](/problem/strings-differ-by-one-character), [Count Substrings That Differ by One Character](/problem/count-substrings-that-differ-by-one-character), [Maximum Score From Removing Substrings](/problem/maximum-score-from-removing-substrings)
