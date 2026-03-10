---
title: "How to Solve Maximum Profit in Job Scheduling — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Profit in Job Scheduling. Hard difficulty, 54.6% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting."
date: "2027-07-20"
category: "dsa-patterns"
tags: ["maximum-profit-in-job-scheduling", "array", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Maximum Profit in Job Scheduling

This problem asks us to find the maximum profit we can earn by selecting non-overlapping jobs from a list. Each job has a start time, end time, and profit value. The challenge is that jobs can be in any order, and we need to efficiently determine which combination yields the highest total profit without time conflicts. What makes this problem interesting is that it combines sorting, binary search, and dynamic programming—three fundamental techniques that appear frequently in optimization problems.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
startTime = [1, 2, 3, 4, 6]
endTime   = [3, 5, 10, 6, 9]
profit    = [20, 20, 100, 70, 60]
```

**Step 1: Sort jobs by end time**
We'll combine each job's data into tuples and sort by end time:

```
Job 0: (1, 3, 20)   → ends at 3
Job 1: (2, 5, 20)   → ends at 5
Job 3: (4, 6, 70)   → ends at 6
Job 4: (6, 9, 60)   → ends at 9
Job 2: (3, 10, 100) → ends at 10
```

**Step 2: Dynamic programming approach**
We'll create a DP array where `dp[i]` represents the maximum profit we can achieve considering jobs up to index `i` (0-based).

- **Job 0 (ends at 3):** Only this job. Profit = 20. `dp[0] = 20`
- **Job 1 (ends at 5):** Two options:
  1. Skip this job: Use profit from previous job = 20
  2. Take this job: Find the last job that ends before this one starts (start=2). No such job exists, so profit = 20
     Maximum = max(20, 20) = 20. `dp[1] = 20`
- **Job 3 (ends at 6):** Two options:
  1. Skip: Use `dp[1]` = 20
  2. Take: Find job ending before start=4. Job 1 ends at 5 (too late). Job 0 ends at 3 ✓. Profit = 70 + `dp[0]` = 70 + 20 = 90
     Maximum = max(20, 90) = 90. `dp[3] = 90`
- **Job 4 (ends at 9):** Two options:
  1. Skip: Use `dp[3]` = 90
  2. Take: Find job ending before start=6. Job 3 ends at 6 (not strictly before). Job 1 ends at 5 ✓. Profit = 60 + `dp[1]` = 60 + 20 = 80
     Maximum = max(90, 80) = 90. `dp[4] = 90`
- **Job 2 (ends at 10):** Two options:
  1. Skip: Use `dp[4]` = 90
  2. Take: Find job ending before start=3. Job 0 ends at 3 (not strictly before). No job found. Profit = 100
     Maximum = max(90, 100) = 100. `dp[2] = 100`

**Result:** Maximum profit = 100 (from job 2 alone).

The key insight is that at each job, we decide whether to include it or not. If we include it, we need to find the most recent non-conflicting job to add to its profit.

## Brute Force Approach

A naive solution would be to consider all possible subsets of jobs (2^n possibilities), check if each subset has no overlapping jobs, calculate the total profit, and keep track of the maximum. This approach is straightforward but extremely inefficient.

**Why it's too slow:**

- With n jobs, there are 2^n possible subsets
- Checking overlaps for each subset takes O(n²) in worst case
- Total complexity: O(2^n × n²), which is infeasible for n > 20

Even with optimization (like pruning invalid subsets early), the exponential nature makes this approach impractical for typical constraints where n can be up to 50,000.

## Optimized Approach

The optimal solution uses three key techniques:

1. **Sorting by end time:** This allows us to process jobs in chronological order and makes it easier to find non-conflicting jobs.

2. **Dynamic Programming:** We define `dp[i]` as the maximum profit achievable using jobs from index 0 to i. For each job i, we have two choices:
   - Skip job i: `dp[i] = dp[i-1]`
   - Take job i: `dp[i] = profit[i] + dp[j]` where j is the last job that ends before job i starts

3. **Binary Search:** Instead of linearly scanning backwards to find job j (which would be O(n) per job), we use binary search on the sorted end times to find j in O(log n) time.

The recurrence relation is:

```
dp[i] = max(dp[i-1], profit[i] + dp[j])
```

where j is the largest index with endTime[j] ≤ startTime[i]

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def jobScheduling(startTime, endTime, profit):
    """
    Returns the maximum profit from non-overlapping jobs.

    Approach:
    1. Combine job data and sort by end time
    2. Use DP with binary search to find non-conflicting jobs efficiently
    3. At each job, decide: skip it or take it with the best compatible previous job
    """
    n = len(startTime)

    # Step 1: Combine job data into tuples and sort by end time
    # This ensures we process jobs in chronological order of completion
    jobs = sorted(zip(startTime, endTime, profit), key=lambda x: x[1])

    # Extract sorted arrays for easier access
    sorted_start = [job[0] for job in jobs]
    sorted_end = [job[1] for job in jobs]
    sorted_profit = [job[2] for job in jobs]

    # Step 2: Initialize DP array
    # dp[i] = maximum profit considering jobs 0 through i
    dp = [0] * n
    dp[0] = sorted_profit[0]  # Base case: first job's profit

    # Step 3: Process each job
    for i in range(1, n):
        # Option 1: Skip current job, take profit from previous job
        skip_profit = dp[i-1]

        # Option 2: Take current job
        # Find the last job that ends before or at current job's start time
        # We use binary search for O(log n) lookup instead of linear scan
        take_profit = sorted_profit[i]

        # Binary search to find the rightmost job that ends <= current job's start
        # If no such job exists, j will be -1
        j = binary_search(sorted_end, sorted_start[i], i - 1)

        # If we found a compatible job, add its DP value
        if j != -1:
            take_profit += dp[j]

        # Take the better of the two options
        dp[i] = max(skip_profit, take_profit)

    # The last element contains the maximum profit for all jobs
    return dp[-1]

def binary_search(end_times, target, right):
    """
    Binary search to find the rightmost index where end_time <= target.
    Returns -1 if no such index exists.

    Args:
        end_times: List of end times (sorted)
        target: The start time we're comparing against
        right: The right boundary for search (0 to right inclusive)
    """
    left = 0
    result = -1  # Default if no compatible job found

    while left <= right:
        mid = left + (right - left) // 2

        if end_times[mid] <= target:
            # Found a compatible job, but keep searching right
            # to find the rightmost one
            result = mid
            left = mid + 1
        else:
            # Current job ends after target, search left
            right = mid - 1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function jobScheduling(startTime, endTime, profit) {
  /**
   * Returns the maximum profit from non-overlapping jobs.
   *
   * Approach:
   * 1. Combine job data and sort by end time
   * 2. Use DP with binary search to find non-conflicting jobs efficiently
   * 3. At each job, decide: skip it or take it with the best compatible previous job
   */
  const n = startTime.length;

  // Step 1: Combine job data into array of objects and sort by end time
  // This ensures we process jobs in chronological order of completion
  const jobs = [];
  for (let i = 0; i < n; i++) {
    jobs.push({
      start: startTime[i],
      end: endTime[i],
      profit: profit[i],
    });
  }

  // Sort jobs by end time
  jobs.sort((a, b) => a.end - b.end);

  // Extract sorted arrays for easier access
  const sortedStart = jobs.map((job) => job.start);
  const sortedEnd = jobs.map((job) => job.end);
  const sortedProfit = jobs.map((job) => job.profit);

  // Step 2: Initialize DP array
  // dp[i] = maximum profit considering jobs 0 through i
  const dp = new Array(n).fill(0);
  dp[0] = sortedProfit[0]; // Base case: first job's profit

  // Step 3: Process each job
  for (let i = 1; i < n; i++) {
    // Option 1: Skip current job, take profit from previous job
    const skipProfit = dp[i - 1];

    // Option 2: Take current job
    // Find the last job that ends before or at current job's start time
    let takeProfit = sortedProfit[i];

    // Binary search to find the rightmost job that ends <= current job's start
    // If no such job exists, j will be -1
    const j = binarySearch(sortedEnd, sortedStart[i], i - 1);

    // If we found a compatible job, add its DP value
    if (j !== -1) {
      takeProfit += dp[j];
    }

    // Take the better of the two options
    dp[i] = Math.max(skipProfit, takeProfit);
  }

  // The last element contains the maximum profit for all jobs
  return dp[n - 1];
}

function binarySearch(endTimes, target, right) {
  /**
   * Binary search to find the rightmost index where end_time <= target.
   * Returns -1 if no such index exists.
   *
   * @param {number[]} endTimes - Array of end times (sorted)
   * @param {number} target - The start time we're comparing against
   * @param {number} right - The right boundary for search (0 to right inclusive)
   * @returns {number} Index of compatible job or -1
   */
  let left = 0;
  let result = -1; // Default if no compatible job found

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (endTimes[mid] <= target) {
      // Found a compatible job, but keep searching right
      // to find the rightmost one
      result = mid;
      left = mid + 1;
    } else {
      // Current job ends after target, search left
      right = mid - 1;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
        /**
         * Returns the maximum profit from non-overlapping jobs.
         *
         * Approach:
         * 1. Combine job data and sort by end time
         * 2. Use DP with binary search to find non-conflicting jobs efficiently
         * 3. At each job, decide: skip it or take it with the best compatible previous job
         */
        int n = startTime.length;

        // Step 1: Combine job data into Job objects and sort by end time
        // This ensures we process jobs in chronological order of completion
        Job[] jobs = new Job[n];
        for (int i = 0; i < n; i++) {
            jobs[i] = new Job(startTime[i], endTime[i], profit[i]);
        }

        // Sort jobs by end time
        Arrays.sort(jobs, (a, b) -> a.end - b.end);

        // Extract sorted arrays for easier access
        int[] sortedStart = new int[n];
        int[] sortedEnd = new int[n];
        int[] sortedProfit = new int[n];

        for (int i = 0; i < n; i++) {
            sortedStart[i] = jobs[i].start;
            sortedEnd[i] = jobs[i].end;
            sortedProfit[i] = jobs[i].profit;
        }

        // Step 2: Initialize DP array
        // dp[i] = maximum profit considering jobs 0 through i
        int[] dp = new int[n];
        dp[0] = sortedProfit[0];  // Base case: first job's profit

        // Step 3: Process each job
        for (int i = 1; i < n; i++) {
            // Option 1: Skip current job, take profit from previous job
            int skipProfit = dp[i - 1];

            // Option 2: Take current job
            // Find the last job that ends before or at current job's start time
            int takeProfit = sortedProfit[i];

            // Binary search to find the rightmost job that ends <= current job's start
            // If no such job exists, j will be -1
            int j = binarySearch(sortedEnd, sortedStart[i], i - 1);

            // If we found a compatible job, add its DP value
            if (j != -1) {
                takeProfit += dp[j];
            }

            // Take the better of the two options
            dp[i] = Math.max(skipProfit, takeProfit);
        }

        // The last element contains the maximum profit for all jobs
        return dp[n - 1];
    }

    private int binarySearch(int[] endTimes, int target, int right) {
        /**
         * Binary search to find the rightmost index where end_time <= target.
         * Returns -1 if no such index exists.
         *
         * @param endTimes Array of end times (sorted)
         * @param target The start time we're comparing against
         * @param right The right boundary for search (0 to right inclusive)
         * @return Index of compatible job or -1
         */
        int left = 0;
        int result = -1;  // Default if no compatible job found

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (endTimes[mid] <= target) {
                // Found a compatible job, but keep searching right
                // to find the rightmost one
                result = mid;
                left = mid + 1;
            } else {
                // Current job ends after target, search left
                right = mid - 1;
            }
        }

        return result;
    }

    // Helper class to store job information
    class Job {
        int start;
        int end;
        int profit;

        Job(int start, int end, int profit) {
            this.start = start;
            this.end = end;
            this.profit = profit;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the jobs by end time: O(n log n)
- Processing each job: O(n)
- Binary search for each job: O(log n) per job
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- Storing the sorted jobs: O(n)
- DP array: O(n)
- Total: O(n)

The binary search optimization is crucial—without it, we'd need to linearly scan backwards for each job, resulting in O(n²) time complexity.

## Common Mistakes

1. **Not sorting by end time:** Some candidates try to sort by start time or profit, but sorting by end time is essential for the DP recurrence to work correctly. When we process jobs in order of completion, we guarantee that all potential previous jobs are already processed.

2. **Incorrect binary search condition:** The search should find the _rightmost_ job with `end ≤ start`, not just any job. Using a standard binary search that finds any match might skip better combinations. Always search for the rightmost valid index.

3. **Forgetting to handle the "skip job" case:** The DP recurrence has two parts: taking the current job OR skipping it. Candidates sometimes only consider taking jobs, which misses cases where skipping a low-profit job leads to taking two higher-profit jobs later.

4. **Off-by-one errors in DP initialization:** When `i=0`, there's no `dp[i-1]`. Handle this base case separately. Also, ensure binary search bounds are correct (0 to i-1, not 0 to n-1).

## When You'll See This Pattern

This problem combines several important patterns that appear in scheduling and optimization problems:

1. **Weighted Interval Scheduling:** The core pattern is classic weighted interval scheduling. Any problem where you need to select non-overlapping intervals with weights/profits uses this approach.

2. **DP with Binary Search:** When your DP transition requires finding the "most recent" or "best previous" state based on some condition, binary search can optimize from O(n) to O(log n).

3. **Sorting + DP for Scheduling:** Many scheduling problems (meeting rooms, course scheduling, event selection) use sorting followed by DP or greedy algorithms.

**Related LeetCode problems:**

- **Maximum Earnings From Taxi (Medium):** Almost identical structure—pickup and dropoff times with earnings, find maximum earnings.
- **Two Best Non-Overlapping Events (Medium):** Simpler version where you only need to pick at most two events.
- **Maximum Length of Pair Chain (Medium):** Unweighted version where each pair has weight 1.

## Key Takeaways

1. **Sorting enables DP:** When dealing with intervals and optimization, sorting by end time often reveals the optimal substructure needed for dynamic programming.

2. **Binary search optimizes DP transitions:** If your DP recurrence requires finding the last compatible state, binary search can dramatically improve performance from O(n²) to O(n log n).

3. **The "take or skip" framework:** Many selection problems can be framed as: at each element, decide whether to include it (if compatible with previous selections) or skip it. This leads to a natural DP solution.

Remember: When you see a problem about selecting non-overlapping intervals with weights, think: sort by end time, DP with binary search.

Related problems: [Maximum Earnings From Taxi](/problem/maximum-earnings-from-taxi), [Two Best Non-Overlapping Events](/problem/two-best-non-overlapping-events)
