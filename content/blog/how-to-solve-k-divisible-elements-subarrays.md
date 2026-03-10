---
title: "How to Solve K Divisible Elements Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K Divisible Elements Subarrays. Medium difficulty, 54.8% acceptance rate. Topics: Array, Hash Table, Trie, Rolling Hash, Hash Function."
date: "2028-08-17"
category: "dsa-patterns"
tags: ["k-divisible-elements-subarrays", "array", "hash-table", "trie", "medium"]
---

# How to Solve K Divisible Elements Subarrays

This problem asks us to count distinct subarrays where at most `k` elements are divisible by `p`. The challenge comes from needing to track both the divisibility constraint _and_ ensure we don't double-count identical subarrays. A subarray is a contiguous sequence from the original array, and two subarrays are distinct if they have different lengths or differ in at least one position.

What makes this interesting: We need to efficiently generate all valid subarrays while avoiding duplicates. A naive approach would generate O(n²) subarrays and check each one, but that's too slow for larger inputs. The key insight is that we can use hashing to store subarray representations and avoid duplicates.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 3, 3, 2, 2]`, `k = 2`, `p = 2`

First, identify which elements are divisible by 2:

- Index 0: 2 ÷ 2 = 1 → divisible ✓
- Index 1: 3 ÷ 2 = 1.5 → not divisible ✗
- Index 2: 3 ÷ 2 = 1.5 → not divisible ✗
- Index 3: 2 ÷ 2 = 1 → divisible ✓
- Index 4: 2 ÷ 2 = 1 → divisible ✓

Now let's find all subarrays with at most 2 divisible elements:

**Starting at index 0:**

- [2] → 1 divisible element ✓ (add to set)
- [2, 3] → 1 divisible element ✓ (add to set)
- [2, 3, 3] → 1 divisible element ✓ (add to set)
- [2, 3, 3, 2] → 2 divisible elements ✓ (add to set)
- [2, 3, 3, 2, 2] → 3 divisible elements ✗ (exceeds k=2)

**Starting at index 1:**

- [3] → 0 divisible elements ✓ (add to set)
- [3, 3] → 0 divisible elements ✓ (add to set)
- [3, 3, 2] → 1 divisible element ✓ (add to set)
- [3, 3, 2, 2] → 2 divisible elements ✓ (add to set)

**Starting at index 2:**

- [3] → 0 divisible elements ✓ (already in set from [3] at index 1)
- [3, 2] → 1 divisible element ✓ (add to set)
- [3, 2, 2] → 2 divisible elements ✓ (add to set)

**Starting at index 3:**

- [2] → 1 divisible element ✓ (already in set from [2] at index 0)
- [2, 2] → 2 divisible elements ✓ (add to set)

**Starting at index 4:**

- [2] → 1 divisible element ✓ (already in set)

We need a way to track these subarrays without duplicates. Notice that [3] appears twice but should only be counted once. This is why we need a data structure to store unique representations.

## Brute Force Approach

The most straightforward approach is to generate all possible subarrays, check if they satisfy the divisibility constraint, and add them to a set to ensure uniqueness:

1. Generate all O(n²) subarrays by using two nested loops
2. For each subarray, count how many elements are divisible by `p`
3. If the count ≤ `k`, add the subarray to a set (using tuple representation)
4. Return the size of the set

The problem with this approach is efficiency. For an array of length n, there are n(n+1)/2 subarrays. For each subarray, we need to:

- Count divisible elements (O(length of subarray))
- Convert to a tuple for storage (O(length of subarray))

This gives us O(n³) time complexity in the worst case, which is far too slow for n up to 200 (as in typical LeetCode constraints). We need to optimize both the counting and the duplicate checking.

## Optimized Approach

The key insight is that we can use a **rolling count** of divisible elements and **hashing** to efficiently track unique subarrays:

1. **Rolling divisibility count**: Instead of recounting divisible elements for each subarray from scratch, we can maintain a running count. When we extend a subarray by one element, we just check if that new element is divisible by `p` and update our count.

