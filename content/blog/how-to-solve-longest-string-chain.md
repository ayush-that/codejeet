---
title: "How to Solve Longest String Chain — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest String Chain. Medium difficulty, 62.8% acceptance rate. Topics: Array, Hash Table, Two Pointers, String, Dynamic Programming."
date: "2027-04-28"
category: "dsa-patterns"
tags: ["longest-string-chain", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Longest String Chain

This problem asks us to find the longest possible chain of words where each word is a predecessor of the next. A word A is a predecessor of word B if we can insert exactly one letter anywhere in word A to make it equal to word B. The tricky part is that the chain doesn't need to be in order in the input array, and we need to find the maximum length chain possible.

What makes this interesting is that it combines string manipulation with dynamic programming and clever sorting. The "predecessor" relationship creates a directed acyclic graph where words are nodes and edges go from shorter words to longer words they can transform into.

## Visual Walkthrough

Let's trace through an example: `words = ["a", "b", "ba", "bca", "bda", "bdca"]`

**Step 1: Understanding the predecessor relationship**

- "a" → "ba" (insert 'b' at beginning)
- "b" → "ba" (insert 'a' at end)
- "ba" → "bca" (insert 'c' after 'b')
- "ba" → "bda" (insert 'd' after 'b')
- "bca" → "bdca" (insert 'd' after 'b')
- "bda" → "bdca" (insert 'c' after 'd')

**Step 2: Building chains**

- Chain 1: "a" → "ba" → "bca" → "bdca" (length 4)
- Chain 2: "b" → "ba" → "bda" → "bdca" (length 4)
- Chain 3: "a" → "ba" → "bda" → "bdca" (length 4)

**Step 3: Key insight**
Notice that we should process words from shortest to longest. For each word, we check all possible predecessors by removing one character at a time. This way, we build up chain lengths incrementally.

## Brute Force Approach

A naive approach would be to try all possible orderings of words and check if each consecutive pair satisfies the predecessor relationship. This is essentially checking all permutations of the words array.

**Why this fails:**

- With n words, there are n! permutations to check
- For n=1000, this is computationally impossible
- Even checking if two words have the predecessor relationship takes O(L) time where L is word length

The brute force approach is exponential and completely impractical for the constraints (1 ≤ words.length ≤ 1000).

## Optimized Approach

The key insight is that this is a **dynamic programming** problem on a **directed acyclic graph**:

1. **Sort words by length** - This ensures we process shorter words before longer ones
2. **Use a hash map** to store the longest chain ending at each word
3. **For each word**, generate all possible predecessors by removing one character
4. **Check if these predecessors exist** in our hash map
5. **Update the chain length** for the current word based on the best predecessor found

**Why this works:**

- By sorting, we guarantee that when we process a word, all its possible predecessors have already been processed
- The hash map gives us O(1) access to check if a predecessor exists and what its chain length is
- Each word's chain length is 1 + the maximum chain length of its valid predecessors

## Optimal Solution

<div class="code-group">

```python
# Time: O(N * L^2) where N = number of words, L = max word length
# Space: O(N) for the hash map
def longestStrChain(words):
    # Sort words by length so we process shorter words first
    # This ensures all possible predecessors are processed before their successors
    words.sort(key=len)

    # dp dictionary: word -> longest chain ending at this word
    # Each word starts with a chain length of 1 (just itself)
    dp = {}
    max_chain = 1  # Minimum chain length is 1 (a single word)

    for word in words:
        # Initialize current word with chain length 1
        dp[word] = 1

        # Try removing each character to find possible predecessors
        # For "bdca", we check: "dca", "bca", "bda", "bdc"
        for i in range(len(word)):
            # Create predecessor by removing character at position i
            predecessor = word[:i] + word[i+1:]

            # If this predecessor exists in our dp dictionary
            if predecessor in dp:
                # Update current word's chain length
                # It can be 1 + the chain length of the predecessor
                dp[word] = max(dp[word], dp[predecessor] + 1)

        # Update the maximum chain length found so far
        max_chain = max(max_chain, dp[word])

    return max_chain
```

```javascript
// Time: O(N * L^2) where N = number of words, L = max word length
// Space: O(N) for the hash map
function longestStrChain(words) {
  // Sort words by length so we process shorter words first
  // This ensures all possible predecessors are processed before their successors
  words.sort((a, b) => a.length - b.length);

  // dp map: word -> longest chain ending at this word
  // Each word starts with a chain length of 1 (just itself)
  const dp = new Map();
  let maxChain = 1; // Minimum chain length is 1 (a single word)

  for (const word of words) {
    // Initialize current word with chain length 1
    dp.set(word, 1);

    // Try removing each character to find possible predecessors
    // For "bdca", we check: "dca", "bca", "bda", "bdc"
    for (let i = 0; i < word.length; i++) {
      // Create predecessor by removing character at position i
      const predecessor = word.slice(0, i) + word.slice(i + 1);

      // If this predecessor exists in our dp map
      if (dp.has(predecessor)) {
        // Update current word's chain length
        // It can be 1 + the chain length of the predecessor
        dp.set(word, Math.max(dp.get(word), dp.get(predecessor) + 1));
      }
    }

    // Update the maximum chain length found so far
    maxChain = Math.max(maxChain, dp.get(word));
  }

  return maxChain;
}
```

```java
// Time: O(N * L^2) where N = number of words, L = max word length
// Space: O(N) for the hash map
import java.util.*;

class Solution {
    public int longestStrChain(String[] words) {
        // Sort words by length so we process shorter words first
        // This ensures all possible predecessors are processed before their successors
        Arrays.sort(words, (a, b) -> a.length() - b.length());

        // dp map: word -> longest chain ending at this word
        // Each word starts with a chain length of 1 (just itself)
        Map<String, Integer> dp = new HashMap<>();
        int maxChain = 1;  // Minimum chain length is 1 (a single word)

        for (String word : words) {
            // Initialize current word with chain length 1
            dp.put(word, 1);

            // Try removing each character to find possible predecessors
            // For "bdca", we check: "dca", "bca", "bda", "bdc"
            for (int i = 0; i < word.length(); i++) {
                // Create predecessor by removing character at position i
                StringBuilder sb = new StringBuilder(word);
                String predecessor = sb.deleteCharAt(i).toString();

                // If this predecessor exists in our dp map
                if (dp.containsKey(predecessor)) {
                    // Update current word's chain length
                    // It can be 1 + the chain length of the predecessor
                    dp.put(word, Math.max(dp.get(word), dp.get(predecessor) + 1));
                }
            }

            // Update the maximum chain length found so far
            maxChain = Math.max(maxChain, dp.get(word));
        }

        return maxChain;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × L²)**

- Sorting takes O(N log N) time
- Outer loop runs N times (once per word)
- Inner loop runs L times (once per character in the word)
- Creating each predecessor takes O(L) time (string slicing/concatenation)
- Total: O(N log N + N × L × L) = O(N × L²) since L² dominates for typical inputs

**Space Complexity: O(N)**

- We store each word in the hash map with its chain length
- The hash map grows linearly with the number of words
- Sorting may use O(log N) space for the recursion stack (depending on implementation)

## Common Mistakes

1. **Not sorting by length first** - This is the most common mistake. Without sorting, you might try to build chains in the wrong order and miss connections. Always process shorter words before longer ones.

2. **Checking insertion instead of removal** - Some candidates try to check if word A can become word B by inserting a character. It's more efficient to check if word B can become word A by removing a character, since we're processing from short to long.

3. **Forgetting to initialize each word with length 1** - Every word is a chain of length 1 by itself. If you forget this initialization, your chains will be off by 1.

4. **Using the wrong data structure for lookup** - Using a list or array for lookups would give O(N) time per lookup instead of O(1). Always use a hash set or hash map for O(1) lookups.

## When You'll See This Pattern

This problem uses a **dynamic programming on DAGs** pattern combined with **sorting for optimal substructure**. You'll see similar patterns in:

1. **Longest Increasing Subsequence (LeetCode 300)** - Both problems involve finding the longest sequence where each element relates to the next in a specific way. The sorting + DP approach is similar.

2. **Word Break (LeetCode 139)** - Both use DP with string manipulation and hash maps for efficient lookups of subproblems.

3. **Maximum Length of Pair Chain (LeetCode 646)** - Similar chain-building problem where you need to sort first to enable optimal substructure.

## Key Takeaways

1. **When building chains or sequences, sort first** - Sorting often reveals the optimal substructure needed for dynamic programming solutions.

2. **Predecessor/relationship checks are often easier in reverse** - Instead of checking if A can become B by adding something, check if B can become A by removing something.

3. **Hash maps are your friend for DP memoization** - When you need to store intermediate results for lookups, hash maps provide O(1) access which is crucial for efficiency.

[Practice this problem on CodeJeet](/problem/longest-string-chain)
