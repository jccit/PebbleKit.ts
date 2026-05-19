#pragma once

typedef struct {
  const char *name;
} Test;

typedef struct {
  const char *name;
  const Test *tests;
  int test_count;
} Category;

// Registered categories, in display order. Defined in tests/registry.c.
extern const Category *const s_categories[];
extern const int NUM_CATEGORIES;

// Fills `out` with every test across every category, in registration order.
// Returns the number of tests written (capped at `max`).
int tests_flatten_all(Test *out, int max);
