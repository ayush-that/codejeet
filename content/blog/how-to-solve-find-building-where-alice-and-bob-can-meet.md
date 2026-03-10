---
title: "How to Solve Find Building Where Alice and Bob Can Meet — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Building Where Alice and Bob Can Meet. Hard difficulty, 52.2% acceptance rate. Topics: Array, Binary Search, Stack, Binary Indexed Tree, Segment Tree."
date: "2027-12-14"
category: "dsa-patterns"
tags: ["find-building-where-alice-and-bob-can-meet", "array", "binary-search", "stack", "hard"]
---

# How to Solve "Find Building Where Alice and Bob Can Meet"

This problem asks us to find, for multiple queries, the leftmost building where two people starting from different positions can meet, given movement constraints. The tricky part is that movement is restricted: from building `i`, you can only move to a taller building at a higher index. This creates a directed graph where edges only go forward to taller buildings, making meeting points non-trivial to find efficiently for many queries.

## Visual Walkthrough

Let's walk through a small example: `heights = [6,4,1,5,3,2,8]` with query `(1, 5)` where Alice starts at index 1 (height 4) and Bob starts at index 5 (height 2).

**Step 1: Understanding movement constraints**

- From index 1 (height 4), Alice can move to any index >1 with height >4. Possible destinations: index 6 (height 8).
- From index 5 (height 2), Bob can move to any index >5 with height >2. Possible destinations: index 6 (height 8).

**Step 2: Finding meeting points**
Both can reach index 6 (height 8). But is there an earlier meeting point? Let's check systematically:

- Index 6: Both can reach ✓
- Index 5: Alice can't reach (Bob starts here but Alice can't get there)
- Index 4: Height 3 < Alice's 4, so she can't reach
- Index 3: Height 5 > Alice's 4, but Bob at height 2 can't reach height 5
- Index 2: Height 1 < both starting heights

So index 6 is the first meeting point. The key insight: the meeting point must be ≥ max(startA, startB) and must have height > max(heights[startA], heights[startB]) for both to reach it.

**Step 3: The challenge with multiple queries**
If we had 10,000 queries on 10,000 buildings, checking each possible meeting point for each query would be O(n²) — far too slow. We need a smarter way to find the "next taller building" for ranges of indices.

## Brute Force Approach

The brute force approach checks every possible meeting point for each query:

1. For each query (a, b), let `start = max(a, b)` (since both must move forward)
2. From `start` to `n-1`, check if building `i` is reachable from both starting points
3. A building is reachable from position `p` if there's an increasing sequence of heights from `p` to `i`

The naive reachability check would be O(n) per building, making this O(n³) per query. Even a slightly better O(n²) per query (checking each building once) would be too slow for constraints like n=10⁵ and q=10⁵.

<div class="code-group">

```python
# Time: O(n² * q) | Space: O(1) - Too slow for constraints!
def bruteForce(heights, queries):
    n = len(heights)
    result = []

    for a, b in queries:
        start = max(a, b)
        found = -1

        # Check each possible meeting point
        for i in range(start, n):
            # Check if Alice can reach i
            alice_can = True
            for j in range(a, i):
                if heights[j] >= heights[i]:
                    alice_can = False
                    break

            # Check if Bob can reach i
            bob_can = True
            for j in range(b, i):
                if heights[j] >= heights[i]:
                    bob_can = False
                    break

            if alice_can and bob_can:
                found = i
                break

        result.append(found)

    return result
```

```javascript
// Time: O(n² * q) | Space: O(1) - Too slow for constraints!
function bruteForce(heights, queries) {
  const n = heights.length;
  const result = [];

  for (const [a, b] of queries) {
    const start = Math.max(a, b);
    let found = -1;

    // Check each possible meeting point
    for (let i = start; i < n; i++) {
      // Check if Alice can reach i
      let aliceCan = true;
      for (let j = a; j < i; j++) {
        if (heights[j] >= heights[i]) {
          aliceCan = false;
          break;
        }
      }

      // Check if Bob can reach i
      let bobCan = true;
      for (let j = b; j < i; j++) {
        if (heights[j] >= heights[i]) {
          bobCan = false;
          break;
        }
      }

      if (aliceCan && bobCan) {
        found = i;
        break;
      }
    }

    result.push(found);
  }

  return result;
}
```

