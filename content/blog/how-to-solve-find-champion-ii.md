---
title: "How to Solve Find Champion II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Champion II. Medium difficulty, 70.3% acceptance rate. Topics: Graph Theory."
date: "2026-11-26"
category: "dsa-patterns"
tags: ["find-champion-ii", "graph-theory", "medium"]
---

# How to Solve Find Champion II

In this problem, we're given `n` teams in a tournament where results are represented as a Directed Acyclic Graph (DAG). Each edge `[u, v]` means team `u` defeated team `v`. We need to find the champion - the team that can reach every other team through these directed victory relationships. The tricky part is that there might be zero champions (if multiple teams are unreachable from each other) or exactly one champion (if one team dominates all others).

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `n = 4` teams and edges `[[1, 0], [2, 1], [3, 1]]`.

```
Team relationships:
1 → 0  (Team 1 defeated Team 0)
2 → 1  (Team 2 defeated Team 1)
3 → 1  (Team 3 defeated Team 1)

Indirect victories:
- Team 2 defeated Team 1, and Team 1 defeated Team 0, so Team 2 indirectly defeated Team 0
- Team 3 defeated Team 1, and Team 1 defeated Team 0, so Team 3 indirectly defeated Team 0

Who can reach all other teams?
- Team 0: Can't reach anyone (no outgoing edges)
- Team 1: Can reach Team 0 only
- Team 2: Can reach Team 1 and Team 0 (through Team 1)
- Team 3: Can reach Team 1 and Team 0 (through Team 1)

Neither Team 2 nor Team 3 can reach each other, so there's no single team that can reach ALL other teams. The answer should be -1.

Now consider `n = 3` with edges `[[1, 0], [2, 0], [2, 1]]`:
```

Team relationships:
1 → 0
2 → 0
2 → 1

Indirect victories:

- Team 2 defeated both Team 0 and Team 1 directly

Who can reach all other teams?

- Team 0: Can't reach anyone
- Team 1: Can reach Team 0 only
- Team 2: Can reach both Team 0 and Team 1

Team 2 can reach every other team, so Team 2 is the champion.

````

## Brute Force Approach

A naive approach would be to perform DFS or BFS from each team to see if it can reach all other teams. For each of the `n` teams, we'd traverse the graph to find all reachable nodes, which takes O(n + m) time per team (where m is the number of edges). This gives us O(n × (n + m)) time complexity, which is O(n² + n×m). For n up to 100 (as in the problem constraints), this could be up to 10,000 operations, which might pass but is inefficient.

The brute force approach misses a key insight: In a DAG, if there's a champion, it must be the only node with no incoming edges (no one defeated it). Why? Because if a team has any incoming edges, someone defeated it, so it can't be the champion. However, the reverse isn't always true - a node with no incoming edges isn't necessarily a champion (it might not be able to reach all other nodes).

## Optimized Approach

The key insight comes from understanding tournament graphs and reachability:

1. **Observation 1**: The champion must have **zero incoming edges** (indegree = 0). If any team defeated the champion, that champion couldn't reach that team.

