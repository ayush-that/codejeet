---
title: "How to Solve Reward Top K Students — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reward Top K Students. Medium difficulty, 46.8% acceptance rate. Topics: Array, Hash Table, String, Sorting, Heap (Priority Queue)."
date: "2029-05-06"
category: "dsa-patterns"
tags: ["reward-top-k-students", "array", "hash-table", "string", "medium"]
---

# How to Solve Reward Top K Students

This problem asks us to rank students based on their feedback reports. We're given lists of positive and negative feedback words, student IDs, and their feedback reports. Each positive word in a report adds 3 points, each negative word subtracts 1 point, and we need to return the IDs of the top K students sorted by score (descending), with ties broken by student ID (ascending).

What makes this problem interesting is the combination of string processing, scoring calculation, and custom sorting. The tricky parts are efficiently checking for feedback words in reports and handling the ranking logic correctly.

## Visual Walkthrough

Let's trace through a small example:

**Input:**

- Positive feedback: ["smart", "brilliant", "studious"]
- Negative feedback: ["not"]
- Student reports: ["this student is studious", "the student is smart"]
- Student IDs: [1, 2]
- k = 2

**Step 1: Convert feedback words to sets for O(1) lookup**

- Positive set: {"smart", "brilliant", "studious"}
- Negative set: {"not"}

**Step 2: Process student 1 (ID: 1, report: "this student is studious")**

- Split report into words: ["this", "student", "is", "studious"]
- Check each word:
  - "this": not in positive or negative → no change
  - "student": not in positive or negative → no change
  - "is": not in positive or negative → no change
  - "studious": in positive set → add 3 points
- Total score: 3

**Step 3: Process student 2 (ID: 2, report: "the student is smart")**

- Split report: ["the", "student", "is", "smart"]
- Check each word:
  - "the": not in positive or negative → no change
  - "student": not in positive or negative → no change
  - "is": not in positive or negative → no change
  - "smart": in positive set → add 3 points
- Total score: 3

**Step 4: Sort students**
We have: [(ID: 1, score: 3), (ID: 2, score: 3)]
Both have same score, so sort by ID ascending: [1, 2]

**Step 5: Return top k = 2 students**
Result: [1, 2]

## Brute Force Approach

A naive approach would be:

1. For each student, split their report into words
2. For each word, check if it exists in the positive_feedback array (O(n) search)
3. If found, add 3 points
4. Otherwise, check if it exists in the negative_feedback array (O(n) search)
5. If found, subtract 1 point
6. After calculating all scores, sort all students by score descending, then ID ascending
7. Return first k IDs

The problem with this approach is the word checking. Searching through arrays for each word takes O(P + N) time per word, where P and N are the lengths of positive and negative feedback arrays. With S students and W words per report, this becomes O(S × W × (P + N)), which is inefficient.

<div class="code-group">

```python
# Brute Force Solution - Too Slow
# Time: O(S * W * (P + N)) | Space: O(S)
def topStudentsBrute(positive_feedback, negative_feedback, report, student_id, k):
    scores = []

    for i in range(len(student_id)):
        score = 0
        words = report[i].split()

        for word in words:
            # Inefficient linear search
            if word in positive_feedback:
                score += 3
            elif word in negative_feedback:
                score -= 1

        scores.append((student_id[i], score))

    # Sort by score descending, then ID ascending
    scores.sort(key=lambda x: (-x[1], x[0]))

    # Return top k IDs
    return [id for id, _ in scores[:k]]
```

```javascript
// Brute Force Solution - Too Slow
// Time: O(S * W * (P + N)) | Space: O(S)
function topStudentsBrute(positive_feedback, negative_feedback, report, student_id, k) {
  const scores = [];

  for (let i = 0; i < student_id.length; i++) {
    let score = 0;
    const words = report[i].split(" ");

    for (const word of words) {
      // Inefficient linear search
      if (positive_feedback.includes(word)) {
        score += 3;
      } else if (negative_feedback.includes(word)) {
        score -= 1;
      }
    }

    scores.push([student_id[i], score]);
  }

  // Sort by score descending, then ID ascending
  scores.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0] - b[0];
  });

  // Return top k IDs
  return scores.slice(0, k).map((item) => item[0]);
}
```

