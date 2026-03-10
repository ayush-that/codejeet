---
title: "How to Solve Maximum Product of Word Lengths — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product of Word Lengths. Medium difficulty, 61.1% acceptance rate. Topics: Array, String, Bit Manipulation."
date: "2028-05-10"
category: "dsa-patterns"
tags: ["maximum-product-of-word-lengths", "array", "string", "bit-manipulation", "medium"]
---

# How to Solve Maximum Product of Word Lengths

This problem asks us to find the maximum product of lengths of two words that don't share any common letters. What makes this problem interesting is that we need to efficiently check whether two words share letters without comparing them character by character every time. The brute force approach would be too slow for large inputs, so we need a clever way to represent each word's letter composition.

## Visual Walkthrough

Let's trace through a small example: `words = ["abcw","baz","foo","bar","xtfn","abcdef"]`

We want to find two words with no common letters that give us the maximum product of their lengths.

1. **Word 1: "abcw"** (length 4)
   - Compare with "baz": shares 'b' → skip
   - Compare with "foo": no common letters → product = 4 × 3 = 12
   - Compare with "bar": shares 'b' → skip
   - Compare with "xtfn": no common letters → product = 4 × 4 = 16
   - Compare with "abcdef": shares 'a', 'b', 'c' → skip

2. **Word 2: "baz"** (length 3)
   - Compare with "foo": no common letters → product = 3 × 3 = 9
   - Compare with "bar": shares 'b', 'a' → skip
   - Compare with "xtfn": no common letters → product = 3 × 4 = 12
   - Compare with "abcdef": shares 'a', 'b' → skip

3. **Word 3: "foo"** (length 3)
   - Compare with "bar": no common letters → product = 3 × 3 = 9
   - Compare with "xtfn": no common letters → product = 3 × 4 = 12
   - Compare with "abcdef": shares 'f', 'o' not in "abcdef" → actually no common letters → product = 3 × 6 = 18

4. **Word 4: "bar"** (length 3)
   - Compare with "xtfn": no common letters → product = 3 × 4 = 12
   - Compare with "abcdef": shares 'a', 'b' → skip

5. **Word 5: "xtfn"** (length 4)
   - Compare with "abcdef": no common letters → product = 4 × 6 = 24

The maximum product is 24 from "xtfn" (length 4) and "abcdef" (length 6).

The challenge is doing these comparisons efficiently. Checking if two words share letters by comparing each character in one word against each character in the other would be O(L₁ × L₂) per pair, which is too slow.

## Brute Force Approach

The most straightforward approach is to compare every pair of words:

1. For each pair (i, j) where i < j
2. Check if the two words share any common letters
3. If they don't, calculate length(word[i]) × length(word[j])
4. Keep track of the maximum product

The problem with this approach is the letter comparison. We could use sets to check for common letters in O(L₁ + L₂) time, but with n words, we'd have O(n²) pairs, and each comparison would be O(L₁ + L₂). For n words with average length L, this becomes O(n² × L), which is too slow for the constraints (n up to 1000, words up to 1000 characters).

<div class="code-group">

```python
# Time: O(n² × L) where L is average word length | Space: O(L) for sets
def maxProduct(words):
    n = len(words)
    max_prod = 0

    for i in range(n):
        for j in range(i + 1, n):
            # Convert words to sets for O(1) lookups
            set_i = set(words[i])
            set_j = set(words[j])

            # Check if sets are disjoint (no common elements)
            if set_i.isdisjoint(set_j):
                product = len(words[i]) * len(words[j])
                max_prod = max(max_prod, product)

    return max_prod
```

```javascript
// Time: O(n² × L) where L is average word length | Space: O(L) for sets
function maxProduct(words) {
  let maxProd = 0;
  const n = words.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Create sets from the words
      const setI = new Set(words[i]);
      const setJ = new Set(words[j]);

      // Check if sets have any common letters
      let hasCommon = false;
      for (const char of setI) {
        if (setJ.has(char)) {
          hasCommon = true;
          break;
        }
      }

      if (!hasCommon) {
        const product = words[i].length * words[j].length;
        maxProd = Math.max(maxProd, product);
      }
    }
  }

  return maxProd;
}
```

