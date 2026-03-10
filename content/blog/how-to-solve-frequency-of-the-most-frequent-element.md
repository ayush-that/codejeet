---
title: "How to Solve Frequency of the Most Frequent Element — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Frequency of the Most Frequent Element. Medium difficulty, 44.6% acceptance rate. Topics: Array, Binary Search, Greedy, Sliding Window, Sorting."
date: "2028-04-10"
category: "dsa-patterns"
tags: ["frequency-of-the-most-frequent-element", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Frequency of the Most Frequent Element

You're given an array of integers and a budget `k` representing how much you can increment elements. Your goal is to maximize the frequency of a single element after performing at most `k` operations where each operation increments any element by 1. The challenge is that you can't decrement elements, and you need to efficiently determine which element to target and which other elements to increment to match it.

What makes this problem interesting is that it combines sorting with a sliding window technique. The key insight is that to maximize frequency, you want to make many elements equal to some target value, and it's most efficient to target elements that are already close together in value.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 4, 5]`, `k = 5`

**Step 1: Sort the array**
Sorted: `[1, 2, 4, 5]`

**Step 2: Consider making all elements equal to 5**

- To make 1 → 5: needs 4 increments
- To make 2 → 5: needs 3 increments
- To make 4 → 5: needs 1 increment
- Total: 4 + 3 + 1 = 8 increments needed, but we only have k=5
- This won't work

**Step 3: Consider making elements [2, 4, 5] equal to 5**

- To make 2 → 5: needs 3 increments
- To make 4 → 5: needs 1 increment
- Total: 3 + 1 = 4 increments ≤ k=5
- Frequency = 3 elements (2, 4, 5 all become 5)

**Step 4: Consider making elements [1, 2, 4] equal to 4**

- To make 1 → 4: needs 3 increments
- To make 2 → 4: needs 2 increments
- Total: 3 + 2 = 5 increments = k=5
- Frequency = 3 elements (1, 2, 4 all become 4)

**Step 5: Try sliding window approach**
We'll maintain a window where we can make all elements equal to the rightmost element:

- Start with window [1], cost=0, maxFreq=1
- Expand to [1,2]: cost to make both = 2? Let's calculate: target=2, cost=(2-1)=1, cost=1 ≤ k=5, maxFreq=2
- Expand to [1,2,4]: target=4, cost=(4-1)+(4-2)=3+2=5 ≤ k=5, maxFreq=3
- Try expand to [1,2,4,5]: target=5, cost=(5-1)+(5-2)+(5-4)=4+3+1=8 > k=5, so shrink from left
- Shrink to [2,4,5]: target=5, cost=(5-2)+(5-4)=3+1=4 ≤ k=5, maxFreq=3

The maximum frequency we found is 3.

## Brute Force Approach

A naive approach would be to consider every possible target value and every possible subset of elements to convert to that target. For each candidate target (which could be any element in the array or values up to max(nums)+k), you'd check all subsets to see which ones can be converted within budget k.

The brute force logic would be:

1. For each possible target value
2. For each possible subset of elements
3. Calculate the total increments needed to make all subset elements equal to target
4. If total ≤ k, update max frequency

This approach has exponential time complexity O(2^n × n) which is completely impractical for typical constraints (n up to 10^5).

Even a slightly better brute force would be O(n²): for each element as the target, try to include as many smaller elements as possible by sorting and checking prefixes. But this is still too slow.

## Optimized Approach

The key insight is that to maximize frequency, we should:

1. **Sort the array** - This allows us to consider contiguous segments where we make all elements equal to the largest element in the segment
2. **Use a sliding window** - Maintain a window [left, right] where we can make all elements equal to nums[right] within budget k
3. **Calculate cost efficiently** - The cost to make window elements equal to nums[right] is:  
   `cost = nums[right] × window_length - sum_of_window`

The reasoning: If we want to make all elements in window equal to nums[right], each element nums[i] needs (nums[right] - nums[i]) increments. Summing this gives the formula above.

As we expand the window to the right:

- Add nums[right] to the window
- Calculate new cost
- If cost > k, shrink from left until cost ≤ k
- Track the maximum window size

This works because:

- Sorting ensures we only need to consider making elements equal to the largest in the window
- The sliding window efficiently finds the largest valid contiguous segment
- We use prefix sums or a running sum to calculate window sums efficiently

## Optimal Solution

Here's the complete solution using sorting and sliding window:

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
# Space: O(1) if we sort in-place, O(n) if we need to copy for sorting
def maxFrequency(nums, k):
    # Step 1: Sort the array - this is crucial for the sliding window approach
    nums.sort()

    left = 0  # Left pointer of our sliding window
    current_sum = 0  # Sum of elements in the current window
    max_freq = 0  # Maximum frequency found so far

    # Step 2: Slide the right pointer through the array
    for right in range(len(nums)):
        # Add the current element to our window sum
        current_sum += nums[right]

        # Step 3: Check if current window is valid
        # The cost to make all elements in window equal to nums[right] is:
        # (nums[right] * window_length) - current_sum
        # This represents total increments needed
        window_length = right - left + 1
        required_cost = nums[right] * window_length - current_sum

        # Step 4: If cost exceeds k, shrink window from left
        while required_cost > k:
            current_sum -= nums[left]  # Remove leftmost element from sum
            left += 1  # Move left pointer rightward
            # Recalculate window length and required cost
            window_length = right - left + 1
            required_cost = nums[right] * window_length - current_sum

        # Step 5: Update maximum frequency (window size)
        max_freq = max(max_freq, window_length)

    return max_freq
```

```javascript
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(1) if we sort in-place, O(n) if we need to copy for sorting
function maxFrequency(nums, k) {
  // Step 1: Sort the array - this is crucial for the sliding window approach
  nums.sort((a, b) => a - b);

  let left = 0; // Left pointer of our sliding window
  let currentSum = 0; // Sum of elements in the current window
  let maxFreq = 0; // Maximum frequency found so far

  // Step 2: Slide the right pointer through the array
  for (let right = 0; right < nums.length; right++) {
    // Add the current element to our window sum
    currentSum += nums[right];

    // Step 3: Check if current window is valid
    // The cost to make all elements in window equal to nums[right] is:
    // (nums[right] * windowLength) - currentSum
    // This represents total increments needed
    let windowLength = right - left + 1;
    let requiredCost = nums[right] * windowLength - currentSum;

    // Step 4: If cost exceeds k, shrink window from left
    while (requiredCost > k) {
      currentSum -= nums[left]; // Remove leftmost element from sum
      left++; // Move left pointer rightward
      // Recalculate window length and required cost
      windowLength = right - left + 1;
      requiredCost = nums[right] * windowLength - currentSum;
    }

    // Step 5: Update maximum frequency (window size)
    maxFreq = Math.max(maxFreq, windowLength);
  }

  return maxFreq;
}
```

```java
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(1) if we sort in-place, O(n) if we need to copy for sorting
public int maxFrequency(int[] nums, int k) {
    // Step 1: Sort the array - this is crucial for the sliding window approach
    Arrays.sort(nums);

    int left = 0;  // Left pointer of our sliding window
    long currentSum = 0;  // Use long to prevent integer overflow
    int maxFreq = 0;  // Maximum frequency found so far

    // Step 2: Slide the right pointer through the array
    for (int right = 0; right < nums.length; right++) {
        // Add the current element to our window sum
        currentSum += nums[right];

        // Step 3: Check if current window is valid
        // The cost to make all elements in window equal to nums[right] is:
        // (nums[right] * windowLength) - currentSum
        // This represents total increments needed
        int windowLength = right - left + 1;
        long requiredCost = (long) nums[right] * windowLength - currentSum;

        // Step 4: If cost exceeds k, shrink window from left
        while (requiredCost > k) {
            currentSum -= nums[left];  // Remove leftmost element from sum
            left++;  // Move left pointer rightward
            // Recalculate window length and required cost
            windowLength = right - left + 1;
            requiredCost = (long) nums[right] * windowLength - currentSum;
        }

        // Step 5: Update maximum frequency (window size)
        maxFreq = Math.max(maxFreq, windowLength);
    }

    return maxFreq;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The sliding window traversal takes O(n) time
  - Each element is added to the window once (right pointer moves n times)
  - Each element is removed from the window at most once (left pointer moves at most n times)
  - The while loop inside the for loop doesn't make it O(n²) because each element is processed at most twice

**Space Complexity: O(1) or O(n)**

- If we can sort the input array in-place: O(1) extra space
- If we need to copy the array for sorting (e.g., when input shouldn't be modified): O(n) space
- The algorithm itself uses only a few variables (left, current_sum, max_freq)

## Common Mistakes

1. **Forgetting to sort the array**: This is the most critical step. Without sorting, you can't use the sliding window approach efficiently because you won't have the property that making elements equal to the rightmost element is optimal for that window.

2. **Integer overflow when calculating cost**: When n and values are large (up to 10^5 and 10^5 respectively), the product `nums[right] * window_length` can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for these calculations.

3. **Using the wrong cost formula**: Some candidates try to calculate cost by summing differences individually in O(n) time for each window adjustment, which makes the algorithm O(n²). The formula `nums[right] × window_length - sum_of_window` computes cost in O(1) if you maintain a running sum.

4. **Not handling the while loop correctly**: The condition should be `while required_cost > k` not `if required_cost > k`. When we shrink from the left, we might need to shrink multiple times until the window becomes valid again.

## When You'll See This Pattern

This "sort + sliding window" pattern appears in problems where you need to find a contiguous subsequence that satisfies some aggregate condition, especially when the condition involves making elements equal or similar.

Related problems:

1. **Minimum Operations to Make Array Equal** (LeetCode 1551): Similar concept of making array elements equal with minimum operations.
2. **Longest Subarray With Absolute Diff ≤ Limit** (LeetCode 1438): Uses sliding window with heaps to track min/max.
3. **Maximum Points You Can Obtain from Cards** (LeetCode 1423): Another sliding window problem where you maintain a window of certain properties.
4. **Frequency of the Most Frequent Element** itself has a harder version: **Apply Operations to Maximize Frequency Score** which uses similar concepts with additional constraints.

## Key Takeaways

1. **When you need to make elements equal or similar, sorting first often helps**: Sorting transforms the problem from "which elements to pick" to "which contiguous segment to pick" since elements close in value are easier to make equal.

2. **Sliding window is powerful for contiguous subsequence problems**: When you need to find the longest/shortest contiguous segment satisfying some condition, consider if you can maintain a window that expands and shrinks based on the condition.

3. **Maintain running aggregates for O(1) updates**: Instead of recalculating window properties from scratch, maintain running sums, products, or other aggregates that can be updated in O(1) when the window changes.

Related problems: [Find All Lonely Numbers in the Array](/problem/find-all-lonely-numbers-in-the-array), [Longest Nice Subarray](/problem/longest-nice-subarray), [Apply Operations to Maximize Frequency Score](/problem/apply-operations-to-maximize-frequency-score)
