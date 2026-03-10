---
title: "How to Solve Subarrays with K Different Integers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Subarrays with K Different Integers. Hard difficulty, 67.6% acceptance rate. Topics: Array, Hash Table, Sliding Window, Counting."
date: "2027-08-27"
category: "dsa-patterns"
tags: ["subarrays-with-k-different-integers", "array", "hash-table", "sliding-window", "hard"]
---

# How to Solve Subarrays with K Different Integers

This problem asks us to count all contiguous subarrays where exactly `k` distinct integers appear. What makes this problem tricky is that "exactly k" is harder to handle than "at most k" — we can't just use a standard sliding window that expands and contracts, because we need to count subarrays with precisely `k` distinct values, not just those with up to `k` distinct values.

## Visual Walkthrough

Let's trace through an example: `nums = [1,2,1,2,3]`, `k = 2`

We need to count all subarrays with exactly 2 distinct integers. Let's think about how we might approach this:

**Subarrays with exactly 2 distinct integers:**

- `[1,2]` → distinct: {1,2} ✓
- `[1,2,1]` → distinct: {1,2} ✓
- `[1,2,1,2]` → distinct: {1,2} ✓
- `[2,1]` → distinct: {1,2} ✓
- `[2,1,2]` → distinct: {1,2} ✓
- `[1,2]` (starting at index 2) → distinct: {1,2} ✓
- `[1,2,3]` → distinct: {1,2,3} ✗ (3 distinct)
- `[2,3]` → distinct: {2,3} ✓

Total: 7 good subarrays

The key insight: Counting subarrays with **exactly k** distinct integers = Counting subarrays with **at most k** distinct integers - Counting subarrays with **at most k-1** distinct integers.

Why does this work? If we can count all subarrays with ≤ k distinct integers, and subtract those with ≤ (k-1) distinct integers, we're left with only those that have exactly k distinct integers.

## Brute Force Approach

The brute force solution would check every possible subarray and count its distinct elements:

1. Generate all possible subarrays (n² possibilities)
2. For each subarray, count distinct elements (O(n) time with a hash set)
3. If distinct count equals k, increment result

This gives us O(n³) time complexity, which is far too slow for typical constraints (n up to 2×10⁴).

Even with some optimization (like keeping a running count of distinct elements), we'd still have O(n²) time, which is too slow for the upper bounds of this problem.

## Optimized Approach

The optimal solution uses the **sliding window** technique with a clever transformation:

**Key Insight:**

- Let `atMostK(nums, k)` = number of subarrays with at most k distinct integers
- Then `exactlyK(nums, k) = atMostK(nums, k) - atMostK(nums, k-1)`

**Why this works:**

- Every subarray with exactly k distinct integers is included in `atMostK(nums, k)`
- But `atMostK(nums, k)` also includes subarrays with fewer than k distinct integers
- By subtracting `atMostK(nums, k-1)`, we remove all subarrays with ≤ (k-1) distinct integers
- What remains are subarrays with exactly k distinct integers

**How to implement `atMostK`:**
We use a sliding window with two pointers `left` and `right`:

1. Expand `right` pointer to include new elements
2. Use a hash map to count frequencies of elements in the current window
3. When distinct count exceeds k, shrink window from the left until we're back to ≤ k distinct
4. For each position of `right`, the number of valid subarrays ending at `right` is `(right - left + 1)`

**Why the count formula works:**
For a window `[left...right]` with ≤ k distinct integers, all subarrays ending at `right` and starting anywhere from `left` to `right` are valid. That's exactly `(right - left + 1)` subarrays.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(k) for the frequency map
def subarraysWithKDistinct(nums, k):
    """
    Count subarrays with exactly k distinct integers.
    Uses the transformation: exactlyK = atMostK(k) - atMostK(k-1)
    """
    def atMostK(k):
        """Count subarrays with at most k distinct integers."""
        left = 0
        result = 0
        freq = {}  # Frequency map for elements in current window

        for right in range(len(nums)):
            # Add current element to window
            num = nums[right]
            freq[num] = freq.get(num, 0) + 1

            # Shrink window if we have more than k distinct elements
            while len(freq) > k:
                left_num = nums[left]
                freq[left_num] -= 1
                if freq[left_num] == 0:
                    del freq[left_num]  # Remove from map when count reaches 0
                left += 1

            # All subarrays ending at 'right' with start from 'left' to 'right' are valid
            # That's (right - left + 1) subarrays
            result += (right - left + 1)

        return result

    # Main logic: exactly k = at most k - at most (k-1)
    return atMostK(k) - atMostK(k - 1)
