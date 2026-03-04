---
title: "Binary Search Beyond Sorted Arrays"
description: "Binary search isn't just for sorted arrays. Learn how to apply it to rotated arrays, search spaces, and optimization problems."
date: "2026-06-20"
category: "tips"
tags: ["binary search", "algorithms", "patterns", "interview prep"]
---

Most candidates learn binary search as a way to find an element in a sorted array. But binary search is far more general. Any time you have a monotonic condition over a search space -- where one half satisfies a property and the other does not -- binary search applies.

## Classic Binary Search: Get the Foundation Right

The standard template: `left = 0`, `right = n - 1`, loop while `left <= right`. Calculate `mid = left + (right - left) / 2` to avoid overflow. If found, return. If target is greater, set `left = mid + 1`. If smaller, `right = mid - 1`.

The tricky part is choosing between `left <= right` vs `left < right`, and `right = mid` vs `right = mid - 1`. For exact match, use `left <= right` with `right = mid - 1`. For boundary finding (first/last position), use `left < right` with `right = mid` (left boundary) or `left = mid + 1` (right boundary). Pick one template and drill it.

Let's solidify this with a concrete implementation of the exact match template in three languages.

<div class="code-group">

```python
def binary_search_exact(nums, target):
    """
    Returns the index of target in nums, or -1 if not found.
    Assumes nums is sorted in ascending order.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        # Prevent potential overflow and works in Python/Java/JS
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            # Target is in the right half
            left = mid + 1
        else:
            # Target is in the left half
            right = mid - 1

    return -1

# Example usage:
# nums = [1, 3, 5, 7, 9, 11]
# print(binary_search_exact(nums, 7))  # Output: 3
# print(binary_search_exact(nums, 8))  # Output: -1
```

```javascript
function binarySearchExact(nums, target) {
  /**
   * Returns the index of target in nums, or -1 if not found.
   * Assumes nums is sorted in ascending order.
   */
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    // Using Math.floor for integer division in JS
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      // Target is in the right half
      left = mid + 1;
    } else {
      // Target is in the left half
      right = mid - 1;
    }
  }

  return -1;
}

// Example usage:
// const nums = [1, 3, 5, 7, 9, 11];
// console.log(binarySearchExact(nums, 7)); // Output: 3
// console.log(binarySearchExact(nums, 8)); // Output: -1
```

```java
public class BinarySearch {
    public static int binarySearchExact(int[] nums, int target) {
        /**
         * Returns the index of target in nums, or -1 if not found.
         * Assumes nums is sorted in ascending order.
         */
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            // Prevents overflow compared to (left + right) / 2
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                // Target is in the right half
                left = mid + 1;
            } else {
                // Target is in the left half
                right = mid - 1;
            }
        }

        return -1;
    }

    // Example usage:
    // public static void main(String[] args) {
    //     int[] nums = {1, 3, 5, 7, 9, 11};
    //     System.out.println(binarySearchExact(nums, 7)); // Output: 3
    //     System.out.println(binarySearchExact(nums, 8)); // Output: -1
    // }
}
```

</div>

## Rotated Sorted Arrays

Search in Rotated Sorted Array: the array is sorted then rotated, like `[4, 5, 6, 7, 0, 1, 2]`. The key insight is that at any mid point, one half is still sorted. Check which half is sorted by comparing `nums[left]` with `nums[mid]`, then check if the target falls within the sorted half.

Find Minimum in Rotated Sorted Array: compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, the minimum is in the right half.

Let's implement the search in a rotated sorted array. The algorithm first determines which side of the `mid` index is properly sorted, then checks if the target lies within that sorted range to decide where to search next.

<div class="code-group">

