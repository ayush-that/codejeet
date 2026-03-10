---
title: "How to Solve Odd Even Jump — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Odd Even Jump. Hard difficulty, 41.1% acceptance rate. Topics: Array, Dynamic Programming, Stack, Sorting, Monotonic Stack."
date: "2027-05-29"
category: "dsa-patterns"
tags: ["odd-even-jump", "array", "dynamic-programming", "stack", "hard"]
---

# How to Solve Odd Even Jump

This problem asks us to count how many starting positions in an array allow us to reach the end by following specific jumping rules. On odd-numbered jumps (1st, 3rd, 5th, etc.), you must jump to the smallest index `j > i` where `arr[j] >= arr[i]`. On even-numbered jumps (2nd, 4th, 6th, etc.), you must jump to the largest index `j > i` where `arr[j] <= arr[i]`. The challenge is determining which starting positions can eventually reach the last element through this alternating jump pattern.

What makes this problem tricky is that each jump depends on future elements in a specific sorted order, and whether you can reach the end from a position depends on whether you can reach the end from the position you jump to next. This creates a chain of dependencies that requires careful analysis.

## Visual Walkthrough

Let's trace through a small example: `arr = [10, 13, 12, 14, 15]`

We'll work backwards from the end since the last element is always a "good" starting index (you're already at the end).

**Index 4 (value 15, last element):**

- Odd jump from here: No elements to the right, so can't jump → `odd[4] = False`
- Even jump from here: No elements to the right, so can't jump → `even[4] = False`
- But since we're at the last element, we count this as a good starting index.

**Index 3 (value 14):**

- Odd jump: Need smallest `j > 3` with `arr[j] >= 14`. Only index 4 (value 15) qualifies.
  - Jump to index 4. Since this is an odd jump, we check `even[4]` (next jump would be even).
  - `even[4] = False`, so `odd[3] = False`
- Even jump: Need largest `j > 3` with `arr[j] <= 14`. No elements satisfy this.
  - `even[3] = False`
- Starting from index 3: First jump is odd, check `odd[3] = False` → not a good starting index.

**Index 2 (value 12):**

- Odd jump: Need smallest `j > 2` with `arr[j] >= 12`. Options: index 3 (14) and 4 (15). Smallest index is 3.
  - Jump to index 3. Check `even[3] = False` → `odd[2] = False`
- Even jump: Need largest `j > 2` with `arr[j] <= 12`. No elements satisfy (13, 14, 15 all > 12).
  - `even[2] = False`
- Starting from index 2: Check `odd[2] = False` → not a good starting index.

**Index 1 (value 13):**

- Odd jump: Need smallest `j > 1` with `arr[j] >= 13`. Options: index 3 (14) and 4 (15). Smallest index is 3.
  - Jump to index 3. Check `even[3] = False` → `odd[1] = False`
- Even jump: Need largest `j > 1` with `arr[j] <= 13`. Options: index 2 (12). That's the only one.
  - Jump to index 2. Since this is an even jump, we check `odd[2]` (next jump would be odd).
  - `odd[2] = False` → `even[1] = False`
- Starting from index 1: Check `odd[1] = False` → not a good starting index.

**Index 0 (value 10):**

- Odd jump: Need smallest `j > 0` with `arr[j] >= 10`. All indices qualify. Smallest index is 1.
  - Jump to index 1. Check `even[1] = False` → `odd[0] = False`
- Even jump: Need largest `j > 0` with `arr[j] <= 10`. No elements satisfy (all > 10).
  - `even[0] = False`
- Starting from index 0: Check `odd[0] = False` → not a good starting index.

Only index 4 is a good starting index. The answer is 1.

This walkthrough reveals the key insight: we need to work backwards and for each position, determine where we jump next on odd and even jumps, then check if that next position can reach the end.

## Brute Force Approach

A brute force approach would try every starting position and simulate the jumps until we either reach the end or get stuck. For each starting index `i`:

