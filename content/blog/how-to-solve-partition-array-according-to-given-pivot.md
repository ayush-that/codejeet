---
title: "How to Solve Partition Array According to Given Pivot — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array According to Given Pivot. Medium difficulty, 89.8% acceptance rate. Topics: Array, Two Pointers, Simulation."
date: "2027-12-26"
category: "dsa-patterns"
tags: ["partition-array-according-to-given-pivot", "array", "two-pointers", "simulation", "medium"]
---

# How to Solve Partition Array According to Given Pivot

You need to rearrange an array so that elements less than a pivot come first, elements equal to the pivot come in the middle, and elements greater than the pivot come last. The challenge is doing this **in-place** with **O(n) time** and **O(1) space** while maintaining the relative order of elements within each group. This is essentially a three-way partitioning problem with the added constraint of preserving order, which makes it trickier than a simple sort.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [9, 12, 5, 10, 14, 3, 10]` and `pivot = 10`.

We need to rearrange so that:

- Elements < 10 come first: `[9, 5, 3]`
- Elements = 10 come next: `[10, 10]`
- Elements > 10 come last: `[12, 14]`

The final array should be: `[9, 5, 3, 10, 10, 12, 14]`

Notice how the relative order is preserved within each group:

- `< 10`: 9 came before 5 before 3 in original, same in result
- `= 10`: both 10s maintain their relative order
- `> 10`: 12 came before 14 in original, same in result

The key insight is that we can build the result in **three passes** by collecting elements into three separate lists and then combining them. But for optimal space, we need a smarter approach.

## Brute Force Approach

The most straightforward solution would be to create three separate lists:

1. `less`: elements smaller than pivot
2. `equal`: elements equal to pivot
3. `greater`: elements greater than pivot

Then combine them: `less + equal + greater`

**Why this isn't optimal:**

- Space complexity is O(n) for the three lists
- It requires three passes through the array
- While it solves the problem, interviewers expect the in-place O(1) space solution

Here's what the brute force looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def pivotArray(nums, pivot):
    less = []
    equal = []
    greater = []

    for num in nums:
        if num < pivot:
            less.append(num)
        elif num == pivot:
            equal.append(num)
        else:
            greater.append(num)

    return less + equal + greater
```

```javascript
// Time: O(n) | Space: O(n)
function pivotArray(nums, pivot) {
  const less = [];
  const equal = [];
  const greater = [];

  for (const num of nums) {
    if (num < pivot) {
      less.push(num);
    } else if (num === pivot) {
      equal.push(num);
    } else {
      greater.push(num);
    }
  }

  return [...less, ...equal, ...greater];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] pivotArray(int[] nums, int pivot) {
    List<Integer> less = new ArrayList<>();
    List<Integer> equal = new ArrayList<>();
    List<Integer> greater = new ArrayList<>();

    for (int num : nums) {
        if (num < pivot) {
            less.add(num);
        } else if (num == pivot) {
            equal.add(num);
        } else {
            greater.add(num);
        }
    }

    // Combine lists into result array
    int[] result = new int[nums.length];
    int index = 0;

    for (int num : less) result[index++] = num;
    for (int num : equal) result[index++] = num;
    for (int num : greater) result[index++] = num;

    return result;
}
```

</div>

## Optimized Approach

The optimal solution uses **two-pass in-place partitioning** with careful index management. Here's the key insight:

1. **First pass:** Move all elements less than pivot to the front while preserving their order
2. **Second pass:** Move all elements equal to pivot right after the less-than elements
3. Elements greater than pivot automatically end up at the end

We can implement this with **three pointers**:

- `insertPos`: Where to insert the next element of the current category
- `i`: Current element we're examining
- We process the array multiple times, each time focusing on one category

Alternatively, we can use a **single-pass approach** with **three separate arrays** but that's essentially the brute force. The true optimal in-place solution requires multiple passes but O(1) extra space.

Actually, let me correct that: The most elegant solution uses **two pointers from both ends** for a standard partition (like in quicksort), but that doesn't preserve order. To preserve order with O(1) space, we need multiple passes.

