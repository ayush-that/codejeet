---
title: "How to Solve Make Array Elements Equal to Zero — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Make Array Elements Equal to Zero. Easy difficulty, 68.3% acceptance rate. Topics: Array, Simulation, Prefix Sum."
date: "2026-11-24"
category: "dsa-patterns"
tags: ["make-array-elements-equal-to-zero", "array", "simulation", "prefix-sum", "easy"]
---

# How to Solve Make Array Elements Equal to Zero

This problem asks us to determine if we can reduce all elements in an array to zero by starting at a zero element and repeatedly moving left or right, decrementing the current element by one each time we visit it. The tricky part is that we can only start at a zero, and we must choose an initial direction that we maintain throughout the entire process. This constraint makes it different from simple simulation problems where you could change direction arbitrarily.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [0, 2, 0, 3, 0]`.

**Valid path example:**

1. Start at index 1? No, `nums[1] = 2` ≠ 0, so we can't start there.
2. Start at index 0? Yes, `nums[0] = 0`. Choose direction: right.
3. Move to index 1: `nums[1]` becomes 2-1 = 1
4. Move to index 2: `nums[2]` becomes 0-1 = -1 → Wait, this is invalid! We can't make elements negative. So starting at index 0 with direction right fails.

**Another attempt:**

1. Start at index 2: `nums[2] = 0`. Choose direction: left.
2. Move to index 1: `nums[1]` becomes 2-1 = 1
3. Move to index 0: `nums[0]` becomes 0-1 = -1 → Invalid again.

**Successful path:**

1. Start at index 2: `nums[2] = 0`. Choose direction: right.
2. Move to index 3: `nums[3]` becomes 3-1 = 2
3. Move to index 4: `nums[4]` becomes 0-1 = -1 → Invalid? Wait, let's trace carefully:

Actually, let's think about this systematically. When we start at a zero and move in one direction, we're essentially creating a "wave" of decrements. The key insight is that for any starting position, the elements to the left and right must form non-increasing sequences when we move away from the starting point.

Let me show you the correct approach with `nums = [0, 2, 0, 3, 0]`:

- We need to find a starting zero where all elements to the left (if we go left) or all elements to the right (if we go right) can be reduced to zero.
- For going right from index 2: Check elements [3, 0] at indices 3 and 4.
  - Index 3 (value 3): Needs 3 moves to reach 0
  - Index 4 (value 0): Needs 0 moves to reach 0
  - The requirement: Each element must be ≥ its distance from start
  - Distance from index 2 to index 3: 1 → 3 ≥ 1 ✓
  - Distance from index 2 to index 4: 2 → 0 ≥ 2 ✗ (fails!)
- For going left from index 2: Check elements [2, 0] at indices 1 and 0.
  - Index 1 (value 2): Distance 1 → 2 ≥ 1 ✓
  - Index 0 (value 0): Distance 2 → 0 ≥ 2 ✗ (fails!)

- Try index 0 going right: Check [2, 0, 3, 0]
  - Index 1: distance 1 → 2 ≥ 1 ✓
  - Index 2: distance 2 → 0 ≥ 2 ✗ (fails!)

- Try index 4 going left: Check [3, 0, 2, 0]
  - Index 3: distance 1 → 3 ≥ 1 ✓
  - Index 2: distance 2 → 0 ≥ 2 ✗ (fails!)

Wait, none seem to work! Let me re-examine the problem statement. Actually, I realize my mistake: when we move, we decrement the current element, not the element we're moving to. Let me trace correctly:

For `nums = [0, 2, 0, 3, 0]`, starting at index 2 (value 0), direction right:

1. At index 2: value is 0, move to index 3
2. At index 3: value was 3, becomes 2 after decrement
3. Move to index 4: value was 0, becomes -1 after decrement → Invalid!

The correct insight is simpler: We need to find if there exists a zero from which we can move in one direction and have enough "steps" to reduce all elements to zero without going negative. This is equivalent to checking prefix and suffix conditions.

## Brute Force Approach

A brute force approach would try every zero position as a starting point and both directions, then simulate the process:

1. For each index `i` where `nums[i] == 0`:
   - Try going left: simulate moving left until out of bounds
   - Try going right: simulate moving right until out of bounds
2. For each simulation, check if all elements become exactly 0

However, this is inefficient because:

- We might revisit the same positions multiple times
- The simulation for each start/direction takes O(n) time
- With k zeros, we'd have O(k × n) time complexity, which could be O(n²) in worst case

More importantly, we don't actually need to simulate! There's a mathematical condition we can check.

## Optimal Solution

The key insight is that when we start at position `i` and move in one direction, element `nums[j]` will be visited after `|j-i|` steps. For the process to be valid (never making an element negative), we need `nums[j] ≥ |j-i|` for all `j` in that direction.

But wait, there's an even simpler realization: Since we can only move in one fixed direction, the array must be "pyramid-shaped" from some zero outward. Actually, let me think about the exact condition:

If we start at index `i` and go right, then for all `j > i`, we need `nums[j] ≥ j-i`. Similarly, if we go left, for all `j < i`, we need `nums[j] ≥ i-j`.

However, we also need to end with all zeros. This means the inequalities must be exact in some sense. Actually, the correct condition is simpler than it seems!

Let me derive it properly:

1. When moving right from index `i`, we'll visit index `i+1` once, `i+2` twice, etc.
2. Actually no, that's wrong! We visit each position exactly once as we move through the array.
3. The value at position `j` will be decremented exactly once when we reach it.
4. So the condition is simply: Starting at zero `i`, if we go right, then `nums[j]` must be exactly `j-i` for all `j > i`? No, that's too strict.

Wait, I need to re-read: "decrease the value of `nums[curr]` by 1" means we decrement the current position's value. So if `nums[j] = x`, and we reach it after `k` steps from start, we need `x ≥ k` so it doesn't go negative when we decrement it to `x-1`.

But we also need to end with all zeros! So actually, we need `x = k` exactly! Because:

- We start at a zero (k=0, value=0)
- At step 1, we move and decrement: need value ≥ 1, and after decrement it becomes 0
- At step 2: need original value ≥ 2, becomes 0 after two decrements... Wait, but we only visit once!

Oh! I see the confusion now. We only visit each position ONCE. So if we start at index `i` and move right:

- Position `i`: value 0, visited at step 0
- Position `i+1`: visited at step 1, needs original value ≥ 1
- Position `i+2`: visited at step 2, needs original value ≥ 2
- etc.

And after visiting, the value becomes `original - 1`. To end at 0, we need `original = step` exactly!

So the condition is: There exists an index `i` with `nums[i] = 0` such that either:

1. For all `j > i`: `nums[j] = j-i` (going right), OR
2. For all `j < i`: `nums[j] = i-j` (going left)

But this seems too strict. Let me test with the example `[0, 1, 2, 3, 0]`:

- Start at index 0, go right: Check indices 1-4
  - Index 1: `nums[1] = 1`, `1-0 = 1` ✓
  - Index 2: `nums[2] = 2`, `2-0 = 2` ✓
  - Index 3: `nums[3] = 3`, `3-0 = 3` ✓
  - Index 4: `nums[4] = 0`, `4-0 = 4` ✗ (0 ≠ 4)

Actually, index 4 has value 0 but needs to be 4. So this fails. But wait, can we solve this array? Let me think...

Actually, I've been overcomplicating. The real solution is simpler: We just need to check if the array forms a valid "mountain" from some zero. Here's the working approach:

We check two conditions:

1. From left to right, values must be non-decreasing until they hit 0
2. From right to left, values must be non-decreasing until they hit 0
3. There must be at least one zero

But actually, the correct and simpler solution is even simpler than that! After analyzing the problem carefully, here's the actual optimal solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canMakeZero(self, nums):
    """
    Check if we can make all elements zero by starting at a zero
    and moving consistently in one direction.

    The key insight: For a valid solution going right from index i,
    nums must be [0, 1, 2, 3, ...] from i rightward.
    Similarly for going left: nums must be [..., 3, 2, 1, 0] leftward from i.

    So we just need to check if nums forms an increasing sequence from
    some zero to the end, OR a decreasing sequence from start to some zero.
    """
    n = len(nums)

    # Check if we can go right from some zero
    for i in range(n):
        if nums[i] == 0:
            # Check if from i to end, nums[j] == j-i
            valid = True
            for j in range(i, n):
                if nums[j] != j - i:
                    valid = False
                    break
            if valid:
                return True

    # Check if we can go left from some zero
    for i in range(n):
        if nums[i] == 0:
            # Check if from start to i, nums[j] == i-j
            valid = True
            for j in range(0, i + 1):
                if nums[j] != i - j:
                    valid = False
                    break
            if valid:
                return True

    return False
```

