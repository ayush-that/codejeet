---
title: "How to Crack Barclays Coding Interviews in 2026"
description: "Complete guide to Barclays coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-09-14"
category: "company-guide"
company: "barclays"
tags: ["barclays", "interview prep", "leetcode"]
---

Barclays’s coding interviews follow a fairly standard investment bank tech interview structure, but with a distinct flavor that trips up many candidates who only prepare for FAANG-style assessments. The process typically consists of an initial online assessment (OA), followed by two to three technical video interviews, and often concludes with a final-round “superday” involving multiple back-to-back sessions. What makes their process unique is the heavy emphasis on **clean implementation under time pressure** and **practical problem-solving** over theoretical deep dives. You’re not just proving you know an algorithm; you’re proving you can translate a business or logical constraint into reliable, bug-free code in a limited timeframe. The questions often feel like they’re pulled from real-world financial data processing or system simulation tasks.

## What Makes Barclays Different

While FAANG interviews often prioritize optimal asymptotic complexity and deep algorithmic knowledge (think dynamic programming on graphs), Barclays’s technical screens lean heavily toward **implementation fidelity and edge-case handling**. The problems are frequently framed as simulations or matrix manipulations that require careful indexing and state management. You’re less likely to get a pure “find the longest palindromic subsequence” problem and more likely to get “simulate this grid-based game” or “process this transaction log.”

Another key differentiator is the **expectation of complete, runnable code**. Pseudocode is often insufficient, especially in the later rounds. Interviewers want to see you handle input parsing, boundary conditions, and output formatting. There’s also a notable focus on **mathematical reasoning**—many array and string problems have a mathematical twist, requiring you to derive a formula or property to avoid brute force. Optimization is important, but it’s usually about optimizing the _implementation_ (O(n) vs O(n²)) rather than shaving off logarithmic factors. They care that your solution is correct, robust, and demonstrably efficient enough for the stated constraints.

## By the Numbers

Based on recent data, Barclays’s question difficulty breaks down as follows:

- **Easy: 5 (36%)** – These are your warm-ups, testing basic control flow, string manipulation, and simple data structures. Don’t underestimate them; a sloppy solution here can kill your momentum.
- **Medium: 8 (57%)** – This is the core of the interview. Expect problems involving 2D arrays (matrices), more complex string parsing, and simulations. Success here requires pattern recognition and clean code.
- **Hard: 1 (7%)** – The single hard problem is often a complex simulation or a graph problem disguised as a matrix traversal. It’s used as a differentiator for top candidates.

