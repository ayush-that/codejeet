---
title: "How to Solve Number of Unequal Triplets in Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Unequal Triplets in Array. Easy difficulty, 73.3% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2028-04-14"
category: "dsa-patterns"
tags: ["number-of-unequal-triplets-in-array", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Number of Unequal Triplets in Array

This problem asks us to count triplets `(i, j, k)` where `i < j < k` and all three numbers at these indices are different from each other. While the problem is rated "Easy," it's interesting because it requires careful counting without double-counting, and it has a clever optimization that reduces the O(n³) brute force to O(n) using frequency counting.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 4, 2, 4, 3]`.

We need to count triplets `(i, j, k)` where:

1. `0 ≤ i < j < k < 5` (indices are in increasing order)
2. `nums[i]`, `nums[j]`, and `nums[k]` are all different

Let's think about how we can count these systematically. One approach is to fix the middle element `j` and count how many valid `i` and `k` values we can pair with it.

For `j = 2` (value = 2):

- Valid `i` values (indices < 2): indices 0 and 1, both with value 4
- Valid `k` values (indices > 2): indices 3 (value 4) and 4 (value 3)
- We need `nums[i] != nums[j]` (4 ≠ 2 ✓) and `nums[k] != nums[j]` (4 ≠ 2 ✓, 3 ≠ 2 ✓)
- But we also need `nums[i] != nums[k]` for the triplet to be valid

Let's check each combination:

- `i=0, k=3`: values (4, 2, 4) → nums[i] = nums[k] = 4 ✗
- `i=0, k=4`: values (4, 2, 3) → all different ✓
- `i=1, k=3`: values (4, 2, 4) → nums[i] = nums[k] = 4 ✗
- `i=1, k=4`: values (4, 2, 3) → all different ✓

So for `j=2`, we get 2 valid triplets.

We could continue this for all `j`, but there's a smarter way. Notice that if we know:

- `left_count`: number of elements before `j` with value different from `nums[j]`
- `right_count`: number of elements after `j` with value different from `nums[j]`

Then for each `j`, the number of valid triplets with `j` as the middle element is `left_count × right_count`. Wait, not exactly — we also need to ensure `nums[i] ≠ nums[k]`. But if we're careful about how we count, we can make this work.

Actually, here's the key insight: For each unique value `x` in the array, let `count[x]` be its frequency. The total number of triplets where all three values are different equals:

```
Total = Σ (count[a] × count[b] × count[c]) for all distinct a, b, c
```

But we need to be careful about ordering. Since `i < j < k`, we need to consider all permutations of which value goes in which position. For three distinct values `a`, `b`, `c`, there are 3! = 6 ways to assign them to positions `(i, j, k)` while maintaining `i < j < k`. Actually, for any three distinct values, there's exactly one ordering where `i < j < k` (the sorted order).

So the formula becomes: For every combination of three distinct values `(a, b, c)` where `a < b < c` (to avoid counting the same set multiple times), add `count[a] × count[b] × count[c]` to the total.

Let's apply this to our example `[4, 4, 2, 4, 3]`:

- Value 2: count = 1
- Value 3: count = 1
- Value 4: count = 3

Distinct value combinations: (2, 3, 4)

- Contribution: 1 × 1 × 3 = 3

But wait, we manually counted 2 triplets earlier. Let's list all valid triplets:

1. (0, 2, 4): values (4, 2, 3) ✓
2. (1, 2, 4): values (4, 2, 3) ✓
3. (2, 3, 4): values (2, 4, 3) ✓

There are actually 3 triplets! Our manual count for `j=2` missed the triplet where `j=3`.

## Brute Force Approach

The most straightforward solution is to check all possible triplets `(i, j, k)` with `i < j < k` and verify if all three values are distinct:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def unequalTriplets_brute(nums):
    n = len(nums)
    count = 0

    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            # Early check: if nums[i] == nums[j], skip all k
            if nums[i] == nums[j]:
                continue
            for k in range(j + 1, n):
                # Check if all three are distinct
                if nums[i] != nums[k] and nums[j] != nums[k]:
                    count += 1
    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function unequalTripletsBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Early check: if nums[i] == nums[j], skip all k
      if (nums[i] === nums[j]) continue;
      for (let k = j + 1; k < n; k++) {
        // Check if all three are distinct
        if (nums[i] !== nums[k] && nums[j] !== nums[k]) {
          count++;
        }
      }
    }
  }
  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int unequalTripletsBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Early check: if nums[i] == nums[j], skip all k
            if (nums[i] == nums[j]) continue;
            for (int k = j + 1; k < n; k++) {
                // Check if all three are distinct
                if (nums[i] != nums[k] && nums[j] != nums[k]) {
                    count++;
                }
            }
        }
    }
    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 1000, O(n³) is too slow (up to 1 billion operations). We need a more efficient approach.

