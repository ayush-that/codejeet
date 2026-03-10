---
title: "How to Solve Container With Most Water — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Container With Most Water. Medium difficulty, 59.6% acceptance rate. Topics: Array, Two Pointers, Greedy."
date: "2026-02-19"
category: "dsa-patterns"
tags: ["container-with-most-water", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Container With Most Water

You're given an array where each element represents the height of a vertical line at that index. You need to find two lines that form a container (with the x-axis as the bottom) that holds the most water. The tricky part is that the water capacity depends on both the distance between lines and the height of the shorter line — and you need to find the optimal pair efficiently.

## Visual Walkthrough

Let's trace through `height = [1,8,6,2,5,4,8,3,7]` step by step:

1. **Understanding the formula**: For any two lines at indices `i` and `j`, the water they can hold is:

   ```
   area = min(height[i], height[j]) × (j - i)
   ```

   The container's height is limited by the shorter line (water would spill over), and width is the distance between them.

2. **Initial setup**: Imagine vertical lines at positions 0 through 8 with heights [1,8,6,2,5,4,8,3,7].

3. **Key observation**: If we start with the widest possible container (first and last lines: indices 0 and 8):
   - Height = min(1, 7) = 1
   - Width = 8 - 0 = 8
   - Area = 1 × 8 = 8

4. **The optimization insight**: To potentially get more water, we need taller lines. Since the current height is limited by the shorter line (height[0] = 1), moving the left pointer inward might find a taller line. If we move the right pointer instead, we'd reduce width without guaranteeing a taller minimum height.

5. **Step-by-step progression**:
   - Move left from 0→1: Now lines at 1 and 8: min(8,7)=7, width=7, area=49 (new max!)
   - Now height[1]=8, height[8]=7: right is shorter, so move right from 8→7
   - Lines at 1 and 7: min(8,3)=3, width=6, area=18
   - Continue this pattern, always moving the pointer at the shorter line

This two-pointer approach efficiently explores the solution space without checking every pair.

## Brute Force Approach

The most straightforward solution checks every possible pair of lines:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxArea_brute(height):
    """
    Check every possible pair of lines to find maximum area.
    For n lines, there are n×(n-1)/2 possible pairs.
    """
    max_area = 0
    n = len(height)

    # Try every starting line
    for i in range(n):
        # Try every ending line after i
        for j in range(i + 1, n):
            # Calculate area: min height × width
            current_area = min(height[i], height[j]) * (j - i)
            # Update max if we found a better container
            max_area = max(max_area, current_area)

    return max_area
```

```javascript
// Time: O(n²) | Space: O(1)
function maxAreaBrute(height) {
  /**
   * Check every possible pair of lines to find maximum area.
   * For n lines, there are n×(n-1)/2 possible pairs.
   */
  let maxArea = 0;
  const n = height.length;

  // Try every starting line
  for (let i = 0; i < n; i++) {
    // Try every ending line after i
    for (let j = i + 1; j < n; j++) {
      // Calculate area: min height × width
      const currentArea = Math.min(height[i], height[j]) * (j - i);
      // Update max if we found a better container
      maxArea = Math.max(maxArea, currentArea);
    }
  }

  return maxArea;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxAreaBrute(int[] height) {
    /**
     * Check every possible pair of lines to find maximum area.
     * For n lines, there are n×(n-1)/2 possible pairs.
     */
    int maxArea = 0;
    int n = height.length;

    // Try every starting line
    for (int i = 0; i < n; i++) {
        // Try every ending line after i
        for (int j = i + 1; j < n; j++) {
            // Calculate area: min height × width
            int currentArea = Math.min(height[i], height[j]) * (j - i);
            // Update max if we found a better container
            maxArea = Math.max(maxArea, currentArea);
        }
    }

    return maxArea;
}
```

</div>

**Why it's insufficient**: With n up to 10⁵ (typical LeetCode constraints), O(n²) means checking up to 5 billion pairs — far too slow. We need an O(n) solution.

## Optimized Approach

The key insight is that we can use a **two-pointer approach** starting from both ends of the array:

1. **Initialization**: Start with `left = 0` and `right = n-1` — the widest possible container.
2. **Calculate area**: Compute area with current pointers.
3. **Move pointers**: Always move the pointer pointing to the **shorter line** inward. Why?
   - The area is limited by the shorter line's height
   - Moving the taller line inward would definitely decrease width, and might not increase height (could even decrease it if we find an even shorter line)
   - Moving the shorter line inward might find a taller line, potentially increasing the area despite reduced width
4. **Termination**: Stop when pointers meet.

This greedy approach works because we're systematically exploring the solution space while eliminating many impossible candidates. Each move preserves the possibility of finding a better solution while discarding configurations that can't possibly be better.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxArea(height):
    """
    Two-pointer solution that finds maximum water container area.
    Key insight: Start with widest container, then move the shorter
    line inward to potentially find taller lines.
    """
    # Initialize pointers at both ends for maximum width
    left, right = 0, len(height) - 1
    max_area = 0

    # Continue until pointers meet
    while left < right:
        # Calculate current container area
        # Height is limited by the shorter line
        current_height = min(height[left], height[right])
        # Width is distance between indices
        current_width = right - left
        # Area = height × width
        current_area = current_height * current_width

        # Update maximum area if current is better
        max_area = max(max_area, current_area)

        # Move the pointer at the shorter line inward
        # This might find a taller line for better area
        if height[left] < height[right]:
            left += 1  # Left line is shorter, try next line
        else:
            right -= 1  # Right line is shorter or equal, try previous line

    return max_area
```

```javascript
// Time: O(n) | Space: O(1)
function maxArea(height) {
  /**
   * Two-pointer solution that finds maximum water container area.
   * Key insight: Start with widest container, then move the shorter
   * line inward to potentially find taller lines.
   */
  // Initialize pointers at both ends for maximum width
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  // Continue until pointers meet
  while (left < right) {
    // Calculate current container area
    // Height is limited by the shorter line
    const currentHeight = Math.min(height[left], height[right]);
    // Width is distance between indices
    const currentWidth = right - left;
    // Area = height × width
    const currentArea = currentHeight * currentWidth;

    // Update maximum area if current is better
    maxArea = Math.max(maxArea, currentArea);

    // Move the pointer at the shorter line inward
    // This might find a taller line for better area
    if (height[left] < height[right]) {
      left++; // Left line is shorter, try next line
    } else {
      right--; // Right line is shorter or equal, try previous line
    }
  }

  return maxArea;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxArea(int[] height) {
    /**
     * Two-pointer solution that finds maximum water container area.
     * Key insight: Start with widest container, then move the shorter
     * line inward to potentially find taller lines.
     */
    // Initialize pointers at both ends for maximum width
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;

    // Continue until pointers meet
    while (left < right) {
        // Calculate current container area
        // Height is limited by the shorter line
        int currentHeight = Math.min(height[left], height[right]);
        // Width is distance between indices
        int currentWidth = right - left;
        // Area = height × width
        int currentArea = currentHeight * currentWidth;

        // Update maximum area if current is better
        maxArea = Math.max(maxArea, currentArea);

        // Move the pointer at the shorter line inward
        // This might find a taller line for better area
        if (height[left] < height[right]) {
            left++;  // Left line is shorter, try next line
        } else {
            right--;  // Right line is shorter or equal, try previous line
        }
    }

    return maxArea;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We start with `left = 0` and `right = n-1`
- Each iteration moves one pointer inward by 1
- Maximum of n-1 iterations before pointers meet
- Each iteration does O(1) work (calculations and comparisons)

**Space Complexity: O(1)**

- We only use a few integer variables (`left`, `right`, `max_area`, `current_area`)
- No additional data structures that scale with input size
- Memory usage is constant regardless of input size

## Common Mistakes

1. **Moving the taller pointer instead of the shorter one**
   - **Mistake**: Some candidates move the pointer at random or always move both pointers
   - **Why it's wrong**: Moving the taller line guarantees width decreases without guaranteeing height increases
   - **Fix**: Always move the pointer at the shorter line — it's the limiting factor

2. **Forgetting to handle empty or single-element arrays**
   - **Mistake**: Not checking if `len(height) < 2`
   - **Why it's wrong**: With 0 or 1 lines, you can't form a container
   - **Fix**: Add early return: `if len(height) < 2: return 0`

3. **Incorrect area calculation**
   - **Mistake**: Using `max(height[left], height[right])` instead of `min()`
   - **Why it's wrong**: Water would spill over the shorter side
   - **Fix**: Remember containers are limited by the shorter wall

4. **Off-by-one errors in pointer movement**
   - \*\*Mistake`: Using `<=`instead of`<` in the while condition
   - **Why it's wrong**: When `left == right`, you don't have two distinct lines
   - **Fix**: Condition should be `while left < right`

## When You'll See This Pattern

The two-pointer technique used here appears in many array problems:

1. **Trapping Rain Water (Hard)** - Similar container concept but with multiple walls trapping water between them. Uses two pointers to track left and right maxima while calculating trapped water at each position.

2. **Two Sum II - Input Array Is Sorted (Medium)** - Uses two pointers starting at ends, moving inward based on whether the sum is too small or too large.

3. **3Sum (Medium)** - Extends the two-pointer approach to three pointers, often sorting first then using an outer loop with inner two-pointer scan.

4. **Valid Palindrome (Easy)** - Two pointers moving inward from both ends, comparing characters until they meet.

The pattern is recognizable when:

- You need to find a pair of elements satisfying some condition
- The array can be processed from both ends
- There's a monotonic property (like sortedness or height comparisons) that guides pointer movement

## Key Takeaways

1. **Two-pointer technique is powerful for array problems** - When you need to compare pairs of elements, starting from both ends and moving inward can often achieve O(n) time instead of O(n²).

2. **Greedy moves can be proven optimal** - The insight that moving the shorter line is always correct comes from understanding that any other move cannot yield a better solution. This is a common pattern: make locally optimal choices that lead to globally optimal solutions.

3. **Visualization helps build intuition** - Drawing the lines and containers makes it clear why the area formula works and why moving the shorter line is the right strategy. Always sketch a small example during interviews.

4. **Edge cases matter** - Always consider minimum input size (0, 1, 2 elements) and verify your solution handles them correctly.

Related problems: [Trapping Rain Water](/problem/trapping-rain-water), [Maximum Tastiness of Candy Basket](/problem/maximum-tastiness-of-candy-basket), [House Robber IV](/problem/house-robber-iv)
