---
title: "Sorting Questions at Yandex: What to Expect"
description: "Prepare for Sorting interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-02-22"
category: "dsa-patterns"
tags: ["yandex", "sorting", "interview prep"]
---

If you're preparing for a Yandex interview, you've likely seen the statistic: 16 out of their 134 tagged LeetCode problems are categorized under Sorting. That's roughly 12%, a significant chunk that demands your attention. But this isn't just about being able to call `.sort()`. At Yandex, a company built on search, data organization, and massive-scale systems (like Yandex Search, Yandex.Market, and Yandex.Disk), sorting is a fundamental primitive. It's the bedrock for efficient data retrieval, merging streams of information, and optimizing real-time systems. In interviews, sorting questions are rarely about implementing Quicksort from scratch. Instead, they are a vehicle to assess your ability to recognize when sorting transforms an intractable problem into a simple one, and your skill in applying custom comparators to model complex real-world constraints.

## Specific Patterns Yandex Favors

Yandex's sorting problems heavily favor **applied sorting logic** over algorithm implementation. You will almost certainly need to master **custom sorting with keys or comparators**. The core pattern is this: you are given a list of objects (intervals, strings, points, tasks) with multiple attributes. The solution requires you to sort these objects based on a specific, often non-obvious, rule to reveal a greedy solution or enable a simple linear scan.

Two dominant sub-patterns emerge:

