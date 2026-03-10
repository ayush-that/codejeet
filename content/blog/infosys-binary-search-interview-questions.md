---
title: "Binary Search Questions at Infosys: What to Expect"
description: "Prepare for Binary Search interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-14"
category: "dsa-patterns"
tags: ["infosys", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Infosys

Infosys includes 19 Binary Search questions in its company-specific problem set — that's 12% of their total tagged questions. This isn't a coincidence. While Infosys interviews cover a broad range of DSA topics, Binary Search represents a sweet spot: it tests fundamental algorithmic thinking, requires clean implementation under pressure, and has practical applications in the enterprise software domains where Infosys operates heavily.

In real interviews, you're more likely to encounter Binary Search variations than textbook implementations. Interviewers want to see if you recognize when a problem can be reduced to a search space optimization problem, not just whether you can implement `mid = (left + right) // 2`. The 12% representation suggests Binary Search appears in roughly 1 out of every 8 technical interviews at Infosys, making it essential preparation.

## Specific Patterns Infosys Favors

Infosys's Binary Search problems cluster around three distinct patterns:

1. **Search in Rotated Sorted Arrays** — This is their most frequent pattern. Problems like Search in Rotated Sorted Array (#33) and Find Minimum in Rotated Sorted Array (#153) test whether you understand that Binary Search works on any monotonic property, not just sorted arrays. The twist is identifying which half of the array is properly sorted.

2. **Binary Search on Answer Space** — Problems where the answer isn't in an array but in a range of possible values. Think Koko Eating Bananas (#875) or Capacity To Ship Packages Within D Days (#1011). These questions test if you can frame optimization problems as decision problems ("can Koko eat all bananas in H hours if she eats K bananas per hour?").

3. **Matrix Search Variations** — Searching in 2D sorted matrices (like Search a 2D Matrix II #240) appears less frequently but tests dimensional thinking. The key insight is treating rows and columns as boundaries that shrink the search space.

Here's the rotated array search pattern that appears repeatedly:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1   # Target in right half
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target in right half
            else:
                right = mid - 1  # Target in left half

    return -1
```

```javascript
// Time: O(log n) | Space: O(1)
function searchRotated(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
```

```java
// Time: O(log n) | Space: O(1)
public int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}
```

</div>

## How to Prepare

Master Binary Search for Infosys by focusing on pattern recognition, not memorization. When you see a problem, ask: "Is there a monotonic property I can exploit?" If the answer is yes, Binary Search might apply even if there's no obvious array to search.

Practice the decision function pattern for "search on answer" problems. Write a helper function that returns true/false for a candidate answer, then Binary Search the range of possible answers:

<div class="code-group">

```python
# Time: O(n log m) where n = piles.length, m = max(pile) | Space: O(1)
def min_eating_speed(piles, h):
    def can_eat(k):
        hours = 0
        for pile in piles:
            hours += (pile + k - 1) // k  # ceil division
            if hours > h:
                return False
        return True

    left, right = 1, max(piles)

    while left < right:
        mid = left + (right - left) // 2
        if can_eat(mid):
            right = mid  # Try smaller speed
        else:
            left = mid + 1  # Need faster speed

    return left
```

```javascript
// Time: O(n log m) | Space: O(1)
function minEatingSpeed(piles, h) {
  const canEat = (k) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / k);
      if (hours > h) return false;
    }
    return true;
  };

  let left = 1,
    right = Math.max(...piles);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canEat(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(n log m) | Space: O(1)
public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 0;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canEat(piles, h, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}

private boolean canEat(int[] piles, int h, int k) {
    long hours = 0;
    for (int pile : piles) {
        hours += (pile + k - 1) / k;  // ceil division
        if (hours > h) return false;
    }
    return true;
}
```

</div>

## How Infosys Tests Binary Search vs Other Companies

Infosys's Binary Search questions tend to be more "applied" than theoretical. Compared to FAANG companies:

- **Google/Facebook**: Often combine Binary Search with other patterns (like Binary Search + DFS). Infosys questions are more self-contained.
- **Amazon**: Focuses on practical optimization problems similar to Infosys, but Amazon's are often wrapped in system design contexts.
- **Startups**: May ask trickier variations with multiple constraints.

What's unique about Infosys is their emphasis on **rotated array problems**. This isn't accidental — it tests whether you understand the core insight that Binary Search requires a monotonic property, not necessarily a sorted array. They also favor problems with clear business analogs (shipping packages, eating bananas) over purely mathematical ones.

## Study Order

1. **Classic Binary Search** — Master the basic iterative implementation with proper boundary handling. Understand why `mid = left + (right - left) // 2` prevents overflow.

2. **Search Insert Position (#35)** — Learn to handle the "not found" case by returning the insertion point. This teaches you about loop invariants.

3. **First/Last Position in Sorted Array (#34)** — Practice searching for boundaries. This pattern extends to many real-world search problems.

4. **Search in Rotated Sorted Array (#33)** — The core Infosys pattern. Focus on identifying which half is sorted.

5. **Find Minimum in Rotated Sorted Array (#153)** — Another rotated array variation that tests similar insights.

6. **Binary Search on Answer Space** — Start with Sqrt(x) (#69), then progress to Koko Eating Bananas (#875).

7. **2D Matrix Search** — Search a 2D Matrix (#74) then Search a 2D Matrix II (#240).

This order builds from fundamentals to Infosys's favorite patterns, ensuring you understand why each variation works before tackling their most common question types.

## Recommended Practice Order

Solve these problems in sequence:

1. Binary Search (#704) — Warm-up
2. Search Insert Position (#35) — Boundary practice
3. First and Last Position (#34) — Boundary search
4. Search in Rotated Sorted Array (#33) — Core Infosys pattern
5. Find Minimum in Rotated Sorted Array (#153) — Rotated variation
6. Sqrt(x) (#69) — Simple answer space search
7. Capacity To Ship Packages (#1011) — Applied answer space search
8. Search a 2D Matrix (#74) — 2D extension
9. Median of Two Sorted Arrays (#4) — Advanced (if time permits)

This progression takes you from fundamentals through Infosys's most frequent patterns to more challenging variations.

[Practice Binary Search at Infosys](/company/infosys/binary-search)
