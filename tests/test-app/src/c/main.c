#include <pebble.h>

#include "runner.h"
#include "windows/main_menu.h"

static Window *s_main_window;

static void inbox_received(DictionaryIterator *iter, void *context) {
  runner_on_inbox(iter);
}

static void inbox_dropped(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "inbox dropped: %d", reason);
}

static void outbox_failed(DictionaryIterator *iter, AppMessageResult reason,
                          void *context) {
  runner_on_outbox_failed(reason);
}

static void init(void) {
  s_main_window = main_menu_create();
  window_stack_push(s_main_window, true);

  app_message_register_inbox_received(inbox_received);
  app_message_register_inbox_dropped(inbox_dropped);
  app_message_register_outbox_failed(outbox_failed);
  app_message_open(512, 256);
}

static void deinit(void) {
  main_menu_destroy(s_main_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