1.  **The "Sort by One Attribute, Process by Another" Pattern:** You sort the data by one property (e.g., start time, price, coordinate) to bring order, which then allows you to process it efficiently based on a second property (e.g., end time, profit, matching condition). This is classic in interval problems like **Merge Intervals (#56)** and **Non-overlapping Intervals (#435)**.

2.  **The "Two-Pointer After Sort" Pattern:** Sorting the array brings identical or related elements together, enabling the use of a two-pointer technique or a sliding window to find pairs, triplets, or groups that satisfy a condition. Think **3Sum (#15)** or problems where you need to minimize the difference between elements.

A quintessential Yandex-style problem that combines these ideas is **Maximum Profit in Job Scheduling (#1235)**. It's a hard problem, but the core insight is a sort followed by a DP+binary search. More commonly, you'll see problems like **Meeting Rooms II (#253)**, where sorting start and end times separately is the key to the priority queue solution.

## How to Prepare

Your preparation must move beyond memorizing O(n log n) complexities. You need to build the reflex: "Can sorting the input first simplify this?" Let's solidify the most critical skill: writing custom comparators.

Imagine a problem: "Given a list of logs, each a string where the first word is an alphanumeric identifier, sort them so that all letter-logs come before digit-logs. The letter-logs should be sorted lexicographically by their content; if the content is the same, sort by the identifier. The digit-logs maintain their relative order."

This tests your ability to decompose a string, implement a sorting key function, and understand stable sort properties. Here's how to tackle it:

<div class="code-group">

```python
def reorderLogFiles(logs):
    """
    Sorts logs according to custom rules.
    Time: O(L * N log N) where L is max log length, N is number of logs.
           (Due to splitting each log for the key function during comparisons).
    Space: O(N) for the list of letter logs and the sorting algorithm's overhead.
    """
    def sort_key(log):
        # Split the log into identifier and content
        identifier, content = log.split(" ", 1)
        # The key is a tuple. First element: 0 for letter-log, 1 for digit-log.
        # This ensures all letter-logs (0) come before digit-logs (1).
        if content[0].isalpha():
            # For letter-logs: primary key=0, then content, then identifier
            return (0, content, identifier)
        else:
            # For digit-logs: primary key=1. No further sorting.
            return (1,)

    # Use the key function. Python's sort is stable, so digit-logs keep order.
    logs.sort(key=sort_key)
    return logs
```

```javascript
function reorderLogFiles(logs) {
  /**
   * Time: O(L * N log N) | Space: O(N) (for the sorting algorithm and the letterLogs array).
   */
  const letterLogs = [];
  const digitLogs = [];

  // First, separate the logs.
  for (const log of logs) {
    const firstSpace = log.indexOf(" ");
    const content = log.substring(firstSpace + 1);
    if (content[0] >= "0" && content[0] <= "9") {
      digitLogs.push(log);
    } else {
      letterLogs.push(log);
    }
  }

  // Sort the letter logs.
  letterLogs.sort((log1, log2) => {
    const space1 = log1.indexOf(" ");
    const space2 = log2.indexOf(" ");
    const id1 = log1.substring(0, space1);
    const id2 = log2.substring(0, space2);
    const content1 = log1.substring(space1 + 1);
    const content2 = log2.substring(space2 + 1);

    if (content1 === content2) {
      // Compare identifiers if content is the same.
      return id1.localeCompare(id2);
    }
    // Otherwise, compare by content.
    return content1.localeCompare(content2);
  });

  // Concatenate sorted letter logs and digit logs (in original relative order).
  return [...letterLogs, ...digitLogs];
}
```

```java
public String[] reorderLogFiles(String[] logs) {
    /**
     * Time: O(L * N log N) | Space: O(N) (for the Comparator and sorting overhead).
     */
    Arrays.sort(logs, (log1, log2) -> {
        // Split each log into identifier and content.
        String[] split1 = log1.split(" ", 2);
        String[] split2 = log2.split(" ", 2);

        boolean isDigit1 = Character.isDigit(split1[1].charAt(0));
        boolean isDigit2 = Character.isDigit(split2[1].charAt(0));

        // Case 1: Both are letter-logs.
        if (!isDigit1 && !isDigit2) {
            int cmp = split1[1].compareTo(split2[1]);
            if (cmp != 0) {
                return cmp; // Compare by content.
            }
            return split1[0].compareTo(split2[0]); // Compare by identifier.
        }
        // Case 2: log1 is digit, log2 is letter. Bring letter up.
        if (isDigit1 && !isDigit2) {
            return 1;
        }
        // Case 3: log1 is letter, log2 is digit. Keep letter up.
        if (!isDigit1 && isDigit2) {
            return -1;
        }
        // Case 4: Both are digit-logs. Keep original order (stable sort).
        return 0;
    });
    return logs;
}
```

</div>

The second pattern to internalize is using sorting to enable a two-pointer solution. Let's look at a classic: finding all unique triplets that sum to zero.

<div class="code-group">

```python
def threeSum(nums):
    """
    Finds all unique triplets that sum to zero.
    Time: O(n^2) - Sorting is O(n log n), but the nested loop dominates.
    Space: O(1) or O(n) depending on sorting implementation. We use O(n) for output.
    """
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate values for the first element.
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                # Skip duplicates for the second element.
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
    return result
```

```javascript
function threeSum(nums) {
  /**
   * Time: O(n^2) | Space: O(1) or O(n) for sorting and output.
   */
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicate `i`

    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        // Skip duplicate `left` values
        while (left < right && nums[left] === nums[left - 1]) left++;
      }
    }
  }
  return result;
}
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    /**
     * Time: O(n^2) | Space: O(1) or O(n) for sorting and output.
     */
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // Skip duplicate `i`

        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                // Skip duplicate `left` values
                while (left < right && nums[left] == nums[left - 1]) left++;
            }
        }
    }
    return result;
}
```

</div>

## How Yandex Tests Sorting vs Other Companies

Compared to FAANG companies, Yandex's sorting questions often feel more "practical" and less "academic." At Google or Meta, you might get a sorting problem that is a thin disguise for a deep algorithmic concept (e.g., using a sorting step in a divide-and-conquer solution for counting inversions). At Amazon, sorting is frequently tied to data processing pipelines or scheduling (e.g., K Nearest Points).

Yandex sits in the middle. Their problems frequently model scenarios relevant to their business: ordering search results, scheduling data center tasks, or merging geospatial data streams. The unique aspect is the **emphasis on correctness with edge cases** derived from real data—empty lists, duplicate values, ties in sorting keys, and stability requirements. They test not just if you know the pattern, but if you can implement it robustly.

## Study Order

Tackle sorting in this logical sequence:

1.  **Master Built-in Sort & Custom Comparators:** Before anything else, be fluent in sorting primitives, strings, and custom objects in your language of choice. This is 80% of the battle.
2.  **"Sort First, Ask Questions Later" Pattern:** Practice problems where the entire solution is just sorting plus a simple linear scan or aggregation (e.g., **Meeting Rooms (#252)**, **Maximum Product of Three Numbers (#628)**). This builds the reflex.
3.  **Two-Pointer on Sorted Arrays:** Deepen your skills with problems that require sorting to enable two-pointer techniques, like **Two Sum II (#167)** and **3Sum (#15)**.
4.  **Greedy Scheduling with Sorting:** This is a Yandex staple. Learn to sort intervals by start or end time to solve problems like **Merge Intervals (#56)**, **Non-overlapping Intervals (#435)**, and **Meeting Rooms II (#253)**.
5.  **Advanced Applications:** Finally, tackle problems where sorting is one key step in a more complex algorithm, such as **Largest Number (#179)** (custom string comparator) or **Queue Reconstruction by Height (#406)** (multi-attribute sorting and insertion).

## Recommended Practice Order

Solve these problems in sequence to build competence progressively:

1.  **Sort Colors (#75)** - In-place partitioning (a form of sorting). Basic.
2.  **Meeting Rooms (#252)** - The simplest "sort and scan" pattern.
3.  **K Closest Points to Origin (#973)** - Custom sort by a computed key.
4.  **Merge Intervals (#56)** - Foundational interval sorting pattern.
5.  **Non-overlapping Intervals (#435)** - Greedy choice after sorting by end time.
6.  **3Sum (#15)** - Classic two-pointer after sort.
7.  **Reorder Data in Log Files (#937)** - Advanced custom comparator practice.
8.  **Queue Reconstruction by Height (#406)** - Clever multi-step sort and insert logic.

Remember, at Yandex, sorting is less about the algorithm's internals and more about wielding it as a tool to impose order on chaos. Your goal is to demonstrate you can identify when order enables efficiency and implement the sorting logic flawlessly.

[Practice Sorting at Yandex](/company/yandex/sorting)
