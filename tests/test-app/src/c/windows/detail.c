#include <pebble.h>

#include "detail.h"
#include "../ui.h"

static Window *s_window;
static ScrollLayer *s_scroll;
static TextLayer *s_title;
static TextLayer *s_body;
static char s_title_buf[48];
static char s_body_buf[256];

static void window_load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect b = layer_get_bounds(root);

  s_title = text_layer_create(GRect(0, 0, b.size.w, TITLE_H));
  text_layer_set_text(s_title, s_title_buf);
  text_layer_set_text_alignment(s_title, GTextAlignmentCenter);
  text_layer_set_font(s_title, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  text_layer_set_background_color(s_title, GColorBlack);
  text_layer_set_text_color(s_title, GColorWhite);
  layer_add_child(root, text_layer_get_layer(s_title));

  GRect scroll_frame = GRect(0, TITLE_H, b.size.w, b.size.h - TITLE_H);
  s_scroll = scroll_layer_create(scroll_frame);
  scroll_layer_set_click_config_onto_window(s_scroll, window);

  GRect body_frame = GRect(4, 4, scroll_frame.size.w - 8, 2000);
  s_body = text_layer_create(body_frame);
  text_layer_set_text(s_body, s_body_buf);
  text_layer_set_font(s_body, fonts_get_system_font(FONT_KEY_GOTHIC_18));
  text_layer_set_overflow_mode(s_body, GTextOverflowModeWordWrap);
  text_layer_set_background_color(s_body, GColorClear);

  GSize content = text_layer_get_content_size(s_body);
  content.h += 8;
  if (content.h < scroll_frame.size.h) content.h = scroll_frame.size.h;
  layer_set_frame(text_layer_get_layer(s_body),
                  GRect(4, 4, scroll_frame.size.w - 8, content.h));
  scroll_layer_set_content_size(s_scroll,
                                GSize(scroll_frame.size.w, content.h + 8));

  scroll_layer_add_child(s_scroll, text_layer_get_layer(s_body));
  layer_add_child(root, scroll_layer_get_layer(s_scroll));
}

static void window_unload(Window *window) {
  text_layer_destroy(s_title);
  text_layer_destroy(s_body);
  scroll_layer_destroy(s_scroll);
  s_title = NULL;
  s_body = NULL;
  s_scroll = NULL;
  s_window = NULL;
}

void detail_push(const ReportRow *row) {
  if (!row) return;
  const char *prefix = "...";
  if (row->status == ROW_PASS) prefix = "PASS";
  else if (row->status == ROW_FAIL) prefix = "FAIL";
  else if (row->status == ROW_PENDING) prefix = "—";
  snprintf(s_title_buf, sizeof(s_title_buf), "%s: %s", prefix, row->name);
  snprintf(s_body_buf, sizeof(s_body_buf), "%s",
           row->body[0] ? row->body : "(no result yet)");

  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){
                                           .load = window_load,
                                           .unload = window_unload,
                                       });
  window_stack_push(s_window, true);
}
