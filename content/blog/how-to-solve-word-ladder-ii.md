---
title: "How to Solve Word Ladder II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Word Ladder II. Hard difficulty, 27.5% acceptance rate. Topics: Hash Table, String, Backtracking, Breadth-First Search."
date: "2027-06-09"
category: "dsa-patterns"
tags: ["word-ladder-ii", "hash-table", "string", "backtracking", "hard"]
---

# How to Solve Word Ladder II

Word Ladder II is one of the hardest problems on LeetCode because it combines multiple challenging concepts: BFS for shortest paths, graph building, and backtracking to reconstruct all optimal paths. Unlike Word Ladder I which only asks for the length of the shortest transformation sequence, here we need to return all possible shortest sequences. This requires careful graph construction and path reconstruction that many candidates struggle with.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- beginWord = "hit"
- endWord = "cog"
- wordList = ["hot","dot","dog","lot","log","cog"]

**Step 1: Build the graph**
We need to find all words that differ by exactly one letter. For "hit", we can try changing each position:

- Change 'h' to any letter: "ait", "bit", "cit"... "hot" (found in wordList!)
- Change 'i' to any letter: "hat", "hbt", "hct"... "hot" (already found)
- Change 't' to any letter: "hia", "hib", "hic"... "hil" (not in list)

So "hit" connects to "hot". We continue this process for all words.

**Step 2: BFS to find shortest distances**
We perform BFS starting from "hit":

- Level 0: distance["hit"] = 0
- Level 1: "hot" (distance = 1)
- Level 2: "dot", "lot" (distance = 2)
- Level 3: "dog", "log" (distance = 3)
- Level 4: "cog" (distance = 4)

**Step 3: Backtrack to find all paths**
Starting from "cog" (distance 4), we look for neighbors with distance 3: "dog" and "log"
From "dog" (distance 3), neighbors with distance 2: "dot"
From "log" (distance 3), neighbors with distance 2: "lot"
Continue backtracking to "hit" to find all paths:

1. hit → hot → dot → dog → cog
2. hit → hot → lot → log → cog

## Brute Force Approach

A naive approach would be to generate all possible transformation sequences and filter for those that:

1. End with endWord
2. Have minimal length
3. Only use valid transformations

We could use DFS to explore all possible paths:

- Start from beginWord
- For each word, try changing each character to all 26 letters
- If the new word is in wordList and hasn't been used in current path, continue
- Stop when we reach endWord or path length exceeds current best

**Why this fails:**
The search space is enormous! For a word of length L, we have 26L possible changes at each step. With N words in the dictionary and paths potentially exploring all permutations, this becomes O(26^L \* N!) in worst case. Even for modest inputs, this approach times out.

## Optimized Approach

The key insight is that we need to solve two problems efficiently:

1. **Find the shortest distance** from beginWord to each word (BFS)
2. **Reconstruct all shortest paths** (Backtracking with distance information)

The optimal solution uses BFS to build a graph where edges only go from words at distance d to words at distance d+1. This ensures we only consider edges that are part of shortest paths. Then we use DFS/backtracking starting from endWord, following only edges that decrease distance by 1.

**Critical optimization:** Instead of building the full graph upfront, we build it during BFS. When we discover a word at the current level, we add edges from all words at previous level that can transform to it. This creates a directed graph pointing backward from endWord to beginWord, which is perfect for backtracking.

## Optimal Solution

Here's the complete solution using BFS for distance calculation and DFS for path reconstruction:

<div class="code-group">

```python
# Time: O(N * L^2) where N = number of words, L = length of each word
# Space: O(N * L) for the graph and visited structures
from collections import defaultdict, deque
from typing import List

class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        # Convert wordList to set for O(1) lookups
        wordSet = set(wordList)

        # If endWord is not in wordList, no transformation is possible
        if endWord not in wordSet:
            return []

        # Remove beginWord if it's in the set to avoid cycles
        wordSet.discard(beginWord)

        # Graph adjacency list: word -> list of words that can transform to it
        graph = defaultdict(list)

        # BFS queue
        queue = deque([beginWord])

        # Flag to indicate if we found the endWord
        found = False

        # BFS level by level
        while queue and not found:
            # Store words discovered at current level
            level_words = set()

            # Process all words at current level
            for _ in range(len(queue)):
                current_word = queue.popleft()

                # Try changing each character position
                for i in range(len(current_word)):
                    # Try all possible letters
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == current_word[i]:
                            continue

                        # Generate new word
                        new_word = current_word[:i] + c + current_word[i+1:]

                        # If new_word is the endWord, we found a path
                        if new_word == endWord:
                            found = True
                            graph[new_word].append(current_word)

                        # If new_word is in wordSet and not visited in current BFS level
                        elif new_word in wordSet:
                            # Avoid adding same word multiple times in current level
                            if new_word not in level_words:
                                level_words.add(new_word)
                                queue.append(new_word)

                            # Add edge from current_word to new_word
                            graph[new_word].append(current_word)

            # Remove words at current level from wordSet to avoid revisiting
            wordSet -= level_words

        # If endWord was not found, return empty list
        if not found:
            return []

        # DFS to reconstruct all paths from endWord to beginWord
        result = []

        def backtrack(word, path):
            # If we reached beginWord, add reversed path to result
            if word == beginWord:
                result.append(path[::-1])
                return

            # Explore all words that can transform to current word
            for prev_word in graph[word]:
                backtrack(prev_word, path + [prev_word])

        # Start DFS from endWord
        backtrack(endWord, [endWord])

        return result
```

