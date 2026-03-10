---
title: "How to Solve Implement Trie (Prefix Tree) — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Implement Trie (Prefix Tree). Medium difficulty, 69.2% acceptance rate. Topics: Hash Table, String, Design, Trie."
date: "2026-07-12"
category: "dsa-patterns"
tags: ["implement-trie-prefix-tree", "hash-table", "string", "design", "medium"]
---

# How to Solve Implement Trie (Prefix Tree)

A trie (prefix tree) is a specialized tree data structure designed for storing strings where each node represents a character and paths from root to nodes form words. What makes this problem interesting is that it's not about solving a single computation, but designing an entire data structure with multiple operations that must work together efficiently. The tricky part is understanding how to represent the tree structure and manage the transitions between characters while tracking where complete words end.

## Visual Walkthrough

Let's trace through building a trie with the words "cat", "car", and "dog":

**Step 1: Initialize empty trie**
We start with a root node that has no character value. It contains child pointers (one for each possible next character) and a flag marking whether a word ends at this node.

**Step 2: Insert "cat"**

- Start at root
- Check for 'c' child: doesn't exist, create new node for 'c'
- Move to 'c' node, check for 'a' child: doesn't exist, create new node for 'a'
- Move to 'a' node, check for 't' child: doesn't exist, create new node for 't'
- Move to 't' node, mark it as end of word (is_end = True)

**Step 3: Insert "car"**

- Start at root
- Check for 'c' child: exists, move to 'c' node
- Check for 'a' child: exists, move to 'a' node
- Check for 'r' child: doesn't exist, create new node for 'r'
- Move to 'r' node, mark it as end of word

**Step 4: Search "cat"**

- Start at root
- Follow 'c' → 'a' → 't'
- Check if 't' node is marked as end of word: Yes → return True

**Step 5: Search "ca"**

- Start at root
- Follow 'c' → 'a'
- Check if 'a' node is marked as end of word: No → return False
- Even though "ca" is a prefix of existing words, it's not a complete word we inserted

**Step 6: StartsWith "ca"**

- Start at root
- Follow 'c' → 'a'
- Successfully reached 'a' node → return True
- We don't care if it's a complete word, just if the prefix exists

**Step 7: Insert "dog"**

- Start at root
- 'c' and 'd' are different branches from root
- Create new branch: root → 'd' → 'o' → 'g'
- Mark 'g' as end of word

The key insight: words with common prefixes share nodes in the trie, saving space compared to storing each word separately.

## Brute Force Approach

For a trie problem, there isn't really a "brute force" solution in the traditional sense since we're implementing a specific data structure. However, a naive candidate might consider these alternatives:

1. **Store all words in a list/array**:
   - Insert: append to list (O(1))
   - Search: linear scan through all words (O(n\*m) where n = number of words, m = average length)
   - StartsWith: linear scan checking prefixes (O(n\*m))

2. **Store all words in a hash set**:
   - Insert: add to set (O(1) average)
   - Search: check if word exists (O(1) average)
   - StartsWith: still requires checking all words (O(n\*m)) since hash sets don't support prefix queries

The problem with these approaches is the `startsWith` operation. Without a specialized data structure, checking if any word starts with a given prefix requires examining every stored word. For a dataset with thousands of words, this becomes prohibitively slow.

## Optimized Approach

The key insight is that we need a tree structure where:

1. Each node represents a single character
2. Children represent possible next characters
3. A path from root to any node represents a prefix
4. We mark nodes where complete words end

This gives us:

- **Insert**: O(L) where L = word length. We traverse/create nodes for each character.
- **Search**: O(L). We traverse existing nodes for each character and check if the final node is marked as a word end.
- **StartsWith**: O(L). We traverse existing nodes for each character, but don't need to check if it's a word end.

The trie optimizes prefix searches by allowing us to follow only one path through the tree rather than checking every stored word.

## Optimal Solution

<div class="code-group">

