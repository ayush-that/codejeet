---
title: "Adobe vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Adobe and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2031-02-16"
category: "tips"
tags: ["adobe", "ebay", "comparison"]
---

# Adobe vs eBay: Interview Question Comparison

If you're interviewing at both Adobe and eBay, or trying to decide where to focus your preparation, you're facing two distinct interview cultures disguised by similar topic lists. Both companies test arrays, strings, and hash tables heavily, but the interview experience, question depth, and preparation strategy differ significantly. Here's what you need to know: Adobe interviews feel like a marathon with technical depth, while eBay interviews are a sprint with practical problem-solving. The good news is that preparing for one gives you substantial overlap for the other—if you prioritize strategically.

## Question Volume and Difficulty

The numbers tell the first part of the story. Adobe has **227 tagged questions** on LeetCode (68 Easy, 129 Medium, 30 Hard), while eBay has just **60 tagged questions** (12 Easy, 38 Medium, 10 Hard).

What this means in practice:

- **Adobe's interview process is more predictable** in terms of question patterns. With 227 questions, there's a well-established corpus of problems they return to. You'll likely encounter variations of problems you've seen if you study their tagged list thoroughly. The 129 Medium questions indicate they're serious about algorithmic competency—expect problems that require multiple steps or clever optimizations.
- **eBay's smaller question bank doesn't mean easier interviews**. With 60 questions but 38 Medium and 10 Hard, their interviews are concentrated and potentially more challenging per question. You're less likely to get a question you've seen before, but more likely to get a problem that tests fundamental problem-solving under pressure.

The difficulty distribution reveals both companies prioritize Medium problems, which aligns with industry standards. However, Adobe's larger pool suggests they have more rounds or more varied question types across interviews.

## Topic Overlap

Both companies test **Array, String, and Hash Table** problems heavily. This isn't surprising—these are foundational data structures that appear in 80% of coding interviews. The overlap means preparation for one company directly benefits the other.

**Adobe's unique emphasis**: Two Pointers. This appears in their top topics but not eBay's. Adobe loves problems where you can optimize by using two indices to traverse a data structure simultaneously—think problems like "Container With Most Water" or "3Sum."

**eBay's unique emphasis**: Sorting. While sorting algorithms themselves are rarely tested, the application of sorting as a preprocessing step appears frequently in eBay questions. Problems like "Merge Intervals" or finding k-th largest elements often appear.

**Shared emphasis**: Both test Dynamic Programming and Tree problems, though these don't appear in their top five topics. Don't neglect them—they're likely to appear in later rounds or for more senior positions.

## Preparation Priority Matrix

Here's how to allocate your study time for maximum ROI:

**High Priority (Study First - Overlaps Both Companies)**

- **Hash Table applications**: Two Sum variations, Subarray Sum problems
- **String manipulation**: Palindrome checks, substring problems, character counting
- **Array traversal and manipulation**: In-place operations, sliding window, prefix sums

**Medium Priority (Adobe-Specific)**

- **Two Pointer techniques**: Problems where you maintain two indices
- **Matrix/2D Array problems**: Adobe has more grid-based questions

**Medium Priority (eBay-Specific)**

- **Sorting-based solutions**: When sorting transforms an O(n²) problem to O(n log n)
- **Greedy algorithms**: Often paired with sorting

**Specific LeetCode problems valuable for both**:

- **Two Sum (#1)**: The foundational hash table problem
- **Longest Substring Without Repeating Characters (#3)**: Tests sliding window and hash tables
- **Merge Intervals (#56)**: Appears at both companies despite not being in top topics
- **Valid Palindrome (#125)**: Simple but tests two-pointer string manipulation
- **Product of Array Except Self (#238)**: Tests array manipulation without division

## Interview Format Differences

**Adobe** typically has:

- 4-5 rounds of technical interviews for software engineering roles
- 45-60 minutes per coding round, often with 2 problems (one Easy/Medium, one Medium)
- Heavy emphasis on clean code, edge cases, and optimization
- System design for mid-level and above (often practical, product-focused designs)
- Behavioral rounds that focus on collaboration and past projects

**eBay** typically has:

- 3-4 rounds total for most engineering roles
- 45-minute coding sessions, usually one substantial Medium problem
- Focus on arriving at a working solution quickly, then optimizing
- Less emphasis on perfect syntax, more on problem-solving approach
- System design questions tend to be more scalable and less product-specific than Adobe's
- Cultural fit questions about adaptability and customer focus

The key difference: Adobe interviews feel more like a comprehensive exam, while eBay interviews feel more like a pair programming session with time constraints.

## Specific Problem Recommendations

If you're short on time and interviewing at both companies, master these 5 problems:

1. **3Sum (#15)** - Adobe loves this for two-pointer practice, and it reinforces hash table usage too. Understanding how to reduce O(n³) to O(n²) teaches pattern recognition for similar problems.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) ignoring output storage
def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates for the first element
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

                # Skip duplicates for left and right pointers
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
    // Skip duplicates for the first element
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

        // Skip duplicates for left and right pointers
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
        // Skip duplicates for the first element
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

                // Skip duplicates for left and right pointers
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

2. **Merge Intervals (#56)** - eBay tests sorting applications, and this is the canonical example. Adobe also asks interval problems frequently.

3. **Longest Palindromic Substring (#5)** - Tests both string manipulation and dynamic programming thinking. The expanding center approach is particularly elegant and shows algorithmic creativity.

4. **Subarray Sum Equals K (#560)** - Hash table application that appears in modified forms at both companies. Understanding prefix sums is crucial.

5. **Rotate Image (#48)** - Adobe asks more matrix problems, and this one teaches in-place manipulation patterns that apply to many array problems.

## Which to Prepare for First

**Prepare for Adobe first if**: You have more time before interviews, want comprehensive coverage, or are stronger at algorithmic thinking than quick problem-solving. Adobe's broader question bank will force you to learn more patterns, which then makes eBay's interviews feel more manageable.

**Prepare for eBay first if**: Your interviews are close together, you need quick wins, or you excel at thinking on your feet. eBay's focused question set lets you drill deeper on fewer patterns, and the skills transfer well to Adobe's interviews.

**The strategic approach**: Start with the overlapping topics (arrays, strings, hash tables), then add Adobe's two-pointer problems, then eBay's sorting applications. This gives you 90% coverage for both companies in the most efficient order.

Remember: Both companies ultimately want to see clean, efficient code and clear communication. The patterns matter, but so does your ability to explain your thinking and handle edge cases. Master the fundamentals first, then specialize based on which interview comes first on your calendar.

For more company-specific insights, check out our [Adobe interview guide](/company/adobe) and [eBay interview guide](/company/ebay).
