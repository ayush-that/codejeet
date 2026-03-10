---
title: "How to Solve Minimum Deletions to Make Array Beautiful — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Deletions to Make Array Beautiful. Medium difficulty, 49.8% acceptance rate. Topics: Array, Stack, Greedy."
date: "2028-11-24"
category: "dsa-patterns"
tags: ["minimum-deletions-to-make-array-beautiful", "array", "stack", "greedy", "medium"]
---

# How to Solve Minimum Deletions to Make Array Beautiful

This problem asks us to make an array "beautiful" by deleting elements. An array is beautiful if it has an even length and every even-indexed element (0, 2, 4, ...) differs from its immediate neighbor. What makes this problem interesting is that we can't simply check adjacent pairs—deletions shift indices, so we need to think about building the beautiful array incrementally rather than fixing it in place.

## Visual Walkthrough

Let's trace through `nums = [1, 1, 2, 3, 5]` step by step:

We want to build a beautiful array by keeping elements. Since we can only delete, we'll think about which elements to keep.

**Step 1:** Start with first element `1` at index 0. This will be position 0 in our beautiful array.

**Step 2:** Look at next element `1` at index 1. For position 1 in beautiful array, we need `nums[i] != nums[i+1]` where `i` is even. Our current last kept element is `1` at even position 0, so the next element must NOT equal `1`. But `1 == 1`, so we delete this element.

**Step 3:** Move to `2` at index 2. Can we keep this? Yes, because `1 != 2`. Now we have `[1, 2]` with `1` at even position 0 and `2` at odd position 1.

