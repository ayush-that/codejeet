---
title: "Hard Accenture Interview Questions: Strategy Guide"
description: "How to tackle 11 hard difficulty questions from Accenture — patterns, time targets, and practice tips."
date: "2032-03-26"
category: "tips"
tags: ["accenture", "hard", "interview prep"]
---

Hard questions at Accenture aren't just about algorithmic complexity—they're about **system design under constraints**. While Medium problems might ask you to implement a known algorithm, Hard problems at Accenture often layer in real-world considerations: memory limits for large datasets, concurrent access patterns, or the need to optimize for a specific, non-obvious metric like network calls or disk I/O. The 11 Hard questions in their set typically involve multi-step reasoning where the initial brute force is trivial, but the optimal solution requires recognizing a secondary pattern or applying a known algorithm in a novel context.

## Common Patterns and Templates

Accenture's Hard problems frequently involve **interval merging with a twist** or **graph traversal with state**. The most common pattern I've seen is **"Modified Dijkstra's"**—not for finding shortest paths in a traditional graph, but for solving optimization problems where you're exploring a state space with a priority queue. Think problems like finding the cheapest path with at most K stops, or the shortest path breaking through obstacles. The core template involves a priority queue where each element tracks not just a node, but also a resource constraint (like remaining steps, budget, or a special move count).

Here’s the universal template for this pattern:

<div class="code-group">

```python
from heapq import heappush, heappop
from collections import defaultdict

def modified_dijkstra_template(start, target, max_resource):
    # min_cost[node][resource_used] = min_cost
    min_cost = defaultdict(lambda: defaultdict(lambda: float('inf')))
    min_cost[start][0] = 0  # 0 resource used at start
    # heap: (total_cost, node, resource_used)
    heap = [(0, start, 0)]

    while heap:
        current_cost, node, resource_used = heappop(heap)

        # Early exit if we reached target (optional, depends on problem)
        if node == target:
            return current_cost

        # If the cost in our table is better, skip processing
        if current_cost > min_cost[node][resource_used]:
            continue

        for neighbor, cost_to_neighbor, resource_cost in get_neighbors(node):
            new_resource = resource_used + resource_cost
            if new_resource > max_resource:
                continue
            new_cost = current_cost + cost_to_neighbor
            if new_cost < min_cost[neighbor][new_resource]:
                min_cost[neighbor][new_resource] = new_cost
                heappush(heap, (new_cost, neighbor, new_resource))

    # If we exhaust the heap without reaching target, find best among all resource levels
    return min(min_cost[target].values()) if target in min_cost else -1

# Time: O(N * R * log(N * R)) where N is nodes, R is resource levels
# Space: O(N * R) for the min_cost dictionary
```

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  push(node) {
    this.heap.push(node);
    this.bubbleUp();
  }
  pop() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }
  bubbleUp() {
    /* standard implementation */
  }
  sinkDown(idx) {
    /* standard implementation */
  }
}

function modifiedDijkstraTemplate(start, target, maxResource) {
  // minCost[node][resourceUsed] = minCost
  const minCost = new Map();
  const startKey = `${start},0`;
  minCost.set(startKey, 0);

  const heap = new MinHeap();
  heap.push([0, start, 0]); // [totalCost, node, resourceUsed]

  while (heap.heap.length > 0) {
    const [currentCost, node, resourceUsed] = heap.pop();
    const currentKey = `${node},${resourceUsed}`;

    if (currentCost > (minCost.get(currentKey) || Infinity)) continue;
    if (node === target) return currentCost; // optional early exit

    for (const [neighbor, costToNeighbor, resourceCost] of getNeighbors(node)) {
      const newResource = resourceUsed + resourceCost;
      if (newResource > maxResource) continue;
      const newCost = currentCost + costToNeighbor;
      const neighborKey = `${neighbor},${newResource}`;
      if (newCost < (minCost.get(neighborKey) || Infinity)) {
        minCost.set(neighborKey, newCost);
        heap.push([newCost, neighbor, newResource]);
      }
    }
  }

  // Find best cost for target across all resource levels
  let best = Infinity;
  for (let [key, cost] of minCost) {
    if (key.startsWith(`${target},`) && cost < best) best = cost;
  }
  return best === Infinity ? -1 : best;
}

// Time: O(N * R * log(N * R)) | Space: O(N * R)
```

```java
import java.util.*;

