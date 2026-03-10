---
title: "How to Solve Snakes and Ladders — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Snakes and Ladders. Medium difficulty, 48.0% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2027-09-24"
category: "dsa-patterns"
tags: ["snakes-and-ladders", "array", "breadth-first-search", "matrix", "medium"]
---

# How to Solve Snakes and Ladders

This problem asks you to find the minimum number of dice rolls needed to reach the final square (n²) on a snakes and ladders board. The tricky part is that the board numbering follows a "boustrophedon" pattern (alternating directions each row), and you need to handle snakes and ladders that instantly transport you to different squares. This is essentially a shortest path problem on a graph where each square connects to up to 6 forward squares (plus any snake/ladder jumps).

## Visual Walkthrough

Let's trace through a small example with n=3 and this board:

```
[[-1,-1,-1],
 [-1,-1,-1],
 [-1,-1,-1]]
```

This is a board with no snakes or ladders.

**Step 1: Understanding the board numbering**
With n=3, squares go from 1 to 9. The boustrophedon pattern means:

- Bottom row (row 2): squares 1, 2, 3 (left to right)
- Middle row (row 1): squares 6, 5, 4 (right to left)
- Top row (row 0): squares 7, 8, 9 (left to right)

**Step 2: Starting position**
We begin at square 1 (outside the board). On our first turn, we roll a die (1-6) and move to that square.

**Step 3: First move possibilities**
From square 1, we can move to squares 2-7. But wait - we need to check if any of these are snakes/ladders. In this case, all are -1 (no special moves).

**Step 4: Finding the shortest path**
We can reach square 9 in 2 moves: 1→4→9 or 1→5→9. The BFS approach will explore all possibilities level by level until it finds the destination.

## Brute Force Approach

A naive approach might try to simulate all possible dice roll sequences, but this would be exponential in complexity. For each square, you have up to 6 choices, leading to O(6^k) possibilities where k is the number of moves. This quickly becomes infeasible.

Another brute force approach might use DFS to explore all paths, but this would also be exponential and wouldn't guarantee finding the shortest path first. We need a systematic way to find the minimum number of moves.

## Optimized Approach

The key insight is that this is a **shortest path problem on an unweighted graph**, which makes **Breadth-First Search (BFS)** the perfect tool. Here's why:

1. **Graph representation**: Each square is a node. From each square, you have edges to the next 6 squares (or fewer if near the end), plus any snake/ladder jumps from those squares.

2. **Why BFS works**: BFS explores all nodes at distance 1, then distance 2, etc. The first time we reach the destination square, we've found the shortest path.

3. **Handling snakes and ladders**: When we land on a square with a snake or ladder (board value ≠ -1), we immediately move to the destination square. This is like having a direct edge from the current square to the snake/ladder destination.

4. **Avoiding cycles**: We need to track visited squares to avoid infinite loops (especially with snakes that could send you back).

The algorithm:

1. Start BFS from square 1 (which is outside the board)
2. For each square, try moves 1-6
3. Convert the next square number to board coordinates
4. Check if that square has a snake/ladder and jump if needed
5. If we reach n², return the number of moves
6. Track visited squares to avoid reprocessing

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) - we visit each square at most once
# Space: O(n^2) - for the queue and visited set
from collections import deque

