---
title: "Goldman Sachs vs LinkedIn: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and LinkedIn — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-07"
category: "tips"
tags: ["goldman-sachs", "linkedin", "comparison"]
---

When preparing for technical interviews at top tech companies, understanding the specific patterns and expectations of each employer is crucial. Goldman Sachs and LinkedIn, while both prestigious, present distinct interview landscapes. Goldman Sachs, a leading investment bank, emphasizes algorithmic problem-solving with a strong quantitative bent, reflecting its financial engineering roots. LinkedIn, as a major social networking and professional development platform, focuses on data structures and algorithms relevant to scalable systems and user features. This comparison breaks down their question volume, difficulty, and core topics to help you prioritize your study.

## Question Volume and Difficulty

Goldman Sachs maintains a larger overall question bank with approximately 270 questions, categorized by difficulty as Easy (51), Medium (171), and Hard (48). This volume indicates a broad and deep pool of problems, with a pronounced emphasis on Medium-difficulty challenges. The distribution suggests you must build strong, consistent problem-solving skills across a wide range of scenarios, with a significant portion of the interview likely dedicated to moderately complex algorithmic thinking.

LinkedIn's question bank is smaller, with about 180 total questions: 26 Easy, 117 Medium, and 37 Hard. The focus is similarly centered on Medium-difficulty problems, but the overall lower volume might imply a slightly more concentrated set of core concepts. However, the reduced count does not equate to easier interviews; it often means the problems are well-known and highly curated, requiring precise and optimal solutions.

**Key Takeaway:** Both firms center on Medium-difficulty questions. Goldman's larger bank demands broader exposure, while LinkedIn's requires deep mastery of a more focused set.

## Topic Overlap

Both companies heavily test **Array**, **String**, and **Hash Table** manipulations. These are fundamental building blocks for data processing and are ubiquitous in technical interviews.

The primary divergence is in their secondary focus areas. Goldman Sachs prominently features **Dynamic Programming (DP)**. This aligns with its need for optimization, quantitative modeling, and solving complex, overlapping subproblems—skills directly transferable to financial analysis and risk computation.

LinkedIn, conversely, emphasizes **Depth-First Search (DFS)**. This reflects its domain in social graphs, network traversal, hierarchy processing (e.g., organizational charts), and tree-based data structures common in backend systems.

<div class="code-group">

```python
# Goldman Sachs Focus: Dynamic Programming (Fibonacci)
def fib_dp(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```javascript
// Goldman Sachs Focus: Dynamic Programming (Fibonacci)
function fibDP(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

```java
// Goldman Sachs Focus: Dynamic Programming (Fibonacci)
public int fibDP(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

</div>

<div class="code-group">

```python
# LinkedIn Focus: Depth-First Search (Graph Traversal)
def dfs(graph, node, visited):
    if node not in visited:
        visited.add(node)
        for neighbor in graph[node]:
            dfs(graph, neighbor, visited)
```

```javascript
// LinkedIn Focus: Depth-First Search (Graph Traversal)
function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  for (const neighbor of graph[node]) {
    dfs(graph, neighbor, visited);
  }
}
```

```java
// LinkedIn Focus: Depth-First Search (Graph Traversal)
public void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    if (visited.contains(node)) return;
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        dfs(graph, neighbor, visited);
    }
}
```

</div>

## Which to Prepare for First

Start with the **shared foundation**. Master Array, String, and Hash Table problems to a Medium level of proficiency. This core competency serves both companies equally.

If your goal is to interview at **both**, prepare for **Goldman Sachs first**. Its larger question bank and the inclusion of Dynamic Programming make it the more comprehensive study plan. Mastering DP is generally considered more challenging and time-intensive than mastering DFS. Once you are comfortable with DP problems and a wide array of Medium challenges, adapting to LinkedIn's focus on DFS and graph traversal will be a more manageable task. LinkedIn's focused set will then feel like a targeted review of specific patterns.

If you are only targeting one company, tailor your deep dive accordingly: drill into DP and a wide variety of Medium problems for Goldman Sachs; for LinkedIn, prioritize graph theory, DFS/BFS, tree problems, and the curated Medium list.

For targeted practice, visit the [Goldman Sachs question list](/company/goldman-sachs) and the [LinkedIn question list](/company/linkedin) on CodeJeet.
