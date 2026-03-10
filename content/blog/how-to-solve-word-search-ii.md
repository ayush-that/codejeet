---
title: "How to Solve Word Search II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Word Search II. Hard difficulty, 38.1% acceptance rate. Topics: Array, String, Backtracking, Trie, Matrix."
date: "2026-11-13"
category: "dsa-patterns"
tags: ["word-search-ii", "array", "string", "backtracking", "hard"]
---

# How to Solve Word Search II

Word Search II asks us to find all words from a given list that exist on an m×n board of characters. Words can be formed by moving to adjacent cells (up, down, left, right) without reusing any cell. While the classic Word Search problem (Medium) asks for a single word, this version requires finding multiple words efficiently—making brute force approaches prohibitively slow. The key challenge is avoiding redundant searches when multiple words share prefixes.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Board:**

```
[['o','a','a','n'],
 ['e','t','a','e'],
 ['i','h','k','r'],
 ['i','f','l','v']]
```

**Words:** `["oath","pea","eat","rain"]`

**Step-by-step search for "oath":**

1. Start at (0,0): 'o' matches first letter
2. Move right to (0,1): 'a' matches second letter
3. Move down to (1,1): 't' matches third letter
4. Move down to (2,1): 'h' matches fourth letter → "oath" found!

**Search for "eat":**

1. Start at (1,0): 'e' matches first letter
2. Move right to (1,1): 'a' matches second letter
3. Move right to (1,2): 't' matches third letter → "eat" found!

Notice that both "oath" and "eat" share the prefix "ea" when we consider different starting positions. This prefix overlap is the key insight—we shouldn't search for "eat" and "each" separately if they both start with "ea".

## Brute Force Approach

The most straightforward approach is to perform DFS backtracking for each word independently:

1. For each word in `words`, perform the standard Word Search algorithm
2. For each starting position on the board, attempt to build the word via DFS
3. Mark cells as visited during the search and unmark them during backtracking

**Why this fails:**

- Time complexity: O(W × M × N × 4^L) where W is number of words, M×N is board size, and L is average word length
- For typical constraints (W=10^4, M=N=12, L=10), this is computationally impossible
- We're repeating work—searching the same paths multiple times for words with shared prefixes

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(W * M * N * 4^L) | Space: O(L) for recursion depth
def findWordsBruteForce(board, words):
    def dfs(r, c, word, index):
        if index == len(word):
            return True
        if r < 0 or r >= len(board) or c < 0 or c >= len(board[0]):
            return False
        if board[r][c] != word[index]:
            return False
        if visited[r][c]:
            return False

        visited[r][c] = True
        found = (dfs(r+1, c, word, index+1) or
                 dfs(r-1, c, word, index+1) or
                 dfs(r, c+1, word, index+1) or
                 dfs(r, c-1, word, index+1))
        visited[r][c] = False
        return found

    result = []
    for word in words:
        found = False
        visited = [[False]*len(board[0]) for _ in range(len(board))]
        for r in range(len(board)):
            for c in range(len(board[0])):
                if dfs(r, c, word, 0):
                    result.append(word)
                    found = True
                    break
            if found:
                break
    return result
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(W * M * N * 4^L) | Space: O(L) for recursion depth
function findWordsBruteForce(board, words) {
  const dfs = (r, c, word, index, visited) => {
    if (index === word.length) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
    if (board[r][c] !== word[index]) return false;
    if (visited[r][c]) return false;

    visited[r][c] = true;
    const found =
      dfs(r + 1, c, word, index + 1, visited) ||
      dfs(r - 1, c, word, index + 1, visited) ||
      dfs(r, c + 1, word, index + 1, visited) ||
      dfs(r, c - 1, word, index + 1, visited);
    visited[r][c] = false;
    return found;
  };

  const result = [];
  for (const word of words) {
    let found = false;
    const visited = Array(board.length)
      .fill()
      .map(() => Array(board[0].length).fill(false));

    for (let r = 0; r < board.length && !found; r++) {
      for (let c = 0; c < board[0].length && !found; c++) {
        if (dfs(r, c, word, 0, visited)) {
          result.push(word);
          found = true;
        }
      }
    }
  }
  return result;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(W * M * N * 4^L) | Space: O(L) for recursion depth
public List<String> findWordsBruteForce(char[][] board, String[] words) {
    List<String> result = new ArrayList<>();
    for (String word : words) {
        if (exist(board, word)) {
            result.add(word);
        }
    }
    return result;
}

private boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    boolean[][] visited = new boolean[m][n];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(board, word, i, j, 0, visited)) {
                return true;
            }
        }
    }
    return false;
}