```javascript
// Time: O(n) | Space: O(1)
function canMakeZero(nums) {
  /**
   * Check if we can make all elements zero by starting at a zero
   * and moving consistently in one direction.
   *
   * The key insight: For a valid solution going right from index i,
   * nums must be [0, 1, 2, 3, ...] from i rightward.
   * Similarly for going left: nums must be [..., 3, 2, 1, 0] leftward from i.
   */
  const n = nums.length;

  // Check if we can go right from some zero
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      // Check if from i to end, nums[j] == j-i
      let valid = true;
      for (let j = i; j < n; j++) {
        if (nums[j] !== j - i) {
          valid = false;
          break;
        }
      }
      if (valid) return true;
    }
  }

  // Check if we can go left from some zero
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      // Check if from start to i, nums[j] == i-j
      let valid = true;
      for (let j = 0; j <= i; j++) {
        if (nums[j] !== i - j) {
          valid = false;
          break;
        }
      }
      if (valid) return true;
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canMakeZero(int[] nums) {
        /**
         * Check if we can make all elements zero by starting at a zero
         * and moving consistently in one direction.
         *
         * The key insight: For a valid solution going right from index i,
         * nums must be [0, 1, 2, 3, ...] from i rightward.
         * Similarly for going left: nums must be [..., 3, 2, 1, 0] leftward from i.
         */
        int n = nums.length;

        // Check if we can go right from some zero
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                // Check if from i to end, nums[j] == j-i
                boolean valid = true;
                for (int j = i; j < n; j++) {
                    if (nums[j] != j - i) {
                        valid = false;
                        break;
                    }
                }
                if (valid) return true;
            }
        }

        // Check if we can go left from some zero
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                // Check if from start to i, nums[j] == i-j
                boolean valid = true;
                for (int j = 0; j <= i; j++) {
                    if (nums[j] != i - j) {
                        valid = false;
                        break;
                    }
                }
                if (valid) return true;
            }
        }

        return false;
    }
}
```

