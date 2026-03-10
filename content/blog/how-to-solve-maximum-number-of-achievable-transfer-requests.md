---
title: "How to Solve Maximum Number of Achievable Transfer Requests — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Achievable Transfer Requests. Hard difficulty, 64.6% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Enumeration."
date: "2028-03-25"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-achievable-transfer-requests",
    "array",
    "backtracking",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Maximum Number of Achievable Transfer Requests

This problem asks us to find the maximum number of transfer requests we can satisfy while keeping all buildings with a net-zero change in employees. Each request moves one employee from one building to another, and we can choose any subset of requests. The challenge is that satisfying requests creates dependencies—approving one request changes the employee counts in two buildings, which affects which other requests we can approve. This makes it a combinatorial optimization problem where we need to explore subsets while tracking state changes.

## Visual Walkthrough

Let's trace through a small example: `n = 3`, `requests = [[0,1],[1,2],[2,0],[1,0]]`

We have 3 buildings (0, 1, 2) and 4 transfer requests:

- Request 0: Employee moves from building 0 → 1
- Request 1: Employee moves from building 1 → 2
- Request 2: Employee moves from building 2 → 0
- Request 3: Employee moves from building 1 → 0

We need to find the largest subset where every building ends with the same number of employees it started with.

**Step 1: Consider all possible subsets**
There are 2⁴ = 16 possible subsets of requests. We need to check which ones maintain net-zero change.

**Step 2: Check a valid subset**
Take subset {0, 1, 2}:

- Request 0: Building 0 loses 1, Building 1 gains 1
- Request 1: Building 1 loses 1, Building 2 gains 1
- Request 2: Building 2 loses 1, Building 0 gains 1

Net changes: Building 0: -1 + 1 = 0, Building 1: +1 - 1 = 0, Building 2: +1 - 1 = 0 ✓
This subset of size 3 is valid.

**Step 3: Check if we can do better**
Try all 4 requests:

- Add request 3: Building 1 loses 1, Building 0 gains 1
  New net changes: Building 0: 0 + 1 = 1, Building 1: 0 - 1 = -1, Building 2: 0 = 0 ✗
  Not all buildings have net-zero change.

The maximum valid subset size is 3.

## Brute Force Approach

The brute force approach is to generate all possible subsets of requests (2ᵐ where m = number of requests), check if each subset results in net-zero change for all buildings, and track the maximum size of valid subsets.

Why this is too slow: With m up to 16 in the constraints, 2¹⁶ = 65,536 subsets is manageable, but the problem's constraints actually allow m up to 16, which makes brute force feasible. However, a candidate might think they need to be smarter because 2ᵐ grows exponentially. The key insight is that with m ≤ 16, we can actually use brute force via bitmask enumeration.

What makes this problem interesting is that while it looks like it requires complex optimization, the constraints allow a straightforward brute force solution. A naive candidate might try greedy approaches (like always taking requests that help balance buildings), but these fail because local optimal choices don't guarantee global optimality.

## Optimized Approach

Since m ≤ 16, we can use **bitmask enumeration** to try all subsets efficiently. Each bitmask from 0 to (1 << m) - 1 represents a subset where bit i is 1 if request i is included.

For each subset:

1. Initialize an array `balance` of size n to track net employee changes
2. For each request i in the subset:
   - Decrement `balance[from_i]` (building loses an employee)
   - Increment `balance[to_i]` (building gains an employee)
3. Check if all values in `balance` are 0
4. If yes, update maximum with the number of set bits in the mask

The optimization comes from:

- Using bit manipulation to efficiently iterate through subsets
- Early termination isn't really possible since we need to check all subsets
- The approach is optimal given the constraints

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^m * (m + n)) where m = len(requests), n = num buildings
# Space: O(n) for the balance array
def maximumRequests(self, n: int, requests: List[List[int]]) -> int:
    m = len(requests)
    max_requests = 0

    # Try all possible subsets using bitmask from 0 to 2^m - 1
    for mask in range(1 << m):
        # Count number of set bits (requests in this subset)
        request_count = bin(mask).count("1")

        # Early pruning: if current subset can't beat our best, skip
        if request_count <= max_requests:
            continue

        # Track net change for each building
        balance = [0] * n

        # Process each request in the current subset
        for i in range(m):
            # Check if request i is included in current subset
            if mask & (1 << i):
                from_building, to_building = requests[i]
                balance[from_building] -= 1  # Employee leaves
                balance[to_building] += 1    # Employee arrives

        # Check if all buildings have net-zero change
        if all(b == 0 for b in balance):
            max_requests = request_count

    return max_requests