private boolean dfs(char[][] board, String word, int i, int j, int index, boolean[][] visited) {
    if (index == word.length()) return true;
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length)
        return false;
    if (visited[i][j] || board[i][j] != word.charAt(index))
        return false;

    visited[i][j] = true;
    boolean found = dfs(board, word, i+1, j, index+1, visited) ||
                    dfs(board, word, i-1, j, index+1, visited) ||
                    dfs(board, word, i, j+1, index+1, visited) ||
                    dfs(board, word, i, j-1, index+1, visited);
    visited[i][j] = false;
    return found;
}
```

</div>

## Optimized Approach

The key insight is to use a **Trie (prefix tree)** to store all words. This allows us to:

1. Search for multiple words simultaneously during a single DFS traversal
2. Prune branches early when no words in the dictionary have the current prefix
3. Avoid revisiting the same paths for different words

**Step-by-step reasoning:**

1. **Build a Trie** from all words in the dictionary
2. **DFS from each cell** on the board:
   - Follow only paths that match prefixes in the Trie
   - When we reach a node marked as a complete word, add it to results
   - Remove found words from the Trie to avoid duplicates
3. **Optimization**: Store the word directly in Trie nodes to avoid reconstructing strings

**Why Trie works:**

- If "apple" and "app" are both words, finding "app" doesn't require restarting the search
- If no word starts with "zx", we stop searching immediately
- We traverse the board once, not once per word

## Optimal Solution

Here's the complete solution using Trie + Backtracking:

<div class="code-group">

```python
# OPTIMAL SOLUTION: Trie + Backtracking
# Time: O(M * N * 4^L) where L is maximum word length | Space: O(K) where K is total characters in all words
class TrieNode:
    def __init__(self):
        self.children = {}          # Map character to child node
        self.word = None           # Store complete word at leaf node for quick retrieval

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        # Step 1: Build the Trie from all words
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word  # Store the complete word at the end node

        result = []
        rows, cols = len(board), len(board[0])

        # Step 2: DFS function that explores the board and Trie simultaneously
        def dfs(r, c, node):
            char = board[r][c]

            # Check if current character exists in Trie
            if char not in node.children:
                return

            # Move to the next node in Trie
            curr_node = node.children[char]

            # If we found a complete word, add to results
            if curr_node.word:
                result.append(curr_node.word)
                curr_node.word = None  # Remove to avoid duplicates

            # Mark current cell as visited by temporarily changing its value
            board[r][c] = '#'

            # Explore all four directions
            directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, curr_node)

            # Restore the cell's original value (backtrack)
            board[r][c] = char

            # Optimization: Prune leaf nodes that have been found
            if not curr_node.children and not curr_node.word:
                del node.children[char]

        # Step 3: Start DFS from every cell on the board
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)

        return result
```

```javascript
// OPTIMAL SOLUTION: Trie + Backtracking
// Time: O(M * N * 4^L) where L is maximum word length | Space: O(K) where K is total characters in all words
class TrieNode {
  constructor() {
    this.children = new Map(); // Map character to child node
    this.word = null; // Store complete word at leaf node
  }
}

var findWords = function (board, words) {
  // Step 1: Build the Trie from all words
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.word = word; // Store the complete word at the end
  }

  const result = [];
  const rows = board.length,
    cols = board[0].length;

  // Step 2: DFS function that explores board and Trie simultaneously
  const dfs = (r, c, node) => {
    const char = board[r][c];

    // Check if current character exists in Trie
    if (!node.children.has(char)) return;

    // Move to the next node in Trie
    const currNode = node.children.get(char);

    // If we found a complete word, add to results
    if (currNode.word) {
      result.push(currNode.word);
      currNode.word = null; // Remove to avoid duplicates
    }

    // Mark current cell as visited by temporarily changing its value
    board[r][c] = "#";

    // Explore all four directions
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] !== "#") {
        dfs(nr, nc, currNode);
      }
    }

    // Restore the cell's original value (backtrack)
    board[r][c] = char;

    // Optimization: Prune leaf nodes that have been found
    if (currNode.children.size === 0 && !currNode.word) {
      node.children.delete(char);
    }
  };

  // Step 3: Start DFS from every cell on the board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root);
    }
  }

  return result;
};
```

```java
// OPTIMAL SOLUTION: Trie + Backtracking
// Time: O(M * N * 4^L) where L is maximum word length | Space: O(K) where K is total characters in all words
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    String word = null;  // Store complete word at leaf node
}

