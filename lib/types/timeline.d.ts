export {};

declare global {
  interface TimelinePin {
    id: string;
    time: string;
    duration?: number;
    createNotification?: TimelineNotification;
    updateNotification?: TimelineNotification;
    layout: TimelineLayout;
    reminders?: TimelineReminder[];
    actions?: TimelineAction[];
  }

  interface TimelineNotification {
    layout: TimelineLayout;
  }

  interface BaseTimelineLayout {
    type:
      | "genericPin"
      | "calendarPin"
      | "sportsPin"
      | "weatherPin"
      | "genericReminder"
      | "genericNotification";
    title: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
  }

  interface GenericPinLayout extends BaseTimelineLayout {
    type: "genericPin";
    tinyIcon: string;
    subtitle?: string;
    body?: string;
  }

  interface CalendarPinLayout extends BaseTimelineLayout {
    type: "calendarPin";
    body?: string;
    locationName?: string;
  }

  interface SportsPinLayout extends BaseTimelineLayout {
    type: "sportsPin";
    subtitle?: string;
    body?: string;
    tinyIcon: string;
    largeIcon?: string;
    lastUpdated?: string;
    rankAway?: string;
    rankHome?: string;
    nameAway?: string;
    nameHome?: string;
    recordAway?: string;
    recordHome?: string;
    scoreAway?: string;
    scoreHome?: string;
    sportsGameState?: string;
  }

  interface WeatherPinLayout extends BaseTimelineLayout {
    type: "weatherPin";
    body?: string;
    tinyIcon: string;
    lastUpdated?: string;
    shortTitle?: string;
    subtitle?: string;
    shortSubtitle?: string;
    locationName: string;
    displayTime?: string;
  }

  interface GenericReminderLayout extends BaseTimelineLayout {
    type: "genericReminder";
    tinyIcon: string;
    locationName?: string;
  }

  interface GenericNotificationLayout extends BaseTimelineLayout {
    type: "genericNotification";
    tinyIcon: string;
    body?: string;
  }

  type TimelineLayout =
    | GenericPinLayout
    | CalendarPinLayout
    | SportsPinLayout
    | WeatherPinLayout
    | GenericReminderLayout
    | GenericNotificationLayout;

  interface TimelineReminder {
    time: string;
    layout: TimelineLayout;
  }

  interface BaseTimelineAction {
    title: string;
    type: "openWatchApp" | "http";
  }

  interface WatchAppAction extends BaseTimelineAction {
    type: "openWatchApp";
    launchCode: string;
  }

  interface HttpAction extends BaseTimelineAction {
    type: "http";
    url: string;
  }

  type TimelineAction = WatchAppAction | HttpAction;
}