2. **Early termination**: If at any point our divisible count exceeds `k`, we can stop extending that subarray further to the right.

3. **Efficient uniqueness checking**: We need a way to quickly check if we've seen a subarray before. The most efficient approach is to use a **hash set** with string or tuple representations. For even better performance with large subarrays, we could use rolling hashes, but for the constraints of this problem (n ≤ 200), simple tuple hashing is sufficient.

4. **Optimized generation**: We iterate through all possible starting indices. For each starting index, we extend to the right while keeping track of our divisible count. We add each valid subarray to our set as we go.

This approach reduces the time complexity to O(n²) in the worst case, which is acceptable for n ≤ 200.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n²) - We check all O(n²) subarrays, each insertion is O(n) worst case
# Space: O(n²) - In worst case, all subarrays are distinct and stored
def countDistinct(nums, k, p):
    """
    Count distinct subarrays with at most k elements divisible by p.

    Args:
        nums: List of integers
        k: Maximum allowed divisible elements
        p: Divisor to check against

    Returns:
        Number of distinct valid subarrays
    """
    n = len(nums)
    distinct_subarrays = set()  # Store unique subarray representations

    # Try every possible starting index
    for start in range(n):
        divisible_count = 0  # Count of divisible elements in current subarray
        current_subarray = []  # Build subarray as we extend

        # Extend subarray to the right from current start
        for end in range(start, n):
            # Check if current element is divisible by p
            if nums[end] % p == 0:
                divisible_count += 1

            # If we exceed k divisible elements, stop extending
            if divisible_count > k:
                break

            # Add current element to our subarray
            current_subarray.append(nums[end])

            # Convert to tuple for hashing (lists aren't hashable)
            # Tuples are immutable and can be used as set elements
            subarray_tuple = tuple(current_subarray)

            # Add to set (automatically handles duplicates)
            distinct_subarrays.add(subarray_tuple)

    return len(distinct_subarrays)
