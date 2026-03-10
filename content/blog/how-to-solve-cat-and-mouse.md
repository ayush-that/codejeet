---
title: "How to Solve Cat and Mouse — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cat and Mouse. Hard difficulty, 34.8% acceptance rate. Topics: Math, Dynamic Programming, Graph Theory, Topological Sort, Memoization."
date: "2029-07-13"
category: "dsa-patterns"
tags: ["cat-and-mouse", "math", "dynamic-programming", "graph-theory", "hard"]
---

# How to Solve Cat and Mouse

This is a two-player game theory problem played on an undirected graph. The mouse starts at node 1, the cat at node 2, and they alternate turns moving to adjacent nodes (or staying put). The mouse wins if it reaches the hole (node 0), the cat wins if it catches the mouse (same position), and it's a draw if the game goes on indefinitely. What makes this problem particularly tricky is that it's not just about finding shortest paths—it's about optimal play from both players, with the mouse trying to reach safety and the cat trying to prevent it, which requires reasoning about all possible game states and their outcomes.

## Visual Walkthrough

Let's trace through a simple example: `graph = [[2,3],[3],[0,3],[1,2]]`

**Graph representation:**

- Node 0: [2,3] (hole)
- Node 1: [3] (mouse start)
- Node 2: [0,3] (cat start)
- Node 3: [1,2]

**Game states:** We track (mouse_position, cat_position, turn). Turn 0 = mouse's turn, 1 = cat's turn.

**Initial state:** (1, 2, 0) - Mouse at 1, Cat at 2, Mouse's turn

**Step-by-step optimal play:**

1. From (1,2,0): Mouse can move to 3 (only neighbor)
   - New state: (3,2,1) - Cat's turn

2. From (3,2,1): Cat can move to 0 or 3
   - If cat moves to 0: (3,0,0) → Mouse wins next turn (mouse at 3, cat at hole)
   - If cat moves to 3: (3,3,0) → Cat wins immediately (same position)
   - Cat will choose move to 3 to win

So from (3,2,1), cat can force a win. Therefore (3,2,1) is a losing state for whoever's turn it is (cat's turn here means it's winning for cat).

3. Back to (1,2,0): Mouse's only move leads to (3,2,1) which is winning for cat. So (1,2,0) is also losing for mouse.

Thus the mouse cannot force a win from the start. But can it force a draw? Let's check if mouse has any alternative: No, only one move from node 1. So outcome is CAT win.

This example shows we need to work backwards from terminal states to determine outcomes.

## Brute Force Approach

A naive approach would be to simulate all possible game sequences using DFS. At each state, we'd recursively explore all possible moves for the player whose turn it is, assuming optimal play:

- If it's mouse's turn and ANY move leads to a mouse win, mouse chooses that move
- If ALL moves lead to cat win, cat wins
- If some moves lead to draw and none to mouse win, result is draw

The problem with this approach is the game could continue indefinitely (draw), causing infinite recursion. Even with memoization, the state space is O(n² × 2) where n ≤ 50, giving up to 5,000 states. However, the branching factor makes this exponential in practice, and we need to handle cycles properly.

A brute force DFS with simple memoization might get stuck in cycles, incorrectly marking states as draws when they're actually wins/losses. We need a more systematic approach that handles the "draw by repetition" case correctly.

## Optimized Approach

The key insight is to use **retrograde analysis** (working backwards from known outcomes) combined with **topological ordering** of game states. This is similar to solving a game with perfect information using dynamic programming.

**Core idea:**

1. Identify terminal states:
   - Mouse win: mouse at hole (position 0)
   - Cat win: mouse and cat at same position (except hole)
2. Work backwards from these terminal states using a queue (BFS-like approach):
   - If a state leads to a losing state for the opponent, mark current state as winning
   - If all moves from a state lead to winning states for opponent, mark as losing
   - Keep track of "outdegree" (number of possible moves) to determine when we can decide a state's outcome

3. Handle draws: States that aren't determined after processing all winnable/losable states are draws

**Why this works:** By processing states in reverse topological order (from known outcomes backward), we avoid infinite loops. Each time we determine a state's outcome, we reduce the outdegree of its predecessor states, eventually determining all states that have forced outcomes.

