---
title: "How to Solve Search in Rotated Sorted Array II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Search in Rotated Sorted Array II. Medium difficulty, 39.8% acceptance rate. Topics: Array, Binary Search."
date: "2026-09-05"
category: "dsa-patterns"
tags: ["search-in-rotated-sorted-array-ii", "array", "binary-search", "medium"]
---

# How to Solve Search in Rotated Sorted Array II

This problem asks us to search for a target value in a rotated sorted array that may contain duplicate elements. The twist is that duplicates make the classic binary search approach more challenging because we can't always determine which half of the array is properly sorted just by comparing endpoints. This is what makes the problem interesting and more difficult than its non-duplicate counterpart.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1,0,1,1,1]` with `target = 0`.

**Step 1:** Initialize pointers: `left = 0`, `right = 4`

- `mid = (0 + 4) // 2 = 2`
- `nums[mid] = 1`, which is not equal to target `0`

**Step 2:** Check which side is sorted:

- Compare `nums[left] = 1` with `nums[mid] = 1`
- They're equal! This is the key difference from the non-duplicate version.
- Since we can't determine which side is sorted, we simply increment `left` by 1

**Step 3:** Now `left = 1`, `right = 4`

- `mid = (1 + 4) // 2 = 2`
- `nums[mid] = 1`, still not equal to target

**Step 4:** Check which side is sorted:

- `nums[left] = 0`, `nums[mid] = 1`
- Now `nums[left] < nums[mid]`, so left side `[0,1]` is sorted
- Check if target is in this sorted range: `0 <= target <= 1` → yes
- So we search left: `right = mid - 1 = 1`

**Step 5:** Now `left = 1`, `right = 1`

- `mid = (1 + 1) // 2 = 1`
- `nums[mid] = 0`, which equals target! Return `true`

The key insight is that when `nums[left] == nums[mid]`, we can't determine which half is sorted, so we just increment `left` to skip one duplicate element.

## Brute Force Approach

The brute force solution is simple: iterate through the entire array and check each element against the target. This approach works but is inefficient for large arrays.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def search_brute_force(nums, target):
    """
    Brute force linear search through the array.
    Works but doesn't leverage the partially sorted property.
    """
    for num in nums:
        if num == target:
            return True
    return False
```

```javascript
// Time: O(n) | Space: O(1)
function searchBruteForce(nums, target) {
  // Linear scan through the array
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      return true;
    }
  }
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean searchBruteForce(int[] nums, int target) {
    // Check each element one by one
    for (int num : nums) {
        if (num == target) {
            return true;
        }
    }
    return false;
}
```

</div>

**Why this is insufficient:** The brute force approach has O(n) time complexity, which is acceptable but not optimal. Since the array is at least partially sorted (rotated sorted array), we should be able to do better than linear time. In the worst case with many duplicates, we might still need O(n), but in many cases we can achieve better performance using a modified binary search.

## Optimized Approach

The key insight is that even with duplicates, we can still use binary search, but we need to handle the case where `nums[left] == nums[mid]` specially. Here's the step-by-step reasoning:

1. **Standard binary search setup:** Use `left` and `right` pointers to define the search range.

2. **Check middle element:** If `nums[mid] == target`, we found it!

3. **Handle the tricky case:** When `nums[left] == nums[mid]`, we can't determine which half is sorted because the endpoints are equal. In this case, we simply increment `left` by 1 to skip one duplicate and continue.

4. **Determine which half is sorted:** When `nums[left] != nums[mid]`, we can determine which half is properly sorted:
   - If `nums[left] <= nums[mid]`, the left half is sorted
   - Otherwise, the right half is sorted

5. **Check if target is in the sorted half:** Once we know which half is sorted, we can check if the target falls within that sorted range:
   - If yes, search that half
   - If no, search the other half

This approach degenerates to O(n) in the worst case (when all elements are duplicates and not equal to target), but in practice it's much faster than linear search for typical inputs.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(log n) average, O(n) worst case | Space: O(1)
def search(nums, target):
    """
    Search for target in rotated sorted array with duplicates.
    Uses modified binary search to handle duplicates.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow, find middle

        # Found the target
        if nums[mid] == target:
            return True

        # Handle the case where we can't determine which side is sorted
        if nums[left] == nums[mid]:
            left += 1  # Skip one duplicate
            continue

        # Check which side is properly sorted
        if nums[left] <= nums[mid]:  # Left side is sorted
            if nums[left] <= target < nums[mid]:
                # Target is in the sorted left half
                right = mid - 1
            else:
                # Target is in the right half
                left = mid + 1
        else:  # Right side is sorted
            if nums[mid] < target <= nums[right]:
                # Target is in the sorted right half
                left = mid + 1
            else:
                # Target is in the left half
                right = mid - 1

    return False  # Target not found
```

