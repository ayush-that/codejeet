---
title: "Yandex vs Coupang: Interview Question Comparison"
description: "Compare coding interview questions at Yandex and Coupang — difficulty levels, topic focus, and preparation strategy."
date: "2032-12-29"
category: "tips"
tags: ["yandex", "coupang", "comparison"]
---

# Yandex vs Coupang: Interview Question Comparison

If you're preparing for interviews at both Yandex (Russia's tech giant) and Coupang (South Korea's e-commerce leader), you might assume they're worlds apart. But from a technical interview perspective, they share more DNA than you'd think. The key difference isn't just geographical—it's in how they assess problem-solving depth versus breadth. Yandex interviews feel like a marathon through diverse algorithmic terrain, while Coupang's feel like targeted deep dives into practical, scalable solutions. Preparing for both simultaneously is actually efficient if you understand where their question pools overlap and where they diverge.

## Question Volume and Difficulty

The numbers tell the first part of the story. Yandex has approximately **134 questions** in their known pool with a difficulty distribution of Easy (52), Medium (72), and Hard (10). Coupang has about **53 questions** with a sharper skew: Easy (3), Medium (36), and Hard (14).

What this means for your preparation:

- **Yandex** tests broader coverage. With 134 questions spanning all difficulties, you're likely to encounter a wider variety of problems. The higher Easy count suggests they might include simpler warm-up questions or test fundamental coding fluency more explicitly. Don't mistake "Easy" for trivial—these often test clean implementation and edge case handling under time pressure.
- **Coupang** goes deeper, not wider. With only 3 Easy questions but 14 Hards among 53 total, they're clearly selecting for candidates who can handle complex problem-solving. The Medium-heavy distribution (36 of 53) means most questions will require multiple algorithmic steps or non-obvious optimizations.

The implication: For Yandex, you need to be decently quick across many problem types. For Coupang, you need to be exceptionally strong on a narrower set of challenging patterns.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This is your foundation. Where they differ:

**Shared high-priority topics:**

- Array manipulation (sliding window, two pointers, prefix sums)
- String algorithms (palindromes, subsequences, encoding/decoding)
- Hash Table applications (frequency counting, memoization, lookups)

**Yandex-specific emphasis:**

- **Two Pointers** appears as a distinct high-frequency topic. Think problems like "3Sum" variations, merging sorted arrays, or container with most water patterns.
- Broader algorithmic spread overall—you might see more graph or tree problems than Coupang's distribution suggests.

**Coupang-specific emphasis:**

- **Dynamic Programming** stands out. With DP as a top-4 topic among only 53 questions, expect at least one DP problem in your interview loop.
- More focus on problems with real-world e-commerce applications: inventory management, scheduling, optimization under constraints.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**Tier 1: Overlap Topics (Maximum ROI)**

- Array + Hash Table combinations (Two Sum patterns, subarray problems)
- String manipulation with hash maps (anagrams, minimum window substring)
- Study these through medium-difficulty problems first.

**Tier 2: Yandex-Specific Focus**

- Two pointer variations (especially on sorted arrays)
- Matrix/2D array traversal
- Breadth-first graph problems (less common but appears)

**Tier 3: Coupang-Specific Focus**

- Dynamic Programming (start with 1D then 2D)
- Greedy algorithms that feel like optimization problems
- Problems involving intervals or scheduling

**Recommended problems that serve both companies:**

- **Two Sum (#1)** - The foundational hash table problem
- **Longest Substring Without Repeating Characters (#3)** - Covers sliding window + hash map
- **Merge Intervals (#56)** - Appears in both companies' lists with variations
- **Product of Array Except Self (#238)** - Tests array manipulation without division
- **Longest Palindromic Substring (#5)** - Covers string manipulation and DP thinking

## Interview Format Differences

**Yandex** typically follows the Russian tech interview pattern:

- Multiple technical rounds (2-4 coding interviews)
- Often includes a system design round for senior roles
- Problems are presented in an online editor, similar to LeetCode
- May include "home assignments" before the onsite
- Behavioral questions are minimal and integrated into technical discussions

**Coupang** follows more of a hybrid Silicon Valley/Korean approach:

- Usually 2-3 coding rounds plus system design for relevant roles
- Heavy emphasis on scalability and practical constraints
- Interviews often include discussion of trade-offs beyond just time/space complexity
- May include culture fit interviews separate from technical rounds
- Problems often have e-commerce context (inventory, logistics, matching)

Time per problem: Both typically allow 45-60 minutes per coding question, but Coupang's harder problems might involve more discussion time versus pure coding time.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional cross-company preparation value:

1. **3Sum (#15)** - Covers sorting, two pointers (Yandex focus), and avoiding duplicates (clean implementation). The pattern extends to many array problems.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1) ignoring output storage
def threeSum(nums):
    nums.sort()
    result = []
    for i in range(len(nums)-2):
        # Skip duplicates for the first element
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i+1, len(nums)-1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates for left and right pointers
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
    return result
```

```javascript
// Time: O(n^2) | Space: O(1) ignoring output storage
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1,
      right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      }
    }
  }
  return result;
}
```

```java
// Time: O(n^2) | Space: O(1) ignoring output storage
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++;
                right--;
            }
        }
    }
    return result;
}
```

</div>

2. **Longest Increasing Subsequence (#300)** - Dynamic programming (Coupang focus) with binary search optimization. Teaches both the standard DP approach and the optimal O(n log n) solution.

3. **Minimum Window Substring (#76)** - Combines hash tables (both companies), sliding window, and string manipulation. The pattern appears in many real-world scenarios.

4. **Coin Change (#322)** - Classic DP problem that tests both memoization and bottom-up thinking. Variations appear in e-commerce contexts (payment combinations).

5. **Merge k Sorted Lists (#23)** - Tests heap/priority queue usage, which appears in both companies' questions despite not being in their top topics. Also teaches divide-and-conquer approaches.

## Which to Prepare for First

Start with **Yandex**, even if your Coupang interview comes first. Here's why:

1. **Foundation first**: Yandex's broader coverage forces you to build competency across more problem types. This foundation makes Coupang's deeper problems more approachable.

2. **Difficulty progression**: Going from Yandex's mix (Easy/Medium) to Coupang's (Medium/Hard) is psychologically easier than the reverse. You build confidence before tackling the hardest problems.

3. **Efficiency**: The overlap topics (Array, String, Hash Table) are exactly where you should start anyway. By preparing for Yandex first, you're automatically covering 70% of what Coupang tests.

4. **Time allocation**: Spend 60% of your preparation time on overlap topics, 25% on Yandex-specific patterns (mainly two pointers), and 15% on Coupang-specific patterns (mainly DP). This gives you coverage for both with minimal redundancy.

Final strategic advice: When practicing Coupang problems, always ask yourself, "How would this apply to e-commerce?" When practicing Yandex problems, focus on speed and clean implementation. For both companies, remember that explaining your thought process clearly is as important as writing correct code.

For more company-specific insights, check out our [Yandex interview guide](/company/yandex) and [Coupang interview guide](/company/coupang).
