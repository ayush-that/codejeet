---
title: "How to Solve Find All Possible Recipes from Given Supplies — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Possible Recipes from Given Supplies. Medium difficulty, 56.8% acceptance rate. Topics: Array, Hash Table, String, Graph Theory, Topological Sort."
date: "2028-06-22"
category: "dsa-patterns"
tags: ["find-all-possible-recipes-from-given-supplies", "array", "hash-table", "string", "medium"]
---

# How to Solve "Find All Possible Recipes from Given Supplies"

This problem asks you to determine which recipes can be created given a list of available supplies and recipes that may depend on other recipes as ingredients. The tricky part is that recipes can depend on other recipes, creating a dependency chain that requires careful processing to resolve.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

```
recipes = ["bread", "sandwich"]
ingredients = [["yeast", "flour"], ["bread", "ham"]]
supplies = ["yeast", "flour", "ham"]
```

We want to find all recipes we can make starting with our supplies.

**Step 1:** We can check "bread" first. Its ingredients are ["yeast", "flour"]. Both "yeast" and "flour" are in our supplies, so we can make "bread". We add "bread" to our available supplies.

**Step 2:** Now we check "sandwich". Its ingredients are ["bread", "ham"]. "ham" is in our original supplies, and "bread" is now available because we just made it. So we can make "sandwich".

**Key Insight:** Notice that after making "bread", we need to re-check "sandwich" because it depends on "bread". This suggests we need to keep checking recipes until no new recipes can be made.

**Another Example with Circular Dependency:**

```
recipes = ["bread", "toast"]
ingredients = [["toast", "flour"], ["bread", "butter"]]
supplies = ["flour", "butter"]
```

Here, "bread" needs "toast", and "toast" needs "bread" - a circular dependency. Neither can be made because neither has all its ingredients available initially, and making one won't help the other.

## Brute Force Approach

A naive approach would be to repeatedly scan through all recipes, checking if each recipe's ingredients are available in our current supplies. When we find a recipe we can make, we add it to our supplies and start over from the beginning.

**Why this is problematic:**

1. **Inefficient:** In the worst case, we might scan through all recipes O(n) times, where n is the number of recipes, giving us O(n²) time complexity.
2. **Circular Dependencies:** We need to be careful to avoid infinite loops when recipes depend on each other.
3. **Repeated Work:** We check the same recipes over and over even when we know we can't make them yet.

While this brute force approach would eventually give the correct answer (by trying all recipes repeatedly until no new recipes can be made), it's inefficient for larger inputs.

## Optimized Approach

The key insight is recognizing this as a **graph dependency problem** similar to topological sorting. Each recipe is a node, and its ingredients are dependencies. We can use **Kahn's Algorithm** (the BFS topological sort approach) to efficiently process recipes in the correct order.

**Step-by-step reasoning:**

1. **Build a dependency graph:** For each recipe, track which other recipes depend on it. If recipe A needs ingredient B (which is itself a recipe), then B has a dependency from A.

2. **Track in-degrees:** For each recipe, count how many ingredients it has that are NOT initially available as supplies. This is like the "in-degree" in topological sort.

3. **Start with available recipes:** Any recipe whose ingredients are all initially available can be made immediately. Add these to a queue.

4. **Process recipes BFS-style:** When we make a recipe, we add it to our supplies and check all recipes that depend on it. For each dependent recipe, we decrement its "missing ingredients" count. If that count reaches zero, we can now make that recipe too.

5. **Handle base ingredients:** Supplies that aren't recipes are always available and don't need processing.

This approach efficiently processes each recipe only when all its dependencies are satisfied, avoiding repeated checks.

## Optimal Solution

Here's the complete solution using topological sort (Kahn's Algorithm):

<div class="code-group">