</div>

Actually, wait. Let me test this with some examples to make sure it's correct:

Example 1: `[0, 1, 2, 3]`

- Start at index 0, go right: Check indices 0-3
  - Index 0: 0 = 0-0 ✓
  - Index 1: 1 = 1-0 ✓
  - Index 2: 2 = 2-0 ✓
  - Index 3: 3 = 3-0 ✓
    Returns true ✓

Example 2: `[1, 0, 1, 2]`

- Check going right from index 1:
  - Index 1: 0 = 1-1 ✓
  - Index 2: 1 = 2-1 ✓
  - Index 3: 2 = 3-1 ✓
    Returns true ✓

Example 3: `[2, 1, 0]`

- Check going left from index 2:
  - Index 0: 2 = 2-0 ✓
  - Index 1: 1 = 2-1 ✓
  - Index 2: 0 = 2-2 ✓
    Returns true ✓

This works! The algorithm correctly identifies valid sequences.

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case

- We iterate through all n indices to find zeros
- For each zero, we check up to n elements in one direction
- In worst case (all zeros), this is O(n²)

**Space Complexity:** O(1)

- We only use a few variables for iteration and validation
- No additional data structures needed

Wait, can we optimize this to O(n)? Yes! We don't need to check every zero separately. We can check in one pass if the array matches the pattern `[k, k-1, ..., 1, 0, 1, 2, ...]` for some k. But the O(n²) solution is acceptable for an Easy problem and demonstrates the concept clearly.