```java
// Time: O(n² × L) where L is average word length | Space: O(L) for sets
public int maxProduct(String[] words) {
    int maxProd = 0;
    int n = words.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Create boolean arrays to track letter presence
            boolean[] letters = new boolean[26];

            // Mark letters from first word
            for (char c : words[i].toCharArray()) {
                letters[c - 'a'] = true;
            }

            // Check if second word has any of these letters
            boolean hasCommon = false;
            for (char c : words[j].toCharArray()) {
                if (letters[c - 'a']) {
                    hasCommon = true;
                    break;
                }
            }

            if (!hasCommon) {
                int product = words[i].length() * words[j].length();
                maxProd = Math.max(maxProd, product);
            }
        }
    }

    return maxProd;
}
```

</div>

## Optimized Approach

The key insight is that we can represent each word's letter composition using **bitmasking**. Since there are only 26 lowercase English letters, we can use a 32-bit integer where each bit represents whether a particular letter is present in the word.

**Why bitmasking works:**

1. Bit 0 (least significant) represents 'a'
2. Bit 1 represents 'b'
3. ...
4. Bit 25 represents 'z'

For example:

- Word "abc" would have bits 0, 1, 2 set: `000...00111` = 7
- Word "def" would have bits 3, 4, 5 set: `000...111000` = 56

To check if two words share letters, we simply check if `(bitmask1 & bitmask2) == 0`. If the bitwise AND is zero, no bits (letters) are common.

**Step-by-step reasoning:**

1. Precompute a bitmask for each word
2. Store both the bitmask and length for each word
3. Compare every pair of words using bitwise AND operation (O(1) time)
4. If `(mask[i] & mask[j]) == 0`, calculate the product and update maximum

This reduces the comparison time from O(L₁ + L₂) to O(1), making the overall complexity O(n² + n × L) where n × L is for building the bitmasks.

## Optimal Solution

Here's the complete solution using bitmasking:

<div class="code-group">

```python
# Time: O(n² + n × L) where n is number of words, L is average length
# Space: O(n) for storing bitmasks and lengths
def maxProduct(words):
    n = len(words)
    # Step 1: Precompute bitmask for each word
    # We'll store both the bitmask and the word length
    masks = [0] * n
    lengths = [0] * n

    for i in range(n):
        word = words[i]
        mask = 0
        # Build bitmask by setting bit for each character
        for ch in word:
            # Shift 1 left by (ord(ch) - ord('a')) positions
            # Then OR it with current mask to set that bit
            mask |= 1 << (ord(ch) - ord('a'))
        masks[i] = mask
        lengths[i] = len(word)

    max_prod = 0
    # Step 2: Compare all pairs of words
    for i in range(n):
        for j in range(i + 1, n):
            # Check if words share any letters using bitwise AND
            # If masks have no bits in common, AND result is 0
            if masks[i] & masks[j] == 0:
                product = lengths[i] * lengths[j]
                max_prod = max(max_prod, product)

    return max_prod
```

```javascript
// Time: O(n² + n × L) where n is number of words, L is average length
// Space: O(n) for storing bitmasks and lengths
function maxProduct(words) {
  const n = words.length;
  // Step 1: Precompute bitmask for each word
  const masks = new Array(n).fill(0);
  const lengths = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let mask = 0;
    const word = words[i];
    // Build bitmask by setting bit for each character
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j) - 97; // 'a' = 97
      // Shift 1 left by charCode positions, then OR with mask
      mask |= 1 << charCode;
    }
    masks[i] = mask;
    lengths[i] = word.length;
  }

  let maxProd = 0;
  // Step 2: Compare all pairs of words
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if words share any letters using bitwise AND
      // If masks have no bits in common, AND result is 0
      if ((masks[i] & masks[j]) === 0) {
        const product = lengths[i] * lengths[j];
        maxProd = Math.max(maxProd, product);
      }
    }
  }

  return maxProd;
}
```

