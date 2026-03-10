---
title: "How to Solve Number of Valid Words for Each Puzzle — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Valid Words for Each Puzzle. Hard difficulty, 47.7% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Trie."
date: "2029-02-17"
category: "dsa-patterns"
tags: ["number-of-valid-words-for-each-puzzle", "array", "hash-table", "string", "hard"]
---

# How to Solve Number of Valid Words for Each Puzzle

This problem asks us to count how many words from a given list are valid for each puzzle string. A word is valid for a puzzle if: (1) it contains the puzzle's first letter, and (2) all letters in the word appear in the puzzle. The challenge comes from the constraints: up to 10⁵ words and 10⁴ puzzles, making brute force checking every word against every puzzle infeasible.

## Visual Walkthrough

Let's trace through a small example:

- Words: `["aa", "aaa", "bb", "bc"]`
- Puzzles: `["abc", "ac"]`

For puzzle `"abc"` (first letter `'a'`):

- `"aa"`: Contains `'a'` ✓, all letters in puzzle ✓ → valid
- `"aaa"`: Contains `'a'` ✓, all letters in puzzle ✓ → valid
- `"bb"`: Doesn't contain `'a'` ✗ → invalid
- `"bc"`: Contains `'a'` ✗ → invalid
  Result: 2 valid words

For puzzle `"ac"` (first letter `'a'`):

- `"aa"`: Contains `'a'` ✓, all letters in puzzle ✓ → valid
- `"aaa"`: Contains `'a'` ✓, all letters in puzzle ✓ → valid
- `"bb"`: Doesn't contain `'a'` ✗ → invalid
- `"bc"`: Contains `'a'` ✗ → invalid
  Result: 2 valid words

Final answer: `[2, 2]`

The brute force approach would check each word against each puzzle, but with 10⁵ words and 10⁴ puzzles, that's 10⁹ operations — far too slow.

## Brute Force Approach

The most straightforward solution is to check every word against every puzzle:

1. For each puzzle, initialize a counter to 0
2. For each word, check if it contains the puzzle's first letter
3. Check if every character in the word exists in the puzzle
4. If both conditions pass, increment the counter

<div class="code-group">

```python
# Time: O(W * P * L) where W = words, P = puzzles, L = word length
# Space: O(1) excluding input/output
def findNumOfValidWords(words, puzzles):
    result = []

    for puzzle in puzzles:
        count = 0
        first_char = puzzle[0]
        puzzle_set = set(puzzle)

        for word in words:
            # Check condition 1: word contains first letter
            if first_char not in word:
                continue

            # Check condition 2: all letters in word are in puzzle
            valid = True
            for char in word:
                if char not in puzzle_set:
                    valid = False
                    break

            if valid:
                count += 1

        result.append(count)

    return result
```

```javascript
// Time: O(W * P * L) where W = words, P = puzzles, L = word length
// Space: O(1) excluding input/output
function findNumOfValidWords(words, puzzles) {
  const result = [];

  for (const puzzle of puzzles) {
    let count = 0;
    const firstChar = puzzle[0];
    const puzzleSet = new Set(puzzle);

    for (const word of words) {
      // Check condition 1: word contains first letter
      if (!word.includes(firstChar)) {
        continue;
      }

      // Check condition 2: all letters in word are in puzzle
      let valid = true;
      for (const char of word) {
        if (!puzzleSet.has(char)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        count++;
      }
    }

    result.push(count);
  }

  return result;
}
```

```java
// Time: O(W * P * L) where W = words, P = puzzles, L = word length
// Space: O(1) excluding input/output
public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
    List<Integer> result = new ArrayList<>();

    for (String puzzle : puzzles) {
        int count = 0;
        char firstChar = puzzle.charAt(0);
        Set<Character> puzzleSet = new HashSet<>();
        for (char c : puzzle.toCharArray()) {
            puzzleSet.add(c);
        }

        for (String word : words) {
            // Check condition 1: word contains first letter
            if (word.indexOf(firstChar) == -1) {
                continue;
            }

            // Check condition 2: all letters in word are in puzzle
            boolean valid = true;
            for (char c : word.toCharArray()) {
                if (!puzzleSet.contains(c)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                count++;
            }
        }

        result.add(count);
    }

    return result;
}
```

