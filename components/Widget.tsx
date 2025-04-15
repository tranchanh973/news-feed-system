"use client";

import { useEffect, useState } from "react";
import ReactTimeAgo from "react-timeago";
import { useAuth } from "@clerk/nextjs";

function Widget() {
  const { userId } = useAuth();
  const [recentUsers, setRecentUsers] = useState<
    { name: string; image: string; lastActive: Date; isActive: boolean }[]
  >([]);

  useEffect(() => {
    if (!userId) return;

    // Gửi thông tin người dùng khi truy cập
    const saveRecentUser = async () => {
      try {
        await fetch("/api/recentUsers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            lastActive: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Error saving recent user:", error);
      }
    };

    saveRecentUser();

    // Gửi heartbeat định kỳ để cập nhật lastActive
    const interval = setInterval(() => {
      saveRecentUser();
    }, 15000); // 15 giây

    return () => clearInterval(interval); // Xóa interval khi component bị unmount
  }, [userId]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng gần đây
    const fetchRecentUsers = async () => {
      try {
        const response = await fetch("/api/recentUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch recent users");
        }
        const data = await response.json();
        setRecentUsers(data);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchRecentUsers();

    // Polling: Gọi API định kỳ để cập nhật danh sách người dùng
    const interval = setInterval(() => {
      fetchRecentUsers();
    }, 5000); // 5 giây

    return () => clearInterval(interval); // Xóa interval khi component bị unmount
  }, []);

  return (
    <div className="max-w-[340px] hidden xl:inline">
      {/* Advertisement Section */}
      <div className="origin-top-left bg-gray-200 flex items-center justify-center mb-4">
        <a
          href="https://www.lottecinemavn.com/LCHS/Contents/Event/infomation-delivery-event.aspx?EventID=201010000023010"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/banner_widget.jpg"
            alt="Advertisement"
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      </div>

      {/* Recent Users Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Users</h3>
        <ul className="space-y-3">
          {recentUsers.map((user, index) => (
            <li key={index} className="flex items-center space-x-3">
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium flex items-center">
                  {user.name}
                  {/* {user.isActive && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )} */}
                </p>
                {/* {!user.isActive && (
                  <p className="text-sm text-gray-500">
                    Last active:{" "}
                    <ReactTimeAgo date={new Date(user.lastActive)} />
                  </p>
                )} */}
                <div suppressHydrationWarning className="text-sm text-gray-500">
                  Last active: <ReactTimeAgo date={new Date(user.lastActive)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Widget;
