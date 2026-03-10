---
title: "How to Solve Find All People With Secret — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find All People With Secret. Hard difficulty, 48.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory, Sorting."
date: "2026-06-24"
category: "dsa-patterns"
tags:
  [
    "find-all-people-with-secret",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "hard",
  ]
---

# How to Solve "Find All People With Secret"

This problem asks us to track how a secret spreads through meetings over time. We start with person 0 knowing the secret, and whenever two people meet and at least one knows the secret, both learn it. The challenge is that meetings happen at specific times, and the secret can only spread forward in time—people can't learn secrets retroactively from future meetings. This temporal constraint combined with the graph structure makes this problem interesting and challenging.

## Visual Walkthrough

Let's trace through a small example: `n = 5`, `meetings = [[0,2,1],[1,3,2],[2,3,3],[4,0,4]]`

**Initial state (time 0):** Person 0 knows the secret → `{0}`

**Time 1:** Meeting between 0 and 2

- Person 0 knows the secret, so person 2 learns it
- Result: `{0, 2}`

**Time 2:** Meeting between 1 and 3

- Neither knows the secret (0 and 2 know, but 1 and 3 don't)
- Result: `{0, 2}` (unchanged)

**Time 3:** Meeting between 2 and 3

- Person 2 knows the secret, so person 3 learns it
- Result: `{0, 2, 3}`

**Time 4:** Meeting between 4 and 0

- Person 0 knows the secret, so person 4 learns it
- Result: `{0, 2, 3, 4}`

Notice something important: person 1 never learns the secret because their only meeting was at time 2 with person 3, who didn't know the secret yet. Person 3 only learned at time 3, which was too late for the time 2 meeting.

The key insight is that we need to process meetings **in chronological order**, but also handle all meetings at the same time together because the secret can spread through multiple connections simultaneously within the same time slot.

## Brute Force Approach

A naive approach might be to simulate time step by step:

1. Sort meetings by time
2. For each time from earliest to latest:
   - Process all meetings at that time
   - If either participant knows the secret, mark both as knowing
   - Repeat until no new people learn at that time

The problem with this approach is the "repeat until no new people learn" part. Consider a chain of meetings at the same time: `0-1`, `1-2`, `2-3`. If we process them in order:

- First `0-1`: 0 knows, so 1 learns
- Then `1-2`: 1 now knows, so 2 learns
- Then `2-3`: 2 now knows, so 3 learns

But if we process them in the wrong order (`2-3`, `1-2`, `0-1`), we might miss that 3 should learn. We could fix this by repeatedly processing all meetings at the same time until no changes occur, but in the worst case (a complete graph), this could take O(m²) time where m is the number of meetings at that time.

Even worse, if we have many time steps, this becomes extremely inefficient. The brute force would have time complexity of approximately O(T × M) where T is the number of unique times and M is total meetings, which could be O(n² × m) in worst case.

## Optimized Approach

The key insight is to use **Union-Find (Disjoint Set Union)** with a time-aware reset mechanism. Here's the step-by-step reasoning:

1. **Sort meetings by time** - We must process meetings chronologically
2. **Group meetings by time** - All meetings at the same time must be processed together
3. **Use Union-Find to connect people** - When people meet, we union them into the same group
4. **Reset unions that don't contain secret-knowers** - After processing all meetings at a time, if a connected component doesn't contain anyone who knows the secret, we need to reset those people to be independent again (because they shouldn't remain connected for future times)

Why Union-Find? Because it efficiently:

- Connects people who meet (union operation)
- Lets us check if a component contains a secret-knower (find operation)
- Allows us to reset components that don't have the secret

The clever part is the reset mechanism. After processing all meetings at time t:

1. For each person involved in meetings at time t, check if their component has someone who knows the secret
2. If not, reset that person to be in their own singleton component
3. This ensures that connections don't persist incorrectly across time boundaries

## Optimal Solution

Here's the complete solution using Union-Find with time-based processing:

<div class="code-group">

```python
# Time: O(m log m + m × α(n)) where m is number of meetings, α is inverse Ackermann
# Space: O(n + m) for storing people and meetings grouped by time
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

    def reset(self, x):
        # Reset person x to be in its own component
        self.parent[x] = x
        self.rank[x] = 0

class Solution:
    def findAllPeople(self, n: int, meetings: List[List[int]], firstPerson: int) -> List[int]:
        # Person 0 and firstPerson initially know the secret
        knows_secret = [False] * n
        knows_secret[0] = True
        knows_secret[firstPerson] = True

        # Sort meetings by time
        meetings.sort(key=lambda x: x[2])

        uf = UnionFind(n)
        # Initially connect 0 and firstPerson since both know the secret
        uf.union(0, firstPerson)

        m = len(meetings)
        i = 0

        while i < m:
            # Get all meetings at the current time
            current_time = meetings[i][2]
            current_meetings = []

            # Collect all meetings at this time
            while i < m and meetings[i][2] == current_time:
                x, y, _ = meetings[i]
                current_meetings.append((x, y))
                # Union the people who are meeting
                uf.union(x, y)
                i += 1

            # Check which components have secret knowers
            secret_components = set()
            for x, y in current_meetings:
                if knows_secret[x] or knows_secret[y]:
                    # Find the root of components that have secret knowers
                    root = uf.find(x)
                    secret_components.add(root)

            # For each person in current meetings, check if their component has secret
            people_in_current_meetings = set()
            for x, y in current_meetings:
                people_in_current_meetings.add(x)
                people_in_current_meetings.add(y)

                root_x = uf.find(x)
                if root_x in secret_components:
                    # This component has secret, so mark all in component
                    knows_secret[x] = True
                    knows_secret[y] = True

            # Reset people whose components don't have secret
            for person in people_in_current_meetings:
                if not knows_secret[person]:
                    uf.reset(person)

        # Collect all people who know the secret
        result = [i for i in range(n) if knows_secret[i]]
        return result
```

```javascript
// Time: O(m log m + m × α(n)) where m is number of meetings, α is inverse Ackermann
// Space: O(n + m) for storing people and meetings grouped by time
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }

  reset(x) {
    // Reset person x to be in its own component
    this.parent[x] = x;
    this.rank[x] = 0;
  }
}

/**
 * @param {number} n
 * @param {number[][]} meetings
 * @param {number} firstPerson
 * @return {number[]}
 */
var findAllPeople = function (n, meetings, firstPerson) {
  // Person 0 and firstPerson initially know the secret
  const knowsSecret = new Array(n).fill(false);
  knowsSecret[0] = true;
  knowsSecret[firstPerson] = true;

  // Sort meetings by time
  meetings.sort((a, b) => a[2] - b[2]);

  const uf = new UnionFind(n);
  // Initially connect 0 and firstPerson since both know the secret
  uf.union(0, firstPerson);

  let i = 0;
  const m = meetings.length;

  while (i < m) {
    // Get all meetings at the current time
    const currentTime = meetings[i][2];
    const currentMeetings = [];

    // Collect all meetings at this time
    while (i < m && meetings[i][2] === currentTime) {
      const [x, y] = meetings[i];
      currentMeetings.push([x, y]);
      // Union the people who are meeting
      uf.union(x, y);
      i++;
    }

    // Check which components have secret knowers
    const secretComponents = new Set();
    for (const [x, y] of currentMeetings) {
      if (knowsSecret[x] || knowsSecret[y]) {
        // Find the root of components that have secret knowers
        const root = uf.find(x);
        secretComponents.add(root);
      }
    }

    // For each person in current meetings, check if their component has secret
    const peopleInCurrentMeetings = new Set();
    for (const [x, y] of currentMeetings) {
      peopleInCurrentMeetings.add(x);
      peopleInCurrentMeetings.add(y);

      const rootX = uf.find(x);
      if (secretComponents.has(rootX)) {
        // This component has secret, so mark all in component
        knowsSecret[x] = true;
        knowsSecret[y] = true;
      }
    }

    // Reset people whose components don't have secret
    for (const person of peopleInCurrentMeetings) {
      if (!knowsSecret[person]) {
        uf.reset(person);
      }
    }
  }

  // Collect all people who know the secret
  const result = [];
  for (let i = 0; i < n; i++) {
    if (knowsSecret[i]) {
      result.push(i);
    }
  }
  return result;
};
```

```java
// Time: O(m log m + m × α(n)) where m is number of meetings, α is inverse Ackermann
// Space: O(n + m) for storing people and meetings grouped by time
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }

    public void reset(int x) {
        // Reset person x to be in its own component
        parent[x] = x;
        rank[x] = 0;
    }
}

class Solution {
    public List<Integer> findAllPeople(int n, int[][] meetings, int firstPerson) {
        // Person 0 and firstPerson initially know the secret
        boolean[] knowsSecret = new boolean[n];
        knowsSecret[0] = true;
        knowsSecret[firstPerson] = true;

        // Sort meetings by time
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[2], b[2]));

        UnionFind uf = new UnionFind(n);
        // Initially connect 0 and firstPerson since both know the secret
        uf.union(0, firstPerson);

        int m = meetings.length;
        int i = 0;

        while (i < m) {
            // Get all meetings at the current time
            int currentTime = meetings[i][2];
            List<int[]> currentMeetings = new ArrayList<>();

            // Collect all meetings at this time
            while (i < m && meetings[i][2] == currentTime) {
                int x = meetings[i][0];
                int y = meetings[i][1];
                currentMeetings.add(new int[]{x, y});
                // Union the people who are meeting
                uf.union(x, y);
                i++;
            }

            // Check which components have secret knowers
            Set<Integer> secretComponents = new HashSet<>();
            for (int[] meeting : currentMeetings) {
                int x = meeting[0];
                int y = meeting[1];
                if (knowsSecret[x] || knowsSecret[y]) {
                    // Find the root of components that have secret knowers
                    int root = uf.find(x);
                    secretComponents.add(root);
                }
            }

            // For each person in current meetings, check if their component has secret
            Set<Integer> peopleInCurrentMeetings = new HashSet<>();
            for (int[] meeting : currentMeetings) {
                int x = meeting[0];
                int y = meeting[1];
                peopleInCurrentMeetings.add(x);
                peopleInCurrentMeetings.add(y);

                int rootX = uf.find(x);
                if (secretComponents.contains(rootX)) {
                    // This component has secret, so mark all in component
                    knowsSecret[x] = true;
                    knowsSecret[y] = true;
                }
            }

            // Reset people whose components don't have secret
            for (int person : peopleInCurrentMeetings) {
                if (!knowsSecret[person]) {
                    uf.reset(person);
                }
            }
        }

        // Collect all people who know the secret
        List<Integer> result = new ArrayList<>();
        for (int j = 0; j < n; j++) {
            if (knowsSecret[j]) {
                result.add(j);
            }
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m log m + m × α(n))

- `m log m` comes from sorting the meetings by time
- `m × α(n)` comes from processing each meeting with Union-Find operations (union, find, reset), where α(n) is the inverse Ackermann function (effectively constant for practical n)
- We process each meeting once, and for meetings at each time, we iterate through participants, but each participant is processed a constant number of times

**Space Complexity:** O(n + m)

- O(n) for the Union-Find data structures (parent and rank arrays)
- O(n) for the knowsSecret array
- O(m) for grouping meetings by time (in the worst case, we store all meetings when they're all at different times)

## Common Mistakes

1. **Not resetting Union-Find components between time steps**: This is the most common mistake. If you don't reset components that don't contain secret-knowers, people who met but didn't share the secret remain connected, potentially causing them to incorrectly share the secret in future meetings.

2. **Processing meetings individually instead of grouping by time**: If you process meetings one by one in sorted order, you might miss chains of secret sharing within the same time slot. All meetings at the same time must be processed together because the secret can spread through multiple connections simultaneously.

3. **Forgetting to connect person 0 and firstPerson initially**: The problem states both person 0 and firstPerson know the secret from the start, so they should be in the same Union-Find component initially.

4. **Inefficient secret propagation within same time**: Some candidates try to repeatedly process meetings at the same time until no changes occur. While this works, it's inefficient (O(m²) worst case). The Union-Find approach propagates the secret through connected components in O(α(n)) time.

## When You'll See This Pattern

This problem combines **time-based event processing** with **graph connectivity**, which appears in several other LeetCode problems:

1. **Reachable Nodes In Subdivided Graph (Hard)**: Similar time-based graph traversal where you need to track how far you can travel through edges over time.

2. **The Earliest Moment When Everyone Become Friends (Medium)**: Uses Union-Find to track when all people become connected, but without the time-based reset requirement.

3. **Network Delay Time (Medium)**: Dijkstra's algorithm for time-based propagation through a graph, though without the bidirectional sharing aspect.

The pattern of "process events in time order, maintain connectivity with resets" is unique to this problem, but understanding how to combine sorting with Union-Find is valuable for many graph problems.

## Key Takeaways

1. **Union-Find with reset capability** is a powerful technique for problems where connections are temporary or time-bound. The reset operation allows you to "undo" unions that shouldn't persist.

2. **When dealing with time-based events, always sort by time first**, but also consider whether events at the same time need special handling (they often do).

3. **Graph connectivity problems with additional constraints** (like time, capacity, or direction) often require augmenting standard algorithms. Don't just apply BFS/DFS/Union-Find blindly—think about how the constraint affects the algorithm.

Related problems: [Reachable Nodes In Subdivided Graph](/problem/reachable-nodes-in-subdivided-graph)