2. **Observation 2**: There can be **at most one champion**. If there were two teams with indegree 0, neither could reach the other (since there's no path between them in a DAG where both have no incoming edges).

3. **Observation 3**: If there's exactly one team with indegree 0, we still need to verify it can reach all other teams. But in a DAG with exactly one source (node with indegree 0), that source can reach all other nodes if and only if the graph is connected in terms of reachability from that source.

However, there's an even simpler realization: In a tournament DAG where edges represent victories:
- If a node has indegree 0, no one defeated it
- If there's exactly one such node, it must be able to reach all others (otherwise, some node would be unreachable, meaning it has no path from the source, which would make it another source with indegree 0)

So the algorithm becomes:
1. Count incoming edges (indegree) for each node
2. Find all nodes with indegree 0
3. If there's exactly one such node, it's the champion
4. Otherwise, return -1 (either 0 champions or more than 1)

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = number of teams, m = number of edges
# Space: O(n) for the indegree array
def findChampion(n, edges):
    """
    Find the champion team in a tournament DAG.

    Args:
        n: Number of teams (0 to n-1)
        edges: List of [winner, loser] pairs

    Returns:
        The champion team index or -1 if no champion exists
    """
    # Step 1: Initialize indegree array for all teams
    # indegree[i] = number of teams that defeated team i
    indegree = [0] * n

    # Step 2: Process each edge to count incoming edges
    # For edge [u, v], team u defeated team v, so v has an incoming edge
    for u, v in edges:
        indegree[v] += 1

    # Step 3: Find teams with indegree 0 (no one defeated them)
    champions = []
    for team in range(n):
        if indegree[team] == 0:
            champions.append(team)

    # Step 4: Check if we have exactly one champion
    # If there's more than one, they can't reach each other
    # If there's none, something is wrong with the input (shouldn't happen in valid DAG)
    if len(champions) == 1:
        return champions[0]
    else:
        return -1
````

```javascript
// Time: O(n + m) where n = number of teams, m = number of edges
// Space: O(n) for the indegree array
function findChampion(n, edges) {
  /**
   * Find the champion team in a tournament DAG.
   *
   * @param {number} n - Number of teams (0 to n-1)
   * @param {number[][]} edges - Array of [winner, loser] pairs
   * @return {number} The champion team index or -1 if no champion exists
   */

  // Step 1: Initialize indegree array for all teams
  // indegree[i] = number of teams that defeated team i
  const indegree = new Array(n).fill(0);

  // Step 2: Process each edge to count incoming edges
  // For edge [u, v], team u defeated team v, so v has an incoming edge
  for (const [u, v] of edges) {
    indegree[v] += 1;
  }

  // Step 3: Find teams with indegree 0 (no one defeated them)
  const champions = [];
  for (let team = 0; team < n; team++) {
    if (indegree[team] === 0) {
      champions.push(team);
    }
  }

  // Step 4: Check if we have exactly one champion
  // If there's more than one, they can't reach each other
  // If there's none, something is wrong with the input (shouldn't happen in valid DAG)
  if (champions.length === 1) {
    return champions[0];
  } else {
    return -1;
  }
}
```

```java
// Time: O(n + m) where n = number of teams, m = number of edges
// Space: O(n) for the indegree array
class Solution {
    public int findChampion(int n, int[][] edges) {
        /**
         * Find the champion team in a tournament DAG.
         *
         * @param n Number of teams (0 to n-1)
         * @param edges Array of [winner, loser] pairs
         * @return The champion team index or -1 if no champion exists
         */

        // Step 1: Initialize indegree array for all teams
        // indegree[i] = number of teams that defeated team i
        int[] indegree = new int[n];

        // Step 2: Process each edge to count incoming edges
        // For edge [u, v], team u defeated team v, so v has an incoming edge
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            indegree[v] += 1;
        }

        // Step 3: Find teams with indegree 0 (no one defeated them)
        int champion = -1;
        int championCount = 0;

        for (int team = 0; team < n; team++) {
            if (indegree[team] == 0) {
                champion = team;
                championCount++;
            }
        }

        // Step 4: Check if we have exactly one champion
        // If there's more than one, they can't reach each other
        // If there's none, something is wrong with the input (shouldn't happen in valid DAG)
        if (championCount == 1) {
            return champion;
        } else {
            return -1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We iterate through all `n` teams to initialize and check the indegree array: O(n)
- We iterate through all `m` edges to count indegrees: O(m)
- Total: O(n + m)

**Space Complexity: O(n)**

- We store an indegree array of size `n`: O(n)
- The champions list in Python/JavaScript could store up to `n` elements in worst case, but we could optimize to use a counter instead (as shown in Java version)

## Common Mistakes

1. **Not handling the "no champion" case correctly**: Some candidates return the first node with indegree 0 without checking if there are multiple such nodes. Remember: if there are two or more nodes with indegree 0, neither can reach the other, so there's no champion.

2. **Confusing edge direction**: The problem states `edges[i] = [ui, vi]` indicates a directed edge from team `ui` to team `vi` (ui defeated vi). Some candidates mistakenly interpret this as vi defeating ui, which leads to incorrect results.

3. **Forgetting about isolated nodes**: When n > number of connected nodes, we still need to consider all teams 0 to n-1. A team with no edges (neither incoming nor outgoing) has indegree 0, so it would be a candidate champion (but can't reach anyone, so there would be multiple indegree-0 nodes).

4. **Overcomplicating with DFS/BFS**: The optimal solution doesn't require graph traversal. The indegree counting approach is sufficient and more efficient. Candidates who jump to DFS/BFS without considering the properties of the problem often write more complex code than needed.

## When You'll See This Pattern

This problem uses **indegree counting** to find source nodes in a DAG, a common pattern in graph problems:

1. **Course Schedule (LeetCode 207)**: Uses indegree counting (Kahn's algorithm) for topological sorting to detect cycles in course prerequisites.

2. **Find the Town Judge (LeetCode 997)**: Similar indegree/outdegree counting problem where the judge must be trusted by everyone and trust no one.

3. **Minimum Height Trees (LeetCode 310)**: Uses a similar "peeling" approach by repeatedly removing leaf nodes (nodes with degree 1).

The key insight is recognizing when local information (indegree count) gives you global information about the graph structure without needing full traversal.

## Key Takeaways

1. **In a tournament DAG, the champion must have indegree 0**: No one defeated the champion. This is a crucial property that simplifies the problem from O(n²) to O(n + m).

2. **At most one node can have indegree 0 in a champion scenario**: If two nodes have indegree 0, they can't reach each other, so neither is a champion. This means we just need to count how many nodes have indegree 0.

3. **Sometimes the simplest solution is the best**: Don't overengineer with graph traversal when basic counting gives you the answer. Always look for mathematical properties or invariants that simplify the problem.

[Practice this problem on CodeJeet](/problem/find-champion-ii)
