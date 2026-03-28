import { cn, trimLink } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  type=''
}: {
  items: { title: string; description: string; link: string }[];
  className?: string;
  type?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={`${type === 'upcoming' ? (item.link) : type === 'ended' ? ('/home/previous') : (item.link)}`}
          key={item.link}
          className="relative group block p-2 h-[18rem] w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-blue-900 dark:bg-blue-800/[0.8] rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title.slice(0, 21)}{item.title.length > 21 ? '...' : ''}</CardTitle>
            <CardDescription className="pb-6">{item.description}</CardDescription>
            {type==='upcoming' && (
              <Link href={trimLink(item.link)} className="bg-blue-600">
                <div className="flex items-center justify-center border border-gray-400 h-12 text-nowrap rounded-lg mt-16 hover:text-white hover:underline underline-offset-4 transition-all">
                  <h3>Join Interview</h3>
                </div>
              </Link>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-lg h-full w-full p-4 shadow-lg shadow-black border bg-gray-800 border-gray-400  relative z-20",
      className
    )}
  >
    <div className="p-4">{children}</div>
  </div>
);

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h4
    className={cn("text-neutral-200 font-bold tracking-wide mt-2 text-2xl", className)}
  >
    {children}
  </h4>
);

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p
    className={cn(
      "mt-2 text-neutral-400 tracking-wide leading-relaxed text-sm",
      className
    )}
  >
    {children}
  </p>
);