```javascript
// Time: O(log n) average, O(n) worst case | Space: O(1)
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Found the target
    if (nums[mid] === target) {
      return true;
    }

    // Handle duplicates: can't determine sorted side
    if (nums[left] === nums[mid]) {
      left++; // Skip one duplicate
      continue;
    }

    // Determine which side is sorted
    if (nums[left] <= nums[mid]) {
      // Left side is sorted
      if (nums[left] <= target && target < nums[mid]) {
        // Target is in the sorted left half
        right = mid - 1;
      } else {
        // Target is in the right half
        left = mid + 1;
      }
    } else {
      // Right side is sorted
      if (nums[mid] < target && target <= nums[right]) {
        // Target is in the sorted right half
        left = mid + 1;
      } else {
        // Target is in the left half
        right = mid - 1;
      }
    }
  }

  return false; // Target not found
}
```

```java
// Time: O(log n) average, O(n) worst case | Space: O(1)
public boolean search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // Prevent overflow

        // Found the target
        if (nums[mid] == target) {
            return true;
        }

        // Handle the case with duplicates
        if (nums[left] == nums[mid]) {
            left++;  // Skip one duplicate
            continue;
        }

        // Check which half is sorted
        if (nums[left] <= nums[mid]) {  // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                // Target is in the sorted left half
                right = mid - 1;
            } else {
                // Target is in the right half
                left = mid + 1;
            }
        } else {  // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                // Target is in the sorted right half
                left = mid + 1;
            } else {
                // Target is in the left half
                right = mid - 1;
            }
        }
    }

    return false;  // Target not found
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Best/Average Case:** O(log n) - When there are few duplicates, we can eliminate half the search space each iteration like standard binary search.
- **Worst Case:** O(n) - When all elements are duplicates and not equal to target, we might need to increment `left` through the entire array (e.g., searching for 0 in `[1,1,1,1,1]`).

**Space Complexity:** O(1) - We only use a constant amount of extra space for pointers, regardless of input size.

The worst-case O(n) might seem disappointing, but it's necessary because with all duplicates, we essentially have no sorted structure to exploit. Any correct algorithm must check each element in this worst case.

## Common Mistakes

1. **Forgetting to handle the `nums[left] == nums[mid]` case:** This is the most common mistake. Candidates try to apply the standard rotated array search algorithm and get stuck when `nums[left] == nums[mid]`. The fix is to increment `left` when this happens.

2. **Incorrect boundary conditions in range checks:** When checking if target is in the sorted range, make sure to use the correct comparison operators. For example, use `nums[left] <= target < nums[mid]` not `nums[left] < target < nums[mid]` since the target could equal the left endpoint.

3. **Not updating pointers correctly:** In the duplicate handling case (`nums[left] == nums[mid]`), some candidates try to adjust both `left` and `right` or make other complex adjustments. Simply incrementing `left` by 1 is sufficient.

4. **Assuming O(log n) worst-case time:** Some candidates claim O(log n) worst-case time, but with duplicates, the worst case is actually O(n). Be honest about this in interviews.

## When You'll See This Pattern

This modified binary search pattern appears in several rotated array problems:

1. **Find Minimum in Rotated Sorted Array II (LeetCode 154)** - Very similar problem where you need to find the minimum element in a rotated sorted array with duplicates. The same duplicate-handling technique applies.

2. **Search in Rotated Sorted Array (LeetCode 33)** - The non-duplicate version of this problem. Solve this first to understand the core pattern before tackling the duplicate version.

3. **Rotation Count in Rotated Sorted Array (GeeksforGeeks)** - Finding how many times a sorted array has been rotated. The duplicate version would use the same technique.

The core pattern is: when you can't determine which half of a rotated array is sorted due to equal values at the boundaries, increment the pointer to skip one duplicate and try again.

## Key Takeaways

1. **Binary search can be adapted for rotated arrays** even with duplicates, but requires special handling when `nums[left] == nums[mid]`.

2. **The worst-case time complexity is O(n) with duplicates**, not O(log n), because in the worst case (all duplicates), we might need to check every element.

3. **The increment-by-one strategy for handling duplicates** is simple but effective: when you can't determine which side is sorted, just move past one duplicate and continue.

Remember: Always solve the non-duplicate version (LeetCode 33) first, then adapt it for duplicates by adding the `nums[left] == nums[mid]` handling.

Related problems: [Search in Rotated Sorted Array](/problem/search-in-rotated-sorted-array)
