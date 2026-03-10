---
title: "How to Solve Design Add and Search Words Data Structure — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Add and Search Words Data Structure. Medium difficulty, 48.2% acceptance rate. Topics: String, Depth-First Search, Design, Trie."
date: "2026-11-19"
category: "dsa-patterns"
tags:
  ["design-add-and-search-words-data-structure", "string", "depth-first-search", "design", "medium"]
---

# How to Solve Design Add and Search Words Data Structure

This problem asks us to design a data structure that supports adding words and searching for words, where the search can contain wildcard characters (`.`) that match any single letter. The challenge is making search efficient when wildcards allow many possible paths—a naive approach would be too slow for large dictionaries.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll create a `WordDictionary` and perform these operations:

1. `addWord("bad")`
2. `addWord("dad")`
3. `addWord("mad")`
4. `search("pad")` → should return `false`
5. `search("bad")` → should return `true`
6. `search(".ad")` → should return `true` (matches "bad", "dad", or "mad")
7. `search("b..")` → should return `true` (matches "bad")

When we add "bad", we store it in a tree structure where each node represents a letter:

```
(root)
  |
  b
  |
  a
  |
  d (end of word)
```

Adding "dad" and "mad" extends this structure:

```
(root)
  |    \
  b     d     m
  |     |     |
  a     a     a
  |     |     |
  d     d     d
```

Now, searching for "pad": We start at root, look for child 'p' → not found → return `false`.

Searching for ".ad": The dot matches any letter, so we need to check ALL children of root:

- Check 'b' → has 'a' child → has 'd' child with end flag → found match!
- We could stop here, but need to check 'd' and 'm' too if 'b' didn't work.

This shows why we need recursion/backtracking for wildcard searches.

## Brute Force Approach

A naive approach would store all words in a list or hash set. Adding would be O(1), but searching with wildcards would require checking every word:

- For each search query, iterate through all stored words
- For each word, check if it matches the pattern (same length, matching letters or dots)
- Return `true` if any word matches

<div class="code-group">

```python
# Time: O(N*L) for search, where N = number of words, L = average length
# Space: O(N*L) for storing all words
class WordDictionary:
    def __init__(self):
        self.words = []

    def addWord(self, word: str) -> None:
        self.words.append(word)

    def search(self, word: str) -> bool:
        for w in self.words:
            if len(w) != len(word):
                continue
            match = True
            for i in range(len(word)):
                if word[i] != '.' and word[i] != w[i]:
                    match = False
                    break
            if match:
                return True
        return False
```

```javascript
// Time: O(N*L) for search | Space: O(N*L)
class WordDictionary {
  constructor() {
    this.words = [];
  }

  addWord(word) {
    this.words.push(word);
  }

  search(word) {
    for (const w of this.words) {
      if (w.length !== word.length) continue;
      let match = true;
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== "." && word[i] !== w[i]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  }
}
```

```java
// Time: O(N*L) for search | Space: O(N*L)
class WordDictionary {
    private List<String> words;

    public WordDictionary() {
        words = new ArrayList<>();
    }

    public void addWord(String word) {
        words.add(word);
    }

    public boolean search(String word) {
        for (String w : words) {
            if (w.length() != word.length()) continue;
            boolean match = true;
            for (int i = 0; i < word.length(); i++) {
                if (word.charAt(i) != '.' && word.charAt(i) != w.charAt(i)) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
        return false;
    }
}
```

</div>

**Why this fails:** With N words of average length L, search takes O(N\*L) time. If we have 10,000 words and search is called frequently, this becomes prohibitively slow. We need a data structure that allows us to prune the search space efficiently.

## Optimized Approach

The key insight is that we need to organize words by their structure to avoid checking every word. A **Trie (prefix tree)** is perfect for this:

1. **Trie Structure**: Each node represents a letter and has:
   - Children mapping letters to next nodes
   - A flag indicating if this node completes a word

2. **Adding Words**: Traverse the trie, creating nodes as needed, mark the final node as end of word.

3. **Searching Without Dots**: Simple traversal following exact letters.

4. **Searching With Dots**: When we encounter `.`, we need to explore **all possible children** at that level. This requires recursion or backtracking:
   - At a dot, recursively search all children
   - If any path returns `true`, the overall search returns `true`

The trie allows us to:

- Immediately reject words of wrong length (search stops at appropriate depth)
- Prune search paths early when letters don't match (except dots)
- Share common prefixes among words, saving space

## Optimal Solution

Here's the complete implementation using a Trie with recursive search for handling wildcards:

<div class="code-group">

```python
# Time: O(L) for addWord, O(26^L) worst-case for search (but much better in practice)
# Space: O(N*L) where N = number of words, L = average length
class TrieNode:
    def __init__(self):
        self.children = {}  # Map character to child node
        self.is_end = False  # Marks end of a complete word

class WordDictionary:
    def __init__(self):
        # Initialize with a root node (empty string)
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        """Add a word to the dictionary by traversing the trie."""
        node = self.root
        for char in word:
            # Create child node if it doesn't exist
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the child node
            node = node.children[char]
        # Mark the final node as end of a word
        node.is_end = True

    def search(self, word: str) -> bool:
        """Search for a word, supporting '.' as wildcard."""
        return self._search_in_node(word, 0, self.root)

    def _search_in_node(self, word: str, index: int, node: TrieNode) -> bool:
        """Helper function for recursive search with wildcards."""
        # Base case: reached end of search string
        if index == len(word):
            return node.is_end  # Only true if this node marks a complete word

        char = word[index]

        if char != '.':
            # Exact character match required
            if char not in node.children:
                return False  # No matching path
            # Continue search with next character
            return self._search_in_node(word, index + 1, node.children[char])
        else:
            # Wildcard: try all possible children
            for child_char, child_node in node.children.items():
                # If any path leads to a valid word, return true
                if self._search_in_node(word, index + 1, child_node):
                    return True
            # No matching path found
            return False
```