```javascript
// Time: O(N * L^2) where N = number of words, L = length of each word
// Space: O(N * L) for the graph and visited structures
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {string[][]}
 */
var findLadders = function (beginWord, endWord, wordList) {
  // Convert wordList to Set for O(1) lookups
  const wordSet = new Set(wordList);

  // If endWord is not in wordList, no transformation is possible
  if (!wordSet.has(endWord)) {
    return [];
  }

  // Remove beginWord if it's in the set to avoid cycles
  wordSet.delete(beginWord);

  // Graph adjacency list: word -> array of words that can transform to it
  const graph = new Map();

  // BFS queue
  const queue = [beginWord];

  // Flag to indicate if we found the endWord
  let found = false;

  // BFS level by level
  while (queue.length > 0 && !found) {
    // Store words discovered at current level
    const levelWords = new Set();

    // Process all words at current level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const currentWord = queue.shift();

      // Try changing each character position
      for (let j = 0; j < currentWord.length; j++) {
        // Try all possible letters
        for (let k = 0; k < 26; k++) {
          const c = String.fromCharCode(97 + k); // 'a' to 'z'
          if (c === currentWord[j]) {
            continue;
          }

          // Generate new word
          const newWord = currentWord.substring(0, j) + c + currentWord.substring(j + 1);

          // If newWord is the endWord, we found a path
          if (newWord === endWord) {
            found = true;
            if (!graph.has(newWord)) {
              graph.set(newWord, []);
            }
            graph.get(newWord).push(currentWord);
          }
          // If newWord is in wordSet and not visited in current BFS level
          else if (wordSet.has(newWord)) {
            // Avoid adding same word multiple times in current level
            if (!levelWords.has(newWord)) {
              levelWords.add(newWord);
              queue.push(newWord);
            }

            // Add edge from currentWord to newWord
            if (!graph.has(newWord)) {
              graph.set(newWord, []);
            }
            graph.get(newWord).push(currentWord);
          }
        }
      }
    }

    // Remove words at current level from wordSet to avoid revisiting
    for (const word of levelWords) {
      wordSet.delete(word);
    }
  }

  // If endWord was not found, return empty array
  if (!found) {
    return [];
  }

  // DFS to reconstruct all paths from endWord to beginWord
  const result = [];

  function backtrack(word, path) {
    // If we reached beginWord, add reversed path to result
    if (word === beginWord) {
      result.push([...path].reverse());
      return;
    }

    // Explore all words that can transform to current word
    const prevWords = graph.get(word) || [];
    for (const prevWord of prevWords) {
      backtrack(prevWord, [...path, prevWord]);
    }
  }

  // Start DFS from endWord
  backtrack(endWord, [endWord]);

  return result;
};
```

