---
title: "Depth-First Search Questions at Google: What to Expect"
description: "Prepare for Depth-First Search interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-05"
category: "dsa-patterns"
tags: ["google", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Google: What to Expect

Google has 196 Depth-First Search questions in their tagged problem list out of 2,217 total. That's nearly 9% of their entire question bank. But here's what that number doesn't tell you: DFS isn't just another algorithm in Google's arsenal—it's the backbone of how they think about problem decomposition. At Google, DFS questions rarely test your ability to implement a basic traversal. Instead, they test whether you can recognize when a problem is fundamentally about exploring possibilities, managing state, and backtracking efficiently.

In real interviews, you'll encounter DFS in about 1 in 3 technical rounds at Google, but often disguised. It might appear as a "tree validation" problem, a "backtracking" puzzle, or a "graph connectivity" challenge. The key insight is that Google uses DFS to assess your recursive thinking skills—your ability to break down complex problems into manageable subproblems and explore solution spaces systematically.

## Specific Patterns Google Favors

Google's DFS questions tend to cluster around three specific patterns that reflect real engineering challenges:

1. **Stateful Backtracking with Pruning** - These are problems where you explore a solution space but can eliminate branches early. Think Sudoku solver (#37), N-Queens (#51), or generating parentheses (#22). Google loves these because they mirror real-world constraint satisfaction problems in scheduling, resource allocation, or configuration management.

2. **Tree/Graph Validation with Additional Constraints** - Not just "traverse the tree," but "validate this binary search tree while tracking minimum and maximum bounds" (#98) or "find the diameter of a tree requiring state propagation" (#543). These test your ability to maintain and propagate state through recursive calls.

3. **Path Finding with Memoization** - Problems like Unique Paths (#62) or Longest Increasing Path in a Matrix (#329) where pure DFS would be exponential, but DFS with memoization (top-down DP) provides an elegant solution. This pattern is particularly common in Google interviews because it bridges recursive thinking with optimization.

Here's the classic memoized DFS pattern Google expects you to know:

<div class="code-group">

```python
def longest_increasing_path(matrix):
    if not matrix:
        return 0

    rows, cols = len(matrix), len(matrix[0])
    memo = [[-1] * cols for _ in range(rows)]

    def dfs(r, c):
        if memo[r][c] != -1:
            return memo[r][c]

        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        max_path = 1  # At least the cell itself

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                max_path = max(max_path, 1 + dfs(nr, nc))

        memo[r][c] = max_path
        return max_path

    result = 0
    for r in range(rows):
        for c in range(cols):
            result = max(result, dfs(r, c))

    return result

# Time: O(m*n) - each cell computed once due to memoization
# Space: O(m*n) for the memoization cache
```

```javascript
function longestIncreasingPath(matrix) {
  if (!matrix.length) return 0;

  const rows = matrix.length,
    cols = matrix[0].length;
  const memo = Array(rows)
    .fill()
    .map(() => Array(cols).fill(-1));

  function dfs(r, c) {
    if (memo[r][c] !== -1) return memo[r][c];

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    let maxPath = 1;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
        maxPath = Math.max(maxPath, 1 + dfs(nr, nc));
      }
    }

    memo[r][c] = maxPath;
    return maxPath;
  }

  let result = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result = Math.max(result, dfs(r, c));
    }
  }

  return result;
}

// Time: O(m*n) | Space: O(m*n)
```

```java
class Solution {
    private int[][] memo;
    private int[][] matrix;
    private int rows, cols;

    public int longestIncreasingPath(int[][] matrix) {
        if (matrix.length == 0) return 0;

        this.matrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;
        this.memo = new int[rows][cols];

        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        int result = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                result = Math.max(result, dfs(r, c));
            }
        }

        return result;
    }

    private int dfs(int r, int c) {
        if (memo[r][c] != -1) return memo[r][c];

        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int maxPath = 1;

        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                matrix[nr][nc] > matrix[r][c]) {
                maxPath = Math.max(maxPath, 1 + dfs(nr, nc));
            }
        }

        memo[r][c] = maxPath;
        return maxPath;
    }
}

// Time: O(m*n) | Space: O(m*n)
```

</div>

## How to Prepare

Mastering DFS for Google requires more than memorizing templates. You need to develop intuition for when DFS is appropriate and how to implement it cleanly. Here's my approach:

1. **Always think in terms of state** - What information needs to be passed down? What needs to be returned up? What can be stored globally?

2. **Practice the backtracking template until it's muscle memory** - Most Google backtracking problems follow the same pattern: choose, explore, unchoose.

3. **Learn to identify when to use iterative vs recursive DFS** - For tree problems, recursive is almost always cleaner. For graph problems with deep recursion risk, iterative with a stack might be safer.

Here's the backtracking template that solves dozens of Google problems:

<div class="code-group">

```python
def generate_parentheses(n):
    result = []

    def backtrack(current, open_count, close_count):
        # Base case: valid combination found
        if len(current) == 2 * n:
            result.append("".join(current))
            return

        # Decision 1: add opening parenthesis if we haven't used all
        if open_count < n:
            current.append("(")
            backtrack(current, open_count + 1, close_count)
            current.pop()  # backtrack

        # Decision 2: add closing parenthesis if it would be valid
        if close_count < open_count:
            current.append(")")
            backtrack(current, open_count, close_count + 1)
            current.pop()  # backtrack

    backtrack([], 0, 0)
    return result

# Time: O(4^n/√n) - Catalan number growth
# Space: O(n) for recursion depth and current string
```

```javascript
function generateParenthesis(n) {
  const result = [];

  function backtrack(current, openCount, closeCount) {
    // Base case
    if (current.length === 2 * n) {
      result.push(current.join(""));
      return;
    }

    // Add opening parenthesis if possible
    if (openCount < n) {
      current.push("(");
      backtrack(current, openCount + 1, closeCount);
      current.pop(); // backtrack
    }

    // Add closing parenthesis if valid
    if (closeCount < openCount) {
      current.push(")");
      backtrack(current, openCount, closeCount + 1);
      current.pop(); // backtrack
    }
  }

  backtrack([], 0, 0);
  return result;
}

// Time: O(4^n/√n) | Space: O(n)
```

```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), 0, 0, n);
        return result;
    }

    private void backtrack(List<String> result, StringBuilder current,
                          int openCount, int closeCount, int n) {
        // Base case
        if (current.length() == 2 * n) {
            result.add(current.toString());
            return;
        }

        // Add opening parenthesis if possible
        if (openCount < n) {
            current.append('(');
            backtrack(result, current, openCount + 1, closeCount, n);
            current.deleteCharAt(current.length() - 1);  // backtrack
        }

        // Add closing parenthesis if valid
        if (closeCount < openCount) {
            current.append(')');
            backtrack(result, current, openCount, closeCount + 1, n);
            current.deleteCharAt(current.length() - 1);  // backtrack
        }
    }
}

// Time: O(4^n/√n) | Space: O(n)
```

</div>

## How Google Tests Depth-First Search vs Other Companies

Google's DFS questions differ from other companies in three key ways:

1. **Emphasis on optimization** - At Facebook, you might get a straightforward "clone a graph" problem (#133). At Google, that same problem would have follow-ups about handling cycles efficiently or scaling to massive graphs. Google interviewers almost always ask "can we do better?" even if your initial solution is correct.

2. **Integration with system design concepts** - A Google DFS problem might be framed as "design a crawler that needs to avoid revisiting pages" (which is essentially graph traversal with a visited set) or "find connected components in a social network." The algorithm is presented in a practical context.

3. **Higher difficulty ceiling** - While Amazon might ask "max depth of a binary tree" (#104) as an easy warm-up, Google's DFS questions tend to start at medium difficulty and quickly ramp up. Problems like "remove invalid parentheses" (#301) or "word search II" (#212) are classic Google hard problems that combine DFS with other concepts.

## Study Order

Don't jump straight into hard DFS problems. Build your foundation systematically:

1. **Basic tree traversals** - Preorder, inorder, postorder. Understand why each traversal order matters for different problems.
2. **Simple graph DFS** - Connected components, cycle detection. Master the visited set pattern.
3. **Backtracking fundamentals** - Permutations, combinations, subsets. Learn the choose-explore-unchoose pattern.
4. **DFS with memoization** - Understand how to add caching to avoid repeated work.
5. **DFS on implicit graphs** - Problems where the graph isn't given but implied (like word search or N-queens).
6. **DFS with multiple return values** - Problems that require returning more than just a boolean or integer from your recursive function.
7. **Iterative DFS** - When recursion depth is a concern or when you need more control over the stack.

This order works because each step builds on the previous one. You can't solve complex backtracking problems if you're still shaky on basic recursion. You can't implement memoized DFS if you don't understand state management in recursive functions.

## Recommended Practice Order

Here's a curated sequence of problems that gradually increase in complexity:

1. **Maximum Depth of Binary Tree** (#104) - The simplest possible DFS
2. **Same Tree** (#100) - Compare two trees using DFS
3. **Validate Binary Search Tree** (#98) - DFS with state propagation
4. **Number of Islands** (#200) - Classic grid DFS
5. **Generate Parentheses** (#22) - Introduction to backtracking
6. **Subsets** (#78) - Backtracking with combinations
7. **Permutations** (#46) - Backtracking with permutations
8. **Word Search** (#79) - DFS on implicit graph
9. **Longest Increasing Path in a Matrix** (#329) - DFS with memoization
10. **Remove Invalid Parentheses** (#301) - Advanced backtracking with pruning
11. **Word Search II** (#212) - DFS combined with Trie (classic Google hard)

Each problem introduces a new concept while reinforcing previous ones. By the time you reach #212, you'll have seen every major DFS pattern Google tests.

Remember: At Google, DFS isn't just about traversal—it's about systematic exploration of possibility spaces. The interviewers are testing whether you think recursively, manage state cleanly, and optimize intelligently. Master these patterns, and you'll be ready for whatever DFS challenge they throw at you.

[Practice Depth-First Search at Google](/company/google/depth-first-search)
