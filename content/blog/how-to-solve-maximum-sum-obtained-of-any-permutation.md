---
title: "How to Solve Maximum Sum Obtained of Any Permutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum Obtained of Any Permutation. Medium difficulty, 40.4% acceptance rate. Topics: Array, Greedy, Sorting, Prefix Sum."
date: "2029-06-12"
category: "dsa-patterns"
tags: ["maximum-sum-obtained-of-any-permutation", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Sum Obtained of Any Permutation

This problem asks us to maximize the sum of all range queries on an array by rearranging the array elements. Given `nums` and `requests` (where each request asks for the sum of a subarray), we need to permute `nums` to maximize the total sum across all requests. The challenge is that we can't compute every permutation—we need a smarter way to assign the largest numbers to the positions that appear most frequently in requests.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
nums = [1, 2, 3, 4, 5]
requests = [[1, 3], [0, 1]]
```

**Step 1: Understand what we're calculating**

- Request [1,3] asks for sum of nums[1] + nums[2] + nums[3]
- Request [0,1] asks for sum of nums[0] + nums[1]
- Total sum = (nums[1] + nums[2] + nums[3]) + (nums[0] + nums[1])
- = nums[0] + 2*nums[1] + nums[2] + nums[3] + 0*nums[4]

**Step 2: Count frequency of each index**
We can see each index appears:

- Index 0: 1 time
- Index 1: 2 times
- Index 2: 1 time
- Index 3: 1 time
- Index 4: 0 times

**Step 3: Assign largest numbers to most frequent indices**
Sort frequencies: [2, 1, 1, 1, 0]
Sort nums: [5, 4, 3, 2, 1]

Optimal assignment:

- Index 1 (freq 2) gets 5 → contributes 5 × 2 = 10
- Index 0 (freq 1) gets 4 → contributes 4 × 1 = 4
- Index 2 (freq 1) gets 3 → contributes 3 × 1 = 3
- Index 3 (freq 1) gets 2 → contributes 2 × 1 = 2
- Index 4 (freq 0) gets 1 → contributes 1 × 0 = 0

**Step 4: Calculate total**
Total = 10 + 4 + 3 + 2 + 0 = 19

This example shows the core insight: to maximize the sum, we should assign the largest numbers to positions with the highest frequency in requests.

## Brute Force Approach

A naive approach would try all permutations of `nums`, calculate the total sum for each permutation, and return the maximum. Here's what that would look like:

1. Generate all permutations of `nums` (n! possibilities)
2. For each permutation, calculate the sum of all requests
3. Track the maximum sum found

**Why this fails:**

- With n up to 10^5 in the problem constraints, n! is astronomically large
- Even for n=20, 20! ≈ 2.4×10^18 operations
- This approach has O(n! × m) time complexity where m is number of requests
- Clearly infeasible for any reasonable input size

## Optimized Approach

The key insight is that we don't need to try all permutations. We can solve this with a greedy approach:

1. **Count frequencies**: Determine how many times each index appears across all requests
2. **Sort frequencies**: Sort the frequency counts in descending order
3. **Sort numbers**: Sort `nums` in descending order
4. **Assign optimally**: Multiply the largest number by the largest frequency, second largest by second largest frequency, etc.
5. **Sum results**: Calculate the total sum modulo 10^9+7

**Why this works:**

- The total sum is Σ(freq[i] × nums[permutation[i]])
- This is maximized when we pair the largest freq[i] with the largest nums[j] (rearrangement inequality)
- We can think of this as a dot product between the frequency array and the sorted nums

**Efficient frequency counting:**
Instead of iterating through each request and incrementing counts for each index (O(n × m) time), we use a difference array technique:

- For each request [start, end], we mark that frequencies increase at start and decrease after end
- Then do a prefix sum to get the actual frequencies
- This reduces counting to O(n + m) time

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxSumRangeQuery(nums, requests):
    """
    Maximizes the sum of all range queries by optimally permuting nums.

    Approach:
    1. Count how many times each index appears in requests
    2. Sort frequencies and nums in descending order
    3. Assign largest numbers to most frequent indices
    4. Calculate total sum modulo 10^9+7
    """
    MOD = 10**9 + 7
    n = len(nums)

    # Step 1: Create difference array to count frequencies efficiently
    # diff[i] = freq[i] - freq[i-1] for i > 0, diff[0] = freq[0]
    diff = [0] * (n + 1)

    # Mark start and end+1 for each request
    for start, end in requests:
        diff[start] += 1          # Frequency increases at start
        diff[end + 1] -= 1        # Frequency decreases after end

    # Step 2: Convert difference array to actual frequencies using prefix sum
    freq = [0] * n
    current = 0
    for i in range(n):
        current += diff[i]        # Prefix sum gives frequency at index i
        freq[i] = current

    # Step 3: Sort both frequencies and nums in descending order
    freq.sort(reverse=True)
    nums.sort(reverse=True)

    # Step 4: Calculate maximum sum by pairing largest nums with largest frequencies
    total = 0
    for i in range(n):
        # Multiply each number by its corresponding frequency
        total = (total + nums[i] * freq[i]) % MOD

    return total
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Maximizes the sum of all range queries by optimally permuting nums.
 *
 * Approach:
 * 1. Count how many times each index appears in requests
 * 2. Sort frequencies and nums in descending order
 * 3. Assign largest numbers to most frequent indices
 * 4. Calculate total sum modulo 10^9+7
 */
function maxSumRangeQuery(nums, requests) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // Step 1: Create difference array to count frequencies efficiently
  // diff[i] = freq[i] - freq[i-1] for i > 0, diff[0] = freq[0]
  const diff = new Array(n + 1).fill(0);

  // Mark start and end+1 for each request
  for (const [start, end] of requests) {
    diff[start] += 1; // Frequency increases at start
    diff[end + 1] -= 1; // Frequency decreases after end
  }

  // Step 2: Convert difference array to actual frequencies using prefix sum
  const freq = new Array(n);
  let current = 0;
  for (let i = 0; i < n; i++) {
    current += diff[i]; // Prefix sum gives frequency at index i
    freq[i] = current;
  }

  // Step 3: Sort both frequencies and nums in descending order
  freq.sort((a, b) => b - a);
  nums.sort((a, b) => b - a);

  // Step 4: Calculate maximum sum by pairing largest nums with largest frequencies
  let total = 0;
  for (let i = 0; i < n; i++) {
    // Multiply each number by its corresponding frequency
    total = (total + nums[i] * freq[i]) % MOD;
  }

  return total;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    /**
     * Maximizes the sum of all range queries by optimally permuting nums.
     *
     * Approach:
     * 1. Count how many times each index appears in requests
     * 2. Sort frequencies and nums in descending order
     * 3. Assign largest numbers to most frequent indices
     * 4. Calculate total sum modulo 10^9+7
     */
    public int maxSumRangeQuery(int[] nums, int[][] requests) {
        final int MOD = 1_000_000_007;
        int n = nums.length;

        // Step 1: Create difference array to count frequencies efficiently
        // diff[i] = freq[i] - freq[i-1] for i > 0, diff[0] = freq[0]
        int[] diff = new int[n + 1];

        // Mark start and end+1 for each request
        for (int[] request : requests) {
            int start = request[0];
            int end = request[1];
            diff[start] += 1;          // Frequency increases at start
            diff[end + 1] -= 1;        // Frequency decreases after end
        }

        // Step 2: Convert difference array to actual frequencies using prefix sum
        int[] freq = new int[n];
        int current = 0;
        for (int i = 0; i < n; i++) {
            current += diff[i];        // Prefix sum gives frequency at index i
            freq[i] = current;
        }

        // Step 3: Sort both frequencies and nums in descending order
        // Convert to Integer arrays to sort in descending order
        Integer[] freqObj = Arrays.stream(freq).boxed().toArray(Integer[]::new);
        Integer[] numsObj = Arrays.stream(nums).boxed().toArray(Integer[]::new);

        Arrays.sort(freqObj, (a, b) -> b - a);
        Arrays.sort(numsObj, (a, b) -> b - a);

        // Step 4: Calculate maximum sum by pairing largest nums with largest frequencies
        long total = 0;  // Use long to avoid overflow before modulo
        for (int i = 0; i < n; i++) {
            // Multiply each number by its corresponding frequency
            total = (total + (long) numsObj[i] * freqObj[i]) % MOD;
        }

        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies with difference array: O(n + m) where m is number of requests
- Sorting frequencies: O(n log n)
- Sorting nums: O(n log n)
- Final summation: O(n)
- Dominated by the two sorts: O(n log n)

**Space Complexity: O(n)**

- Difference array: O(n)
- Frequency array: O(n)
- Sorting may use O(log n) to O(n) additional space depending on implementation
- Total: O(n)

## Common Mistakes

1. **Forgetting the modulo operation**: The problem requires returning the result modulo 10^9+7. Candidates often calculate the sum correctly but forget to apply the modulo, especially in languages where integer overflow isn't automatic.

2. **Off-by-one errors in difference array**: When marking `diff[end + 1] -= 1`, it's easy to write `diff[end] -= 1` instead. Remember: if a request covers indices [start, end], the frequency should decrease at index `end + 1`, not `end`.

3. **Inefficient frequency counting**: Some candidates iterate through each request and increment counts for each index in the range, resulting in O(n × m) time. With n up to 10^5 and m up to 10^5, this could be 10^10 operations—far too slow.

4. **Not using long for intermediate calculations**: In Java, multiplying two large integers can overflow even if the final result fits in an int after modulo. Always use long for intermediate calculations when dealing with large numbers and modulo operations.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Difference Array / Prefix Sum for Range Updates**: Used to efficiently apply range increments. Similar problems:
   - LeetCode 1109: Corporate Flight Bookings - Exactly the same difference array technique
   - LeetCode 370: Range Addition - Direct application of difference arrays
   - LeetCode 1094: Car Pooling - Uses difference array to track passenger counts

2. **Greedy Pairing by Sorting**: The idea of pairing largest with largest to maximize a sum appears in:
   - LeetCode 1877: Minimize Maximum Pair Sum in Array - Sort and pair smallest with largest
   - LeetCode 561: Array Partition I - Sort and take every other element
   - LeetCode 1710: Maximum Units on a Truck - Sort boxes by units and take largest first

## Key Takeaways

1. **When you need to count how many times each index appears in multiple ranges, use a difference array**. This reduces O(n × m) operations to O(n + m), which is crucial for large inputs.

2. **To maximize Σ(a[i] × b[permutation[i]]), sort both arrays and pair largest with largest**. This is a direct application of the rearrangement inequality.

3. **Always consider modulo requirements early**. When a problem asks for results modulo some value, apply the modulo during intermediate calculations to prevent overflow.

[Practice this problem on CodeJeet](/problem/maximum-sum-obtained-of-any-permutation)