```java
// Time: O(n² * q) | Space: O(1) - Too slow for constraints!
public int[] bruteForce(int[] heights, int[][] queries) {
    int n = heights.length;
    int[] result = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int a = queries[q][0];
        int b = queries[q][1];
        int start = Math.max(a, b);
        int found = -1;

        // Check each possible meeting point
        for (int i = start; i < n; i++) {
            // Check if Alice can reach i
            boolean aliceCan = true;
            for (int j = a; j < i; j++) {
                if (heights[j] >= heights[i]) {
                    aliceCan = false;
                    break;
                }
            }

            // Check if Bob can reach i
            boolean bobCan = true;
            for (int j = b; j < i; j++) {
                if (heights[j] >= heights[i]) {
                    bobCan = false;
                    break;
                }
            }

            if (aliceCan && bobCan) {
                found = i;
                break;
            }
        }

        result[q] = found;
    }

    return result;
}
```

</div>

This brute force is clearly impractical. We need to preprocess the "next taller building" information to answer queries efficiently.

## Optimized Approach

The key insight is that for a person at position `i` to reach position `j` (where `i < j`), all buildings between them must be shorter than the building at `j`. This means `j` must be the **next taller building** in the forward direction for the maximum height encountered so far.

**Core observations:**

1. The meeting point must be at or after `max(a, b)` (both must move forward)
2. The meeting point must be taller than both starting buildings
3. For efficient query answering, we can preprocess for each building: "What's the next building taller than me?"

**Optimal strategy:**

1. **Preprocessing**: For each building, find the next taller building to its right using a monotonic decreasing stack
2. **Query answering**: For query (a, b), we need to find the first building ≥ max(a,b) that's taller than both starting heights
3. **Binary lifting**: Since the "next taller" relationship forms a forest of trees, we can use binary lifting to jump efficiently to meeting points

**Why binary lifting works:**

- The "next taller" pointers create a directed graph where each node points to a taller node
- This graph is a forest of trees (actually a set of linked lists when considering only next taller)
- We can precompute `jump[i][k]` = the building we reach after 2^k jumps from i
- For a query, we need to find the lowest common ancestor in this tree structure

## Optimal Solution

We'll implement a solution using monotonic stack + binary lifting:

<div class="code-group">

```python
# Time: O((n + q) log n) | Space: O(n log n)
def leftmostBuildingQueries(heights, queries):
    n = len(heights)

    # Step 1: Preprocess next taller building for each index using monotonic stack
    next_taller = [-1] * n
    stack = []

    for i in range(n):
        # While current building is taller than stack top, set next_taller for stack top
        while stack and heights[i] > heights[stack[-1]]:
            idx = stack.pop()
            next_taller[idx] = i
        stack.append(i)

    # Step 2: Precompute binary lifting table
    LOG = (n).bit_length()  # Enough for up to n jumps
    jump = [[-1] * LOG for _ in range(n)]

    # Base case: 2^0 = 1 jump is just next_taller
    for i in range(n):
        jump[i][0] = next_taller[i]

    # Fill jump table: jump[i][k] = jump[jump[i][k-1]][k-1]
    for k in range(1, LOG):
        for i in range(n):
            if jump[i][k-1] != -1:
                jump[i][k] = jump[jump[i][k-1]][k-1]

    # Step 3: Helper function to find first building from i with height > target
    def find_first_taller(i, target_height):
        # If starting building is already taller, return it
        if heights[i] > target_height:
            return i

        # Try to jump to a taller building using binary lifting
        for k in reversed(range(LOG)):
            if jump[i][k] != -1 and heights[jump[i][k]] <= target_height:
                i = jump[i][k]

        # One more step to get to building taller than target
        i = jump[i][0] if i < n and jump[i][0] != -1 else -1
        return i

    # Step 4: Process queries
    result = []
    for a, b in queries:
        # Ensure a <= b for consistency
        if a > b:
            a, b = b, a

        # Case 1: Same starting building
        if a == b:
            result.append(a)
            continue

        # Case 2: a < b and heights[a] < heights[b]
        # Bob can stay at b, Alice can move to b if possible
        if a < b and heights[a] < heights[b]:
            result.append(b)
            continue

        # Case 3: b < a and heights[b] < heights[a]
        # Symmetric to case 2
        if b < a and heights[b] < heights[a]:
            result.append(a)
            continue

        # Case 4: Need to find a common taller building
        # Start from the rightmost building (max index)
        start_idx = max(a, b)
        target_height = max(heights[a], heights[b])

        # Find first building from start_idx that's taller than target_height
        meeting_point = find_first_taller(start_idx, target_height)
        result.append(meeting_point)

    return result
```

