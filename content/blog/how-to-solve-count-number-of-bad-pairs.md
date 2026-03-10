---
title: "How to Solve Count Number of Bad Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Bad Pairs. Medium difficulty, 54.2% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2026-03-12"
category: "dsa-patterns"
tags: ["count-number-of-bad-pairs", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Number of Bad Pairs

This problem asks us to count pairs of indices `(i, j)` where `i < j` but `j - i != nums[j] - nums[i]`. At first glance, this seems like a straightforward double loop problem, but the constraints make the brute force approach too slow. The key insight is recognizing that we can transform the condition into something that can be counted efficiently using a hash map.

**What makes this problem interesting:** The inequality `j - i != nums[j] - nums[i]` can be rearranged to `nums[j] - j != nums[i] - i`, which reveals that "good pairs" (where the equality holds) share the same value of `nums[k] - k`. This transformation turns a pairwise comparison problem into a counting problem.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 1, 3, 3]`

We want to count **bad pairs** - pairs where `j - i != nums[j] - nums[i]`.

First, let's understand what makes a pair "good" (not bad):

- A pair `(i, j)` is good if `j - i = nums[j] - nums[i]`
- Rearranging: `nums[j] - j = nums[i] - i`

So two indices form a good pair if their `nums[k] - k` values are equal.

Let's calculate `nums[k] - k` for each index:

- Index 0: `4 - 0 = 4`
- Index 1: `1 - 1 = 0`
- Index 2: `3 - 2 = 1`
- Index 3: `3 - 3 = 0`

Now let's find all good pairs (where `nums[k] - k` values match):

- Value 4: Only index 0 → 0 good pairs
- Value 0: Indices 1 and 3 → 1 good pair (1, 3)
- Value 1: Only index 2 → 0 good pairs

Total good pairs = 1

Total possible pairs with `i < j` = `n * (n-1) / 2` = `4 * 3 / 2 = 6`

Bad pairs = Total pairs - Good pairs = `6 - 1 = 5`

Let's verify by checking all 6 pairs:

1. (0,1): `1-0 = 1`, `nums[1]-nums[0] = 1-4 = -3` → Bad ✓
2. (0,2): `2-0 = 2`, `3-4 = -1` → Bad ✓
3. (0,3): `3-0 = 3`, `3-4 = -1` → Bad ✓
4. (1,2): `2-1 = 1`, `3-1 = 2` → Bad ✓
5. (1,3): `3-1 = 2`, `3-1 = 2` → Good ✗
6. (2,3): `3-2 = 1`, `3-3 = 0` → Bad ✓

Total bad pairs = 5 ✓

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j` and count how many satisfy `j - i != nums[j] - nums[i]`.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countBadPairs(nums):
    n = len(nums)
    bad_pairs = 0

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # Count if it's a bad pair
            if j - i != nums[j] - nums[i]:
                bad_pairs += 1

    return bad_pairs
```

```javascript
// Time: O(n²) | Space: O(1)
function countBadPairs(nums) {
  const n = nums.length;
  let badPairs = 0;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Count if it's a bad pair
      if (j - i !== nums[j] - nums[i]) {
        badPairs++;
      }
    }
  }

  return badPairs;
}
```

```java
// Time: O(n²) | Space: O(1)
public long countBadPairs(int[] nums) {
    int n = nums.length;
    long badPairs = 0;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Count if it's a bad pair
            if (j - i != nums[j] - nums[i]) {
                badPairs++;
            }
        }
    }

    return badPairs;
}
```

</div>

**Why this is insufficient:** With `n` up to 10⁵, the O(n²) approach would require up to 5 × 10⁹ operations, which is far too slow. We need an O(n) or O(n log n) solution.

## Optimized Approach

The key insight comes from rearranging the condition:

Original condition for a **bad** pair: `j - i != nums[j] - nums[i]`

Rearrange for a **good** pair: `j - i = nums[j] - nums[i]`
→ `nums[j] - j = nums[i] - i`

So two indices `i` and `j` form a **good pair** if their `nums[k] - k` values are equal.

**Strategy:**

1. Calculate `diff = nums[i] - i` for each element
2. Count how many times each `diff` value appears
3. For each group of `m` indices with the same `diff`, they form `m × (m-1) / 2` good pairs
4. Total pairs = `n × (n-1) / 2`
5. Bad pairs = Total pairs - Good pairs

**Why this works:** Instead of checking all O(n²) pairs, we group indices by their `diff` value. Indices in the same group can form good pairs with each other. The counting becomes O(n) with a hash map.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countBadPairs(nums):
    n = len(nums)
    freq = {}  # Hash map to store frequency of each diff value
    good_pairs = 0

    # Calculate diff = nums[i] - i for each element and count frequencies
    for i in range(n):
        diff = nums[i] - i

        # If we've seen this diff before, all previous indices with this diff
        # form good pairs with the current index
        if diff in freq:
            good_pairs += freq[diff]
            freq[diff] += 1
        else:
            freq[diff] = 1

    # Total possible pairs with i < j
    total_pairs = n * (n - 1) // 2

    # Bad pairs = Total pairs - Good pairs
    return total_pairs - good_pairs
```

