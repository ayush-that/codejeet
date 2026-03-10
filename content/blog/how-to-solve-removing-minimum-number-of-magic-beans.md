---
title: "How to Solve Removing Minimum Number of Magic Beans — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Removing Minimum Number of Magic Beans. Medium difficulty, 44.4% acceptance rate. Topics: Array, Greedy, Sorting, Enumeration, Prefix Sum."
date: "2029-02-09"
category: "dsa-patterns"
tags: ["removing-minimum-number-of-magic-beans", "array", "greedy", "sorting", "medium"]
---

# How to Solve Removing Minimum Number of Magic Beans

You're given an array of positive integers representing beans in magic bags. You can remove beans from any bag, but all non-empty bags must end up with the same number of beans. Your goal is to minimize the total number of beans removed. What makes this tricky is that you can choose which bags become empty (by removing all their beans) and which remain non-empty with equal counts.

## Visual Walkthrough

Let's trace through `beans = [4, 1, 6, 5]` step by step:

**Step 1: Understanding the transformation**
We need all non-empty bags to have the same number of beans. If we choose `k` as our target number of beans per bag, then:

- Bags with fewer than `k` beans must become empty (we remove all their beans)
- Bags with at least `k` beans keep exactly `k` beans (we remove the excess)

**Step 2: Try different targets**
Let's sort the array first: `[1, 4, 5, 6]`

If we choose `k = 1`:

- Bag with 1 bean: keeps 1 bean (removes 0)
- Bag with 4 beans: keeps 1 bean (removes 3)
- Bag with 5 beans: keeps 1 bean (removes 4)
- Bag with 6 beans: keeps 1 bean (removes 5)
  Total removed = 0 + 3 + 4 + 5 = 12

If we choose `k = 4`:

- Bag with 1 bean: becomes empty (removes 1)
- Bag with 4 beans: keeps 4 beans (removes 0)
- Bag with 5 beans: keeps 4 beans (removes 1)
- Bag with 6 beans: keeps 4 beans (removes 2)
  Total removed = 1 + 0 + 1 + 2 = 4

If we choose `k = 5`:

- Bag with 1 bean: becomes empty (removes 1)
- Bag with 4 beans: becomes empty (removes 4)
- Bag with 5 beans: keeps 5 beans (removes 0)
- Bag with 6 beans: keeps 5 beans (removes 1)
  Total removed = 1 + 4 + 0 + 1 = 6

**Step 3: The key insight**
Notice that when we choose `k = 4`, we got our best result. Also notice that `4` is one of the actual values in the sorted array. This isn't a coincidence! The optimal target will always be one of the existing bean counts. Why? Because if you choose a value between two existing counts, you could lower it to the next existing count and remove fewer beans from the larger bags without affecting which smaller bags become empty.

## Brute Force Approach

A naive approach would try every possible target value from 1 up to the maximum bean count. For each target, we'd iterate through all bags, calculating how many beans to remove from each. This gives us O(n × max(beans)) time complexity, which is far too slow when beans can be as large as 10^9.

Even if we only try targets that exist in the array (which we now know is sufficient), checking each one independently would still be O(n²) since for each of n possible targets, we check all n bags.

<div class="code-group">

```python
# Brute Force - Too Slow!
# Time: O(n²) | Space: O(1)
def minimumRemovalBruteForce(beans):
    n = len(beans)
    min_removed = float('inf')

    # Try each bean count as a possible target
    for target in beans:
        removed = 0
        # Calculate removals for this target
        for bean in beans:
            if bean < target:
                removed += bean  # Remove all beans from smaller bags
            else:
                removed += bean - target  # Remove excess from larger bags
        min_removed = min(min_removed, removed)

    return min_removed
```

```javascript
// Brute Force - Too Slow!
// Time: O(n²) | Space: O(1)
function minimumRemovalBruteForce(beans) {
  let minRemoved = Infinity;

  // Try each bean count as a possible target
  for (let target of beans) {
    let removed = 0;
    // Calculate removals for this target
    for (let bean of beans) {
      if (bean < target) {
        removed += bean; // Remove all beans from smaller bags
      } else {
        removed += bean - target; // Remove excess from larger bags
      }
    }
    minRemoved = Math.min(minRemoved, removed);
  }

  return minRemoved;
}
```

