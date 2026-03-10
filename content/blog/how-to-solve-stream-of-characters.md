---
title: "How to Solve Stream of Characters — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stream of Characters. Hard difficulty, 52.0% acceptance rate. Topics: Array, String, Design, Trie, Data Stream."
date: "2027-05-06"
category: "dsa-patterns"
tags: ["stream-of-characters", "array", "string", "design", "hard"]
---

# How to Solve Stream of Characters

This problem asks us to design a data structure that processes a stream of characters and efficiently checks if any suffix of the stream matches a word from a given list. The challenge is that with each new character, we need to check all possible suffixes against our dictionary — a task that would be prohibitively slow with naive approaches. The key insight is that we need to check suffixes in reverse, which leads us to a clever Trie-based solution.

## Visual Walkthrough

Let's trace through an example with `words = ["abc", "xyz", "cba"]` and stream characters arriving one by one:

**Initialization:** We build a trie from the _reversed_ words: `"cba"`, `"zyx"`, `"abc"`.

**Stream: 'a' arrives**

- Check suffixes ending at 'a': just `"a"`
- Reverse: `"a"` → check trie starting from root
- Follow 'a' → not a word end → return `false`

**Stream: 'b' arrives** (stream: `"ab"`)

- Check suffixes: `"b"`, `"ab"`
- Reverse each and check trie:
  - `"b"` reversed → `"b"` → follow 'b' → not end → continue
  - `"ab"` reversed → `"ba"` → follow 'b' then 'a' → not end → return `false`

**Stream: 'c' arrives** (stream: `"abc"`)

- Check suffixes: `"c"`, `"bc"`, `"abc"`
- Reverse each:
  - `"c"` → `"c"` → follow 'c' → not end
  - `"bc"` → `"cb"` → follow 'c' then 'b' → not end
  - `"abc"` → `"cba"` → follow 'c' then 'b' then 'a' → REACHES WORD END! → return `true`

**Stream: 'x' arrives** (stream: `"abcx"`)

- Check suffixes ending at 'x': `"x"`, `"cx"`, `"bcx"`, `"abcx"`
- `"x"` reversed → `"x"` → follow 'x' → not end
- Continue checking... none match → return `false`

**Stream: 'y' arrives** (stream: `"abcxy"`)

- Check suffixes ending at 'y': `"y"`, `"xy"`, `"cxy"`, `"bcxy"`, `"abcxy"`
- `"xy"` reversed → `"yx"` → follow 'y' then 'x' → not end
- Continue... none match → return `false`

**Stream: 'z' arrives** (stream: `"abcxyz"`)

- Check suffixes ending at 'z': `"z"`, `"yz"`, `"xyz"`, `"cxyz"`, `"bcxyz"`, `"abcxyz"`
- `"xyz"` reversed → `"zyx"` → follow 'z' then 'y' then 'x' → REACHES WORD END! → return `true`

The key observation: by storing reversed words in the trie, we only need to traverse backwards from the current character, which is exactly what checking suffixes requires.

## Brute Force Approach

A naive approach would store the entire stream and, for each new character, check every possible suffix against every word in the dictionary:

1. Maintain a string of all characters seen so far
2. When a new character arrives, append it to the stream
3. For each word in `words`, check if the stream ends with that word
4. Return `true` if any match is found

This approach has O(L × N × M) time complexity for each query, where L is the length of the stream so far, N is the number of words, and M is the average word length. With a stream of thousands of characters and hundreds of words, this becomes completely impractical.

The brute force fails because it rechecks the entire dictionary against all suffixes for every new character, doing massive redundant work.

## Optimized Approach

The optimal solution uses a **Trie (prefix tree)** data structure, but with a crucial twist: we insert the _reversed_ words into the trie. Here's why this works:

1. **Problem Transformation**: Checking if a suffix matches any word is equivalent to checking if the _reversed_ suffix is a prefix of any _reversed_ word in our dictionary.

2. **Trie for Prefix Matching**: A trie excels at prefix matching. By storing reversed words, we can efficiently check if any reversed suffix (which we build backwards from the current character) exists as a prefix in our trie.

