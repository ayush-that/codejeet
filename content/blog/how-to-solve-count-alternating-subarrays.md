---
title: "How to Solve Count Alternating Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Alternating Subarrays. Medium difficulty, 57.3% acceptance rate. Topics: Array, Math."
date: "2028-09-20"
category: "dsa-patterns"
tags: ["count-alternating-subarrays", "array", "math", "medium"]
---

# How to Solve Count Alternating Subarrays

This problem asks us to count all subarrays where adjacent elements alternate between 0 and 1. While the concept is simple, the challenge lies in counting efficiently without checking every possible subarray individually. The interesting part is recognizing that alternating subarrays have a mathematical relationship we can exploit for an O(n) solution.

## Visual Walkthrough

Let's trace through the example `nums = [1, 0, 1, 0, 1]` step by step:

**Step 1:** Start at index 0 (value = 1)

- Subarray starting at index 0: `[1]` (length 1) ✓
- Extend to index 1: `[1, 0]` (1 ≠ 0) ✓
- Extend to index 2: `[1, 0, 1]` (0 ≠ 1) ✓
- Extend to index 3: `[1, 0, 1, 0]` (1 ≠ 0) ✓
- Extend to index 4: `[1, 0, 1, 0, 1]` (0 ≠ 1) ✓
  Total from index 0: 5 alternating subarrays

**Step 2:** Move to index 1 (value = 0)

- `[0]` ✓
- `[0, 1]` (0 ≠ 1) ✓
- `[0, 1, 0]` (1 ≠ 0) ✓
- `[0, 1, 0, 1]` (0 ≠ 1) ✓
  Total from index 1: 4 alternating subarrays

**Step 3:** Index 2 (value = 1)

- `[1]` ✓
- `[1, 0]` (1 ≠ 0) ✓
- `[1, 0, 1]` (0 ≠ 1) ✓
  Total from index 2: 3 alternating subarrays

**Step 4:** Index 3 (value = 0)

- `[0]` ✓
- `[0, 1]` (0 ≠ 1) ✓
  Total from index 3: 2 alternating subarrays

**Step 5:** Index 4 (value = 1)

- `[1]` ✓
  Total from index 4: 1 alternating subarray

**Final count:** 5 + 4 + 3 + 2 + 1 = 15 alternating subarrays

Notice the pattern: when we find a run of alternating elements, the number of alternating subarrays starting at position `i` equals the length of that alternating run from `i` onward.

## Brute Force Approach

