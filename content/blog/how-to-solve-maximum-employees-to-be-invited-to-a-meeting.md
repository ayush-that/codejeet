---
title: "How to Solve Maximum Employees to Be Invited to a Meeting — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Employees to Be Invited to a Meeting. Hard difficulty, 61.8% acceptance rate. Topics: Array, Dynamic Programming, Depth-First Search, Graph Theory, Topological Sort."
date: "2027-09-01"
category: "dsa-patterns"
tags:
  [
    "maximum-employees-to-be-invited-to-a-meeting",
    "array",
    "dynamic-programming",
    "depth-first-search",
    "hard",
  ]
---

# How to Solve Maximum Employees to Be Invited to a Meeting

This problem presents a fascinating graph theory challenge disguised as a corporate seating arrangement. Each employee has exactly one favorite person, creating a directed graph where each node has out-degree 1. The goal is to find the maximum number of employees we can invite to sit around a circular table such that every invited employee sits next to their favorite person. What makes this problem tricky is that the "favorite" relationships create cycles of various sizes, and we need to handle both simple 2-cycles (mutual favorites) and larger cycles differently.

## Visual Walkthrough

Let's trace through an example: `favorite = [2, 2, 1, 3, 4, 5, 0, 6]` with 8 employees (0-7).

**Step 1: Understanding the relationships**

- Employee 0's favorite is 2
- Employee 1's favorite is 2
- Employee 2's favorite is 1
- Employee 3's favorite is 3 (self-loop!)
- Employee 4's favorite is 4 (self-loop!)
- Employee 5's favorite is 5 (self-loop!)
- Employee 6's favorite is 0
- Employee 7's favorite is 6

**Step 2: Identifying cycles**

- Employees 0, 2, 1, 6 form a cycle: 0→2→1→6→0 (size 4)
- Employee 3 has a self-cycle (size 1)
- Employee 4 has a self-cycle (size 1)
- Employee 5 has a self-cycle (size 1)
- Employee 7 points to 6 but isn't in the cycle

**Step 3: Key insight about seating constraints**
For a valid seating arrangement, every employee must sit next to their favorite. This means:

1. For cycles of size 2 (mutual favorites like A↔B), we can extend the seating by adding chains of employees who point to A or B
2. For cycles larger than 2, we can only invite the entire cycle - no one else can be added
3. Self-cycles (size 1) are essentially cycles of size 2 where the employee is their own favorite

**Step 4: Calculating maximum invitations**

- The 4-cycle (0,2,1,6) can only include those 4 employees
- The three self-cycles (3,4,5) are treated as size 2 cycles for calculation
- Employee 7 can potentially join if we consider chains pointing to cycle members

The optimal solution is to either:

1. Take the largest cycle (size 4 = 4 employees)
2. OR sum all size 2 cycles (including treated self-cycles) with their longest chains

## Brute Force Approach

A naive approach would try all subsets of employees and check if they can be arranged around a circular table satisfying the favorite constraints. For each subset of size k, we'd need to check all k! circular permutations. This is clearly infeasible for n up to 10^5.

Even a smarter brute force that recognizes we're dealing with cycles would involve:

1. Finding all cycles in the graph
2. For each cycle, trying to extend it with chains
3. Checking all combinations of cycles and chains

The complexity would be exponential in the number of cycles, which is still too slow. The key insight we need is that cycles don't interact with each other except for size 2 cycles, which can be combined with their chains.

## Optimized Approach

The optimal solution uses these key insights:

1. **Graph Structure**: Each employee has exactly one outgoing edge (to their favorite), so the graph consists of cycles with trees pointing into them.

2. **Two Types of Cycles**:
   - **Size 2 cycles (mutual favorites)**: These are special because employees A and B can sit next to each other, and we can attach chains of employees who point to A or B on opposite sides.
   - **Cycles > 2**: For these, the only valid arrangement is to invite the entire cycle with no additional employees.

3. **Chain Length Calculation**: For each node in a size 2 cycle, we need to find the longest chain ending at that node (using DFS/BFS on the reversed graph).

4. **Final Answer**: The maximum is either:
   - The largest cycle (> 2)
   - OR the sum of all size 2 cycles with their longest chains