This distribution tells you where to focus: **master the Medium problems**. If you can consistently solve Medium questions within 25 minutes with clean code, you are in a very strong position. Specific LeetCode problems that mirror Barclays’s style include **Spiral Matrix (#54)**, **Rotate Image (#48)**, **Set Matrix Zeroes (#73)**, **Multiply Strings (#43)**, and **Game of Life (#289)**. These all involve careful iteration over arrays or matrices with specific transformation rules—a Barclays hallmark.

## Top Topics to Focus On

**Array & Matrix Manipulation**
Barclays loves these because they model real-world data grids (like financial spreadsheets, time-series data, or trading boards). The key is mastering in-place operations and traversal patterns (spiral, diagonal, layer-by-layer). You must be comfortable with nested loops and index arithmetic without getting lost.

<div class="code-group">

```python
# LeetCode #48 - Rotate Image (Rotate Matrix)
# Time: O(n^2) | Space: O(1) - In-place rotation
def rotate(matrix):
    """
    Rotate a square matrix 90 degrees clockwise.
    Pattern: Transpose then reverse each row.
    """
    n = len(matrix)
    # 1. Transpose the matrix (swap matrix[i][j] with matrix[j][i])
    for i in range(n):
        for j in range(i, n):  # Start j from i to avoid double-swapping
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # 2. Reverse each row
    for i in range(n):
        matrix[i].reverse()
    # The matrix is now rotated in-place.
```

```javascript
// LeetCode #48 - Rotate Image (Rotate Matrix)
// Time: O(n^2) | Space: O(1) - In-place rotation
function rotate(matrix) {
  const n = matrix.length;
  // 1. Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // 2. Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}
```

```java
// LeetCode #48 - Rotate Image (Rotate Matrix)
// Time: O(n^2) | Space: O(1) - In-place rotation
public void rotate(int[][] matrix) {
    int n = matrix.length;
    // 1. Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    // 2. Reverse each row
    for (int i = 0; i < n; i++) {
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = matrix[i][left];
            matrix[i][left] = matrix[i][right];
            matrix[i][right] = temp;
            left++;
            right--;
        }
    }
}
```

</div>

**String Processing**
Strings often represent encoded data or instructions. Focus on problems involving parsing, validation, and transformation. Know how to efficiently use two pointers, sliding windows, and string builders (StringBuilder in Java, list joining in Python) to avoid O(n²) concatenation.

**Math & Simulation**
This is where Barclays problems get their unique character. Simulations test your ability to translate written rules into precise code. Math problems require you to find a numerical property or formula. For example, a problem might ask you to simulate a board game or calculate a financial metric based on a sequence, requiring careful loop design and state tracking.

<div class="code-group">

```python
# LeetCode #289 - Game of Life (Classic Simulation)
# Time: O(m*n) | Space: O(1) - In-place using state encoding
def gameOfLife(board):
    """
    Simulate Conway's Game of Life in-place.
    Pattern: Encode next state in the same cell using bit manipulation.
    """
    if not board:
        return
    m, n = len(board), len(board[0])
    # Directions: 8 neighbors
    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    for i in range(m):
        for j in range(n):
            live_neighbors = 0
            # Count live neighbors (original state, check LSB)
            for di, dj in dirs:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and (board[ni][nj] & 1) == 1:
                    live_neighbors += 1
            # Apply rules using bitwise OR to store next state in the 2nd bit
            # Rule 1/3: Any live cell with 2 or 3 live neighbors lives on
            if board[i][j] == 1 and (live_neighbors == 2 or live_neighbors == 3):
                board[i][j] |= 2  # Set 2nd bit to 1 (binary '11' or 3)
            # Rule 4: Any dead cell with exactly 3 live neighbors becomes live
            elif board[i][j] == 0 and live_neighbors == 3:
                board[i][j] |= 2  # Set 2nd bit to 1 (binary '10' or 2)
    # Shift to get the next state (right shift by 1 bit)
    for i in range(m):
        for j in range(n):
            board[i][j] >>= 1
```

```javascript
// LeetCode #289 - Game of Life (Classic Simulation)
// Time: O(m*n) | Space: O(1) - In-place using state encoding
function gameOfLife(board) {
  if (!board || board.length === 0) return;
  const m = board.length,
    n = board[0].length;
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let live = 0;
      for (const [di, dj] of dirs) {
        const ni = i + di,
          nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) === 1) {
          live++;
        }
      }
      // Encode next state in the 2nd bit
      if (board[i][j] === 1 && (live === 2 || live === 3)) {
        board[i][j] |= 2; // 3 (binary 11) or stays 1? Actually 1|2 = 3.
      }
      if (board[i][j] === 0 && live === 3) {
        board[i][j] |= 2; // 2 (binary 10)
      }
    }
  }
  // Decode: shift right
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      board[i][j] >>= 1;
    }
  }
}
```

```java
// LeetCode #289 - Game of Life (Classic Simulation)
// Time: O(m*n) | Space: O(1) - In-place using state encoding
public void gameOfLife(int[][] board) {
    if (board == null || board.length == 0) return;
    int m = board.length, n = board[0].length;
    int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            int live = 0;
            for (int[] d : dirs) {
                int ni = i + d[0], nj = j + d[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) == 1) {
                    live++;
                }
            }
            // Rules
            if (board[i][j] == 1 && (live == 2 || live == 3)) {
                board[i][j] |= 2; // 3 (11) or 1? 1|2 = 3.
            }
            if (board[i][j] == 0 && live == 3) {
                board[i][j] |= 2; // 2 (10)
            }
        }
    }
    // Update
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            board[i][j] >>= 1;
        }
    }
}
```

</div>

## Preparation Strategy

A focused 5-week plan is ideal.

- **Week 1-2: Foundation & Patterns.** Grind the core topics. Solve 15-20 problems on Arrays (focus on in-place ops), 15 on Strings, and 10 on Matrix traversal. Don’t just solve; after each problem, write a clean, commented version from scratch. Target: ~40 problems.
- **Week 3: Simulation & Math.** Dedicate this week to simulation problems (like Game of Life, #289) and math-based array/string problems (like Multiply Strings, #43). Practice writing the entire simulation loop flawlessly. Target: 15-20 problems.
- **Week 4: Mixed Practice & Timed Sessions.** Use the “Barclays” tagged problems on platforms. Do 2-3 problems per day in a 60-minute timed block, mimicking the interview. Focus on producing final, runnable code on the first try. Target: 20-25 problems.
- **Week 5: Mock Interviews & Review.** Conduct at least 3 mock interviews with a friend or using a platform. Revisit all problems you struggled with. In the final 2 days, stop learning new things; just re-implement your top 10 most representative problems to build muscle memory.

## Common Mistakes

1.  **Ignoring Input/Output Format:** Barclays problems often have specific input (e.g., a list of strings) and output (e.g., a modified matrix) formats. Writing a function that solves the core logic but doesn’t match the required signature or return type is a critical error. **Fix:** Always read the function signature and example I/O twice before starting.
2.  **Overcomplicating with Advanced Data Structures:** Candidates often reach for a HashMap or Heap when a simple array and integer counter would suffice. This adds unnecessary complexity and potential for bugs. **Fix:** Ask yourself: “Can I solve this with just arrays, pointers, and basic arithmetic?” First, try the simplest data structure that fits.
3.  **Sloppy Index Management in Matrices:** Off-by-one errors and incorrect boundary checks in nested loops will destroy your solution. This is the #1 cause of failed matrix problems. **Fix:** Before running the loop, write a comment defining the precise meaning of your indices (e.g., `i = row from 0..m-1`). Test the edges mentally.
4.  **Silently Debugging:** When you hit a bug, don’t just stare at the code or run it mentally. Interviewers want to see your process. **Fix:** Verbally state your assumption, walk through a small test case with your code, and point out where the output diverges from expectation. This turns a bug into a demonstration of problem-solving.

## Key Tips

1.  **Write Production-Ready Code from the Start:** Assume every line you type will be reviewed. Use descriptive variable names (`next_row` not `nr`), add brief inline comments for complex logic, and handle obvious edge cases (empty input, single element) immediately. This creates a fantastic impression.
2.  **Master In-Place Operations:** Because so many problems involve matrix manipulation, become fluent in techniques like transposition, reflection, and using bit manipulation or temporary values to store states (as shown in Game of Life). This is a high-value skill for Barclays.
3.  **Practice Time-Boxed Implementation:** Set a timer for 25 minutes. Your goal is not just to find the algorithm, but to produce the complete, syntactically correct, and logically sound code within that time. This builds the pace you need for the real interview.
4.  **Explain the “Why” Behind Your Pattern Choice:** When you say “I’ll use a two-pointer approach here,” immediately follow it with “because the array is sorted, and this allows us to find the pair in O(n) time without extra space.” This shows depth of understanding.
5.  **Have a Standard Approach for Simulations:** When you see a simulation problem, immediately outline your plan: 1) Define the state representation, 2) Define the rules/transitions clearly, 3) Decide on in-place update vs. copy (and justify it), 4) Implement the main loop with neighbor/update logic. This structure prevents you from getting lost.

Remember, Barclays is testing for competent, reliable engineers who can translate specifications into solid code. Your ability to do that clearly and efficiently is what will get you the offer.

[Browse all Barclays questions on CodeJeet](/company/barclays)
