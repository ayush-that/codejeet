---
title: "How to Solve Distribute Repeating Integers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Distribute Repeating Integers. Hard difficulty, 40.4% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Backtracking, Bit Manipulation."
date: "2029-10-26"
category: "dsa-patterns"
tags: ["distribute-repeating-integers", "array", "hash-table", "dynamic-programming", "hard"]
---

# How to Solve Distribute Repeating Integers

This problem asks whether we can distribute integers from an array `nums` to satisfy customer orders specified in `quantity`. The challenge comes from having multiple identical integers (up to 50 unique values) and needing to match them against customer orders of varying sizes. What makes this problem tricky is that we need to consider both which integers go to which customers and how to group identical integers efficiently.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [1, 2, 2, 3, 3, 3]
quantity = [2, 3]
```

**Step 1: Count frequencies**
We have:

- 1 appears 1 time
- 2 appears 2 times
- 3 appears 3 times

**Step 2: Sort quantity in descending order**
`quantity = [3, 2]` (already sorted)

**Step 3: Try to assign largest order first**
Customer 1 needs 3 items. Which numbers can provide 3 items?

- 3 appears 3 times → perfect match!
  Assign all 3's to customer 1.

**Step 4: Update available counts**
Remaining numbers:

- 1 appears 1 time
- 2 appears 2 times

**Step 5: Assign next order**
Customer 2 needs 2 items. Which numbers can provide 2 items?

- 2 appears 2 times → perfect match!
  Assign both 2's to customer 2.

**Step 6: Check result**
All customers satisfied → return `true`.

Now consider a trickier case:

```
nums = [1, 1, 2, 2, 2, 2]
quantity = [3, 2]
```

We have:

- 1 appears 2 times
- 2 appears 4 times

Sorted quantity: `[3, 2]`

Try largest order first (3):

- Can't use 1's (only 2 available)
- Use 2's (4 available) → assign 3 of them

Remaining: 1 appears 2 times, 2 appears 1 time

Next order (2):

- Can use 1's (2 available) → assign both 1's

All satisfied → `true`

The key insight: we need to try different combinations because sometimes using a number for a smaller order might be better than using it for a larger one.

## Brute Force Approach

A naive approach would try all possible assignments:

1. For each customer, try assigning every possible subset of numbers
2. Check if any assignment satisfies all customers

The problem with this approach is the combinatorial explosion. With `m` customers and potentially many numbers, the number of possible assignments grows exponentially. Even with pruning, this would be too slow for the constraints (up to 10 customers and 50 unique numbers).

What makes brute force particularly bad here is that we have identical numbers. We don't need to distinguish between individual 2's, only how many 2's we have. A naive candidate might try to treat each number as distinct, leading to unnecessary complexity.

## Optimized Approach

The key insight is to use **backtracking with memoization and pruning**:

1. **Count frequencies**: Instead of working with the raw array, count how many times each unique number appears. This reduces the state space dramatically.

2. **Sort orders descending**: Always try to satisfy the largest orders first. This provides better pruning because:
   - Large orders are harder to satisfy
   - If we can't satisfy a large order, we can fail early
   - Satisfying large orders first leaves more flexibility for smaller ones

3. **Use backtracking with memoization**:
   - State = (available counts, current order index)
   - Try assigning the current order to each available number that has enough copies
   - If assignment succeeds, recursively try to satisfy remaining orders
   - Use memoization to avoid recomputing the same state

4. **Prune aggressively**:
   - If the sum of remaining orders exceeds total available numbers, fail
   - If any order exceeds the maximum available count of any number, fail
   - Sort numbers by frequency to try most promising options first

5. **Use bitmask for memoization**: Since there are at most 50 unique numbers, we can represent the state of available counts as a tuple or use a bitmask for the orders.

## Optimal Solution

The solution uses backtracking with memoization. We first count frequencies, sort everything in descending order, then try to assign orders recursively with pruning.

<div class="code-group">

```python
# Time: O(m * 2^m + n) where m is number of customers, n is length of nums
# Space: O(2^m + n) for memoization and frequency map
class Solution:
    def canDistribute(self, nums: List[int], quantity: List[int]) -> bool:
        # Step 1: Count frequencies of each number
        freq = {}
        for num in nums:
            freq[num] = freq.get(num, 0) + 1

        # Step 2: Get just the frequencies (we don't care about the actual numbers)
        counts = list(freq.values())

        # Step 3: Sort quantity in descending order - try largest orders first
        quantity.sort(reverse=True)

        # Step 4: Sort counts in descending order - try numbers with most copies first
        counts.sort(reverse=True)

        # Step 5: Create memoization dictionary
        # Key: (index in counts, tuple of remaining orders)
        # Value: True/False whether this state is solvable
        memo = {}

        def backtrack(count_idx, remaining_orders):
            # Base case: all orders satisfied
            if not remaining_orders:
                return True

            # If we've used all counts but still have orders, impossible
            if count_idx >= len(counts):
                return False

            # Create a key for memoization
            state_key = (count_idx, tuple(remaining_orders))
            if state_key in memo:
                return memo[state_key]

            current_count = counts[count_idx]

            # Try to assign subsets of remaining orders to current count
            # We need to try all subsets because we might assign multiple orders to one count
            m = len(remaining_orders)

            # Try all subsets of remaining orders (using bitmask)
            for mask in range(1, 1 << m):
                # Calculate total quantity needed for this subset
                total_needed = 0
                new_remaining = []

                for i in range(m):
                    if mask & (1 << i):
                        total_needed += remaining_orders[i]
                    else:
                        new_remaining.append(remaining_orders[i])

                # Check if current count can satisfy this subset
                if total_needed <= current_count:
                    # Try with next count and remaining orders
                    if backtrack(count_idx + 1, new_remaining):
                        memo[state_key] = True
                        return True

            # Try not using current count at all
            result = backtrack(count_idx + 1, remaining_orders)
            memo[state_key] = result
            return result

        return backtrack(0, quantity)
