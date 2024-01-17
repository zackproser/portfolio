import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  courseName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  courseName,
}) => (
  <div className="bg-white dark:bg-gray-800">
    <div className="max-w-md mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-1/2 w-full bg-gray-50 dark:bg-gray-900 transform translate-x-1/2" />
        </div>
        <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
          <div className="absolute inset-0">
            <img alt="People working on laptops" className="h-full w-full object-cover" src="/placeholder.svg" />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>
          <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-white">{firstName}, Class is in session</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-300 sm:max-w-3xl">
              Your {courseName} course is ready!
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4">
                <a
                  className="flex items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
                  href="#"
                >
                  Get Started
                </a>
                <a
                  className="block w-full text-center rounded-md border border-gray-300 px-4 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 sm:inline-block sm:w-auto"
                  href="#"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