3. **Efficient Suffix Checking**: Instead of checking all suffixes (O(L) of them), we only need to traverse backwards from the current position until we either:
   - Find a word end in the trie (success)
   - Reach the beginning of our stored stream
   - Hit a character not in the trie (early termination)

4. **Implementation Strategy**:
   - Build a trie from reversed words during initialization
   - Maintain the stream of characters (or just recent characters up to the maximum word length)
   - For each query, traverse backwards through the stream while following the trie
   - Return `true` if we encounter a word end marker during traversal

This reduces each query to O(min(L, M)) where M is the maximum word length, which is dramatically faster than the brute force approach.

## Optimal Solution

<div class="code-group">

```python
class TrieNode:
    def __init__(self):
        self.children = {}  # Map character to child TrieNode
        self.is_end = False  # Marks the end of a word

class StreamChecker:
    # Time: O(N * M) for initialization, O(min(L, M)) per query
    # Space: O(N * M) for trie, O(L) for stream storage
    # where N = number of words, M = max word length, L = stream length

    def __init__(self, words: List[str]):
        self.root = TrieNode()
        self.stream = []  # Store incoming characters
        self.max_len = 0  # Track maximum word length for optimization

        # Build trie from reversed words
        for word in words:
            self.max_len = max(self.max_len, len(word))
            node = self.root
            # Insert reversed word into trie
            for ch in reversed(word):
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            node.is_end = True  # Mark end of word

    def query(self, letter: str) -> bool:
        # Add new character to stream
        self.stream.append(letter)

        # We only need to check up to max_len characters back
        # This prevents checking the entire stream when it's very long
        start = max(0, len(self.stream) - self.max_len)

        # Start from root of trie
        node = self.root

        # Traverse backwards from the newest character
        # We check if any suffix ending at current position forms a word
        for i in range(len(self.stream) - 1, start - 1, -1):
            ch = self.stream[i]

            # If character not in trie path, no match possible
            if ch not in node.children:
                return False

            # Move to next node in trie
            node = node.children[ch]

            # If we reach a word end, we found a matching suffix
            if node.is_end:
                return True

        return False
```

```javascript
class TrieNode {
  constructor() {
    this.children = new Map(); // Map character to child TrieNode
    this.isEnd = false; // Marks the end of a word
  }
}

class StreamChecker {
  /**
   * Time: O(N * M) for initialization, O(min(L, M)) per query
   * Space: O(N * M) for trie, O(L) for stream storage
   * where N = number of words, M = max word length, L = stream length
   */
  constructor(words) {
    this.root = new TrieNode();
    this.stream = []; // Store incoming characters
    this.maxLen = 0; // Track maximum word length for optimization

    // Build trie from reversed words
    for (const word of words) {
      this.maxLen = Math.max(this.maxLen, word.length);
      let node = this.root;

      // Insert reversed word into trie
      for (let i = word.length - 1; i >= 0; i--) {
        const ch = word[i];
        if (!node.children.has(ch)) {
          node.children.set(ch, new TrieNode());
        }
        node = node.children.get(ch);
      }
      node.isEnd = true; // Mark end of word
    }
  }

  query(letter) {
    // Add new character to stream
    this.stream.push(letter);

    // We only need to check up to maxLen characters back
    // This prevents checking the entire stream when it's very long
    const start = Math.max(0, this.stream.length - this.maxLen);

    // Start from root of trie
    let node = this.root;

    // Traverse backwards from the newest character
    // We check if any suffix ending at current position forms a word
    for (let i = this.stream.length - 1; i >= start; i--) {
      const ch = this.stream[i];

      // If character not in trie path, no match possible
      if (!node.children.has(ch)) {
        return false;
      }

      // Move to next node in trie
      node = node.children.get(ch);

      // If we reach a word end, we found a matching suffix
      if (node.isEnd) {
        return true;
      }
    }

    return false;
  }
}
```