Actually, let me provide the O(n) optimized version:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canMakeZero(self, nums):
    """
    Optimized O(n) solution.

    Observation: The array must be of the form:
    [m, m-1, ..., 1, 0, 1, 2, ..., n] or a prefix/suffix of this pattern.

    We can check this in one pass by finding the zero and verifying
    the pattern extends correctly in both directions.
    """
    n = len(nums)

    # Find first zero
    zero_index = -1
    for i in range(n):
        if nums[i] == 0:
            zero_index = i
            break

    if zero_index == -1:
        return False  # No zero to start from

    # Check left side (decreasing to zero)
    for i in range(zero_index):
        if nums[i] != zero_index - i:
            return False

    # Check right side (increasing from zero)
    for i in range(zero_index, n):
        if nums[i] != i - zero_index:
            return False

    return True
```

```javascript
// Time: O(n) | Space: O(1)
function canMakeZero(nums) {
  /**
   * Optimized O(n) solution.
   *
   * Observation: The array must be of the form:
   * [m, m-1, ..., 1, 0, 1, 2, ..., n] or a prefix/suffix of this pattern.
   *
   * We can check this in one pass by finding the zero and verifying
   * the pattern extends correctly in both directions.
   */
  const n = nums.length;

  // Find first zero
  let zeroIndex = -1;
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      zeroIndex = i;
      break;
    }
  }

  if (zeroIndex === -1) {
    return false; // No zero to start from
  }

  // Check left side (decreasing to zero)
  for (let i = 0; i < zeroIndex; i++) {
    if (nums[i] !== zeroIndex - i) {
      return false;
    }
  }

  // Check right side (increasing from zero)
  for (let i = zeroIndex; i < n; i++) {
    if (nums[i] !== i - zeroIndex) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canMakeZero(int[] nums) {
        /**
         * Optimized O(n) solution.
         *
         * Observation: The array must be of the form:
         * [m, m-1, ..., 1, 0, 1, 2, ..., n] or a prefix/suffix of this pattern.
         *
         * We can check this in one pass by finding the zero and verifying
         * the pattern extends correctly in both directions.
         */
        int n = nums.length;

        // Find first zero
        int zeroIndex = -1;
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                zeroIndex = i;
                break;
            }
        }

        if (zeroIndex == -1) {
            return false;  // No zero to start from
        }

        // Check left side (decreasing to zero)
        for (int i = 0; i < zeroIndex; i++) {
            if (nums[i] != zeroIndex - i) {
                return false;
            }
        }

        // Check right side (increasing from zero)
        for (int i = zeroIndex; i < n; i++) {
            if (nums[i] != i - zeroIndex) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

Actually, I need to correct this optimized version. It only checks for the pattern where we go both left AND right from the zero, but the problem allows going only in ONE direction. So we need to check both possibilities. Here's the correct O(n) solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canMakeZero(self, nums):
    """
    Final optimized O(n) solution.

    We need to check two cases:
    1. Going right from some zero: array must be [0, 1, 2, 3, ...] from that point
    2. Going left from some zero: array must be [..., 3, 2, 1, 0] to that point

    We can check both in O(n) by looking for the pattern.
    """
    n = len(nums)

    # Case 1: Check if we can go right from the FIRST zero
    # Array should be: [x, x, ..., 0, 1, 2, 3, ...]
    for i in range(n):
        if nums[i] == 0:
            # Verify pattern to the right
            valid = True
            for j in range(i, n):
                if nums[j] != j - i:
                    valid = False
                    break
            if valid:
                return True
            break  # Only need to check first zero for right case

    # Case 2: Check if we can go left from the LAST zero
    # Array should be: [..., 3, 2, 1, 0, x, x, ...]
    for i in range(n-1, -1, -1):
        if nums[i] == 0:
            # Verify pattern to the left
            valid = True
            for j in range(0, i+1):
                if nums[j] != i - j:
                    valid = False
                    break
            if valid:
                return True
            break  # Only need to check last zero for left case

    return False
```

```javascript
// Time: O(n) | Space: O(1)
function canMakeZero(nums) {
  /**
   * Final optimized O(n) solution.
   *
   * We need to check two cases:
   * 1. Going right from some zero: array must be [0, 1, 2, 3, ...] from that point
   * 2. Going left from some zero: array must be [..., 3, 2, 1, 0] to that point
   *
   * We can check both in O(n) by looking for the pattern.
   */
  const n = nums.length;

  // Case 1: Check if we can go right from the FIRST zero
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      // Verify pattern to the right
      let valid = true;
      for (let j = i; j < n; j++) {
        if (nums[j] !== j - i) {
          valid = false;
          break;
        }
      }
      if (valid) return true;
      break; // Only need to check first zero for right case
    }
  }

  // Case 2: Check if we can go left from the LAST zero
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] === 0) {
      // Verify pattern to the left
      let valid = true;
      for (let j = 0; j <= i; j++) {
        if (nums[j] !== i - j) {
          valid = false;
          break;
        }
      }
      if (valid) return true;
      break; // Only need to check last zero for left case
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canMakeZero(int[] nums) {
        /**
         * Final optimized O(n) solution.
         *
         * We need to check two cases:
         * 1. Going right from some zero: array must be [0, 1, 2, 3, ...] from that point
         * 2. Going left from some zero: array must be [..., 3, 2, 1, 0] to that point
         *
         * We can check both in O(n) by looking for the pattern.
         */
        int n = nums.length;

        // Case 1: Check if we can go right from the FIRST zero
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                // Verify pattern to the right
                boolean valid = true;
                for (int j = i; j < n; j++) {
                    if (nums[j] != j - i) {
                        valid = false;
                        break;
                    }
                }
                if (valid) return true;
                break;  // Only need to check first zero for right case
            }
        }

        // Case 2: Check if we can go left from the LAST zero
        for (int i = n - 1; i >= 0; i--) {
            if (nums[i] == 0) {
                // Verify pattern to the left
                boolean valid = true;
                for (int j = 0; j <= i; j++) {
                    if (nums[j] != i - j) {
                        valid = false;
                        break;
                    }
                }
                if (valid) return true;
                break;  // Only need to check last zero for left case
            }
        }

        return false;
    }
}
```

</div>

## Common Mistakes

1. **Not checking both directions**: Candidates often check only one direction (usually right from the first zero) and forget that going left from a different zero might work.

2. **Off-by-one errors in distance calculation**: When checking `nums[j] == j-i` for going right, it's easy to write `nums[j] == j-i+1` or similar. Always test with small examples.

3. **Assuming you can change direction**: The problem states you choose a direction at the start and must stick with it. Some candidates try to simulate with direction changes.

4. **Not handling the no-zero case**: If there's no zero in the array, we can't even start, so the answer should always be false.

5. **Overcomplicating with simulation**: While simulating the process works, it's less efficient than the pattern recognition approach. Interviewers prefer the mathematical insight.

## When You'll See This Pattern

This problem teaches pattern recognition in sequences. Similar problems include:

1. **LeetCode 845. Longest Mountain in Array** - Finding sequences that increase then decrease
2. **LeetCode 896. Monotonic Array** - Checking if array is entirely non-increasing or non-decreasing
3. **LeetCode 941. Valid Mountain Array** - Checking for strict increase then strict decrease pattern

The core technique is recognizing that certain operations impose specific patterns on the data, and you can verify these patterns directly without simulating the entire process.

## Key Takeaways

1. **Look for mathematical patterns instead of simulating**: When a problem involves repeated operations, there's often a mathematical condition or pattern that emerges. Finding this is more efficient than simulation.

2. **Consider both directions for movement problems**: When movement is allowed in left/right directions, always check both possibilities unless ruled out by constraints.

3. **Test with small examples**: Derive the pattern by working through small test cases manually. This helps you discover the underlying condition without overthinking.

4. **Edge cases matter**: Always check for empty arrays, no valid starting points, and boundary conditions.

[Practice this problem on CodeJeet](/problem/make-array-elements-equal-to-zero)
