---
title: "How to Solve Arithmetic Slices II - Subsequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Arithmetic Slices II - Subsequence. Hard difficulty, 54.9% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-06-09"
category: "dsa-patterns"
tags: ["arithmetic-slices-ii-subsequence", "array", "dynamic-programming", "hard"]
---

# How to Solve Arithmetic Slices II - Subsequence

This problem asks us to count all arithmetic subsequences of length at least 3 in an array. A subsequence is arithmetic if the difference between consecutive elements is constant. What makes this problem tricky is that subsequences don't need to be contiguous (unlike subarrays), and we need to count ALL possible arithmetic subsequences, not just contiguous ones. The "II" in the title distinguishes it from the easier "Arithmetic Slices" problem which only counts contiguous arithmetic subarrays.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 4, 6, 8]`

We need to find all subsequences of length ≥ 3 where the difference between consecutive elements is constant.

**Step-by-step thinking:**

1. Start with index 0 (value 2)
   - Look ahead to index 1 (value 4): difference = 2
   - Look ahead to index 2 (value 6): difference from 4 to 6 is also 2 → we have [2, 4, 6]
   - Look ahead to index 3 (value 8): difference from 6 to 8 is also 2 → we have [2, 4, 6, 8]
   - Also, from [2, 4, 6], we can skip index 2 and go to index 3: [2, 4, 8] (difference 2 from 2 to 4, then 4 from 4 to 8? Wait, that's not constant!)

2. The key insight: We need to track ALL possible differences at each position, because a subsequence ending at index `j` with difference `d` could extend subsequences ending at earlier indices with the same difference.

Let's track this systematically:

- At index 0 (2): No subsequences ending here yet
- At index 1 (4):
  - Difference from index 0: 4-2 = 2
  - We now have a potential 2-element sequence ending at index 1 with diff=2
- At index 2 (6):
  - From index 0: 6-2 = 4 → potential 2-element sequence ending at index 2 with diff=4
  - From index 1: 6-4 = 2 → we had a 2-element sequence ending at index 1 with diff=2, so this extends it to a 3-element sequence! Count = 1
- At index 3 (8):
  - From index 0: 8-2 = 6 → potential 2-element sequence
  - From index 1: 8-4 = 4 → extends the 2-element sequence ending at index 1 with diff=4? No, we don't have that
  - From index 2: 8-6 = 2 → extends the 2-element sequence ending at index 2 with diff=2? No, we don't have that
  - Wait, but we DO have a 3-element sequence [2,4,6] ending at index 2 with diff=2, so 8-6=2 extends it to [2,4,6,8]!

The challenge is we need to track not just whether we have sequences, but how many sequences end at each position with each possible difference.

## Brute Force Approach

The brute force approach would be to generate all possible subsequences (2^n possibilities) and check if each one is arithmetic. For each subsequence of length ≥ 3, we would check if all consecutive differences are equal.

**Why this fails:**

- For an array of length n, there are 2^n possible subsequences
- Checking each subsequence takes O(m) time where m is the subsequence length
- Total time complexity: O(n \* 2^n), which is exponential and completely impractical for n > 20
- Even with pruning (stopping early when differences don't match), the worst case is still exponential

The brute force teaches us that we need a smarter way to count without explicitly enumerating all subsequences.

## Optimized Approach

The key insight is dynamic programming with hash maps. For each index `i`, we want to know: for each possible difference `d`, how many arithmetic subsequences end at position `i` with difference `d`?

**Step-by-step reasoning:**

1. **State definition**: Let `dp[i]` be a dictionary/hash map where `dp[i][d]` = number of arithmetic subsequences ending at index `i` with common difference `d`.

2. **Transition**: For each pair `(j, i)` where `j < i`:
   - Calculate `diff = nums[i] - nums[j]`
   - Any arithmetic subsequence ending at `j` with difference `diff` can be extended to end at `i`
   - So: `dp[i][diff] += dp[j][diff]` (extend existing sequences)
   - Also: We create a new potential 2-element sequence: `dp[i][diff] += 1`

3. **Counting valid sequences**: When we extend a sequence from `j` to `i`, if `dp[j][diff]` already had some sequences, those sequences become length ≥ 3 when extended to `i`. So we add `dp[j][diff]` to our total answer.

4. **Why this works**: We're essentially saying: "For each ending position `i` and each possible difference `d`, count how many ways we can get here." This avoids enumerating all subsequences explicitly.

5. **Edge cases**:
   - Differences can be large (up to 2^31 - 1), so we need hash maps, not arrays
   - We might get integer overflow when counting (use long integers)
   - Empty array or array with < 3 elements should return 0

## Optimal Solution

Here's the complete solution using dynamic programming with hash maps:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2) in worst case
class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        n = len(nums)
        if n < 3:
            return 0

        # dp[i] is a dictionary where:
        # key = difference, value = count of sequences ending at i with that difference
        dp = [defaultdict(int) for _ in range(n)]
        total_count = 0

        # Iterate through all pairs (j, i) where j < i
        for i in range(n):
            for j in range(i):
                # Calculate the difference between nums[i] and nums[j]
                diff = nums[i] - nums[j]

                # Get the count of sequences ending at j with this difference
                # These sequences become length >= 3 when extended to i
                sequences_from_j = dp[j].get(diff, 0)

                # Add to total count (these are valid arithmetic sequences)
                total_count += sequences_from_j

                # Update dp[i]:
                # 1. Extend sequences from j to i (add sequences_from_j)
                # 2. Create a new 2-element sequence [nums[j], nums[i]] (add 1)
                dp[i][diff] += sequences_from_j + 1

        return total_count
```

```javascript
// Time: O(n^2) | Space: O(n^2) in worst case
var numberOfArithmeticSlices = function (nums) {
  const n = nums.length;
  if (n < 3) return 0;

  // dp[i] is a Map where:
  // key = difference, value = count of sequences ending at i with that difference
  const dp = new Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = new Map();
  }

  let totalCount = 0;

  // Iterate through all pairs (j, i) where j < i
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Calculate the difference between nums[i] and nums[j]
      // Use BigInt to avoid integer overflow for large differences
      const diff = BigInt(nums[i]) - BigInt(nums[j]);

      // Get the count of sequences ending at j with this difference
      // These sequences become length >= 3 when extended to i
      const sequencesFromJ = dp[j].get(diff) || 0;

      // Add to total count (these are valid arithmetic sequences)
      totalCount += sequencesFromJ;

      // Update dp[i]:
      // 1. Extend sequences from j to i (add sequencesFromJ)
      // 2. Create a new 2-element sequence [nums[j], nums[i]] (add 1)
      const currentCount = dp[i].get(diff) || 0;
      dp[i].set(diff, currentCount + sequencesFromJ + 1);
    }
  }

  return totalCount;
};
```

```java
// Time: O(n^2) | Space: O(n^2) in worst case
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        int n = nums.length;
        if (n < 3) return 0;

        // dp[i] is a Map where:
        // key = difference (as Long to handle large values),
        // value = count of sequences ending at i with that difference
        Map<Long, Integer>[] dp = new Map[n];
        for (int i = 0; i < n; i++) {
            dp[i] = new HashMap<>();
        }

        int totalCount = 0;

        // Iterate through all pairs (j, i) where j < i
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                // Calculate the difference between nums[i] and nums[j]
                // Use long to avoid integer overflow
                long diff = (long)nums[i] - (long)nums[j];

                // Get the count of sequences ending at j with this difference
                // These sequences become length >= 3 when extended to i
                int sequencesFromJ = dp[j].getOrDefault(diff, 0);

                // Add to total count (these are valid arithmetic sequences)
                totalCount += sequencesFromJ;

                // Update dp[i]:
                // 1. Extend sequences from j to i (add sequencesFromJ)
                // 2. Create a new 2-element sequence [nums[j], nums[i]] (add 1)
                int currentCount = dp[i].getOrDefault(diff, 0);
                dp[i].put(diff, currentCount + sequencesFromJ + 1);
            }
        }

        return totalCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have two nested loops: `i` from 0 to n-1, and `j` from 0 to i-1