def snakesAndLadders(board):
    n = len(board)

    def get_coordinates(square):
        """
        Convert square number (1-indexed) to board coordinates.
        The board is indexed from bottom-left as square 1.
        Rows alternate direction: bottom row left→right, next row right→left, etc.
        """
        # Convert to 0-indexed
        square -= 1

        # Calculate row from bottom (0-indexed from bottom)
        row = n - 1 - (square // n)

        # Calculate column
        col = square % n

        # If row count from bottom is odd (i.e., row index from top is even for 0-indexed),
        # then we're going right to left for that row
        if (n - 1 - row) % 2 == 1:  # Equivalent to: if row from bottom is odd
            col = n - 1 - col

        return row, col

    # BFS initialization
    queue = deque([(1, 0)])  # (square, moves)
    visited = set([1])

    while queue:
        square, moves = queue.popleft()

        # Try all possible dice rolls (1-6)
        for roll in range(1, 7):
            next_square = square + roll

            # Check if we've reached or passed the destination
            if next_square > n * n:
                continue

            # Convert to board coordinates
            row, col = get_coordinates(next_square)

            # Check for snake or ladder
            if board[row][col] != -1:
                next_square = board[row][col]

            # Check if we've reached the destination
            if next_square == n * n:
                return moves + 1

            # Add to queue if not visited
            if next_square not in visited:
                visited.add(next_square)
                queue.append((next_square, moves + 1))

    # If we exhaust all possibilities without reaching the end
    return -1
```

```javascript
// Time: O(n^2) - we visit each square at most once
// Space: O(n^2) - for the queue and visited set
function snakesAndLadders(board) {
  const n = board.length;

  // Helper function to convert square number to board coordinates
  const getCoordinates = (square) => {
    // Convert to 0-indexed
    square -= 1;

    // Calculate row from bottom (0-indexed from bottom)
    const row = n - 1 - Math.floor(square / n);

    // Calculate column
    let col = square % n;

    // If row count from bottom is odd, we're going right to left
    if ((n - 1 - row) % 2 === 1) {
      col = n - 1 - col;
    }

    return [row, col];
  };

  // BFS initialization
  const queue = [[1, 0]]; // [square, moves]
  const visited = new Set([1]);

  while (queue.length > 0) {
    const [square, moves] = queue.shift();

    // Try all possible dice rolls (1-6)
    for (let roll = 1; roll <= 6; roll++) {
      let nextSquare = square + roll;

      // Check if we've reached or passed the destination
      if (nextSquare > n * n) {
        continue;
      }

      // Convert to board coordinates
      const [row, col] = getCoordinates(nextSquare);

      // Check for snake or ladder
      if (board[row][col] !== -1) {
        nextSquare = board[row][col];
      }

      // Check if we've reached the destination
      if (nextSquare === n * n) {
        return moves + 1;
      }

      // Add to queue if not visited
      if (!visited.has(nextSquare)) {
        visited.add(nextSquare);
        queue.push([nextSquare, moves + 1]);
      }
    }
  }

  // If we exhaust all possibilities without reaching the end
  return -1;
}
```

```java
// Time: O(n^2) - we visit each square at most once
// Space: O(n^2) - for the queue and visited set
import java.util.*;

public class Solution {
    public int snakesAndLadders(int[][] board) {
        int n = board.length;

        // BFS initialization
        Queue<int[]> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        queue.offer(new int[]{1, 0});  // {square, moves}
        visited.add(1);

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int square = current[0];
            int moves = current[1];

            // Try all possible dice rolls (1-6)
            for (int roll = 1; roll <= 6; roll++) {
                int nextSquare = square + roll;

                // Check if we've reached or passed the destination
                if (nextSquare > n * n) {
                    continue;
                }

                // Convert to board coordinates
                int[] coords = getCoordinates(nextSquare, n);
                int row = coords[0];
                int col = coords[1];

                // Check for snake or ladder
                if (board[row][col] != -1) {
                    nextSquare = board[row][col];
                }

                // Check if we've reached the destination
                if (nextSquare == n * n) {
                    return moves + 1;
                }

                // Add to queue if not visited
                if (!visited.contains(nextSquare)) {
                    visited.add(nextSquare);
                    queue.offer(new int[]{nextSquare, moves + 1});
                }
            }
        }

        // If we exhaust all possibilities without reaching the end
        return -1;
    }

    private int[] getCoordinates(int square, int n) {
        // Convert to 0-indexed
        square -= 1;

        // Calculate row from bottom (0-indexed from bottom)
        int row = n - 1 - (square / n);

        // Calculate column
        int col = square % n;

        // If row count from bottom is odd, we're going right to left
        if ((n - 1 - row) % 2 == 1) {
            col = n - 1 - col;
        }

        return new int[]{row, col};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- In the worst case, we might visit every square on the board once
- Each square is processed once when dequeued from the BFS queue
- For each square, we check up to 6 possible moves (constant time)
- The coordinate conversion is O(1) per move

**Space Complexity: O(n²)**

- The BFS queue can hold up to O(n²) elements in the worst case
- The visited set stores up to n² squares
- The board itself is n × n, but that's part of the input

## Common Mistakes

1. **Incorrect coordinate conversion**: The boustrophedon pattern is tricky. Many candidates forget to alternate directions or miscalculate row indices. Test your conversion with small examples.

2. **Forgetting to handle snakes/ladders correctly**: When you land on a square with a snake/ladder, you should move to the destination square immediately. Don't process the intermediate square as a separate step.

3. **Not tracking visited squares**: Without a visited set, you can get stuck in infinite loops (especially with snakes that send you backward). BFS would then run forever.

4. **Off-by-one errors**: The board is 1-indexed (squares 1 to n²) but arrays are 0-indexed. Double-check your conversions between square numbers and array indices.

## When You'll See This Pattern

This BFS pattern for shortest path problems appears frequently:

1. **Word Ladder (LeetCode 127)**: Find the shortest transformation sequence between words. Each word is a node, and edges connect words that differ by one letter.

2. **Minimum Genetic Mutation (LeetCode 433)**: Similar to Word Ladder but with genetic sequences.

3. **Open the Lock (LeetCode 752)**: Find the minimum turns to reach a target combination on a lock. Each combination is a node, with edges to combinations that differ by one digit.

All these problems involve finding the shortest path in an unweighted graph where you can't use Dijkstra's algorithm (which is for weighted graphs) and DFS would be inefficient.

## Key Takeaways

1. **BFS is for shortest path in unweighted graphs**: When you need the minimum number of steps/moves and all moves have equal cost, BFS is your go-to algorithm.

2. **Model the problem as a graph**: Identify what constitutes a "node" and what constitutes an "edge". In this case, squares are nodes, and dice rolls (plus snake/ladder jumps) are edges.

3. **Watch for implicit graphs**: Many problems don't explicitly give you a graph - you need to recognize that the state space forms a graph. The board squares with their connections form an implicit graph.

Related problems: [Most Profitable Path in a Tree](/problem/most-profitable-path-in-a-tree)