```java
// Brute Force Solution - Too Slow
// Time: O(S * W * (P + N)) | Space: O(S)
import java.util.*;

public List<Integer> topStudentsBrute(String[] positive_feedback, String[] negative_feedback,
                                      String[] report, int[] student_id, int k) {
    List<int[]> scores = new ArrayList<>();

    for (int i = 0; i < student_id.length; i++) {
        int score = 0;
        String[] words = report[i].split(" ");

        for (String word : words) {
            // Inefficient linear search
            if (Arrays.asList(positive_feedback).contains(word)) {
                score += 3;
            } else if (Arrays.asList(negative_feedback).contains(word)) {
                score -= 1;
            }
        }

        scores.add(new int[]{student_id[i], score});
    }

    // Sort by score descending, then ID ascending
    scores.sort((a, b) -> {
        if (b[1] != a[1]) return b[1] - a[1];
        return a[0] - b[0];
    });

    // Return top k IDs
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < k && i < scores.size(); i++) {
        result.add(scores.get(i)[0]);
    }
    return result;
}
```

</div>

## Optimized Approach

The key insight is that we need O(1) lookups for feedback words. We can achieve this by converting the positive and negative feedback arrays into HashSets. This reduces the word checking time from O(P + N) to O(1) per word.

The optimization steps are:

1. **Convert to Sets**: Store positive and negative words in HashSets for constant-time lookups
2. **Calculate Scores Efficiently**: For each student, split their report and check each word against the sets
3. **Store Results**: Keep track of (student_id, score) pairs
4. **Sort with Custom Comparator**: Sort by score descending, then by student_id ascending
5. **Return Top K**: Extract the first k student IDs

This approach reduces the time complexity from O(S × W × (P + N)) to O(S × W + S log S), where S is the number of students and W is the average words per report.

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution
# Time: O(S * W + S log S) where S = number of students, W = average words per report
# Space: O(P + N + S) for sets and scores list
def topStudents(positive_feedback, negative_feedback, report, student_id, k):
    # Step 1: Convert feedback lists to sets for O(1) lookups
    positive_set = set(positive_feedback)
    negative_set = set(negative_feedback)

    # Step 2: Calculate scores for each student
    scores = []
    for i in range(len(student_id)):
        score = 0
        # Split report into individual words
        words = report[i].split()

        # Check each word against feedback sets
        for word in words:
            if word in positive_set:
                score += 3  # Positive word adds 3 points
            elif word in negative_set:
                score -= 1  # Negative word subtracts 1 point

        # Store student ID and their calculated score
        scores.append((student_id[i], score))

    # Step 3: Sort by score descending, then by student_id ascending
    # Using -score for descending order, then id for ascending
    scores.sort(key=lambda x: (-x[1], x[0]))

    # Step 4: Extract top k student IDs
    result = []
    for i in range(min(k, len(scores))):
        result.append(scores[i][0])

    return result
```

```javascript
// Optimal Solution
// Time: O(S * W + S log S) where S = number of students, W = average words per report
// Space: O(P + N + S) for sets and scores array
function topStudents(positive_feedback, negative_feedback, report, student_id, k) {
  // Step 1: Convert feedback arrays to sets for O(1) lookups
  const positiveSet = new Set(positive_feedback);
  const negativeSet = new Set(negative_feedback);

  // Step 2: Calculate scores for each student
  const scores = [];
  for (let i = 0; i < student_id.length; i++) {
    let score = 0;
    // Split report into individual words
    const words = report[i].split(" ");

    // Check each word against feedback sets
    for (const word of words) {
      if (positiveSet.has(word)) {
        score += 3; // Positive word adds 3 points
      } else if (negativeSet.has(word)) {
        score -= 1; // Negative word subtracts 1 point
      }
    }

    // Store student ID and their calculated score
    scores.push([student_id[i], score]);
  }

  // Step 3: Sort by score descending, then by student_id ascending
  scores.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Higher score first
    }
    return a[0] - b[0]; // Lower ID first for ties
  });

  // Step 4: Extract top k student IDs
  const result = [];
  for (let i = 0; i < Math.min(k, scores.length); i++) {
    result.push(scores[i][0]);
  }

  return result;
}
```

```java
// Optimal Solution
// Time: O(S * W + S log S) where S = number of students, W = average words per report
// Space: O(P + N + S) for sets and scores list
import java.util.*;

