---
title: "How to Solve Global and Local Inversions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Global and Local Inversions. Medium difficulty, 42.7% acceptance rate. Topics: Array, Math."
date: "2027-09-28"
category: "dsa-patterns"
tags: ["global-and-local-inversions", "array", "math", "medium"]
---

## How to Solve Global and Local Inversions

This problem presents an interesting twist on counting inversions in arrays. You're given a permutation of `[0, n-1]`, and you need to determine if the number of global inversions equals the number of local inversions. What makes this tricky is that local inversions are a subset of global inversions (every local inversion is also a global inversion), so the equality check essentially asks: "Are all global inversions also local inversions?" This transforms a counting problem into a structural verification problem.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 0, 2]`:

**Global inversions** are pairs `(i, j)` where `i < j` and `nums[i] > nums[j]`:

- `(0, 1)`: `1 > 0` ✓
- `(0, 2)`: `1 > 2` ✗
- `(1, 2)`: `0 > 2` ✗
  Total global inversions: 1

**Local inversions** are pairs `(i, i+1)` where `nums[i] > nums[i+1]`:

- `(0, 1)`: `1 > 0` ✓
- `(1, 2)`: `0 > 2` ✗
  Total local inversions: 1

Since both counts equal 1, this array satisfies the condition. Now let's try `nums = [2, 0, 1]`:

Global inversions:

- `(0, 1)`: `2 > 0` ✓
- `(0, 2)`: `2 > 1` ✓
- `(1, 2)`: `0 > 1` ✗
  Total: 2

Local inversions:

- `(0, 1)`: `2 > 0` ✓
- `(1, 2)`: `0 > 1` ✗
  Total: 1

Here, global (2) ≠ local (1), so the condition fails. Notice what happened: the pair `(0, 2)` created a global inversion that wasn't a local inversion because elements at indices 0 and 2 are not adjacent. This gives us a crucial insight: **For the counts to be equal, no element can be more than one position away from where it "should" be in the sorted array.**

## Brute Force Approach

The most straightforward solution would be to count both types of inversions separately and compare them:

1. Count global inversions using nested loops: for each `i`, check all `j > i` where `nums[i] > nums[j]`
2. Count local inversions by checking each adjacent pair `(i, i+1)` where `nums[i] > nums[i+1]`
3. Return `global == local`

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def isIdealPermutation_brute(nums):
    n = len(nums)
    global_inv = 0
    local_inv = 0

    # Count global inversions
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] > nums[j]:
                global_inv += 1

    # Count local inversions
    for i in range(n - 1):
        if nums[i] > nums[i + 1]:
            local_inv += 1

    return global_inv == local_inv
```

```javascript
// Time: O(n²) | Space: O(1)
function isIdealPermutationBrute(nums) {
  const n = nums.length;
  let globalInv = 0;
  let localInv = 0;

  // Count global inversions
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] > nums[j]) {
        globalInv++;
      }
    }
  }

  // Count local inversions
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      localInv++;
    }
  }

  return globalInv === localInv;
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean isIdealPermutationBrute(int[] nums) {
    int n = nums.length;
    int globalInv = 0;
    int localInv = 0;

    // Count global inversions
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] > nums[j]) {
                globalInv++;
            }
        }
    }

    // Count local inversions
    for (int i = 0; i < n - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            localInv++;
        }
    }

    return globalInv == localInv;
}
```

</div>

**Why this fails:** The brute force approach has O(n²) time complexity, which is too slow for the constraints (n up to 10⁵). We need O(n) or O(n log n) solution.

## Optimized Approach

The key insight comes from understanding what the equality condition really means. Since every local inversion is automatically a global inversion, the only way for the counts to differ is if there exists at least one **global inversion that is NOT a local inversion**.

A global inversion that isn't local means there exist indices `i` and `j` where:

- `i < j` and `nums[i] > nums[j]`
- `j - i > 1` (not adjacent)

Given that our array is a permutation of `[0, n-1]`, each number `x` should ideally be at index `x` in a sorted array. The condition "no global inversions that aren't local" translates to: **No element can be more than one position away from its "ideal" position.**

Why? If an element `x` is at index `i`, but `|x - i| > 1`, then:

- If `x < i - 1`, then there exists some index `j` between `x` and `i` where `nums[j] > x`, creating a non-local inversion
- If `x > i + 1`, then there exists some index `j` between `i` and `x` where `nums[j] < x`, creating a non-local inversion

Thus, we simply need to check: for every index `i`, is `|nums[i] - i| ≤ 1`?

## Optimal Solution

We can solve this in O(n) time by checking each element's deviation from its ideal position. If any element is more than one spot away, we immediately return false.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isIdealPermutation(nums):
    """
    Check if every element is at most one position away from where
    it would be in the sorted array [0, 1, 2, ..., n-1].

    For an ideal permutation (where global = local inversions),
    each element nums[i] must satisfy abs(nums[i] - i) <= 1.
    """
    n = len(nums)

    # Iterate through each element in the array
    for i in range(n):
        # If the current element is more than 1 position away
        # from where it should be in sorted order, return False
        if abs(nums[i] - i) > 1:
            return False

    # All elements are within 1 position of their ideal location
    return True
```

