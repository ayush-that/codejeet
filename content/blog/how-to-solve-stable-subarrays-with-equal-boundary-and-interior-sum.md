---
title: "How to Solve Stable Subarrays With Equal Boundary and Interior Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stable Subarrays With Equal Boundary and Interior Sum. Medium difficulty, 25.9% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2030-02-18"
category: "dsa-patterns"
tags:
  [
    "stable-subarrays-with-equal-boundary-and-interior-sum",
    "array",
    "hash-table",
    "prefix-sum",
    "medium",
  ]
---

# How to Solve Stable Subarrays With Equal Boundary and Interior Sum

This problem asks us to find all subarrays of length ≥3 where the first and last elements are equal to each other AND equal to the sum of all elements strictly between them. What makes this problem interesting is that it combines prefix sums with hash map lookups in a non-obvious way—we're not just looking for a target sum, but for a specific relationship between boundary elements and interior sums.

## Visual Walkthrough

Let's trace through an example: `capacity = [1, 2, 3, 2, 1]`

We need to find all subarrays `[l..r]` where:

1. `r - l + 1 ≥ 3` (length at least 3)
2. `capacity[l] = capacity[r]`
3. `capacity[l] = sum(capacity[l+1..r-1])`

Let's check some possibilities:

- `[0..2]`: `[1, 2, 3]` → `1 ≠ 3` ❌ fails immediately
- `[0..3]`: `[1, 2, 3, 2]` → `1 ≠ 2` ❌ fails
- `[0..4]`: `[1, 2, 3, 2, 1]` → `1 = 1` ✓, interior sum = `2 + 3 + 2 = 7`, `1 ≠ 7` ❌
- `[1..3]`: `[2, 3, 2]` → `2 = 2` ✓, interior sum = `3`, `2 ≠ 3` ❌
- `[1..4]`: `[2, 3, 2, 1]` → `2 ≠ 1` ❌

Wait, are there any valid subarrays here? Let's try `[2, 1, 1, 2]`:

- `[0..2]`: `[2, 1, 1]` → `2 ≠ 1` ❌
- `[0..3]`: `[2, 1, 1, 2]` → `2 = 2` ✓, interior sum = `1 + 1 = 2`, `2 = 2` ✓ ✓ This works!

The key insight: For a valid subarray `[l..r]`, we need:
`capacity[l] = capacity[r] = sum(capacity[l+1..r-1])`

This means: `sum(capacity[l+1..r-1]) = capacity[l]`

Which we can rewrite as: `prefix[r-1] - prefix[l] = capacity[l]`

Where `prefix[i]` is the sum of elements from index `0` to `i`.

## Brute Force Approach