```javascript
// Time: O((n + q) log n) | Space: O(n log n)
function leftmostBuildingQueries(heights, queries) {
  const n = heights.length;

  // Step 1: Preprocess next taller building for each index
  const nextTaller = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const idx = stack.pop();
      nextTaller[idx] = i;
    }
    stack.push(i);
  }

  // Step 2: Precompute binary lifting table
  const LOG = Math.ceil(Math.log2(n + 1));
  const jump = Array.from({ length: n }, () => new Array(LOG).fill(-1));

  // Base case: 2^0 = 1 jump
  for (let i = 0; i < n; i++) {
    jump[i][0] = nextTaller[i];
  }

  // Fill jump table
  for (let k = 1; k < LOG; k++) {
    for (let i = 0; i < n; i++) {
      if (jump[i][k - 1] !== -1) {
        jump[i][k] = jump[jump[i][k - 1]][k - 1];
      }
    }
  }

  // Step 3: Helper function to find first taller building
  function findFirstTaller(i, targetHeight) {
    // If current building is already taller
    if (heights[i] > targetHeight) {
      return i;
    }

    // Binary lifting to jump as far as possible while height <= target
    for (let k = LOG - 1; k >= 0; k--) {
      if (jump[i][k] !== -1 && heights[jump[i][k]] <= targetHeight) {
        i = jump[i][k];
      }
    }

    // One more step to get taller than target
    i = i < n && jump[i][0] !== -1 ? jump[i][0] : -1;
    return i;
  }

  // Step 4: Process queries
  const result = [];
  for (const [a, b] of queries) {
    let alice = a,
      bob = b;

    // Ensure alice <= bob for consistency
    if (alice > bob) {
      [alice, bob] = [bob, alice];
    }

    // Case 1: Same building
    if (alice === bob) {
      result.push(alice);
      continue;
    }

    // Case 2: alice < bob and heights[alice] < heights[bob]
    if (alice < bob && heights[alice] < heights[bob]) {
      result.push(bob);
      continue;
    }

    // Case 3: Need to find common taller building
    const startIdx = Math.max(a, b);
    const targetHeight = Math.max(heights[a], heights[b]);

    const meetingPoint = findFirstTaller(startIdx, targetHeight);
    result.push(meetingPoint);
  }

  return result;
}
```

