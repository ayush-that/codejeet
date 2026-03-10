---
title: "How to Solve Count the Number of Incremovable Subarrays II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Incremovable Subarrays II. Hard difficulty, 40.1% acceptance rate. Topics: Array, Two Pointers, Binary Search."
date: "2026-05-02"
category: "dsa-patterns"
tags:
  [
    "count-the-number-of-incremovable-subarrays-ii",
    "array",
    "two-pointers",
    "binary-search",
    "hard",
  ]
---

# How to Solve Count the Number of Incremovable Subarrays II

You're given an array of positive integers and need to count how many subarrays you could remove to make the remaining elements strictly increasing. The challenge is that the remaining elements must be strictly increasing after removal, and you need to count all possible subarrays that achieve this efficiently. What makes this problem tricky is that we can't afford to check all O(n²) subarrays individually — we need a smarter way to identify which removals leave a valid strictly increasing sequence.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 3, 4]`

For this already strictly increasing array, any subarray we remove will leave a strictly increasing sequence (since removing elements from an increasing sequence keeps it increasing). So all possible subarrays work. That's `n*(n+1)/2 = 10` incremovable subarrays.

Now consider a more interesting case: `nums = [1, 3, 2, 4]`

We need to find which subarrays we can remove to make the remaining elements strictly increasing. Let's think about what "strictly increasing after removal" means:

1. The remaining elements must be in strictly increasing order
2. The remaining elements keep their original relative order (we're just removing a contiguous block)

Let's check some possibilities:

- Remove `[3]` → `[1, 2, 4]` ✓ (1 < 2 < 4)
- Remove `[3, 2]` → `[1, 4]` ✓ (1 < 4)
- Remove `[2]` → `[1, 3, 4]` ✓ (1 < 3 < 4)
- Remove `[1, 3]` → `[2, 4]` ✓ (2 < 4)
- Remove `[2, 4]` → `[1, 3]` ✓ (1 < 3)

But remove `[1, 3, 2]` → `[4]` ✓ (single element is trivially increasing)

The key insight: After removing a subarray, the remaining sequence consists of a prefix of the original array followed by a suffix, and these two parts must "fit together" to form a strictly increasing sequence. That means:

- The prefix must be strictly increasing by itself
- The suffix must be strictly increasing by itself
- The last element of the prefix must be less than the first element of the suffix

## Brute Force Approach

The brute force approach would be to:

1. Generate all O(n²) possible subarrays
2. For each subarray, create the remaining sequence by removing it
3. Check if the remaining sequence is strictly increasing

This would take O(n³) time: O(n²) subarrays, and for each we need O(n) time to construct the remaining sequence and check if it's increasing. For n up to 10⁵ (as in the problem constraints), this is completely infeasible.

Even an optimized brute force that avoids reconstructing the array each time would still be O(n²), which is too slow for n = 10⁵.

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(n³) | Space: O(n)
def countIncremovableSubarrays_brute(nums):
    n = len(nums)
    count = 0

    # Try all possible subarrays [i...j]
    for i in range(n):
        for j in range(i, n):
            # Check if removing nums[i:j+1] leaves a strictly increasing sequence
            valid = True

            # Build the remaining sequence
            remaining = []
            for k in range(n):
                if k < i or k > j:
                    remaining.append(nums[k])

            # Check if strictly increasing
            for k in range(1, len(remaining)):
                if remaining[k] <= remaining[k-1]:
                    valid = False
                    break

            if valid:
                count += 1

    return count
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n³) | Space: O(n)
function countIncremovableSubarraysBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Try all possible subarrays [i...j]
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if removing nums[i...j] leaves a strictly increasing sequence
      let valid = true;

      // Build the remaining sequence
      const remaining = [];
      for (let k = 0; k < n; k++) {
        if (k < i || k > j) {
          remaining.push(nums[k]);
        }
      }

      // Check if strictly increasing
      for (let k = 1; k < remaining.length; k++) {
        if (remaining[k] <= remaining[k - 1]) {
          valid = false;
          break;
        }
      }

      if (valid) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n³) | Space: O(n)
public int countIncremovableSubarraysBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Try all possible subarrays [i...j]
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if removing nums[i...j] leaves a strictly increasing sequence
            boolean valid = true;

            // Build the remaining sequence
            List<Integer> remaining = new ArrayList<>();
            for (int k = 0; k < n; k++) {
                if (k < i || k > j) {
                    remaining.add(nums[k]);
                }
            }

            // Check if strictly increasing
            for (int k = 1; k < remaining.size(); k++) {
                if (remaining.get(k) <= remaining.get(k-1)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every subarray individually. Instead, we can think about the structure of valid removals:

1. **Find the longest increasing prefix**: Starting from index 0, find how far we can go while maintaining strictly increasing order. Let's call this prefix ending at index `i`.
2. **Find the longest increasing suffix**: Starting from the end, find how far we can go backwards while maintaining strictly increasing order. Let's call this suffix starting at index `j`.
3. **Valid removals are those that remove a subarray between the prefix and suffix**: After removing a subarray, what remains is some prefix (possibly empty) followed by some suffix (possibly empty). For the result to be strictly increasing:
   - The prefix part must be from the initial increasing prefix
   - The suffix part must be from the final increasing suffix
   - The last element of the chosen prefix must be less than the first element of the chosen suffix

Here's the step-by-step reasoning:

**Step 1: Find the longest strictly increasing prefix**

- Start from index 0 and move right until we find an element that's not greater than the previous one
- All elements in this prefix are guaranteed to be strictly increasing

**Step 2: Find the longest strictly increasing suffix**

- Start from the last index and move left until we find an element that's not less than the next one
- All elements in this suffix are guaranteed to be strictly increasing

**Step 3: Handle the trivial case**

- If the entire array is strictly increasing, then ANY subarray removal works
- That gives us n\*(n+1)/2 possible subarrays

**Step 4: For the non-trivial case, use two pointers**

- Let `left` be the end of the increasing prefix (inclusive)
- Let `right` be the start of the increasing suffix (inclusive)
- We need to count subarrays that remove everything between some position in the prefix and some position in the suffix
- For each possible prefix end position `i`, we find the smallest `j` in the suffix such that `prefix[i] < suffix[j]`
- All subarrays starting at positions `i+1, i+2, ..., left+1` and ending at `j, j+1, ..., n-1` are valid

**Step 5: Use binary search for efficiency**

- Since the suffix is strictly increasing, we can binary search for the first position where `suffix[j] > prefix[i]`
- This gives us O(n log n) time complexity

## Optimal Solution

The optimal solution uses two pointers with binary search to achieve O(n log n) time complexity. Here's the complete implementation:

<div class="code-group">

```python
# Optimal Solution using Two Pointers with Binary Search
# Time: O(n log n) | Space: O(n)
def countIncremovableSubarrays(nums):
    n = len(nums)

    # Step 1: Find the longest strictly increasing prefix
    # We find the first index where the sequence stops being strictly increasing
    prefix_end = 0
    while prefix_end + 1 < n and nums[prefix_end] < nums[prefix_end + 1]:
        prefix_end += 1

    # If the entire array is strictly increasing, all subarrays are valid
    if prefix_end == n - 1:
        return n * (n + 1) // 2

    # Step 2: Find the longest strictly increasing suffix
    # We find the first index from the end where the sequence stops being strictly increasing
    suffix_start = n - 1
    while suffix_start - 1 >= 0 and nums[suffix_start - 1] < nums[suffix_start]:
        suffix_start -= 1

    # Step 3: Count subarrays where we remove only from the middle
    # We need to count subarrays that remove everything between some prefix and some suffix
    # such that the last element of prefix < first element of suffix

    # All subarrays that are completely within the prefix are valid
    # (removing them leaves prefix[0..i-1] + rest of array, which is valid since prefix is increasing)
    result = (prefix_end + 1) * (prefix_end + 2) // 2

    # All subarrays that are completely within the suffix are valid
    # (removing them leaves whole array before suffix + suffix[j+1..], which is valid since suffix is increasing)
    result += (n - suffix_start) * (n - suffix_start + 1) // 2

    # Now count subarrays that remove some middle part connecting prefix and suffix
    # For each possible end position in the prefix, find valid start positions in the suffix

    # Extract the actual prefix values (the increasing part from the start)
    prefix_values = nums[:prefix_end + 1]

    # Extract the actual suffix values (the increasing part from the end)
    suffix_values = nums[suffix_start:]

    # For each position in the prefix, binary search in suffix
    for i in range(len(prefix_values)):
        # We need to find the first element in suffix that is > prefix_values[i]
        # All subarrays that remove everything between i and that position are valid

        # Binary search for the first index in suffix where value > prefix_values[i]
        left, right = 0, len(suffix_values) - 1
        first_valid_suffix_idx = len(suffix_values)  # Default: no valid suffix found

        while left <= right:
            mid = (left + right) // 2
            if suffix_values[mid] > prefix_values[i]:
                first_valid_suffix_idx = mid
                right = mid - 1  # Try to find an earlier one
            else:
                left = mid + 1

        # If we found a valid suffix position, count all subarrays starting at or after it
        if first_valid_suffix_idx < len(suffix_values):
            # The subarray to remove starts right after prefix position i
            # and ends at or before the suffix position (first_valid_suffix_idx + suffix_start)
            # Actually, we need to be careful: the subarray must remove ALL elements between
            # i+1 and (suffix_start + first_valid_suffix_idx - 1)

            # All subarrays that remove everything from i+1 up to some position in the suffix
            # starting at first_valid_suffix_idx or later are valid
            result += len(suffix_values) - first_valid_suffix_idx

    return result
