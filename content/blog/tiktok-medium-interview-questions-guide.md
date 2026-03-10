---
title: "Medium TikTok Interview Questions: Strategy Guide"
description: "How to tackle 260 medium difficulty questions from TikTok — patterns, time targets, and practice tips."
date: "2032-01-06"
category: "tips"
tags: ["tiktok", "medium", "interview prep"]
---

TikTok’s interview process is known for its heavy emphasis on algorithmic problem-solving, with a particular focus on **Medium** difficulty questions. Out of their 383 total problems, 260 are rated Medium—that’s about 68% of their question bank. This isn’t an accident. Medium questions are the sweet spot where interviewers can assess both your foundational coding skills and your ability to handle non-trivial logic, optimization, and design decisions under pressure. Unlike Easy questions, which often test a single concept, and Hard questions, which may require esoteric algorithms, Medium problems at TikTok typically blend **two or more core patterns** and demand clean, efficient implementations. They’re designed to see if you can move beyond brute force and articulate trade-offs.

## Common Patterns and Templates

TikTok’s Medium problems frequently revolve around **arrays/strings, trees, and graphs**, with a strong preference for problems that involve **sliding windows, two pointers, BFS/DFS, and dynamic programming**. A recurring theme is the need to track state or relationships while traversing data. One of the most common patterns you’ll encounter is the **sliding window with a hash map for counting**, used in problems like "Longest Substring Without Repeating Characters" (#3) or "Permutation in String" (#567). Here’s a reusable template for that pattern:

<div class="code-group">

```python
def sliding_window_template(s: str, t: str) -> int:
    # Time: O(n) | Space: O(k) where k is the size of the character set
    from collections import defaultdict

    need = defaultdict(int)
    for ch in t:
        need[ch] += 1

    left = 0
    missing = len(t)  # or another condition
    result = 0

    for right, ch in enumerate(s):
        # Expand window: update state for s[right]
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        # Shrink window while condition is met
        while missing == 0:  # or another condition
            # Update result
            result = max(result, right - left + 1)

            # Update state for s[left]
            if need[s[left]] == 0:
                missing += 1
            need[s[left]] += 1
            left += 1

    return result
```

```javascript
function slidingWindowTemplate(s, t) {
  // Time: O(n) | Space: O(k)
  const need = new Map();
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  let left = 0;
  let missing = t.length;
  let result = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // Expand
    if ((need.get(ch) || 0) > 0) {
      missing--;
    }
    need.set(ch, (need.get(ch) || 0) - 1);

    // Shrink
    while (missing === 0) {
      result = Math.max(result, right - left + 1);

      const leftChar = s[left];
      if (need.get(leftChar) === 0) {
        missing++;
      }
      need.set(leftChar, (need.get(leftChar) || 0) + 1);
      left++;
    }
  }

  return result;
}
```

```java
public int slidingWindowTemplate(String s, String t) {
    // Time: O(n) | Space: O(k)
    Map<Character, Integer> need = new HashMap<>();
    for (char ch : t.toCharArray()) {
        need.put(ch, need.getOrDefault(ch, 0) + 1);
    }

    int left = 0, missing = t.length(), result = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        // Expand
        if (need.getOrDefault(ch, 0) > 0) {
            missing--;
        }
        need.put(ch, need.getOrDefault(ch, 0) - 1);

        // Shrink
        while (missing == 0) {
            result = Math.max(result, right - left + 1);

            char leftChar = s.charAt(left);
            if (need.get(leftChar) == 0) {
                missing++;
            }
            need.put(leftChar, need.getOrDefault(leftChar, 0) + 1);
            left++;
        }
    }

    return result;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at TikTok, you should aim to **reach a working optimal solution within 20-25 minutes**, leaving time for discussion, edge cases, and a follow-up if given. However, speed isn’t the only metric. Interviewers are evaluating:

1. **Code quality and readability**: Use meaningful variable names, avoid magic numbers, and structure your code with clear sections (initialization, main loop, return).
2. **Edge case handling**: Explicitly mention and test for empty inputs, single-element cases, duplicates, and overflow. Verbally walk through these before coding.
3. **Communication of trade-offs**: Explain why you chose a particular data structure (e.g., HashMap for O(1) lookups) and the time/space complexity of your approach.
4. **Optimization journey**: It’s acceptable to start with a brute force idea, but you must quickly identify bottlenecks and improve them. Interviewers want to see your thought process, not just a memorized solution.

## Key Differences from Easy Problems

Easy problems often test a single concept (e.g., a linear scan, a basic hash set). Medium problems require you to **combine techniques** and manage **multiple moving parts**. For example:

- **Easy**: "Two Sum" (#1) uses a hash map for lookups.
- **Medium**: "3Sum" (#15) builds on "Two Sum" but adds sorting, skipping duplicates, and a nested loop with two pointers.

The mindset shift is from **"what’s the obvious step?"** to **"how do I maintain invariants while traversing?"** You’ll need to track additional state (counters, pointers, stacks) and often use **preprocessing** like sorting or building frequency maps. The leap is in handling **conditional window shrinking, recursive tree traversals with side effects, or DP state transitions** without getting lost in implementation details.

## Specific Patterns for Medium

Beyond sliding windows, two other patterns are especially prevalent in TikTok’s Medium set:

**1. BFS for shortest path in unweighted graphs**  
Used in problems like "Word Ladder" (#127) or "Rotting Oranges" (#994). The key is using a queue to process levels, marking visited nodes to avoid cycles, and tracking distance.

**2. DFS with backtracking**  
Common in permutation/combination problems ("Subsets" #78, "Palindrome Partitioning" #131). You recursively build candidates, prune invalid paths, and backtrack by removing the last added element.

Here’s a concise BFS template for grid shortest path problems:

<div class="code-group">

```python
from collections import deque

def bfs_grid_shortest_path(grid):
    # Time: O(m*n) | Space: O(m*n)
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0),(-1,0),(0,1),(0,-1)]
    queue = deque([(0,0)])  # start point
    visited = set([(0,0)])
    distance = 0

    while queue:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            if (r, c) == (rows-1, cols-1):  # destination
                return distance

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc))
        distance += 1

    return -1