public List<Integer> topStudents(String[] positive_feedback, String[] negative_feedback,
                                 String[] report, int[] student_id, int k) {
    // Step 1: Convert feedback arrays to sets for O(1) lookups
    Set<String> positiveSet = new HashSet<>(Arrays.asList(positive_feedback));
    Set<String> negativeSet = new HashSet<>(Arrays.asList(negative_feedback));

    // Step 2: Calculate scores for each student
    List<int[]> scores = new ArrayList<>();
    for (int i = 0; i < student_id.length; i++) {
        int score = 0;
        // Split report into individual words
        String[] words = report[i].split(" ");

        // Check each word against feedback sets
        for (String word : words) {
            if (positiveSet.contains(word)) {
                score += 3;  // Positive word adds 3 points
            } else if (negativeSet.contains(word)) {
                score -= 1;  // Negative word subtracts 1 point
            }
        }

        // Store student ID and their calculated score
        scores.add(new int[]{student_id[i], score});
    }

    // Step 3: Sort by score descending, then by student_id ascending
    scores.sort((a, b) -> {
        if (b[1] != a[1]) {
            return b[1] - a[1];  // Higher score first
        }
        return a[0] - b[0];  // Lower ID first for ties
    });

    // Step 4: Extract top k student IDs
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < Math.min(k, scores.size()); i++) {
        result.add(scores.get(i)[0]);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(S × W + S log S)**

- **S**: Number of students
- **W**: Average number of words per report

Breaking it down:

1. **Building sets**: O(P + N) where P and N are positive/negative feedback counts
2. **Calculating scores**: O(S × W) - for each student, we process each word in their report
3. **Sorting**: O(S log S) - sorting the list of students by score and ID
4. **Extracting results**: O(k) - getting the top k IDs

The dominant terms are O(S × W) for score calculation and O(S log S) for sorting.

**Space Complexity: O(P + N + S)**

- O(P + N): Storing positive and negative words in sets
- O(S): Storing the scores list with student IDs and their scores

## Common Mistakes

1. **Not using sets for O(1) lookups**: The most common mistake is checking words against arrays using linear search. This makes the solution O(S × W × (P + N)) instead of O(S × W + S log S).

2. **Incorrect sorting order**: Forgetting that we need to sort by score descending first, then by student_id ascending. Some candidates sort only by score or get the tie-breaking order wrong.

3. **Case sensitivity issues**: The problem doesn't specify case sensitivity, but in practice, feedback words and report words should be compared exactly as given. Don't convert to lowercase unless specified.

4. **Not handling empty reports or edge cases**: Always consider what happens if a report is empty, if k is larger than the number of students, or if there are no feedback words at all.

5. **Splitting words incorrectly**: Using simple space splitting without considering punctuation. The problem states reports contain words separated by spaces, so standard split() works, but be aware of edge cases in similar problems.

## When You'll See This Pattern

This problem combines several common patterns:

1. **String Processing with Hash Lookups**: Similar to word frequency problems where you need to check if words exist in a dictionary. Related problems:
   - [Word Pattern](https://leetcode.com/problems/word-pattern/) - Matching words to patterns using hash maps
   - [Most Common Word](https://leetcode.com/problems/most-common-word/) - Counting word frequencies with exclusions

2. **Custom Sorting with Multiple Criteria**: Sorting objects by primary key descending and secondary key ascending. Related problems:
   - [Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/) - Sort by height descending, then by k ascending
   - [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) - Sort by frequency descending, then character ascending

3. **Top K Elements**: Finding the highest ranked items based on a scoring function. Related problems:
   - [K Highest Ranked Items Within a Price Range](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range/) - Multi-criteria ranking with BFS
   - [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/) - Word frequency with custom sorting

## Key Takeaways

1. **Use hash sets for O(1) membership testing** when you need to check if elements exist in a collection. This is especially important when the check happens repeatedly in loops.

2. **Master custom comparators** for sorting by multiple criteria. Remember that for descending order, you typically compare b to a, and for ascending order, a to b.

3. **Break complex problems into clear steps**: 1) Preprocess data (build sets), 2) Calculate scores, 3) Sort results, 4) Extract answer. This makes your solution easier to explain and implement.

4. **Always consider edge cases**: What if k > number of students? What if reports are empty? What if there are no feedback words? Thinking about these shows thoroughness.

Related problems: [Queue Reconstruction by Height](/problem/queue-reconstruction-by-height), [K Highest Ranked Items Within a Price Range](/problem/k-highest-ranked-items-within-a-price-range)