```python
class TrieNode:
    """Node in the Trie data structure."""
    def __init__(self):
        # Dictionary to store child nodes where key=character, value=TrieNode
        self.children = {}
        # Flag to mark if a word ends at this node
        self.is_end_of_word = False

class Trie:
    """Implementation of Trie (Prefix Tree) data structure."""

    def __init__(self):
        """Initialize trie with root node."""
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """Insert a word into the trie.

        Time: O(L) where L is length of word
        Space: O(L) in worst case (new word shares no prefixes)
        """
        node = self.root  # Start from root

        # Traverse each character in the word
        for char in word:
            # If character doesn't exist as child, create new node
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the child node
            node = node.children[char]

        # Mark the final node as end of a word
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        """Search for a complete word in the trie.

        Returns True only if the exact word exists.
        Time: O(L) where L is length of word
        Space: O(1)
        """
        node = self.root

        # Traverse each character in the word
        for char in word:
            # If character not found, word doesn't exist
            if char not in node.children:
                return False
            # Move to the child node
            node = node.children[char]

        # Word exists only if we're at a node marked as word end
        return node.is_end_of_word

    def startsWith(self, prefix: str) -> bool:
        """Check if any word in trie starts with given prefix.

        Returns True if prefix exists (even if not a complete word).
        Time: O(L) where L is length of prefix
        Space: O(1)
        """
        node = self.root

        # Traverse each character in the prefix
        for char in prefix:
            # If character not found, prefix doesn't exist
            if char not in node.children:
                return False
            # Move to the child node
            node = node.children[char]

        # If we successfully traversed all characters, prefix exists
        return True
```

```javascript
class TrieNode {
  constructor() {
    // Map to store child nodes where key=character, value=TrieNode
    this.children = new Map();
    // Flag to mark if a word ends at this node
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    // Initialize trie with root node
    this.root = new TrieNode();
  }

  /**
   * Insert a word into the trie.
   * Time: O(L) where L is length of word
   * Space: O(L) in worst case (new word shares no prefixes)
   */
  insert(word) {
    let node = this.root; // Start from root

    // Traverse each character in the word
    for (const char of word) {
      // If character doesn't exist as child, create new node
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      // Move to the child node
      node = node.children.get(char);
    }

    // Mark the final node as end of a word
    node.isEndOfWord = true;
  }

  /**
   * Search for a complete word in the trie.
   * Returns true only if the exact word exists.
   * Time: O(L) where L is length of word
   * Space: O(1)
   */
  search(word) {
    let node = this.root;

    // Traverse each character in the word
    for (const char of word) {
      // If character not found, word doesn't exist
      if (!node.children.has(char)) {
        return false;
      }
      // Move to the child node
      node = node.children.get(char);
    }

    // Word exists only if we're at a node marked as word end
    return node.isEndOfWord;
  }

  /**
   * Check if any word in trie starts with given prefix.
   * Returns true if prefix exists (even if not a complete word).
   * Time: O(L) where L is length of prefix
   * Space: O(1)
   */
  startsWith(prefix) {
    let node = this.root;

    // Traverse each character in the prefix
    for (const char of prefix) {
      // If character not found, prefix doesn't exist
      if (!node.children.has(char)) {
        return false;
      }
      // Move to the child node
      node = node.children.get(char);
    }

    // If we successfully traversed all characters, prefix exists
    return true;
  }
}
```