```java
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;

    public TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

class StreamChecker {
    // Time: O(N * M) for initialization, O(min(L, M)) per query
    // Space: O(N * M) for trie, O(L) for stream storage
    // where N = number of words, M = max word length, L = stream length

    private TrieNode root;
    private StringBuilder stream;
    private int maxLen;

    public StreamChecker(String[] words) {
        root = new TrieNode();
        stream = new StringBuilder();
        maxLen = 0;

        // Build trie from reversed words
        for (String word : words) {
            maxLen = Math.max(maxLen, word.length());
            TrieNode node = root;

            // Insert reversed word into trie
            for (int i = word.length() - 1; i >= 0; i--) {
                char ch = word.charAt(i);
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
            }
            node.isEnd = true;  // Mark end of word
        }
    }

    public boolean query(char letter) {
        // Add new character to stream
        stream.append(letter);

        // We only need to check up to maxLen characters back
        // This prevents checking the entire stream when it's very long
        int start = Math.max(0, stream.length() - maxLen);

        // Start from root of trie
        TrieNode node = root;

        // Traverse backwards from the newest character
        // We check if any suffix ending at current position forms a word
        for (int i = stream.length() - 1; i >= start; i--) {
            char ch = stream.charAt(i);

            // If character not in trie path, no match possible
            if (!node.children.containsKey(ch)) {
                return false;
            }

            // Move to next node in trie
            node = node.children.get(ch);

            // If we reach a word end, we found a matching suffix
            if (node.isEnd) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization**: O(N × M) where N is the number of words and M is the average word length. We process each character of each word once when building the trie.
- **Query**: O(min(L, M)) where L is the current stream length and M is the maximum word length. In practice, we only check up to M characters back because no word can be longer than M.

**Space Complexity:**

- **Trie Storage**: O(N × M) in the worst case where no words share prefixes (when reversed). In practice, it's often less due to common prefixes.
- **Stream Storage**: O(L) for storing the stream, but we could optimize to O(M) by only storing the last M characters.

The key advantage is that queries become independent of the number of words N, making this solution scalable for large dictionaries.

## Common Mistakes

1. **Not reversing the words during trie construction**: This is the most critical insight. If you build the trie with normal words, you'd need to check all suffixes against all words, which brings us back to O(N × L) per query.

2. **Forgetting to limit backward traversal to max word length**: Without this optimization, you'll traverse the entire stream for each query, making it O(L) instead of O(min(L, M)). For long streams, this makes a significant difference.

3. **Not handling the case where a character isn't in the trie during traversal**: If you encounter a character that doesn't exist in the current trie path, you should return `false` immediately. Continuing would waste time on impossible matches.

4. **Using a list instead of a deque for stream storage when optimizing space**: If you want to store only the last M characters, use a deque for efficient removal from the front. A list would require shifting all elements when removing the oldest.

## When You'll See This Pattern

The "reverse and use trie" pattern appears in several suffix/prefix matching problems:

1. **Prefix and Suffix Search (LeetCode 745)**: Similar concept but for both prefixes and suffixes. You build tries from both directions.

2. **Word Search II (LeetCode 212)**: Uses a trie to efficiently search for multiple words in a grid, checking character by character.

3. **Implement Trie (Prefix Tree) (LeetCode 208)**: The fundamental data structure used here. Mastering basic trie operations is essential for this problem.

4. **Longest Word in Dictionary (LeetCode 720)**: Uses a trie to find the longest word that can be built one character at a time.

The core pattern is: when you need to match suffixes efficiently, consider reversing the problem to turn it into a prefix matching problem, then use a trie.

## Key Takeaways

1. **Transform suffix problems into prefix problems**: When dealing with suffixes, reversing strings often simplifies the problem by allowing you to use efficient prefix-matching data structures like tries.

2. **Tries excel at incremental character matching**: Whenever you need to check sequences character by character (like in a stream), a trie provides O(1) per character lookup, making it ideal for real-time processing.

3. **Limit checks to relevant data**: By tracking the maximum word length, you avoid unnecessary work. This optimization pattern applies to many streaming algorithms where only recent data matters.

Remember: the hardest part of this problem is recognizing that suffix matching becomes prefix matching when you reverse the strings. Once you see that, the trie solution becomes natural.

[Practice this problem on CodeJeet](/problem/stream-of-characters)
