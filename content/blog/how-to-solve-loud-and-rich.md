---
title: "How to Solve Loud and Rich — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Loud and Rich. Medium difficulty, 63.2% acceptance rate. Topics: Array, Depth-First Search, Graph Theory, Topological Sort."
date: "2027-12-11"
category: "dsa-patterns"
tags: ["loud-and-rich", "array", "depth-first-search", "graph-theory", "medium"]
---

# How to Solve Loud and Rich

You're given a group of people with different wealth levels and quietness values. The `richer` array defines wealth comparisons between people, and you need to find, for each person, the least quiet person among all people who have at least as much money as them (including themselves). The challenge is that wealth comparisons are transitive: if A is richer than B, and B is richer than C, then A is also richer than C.

What makes this problem interesting is that you're essentially building a "richer-than" graph and then finding, for each node, the minimum quiet value in its reachable subgraph. The transitivity means we need to consider all ancestors in the wealth hierarchy, not just direct comparisons.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
n = 5
richer = [[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]]
quiet = [3,2,5,4,6,1,7,0]
```

First, let's understand the relationships:

- Person 1 is richer than 0
- Person 2 is richer than 1
- Person 3 is richer than 1
- Person 3 is richer than 7
- Person 4 is richer than 3
- Person 5 is richer than 3
- Person 6 is richer than 3

We can visualize this as a directed graph where edges point from richer to poorer people:

```
2 → 1 → 0
3 → 1
3 → 7
4 → 3
5 → 3
6 → 3
```

Now, for each person, we need to find the least quiet person among themselves and all people richer than them. Let's work through a few examples:

**Person 0**: Who is richer than person 0? Person 1 is directly richer, and person 2 and 3 are indirectly richer (2→1→0 and 3→1→0). Among {0, 1, 2, 3}, the quiet values are [3, 2, 5, 4]. The minimum quiet value is 2 (person 1).

**Person 3**: Who is richer than person 3? Persons 4, 5, and 6 are directly richer. Among {3, 4, 5, 6}, the quiet values are [4, 6, 1, 7]. The minimum is 1 (person 5).

**Person 7**: Who is richer than person 7? Person 3 is directly richer, and persons 4, 5, 6 are indirectly richer (4→3→7, etc.). Among {7, 3, 4, 5, 6}, the quiet values are [0, 4, 6, 1, 7]. The minimum is 0 (person 7 themselves).

The key insight is that for each person, we need to explore all reachable nodes in the "richer-than" graph and find the one with minimum quietness.

## Brute Force Approach

A naive approach would be: for each person, perform a DFS/BFS to find all people who are richer than them (directly or indirectly), then among all those people (including themselves), find the one with the minimum quiet value.

Here's what that might look like:

<div class="code-group">

```python
# Brute Force - Too Slow!
# Time: O(n * (n + e)) where e = len(richer)
# Space: O(n + e) for the graph
def loudAndRich(richer, quiet):
    n = len(quiet)

    # Build adjacency list (richer -> poorer)
    graph = [[] for _ in range(n)]
    for a, b in richer:
        graph[a].append(b)

    def dfs(person, visited):
        """Return all people richer than or equal to person"""
        richer_people = {person}
        visited.add(person)

        # Find all people who are directly richer
        for richer_person in range(n):
            if richer_person not in visited:
                # Check if richer_person can reach person
                # This requires another DFS to check connectivity!
                # This nested DFS makes it O(n^2) per person
                pass

        return richer_people

    answer = [0] * n
    for i in range(n):
        # This approach is problematic because we need to find
        # all ancestors in the graph, not just direct connections
        # A proper implementation would be O(n^2) or worse
        pass

    return answer
