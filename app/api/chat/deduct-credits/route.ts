import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Deduct 1 credit
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
      select: { credits: true }
    });

    return NextResponse.json({ 
      success: true, 
      credits: updatedUser.credits 
    });

  } catch (error) {
    console.error('Error deducting credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