## Optimal Solution

The optimal solution uses frequency counting. The key insight is that for three distinct values `a`, `b`, `c`, the number of triplets with these values is `count[a] × count[b] × count[c]`. We need to sum this over all combinations of three distinct values.

We can compute this efficiently by iterating through the frequency counts and using a combinatorial approach. Here's the algorithm:

1. Count frequencies of each value using a hash map
2. Get the list of frequencies
3. For each middle value `j` in the frequency list, we can think of:
   - `left`: sum of frequencies of values before current
   - `mid`: frequency of current value
   - `right`: sum of frequencies of values after current
4. For each value, the number of triplets where this value is the "middle" (in terms of value, not index) is `left × mid × right`
5. Sum these contributions for all values

Wait, that's not quite right because the values don't need to be in sorted order by value in the triplet — only the indices need to be in order. Actually, for any three distinct values in positions `i < j < k`, the values themselves can be in any order.

Here's the correct combinatorial reasoning: For each unique value `v` with frequency `f`, we can consider it as the "middle" element in terms of counting. Let:

- `left`: total count of elements with values different from `v` that appear before elements with value `v` in our iteration
- `right`: total count of elements with values different from `v` that appear after

Actually, there's an even simpler approach: We iterate through the array and maintain counts of:

- How many elements we've seen so far (prefix count)
- How many of those were different from current element
- How many elements remain that are different from current

But the cleanest solution is to use the frequency map approach with three nested loops over distinct values:

<div class="code-group">

```python
# Time: O(n + m³) where m is number of distinct values | Space: O(m)
def unequalTriplets(nums):
    from collections import Counter

    # Step 1: Count frequency of each number
    count_map = Counter(nums)

    # Step 2: Get list of frequencies
    frequencies = list(count_map.values())
    n_distinct = len(frequencies)

    # Step 3: Initialize result
    result = 0

    # Step 4: Iterate over all combinations of three distinct values
    # We use three nested loops to pick frequencies of three different values
    for i in range(n_distinct):
        for j in range(i + 1, n_distinct):
            for k in range(j + 1, n_distinct):
                # For this combination of three distinct values,
                # the number of triplets is product of their frequencies
                result += frequencies[i] * frequencies[j] * frequencies[k]

    return result
```

```javascript
// Time: O(n + m³) where m is number of distinct values | Space: O(m)
function unequalTriplets(nums) {
  // Step 1: Count frequency of each number
  const countMap = new Map();
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Step 2: Get array of frequencies
  const frequencies = Array.from(countMap.values());
  const nDistinct = frequencies.length;

  // Step 3: Initialize result
  let result = 0;

  // Step 4: Iterate over all combinations of three distinct values
  // We use three nested loops to pick frequencies of three different values
  for (let i = 0; i < nDistinct; i++) {
    for (let j = i + 1; j < nDistinct; j++) {
      for (let k = j + 1; k < nDistinct; k++) {
        // For this combination of three distinct values,
        // the number of triplets is product of their frequencies
        result += frequencies[i] * frequencies[j] * frequencies[k];
      }
    }
  }

  return result;
}
```

```java
// Time: O(n + m³) where m is number of distinct values | Space: O(m)
public int unequalTriplets(int[] nums) {
    // Step 1: Count frequency of each number
    Map<Integer, Integer> countMap = new HashMap<>();
    for (int num : nums) {
        countMap.put(num, countMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Get array of frequencies
    List<Integer> frequencies = new ArrayList<>(countMap.values());
    int nDistinct = frequencies.size();

    // Step 3: Initialize result
    int result = 0;

    // Step 4: Iterate over all combinations of three distinct values
    // We use three nested loops to pick frequencies of three different values
    for (int i = 0; i < nDistinct; i++) {
        for (int j = i + 1; j < nDistinct; j++) {
            for (int k = j + 1; k < nDistinct; k++) {
                // For this combination of three distinct values,
                // the number of triplets is product of their frequencies
                result += frequencies.get(i) * frequencies.get(j) * frequencies.get(k);
            }
        }
    }

    return result;
}
```

</div>

