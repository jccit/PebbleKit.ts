#pragma once

#include <pebble.h>
#include "tests.h"

#define MAX_TOTAL_TESTS 16

typedef enum {
  ROW_PENDING = -1,
  ROW_FAIL = 0,
  ROW_PASS = 1,
  ROW_RUNNING = 2,
} RowStatus;

typedef struct {
  const char *name;
  RowStatus status;
  char body[224];
} ReportRow;

// Called whenever a row's status or body changes. `finished_row` is the row
// that just transitioned (or -1 if none); `done` is true once the whole report
// has finished running.
typedef void (*RunnerObserver)(int finished_row, bool done);

// Initialize a new report run. Copies the test list, resets state, starts the
// first test. `observer` may be NULL.
void runner_start(const Test *tests, int count, RunnerObserver observer);

// Stop advancing into a destroyed report window. Idempotent.
void runner_cancel(void);

int runner_row_count(void);
const ReportRow *runner_row(int idx);

// Wire these into your AppMessage callbacks.
void runner_on_inbox(DictionaryIterator *iter);
void runner_on_outbox_failed(AppMessageResult reason);
