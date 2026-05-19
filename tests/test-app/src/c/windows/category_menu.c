#include <pebble.h>

#include "category_menu.h"
#include "../ui.h"
#include "report.h"

static Window *s_window;
static MenuLayer *s_menu;
static const Category *s_category;

static uint16_t get_num_rows(MenuLayer *ml, uint16_t section, void *ctx) {
  return s_category ? s_category->test_count + 1 : 0;
}

static int16_t get_cell_height(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  return MENU_ROW_H;
}

static void draw_row(GContext *g, const Layer *cell, MenuIndex *idx,
                     void *ctx) {
  if (idx->row == 0) {
    menu_cell_basic_draw(g, cell, "TEST ALL", NULL, NULL);
  } else {
    menu_cell_basic_draw(g, cell, s_category->tests[idx->row - 1].name, NULL,
                         NULL);
  }
}

static void select_row(MenuLayer *ml, MenuIndex *idx, void *ctx) {
  if (!s_category) return;
  if (idx->row == 0) {
    report_show(s_category->name, s_category->tests, s_category->test_count);
  } else {
    report_show(s_category->name, &s_category->tests[idx->row - 1], 1);
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
  s_window = NULL;
  s_category = NULL;
}

void category_menu_push(const Category *category) {
  s_category = category;
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){
                                           .load = window_load,
                                           .unload = window_unload,
                                       });
  window_stack_push(s_window, true);
}