```

```javascript
// Time: O(m * 2^m + n) where m is number of customers, n is length of nums
// Space: O(2^m + n) for memoization and frequency map
/**
 * @param {number[]} nums
 * @param {number[]} quantity
 * @return {boolean}
 */
var canDistribute = function (nums, quantity) {
  // Step 1: Count frequencies of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Get just the frequencies
  const counts = Array.from(freq.values());

  // Step 3: Sort quantity in descending order
  quantity.sort((a, b) => b - a);

  // Step 4: Sort counts in descending order
  counts.sort((a, b) => b - a);

  // Step 5: Create memoization map
  const memo = new Map();

  // Helper function for backtracking
  const backtrack = (countIdx, remainingOrders) => {
    // Base case: all orders satisfied
    if (remainingOrders.length === 0) {
      return true;
    }

    // If we've used all counts but still have orders, impossible
    if (countIdx >= counts.length) {
      return false;
    }

    // Create a key for memoization
    const stateKey = `${countIdx},${remainingOrders.join(",")}`;
    if (memo.has(stateKey)) {
      return memo.get(stateKey);
    }

    const currentCount = counts[countIdx];
    const m = remainingOrders.length;

    // Try all subsets of remaining orders
    for (let mask = 1; mask < 1 << m; mask++) {
      let totalNeeded = 0;
      const newRemaining = [];

      // Calculate total needed for this subset and collect remaining orders
      for (let i = 0; i < m; i++) {
        if (mask & (1 << i)) {
          totalNeeded += remainingOrders[i];
        } else {
          newRemaining.push(remainingOrders[i]);
        }
      }

      // Check if current count can satisfy this subset
      if (totalNeeded <= currentCount) {
        // Try with next count and remaining orders
        if (backtrack(countIdx + 1, newRemaining)) {
          memo.set(stateKey, true);
          return true;
        }
      }
    }

    // Try not using current count at all
    const result = backtrack(countIdx + 1, remainingOrders);
    memo.set(stateKey, result);
    return result;
  };

  return backtrack(0, quantity);
};
```

```java
// Time: O(m * 2^m + n) where m is number of customers, n is length of nums
// Space: O(2^m + n) for memoization and frequency map
class Solution {
    public boolean canDistribute(int[] nums, int[] quantity) {
        // Step 1: Count frequencies of each number
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Get just the frequencies
        List<Integer> counts = new ArrayList<>(freq.values());

        // Step 3: Sort quantity in descending order
        Integer[] quantityArr = new Integer[quantity.length];
        for (int i = 0; i < quantity.length; i++) {
            quantityArr[i] = quantity[i];
        }
        Arrays.sort(quantityArr, Collections.reverseOrder());

        // Step 4: Sort counts in descending order
        Collections.sort(counts, Collections.reverseOrder());

        // Step 5: Create memoization map
        Map<String, Boolean> memo = new HashMap<>();

        return backtrack(0, quantityArr, counts, memo);
    }