```

```javascript
// Time: O(n) | Space: O(k) for the frequency map
function subarraysWithKDistinct(nums, k) {
  /**
   * Count subarrays with exactly k distinct integers.
   * Uses the transformation: exactlyK = atMostK(k) - atMostK(k-1)
   */

  function atMostK(k) {
    /** Count subarrays with at most k distinct integers. */
    let left = 0;
    let result = 0;
    const freq = new Map(); // Frequency map for elements in current window

    for (let right = 0; right < nums.length; right++) {
      // Add current element to window
      const num = nums[right];
      freq.set(num, (freq.get(num) || 0) + 1);

      // Shrink window if we have more than k distinct elements
      while (freq.size > k) {
        const leftNum = nums[left];
        freq.set(leftNum, freq.get(leftNum) - 1);
        if (freq.get(leftNum) === 0) {
          freq.delete(leftNum); // Remove from map when count reaches 0
        }
        left++;
      }

      // All subarrays ending at 'right' with start from 'left' to 'right' are valid
      // That's (right - left + 1) subarrays
      result += right - left + 1;
    }

    return result;
  }

  // Main logic: exactly k = at most k - at most (k-1)
  return atMostK(k) - atMostK(k - 1);
}
```

```java
// Time: O(n) | Space: O(k) for the frequency map
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int subarraysWithKDistinct(int[] nums, int k) {
        /**
         * Count subarrays with exactly k distinct integers.
         * Uses the transformation: exactlyK = atMostK(k) - atMostK(k-1)
         */
        return atMostK(nums, k) - atMostK(nums, k - 1);
    }

    private int atMostK(int[] nums, int k) {
        /** Count subarrays with at most k distinct integers. */
        int left = 0;
        int result = 0;
        Map<Integer, Integer> freq = new HashMap<>();  // Frequency map for elements in current window

        for (int right = 0; right < nums.length; right++) {
            // Add current element to window
            int num = nums[right];
            freq.put(num, freq.getOrDefault(num, 0) + 1);

            // Shrink window if we have more than k distinct elements
            while (freq.size() > k) {
                int leftNum = nums[left];
                freq.put(leftNum, freq.get(leftNum) - 1);
                if (freq.get(leftNum) == 0) {
                    freq.remove(leftNum);  // Remove from map when count reaches 0
                }
                left++;
            }

            // All subarrays ending at 'right' with start from 'left' to 'right' are valid
            // That's (right - left + 1) subarrays
            result += (right - left + 1);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array (one for `atMostK(k)` and one for `atMostK(k-1)`)
- Each element is added to the window once and removed at most once
- The `while` loop for shrinking doesn't make it O(n²) because each element is processed at most twice (added once, removed once)

**Space Complexity:** O(k)

- We store at most k+1 distinct elements in the frequency map at any time
- In practice, it's O(min(n, k)), but since k ≤ n, we can say O(k)

## Common Mistakes

1. **Trying to directly count "exactly k" with one sliding window:** This is the most common mistake. When the window has exactly k distinct elements and you try to expand it, you might overshoot. When you shrink it, you might undershoot. The transformation to "at most k" is key.

2. **Forgetting to handle k = 0 or k > n:** For k = 0, there are no subarrays with exactly 0 distinct integers (an empty subarray technically has 0 distinct, but subarrays must be non-empty in this problem). For k > n, the answer should be 0. Our solution handles these cases correctly because `atMostK(k-1)` for k=0 becomes `atMostK(-1)` which returns 0.

3. **Incorrect counting of subarrays in `atMostK`:** Some candidates try to count each valid window as 1 subarray, but actually each valid window `[left...right]` contains `(right-left+1)` subarrays ending at `right`. This is because you can start at any position from `left` to `right`.

4. **Not properly cleaning up the frequency map:** When shrinking the window, you must completely remove elements whose count reaches 0 from the map. Otherwise, `len(freq)` or `freq.size()` won't accurately reflect the number of distinct elements.

## When You'll See This Pattern

This "exactly K = at most K - at most (K-1)" transformation appears in several sliding window problems:

1. **Subarrays with K Different Integers** (this problem) - Counting subarrays with exactly K distinct elements
2. **Binary Subarrays With Sum** - Can be solved as "subarrays with sum exactly S = subarrays with sum ≤ S - subarrays with sum ≤ (S-1)"
3. **Count Number of Nice Subarrays** - "exactly k odd numbers = at most k odds - at most (k-1) odds"

The pattern is useful whenever you need to count subarrays/substrings with an **exact** property that's easier to express as an **upper bound**.

## Key Takeaways

1. **Transform exact constraints to bounded constraints:** When asked for "exactly K", consider if you can compute "at most K" and "at most K-1" instead. This often simplifies sliding window logic significantly.

2. **Counting subarrays in sliding windows:** For a window `[left...right]` satisfying some property, the number of valid subarrays **ending at right** is `(right - left + 1)`. This is because you can start the subarray at any position from `left` to `right`.

3. **Maintain distinct counts efficiently:** Use a frequency map (hash map) to track elements in the current window. When an element's count drops to 0, remove it from the map to keep an accurate count of distinct elements.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Longest Substring with At Most Two Distinct Characters](/problem/longest-substring-with-at-most-two-distinct-characters), [Longest Substring with At Most K Distinct Characters](/problem/longest-substring-with-at-most-k-distinct-characters)
