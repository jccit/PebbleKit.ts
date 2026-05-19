#include <pebble.h>

#include "main_menu.h"
#include "../runner.h"
#include "../tests.h"
#include "../ui.h"
#include "category_menu.h"
#include "report.h"

static MenuLayer *s_menu;
static Test s_flat_tests[MAX_TOTAL_TESTS];

static uint16_t get_num_rows(MenuLayer *ml, uint16_t section, void *ctx) {
  return 1 + NUM_CATEGORIES;
}

static int16_t get_cell_height(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  return MENU_ROW_H;
}

static void draw_row(GContext *g, const Layer *cell, MenuIndex *idx,
                     void *ctx) {
  if (idx->row == 0) {
    menu_cell_basic_draw(g, cell, "TEST ALL", NULL, NULL);
  } else {
    int cat_idx = idx->row - 1;
    menu_cell_basic_draw(g, cell, s_categories[cat_idx]->name, NULL, NULL);
  }
}

static void select_row(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  if (idx->row == 0) {
    int count = tests_flatten_all(s_flat_tests, MAX_TOTAL_TESTS);
    report_show("All tests", s_flat_tests, count);
  } else {
    category_menu_push(s_categories[idx->row - 1]);
  }
}

static void window_load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect b = layer_get_bounds(root);
  s_menu = menu_layer_create(b);
  menu_layer_set_callbacks(s_menu, NULL, (MenuLayerCallbacks){
                                             .get_num_rows = get_num_rows,
                                             .draw_row = draw_row,
                                             .get_cell_height = get_cell_height,
                                             .select_click = select_row,
                                         });
  menu_layer_set_click_config_onto_window(s_menu, window);
  layer_add_child(root, menu_layer_get_layer(s_menu));
}

static void window_unload(Window *window) {
  menu_layer_destroy(s_menu);
  s_menu = NULL;
}

Window *main_menu_create(void) {
  Window *window = window_create();
  window_set_window_handlers(window, (WindowHandlers){
                                         .load = window_load,
                                         .unload = window_unload,
                                     });
  return window;
}

void main_menu_destroy(Window *window) { window_destroy(window); }
