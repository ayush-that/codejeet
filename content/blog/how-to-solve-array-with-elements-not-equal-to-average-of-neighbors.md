---
title: "How to Solve Array With Elements Not Equal to Average of Neighbors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Array With Elements Not Equal to Average of Neighbors. Medium difficulty, 50.6% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-08-11"
category: "dsa-patterns"
tags:
  ["array-with-elements-not-equal-to-average-of-neighbors", "array", "greedy", "sorting", "medium"]
---

# How to Solve "Array With Elements Not Equal to Average of Neighbors"

You're given an array of distinct integers and need to rearrange them so that no element equals the average of its two neighbors. This problem is tricky because it looks like it requires complex backtracking, but there's actually a clever greedy solution that works in O(n log n) time. The key insight is that if you sort the array and interleave the smaller and larger halves, you break the "average" relationship.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 4, 5]`

**Step 1: Sort the array**
Sorted: `[1, 2, 3, 4, 5]`

**Step 2: Split into two halves**

- First half (smaller values): `[1, 2, 3]`
- Second half (larger values): `[4, 5]`

**Step 3: Interleave them**
Take one from the first half, then one from the second half:

- Start with `1` (from first half)
- Add `4` (from second half) → `[1, 4]`
- Add `2` (from first half) → `[1, 4, 2]`
- Add `5` (from second half) → `[1, 4, 2, 5]`
- Add `3` (from first half) → `[1, 4, 2, 5, 3]`

**Step 4: Verify the condition**
Check each element against its neighbors:

- `1`: Neighbors are `4` only (edge case) → OK
- `4`: Average of neighbors = (1+2)/2 = 1.5 ≠ 4 ✓
- `2`: Average of neighbors = (4+5)/2 = 4.5 ≠ 2 ✓
- `5`: Average of neighbors = (2+3)/2 = 2.5 ≠ 5 ✓
- `3`: Neighbors are `5` only → OK

The pattern works because when you place a smaller number between two larger numbers (or vice versa), it can't equal their average. For three numbers a, b, c where b is between a and c, b equals (a+c)/2 only if b is exactly midway between them. By ensuring smaller and larger numbers alternate, we prevent this.

## Brute Force Approach

A naive approach would be to generate all permutations of the array and check each one until we find a valid arrangement. For each permutation, we'd need to check n-2 elements (excluding the first and last) to verify none equals the average of its neighbors.

The brute force code would look like this:

<div class="code-group">

```python
# Time: O(n! * n) | Space: O(n)
def rearrangeArrayBruteForce(nums):
    from itertools import permutations

    for perm in permutations(nums):
        valid = True
        for i in range(1, len(perm) - 1):
            if perm[i] == (perm[i-1] + perm[i+1]) / 2:
                valid = False
                break
        if valid:
            return list(perm)
    return list(nums)  # fallback (shouldn't happen with distinct integers)