```java
// Time: O((n + q) log n) | Space: O(n log n)
public int[] leftmostBuildingQueries(int[] heights, int[][] queries) {
    int n = heights.length;

    // Step 1: Preprocess next taller building
    int[] nextTaller = new int[n];
    Arrays.fill(nextTaller, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && heights[i] > heights[stack.peek()]) {
            int idx = stack.pop();
            nextTaller[idx] = i;
        }
        stack.push(i);
    }

    // Step 2: Binary lifting preprocessing
    int LOG = 32 - Integer.numberOfLeadingZeros(n); // ceil(log2(n + 1))
    int[][] jump = new int[n][LOG];
    for (int[] row : jump) Arrays.fill(row, -1);

    // Base case
    for (int i = 0; i < n; i++) {
        jump[i][0] = nextTaller[i];
    }

    // Fill jump table
    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i < n; i++) {
            if (jump[i][k - 1] != -1) {
                jump[i][k] = jump[jump[i][k - 1]][k - 1];
            }
        }
    }

    // Step 3: Helper function
    java.util.function.BiFunction<Integer, Integer, Integer> findFirstTaller = (i, targetHeight) -> {
        if (heights[i] > targetHeight) return i;

        // Binary lifting
        int current = i;
        for (int k = LOG - 1; k >= 0; k--) {
            if (jump[current][k] != -1 && heights[jump[current][k]] <= targetHeight) {
                current = jump[current][k];
            }
        }

        return (current < n && jump[current][0] != -1) ? jump[current][0] : -1;
    };

    // Step 4: Process queries
    int[] result = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        int a = queries[q][0];
        int b = queries[q][1];

        // Ensure a <= b
        if (a > b) {
            int temp = a;
            a = b;
            b = temp;
        }

        // Case 1: Same building
        if (a == b) {
            result[q] = a;
            continue;
        }

        // Case 2: a < b and heights[a] < heights[b]
        if (a < b && heights[a] < heights[b]) {
            result[q] = b;
            continue;
        }

        // Case 3: Need common taller building
        int startIdx = Math.max(queries[q][0], queries[q][1]);
        int targetHeight = Math.max(heights[a], heights[b]);

        result[q] = findFirstTaller.apply(startIdx, targetHeight);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + q) log n)**

- **Preprocessing next_taller**: O(n) using monotonic stack
- **Building jump table**: O(n log n) for binary lifting preprocessing
- **Processing queries**: O(q log n) since each query uses binary lifting which takes O(log n) time
- **Total**: O(n log n + q log n) = O((n + q) log n)

**Space Complexity: O(n log n)**

- `next_taller` array: O(n)
- `jump` table: O(n log n) for binary lifting
- Stack: O(n) in worst case
- **Total**: O(n log n) dominated by the jump table

## Common Mistakes

1. **Forgetting the edge case where one person can stay put**: If Alice starts at a shorter building than Bob's building and Alice's index < Bob's index, Alice can move to Bob's building. This is handled in Cases 2 and 3 of the query processing.

2. **Incorrect binary lifting implementation**: The most tricky part is the `find_first_taller` function. When jumping, we want to go as far as possible while the height is still ≤ target height, then take one more step. Getting the direction of the loop wrong (should be from largest k to smallest) is a common error.

3. **Not handling the case where start_idx itself is taller than target**: In `find_first_taller`, we need to check if `heights[i] > target_height` before attempting any jumps. Otherwise, we might incorrectly return -1 when the starting building itself is a valid meeting point.

4. **Assuming meeting point must be strictly after max(a,b)**: Actually, if `a != b`, the meeting point could be `max(a,b)` if that building is taller than both starting heights. Our solution handles this correctly by starting the search from `max(a,b)` inclusive.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Monotonic Stack for Next Greater Element**: Used in problems like [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) and [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/). The stack maintains decreasing heights to find the next taller building efficiently.

2. **Binary Lifting for Jump Queries**: Used in problems like [Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/) and for finding LCA in trees. Here, we adapt it to jump through "next taller" pointers.

3. **Range Queries with Preprocessing**: Similar to problems like [Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue/) which also uses monotonic stack to find visibility ranges.

## Key Takeaways

1. **When movement depends on a monotonic property** (like increasing heights), the "next greater element" pattern with monotonic stack is often applicable. This creates a directed graph that can be traversed efficiently.

2. **Binary lifting is powerful for jump queries** on static graphs/trees. If you need to answer "where do I end up after k steps?" queries efficiently, precomputing powers of 2 jumps reduces query time from O(k) to O(log k).

3. **Always check simple cases first** before applying complex logic. In this problem, cases where one person doesn't need to move (their building is already taller and to the right) should be handled separately for clarity and efficiency.

Related problems: [Number of Visible People in a Queue](/problem/number-of-visible-people-in-a-queue), [Furthest Building You Can Reach](/problem/furthest-building-you-can-reach)
