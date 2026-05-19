#include "../tests.h"

static const Test s_tests[] = {
    {"getTimelineToken"},
    {"insertTimelinePin"},
    {"deleteTimelinePin"},
};

const Category category_timeline = {
    .name = "timeline",
    .tests = s_tests,
    .test_count = sizeof(s_tests) / sizeof(s_tests[0]),
};
