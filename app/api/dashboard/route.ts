import { withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, auth) => {
  try {
    const userId = auth.user.id
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const unfinishedTodayTask = await prisma.task.findMany({
      where: {
        user_id: userId,
        // date: {
        //   gte: startOfToday,
        //   lte: endOfToday,
        // },
        status: {
          not: 'Completed'
        }
      },
      include: {
        images: true
      }
    });
    const totalTasks = await prisma.task.count({
      where: { user_id: userId }
    });
    const statusCounts = await prisma.task.groupBy({
      by: ["status"],
      where: { user_id: userId },
      _count: {
        status: true
      }
    });
    const priorityCounts = await prisma.task.groupBy({
      by: ["priority"],
      where: { user_id: userId },
      _count: {
        priority: true
      }
    });
    const priorityPercentage = priorityCounts.map(p => {
      const count = p._count.priority;
      const percentage = totalTasks === 0
        ? 0
        : Number(((count / totalTasks) * 100).toFixed(2));

      return {
        priority: p.priority,
        count,
        percentage
      };
    });
    const statusPercentage = statusCounts.map(s => ({
      status: s.status,
      count: s._count.status,
      percentage: totalTasks === 0
        ? 0
        : Number(((s._count.status / totalTasks) * 100).toFixed(2))
    }));
    return NextResponse.json({
      message: "Success",
      data: {
        unfinished_today_tasks: unfinishedTodayTask,
        priority: priorityPercentage,
        status: statusPercentage,
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
})