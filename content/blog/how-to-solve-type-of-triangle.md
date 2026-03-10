---
title: "How to Solve Type of Triangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Type of Triangle. Easy difficulty, 44.1% acceptance rate. Topics: Array, Math, Sorting."
date: "2028-08-18"
category: "dsa-patterns"
tags: ["type-of-triangle", "array", "math", "sorting", "easy"]
---

# How to Solve Type of Triangle

You're given an array of exactly three integers representing triangle side lengths. Your task is to determine whether they form an equilateral, isosceles, or scalene triangle, or if they don't form a valid triangle at all. While this seems straightforward, the challenge lies in correctly implementing the triangle inequality theorem and handling all edge cases properly.

## Visual Walkthrough

Let's walk through an example: `nums = [3, 4, 5]`

**Step 1: Check if it's a valid triangle**
The triangle inequality theorem states that for three sides a, b, c to form a triangle:

- a + b > c
- a + c > b
- b + c > a

For `[3, 4, 5]`:

- 3 + 4 = 7 > 5 ✓
- 3 + 5 = 8 > 4 ✓
- 4 + 5 = 9 > 3 ✓

All conditions pass, so it's a valid triangle.

**Step 2: Determine the triangle type**
Now we check side equalities:

- Are all three sides equal? 3 ≠ 4 ≠ 5 → Not equilateral
- Are exactly two sides equal? 3 ≠ 4, 3 ≠ 5, 4 ≠ 5 → Not isosceles
- All sides are different → It's scalene

So `[3, 4, 5]` forms a scalene triangle.

Let's try another: `nums = [5, 5, 5]`

- Triangle check: 5 + 5 = 10 > 5 ✓ (all three checks pass)
- All sides equal → Equilateral

One more: `nums = [1, 2, 3]`

- Triangle check: 1 + 2 = 3, which is NOT > 3
- This fails the triangle inequality → Return "none"

## Brute Force Approach

For this problem, there's really only one logical approach since we're dealing with exactly three numbers. However, a "brute force" way to think about it would be to manually check all possible combinations:

1. First check if it's a triangle by verifying all three triangle inequalities
2. Then check all possible equalities between sides

The challenge isn't algorithmic complexity (we only have 3 numbers), but rather correctly implementing the logic and handling edge cases. A naive implementation might:

- Forget to check all three triangle inequalities
- Check equality conditions in the wrong order
- Not handle cases where sides don't form a triangle

Since we only have three numbers, any reasonable implementation will be O(1) time and space. The "optimization" here is about writing clean, correct code rather than improving time complexity.

## Optimal Solution

The optimal approach follows this logical flow:

1. **Sort the sides** to make triangle inequality checking simpler
2. **Check triangle validity** using the sorted sides
3. **Determine triangle type** by comparing side lengths

When sorted as `a ≤ b ≤ c`, the triangle inequality simplifies to just checking `a + b > c`. If the two smallest sides sum to more than the largest side, the other two inequalities (`a + c > b` and `b + c > a`) are automatically satisfied.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# We only have 3 elements, so sorting is constant time
def triangleType(nums):
    # Step 1: Sort the sides to make comparisons easier
    # After sorting: a <= b <= c
    a, b, c = sorted(nums)

    # Step 2: Check if it's a valid triangle using triangle inequality
    # In sorted order, we only need to check a + b > c
    # If the two smallest sides can't exceed the largest, it's not a triangle
    if a + b <= c:
        return "none"

    # Step 3: Check for equilateral triangle (all sides equal)
    # Since the array is sorted, all sides equal means first == last
    if a == c:
        return "equilateral"

    # Step 4: Check for isosceles triangle (exactly two sides equal)
    # Three possible equal pairs in sorted array: a==b, b==c, or a==c
    # We already handled a==c case above, so check remaining two
    if a == b or b == c:
        return "isosceles"

    # Step 5: If none of the above, it must be scalene (all sides different)
    return "scalene"
