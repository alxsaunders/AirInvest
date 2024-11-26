'use client'

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="text-gray-300">
      {description}
    </div>
  );
}
