---
title: "How to Solve Maximum Candies Allocated to K Children — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Candies Allocated to K Children. Medium difficulty, 49.9% acceptance rate. Topics: Array, Binary Search."
date: "2028-09-27"
category: "dsa-patterns"
tags: ["maximum-candies-allocated-to-k-children", "array", "binary-search", "medium"]
---

# How to Solve Maximum Candies Allocated to K Children

You're given piles of candies and need to allocate them to `k` children by splitting piles into smaller sub-piles. Each child should get exactly one pile (which can be a sub-pile), and you want to maximize the minimum candy amount any child receives. The challenge is that you can split any pile into any number of equal-sized sub-piles, but you cannot combine piles. This is tricky because you need to determine the largest possible equal allocation where every child gets at least that amount.

## Visual Walkthrough

Let's walk through an example: `candies = [5, 8, 6]`, `k = 3`.

We want to find the maximum number `x` such that we can give each child at least `x` candies. Let's test some values:

- **x = 5**: Can we give each child at least 5 candies?
  - Pile 1 (5): Can make 1 sub-pile of size 5 → serves 1 child
  - Pile 2 (8): Can make ⌊8/5⌋ = 1 sub-pile of size 5 → serves 1 child
  - Pile 3 (6): Can make ⌊6/5⌋ = 1 sub-pile of size 5 → serves 1 child
  - Total children served = 3, which equals `k = 3`. So `x = 5` works.

- **x = 6**: Can we give each child at least 6 candies?
  - Pile 1 (5): ⌊5/6⌋ = 0 → serves 0 children
  - Pile 2 (8): ⌊8/6⌋ = 1 → serves 1 child
  - Pile 3 (6): ⌊6/6⌋ = 1 → serves 1 child
  - Total = 2 children, which is less than `k = 3`. So `x = 6` doesn't work.

Therefore, the maximum `x` that works is 5. Notice that if `x` works, any smaller value also works (since we can serve at least as many children with smaller piles). If `x` doesn't work, any larger value also won't work. This monotonic property is key to solving efficiently.

## Brute Force Approach

A brute force approach would try every possible value of `x` from 1 up to the maximum pile size, checking if we can serve `k` children with that allocation. For each `x`, we'd calculate how many children we can serve by summing ⌊pile_size / x⌋ for all piles.

The problem with this approach is efficiency. If the largest pile has `M` candies, we might check up to `M` values. For each value, we iterate through all `n` piles. This gives us O(n × M) time complexity, which is too slow when `M` is large (up to 10^7 in constraints).

<div class="code-group">

```python
# Time: O(n × max(candies)) - Too slow for large inputs!
# Space: O(1)
def maximumCandies_brute(candies, k):
    max_pile = max(candies)

    # Try every possible allocation from 1 to max_pile
    for x in range(max_pile, 0, -1):
        total_children = 0

        # Count how many children we can serve with allocation x
        for pile in candies:
            total_children += pile // x

        # If we can serve at least k children, this is our answer
        if total_children >= k:
            return x

    return 0  # If no allocation works (shouldn't happen with valid inputs)
```

```javascript
// Time: O(n × max(candies)) - Too slow for large inputs!
// Space: O(1)
function maximumCandiesBrute(candies, k) {
  const maxPile = Math.max(...candies);

  // Try every possible allocation from maxPile down to 1
  for (let x = maxPile; x >= 1; x--) {
    let totalChildren = 0;

    // Count how many children we can serve with allocation x
    for (const pile of candies) {
      totalChildren += Math.floor(pile / x);
    }

    // If we can serve at least k children, this is our answer
    if (totalChildren >= k) {
      return x;
    }
  }

  return 0; // If no allocation works
}
```

```java
// Time: O(n × max(candies)) - Too slow for large inputs!
// Space: O(1)
public int maximumCandiesBrute(int[] candies, int k) {
    int maxPile = 0;
    for (int pile : candies) {
        maxPile = Math.max(maxPile, pile);
    }

    // Try every possible allocation from maxPile down to 1
    for (int x = maxPile; x >= 1; x--) {
        long totalChildren = 0;  // Use long to avoid overflow

        // Count how many children we can serve with allocation x
        for (int pile : candies) {
            totalChildren += pile / x;
        }

        // If we can serve at least k children, this is our answer
        if (totalChildren >= k) {
            return x;
        }
    }

    return 0;  // If no allocation works
}
```

</div>

## Optimized Approach

The key insight is that the function "can we serve k children with allocation x?" is monotonic:

- If `x` works (we can serve ≥ k children), then any smaller `x` also works
- If `x` doesn't work, then any larger `x` also won't work

This monotonic property allows us to use **binary search** to find the maximum `x` that works. Instead of checking every possible value from 1 to max_pile, we can binary search over this range.

Here's the step-by-step reasoning:

1. The answer must be between 0 and max(candies). We use 0 as the lower bound because if we have fewer total candies than children, the answer is 0.
2. For a candidate `mid`, calculate how many children we can serve: sum(⌊pile / mid⌋) for all piles.
3. If we can serve ≥ k children, `mid` is valid. We should try larger values (move left = mid + 1).
4. If we cannot serve k children, `mid` is too large. We should try smaller values (move right = mid - 1).
5. Continue until left > right. The last valid `mid` (or right) is our answer.

