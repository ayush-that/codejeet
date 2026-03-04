---
title: "Two Pointers Questions at Yandex: What to Expect"
description: "Prepare for Two Pointers interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-03-07"
category: "dsa-patterns"
tags: ["yandex", "two-pointers", "interview prep"]
---

Two Pointers is a critical pattern for Yandex interviews, appearing in over 20% of their technical problems. With 27 specific Two Pointers questions in their question bank, mastery of this technique is non-negotiable. Yandex, handling massive datasets in search, maps, and machine learning, frequently tests for efficient, in-place array and string manipulation—the exact domain where Two Pointers excels. Failing to recognize or implement this pattern can lead to suboptimal O(n²) solutions, which will likely disqualify you in a performance-focused interview.

## What to Expect — Types of Problems

Yandex’s Two Pointers problems generally fall into three categories. First, **opposite-direction pointers** are used for problems like two-sum in a sorted array or reversing a string. Second, **same-direction (fast & slow) pointers** appear in cycle detection (Floyd’s algorithm) or removing duplicates from a sorted array. Third, **sliding window** variants, which are a specialized form of Two Pointers, are common for finding subarrays or substrings that meet a condition, such as the longest substring without repeating characters. Expect problems that involve sorted arrays, linked lists, or strings, often requiring O(n) time and O(1) space.

## How to Prepare — Study Tips with One Code Example

Focus on identifying the pattern: if a problem involves a sorted array or requires comparing/processing elements in a sequence with O(1) extra space, Two Pointers is likely the approach. Practice writing clean, bug-free pointer movement logic. Always consider edge cases: empty input, single element, or all identical elements. Below is a classic example: removing duplicates from a sorted array in-place, returning the new length. This uses same-direction pointers.

<div class="code-group">

```python
def removeDuplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}
```

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```

</div>

## Recommended Practice Order

Start with fundamental opposite-direction problems like two-sum on a sorted array. Then, practice same-direction problems such as the duplicate removal shown above. Move on to sliding window problems for subarray sums. Finally, tackle Yandex’s specific tagged questions, beginning with the highest frequency. This builds from pattern recognition to company-specific application.

[Practice Two Pointers at Yandex](/company/yandex/two-pointers)