- This gives us Σ(i=0 to n-1) i = n(n-1)/2 = O(n²) iterations
- Each iteration does O(1) hash map operations (get and put)

**Space Complexity: O(n²) in worst case**

- We store a hash map for each of the n positions
- In the worst case (when all differences are unique), each hash map could have O(n) entries
- Total space: O(n²)
- In practice, it's often less because many pairs share the same differences

## Common Mistakes

1. **Confusing subsequences with subarrays**: The problem asks for subsequences (non-contiguous), not subarrays (contiguous). Candidates sometimes solve the easier "Arithmetic Slices" problem instead.

2. **Integer overflow**: When nums contains large integers (up to 2^31 - 1), their differences can exceed 32-bit integer range. Always use 64-bit integers (long in Java/C++, BigInt in JavaScript, Python handles this automatically).

3. **Forgetting to count sequences of length > 3**: The solution counts sequences when they first become length 3, but longer sequences are counted as extensions of shorter ones. Each time we extend a sequence, we add to the total count.

4. **Incorrect initialization**: Some candidates initialize with dp[i][diff] = 1 for every pair (j, i), forgetting that we need to add the count from dp[j][diff] as well. The correct update is `dp[i][diff] += dp[j][diff] + 1`.

5. **Using array instead of hash map for differences**: The difference values can be very large (both positive and negative), so an array indexed by difference won't work. We need a hash map.

## When You'll See This Pattern

This dynamic programming with hash maps pattern appears in several counting problems:

1. **Longest Arithmetic Subsequence** (LeetCode 1027): Very similar problem but asks for the length of the longest arithmetic subsequence instead of counting all of them.

2. **Number of Longest Increasing Subsequence** (LeetCode 673): Uses DP to count sequences rather than just find the longest one.

3. **Count Different Palindromic Subsequences** (LeetCode 730): Another hard counting problem that uses DP with careful state management.

4. **Destroy Sequential Targets** (mentioned in similar problems): Uses difference tracking in a different context.

The core pattern is: when you need to count sequences/subsequences satisfying some property, and the property depends on the relationship between elements (like a common difference), consider DP where state includes both position and the relevant relationship value.

## Key Takeaways

1. **DP with hash maps for sequence counting**: When counting sequences where the constraint involves relationships between elements (like common difference), use DP where `dp[i][relation]` counts sequences ending at `i` with that relation.

2. **Incremental counting**: Count valid sequences as soon as they become valid (length ≥ 3), not at the end. Each extension of a valid sequence creates another valid sequence.

3. **Mind the data types**: For problems involving differences of large integers, always use 64-bit integers or equivalent to avoid overflow.

4. **Subsequence vs subarray**: Always check whether the problem asks for contiguous (subarray) or non-contiguous (subsequence) sequences. The solutions are very different.

Related problems: [Arithmetic Slices](/problem/arithmetic-slices), [Destroy Sequential Targets](/problem/destroy-sequential-targets), [Count Palindromic Subsequences](/problem/count-palindromic-subsequences)