```

```javascript
// Optimal Solution using Two Pointers with Binary Search
// Time: O(n log n) | Space: O(n)
function countIncremovableSubarrays(nums) {
  const n = nums.length;

  // Step 1: Find the longest strictly increasing prefix
  let prefixEnd = 0;
  while (prefixEnd + 1 < n && nums[prefixEnd] < nums[prefixEnd + 1]) {
    prefixEnd++;
  }

  // If the entire array is strictly increasing, all subarrays are valid
  if (prefixEnd === n - 1) {
    return (n * (n + 1)) / 2;
  }

  // Step 2: Find the longest strictly increasing suffix
  let suffixStart = n - 1;
  while (suffixStart - 1 >= 0 && nums[suffixStart - 1] < nums[suffixStart]) {
    suffixStart--;
  }

  // Step 3: Count subarrays where we remove only from the middle
  // All subarrays completely within the prefix are valid
  let result = ((prefixEnd + 1) * (prefixEnd + 2)) / 2;

  // All subarrays completely within the suffix are valid
  result += ((n - suffixStart) * (n - suffixStart + 1)) / 2;

  // Extract prefix and suffix values
  const prefixValues = nums.slice(0, prefixEnd + 1);
  const suffixValues = nums.slice(suffixStart);

  // For each position in the prefix, binary search in suffix
  for (let i = 0; i < prefixValues.length; i++) {
    // Binary search for first element in suffix > prefixValues[i]
    let left = 0,
      right = suffixValues.length - 1;
    let firstValidSuffixIdx = suffixValues.length; // Default: no valid suffix

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (suffixValues[mid] > prefixValues[i]) {
        firstValidSuffixIdx = mid;
        right = mid - 1; // Try to find earlier one
      } else {
        left = mid + 1;
      }
    }

    // If found valid suffix position, count all subarrays starting at or after it
    if (firstValidSuffixIdx < suffixValues.length) {
      result += suffixValues.length - firstValidSuffixIdx;
    }
  }

  return result;
}
```

```java
// Optimal Solution using Two Pointers with Binary Search
// Time: O(n log n) | Space: O(n)
public int countIncremovableSubarrays(int[] nums) {
    int n = nums.length;

    // Step 1: Find the longest strictly increasing prefix
    int prefixEnd = 0;
    while (prefixEnd + 1 < n && nums[prefixEnd] < nums[prefixEnd + 1]) {
        prefixEnd++;
    }

    // If the entire array is strictly increasing, all subarrays are valid
    if (prefixEnd == n - 1) {
        return n * (n + 1) / 2;
    }

    // Step 2: Find the longest strictly increasing suffix
    int suffixStart = n - 1;
    while (suffixStart - 1 >= 0 && nums[suffixStart - 1] < nums[suffixStart]) {
        suffixStart--;
    }

    // Step 3: Count subarrays where we remove only from the middle
    // All subarrays completely within the prefix are valid
    long result = (long)(prefixEnd + 1) * (prefixEnd + 2) / 2;

    // All subarrays completely within the suffix are valid
    result += (long)(n - suffixStart) * (n - suffixStart + 1) / 2;

    // Extract prefix values
    int[] prefixValues = new int[prefixEnd + 1];
    for (int i = 0; i <= prefixEnd; i++) {
        prefixValues[i] = nums[i];
    }

    // Extract suffix values
    int[] suffixValues = new int[n - suffixStart];
    for (int i = 0; i < suffixValues.length; i++) {
        suffixValues[i] = nums[suffixStart + i];
    }

    // For each position in the prefix, binary search in suffix
    for (int i = 0; i < prefixValues.length; i++) {
        // Binary search for first element in suffix > prefixValues[i]
        int left = 0, right = suffixValues.length - 1;
        int firstValidSuffixIdx = suffixValues.length; // Default: no valid suffix

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (suffixValues[mid] > prefixValues[i]) {
                firstValidSuffixIdx = mid;
                right = mid - 1; // Try to find earlier one
            } else {
                left = mid + 1;
            }
        }

        // If found valid suffix position, count all subarrays starting at or after it
        if (firstValidSuffixIdx < suffixValues.length) {
            result += suffixValues.length - firstValidSuffixIdx;
        }
    }

    return (int)result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Finding the increasing prefix: O(n) - we scan from left to right
