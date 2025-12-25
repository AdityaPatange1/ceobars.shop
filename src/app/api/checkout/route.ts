import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getReturnUrl(): string {
  // Cashfree requires HTTPS URLs, so always use production URL for redirects
  // This works even when testing locally - user gets redirected to production success page
  return process.env.NEXT_PUBLIC_BASE_URL || "https://ceobars.shop";
}

export async function POST(request: NextRequest) {
  try {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: "Cashfree credentials not configured" },
        { status: 500 }
      );
    }

    const { amount } = await request.json();
    const returnUrl = getReturnUrl();

    console.log("Checkout request:", { amount, returnUrl, appId: appId?.substring(0, 10) + "..." });

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const customerId = `cust_${Date.now()}`;

    // Detect environment from secret key
    const isProduction = secretKey.includes("_prod_");
    const apiUrl = isProduction
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: "CEO Bars Supporter",
        customer_email: "supporter@ceobars.shop",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `${returnUrl}/success?order_id=${orderId}`,
      },
    };

    console.log("Calling Cashfree API:", apiUrl);
    console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    console.log("Cashfree response status:", response.status);
    console.log("Cashfree response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: "Cashfree API error", details: data },
        { status: response.status }
      );
    }

    if (data.payment_session_id) {
      return NextResponse.json({
        paymentSessionId: data.payment_session_id,
        orderId: data.order_id,
      });
    }

    return NextResponse.json(
      { error: "No payment session in response", details: data },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", details: message },
      { status: 500 }
    );
  }
}
