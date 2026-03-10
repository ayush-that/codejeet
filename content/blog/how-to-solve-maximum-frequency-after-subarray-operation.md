---
title: "How to Solve Maximum Frequency After Subarray Operation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Frequency After Subarray Operation. Medium difficulty, 30.9% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Greedy, Enumeration."
date: "2029-08-15"
category: "dsa-patterns"
tags:
  [
    "maximum-frequency-after-subarray-operation",
    "array",
    "hash-table",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Maximum Frequency After Subarray Operation

This problem asks us to maximize the frequency of the most common element in an array after performing exactly one operation: choosing any subarray and adding the same integer `x` to all elements in that subarray. The challenge lies in the fact that we can choose both the subarray AND the value to add, which creates a two-dimensional optimization problem that we need to solve efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 1]` with `k = 2`.

**Initial state:** The most frequent element is `1` with frequency 2.

**What can we do?** We can choose any subarray and add any integer `x` to it. Our goal is to make as many elements equal as possible.

**Key insight:** If we want to make elements equal, we should focus on making them equal to some target value. For any target value `t`, we can check which elements can become `t` with our operation.

Let's try making all elements equal to `2`:

- Element 1 at index 0: Needs +1 to become 2
- Element 2 at index 1: Already 2 (needs +0)
- Element 3 at index 2: Needs -1 to become 2
- Element 1 at index 3: Needs +1 to become 2

We can only add the same value `x` to a contiguous subarray. So we need to find a subarray where all elements need the same adjustment (or close enough) to reach our target.

**Better approach:** Instead of trying all possible targets, notice that if we want elements `a` and `b` to become equal after our operation, they must satisfy: `a + x = b + y` where `x` and `y` are the amounts we add to them. Since we can only add the same value to a contiguous subarray, this means `a` and `b` must either:

1. Both be outside the subarray (no change)
2. Both be inside the subarray (both get `+x`)
3. One inside, one outside (different changes)

For case 2 (both inside), `a + x = b + x` implies `a = b` - so they must already be equal!
For case 1 (both outside), they must already be equal.
For case 3 (one inside, one outside), we have `a + x = b` or `a = b + x`.

This leads to the crucial realization: **The only way to make two different values equal is if one is inside the subarray and one is outside, and their difference equals `x`.**

## Brute Force Approach

A naive solution would try all possible:

1. Subarrays (O(n²) possibilities)
2. Values of `x` (potentially infinite, but bounded by the range of values we care about)
3. For each combination, count how many elements become equal

This would be O(n³) or worse, which is far too slow for typical constraints (n up to 10⁵).

Even a slightly better brute force might try: for each pair of indices `(i, j)` as potential subarray boundaries, and for each distinct value in the array as a potential target, check how many elements can become that target. This is still O(n³) in worst case.

The problem with brute force is it doesn't leverage the structure of the problem. We need a smarter way to think about which elements can become equal.

## Optimized Approach

The key insight comes from rearranging the condition for two elements to become equal. Let's say we want elements with values `a` and `b` to become equal after the operation:

1. If both are outside the subarray: `a` must equal `b`
2. If both are inside the subarray: `a + x = b + x` ⇒ `a = b`
3. If `a` is inside and `b` is outside: `a + x = b` ⇒ `x = b - a`
4. If `a` is outside and `b` is inside: `a = b + x` ⇒ `x = a - b`

Cases 1 and 2 require the elements to already be equal, which doesn't help us increase frequency beyond what we already have.

Cases 3 and 4 are interesting: they allow us to make different values equal! The condition is that the difference between the values must equal `x`, the amount we add to the subarray.

This leads to our optimization strategy:

- For each pair of values `(a, b)` where `a ≠ b`, we can potentially make them equal if we put one inside the subarray and one outside
- The value we need to add is `x = b - a` (if `a` is inside) or `x = a - b` (if `b` is inside)
- We need to find the maximum number of pairs `(a, b)` that can be made equal with the same `x` value

Wait, there's an even cleaner way to think about this. Let's fix a target value `t`. An element with value `v` can become `t` if:

- It's outside the subarray and `v = t`
- It's inside the subarray and `v + x = t` ⇒ `x = t - v`

So for a fixed `t`, each element needs either:

- No change (if it's already `t` and outside subarray)
- A specific adjustment `t - v` (if it's inside subarray)

The problem reduces to: for a fixed `t`, find the maximum number of elements that can have their required adjustments consistent with being in a single contiguous subarray.

Actually, there's a known trick for this type of problem. Let's define for each element `v`:

- If `v == t`, it contributes +1 if outside subarray
- If `v != t`, it can contribute +1 if inside subarray AND we add exactly `t - v` to that subarray

But we can only have one `x` value for our entire subarray! So all elements inside must have the same `t - v` value.

This is getting complex. Let me think differently...

**The breakthrough realization:** Consider transforming the array. For each index `i`, instead of looking at `nums[i]`, let's consider what happens if we want to make everything equal to some value. Actually, there's a standard approach for "add to subarray" problems: consider differences.

Let `diff[i] = nums[i] - nums[i-1]` for `i > 0`. When we add `x` to a subarray `[l, r]`, only `diff[l]` and `diff[r+1]` change (if they exist). This is a clue that we might want to think in terms of differences.

But there's actually a simpler approach that works. Notice that the operation preserves the relative differences within the subarray. If we look at pairs of elements:

For any two indices `i < j`:

- If both are outside subarray: `nums[i]` and `nums[j]` don't change
- If both are inside: both get `+x`, so their difference `nums[j] - nums[i]` doesn't change
- If `i` inside, `j` outside: `nums[j] - (nums[i] + x)` = `(nums[j] - nums[i]) - x`
- If `i` outside, `j` inside: `(nums[j] + x) - nums[i]` = `(nums[j] - nums[i]) + x`

So the only pairs whose relative difference changes are those that straddle the subarray boundary!

This means: if we want `nums[i]` and `nums[j]` to become equal and they're not already equal, one must be inside and one outside, and the subarray boundary must be between them.

Now here's the clever part: Let's fix a value `d` that will be the difference between an element inside and an element outside. Actually, let me reframe...

**Final insight:** Let's say we want to maximize the frequency of value `t`. Consider the array of "deltas" needed: `delta[i] = t - nums[i]`. Elements with `delta[i] = 0` (already equal to `t`) are good. Elements with `delta[i] = c` (some constant) can be made equal if we put them in a subarray and add `c` to that subarray.

So for a fixed `t`, we want to find the largest set of indices where:

- All have `delta[i] = 0` (these can be outside OR inside the subarray)
- OR all have `delta[i] = c` for some fixed `c` (these must be inside a contiguous subarray)

And we can choose which indices with `delta[i] = 0` to count (they can be anywhere).

This becomes: for each possible `c`, find the maximum number of indices with `delta[i] = c` that lie in some contiguous subarray, plus all indices with `delta[i] = 0`.

We need to do this for all `t`. But `t` can be any of the values in `nums` (after potential addition), which are `nums[i] + c` for some `c`.

So the algorithm is:

1. For each unique value `a` in nums
2. For each other value `b` such that `b - a` is within some reasonable range
3. Let `c = b - a`
4. Find the maximum number of indices with value `b` in a contiguous subarray
5. Add the count of indices with value `a` (these can be anywhere)

We need to do this efficiently. We can preprocess for each value, the positions where it occurs.

## Optimal Solution

The most efficient approach uses a hash map to store positions of each value, then for each value `a`, we check values `b` that could be made equal by adding `b - a` to a subarray containing `b`'s positions.

Actually, let's implement the clean version: For each pair of values `(a, b)`, the maximum frequency we can get is:

- Count of `a` (these can be anywhere)
- Plus the maximum number of `b`'s in a contiguous subarray (these will be inside the subarray we add `b-a` to)

We need to find, for each value `b`, the maximum number of occurrences in any contiguous subarray. This is easy: just group consecutive occurrences.

<div class="code-group">

```python
# Time: O(n^2) in worst case, but O(n * m) where m is number of unique values
# Space: O(n)
def maxFrequency(nums):
    from collections import defaultdict

    # Group indices by value
    indices_by_value = defaultdict(list)
    for i, num in enumerate(nums):
        indices_by_value[num].append(i)

    # For each value, find maximum consecutive occurrences
    max_consecutive = defaultdict(int)
    for val, indices in indices_by_value.items():
        if not indices:
            continue

        # Find longest consecutive run of this value
        max_len = 1
        current_len = 1
        for i in range(1, len(indices)):
            if indices[i] == indices[i-1] + 1:
                current_len += 1
                max_len = max(max_len, current_len)
            else:
                current_len = 1

        max_consecutive[val] = max_len

    # Try all pairs of values
    values = list(indices_by_value.keys())
    n = len(values)
    answer = 0

    for i in range(n):
        a = values[i]
        count_a = len(indices_by_value[a])

        # Case 1: Don't use any b, just a's
        answer = max(answer, count_a)

        # Case 2: Try to convert some b's to a
        for j in range(n):
            if i == j:
                continue

            b = values[j]
            # We would add (a - b) to a subarray containing b's
            # We can take all a's (anywhere) plus consecutive b's
            answer = max(answer, count_a + max_consecutive[b])

    return answer
