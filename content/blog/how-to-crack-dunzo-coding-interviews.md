---
title: "How to Crack Dunzo Coding Interviews in 2026"
description: "Complete guide to Dunzo coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2027-04-20"
category: "company-guide"
company: "dunzo"
tags: ["dunzo", "interview prep", "leetcode"]
---

# How to Crack Dunzo Coding Interviews in 2026

Dunzo, the hyperlocal delivery and task management platform, has built a reputation for solving complex logistical and real-time optimization problems. This technical DNA is directly reflected in their engineering interviews. While the process shares similarities with other tech companies—typically consisting of an initial recruiter screen, 2-3 technical coding rounds, and a system design or behavioral round—the emphasis is distinct. Dunzo interviews are notoriously algorithmic, with a heavy skew towards problems that test your ability to model real-world constraints, optimize for time and space, and handle edge cases in data streams. You won't just be implementing a binary search; you'll be figuring out how to apply it to minimize delivery time across a dynamic city grid. The process is lean and fast-paced, often conducted virtually, with interviewers expecting clean, optimal code from the first draft.

## What Makes Dunzo Different

If you're coming from a FAANG interview prep background, you might be in for a surprise. While FAANG interviews often balance algorithmic problem-solving with deep system design and behavioral leadership principles, Dunzo's process is laser-focused on applied algorithms. The problems are less about clever trick questions and more about demonstrating you can translate a messy, real-world scenario into an efficient computational model.

Three key differences stand out. First, **optimization is non-negotiable**. A solution that works in O(n²) time will almost certainly be rejected, even if you correctly identify the brute-force approach. Interviewers will immediately push you towards the optimal solution, testing your ability to reason about time/space trade-offs under pressure. Second, there's a strong emphasis on **prefix sums and array manipulation**. This isn't accidental; think of tracking delivery agent locations, calculating cumulative distances, or managing inventory levels across partner stores—these are prefix sum problems in disguise. Finally, **pseudocode is not a safety net**. While some companies allow you to sketch logic before coding, Dunzo interviewers expect you to write production-ready, syntactically correct code from the get-go. They are evaluating your coding fluency as much as your problem-solving.

## By the Numbers

An analysis of recent Dunzo interview questions reveals a stark difficulty curve:

- **Easy:** 0 (0%)
- **Medium:** 3 (50%)
- **Hard:** 3 (50%)