Actually, we can do even better with O(n) time using a single pass approach. The idea is to maintain running counts as we iterate through distinct values in any order:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def unequalTriplets_optimal(nums):
    from collections import Counter

    # Count frequency of each value
    freq = Counter(nums)

    # We'll iterate through frequencies and maintain:
    # - left: count of elements processed so far
    # - result: total triplets count
    left = 0
    result = 0
    n = len(nums)

    # For each unique value with frequency f
    for f in freq.values():
        # right = remaining elements after considering current value
        right = n - left - f

        # Contribution of current value as the "middle" in terms of counting:
        # left * f * right gives triplets where:
        # - one element is from left group (different values)
        # - one element is current value
        # - one element is from right group (different values)
        result += left * f * right

        # Update left for next iteration
        left += f

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function unequalTriplets(nums) {
  // Count frequency of each value
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // We'll iterate through frequencies and maintain:
  // - left: count of elements processed so far
  // - result: total triplets count
  let left = 0;
  let result = 0;
  const n = nums.length;

  // For each unique value with frequency f
  for (const f of freq.values()) {
    // right = remaining elements after considering current value
    const right = n - left - f;

    // Contribution of current value as the "middle" in terms of counting:
    // left * f * right gives triplets where:
    // - one element is from left group (different values)
    // - one element is current value
    // - one element is from right group (different values)
    result += left * f * right;

    // Update left for next iteration
    left += f;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int unequalTriplets(int[] nums) {
    // Count frequency of each value
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // We'll iterate through frequencies and maintain:
    // - left: count of elements processed so far
    // - result: total triplets count
    int left = 0;
    int result = 0;
    int n = nums.length;

    // For each unique value with frequency f
    for (int f : freq.values()) {
        // right = remaining elements after considering current value
        int right = n - left - f;

        // Contribution of current value as the "middle" in terms of counting:
        // left * f * right gives triplets where:
        // - one element is from left group (different values)
        // - one element is current value
        // - one element is from right group (different values)
        result += left * f * right;

        // Update left for next iteration
        left += f;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map takes O(n) time
- Iterating through the frequency values takes O(m) time, where m is the number of distinct values (m ≤ n)
- Overall O(n) time

**Space Complexity: O(n)**

- The frequency map stores at most n entries in the worst case (when all elements are distinct)
- We use O(1) additional space for variables `left`, `result`, etc.

## Common Mistakes

1. **Off-by-one errors in index comparisons**: When checking `i < j < k`, it's easy to write `j <= n` instead of `j < n`. Remember array indices are 0-based and go up to `n-1`.

2. **Forgetting that values need to be pairwise distinct**: Some candidates check only that `nums[i] != nums[j]` and `nums[j] != nums[k]`, forgetting that `nums[i] != nums[k]` is also required. All three comparisons are needed.

3. **Double-counting triplets**: When using combinatorial approaches, it's easy to count the same triplet multiple times. For example, if you iterate over all permutations of three distinct values without enforcing an ordering constraint (like `i < j < k` on the values themselves), you'll overcount.

4. **Inefficient brute force**: The most common mistake is implementing the O(n³) solution without realizing it's too slow for n=1000. Always consider constraints before coding.

## When You'll See This Pattern

This problem uses **frequency counting** and **combinatorial multiplication**, which appear in many counting problems:

1. **Count Good Triplets** (Easy): Similar structure but with additional conditions on the values. Uses nested loops but can be optimized with preprocessing.

2. **Number of Arithmetic Triplets** (Easy): Finding triplets satisfying `nums[k] - nums[j] == nums[j] - nums[i] == diff`. Can be solved with hash sets for O(n) time.

3. **Count Number of Bad Pairs** (Medium variations): Counting pairs or triplets that don't satisfy certain conditions, often solved by counting total possibilities minus good ones.

The pattern of "count frequency then compute combinations" is common when you need to count tuples satisfying certain equality/inequality conditions.

## Key Takeaways

1. **When counting tuples with conditions on values**, consider using frequency maps first. Converting the problem from "positions in array" to "counts of values" often simplifies combinatorial reasoning.

2. **The product rule in combinatorics**: If you need to count combinations of items from disjoint groups, multiply the sizes of the groups. Here, `left × mid × right` counts ways to pick one element from each of three groups.

3. **Look for O(n) optimizations** when brute force is O(n³). Often, maintaining running counts or using hash maps can reduce the complexity dramatically.

Related problems: [Count Good Triplets](/problem/count-good-triplets), [Count Square Sum Triples](/problem/count-square-sum-triples), [Number of Arithmetic Triplets](/problem/number-of-arithmetic-triplets)