```

```javascript
// Time: O(n²) - Checking all O(n²) subarrays
// Space: O(n²) - Storing all distinct subarrays in worst case
function countDistinct(nums, k, p) {
  /**
   * Count distinct subarrays with at most k elements divisible by p.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Maximum allowed divisible elements
   * @param {number} p - Divisor to check against
   * @return {number} - Number of distinct valid subarrays
   */
  const n = nums.length;
  const distinctSubarrays = new Set(); // Store unique subarray representations

  // Try every possible starting index
  for (let start = 0; start < n; start++) {
    let divisibleCount = 0; // Count of divisible elements in current subarray
    let currentSubarray = ""; // Build subarray as string for hashing

    // Extend subarray to the right from current start
    for (let end = start; end < n; end++) {
      // Check if current element is divisible by p
      if (nums[end] % p === 0) {
        divisibleCount++;
      }

      // If we exceed k divisible elements, stop extending
      if (divisibleCount > k) {
        break;
      }

      // Add current element to our subarray representation
      // We use a separator to distinguish between multi-digit numbers
      // e.g., [1, 23] becomes "1,23" and [12, 3] becomes "12,3"
      currentSubarray += (currentSubarray ? "," : "") + nums[end].toString();

      // Add to set (automatically handles duplicates)
      distinctSubarrays.add(currentSubarray);
    }
  }

  return distinctSubarrays.size;
}
```

```java
// Time: O(n²) - Checking all O(n²) subarrays
// Space: O(n²) - Storing all distinct subarrays in worst case
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int countDistinct(int[] nums, int k, int p) {
        /**
         * Count distinct subarrays with at most k elements divisible by p.
         *
         * @param nums - Array of integers
         * @param k - Maximum allowed divisible elements
         * @param p - Divisor to check against
         * @return Number of distinct valid subarrays
         */
        int n = nums.length;
        Set<String> distinctSubarrays = new HashSet<>();  // Store unique subarray representations

        // Try every possible starting index
        for (int start = 0; start < n; start++) {
            int divisibleCount = 0;  // Count of divisible elements in current subarray
            StringBuilder currentSubarray = new StringBuilder();  // Build subarray as string

            // Extend subarray to the right from current start
            for (int end = start; end < n; end++) {
                // Check if current element is divisible by p
                if (nums[end] % p == 0) {
                    divisibleCount++;
                }

                // If we exceed k divisible elements, stop extending
                if (divisibleCount > k) {
                    break;
                }

                // Add current element to our subarray representation
                // We use a separator to distinguish between numbers
                if (currentSubarray.length() > 0) {
                    currentSubarray.append(",");
                }
                currentSubarray.append(nums[end]);

                // Add to set (automatically handles duplicates)
                distinctSubarrays.add(currentSubarray.toString());
            }
        }

        return distinctSubarrays.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Outer loop runs n times (for each starting index)
- Inner loop runs up to n times in worst case (when k is large)
- For each subarray, we perform O(1) operations (check divisibility, update count, add to set)
- The string/tuple construction for hashing takes O(m) where m is subarray length, but amortized over all subarrays this is still O(n²)

**Space Complexity: O(n²)**

- In the worst case, all subarrays are distinct and we store them all
- There are n(n+1)/2 subarrays, each requiring O(n) space in worst case
- This gives O(n³) in theory, but in practice the average subarray length is shorter
- For n ≤ 200, this is acceptable (maximum ~40,000 subarrays)

## Common Mistakes

1. **Forgetting to handle the "at most k" condition correctly**: Some candidates check for "exactly k" instead of "at most k". Remember: ≤ k, not = k.

2. **Not breaking early when divisible count exceeds k**: If you continue extending a subarray after it already has more than k divisible elements, you'll waste time and potentially add invalid subarrays.

3. **Using lists instead of tuples/strings for set storage**: In Python, lists are mutable and cannot be used as set elements or dictionary keys. You must convert to tuple first. In Java/JavaScript, you need to convert to a string representation.

4. **Not accounting for duplicate subarrays from different starting positions**: The example [3, 3, 2] shows that the subarray [3] appears starting at both index 1 and index 2. Without a set to track uniqueness, you'd double-count.

5. **Off-by-one errors in loop boundaries**: Remember that subarrays are inclusive of both start and end indices. The inner loop should go from `start` to `n-1`, not `start+1` to `n`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Subarray enumeration with constraints**: Similar to "Subarrays with K Different Integers" (LeetCode 992) where you count subarrays with exactly K distinct integers. The technique of expanding/contracting windows while tracking counts is common.

2. **Distinct substring/subarray counting**: Like "Number of Distinct Substrings in a String" (LeetCode 1698) or "Distinct Echo Substrings" (LeetCode 1316). The use of hashing to track uniqueness is a standard approach.

3. **Rolling property tracking**: Problems where you need to maintain some property (sum, count, product) as you extend subarrays appear frequently. "Subarray Sum Equals K" (LeetCode 560) and "Maximum Size Subarray Sum Equals k" (LeetCode 325) use similar techniques.

## Key Takeaways

1. **When counting distinct sequences, hashing is your friend**: Sets provide O(1) duplicate checking, which is crucial for efficiency. Convert subarrays to hashable forms (tuples in Python, strings in Java/JavaScript).

2. **Rolling counts optimize repeated calculations**: Instead of recalculating from scratch for each subarray, maintain running totals as you extend. This turns O(n³) into O(n²).

3. **Early termination improves efficiency**: Once a subarray violates the constraint, further extensions will also violate it (since we're only adding elements). Breaking early saves unnecessary computation.

4. **Subarray problems often have O(n²) optimal solutions**: When you need to consider all contiguous subsequences, O(n²) is often the best you can do since there are that many subarrays.

Related problems: [Subarrays with K Different Integers](/problem/subarrays-with-k-different-integers), [Count Number of Nice Subarrays](/problem/count-number-of-nice-subarrays), [Subarray With Elements Greater Than Varying Threshold](/problem/subarray-with-elements-greater-than-varying-threshold)
