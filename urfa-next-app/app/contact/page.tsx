import React from 'react';
import ContactForm from '@/components/sections/contact-form';

const ContactPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="mb-4">We'd love to hear from you! Please fill out the form below to get in touch.</p>
            <ContactForm />
        </div>
    );
};

export default ContactPage;