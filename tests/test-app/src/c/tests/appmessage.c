#include "../tests.h"

static const Test s_tests[] = {
    {"sendAppMessage"},
};

const Category category_appmessage = {
    .name = "app message",
    .tests = s_tests,
    .test_count = sizeof(s_tests) / sizeof(s_tests[0]),
};