```python
# Time: O(V + E) where V = number of recipes + ingredients, E = dependencies
# Space: O(V + E) for the graph and supporting data structures
from collections import deque, defaultdict

def findAllRecipes(recipes, ingredients, supplies):
    """
    Find all recipes that can be made given initial supplies.

    Args:
        recipes: List of recipe names
        ingredients: List of lists, ingredients[i] are needed for recipes[i]
        supplies: List of initially available items

    Returns:
        List of recipes that can be created
    """
    # Convert supplies to a set for O(1) lookups
    available = set(supplies)

    # Graph: recipe -> list of recipes that depend on it
    graph = defaultdict(list)

    # in_degree[recipe] = number of ingredients still needed
    in_degree = {}

    # Initialize in_degree for all recipes
    for i, recipe in enumerate(recipes):
        # Count ingredients that are not initially available
        missing_count = 0
        for ingredient in ingredients[i]:
            if ingredient not in available:
                missing_count += 1
                # Add dependency: ingredient (if it's a recipe) -> current recipe
                if ingredient in set(recipes):
                    graph[ingredient].append(recipe)

        in_degree[recipe] = missing_count

    # Queue for recipes that can be made immediately (missing_count = 0)
    queue = deque()
    for recipe in recipes:
        if in_degree[recipe] == 0:
            queue.append(recipe)

    # Result list
    result = []

    # Process recipes in topological order
    while queue:
        current_recipe = queue.popleft()
        result.append(current_recipe)

        # Add this recipe to available supplies
        available.add(current_recipe)

        # Update all recipes that depend on this one
        for dependent in graph[current_recipe]:
            in_degree[dependent] -= 1
            if in_degree[dependent] == 0:
                queue.append(dependent)

    return result
```

```javascript
// Time: O(V + E) where V = number of recipes + ingredients, E = dependencies
// Space: O(V + E) for the graph and supporting data structures
function findAllRecipes(recipes, ingredients, supplies) {
  /**
   * Find all recipes that can be made given initial supplies.
   *
   * @param {string[]} recipes - List of recipe names
   * @param {string[][]} ingredients - ingredients[i] are needed for recipes[i]
   * @param {string[]} supplies - List of initially available items
   * @return {string[]} - Recipes that can be created
   */

  // Convert supplies to a Set for O(1) lookups
  const available = new Set(supplies);

  // Graph: recipe -> array of recipes that depend on it
  const graph = new Map();

  // inDegree[recipe] = number of ingredients still needed
  const inDegree = new Map();

  // Create a Set of all recipe names for quick lookup
  const recipeSet = new Set(recipes);

  // Initialize inDegree for all recipes
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let missingCount = 0;

    // Count ingredients that are not initially available
    for (const ingredient of ingredients[i]) {
      if (!available.has(ingredient)) {
        missingCount++;
        // Add dependency if ingredient is itself a recipe
        if (recipeSet.has(ingredient)) {
          if (!graph.has(ingredient)) {
            graph.set(ingredient, []);
          }
          graph.get(ingredient).push(recipe);
        }
      }
    }

    inDegree.set(recipe, missingCount);
  }

  // Queue for recipes that can be made immediately (missingCount = 0)
  const queue = [];
  for (const recipe of recipes) {
    if (inDegree.get(recipe) === 0) {
      queue.push(recipe);
    }
  }

  // Result array
  const result = [];

  // Process recipes in topological order
  while (queue.length > 0) {
    const currentRecipe = queue.shift();
    result.push(currentRecipe);

    // Add this recipe to available supplies
    available.add(currentRecipe);

    // Update all recipes that depend on this one
    const dependents = graph.get(currentRecipe) || [];
    for (const dependent of dependents) {
      const newDegree = inDegree.get(dependent) - 1;
      inDegree.set(dependent, newDegree);

      if (newDegree === 0) {
        queue.push(dependent);
      }
    }
  }

  return result;
}
```

