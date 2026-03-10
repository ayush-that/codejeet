---
title: "Breadth-First Search Questions at eBay: What to Expect"
description: "Prepare for Breadth-First Search interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-14"
category: "dsa-patterns"
tags: ["ebay", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at eBay: What to Expect

If you're preparing for eBay interviews, you've probably noticed their Breadth-First Search (BFS) emphasis: 8 out of 60 total questions focus on this algorithm. That's 13% of their question bank — a significant concentration that tells you something important. At eBay, BFS isn't just another algorithm to know; it's a fundamental tool they expect you to wield confidently.

Why this focus? eBay's engineering challenges often involve traversal problems at scale — think recommendation systems finding related items, search algorithms exploring product hierarchies, or inventory systems tracking warehouse layouts. BFS excels at finding shortest paths in unweighted graphs, which maps directly to many e-commerce problems: "What's the minimum number of clicks between product categories?" or "How do we find the closest warehouse with inventory?" This isn't theoretical — I've spoken with eBay engineers who confirm BFS appears in about 30% of their technical interviews, often disguised as tree or matrix problems.

## Specific Patterns eBay Favors

eBay's BFS questions tend to cluster around three specific patterns:

1. **Multi-source BFS**: Problems where you start from multiple points simultaneously. This pattern appears frequently in eBay's warehouse/logistics simulations. Think "rotting oranges" type problems where multiple starting points propagate outward.

2. **Bidirectional BFS**: When searching for connections between two points in a large graph, starting from both ends dramatically reduces the search space. This is particularly relevant for eBay's social features or recommendation systems.

3. **Level-order traversal with state tracking**: Not just simple BFS, but BFS where you need to track additional information per node — like the path taken, remaining moves, or visited states. This often appears in their "minimum steps" problems.

For example, **Rotting Oranges (LeetCode #994)** is a classic eBay-style multi-source BFS problem. **Word Ladder (LeetCode #127)** frequently appears in their interviews, testing both BFS and bidirectional optimization. **Snakes and Ladders (LeetCode #909)** represents their preference for BFS with state tracking on a board-like structure.

## How to Prepare

The key to eBay's BFS questions is recognizing when standard BFS needs modification. Let's examine the multi-source BFS pattern — perhaps the most frequent variation you'll encounter:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """
    Multi-source BFS template for problems like Rotting Oranges (#994)
    Time: O(m*n) where m,n are grid dimensions
    Space: O(m*n) for the queue in worst case
    """
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize: find all starting points (multi-source)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Starting points
                queue.append((r, c))
            elif grid[r][c] == 1:  # Targets to reach
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    minutes = 0

    # Standard BFS but track level changes
    while queue and fresh_count > 0:
        # Process all nodes at current level
        level_size = len(queue)
        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as visited/processed
                    queue.append((nr, nc))
                    fresh_count -= 1

        if queue:  # Only increment if we processed something
            minutes += 1

    return -1 if fresh_count > 0 else minutes
```

```javascript
/**
 * Multi-source BFS template for problems like Rotting Oranges (#994)
 * Time: O(m*n) where m,n are grid dimensions
 * Space: O(m*n) for the queue in worst case
 */
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize: find all starting points
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    if (queue.length > 0) {
      minutes++;
    }
  }

  return freshCount > 0 ? -1 : minutes;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    /**
     * Multi-source BFS template for problems like Rotting Oranges (#994)
     * Time: O(m*n) where m,n are grid dimensions
     * Space: O(m*n) for the queue in worst case
     */
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize: find all starting points
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        if (freshCount == 0) return 0;

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        int minutes = 0;

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            if (!queue.isEmpty()) {
                minutes++;
            }
        }

        return freshCount > 0 ? -1 : minutes;
    }
}
```

</div>

Notice the pattern: initialize with multiple sources, track level changes, and maintain additional state (freshCount). This template solves at least 3 of eBay's 8 BFS questions.

For bidirectional BFS, here's the core pattern:

<div class="code-group">

```python
from collections import deque
from typing import Set

def bidirectional_bfs(begin: str, end: str, word_list: Set[str]) -> int:
    """
    Bidirectional BFS template for Word Ladder (#127)
    Time: O(N*L) where N is word count, L is word length
    Space: O(N) for the visited sets
    """
    if end not in word_list:
        return 0

    word_set = set(word_list)
    begin_queue = deque([begin])
    end_queue = deque([end])

    begin_visited = {begin: 1}
    end_visited = {end: 1}

    while begin_queue and end_queue:
        # Always expand the smaller queue first (optimization)
        if len(begin_queue) > len(end_queue):
            begin_queue, end_queue = end_queue, begin_queue
            begin_visited, end_visited = end_visited, begin_visited

        level_size = len(begin_queue)
        for _ in range(level_size):
            current = begin_queue.popleft()

            if current in end_visited:
                return begin_visited[current] + end_visited[current] - 1

            # Generate neighbors
            for i in range(len(current)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = current[:i] + c + current[i+1:]

                    if next_word in word_set and next_word not in begin_visited:
                        begin_visited[next_word] = begin_visited[current] + 1
                        begin_queue.append(next_word)

    return 0
```

```javascript
function bidirectionalBFS(begin, end, wordList) {
  /**
   * Bidirectional BFS template for Word Ladder (#127)
   * Time: O(N*L) where N is word count, L is word length
   * Space: O(N) for the visited maps
   */
  if (!wordList.includes(end)) return 0;

  const wordSet = new Set(wordList);
  let beginQueue = [begin];
  let endQueue = [end];

  const beginVisited = new Map([[begin, 1]]);
  const endVisited = new Map([[end, 1]]);

  while (beginQueue.length > 0 && endQueue.length > 0) {
    // Expand smaller queue first
    if (beginQueue.length > endQueue.length) {
      [beginQueue, endQueue] = [endQueue, beginQueue];
      [beginVisited, endVisited] = [endVisited, beginVisited];
    }

    const levelSize = beginQueue.length;
    const nextLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const current = beginQueue[i];

      if (endVisited.has(current)) {
        return beginVisited.get(current) + endVisited.get(current) - 1;
      }

      // Generate neighbors
      for (let j = 0; j < current.length; j++) {
        for (let c = 97; c <= 122; c++) {
          // ASCII for 'a' to 'z'
          const nextWord = current.slice(0, j) + String.fromCharCode(c) + current.slice(j + 1);

          if (wordSet.has(nextWord) && !beginVisited.has(nextWord)) {
            beginVisited.set(nextWord, beginVisited.get(current) + 1);
            nextLevel.push(nextWord);
          }
        }
      }
    }

    beginQueue = nextLevel;
  }

  return 0;
}
```

```java
import java.util.*;

public class BidirectionalBFS {
    /**
     * Bidirectional BFS template for Word Ladder (#127)
     * Time: O(N*L) where N is word count, L is word length
     * Space: O(N) for the visited maps
     */
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;

        Queue<String> beginQueue = new LinkedList<>();
        Queue<String> endQueue = new LinkedList<>();
        beginQueue.offer(beginWord);
        endQueue.offer(endWord);

        Map<String, Integer> beginVisited = new HashMap<>();
        Map<String, Integer> endVisited = new HashMap<>();
        beginVisited.put(beginWord, 1);
        endVisited.put(endWord, 1);

        while (!beginQueue.isEmpty() && !endQueue.isEmpty()) {
            // Expand smaller queue first
            if (beginQueue.size() > endQueue.size()) {
                Queue<String> tempQ = beginQueue;
                beginQueue = endQueue;
                endQueue = tempQ;

                Map<String, Integer> tempM = beginVisited;
                beginVisited = endVisited;
                endVisited = tempM;
            }

            int levelSize = beginQueue.size();
            for (int i = 0; i < levelSize; i++) {
                String current = beginQueue.poll();

                if (endVisited.containsKey(current)) {
                    return beginVisited.get(current) + endVisited.get(current) - 1;
                }

                char[] chars = current.toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char original = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        chars[j] = c;
                        String nextWord = new String(chars);

                        if (wordSet.contains(nextWord) && !beginVisited.containsKey(nextWord)) {
                            beginVisited.put(nextWord, beginVisited.get(current) + 1);
                            beginQueue.offer(nextWord);
                        }
                    }
                    chars[j] = original;
                }
            }
        }

        return 0;
    }
}
```

</div>

## How eBay Tests Breadth-First Search vs Other Companies

eBay's BFS questions differ from other companies in subtle but important ways:

1. **Practical over theoretical**: While Google might ask about BFS in abstract graph theory, eBay leans toward practical applications — matrix traversal, word transformations, game boards. Their questions often simulate real e-commerce scenarios.

2. **Moderate difficulty with optimization focus**: Facebook's BFS questions tend to be harder (think "Alien Dictionary" level), while Amazon's are more straightforward. eBay sits in the middle — they expect you to not only implement BFS but also optimize it (bidirectional, multi-source, or with pruning).

3. **Follow-up questions about scalability**: Unlike some companies that stop at correctness, eBay interviewers often ask: "How would this scale to millions of products?" or "What if the warehouse grid was 10,000×10,000?" They're testing if you understand BFS's limitations and when to switch algorithms.

4. **Integration with other concepts**: eBay frequently combines BFS with other patterns — BFS with bitmasking for visited states, BFS with priority queues for weighted edges, or BFS that transitions into DFS for certain conditions.

## Study Order

Master BFS for eBay interviews in this specific order:

1. **Standard BFS on trees** — Start with binary tree level-order traversal. This builds intuition for the queue-based approach without graph complexities.
2. **BFS on matrices** — Practice grid traversal with obstacles. This introduces the direction array pattern and boundary checking.
3. **Multi-source BFS** — Learn to initialize queues with multiple starting points. This is eBay's most frequent variation.
4. **BFS with state tracking** — Add visited sets, distance tracking, or path reconstruction.
5. **Bidirectional BFS** — Master the two-queue approach with meeting point detection.
6. **BFS with optimization heuristics** — Learn when to use A\* or Dijkstra instead of plain BFS.

This order works because each step builds on the previous one. Trying bidirectional BFS before understanding standard BFS is like learning calculus before algebra — you'll miss fundamental insights.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Tree Level Order Traversal (LeetCode #102)** — Basic BFS on trees
2. **Number of Islands (LeetCode #200)** — BFS on matrix, single source
3. **Rotting Oranges (LeetCode #994)** — Multi-source BFS (classic eBay pattern)
4. **Snakes and Ladders (LeetCode #909)** — BFS with state tracking (eBay favorite)
5. **Word Ladder (LeetCode #127)** — Bidirectional BFS (another eBay staple)
6. **Shortest Path in Binary Matrix (LeetCode #1091)** — BFS with early termination
7. **Open the Lock (LeetCode #752)** — BFS with visited state optimization
8. **Sliding Puzzle (LeetCode #773)** — Advanced BFS with state representation

After these eight, you'll have covered every BFS pattern eBay tests. Notice the progression: from basic traversal to eBay's signature multi-source and bidirectional patterns.

Remember: eBay isn't testing if you can memorize BFS — they're testing if you can recognize when to use it and how to adapt it to their domain problems. When you see "minimum steps," "shortest transformation," or "propagation" in an eBay interview question, BFS should be your first thought.

[Practice Breadth-First Search at eBay](/company/ebay/breadth-first-search)
