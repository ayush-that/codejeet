---
title: "Simulation Questions at Wells Fargo: What to Expect"
description: "Prepare for Simulation interview questions at Wells Fargo — patterns, difficulty breakdown, and study tips."
date: "2031-06-06"
category: "dsa-patterns"
tags: ["wells-fargo", "simulation", "interview prep"]
---

When you hear "simulation" in coding interviews, your mind might jump to complex game engines or physics models. In the context of Wells Fargo's technical assessments—particularly their 3 out of 24 simulation questions—it means something more precise and, frankly, more manageable. A simulation problem asks you to model a process or system step-by-step, meticulously following a set of rules or state transitions until you reach a conclusion. Think of it as writing the instruction manual for a robot: you're given the starting conditions and the rulebook, and you must output the final state or result after applying all rules in the correct order.

At Wells Fargo, simulation isn't a niche topic; it's a core filter. Why? Banking systems are built on processes—transaction clearing, risk calculation steps, batch job workflows—that are inherently sequential and rule-based. An engineer who can't precisely translate a business rule into deterministic, bug-free code is a liability. These 3 questions are your chance to demonstrate operational rigor. In live interviews, you're less likely to get a pure "simulation" problem labeled as such, but the underlying skill—methodically working through state changes—appears constantly in case studies and system design discussions about financial workflows.

## Specific Patterns Wells Fargo Favors

Wells Fargo's simulation problems tend to avoid abstract mathematical models and instead favor **grid-based agent movement** and **queue/stack-based process simulation**. They love problems where entities (like customers, transactions, or data packets) move through a system according to fixed rules.

A quintessential example is **LeetCode 994. Rotting Oranges**. You have a grid representing a box of oranges, with states for fresh, rotten, and empty. Each minute, rotten oranges infect adjacent fresh ones. Simulate until no more infections can occur or all are rotten. This directly mirrors batch processing or contagion risk models in finance.

Another common pattern is **step-by-step string or array transformation** until a terminal state is reached, similar to **LeetCode 1047. Remove All Adjacent Duplicates In String**. You process an input, apply a rule repeatedly, and return the final, stable output. This tests your ability to handle iterative refinement, a key part of data cleansing pipelines.

You will rarely see open-ended, "choose your own path" simulations. The rules are explicit, the state transitions are discrete, and the termination condition is clear. The complexity lies not in the algorithm but in the flawless execution of the steps.

## How to Prepare

The key is to separate the _simulation engine_ from the _rules_. Your engine is typically a loop (often a `while` loop) that runs until a terminal condition is met. Inside the loop, you:

1.  **Check the terminal condition.** Has the process stabilized? Have we reached a time limit?
2.  **Capture the current state snapshot.** This is critical. You must base all updates for this "turn" or "minute" on the state at the _beginning_ of the turn. Updating in-place as you go will corrupt the simulation.
3.  **Apply all rules** to the snapshot to generate the _next_ state.
4.  **Replace the current state** with the next state.

Let's look at the core engine for a grid-based propagation problem, using the Rotting Oranges pattern.

<div class="code-group">

```python
def orangesRotting(grid):
    """
    Simulates the rotting process minute by minute.
    Time: O(m * n) | Space: O(m * n)
    We might process each cell multiple times, but each cell enters the queue at most once.
    """
    from collections import deque
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes_passed = 0

    # Initialize: find all rotten oranges (minute 0 sources) and count fresh ones.
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # Directions for 4-way adjacency.
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # SIMULATION ENGINE: Run in discrete time steps (minutes).
    while queue and fresh_count > 0:
        minutes_passed += 1
        # Process all oranges that became rotten at the SAME previous minute.
        for _ in range(len(queue)):
            r, c = queue.popleft()
            # Apply rule: Infect adjacent fresh oranges.
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    # This orange rots NOW, based on the PREVIOUS state.
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

    # Terminal condition check: If any fresh oranges remain, the process failed.
    return -1 if fresh_count > 0 else minutes_passed
```

```javascript
function orangesRotting(grid) {
  // Time: O(m * n) | Space: O(m * n)
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // SIMULATION ENGINE
  while (queue.length > 0 && freshCount > 0) {
    minutes++;
    // Process all nodes at the current frontier (same minute).
    const nodesThisMinute = queue.length;
    for (let i = 0; i < nodesThisMinute; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return freshCount > 0 ? -1 : minutes;
}
```

