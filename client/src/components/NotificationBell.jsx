import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Trash2, CheckCheck, User, MessageCircle, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '@/features/api/notificationApi';
import { markAsRead, markAllAsRead } from '@/features/notificationSlice';
import { showToast } from '@/lib/toast';
import useSocket from '@/hooks/useSocket';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);

  // Fetch notifications
  const { 
    data: unreadCountData, 
    error: unreadCountError,
    refetch: refetchUnreadCount 
  } = useGetUnreadCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000, // Poll every 30 seconds
  });

  const { 
    data: notificationsData,
    error: notificationsError
  } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    { 
      refetchOnMountOrArgChange: true,
      skip: !isOpen
    }
  );

  // Mutations
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadCount = unreadCountData || 0;
  const notifications = notificationsData?.notifications || [];

  // Handle real-time notifications
  useEffect(() => {
    if (socket) {
      const handleNewNotification = () => {
        refetchUnreadCount();
        showToast.success('New notification received!', { showCancel: true });
      };

      socket.on('newNotification', handleNewNotification);
      return () => socket.off('newNotification', handleNewNotification);
    }
  }, [socket, refetchUnreadCount]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification._id).unwrap();
        refetchUnreadCount();
      }
      
      setIsOpen(false);
      
      // Navigate to action URL or notifications page
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      } else {
        navigate('/notifications');
      }
    } catch (error) {
      // Silent error handling - just navigate anyway
      navigate('/notifications');
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead().unwrap();
      refetchUnreadCount();
      showToast.success('All notifications marked as read', { showCancel: true });
    } catch (error) {
      showToast.error('Failed to mark all as read', { showCancel: true });
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId).unwrap();
      refetchUnreadCount();
      showToast.success('Notification deleted', { showCancel: true });
    } catch (error) {
      showToast.error('Failed to delete notification', { showCancel: true });
    }
  };

  // Get notification icon based on type or content
  const getNotificationIcon = (notification) => {
    const type = notification.type?.toLowerCase() || '';
    const title = notification.title?.toLowerCase() || '';
    
    if (type === 'message' || title.includes('message')) {
      return <MessageCircle className="h-5 w-5 text-green-600" />;
    }
    if (type === 'user' || title.includes('user') || title.includes('profile')) {
      return <User className="h-5 w-5 text-blue-600" />;
    }
    if (type === 'system' || title.includes('update') || title.includes('maintenance')) {
      return <Settings className="h-5 w-5 text-gray-600" />;
    }
    if (title.includes('payment') || title.includes('rent') || title.includes('lease')) {
      return <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
        <span className="text-white text-xs font-bold">$</span>
      </div>;
    }
    return <Home className="h-5 w-5 text-purple-600" />;
  };

  // Format timestamp to show relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  // Group notifications by time period
  const groupNotificationsByTime = (notifications) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const groups = {
      today: [],
      yesterday: [],
      older: []
    };
    
    notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
      
      if (notificationDay.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else {
        groups.older.push(notification);
      }
    });
    
    return groups;
  };

  if (!user) return null;

  const groupedNotifications = groupNotificationsByTime(notifications);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0 shadow-lg">
        <div className="bg-white dark:bg-gray-900 rounded-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 h-8"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Today Section */}
                {groupedNotifications.today.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">Today</h4>
                    <div className="space-y-1">
                      {groupedNotifications.today.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className={`text-sm font-medium ${
                                    !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                              </div>
                              {!notification.isRead && (
                                <div className="flex justify-end mt-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday Section */}
                {groupedNotifications.yesterday.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">Yesterday</h4>
                    <div className="space-y-1">
                      {groupedNotifications.yesterday.map((notification) => (
                        <div
                          key={notification._id}
                          className="p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Older Section */}
                {groupedNotifications.older.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">Earlier</h4>
                    <div className="space-y-1">
                      {groupedNotifications.older.map((notification) => (
                        <div
                          key={notification._id}
                          className="p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 