This 50/50 split between Medium and Hard problems is telling. You cannot pass by only mastering Medium-difficulty LeetCode problems. The "Hard" problems here are typically not esoteric graph theory puzzles but are complex applications of core patterns to data-intensive scenarios. For example, a classic Dunzo-style problem might be a variant of **"Minimum Difficulty of a Job Schedule" (LeetCode #1335)**, which combines dynamic programming with array partitioning—perfect for modeling batch delivery scheduling. Another frequent flyer is **"Trapping Rain Water II" (LeetCode #407)**, a harder 2D version that tests your ability to use a heap for boundary expansion, analogous to optimizing delivery coverage in a geographic area.

The absence of "Easy" problems means the interview starts at a running pace. Your first problem will likely be a Medium that requires a non-trivial insight, setting the tone for the session.

## Top Topics to Focus On

Your study plan must be ruthlessly prioritized. Here are the top topics, why Dunzo favors them, and the essential pattern you must master for each.

**1. Dynamic Programming**
This is the single most important topic. Dunzo's core business—routing, scheduling, batching, and resource allocation—is built on optimization problems that DP solves elegantly. You must be comfortable moving from 1D to 2D DP and identifying both top-down (memoization) and bottom-up (tabulation) approaches.

- **Key Pattern:** DP with State Machine or Partitioning. Think "best time to buy/sell stock with cooldown" or "split array largest sum."

**2. Array & Prefix Sum**
Arrays represent everything from location coordinates to daily order volumes. Prefix sums (and their 2D cousin, the summed-area table) are the go-to tool for answering range queries in constant time, which is fundamental for analytics and real-time calculations.

- **Key Pattern:** Prefix Sum for subarray problems. Often combined with a hash map to track sums, as in "subarray sum equals K."

**3. String**
While less frequent than DP or Arrays, String problems appear often in the context of parsing delivery instructions, validating addresses, or processing user-generated content. Focus on efficient manipulation and pattern matching.

- **Key Pattern:** Sliding Window for substring problems. This is essential for finding the longest substring with K distinct characters or minimum window substring.

Let's look at a critical code pattern for each.

<div class="code-group">

```python
# Dunzo-Favored Pattern: DP for Partitioning (LeetCode #410 - Split Array Largest Sum)
# Problem: Split array into `m` contiguous subarrays to minimize the largest sum among them.
# Why it matters: Directly models batch processing of deliveries to minimize maximum load per batch.

def splitArray(nums, m):
    """
    Time: O(n * log(sum(nums))) | Space: O(1)
    Uses binary search on the answer space (min possible max sum).
    """
    def can_split(max_sum_allowed):
        """Returns True if we can split into <= m subarrays with each sum <= max_sum_allowed."""
        current_sum = 0
        splits_needed = 1  # start with one subarray
        for num in nums:
            if current_sum + num > max_sum_allowed:
                splits_needed += 1
                current_sum = num
                if splits_needed > m:
                    return False
            else:
                current_sum += num
        return True

    left, right = max(nums), sum(nums)
    while left < right:
        mid = (left + right) // 2
        if can_split(mid):
            right = mid  # try for a smaller max sum
        else:
            left = mid + 1  # need to allow a larger max sum
    return left
```

```javascript
// Dunzo-Favored Pattern: DP for Partitioning (LeetCode #410 - Split Array Largest Sum)
function splitArray(nums, m) {
  // Time: O(n * log(sum(nums))) | Space: O(1)
  const canSplit = (maxSumAllowed) => {
    let currentSum = 0;
    let splitsNeeded = 1;
    for (const num of nums) {
      if (currentSum + num > maxSumAllowed) {
        splitsNeeded++;
        currentSum = num;
        if (splitsNeeded > m) return false;
      } else {
        currentSum += num;
      }
    }
    return true;
  };

  let left = Math.max(...nums);
  let right = nums.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canSplit(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
// Dunzo-Favored Pattern: DP for Partitioning (LeetCode #410 - Split Array Largest Sum)
public class Solution {
    // Time: O(n * log(sum(nums))) | Space: O(1)
    public int splitArray(int[] nums, int m) {
        int left = 0, right = 0;
        for (int num : nums) {
            left = Math.max(left, num);
            right += num;
        }

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canSplit(nums, m, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    private boolean canSplit(int[] nums, int m, int maxSumAllowed) {
        int currentSum = 0;
        int splitsNeeded = 1;
        for (int num : nums) {
            if (currentSum + num > maxSumAllowed) {
                splitsNeeded++;
                currentSum = num;
                if (splitsNeeded > m) return false;
            } else {
                currentSum += num;
            }
        }
        return true;
    }
}
```

</div>

<div class="code-group">

```python
# Dunzo-Favored Pattern: Prefix Sum with Hash Map (LeetCode #560 - Subarray Sum Equals K)
# Problem: Find the total number of continuous subarrays whose sum equals k.
# Why it matters: Counts occurrences of a target metric (e.g., number of time periods with exactly X orders).

def subarraySum(nums, k):
    """
    Time: O(n) | Space: O(n)
    The prefix_sum tracks cumulative sum. The map counts how many times
    a particular prefix sum has occurred. If prefix_sum - k exists in the map,
    we found subarrays that sum to k.
    """
    count = 0
    prefix_sum = 0
    sum_count_map = {0: 1}  # base case: a prefix sum of 0 has occurred once

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists, subarrays from that point to here sum to k.
        count += sum_count_map.get(prefix_sum - k, 0)
        # Record this prefix sum for future iterations.
        sum_count_map[prefix_sum] = sum_count_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
// Dunzo-Favored Pattern: Prefix Sum with Hash Map (LeetCode #560 - Subarray Sum Equals K)
function subarraySum(nums, k) {
  // Time: O(n) | Space: O(n)
  let count = 0;
  let prefixSum = 0;
  const sumCountMap = new Map();
  sumCountMap.set(0, 1); // base case

  for (const num of nums) {
    prefixSum += num;
    if (sumCountMap.has(prefixSum - k)) {
      count += sumCountMap.get(prefixSum - k);
    }
    sumCountMap.set(prefixSum, (sumCountMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
// Dunzo-Favored Pattern: Prefix Sum with Hash Map (LeetCode #560 - Subarray Sum Equals K)
public class Solution {
    // Time: O(n) | Space: O(n)
    public int subarraySum(int[] nums, int k) {
        int count = 0, prefixSum = 0;
        Map<Integer, Integer> sumCountMap = new HashMap<>();
        sumCountMap.put(0, 1); // base case

        for (int num : nums) {
            prefixSum += num;
            count += sumCountMap.getOrDefault(prefixSum - k, 0);
            sumCountMap.put(prefixSum, sumCountMap.getOrDefault(prefixSum, 0) + 1);
        }
        return count;
    }
}
```

</div>

## Preparation Strategy

A generic 6-week plan won't cut it. Here’s a targeted 4-week plan assuming you have a basic grasp of data structures.

- **Week 1-2: Foundation & Core Patterns**
  - **Goal:** Achieve deep fluency in **Dynamic Programming** and **Prefix Sum/Array**.
  - **Action:** Solve 40 problems (20 DP, 20 Array). For DP, start with 1D (Climbing Stairs, Coin Change) and move immediately to 2D/Partitioning (Longest Common Subsequence, Partition Equal Subset Sum, Split Array Largest Sum). For Arrays, master sliding window, two-pointer, and every prefix sum variant you can find.
- **Week 3: Integration & Difficulty Ramp**
  - **Goal:** Tackle Dunzo's Medium-Hard mix. Learn to combine patterns.
  - **Action:** Solve 25 problems, focusing on the **"Hard"** problems from Dunzo's known question list and similar companies (DoorDash, Instacart). Prioritize problems that blend topics, like DP on strings or binary search with greedy checks. Time every session.
- **Week 4: Mock Interviews & Refinement**
  - **Goal:** Simulate the actual interview environment and pressure.
  - **Action:** Complete at least 6-8 mock interviews with a partner or using a platform. Use a timer (45 mins for 2 problems). For each mock, follow the exact process: clarify requirements, discuss approach (verbally, with complexity), code, test with edge cases. Review and re-solve any problem where your code wasn't flawless on the first try.

## Common Mistakes

1.  **Leading with brute force without mentioning optimization.** At Dunzo, stating a naive solution is fine, but you must immediately follow it with "However, this is O(n²). I think we can optimize using a hash map to store prefix sums, which would bring it down to O(n)." Show you're thinking about efficiency from the start.
2.  **Ignoring spatial complexity in array problems.** With large geospatial or time-series data, an O(n) space solution might be unacceptable. Always ask clarifying questions: "Is there a constraint on memory usage?" or "Can I assume the input array can be modified?" This shows system-level thinking.
3.  **Writing sloppy, untested code.** Unlike some interviews where logic is king, Dunzo expects clean, bug-resistant code. The most common failure point is not walking through a simple example (including edge cases like empty input, single element, large values) with your own code before declaring it done.
4.  **Getting stuck on the "Dunzo context."** Some problems are wrapped in delivery logistics narratives. Don't waste time over-engineering the real-world model. Extract the core algorithmic problem immediately. Is it a shortest path? A scheduling problem? A resource allocation? Name the pattern and solve that.

## Key Tips

1.  **Memorize the cost of operations.** When discussing complexity, be precise. Say "This sorting step will be O(n log n), which dominates the O(n) loop," not just "It's pretty fast." This precision is valued.
2.  **Practice coding without an auto-complete IDE.** Use a plain text editor or a simple online code pad for 80% of your practice. This builds the muscle memory for syntax you'll need in a shared editor during the interview.
3.  **Start your answer by classifying the problem.** When you hear the problem, your first sentence should be something like, "This sounds like a **minimum spanning tree** problem where the delivery points are nodes and distances are edges," or "This is essentially finding the **maximum sum circular subarray**, which we can solve by Kadane's algorithm on a modified array." This frames the discussion and demonstrates pattern recognition.
4.  **Have a list of 5-10 "go-to" Dunzo-style problems** completely internalized—code, complexity, and edge cases. These should be your anchors if you get nervous. Problems like #410, #560, #1335, #407, and #973 (K Closest Points to Origin) are excellent candidates.

Cracking Dunzo's interview is about proving you can be the engineer who optimizes their core logistics engine. It requires a shift from generalist problem-solving to specialist efficiency. Focus on the patterns that power their business, write impeccable code, and always drive toward the optimal solution.

[Browse all Dunzo questions on CodeJeet](/company/dunzo)