1. Set `current = i`, `jump_count = 1`
2. While `current` is not the last index:
   - If `jump_count` is odd: Find the smallest index `j > current` with `arr[j] >= arr[current]`
   - If `jump_count` is even: Find the largest index `j > current` with `arr[j] <= arr[current]`
   - If no such `j` exists, we're stuck → not a good starting index
   - Otherwise, set `current = j` and increment `jump_count`
3. If we reach the last index, count this starting position

The problem with this approach is efficiency. For each starting position, we might traverse nearly the entire array for each jump. In the worst case (strictly increasing array), from position 0 we'd check positions 1 through n-1 for the first jump, then positions 2 through n-1 for the second, etc. This gives us O(n³) time complexity, which is far too slow for the typical constraints (n up to 2×10⁴).

Even with some optimizations like precomputing jump destinations, the brute force would still be O(n²), which is borderline for n=20,000 (400 million operations).

## Optimized Approach

The key insight is that we can solve this efficiently using **dynamic programming with monotonic stacks**. Here's the step-by-step reasoning:

1. **Work backwards**: Since whether we can reach the end from position `i` depends on whether we can reach the end from the position we jump to next, we should process from right to left. The last element is trivially a good starting point.

2. **Two DP arrays**: We need `odd[i]` = can we reach the end from position `i` if the next jump is odd? And `even[i]` = can we reach the end from position `i` if the next jump is even?

3. **State transition**:
   - `odd[i] = even[next_odd_jump]` (if we make an odd jump from `i` to `j`, the next jump from `j` will be even)
   - `even[i] = odd[next_even_jump]` (if we make an even jump from `i` to `j`, the next jump from `j` will be odd)

4. **Finding next jumps efficiently**: This is the core challenge. For position `i`:
   - Next odd jump: Smallest index `j > i` with `arr[j] >= arr[i]`
   - Next even jump: Largest index `j > i` with `arr[j] <= arr[i]`

   We can find these using **monotonic stacks** after sorting indices by value. When we process indices in sorted order, we can use a stack to find the "next greater or equal element" and "next smaller or equal element" for each index.

5. **Algorithm outline**:
   - Create sorted lists of indices by value (for odd jumps) and by value descending (for even jumps)
   - Use monotonic stacks to find next odd/even jump destinations for each index
   - Process indices from right to left, using DP to determine `odd[i]` and `even[i]`
   - Count starting indices where `odd[i]` is true (first jump is always odd)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def oddEvenJumps(arr):
    n = len(arr)
    if n == 0:
        return 0

    # Step 1: Create sorted indices for odd jumps (ascending by value, then by index)
    # For odd jumps: we need smallest j > i with arr[j] >= arr[i]
    # Sorting by value ascending helps find the next greater or equal element
    sorted_indices_asc = sorted(range(n), key=lambda i: (arr[i], i))

    # Step 2: Create sorted indices for even jumps (descending by value, then by index)
    # For even jumps: we need largest j > i with arr[j] <= arr[i]
    # Sorting by value descending helps find the next smaller or equal element
    sorted_indices_desc = sorted(range(n), key=lambda i: (-arr[i], i))

    # Step 3: Find next odd jump for each index using monotonic stack
    next_odd = [-1] * n
    stack = []

    # Process indices in sorted order (ascending by value)
    for idx in sorted_indices_asc:
        # While stack has indices smaller than current index, pop them
        # The current index is the next greater or equal element for those indices
        while stack and stack[-1] < idx:
            prev_idx = stack.pop()
            next_odd[prev_idx] = idx
        stack.append(idx)

    # Step 4: Find next even jump for each index using monotonic stack
    next_even = [-1] * n
    stack = []

    # Process indices in sorted order (descending by value)
    for idx in sorted_indices_desc:
        # While stack has indices smaller than current index, pop them
        # The current index is the next smaller or equal element for those indices
        while stack and stack[-1] < idx:
            prev_idx = stack.pop()
            next_even[prev_idx] = idx
        stack.append(idx)

    # Step 5: DP from right to left
    odd = [False] * n  # odd[i] = can reach end from i if next jump is odd
    even = [False] * n  # even[i] = can reach end from i if next jump is even

    # Last element: can't make any jumps, but it's the end
    odd[n-1] = True
    even[n-1] = True

    good_starts = 1  # Last index is always a good starting point

    # Process from second last to first
    for i in range(n-2, -1, -1):
        # If we have a valid odd jump destination
        if next_odd[i] != -1:
            # Odd jump from i to next_odd[i], then next jump will be even
            odd[i] = even[next_odd[i]]

        # If we have a valid even jump destination
        if next_even[i] != -1:
            # Even jump from i to next_even[i], then next jump will be odd
            even[i] = odd[next_even[i]]

        # Starting from i, first jump is always odd
        if odd[i]:
            good_starts += 1

    return good_starts
