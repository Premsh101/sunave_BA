import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured.' },
        { status: 503 },
      );
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, planId } = await request.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !userId || !planId) {
      return NextResponse.json({ error: 'Missing required payment verification fields' }, { status: 400 });
    }

    // Verify Razorpay signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update user plan in Firestore via admin SDK
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      plan: planId,
      updatedAt: new Date().toISOString(),
    });

    // Record payment
    await adminDb.collection('payments').add({
      userId,
      planId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'success',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, plan: planId });
  } catch (error: any) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 },
    );
  }
}