## Optimal Solution

We'll implement the solution using a degree-counting BFS approach:

<div class="code-group">

```python
# Time: O(n^3) where n = number of nodes
# Space: O(n^2) for storing all game states
class Solution:
    def catMouseGame(self, graph):
        n = len(graph)

        # dp[mouse][cat][turn] = outcome for this state
        # 0 = draw, 1 = mouse win, 2 = cat win
        # turn: 0 = mouse to move, 1 = cat to move
        dp = [[[0] * 2 for _ in range(n)] for _ in range(n)]

        # degree[mouse][cat][turn] = number of possible moves from this state
        degree = [[[0] * 2 for _ in range(n)] for _ in range(n)]

        # Initialize degrees
        for m in range(n):
            for c in range(n):
                # Mouse's turn: can move to all neighbors + stay put
                degree[m][c][0] = len(graph[m])
                # Cat's turn: can move to all neighbors except hole (0) + stay put
                degree[m][c][1] = len(graph[c]) - (0 in graph[c])

        # Queue for BFS: stores (mouse, cat, turn, outcome)
        queue = []

        # Initialize terminal states
        for i in range(1, n):  # Cat cannot be at hole (0)
            # Mouse at hole: mouse wins regardless of turn
            dp[0][i][0] = dp[0][i][1] = 1
            queue.append((0, i, 0, 1))
            queue.append((0, i, 1, 1))

            # Same position (except hole): cat wins
            dp[i][i][0] = dp[i][i][1] = 2
            queue.append((i, i, 0, 2))
            queue.append((i, i, 1, 2))

        # BFS to propagate outcomes
        while queue:
            mouse, cat, turn, outcome = queue.pop(0)

            # Get all predecessor states (states that can move to current state)
            if turn == 0:  # Current state was mouse's turn, so previous was cat's turn
                prev_turn = 1
                # Cat moved from some prev_cat to current cat
                for prev_cat in graph[cat]:
                    # Cat cannot move to hole (except when cat is already at hole, handled above)
                    if prev_cat == 0:
                        continue
                    process_predecessor(mouse, prev_cat, prev_turn, outcome, dp, degree, queue, graph)
            else:  # Current state was cat's turn, so previous was mouse's turn
                prev_turn = 0
                # Mouse moved from some prev_mouse to current mouse
                for prev_mouse in graph[mouse]:
                    process_predecessor(prev_mouse, cat, prev_turn, outcome, dp, degree, queue, graph)

        return dp[1][2][0]  # Initial state: mouse at 1, cat at 2, mouse's turn

def process_predecessor(mouse, cat, turn, outcome, dp, degree, queue, graph):
    """Process a predecessor state based on current outcome"""
    # Skip if already determined
    if dp[mouse][cat][turn] != 0:
        return

    # Check if this predecessor leads to a losing state for the player to move
    # If current outcome is win for player whose turn it was, then predecessor loses
    # If current outcome is lose for player whose turn it was, then predecessor wins
    if (turn == 0 and outcome == 2) or (turn == 1 and outcome == 1):
        # Current player (in predecessor) loses, so mark predecessor as win for opponent
        dp[mouse][cat][turn] = 3 - outcome  # 1->2 or 2->1
        queue.append((mouse, cat, turn, dp[mouse][cat][turn]))
    else:
        # Reduce outdegree - one more move leads to known outcome
        degree[mouse][cat][turn] -= 1
        if degree[mouse][cat][turn] == 0:
            # All moves lead to opponent win, so current player loses
            dp[mouse][cat][turn] = outcome  # Same outcome as all children
            queue.append((mouse, cat, turn, dp[mouse][cat][turn]))
```

