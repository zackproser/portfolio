import Image from 'next/image';

interface BookCoverProps {
  title: string; 
  description: string;
  coverImage?: string | any;
}

export function BookCover({ title, description, coverImage }: BookCoverProps) {
  return (
    <div className="relative aspect-[3/4] w-full max-w-[500px] rounded-2xl bg-[#1e2943] p-8 shadow-2xl border-t-8 border-blue-500/20 dark:bg-[#1e2943] overflow-visible">
      {/* Book spine effect */}
      <div className="absolute inset-y-0 left-0 w-8 bg-blue-600/10 transform -translate-x-4 skew-y-12 hidden lg:block" />
      
      {/* Cover image if available */}
      {coverImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={coverImage}
            alt={`${title} background`}
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>
      )}
      
      {/* Book title and subtitle */}
      <div className="mt-6">
        <h2 className="font-display text-3xl font-semibold text-white leading-tight dark:text-white">
          {title}
        </h2>
        <p className="mt-6 text-lg text-slate-300 leading-relaxed dark:text-slate-300">
          {description}
        </p>
      </div>

      {/* Author signature */}
      <div className="absolute bottom-20 left-8 hidden lg:block">
        <p className="font-['Pacifico'] text-3xl text-slate-300 opacity-90 dark:text-slate-300">
          Zachary Proser
        </p>
      </div>
      {/* Mobile signature */}
      <div className="mt-8 mb-2 block lg:hidden">
        <p className="font-['Pacifico'] text-2xl text-slate-300 opacity-90 text-center dark:text-slate-300">
          Zachary Proser
        </p>
      </div>
    </div>
  );
}