public class ModifiedDijkstraTemplate {
    public int templateMethod(int start, int target, int maxResource) {
        // minCost[node][resourceUsed] = minCost
        Map<Integer, Map<Integer, Integer>> minCost = new HashMap<>();
        minCost.computeIfAbsent(start, k -> new HashMap<>()).put(0, 0);

        // PriorityQueue: [totalCost, node, resourceUsed]
        PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        heap.offer(new int[]{0, start, 0});

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentCost = current[0], node = current[1], resourceUsed = current[2];

            if (currentCost > minCost.getOrDefault(node, new HashMap<>())
                                    .getOrDefault(resourceUsed, Integer.MAX_VALUE)) {
                continue;
            }
            if (node == target) return currentCost; // optional early exit

            for (int[] neighborData : getNeighbors(node)) {
                int neighbor = neighborData[0], costToNeighbor = neighborData[1],
                    resourceCost = neighborData[2];
                int newResource = resourceUsed + resourceCost;
                if (newResource > maxResource) continue;
                int newCost = currentCost + costToNeighbor;

                int oldCost = minCost.getOrDefault(neighbor, new HashMap<>())
                                     .getOrDefault(newResource, Integer.MAX_VALUE);
                if (newCost < oldCost) {
                    minCost.computeIfAbsent(neighbor, k -> new HashMap<>())
                           .put(newResource, newCost);
                    heap.offer(new int[]{newCost, neighbor, newResource});
                }
            }
        }

        // Find best cost for target
        return minCost.getOrDefault(target, new HashMap<>()).values()
                      .stream().min(Integer::compare).orElse(-1);
    }

    // Time: O(N * R * log(N * R)) | Space: O(N * R)
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Hard problem, you have 25-30 minutes in a 45-minute interview slot. Your breakdown should be: 5 minutes to understand and ask clarifying questions, 10-12 minutes to derive the optimal approach and explain it, 8-10 minutes to code, and 3-5 minutes to test with edge cases. The interviewer isn't just watching for a correct solution—they're evaluating **how you handle ambiguity**. Do you immediately jump to coding, or do you first explore constraints? When you hit a roadblock, do you brute force a suboptimal solution first, or do you step back to re-examine the problem structure? They're also checking for **defensive coding**: validating inputs, handling empty or single-element cases, and choosing appropriate data structures for the constraints.

## Upgrading from Medium to Hard

The jump from Medium to Hard at Accenture requires two key shifts:

1. **From single-step to multi-step optimization**: Medium problems often have one "trick"—like using a hash map for Two Sum. Hard problems require chaining insights. For example, you might need to first transform the problem into a graph, then apply Dijkstra's with a resource constraint. Practice breaking down problems into these sequential transformations.

2. **From time complexity to space-time trade-off awareness**: Many Hard problems have a brute force that's O(n²) in time and O(1) in space, and an optimal solution that's O(n log n) in time but O(n) in space. You need to articulate why you're making that trade-off based on the constraints. For instance, if the problem states "up to 10^5 elements," you can't use O(n²) time, but O(n) space is acceptable.

## Specific Patterns for Hard

Beyond the modified Dijkstra pattern, watch for these:

**Pattern 1: Binary Search on Answer** – When the problem asks for "minimum maximum" or "maximum minimum" (like "allocate minimum number of pages" or "split array largest sum"), you can often binary search on the answer range. Verify feasibility for each candidate value.

**Pattern 2: Segment Tree with Lazy Propagation** – For problems involving range queries and updates on an array (like "range sum queries with updates"), a segment tree provides O(log n) for both operations. Accenture sometimes includes these to test knowledge of advanced data structures.

Here's a quick binary search on answer template:

```python
def binary_search_on_answer(arr, k):
    def can_achieve(target):
        # Greedy check if target is achievable
        count = 1
        current_sum = 0
        for num in arr:
            if current_sum + num > target:
                count += 1
                current_sum = num
                if count > k:
                    return False
            else:
                current_sum += num
        return True

    left, right = max(arr), sum(arr)
    while left < right:
        mid = (left + right) // 2
        if can_achieve(mid):
            right = mid
        else:
            left = mid + 1
    return left
# Time: O(n log S) where S is sum(arr) | Space: O(1)
```

## Practice Strategy

Don't just solve all 11 Hard questions sequentially. Group them by pattern:

1. Start with **3 modified Dijkstra** problems to internalize the template.
2. Move to **2 binary search on answer** problems.
3. Tackle **2 segment tree/advanced data structure** problems.
4. Finish with **4 mixed pattern** problems to test pattern recognition.

Spend 45 minutes per problem—simulating real interview conditions. If you can't solve it optimally in that time, study the solution, then re-implement it from memory the next day without looking. Track which patterns cause you the most trouble and drill those. Remember: at Accenture, explaining your trade-offs clearly is as important as the code itself.

[Practice Hard Accenture questions](/company/accenture/hard)