```

```javascript
// Brute Force - Too Slow!
// Time: O(n * (n + e)) where e = richer.length
// Space: O(n + e) for the graph
function loudAndRich(richer, quiet) {
  const n = quiet.length;

  // Build adjacency list (richer -> poorer)
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of richer) {
    graph[a].push(b);
  }

  // The brute force approach would require for each person i:
  // 1. Find all people who can reach i in the graph (all ancestors)
  // 2. Among those people, find the one with minimum quiet value
  // Step 1 alone requires O(n + e) per person, making total O(n*(n+e))

  return new Array(n).fill(0);
}
```

```java
// Brute Force - Too Slow!
// Time: O(n * (n + e)) where e = richer.length
// Space: O(n + e) for the graph
public int[] loudAndRich(int[][] richer, int[] quiet) {
    int n = quiet.length;

    // Build adjacency list (richer -> poorer)
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : richer) {
        graph[edge[0]].add(edge[1]);
    }

    // The problem with brute force is we need to consider
    // transitive relationships. For person i, we need ALL
    // people who are richer than i, directly or indirectly.
    // Checking this for each person separately is inefficient.

    return new int[n];
}
```

</div>

The brute force approach has several issues:

1. Checking all possible ancestor relationships for each person is expensive
2. We might recompute the same relationships multiple times
3. The worst-case time complexity could be O(n³) if we're not careful

## Optimized Approach

The key insight is that we can use **memoization** (caching) with DFS to avoid recomputation. For each person, we want to find the least quiet person in their "richer-than" subgraph. Notice that:

1. If person A is richer than person B, then the answer for B depends on the answer for A (and all people richer than A)
2. This is a classic **dynamic programming on a DAG** problem
3. We can compute answers in topological order, or use DFS with memoization

Here's the optimized approach:

- Build the graph in the direction of wealth flow (richer → poorer)
- For each person, the answer is the person with minimum quiet value among:
  - The person themselves
  - All answers of people who are directly richer than them
- We can compute this recursively with memoization

Why does this work? Because if person X is richer than person Y, then any person who is richer than X is also richer than Y (transitivity). So when computing the answer for Y, we can look at the answers for all X where X is richer than Y, and take the minimum quiet value among them.

## Optimal Solution

Here's the complete solution using DFS with memoization:

<div class="code-group">

```python
# Time: O(n + e) where n = number of people, e = number of richer relations
# Space: O(n + e) for the graph and memoization
def loudAndRich(richer, quiet):
    n = len(quiet)

    # Step 1: Build adjacency list
    # graph[i] contains all people who are POORER than i
    # (edges go from richer to poorer)
    graph = [[] for _ in range(n)]
    for a, b in richer:
        graph[a].append(b)

    # Step 2: Initialize answer array with -1 (uncomputed)
    answer = [-1] * n

    def dfs(person):
        """Return the least quiet person among person and all richer people"""
        # If we've already computed the answer for this person, return it
        if answer[person] != -1:
            return answer[person]

        # Start with the person themselves as candidate
        # We store the INDEX of the person, not the quiet value
        min_quiet_person = person

        # Check all people who are poorer than current person
        # (which means current person is richer than them)
        # Actually, we need to check people who are RICHER than current person
        # Wait, let me think about the graph direction...
        # graph[person] contains people POORER than person
        # So to find people RICHER than person, we need reverse edges
        # Let me rebuild the graph correctly...

    # Actually, let me correct the graph building
    # We want graph[i] to contain people who are RICHER than i
    # So when we have richer[a, b] meaning a is richer than b
    # We should add a to graph[b]'s list of richer people

    return answer
```

```javascript
// Time: O(n + e) where n = quiet.length, e = richer.length
// Space: O(n + e) for the graph and memoization
function loudAndRich(richer, quiet) {
  const n = quiet.length;

  // Build graph where graph[i] contains people RICHER than i
  const graph = Array.from({ length: n }, () => []);
  for (const [richerPerson, poorerPerson] of richer) {
    graph[poorerPerson].push(richerPerson);
  }

  // Initialize answer array with -1 (uncomputed)
  const answer = new Array(n).fill(-1);

  function dfs(person) {
    // If already computed, return cached answer
    if (answer[person] !== -1) {
      return answer[person];
    }

    // Start with the person themselves
    let minQuietPerson = person;

    // Check all people who are richer than current person
    for (const richerPerson of graph[person]) {
      const candidate = dfs(richerPerson);
      if (quiet[candidate] < quiet[minQuietPerson]) {
        minQuietPerson = candidate;
      }
    }

    // Memoize the result
    answer[person] = minQuietPerson;
    return minQuietPerson;
  }

  // Compute answer for each person
  for (let i = 0; i < n; i++) {
    if (answer[i] === -1) {
      dfs(i);
    }
  }

  return answer;
}
```

```java
// Time: O(n + e) where n = quiet.length, e = richer.length
// Space: O(n + e) for the graph and memoization
public int[] loudAndRich(int[][] richer, int[] quiet) {
    int n = quiet.length;

    // Build graph where graph[i] contains people RICHER than i
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : richer) {
        int richerPerson = edge[0];
        int poorerPerson = edge[1];
        graph[poorerPerson].add(richerPerson);
    }

    // Initialize answer array with -1 (uncomputed)
    int[] answer = new int[n];
    Arrays.fill(answer, -1);

    // DFS function with memoization
    for (int i = 0; i < n; i++) {
        dfs(i, graph, quiet, answer);
    }

    return answer;
}

