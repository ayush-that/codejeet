---
title: "Array Questions at Citadel: What to Expect"
description: "Prepare for Array interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-07-17"
category: "dsa-patterns"
tags: ["citadel", "array", "interview prep"]
---

# Array Questions at Citadel: What to Expect

If you're preparing for a Citadel interview, you need to understand one statistic: 50% of their coding questions involve arrays. Out of 96 total problems tracked, 48 are array-based. This isn't a coincidence—it's a deliberate testing strategy. Arrays form the foundation of quantitative finance systems where Citadel operates. Whether you're processing market data streams, optimizing trading strategies, or implementing risk models, you're working with sequences of numbers, prices, or positions. At Citadel, array questions aren't just algorithmic exercises; they're proxies for the actual computational work you'll do daily.

The key insight? Citadel uses arrays to test three things simultaneously: your raw problem-solving speed, your ability to handle edge cases in numerical data, and your optimization instincts for memory and time. They're not looking for theoretical computer scientists—they're looking for engineers who can write efficient, correct code under pressure for data-intensive applications.

## Specific Patterns Citadel Favors

Citadel's array problems cluster around specific patterns that mirror real quantitative finance work:

1. **Sliding Window with Optimization Constraints** - These appear frequently because they model real-time data processing. You're not just finding any window; you're finding the optimal window under specific constraints (maximum profit with transaction limits, minimum subarray with exact sum).

2. **Two-Pointer with State Tracking** - More advanced than basic two-sum, these problems require maintaining additional state while pointers move. Think "trapping rainwater" but with extra constraints about transaction costs or position limits.

3. **Prefix Sum with Hash Map Lookup** - Not just for finding subarrays summing to zero. At Citadel, you'll see variations where you need to track multiple conditions simultaneously, like finding the longest subarray with equal numbers of two different "transaction types."

4. **In-place Array Modification** - Citadel loves problems where you must modify arrays without extra space. This tests whether you understand memory constraints in high-frequency systems.

For example, Citadel frequently uses variations of:

- Best Time to Buy and Sell Stock (LeetCode #121, #122, #123) but with twist constraints
- Subarray Sum Equals K (LeetCode #560) with additional conditions
- Trapping Rain Water (LeetCode #42) modified for financial contexts

## How to Prepare

The most common mistake candidates make is practicing array problems in isolation. At Citadel, you need to recognize when an array problem is actually a:

- Disguised two-pointer problem
- Prefix sum optimization
- Sliding window with early exit conditions

Here's the sliding window pattern you must master—Citadel uses variations of this constantly:

<div class="code-group">

```python
def max_profit_with_fee(prices, fee):
    """
    LeetCode #714 variant: Best Time to Buy and Sell Stock with Transaction Fee
    Time: O(n) | Space: O(1)
    """
    if not prices:
        return 0

    # State machine approach: track best profit if we're holding or not holding stock
    hold = -prices[0]  # Buy on day 0
    not_hold = 0       # Do nothing on day 0

    for i in range(1, len(prices)):
        # Either keep holding or buy today (from not_hold state)
        prev_hold = hold
        hold = max(hold, not_hold - prices[i])

        # Either keep not holding or sell today (from hold state, pay fee)
        not_hold = max(not_hold, prev_hold + prices[i] - fee)

    return not_hold  # Always better to end without holding stock
```

```javascript
function maxProfitWithFee(prices, fee) {
  // Time: O(n) | Space: O(1)
  if (!prices.length) return 0;

  let hold = -prices[0]; // Buy on day 0
  let notHold = 0; // Do nothing on day 0

  for (let i = 1; i < prices.length; i++) {
    const prevHold = hold;
    // Either keep holding or buy today
    hold = Math.max(hold, notHold - prices[i]);
    // Either keep not holding or sell today (pay fee)
    notHold = Math.max(notHold, prevHold + prices[i] - fee);
  }

  return notHold; // Always better to end without holding stock
}
```

```java
public int maxProfitWithFee(int[] prices, int fee) {
    // Time: O(n) | Space: O(1)
    if (prices.length == 0) return 0;

    int hold = -prices[0];     // Buy on day 0
    int notHold = 0;           // Do nothing on day 0

    for (int i = 1; i < prices.length; i++) {
        int prevHold = hold;
        // Either keep holding or buy today
        hold = Math.max(hold, notHold - prices[i]);
        // Either keep not holding or sell today (pay fee)
        notHold = Math.max(notHold, prevHold + prices[i] - fee);
    }

    return notHold;  // Always better to end without holding stock
}
```

</div>

Notice the pattern: we're tracking two states and transitioning between them. This state machine approach appears in multiple Citadel array problems.

## How Citadel Tests Array vs Other Companies

At FAANG companies, array problems often test your knowledge of specific algorithms or data structures. At Citadel, array problems test your ability to optimize for both time and space while handling numerical edge cases.

**Key differences:**

1. **Numerical precision matters more** - Off-by-one errors with indices are fatal. Citadel problems often involve financial calculations where exact indices matter.
2. **Space optimization is non-negotiable** - While Google might accept O(n) space solutions, Citadel frequently expects O(1) space for array problems.
3. **Multiple constraints simultaneously** - Instead of "find the maximum sum," it's "find the maximum sum where the subarray length is between L and R and contains at most K negative numbers."
4. **Real-time processing mindset** - Solutions should be single-pass when possible, mimicking streaming data processing.

Here's another pattern—prefix sum with hash map—that Citadel uses with extra constraints:

<div class="code-group">

```python
def longest_subarray_with_sum_limit(nums, limit):
    """
    Find longest subarray where sum <= limit
    Time: O(n) | Space: O(1)
    """
    left = 0
    current_sum = 0
    max_length = 0

    for right in range(len(nums)):
        current_sum += nums[right]

        # Shrink window from left while sum exceeds limit
        while current_sum > limit and left <= right:
            current_sum -= nums[left]
            left += 1

        # Update max length if current window is valid
        if current_sum <= limit:
            max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function longestSubarrayWithSumLimit(nums, limit) {
  // Time: O(n) | Space: O(1)
  let left = 0;
  let currentSum = 0;
  let maxLength = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    // Shrink window from left while sum exceeds limit
    while (currentSum > limit && left <= right) {
      currentSum -= nums[left];
      left++;
    }

    // Update max length if current window is valid
    if (currentSum <= limit) {
      maxLength = Math.max(maxLength, right - left + 1);
    }
  }

  return maxLength;
}
```

```java
public int longestSubarrayWithSumLimit(int[] nums, int limit) {
    // Time: O(n) | Space: O(1)
    int left = 0;
    int currentSum = 0;
    int maxLength = 0;

    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];

        // Shrink window from left while sum exceeds limit
        while (currentSum > limit && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        // Update max length if current window is valid
        if (currentSum <= limit) {
            maxLength = Math.max(maxLength, right - left + 1);
        }
    }

    return maxLength;
}
```

</div>

## Study Order

Don't study array topics randomly. Follow this progression:

1. **Basic traversal and two-pointer** - Master moving through arrays efficiently before adding constraints.
2. **Prefix sum and sliding window** - These are Citadel's bread and butter. Understand when to use which.
3. **In-place modifications** - Practice rearranging arrays without extra space.
4. **State tracking within windows** - Learn to maintain multiple variables while sliding.
5. **Multiple constraint optimization** - Combine everything with 2-3 simultaneous constraints.

Why this order? Each step builds on the previous one. You can't solve multi-constraint sliding window problems if you're shaky on basic sliding window. You can't do in-place modifications efficiently if you don't understand pointer manipulation.

## Recommended Practice Order

Solve these in sequence:

1. **Two Sum (LeetCode #1)** - Basic hash map usage
2. **Best Time to Buy and Sell Stock (LeetCode #121)** - Single transaction
3. **Best Time to Buy and Sell Stock II (LeetCode #122)** - Multiple transactions
4. **Subarray Sum Equals K (LeetCode #560)** - Prefix sum with hash map
5. **Sliding Window Maximum (LeetCode #239)** - Advanced sliding window
6. **Trapping Rain Water (LeetCode #42)** - Two-pointer with state
7. **Product of Array Except Self (LeetCode #238)** - In-place modification thinking
8. **Maximum Subarray (LeetCode #53)** - Kadane's algorithm (foundational)
9. **Container With Most Water (LeetCode #11)** - Two-pointer optimization
10. **Find All Duplicates in an Array (LeetCode #442)** - In-place marking

After these, search for Citadel-specific array problems. Look for variations with transaction limits, fees, position constraints, or multiple simultaneous conditions.

Remember: At Citadel, getting the right answer isn't enough. You need the most efficient answer, with clean code, proper edge case handling, and the ability to explain your optimization choices. They're testing whether you can write production code for their systems, not just solve puzzles.

[Practice Array at Citadel](/company/citadel/array)