**Step 4:** Look at `3` at index 3. Now `2` is at even position? Wait—after keeping `2`, our beautiful array has `1` (even index 0) and `2` (odd index 1). The next element will be at even position 2, so we need it to differ from the element at position 3 (which doesn't exist yet). Actually, the rule only applies to pairs: for every even index `i`, `nums[i] != nums[i+1]`. So when we add `3` at even position 2, we need to ensure it differs from whatever comes next at position 3.

**Step 5:** Look ahead to `5` at index 4. If we keep `3` and then `5`, we have `3 != 5`, so that's valid. Final beautiful array: `[1, 2, 3, 5]`.

We deleted 1 element. But wait—is the length even? `[1, 2, 3, 5]` has length 4, which is even. Good.

The key insight: we can process the array left to right, building our beautiful array, and whenever we would violate the condition, we delete the current element.

## Brute Force Approach

A naive approach might try all subsets of the array, checking if each is beautiful. For each of the 2^n subsets, we'd need to verify:

1. Length is even
2. For all even indices i, nums[i] != nums[i+1]

This is O(2^n \* n), which is impossibly slow for n up to 10^5.

Another brute force might try deleting elements one by one and checking the result, but with deletions shifting indices, this becomes complex. A candidate might try to fix pairs: check (0,1), if bad delete one, then check (2,3), etc. But this fails because deletions change which elements become paired.

For example, with `[1, 1, 1, 1]`:

- Check (0,1): both 1, delete one → `[1, 1, 1]`
- Now pairs are (0,1) again, not (2,3) as we might expect

The brute force teaches us that we need a systematic way to build the result that accounts for index shifts.

## Optimized Approach

The key insight is **greedy construction**: process the array left to right, building our beautiful array incrementally. We don't need to actually delete elements—we just need to count how many we would delete.

Here's the reasoning:

1. We'll build a new array (conceptually) by iterating through `nums`.
2. We always keep the first element (index 0 of the beautiful array).
3. For each subsequent element in `nums`:
   - If we have an even number of elements kept so far, the next kept element will be at an odd index in the beautiful array. The condition doesn't constrain this (it only constrains even indices), so we can keep it regardless of value.
   - If we have an odd number of elements kept, the next kept element will be at an even index. Now the condition applies: this new element must differ from the last kept element (which is at the previous odd index).
4. If we can't keep an element (violates the condition), we skip/delete it.
5. At the end, if we have an odd number of elements, we need to delete one more to make the length even.

Why does this greedy approach work? Because decisions are local: keeping an element only affects the next decision, not future ones. If we keep an element when we shouldn't, we might force more deletions later. But if we delete it when we could have kept it, we might need extra deletions to reach even length. The greedy rule minimizes deletions.

## Optimal Solution

We implement the greedy approach with a simple counter for kept elements and check conditions as we go.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minDeletion(nums):
    """
    Returns minimum deletions to make array beautiful.
    Beautiful array: even length and nums[i] != nums[i+1] for all even i.
    """
    deletions = 0
    n = len(nums)

    i = 0
    while i < n:
        # Find the next element to keep after current position i
        j = i + 1
        # Skip elements that would violate the beautiful condition
        # We're at an even index in the beautiful array, so next kept element
        # must be different from current
        while j < n and nums[j] == nums[i]:
            deletions += 1  # Delete this element
            j += 1

        # Now nums[j] is different from nums[i] or j == n
        if j == n:
            # No valid next element found
            # We have an odd number of elements in beautiful array
            # Need to delete the last element (nums[i])
            deletions += 1
            break
        else:
            # Found valid pair (nums[i], nums[j])
            # Move i to position after j to find next pair
            i = j + 1

    return deletions
```

```javascript
// Time: O(n) | Space: O(1)
function minDeletion(nums) {
  /**
   * Returns minimum deletions to make array beautiful.
   * Beautiful array: even length and nums[i] != nums[i+1] for all even i.
   */
  let deletions = 0;
  const n = nums.length;

  let i = 0;
  while (i < n) {
    // Find the next element to keep after current position i
    let j = i + 1;
    // Skip elements that would violate the beautiful condition
    // We're at an even index in the beautiful array, so next kept element
    // must be different from current
    while (j < n && nums[j] === nums[i]) {
      deletions++; // Delete this element
      j++;
    }

    // Now nums[j] is different from nums[i] or j === n
    if (j === n) {
      // No valid next element found
      // We have an odd number of elements in beautiful array
      // Need to delete the last element (nums[i])
      deletions++;
      break;
    } else {
      // Found valid pair (nums[i], nums[j])
      // Move i to position after j to find next pair
      i = j + 1;
    }
  }

  return deletions;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minDeletion(int[] nums) {
        /**
         * Returns minimum deletions to make array beautiful.
         * Beautiful array: even length and nums[i] != nums[i+1] for all even i.
         */
        int deletions = 0;
        int n = nums.length;

        int i = 0;
        while (i < n) {
            // Find the next element to keep after current position i
            int j = i + 1;
            // Skip elements that would violate the beautiful condition
            // We're at an even index in the beautiful array, so next kept element
            // must be different from current
            while (j < n && nums[j] == nums[i]) {
                deletions++;  // Delete this element
                j++;
            }

            // Now nums[j] is different from nums[i] or j == n
            if (j == n) {
                // No valid next element found
                // We have an odd number of elements in beautiful array
                // Need to delete the last element (nums[i])
                deletions++;
                break;
            } else {
                // Found valid pair (nums[i], nums[j])
                // Move i to position after j to find next pair
                i = j + 1;
            }
        }

        return deletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of `nums`. We traverse the array once, and the inner while loop doesn't cause O(n²) because each element is visited at most once—when we skip elements with `j++`, we're advancing through the array, not restarting.

**Space Complexity:** O(1). We only use a few integer variables for counting and indexing, regardless of input size.

## Common Mistakes

1. **Not handling the odd-length final array**: After processing all elements, if we have an odd number of kept elements, we need one more deletion. Candidates often forget this, especially when the last few elements are equal.

2. **Incorrect index management in the inner loop**: The condition should be `while (j < n && nums[j] == nums[i])`, not `nums[j] == nums[j-1]`. We're comparing with the last kept element (`nums[i]`), not with the immediate predecessor in the original array.

3. **Off-by-one in pair formation**: After finding a valid pair `(i, j)`, we should set `i = j + 1`, not `i = j` or `i = i + 2`. The next pair starts after `j`.

4. **Using extra O(n) space unnecessarily**: Some candidates build the actual beautiful array, which uses O(n) space. We only need the count of deletions, so we can do this in O(1) space.

## When You'll See This Pattern

This greedy construction pattern appears in many array transformation problems:

1. **Minimum Deletions to Make Character Frequencies Unique**: Similar greedy approach—process frequencies in descending order, reducing counts until all are unique.

2. **Minimum Operations to Make the Array Alternating**: Also involves making adjacent elements different, though with more constraints.

3. **Remove All Adjacent Duplicates In String**: While not identical, it uses similar sequential processing with look-back at the last kept element.

The core pattern is: when you need to transform a sequence to meet pairwise constraints, process elements sequentially, maintaining the "current state" of your constructed sequence, and make local decisions that don't invalidate future choices.

## Key Takeaways

1. **Greedy construction works for local constraints**: When a condition only relates adjacent elements in the final sequence, you can build the result incrementally with a greedy approach.

2. **Think in terms of what you keep, not what you delete**: Instead of deciding which elements to remove, decide which to include in your beautiful array. This mental shift simplifies many deletion problems.

3. **The even-length requirement often means checking parity at the end**: After building your sequence, if it has odd length, you'll need one more deletion. This is a common pattern in "make length even" problems.

Related problems: [Minimum Deletions to Make Character Frequencies Unique](/problem/minimum-deletions-to-make-character-frequencies-unique), [Minimum Operations to Make the Array Alternating](/problem/minimum-operations-to-make-the-array-alternating)