```

```javascript
// Time: O(1) | Space: O(1)
// Sorting 3 elements is constant time operation
function triangleType(nums) {
  // Step 1: Sort the sides in ascending order
  // Create a copy to avoid modifying the original array
  const sorted = [...nums].sort((x, y) => x - y);
  const [a, b, c] = sorted;

  // Step 2: Check triangle validity using sorted sides
  // With a <= b <= c, we only need to check a + b > c
  if (a + b <= c) {
    return "none";
  }

  // Step 3: Check for equilateral (all sides equal)
  // In sorted array, all equal means first == last
  if (a === c) {
    return "equilateral";
  }

  // Step 4: Check for isosceles (exactly two sides equal)
  // Possible equal pairs: a==b or b==c (a==c handled above)
  if (a === b || b === c) {
    return "isosceles";
  }

  // Step 5: Remaining case is scalene (all sides different)
  return "scalene";
}
```

```java
// Time: O(1) | Space: O(1)
// Sorting 3 elements takes constant time
class Solution {
    public String triangleType(int[] nums) {
        // Step 1: Sort the array to get sides in ascending order
        // We'll use Arrays.sort which is efficient for small arrays
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        int a = sorted[0], b = sorted[1], c = sorted[2];

        // Step 2: Validate triangle using sorted sides
        // With a <= b <= c, triangle inequality simplifies to a + b > c
        if (a + b <= c) {
            return "none";
        }

        // Step 3: Check for equilateral triangle
        // All sides equal means smallest == largest in sorted array
        if (a == c) {
            return "equilateral";
        }

        // Step 4: Check for isosceles triangle
        // Two equal sides could be a==b or b==c (a==c handled above)
        if (a == b || b == c) {
            return "isosceles";
        }

        // Step 5: Only remaining possibility is scalene
        return "scalene";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We only have exactly 3 elements in the input array
- Sorting 3 elements takes constant time (fixed number of comparisons)
- All subsequent comparisons and checks are also constant time operations

**Space Complexity: O(1)**

- We use a constant amount of extra space regardless of input size
- In Python/JavaScript, we create a sorted copy, but it's only 3 elements
- In Java, we clone the array, but again it's only 3 elements
- No data structures that grow with input size

The constant factors are so small that any implementation will be extremely fast. The real challenge is correctness, not performance.

## Common Mistakes

1. **Incorrect triangle inequality check**: The most common mistake is not checking all three inequalities or checking them incorrectly. Remember: for sides a, b, c to form a triangle, ALL of these must be true: a + b > c, a + c > b, and b + c > a. With sorted sides, this simplifies to just checking a + b > c.

2. **Wrong order of type checks**: If you check for isosceles before equilateral, `[5, 5, 5]` would incorrectly return "isosceles" instead of "equilateral". Always check for the most specific case (equilateral) first, then isosceles, then scalene.

3. **Forgetting to handle the "none" case**: Some candidates jump straight to checking triangle types without first verifying that the sides can actually form a triangle. Always validate the triangle first!

4. **Modifying the input array**: In languages where arrays are passed by reference, sorting the input array directly might have unintended side effects. It's better to create a copy first, especially in interview settings where the interviewer might be checking for this awareness.

## When You'll See This Pattern

This problem teaches several important patterns that appear in other coding problems:

1. **Sorting to simplify comparisons**: Many problems become easier when data is sorted. Similar patterns appear in:
   - **Two Sum** (sorting allows two-pointer approach)
   - **Merge Intervals** (sorting by start time simplifies merging)
   - **Meeting Rooms** (sorting helps find overlaps)

2. **Condition checking with precedence**: The pattern of checking specific cases before general ones (equilateral → isosceles → scalene) appears in:
   - **Valid Parentheses** (checking matching pairs in correct order)
   - **Roman to Integer** (checking subtraction cases before addition)

3. **Mathematical constraint validation**: Validating constraints (like triangle inequality) appears in:
   - **Valid Triangle Number** (counting valid triangles in an array)
   - **Container With Most Water** (validating height constraints)

## Key Takeaways

1. **Sorting transforms problems**: When dealing with comparisons or finding relationships between elements, sorting often reveals patterns or simplifies logic. Here, sorting turned three triangle inequality checks into one.

2. **Check specific cases first**: When classifying items into categories with hierarchy (like triangle types), always check the most specific/restrictive cases first to avoid misclassification.

3. **Mathematical properties simplify code**: Understanding the underlying mathematics (triangle inequality theorem) allowed us to optimize from three checks to one. Always look for mathematical insights that can simplify your implementation.

[Practice this problem on CodeJeet](/problem/type-of-triangle)
