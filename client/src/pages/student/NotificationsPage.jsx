import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Bell, CheckCheck, Trash2, RefreshCw, Search, Filter, Settings, BarChart3, ArrowLeft, User, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '@/features/api/notificationApi';
import { markAsRead, markAllAsRead } from '@/features/notificationSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API hooks
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery({
    page: 1,
    limit: 50,
    unreadOnly: statusFilter === 'unread'
  });

  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsReadMutation(notification._id).unwrap();
      }
      
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation().unwrap();
      dispatch(markAllAsRead());
      toast.success('All notifications marked as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotificationMutation(notificationId).unwrap();
      toast.success('Notification deleted');
      refetch();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Get notification icon and color based on type
  const getNotificationTypeDisplay = (notification) => {
    const type = notification.type?.toLowerCase() || '';
    const title = notification.title?.toLowerCase() || '';
    
    if (type === 'message' || title.includes('message')) {
      return {
        icon: <MessageCircle className="h-4 w-4" />,
        label: 'Message',
        color: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600'
      };
    }
    if (type === 'user' || title.includes('user') || title.includes('profile') || title.includes('team')) {
      return {
        icon: <User className="h-4 w-4" />,
        label: 'Team',
        color: 'bg-purple-100 text-purple-800',
        iconColor: 'text-purple-600'
      };
    }
    if (type === 'ticket' || title.includes('ticket') || title.includes('assigned')) {
      return {
        icon: <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs">T</span>
        </div>,
        label: 'Ticket',
        color: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600'
      };
    }
    return {
      icon: <Home className="h-4 w-4" />,
      label: 'System',
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600'
    };
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '5 minutes ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'message' && (notification.type?.toLowerCase() === 'message' || notification.title.toLowerCase().includes('message'))) ||
                       (filterType === 'ticket' && (notification.type?.toLowerCase() === 'ticket' || notification.title.toLowerCase().includes('ticket'))) ||
                       (filterType === 'team' && (notification.type?.toLowerCase() === 'user' || notification.title.toLowerCase().includes('team')));
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'unread' && !notification.isRead) ||
                         (statusFilter === 'read' && notification.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Stay updated with your latest activities and messages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleMarkAllAsRead}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="outline" className="text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('unread')}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('read')}>
                  Read Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('ticket')}>
                  Ticket
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('message')}>
                  Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('team')}>
                  Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterType !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'We\'ll notify you when something important happens'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold text-gray-900 py-4">Notification</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Type</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Time</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => {
                  const typeDisplay = getNotificationTypeDisplay(notification);
                  return (
                    <TableRow 
                      key={notification._id}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${typeDisplay.color} flex items-center justify-center flex-shrink-0`}>
                            <div className={typeDisplay.iconColor}>
                              {typeDisplay.icon}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-medium text-sm ${
                              !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className={`${typeDisplay.color} font-medium`}>
                          {typeDisplay.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {formatTimestamp(notification.createdAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-between">
                          {notification.isRead ? (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-medium">
                              read
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-600 text-white font-medium">
                              unread
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500 ml-2"
                            onClick={(e) => handleDeleteNotification(notification._id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage; 