5. **Algorithm Steps**:
   - Find all cycles using topological sort (Kahn's algorithm) on the reversed graph
   - For each cycle, if size > 2, track it as a candidate
   - If size = 2, calculate longest chains for both nodes
   - Sum all size 2 cycles with their chains
   - Return max(largest cycle, sum of size 2 cycles with chains)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumInvitations(favorite):
    n = len(favorite)

    # Step 1: Calculate indegrees for topological sort
    indegree = [0] * n
    for person in favorite:
        indegree[person] += 1

    # Step 2: Topological sort to remove non-cycle nodes (chains)
    # We use a queue for nodes with indegree 0
    queue = []
    for i in range(n):
        if indegree[i] == 0:
            queue.append(i)

    # dp[i] stores the longest chain ending at node i
    dp = [0] * n
    visited = [False] * n

    # Process nodes in topological order
    while queue:
        curr = queue.pop(0)
        visited[curr] = True

        nxt = favorite[curr]
        # Update longest chain for the next node
        dp[nxt] = max(dp[nxt], dp[curr] + 1)

        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            queue.append(nxt)

    # Step 3: Find cycles and calculate results
    sum_cycles_2 = 0  # Sum of size 2 cycles with their chains
    max_cycle = 0     # Maximum cycle size > 2

    for i in range(n):
        if not visited[i]:
            # Found a new cycle starting at i
            cycle_length = 0
            curr = i

            # Traverse the cycle to find its length
            while not visited[curr]:
                visited[curr] = True
                curr = favorite[curr]
                cycle_length += 1

            if cycle_length == 2:
                # For size 2 cycles: i and favorite[i]
                # Add 2 (for the cycle) plus longest chains for both nodes
                sum_cycles_2 += 2 + dp[i] + dp[favorite[i]]
            else:
                # For larger cycles, we can only take the entire cycle
                max_cycle = max(max_cycle, cycle_length)

    # Step 4: Return the maximum of either option
    return max(max_cycle, sum_cycles_2)
```

```javascript
// Time: O(n) | Space: O(n)
function maximumInvitations(favorite) {
  const n = favorite.length;

  // Step 1: Calculate indegrees for topological sort
  const indegree = new Array(n).fill(0);
  for (const fav of favorite) {
    indegree[fav]++;
  }

  // Step 2: Topological sort to remove non-cycle nodes (chains)
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }

  // dp[i] stores the longest chain ending at node i
  const dp = new Array(n).fill(0);
  const visited = new Array(n).fill(false);

  // Process nodes in topological order
  while (queue.length > 0) {
    const curr = queue.shift();
    visited[curr] = true;

    const nxt = favorite[curr];
    // Update longest chain for the next node
    dp[nxt] = Math.max(dp[nxt], dp[curr] + 1);

    indegree[nxt]--;
    if (indegree[nxt] === 0) {
      queue.push(nxt);
    }
  }

  // Step 3: Find cycles and calculate results
  let sumCycles2 = 0; // Sum of size 2 cycles with their chains
  let maxCycle = 0; // Maximum cycle size > 2

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      // Found a new cycle starting at i
      let cycleLength = 0;
      let curr = i;

      // Traverse the cycle to find its length
      while (!visited[curr]) {
        visited[curr] = true;
        curr = favorite[curr];
        cycleLength++;
      }

      if (cycleLength === 2) {
        // For size 2 cycles: i and favorite[i]
        // Add 2 (for the cycle) plus longest chains for both nodes
        sumCycles2 += 2 + dp[i] + dp[favorite[i]];
      } else {
        // For larger cycles, we can only take the entire cycle
        maxCycle = Math.max(maxCycle, cycleLength);
      }
    }
  }

  // Step 4: Return the maximum of either option
  return Math.max(maxCycle, sumCycles2);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maximumInvitations(int[] favorite) {
        int n = favorite.length;

        // Step 1: Calculate indegrees for topological sort
        int[] indegree = new int[n];
        for (int person : favorite) {
            indegree[person]++;
        }

        // Step 2: Topological sort to remove non-cycle nodes (chains)
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        // dp[i] stores the longest chain ending at node i
        int[] dp = new int[n];
        boolean[] visited = new boolean[n];

        // Process nodes in topological order
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            visited[curr] = true;

            int nxt = favorite[curr];
            // Update longest chain for the next node
            dp[nxt] = Math.max(dp[nxt], dp[curr] + 1);

            indegree[nxt]--;
            if (indegree[nxt] == 0) {
                queue.offer(nxt);
            }
        }

        // Step 3: Find cycles and calculate results
        int sumCycles2 = 0;  // Sum of size 2 cycles with their chains
        int maxCycle = 0;    // Maximum cycle size > 2

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                // Found a new cycle starting at i
                int cycleLength = 0;
                int curr = i;

                // Traverse the cycle to find its length
                while (!visited[curr]) {
                    visited[curr] = true;
                    curr = favorite[curr];
                    cycleLength++;
                }

                if (cycleLength == 2) {
                    // For size 2 cycles: i and favorite[i]
                    // Add 2 (for the cycle) plus longest chains for both nodes
                    sumCycles2 += 2 + dp[i] + dp[favorite[i]];
                } else {
                    // For larger cycles, we can only take the entire cycle
                    maxCycle = Math.max(maxCycle, cycleLength);
                }
            }
        }

        // Step 4: Return the maximum of either option
        return Math.max(maxCycle, sumCycles2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Calculating indegrees: O(n)
- Topological sort (BFS): O(n) since each node is processed once
- Cycle detection: O(n) as each node is visited at most once
- Total: O(n) linear time

**Space Complexity: O(n)**

- `indegree` array: O(n)
- `dp` array for chain lengths: O(n)
- `visited` array: O(n)
- Queue for BFS: O(n) in worst case
- Total: O(n) linear space

The linear complexity comes from processing each node a constant number of times and using efficient graph traversal algorithms.

## Common Mistakes

1. **Treating all cycles the same**: The most common mistake is not distinguishing between size 2 cycles and larger cycles. Remember: only size 2 cycles can be extended with chains; larger cycles must be taken as-is.

2. **Incorrect chain length calculation**: When calculating chains for size 2 cycles, you need the longest chain ending at each node. Some candidates try to find chains that include both nodes, which doesn't work because chains must be one-directional.

3. **Forgetting about self-cycles**: An employee who favorites themselves is essentially a size 1 cycle, which should be treated as a size 2 cycle for calculation purposes (with chain length 0 for the "other" node).

4. **Double-counting in cycle detection**: When traversing cycles, mark nodes as visited immediately to avoid counting the same cycle multiple times or getting stuck in infinite loops.

5. **Not using topological sort efficiently**: Some candidates try DFS for cycle detection without first removing chains, which makes the logic more complex and error-prone.

## When You'll See This Pattern

This problem combines several important graph patterns:

1. **Cycle Detection in Directed Graphs**: Similar to "Linked List Cycle II" but for graphs where each node has out-degree 1. The topological sort approach is efficient for this structure.

2. **Functional Graphs**: Graphs where each node has exactly one outgoing edge appear in problems like:
   - **Redundant Connection**: Finding edges that create cycles in undirected graphs
   - **Find the Celebrity**: Directed graph where you need to find a node with specific properties
   - **Course Schedule**: Detecting cycles in directed graphs with topological sort

3. **Chain/Tree Attachments to Cycles**: The pattern of cycles with trees pointing into them appears in:
   - **Parallel Courses III**: DAG with longest path calculations
   - **Process Restricted Friend Requests**: Graph connectivity with constraints

## Key Takeaways

1. **Recognize functional graphs**: When each node has exactly one outgoing edge, the graph consists of cycles with trees pointing into them. This structure enables O(n) solutions.

2. **Differentiate cycle types**: In constraint satisfaction problems, small cycles (especially size 2) often have different properties than larger cycles and need special handling.

3. **Combine topological sort with cycle detection**: For graphs with chains leading into cycles, use topological sort to process chains first, then handle the cycles separately.

4. **Think about reversibility**: The critical insight for size 2 cycles is that A and B can sit together, allowing chains on both sides. For larger cycles, the seating arrangement is fixed and cannot be extended.

Related problems: [Redundant Connection](/problem/redundant-connection), [Parallel Courses III](/problem/parallel-courses-iii), [Process Restricted Friend Requests](/problem/process-restricted-friend-requests)
