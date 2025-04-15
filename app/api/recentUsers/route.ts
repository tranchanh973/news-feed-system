import { connectdb } from "@/mongodb/db";
import { RecentUser } from "@/mongodb/models/recentUser";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectdb();

    // Lấy danh sách người dùng đăng nhập gần đây (giới hạn 5 người, sắp xếp theo thời gian hoạt động gần nhất)
    const recentUsers = await RecentUser.find()
      .sort({ lastActive: -1 })
      .limit(5)
      .lean();

    // Lấy thông tin từ Clerk và bổ sung avatar
    const usersWithAvatar = await Promise.all(
      recentUsers.map(async (user) => {
        const clerkUser = await clerkClient.users.getUser(user.userId);
        return {
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
          image: clerkUser.imageUrl,
          lastActive: user.lastActive,
          isActive: user.isActive, // Trạng thái hoạt động
        };
      })
    );

    return NextResponse.json(usersWithAvatar);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectdb();

    const {
      userId,
      lastActive,
      isActive,
    }: { userId: string; lastActive: Date; isActive: boolean } =
      await request.json(); // Lấy dữ liệu từ request body

    // Tạo hoặc cập nhật thông tin người dùng
    const recentUser = await RecentUser.findOneAndUpdate(
      { userId }, // Tìm người dùng theo userId
      { lastActive, isActive }, // Cập nhật thời gian hoạt động và trạng thái
      { upsert: true, new: true } // Nếu không tồn tại, tạo mới
    );

    return NextResponse.json({
      message: "Recent user updated successfully",
      recentUser,
    });
  } catch (error) {
    console.error("Error updating recent user:", error);
    return NextResponse.json(
      { error: "Failed to update recent user" },
      { status: 500 }
    );
  }
}
