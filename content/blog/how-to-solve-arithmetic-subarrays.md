---
title: "How to Solve Arithmetic Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Arithmetic Subarrays. Medium difficulty, 83.8% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2026-08-13"
category: "dsa-patterns"
tags: ["arithmetic-subarrays", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Arithmetic Subarrays

You're given an array `nums` and two arrays `l` and `r` of the same length. For each query `i`, you need to check if the subarray `nums[l[i]]` to `nums[r[i]]` (inclusive) can be rearranged to form an arithmetic sequence. The challenge is that you need to efficiently handle multiple queries without repeatedly sorting the same subarrays.

**What makes this problem interesting:** You need to check if a subarray can be rearranged into an arithmetic sequence, not if it already is one. This means sorting is involved, but sorting each subarray separately would be too slow. The key insight is that each query is independent, so you can process them separately but efficiently.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [4, 6, 5, 9, 3, 7]
l = [0, 0, 2]
r = [2, 3, 5]
```

**Query 0:** `l[0]=0`, `r[0]=2`

- Subarray: `[4, 6, 5]` (indices 0, 1, 2)
- Sort it: `[4, 5, 6]`
- Check differences: `5-4=1`, `6-5=1`
- All differences equal? **Yes** → `true`

**Query 1:** `l[1]=0`, `r[1]=3`

- Subarray: `[4, 6, 5, 9]` (indices 0, 1, 2, 3)
- Sort: `[4, 5, 6, 9]`
- Differences: `5-4=1`, `6-5=1`, `9-6=3`
- Not all equal (1, 1, 3) → **false**

**Query 2:** `l[2]=2`, `r[2]=5`

- Subarray: `[5, 9, 3, 7]` (indices 2, 3, 4, 5)
- Sort: `[3, 5, 7, 9]`
- Differences: `5-3=2`, `7-5=2`, `9-7=2`
- All equal → **true**

**Output:** `[true, false, true]`

The pattern is clear: for each query, extract the subarray, sort it, then check if consecutive elements have equal differences.

## Brute Force Approach

The most straightforward approach is exactly what we did in the visual walkthrough:

1. For each query `i`:
   - Extract the subarray from `nums[l[i]]` to `nums[r[i]]`
   - Sort the subarray
   - Check if all consecutive differences are equal
   - Add the result to the answer list

**Why this is inefficient:**

- Sorting each subarray takes O(k log k) where k is the subarray length
- With m queries and average subarray length n/m, this becomes O(m × (n/m) log(n/m)) = O(n log(n/m))
- In worst case, all queries cover the entire array: O(m × n log n)
- Since m can be up to 500 and n up to 500, this could be 500 × 500 × log(500) ≈ 500 × 500 × 9 ≈ 2.25M operations, which might pass but isn't optimal

**Brute force code:**

<div class="code-group">

```python
# Time: O(m * k log k) where k is average subarray length
# Space: O(k) for the temporary subarray
def checkArithmeticSubarrays(nums, l, r):
    result = []

    for i in range(len(l)):
        # Extract subarray
        subarray = nums[l[i]:r[i]+1]

        # Sort it
        subarray.sort()

        # Check if arithmetic
        is_arithmetic = True
        diff = subarray[1] - subarray[0]

        for j in range(2, len(subarray)):
            if subarray[j] - subarray[j-1] != diff:
                is_arithmetic = False
                break

        result.append(is_arithmetic)

    return result
```

```javascript
// Time: O(m * k log k) where k is average subarray length
// Space: O(k) for the temporary subarray
function checkArithmeticSubarrays(nums, l, r) {
  const result = [];

  for (let i = 0; i < l.length; i++) {
    // Extract subarray
    const subarray = nums.slice(l[i], r[i] + 1);

    // Sort it
    subarray.sort((a, b) => a - b);

    // Check if arithmetic
    let isArithmetic = true;
    const diff = subarray[1] - subarray[0];

    for (let j = 2; j < subarray.length; j++) {
      if (subarray[j] - subarray[j - 1] !== diff) {
        isArithmetic = false;
        break;
      }
    }

    result.push(isArithmetic);
  }

  return result;
}
```

```java
// Time: O(m * k log k) where k is average subarray length
// Space: O(k) for the temporary subarray
public List<Boolean> checkArithmeticSubarrays(int[] nums, int[] l, int[] r) {
    List<Boolean> result = new ArrayList<>();

    for (int i = 0; i < l.length; i++) {
        // Extract subarray
        int[] subarray = new int[r[i] - l[i] + 1];
        for (int j = l[i]; j <= r[i]; j++) {
            subarray[j - l[i]] = nums[j];
        }

        // Sort it
        Arrays.sort(subarray);

        // Check if arithmetic
        boolean isArithmetic = true;
        int diff = subarray[1] - subarray[0];

        for (int j = 2; j < subarray.length; j++) {
            if (subarray[j] - subarray[j - 1] != diff) {
                isArithmetic = false;
                break;
            }
        }

        result.add(isArithmetic);
    }

    return result;
}
```

</div>

## Optimized Approach

The brute force approach is actually acceptable given the constraints (n, m ≤ 500), but we can optimize it slightly. The key observation is that we don't need to sort the entire subarray to check if it can be rearranged into an arithmetic sequence.

**Better approach:**

1. For each query, find the min and max elements in the subarray
2. If all elements are equal (min == max), it's arithmetic
3. Otherwise, calculate the expected difference: `(max - min) / (n - 1)` where n is subarray length
4. Check if this difference is an integer (if not, can't be arithmetic)
5. Create a set of all elements in the subarray
6. Check if the arithmetic sequence starting from min with the calculated difference contains all elements in the set

**Why this works:**

- An arithmetic sequence is uniquely determined by its min, max, and length
- The difference must be `(max - min) / (length - 1)`
- All intermediate values must be present: `min, min+d, min+2d, ..., max`
- Using a set gives O(1) lookups

**Time complexity:** O(m × k) where k is subarray length, which is better than O(m × k log k) from sorting

## Optimal Solution

Here's the implementation using the set-based approach:

<div class="code-group">

```python
# Time: O(m * k) where k is average subarray length
# Space: O(k) for the set
def checkArithmeticSubarrays(nums, l, r):
    result = []

    for i in range(len(l)):
        left, right = l[i], r[i]

        # Find min and max in the subarray
        min_val = min(nums[left:right+1])
        max_val = max(nums[left:right+1])

        # If all elements are equal, it's arithmetic
        if min_val == max_val:
            result.append(True)
            continue

        # Calculate expected difference
        length = right - left + 1
        diff = (max_val - min_val) / (length - 1)

        # If difference is not integer, can't be arithmetic
        if diff != int(diff):
            result.append(False)
            continue

        diff = int(diff)

        # Create a set of all elements in subarray for O(1) lookups
        elements = set(nums[left:right+1])

        # Check if all expected values are in the set
        is_arithmetic = True
        for j in range(length):
            expected = min_val + j * diff
            if expected not in elements:
                is_arithmetic = False
                break

        result.append(is_arithmetic)

    return result
```

```javascript
// Time: O(m * k) where k is average subarray length
// Space: O(k) for the set
function checkArithmeticSubarrays(nums, l, r) {
  const result = [];

  for (let i = 0; i < l.length; i++) {
    const left = l[i];
    const right = r[i];

    // Find min and max in the subarray
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let j = left; j <= right; j++) {
      minVal = Math.min(minVal, nums[j]);
      maxVal = Math.max(maxVal, nums[j]);
    }

    // If all elements are equal, it's arithmetic
    if (minVal === maxVal) {
      result.push(true);
      continue;
    }

    // Calculate expected difference
    const length = right - left + 1;
    const diff = (maxVal - minVal) / (length - 1);

    // If difference is not integer, can't be arithmetic
    if (!Number.isInteger(diff)) {
      result.push(false);
      continue;
    }

    // Create a set of all elements in subarray for O(1) lookups
    const elements = new Set();
    for (let j = left; j <= right; j++) {
      elements.add(nums[j]);
    }

    // Check if all expected values are in the set
    let isArithmetic = true;
    for (let j = 0; j < length; j++) {
      const expected = minVal + j * diff;
      if (!elements.has(expected)) {
        isArithmetic = false;
        break;
      }
    }

    result.push(isArithmetic);
  }

  return result;
}
```

```java
// Time: O(m * k) where k is average subarray length
// Space: O(k) for the set
public List<Boolean> checkArithmeticSubarrays(int[] nums, int[] l, int[] r) {
    List<Boolean> result = new ArrayList<>();

    for (int i = 0; i < l.length; i++) {
        int left = l[i];
        int right = r[i];

        // Find min and max in the subarray
        int minVal = Integer.MAX_VALUE;
        int maxVal = Integer.MIN_VALUE;
        for (int j = left; j <= right; j++) {
            minVal = Math.min(minVal, nums[j]);
            maxVal = Math.max(maxVal, nums[j]);
        }

        // If all elements are equal, it's arithmetic
        if (minVal == maxVal) {
            result.add(true);
            continue;
        }

        // Calculate expected difference
        int length = right - left + 1;
        // Check if difference is integer
        if ((maxVal - minVal) % (length - 1) != 0) {
            result.add(false);
            continue;
        }
        int diff = (maxVal - minVal) / (length - 1);

        // Create a set of all elements in subarray for O(1) lookups
        Set<Integer> elements = new HashSet<>();
        for (int j = left; j <= right; j++) {
            elements.add(nums[j]);
        }

        // Check if all expected values are in the set
        boolean isArithmetic = true;
        for (int j = 0; j < length; j++) {
            int expected = minVal + j * diff;
            if (!elements.contains(expected)) {
                isArithmetic = false;
                break;
            }
        }

        result.add(isArithmetic);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- For each of the m queries, we:
  1. Find min and max: O(k) where k is subarray length
  2. Build a set: O(k)
  3. Check all expected values: O(k)
- Total: O(m × k) = O(m × average subarray length)
- In worst case where all queries cover the full array: O(m × n)

**Space Complexity:**

- O(k) for the set storing subarray elements
- O(m) for the result list
- Total: O(max(k, m))

**Comparison with sorting approach:**

- Sorting: O(m × k log k)
- Set-based: O(m × k)
- The set-based approach is faster when k is large

## Common Mistakes

1. **Forgetting to handle the all-equal case:** When all elements are equal, the sequence is arithmetic (difference is 0). Some implementations might fail on `diff = (max-min)/(length-1)` when max-min=0.

2. **Not checking if the difference is integer:** If `(max-min)` is not divisible by `(length-1)`, the sequence can't be arithmetic with integer elements. Floating point comparisons can be tricky here.

3. **Using array instead of set for lookups:** Checking if each expected value exists in the subarray using linear search would make it O(k²) per query instead of O(k).

4. **Off-by-one errors in subarray extraction:** Remember `r[i]` is inclusive, so the subarray length is `r[i]-l[i]+1`, not `r[i]-l[i]`.

5. **Assuming the subarray is already sorted:** The problem says the subarray needs to be _rearranged_ to form an arithmetic sequence, so we can't just check consecutive differences in the original order.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Subarray analysis with queries:** Similar to range sum queries but with more complex validation. Other problems: Range Sum Query - Immutable (Easy), Number of Subarrays with Bounded Maximum (Medium).

2. **Arithmetic sequence properties:** The insight that an arithmetic sequence is determined by min, max, and length appears in: Can Make Arithmetic Progression From Sequence (Easy), Arithmetic Slices (Medium).

3. **Set-based membership checking:** When you need to check if certain values exist in a collection, sets provide O(1) lookups. Other problems: Two Sum (Easy), Contains Duplicate (Easy).

4. **Multiple independent queries:** Each query can be processed separately, allowing for straightforward parallelization or optimization per query.

## Key Takeaways

1. **For arithmetic sequence problems:** Remember that a sorted arithmetic sequence has equally spaced elements. The difference must be `(max-min)/(length-1)`, and all values from min to max with that step must be present.

2. **When dealing with subarrays and queries:** Consider whether queries are independent. If they are, you can optimize each one separately without worrying about interactions between queries.

3. **Choose the right data structure:** For membership testing, sets (hash tables) give O(1) lookups vs O(n) for arrays. This optimization often turns O(n²) solutions into O(n).

4. **Handle edge cases explicitly:** All-equal sequences, single-element sequences (though the problem guarantees at least 2 elements), and non-integer differences need special handling.

Related problems: [Arithmetic Slices](/problem/arithmetic-slices), [Can Make Arithmetic Progression From Sequence](/problem/can-make-arithmetic-progression-from-sequence)
