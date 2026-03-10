---
title: "How to Solve Minimum Operations to Make the Array Alternating — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make the Array Alternating. Medium difficulty, 35.4% acceptance rate. Topics: Array, Hash Table, Greedy, Counting."
date: "2029-05-16"
category: "dsa-patterns"
tags:
  ["minimum-operations-to-make-the-array-alternating", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Minimum Operations to Make the Array Alternating

This problem asks us to transform an array into an alternating pattern where elements at even indices are all equal to each other, elements at odd indices are all equal to each other, and these two values must be different. The tricky part is that we can change any element to any value in one operation, and we need to minimize the total number of changes. What makes this interesting is that we need to balance between choosing the most frequent values for even and odd positions while ensuring they're different.

## Visual Walkthrough

Let's trace through example `nums = [3,1,3,2,4,3]`:

**Step 1: Separate even and odd positions**

- Even indices (0, 2, 4): [3, 3, 4]
- Odd indices (1, 3, 5): [1, 2, 3]

**Step 2: Find frequency of each value**

- Even positions: 3 appears 2 times, 4 appears 1 time
- Odd positions: 1 appears 1 time, 2 appears 1 time, 3 appears 1 time

**Step 3: Consider possible choices**
We need to pick one value for all even positions and one different value for all odd positions.

Option A: Pick 3 for evens (2 matches), pick 1 for odds (1 match)  
Operations = total elements - matches = 6 - (2 + 1) = 3 operations

Option B: Pick 3 for evens (2 matches), pick 2 for odds (1 match)  
Operations = 6 - (2 + 1) = 3 operations

Option C: Pick 3 for evens (2 matches), pick 3 for odds (1 match) → INVALID (values must differ)

Option D: Pick 4 for evens (1 match), pick 1 for odds (1 match)  
Operations = 6 - (1 + 1) = 4 operations

Option E: Pick 4 for evens (1 match), pick 2 for odds (1 match)  
Operations = 6 - (1 + 1) = 4 operations

**Step 4: Choose minimum**
Minimum is 3 operations. We can achieve this by changing:

- Even positions: Keep both 3's, change 4 to 3
- Odd positions: Keep 1, change 2 to 1, change 3 to 1  
  Result: [3,1,3,1,3,1] which is alternating.

## Brute Force Approach

A naive approach would try all possible pairs of values for even and odd positions. Since values can be any positive integers (not just those in the array), this is infinite. Even if we limit to values present in the array, we have O(n²) pairs to check, and for each pair we need O(n) operations to count matches, giving O(n³) time.

What a candidate might try: For each possible value x for even positions and each possible value y (≠ x) for odd positions, count how many elements match. This is O(m²n) where m is number of distinct values. With m up to n, this becomes O(n³), which is too slow for n up to 10⁵.

## Optimized Approach

The key insight is that we only need to consider the most frequent values for even and odd positions. Here's the step-by-step reasoning:

1. **Separate and count frequencies**: Split the array into even-indexed and odd-indexed elements. Count frequency of each value in both groups.

2. **Find top candidates**: For even positions, get the value with highest frequency. For odd positions, get the value with highest frequency.

3. **Handle the conflict**: If the top values are different, we can use them. Total operations = n - (freq_even_top + freq_odd_top).

4. **Alternative when top values match**: If the top values are the same, we have two options:
   - Use top even value with second-top odd value
   - Use top odd value with second-top even value
     Choose the combination that gives maximum matches (minimum operations).

5. **Edge cases**: If a group has only one unique value, its "second best" frequency is 0. If a group is empty (n=1), we need special handling.

This approach works because changing elements to any value not in the array would never give us more matches than changing to the most frequent existing value in that position group.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumOperations(nums):
    """
    Returns minimum operations to make array alternating.
    Array is alternating if:
    1. All even-indexed elements are equal
    2. All odd-indexed elements are equal
    3. Even value != odd value
    """
    n = len(nums)

    # Edge case: array of length 1 is already alternating
    if n == 1:
        return 0

    # Step 1: Separate even and odd indexed elements
    even_counts = {}
    odd_counts = {}

    for i, num in enumerate(nums):
        if i % 2 == 0:
            even_counts[num] = even_counts.get(num, 0) + 1
        else:
            odd_counts[num] = odd_counts.get(num, 0) + 1

    # Step 2: Find top two most frequent values for even positions
    # We track both top and second-top frequencies
    even_top1_val, even_top1_freq = -1, 0
    even_top2_val, even_top2_freq = -1, 0

    for val, freq in even_counts.items():
        if freq > even_top1_freq:
            # Demote current top to second place
            even_top2_val, even_top2_freq = even_top1_val, even_top1_freq
            # Update new top
            even_top1_val, even_top1_freq = val, freq
        elif freq > even_top2_freq:
            # Update second place only
            even_top2_val, even_top2_freq = val, freq

    # Step 3: Find top two most frequent values for odd positions
    odd_top1_val, odd_top1_freq = -1, 0
    odd_top2_val, odd_top2_freq = -1, 0

    for val, freq in odd_counts.items():
        if freq > odd_top1_freq:
            odd_top2_val, odd_top2_freq = odd_top1_val, odd_top1_freq
            odd_top1_val, odd_top1_freq = val, freq
        elif freq > odd_top2_freq:
            odd_top2_val, odd_top2_freq = val, freq

    # Step 4: Calculate minimum operations
    # If top values are different, use them
    if even_top1_val != odd_top1_val:
        # Total elements - matches with chosen values
        return n - (even_top1_freq + odd_top1_freq)
    else:
        # Try two alternatives when top values conflict
        # Option 1: Use top even with second-top odd
        option1 = n - (even_top1_freq + (odd_top2_freq if odd_top2_val != -1 else 0))
        # Option 2: Use top odd with second-top even
        option2 = n - (odd_top1_freq + (even_top2_freq if even_top2_val != -1 else 0))
        return min(option1, option2)
```

```javascript
// Time: O(n) | Space: O(n)
function minimumOperations(nums) {
  const n = nums.length;

  // Edge case: array of length 1 is already alternating
  if (n === 1) return 0;

  // Step 1: Count frequencies for even and odd indices
  const evenCounts = new Map();
  const oddCounts = new Map();

  for (let i = 0; i < n; i++) {
    const num = nums[i];
    if (i % 2 === 0) {
      evenCounts.set(num, (evenCounts.get(num) || 0) + 1);
    } else {
      oddCounts.set(num, (oddCounts.get(num) || 0) + 1);
    }
  }

  // Step 2: Find top two frequencies for even positions
  let evenTop1Val = -1,
    evenTop1Freq = 0;
  let evenTop2Val = -1,
    evenTop2Freq = 0;

  for (const [val, freq] of evenCounts) {
    if (freq > evenTop1Freq) {
      // Move current top to second place
      evenTop2Val = evenTop1Val;
      evenTop2Freq = evenTop1Freq;
      // Update new top
      evenTop1Val = val;
      evenTop1Freq = freq;
    } else if (freq > evenTop2Freq) {
      // Update second place only
      evenTop2Val = val;
      evenTop2Freq = freq;
    }
  }

  // Step 3: Find top two frequencies for odd positions
  let oddTop1Val = -1,
    oddTop1Freq = 0;
  let oddTop2Val = -1,
    oddTop2Freq = 0;

  for (const [val, freq] of oddCounts) {
    if (freq > oddTop1Freq) {
      oddTop2Val = oddTop1Val;
      oddTop2Freq = oddTop1Freq;
      oddTop1Val = val;
      oddTop1Freq = freq;
    } else if (freq > oddTop2Freq) {
      oddTop2Val = val;
      oddTop2Freq = freq;
    }
  }

  // Step 4: Calculate minimum operations
  if (evenTop1Val !== oddTop1Val) {
    // Best values don't conflict
    return n - (evenTop1Freq + oddTop1Freq);
  } else {
    // Values conflict, try both alternatives
    // Option 1: Top even with second-best odd
    const option1 = n - (evenTop1Freq + (oddTop2Val !== -1 ? oddTop2Freq : 0));
    // Option 2: Top odd with second-best even
    const option2 = n - (oddTop1Freq + (evenTop2Val !== -1 ? evenTop2Freq : 0));
    return Math.min(option1, option2);
  }
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int minimumOperations(int[] nums) {
        int n = nums.length;

        // Edge case: array of length 1 is already alternating
        if (n == 1) return 0;

        // Step 1: Count frequencies for even and odd indices
        Map<Integer, Integer> evenCounts = new HashMap<>();
        Map<Integer, Integer> oddCounts = new HashMap<>();

        for (int i = 0; i < n; i++) {
            int num = nums[i];
            if (i % 2 == 0) {
                evenCounts.put(num, evenCounts.getOrDefault(num, 0) + 1);
            } else {
                oddCounts.put(num, oddCounts.getOrDefault(num, 0) + 1);
            }
        }

        // Step 2: Find top two frequencies for even positions
        int evenTop1Val = -1, evenTop1Freq = 0;
        int evenTop2Val = -1, evenTop2Freq = 0;

        for (Map.Entry<Integer, Integer> entry : evenCounts.entrySet()) {
            int val = entry.getKey();
            int freq = entry.getValue();

            if (freq > evenTop1Freq) {
                // Move current top to second place
                evenTop2Val = evenTop1Val;
                evenTop2Freq = evenTop1Freq;
                // Update new top
                evenTop1Val = val;
                evenTop1Freq = freq;
            } else if (freq > evenTop2Freq) {
                // Update second place only
                evenTop2Val = val;
                evenTop2Freq = freq;
            }
        }

        // Step 3: Find top two frequencies for odd positions
        int oddTop1Val = -1, oddTop1Freq = 0;
        int oddTop2Val = -1, oddTop2Freq = 0;

        for (Map.Entry<Integer, Integer> entry : oddCounts.entrySet()) {
            int val = entry.getKey();
            int freq = entry.getValue();

            if (freq > oddTop1Freq) {
                oddTop2Val = oddTop1Val;
                oddTop2Freq = oddTop1Freq;
                oddTop1Val = val;
                oddTop1Freq = freq;
            } else if (freq > oddTop2Freq) {
                oddTop2Val = val;
                oddTop2Freq = freq;
            }
        }

        // Step 4: Calculate minimum operations
        if (evenTop1Val != oddTop1Val) {
            // Best values don't conflict
            return n - (evenTop1Freq + oddTop1Freq);
        } else {
            // Values conflict, try both alternatives
            // Option 1: Top even with second-best odd
            int option1 = n - (evenTop1Freq + (oddTop2Val != -1 ? oddTop2Freq : 0));
            // Option 2: Top odd with second-best even
            int option2 = n - (oddTop1Freq + (evenTop2Val != -1 ? evenTop2Freq : 0));
            return Math.min(option1, option2);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We make a single pass through the array to separate and count frequencies (O(n)). Then we iterate through the frequency maps to find top two frequencies. Since each map has at most n entries but typically much fewer distinct values, this is O(k) where k ≤ n. Overall linear time.

**Space Complexity: O(n)**  
We store frequency counts for even and odd positions. In the worst case where all elements are distinct, each map could have up to n/2 entries, so O(n) space total.

## Common Mistakes

1. **Forgetting to handle the top-value conflict**: When the most frequent value for even and odd positions is the same, candidates often just use it anyway, violating the "values must differ" condition. Always check for this case and consider the second-best options.

2. **Not tracking second-top frequencies**: Some candidates only track the top frequency, then when there's a conflict, they have to recompute second-best, adding unnecessary complexity or missing the optimal solution.

3. **Incorrect operation count formula**: The formula is `n - (matches_even + matches_odd)`, not `(n/2 - matches_even) + (n/2 - matches_odd)`. The latter fails when n is odd because even and odd positions have different counts.

4. **Edge case handling for n=1**: An array with one element is trivially alternating (no adjacent elements to compare). Some candidates return 1 instead of 0.

## When You'll See This Pattern

This "separate and find most frequent" pattern appears in problems where you need to optimize based on frequency counts in different subgroups:

1. **Minimum Deletions to Make Array Beautiful**: Similar alternating pattern problem where you need to make array alternating by deletions rather than changes.

2. **Minimum Number of Flips to Make Binary String Alternating**: Also deals with alternating patterns but in binary strings with circular rotation.

3. **Make Sum Divisible by P**: Uses frequency counting of remainders to find optimal deletions.

The core technique is: when you need to maximize matches/minimize changes for a pattern, separate elements by their position in the pattern, find most frequent values in each group, and handle conflicts between groups.

## Key Takeaways

1. **Separate and conquer**: When dealing with position-dependent patterns, separate elements by their position parity or pattern phase before analyzing.

2. **Track top two candidates**: When choosing values for different groups that must differ, always track both the top and second-top frequencies to handle conflicts optimally.

3. **Operations = Total - Matches**: A useful formula: minimum changes = total elements - maximum possible matches. Focus on maximizing matches rather than minimizing changes directly.

Related problems: [Minimum Deletions to Make Array Beautiful](/problem/minimum-deletions-to-make-array-beautiful), [Minimum Number of Flips to Make the Binary String Alternating](/problem/minimum-number-of-flips-to-make-the-binary-string-alternating)