```javascript
// Time: O(n) | Space: O(1)
function isIdealPermutation(nums) {
  /**
   * Check if every element is at most one position away from where
   * it would be in the sorted array [0, 1, 2, ..., n-1].
   *
   * For an ideal permutation (where global = local inversions),
   * each element nums[i] must satisfy Math.abs(nums[i] - i) <= 1.
   */
  const n = nums.length;

  // Iterate through each element in the array
  for (let i = 0; i < n; i++) {
    // If the current element is more than 1 position away
    // from where it should be in sorted order, return false
    if (Math.abs(nums[i] - i) > 1) {
      return false;
    }
  }

  // All elements are within 1 position of their ideal location
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean isIdealPermutation(int[] nums) {
    /**
     * Check if every element is at most one position away from where
     * it would be in the sorted array [0, 1, 2, ..., n-1].
     *
     * For an ideal permutation (where global = local inversions),
     * each element nums[i] must satisfy Math.abs(nums[i] - i) <= 1.
     */
    int n = nums.length;

    // Iterate through each element in the array
    for (int i = 0; i < n; i++) {
        // If the current element is more than 1 position away
        // from where it should be in sorted order, return false
        if (Math.abs(nums[i] - i) > 1) {
            return false;
        }
    }

    // All elements are within 1 position of their ideal location
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) - We make a single pass through the array, checking each element exactly once.

**Space Complexity:** O(1) - We only use a constant amount of extra space regardless of input size.

## Common Mistakes

1. **Counting inversions literally:** The most common mistake is trying to actually count global and local inversions. With n up to 10⁵, O(n²) counting is impossible. Remember: interview problems with large constraints (n ≥ 10⁴) usually require O(n) or O(n log n) solutions.

2. **Misunderstanding the condition:** Some candidates think they need `global ≤ local`, but the problem asks for equality. Since local inversions are a subset of global inversions, `global ≥ local` is always true, so equality means `global = local`.

3. **Off-by-one errors in the check:** The condition is `abs(nums[i] - i) > 1`, not `≥ 1`. If an element is exactly one position away, that's allowed (it creates a local inversion). Only displacements of 2 or more positions create non-local inversions.

4. **Forgetting the permutation property:** The solution relies on the fact that `nums` contains all integers from `0` to `n-1`. Without this property, the `abs(nums[i] - i)` check wouldn't work.

## When You'll See This Pattern

This problem teaches the pattern of **transforming a counting problem into a structural verification problem**. Instead of counting something expensive, we identify what structural property makes the count have a certain value, then verify that property directly.

Related problems:

1. **Check if Array Is Sorted and Rotated (LeetCode 1752)** - Instead of checking all pairs, verify the structural property that there should be at most one "drop" when comparing adjacent elements.
2. **Array Nesting (LeetCode 565)** - Instead of exploring all possible nests, recognize the cycle structure in the permutation.
3. **First Missing Positive (LeetCode 41)** - Uses the "element should be at its value-1 index" insight similar to our "element should be near its value index" insight.

## Key Takeaways

1. **Look for equivalent conditions:** When a problem asks "is count A equal to count B?", especially when B is a subset of A, look for the structural condition "are all A also B?" This often simplifies the problem dramatically.

2. **Permutations of [0, n-1] have special properties:** When you see this constraint, think about where each element "should" be. The difference between an element's value and its index often contains useful information.

3. **Constraints guide complexity:** With n up to 10⁵, O(n²) is impossible. This immediately tells you that counting inversions directly won't work, pushing you to find the O(n) structural check.

[Practice this problem on CodeJeet](/problem/global-and-local-inversions)
