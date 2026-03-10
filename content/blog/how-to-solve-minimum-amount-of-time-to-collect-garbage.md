---
title: "How to Solve Minimum Amount of Time to Collect Garbage — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Amount of Time to Collect Garbage. Medium difficulty, 85.1% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2026-08-28"
category: "dsa-patterns"
tags: ["minimum-amount-of-time-to-collect-garbage", "array", "string", "prefix-sum", "medium"]
---

# How to Solve Minimum Amount of Time to Collect Garbage

This problem asks us to calculate the minimum time required for three garbage trucks (metal, paper, glass) to collect all garbage from houses, where each truck must travel to the farthest house containing its type of garbage. The tricky part is that travel time between houses is given in a separate array, and each truck only needs to travel as far as the last house that has its specific type of garbage.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
garbage = ["G","P","GP","GG"]
travel = [2,4,3]
```

We have 4 houses with garbage and travel times between them:

- House 0 → House 1: 2 minutes
- House 1 → House 2: 4 minutes
- House 2 → House 3: 3 minutes

**Step-by-step collection:**

1. **Glass truck (G):**
   - House 0: 1 unit of glass → 1 minute to collect
   - House 2: 1 unit of glass → 1 minute to collect
   - House 3: 2 units of glass → 2 minutes to collect
   - Total collection time: 1 + 1 + 2 = 4 minutes
   - Travel: Needs to reach house 3 (last house with glass)
     - House 0→1: 2 minutes
     - House 1→2: 4 minutes
     - House 2→3: 3 minutes
   - Total travel time: 2 + 4 + 3 = 9 minutes
   - **Total for glass: 4 + 9 = 13 minutes**

2. **Paper truck (P):**
   - House 1: 1 unit of paper → 1 minute to collect
   - House 2: 1 unit of paper → 1 minute to collect
   - Total collection time: 1 + 1 = 2 minutes
   - Travel: Needs to reach house 2 (last house with paper)
     - House 0→1: 2 minutes
     - House 1→2: 4 minutes
   - Total travel time: 2 + 4 = 6 minutes
   - **Total for paper: 2 + 6 = 8 minutes**

3. **Metal truck (M):**
   - No metal garbage anywhere → 0 minutes
   - Travel: Doesn't need to travel at all (no metal to collect)
   - **Total for metal: 0 minutes**

**Final answer:** 13 + 8 + 0 = **21 minutes**

The key insight: Each truck's travel time depends only on how far it needs to go to reach the last house containing its type of garbage.

## Brute Force Approach

A naive approach would be to simulate each truck's journey separately:

1. For each truck type, find all houses containing that type
2. For each such house, add collection time (1 minute per unit)
3. For each travel segment to reach that house, add travel time
4. Repeat for all three trucks

This approach is inefficient because:

- We're repeatedly scanning the garbage array for each truck type
- We're recalculating travel times multiple times
- For each truck, we're summing travel times from scratch for each house it visits

The time complexity would be O(n × m) where n is number of houses and m is average garbage units per house, which could be O(n²) in worst case.

## Optimized Approach

The optimal solution uses **prefix sums** for travel times and processes everything in a single pass:

**Key insights:**

1. **Collection time** is simply the total count of each garbage type across all houses
2. **Travel time** for each truck is the sum of travel times from house 0 to the farthest house containing that type
3. We can compute prefix sums of travel times to quickly get travel time to any house
4. We only need to track the last occurrence index for each garbage type

**Step-by-step reasoning:**

1. Initialize total time = 0
2. Count all garbage units (each takes 1 minute to collect)
3. Track the last house index for M, P, and G
4. Compute prefix sums of travel times: `prefix[i]` = travel time from house 0 to house i
5. For each truck type, if it has any garbage to collect, add travel time to its last house
6. Sum everything for final answer

This approach processes each garbage unit once and uses O(1) extra space beyond the input.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is total characters in garbage array
# Space: O(1) extra space (excluding input storage)
def garbageCollection(garbage, travel):
    """
    Calculate minimum time to collect all garbage.

    Args:
        garbage: List of strings, each representing garbage at a house
        travel: List of integers, travel times between houses

    Returns:
        Total time in minutes
    """
    total_time = 0
    last_m = last_p = last_g = -1  # Track last house index for each type

    # Step 1: Count collection time and track last occurrences
    for i in range(len(garbage)):
        house_garbage = garbage[i]
        total_time += len(house_garbage)  # Each unit takes 1 minute to collect

        # Update last occurrence indices for each garbage type
        if 'M' in house_garbage:
            last_m = i
        if 'P' in house_garbage:
            last_p = i
        if 'G' in house_garbage:
            last_g = i

    # Step 2: Compute prefix sums for travel times
    # prefix[i] = total travel time from house 0 to house i
    prefix_sum = [0] * len(travel)
    if travel:  # Handle case with no travel (single house)
        prefix_sum[0] = travel[0]
        for i in range(1, len(travel)):
            prefix_sum[i] = prefix_sum[i-1] + travel[i]

    # Step 3: Add travel time for each truck to its last house
    # Metal truck travel
    if last_m > 0:  # Only need travel if last house is beyond house 0
        total_time += prefix_sum[last_m - 1]

    # Paper truck travel
    if last_p > 0:
        total_time += prefix_sum[last_p - 1]

    # Glass truck travel
    if last_g > 0:
        total_time += prefix_sum[last_g - 1]

    return total_time
```