```java
class TrieNode {
    // Array or map to store child nodes
    // Using HashMap for flexibility with any character
    Map<Character, TrieNode> children;
    boolean isEndOfWord;

    public TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
}

class Trie {
    private TrieNode root;

    public Trie() {
        // Initialize trie with root node
        root = new TrieNode();
    }

    /**
     * Insert a word into the trie.
     * Time: O(L) where L is length of word
     * Space: O(L) in worst case (new word shares no prefixes)
     */
    public void insert(String word) {
        TrieNode node = root;  // Start from root

        // Traverse each character in the word
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);

            // If character doesn't exist as child, create new node
            if (!node.children.containsKey(ch)) {
                node.children.put(ch, new TrieNode());
            }
            // Move to the child node
            node = node.children.get(ch);
        }

        // Mark the final node as end of a word
        node.isEndOfWord = true;
    }

    /**
     * Search for a complete word in the trie.
     * Returns true only if the exact word exists.
     * Time: O(L) where L is length of word
     * Space: O(1)
     */
    public boolean search(String word) {
        TrieNode node = root;

        // Traverse each character in the word
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);

            // If character not found, word doesn't exist
            if (!node.children.containsKey(ch)) {
                return false;
            }
            // Move to the child node
            node = node.children.get(ch);
        }

        // Word exists only if we're at a node marked as word end
        return node.isEndOfWord;
    }

    /**
     * Check if any word in trie starts with given prefix.
     * Returns true if prefix exists (even if not a complete word).
     * Time: O(L) where L is length of prefix
     * Space: O(1)
     */
    public boolean startsWith(String prefix) {
        TrieNode node = root;

        // Traverse each character in the prefix
        for (int i = 0; i < prefix.length(); i++) {
            char ch = prefix.charAt(i);

            // If character not found, prefix doesn't exist
            if (!node.children.containsKey(ch)) {
                return false;
            }
            // Move to the child node
            node = node.children.get(ch);
        }

        // If we successfully traversed all characters, prefix exists
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `insert(word)`: O(L) where L is the length of the word. We process each character once.
- `search(word)`: O(L) where L is the length of the word. We traverse the path character by character.
- `startsWith(prefix)`: O(P) where P is the length of the prefix. Same traversal as search but without the final end-of-word check.

**Space Complexity:**

- Overall: O(N\*L) in the worst case where N is the number of words and L is the average length, and no words share prefixes.
- In practice: O(T) where T is the total number of characters across all words, minus shared prefixes. Words with common prefixes share nodes, making tries space-efficient for datasets with many shared prefixes.
- Each operation uses O(1) auxiliary space (just pointer variables).

## Common Mistakes

1. **Forgetting to mark end of words**: This is the most common mistake. Candidates create the tree structure correctly but forget to set `is_end_of_word = True` at the final node. This causes `search()` to return true for prefixes that aren't complete words.

2. **Using arrays of fixed size (26 for lowercase English)**: While this works for constrained character sets, it's less flexible than using a dictionary/Map. The fixed array approach assumes only lowercase English letters, while the hash map approach handles any Unicode character. Always clarify character set constraints with the interviewer.

3. **Not handling empty strings**: While the problem doesn't explicitly test this, consider: should an empty string be insertable? Typically, the root node would need `is_end_of_word = True` to represent an empty word. Clarify this edge case.

4. **Confusing search with startsWith**: In `search()`, you must check `is_end_of_word` at the final node. In `startsWith()`, you don't. Mixing these up is a subtle bug that passes many test cases but fails on cases like searching for "ca" when only "cat" exists.

## When You'll See This Pattern

Tries appear in problems involving:

1. **Prefix-based queries**: Any problem requiring efficient prefix matching (autocomplete, spell checkers).
2. **Word validation in grids**: Problems like "Word Search II" where you need to check if sequences of characters form valid words.
3. **String replacement**: Problems like "Replace Words" where you replace words with their shortest root prefix.

Related LeetCode problems:

- **Design Add and Search Words Data Structure**: Extends the trie with wildcard ('.') matching in search operations.
- **Word Search II**: Uses a trie to store dictionary words and efficiently search for them in a character grid.
- **Replace Words**: Uses a trie to find the shortest root word that is a prefix of a given word.

## Key Takeaways

1. **Tries optimize prefix operations**: When a problem requires frequent prefix checks (startsWith, autocomplete), a trie is often the right choice. Hash-based structures can't efficiently answer "what words start with this prefix?" without scanning all entries.

2. **Space-time tradeoff**: Tries use more space per character than concatenated strings but provide O(L) time for both search and prefix operations. The space is justified when prefix operations are frequent.

3. **Node structure is key**: Each trie node needs: (1) child pointers, (2) end-of-word marker. The child structure can be array (for fixed alphabets) or hash map (for flexible character sets).

Related problems: [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure), [Design Search Autocomplete System](/problem/design-search-autocomplete-system), [Replace Words](/problem/replace-words)