```javascript
// Time: O(n^3) where n = number of nodes
// Space: O(n^2) for storing all game states
var catMouseGame = function (graph) {
  const n = graph.length;

  // dp[mouse][cat][turn] = outcome for this state
  // 0 = draw, 1 = mouse win, 2 = cat win
  // turn: 0 = mouse to move, 1 = cat to move
  const dp = Array(n)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(2).fill(0))
    );

  // degree[mouse][cat][turn] = number of possible moves from this state
  const degree = Array(n)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(2).fill(0))
    );

  // Initialize degrees
  for (let m = 0; m < n; m++) {
    for (let c = 0; c < n; c++) {
      // Mouse's turn: can move to all neighbors
      degree[m][c][0] = graph[m].length;
      // Cat's turn: can move to all neighbors except hole (0)
      degree[m][c][1] = graph[c].length;
      if (graph[c].includes(0)) {
        degree[m][c][1]--;
      }
    }
  }

  // Queue for BFS
  const queue = [];

  // Initialize terminal states
  for (let i = 1; i < n; i++) {
    // Mouse at hole: mouse wins
    dp[0][i][0] = dp[0][i][1] = 1;
    queue.push([0, i, 0, 1]);
    queue.push([0, i, 1, 1]);

    // Same position (except hole): cat wins
    dp[i][i][0] = dp[i][i][1] = 2;
    queue.push([i, i, 0, 2]);
    queue.push([i, i, 1, 2]);
  }

  // Process queue
  while (queue.length > 0) {
    const [mouse, cat, turn, outcome] = queue.shift();

    // Get predecessor states
    if (turn === 0) {
      // Current was mouse's turn, so previous was cat's turn
      const prevTurn = 1;
      for (const prevCat of graph[cat]) {
        // Cat cannot move to hole
        if (prevCat === 0) continue;
        processPredecessor(mouse, prevCat, prevTurn, outcome);
      }
    } else {
      // Current was cat's turn, so previous was mouse's turn
      const prevTurn = 0;
      for (const prevMouse of graph[mouse]) {
        processPredecessor(prevMouse, cat, prevTurn, outcome);
      }
    }
  }

  function processPredecessor(mouse, cat, turn, outcome) {
    // Skip if already determined
    if (dp[mouse][cat][turn] !== 0) return;

    // Check if predecessor leads to losing state
    if ((turn === 0 && outcome === 2) || (turn === 1 && outcome === 1)) {
      // Current player in predecessor loses
      dp[mouse][cat][turn] = 3 - outcome; // 1->2 or 2->1
      queue.push([mouse, cat, turn, dp[mouse][cat][turn]]);
    } else {
      // Reduce outdegree
      degree[mouse][cat][turn]--;
      if (degree[mouse][cat][turn] === 0) {
        // All moves lead to opponent win
        dp[mouse][cat][turn] = outcome;
        queue.push([mouse, cat, turn, dp[mouse][cat][turn]]);
      }
    }
  }

  return dp[1][2][0]; // Initial state
};
```