```

```javascript
// Time: O(n! * n) | Space: O(n)
function rearrangeArrayBruteForce(nums) {
  // Helper function to generate permutations
  function* permute(arr, start = 0) {
    if (start === arr.length) {
      yield [...arr];
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      yield* permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }

  for (let perm of permute([...nums])) {
    let valid = true;
    for (let i = 1; i < perm.length - 1; i++) {
      if (perm[i] === (perm[i - 1] + perm[i + 1]) / 2) {
        valid = false;
        break;
      }
    }
    if (valid) return perm;
  }
  return nums; // fallback
}
```

```java
// Time: O(n! * n) | Space: O(n)
import java.util.*;

public class Solution {
    public int[] rearrangeArrayBruteForce(int[] nums) {
        List<List<Integer>> permutations = new ArrayList<>();
        generatePermutations(nums, 0, permutations);

        for (List<Integer> perm : permutations) {
            boolean valid = true;
            for (int i = 1; i < perm.size() - 1; i++) {
                if (perm.get(i) * 2 == perm.get(i-1) + perm.get(i+1)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                return perm.stream().mapToInt(i->i).toArray();
            }
        }
        return nums;  // fallback
    }

    private void generatePermutations(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> list = new ArrayList<>();
            for (int num : nums) list.add(num);
            result.add(list);
            return;
        }
        for (int i = start; i < nums.length; i++) {
            swap(nums, start, i);
            generatePermutations(nums, start + 1, result);
            swap(nums, start, i);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

</div>

**Why this fails:** With n! permutations and O(n) checking per permutation, this becomes impossibly slow for n > 10. We need a smarter approach.

## Optimized Approach

The key insight comes from understanding the mathematical condition. For three distinct numbers a, b, c:

- If a < b < c (increasing order), then b = (a + c)/2
- If a > b > c (decreasing order), then b = (a + c)/2

In both cases, b is between a and c. To prevent b from being the average, we need to break this "betweenness" property. One effective way is to ensure the array alternates between "small" and "large" values.

**Optimal strategy:**

1. Sort the array so we can easily identify smaller and larger values
2. Split the sorted array into two halves: first half (smaller values) and second half (larger values)
3. Interleave them by taking one from the first half, then one from the second half

This creates a "valley-peak" pattern where every element at an odd index is larger than its neighbors, and every element at an even index is smaller than its neighbors (or vice versa).

**Why this works mathematically:**
For any three consecutive elements at indices i-1, i, i+1:

- If i is even: nums[i] comes from the first half (smaller values), while nums[i-1] and nums[i+1] come from the second half (larger values). So nums[i] < nums[i-1] and nums[i] < nums[i+1], making it impossible for nums[i] to equal their average.
- If i is odd: nums[i] comes from the second half (larger values), while nums[i-1] and nums[i+1] come from the first half (smaller values). So nums[i] > nums[i-1] and nums[i] > nums[i+1], again making it impossible for nums[i] to equal their average.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result array
def rearrangeArray(nums):
    """
    Rearranges the array so no element equals the average of its neighbors.

    Strategy:
    1. Sort the array to separate smaller and larger values
    2. Split into two halves: first half (smaller), second half (larger)
    3. Interleave them to create alternating small-large pattern

    This works because if an element is between two others (either smaller
    than both or larger than both), it can't be their average.
    """
    # Step 1: Sort the array - O(n log n)
    nums.sort()

    n = len(nums)
    result = [0] * n

    # Step 2: Interleave smaller and larger halves
    # We'll fill even indices with smaller values (first half)
    # and odd indices with larger values (second half)

    # For odd length arrays, first half should be slightly larger
    # to ensure we have enough elements for interleaving
    half = (n + 1) // 2  # Ceiling division

    # Fill even indices (0, 2, 4...) with first half (smaller values)
    j = 0
    for i in range(0, n, 2):
        result[i] = nums[j]
        j += 1

    # Fill odd indices (1, 3, 5...) with second half (larger values)
    for i in range(1, n, 2):
        result[i] = nums[j]
        j += 1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for the result array
function rearrangeArray(nums) {
  /**
   * Rearranges the array so no element equals the average of its neighbors.
   *
   * Strategy:
   * 1. Sort the array to separate smaller and larger values
   * 2. Split into two halves: first half (smaller), second half (larger)
   * 3. Interleave them to create alternating small-large pattern
   *
   * This works because if an element is between two others (either smaller
   * than both or larger than both), it can't be their average.
   */

  // Step 1: Sort the array - O(n log n)
  // Create a copy to avoid modifying the input
  const sorted = [...nums].sort((a, b) => a - b);

  const n = sorted.length;
  const result = new Array(n);

  // Step 2: Interleave smaller and larger halves
  // For odd length arrays, first half should be slightly larger
  const half = Math.ceil(n / 2);

  // Fill even indices (0, 2, 4...) with first half (smaller values)
  let j = 0;
  for (let i = 0; i < n; i += 2) {
    result[i] = sorted[j];
    j++;
  }

  // Fill odd indices (1, 3, 5...) with second half (larger values)
  for (let i = 1; i < n; i += 2) {
    result[i] = sorted[j];
    j++;
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result array
import java.util.Arrays;

class Solution {
    public int[] rearrangeArray(int[] nums) {
        /**
         * Rearranges the array so no element equals the average of its neighbors.
         *
         * Strategy:
         * 1. Sort the array to separate smaller and larger values
         * 2. Split into two halves: first half (smaller), second half (larger)
         * 3. Interleave them to create alternating small-large pattern
         *
         * This works because if an element is between two others (either smaller
         * than both or larger than both), it can't be their average.
         */

        // Step 1: Sort the array - O(n log n)
        // Create a copy to avoid modifying the input
        int[] sorted = nums.clone();
        Arrays.sort(sorted);

        int n = sorted.length;
        int[] result = new int[n];

        // Step 2: Interleave smaller and larger halves
        // For odd length arrays, first half should be slightly larger
        int half = (n + 1) / 2;  // Ceiling division

        // Fill even indices (0, 2, 4...) with first half (smaller values)
        int j = 0;
        for (int i = 0; i < n; i += 2) {
            result[i] = sorted[j];
            j++;
        }

        // Fill odd indices (1, 3, 5...) with second half (larger values)
        for (int i = 1; i < n; i += 2) {
            result[i] = sorted[j];
            j++;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time using comparison-based sorts like Timsort (Python), Merge sort (JavaScript), or Dual-Pivot Quicksort (Java)
- The interleaving step takes O(n) time as we simply iterate through the array once
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity:** O(n)

- We need O(n) space for the sorted copy of the array (unless we can modify the input, in which case we could sort in-place)
- We need O(n) space for the result array
- If we modify the input and return it, we could achieve O(1) extra space, but the problem typically expects a new arrangement

## Common Mistakes

1. **Forgetting to handle odd-length arrays correctly**: When splitting the sorted array, if you use exact half (n//2), you might run out of elements when interleaving. Always use ceiling division `(n+1)//2` for the first half.

2. **Checking floating-point equality directly**: When verifying the condition, avoid `nums[i] == (nums[i-1] + nums[i+1]) / 2` due to floating-point precision issues. Instead, use integer comparison: `2 * nums[i] == nums[i-1] + nums[i+1]`.

3. **Assuming the input can be modified**: Always check if the problem allows in-place modification. If not, create a copy before sorting.

4. **Overcomplicating with backtracking**: Some candidates try to build the array element by element with backtracking, which is exponential time. Recognize that a greedy sorting-based approach exists.

5. **Not testing edge cases**: Always test with:
   - Small arrays (n = 1, 2, 3)
   - Already valid/invalid arrangements
   - Both even and odd lengths

## When You'll See This Pattern

This "alternating pattern" or "wiggle sort" technique appears in several problems:

1. **Wiggle Sort (LeetCode 280)**: Rearrange the array in-place so that `nums[0] <= nums[1] >= nums[2] <= nums[3]...` Uses a similar alternating pattern but with less strict constraints.

2. **Wiggle Sort II (LeetCode 324)**: A harder version that requires `nums[0] < nums[1] > nums[2] < nums[3]...` and works with duplicates. Uses the exact same "sort and interleave" approach.

3. **Peaks and Valleys (Cracking the Coding Interview 10.11)**: Arrange an array into alternating peaks and valleys, which is essentially the same problem.

The core pattern is: when you need to create an alternating relationship between elements (small-large-small or high-low-high), consider sorting and then interleaving halves.

## Key Takeaways

1. **Mathematical insight beats brute force**: Understanding that an element equals the average of its neighbors only when it's between them (numerically) leads to the alternating pattern solution.

2. **Sorting enables greedy solutions**: Many array rearrangement problems become tractable after sorting, as it reveals structural patterns you can exploit.

3. **Interleaving creates alternation**: When you need alternating properties (small-large-small), interleaving two sorted halves is a powerful technique. Remember to use ceiling division for the split point with odd-length arrays.

4. **Test your reasoning**: Always verify with small examples and edge cases. The alternating pattern should guarantee that no middle element can be the average of its neighbors because it's either smaller than both or larger than both.

Related problems: [Wiggle Sort](/problem/wiggle-sort), [Wiggle Sort II](/problem/wiggle-sort-ii), [Design Neighbor Sum Service](/problem/design-neighbor-sum-service)
