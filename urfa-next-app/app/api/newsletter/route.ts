import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email } = await request.json();

    // Here you would typically add logic to handle the subscription,
    // such as saving the email to a database or sending it to a CMS.

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Simulate a successful subscription
    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
}