- Finding the increasing suffix: O(n) - we scan from right to left
- Binary search for each prefix element: O(log n) per element, and there are O(n) prefix elements in worst case
- Total: O(n) + O(n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We store the prefix values: O(n) in worst case (when most of array is increasing prefix)
- We store the suffix values: O(n) in worst case (when most of array is increasing suffix)
- Total: O(n)

We could optimize space to O(1) by not storing separate arrays and doing binary search directly on the original array with offset calculations, but O(n) space is acceptable given the constraints.

## Common Mistakes

1. **Forgetting the trivial case**: When the entire array is already strictly increasing, ALL subarrays are valid. This gives n\*(n+1)/2 subarrays. Candidates often miss this special case and get wrong answers for simple inputs.

2. **Off-by-one errors in prefix/suffix calculation**: The prefix ends at the last index where nums[i] < nums[i+1]. The suffix starts at the first index from the end where nums[i-1] < nums[i]. Getting these boundaries wrong leads to incorrect counts.

3. **Incorrect binary search condition**: When searching for the first suffix element greater than a prefix element, we need `suffix[mid] > prefix[i]`, not `>=`. Since we need strictly increasing, equal values are not allowed.

4. **Double-counting subarrays**: When counting subarrays within the prefix and suffix separately, then counting cross subarrays, make sure you're not counting any subarray twice. The three categories should be disjoint:
   - Subarrays entirely within prefix
   - Subarrays entirely within suffix
   - Subarrays that span from prefix to suffix (removing middle section)

## When You'll See This Pattern

This "increasing prefix + increasing suffix" pattern appears in several array problems:

1. **Shortest Subarray to be Removed to Make Array Sorted (LeetCode 1574)**: Very similar concept - find the shortest subarray to remove to make the array sorted. Uses the same prefix/suffix approach.

2. **Find Minimum in Rotated Sorted Array (LeetCode 153)**: While different, it also uses the concept of finding boundaries where order breaks.

3. **Maximum Product Subarray (LeetCode 152)**: Uses prefix/suffix scanning approach to handle negative numbers, though for a different purpose.

The core pattern is: when you need to maintain some property (like sortedness) after removing a contiguous segment, think about what must be true of the parts that remain.

## Key Takeaways

1. **Break the problem into structural components**: Instead of checking all O(n²) subarrays, identify that valid removals must preserve an increasing prefix and increasing suffix that "fit together".

2. **Use binary search on monotonic sequences**: When you have a strictly increasing sequence (the suffix), you can binary search to find boundaries efficiently, turning O(n²) into O(n log n).

3. **Handle edge cases explicitly**: The "entire array increasing" case is common and should be handled separately. Always test with simple cases like [1,2,3,4] and [1,3,2,4].

Related problems: [Shortest Subarray to be Removed to Make Array Sorted](/problem/shortest-subarray-to-be-removed-to-make-array-sorted)