```java
// Brute Force - Too Slow!
// Time: O(n²) | Space: O(1)
public long minimumRemovalBruteForce(int[] beans) {
    long minRemoved = Long.MAX_VALUE;

    // Try each bean count as a possible target
    for (int target : beans) {
        long removed = 0;
        // Calculate removals for this target
        for (int bean : beans) {
            if (bean < target) {
                removed += bean;  // Remove all beans from smaller bags
            } else {
                removed += bean - target;  // Remove excess from larger bags
            }
        }
        minRemoved = Math.min(minRemoved, removed);
    }

    return minRemoved;
}
```

</div>

## Optimized Approach

The key insight is that when we sort the array, we can efficiently calculate removals for each possible target using prefix sums. Here's the reasoning:

1. **Sort the array**: This groups bags by size and lets us think about "bags smaller than target" and "bags at least as large as target".

2. **Use prefix sums**: A prefix sum array lets us quickly get the total beans in any contiguous segment of the sorted array.

3. **Formula for removals**: If we choose `beans[i]` as our target (after sorting), then:
   - All bags at indices `0` to `i-1` are smaller than target, so we remove ALL their beans
   - All bags at indices `i` to `n-1` are at least as large as target, so we remove only the excess: `(beans[j] - target)` for each

4. **Efficient calculation**:
   - Removals from smaller bags = `prefix_sum[i]` (sum of first i elements)
   - Removals from larger bags = `(total_sum - prefix_sum[i]) - target * (n - i)`
     Where `(total_sum - prefix_sum[i])` is the sum of beans in larger bags, and we subtract `target` from each of the `(n-i)` larger bags.

5. **Combine**: Total removals = `prefix_sum[i] + (total_sum - prefix_sum[i]) - target * (n - i)` = `total_sum - target * (n - i)`

Wait, that simplifies beautifully! The `prefix_sum[i]` terms cancel out, leaving us with a simple formula: **total_sum - target × (number_of_bags_at_least_target)**.

This makes sense intuitively: We keep `target` beans in each of the `(n-i)` larger bags, and remove everything else.

## Optimal Solution

Now let's implement this optimized approach with detailed comments:

<div class="code-group">

```python
# Optimal Solution
# Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sorting implementation
def minimumRemoval(beans):
    # Step 1: Sort the array to group bags by size
    # This allows us to efficiently consider "bags smaller than target" vs "bags at least as large"
    beans.sort()

    n = len(beans)
    total_sum = sum(beans)  # Total beans we start with
    min_removed = float('inf')

    # Step 2: Try each unique bean count as a possible target
    # Since array is sorted, when we choose beans[i] as target:
    # - All bags before index i are smaller (must become empty)
    # - All bags from index i onward are at least as large (keep exactly target beans each)
    for i in range(n):
        target = beans[i]
        # Number of bags that will keep target beans each
        bags_keeping_target = n - i

        # Step 3: Calculate removals using our derived formula:
        # total_sum - (target × number_of_bags_keeping_target)
        # Explanation: We keep target beans in each of the (n-i) larger bags,
        # and remove all other beans (which is total_sum minus what we keep)
        removals = total_sum - (target * bags_keeping_target)

        # Step 4: Track the minimum removals we've found
        min_removed = min(min_removed, removals)

    return min_removed
```

```javascript
// Optimal Solution
// Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sorting implementation
function minimumRemoval(beans) {
  // Step 1: Sort the array to group bags by size
  // This allows us to efficiently consider "bags smaller than target" vs "bags at least as large"
  beans.sort((a, b) => a - b);

  const n = beans.length;
  // Calculate total sum of all beans
  const totalSum = beans.reduce((sum, bean) => sum + bean, 0);
  let minRemoved = Infinity;

  // Step 2: Try each unique bean count as a possible target
  // Since array is sorted, when we choose beans[i] as target:
  // - All bags before index i are smaller (must become empty)
  // - All bags from index i onward are at least as large (keep exactly target beans each)
  for (let i = 0; i < n; i++) {
    const target = beans[i];
    // Number of bags that will keep target beans each
    const bagsKeepingTarget = n - i;

    // Step 3: Calculate removals using our derived formula:
    // totalSum - (target × number_of_bags_keeping_target)
    // Explanation: We keep target beans in each of the (n-i) larger bags,
    // and remove all other beans (which is totalSum minus what we keep)
    const removals = totalSum - target * bagsKeepingTarget;

    // Step 4: Track the minimum removals we've found
    minRemoved = Math.min(minRemoved, removals);
  }

  return minRemoved;
}
```

