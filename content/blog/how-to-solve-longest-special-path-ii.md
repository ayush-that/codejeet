---
title: "How to Solve Longest Special Path II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Special Path II. Hard difficulty, 18.5% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Prefix Sum."
date: "2026-09-30"
category: "dsa-patterns"
tags: ["longest-special-path-ii", "array", "hash-table", "tree", "hard"]
---

# How to Solve Longest Special Path II

You're given a tree with weighted edges and an array of values assigned to each node. A "special path" is a path where the values along it are strictly increasing. Your task is to find the longest such path's total edge length. The challenge lies in efficiently tracking increasing sequences across all possible tree paths while handling edge weights.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
n = 4
values = [1, 3, 2, 4]
edges = [[0,1,2], [1,2,1], [1,3,3]]
```

The tree looks like this:

```
    0(val=1)
    |
    2
    |
    1(val=3)
   / \
  1   3
 /     \
2(val=2) 3(val=4)
```

We need to find the longest path where node values strictly increase.

**Step 1:** Consider path 0→1→3

- Values: 1 → 3 → 4 (strictly increasing ✓)
- Length: 2 + 3 = 5

**Step 2:** Consider path 0→1→2

- Values: 1 → 3 → 2 (3→2 decreases ✗)

**Step 3:** Consider path 1→3

- Values: 3 → 4 (increasing ✓)
- Length: 3

**Step 4:** Consider path 1→2

- Values: 3 → 2 (decreasing ✗)

The longest special path is 0→1→3 with length 5.

The key insight: We need to track, for each node, the longest increasing path ending at that node, and combine paths from children when they form valid increasing sequences.

## Brute Force Approach

A naive approach would be to check every possible path in the tree. For each pair of nodes (u, v), we could:

1. Find the path between them (using DFS/BFS)
2. Check if values along the path are strictly increasing
3. Sum the edge lengths
4. Track the maximum sum

This requires O(n²) path checks, and each check takes O(n) time to verify the increasing condition and sum edges, resulting in O(n³) time complexity. For n up to 10⁵ (typical constraints), this is completely infeasible.

Even a slightly better brute force using DFS from each node as starting point would be O(n²), still too slow. We need a linear or near-linear solution.

## Optimized Approach

The key insight is that we can solve this with **two DFS traversals** (tree DP):

1. **First DFS (downward):** For each node, compute:
   - `inc[u]`: Maximum length of increasing path ending at u, coming from its children
   - `dec[u]`: Maximum length of decreasing path ending at u, coming from its children

   We track both because when we combine paths from different children, we might connect an increasing path to a decreasing path through the current node.

2. **Second DFS (rerooting/upward):** Propagate information from parent to children to find the best path that might pass through each node.

**Why this works:**

- A special path is strictly increasing, so it can either be:
  - A single increasing path from some ancestor to descendant
  - Two paths joined at a node: increasing up to the node, then increasing away from it
- Since values must be strictly increasing, when combining paths through a node, all values must be different
- We need to consider the node's value relative to its neighbors to ensure strict increase

**Critical observation:** When we combine paths through a node u:

- If we take a path from child v (where values increase toward u) and another from child w (where values increase away from u), then:
  - value[v] < value[u] < value[w] must hold
- The total length would be: `inc_from_v + dec_from_w`

## Optimal Solution

We use tree DP with two DFS passes. The first computes local best paths (considering children only), and the second propagates parent information to compute global best paths.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def longestSpecialPath(self, values: List[int], edges: List[List[int]]) -> int:
        n = len(values)

        # Build adjacency list with edge weights
        graph = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            graph[v].append((u, w))

        # inc[u] = max length of strictly increasing path ending at u (from children)
        # dec[u] = max length of strictly decreasing path ending at u (from children)
        inc = [0] * n
        dec = [0] * n
        ans = 0

        def dfs1(u: int, parent: int) -> None:
            nonlocal ans
            # Track best two increasing and decreasing paths from children
            # We need best two to potentially combine them through u
            best_inc1 = best_inc2 = 0
            best_dec1 = best_dec2 = 0

            for v, w in graph[u]:
                if v == parent:
                    continue

                dfs1(v, u)

                # Case 1: v -> u is increasing (value[v] < value[u])
                if values[v] < values[u]:
                    # Path ending at v (increasing) + edge v-u
                    cand = inc[v] + w
                    if cand > best_inc1:
                        best_inc2 = best_inc1
                        best_inc1 = cand
                    elif cand > best_inc2:
                        best_inc2 = cand

                # Case 2: v -> u is decreasing (value[v] > value[u])
                elif values[v] > values[u]:
                    # Path ending at v (decreasing) + edge v-u
                    cand = dec[v] + w
                    if cand > best_dec1:
                        best_dec2 = best_dec1
                        best_dec1 = cand
                    elif cand > best_dec2:
                        best_dec2 = cand

            # Update inc[u] and dec[u] with best single path through children
            inc[u] = best_inc1
            dec[u] = best_dec1

            # Path that goes through u, combining two child paths
            # Option 1: Two increasing paths (from different children) meeting at u
            # But wait - both would be increasing TOWARD u, so they can't both continue
            # Actually, we need one increasing toward u and one increasing away from u

            # Actually, let's think: A path through u could be:
            # 1. Increasing then increasing: child1 (inc) -> u -> child2 (inc)
            #    But for child2, inc means increasing TOWARD u, so we need dec from child2's perspective
            #    So we need inc from one child and dec from another

            # Path through u combining best inc and dec from different children
            if best_inc1 > 0 and best_dec1 > 0:
                ans = max(ans, best_inc1 + best_dec1)

            # Also consider single path (not through u)
            ans = max(ans, best_inc1, best_dec1)

        # Second DFS to handle paths that go upward (parent to child)
        def dfs2(u: int, parent: int, parent_inc: int, parent_dec: int) -> None:
            nonlocal ans

            # We need to consider paths that come from parent and go to children
            # Track best inc/dec from children (same as dfs1 but we'll use it differently)
            child_inc = []
            child_dec = []

            for v, w in graph[u]:
                if v == parent:
                    continue

                if values[v] < values[u]:
                    child_inc.append((v, w, inc[v] + w))
                elif values[v] > values[u]:
                    child_dec.append((v, w, dec[v] + w))

            # Sort children by their path lengths
            child_inc.sort(key=lambda x: x[2], reverse=True)
            child_dec.sort(key=lambda x: x[2], reverse=True)

            # For each child, compute best path that might go through parent
            for v, w, _ in graph[u]:
                if v == parent:
                    continue

                # Calculate best inc/dec from parent side
                best_from_parent_inc = 0
                best_from_parent_dec = 0

                # If parent -> u is increasing
                if parent != -1 and values[parent] < values[u]:
                    best_from_parent_inc = parent_inc + w

                # If parent -> u is decreasing
                if parent != -1 and values[parent] > values[u]:
                    best_from_parent_dec = parent_dec + w

                # Also consider other children as potential "parent side" paths
                # For child v, if we're looking at inc path through u,
                # we can take best inc from other children or from parent

                # Find best inc not using child v
                other_inc = 0
                if values[v] < values[u]:
                    # v is in inc group, find best other inc
                    for v2, w2, val in child_inc:
                        if v2 != v:
                            other_inc = val
                            break
                else:
                    # v is in dec group or neither, take best inc
                    if child_inc:
                        other_inc = child_inc[0][2]

                # Find best dec not using child v
                other_dec = 0
                if values[v] > values[u]:
                    # v is in dec group, find best other dec
                    for v2, w2, val in child_dec:
                        if v2 != v:
                            other_dec = val
                            break
                else:
                    # v is in inc group or neither, take best dec
                    if child_dec:
                        other_dec = child_dec[0][2]

                # Path through u: from parent/other child (inc) to v (dec) or vice versa
                # Actually, we need to be careful about direction

                # If v -> u is increasing (values[v] < values[u])
                # Then from u we could go to parent/other child if that path is decreasing
                # So: inc from v + dec from parent/other
                if values[v] < values[u]:
                    cand1 = inc[v] + w + max(best_from_parent_dec, other_dec)
                    ans = max(ans, cand1)
                    # Also path that ends at v
                    ans = max(ans, inc[v] + w)

                # If v -> u is decreasing (values[v] > values[u])
                # Then from u we could go to parent/other child if that path is increasing
                elif values[v] > values[u]:
                    cand2 = dec[v] + w + max(best_from_parent_inc, other_inc)
                    ans = max(ans, cand2)
                    # Also path that ends at v
                    ans = max(ans, dec[v] + w)

                # Prepare for recursion: what to pass to child v
                # For child v, if we come from u, what's the best path ending at u?
                next_parent_inc = 0
                next_parent_dec = 0

                if values[v] < values[u]:
                    # u -> v would be decreasing from u's perspective
                    # So for v, coming from u is increasing (since v < u)
                    next_parent_inc = max(best_from_parent_inc, other_inc) + w
                elif values[v] > values[u]:
                    # u -> v would be increasing from u's perspective
                    # So for v, coming from u is decreasing (since v > u)
                    next_parent_dec = max(best_from_parent_dec, other_dec) + w

                dfs2(v, u, next_parent_inc, next_parent_dec)

        # Run first DFS to compute inc/dec from children
        dfs1(0, -1)
        # Run second DFS to propagate parent information
        dfs2(0, -1, 0, 0)

        return ans
```

