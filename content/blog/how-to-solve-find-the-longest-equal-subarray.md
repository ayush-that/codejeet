---
title: "How to Solve Find the Longest Equal Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Longest Equal Subarray. Medium difficulty, 37.6% acceptance rate. Topics: Array, Hash Table, Binary Search, Sliding Window."
date: "2029-05-05"
category: "dsa-patterns"
tags: ["find-the-longest-equal-subarray", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Find the Longest Equal Subarray

This problem asks us to find the longest subarray where all elements are equal, but with a twist: we can delete up to `k` elements from the array to create this equal subarray. The challenge is that the equal elements don't need to be contiguous in the original array—we can remove other elements between them. This makes it fundamentally different from finding contiguous equal elements, and requires a clever approach to efficiently determine which elements to keep.

**What makes this tricky:** The equal elements we're looking for can be scattered throughout the array with other elements in between. We need to find the largest group of identical elements where the gaps between them (other elements) can be filled by deleting at most `k` elements.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 2, 3, 1, 3]` with `k = 2`

We're looking for the longest sequence of equal elements where the "gaps" between them (non-matching elements) total ≤ k deletions.

**Step 1: Identify candidate elements**

- Value 1 appears at indices [0, 4]
- Value 2 appears at index [2]
- Value 3 appears at indices [1, 3, 5]

**Step 2: Check value 1**
Indices: [0, 4]

- From index 0 to 4, there are 5 positions total (0,1,2,3,4)
- We have 2 occurrences of value 1
- Gaps = total positions - occurrences = 5 - 2 = 3
- Need to delete 3 elements, but k=2 → not valid

**Step 3: Check value 3**
Indices: [1, 3, 5]

- Let's check window from index 1 to 5:
  - Total positions: 5 (1,2,3,4,5)
  - Occurrences: 3
  - Gaps: 5 - 3 = 2
  - 2 ≤ k=2 → valid! Length = 3

**Step 4: Could we get longer?**
What if we only take indices [3, 5] of value 3?

- Total positions: 3 (3,4,5)
- Occurrences: 2
- Gaps: 3 - 2 = 1 ≤ k=2 → valid but shorter (length 2)

The maximum we found is length 3 for value 3.

**Key insight:** For each value, we need to find the largest window of its occurrences where the number of other elements between them ≤ k.

## Brute Force Approach

A naive approach would be to check every possible subarray and count how many deletions it would require to make all elements equal:

1. For each starting index `i`
2. For each ending index `j` (where j ≥ i)
3. Count frequency of each element in nums[i:j+1]
4. Find the most frequent element in that range
5. Calculate deletions needed = (j-i+1) - max_frequency
6. If deletions ≤ k, update max length

This approach has O(n³) time complexity (O(n²) subarrays × O(n) to count frequencies) which is far too slow for typical constraints (n up to 10⁵).

Even a slightly better brute force would be O(n²) by using prefix sums for each value, but that's still too slow.

## Optimized Approach

The key insight is that we don't need to check every subarray. Instead, for each unique value in the array, we can look at all indices where that value appears and find the longest contiguous segment of these indices where the "gaps" (other elements) between them total ≤ k.

**Step-by-step reasoning:**

1. **Group indices by value:** First, create a dictionary mapping each value to a list of indices where it appears. This groups all occurrences of the same value together.

2. **For each value, find the longest valid window:** For a given value's index list `indices`, we need to find the largest window [left, right] in this list where:
   - The total span in the original array is: `indices[right] - indices[left] + 1`
   - The number of occurrences in this span is: `right - left + 1`
   - The gaps (elements to delete) are: `(indices[right] - indices[left] + 1) - (right - left + 1)`
   - This must be ≤ k

3. **Use sliding window on the index list:** Since `indices` is sorted (we collected indices in order), we can use a sliding window:
   - Expand the right pointer to include more occurrences
   - If gaps > k, shrink from the left until gaps ≤ k
   - Track the maximum window size

4. **Why this works:** The formula `(indices[right] - indices[left] + 1) - (right - left + 1)` calculates exactly how many other elements are between the first and last occurrence in our window. These are the elements we'd need to delete to make the subarray contain only our target value.

## Optimal Solution

Here's the complete solution using the sliding window approach on grouped indices:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestEqualSubarray(nums, k):
    """
    Find the longest subarray that can be made equal by deleting at most k elements.

    Approach:
    1. Group indices by value using a dictionary
    2. For each value's index list, use sliding window to find the longest
       window where gaps between occurrences ≤ k
    3. Track the maximum window size across all values
    """
    from collections import defaultdict

    # Step 1: Group indices by value
    # Each value maps to a list of indices where it appears
    indices_by_value = defaultdict(list)
    for i, num in enumerate(nums):
        indices_by_value[num].append(i)

    max_length = 0

    # Step 2: For each unique value, find the longest valid window
    for indices in indices_by_value.values():
        left = 0  # Left pointer in the indices list

        # Expand the window with right pointer
        for right in range(len(indices)):
            # Calculate gaps: total span minus number of occurrences
            # indices[right] - indices[left] + 1 = total positions in original array
            # right - left + 1 = number of occurrences of our value
            # The difference is how many other elements are in between
            gaps = (indices[right] - indices[left] + 1) - (right - left + 1)

            # If gaps exceed k, we need to shrink the window from the left
            while gaps > k:
                left += 1
                # Recalculate gaps with new left pointer
                gaps = (indices[right] - indices[left] + 1) - (right - left + 1)

            # Update max_length with current window size
            # right - left + 1 = number of occurrences in current window
            max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestEqualSubarray(nums, k) {
  /**
   * Find the longest subarray that can be made equal by deleting at most k elements.
   *
   * Approach:
   * 1. Group indices by value using a Map
   * 2. For each value's index list, use sliding window to find the longest
   *    window where gaps between occurrences ≤ k
   * 3. Track the maximum window size across all values
   */

  // Step 1: Group indices by value
  const indicesByValue = new Map();

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (!indicesByValue.has(num)) {
      indicesByValue.set(num, []);
    }
    indicesByValue.get(num).push(i);
  }

  let maxLength = 0;

  // Step 2: For each unique value, find the longest valid window
  for (const indices of indicesByValue.values()) {
    let left = 0; // Left pointer in the indices list

    // Expand the window with right pointer
    for (let right = 0; right < indices.length; right++) {
      // Calculate gaps: total span minus number of occurrences
      // indices[right] - indices[left] + 1 = total positions in original array
      // right - left + 1 = number of occurrences of our value
      // The difference is how many other elements are in between
      let gaps = indices[right] - indices[left] + 1 - (right - left + 1);

      // If gaps exceed k, we need to shrink the window from the left
      while (gaps > k) {
        left++;
        // Recalculate gaps with new left pointer
        gaps = indices[right] - indices[left] + 1 - (right - left + 1);
      }

      // Update maxLength with current window size
      // right - left + 1 = number of occurrences in current window
      maxLength = Math.max(maxLength, right - left + 1);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int longestEqualSubarray(List<Integer> nums, int k) {
        /**
         * Find the longest subarray that can be made equal by deleting at most k elements.
         *
         * Approach:
         * 1. Group indices by value using a HashMap
         * 2. For each value's index list, use sliding window to find the longest
         *    window where gaps between occurrences ≤ k
         * 3. Track the maximum window size across all values
         */

        // Step 1: Group indices by value
        Map<Integer, List<Integer>> indicesByValue = new HashMap<>();

        for (int i = 0; i < nums.size(); i++) {
            int num = nums.get(i);
            indicesByValue.putIfAbsent(num, new ArrayList<>());
            indicesByValue.get(num).add(i);
        }

        int maxLength = 0;

        // Step 2: For each unique value, find the longest valid window
        for (List<Integer> indices : indicesByValue.values()) {
            int left = 0;  // Left pointer in the indices list

            // Expand the window with right pointer
            for (int right = 0; right < indices.size(); right++) {
                // Calculate gaps: total span minus number of occurrences
                // indices[right] - indices[left] + 1 = total positions in original array
                // right - left + 1 = number of occurrences of our value
                // The difference is how many other elements are in between
                int gaps = (indices.get(right) - indices.get(left) + 1) - (right - left + 1);

                // If gaps exceed k, we need to shrink the window from the left
                while (gaps > k) {
                    left++;
                    // Recalculate gaps with new left pointer
                    gaps = (indices.get(right) - indices.get(left) + 1) - (right - left + 1);
                }

                // Update maxLength with current window size
                // right - left + 1 = number of occurrences in current window
                maxLength = Math.max(maxLength, right - left + 1);
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the index groups takes O(n) to iterate through the array once
- For each unique value, we process its indices with a sliding window. Each index is processed at most twice (once when added to the window via `right`, once when removed via `left`)
- Since all indices across all values sum to n, total sliding window operations are O(n)
- Overall: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store all indices in the dictionary/map: O(n) in the worst case (all elements unique)
- The sliding window pointers use O(1) extra space
- Overall: O(n)

## Common Mistakes

1. **Misunderstanding what can be deleted:** Some candidates think they can only delete elements from the ends of the subarray, but the problem allows deleting ANY elements within the subarray. This is crucial for the sliding window approach to work.

2. **Wrong gap calculation:** A common error is calculating gaps as `indices[right] - indices[left] - (right - left)` instead of `(indices[right] - indices[left] + 1) - (right - left + 1)`. The +1 terms account for inclusive counting of both endpoints.

3. **Trying to use sliding window directly on nums:** This doesn't work because equal elements might not be contiguous. You need to group by value first, then apply sliding window to the index lists.

4. **Forgetting to handle the case when k=0:** When k=0, the problem reduces to finding the longest contiguous equal subarray. Our solution handles this correctly since gaps=0 means indices must be consecutive.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Grouping + Sliding Window:** First group related elements (by value), then apply sliding window on the grouped data. Similar problems:
   - **Longest Repeating Character Replacement** (LeetCode 424): Replace at most k characters to get the longest repeating substring
   - **Fruit Into Baskets** (LeetCode 904): Collect at most 2 types of fruits, similar window constraint
   - **Subarrays with K Different Integers** (LeetCode 992): Count subarrays with exactly k distinct integers

2. **"At most k operations" constraint:** Many sliding window problems have this pattern where you can perform at most k operations (deletions, replacements, etc.) within a window:
   - **Minimum Window Substring** (LeetCode 76): Find minimum window containing all characters of a pattern
   - **Max Consecutive Ones III** (LeetCode 1004): Flip at most k zeros to get longest consecutive ones

## Key Takeaways

1. **When elements of interest are non-contiguous, group them first:** If you need to find a property about all occurrences of a value (or type), collect their indices first, then process the index list.

2. **The gap formula is key:** `(last_index - first_index + 1) - (count)` calculates how many "other" elements are between the first and last occurrence. This works because indices are sorted.

3. **Sliding window on derived data structures:** Sometimes the optimal approach applies sliding window not to the original array, but to a transformed representation (like grouped indices).

[Practice this problem on CodeJeet](/problem/find-the-longest-equal-subarray)