private int dfs(int person, List<Integer>[] graph, int[] quiet, int[] answer) {
    // If already computed, return cached answer
    if (answer[person] != -1) {
        return answer[person];
    }

    // Start with the person themselves
    int minQuietPerson = person;

    // Check all people who are richer than current person
    for (int richerPerson : graph[person]) {
        int candidate = dfs(richerPerson, graph, quiet, answer);
        if (quiet[candidate] < quiet[minQuietPerson]) {
            minQuietPerson = candidate;
        }
    }

    // Memoize the result
    answer[person] = minQuietPerson;
    return minQuietPerson;
}
```

</div>

Wait, I need to correct the Python solution. Let me provide the complete, correct solution:

<div class="code-group">

```python
# Time: O(n + e) where n = len(quiet), e = len(richer)
# Space: O(n + e) for the graph and memoization
def loudAndRich(richer, quiet):
    n = len(quiet)

    # Step 1: Build graph where graph[i] contains people RICHER than i
    # This is the key: we want to easily find who is richer than each person
    graph = [[] for _ in range(n)]
    for a, b in richer:
        graph[b].append(a)  # a is richer than b, so a is in graph[b]

    # Step 2: Initialize answer array with -1 (uncomputed)
    answer = [-1] * n

    def dfs(person):
        """Return the least quiet person among person and all richer people"""
        # If we've already computed the answer for this person, return it
        if answer[person] != -1:
            return answer[person]

        # Start with the person themselves as candidate
        min_quiet_person = person

        # Check all people who are richer than current person
        for richer_person in graph[person]:
            # Recursively find the least quiet person among richer people
            candidate = dfs(richer_person)

            # Update if candidate is quieter
            if quiet[candidate] < quiet[min_quiet_person]:
                min_quiet_person = candidate

        # Memoize the result
        answer[person] = min_quiet_person
        return min_quiet_person

    # Step 3: Compute answer for each person
    for i in range(n):
        if answer[i] == -1:
            dfs(i)

    return answer
```

</div>

## Complexity Analysis

**Time Complexity: O(n + e)**

- Building the graph takes O(e) time where e is the number of richer relations
- Each person is visited exactly once in the DFS due to memoization
- For each person, we check all their direct richer connections
- Total work is proportional to the number of nodes plus edges

**Space Complexity: O(n + e)**

- The graph adjacency list uses O(n + e) space
- The answer array uses O(n) space
- The recursion stack in worst case could be O(n) for a chain of relationships

## Common Mistakes

1. **Building the graph in the wrong direction**: The most common mistake is building `graph[a].append(b)` instead of `graph[b].append(a)`. Remember: we want to easily find who is richer than each person, so for person `b`, we need to store that `a` is richer than `b`.

2. **Forgetting memoization**: Without memoization, you might recompute the same subproblems multiple times, leading to exponential time complexity in the worst case.

3. **Comparing quiet values instead of indices**: When updating the minimum, you need to compare the quiet values but store the person index. A common error is to store the quiet value itself, but we need to return the person index in the answer.

4. **Not handling cycles (even though problem guarantees no cycles)**: In a real interview, you might want to mention that the problem guarantees the richer relations form a DAG (no cycles), which is why DFS works. If cycles were possible, we'd need cycle detection.

## When You'll See This Pattern

This problem uses **DFS with memoization on a DAG**, which is a common pattern for problems involving transitive relationships:

1. **Course Schedule (LeetCode 207)**: Similar graph structure for prerequisites
2. **Longest Increasing Path in a Matrix (LeetCode 329)**: DFS with memoization to find longest paths
3. **Build a Matrix With Conditions (LeetCode 2392)**: Very similar - building order based on constraints

The pattern is: when you have a problem with transitive relationships (A > B and B > C implies A > C) and you need to compute something for each node based on all reachable nodes, think about DFS with memoization or topological sort.

## Key Takeaways

1. **Transitive relationships often imply graph problems**: When you see "if A has relation to B and B has relation to C, then A has relation to C", think about representing the problem as a graph and using DFS/BFS or topological sort.

2. **Memoization avoids recomputation**: When computing answers for nodes depends on answers for their neighbors, and the graph is a DAG, DFS with memoization is often the right approach.

3. **Graph direction matters**: Always think carefully about which direction makes the problem easier to solve. For "find all people richer than X", it's easier to store edges from poorer to richer.

Related problems: [Build a Matrix With Conditions](/problem/build-a-matrix-with-conditions)