The cleanest O(1) space approach is:

1. First pass: Overwrite array with elements < pivot
2. Second pass: Continue from where first pass ended, add elements = pivot
3. Third pass: Add elements > pivot

But wait, we can't overwrite the original array while reading from it! We need to create a new array or use a different strategy.

Actually, the optimal approach that satisfies both O(n) time and O(1) space **while preserving order** is tricky. The standard solution uses O(n) space. For true O(1) space with order preservation, we'd need a complex algorithm. In interviews, the O(n) space solution is often acceptable if we explain the trade-offs.

Let me present the most practical solution: **Three-pointer single pass** that builds the result in a new array. This is O(n) time and O(n) space, which is acceptable for most interview scenarios.

## Optimal Solution

Here's the optimal practical solution that's clean, easy to understand, and works well in interviews:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def pivotArray(nums, pivot):
    # Create result array of same length
    result = [0] * len(nums)

    # Three pointers for insertion positions
    left = 0          # For elements < pivot
    right = len(nums) - 1  # For elements > pivot (inserting from end)

    # First pass: Count elements equal to pivot
    equal_count = 0
    for num in nums:
        if num == pivot:
            equal_count += 1

    # Calculate boundary positions
    # Elements < pivot go from index 0 to left-1
    # Elements = pivot go from left to left+equal_count-1
    # Elements > pivot go from left+equal_count to end

    # But we need to fill in order, so let's use a different approach:
    # Fill result array in correct order directly

    # Pointers for tracking where to insert each type of element
    less_idx = 0
    equal_idx = 0
    greater_idx = 0

    # First, count how many of each type we have
    for num in nums:
        if num < pivot:
            less_idx += 1
        elif num == pivot:
            equal_idx += 1
        else:
            greater_idx += 1

    # Now we know the boundaries:
    # less elements: 0 to less_idx-1
    # equal elements: less_idx to less_idx+equal_idx-1
    # greater elements: less_idx+equal_idx to end

    # Reset pointers for actual insertion
    less_ptr = 0
    equal_ptr = less_idx
    greater_ptr = less_idx + equal_idx

    # Fill the result array
    for num in nums:
        if num < pivot:
            result[less_ptr] = num
            less_ptr += 1
        elif num == pivot:
            result[equal_ptr] = num
            equal_ptr += 1
        else:
            result[greater_ptr] = num
            greater_ptr += 1

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function pivotArray(nums, pivot) {
  const result = new Array(nums.length);

  // Count elements in each category
  let lessCount = 0,
    equalCount = 0,
    greaterCount = 0;

  for (const num of nums) {
    if (num < pivot) lessCount++;
    else if (num === pivot) equalCount++;
    else greaterCount++;
  }

  // Calculate insertion positions
  let lessPos = 0;
  let equalPos = lessCount;
  let greaterPos = lessCount + equalCount;

  // Place each element in its correct position
  for (const num of nums) {
    if (num < pivot) {
      result[lessPos] = num;
      lessPos++;
    } else if (num === pivot) {
      result[equalPos] = num;
      equalPos++;
    } else {
      result[greaterPos] = num;
      greaterPos++;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] pivotArray(int[] nums, int pivot) {
    int[] result = new int[nums.length];

    // Count elements in each category
    int lessCount = 0, equalCount = 0, greaterCount = 0;

    for (int num : nums) {
        if (num < pivot) lessCount++;
        else if (num == pivot) equalCount++;
        else greaterCount++;
    }

    // Calculate starting indices for each category
    int lessIdx = 0;
    int equalIdx = lessCount;
    int greaterIdx = lessCount + equalCount;

    // Place each element in correct position
    for (int num : nums) {
        if (num < pivot) {
            result[lessIdx] = num;
            lessIdx++;
        } else if (num == pivot) {
            result[equalIdx] = num;
            equalIdx++;
        } else {
            result[greaterIdx] = num;
            greaterIdx++;
        }
    }

    return result;
}
```

</div>

Actually, I realize the above solution is more complex than needed. Here's a simpler, cleaner version that's easier to understand and implement:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def pivotArray(nums, pivot):
    # Create three separate lists
    less, equal, greater = [], [], []

    # Single pass to categorize elements
    for num in nums:
        if num < pivot:
            less.append(num)
        elif num == pivot:
            equal.append(num)
        else:
            greater.append(num)

    # Combine and return
    return less + equal + greater
```

```javascript
// Time: O(n) | Space: O(n)
function pivotArray(nums, pivot) {
  const less = [],
    equal = [],
    greater = [];

  for (const num of nums) {
    if (num < pivot) less.push(num);
    else if (num === pivot) equal.push(num);
    else greater.push(num);
  }

  return [...less, ...equal, ...greater];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] pivotArray(int[] nums, int pivot) {
    List<Integer> less = new ArrayList<>();
    List<Integer> equal = new ArrayList<>();
    List<Integer> greater = new ArrayList<>();

    for (int num : nums) {
        if (num < pivot) less.add(num);
        else if (num == pivot) equal.add(num);
        else greater.add(num);
    }

    // Combine into result array
    int[] result = new int[nums.length];
    int idx = 0;

    for (int num : less) result[idx++] = num;
    for (int num : equal) result[idx++] = num;
    for (int num : greater) result[idx++] = num;

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to categorize elements: O(n)
- We concatenate the three lists: O(n) total
- Overall linear time

**Space Complexity: O(n)**

- We create three lists that together store all n elements: O(n)
- The output array also uses O(n) space
- In most languages, concatenation creates a new array: O(n)

**Why not O(1) space?**

- Preserving the relative order of elements within each group makes an in-place O(1) space solution much more complex
- The standard quicksort partition algorithm (which is O(1) space) doesn't preserve order
- For interview purposes, the O(n) space solution is usually acceptable if you can explain this trade-off

## Common Mistakes

1. **Using quicksort-style partitioning** (two pointers from ends): This doesn't preserve the relative order of elements within the groups. The problem explicitly requires maintaining order.

2. **Forgetting that arrays are 0-indexed**: When calculating insertion positions, off-by-one errors are common. Always test with small examples.

3. **Modifying the input array while iterating**: If trying an in-place approach, changing elements while reading them can lead to incorrect results. Always be careful with read-modify-write patterns.

4. **Not handling equal elements correctly**: The equal elements must appear between less-than and greater-than elements, not mixed with them. Some solutions accidentally put equals at the beginning or end.

5. **Inefficient concatenation**: In some languages, repeatedly concatenating arrays is O(n²). It's better to build separate lists and combine once.

## When You'll See This Pattern

This three-way partitioning pattern appears in several important algorithms and problems:

1. **Dutch National Flag Problem**: The classic problem of sorting an array of 0s, 1s, and 2s. This is essentially the same problem with pivot=1.

2. **Partition List (LeetCode 86)**: Similar problem but with linked lists instead of arrays. The same three-group approach works.

3. **Rearrange Array Elements by Sign (LeetCode 2149)**: Partitioning based on positive/negative rather than pivot comparison.

4. **Quickselect and Quicksort**: These use partitioning around a pivot, though usually without preserving order.

5. **Stable partitioning algorithms**: In general, any algorithm that needs to group elements while maintaining relative order uses similar techniques.

## Key Takeaways

1. **Three-way partitioning** is a fundamental technique: When you need to separate elements into three groups based on a condition, think about collecting each group separately.

2. **Order preservation requires extra care**: Standard swapping approaches (like in quicksort) don't maintain order. When order matters, you often need O(n) space or multiple passes.

3. **Count then place is a useful pattern**: First count how many elements belong to each group to determine insertion positions, then place each element in its correct position. This ensures O(n) time with a single pass for placement.

4. **Trade-offs matter**: In interviews, it's important to discuss the space-time trade-off. The O(n) space solution is simpler and often acceptable unless specifically asked for O(1) space.

Related problems: [Partition List](/problem/partition-list), [Rearrange Array Elements by Sign](/problem/rearrange-array-elements-by-sign)