```

```javascript
// Time: O(n^2) in worst case | Space: O(n)
function maxFrequency(nums) {
  // Group indices by value
  const indicesByValue = new Map();
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (!indicesByValue.has(num)) {
      indicesByValue.set(num, []);
    }
    indicesByValue.get(num).push(i);
  }

  // For each value, find maximum consecutive occurrences
  const maxConsecutive = new Map();
  for (const [val, indices] of indicesByValue.entries()) {
    if (indices.length === 0) continue;

    // Find longest consecutive run of this value
    let maxLen = 1;
    let currentLen = 1;
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] === indices[i - 1] + 1) {
        currentLen++;
        maxLen = Math.max(maxLen, currentLen);
      } else {
        currentLen = 1;
      }
    }
    maxConsecutive.set(val, maxLen);
  }

  // Try all pairs of values
  const values = Array.from(indicesByValue.keys());
  let answer = 0;

  for (let i = 0; i < values.length; i++) {
    const a = values[i];
    const countA = indicesByValue.get(a).length;

    // Case 1: Don't use any b, just a's
    answer = Math.max(answer, countA);

    // Case 2: Try to convert some b's to a
    for (let j = 0; j < values.length; j++) {
      if (i === j) continue;

      const b = values[j];
      // We would add (a - b) to a subarray containing b's
      // We can take all a's (anywhere) plus consecutive b's
      answer = Math.max(answer, countA + maxConsecutive.get(b));
    }
  }

  return answer;
}
```

```java
// Time: O(n^2) in worst case | Space: O(n)
import java.util.*;