```javascript
// Time: O(n) | Space: O(n)
function longestSpecialPath(values, edges) {
  const n = values.length;

  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  const inc = new Array(n).fill(0);
  const dec = new Array(n).fill(0);
  let ans = 0;

  // First DFS: compute paths from children
  function dfs1(u, parent) {
    let bestInc1 = 0,
      bestInc2 = 0;
    let bestDec1 = 0,
      bestDec2 = 0;

    for (const [v, w] of graph[u]) {
      if (v === parent) continue;

      dfs1(v, u);

      if (values[v] < values[u]) {
        const cand = inc[v] + w;
        if (cand > bestInc1) {
          bestInc2 = bestInc1;
          bestInc1 = cand;
        } else if (cand > bestInc2) {
          bestInc2 = cand;
        }
      } else if (values[v] > values[u]) {
        const cand = dec[v] + w;
        if (cand > bestDec1) {
          bestDec2 = bestDec1;
          bestDec1 = cand;
        } else if (cand > bestDec2) {
          bestDec2 = cand;
        }
      }
    }

    inc[u] = bestInc1;
    dec[u] = bestDec1;

    // Update answer with best path through u
    if (bestInc1 > 0 && bestDec1 > 0) {
      ans = Math.max(ans, bestInc1 + bestDec1);
    }
    ans = Math.max(ans, bestInc1, bestDec1);
  }

  // Second DFS: propagate parent information
  function dfs2(u, parent, parentInc, parentDec) {
    const childInc = [];
    const childDec = [];

    // Collect child paths
    for (const [v, w] of graph[u]) {
      if (v === parent) continue;

      if (values[v] < values[u]) {
        childInc.push([v, w, inc[v] + w]);
      } else if (values[v] > values[u]) {
        childDec.push([v, w, dec[v] + w]);
      }
    }

    // Sort by path length (descending)
    childInc.sort((a, b) => b[2] - a[2]);
    childDec.sort((a, b) => b[2] - a[2]);

    for (const [v, w] of graph[u]) {
      if (v === parent) continue;

      // Calculate best from parent side
      let bestFromParentInc = 0;
      let bestFromParentDec = 0;

      if (parent !== -1 && values[parent] < values[u]) {
        bestFromParentInc = parentInc + w;
      }
      if (parent !== -1 && values[parent] > values[u]) {
        bestFromParentDec = parentDec + w;
      }

      // Find best from other children
      let otherInc = 0;
      if (values[v] < values[u]) {
        // v is in inc group
        for (const [v2, w2, val] of childInc) {
          if (v2 !== v) {
            otherInc = val;
            break;
          }
        }
      } else {
        if (childInc.length > 0) otherInc = childInc[0][2];
      }

      let otherDec = 0;
      if (values[v] > values[u]) {
        // v is in dec group
        for (const [v2, w2, val] of childDec) {
          if (v2 !== v) {
            otherDec = val;
            break;
          }
        }
      } else {
        if (childDec.length > 0) otherDec = childDec[0][2];
      }

      // Update answer for paths through u
      if (values[v] < values[u]) {
        const cand1 = inc[v] + w + Math.max(bestFromParentDec, otherDec);
        ans = Math.max(ans, cand1);
        ans = Math.max(ans, inc[v] + w);
      } else if (values[v] > values[u]) {
        const cand2 = dec[v] + w + Math.max(bestFromParentInc, otherInc);
        ans = Math.max(ans, cand2);
        ans = Math.max(ans, dec[v] + w);
      }

      // Prepare values for child's recursion
      let nextParentInc = 0;
      let nextParentDec = 0;

      if (values[v] < values[u]) {
        nextParentInc = Math.max(bestFromParentInc, otherInc) + w;
      } else if (values[v] > values[u]) {
        nextParentDec = Math.max(bestFromParentDec, otherDec) + w;
      }

      dfs2(v, u, nextParentInc, nextParentDec);
    }
  }

  dfs1(0, -1);
  dfs2(0, -1, 0, 0);

  return ans;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private List<int[]>[] graph;
    private int[] values;
    private int[] inc;
    private int[] dec;
    private int ans;

    public int longestSpecialPath(int[] values, int[][] edges) {
        int n = values.length;
        this.values = values;

        // Build graph
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph[u].add(new int[]{v, w});
            graph[v].add(new int[]{u, w});
        }

        inc = new int[n];
        dec = new int[n];
        ans = 0;

        // First DFS
        dfs1(0, -1);
        // Second DFS
        dfs2(0, -1, 0, 0);

        return ans;
    }

    private void dfs1(int u, int parent) {
        int bestInc1 = 0, bestInc2 = 0;
        int bestDec1 = 0, bestDec2 = 0;

        for (int[] neighbor : graph[u]) {
            int v = neighbor[0], w = neighbor[1];
            if (v == parent) continue;

            dfs1(v, u);

            if (values[v] < values[u]) {
                int cand = inc[v] + w;
                if (cand > bestInc1) {
                    bestInc2 = bestInc1;
                    bestInc1 = cand;
                } else if (cand > bestInc2) {
                    bestInc2 = cand;
                }
            } else if (values[v] > values[u]) {
                int cand = dec[v] + w;
                if (cand > bestDec1) {
                    bestDec2 = bestDec1;
                    bestDec1 = cand;
                } else if (cand > bestDec2) {
                    bestDec2 = cand;
                }
            }
        }

        inc[u] = bestInc1;
        dec[u] = bestDec1;

        // Update answer
        if (bestInc1 > 0 && bestDec1 > 0) {
            ans = Math.max(ans, bestInc1 + bestDec1);
        }
        ans = Math.max(ans, Math.max(bestInc1, bestDec1));
    }

    private void dfs2(int u, int parent, int parentInc, int parentDec) {
        List<int[]> childInc = new ArrayList<>();
        List<int[]> childDec = new ArrayList<>();

        // Collect child paths
        for (int[] neighbor : graph[u]) {
            int v = neighbor[0], w = neighbor[1];
            if (v == parent) continue;

            if (values[v] < values[u]) {
                childInc.add(new int[]{v, w, inc[v] + w});
            } else if (values[v] > values[u]) {
                childDec.add(new int[]{v, w, dec[v] + w});
            }
        }

        // Sort by path length
        childInc.sort((a, b) -> b[2] - a[2]);
        childDec.sort((a, b) -> b[2] - a[2]);

        for (int[] neighbor : graph[u]) {
            int v = neighbor[0], w = neighbor[1];
            if (v == parent) continue;

            // Best from parent side
            int bestFromParentInc = 0;
            int bestFromParentDec = 0;

            if (parent != -1 && values[parent] < values[u]) {
                bestFromParentInc = parentInc + w;
            }
            if (parent != -1 && values[parent] > values[u]) {
                bestFromParentDec = parentDec + w;
            }

            // Best from other children
            int otherInc = 0;
            if (values[v] < values[u]) {
                for (int[] child : childInc) {
                    if (child[0] != v) {
                        otherInc = child[2];
                        break;
                    }
                }
            } else {
                if (!childInc.isEmpty()) otherInc = childInc.get(0)[2];
            }

            int otherDec = 0;
            if (values[v] > values[u]) {
                for (int[] child : childDec) {
                    if (child[0] != v) {
                        otherDec = child[2];
                        break;
                    }
                }
            } else {
                if (!childDec.isEmpty()) otherDec = childDec.get(0)[2];
            }

            // Update answer
            if (values[v] < values[u]) {
                int cand1 = inc[v] + w + Math.max(bestFromParentDec, otherDec);
                ans = Math.max(ans, cand1);
                ans = Math.max(ans, inc[v] + w);
            } else if (values[v] > values[u]) {
                int cand2 = dec[v] + w + Math.max(bestFromParentInc, otherInc);
                ans = Math.max(ans, cand2);
                ans = Math.max(ans, dec[v] + w);
            }

            // Prepare for child's recursion
            int nextParentInc = 0;
            int nextParentDec = 0;

            if (values[v] < values[u]) {
                nextParentInc = Math.max(bestFromParentInc, otherInc) + w;
            } else if (values[v] > values[u]) {
                nextParentDec = Math.max(bestFromParentDec, otherDec) + w;
            }

            dfs2(v, u, nextParentInc, nextParentDec);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We perform two DFS traversals of the tree
- Each node is visited exactly once in each traversal
- At each node, we process all its edges (neighbors)
- Since a tree has n-1 edges, total work is O(n) for each traversal
- Sorting child lists at each node seems expensive, but each edge appears in exactly one child list, and we only sort small lists per node

**Space Complexity:** O(n)

- Graph adjacency list: O(n) to store all edges
- inc and dec arrays: O(n)
- Recursion stack: O(n) in worst case (linear tree)
- Child lists in second DFS: O(degree) per node, but total across all nodes is O(n)

## Common Mistakes

1. **Forgetting strict inequality:** The problem requires strictly increasing values. Using ≤ instead of < will include equal values and give wrong results.

2. **Not handling both directions:** When combining paths through a node, you need to consider that one path comes toward the node and another goes away. Getting the direction wrong (mixing inc and dec incorrectly) is a common error.

3. **Missing the rerooting step:** Only doing one DFS from root won't find all paths. Some longest paths might not be rooted at node 0. The second DFS propagates parent information to find these.

4. **Not tracking top two children:** When combining paths through a node, you might need the best two paths from children. If you only track the best, you might combine a path with itself when the best path comes from the child you're trying to combine with.

## When You'll See This Pattern

This tree DP with two DFS passes (sometimes called "rerooting DP") appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)** - Similar concept of combining paths through a node, though with different constraints.

2. **Diameter of Binary Tree (LeetCode 543)** - Find longest path between any two nodes, uses similar two-pass DP.

3. **Tree Diameter (LeetCode 1245)** - General tree version of diameter problem.

The pattern is: when you need to find some optimal "path property" in a tree where the path can start and end anywhere, you often need to:

- Compute local information in a bottom-up pass
- Propagate parent information in a top-down pass
- Consider paths that go through a node by combining best from left and right

## Key Takeaways

1. **Tree DP often requires two passes** when paths can be anywhere in the tree, not just rooted at a specific node. First pass computes "subtree" answers, second pass propagates "outside subtree" information.

2. **For path problems, think in terms of "through node" vs "ending at node"**. You often need to track both: the best path ending at a node (for extension) and the best path through a node (for answer).

3. **When combining paths through a node, ensure they come from different children**. Track the best two from each direction to avoid using the same child twice.

Related problems: [Longest Special Path](/problem/longest-special-path)
