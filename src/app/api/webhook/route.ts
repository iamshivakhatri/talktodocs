import { headers } from "next/headers";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import {eq} from 'drizzle-orm';

export async function POST(req: Request){
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;
    let event: Stripe.Event

    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string);
    }catch(e:any){
        return new NextResponse(`Webhook Error:${e.message}`, {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId){
            return new NextResponse('No user ID found in session', {status: 400});
        }

        await db.insert(userSubscriptions).values({
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            userId: session?.metadata?.userId,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
    }
    if (event.type === "invoice.payment_succeeded"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId){
            return new NextResponse('No user ID found in session', {status: 400});
        }
        await db
        .update(userSubscriptions)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        })
        .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

    }
    return new NextResponse(null, {status: 200});
}