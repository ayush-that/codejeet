---
title: "Uber vs Yandex: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Yandex — difficulty levels, topic focus, and preparation strategy."
date: "2030-02-17"
category: "tips"
tags: ["uber", "yandex", "comparison"]
---

# Uber vs Yandex: Interview Question Comparison

If you're preparing for interviews at both Uber and Yandex, you're looking at two distinct technical cultures with different priorities. Uber, the global ride-hailing giant, has a mature interview process that emphasizes algorithmic depth and system design at scale. Yandex, Russia's tech leader often called "Russia's Google," has a more focused technical interview with stronger emphasis on algorithmic fundamentals and implementation correctness. The good news: there's significant overlap in their core testing areas, so you can prepare efficiently for both.

## Question Volume and Difficulty

The raw numbers tell an important story about interview intensity:

**Uber (381 questions)**

- Easy: 54 (14%)
- Medium: 224 (59%)
- Hard: 103 (27%)

**Yandex (134 questions)**

- Easy: 52 (39%)
- Medium: 72 (54%)
- Hard: 10 (7%)

Uber's question bank is nearly three times larger than Yandex's, reflecting both their longer history of technical interviews and broader scope of problems. More importantly, look at the difficulty distribution: Uber has over twice the percentage of hard problems (27% vs 7%). This doesn't necessarily mean Uber interviews are harder, but it suggests they're more likely to include at least one challenging problem that requires deeper algorithmic insight or optimization.

Yandex's distribution is more beginner-friendly on paper, but don't be fooled. Their medium problems often require clean, efficient implementations with careful edge case handling. The lower hard percentage might reflect a different philosophy: they'd rather see perfect solutions to medium problems than partial solutions to hard ones.

## Topic Overlap

Both companies heavily test three core data structures:

1. **Arrays** - The foundation of most algorithmic problems
2. **Hash Tables** - For O(1) lookups and frequency counting
3. **Strings** - Manipulation, parsing, and pattern matching

Where they diverge is telling:

**Uber-specific emphasis:**

- **Dynamic Programming** - Appears frequently in their question bank
- **Graphs** - Ride-matching and routing problems naturally lead to graph algorithms
- **System Design** - At senior levels, expect deep distributed systems discussions

**Yandex-specific emphasis:**

- **Two Pointers** - A surprisingly high frequency in their problems
- **Sorting** - Often combined with other techniques
- **Implementation-heavy problems** - Less abstract, more "build this thing that works"

The overlap means you get excellent ROI on studying arrays, hash tables, and strings. Master these, and you're 60-70% prepared for both companies.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**Tier 1: Overlap Topics (Study First)**

- Arrays (sliding window, prefix sums, rotation)
- Hash Tables (frequency counting, two-sum variations)
- Strings (parsing, manipulation, basic pattern matching)

**Tier 2: Uber-Specific Priority**

- Dynamic Programming (start with 1D, then 2D)
- Graph Algorithms (BFS/DFS, Dijkstra for routing problems)
- System Design (focus on location-based services, surge pricing, distributed queues)

**Tier 3: Yandex-Specific Priority**

- Two Pointers (especially for sorted arrays and string manipulation)
- Sorting with custom comparators
- Implementation problems (less algorithmically clever, more "get it working correctly")

**Recommended overlap problems:**

- Two Sum (#1) - Tests hash table fundamentals
- Valid Parentheses (#20) - Tests stack usage with strings
- Merge Intervals (#56) - Tests array sorting and merging logic
- Group Anagrams (#49) - Tests hash table creativity with strings

## Interview Format Differences

**Uber's Process:**

- Typically 4-5 rounds for software engineering roles
- 45-60 minutes per coding round, often 2 problems per round
- Heavy emphasis on system design for mid-level and above (separate 60-minute round)
- Behavioral questions ("Uber Principles") integrated throughout
- Virtual or on-site, with strong preference for running code

**Yandex's Process:**

- Typically 3-4 technical rounds
- 60-90 minutes per round, often 1-2 problems with deeper discussion
- Less emphasis on pure system design, more on algorithmic optimization
- More likely to ask follow-ups: "Can you make it faster? Use less memory?"
- Often includes practical implementation questions (not just algorithms)

Key insight: Uber interviews move faster with more problems, while Yandex interviews dive deeper into fewer problems. For Uber, practice solving quickly and explaining as you go. For Yandex, practice optimizing solutions and handling follow-up questions.

## Specific Problem Recommendations

These problems provide maximum value for both companies:

1. **3Sum (#15)** - Combines arrays, sorting, and two pointers. Uber asks variations for matching riders/drivers; Yandex loves the two-pointer implementation.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) ignoring output storage
def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1

    return result
```

```javascript
// Time: O(n²) | Space: O(1) ignoring output storage
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        // Skip duplicates
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
// Time: O(n²) | Space: O(1) ignoring output storage
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        // Skip duplicates
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1;
        int right = nums.length - 1;

        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];

            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                // Skip duplicates
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            }
        }
    }

    return result;
}
```

</div>

2. **LRU Cache (#146)** - Tests hash table + doubly linked list implementation. Uber uses caches extensively in their systems; Yandex values the clean O(1) implementation.

3. **Word Break (#139)** - Dynamic programming with strings. Covers Uber's DP emphasis while using string manipulation that Yandex tests.

4. **Merge k Sorted Lists (#23)** - Tests heap/priority queue usage. Uber might relate it to merging ride requests; Yandex values the efficient merging algorithm.

5. **Find All Anagrams in a String (#438)** - Sliding window with hash table. Perfect overlap problem that's medium difficulty but tests multiple concepts.

## Which to Prepare for First

Start with **Yandex's core topics**, then layer on **Uber's additional requirements**. Here's why:

1. Yandex's focus on fundamentals (arrays, hash tables, two pointers) builds the foundation Uber expects
2. Mastering medium problems perfectly (Yandex's style) is easier than tackling hard problems (Uber's style)
3. You can add DP and graph algorithms later without losing the fundamentals

Spend 60% of your time on overlap topics, 30% on Uber-specific topics, and 10% on Yandex-specific topics. If you're short on time, skip the Yandex-specific focus—their overlap with Uber is substantial enough that Uber prep covers most of what Yandex tests.

Remember: Uber's process is more marathon-like (more rounds, more problems), while Yandex's is more sprint-like (deeper focus on fewer problems). Train accordingly.

For more company-specific insights, check out our [Uber interview guide](/company/uber) and [Yandex interview guide](/company/yandex).