This reduces the time complexity from O(n × M) to O(n × log M), which is efficient even for large inputs.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n × log(max(candies))) - Efficient for large inputs
# Space: O(1) - Only using a few variables
def maximumCandies(candies, k):
    # Step 1: Check if we have enough total candies for k children
    # If total candies < k, we can't give even 1 candy to each child
    total_candies = sum(candies)
    if total_candies < k:
        return 0

    # Step 2: Binary search for the maximum allocation
    left, right = 1, max(candies)
    answer = 0

    while left <= right:
        mid = (left + right) // 2
        total_children = 0

        # Step 3: Count how many children we can serve with allocation = mid
        for pile in candies:
            total_children += pile // mid

        # Step 4: Check if this allocation works
        if total_children >= k:
            # mid works, try larger allocations
            answer = mid  # Update our best answer so far
            left = mid + 1
        else:
            # mid is too large, try smaller allocations
            right = mid - 1

    return answer
```

```javascript
// Time: O(n × log(max(candies))) - Efficient for large inputs
// Space: O(1) - Only using a few variables
function maximumCandies(candies, k) {
  // Step 1: Check if we have enough total candies for k children
  const totalCandies = candies.reduce((sum, pile) => sum + pile, 0);
  if (totalCandies < k) {
    return 0;
  }

  // Step 2: Binary search for the maximum allocation
  let left = 1;
  let right = Math.max(...candies);
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    let totalChildren = 0;

    // Step 3: Count how many children we can serve with allocation = mid
    for (const pile of candies) {
      totalChildren += Math.floor(pile / mid);
    }

    // Step 4: Check if this allocation works
    if (totalChildren >= k) {
      // mid works, try larger allocations
      answer = mid; // Update our best answer so far
      left = mid + 1;
    } else {
      // mid is too large, try smaller allocations
      right = mid - 1;
    }
  }

  return answer;
}
```

```java
// Time: O(n × log(max(candies))) - Efficient for large inputs
// Space: O(1) - Only using a few variables
public int maximumCandies(int[] candies, int k) {
    // Step 1: Check if we have enough total candies for k children
    long totalCandies = 0;  // Use long to avoid overflow
    int maxPile = 0;
    for (int pile : candies) {
        totalCandies += pile;
        maxPile = Math.max(maxPile, pile);
    }

    if (totalCandies < k) {
        return 0;
    }

    // Step 2: Binary search for the maximum allocation
    int left = 1;
    int right = maxPile;
    int answer = 0;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid potential overflow
        long totalChildren = 0;  // Use long to avoid overflow

        // Step 3: Count how many children we can serve with allocation = mid
        for (int pile : candies) {
            totalChildren += pile / mid;
        }

        // Step 4: Check if this allocation works
        if (totalChildren >= k) {
            // mid works, try larger allocations
            answer = mid;  // Update our best answer so far
            left = mid + 1;
        } else {
            // mid is too large, try smaller allocations
            right = mid - 1;
        }
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × log M) where n is the number of piles and M is the maximum pile size. We perform binary search over the range [1, M], which takes O(log M) iterations. For each iteration, we iterate through all n piles to count how many children we can serve.

**Space Complexity:** O(1) for all implementations. We only use a constant amount of extra space for variables like `left`, `right`, `mid`, `total_children`, and `answer`.

## Common Mistakes

1. **Not checking total candies first:** If total candies < k, the answer is 0. Some candidates skip this check and get stuck in binary search or return incorrect answers.

2. **Binary search boundary errors:**
   - Starting with `left = 0` instead of `left = 1` (0 is a valid answer but handled separately)
   - Using `while (left < right)` instead of `while (left <= right)` and missing the final check
   - Not updating `answer` correctly when `mid` works

3. **Integer overflow:** When summing large numbers (especially in Java), use `long` for intermediate calculations. The total children served can exceed 2^31-1.

4. **Incorrect child counting:** Remember we use integer division `pile // mid`. Some candidates mistakenly use `(pile + mid - 1) // mid` which would be for ceiling division, not floor division.

## When You'll See This Pattern

This "binary search on answer" pattern appears in problems where:

1. You're asked to maximize/minimize a value
2. There's a monotonic relationship: if value X works, then all values < X (or > X) also work
3. Checking if a particular value works is easier than finding the optimal value directly

Related problems:

- **Koko Eating Bananas (LeetCode 875)**: Similar structure - find minimum eating speed where Koko can eat all bananas within h hours.
- **Minimum Limit of Balls in a Bag (LeetCode 1760)**: Find minimum penalty where you can perform at most maxOperations.
- **Minimum Speed to Arrive on Time (LeetCode 1870)**: Find minimum speed to reach office on time.
- **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Find minimum capacity to ship packages within D days.

## Key Takeaways

1. **Recognize the monotonic pattern**: When you need to find the maximum/minimum value satisfying a condition, and checking if a value works is easier than finding the optimal value directly, consider binary search on the answer space.

2. **Binary search on answer vs. binary search on array**: This is different from standard binary search on a sorted array. Here, we're searching over a range of possible answers (1 to max_pile), not indices of an array.

3. **Always handle edge cases first**: Check for trivial cases like total candies < k before starting binary search. This simplifies the main logic and prevents errors.

Related problems: [Koko Eating Bananas](/problem/koko-eating-bananas), [Minimum Limit of Balls in a Bag](/problem/minimum-limit-of-balls-in-a-bag), [Minimum Speed to Arrive on Time](/problem/minimum-speed-to-arrive-on-time)