</div>

This brute force approach is too slow because with 10⁵ words and 10⁴ puzzles, even with short words, we're looking at billions of operations.

## Optimized Approach

The key insight is that we can use **bitmask representation** and **subset enumeration**:

1. **Bitmask Representation**: Since puzzles have at most 7 letters (given constraints), we can represent each word and puzzle as a 26-bit integer where bit i is 1 if the corresponding letter exists. This compresses string comparisons to integer operations.

2. **First Letter Constraint**: We only care about words containing the puzzle's first letter. So we can group words by their bitmask and only consider those with the first letter bit set.

3. **Subset Matching**: For a word to be valid for a puzzle, the word's bitmask must be a **subset** of the puzzle's bitmask. In bit terms: `(wordMask & puzzleMask) == wordMask`.

4. **Optimization Trick**: Instead of checking all words against each puzzle, we can:
   - Precompute frequency of each word mask
   - For each puzzle, generate all subsets of its mask that contain the first letter
   - Sum frequencies of word masks that match these subsets

Why this works: If a word is valid for a puzzle, its mask must be a subset of the puzzle's mask AND contain the first letter. By enumerating all subsets of the puzzle mask that contain the first letter, we're checking all possible valid word masks.

## Optimal Solution

<div class="code-group">

```python
# Time: O(W * L + P * 2^7) where W = words, P = puzzles, L = word length
# Space: O(W) for the frequency map
def findNumOfValidWords(words, puzzles):
    # Step 1: Create frequency map of word masks
    freq = {}
    for word in words:
        mask = 0
        # Convert word to bitmask
        for ch in word:
            mask |= 1 << (ord(ch) - ord('a'))
        freq[mask] = freq.get(mask, 0) + 1

    result = []

    # Step 2: Process each puzzle
    for puzzle in puzzles:
        # Get puzzle mask
        puzzle_mask = 0
        for ch in puzzle:
            puzzle_mask |= 1 << (ord(ch) - ord('a'))

        # Get first letter mask
        first = 1 << (ord(puzzle[0]) - ord('a'))

        # Step 3: Enumerate all subsets of puzzle mask that contain first letter
        count = 0
        subset = puzzle_mask

        # This loop generates all subsets of puzzle_mask using bit manipulation
        while subset:
            # Check if subset contains first letter
            if subset & first:
                # Add count of words with exactly this mask
                count += freq.get(subset, 0)
            # Move to next subset (decrement and mask with puzzle_mask)
            subset = (subset - 1) & puzzle_mask

        result.append(count)

    return result
```

```javascript
// Time: O(W * L + P * 2^7) where W = words, P = puzzles, L = word length
// Space: O(W) for the frequency map
function findNumOfValidWords(words, puzzles) {
  // Step 1: Create frequency map of word masks
  const freq = new Map();

  for (const word of words) {
    let mask = 0;
    // Convert word to bitmask
    for (const ch of word) {
      mask |= 1 << (ch.charCodeAt(0) - "a".charCodeAt(0));
    }
    freq.set(mask, (freq.get(mask) || 0) + 1);
  }

  const result = [];

  // Step 2: Process each puzzle
  for (const puzzle of puzzles) {
    // Get puzzle mask
    let puzzleMask = 0;
    for (const ch of puzzle) {
      puzzleMask |= 1 << (ch.charCodeAt(0) - "a".charCodeAt(0));
    }

    // Get first letter mask
    const first = 1 << (puzzle.charCodeAt(0) - "a".charCodeAt(0));

    // Step 3: Enumerate all subsets of puzzle mask that contain first letter
    let count = 0;
    let subset = puzzleMask;

    // This loop generates all subsets of puzzleMask using bit manipulation
    while (subset) {
      // Check if subset contains first letter
      if (subset & first) {
        // Add count of words with exactly this mask
        count += freq.get(subset) || 0;
      }
      // Move to next subset (decrement and mask with puzzleMask)
      subset = (subset - 1) & puzzleMask;
    }

    result.push(count);
  }

  return result;
}
```