The brute force solution checks every possible subarray of length ≥3:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countStableSubarrays(capacity):
    n = len(capacity)
    count = 0

    # Check all possible subarrays
    for l in range(n):
        for r in range(l + 2, n):  # r must be at least l+2 for length ≥3
            # Check if boundaries are equal
            if capacity[l] != capacity[r]:
                continue

            # Calculate interior sum
            interior_sum = 0
            for i in range(l + 1, r):
                interior_sum += capacity[i]

            # Check if interior sum equals boundary value
            if interior_sum == capacity[l]:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countStableSubarrays(capacity) {
  const n = capacity.length;
  let count = 0;

  // Check all possible subarrays
  for (let l = 0; l < n; l++) {
    for (let r = l + 2; r < n; r++) {
      // r must be at least l+2 for length ≥3
      // Check if boundaries are equal
      if (capacity[l] !== capacity[r]) {
        continue;
      }

      // Calculate interior sum
      let interiorSum = 0;
      for (let i = l + 1; i < r; i++) {
        interiorSum += capacity[i];
      }

      // Check if interior sum equals boundary value
      if (interiorSum === capacity[l]) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countStableSubarrays(int[] capacity) {
    int n = capacity.length;
    int count = 0;

    // Check all possible subarrays
    for (int l = 0; l < n; l++) {
        for (int r = l + 2; r < n; r++) {  // r must be at least l+2 for length ≥3
            // Check if boundaries are equal
            if (capacity[l] != capacity[r]) {
                continue;
            }

            // Calculate interior sum
            int interiorSum = 0;
            for (int i = l + 1; i < r; i++) {
                interiorSum += capacity[i];
            }

            // Check if interior sum equals boundary value
            if (interiorSum == capacity[l]) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is too slow:** With three nested loops, this runs in O(n³) time. For n up to 10⁵ (typical constraint), this would take far too long—approximately 10¹⁵ operations, which is completely infeasible.

## Optimized Approach

The key insight comes from rearranging the condition. For a valid subarray `[l..r]`:

1. `capacity[l] = capacity[r]` (boundaries equal)
2. `capacity[l] = sum(capacity[l+1..r-1])` (boundary equals interior sum)

From condition 2: `sum(capacity[l+1..r-1]) = capacity[l]`

Using prefix sums: `prefix[r-1] - prefix[l] = capacity[l]`

Rearranging: `prefix[r-1] = prefix[l] + capacity[l]`

So for each `r`, we're looking for `l` such that:

- `l ≤ r-2` (to ensure length ≥3)
- `capacity[l] = capacity[r]` (boundaries equal)
- `prefix[r-1] = prefix[l] + capacity[l]`

This suggests a two-pass approach:

1. First pass: For each index `i`, compute `prefix[i] + capacity[i]`
2. Second pass: For each `r`, look for `l` values that satisfy all conditions

But we can do this in one pass using a hash map! For each position `i`, we can:

1. Check if `prefix[i-1]` equals `prefix[l] + capacity[l]` for some previous `l` with `capacity[l] = capacity[i]`
2. Track `prefix[l] + capacity[l]` values for each boundary value

Actually, let's think differently. For a fixed `r`, we need `l` where:

- `capacity[l] = capacity[r]`
- `prefix[l] + capacity[l] = prefix[r-1]`

So if we group indices by their `capacity` value, and for each group track the `prefix[i] + capacity[i]` values we've seen, we can count valid pairs efficiently.

Wait, there's an even cleaner approach! Let me rewrite the condition:

`prefix[r-1] - prefix[l] = capacity[l]`

`prefix[r-1] = prefix[l] + capacity[l]`

So for each `r`, we want to count `l` such that:

1. `l ≤ r-2` (for length ≥3)
2. `capacity[l] = capacity[r]`
3. `prefix[l] + capacity[l] = prefix[r-1]`

We can use a hash map where the key is `(capacity_value, prefix_sum_plus_capacity)` and the value is the count of such indices `l`.

Actually, since `capacity[l]` is part of the key, we can have a nested structure: `map[capacity_value][prefix_sum_plus_capacity] = count`.

## Optimal Solution

Here's the efficient O(n) solution using hash maps:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countStableSubarrays(capacity):
    n = len(capacity)
    if n < 3:
        return 0

    count = 0
    prefix_sum = 0
    # Map: capacity_value -> {prefix_sum_plus_capacity: count}
    from collections import defaultdict
    value_map = defaultdict(lambda: defaultdict(int))

    for i in range(n):
        # For current position i as right boundary (r)
        # We need to check if there are valid left boundaries l < i-1
        # such that capacity[l] = capacity[i] and
        # prefix[l] + capacity[l] = prefix[i-1]

        if i >= 2:  # Need at least 3 elements: l, interior, r
            # prefix[i-1] is the sum up to i-1
            # We're looking for l where prefix[l] + capacity[l] = prefix[i-1]
            target = prefix_sum - capacity[i-1]  # prefix[i-1] = current_prefix - capacity[i-1]

            # Count how many l we've seen with capacity[l] = capacity[i]
            # and prefix[l] + capacity[l] = target
            if capacity[i] in value_map and target in value_map[capacity[i]]:
                count += value_map[capacity[i]][target]

        # Update prefix sum for next iteration
        prefix_sum += capacity[i]

        # Store current index as potential left boundary for future
        # What we store: prefix[l] + capacity[l] for l = i
        # But only if i could be a valid left boundary (i <= n-3)
        if i <= n - 3:
            key = prefix_sum  # prefix[i] + capacity[i] = (prefix_sum - capacity[i]) + capacity[i] = prefix_sum
            value_map[capacity[i]][key] += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countStableSubarrays(capacity) {
  const n = capacity.length;
  if (n < 3) return 0;

  let count = 0;
  let prefixSum = 0;
  // Map: capacity_value -> Map(prefix_sum_plus_capacity -> count)
  const valueMap = new Map();

  for (let i = 0; i < n; i++) {
    // For current position i as right boundary (r)
    // We need to check if there are valid left boundaries l < i-1
    // such that capacity[l] = capacity[i] and
    // prefix[l] + capacity[l] = prefix[i-1]

    if (i >= 2) {
      // Need at least 3 elements: l, interior, r
      // prefix[i-1] is the sum up to i-1
      // We're looking for l where prefix[l] + capacity[l] = prefix[i-1]
      const target = prefixSum - capacity[i - 1]; // prefix[i-1] = current_prefix - capacity[i-1]

      // Count how many l we've seen with capacity[l] = capacity[i]
      // and prefix[l] + capacity[l] = target
      if (valueMap.has(capacity[i])) {
        const innerMap = valueMap.get(capacity[i]);
        if (innerMap.has(target)) {
          count += innerMap.get(target);
        }
      }
    }

    // Update prefix sum for next iteration
    prefixSum += capacity[i];

    // Store current index as potential left boundary for future
    // What we store: prefix[l] + capacity[l] for l = i
    // But only if i could be a valid left boundary (i <= n-3)
    if (i <= n - 3) {
      const key = prefixSum; // prefix[i] + capacity[i] = (prefixSum - capacity[i]) + capacity[i] = prefixSum

      if (!valueMap.has(capacity[i])) {
        valueMap.set(capacity[i], new Map());
      }
      const innerMap = valueMap.get(capacity[i]);
      innerMap.set(key, (innerMap.get(key) || 0) + 1);
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

public int countStableSubarrays(int[] capacity) {
    int n = capacity.length;
    if (n < 3) return 0;

    int count = 0;
    long prefixSum = 0;  // Use long to avoid overflow
    // Map: capacity_value -> Map(prefix_sum_plus_capacity -> count)
    Map<Integer, Map<Long, Integer>> valueMap = new HashMap<>();

    for (int i = 0; i < n; i++) {
        // For current position i as right boundary (r)
        // We need to check if there are valid left boundaries l < i-1
        // such that capacity[l] = capacity[i] and
        // prefix[l] + capacity[l] = prefix[i-1]

        if (i >= 2) {  // Need at least 3 elements: l, interior, r
            // prefix[i-1] is the sum up to i-1
            // We're looking for l where prefix[l] + capacity[l] = prefix[i-1]
            long target = prefixSum - capacity[i-1];  // prefix[i-1] = current_prefix - capacity[i-1]

            // Count how many l we've seen with capacity[l] = capacity[i]
            // and prefix[l] + capacity[l] = target
            if (valueMap.containsKey(capacity[i])) {
                Map<Long, Integer> innerMap = valueMap.get(capacity[i]);
                if (innerMap.containsKey(target)) {
                    count += innerMap.get(target);
                }
            }
        }

        // Update prefix sum for next iteration
        prefixSum += capacity[i];

        // Store current index as potential left boundary for future
        // What we store: prefix[l] + capacity[l] for l = i
        // But only if i could be a valid left boundary (i <= n-3)
        if (i <= n - 3) {
            long key = prefixSum;  // prefix[i] + capacity[i] = (prefixSum - capacity[i]) + capacity[i] = prefixSum

            valueMap.putIfAbsent(capacity[i], new HashMap<>());
            Map<Long, Integer> innerMap = valueMap.get(capacity[i]);
            innerMap.put(key, innerMap.getOrDefault(key, 0) + 1);
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array
- Each iteration does O(1) hash map operations (insertions and lookups)
- The nested hash map structure doesn't change the asymptotic complexity since we're doing constant work per element

**Space Complexity:** O(n)

- In the worst case, we might store an entry for each index in our hash maps
- The outer map has at most n distinct capacity values
- The inner maps collectively store at most n entries (one per index that could be a left boundary)

## Common Mistakes

1. **Off-by-one errors with indices:** The condition requires `l ≤ r-2` for length ≥3, but it's easy to use `l < r` or `l ≤ r-1`. Always test with the smallest valid case (length 3).

2. **Incorrect prefix sum calculation:** Remember that `prefix[i]` is the sum from index 0 to i inclusive. The interior sum from `l+1` to `r-1` is `prefix[r-1] - prefix[l]`, not `prefix[r] - prefix[l]`.

3. **Forgetting to check boundary equality first:** Some candidates check the sum condition first, which is less efficient. Checking `capacity[l] = capacity[r]` first eliminates many invalid pairs quickly in the brute force approach.

4. **Integer overflow:** With large arrays and values, prefix sums can overflow 32-bit integers. Always use 64-bit integers (long in Java, no issue in Python).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix Sum + Hash Map:** Like "Subarray Sum Equals K" (LeetCode 560), where we use a hash map to track prefix sums and count subarrays with a target sum. Here, the target is dynamic based on boundary values.

2. **Two-Sum with Constraints:** Similar to "Two Sum" (LeetCode 1) but with additional conditions on the pair of indices.

3. **Grouping by Value:** Like "Number of Good Pairs" (LeetCode 1512), where we group indices by their values and count valid pairs within each group.

The key insight is transforming the condition into a form that allows O(1) lookups using hash maps: `prefix[r-1] = prefix[l] + capacity[l]`.

## Key Takeaways

1. **Transform conditions into lookup problems:** When a problem involves relationships between pairs of indices, try to rearrange the condition into a form like `f(l) = g(r)` that allows hash map lookups.

2. **Prefix sums are powerful for subarray sums:** Any subarray sum can be expressed as the difference of two prefix sums. This transforms O(n) sum calculations into O(1) lookups.

3. **Group indices by value when needed:** When you need pairs with equal values, maintain separate data structures (like hash maps) for each distinct value to efficiently find matching pairs.

[Practice this problem on CodeJeet](/problem/stable-subarrays-with-equal-boundary-and-interior-sum)