```

```javascript
function bfsGridShortestPath(grid) {
  // Time: O(m*n) | Space: O(m*n)
  if (!grid || !grid.length || !grid[0].length) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[0, 0]];
  const visited = new Set(["0,0"]);
  let distance = 0;

  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();
      if (r === rows - 1 && c === cols - 1) return distance;

      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        const key = `${nr},${nc}`;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          grid[nr][nc] === 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    distance++;
  }

  return -1;
}
```

```java
public int bfsGridShortestPath(int[][] grid) {
    // Time: O(m*n) | Space: O(m*n)
    if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

    int rows = grid.length, cols = grid[0].length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0,0});
    boolean[][] visited = new boolean[rows][cols];
    visited[0][0] = true;
    int distance = 0;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];
            if (r == rows-1 && c == cols-1) return distance;

            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
        distance++;
    }

    return -1;
}
```

</div>

## Practice Strategy

Don’t just solve randomly. Focus on **pattern-based practice**:

1. **Start with the core patterns**: Dedicate weeks to sliding window, BFS/DFS, and DP. Solve 10-15 problems of each pattern from TikTok’s Medium list.
2. **Mix in related topics**: After mastering a pattern, combine it with related topics (e.g., sliding window with hashing, BFS with bi-directional search).
3. **Daily targets**: Aim for **2-3 Medium problems per day**, with at least one being a TikTok problem. Spend no more than 30 minutes per problem before looking at solutions if stuck—but analyze the solution thoroughly.
4. **Mock interviews**: Once a week, simulate a real interview: 30 minutes to solve a unseen TikTok Medium problem while explaining your thoughts aloud.
5. **Review mistakes**: Keep a log of errors (off-by-one, missed edge cases) and revisit them weekly.

The goal is to build **muscle memory for patterns** so you can recognize them quickly and focus on the unique twist each problem presents.

[Practice Medium TikTok questions](/company/tiktok/medium)
