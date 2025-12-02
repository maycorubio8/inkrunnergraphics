import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
  try {
    const { items, customerEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Crear line items para Stripe
    const lineItems = items.map((item) => {
      const sizeDisplay = item.customSize 
        ? `${item.customSize.width}" × ${item.customSize.height}"`
        : item.size?.name;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productName || 'Custom Stickers',
            description: `${item.shape?.name} • ${item.material?.name} • ${sizeDisplay} • Qty: ${item.quantity}`,
            images: item.designFile?.url ? [item.designFile.url] : [],
            metadata: {
              shape: item.shape?.name,
              material: item.material?.name,
              size: sizeDisplay,
              quantity: item.quantity.toString(),
              instructions: item.instructions || '',
              designPath: item.designFile?.path || '',
            },
          },
          unit_amount: Math.round(item.price.total * 100), // Stripe usa centavos
        },
        quantity: 1, // Cada item es un producto único configurado
      };
    });

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderItems: JSON.stringify(items.map(item => ({
          productName: item.productName,
          shape: item.shape?.name,
          material: item.material?.name,
          size: item.customSize ? `${item.customSize.width}x${item.customSize.height}` : item.size?.name,
          quantity: item.quantity,
          designPath: item.designFile?.path,
        }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}