```javascript
// Time: O(L) for addWord, O(26^L) worst-case for search | Space: O(N*L)
class TrieNode {
  constructor() {
    this.children = new Map(); // Character -> TrieNode mapping
    this.isEnd = false; // Marks end of a word
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode(); // Root represents empty string
  }

  addWord(word) {
    let node = this.root;
    for (const char of word) {
      // Create child if it doesn't exist
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      // Move to child node
      node = node.children.get(char);
    }
    // Mark final node as end of word
    node.isEnd = true;
  }

  search(word) {
    return this._searchInNode(word, 0, this.root);
  }

  _searchInNode(word, index, node) {
    // Base case: processed all characters
    if (index === word.length) {
      return node.isEnd; // True only if this completes a word
    }

    const char = word[index];

    if (char !== ".") {
      // Exact match required
      if (!node.children.has(char)) {
        return false; // No matching path
      }
      // Continue with next character
      return this._searchInNode(word, index + 1, node.children.get(char));
    } else {
      // Wildcard: try all possible paths
      for (const [childChar, childNode] of node.children) {
        // If any path succeeds, return true
        if (this._searchInNode(word, index + 1, childNode)) {
          return true;
        }
      }
      // No matching path found
      return false;
    }
  }
}
```

```java
// Time: O(L) for addWord, O(26^L) worst-case for search | Space: O(N*L)
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;

    public TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

class WordDictionary {
    private TrieNode root;

    public WordDictionary() {
        root = new TrieNode();  // Root represents empty string
    }

    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            // Create child if it doesn't exist
            node.children.putIfAbsent(c, new TrieNode());
            // Move to child node
            node = node.children.get(c);
        }
        // Mark final node as end of word
        node.isEnd = true;
    }

    public boolean search(String word) {
        return searchInNode(word, 0, root);
    }

    private boolean searchInNode(String word, int index, TrieNode node) {
        // Base case: processed all characters
        if (index == word.length()) {
            return node.isEnd;  // True only if this completes a word
        }

        char c = word.charAt(index);

        if (c != '.') {
            // Exact match required
            if (!node.children.containsKey(c)) {
                return false;  // No matching path
            }
            // Continue with next character
            return searchInNode(word, index + 1, node.children.get(c));
        } else {
            // Wildcard: try all possible paths
            for (TrieNode child : node.children.values()) {
                // If any path succeeds, return true
                if (searchInNode(word, index + 1, child)) {
                    return true;
                }
            }
            // No matching path found
            return false;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addWord(word)`: O(L) where L is the length of the word. We traverse/create L nodes.
- `search(word)`:
  - Best case (no dots): O(L) - simple traversal
  - Worst case (all dots): O(26^L) - exponential exploration of all paths
  - In practice, performance is much better as words share prefixes and searches mix dots with letters

**Space Complexity:**

- O(N\*L) where N is number of words and L is average length
- Trie stores each character once, sharing common prefixes
- In worst case (no shared prefixes), we store N\*L characters

## Common Mistakes

1. **Forgetting to mark end of words**: Without the `is_end` flag, you might match prefixes as complete words. For example, if you add "apple", searching for "app" should return `false` unless "app" was also added.

2. **Not handling empty string search**: Searching for "" should return `true` only if you've added an empty string. In our implementation, it returns `false` because root.is_end is initially false.

3. **Incorrect wildcard handling**: When you see `.`, you must check **all children**, not just one. A common error is treating `.` as a special node instead of exploring all possibilities.

4. **Using array instead of hash map for children**: While an array of size 26 works for lowercase English letters, a hash map is more general and memory-efficient for sparse trees.

## When You'll See This Pattern

This Trie-with-wildcards pattern appears in several problems:

1. **Implement Trie (Prefix Tree)** (LeetCode 208): The foundation - implement basic Trie without wildcards. Master this first.

2. **Prefix and Suffix Search** (LeetCode 745): Extends Trie concept to handle both prefixes and suffixes efficiently.

3. **Match Substring After Replacement** (LeetCode 2301): Similar wildcard matching but with character substitution rules.

4. **Word Search II** (LeetCode 212): Uses Trie to efficiently search for multiple words in a 2D board.

The pattern is useful whenever you need to store and retrieve strings with partial matching, especially when queries involve wildcards or prefixes.

## Key Takeaways

1. **Trie is ideal for prefix-based searches**: When problems involve searching for words with common prefixes or partial matches, think Trie first.

2. **Wildcards require backtracking**: Dots in search queries mean you need to explore multiple paths. Recursion with backtracking is the cleanest way to handle this.

3. **Space-time tradeoff**: Trie uses more memory than a simple list but enables much faster searches, especially for prefix/wildcard queries.

Remember: Practice building Trie solutions until the pattern becomes second nature. Start with the basic Trie implementation, then add features like wildcard support or prefix counting.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree), [Prefix and Suffix Search](/problem/prefix-and-suffix-search), [Match Substring After Replacement](/problem/match-substring-after-replacement)
