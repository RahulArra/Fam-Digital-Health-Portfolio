# Add Notifications Section to Profile Page

## Tasks
- [ ] Add notification state and fetch logic to Profile.js
- [ ] Add notifications section UI to Profile component
- [ ] Add styles for notifications section in Profile.css
- [ ] Test notification display and mark as read functionality

## Information Gathered
- Profile.js currently imports NotificationBell but doesn't display notifications directly
- NotificationBell shows a dropdown with notifications
- notificationApi.js provides fetchNotifications, fetchUnreadCount, markNotificationRead
- Profile fetches user and profile data in useEffect

## Plan
- Add notifications state to Profile component
- Fetch notifications alongside user/profile data
- Add a new "Notifications" section in the profile main content
- Display notifications with title, message, priority, and read status
- Allow clicking to mark as read
- Style the section to match the existing design

## Dependent Files
- front/new-frontend/src/components/Profile.js
- front/new-frontend/src/components/Profile.css
