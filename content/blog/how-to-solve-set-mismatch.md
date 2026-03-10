---
title: "How to Solve Set Mismatch — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Set Mismatch. Easy difficulty, 44.2% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Sorting."
date: "2027-01-19"
category: "dsa-patterns"
tags: ["set-mismatch", "array", "hash-table", "bit-manipulation", "easy"]
---

# How to Solve Set Mismatch

You're given an array where one number from 1 to n appears twice, and another number from 1 to n is missing. Your task is to find both the duplicate and the missing number. What makes this problem interesting is that it looks simple but has multiple solution approaches with different trade-offs, and it's a great example of how to use array indices as a natural hash table.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 2, 4]` where `n = 4`.

The original set should be `[1, 2, 3, 4]`, but we have:

- `1` appears once ✓
- `2` appears twice (duplicate!)
- `3` is missing
- `4` appears once ✓

So the duplicate is `2` and the missing is `3`. Our output should be `[2, 3]`.

Think about how we might find these:

1. **Counting approach**: We could count how many times each number appears
2. **Mathematical approach**: Use sum formulas to find what's off
3. **Index marking approach**: Use the array itself to track what we've seen

Let's try the index marking approach visually:

- Start with `[1, 2, 2, 4]`
- For each number, mark that we've seen it by making the value at position `(number - 1)` negative
- When we encounter a number that's already marked negative, we found our duplicate
- Finally, scan for any positive value - that index + 1 is our missing number

Step-by-step:

1. `nums[0] = 1` → mark index `0` (1-1): `[-1, 2, 2, 4]`
2. `nums[1] = 2` → mark index `1` (2-1): `[-1, -2, 2, 4]`
3. `nums[2] = 2` → check index `1`: it's already negative (-2), so `2` is our duplicate!
4. `nums[3] = 4` → mark index `3` (4-1): `[-1, -2, 2, -4]`
5. Scan for positive: index `2` is positive → missing number is `2 + 1 = 3`

## Brute Force Approach

The most straightforward approach is to count occurrences of each number:

1. Create a count array of size `n+1` initialized to 0
2. For each number in the input, increment its count
3. Scan the count array: the number with count 2 is the duplicate, the number with count 0 is the missing

This works, but uses O(n) extra space. A candidate might also try sorting first (O(n log n) time) or nested loops to find the duplicate (O(n²) time). While these would technically work, they're not optimal.

The brute force with counting array:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findErrorNums(nums):
    n = len(nums)
    count = [0] * (n + 1)

    # Count occurrences of each number
    for num in nums:
        count[num] += 1

    duplicate = missing = 0
    # Find duplicate (count = 2) and missing (count = 0)
    for i in range(1, n + 1):
        if count[i] == 2:
            duplicate = i
        elif count[i] == 0:
            missing = i

    return [duplicate, missing]
```

```javascript
// Time: O(n) | Space: O(n)
function findErrorNums(nums) {
  const n = nums.length;
  const count = new Array(n + 1).fill(0);

  // Count occurrences of each number
  for (const num of nums) {
    count[num]++;
  }

  let duplicate = 0,
    missing = 0;
  // Find duplicate (count = 2) and missing (count = 0)
  for (let i = 1; i <= n; i++) {
    if (count[i] === 2) {
      duplicate = i;
    } else if (count[i] === 0) {
      missing = i;
    }
  }

  return [duplicate, missing];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] findErrorNums(int[] nums) {
    int n = nums.length;
    int[] count = new int[n + 1];

    // Count occurrences of each number
    for (int num : nums) {
        count[num]++;
    }

    int duplicate = 0, missing = 0;
    // Find duplicate (count = 2) and missing (count = 0)
    for (int i = 1; i <= n; i++) {
        if (count[i] == 2) {
            duplicate = i;
        } else if (count[i] == 0) {
            missing = i;
        }
    }

    return new int[]{duplicate, missing};
}
```

</div>

This solution is O(n) time and O(n) space. It's actually not bad, but we can do better with O(1) extra space.

## Optimal Solution

The optimal solution uses the array itself as a hash table by marking visited numbers. Here's the intuition:

1. Since numbers are in range 1..n, we can use the array indices 0..n-1 to represent numbers 1..n
2. For each number `num`, we look at index `abs(num) - 1`
3. If the value at that index is positive, we mark it as visited by making it negative
4. If it's already negative, we've found our duplicate
5. After processing all numbers, any index with a positive value means that number (index + 1) was never visited, so it's missing

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - modifies input in place
def findErrorNums(nums):
    duplicate = missing = 0

    # First pass: find duplicate using negative marking
    for num in nums:
        # Get the index for this number (convert to 0-based)
        idx = abs(num) - 1

        # If the value at this index is already negative,
        # we've seen this number before - it's our duplicate
        if nums[idx] < 0:
            duplicate = abs(num)
        else:
            # Mark this number as seen by making it negative
            nums[idx] = -nums[idx]

    # Second pass: find missing number
    # The missing number's index will still have a positive value
    for i in range(len(nums)):
        if nums[i] > 0:
            # Convert back to 1-based number
            missing = i + 1
            break

    return [duplicate, missing]
```

```javascript
// Time: O(n) | Space: O(1) - modifies input in place
function findErrorNums(nums) {
  let duplicate = 0,
    missing = 0;

  // First pass: find duplicate using negative marking
  for (const num of nums) {
    // Get the index for this number (convert to 0-based)
    const idx = Math.abs(num) - 1;

    // If the value at this index is already negative,
    // we've seen this number before - it's our duplicate
    if (nums[idx] < 0) {
      duplicate = Math.abs(num);
    } else {
      // Mark this number as seen by making it negative
      nums[idx] = -nums[idx];
    }
  }

  // Second pass: find missing number
  // The missing number's index will still have a positive value
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      // Convert back to 1-based number
      missing = i + 1;
      break;
    }
  }

  return [duplicate, missing];
}
```

```java
// Time: O(n) | Space: O(1) - modifies input in place
public int[] findErrorNums(int[] nums) {
    int duplicate = 0, missing = 0;

    // First pass: find duplicate using negative marking
    for (int num : nums) {
        // Get the index for this number (convert to 0-based)
        int idx = Math.abs(num) - 1;

        // If the value at this index is already negative,
        // we've seen this number before - it's our duplicate
        if (nums[idx] < 0) {
            duplicate = Math.abs(num);
        } else {
            // Mark this number as seen by making it negative
            nums[idx] = -nums[idx];
        }
    }

    // Second pass: find missing number
    // The missing number's index will still have a positive value
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            // Convert back to 1-based number
            missing = i + 1;
            break;
        }
    }

    return new int[]{duplicate, missing};
}
```

</div>

**Why this works:** We're using the array indices as a natural hash table. Since all numbers are positive (1..n), we can use the sign bit as a "visited" flag. The key insight is that `nums[i]` gives us information about whether we've seen the number `i+1`.

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one to find the duplicate, one to find the missing
- Each pass does O(1) work per element
- Total: O(2n) = O(n)

**Space Complexity:** O(1) extra space

- We modify the input array in place
- Only use a few variables (duplicate, missing, index)
- If we can't modify input, we'd need O(n) space for a separate tracking array

## Common Mistakes

1. **Off-by-one errors with indices**: Remember that number `k` corresponds to index `k-1`. A common mistake is using `nums[num]` instead of `nums[num-1]`. Always test with small examples.

2. **Forgetting to use absolute value**: When we mark numbers negative, subsequent accesses need `abs(num)` to get the original number. If you use `num` directly after modification, you'll get negative indices.

3. **Not handling the duplicate correctly in the second pass**: After finding the duplicate, some candidates continue to mark it negative. This is fine, but remember that the duplicate's index will be negative (because we saw that number), not positive.

4. **Assuming input can be modified**: In some interview settings, you might need to preserve the input. Always ask if you can modify the input array. If not, use the counting array approach.

## When You'll See This Pattern

The "use array indices as hash table" pattern appears in several problems where:

1. Numbers are in a known range (usually 1..n or 0..n-1)
2. You need to track which numbers have been seen
3. You want O(1) space by reusing the input array

Related problems:

- **Find All Duplicates in an Array** (LeetCode 442): Exactly the same pattern - mark visited numbers as negative
- **Find All Numbers Disappeared in an Array** (LeetCode 448): Similar pattern, find all missing numbers
- **First Missing Positive** (LeetCode 41): More complex variant where numbers aren't necessarily in range

## Key Takeaways

1. **When numbers are in range 1..n, consider using indices as a natural hash table**. The mapping is simple: number `k` → index `k-1`.

2. **Use the sign bit as a free boolean flag** when you know all numbers are positive. This gives you O(1) space tracking.

3. **Always test edge cases**: What if the duplicate is at the beginning? End? What if n=1? What if the array is already modified (contains negatives)?

Remember: The optimal solution isn't always the first one you think of. The counting array solution (O(n) space) is perfectly acceptable in many interviews and shows good problem-solving. The O(1) space solution demonstrates deeper insight into the problem constraints.

Related problems: [Find the Duplicate Number](/problem/find-the-duplicate-number)
