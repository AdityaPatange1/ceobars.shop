import { NextRequest, NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export const dynamic = "force-dynamic";

function getCashfree() {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error("Cashfree credentials not configured");
  }

  // Detect environment from secret key prefix (prod vs sandbox)
  const isProductionKey = process.env.CASHFREE_SECRET_KEY.includes("_prod_");
  const environment = isProductionKey
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

  return new Cashfree(
    environment,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
  );
}

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "localhost:3000";

  // Always use localhost URL for local development
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return `http://${host}`;
  }

  // Use env var for production, fallback to request headers
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  const protocol = request.headers.get("x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const cashfree = getCashfree();
    const { amount, customerEmail, customerPhone } = await request.json();
    const baseUrl = getBaseUrl(request);

    console.log("Checkout request:", { amount, baseUrl });

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const orderRequest = {
      order_amount: Number(amount),
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: "CEO Bars Supporter",
        customer_email: customerEmail || "supporter@ceobars.shop",
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `${baseUrl}/success?order_id=${orderId}`,
      },
      order_note: "Fund The CEO - CEO Bars",
    };

    console.log("Order request:", JSON.stringify(orderRequest, null, 2));

    const response = await cashfree.PGCreateOrder(orderRequest);

    console.log("Cashfree response:", JSON.stringify(response.data, null, 2));

    if (response.data && response.data.payment_session_id) {
      return NextResponse.json({
        paymentSessionId: response.data.payment_session_id,
        orderId: response.data.order_id,
      });
    }

    console.error("No payment_session_id in response:", response);
    return NextResponse.json(
      { error: "Failed to create order", details: response },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error("Cashfree checkout error:", error);

    // Extract detailed error info
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack,
    } : error;

    // Check if it's an axios error with response data
    const axiosError = error as { response?: { data?: unknown } };
    if (axiosError?.response?.data) {
      console.error("Cashfree API error response:", axiosError.response.data);
    }

    return NextResponse.json(
      { error: "Failed to create checkout session", details: errorDetails },
      { status: 500 }
    );
  }
}