```java
// Time: O(W * L + P * 2^7) where W = words, P = puzzles, L = word length
// Space: O(W) for the frequency map
public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
    // Step 1: Create frequency map of word masks
    Map<Integer, Integer> freq = new HashMap<>();

    for (String word : words) {
        int mask = 0;
        // Convert word to bitmask
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);
            mask |= 1 << (ch - 'a');
        }
        freq.put(mask, freq.getOrDefault(mask, 0) + 1);
    }

    List<Integer> result = new ArrayList<>();

    // Step 2: Process each puzzle
    for (String puzzle : puzzles) {
        // Get puzzle mask
        int puzzleMask = 0;
        for (int i = 0; i < puzzle.length(); i++) {
            char ch = puzzle.charAt(i);
            puzzleMask |= 1 << (ch - 'a');
        }

        // Get first letter mask
        int first = 1 << (puzzle.charAt(0) - 'a');

        // Step 3: Enumerate all subsets of puzzle mask that contain first letter
        int count = 0;
        int subset = puzzleMask;

        // This loop generates all subsets of puzzleMask using bit manipulation
        while (subset != 0) {
            // Check if subset contains first letter
            if ((subset & first) != 0) {
                // Add count of words with exactly this mask
                count += freq.getOrDefault(subset, 0);
            }
            // Move to next subset (decrement and mask with puzzleMask)
            subset = (subset - 1) & puzzleMask;
        }

        result.add(count);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(W × L + P × 2⁷)

- W × L: Building the frequency map by processing each character in each word
- P × 2⁷: For each puzzle, we enumerate at most 2⁷ = 128 subsets (since puzzles have ≤ 7 unique letters)
- This is efficient because 2⁷ is constant (128), making it O(P) for the puzzle processing

**Space Complexity**: O(W)

- We store a frequency map with at most W entries (one for each unique word mask)
- In practice, many words share the same mask, so it's often less than W

## Common Mistakes

1. **Forgetting to deduplicate letters within words**: Words like `"aaa"` and `"aa"` should have the same mask. The bitmask approach automatically handles this since setting the same bit multiple times has no effect.

2. **Incorrect subset enumeration**: The loop `subset = (subset - 1) & puzzleMask` is crucial. Starting from `puzzleMask` and decrementing while ANDing with `puzzleMask` ensures we only get valid subsets. A common mistake is to iterate from 0 to `puzzleMask` and check if each number is a subset.

3. **Missing the empty subset**: Our while loop stops when `subset = 0`, which correctly excludes the empty subset (since it doesn't contain the first letter anyway). Some implementations might incorrectly include or exclude this case.

4. **Not handling duplicate words**: The frequency map correctly counts duplicate words with the same mask. A simple set would lose this information and undercount.

## When You'll See This Pattern

This **bitmask + subset enumeration** pattern appears in several problems:

1. **Maximum Product of Word Lengths (LeetCode 318)**: Uses bitmasks to represent words and bitwise AND to check for common letters.

2. **Subsets (LeetCode 78)**: The subset enumeration technique (`(subset - 1) & mask`) is directly applicable here.

3. **Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)**: Uses similar bit manipulation techniques for efficient computation.

The pattern is useful when:

- You need to represent sets of limited size (≤ 32 or 64 elements)
- You need to check subset/superset relationships
- The problem involves combinations or subsets of a fixed set

## Key Takeaways

1. **Bitmask compression**: When dealing with sets of limited size (like 26 letters), bitmasks provide O(1) set operations and efficient storage.

2. **Subset enumeration trick**: The pattern `subset = (subset - 1) & mask` efficiently enumerates all subsets of a bitmask in decreasing order.

3. **Precomputation + query**: When you have many queries (puzzles) against a fixed dataset (words), precompute information about the dataset to answer queries quickly.

[Practice this problem on CodeJeet](/problem/number-of-valid-words-for-each-puzzle)