```

```javascript
// Time: O(2^m * (m + n)) where m = requests.length, n = num buildings
// Space: O(n) for the balance array
var maximumRequests = function (n, requests) {
  const m = requests.length;
  let maxRequests = 0;

  // Try all possible subsets using bitmask from 0 to 2^m - 1
  for (let mask = 0; mask < 1 << m; mask++) {
    // Count number of set bits (requests in this subset)
    const requestCount = countBits(mask);

    // Early pruning: if current subset can't beat our best, skip
    if (requestCount <= maxRequests) {
      continue;
    }

    // Track net change for each building
    const balance = new Array(n).fill(0);

    // Process each request in the current subset
    for (let i = 0; i < m; i++) {
      // Check if request i is included in current subset
      if (mask & (1 << i)) {
        const [fromBuilding, toBuilding] = requests[i];
        balance[fromBuilding]--; // Employee leaves
        balance[toBuilding]++; // Employee arrives
      }
    }

    // Check if all buildings have net-zero change
    if (balance.every((b) => b === 0)) {
      maxRequests = requestCount;
    }
  }

  return maxRequests;
};

// Helper function to count set bits in a number
function countBits(num) {
  let count = 0;
  while (num > 0) {
    count += num & 1;
    num >>= 1;
  }
  return count;
}
```

```java
// Time: O(2^m * (m + n)) where m = requests.length, n = num buildings
// Space: O(n) for the balance array
class Solution {
    public int maximumRequests(int n, int[][] requests) {
        int m = requests.length;
        int maxRequests = 0;

        // Try all possible subsets using bitmask from 0 to 2^m - 1
        for (int mask = 0; mask < (1 << m); mask++) {
            // Count number of set bits (requests in this subset)
            int requestCount = Integer.bitCount(mask);

            // Early pruning: if current subset can't beat our best, skip
            if (requestCount <= maxRequests) {
                continue;
            }

            // Track net change for each building
            int[] balance = new int[n];

            // Process each request in the current subset
            for (int i = 0; i < m; i++) {
                // Check if request i is included in current subset
                if ((mask & (1 << i)) != 0) {
                    int fromBuilding = requests[i][0];
                    int toBuilding = requests[i][1];
                    balance[fromBuilding]--;  // Employee leaves
                    balance[toBuilding]++;    // Employee arrives
                }
            }

            // Check if all buildings have net-zero change
            boolean allZero = true;
            for (int b : balance) {
                if (b != 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero) {
                maxRequests = requestCount;
            }
        }

        return maxRequests;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2ᵐ × (m + n))

- We iterate through 2ᵐ possible subsets
- For each subset, we process up to m requests to update the balance array
- Then we check n buildings to verify all balances are zero
- With m ≤ 16 and n ≤ 20, this is efficient: 2¹⁶ × (16 + 20) ≈ 2.3 million operations

**Space Complexity:** O(n)

- We need an array of size n to track building balances
- The bitmask iteration uses O(1) extra space beyond the input

## Common Mistakes

1. **Trying greedy approaches**: Candidates might try to satisfy requests in some order (e.g., always take requests that help balance buildings), but this fails because the problem requires finding a subset, not a sequence. The optimal solution often requires taking a cycle of requests that cancel each other out.

2. **Forgetting to check all buildings for zero balance**: Some candidates check if the sum of balances is zero, but this isn't sufficient. Each individual building must have net-zero change. Example: Building 0: +2, Building 1: -2, Building 2: 0 has sum zero but isn't valid.

3. **Inefficient subset generation**: Without bitmask enumeration, candidates might use recursion or array copying to generate subsets, which adds overhead. Bitmask enumeration is cleaner and faster for m ≤ 16.

4. **Missing the early pruning optimization**: Checking `if requestCount <= maxRequests` before processing a subset can save significant time by skipping subsets that can't possibly improve our answer.

## When You'll See This Pattern

This bitmask enumeration pattern appears in problems where:

1. The input size is small (typically n ≤ 20)
2. You need to consider all subsets of elements
3. Each subset has a property that can be checked efficiently

Related LeetCode problems:

- **78. Subsets** - Direct subset generation, though usually done with backtracking
- **464. Can I Win** - Uses bitmask to represent game state with memoization
- **698. Partition to K Equal Sum Subsets** - Bitmask DP to track which elements are used
- **1349. Maximum Students Taking Exam** - Bitmask represents seating arrangement in a row

The key is recognizing when brute force over subsets is feasible due to small input size, and using bitmask for efficient subset representation.

## Key Takeaways

1. **When n ≤ 20, think bitmask**: Small constraint sizes often signal that exponential solutions (2ⁿ) are acceptable. Bitmask provides an efficient way to represent and iterate through subsets.

2. **Balance problems often require checking all combinations**: When you need to maintain equilibrium (like net-zero change here), greedy approaches usually fail because decisions are interdependent.

3. **Prune early when possible**: Even in brute force, simple checks like comparing subset size with current best can significantly reduce runtime.

[Practice this problem on CodeJeet](/problem/maximum-number-of-achievable-transfer-requests)