```python
def search_rotated(nums, target):
    """
    Searches for target in a rotated sorted array.
    Returns the index of target, or -1 if not found.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Check if the left half [left, mid] is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                # Target is in the sorted left half
                right = mid - 1
            else:
                # Target is in the right half
                left = mid + 1
        else:
            # Right half [mid, right] must be sorted
            if nums[mid] < target <= nums[right]:
                # Target is in the sorted right half
                left = mid + 1
            else:
                # Target is in the left half
                right = mid - 1

    return -1

# Example usage:
# nums = [4, 5, 6, 7, 0, 1, 2]
# print(search_rotated(nums, 0))  # Output: 4
# print(search_rotated(nums, 3))  # Output: -1
```

```javascript
function searchRotated(nums, target) {
  /**
   * Searches for target in a rotated sorted array.
   * Returns the index of target, or -1 if not found.
   */
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // Check if the left half [left, mid] is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        // Target is in the sorted left half
        right = mid - 1;
      } else {
        // Target is in the right half
        left = mid + 1;
      }
    } else {
      // Right half [mid, right] must be sorted
      if (nums[mid] < target && target <= nums[right]) {
        // Target is in the sorted right half
        left = mid + 1;
      } else {
        // Target is in the left half
        right = mid - 1;
      }
    }
  }

  return -1;
}

// Example usage:
// const nums = [4, 5, 6, 7, 0, 1, 2];
// console.log(searchRotated(nums, 0)); // Output: 4
// console.log(searchRotated(nums, 3)); // Output: -1
```

```java
public class RotatedSearch {
    public static int searchRotated(int[] nums, int target) {
        /**
         * Searches for target in a rotated sorted array.
         * Returns the index of target, or -1 if not found.
         */
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // Check if the left half [left, mid] is sorted
            if (nums[left] <= nums[mid]) {
                // Left half is sorted
                if (nums[left] <= target && target < nums[mid]) {
                    // Target is in the sorted left half
                    right = mid - 1;
                } else {
                    // Target is in the right half
                    left = mid + 1;
                }
            } else {
                // Right half [mid, right] must be sorted
                if (nums[mid] < target && target <= nums[right]) {
                    // Target is in the sorted right half
                    left = mid + 1;
                } else {
                    // Target is in the left half
                    right = mid - 1;
                }
            }
        }

        return -1;
    }

    // Example usage:
    // public static void main(String[] args) {
    //     int[] nums = {4, 5, 6, 7, 0, 1, 2};
    //     System.out.println(searchRotated(nums, 0)); // Output: 4
    //     System.out.println(searchRotated(nums, 3)); // Output: -1
    // }
}
```

</div>

## Binary Search on Answer

The most powerful application. Instead of searching an array, search the space of possible answers.

The pattern works when: the answer lies in a known range, you can write a monotonic `feasible(x)` function, and you binary search to find the optimal feasible value.

**Minimize the Maximum.** Koko Eating Bananas: search space is [1, max(piles)]. For a given speed, calculate hours needed. If within H, it is feasible. Binary search finds the minimum feasible speed. Split Array Largest Sum follows the same structure with search space [max(nums), sum(nums)].

**Maximize the Minimum.** Magnetic Force Between Two Balls: binary search on the minimum distance. For a given distance, greedily place balls and check feasibility.

Let's implement the classic "Koko Eating Bananas" problem. The `feasible(speed)` function calculates the total hours Koko needs to eat all piles at the given speed. We binary search for the smallest speed where `feasible(speed)` is true (i.e., total hours <= H).

<div class="code-group">

```python
def min_eating_speed(piles, h):
    """
    Returns the minimum integer k such that Koko can eat all bananas in h hours.
    """
    def feasible(speed):
        # Calculate total hours needed at this speed
        total_hours = 0
        for pile in piles:
            # Ceiling division: (pile + speed - 1) // speed
            total_hours += (pile + speed - 1) // speed
        return total_hours <= h

    # Search space: from 1 to the maximum pile size
    left, right = 1, max(piles)

    while left < right:
        mid = left + (right - left) // 2

        if feasible(mid):
            # This speed works, try a smaller speed (search left)
            right = mid
        else:
            # This speed is too slow, need a faster speed (search right)
            left = mid + 1

    return left  # or right, since left == right

# Example usage:
# piles = [3, 6, 7, 11]
# h = 8
# print(min_eating_speed(piles, h))  # Output: 4
```

