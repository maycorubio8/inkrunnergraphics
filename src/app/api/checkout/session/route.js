import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email,
      amount_total: session.amount_total,
      shipping: session.shipping_details,
    });
  } catch (error) {
    console.error('Session retrieve error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}