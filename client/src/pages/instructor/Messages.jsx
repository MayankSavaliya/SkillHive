import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  Clock,
  Star,
  Archive,
  Filter,
  RefreshCw,
  Mail,
  Users
} from "lucide-react";
import { 
  useGetInstructorMessagesQuery,
  useSendMessageToStudentMutation,
  useSendAnnouncementMutation,
  useGetInstructorStudentsQuery 
} from "@/features/api/instructorApi";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { toast } from "sonner";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    courseId: 'all'
  });
  const [messageData, setMessageData] = useState({
    studentId: '',
    message: '',
    subject: ''
  });

  // Fetch real data
  const { data: messagesData, isLoading: messagesLoading, error: messagesError, refetch: refetchMessages } = useGetInstructorMessagesQuery();
  const { data: studentsData, refetch: refetchStudents } = useGetInstructorStudentsQuery();
  const { data: coursesData, refetch: refetchCourses } = useGetCreatorCourseQuery();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageToStudentMutation();
  const [sendAnnouncement, { isLoading: sendingAnnouncement }] = useSendAnnouncementMutation();

  // Refresh all data
  const handleRefresh = () => {
    refetchMessages();
    refetchStudents();
    refetchCourses();
  };

  if (messagesLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load messages</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please try refreshing the page</p>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </div>
    );
  }

  const conversations = messagesData?.messages || [];
  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];
  const unreadCount = messagesData?.unreadCount || 0;

  const filteredConversations = conversations.filter(conv =>
    conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendDirectMessage = async () => {
    if (!messageData.studentId || !messageData.message.trim()) {
      toast.error("Please select a student and enter a message");
      return;
    }

    try {
      await sendMessage({
        studentId: messageData.studentId,
        message: messageData.message,
        subject: messageData.subject
      }).unwrap();
      
      toast.success("Message sent successfully!");
      setMessageData({ studentId: '', message: '', subject: '' });
      setIsMessageOpen(false);
      refetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementData.title.trim() || !announcementData.message.trim()) {
      toast.error("Please enter both title and message");
      return;
    }

    try {
      const result = await sendAnnouncement({
        title: announcementData.title,
        message: announcementData.message,
        courseId: announcementData.courseId === 'all' ? null : announcementData.courseId
      }).unwrap();
      
      toast.success(`Announcement sent to ${result.recipients} students!`);
      setAnnouncementData({ title: '', message: '', courseId: 'all' });
      setIsAnnouncementOpen(false);
    } catch (error) {
      toast.error("Failed to send announcement");
    }
  };

  const handleConversationReply = () => {
    if (newMessage.trim() && selectedConversation) {
      // This would integrate with the messaging system
      console.log('Sending reply:', newMessage);
      toast.success("Reply sent!");
      setNewMessage('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-300">Communicate with your students</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Direct Message</DialogTitle>
                <DialogDescription>
                  Send a direct message to a specific student.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="student">Student</Label>
                  <Select 
                    value={messageData.studentId} 
                    onValueChange={(value) => setMessageData({...messageData, studentId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    value={messageData.subject}
                    onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                    placeholder="Message subject"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendDirectMessage} disabled={sendingMessage}>
                  {sendingMessage ? "Sending..." : "Send Message"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
                <DialogDescription>
                  Send an announcement to all students or students in a specific course.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="course">Target Audience</Label>
                  <Select 
                    value={announcementData.courseId} 
                    onValueChange={(value) => setAnnouncementData({...announcementData, courseId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.courseTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({...announcementData, title: e.target.value})}
                    placeholder="Announcement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="announcement">Message</Label>
                  <Textarea
                    id="announcement"
                    value={announcementData.message}
                    onChange={(e) => setAnnouncementData({...announcementData, message: e.target.value})}
                    placeholder="Type your announcement here..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendAnnouncement} disabled={sendingAnnouncement}>
                  {sendingAnnouncement ? "Sending..." : "Send Announcement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-red-600">{unreadCount > 0 ? 'Requires attention' : 'All caught up!'}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-blue-600">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-green-600">Average response</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-yellow-600">Student rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Message Interface */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 h-[600px]">
        {/* Conversation List */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start by sending a message to your students</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {conversation.student.avatar || conversation.student.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {conversation.student.name}
                          </h4>
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{conversation.student.course || conversation.course}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{formatTimestamp(conversation.timestamp)}</span>
                          {conversation.priority && (
                            <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                              {conversation.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {selectedConversation.student.avatar || selectedConversation.student.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.student.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.student.course || selectedConversation.course}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
                  {selectedConversation.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === 'instructor'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No messages in this conversation yet.</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[60px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleConversationReply();
                      }
                    }}
                  />
                  <Button onClick={handleConversationReply} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