```javascript
// Time: O(n) where n is total characters in garbage array
// Space: O(1) extra space (excluding input storage)
function garbageCollection(garbage, travel) {
  /**
   * Calculate minimum time to collect all garbage.
   *
   * @param {string[]} garbage - Array of strings representing garbage at each house
   * @param {number[]} travel - Array of travel times between houses
   * @return {number} Total time in minutes
   */
  let totalTime = 0;
  let lastM = -1,
    lastP = -1,
    lastG = -1; // Track last house index for each type

  // Step 1: Count collection time and track last occurrences
  for (let i = 0; i < garbage.length; i++) {
    const houseGarbage = garbage[i];
    totalTime += houseGarbage.length; // Each unit takes 1 minute to collect

    // Update last occurrence indices for each garbage type
    if (houseGarbage.includes("M")) {
      lastM = i;
    }
    if (houseGarbage.includes("P")) {
      lastP = i;
    }
    if (houseGarbage.includes("G")) {
      lastG = i;
    }
  }

  // Step 2: Compute prefix sums for travel times
  // prefix[i] = total travel time from house 0 to house i
  const prefixSum = new Array(travel.length);
  if (travel.length > 0) {
    // Handle case with no travel (single house)
    prefixSum[0] = travel[0];
    for (let i = 1; i < travel.length; i++) {
      prefixSum[i] = prefixSum[i - 1] + travel[i];
    }
  }

  // Step 3: Add travel time for each truck to its last house
  // Metal truck travel
  if (lastM > 0) {
    // Only need travel if last house is beyond house 0
    totalTime += prefixSum[lastM - 1];
  }

  // Paper truck travel
  if (lastP > 0) {
    totalTime += prefixSum[lastP - 1];
  }

  // Glass truck travel
  if (lastG > 0) {
    totalTime += prefixSum[lastG - 1];
  }

  return totalTime;
}
```

```java
// Time: O(n) where n is total characters in garbage array
// Space: O(1) extra space (excluding input storage)
class Solution {
    public int garbageCollection(String[] garbage, int[] travel) {
        /**
         * Calculate minimum time to collect all garbage.
         *
         * @param garbage Array of strings representing garbage at each house
         * @param travel Array of travel times between houses
         * @return Total time in minutes
         */
        int totalTime = 0;
        int lastM = -1, lastP = -1, lastG = -1;  // Track last house index for each type

        // Step 1: Count collection time and track last occurrences
        for (int i = 0; i < garbage.length; i++) {
            String houseGarbage = garbage[i];
            totalTime += houseGarbage.length();  // Each unit takes 1 minute to collect

            // Update last occurrence indices for each garbage type
            if (houseGarbage.contains("M")) {
                lastM = i;
            }
            if (houseGarbage.contains("P")) {
                lastP = i;
            }
            if (houseGarbage.contains("G")) {
                lastG = i;
            }
        }

        // Step 2: Compute prefix sums for travel times
        // prefix[i] = total travel time from house 0 to house i
        int[] prefixSum = new int[travel.length];
        if (travel.length > 0) {  // Handle case with no travel (single house)
            prefixSum[0] = travel[0];
            for (int i = 1; i < travel.length; i++) {
                prefixSum[i] = prefixSum[i-1] + travel[i];
            }
        }

        // Step 3: Add travel time for each truck to its last house
        // Metal truck travel
        if (lastM > 0) {  // Only need travel if last house is beyond house 0
            totalTime += prefixSum[lastM - 1];
        }

        // Paper truck travel
        if (lastP > 0) {
            totalTime += prefixSum[lastP - 1];
        }

        // Glass truck travel
        if (lastG > 0) {
            totalTime += prefixSum[lastG - 1];
        }

        return totalTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the garbage array to count units and track last occurrences: O(n) where n is total characters
- We compute prefix sums in O(m) where m is length of travel array (m = n-1 for n houses)
- Overall O(n + m) = O(n) since m ≤ n

**Space Complexity: O(1) extra space**

- We use a constant amount of extra space for variables and indices
- The prefix sum array is O(m) but this is part of the algorithm's working space
- If we consider input storage, it's O(n) for garbage array and O(m) for travel array

## Common Mistakes

1. **Forgetting that trucks don't return to start**: Some candidates add travel time back to house 0, but the problem only requires reaching the last house with garbage.

2. **Off-by-one errors with travel indices**: The travel array has length n-1 for n houses (travel[i] is time from house i to i+1). Common mistake: using `prefixSum[lastM]` instead of `prefixSum[lastM-1]`.

3. **Not handling empty or single-house cases**: When there's only one house, travel array is empty. Need to check `if lastM > 0` before accessing prefix sums.

4. **Inefficient repeated scanning**: Scanning the garbage array separately for each truck type gives O(3n) instead of O(n). While both are O(n), interviewers look for the single-pass solution.

## When You'll See This Pattern

This problem combines **prefix sums** with **last occurrence tracking**—a pattern useful in many scenarios:

1. **Range sum queries**: Problems like "Range Sum Query - Immutable" (LeetCode 303) use prefix sums to answer sum queries in O(1) time.

2. **Cumulative problems**: "Product of Array Except Self" (LeetCode 238) uses similar cumulative computation from both ends.

3. **Travel/distance problems**: "Minimum Time to Visit All Points" (LeetCode 1266) uses similar reasoning about cumulative travel.

The core pattern: When you need cumulative values to arbitrary points and only care about extremes (first/last occurrence), prefix sums with tracking indices is often optimal.

## Key Takeaways

1. **Separate concerns**: Break the problem into independent components (collection time vs. travel time) to simplify reasoning.

2. **Prefix sums for cumulative travel**: When travel time is additive and you need to know cost to reach arbitrary points, prefix sums give O(1) lookup after O(n) preprocessing.

3. **Track extremes**: When you only care about the first or last occurrence of something (like the farthest house with a garbage type), track it during a single pass rather than searching repeatedly.

[Practice this problem on CodeJeet](/problem/minimum-amount-of-time-to-collect-garbage)