class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        // Step 1: Build the Trie from all words
        TrieNode root = new TrieNode();
        for (String word : words) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                if (!node.children.containsKey(ch)) {
                    node.children.put(ch, new TrieNode());
                }
                node = node.children.get(ch);
            }
            node.word = word;  // Store the complete word at the end
        }

        List<String> result = new ArrayList<>();
        int rows = board.length, cols = board[0].length;

        // Step 2: DFS function that explores board and Trie simultaneously
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                dfs(board, r, c, root, result);
            }
        }

        return result;
    }

    private void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        char ch = board[r][c];

        // Check if current character exists in Trie
        if (!node.children.containsKey(ch)) return;

        // Move to the next node in Trie
        TrieNode currNode = node.children.get(ch);

        // If we found a complete word, add to results
        if (currNode.word != null) {
            result.add(currNode.word);
            currNode.word = null;  // Remove to avoid duplicates
        }

        // Mark current cell as visited by temporarily changing its value
        board[r][c] = '#';

        // Explore all four directions
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length && board[nr][nc] != '#') {
                dfs(board, nr, nc, currNode, result);
            }
        }

        // Restore the cell's original value (backtrack)
        board[r][c] = ch;

        // Optimization: Prune leaf nodes that have been found
        if (currNode.children.isEmpty() && currNode.word == null) {
            node.children.remove(ch);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Worst case: O(M × N × 4^L) where L is the maximum word length
- In practice, it's much better because:
  1. Trie pruning stops exploration when no words have the current prefix
  2. We remove found words to avoid redundant searches
  3. The 4^L factor only applies to paths that actually exist in the Trie

**Space Complexity:**

- Trie storage: O(K) where K is the total number of characters in all words
- Recursion stack: O(L) for DFS depth (maximum word length)
- Board modification: O(1) extra space (we modify board in-place for visited marking)

## Common Mistakes

1. **Forgetting to backtrack visited cells**: Always restore the board cell after DFS returns. Without this, you'll block valid paths that cross over previously visited cells.

2. **Not pruning the Trie after finding words**: If you don't remove found words (`currNode.word = null`) and prune empty leaf nodes, you'll get duplicate results and waste time searching already-found words.

3. **Using a separate visited array**: While intuitive, this uses O(M×N) extra space. The optimal approach modifies the board in-place (temporarily changing `board[r][c]` to `'#'`) and restores it during backtracking.

4. **Starting DFS for each word separately**: This is the brute force pitfall. Remember that Trie allows simultaneous search for all words sharing prefixes.

## When You'll See This Pattern

The **Trie + Backtracking** pattern appears in problems where you need to:

- Search for multiple strings in a grid or graph
- Find all words/patterns with common prefixes
- Optimize dictionary lookups during exploration

**Related problems:**

1. **[Word Search](/problem/word-search)** (Medium): The single-word version that introduces the basic DFS backtracking pattern on a grid.
2. **[Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree)** (Medium): Practice building and using Tries, which is essential for Word Search II.
3. **[Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure)** (Medium): Another Trie application with wildcard matching.
4. **[Boggle](/problem/boggle)** (similar problem): Finding all valid words in a letter grid, often with point scoring.

## Key Takeaways

1. **Trie enables prefix-sharing**: When searching for multiple strings, a Trie lets you explore common prefixes once rather than repeating work for each string.

2. **Backtracking with in-place modification**: For grid traversal problems, modify cells in-place to mark visited status, then restore during backtracking to save space.

3. **Prune aggressively**: Remove found words from the Trie and delete empty leaf nodes to prevent redundant searches and improve performance.

4. **Think about worst-case but optimize for common cases**: While the theoretical worst-case is exponential, real-world performance is much better due to pruning and the structure of natural language.

Related problems: [Word Search](/problem/word-search), [Unique Paths III](/problem/unique-paths-iii), [Encrypt and Decrypt Strings](/problem/encrypt-and-decrypt-strings)
