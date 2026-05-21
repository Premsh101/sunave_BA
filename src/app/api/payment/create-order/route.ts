import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(request: Request) {
  try {
    const { planId, amount, currency = 'INR', userId } = await request.json();

    if (!planId || !amount || !userId) {
      return NextResponse.json({ error: 'planId, amount, and userId are required' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured. Please contact support.' },
        { status: 503 },
      );
    }
    const order = await razorpay.orders.create({
      amount, // in paise
      currency,
      receipt: `rcpt_${userId.slice(0, 8)}_${planId}_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 },
    );
  }
}
