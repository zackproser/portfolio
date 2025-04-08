"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';

// Create the Textarea component since it doesn't exist
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { 
    rows?: number 
  }
>(({ className, rows = 4, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:ring-offset-gray-900 dark:placeholder:text-gray-500 dark:focus:ring-blue-500 ${className}`}
      ref={ref}
      rows={rows}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationForm({ isOpen, onClose }: ConsultationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          phoneNumber,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit the form');
      }

      // Success!
      setIsSubmitted(true);
      // Reset form 
      setName('');
      setEmail('');
      setCompany('');
      setPhoneNumber('');
      setMessage('');
      
      // Close the form after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-gradient-to-br from-blue-800 to-indigo-900 text-white rounded-xl p-6 border border-blue-500/30 shadow-xl">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-blue-200 max-w-sm">
              Your consultation request has been submitted. We&apos;ll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-2 text-white">Schedule Your Transformation</DialogTitle>
              <DialogDescription className="text-center px-6 text-blue-200">
                Fill out the form below to request an AI transformation consultation with our experts.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium text-blue-200">Full Name *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your full name"
                  className="w-full rounded-lg bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300/70 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-blue-200">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300/70 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="font-medium text-blue-200">Company</Label>
                <Input 
                  id="company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="Your company name (optional)"
                  className="w-full rounded-lg bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300/70 focus:ring-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="font-medium text-blue-200">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="Your phone number (optional)"
                  className="w-full rounded-lg bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300/70 focus:ring-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="font-medium text-blue-200">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Tell us about your AI transformation needs (optional)"
                  rows={3}
                  className="w-full rounded-lg bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300/70 focus:ring-blue-400"
                />
              </div>
              
              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : 'Request Consultation'}
              </Button>
              
              <p className="text-xs text-center text-blue-200/70 mt-4">
                By submitting this form, you agree to be contacted about our AI transformation services.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 