```java
// Time: O(n² + n × L) where n is number of words, L is average length
// Space: O(n) for storing bitmasks and lengths
public int maxProduct(String[] words) {
    int n = words.length;
    // Step 1: Precompute bitmask for each word
    int[] masks = new int[n];
    int[] lengths = new int[n];

    for (int i = 0; i < n; i++) {
        int mask = 0;
        String word = words[i];
        // Build bitmask by setting bit for each character
        for (int j = 0; j < word.length(); j++) {
            char c = word.charAt(j);
            // Shift 1 left by (c - 'a') positions, then OR with mask
            mask |= 1 << (c - 'a');
        }
        masks[i] = mask;
        lengths[i] = word.length();
    }

    int maxProd = 0;
    // Step 2: Compare all pairs of words
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if words share any letters using bitwise AND
            // If masks have no bits in common, AND result is 0
            if ((masks[i] & masks[j]) == 0) {
                int product = lengths[i] * lengths[j];
                maxProd = Math.max(maxProd, product);
            }
        }
    }

    return maxProd;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² + n × L)**

- `n × L`: We iterate through each character of each word once to build the bitmasks. With n words and average length L, this is O(n × L).
- `n²`: We compare every pair of words (n choose 2 pairs ≈ n²/2). Each comparison is O(1) using bitwise AND.
- The dominant term is O(n²) since for large n, n² grows faster than n × L.

**Space Complexity: O(n)**

- We store an integer bitmask and length for each word, so we need O(n) space.
- The bitmasks themselves are just integers (32-bit), so constant space per word.

## Common Mistakes

1. **Forgetting to handle duplicate letters in a word**: When building the bitmask, setting the same bit multiple times doesn't change anything (1 OR 1 = 1), so this isn't actually a problem. But candidates sometimes try to optimize by skipping duplicates, which adds unnecessary complexity.

2. **Incorrect bit shifting**: Using `1 >> (c - 'a')` instead of `1 << (c - 'a')`. The shift direction matters! We need to shift 1 left to position it correctly.

3. **Not checking all pairs**: Some candidates try to sort by length and only check adjacent words, but the two words with maximum product might not be the two longest words that don't share letters. You must check all pairs.

4. **Over-optimizing prematurely**: Trying to use a hashmap of bitmasks to lengths might seem like a good idea, but multiple words can have the same bitmask (e.g., "a", "aa", "aaa" all have the same bitmask). You need to keep only the maximum length for each bitmask to optimize further.

## When You'll See This Pattern

Bitmasking is a powerful technique for problems involving subsets or combinations of a small set of elements (typically ≤ 32 or ≤ 64 for 64-bit integers).

**Related LeetCode problems:**

1. **Counting Bits (LeetCode 338)**: While not exactly the same, it helps practice bit manipulation fundamentals.
2. **Single Number (LeetCode 136)**: Uses XOR bit manipulation to find the unique element.
3. **Subsets (LeetCode 78)**: Can be solved using bitmasking to represent all subsets of a set.
4. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Another bit manipulation problem where you work with binary representations.

The pattern to recognize: when you need to track presence/absence of elements from a small fixed set (like 26 letters, 10 digits, etc.), and especially when you need to compare these sets frequently, bitmasking is often the right approach.

## Key Takeaways

1. **Bitmasking converts set operations to bit operations**: When you have a small fixed universe of elements (like 26 letters), you can represent a set as an integer where each bit represents membership. Set intersection becomes bitwise AND, union becomes bitwise OR.

2. **O(1) set comparisons**: Once you have bitmasks, checking if two sets are disjoint is just `(mask1 & mask2) == 0`, which is much faster than comparing elements.

3. **Look for small alphabets**: This technique works best when the number of possible elements is small enough to fit in an integer (≤ 32 for 32-bit integers, ≤ 64 for 64-bit). English letters (26), digits (10), or other small fixed sets are good candidates.

[Practice this problem on CodeJeet](/problem/maximum-product-of-word-lengths)