```java
public int orangesRotting(int[][] grid) {
    // Time: O(m * n) | Space: O(m * n)
    int rows = grid.length;
    int cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                queue.offer(new int[]{r, c});
            } else if (grid[r][c] == 1) {
                freshCount++;
            }
        }
    }

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    int minutes = 0;

    // SIMULATION ENGINE
    while (!queue.isEmpty() && freshCount > 0) {
        minutes++;
        int nodesThisMinute = queue.size();
        for (int i = 0; i < nodesThisMinute; i++) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    freshCount--;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }
    return freshCount > 0 ? -1 : minutes;
}
```

</div>

For string/array process simulations, the engine is often a stack that continuously applies a rule until no more changes are possible.

<div class="code-group">

```python
def removeDuplicates(s):
    """
    Simulates repeatedly removing adjacent duplicates until stable.
    Time: O(n) | Space: O(n)
    Each character is pushed and popped at most once.
    """
    stack = []
    # The stack itself represents the current, processed state.
    for char in s:
        # Apply rule: If top of stack matches current char, remove both (pop).
        if stack and stack[-1] == char:
            stack.pop()
        else:
            stack.append(char)
    # The stack now holds the terminal, stable state.
    return ''.join(stack)
```

```javascript
function removeDuplicates(s) {
  // Time: O(n) | Space: O(n)
  const stack = [];
  for (const char of s) {
    if (stack.length > 0 && stack[stack.length - 1] === char) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack.join("");
}
```

```java
public String removeDuplicates(String s) {
    // Time: O(n) | Space: O(n)
    StringBuilder stack = new StringBuilder();
    for (char ch : s.toCharArray()) {
        int len = stack.length();
        if (len > 0 && stack.charAt(len - 1) == ch) {
            stack.deleteCharAt(len - 1);
        } else {
            stack.append(ch);
        }
    }
    return stack.toString();
}
```

</div>

## How Wells Fargo Tests Simulation vs Other Companies

Compared to FAANG companies, Wells Fargo's simulation problems are less about clever optimization and more about **correctness and completeness**. At a company like Google, a simulation might be a small part of a larger, more complex graph problem requiring an A* search. At Wells Fargo, the simulation *is\* the problem. The difficulty is "medium" in LeetCode terms, but the expectation for bug-free, clean code is higher.

What's unique is the **domain adjacency**. The problem's narrative will often feel financial: spreading updates through a network, reconciling transaction queues, or validating data through sequential rules. The underlying mechanics, however, are standard CS patterns. Don't get distracted by the banking flavor; focus on identifying the state, the rules, and the termination condition.

## Study Order

1.  **Array/String In-Place Transformation:** Start with problems that use a single array or string as the state. This teaches you to manage indices and state snapshots carefully (e.g., moving zeroes, compressing strings).
2.  **Stack/Queue-Based Process Simulation:** Learn to use these data structures as the engine for rules that involve matching or sequential processing (e.g., duplicate removal, valid parentheses). This builds intuition for LIFO/FIFO rule application.
3.  **Matrix/Grid Traversal (BFS for Propagation):** This is where most Wells Fargo simulation problems live. Master using BFS to simulate processes that spread wave-by-wave (minutes, steps, cycles). The key is processing each "wave" in its entirety before moving to the next.
4.  **State Machine Simulation:** Finally, tackle problems where each entity has a more complex state (like Conway's Game of Life). This combines grid skills with multi-rule state transition logic.

## Recommended Practice Order

Solve these problems in sequence to build the skill methodically:

1.  **LeetCode 1047. Remove All Adjacent Duplicates In String** - The simplest stack-based simulation.
2.  **LeetCode 283. Move Zeroes** - In-place array transformation; a test of careful element swapping.
3.  **LeetCode 735. Asteroid Collision** - A more complex stack simulation with multiple outcomes.
4.  **LeetCode 994. Rotting Oranges** - The classic grid BFS simulation. Do this until you can write it flawlessly.
5.  **LeetCode 289. Game of Life** - The ultimate test: applying multiple rules simultaneously based on a snapshot of the previous state.

Remember, the goal isn't speed; it's accuracy. Your code should read like a precise set of instructions. Comment your steps, name your variables clearly (`minutes_passed`, `fresh_count`), and always double-check your terminal condition. That's what will pass the Wells Fargo simulation filter.

[Practice Simulation at Wells Fargo](/company/wells-fargo/simulation)