public class Solution {
    public int maxFrequency(int[] nums) {
        // Group indices by value
        Map<Integer, List<Integer>> indicesByValue = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            indicesByValue.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        // For each value, find maximum consecutive occurrences
        Map<Integer, Integer> maxConsecutive = new HashMap<>();
        for (Map.Entry<Integer, List<Integer>> entry : indicesByValue.entrySet()) {
            List<Integer> indices = entry.getValue();
            if (indices.isEmpty()) continue;

            // Find longest consecutive run of this value
            int maxLen = 1;
            int currentLen = 1;
            for (int i = 1; i < indices.size(); i++) {
                if (indices.get(i) == indices.get(i-1) + 1) {
                    currentLen++;
                    maxLen = Math.max(maxLen, currentLen);
                } else {
                    currentLen = 1;
                }
            }
            maxConsecutive.put(entry.getKey(), maxLen);
        }

        // Try all pairs of values
        List<Integer> values = new ArrayList<>(indicesByValue.keySet());
        int answer = 0;

        for (int i = 0; i < values.size(); i++) {
            int a = values.get(i);
            int countA = indicesByValue.get(a).size();

            // Case 1: Don't use any b, just a's
            answer = Math.max(answer, countA);

            // Case 2: Try to convert some b's to a
            for (int j = 0; j < values.size(); j++) {
                if (i == j) continue;

                int b = values.get(j);
                // We would add (a - b) to a subarray containing b's
                // We can take all a's (anywhere) plus consecutive b's
                answer = Math.max(answer, countA + maxConsecutive.get(b));
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m²) where n is the length of `nums` and m is the number of unique values. In the worst case where all values are unique, m = n, giving O(n²). However, in practice with integer arrays, m is often much smaller than n.

**Space Complexity:** O(n) to store the indices for each value.

The quadratic factor comes from checking all pairs of unique values. We can optimize this by noting that we only care about values `b` that appear consecutively in the array, since `max_consecutive[b]` is what matters. But in worst case, this is still O(m²).

## Common Mistakes

1. **Forgetting that elements outside the subarray don't change**: Some candidates try to make all elements equal by adding to the entire array, forgetting that elements outside remain unchanged.

2. **Assuming the subarray must contain the target value**: The subarray doesn't need to contain the value we're making everything equal to. We can add just the right amount to convert elements in the subarray to our target value.

3. **Overlooking that elements with the target value can be anywhere**: Elements that already equal our target value can be inside OR outside the subarray - we count all of them.

4. **Trying to optimize the wrong thing**: Some candidates focus on finding the longest consecutive run of any value, but forget that we can combine it with all occurrences of another value.

## When You'll See This Pattern

This "add to subarray" pattern appears in several problems:

1. **Maximum Subarray Sum problems**: While not identical, the idea of choosing a contiguous subarray to modify is similar to Kadane's algorithm problems.

2. **Array transformation problems**: Problems where you can perform operations on subarrays (like adding, subtracting, or flipping) often use similar contiguous segment reasoning.

3. **Frequency maximization problems**: Problems like "Longest Consecutive Sequence" (LeetCode 128) share the idea of looking for consecutive occurrences, though the operation is different.

## Key Takeaways

1. **Operations on contiguous subarrays** often preserve relationships within the subarray and only change relationships across boundaries.

2. When you can **add the same value to a subarray**, differences between elements inside the subarray remain unchanged.

3. For frequency maximization, consider **pairs of values** that could be made equal through the operation, and look for the best "source" and "target" values.

4. **Preprocessing consecutive runs** of values is often useful when operations can only affect contiguous elements.

[Practice this problem on CodeJeet](/problem/maximum-frequency-after-subarray-operation)
