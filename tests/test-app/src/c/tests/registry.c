#include "../tests.h"

extern const Category category_appmessage;
extern const Category category_fetch;
extern const Category category_timeline;

const Category *const s_categories[] = {
    &category_appmessage,
    &category_fetch,
    &category_timeline,
};
const int NUM_CATEGORIES =
    sizeof(s_categories) / sizeof(s_categories[0]);

int tests_flatten_all(Test *out, int max) {
  int idx = 0;
  for (int c = 0; c < NUM_CATEGORIES; c++) {
    const Category *cat = s_categories[c];
    for (int t = 0; t < cat->test_count && idx < max; t++) {
      out[idx++] = cat->tests[t];
    }
  }
  return idx;
}

int tests_flatten_ci(Test *out, int max) {
  int idx = 0;
  for (int c = 0; c < NUM_CATEGORIES; c++) {
    const Category *cat = s_categories[c];
    if (cat == &category_timeline) continue;
    for (int t = 0; t < cat->test_count && idx < max; t++) {
      out[idx++] = cat->tests[t];
    }
  }
  return idx;
}