```java
// Time: O(n^3) where n = number of nodes
// Space: O(n^2) for storing all game states
class Solution {
    public int catMouseGame(int[][] graph) {
        int n = graph.length;

        // dp[mouse][cat][turn] = outcome
        // 0 = draw, 1 = mouse win, 2 = cat win
        int[][][] dp = new int[n][n][2];

        // degree[mouse][cat][turn] = number of possible moves
        int[][][] degree = new int[n][n][2];

        // Initialize degrees
        for (int m = 0; m < n; m++) {
            for (int c = 0; c < n; c++) {
                // Mouse's turn
                degree[m][c][0] = graph[m].length;
                // Cat's turn: cannot move to hole (0)
                degree[m][c][1] = graph[c].length;
                for (int neighbor : graph[c]) {
                    if (neighbor == 0) {
                        degree[m][c][1]--;
                        break;
                    }
                }
            }
        }

        // Queue for BFS
        Queue<int[]> queue = new LinkedList<>();

        // Initialize terminal states
        for (int i = 1; i < n; i++) {
            // Mouse at hole
            dp[0][i][0] = dp[0][i][1] = 1;
            queue.offer(new int[]{0, i, 0, 1});
            queue.offer(new int[]{0, i, 1, 1});

            // Same position
            dp[i][i][0] = dp[i][i][1] = 2;
            queue.offer(new int[]{i, i, 0, 2});
            queue.offer(new int[]{i, i, 1, 2});
        }

        // Process queue
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int mouse = curr[0], cat = curr[1], turn = curr[2], outcome = curr[3];

            // Get predecessor states
            if (turn == 0) {
                // Previous was cat's turn
                int prevTurn = 1;
                for (int prevCat : graph[cat]) {
                    if (prevCat == 0) continue; // Cat cannot move to hole
                    processPredecessor(mouse, prevCat, prevTurn, outcome,
                                      dp, degree, queue, graph);
                }
            } else {
                // Previous was mouse's turn
                int prevTurn = 0;
                for (int prevMouse : graph[mouse]) {
                    processPredecessor(prevMouse, cat, prevTurn, outcome,
                                      dp, degree, queue, graph);
                }
            }
        }

        return dp[1][2][0]; // Initial state
    }

    private void processPredecessor(int mouse, int cat, int turn, int outcome,
                                   int[][][] dp, int[][][] degree,
                                   Queue<int[]> queue, int[][] graph) {
        // Skip if already determined
        if (dp[mouse][cat][turn] != 0) return;

        // Check if predecessor leads to losing state
        if ((turn == 0 && outcome == 2) || (turn == 1 && outcome == 1)) {
            // Current player in predecessor loses
            dp[mouse][cat][turn] = 3 - outcome; // 1->2 or 2->1
            queue.offer(new int[]{mouse, cat, turn, dp[mouse][cat][turn]});
        } else {
            // Reduce outdegree
            degree[mouse][cat][turn]--;
            if (degree[mouse][cat][turn] == 0) {
                // All moves lead to opponent win
                dp[mouse][cat][turn] = outcome;
                queue.offer(new int[]{mouse, cat, turn, dp[mouse][cat][turn]});
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³) where n is the number of nodes (n ≤ 50)

- We have O(n²) game states (mouse position × cat position)
- For each state, we process its predecessors, which requires checking all possible previous positions
- In worst case, each node has O(n) neighbors, leading to O(n³) total operations

**Space Complexity:** O(n²)

- We store the dp array of size n × n × 2 = O(n²)
- We store the degree array of same size: O(n²)
- The queue can hold up to O(n²) states in worst case

## Common Mistakes

1. **Forgetting that cat cannot enter the hole (node 0):** This is explicitly stated but easy to miss. If you allow cat to move to node 0, you'll get incorrect results because cat could "block" the hole.

2. **Incorrect turn handling in predecessor logic:** When processing a state (mouse, cat, turn, outcome), you need to correctly identify whose turn it was in the predecessor state. If current turn is 0 (mouse just moved), predecessor turn was 1 (cat's turn). Getting this backward leads to wrong propagation.

3. **Not handling the "stay put" move correctly:** Both players can choose to stay in their current position. This is implicitly handled because each node includes itself in its adjacency list when considering moves.

4. **Infinite recursion in DFS approach:** Attempting to solve with simple DFS and memoization can get stuck in cycles. The BFS/topological sort approach is necessary to handle draws correctly.

## When You'll See This Pattern

This retrograde analysis pattern appears in several game theory and combinatorial game problems:

1. **Predict the Winner (LeetCode 486):** Similar optimal play reasoning but with simpler state space (just an array).
2. **Stone Game series (LeetCode 877, 1140):** Another two-player game with optimal play, though usually solved with simpler DP.
3. **Can I Win (LeetCode 464):** Bitmask DP game where you work backwards from terminal states.
4. **Flip Game II (LeetCode 294):** Game theory problem solved with similar "if any move leads to opponent loss, current player wins" logic.

The key pattern is: when you have a finite state space for a two-player perfect information game, you can often solve it by working backwards from terminal states using BFS/DP.

## Key Takeaways

1. **Retrograde analysis is powerful for finite games:** When you can enumerate all game states, working backwards from known outcomes (wins/losses) to determine earlier states is often the cleanest approach.

2. **Degree counting handles uncertainty:** By tracking how many moves from a state are undecided, we can determine when all moves lead to opponent wins (making current state a loss) without getting stuck in cycles.

3. **Game states often need multi-dimensional DP:** Here we needed (mouse_pos, cat_pos, turn) to fully capture the game state. In interview problems, think carefully about what information is needed to make the game Markovian (future depends only on current state).

Related problems: [Cat and Mouse II](/problem/cat-and-mouse-ii)
