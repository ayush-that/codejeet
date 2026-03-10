---
title: "How to Solve Maximum Size of a Set After Removals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Size of a Set After Removals. Medium difficulty, 46.1% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2029-11-08"
category: "dsa-patterns"
tags: ["maximum-size-of-a-set-after-removals", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Maximum Size of a Set After Removals

You're given two arrays of equal even length, and you must remove exactly half the elements from each array. After removal, you combine the remaining elements into a set and want to maximize the size of that set. The challenge lies in strategically choosing which elements to remove to maximize unique values across both arrays.

What makes this problem interesting is the tension between two competing goals: you want to keep as many unique values as possible, but you're forced to remove exactly half from each array. This creates a strategic decision-making process that's more complex than simply keeping all unique values.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
nums1 = [1, 2, 3, 4, 5, 6]
nums2 = [2, 3, 3, 3, 4, 4]
n = 6, so we must remove 3 elements from each array
```

**Step 1: Understand the constraints**

- We start with 12 total elements (6 in each array)
- We must remove 6 total elements (3 from each)
- We'll end with 6 total elements (3 from each)
- Our goal: maximize unique values among these 6 remaining elements

**Step 2: Identify unique vs shared elements**
Looking at the arrays:

- `nums1` has: 1, 2, 3, 4, 5, 6 (all unique within nums1)
- `nums2` has: 2, 3, 3, 3, 4, 4 (only 2, 3, 4 as distinct values)

Shared elements (appear in both arrays): 2, 3, 4
Elements only in nums1: 1, 5, 6
Elements only in nums2: none (all nums2 elements appear in nums1)

**Step 3: Strategic removal thinking**
We must remove 3 from each array. Key insight: If we remove elements that appear in both arrays from one array, we can potentially keep their copies in the other array, preserving uniqueness in the final set.

**Step 4: Work through a strategy**
Option A: Keep all unique elements from nums1 (1, 5, 6) + some from nums2

- From nums1: keep 1, 5, 6 (3 elements kept, 3 removed)
- From nums2: we need to keep 3 elements. Best choice: 2, 3, 4 (all appear in nums1 but we removed them from nums1)
- Final set: {1, 2, 3, 4, 5, 6} → size 6 ✓

Option B: What if we tried to keep more from nums2?

- From nums2: we could keep 2, 3, 4 (3 elements)
- From nums1: we need to keep 3 elements. If we keep 1, 2, 3, then 2 and 3 duplicate nums2
- Final set: {1, 2, 3, 4} → size 4 ✗

The winning strategy: Remove shared elements from the array where they're more abundant, keeping them in the array where they're scarce.

## Brute Force Approach

A brute force approach would try all possible combinations of removals:

1. Generate all ways to choose n/2 elements to keep from nums1
2. Generate all ways to choose n/2 elements to keep from nums2
3. For each combination, create the set and track the maximum size

The number of combinations is C(n, n/2) for each array, where C is the binomial coefficient. For n=6, that's C(6,3)=20 combinations per array, giving 20×20=400 total combinations to check. For n=20, it's C(20,10)=184,756 per array, giving over 34 billion combinations!

This exponential growth makes brute force infeasible even for moderate n. We need a smarter approach that doesn't enumerate all possibilities.

## Optimized Approach

The key insight is that we should think in terms of **element frequencies** rather than specific indices. Here's the step-by-step reasoning:

1. **Count frequencies**: First, count how many times each element appears in each array. This tells us which elements are unique to one array and which are shared.

2. **Understand the removal constraint**: We must remove exactly n/2 elements from each array. Equivalently, we must KEEP exactly n/2 elements from each array.

3. **Strategic thinking about shared elements**: For elements that appear in both arrays:
   - If we keep a shared element in both arrays, it only contributes 1 to the final set (duplicates don't count)
   - If we keep it in only one array, it still contributes 1 to the final set
   - So we should try to keep shared elements in only one array when possible

4. **Priority for keeping elements**:
   - First priority: Elements unique to an array (must be kept in that array if we want them at all)
   - Second priority: Shared elements that we can strategically allocate between arrays

5. **Mathematical formulation**:
   Let `only1` = elements appearing only in nums1
   Let `only2` = elements appearing only in nums2  
   Let `both` = elements appearing in both arrays

   We need to keep n/2 from nums1 and n/2 from nums2.
   We can first keep all unique elements we want from each array.
   For any remaining slots, we fill with shared elements.

6. **The greedy allocation**:
   - First, keep as many unique elements as possible from each array (up to n/2)
   - If we have leftover capacity in an array, fill it with shared elements
   - The maximum set size = min(n, unique1 + unique2 + shared_we_can_keep)

The tricky part is calculating how many shared elements we can actually keep given the constraints.

## Optimal Solution

The optimal solution uses hash maps to count frequencies and then applies a greedy strategy:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSetSize(nums1, nums2):
    n = len(nums1)
    # Step 1: Count frequencies in each array
    count1 = {}
    count2 = {}

    for num in nums1:
        count1[num] = count1.get(num, 0) + 1
    for num in nums2:
        count2[num] = count2.get(num, 0) + 1

    # Step 2: Identify elements unique to each array and shared elements
    unique1 = set()
    unique2 = set()
    shared = set()

    for num in count1:
        if num in count2:
            shared.add(num)
        else:
            unique1.add(num)

    for num in count2:
        if num not in count1:
            unique2.add(num)

    # Step 3: Calculate how many we can keep from each category
    # We must keep exactly n/2 from each array

    # First, keep as many unique elements as possible from each array
    # But limited to n/2 per array
    keep_from_unique1 = min(len(unique1), n // 2)
    keep_from_unique2 = min(len(unique2), n // 2)

    # Remaining slots we need to fill in each array
    remaining1 = n // 2 - keep_from_unique1
    remaining2 = n // 2 - keep_from_unique2

    # We can fill remaining slots with shared elements
    # Each shared element we keep uses up 1 slot from an array
    # We can keep a shared element in at most one array to maximize uniqueness
    # So the maximum shared elements we can keep = min(len(shared), remaining1 + remaining2)
    keep_from_shared = min(len(shared), remaining1 + remaining2)

    # Step 4: Calculate maximum set size
    # Total unique elements = unique1 kept + unique2 kept + shared kept
    max_set_size = keep_from_unique1 + keep_from_unique2 + keep_from_shared

    # We also need to consider: we might not be able to use all shared elements
    # even if we have capacity, because we need to distribute them between arrays
    # But our calculation already accounts for this with min(len(shared), remaining1 + remaining2)

    # The answer cannot exceed n (since we only have n total elements after removal)
    return min(max_set_size, n)
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSetSize(nums1, nums2) {
  const n = nums1.length;

  // Step 1: Count frequencies in each array
  const count1 = new Map();
  const count2 = new Map();

  for (const num of nums1) {
    count1.set(num, (count1.get(num) || 0) + 1);
  }
  for (const num of nums2) {
    count2.set(num, (count2.get(num) || 0) + 1);
  }

  // Step 2: Identify elements unique to each array and shared elements
  const unique1 = new Set();
  const unique2 = new Set();
  const shared = new Set();

  // Check nums1 elements
  for (const [num] of count1) {
    if (count2.has(num)) {
      shared.add(num);
    } else {
      unique1.add(num);
    }
  }

  // Check nums2 elements
  for (const [num] of count2) {
    if (!count1.has(num)) {
      unique2.add(num);
    }
  }

  // Step 3: Calculate how many we can keep from each category
  // We must keep exactly n/2 from each array

  // First, keep as many unique elements as possible from each array
  const keepFromUnique1 = Math.min(unique1.size, n / 2);
  const keepFromUnique2 = Math.min(unique2.size, n / 2);

  // Remaining slots we need to fill in each array
  const remaining1 = n / 2 - keepFromUnique1;
  const remaining2 = n / 2 - keepFromUnique2;

  // We can fill remaining slots with shared elements
  // Maximum shared elements we can keep = min(shared count, total remaining slots)
  const keepFromShared = Math.min(shared.size, remaining1 + remaining2);

  // Step 4: Calculate maximum set size
  const maxSetSize = keepFromUnique1 + keepFromUnique2 + keepFromShared;

  // The answer cannot exceed n (total elements after removal)
  return Math.min(maxSetSize, n);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int maximumSetSize(int[] nums1, int[] nums2) {
        int n = nums1.length;

        // Step 1: Count frequencies in each array
        Map<Integer, Integer> count1 = new HashMap<>();
        Map<Integer, Integer> count2 = new HashMap<>();

        for (int num : nums1) {
            count1.put(num, count1.getOrDefault(num, 0) + 1);
        }
        for (int num : nums2) {
            count2.put(num, count2.getOrDefault(num, 0) + 1);
        }

        // Step 2: Identify elements unique to each array and shared elements
        Set<Integer> unique1 = new HashSet<>();
        Set<Integer> unique2 = new HashSet<>();
        Set<Integer> shared = new HashSet<>();

        // Check nums1 elements
        for (int num : count1.keySet()) {
            if (count2.containsKey(num)) {
                shared.add(num);
            } else {
                unique1.add(num);
            }
        }

        // Check nums2 elements
        for (int num : count2.keySet()) {
            if (!count1.containsKey(num)) {
                unique2.add(num);
            }
        }

        // Step 3: Calculate how many we can keep from each category
        // We must keep exactly n/2 from each array

        // First, keep as many unique elements as possible from each array
        int keepFromUnique1 = Math.min(unique1.size(), n / 2);
        int keepFromUnique2 = Math.min(unique2.size(), n / 2);

        // Remaining slots we need to fill in each array
        int remaining1 = n / 2 - keepFromUnique1;
        int remaining2 = n / 2 - keepFromUnique2;

        // We can fill remaining slots with shared elements
        // Maximum shared elements we can keep = min(shared count, total remaining slots)
        int keepFromShared = Math.min(shared.size(), remaining1 + remaining2);

        // Step 4: Calculate maximum set size
        int maxSetSize = keepFromUnique1 + keepFromUnique2 + keepFromShared;

        // The answer cannot exceed n (total elements after removal)
        return Math.min(maxSetSize, n);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies in both arrays: O(n) + O(n) = O(n)
- Building sets for unique and shared elements: O(n) in total (each element processed once)
- All other operations (set size checks, arithmetic): O(1)
- Total: O(n)

**Space Complexity: O(n)**

- Frequency maps: O(n) in worst case (all elements distinct)
- Sets for unique1, unique2, shared: O(n) in total
- Total: O(n)

The linear time and space complexity is optimal since we need to examine each element at least once.

## Common Mistakes

1. **Forgetting the n/2 constraint per array**: Some candidates try to maximize unique elements overall without respecting that exactly half must come from each array. Remember: you're not choosing n elements from the combined pool; you're choosing n/2 from each array separately.

2. **Double-counting shared elements**: When an element appears in both arrays, it's tempting to count it twice when calculating potential set size. But in a set, duplicates are removed, so each shared element contributes at most 1 to the final size, regardless of how many arrays it appears in.

3. **Not handling the case when unique elements exceed n/2**: If an array has more than n/2 unique elements, you can only keep n/2 of them (due to the removal requirement). You must choose which n/2 unique elements to keep.

4. **Overlooking the cap of n**: The maximum possible set size is n (since we only have n elements total after removal). Some solutions might return a value greater than n in edge cases.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with hash maps**: Like in "Intersection of Two Arrays" (Easy), we use hash maps/sets to track which elements appear in each collection.

2. **Greedy allocation with constraints**: Similar to "Task Scheduler" (Medium) where you allocate tasks to maximize idle time, here we allocate elements to arrays to maximize uniqueness.

3. **Two-set operations**: The logic for identifying unique and shared elements is similar to problems involving set differences and intersections, like "Find the Difference of Two Arrays" (Easy).

4. **Constraint satisfaction problems**: The need to satisfy multiple constraints (n/2 from each array) while optimizing an objective (maximize set size) appears in many optimization problems.

## Key Takeaways

1. **When faced with removal/selection constraints, think in terms of what you KEEP rather than what you remove**. This mental shift often simplifies the problem.

2. **For problems involving multiple collections, identify the relationship between elements**: Are they unique to one collection? Shared? This categorization is often the key to finding an optimal strategy.

3. **Greedy approaches work well when you can establish a clear priority order**: Here, unique elements have priority over shared ones because they guarantee new additions to the set.

4. **Always verify your solution doesn't violate constraints**: Check edge cases where you might try to keep more elements than allowed or return a value larger than theoretically possible.

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays)
