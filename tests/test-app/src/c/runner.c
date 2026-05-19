#include "runner.h"

static ReportRow s_rows[MAX_TOTAL_TESTS];
static int s_row_count = 0;
static int s_current_row = -1;
static RunnerObserver s_observer = NULL;

static void send_run_test(const char *name) {
  DictionaryIterator *iter;
  AppMessageResult res = app_message_outbox_begin(&iter);
  if (res != APP_MSG_OK) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "outbox_begin failed: %d", res);
    return;
  }
  dict_write_cstring(iter, MESSAGE_KEY_run_test, name);
  app_message_outbox_send();
}

static void start_next_test(void) {
  s_current_row++;
  if (s_current_row >= s_row_count) {
    int finished = s_current_row - 1;
    s_current_row = -1;
    APP_LOG(APP_LOG_LEVEL_INFO, "[REPORT_DONE]");
    if (s_observer) s_observer(finished, true);
    return;
  }
  s_rows[s_current_row].status = ROW_RUNNING;
  if (s_observer) s_observer(s_current_row, false);
  send_run_test(s_rows[s_current_row].name);
}

void runner_start(const Test *tests, int count, RunnerObserver observer) {
  if (count > MAX_TOTAL_TESTS) count = MAX_TOTAL_TESTS;
  s_row_count = count;
  for (int i = 0; i < count; i++) {
    s_rows[i].name = tests[i].name;
    s_rows[i].status = ROW_PENDING;
    s_rows[i].body[0] = 0;
  }
  s_current_row = -1;
  s_observer = observer;
  start_next_test();
}

void runner_cancel(void) {
  s_current_row = -1;
  s_observer = NULL;
}

int runner_row_count(void) { return s_row_count; }

const ReportRow *runner_row(int idx) {
  if (idx < 0 || idx >= s_row_count) return NULL;
  return &s_rows[idx];
}

void runner_on_inbox(DictionaryIterator *iter) {
  if (s_current_row < 0 || s_current_row >= s_row_count) return;

  Tuple *status_t = dict_find(iter, MESSAGE_KEY_status);
  Tuple *result_t = dict_find(iter, MESSAGE_KEY_result);

  s_rows[s_current_row].status =
      (status_t && status_t->value->int32) ? ROW_PASS : ROW_FAIL;
  if (result_t) {
    snprintf(s_rows[s_current_row].body, sizeof(s_rows[s_current_row].body),
             "%s", result_t->value->cstring);
  }

  APP_LOG(APP_LOG_LEVEL_INFO, "Row %d %s: %s", s_current_row,
          s_rows[s_current_row].status == ROW_PASS ? "PASS" : "FAIL",
          s_rows[s_current_row].body);

  int finished_row = s_current_row;
  if (s_observer) s_observer(finished_row, false);

  start_next_test();
}

void runner_on_outbox_failed(AppMessageResult reason) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "outbox failed: %d", reason);
  if (s_current_row >= 0 && s_current_row < s_row_count) {
    s_rows[s_current_row].status = ROW_FAIL;
    snprintf(s_rows[s_current_row].body, sizeof(s_rows[s_current_row].body),
             "outbox failed: %d", reason);
    int finished_row = s_current_row;
    if (s_observer) s_observer(finished_row, false);
    start_next_test();
  }
}
