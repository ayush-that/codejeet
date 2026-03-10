---
title: "Binary Search Questions at Paytm: What to Expect"
description: "Prepare for Binary Search interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-25"
category: "dsa-patterns"
tags: ["paytm", "binary-search", "interview prep"]
---

If you're preparing for a Paytm interview, you'll likely face a Binary Search question. With 3 out of their 29 tagged problems on LeetCode being Binary Search, it represents a significant 10% of their algorithmic focus. While not their absolute top category, this frequency is telling—it's a deliberate choice. Paytm, as a fintech giant, deals heavily with transactional data, sorted logs, rate tables, and massive datasets where efficient lookup isn't just an algorithm, it's a business requirement. They don't ask Binary Search to test if you can implement `while (left <= right)`; they ask it to see if you can recognize when a problem is fundamentally about searching in a sorted space or finding a boundary, which is a critical skill for optimizing their core systems. In real interviews, a well-disguised Binary Search variant is a common mid-to-hard level question used to separate candidates who memorize templates from those who genuinely understand the paradigm.

## Specific Patterns Paytm Favors

Paytm's Binary Search questions tend to avoid the classic "find a target in a sorted array." They prefer problems where the sorted property or the search space is **non-obvious**. Their problems often fall into two specific patterns:

1.  **Binary Search on Answer (or "Search Space Reduction"):** This is their favorite. You're not searching an explicit array; you're searching for a _minimum or maximum value_ that satisfies a certain condition. The "array" is a conceptual range of possible answers, and you use a helper function to test if a candidate answer is feasible. This pattern is perfect for optimization problems common in resource allocation, scheduling, and rate limiting—all relevant to fintech.
    - **Example:** LeetCode 410 ("Split Array Largest Sum") is a quintessential problem of this type. You're given an array and asked to split it into `m` subarrays to minimize the largest sum among them. The brute-force search space is enormous, but the _answer_ (the minimized largest sum) lies between `max(nums)` and `sum(nums)`. You binary search this range, and for each candidate sum `mid`, you use a greedy helper to see if you can split the array into `m` or fewer subarrays where no subarray sum exceeds `mid`.

2.  **Finding Boundaries in a Modified Sorted Array:** They like problems where the data is sorted but has been rotated or has a single inflection point. This tests your ability to adapt the basic algorithm by carefully comparing `mid` with the boundaries (`left` and `right`) to decide which half to discard.
    - **Example:** LeetCode 33 ("Search in Rotated Sorted Array") is the classic here. You must find a target in an array that was sorted but then rotated at some pivot. The key is to determine which half (`left..mid` or `mid..right`) is normally sorted and then check if the target lies within that sorted half to decide where to search.

Here is the core implementation pattern for **Binary Search on Answer**, which is crucial for Paytm:

<div class="code-group">

```python
def binary_search_on_answer(self, data, m):
    """
    Generic template for "Binary Search on Answer" pattern.
    This solves problems like LeetCode 410, 875, 1011.
    """
    def feasible(candidate):
        # This is the problem-specific helper.
        # Returns True if we can achieve the goal with this candidate value.
        # e.g., for LeetCode 410: Can we split into <= m subarrays with max sum <= candidate?
        count = 1
        total = 0
        for num in data:
            total += num
            if total > candidate:  # Exceeded the candidate max sum
                count += 1
                total = num
                if count > m:
                    return False
        return True

    # Define the search space: [low, high]
    low, high = max(data), sum(data)  # This varies by problem
    best_answer = high  # or low, depending on if minimizing or maximizing

    while low <= high:
        mid = low + (high - low) // 2  # Avoid overflow, candidate answer
        if feasible(mid):
            # Candidate is feasible, try for a better (smaller) answer
            best_answer = mid
            high = mid - 1
        else:
            # Candidate is not feasible, need a larger answer
            low = mid + 1
    return best_answer
# Time Complexity: O(N * log(S)), where N is len(data) and S is the search space size (high-low).
# Space Complexity: O(1), excluding input storage.
```