```javascript
function minEatingSpeed(piles, h) {
  /**
   * Returns the minimum integer k such that Koko can eat all bananas in h hours.
   */
  function feasible(speed) {
    // Calculate total hours needed at this speed
    let totalHours = 0;
    for (const pile of piles) {
      // Ceiling division: Math.ceil(pile / speed)
      totalHours += Math.ceil(pile / speed);
    }
    return totalHours <= h;
  }

  // Search space: from 1 to the maximum pile size
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (feasible(mid)) {
      // This speed works, try a smaller speed (search left)
      right = mid;
    } else {
      // This speed is too slow, need a faster speed (search right)
      left = mid + 1;
    }
  }

  return left; // or right, since left == right
}

// Example usage:
// const piles = [3, 6, 7, 11];
// const h = 8;
// console.log(minEatingSpeed(piles, h)); // Output: 4
```

```java
public class KokoBananas {
    public static int minEatingSpeed(int[] piles, int h) {
        /**
         * Returns the minimum integer k such that Koko can eat all bananas in h hours.
         */
        // Helper function to check feasibility
        java.util.function.IntPredicate feasible = (speed) -> {
            long totalHours = 0; // Use long to prevent overflow
            for (int pile : piles) {
                // Ceiling division: (pile + speed - 1) / speed
                totalHours += (pile + speed - 1) / speed;
            }
            return totalHours <= h;
        };

        // Search space: from 1 to the maximum pile size
        int left = 1;
        int right = 0;
        for (int pile : piles) {
            right = Math.max(right, pile);
        }

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (feasible.test(mid)) {
                // This speed works, try a smaller speed (search left)
                right = mid;
            } else {
                // This speed is too slow, need a faster speed (search right)
                left = mid + 1;
            }
        }

        return left; // or right, since left == right
    }

    // Example usage:
    // public static void main(String[] args) {
    //     int[] piles = {3, 6, 7, 11};
    //     int h = 8;
    //     System.out.println(minEatingSpeed(piles, h)); // Output: 4
    // }
}
```

</div>

## Boundary Finding

Find First and Last Position of Element in Sorted Array requires two binary searches. For the leftmost: when you find the target, set `right = mid` and keep searching left. For the rightmost: set `left = mid + 1` and keep searching right.

This generalizes to any monotonic predicate: "find the smallest divisor such that the sum is below a threshold" is boundary-finding in disguise.

Implementing this requires two separate binary searches: one to find the left boundary (first occurrence) and one to find the right boundary (last occurrence). The key is to not stop when you find the target, but to continue narrowing the search space to the side of interest.

<div class="code-group">

```python
def search_range(nums, target):
    """
    Returns the starting and ending position of target in nums.
    Returns [-1, -1] if target is not found.
    """
    def find_left():
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] >= target:
                # Move left to find the first occurrence
                right = mid - 1
            else:
                left = mid + 1
        return left

    def find_right():
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] <= target:
                # Move right to find the last occurrence
                left = mid + 1
            else:
                right = mid - 1
        return right

    left_idx = find_left()
    right_idx = find_right()

    # Check if target was actually found
    if left_idx <= right_idx and 0 <= left_idx < len(nums) and nums[left_idx] == target:
        return [left_idx, right_idx]
    else:
        return [-1, -1]

# Example usage:
# nums = [5, 7, 7, 8, 8, 10]
# print(search_range(nums, 8))  # Output: [3, 4]
# print(search_range(nums, 6))  # Output: [-1, -1]
```

