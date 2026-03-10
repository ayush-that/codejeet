---
title: "How to Solve Word Ladder — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Word Ladder. Hard difficulty, 44.9% acceptance rate. Topics: Hash Table, String, Breadth-First Search."
date: "2026-07-06"
category: "dsa-patterns"
tags: ["word-ladder", "hash-table", "string", "breadth-first-search", "hard"]
---

# How to Solve Word Ladder

Word Ladder is a classic graph search problem disguised as a word puzzle. You're given a start word, an end word, and a dictionary, and you need to find the shortest sequence where each adjacent word differs by exactly one letter. What makes this problem tricky is that the search space can be enormous—with a dictionary of 5,000 words, checking all possible transformations naively would be impossibly slow. The key insight is recognizing this as a shortest-path problem in an implicit graph where words are nodes and edges connect words that differ by one letter.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]

We want the shortest path from "hit" to "cog" where each step changes exactly one letter.

**Step 1:** Start with "hit". What words can we transform it to? Words that differ by one letter:

- Change 'h' to 'd' → "dit" (not in dictionary)
- Change 'h' to 'l' → "lit" (not in dictionary)
- Change 'h' to 'h' → "hit" (same word)
- Change 'h' to 'c' → "cit" (not in dictionary)
- Change 'h' to 'h' → "hit" (same word)
- Change 'i' to 'o' → "hot" ✓ (in dictionary!)
- Change 't' to 'g' → "hig" (not in dictionary)

So from "hit", we can only go to "hot".

**Step 2:** From "hot", what's reachable?

- Change 'h' to 'd' → "dot" ✓
- Change 'h' to 'l' → "lot" ✓
- Change 'o' to 'i' → "hit" (already visited)
- Change 't' to 'g' → "hog" (not in dictionary)

Now we have two paths: "hit" → "hot" → "dot" and "hit" → "hot" → "lot"

**Step 3:** Continue this BFS (breadth-first search) process:

- From "dot": can go to "dog" (change 't' to 'g')
- From "lot": can go to "log" (change 't' to 'g')
- From "dog": can go to "cog" (change 'd' to 'c') ✓ Found it!
- From "log": can go to "cog" (change 'l' to 'c') ✓ Also found it!

The shortest path length is 5: "hit" → "hot" → "dot" → "dog" → "cog" (or "hit" → "hot" → "lot" → "log" → "cog")

Notice we used BFS because it naturally finds the shortest path in an unweighted graph. Each "level" of BFS represents all words reachable in exactly N transformations.

## Brute Force Approach

A naive approach would be to generate all possible transformations from each word and check if they're in the dictionary. For a word of length L, there are 26×L possible transformations (changing each position to each of 26 letters). For each word we visit, we'd check all 26×L possibilities against the dictionary.

The problem with this brute force approach is the combinatorial explosion. If we have N words in the dictionary and each word has length L, checking all transformations for all words would be O(N × 26×L × L) in the worst case (the extra L comes from string comparison). With N=5000 and L=10, that's about 13 million operations just for the comparisons, but the real issue is we might explore many unnecessary paths.

Even worse, if we don't track visited words, we could get stuck in cycles or revisit the same word multiple times through different paths. The brute force approach lacks the systematic exploration that BFS provides for shortest path problems.

## Optimized Approach

The key insight is that Word Ladder is essentially a **shortest path problem in an unweighted graph**:

- **Nodes**: Words (beginWord + words in wordList)
- **Edges**: Connect two words if they differ by exactly one letter
- **Goal**: Find shortest path from beginWord to endWord

BFS is perfect for this because it explores all nodes at distance 1, then distance 2, etc., guaranteeing the first time we reach endWord is via the shortest path.

However, there's a clever optimization: instead of comparing each word with every other word (O(N²)), we can generate all possible "patterns" for each word. For example, "hot" has patterns: "*ot", "h*t", "ho*". If another word matches any of these patterns (like "dot" matches "*ot"), they're connected.

This pattern-matching approach reduces the complexity dramatically. We build an adjacency list by:

1. For each word, generate all its patterns (L patterns per word, where L is word length)
2. Map each pattern to all words that match it
3. Use BFS to traverse from beginWord to endWord using these pattern connections

## Optimal Solution

Here's the complete solution using BFS with pattern optimization:

<div class="code-group">