    private boolean backtrack(int countIdx, Integer[] remainingOrders,
                              List<Integer> counts, Map<String, Boolean> memo) {
        // Base case: all orders satisfied
        if (remainingOrders.length == 0) {
            return true;
        }

        // If we've used all counts but still have orders, impossible
        if (countIdx >= counts.size()) {
            return false;
        }

        // Create a key for memoization
        String stateKey = countIdx + "," + Arrays.toString(remainingOrders);
        if (memo.containsKey(stateKey)) {
            return memo.get(stateKey);
        }

        int currentCount = counts.get(countIdx);
        int m = remainingOrders.length;

        // Try all subsets of remaining orders
        for (int mask = 1; mask < (1 << m); mask++) {
            int totalNeeded = 0;
            List<Integer> newRemaining = new ArrayList<>();

            // Calculate total needed for this subset and collect remaining orders
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) {
                    totalNeeded += remainingOrders[i];
                } else {
                    newRemaining.add(remainingOrders[i]);
                }
            }

            // Check if current count can satisfy this subset
            if (totalNeeded <= currentCount) {
                // Convert list to array for recursive call
                Integer[] newRemainingArr = newRemaining.toArray(new Integer[0]);
                // Try with next count and remaining orders
                if (backtrack(countIdx + 1, newRemainingArr, counts, memo)) {
                    memo.put(stateKey, true);
                    return true;
                }
            }
        }

        // Try not using current count at all
        boolean result = backtrack(countIdx + 1, remainingOrders, counts, memo);
        memo.put(stateKey, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m \* 2^m + n)

- Counting frequencies: O(n)
- Sorting: O(m log m + k log k) where k ≤ 50 (unique numbers)
- Backtracking: We try all subsets of orders for each count. In worst case, for m orders, we try 2^m subsets. With memoization, we avoid recomputation, leading to O(m \* 2^m)

**Space Complexity:** O(2^m + n)

- Frequency map: O(k) where k ≤ 50
- Memoization: O(2^m) states in worst case
- Recursion stack: O(m) depth

The constraints make this feasible: m ≤ 10 (customers), so 2^m ≤ 1024, and m \* 2^m ≤ 10240 operations.

## Common Mistakes

1. **Not sorting orders descending**: Trying to satisfy small orders first can lead to failure even when a solution exists. Large orders have fewer possible assignments, so trying them first provides better pruning.

2. **Treating identical numbers as distinct**: This exponentially increases the search space. The key insight is that we only care about counts of each unique number.

3. **Forgetting to try not using a count at all**: Sometimes the optimal solution skips a count entirely to save it for later orders. Our solution handles this by trying the "don't use current count" case after trying all subsets.

4. **Insufficient pruning**: Without checking if sum of remaining orders exceeds available numbers, the algorithm can waste time exploring impossible paths. Always add this check: if sum(remaining_orders) > sum(remaining_counts), return false.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Subset Sum with Constraints** (LeetCode 698: Partition to K Equal Sum Subsets)
   - Similar to distributing numbers into groups with constraints
   - Uses backtracking with pruning

2. **Assignment Problems with Identical Items** (LeetCode 1655: Distribute Repeating Integers - this problem!)
   - When you have groups of identical items to assign
   - Frequency counting is crucial

3. **Bitmask DP for Subset Problems** (LeetCode 464: Can I Win)
   - Using bitmask to represent subsets
   - Memoization on subset state

The core technique is **backtracking with memoization on a reduced state space**. Recognize this pattern when:

- You need to assign items to groups
- Items have categories/types (identical within type)
- The search space seems large but constraints are small

## Key Takeaways

1. **Count frequencies first**: When dealing with identical items, always count frequencies to reduce the state space. Don't treat identical items as distinct.

2. **Try largest/hardest constraints first**: In assignment problems, always satisfy the most restrictive requirements first for better pruning.

3. **Use bitmask for small subsets**: When the number of groups/orders is small (≤ 20), consider using bitmask to represent subsets efficiently.

4. **Memoize on meaningful state**: The memoization key should capture the essential information - which items are available and which orders remain.

[Practice this problem on CodeJeet](/problem/distribute-repeating-integers)
