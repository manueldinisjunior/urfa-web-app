import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();

    // Here you would typically handle the form submission, e.g., save to a database or send an email
    // For demonstration, we'll just log the data and return a success response

    console.log(data);

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
}