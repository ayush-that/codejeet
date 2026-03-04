---
title: "Math Questions at JPMorgan: What to Expect"
description: "Prepare for Math interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-23"
category: "dsa-patterns"
tags: ["jpmorgan", "math", "interview prep"]
---

Math matters at JPMorgan because quantitative reasoning underpins everything from risk modeling and algorithmic trading to financial forecasting and data analysis. The firm needs candidates who can think precisely under pressure, interpret numerical data accurately, and apply logical frameworks to solve problems. These 12 math questions aren't about advanced calculus; they test your foundational numeracy, pattern recognition, and ability to manipulate numbers quickly—skills directly applicable to daily tasks in finance and technology roles.

## What to Expect — Types of Problems

Expect questions focused on mental arithmetic, basic probability, percentages, ratios, and simple algebra. Common problem types include:

- **Percentage Change:** Calculating profit/loss, interest, or growth rates.
- **Ratios & Proportions:** Dividing amounts according to given ratios or solving mixture problems.
- **Probability:** Basic single-event or combined probability, often in a business context.
- **Sequences & Series:** Identifying patterns in numerical sequences.
- **Word Problems:** Translating a short financial or operational scenario into a solvable equation.

These are designed to be solved without a calculator, emphasizing speed and accuracy.

## How to Prepare — Study Tips with One Code Example

Brush up on high-school math fundamentals. Practice mental math daily—calculate tips, discounts, or percentage changes in your head. Work on interpreting word problems quickly: identify key numbers and the required output before solving.

A key pattern is using the two-pointer technique for sequence or array-based problems, which often appear in numerical reasoning forms. Below is an example of finding a target sum in a sorted array, a concept applicable to financial pairing scenarios.

<div class="code-group">

```python
def find_pair_with_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [arr[left], arr[right]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

```javascript
function findPairWithSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [arr[left], arr[right]];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}
```

```java
public int[] findPairWithSum(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return new int[]{arr[left], arr[right]};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{};
}
```

</div>

## Recommended Practice Order

1. **Master Basics:** Review percentages, ratios, and probability rules.
2. **Speed Drills:** Practice mental calculations with timed exercises.
3. **Pattern Recognition:** Work on sequence and series problems to improve quick identification.
4. **Apply to Finance:** Solve word problems set in banking contexts.
5. **Full Simulations:** Take timed practice sets that mimic the actual test format.

[Practice Math at JPMorgan](/company/jpmorgan/math)