```javascript
function searchRange(nums, target) {
  /**
   * Returns the starting and ending position of target in nums.
   * Returns [-1, -1] if target is not found.
   */
  function findLeft() {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] >= target) {
        // Move left to find the first occurrence
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return left;
  }

  function findRight() {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] <= target) {
        // Move right to find the last occurrence
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return right;
  }

  const leftIdx = findLeft();
  const rightIdx = findRight();

  // Check if target was actually found
  if (leftIdx <= rightIdx && leftIdx >= 0 && nums[leftIdx] === target) {
    return [leftIdx, rightIdx];
  } else {
    return [-1, -1];
  }
}

// Example usage:
// const nums = [5, 7, 7, 8, 8, 10];
// console.log(searchRange(nums, 8)); // Output: [3, 4]
// console.log(searchRange(nums, 6)); // Output: [-1, -1]
```

```java
public class SearchRange {
    public static int[] searchRange(int[] nums, int target) {
        /**
         * Returns the starting and ending position of target in nums.
         * Returns [-1, -1] if target is not found.
         */
        int leftIdx = findLeft(nums, target);
        int rightIdx = findRight(nums, target);

        // Check if target was actually found
        if (leftIdx <= rightIdx && leftIdx >= 0 && leftIdx < nums.length && nums[leftIdx] == target) {
            return new int[]{leftIdx, rightIdx};
        } else {
            return new int[]{-1, -1};
        }
    }

    private static int findLeft(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                // Move left to find the first occurrence
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    private static int findRight(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) {
                // Move right to find the last occurrence
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return right;
    }

    // Example usage:
    // public static void main(String[] args) {
    //     int[] nums = {5, 7, 7, 8, 8, 10};
    //     int[] result1 = searchRange(nums, 8);
    //     System.out.println("[" + result1[0] + ", " + result1[1] + "]"); // Output: [3, 4]
    //     int[] result2 = searchRange(nums, 6);
    //     System.out.println("[" + result2[0] + ", " + result2[1] + "]"); // Output: [-1, -1]
    // }
}
```

</div>

## Common Pitfalls

**Off-by-one errors.** Test with arrays of size 1 and 2. For example, when `nums = [5]` and `target = 5`, does your loop terminate correctly? When `nums = [2, 5]` and `target = 2`, does it find the first element? Always test edge cases.

**Integer overflow.** Use `mid = left + (right - left) / 2`. This formula is safe in languages like Java and C++ where `left + right` could exceed `Integer.MAX_VALUE`. In Python, integers are arbitrary precision, but it's still good practice for consistency.

**Infinite loops.** When using `left < right` with `left = mid`, use ceiling division: `mid = left + (right - left + 1) / 2`. This happens in scenarios like finding the last occurrence using a `left < right` loop. If you use floor division and update `left = mid`, you might get stuck when `left` and `right` are consecutive.

**Non-monotonic feasibility.** Verify the feasibility function is monotonic before applying binary search on answer. For example, in "Koko Eating Bananas", if speed `k` is feasible (can finish in H hours), then any speed greater than `k` is also feasible. This monotonic property (False, False, ..., True, True, ...) is essential.

## Practice Problems

1.  **Binary Search** -- Basic template. Implement and test the exact match.
2.  **Search in Rotated Sorted Array** -- Rotated arrays. Understand the sorted half logic.
3.  **Find Minimum in Rotated Sorted Array** -- Rotation variant. Practice with `nums[mid]` compared to `nums[right]`.
4.  **Find First and Last Position of Element in Sorted Array** -- Boundary finding. Master the two-search approach.
5.  **Koko Eating Bananas** -- Binary search on answer. The classic "minimize the maximum" problem.
6.  **Split Array Largest Sum** -- Advanced search on answer. The feasibility function involves greedy partitioning.
7.  **Capacity to Ship Packages Within D Days** -- Minimize-maximum variant. Very similar to "Split Array Largest Sum".

To effectively practice, start by writing the `feasible(x)` function for problems 5, 6, and 7. Then, plug it into the binary search on answer template. The core loop structure remains largely the same; only the feasibility check changes.

Explore binary search problems by company on the [CodeJeet dashboard](/dashboard). This pattern appears frequently at [Amazon](/company/amazon) and [Google](/company/google).
