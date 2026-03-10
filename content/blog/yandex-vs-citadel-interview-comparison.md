---
title: "Yandex vs Citadel: Interview Question Comparison"
description: "Compare coding interview questions at Yandex and Citadel — difficulty levels, topic focus, and preparation strategy."
date: "2032-11-23"
category: "tips"
tags: ["yandex", "citadel", "comparison"]
---

# Yandex vs Citadel: Interview Question Comparison

If you're preparing for interviews at both Yandex and Citadel, you're facing two distinct challenges from companies with different technical cultures. Yandex, Russia's search giant, has a strong algorithmic focus rooted in competitive programming traditions. Citadel, the quantitative hedge fund, emphasizes practical problem-solving under pressure with a heavier weight on optimization. The good news: there's significant overlap in their technical screening, but the differences in emphasis require strategic preparation.

## Question Volume and Difficulty

The data tells an immediate story: Yandex has 134 tagged questions (52 easy, 72 medium, 10 hard) while Citadel has 96 (6 easy, 59 medium, 31 hard).

Yandex's distribution suggests they're testing fundamental competency across a broad range—you'll likely encounter at least one medium problem that's straightforward if you know the pattern. Their 10% hard questions indicate occasional "killer" problems, but they're not the norm. The higher volume means more predictable patterns emerge; you can study their question bank with good ROI.

Citadel's distribution is striking: only 6% easy questions, 61% medium, and 32% hard. This signals they're consistently pushing candidates to their limits. When Citadel asks a medium problem, expect it to be on the harder end of medium. Their hard problems often involve multiple concepts combined or require non-obvious optimizations. The lower volume but higher difficulty suggests they value depth over breadth—mastering fewer patterns thoroughly beats superficial knowledge of many.

## Topic Overlap

Both companies heavily test **Arrays**, **Hash Tables**, and **Strings**. This triad forms the core of 70-80% of problems at both companies. The overlap is your preparation sweet spot.

**Yandex-specific emphasis**: They show stronger preference for **Two Pointers** problems (often combined with sorting or sliding window patterns). This aligns with competitive programming backgrounds where space optimization matters.

**Citadel-specific emphasis**: **Dynamic Programming** appears in their top four while absent from Yandex's. This isn't surprising for a quant firm—DP tests both algorithmic thinking and optimization skills crucial for financial modeling. They also favor **Graph** problems more than the data suggests (often embedded in other categories).

## Preparation Priority Matrix

**Highest ROI (Study First)**:

- **Array manipulation** with hash tables: Two Sum variations, subarray problems
- **String algorithms**: palindrome checks, substring searches, transformation problems
- **Sliding window**: both fixed and variable window problems

**Yandex-Specific Priority**:

- **Two Pointers**: especially sorted array problems
- **Sorting-based solutions**: many Yandex problems reduce to "sort then process"
- **Basic data structures**: stacks, queues, and their applications

**Citadel-Specific Priority**:

- **Dynamic Programming**: both 1D and 2D DP, particularly optimization problems
- **Graph algorithms**: BFS/DFS, shortest path, topological sort
- **Bit manipulation**: appears more frequently in quant interviews

**Recommended crossover problems**:

- **3Sum (#15)**: Tests sorting + two pointers (Yandex) and optimization (Citadel)
- **Longest Substring Without Repeating Characters (#3)**: Classic sliding window with hash table
- **Merge Intervals (#56)**: Array manipulation with sorting, tests edge case handling

## Interview Format Differences

**Yandex** typically follows the Russian tech interview pattern: 2-3 technical rounds, each with 1-2 problems in 45-60 minutes. They often use their own platform similar to Codeforces. Expect follow-up questions about optimization and sometimes mathematical proof of correctness. System design appears for senior roles but is less emphasized than at US tech giants. Behavioral questions are minimal and straightforward.

**Citadel** interviews are intense and time-pressured. The standard process includes an OA (often 2 problems in 60-90 minutes), followed by 3-5 back-to-back technical rounds on-site. Each round typically presents 1 complex problem in 45 minutes with multiple follow-ups. They're known for "pressure testing"—asking you to optimize already-working solutions. For quantitative roles, expect probability/math questions alongside coding. Behavioral questions focus on pressure handling and decision-making under uncertainty.

<div class="code-group">

```python
# Problem valuable for both: Two Sum variation
# Time: O(n) | Space: O(n)
def two_sum_sorted(nums, target):
    """Return indices of two numbers that sum to target.
    Assumes nums is sorted and exactly one solution exists."""
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []  # Should never reach here per problem constraints

# Citadel-style follow-up: What if we need all unique pairs?
def two_sum_all_pairs(nums, target):
    """Find all unique pairs that sum to target."""
    nums.sort()
    left, right = 0, len(nums) - 1
    result = []
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            result.append([nums[left], nums[right]])
            # Skip duplicates
            while left < right and nums[left] == nums[left + 1]:
                left += 1
            while left < right and nums[right] == nums[right - 1]:
                right -= 1
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return result
```

```javascript
// Problem valuable for both: Two Sum variation
// Time: O(n) | Space: O(n)
function twoSumSorted(nums, target) {
  /** Return indices of two numbers that sum to target.
   * Assumes nums is sorted and exactly one solution exists. */
  let left = 0,
    right = nums.length - 1;
  while (left < right) {
    const currentSum = nums[left] + nums[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // Should never reach here per problem constraints
}

// Citadel-style follow-up: What if we need all unique pairs?
function twoSumAllPairs(nums, target) {
  /** Find all unique pairs that sum to target. */
  nums.sort((a, b) => a - b);
  let left = 0,
    right = nums.length - 1;
  const result = [];
  while (left < right) {
    const currentSum = nums[left] + nums[right];
    if (currentSum === target) {
      result.push([nums[left], nums[right]]);
      // Skip duplicates
      while (left < right && nums[left] === nums[left + 1]) left++;
      while (left < right && nums[right] === nums[right - 1]) right--;
      left++;
      right--;
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return result;
}
```

```java
// Problem valuable for both: Two Sum variation
// Time: O(n) | Space: O(1)
import java.util.*;

public class TwoSumVariations {
    /** Return indices of two numbers that sum to target.
     * Assumes nums is sorted and exactly one solution exists. */
    public int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            if (currentSum == target) {
                return new int[]{left, right};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{}; // Should never reach here per problem constraints
    }

    // Citadel-style follow-up: What if we need all unique pairs?
    public List<List<Integer>> twoSumAllPairs(int[] nums, int target) {
        /** Find all unique pairs that sum to target. */
        Arrays.sort(nums);
        int left = 0, right = nums.length - 1;
        List<List<Integer>> result = new ArrayList<>();
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            if (currentSum == target) {
                result.add(Arrays.asList(nums[left], nums[right]));
                // Skip duplicates
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return result;
    }
}
```

</div>

## Specific Problem Recommendations

1. **Container With Most Water (#11)** - Perfect for both: tests two pointers (Yandex) with optimization reasoning (Citadel). The O(n) solution isn't obvious but learnable.

2. **Longest Palindromic Substring (#5)** - Covers string manipulation with DP approach (Citadel) and expansion approach (Yandex). Understanding both solutions demonstrates depth.

3. **Coin Change (#322)** - Essential Citadel prep (classic DP) that also appears in Yandex's harder problems. The follow-up about minimum coins vs number of ways tests adaptability.

4. **Merge k Sorted Lists (#23)** - Tests data structure knowledge (heaps) important for both, with optimization follow-ups Citadel loves.

5. **Word Break (#139)** - DP problem (Citadel focus) that also tests string manipulation and hash tables (shared focus). The follow-up about reconstruction adds complexity.

## Which to Prepare for First

**Prepare for Citadel first if interviewing at both.** Here's why: Citadel's problems are generally harder, and their interview style is more intense. If you can handle Citadel's pressure and optimization questions, Yandex's algorithmic problems will feel more manageable. The reverse isn't true—acing Yandex-style problems doesn't guarantee you can handle Citadel's optimization deep dives.

Start with the shared topics (arrays, hash tables, strings), then drill Citadel's DP and graph problems. Finally, add Yandex's two-pointer and sorting patterns. This approach gives you the hardest material when your preparation energy is highest, leaving the relatively more straightforward patterns for later.

Remember: Both companies value clean, efficient code and clear communication. Practice explaining your thought process aloud, especially for optimization decisions. The difference is that Yandex might accept a theoretically optimal solution, while Citadel will push you to make it practically faster with constant factors and memory considerations.

For more company-specific insights, check our guides: [Yandex Interview Guide](/company/yandex) and [Citadel Interview Guide](/company/citadel).
