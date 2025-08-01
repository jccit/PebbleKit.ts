#include <pebble.h>

static Window *window;
static TextLayer *text_layer;

const uint32_t inbox_size = 64;
const uint32_t outbox_size = 256;

static void inbox_received_callback(DictionaryIterator *iter, void *context)
{
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Inbox received");

  Tuple *text_tuple = dict_find(iter, MESSAGE_KEY_text);
  if (text_tuple)
  {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Text: %s", text_tuple->value->cstring);
    text_layer_set_text(text_layer, text_tuple->value->cstring);
  }
}

static void window_load(Window *window)
{
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create(GRect(0, 72, bounds.size.w, 20));
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  text_layer_set_text(text_layer, "Loading");
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void window_unload(Window *window)
{
  text_layer_destroy(text_layer);
}

int main(void)
{
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers){
                                         .load = window_load,
                                         .unload = window_unload,
                                     });
  window_stack_push(window, true);

  app_message_register_inbox_received(inbox_received_callback);
  app_message_open(inbox_size, outbox_size);

  app_event_loop();
}