```java
// Time: O(N * L^2) where N = number of words, L = length of each word
// Space: O(N * L) for the graph and visited structures
import java.util.*;

class Solution {
    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        // Convert wordList to Set for O(1) lookups
        Set<String> wordSet = new HashSet<>(wordList);

        // If endWord is not in wordList, no transformation is possible
        if (!wordSet.contains(endWord)) {
            return new ArrayList<>();
        }

        // Remove beginWord if it's in the set to avoid cycles
        wordSet.remove(beginWord);

        // Graph adjacency list: word -> list of words that can transform to it
        Map<String, List<String>> graph = new HashMap<>();

        // BFS queue
        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);

        // Flag to indicate if we found the endWord
        boolean found = false;

        // BFS level by level
        while (!queue.isEmpty() && !found) {
            // Store words discovered at current level
            Set<String> levelWords = new HashSet<>();

            // Process all words at current level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                String currentWord = queue.poll();

                // Try changing each character position
                char[] wordChars = currentWord.toCharArray();
                for (int j = 0; j < wordChars.length; j++) {
                    char originalChar = wordChars[j];

                    // Try all possible letters
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == originalChar) {
                            continue;
                        }

                        wordChars[j] = c;
                        String newWord = new String(wordChars);

                        // If newWord is the endWord, we found a path
                        if (newWord.equals(endWord)) {
                            found = true;
                            graph.computeIfAbsent(newWord, k -> new ArrayList<>())
                                 .add(currentWord);
                        }
                        // If newWord is in wordSet and not visited in current BFS level
                        else if (wordSet.contains(newWord)) {
                            // Avoid adding same word multiple times in current level
                            if (!levelWords.contains(newWord)) {
                                levelWords.add(newWord);
                                queue.offer(newWord);
                            }

                            // Add edge from currentWord to newWord
                            graph.computeIfAbsent(newWord, k -> new ArrayList<>())
                                 .add(currentWord);
                        }
                    }
                    wordChars[j] = originalChar; // Restore original character
                }
            }

            // Remove words at current level from wordSet to avoid revisiting
            wordSet.removeAll(levelWords);
        }

        // If endWord was not found, return empty list
        if (!found) {
            return new ArrayList<>();
        }

        // DFS to reconstruct all paths from endWord to beginWord
        List<List<String>> result = new ArrayList<>();
        List<String> path = new ArrayList<>();
        path.add(endWord);

        backtrack(endWord, beginWord, graph, path, result);

        return result;
    }

    private void backtrack(String currentWord, String beginWord,
                          Map<String, List<String>> graph,
                          List<String> path, List<List<String>> result) {
        // If we reached beginWord, add reversed path to result
        if (currentWord.equals(beginWord)) {
            List<String> validPath = new ArrayList<>(path);
            Collections.reverse(validPath);
            result.add(validPath);
            return;
        }

        // Explore all words that can transform to current word
        List<String> prevWords = graph.getOrDefault(currentWord, new ArrayList<>());
        for (String prevWord : prevWords) {
            path.add(prevWord);
            backtrack(prevWord, beginWord, graph, path, result);
            path.remove(path.size() - 1); // Backtrack
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N × L²)**

- N = number of words in wordList
- L = length of each word
- For each word, we try L positions × 26 letters = O(26L) operations
- Generating new strings takes O(L) time, so total O(26L²) per word
- In worst case, we process all N words: O(N × L²)

**Space Complexity: O(N × L)**

- The graph stores up to N words, each with edges to other words
- Each word has length L, so storing all words takes O(N × L)
- BFS queue and visited sets also contribute O(N) space
- Path storage for DFS adds additional O(N × L) in worst case

## Common Mistakes

1. **Building the graph incorrectly**: Many candidates build an undirected graph or add edges in the wrong direction. Remember: we need edges pointing backward from endWord to beginWord for efficient backtracking.

2. **Not handling multiple parents correctly**: A word can be reached from multiple words at the previous level. All these edges must be preserved in the graph, not just the first one discovered.

3. **Forgetting to remove words from wordSet**: If we don't remove words discovered at current level from wordSet, we might:
   - Revisit words at same level (creating cycles)
   - Find longer paths through already-visited words
   - This breaks the BFS property of finding shortest paths

4. **Using DFS without BFS first**: Some candidates try pure DFS to find all paths, then filter for shortest ones. This explores exponentially many paths and times out. Always use BFS first to determine which edges belong to shortest paths.

## When You'll See This Pattern

This "BFS for shortest path + DFS for path reconstruction" pattern appears in several graph problems:

1. **Word Ladder I** - Simpler version that only needs path length, not the actual paths
2. **126. Word Ladder II** - The current problem
3. **127. Word Ladder** - Returns only the length of shortest transformation
4. **815. Bus Routes** - Find minimum buses to reach destination, similar BFS structure
5. **1345. Jump Game IV** - BFS with adjacency building on the fly

The pattern is useful whenever you need to:

- Find shortest paths in an unweighted graph
- Reconstruct all optimal paths, not just one
- Work with implicit graphs (where edges aren't given upfront)

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: When you need the shortest transformation sequence, BFS is your go-to algorithm because it explores level by level.

2. **Build graphs during BFS for path reconstruction**: Instead of building the full graph upfront, construct it during BFS with edges pointing backward. This ensures you only include edges that are part of shortest paths.

3. **Combine BFS and DFS for complete solutions**: Use BFS to find distances and build the graph of optimal edges, then use DFS/backtracking to reconstruct all paths following those edges.

Related problems: [Word Ladder](/problem/word-ladder), [Groups of Strings](/problem/groups-of-strings)