The most straightforward solution is to check every possible subarray. For each starting index `i`, we extend to each ending index `j` (where `j ≥ i`) and check if all adjacent pairs in `nums[i..j]` alternate.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countAlternatingSubarrays(nums):
    n = len(nums)
    count = 0

    # Check every possible subarray
    for i in range(n):
        for j in range(i, n):
            # Verify if nums[i..j] is alternating
            is_alternating = True
            for k in range(i, j):
                if nums[k] == nums[k + 1]:
                    is_alternating = False
                    break
            if is_alternating:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countAlternatingSubarrays(nums) {
  const n = nums.length;
  let count = 0;

  // Check every possible subarray
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Verify if nums[i..j] is alternating
      let isAlternating = true;
      for (let k = i; k < j; k++) {
        if (nums[k] === nums[k + 1]) {
          isAlternating = false;
          break;
        }
      }
      if (isAlternating) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countAlternatingSubarrays(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check every possible subarray
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Verify if nums[i..j] is alternating
            boolean isAlternating = true;
            for (int k = i; k < j; k++) {
                if (nums[k] == nums[k + 1]) {
                    isAlternating = false;
                    break;
                }
            }
            if (isAlternating) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is inefficient:** For an array of length `n`, there are O(n²) subarrays, and checking each one takes O(n) time in the worst case, giving us O(n³) time complexity. This is far too slow for typical constraints where `n` can be up to 10⁵.

## Optimized Approach

The key insight is that we don't need to check every subarray individually. Instead, we can find runs of alternating elements and use a mathematical formula to count all subarrays within those runs.

**Observation:** If we have a run of `k` consecutive alternating elements, then:

- There are `k` alternating subarrays starting at the first element
- `k-1` alternating subarrays starting at the second element
- ...
- `1` alternating subarray starting at the last element

This is the sum of integers from 1 to `k`, which equals `k × (k + 1) / 2`.

**Algorithm:**

1. Initialize `count = 0` and `current_run = 1` (a single element is always alternating)
2. Iterate through the array starting from index 1
3. For each element, compare it with the previous element:
   - If they alternate (are different), increment `current_run`
   - If they're the same, add `current_run × (current_run + 1) / 2` to `count`, then reset `current_run = 1`
4. After the loop, add the final run's contribution to `count`
5. Return `count`

This approach processes each element exactly once, giving us O(n) time complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countAlternatingSubarrays(nums):
    n = len(nums)
    if n == 0:
        return 0

    total_count = 0
    current_run = 1  # A single element always forms an alternating subarray

    # Iterate through the array, comparing each element with its predecessor
    for i in range(1, n):
        if nums[i] != nums[i - 1]:
            # Elements alternate, so extend the current run
            current_run += 1
        else:
            # Run ended, add all subarrays from this run to total
            total_count += current_run * (current_run + 1) // 2
            # Start a new run with the current element
            current_run = 1

    # Don't forget to add the last run
    total_count += current_run * (current_run + 1) // 2

    return total_count
```

```javascript
// Time: O(n) | Space: O(1)
function countAlternatingSubarrays(nums) {
  const n = nums.length;
  if (n === 0) return 0;

  let totalCount = 0;
  let currentRun = 1; // A single element always forms an alternating subarray

  // Iterate through the array, comparing each element with its predecessor
  for (let i = 1; i < n; i++) {
    if (nums[i] !== nums[i - 1]) {
      // Elements alternate, so extend the current run
      currentRun++;
    } else {
      // Run ended, add all subarrays from this run to total
      totalCount += (currentRun * (currentRun + 1)) / 2;
      // Start a new run with the current element
      currentRun = 1;
    }
  }

  // Don't forget to add the last run
  totalCount += (currentRun * (currentRun + 1)) / 2;

  return totalCount;
}
```

```java
// Time: O(n) | Space: O(1)
public int countAlternatingSubarrays(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;

    long totalCount = 0;  // Use long to avoid integer overflow for large n
    int currentRun = 1;   // A single element always forms an alternating subarray

    // Iterate through the array, comparing each element with its predecessor
    for (int i = 1; i < n; i++) {
        if (nums[i] != nums[i - 1]) {
            // Elements alternate, so extend the current run
            currentRun++;
        } else {
            // Run ended, add all subarrays from this run to total
            totalCount += (long) currentRun * (currentRun + 1) / 2;
            // Start a new run with the current element
            currentRun = 1;
        }
    }

    // Don't forget to add the last run
    totalCount += (long) currentRun * (currentRun + 1) / 2;

    return (int) totalCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once, performing constant-time operations at each step
- The formula `k × (k + 1) / 2` is computed in O(1) time

**Space Complexity: O(1)**

- We only use a few integer variables (`total_count`, `current_run`)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting to handle the last run:** After the loop ends, you must add the contribution from the final alternating run. Many candidates complete the loop but forget this final addition.

2. **Integer overflow with large arrays:** When `n` is large (up to 10⁵), the total count can exceed 2³¹ - 1. In Java, use `long` for the total count and cast back to `int` at the end. In Python, integers have arbitrary precision, so this isn't an issue.

3. **Off-by-one errors in run length:** Remember that a single element always forms an alternating subarray, so `current_run` should start at 1, not 0. Also, when you encounter non-alternating elements, the current run ends at the previous element, not the current one.

4. **Misunderstanding the alternating condition:** The problem states "no two adjacent elements in the subarray have the same value." This means `[1, 0, 1]` is valid, but `[1, 0, 0]` is not. Some candidates mistakenly check if all elements are different, which is a stricter condition.

## When You'll See This Pattern

This "count runs and use arithmetic sum" pattern appears in several array counting problems:

1. **Maximum Subarray (Kadane's Algorithm)** - While not identical, both involve processing arrays in runs and maintaining a running count/state.

2. **Count Number of Nice Subarrays** (LeetCode 1248) - Uses a similar approach of counting valid subarrays within windows that satisfy certain conditions.

3. **Subarray Product Less Than K** (LeetCode 713) - Another problem where you count subarrays satisfying a condition, often using a sliding window approach.

4. **Arithmetic Slices** (LeetCode 413) - Uses a similar run-counting technique where you find arithmetic sequences and count all subarrays within them.

The core idea is recognizing that when you have a contiguous segment satisfying some property, you can often use combinatorial formulas to count all subarrays within that segment efficiently.

## Key Takeaways

1. **Look for runs of satisfying elements:** When counting subarrays with a property that depends on adjacent elements, identify contiguous runs where the property holds. The count of valid subarrays within a run often follows a simple mathematical formula.

2. **Single pass with state tracking:** Many array problems can be solved in O(n) time by making a single pass while tracking the current state (like the length of the current alternating run).

3. **Combinatorial counting over brute force checking:** Instead of checking each subarray individually (O(n³)), use the observation that if a subarray of length `k` is alternating, then all its prefixes are also alternating. This lets us count in O(n) time.

[Practice this problem on CodeJeet](/problem/count-alternating-subarrays)