```java
// Time: O(V + E) where V = number of recipes + ingredients, E = dependencies
// Space: O(V + E) for the graph and supporting data structures
import java.util.*;

class Solution {
    public List<String> findAllRecipes(String[] recipes, List<List<String>> ingredients, String[] supplies) {
        /**
         * Find all recipes that can be made given initial supplies.
         *
         * @param recipes - Array of recipe names
         * @param ingredients - ingredients.get(i) are needed for recipes[i]
         * @param supplies - Array of initially available items
         * @return List of recipes that can be created
         */

        // Convert supplies to a Set for O(1) lookups
        Set<String> available = new HashSet<>(Arrays.asList(supplies));

        // Graph: recipe -> list of recipes that depend on it
        Map<String, List<String>> graph = new HashMap<>();

        // inDegree[recipe] = number of ingredients still needed
        Map<String, Integer> inDegree = new HashMap<>();

        // Create a Set of all recipe names for quick lookup
        Set<String> recipeSet = new HashSet<>(Arrays.asList(recipes));

        // Initialize inDegree for all recipes
        for (int i = 0; i < recipes.length; i++) {
            String recipe = recipes[i];
            int missingCount = 0;

            // Count ingredients that are not initially available
            for (String ingredient : ingredients.get(i)) {
                if (!available.contains(ingredient)) {
                    missingCount++;
                    // Add dependency if ingredient is itself a recipe
                    if (recipeSet.contains(ingredient)) {
                        graph.computeIfAbsent(ingredient, k -> new ArrayList<>()).add(recipe);
                    }
                }
            }

            inDegree.put(recipe, missingCount);
        }

        // Queue for recipes that can be made immediately (missingCount = 0)
        Queue<String> queue = new LinkedList<>();
        for (String recipe : recipes) {
            if (inDegree.get(recipe) == 0) {
                queue.offer(recipe);
            }
        }

        // Result list
        List<String> result = new ArrayList<>();

        // Process recipes in topological order
        while (!queue.isEmpty()) {
            String currentRecipe = queue.poll();
            result.add(currentRecipe);

            // Add this recipe to available supplies
            available.add(currentRecipe);

            // Update all recipes that depend on this one
            List<String> dependents = graph.getOrDefault(currentRecipe, new ArrayList<>());
            for (String dependent : dependents) {
                int newDegree = inDegree.get(dependent) - 1;
                inDegree.put(dependent, newDegree);

                if (newDegree == 0) {
                    queue.offer(dependent);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(V + E)

- V = number of recipes + unique ingredients that are recipes
- E = number of dependencies between recipes (when one recipe needs another as ingredient)
- We process each recipe once when it becomes available (O(V))
- We traverse each dependency edge once when updating in-degrees (O(E))

**Space Complexity:** O(V + E)

- We store the graph (adjacency list) which takes O(V + E) space
- We store in-degree counts for all recipes (O(V))
- We store available supplies (O(V))
- The queue can hold up to O(V) recipes in the worst case

## Common Mistakes

1. **Not handling circular dependencies:** If recipes A and B need each other, a naive BFS might get stuck. The topological sort approach naturally handles this because recipes only get processed when their in-degree reaches 0, which never happens for circular dependencies.

2. **Forgetting that supplies can be used multiple times:** Some candidates think they "consume" supplies when making a recipe. Remember that once you make a recipe, it becomes available for all future recipes.

3. **Inefficient ingredient lookup:** Using a list for supplies and checking `if ingredient in supplies_list` gives O(n) lookups instead of O(1) with a set. This can make your solution too slow for large inputs.

4. **Not distinguishing between recipes and regular ingredients:** When building the dependency graph, only add edges when an ingredient is itself a recipe. Regular supplies don't create dependencies.

## When You'll See This Pattern

This topological sort pattern appears in many dependency resolution problems:

1. **Course Schedule II (LeetCode 210):** Almost identical structure - courses have prerequisites, similar to recipes having ingredients. The solution uses the exact same Kahn's Algorithm.

2. **Build Order (Cracking the Coding Interview 4.7):** Given projects and dependencies, find a build order. This is the same topological sort problem.

3. **Alien Dictionary (LeetCode 269):** While more complex, it also uses topological sort to determine order from partial information.

The key signal is when you see problems about dependencies, prerequisites, or requirements that need to be satisfied in a specific order.

## Key Takeaways

1. **Recognize dependency graphs:** When you see "A requires B" relationships, think of building a directed graph and using topological sort.

2. **Kahn's Algorithm is your friend:** For dependency resolution with BFS, Kahn's Algorithm (tracking in-degrees) is often the cleanest solution.

3. **Sets for fast lookups:** When you need to frequently check membership (like checking if an ingredient is available), always use a HashSet/Set for O(1) lookups instead of O(n) list searches.

Related problems: [Course Schedule II](/problem/course-schedule-ii), [Count Good Meals](/problem/count-good-meals)