```python
from collections import deque, defaultdict
from typing import List

# Time: O(N × L²) where N = number of words, L = length of each word
# Space: O(N × L²) for the adjacency dictionary
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        # If endWord is not in wordList, transformation is impossible
        if endWord not in wordList:
            return 0

        # Convert wordList to set for O(1) lookups
        wordSet = set(wordList)

        # Create adjacency dictionary: pattern -> list of words matching that pattern
        # Example: "*ot" -> ["hot", "dot", "lot"]
        adj = defaultdict(list)

        # Add beginWord to the wordSet so we can generate its patterns too
        wordSet.add(beginWord)

        # Build the pattern adjacency list
        for word in wordSet:
            # For each position in the word, create a pattern with '*' at that position
            for i in range(len(word)):
                # Create pattern like "h*t" for "hot" at position 1
                pattern = word[:i] + "*" + word[i+1:]
                # Add this word to the list of words matching this pattern
                adj[pattern].append(word)

        # BFS initialization
        queue = deque([beginWord])
        visited = set([beginWord])
        transformations = 1  # Start counting from beginWord

        # BFS traversal
        while queue:
            # Process all nodes at the current level
            for _ in range(len(queue)):
                current_word = queue.popleft()

                # If we reached the endWord, return the number of transformations
                if current_word == endWord:
                    return transformations

                # Generate all patterns for the current word
                for i in range(len(current_word)):
                    pattern = current_word[:i] + "*" + current_word[i+1:]

                    # Explore all neighbors (words sharing this pattern)
                    for neighbor in adj[pattern]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

            # After processing each level, increment transformation count
            transformations += 1

        # If BFS completes without finding endWord, return 0
        return 0
```

```javascript
// Time: O(N × L²) where N = number of words, L = length of each word
// Space: O(N × L²) for the adjacency map
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function (beginWord, endWord, wordList) {
  // If endWord is not in wordList, transformation is impossible
  if (!wordList.includes(endWord)) {
    return 0;
  }

  // Convert wordList to Set for O(1) lookups
  const wordSet = new Set(wordList);

  // Add beginWord to the set so we can generate its patterns
  wordSet.add(beginWord);

  // Create adjacency map: pattern -> array of words matching that pattern
  const adj = new Map();

  // Build the pattern adjacency map
  for (const word of wordSet) {
    // For each position in the word, create a pattern with '*' at that position
    for (let i = 0; i < word.length; i++) {
      // Create pattern like "h*t" for "hot" at position 1
      const pattern = word.substring(0, i) + "*" + word.substring(i + 1);

      // Initialize array for this pattern if it doesn't exist
      if (!adj.has(pattern)) {
        adj.set(pattern, []);
      }

      // Add this word to the list of words matching this pattern
      adj.get(pattern).push(word);
    }
  }

  // BFS initialization
  const queue = [beginWord];
  const visited = new Set([beginWord]);
  let transformations = 1; // Start counting from beginWord

  // BFS traversal
  while (queue.length > 0) {
    // Process all nodes at the current level
    const levelSize = queue.length;

    for (let j = 0; j < levelSize; j++) {
      const currentWord = queue.shift();

      // If we reached the endWord, return the number of transformations
      if (currentWord === endWord) {
        return transformations;
      }

      // Generate all patterns for the current word
      for (let i = 0; i < currentWord.length; i++) {
        const pattern = currentWord.substring(0, i) + "*" + currentWord.substring(i + 1);

        // Explore all neighbors (words sharing this pattern)
        const neighbors = adj.get(pattern) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    // After processing each level, increment transformation count
    transformations++;
  }

  // If BFS completes without finding endWord, return 0
  return 0;
};
```