```java
// Optimal Solution
// Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sorting implementation
public long minimumRemoval(int[] beans) {
    // Step 1: Sort the array to group bags by size
    // This allows us to efficiently consider "bags smaller than target" vs "bags at least as large"
    Arrays.sort(beans);

    int n = beans.length;
    // Calculate total sum of all beans (use long to avoid overflow)
    long totalSum = 0;
    for (int bean : beans) {
        totalSum += bean;
    }
    long minRemoved = Long.MAX_VALUE;

    // Step 2: Try each unique bean count as a possible target
    // Since array is sorted, when we choose beans[i] as target:
    // - All bags before index i are smaller (must become empty)
    // - All bags from index i onward are at least as large (keep exactly target beans each)
    for (int i = 0; i < n; i++) {
        long target = beans[i];
        // Number of bags that will keep target beans each
        long bagsKeepingTarget = n - i;

        // Step 3: Calculate removals using our derived formula:
        // totalSum - (target × number_of_bags_keeping_target)
        // Explanation: We keep target beans in each of the (n-i) larger bags,
        // and remove all other beans (which is totalSum minus what we keep)
        long removals = totalSum - (target * bagsKeepingTarget);

        // Step 4: Track the minimum removals we've found
        minRemoved = Math.min(minRemoved, removals);
    }

    return minRemoved;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time, which dominates the solution
- The single pass through the sorted array takes O(n) time
- Overall: O(n log n + n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- In Python, `sort()` uses Timsort which needs O(n) space in worst case
- In Java, `Arrays.sort()` uses a variant of quicksort/mergesort with O(log n) to O(n) space
- In JavaScript, the space complexity depends on the engine's implementation
- The algorithm itself uses only O(1) extra space beyond the input

## Common Mistakes

1. **Not sorting the array**: Some candidates try to work with the unsorted array, missing the crucial insight that sorting lets us efficiently calculate which bags become empty vs which keep beans.

2. **Integer overflow**: When n and bean values can be up to 10^5 and 10^9 respectively, the product `target × (n-i)` can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C).

3. **Trying all possible targets from 1 to max(beans)**: This gives O(n × max(beans)) time, which is far too slow when max(beans) can be 10^9. The key insight is that only existing bean counts need to be considered as targets.

4. **Forgetting that empty bags are allowed**: The problem explicitly states that bags can become empty. Some candidates mistakenly think all bags must end up non-empty, which changes the problem entirely.

5. **Incorrect removal calculation**: A common error is to calculate removals as `sum(beans[:i]) + sum(bean - target for bean in beans[i:])` without realizing this simplifies to `total_sum - target × (n-i)`.

## When You'll See This Pattern

This problem uses a **sorting + prefix sum + enumeration** pattern that appears in several optimization problems:

1. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: Very similar! Instead of making bags equal by removing beans, you make array elements equal by incrementing/decrementing. The optimal target is the median, and you calculate moves using sorted array positions.

2. **Minimum Operations to Reduce X to Zero (LeetCode 1658)**: Uses prefix sums to find subarrays that sum to specific values, though the application is different.

3. **Maximum Product of Two Elements in an Array (LeetCode 1464)**: While simpler, it also benefits from sorting to find the largest elements.

4. **Assign Cookies (LeetCode 455)**: Another greedy sorting problem where you match smallest cookies to smallest greed factors.

The core pattern: When you need to make elements "equal" or satisfy some threshold condition, sorting often helps identify optimal thresholds, and prefix sums help efficiently calculate costs.

## Key Takeaways

1. **Sorting transforms optimization problems**: When you can reorder elements without changing the problem (as here, where bags are independent), sorting often reveals structure that leads to efficient solutions.

2. **Only consider existing values as candidates**: For problems where you're choosing a threshold or target value, the optimal choice is often one of the existing values in the input. This reduces the search space dramatically.

3. **Prefix sums enable O(1) range queries**: When you need to frequently calculate sums of contiguous segments in an array (especially after sorting), prefix sums are your best friend.

4. **Simplify your formulas**: Always look for algebraic simplifications. Here, the complex calculation reduced to `total_sum - target × count`, which is much easier to compute and understand.

Related problems: [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii), [Minimum Operations to Reduce X to Zero](/problem/minimum-operations-to-reduce-x-to-zero)