```javascript
// Time: O(n) | Space: O(n)
function countBadPairs(nums) {
  const n = nums.length;
  const freq = new Map(); // Hash map to store frequency of each diff value
  let goodPairs = 0;

  // Calculate diff = nums[i] - i for each element and count frequencies
  for (let i = 0; i < n; i++) {
    const diff = nums[i] - i;

    // If we've seen this diff before, all previous indices with this diff
    // form good pairs with the current index
    if (freq.has(diff)) {
      const count = freq.get(diff);
      goodPairs += count;
      freq.set(diff, count + 1);
    } else {
      freq.set(diff, 1);
    }
  }

  // Total possible pairs with i < j
  const totalPairs = (n * (n - 1)) / 2;

  // Bad pairs = Total pairs - Good pairs
  return totalPairs - goodPairs;
}
```

```java
// Time: O(n) | Space: O(n)
public long countBadPairs(int[] nums) {
    int n = nums.length;
    Map<Integer, Integer> freq = new HashMap<>();  // Hash map to store frequency of each diff value
    long goodPairs = 0;

    // Calculate diff = nums[i] - i for each element and count frequencies
    for (int i = 0; i < n; i++) {
        int diff = nums[i] - i;

        // If we've seen this diff before, all previous indices with this diff
        // form good pairs with the current index
        if (freq.containsKey(diff)) {
            int count = freq.get(diff);
            goodPairs += count;  // Current index forms good pairs with all previous indices with same diff
            freq.put(diff, count + 1);
        } else {
            freq.put(diff, 1);
        }
    }

    // Total possible pairs with i < j (use long to avoid overflow)
    long totalPairs = (long) n * (n - 1) / 2;

    // Bad pairs = Total pairs - Good pairs
    return totalPairs - goodPairs;
}
```

</div>

**Step-by-step explanation of the code:**

1. **Initialize frequency map:** We use a hash map to track how many times we've seen each `diff = nums[i] - i` value.
2. **Iterate through array:** For each index `i`, calculate `diff = nums[i] - i`.
3. **Count good pairs incrementally:** If we've seen this `diff` before, all previous indices with the same `diff` form good pairs with the current index. We add this count to `good_pairs`.
4. **Update frequency:** Increment the count for this `diff` in our map.
5. **Calculate total pairs:** The total number of pairs with `i < j` is `n × (n-1) / 2`.
6. **Return result:** Bad pairs = Total pairs - Good pairs.

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length `n`
- Hash map operations (insert and lookup) are O(1) on average
- Total operations scale linearly with `n`

**Space Complexity: O(n)**

- In the worst case, all `diff` values could be unique, requiring `n` entries in the hash map
- The space used by the hash map grows linearly with `n`

## Common Mistakes

1. **Using integer overflow for large n:** When `n` is large (up to 10⁵), `n × (n-1) / 2` can exceed 32-bit integer limits (about 5 × 10⁹). Always use 64-bit integers (long in Java, regular int in Python handles big integers automatically).

2. **Counting good pairs incorrectly:** Some candidates try to count bad pairs directly instead of counting good pairs and subtracting. Direct counting requires checking all pairs, which is O(n²). The subtraction approach is more efficient.

3. **Forgetting the transformation:** The key insight is rearranging `j - i = nums[j] - nums[i]` to `nums[j] - j = nums[i] - i`. Without this transformation, you can't use the frequency counting approach.

4. **Off-by-one with indices:** Remember the problem uses 0-indexing. The formula `diff = nums[i] - i` works because both sides use the same indexing. If you mistakenly use `i+1`, the math won't work.

## When You'll See This Pattern

This problem uses the **"transform and count"** pattern, which appears in many counting problems:

1. **K-diff Pairs in an Array (LeetCode 532):** Transform `|nums[i] - nums[j]| = k` into counting problems using hash maps.

2. **Subarray Sums Divisible by K (LeetCode 974):** Transform subarray sums using prefix sums and modular arithmetic, then count using hash maps.

3. **Count Nice Pairs in an Array (LeetCode 1814):** Similar transformation where `nums[i] + rev(nums[j]) = nums[j] + rev(nums[i])` becomes `nums[i] - rev(nums[i]) = nums[j] - rev(nums[j])`.

The common theme: transform a pairwise condition into an equivalence relation that can be tracked with a hash map, turning O(n²) comparisons into O(n) counting.

## Key Takeaways

1. **Look for algebraic transformations:** When faced with a pairwise condition, try to rearrange it into a form where each element can be processed independently. The transformation `j - i = nums[j] - nums[i]` → `nums[j] - j = nums[i] - i` is the key insight.

2. **Count complements:** Sometimes it's easier to count what you don't want (good pairs) and subtract from the total, rather than counting what you want directly (bad pairs).

3. **Hash maps for frequency counting:** When you need to count how many elements share some property, a hash map is usually the right tool. The property `nums[i] - i` becomes the key, and its frequency becomes the value.

**Related problems:** [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array), [Subarray Sums Divisible by K](/problem/subarray-sums-divisible-by-k), [Count Nice Pairs in an Array](/problem/count-nice-pairs-in-an-array)