```java
// Time: O(N × L²) where N = number of words, L = length of each word
// Space: O(N × L²) for the adjacency map
import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // If endWord is not in wordList, transformation is impossible
        if (!wordList.contains(endWord)) {
            return 0;
        }

        // Convert wordList to set for O(1) lookups
        Set<String> wordSet = new HashSet<>(wordList);

        // Add beginWord to the set so we can generate its patterns
        wordSet.add(beginWord);

        // Create adjacency map: pattern -> list of words matching that pattern
        Map<String, List<String>> adj = new HashMap<>();

        // Build the pattern adjacency map
        for (String word : wordSet) {
            // For each position in the word, create a pattern with '*' at that position
            for (int i = 0; i < word.length(); i++) {
                // Create pattern like "h*t" for "hot" at position 1
                String pattern = word.substring(0, i) + "*" + word.substring(i + 1);

                // Initialize list for this pattern if it doesn't exist
                adj.putIfAbsent(pattern, new ArrayList<>());

                // Add this word to the list of words matching this pattern
                adj.get(pattern).add(word);
            }
        }

        // BFS initialization
        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        int transformations = 1; // Start counting from beginWord

        // BFS traversal
        while (!queue.isEmpty()) {
            // Process all nodes at the current level
            int levelSize = queue.size();

            for (int j = 0; j < levelSize; j++) {
                String currentWord = queue.poll();

                // If we reached the endWord, return the number of transformations
                if (currentWord.equals(endWord)) {
                    return transformations;
                }

                // Generate all patterns for the current word
                for (int i = 0; i < currentWord.length(); i++) {
                    String pattern = currentWord.substring(0, i) + "*" + currentWord.substring(i + 1);

                    // Explore all neighbors (words sharing this pattern)
                    List<String> neighbors = adj.getOrDefault(pattern, new ArrayList<>());
                    for (String neighbor : neighbors) {
                        if (!visited.contains(neighbor)) {
                            visited.add(neighbor);
                            queue.offer(neighbor);
                        }
                    }
                }
            }

            // After processing each level, increment transformation count
            transformations++;
        }

        // If BFS completes without finding endWord, return 0
        return 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × L²)**

- N = number of words in wordList (plus beginWord)
- L = length of each word
- Building the adjacency map: O(N × L) patterns, each requiring O(L) time to create (string concatenation), so O(N × L²)
- BFS traversal: In worst case, we visit all N words. For each word, we generate L patterns (O(L) each) and process neighbors. Each neighbor check is O(1) with HashSet, so O(N × L²) total.

**Space Complexity: O(N × L²)**

- The adjacency map stores N × L patterns, each pattern is length L, so O(N × L²)
- The visited set stores up to N words
- The BFS queue stores up to N words
- Total: O(N × L²) dominates

## Common Mistakes

1. **Forgetting to check if endWord is in wordList**: This is the most common oversight. If endWord isn't in wordList, you should immediately return 0. The problem states that the transformation sequence must use words from wordList, so endWord must be in it.

2. **Not tracking visited words**: Without a visited set, you can get stuck in infinite loops or revisit the same word multiple times. For example, "hit" → "hot" → "hit" → "hot"... BFS would never terminate.

3. **Using DFS instead of BFS**: DFS doesn't guarantee the shortest path. You might find a path eventually, but it could be much longer than the optimal one. BFS explores all possibilities at distance 1 before distance 2, etc., ensuring the first found path is shortest.

4. **Inefficient neighbor generation**: Comparing each word with every other word is O(N²), which is too slow for large dictionaries. The pattern-matching optimization reduces this to O(N × L²), which is much better when L is small compared to N.

## When You'll See This Pattern

This BFS-with-patterns technique appears in several related problems:

1. **Word Ladder II (Hard)**: The same problem but you need to return all shortest transformation sequences instead of just the length. Requires tracking paths during BFS and careful handling of multiple ways to reach the same word at the same level.

2. **Minimum Genetic Mutation (Medium)**: Almost identical to Word Ladder but with DNA sequences (A, C, G, T) instead of letters. The same BFS approach works perfectly.

3. **Open the Lock (Medium)**: Instead of words, you have lock combinations (0000 to 9999). Each move changes one digit up or down. It's the same BFS shortest-path problem with a different "neighbor" generation rule.

The core pattern is: **When you need the shortest path in an unweighted graph where nodes have a structured representation (words, DNA, lock combinations), use BFS with efficient neighbor generation.**

## Key Takeaways

1. **Word Ladder is a shortest-path problem**: Recognize when a problem asks for the "minimum number of steps" or "shortest transformation" between two states—this often indicates BFS is the right approach.

2. **Pattern matching optimizes neighbor finding**: Instead of comparing all pairs of words (O(N²)), generate patterns for each word (O(N × L)) and group words by pattern. This is especially powerful when the alphabet size or word length is limited.

3. **BFS guarantees shortest path in unweighted graphs**: Each "level" in BFS represents all nodes reachable in exactly N steps. The first time you reach the target, you've found the shortest path.

Related problems: [Word Ladder II](/problem/word-ladder-ii), [Minimum Genetic Mutation](/problem/minimum-genetic-mutation), [Words Within Two Edits of Dictionary](/problem/words-within-two-edits-of-dictionary)
