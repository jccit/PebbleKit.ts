#include <pebble.h>

#include "report.h"
#include "../runner.h"
#include "../ui.h"
#include "detail.h"

static Window *s_window;
static TextLayer *s_title_layer;
static MenuLayer *s_menu;
static char s_title[24];
static Test s_pending_tests[MAX_TOTAL_TESTS];
static int s_pending_count;

static uint16_t get_num_rows(MenuLayer *ml, uint16_t section, void *ctx) {
  return runner_row_count();
}

static int16_t get_cell_height(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  return ROW_H;
}

static void draw_row(GContext *g, const Layer *cell, MenuIndex *idx,
                     void *ctx) {
  const ReportRow *row = runner_row(idx->row);
  if (!row) return;

  GRect b = layer_get_bounds(cell);
  GFont name_font = fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);
  GFont body_font = fonts_get_system_font(FONT_KEY_GOTHIC_14);

  GColor bar_color;
  const char *status_text;
  switch (row->status) {
    case ROW_PASS:
      bar_color = PBL_IF_COLOR_ELSE(GColorIslamicGreen, GColorBlack);
      status_text = "PASS";
      break;
    case ROW_FAIL:
      bar_color = PBL_IF_COLOR_ELSE(GColorRed, GColorBlack);
      status_text = "FAIL";
      break;
    case ROW_RUNNING:
      bar_color = PBL_IF_COLOR_ELSE(GColorChromeYellow, GColorDarkGray);
      status_text = "...";
      break;
    default:
      bar_color = PBL_IF_COLOR_ELSE(GColorLightGray, GColorWhite);
      status_text = "";
      break;
  }

  bool highlighted = menu_cell_layer_is_highlighted(cell);
  GColor text_color = highlighted ? GColorWhite : GColorBlack;

  graphics_context_set_fill_color(g, bar_color);
  graphics_fill_rect(g, GRect(2, 3, 8, b.size.h - 6), 2, GCornersAll);

  graphics_context_set_text_color(g, text_color);
  graphics_draw_text(g, row->name, name_font,
                     GRect(14, -2, b.size.w - 60, 22),
                     GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft,
                     NULL);
  graphics_draw_text(g, status_text, body_font,
                     GRect(b.size.w - 46, 0, 44, 18),
                     GTextOverflowModeTrailingEllipsis, GTextAlignmentRight,
                     NULL);
  if (row->body[0]) {
    graphics_draw_text(g, row->body, body_font,
                       GRect(14, 16, b.size.w - 18, b.size.h - 16),
                       GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft,
                       NULL);
  }
}

static void select_row(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  detail_push(runner_row(idx->row));
}

static void on_runner_change(int finished_row, bool done) {
  if (!s_menu) return;
  menu_layer_reload_data(s_menu);

  // Keep the running (or last-finished) row visible while the report runs.
  int target = finished_row + 1;
  if (done || target >= runner_row_count()) target = finished_row;
  if (target < 0) return;
  menu_layer_set_selected_index(
      s_menu, (MenuIndex){.section = 0, .row = target},
      MenuRowAlignCenter, true);
}

static void window_load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect b = layer_get_bounds(root);

  s_title_layer = text_layer_create(GRect(0, 0, b.size.w, TITLE_H));
  text_layer_set_text(s_title_layer, s_title);
  text_layer_set_text_alignment(s_title_layer, GTextAlignmentCenter);
  text_layer_set_font(s_title_layer,
                      fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  text_layer_set_background_color(s_title_layer, GColorBlack);
  text_layer_set_text_color(s_title_layer, GColorWhite);
  layer_add_child(root, text_layer_get_layer(s_title_layer));

  GRect menu_frame = GRect(0, TITLE_H, b.size.w, b.size.h - TITLE_H);
  s_menu = menu_layer_create(menu_frame);
  menu_layer_set_callbacks(s_menu, NULL, (MenuLayerCallbacks){
                                             .get_num_rows = get_num_rows,
                                             .draw_row = draw_row,
                                             .get_cell_height = get_cell_height,
                                             .select_click = select_row,
                                         });
  menu_layer_set_click_config_onto_window(s_menu, window);
  layer_add_child(root, menu_layer_get_layer(s_menu));

  runner_start(s_pending_tests, s_pending_count, on_runner_change);
}

static void window_unload(Window *window) {
  runner_cancel();
  menu_layer_destroy(s_menu);
  text_layer_destroy(s_title_layer);
  s_menu = NULL;
  s_title_layer = NULL;
  s_window = NULL;
}

void report_show(const char *title, const Test *tests, int count) {
  if (count > MAX_TOTAL_TESTS) count = MAX_TOTAL_TESTS;
  for (int i = 0; i < count; i++) s_pending_tests[i] = tests[i];
  s_pending_count = count;
  snprintf(s_title, sizeof(s_title), "%s", title);

  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){
                                           .load = window_load,
                                           .unload = window_unload,
                                       });
  window_stack_push(s_window, true);
}