```javascript
/**
 * Generic template for "Binary Search on Answer" pattern.
 * This solves problems like LeetCode 410, 875, 1011.
 */
function binarySearchOnAnswer(data, m) {
  const feasible = (candidate) => {
    // Problem-specific helper.
    // Returns true if goal is achievable with this candidate value.
    let count = 1;
    let total = 0;
    for (const num of data) {
      total += num;
      if (total > candidate) {
        // Exceeded candidate limit
        count++;
        total = num;
        if (count > m) return false;
      }
    }
    return true;
  };

  // Define search space [low, high]
  let low = Math.max(...data);
  let high = data.reduce((a, b) => a + b, 0);
  let bestAnswer = high;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (feasible(mid)) {
      // Candidate works, try for better (smaller) answer
      bestAnswer = mid;
      high = mid - 1;
    } else {
      // Candidate fails, need larger answer
      low = mid + 1;
    }
  }
  return bestAnswer;
}
// Time Complexity: O(N * log(S))
// Space Complexity: O(1)
```

```java
// Time Complexity: O(N * log(S)) | Space Complexity: O(1)
public class BinarySearchOnAnswer {
    public int binarySearchOnAnswer(int[] data, int m) {
        // Define search space
        int low = 0, high = 0;
        for (int num : data) {
            low = Math.max(low, num);
            high += num;
        }
        int bestAnswer = high;

        while (low <= high) {
            int mid = low + (high - low) / 2; // Candidate answer
            if (isFeasible(data, m, mid)) {
                // Candidate works, try for a better (smaller) answer
                bestAnswer = mid;
                high = mid - 1;
            } else {
                // Candidate fails, need a larger answer
                low = mid + 1;
            }
        }
        return bestAnswer;
    }

    private boolean isFeasible(int[] data, int m, int candidate) {
        // Problem-specific helper.
        // Returns true if goal is achievable with this candidate value.
        int count = 1;
        int total = 0;
        for (int num : data) {
            total += num;
            if (total > candidate) { // Exceeded candidate limit
                count++;
                total = num;
                if (count > m) return false;
            }
        }
        return true;
    }
}
```

</div>

## How Paytm Tests Binary Search vs Other Companies

Paytm's approach is more applied than theoretical. Compared to a company like Google, which might embed Binary Search in a complex, multi-step problem involving other data structures, Paytm's questions are often more self-contained but require deeper insight into the pattern itself. They are less about clever trickery and more about robustly applying a powerful optimization technique to a business-logic problem. The difficulty often lies in the "aha" moment of realizing that Binary Search on Answer is applicable. Once you see it, the implementation is straightforward. This contrasts with companies like Facebook (Meta), which might focus more on the array-index manipulation variants (e.g., rotated array, finding peaks) in their interview loops.

## Study Order

To build competency for Paytm, follow this progression:

1.  **Classic Binary Search:** Master the basic iterative and recursive implementations on a simple sorted array. Understand the subtle differences between `while (left <= right)` and `while (left < right)` and how they affect the final state of the pointers. This is your foundation.
2.  **Search in Modified Arrays:** Practice problems where the sort order is disrupted, like searching in a rotated sorted array (LeetCode 33) or finding a peak element (LeetCode 162). This teaches you to analyze the `mid` element relative to its neighbors to decide the search direction.
3.  **Binary Search on Answer:** This is the most critical step for Paytm. Start with intuitive problems like "Koko Eating Bananas" (LeetCode 875) or "Capacity To Ship Packages Within D Days" (LeetCode 1011), where the search space (eating speed, ship capacity) is easy to define. Then progress to "Split Array Largest Sum" (LeetCode 410).
4.  **Advanced Integration:** Finally, look at problems where Binary Search is one component of a larger solution, such as using it to find the boundary in a matrix sorted by row and column (LeetCode 74). This ensures you can recognize the pattern even when it's not the entire problem.

## Recommended Practice Order

Solve these problems in sequence to build the specific skills Paytm looks for:

1.  **LeetCode 704: Binary Search** - The absolute basic. Do it flawlessly.
2.  **LeetCode 33: Search in Rotated Sorted Array** - Master the boundary analysis.
3.  **LeetCode 162: Find Peak Element** - Another excellent boundary decision problem.
4.  **LeetCode 875: Koko Eating Bananas** - Your first "Binary Search on Answer." The search space (speed) is clear.
5.  **LeetCode 1011: Capacity To Ship Packages Within D Days** - A direct step up from Koko, with very similar structure.
6.  **LeetCode 410: Split Array Largest Sum** - The classic hard problem for this pattern. If you can solve this and explain the `feasible` function clearly, you're in great shape for a Paytm interview.

By focusing on the "Binary Search on Answer" pattern and understanding how to transform an optimization problem into a feasibility check, you'll be directly addressing the core of what Paytm's interviewers are evaluating.

[Practice Binary Search at Paytm](/company/paytm/binary-search)