```

```javascript
// Time: O(n log n) | Space: O(n)
function oddEvenJumps(arr) {
  const n = arr.length;
  if (n === 0) return 0;

  // Step 1: Create sorted indices for odd jumps (ascending by value, then by index)
  const sortedIndicesAsc = Array.from({ length: n }, (_, i) => i);
  sortedIndicesAsc.sort((a, b) => {
    if (arr[a] !== arr[b]) return arr[a] - arr[b];
    return a - b;
  });

  // Step 2: Create sorted indices for even jumps (descending by value, then by index)
  const sortedIndicesDesc = Array.from({ length: n }, (_, i) => i);
  sortedIndicesDesc.sort((a, b) => {
    if (arr[a] !== arr[b]) return arr[b] - arr[a];
    return a - b;
  });

  // Step 3: Find next odd jump for each index using monotonic stack
  const nextOdd = new Array(n).fill(-1);
  const stack = [];

  for (const idx of sortedIndicesAsc) {
    while (stack.length > 0 && stack[stack.length - 1] < idx) {
      const prevIdx = stack.pop();
      nextOdd[prevIdx] = idx;
    }
    stack.push(idx);
  }

  // Step 4: Find next even jump for each index using monotonic stack
  const nextEven = new Array(n).fill(-1);
  stack.length = 0; // Clear stack

  for (const idx of sortedIndicesDesc) {
    while (stack.length > 0 && stack[stack.length - 1] < idx) {
      const prevIdx = stack.pop();
      nextEven[prevIdx] = idx;
    }
    stack.push(idx);
  }

  // Step 5: DP from right to left
  const odd = new Array(n).fill(false);
  const even = new Array(n).fill(false);

  // Last element: can't make any jumps, but it's the end
  odd[n - 1] = true;
  even[n - 1] = true;

  let goodStarts = 1; // Last index is always a good starting point

  // Process from second last to first
  for (let i = n - 2; i >= 0; i--) {
    // If we have a valid odd jump destination
    if (nextOdd[i] !== -1) {
      // Odd jump from i to nextOdd[i], then next jump will be even
      odd[i] = even[nextOdd[i]];
    }

    // If we have a valid even jump destination
    if (nextEven[i] !== -1) {
      // Even jump from i to nextEven[i], then next jump will be odd
      even[i] = odd[nextEven[i]];
    }

    // Starting from i, first jump is always odd
    if (odd[i]) {
      goodStarts++;
    }
  }

  return goodStarts;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int oddEvenJumps(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;

        // Step 1: Create sorted indices for odd jumps (ascending by value, then by index)
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) indices[i] = i;

        // Sort for odd jumps: ascending by value, then by index
        Arrays.sort(indices, (a, b) -> {
            if (arr[a] != arr[b]) return arr[a] - arr[b];
            return a - b;
        });
        int[] nextOdd = getNextJump(indices);

        // Step 2: Create sorted indices for even jumps (descending by value, then by index)
        Arrays.sort(indices, (a, b) -> {
            if (arr[a] != arr[b]) return arr[b] - arr[a];
            return a - b;
        });
        int[] nextEven = getNextJump(indices);

        // Step 3: DP from right to left
        boolean[] odd = new boolean[n];
        boolean[] even = new boolean[n];

        // Last element: can't make any jumps, but it's the end
        odd[n-1] = true;
        even[n-1] = true;

        int goodStarts = 1; // Last index is always a good starting point

        // Process from second last to first
        for (int i = n - 2; i >= 0; i--) {
            // If we have a valid odd jump destination
            if (nextOdd[i] != -1) {
                // Odd jump from i to nextOdd[i], then next jump will be even
                odd[i] = even[nextOdd[i]];
            }

            // If we have a valid even jump destination
            if (nextEven[i] != -1) {
                // Even jump from i to nextEven[i], then next jump will be odd
                even[i] = odd[nextEven[i]];
            }

            // Starting from i, first jump is always odd
            if (odd[i]) {
                goodStarts++;
            }
        }

        return goodStarts;
    }

    // Helper method to find next jumps using monotonic stack
    private int[] getNextJump(Integer[] indices) {
        int n = indices.length;
        int[] next = new int[n];
        Arrays.fill(next, -1);
        Stack<Integer> stack = new Stack<>();

        for (int idx : indices) {
            // While stack has indices smaller than current index, pop them
            while (!stack.isEmpty() && stack.peek() < idx) {
                int prevIdx = stack.pop();
                next[prevIdx] = idx;
            }
            stack.push(idx);
        }

        return next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the indices twice: O(n log n) each, so O(2n log n) = O(n log n)
- Building next_odd and next_even with monotonic stacks: O(n) each
- DP pass from right to left: O(n)
- Dominated by the sorting steps: O(n log n)

**Space Complexity: O(n)**

- Sorted index arrays: O(n) each
- next_odd and next_even arrays: O(n) each
- odd and even DP arrays: O(n) each
- Stack: O(n) in worst case
- Total: O(5n) = O(n)

## Common Mistakes

1. **Not handling equal values correctly**: When values are equal, we must choose the smallest index for odd jumps and largest index for even jumps. The sort comparator must handle ties by comparing indices.

2. **Wrong jump logic in DP**: Mixing up `odd[i] = even[next_odd[i]]` vs `odd[i] = odd[next_odd[i]]`. Remember: if you make an odd jump from `i` to `j`, the next jump from `j` will be even, so you need to check `even[j]`.

3. **Forgetting the last element is always good**: The problem states you can start at any index, and if you start at the last index, you've already reached the end. Some candidates miss counting this.

4. **Using the wrong data structure for finding next jumps**: Trying to find next jumps with linear scan for each position gives O(n²) time. The monotonic stack approach after sorting is key to achieving O(n log n).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Next Greater Element**: Finding `next_odd[i]` is essentially "next greater or equal element to the right" problem. Similar to LeetCode 496 (Next Greater Element I) and 503 (Next Greater Element II).

2. **Monotonic Stack with Sorting**: The technique of sorting indices by value then using a monotonic stack appears in problems like LeetCode 975 (Odd Even Jump itself), 962 (Maximum Width Ramp), and 1124 (Longest Well-Performing Interval).

3. **DP with State Machines**: The alternating odd/even jumps create a two-state DP similar to problems like LeetCode 801 (Minimum Swaps To Make Sequences Increasing) where you track two states at each position.

## Key Takeaways

1. **When jumps depend on sorted order of values, sort indices by value**: This lets you process elements in an order that makes finding "next greater/smaller" efficient.

2. **Monotonic stacks efficiently find next greater/smaller elements**: After sorting indices by value, a monotonic stack can find the next index to the right in O(n) time.

3. **Work backwards for reachability problems**: When determining if you can reach the end from position `i`, it's often easier to work from the end backward, since the destination is fixed.

[Practice this problem on CodeJeet](/problem/odd-even-jump)
