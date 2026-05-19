#include "../tests.h"

static const Test s_tests[] = {
    {"native fetch"},
    {"fetchJSON"},
    {"fetchString"},
    {"fetchBinary"},
};

const Category category_fetch = {
    .name = "fetch",
    .tests = s_tests,
    .test_count = sizeof(s_tests) / sizeof(s_tests[0]),
};
